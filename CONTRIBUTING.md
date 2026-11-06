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

## Global scope discipline (read before touching `src/`)

DSH loads `client.js` as a **classic script**, not an ES module. The build wraps
the whole bundle in an IIFE (see `scripts/build.mjs` banner/footer) so esbuild's
hoisted module-level bindings don't land on `window`, and a build-time assertion
fails if any top-level declaration ever escapes the IIFE.

Two rules on top of that:

1. **Module-level exports must avoid browser global names.** Even inside the
   IIFE, a module-level binding named after a browser global is one refactor
   away from breaking something. Known offender set: `CSS`, `name`, `status`,
   `length`, `top`, `self`, `parent`, `location`, `history`, `screen`, `event`,
   `origin`, `close`, `open`, `focus`, `blur`, `find`, `stop`, `print`.
   (v1.0.0 shipped `export const CSS` — it overwrote `window.CSS` with the
   style string and broke every host popover on DSH 0.2.2-rc.1.)
2. **Keep module-level identifiers prefix-scoped** (`PICKER_*`, `STORAGE_KEY`,
   …) so accidental collisions with the DOM or other plugins stay unlikely.

`test/bundle.test.js` runs the built `client.js` as a classic script in an
isolated `vm` and asserts `window.CSS.supports` survives — keep it green.

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
