# Portfolio verification map

Read this index, then the feature file for the behavior you need to prove.

## Baseline preconditions

- Dev server you started. Default `VERIFY_URL` is `http://localhost:3017/`.
- `VERIFY_URL` includes a trailing slash. Production preview still uses `/portfolio-fe/`.
- `node .cursor/skills/verify-portfolio/scripts/doctor.mjs` exits 0.
- Drive with `cursor-ide-browser`.
- Never drive an instance you did not launch.

## Driving conventions

- Start from `/` (under the base path) unless the feature file says otherwise.
- Capture an ARIA snapshot and a screenshot at the proving moment.

## Features

- [Home page](./home.md) is the scrollable editorial site.
- [Project detail](./project-detail.md) is `/projects/<slug>`.
