import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

// ── regression: classic-script global pollution ─────────────────────────────
// DSH executes each plugin's client.js as a CLASSIC script (not a module), so
// any top-level `var` in the bundle is assigned on `window`. In v1.0.0 the
// esbuild-hoisted `var CSS` overwrote window.CSS with the style string, and
// DSH 0.2.2-rc.1's useAnchoredPosition (which calls CSS.supports()) threw on
// every popover click. The bundle is now wrapped in an IIFE; this test runs it
// as a classic script in an isolated VM and asserts window.CSS survives.
test('client.js as classic script does not clobber window.CSS', () => {
  const code = readFileSync(new URL('../client.js', import.meta.url), 'utf8')

  // A faithful stand-in for the browser's global CSS interface.
  const css = {
    supports: (...args) => false,
    escape: (s) => s,
  }

  let loaded = null
  const sandbox = {
    CSS: css,
    console,
    window: null, // set below to sandbox itself, like a real browser window === globalThis
    __ModuleLoader__: {
      load: (entry) => { loaded = entry },
    },
  }
  sandbox.window = sandbox
  sandbox.globalThis = sandbox
  vm.createContext(sandbox)

  // Run exactly as DSH does: plain script evaluation, no module wrapper.
  vm.runInContext(code, sandbox, { filename: 'client.js' })

  // window.CSS must still be the CSS interface, not the style string.
  assert.equal(typeof sandbox.CSS, 'object')
  assert.equal(typeof sandbox.CSS.supports, 'function', 'CSS.supports must survive')

  // The bundle must still register with the module loader (IIFE runs synchronously).
  assert.ok(loaded, 'bundle must call window.__ModuleLoader__.load')
  assert.equal(loaded.id, '@faxble/dsh-model-picker')

  // Internal identifiers must not leak onto the global object.
  for (const name of ['zh', 'en', 'PICKER_CSS', 'IconGrid', 'STORAGE_KEY']) {
    assert.ok(!(name in sandbox), `${name} must not leak onto window`)
  }
})
