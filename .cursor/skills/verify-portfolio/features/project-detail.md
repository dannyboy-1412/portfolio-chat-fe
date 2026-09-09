# Project detail

Each project in `PROJECTS` has a client-rendered page at `/projects/<slug>` with case-study copy.

## Sub-features

- `detail-render` shows name, tagline, and body sections for a known slug.
- `detail-back` returns to `/#projects` for personal projects and `/#experience` for work projects.

## How to get to it (user POV)

- From the home projects grid, choose a personal project name.
- From a role's Details, choose a work project.
- Open `/projects/portfolio` or `/projects/salary-stream` directly (under the site base path).

## Driving it with cursor-ide-browser

Preconditions:

- Doctor is green.
- `VERIFY_URL/projects/portfolio` returns 200.

- **Open.** `browser_navigate` to `VERIFY_URL/projects/portfolio`. The heading `Portfolio` and tagline `Editorial personal site` are present. There is no `Ask Daniel about this project` control.
- **Back.** Choose `Back to projects`. The home projects section is visible.
- **Work slug.** Open `VERIFY_URL/projects/dociq`. `Back to experience` is present.
- **Proof.** Snapshot the detail page showing the heading and back link.

## Gotchas

- A missing slug is an in-app not-found view, not a Next `notFound()`.
- Stay on slugs from `PROJECTS`.
