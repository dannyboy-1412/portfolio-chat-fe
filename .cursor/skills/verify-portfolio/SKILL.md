---
name: verify-portfolio
description: Drive Daniel Rodrigues's Vite portfolio in a real browser. Use when proving UI, home sections, or project detail pages.
---

# Verify portfolio

Agent-facing. Drive the running site the way a visitor does.

## Launch

From the repo root, start a dedicated Vite server on a free port so you do not steal a session you did not start:

```bash
npx vite --port 3017
```

Ready when stdout contains `Local:` and a URL, or when `GET http://localhost:3017/` returns 200. Dev `base` is `/`. Set `VERIFY_URL` to that origin with a trailing slash. Use `localhost`, not `127.0.0.1`, on Windows if Vite bound to IPv6.

```bash
VERIFY_URL=http://localhost:3017/
```

Record the PID of the process you started.

Teardown is Cleanup below.

If port 3017 is busy, pick another port and set `VERIFY_URL` to match. Do not attach to an unknown process already bound to 5173.

## Doctor

Read-only. Run before driving, and again if anything looks off:

```bash
VERIFY_URL=http://localhost:3017/ node .cursor/skills/verify-portfolio/scripts/doctor.mjs
```

Expect exit `0` and JSON with `"ok": true`. Failure means the instance is not this app or is not up. Do not drive it.

## Drive

Harness: Cursor `cursor-ide-browser` MCP (`browser_navigate`, `browser_lock`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_press_key`, `browser_cdp`).

Stable handles:

- Mobile menu: button `Open menu` / `Close menu`
- Navbar section links: Experience, Projects, About, Contact
- Routes: `/` (under the base path), `/projects/portfolio`, `/projects/salary-stream`, `/projects/dociq`

Prefer `browser_click` on the latest snapshot ref.

Lock the tab before a long drive. Unlock when finished.

Read `.cursor/skills/verify-portfolio/features/README.md` and the matching feature file. Drive every entry point the file lists, or report the skipped one as unverified.

## Evidence

Write artifacts under `.cursor/skills/verify-portfolio/artifacts/<run-id>/`. Keep that directory after cleanup.

Proof is the user action plus the resulting state:

1. ARIA snapshot (`browser_snapshot`) showing the page control you used
2. Screenshot of the same moment (`browser_take_screenshot`, filename under the artifacts dir)

Do not treat “it compiled” or a unit-test pass as UI proof.

## Cleanup

Kill the Vite PID you started, not by image name. Confirm the port no longer answers. Leave `.cursor/skills/verify-portfolio/artifacts/` in place.

## Helpers

- Doctor: `VERIFY_URL=http://localhost:3017/ node .cursor/skills/verify-portfolio/scripts/doctor.mjs`
