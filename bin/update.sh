#!/bin/sh
# Script to grab key data on GitHub organizations, their repos,
# and their contributors and export it to a JSON file.
# from --> https://github.com/geealbers/github-data


# Add your GitHub 40-charcter authentication token:

TOKEN=add-your-github-token-here


# Grab all museum user names from the data/museums.yml file

USERS=($(sed -n 's/.*-[ ]\(.*\).*/\1/p' data/museums.yml))


# Make a temporary directory to stash script working files
# will be automatically deleted at the end

mkdir bin/temp
mkdir bin/filechecks

# Loop through list of users, make call to GitHub API
# construct new JSON object with information on those users,
# and output to standalone JSON files
NOW=$(date +%F)

for i in "${USERS[@]}"
do

  curl -H 'Authorization: token '$TOKEN'' "https://api.github.com/users/$i" | jq '. | {
    owner_name: .login,
    public_repos: .public_repos,
    owner_created: (.created_at | fromdateiso8601 | strftime("%Y") ),
    owner_updated: (.updated_at | fromdateiso8601 | strftime("%Y") ) }' >> bin/temp/OWNERS.txt
  jq -s '[ .[] ]' bin/temp/OWNERS.txt | tee data/museums.json data/archive/museums-$NOW.json

done

# Loop through list of users, make call to GitHub API
# construct new JSON object with the needed information,
# and save to tempoarary file

# NEED FIX: Currently only gets the first page of results
# with 100 repositories so the data on any org with more
# repositories than that is incomplete

for i in "${USERS[@]}"
do

  curl -H 'Authorization: token '$TOKEN'' "https://api.github.com/users/$i/repos?per_page=100" | jq '.[] | {
    name_full: .full_name,
    name: .name,
    url: .html_url,
    description: .description,
    type: (if .fork == true then "Fork" else "Original" end),
    date_created: (.created_at | fromdateiso8601 | strftime("%Y-%m-%d") ),
    date_pushed: (.pushed_at | fromdateiso8601 | strftime("%Y-%m-%d") ),
    size_kb: .size,
    size_span: (
        if (.size/1000) < 1 then "0-1 MB"
      elif (.size/1000) < 10 then "1-10 MB"
      elif (.size/1000) < 100 then "10-100 MB"
      elif (.size/1000) < 1000 then "100-1000 MB"
      else "1000+ MB" end),
    stars: .stargazers_count,
    language: .language,
    forks: .forks_count,
    license: (if .license.name then .license.name else .license end),
    owner_name: .owner.login,
    owner_url: .owner.html_url }' >> bin/temp/REPOS.txt

done


# The sections below follow the same pattern:
#
# 1. Create a temporary file with variable array
# of repository names generated in the step above
#
# 2. Loop through that array, make call to GitHub API
# for information, and create new array of objects


# Get contributor names and contribution counts
# for all museum repositories

echo "REPO_NAMES=(" >> bin/temp/REPO_NAMES.txt

cat bin/temp/REPOS.txt | jq --slurp ".[] | if .name_full == null then null else .name_full end" >> bin/temp/REPO_NAMES.txt

echo ")" >> bin/temp/REPO_NAMES.txt

source bin/temp/REPO_NAMES.txt

for i in "${REPO_NAMES[@]}"
do

  curl -H 'Authorization: token '$TOKEN'' "https://api.github.com/repos/$i/contributors" | jq --arg repo "$i" '{
    name_full: $repo,
    contributor_count: (length),
    contributor: [.[] | {name: .login, contributions: .contributions}]}' >> bin/temp/NAMES.txt

done


# Script to check GitHub repos for a key file like CONTRIBUTING.md
# and if present in the repo, to add the repo name to a text list.
# Can be modified and repeated for other files like LICENSE.md,
# CODE_OF_CONDUCT.md and SUPPORT.md
for i in "${REPO_NAMES[@]}"

do

  x=$(curl https://raw.githubusercontent.com/$i/master/CONTRIBUTING.md)

  if [ "$x" != "404: Not Found" ]
  then 
  echo "$i" >> bin/filechecks/HAS_CONTRIBUTING.md
  fi

done


# Get the parent information for any museum
# repository identified as a Fork

echo "REPO_FORKS=(" >> bin/temp/REPO_FORKS.txt

cat bin/temp/REPOS.txt | jq --slurp ".[] | if .type == \"Fork\" then .name_full else empty end" >> bin/temp/REPO_FORKS.txt

echo ")" >> bin/temp/REPO_FORKS.txt

source bin/temp/REPO_FORKS.txt

for i in "${REPO_FORKS[@]}"
do

  curl -H 'Authorization: token '$TOKEN'' "https://api.github.com/repos/$i" | jq --arg repo "$i" '{
    name_full: $repo,
    parent: .parent.full_name,
    parent_name: .parent.owner.login }' >> bin/temp/FORKS.txt

done


# Combine two resulting json texts from above (REPOS and PEOPLE),
# group into arrays by repository name, and output a JSON file
# with a timestamp.

NOW=$(date +%F)

jq --slurp --sort-keys '[group_by(.name_full) | .[] | add ]' bin/temp/NAMES.txt bin/temp/REPOS.txt bin/temp/FORKS.txt | tee data/github.json data/archive/github-$NOW.json

sed -i -e 's/dataUpdated\:.*/dataUpdated: '$NOW'/g' config.yml
rm -r config.yml-e
# NEED FIX: I can’t get the sed command above to work like it’s supposed to
# without creating a duplicate config.yml-e file
# https://unix.stackexchange.com/questions/159367/using-sed-to-find-and-replace

echo "There are ${#USERS[@]} museums with GitHub accounts."

echo "A JSON file with all their public repository’s information has been created, and a dated copy has been added to the data/archive file."


# Remove all temporary files

rm -r bin/temp
