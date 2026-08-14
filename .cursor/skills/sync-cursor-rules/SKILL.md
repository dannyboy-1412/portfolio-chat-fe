---
name: sync-cursor-rules
description: >-
  Sync and update project Cursor rules in .cursor/rules when shipping large
  features, redesigns, architecture or API contract changes, or when rules
  reference deleted/renamed files. Use when finishing a feature PR, before
  merge, after app-shell or layout changes, or when the user mentions Cursor
  rules, AGENTS.md, or keeping rules up to date.
---

# Sync Cursor rules

Update `.cursor/rules/` so agents do not follow obsolete layout, paths, or contracts.

## When to run

Run before marking a large change done or opening/updating its PR if any trigger matches:

- App shell / page composition changed
- Canonical UI or hook files added, renamed, or removed
- Shared modules or API client conventions changed
- Backend route or streaming contract changed
- Stack defaults changed (framework major, auth, data store)

Skip for small bugfixes, copy edits, and pure visual polish.

## Workflow

Copy and track:

```
Rules sync:
- [ ] Diff the feature vs main; list structural changes
- [ ] Map changes to rule files (below)
- [ ] Edit stale paths, layout, guardrails, invariants
- [ ] Avoid duplicate alwaysApply rules that restate the same facts
- [ ] Commit rules with the feature (same PR)
- [ ] Check PR template "Cursor rules updated" item
```

## File map (portfolio-fe)

| Change area | Update |
|-------------|--------|
| Product purpose, stack, folders, guardrails | `.cursor/rules/project-overview.mdc` |
| App Router UI, chat UX, profile content, resume | `.cursor/rules/nextjs-react-ui.mdc` |
| Browser API helpers, endpoints, streaming parse | `.cursor/rules/shared-api-client.mdc` |
| Route Handlers, OpenRouter, Mongo, env | `.cursor/rules/v2-migration.mdc` |
| Meta policy for shipping + rules | `.cursor/rules/keep-rules-in-sync.mdc` |
| Vitest layout and test conventions | `.cursor/rules/vitest-tests.mdc` |

## Edit standards

- Frontmatter: accurate `description`; `alwaysApply: true` only for repo-wide policy/product context
- Globs for file-scoped guidance (`src/app/**`, `src/shared/**`, etc.)
- Concrete paths with `@src/...` style used elsewhere in this repo
- Remove references to deleted files; add new canonical entry points
- Keep each rule focused and under ~50–80 lines when practical

## Done criteria

- No rule still names removed files or the old chat-overlay-only shell
- New conventions agents must follow appear in the matching rule
- Rules commit is on the feature branch / PR
