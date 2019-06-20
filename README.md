# [Nerd Notes](https://nerdnotes.davidvassallo.me)

[https://nerdnotes.davidvassallo.me](https://nerdnotes.davidvassallo.me)

A collection of notes: things I'd like to remember while reading technical articles, technical questions I couldn't answer, and so on.

## Why?

Throughout my career, I've always found it extremely useful to keep notes. This lead to a [blog](https://blog.davidvassallo.me), and an untold number of post-its with much smaller nuggets of information. Usually these post-its would be small one-liners, or small notes which I use as a prompt to recall a particular piece of information, or a link to a particularly good article. 

The post-its multiplied and soon became unweildy. This in turn led to me not returning to read them... which lead to a "notebook upgrade". Definitely less unweildy, but not very portable, plus... difficult to share and let others collaborate (see the 'Submitting your own "Nerd Notes"' section below). 

Hence the idea of a github repo containing these notes was born, but with a nice frontend around it to make it more appealing and give me more practice with frontend tech

## How?

The main drivers in my choice of (slightly unusual) architecture was two things:

1. I wanted to make this project as low-cost as possible... free ideally
2. I wanted other people to be able to submit their own notes, and react to other notes by "liking" or voting for notes they found particularly useful

In both aspects, github fit the bill perfectly in that it is free, allows you to serve content via a modern GraphQL API, and most importantly, has a social aspect in the form of "issues". So, the react frontend uses GraphQL to query this repo for any "issues". The issues in reality are the notes, with labels that help place them in categories, and reactions that allow other users to vote for useful notes. Right now, only "heart" reactions are supported.

## Submitting your own "Nerd Notes"

Simply create a new "issue" in this repopsitory, and remember to:

- Select an appropriate label. If possible, avoid creating new labels to avoid an explosion of categories in the frontend
- Choose a relevant title, and body. Keep both short... imagine you're writing a tweet and have limited characters available. 
- If you need to include more information, include a hyperlink (markdown is supported on the frontend), or comment on your issue to include more details

## 'Upvoting' or 'liking' a Nerd Note

1. Click on the hyperlink icon at the bottom right of the nerd note
2. In the resulting github page that opens, click on the reaction button (+😃) at the right of the issue title and click on the heart reaction (❤)

![upvoting](https://github.com/dvas0004/NerdNotes/blob/master/public/img/heart_react.gif?raw=true)

## Tech Used

- Frontend
  - ReactJS (hooks and functional style used as much as possible)
- Backend
  - Content hosted on github issues, served via GraphQL
  - Netlify used for hosting

## To Do

- Search function
- Make Available Offline
- Right now, any submissions are displayed on the frontend. Right now that's ok, but in the future some sort of content moderation might be needed so this should be changed in that only a subset of trusted authors/assignees are displayed