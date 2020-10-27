# Mapping Open Source in Museums

**See the site!** 💘💫🦄 --> https://geealbers.github.io/mapping-open-source/

Welcome to the *Mapping Open Source in Museums* project. This is an effort to understand the use and creation of open source code within the museum community. The project focuses specifically on exploring code written by museums and used by other museums, rather than on museums’ use of other open source projects. The visualizations and data shown on this site are pulled from GitHub’s API based on [a running list](data/orgs.yml) of identified museum GitHub accounts. For now, the accounts are limited strictly to those connected directly to a museum, though in the future should be expanded to include external vendors and firms who do work on behalf of museums.

This project was sparked by [a brief Twitter conversation](https://twitter.com/danamuses/status/987411673496498177) in the spring of 2018, and is built in the footsteps of MuseTech Central ([original web version](https://web.archive.org/web/20121130230106/http://musetechcentral.org/), and [GitHub reincarnation](https://github.com/MuseCompNet/muse-tech-central/)), and [Museums on GitHub](https://github.com/Ambrosiani/museums-on-github). This site itself is built on [Hugo](https://github.com/gohugoio/hugo), and uses [D3](https://github.com/d3/d3) for many of the visualizations.

## Using this Repo

1. Clone the repo to your computer
2. Download the Hugo ([v0.53.0](https://github.com/gohugoio/hugo/releases/tag/v0.53)) and jq ([v1.6](https://stedolan.github.io/jq/download/)) binaries for Mac and add them to your `/usr/local/bin` folder
3. Create a [GitUb Personal Access Token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) and add it to line 9 of `bin/update.sh`
4. Add any new museums to the list in `data/orgs.yml`
5. Run `bin/update.sh` (this takes awhile)
6. Run `hugo serve` to see the site preview at http://localhost:1313/mapping-open-source/

### Special Instructions for the Bar Chart Page

Some aspects of the bar chart info will also have to be manually updated as it’s been hard-coded in.

In `themes/mapping/layouts/data/barchart.html` you will need to update the years and year count at the bottom of the file. Open `data/owners.json` and do a search for each year in the format shown below, starting with 2009 and going to the present year. Update the counts in `barchart.html` with the number of results the search yields.

```
"owner_created": "2009"
```

Second, in `themes/mapping/static/js/barchart.js` you will need to update the list of owners/organizations on line 110. It should be alphabetical, and not include any owners with zero (0) public repositories. The easiest way is to convert `data/owners.json` to CSV, sort by number of repos and delete all the ones with 0. Then sort alphabetically by name. You can then concatenate the resulting list of names to be quoted and comma separated, like:

```
"ACMILabs", "ACMTX", "AdlerPlanetarium", "africart", "american-art", "amnh", "art-institute-of-chicago" ...
```

### Using this Repo as the Basis of Your Own Project

This repo could also be used to visualize and present other groups of GitHub users or organizations. You can update the list at `data/orgs.yml` to include any type of account from any sector you would like. You can organize them with different categories, as we’ve used countries here, or no categories at all. (The categories will show up on the home page of the project.)

Also then update the Markdwon-formatted text in `content/_index.md` for your homepage, and the title and URL for your site in `config.yml`.

To publish the site, if you host the repo on GitHub, you can use the `bin/deploy.sh` script to publish to GitHub Pages. You may need to first manually allow for GitHub Pages in the Settings for your repository on github.com. And if you do use GitHub, be sure never to commit your GitUb Personal Access Token used in the `bin/update.sh` script as noted in step 3 of the instructions above.

## Sections to come ...

- Add to the list of museums
- Help make this site better
- License


