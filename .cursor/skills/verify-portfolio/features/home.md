# Home page

The scrollable site is the editorial interface. Sections are hero, experience, personal projects, skills, about, outside work, and contact.

## Sub-features

- `home-nav` jumps to in-page sections from the navbar.
- `home-experience` lists roles with Details that expand.
- `home-projects` lists personal projects only, linking to `/projects/<slug>`.

## How to get to it (user POV)

- Open `/` under the site base path.
- Choose Experience, Projects, About, or Contact in the navbar.

## Driving it with cursor-ide-browser

Preconditions:

- Doctor is green.
- Start at `VERIFY_URL`.

- **Land.** `browser_navigate` to `VERIFY_URL`. The heading `I build useful software.` is present. Navbar has no `Open terminal` control and no `Ask Daniel` control.
- **Experience.** The heading `Where I've worked` is present. An INFRRD row exposes `Details`. There is no `Ask Daniel` on the row.
- **Projects.** The heading `What I build outside work` is present. A `Portfolio` link goes to `/projects/portfolio`. Work projects do not appear as cards here.
- **Proof.** Snapshot `/` showing those headings and no terminal button.

## Gotchas

- Work case studies live under Experience Details, not in the personal projects grid.
