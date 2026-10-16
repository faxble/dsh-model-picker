# Contributing

## Development

The plugin's client bundle is split across `src/` (ES modules) and compiled
into the single-file `client.js` that DSH actually loads.

```sh
pnpm install          # installs esbuild (dev-only)
pnpm build            # rebuild client.js from src/
pnpm test             # unit tests for src/pure.js (node:test)
pnpm check            # syntax-check the built bundle
```

**Always** run `pnpm build` after editing `src/` and commit the regenerated
`client.js` — CI fails if the committed bundle is stale.

## Commit messages

Follow Conventional Commits (template in `.gitmessage`):

```
feat(core): add MRU recent-models section
fix(accessibility): trap Tab focus inside the dialog
```

Types: `feat` `fix` `docs` `refactor` `perf` `test` `ci` `chore`
Scopes: `core` (client bundle) `build` `docs` `ci` `test`

## Structure

```
src/dict.js    # zh/en copy dictionaries
src/pure.js    # pure logic (no React/DOM) — unit-tested
src/style.js   # CSS (theme tokens)
src/icons.js   # inline SVG icon components
src/entry.js   # ModuleLoader bundle entry (React component + apply)
scripts/build.mjs  # esbuild bundler
test/pure.test.js  # node:test unit tests
```
