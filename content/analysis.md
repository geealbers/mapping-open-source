---
title: Bar Chart
type: page
date: 2018-10-29
author: Greg Albers
---

Welcome to the *Mapping Open Source in Museums* project. This is an effort to understand the use and creation of open source code within the museum community. The project focuses specifically on exploring code written by museums and used by other museums, rather than on museums’s use on other open source projects. We also focus much of the study on sharing done on GitHub, as the most dominant open source platform. The analysis shared here comes from data pulled from GitHub’s API, and a survey distributed to the community.

## Anybody Out There? (Bar chart)

During Museums and the Web 2018, [a brief Twitter conversation](https://twitter.com/danamuses/status/987411673496498177) became the impetus for this project. And in that context it was really about understanding the contributions individuals and institutions make to the field beyond the confines of their own work. To paraphrase:

@danamuses
: Who else deserves claps for being generous to the #musetech field? 👏🏻👏🏽👏🏾

@dhegley
: Everyone on this list of museums working in open source!
 [github.com/Ambrosiani/museums-on-github](https://github.com/Ambrosiani/museums-on-github)

@danamuses
: Great! I'd love to know if anyone is digging into how museums are using and adapting each other's code

@geealbers
: Yes, a project to map open source usage in the sector could be really interesting. I might undertake it for #MCN2018 🤔

@AronAmbrosiani
: I’d love to help

And so here we are.

The list Douglas mentioned was started by Nate Solas in 2013. In his second commit to the project Nate added the first three institutions, and wrote:

> This is simply a list of organizations active on github along with a list of "featured projects" hopefully of interest to the broader community. It will attempt to be a more open replacement for the lost MuseTechCentral resource. [^1]

After a few more additions, there were 12 institutions listed in that first year, but it was largely quiet after that. Sometime later, Aron Ambrosiani forked the list and updated it, and by 2016 there were 67 institutions listed on his version. Finally, over the last several months we’ve updated it again, and there are now 127 institutions. A dramatic rise over five years.

Of course, these numbers are only indicative of what museums happened to have been found and added to the list in a few bursts of individual activity over the last five years. Not necessarily when they actually joined GitHub. When we chart out those actual dates, the picture is less about constant growth, and instead suggests a kind of market saturation. There was an increasing number of museums joining GitHub every year from 2010 to 2015, but the annual increase since then has been on the decline.

[[ INSERT IMAGE: Bar chart of museums joining by year ]]

Even if fewer new museums are joining GitHub, the overall number of repositories being created continues to grow.[^2] More than 300 new repositories were created in 2017 alone, and in total there are 1600 public repositories from museums on GitHub currently. A small survey of museum open source contributors indicates this trend will continue into the future. 76.2% of respondents to that survey expected their releases of code to increase in the future, with 23.8% expecting it to stay the same. No one thought they’d release less.

[[ INSERT IMAGE: Stacked bar chart of repos created by year ]]

## So, what are all these repositories? (Table & Pie chart)

- What language they're written in
- Keyword searches
- Forks vs. original
- Update dates (active / inactive )
- Some favorite gems
- A closer look at the top 20 (stars/forks)

## So, there's a lot there! WHhat about using it?

- Until now, there was no central place to discover museum-created open source projects.
- 24 Forks
- Evidence of sharign via contirbutor
- Direct downloads, or projects used in code not then hosted in GitHub are not included
- Survey indicates we have a few specific things we use to evaluate projects
- Annecdotally there were other things in evaluation

## What's the impact? (Network graph)

In her oroginal tweet, Dana asked about the impact, but not sure we can tell




## Notes

[^1]: MuseTechCentral was a MCN’s project registry, “a place for the MCN community to share information about technology-related museum projects”. It was launched in 2008 but went offline sometime in late 2012 or early 2013. [The last Wayback Machine capture](https://web.archive.org/web/20121130230106/http://musetechcentral.org/) was on November 30, 2012. It seems to have had at least 100 projects listed, but there’s no longer anyway to access the list beyond the first captured page of results.

[^2]: The one exception so far is 2018. While still a couple months from being over, 2018 looks to have dramatically fewer new museums joinging GitHub, and fewer new repositories being created. It will be interesting to see how this plays out over the next few months and years. Will 2018 catch up to other years? Is it a blip on the radar? Does it indicate a new downward trend? For repositories at least, the lower numbers may also be in part because developers are starting projects as private repositories before making them public. In which case we should see increased public repos in 2018, even well after the year end has passed, as developers make those proivate repos public.
