# ma-coding-league-website

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-blue?logo=vercel)](https://ma-coding-league.vercel.app/)
[![Uptime](https://img.shields.io/uptimerobot/ratio/m796228539-bd51714b7741f220d84958c6?label=Uptime)](https://stats.uptimerobot.com/6qGRKCVxXx)
[![Lint](https://github.com/ma-coding-league/ma-coding-league-website/actions/workflows/eslint.yml/badge.svg)](https://github.com/ma-coding-league/ma-coding-league-website/actions/workflows/eslint.yml)
[![Format](https://github.com/ma-coding-league/ma-coding-league-website/actions/workflows/prettier.yml/badge.svg)](https://github.com/ma-coding-league/ma-coding-league-website/actions/workflows/prettier.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/ma-coding-league/ma-coding-league-website/badge)](https://www.codefactor.io/repository/github/ma-coding-league/ma-coding-league-website)
[![Contribute with Gitpod](https://img.shields.io/badge/Contribute%20with-Gitpod-908a85?logo=gitpod)](https://gitpod.io/#https://github.com/ma-coding-league/ma-coding-league-website)

This is the source code for the Massachusetts Coding League website!

## Install

1. Have `nodejs`.
2. Clone this repo.
3. `yarn` to install dependencies.
4. Have `@xata.io/cli@latest`.
5. `xata init`. 
6. Pull database types from Xata with `xata pull [BRANCH]`
7. Copy [`.env.sample`](/.env.sample) to `.env.local` and fill out environment variables.

## Development

Use `yarn run dev` to start a development server.

Pull database types from Xata with `xata pull [BRANCH]`.

Before commit, make sure to format, (`yarn run format` / `yarn run writeFormat`)
lint, (`yarn run lint` / `yarn run writeLint`) and type-check. (`yarn run typecheck`)

## Build and serve

`yarn run build` and `yarn run start`.

The Massachusetts Coding League website is currently deployed on Vercel at [https://ma-coding-league.vercel.app/](https://ma-coding-league.vercel.app/).
