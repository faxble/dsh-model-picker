#!/usr/bin/env node
/**
 * Build the ModuleLoader bundle: bundle src/entry.js into the single-file
 * client.js that DSH loads. Keeps `react` / `react-dom` external (the shell
 * provides them at runtime). Output stays a `window.__ModuleLoader__.load`
 * contract, so the plugin works with zero runtime build step.
 */
import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

await build({
  entryPoints: [resolve(root, 'src/entry.js')],
  outfile: resolve(root, 'client.js'),
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  target: ['es2020'],
  legalComments: 'inline',
  logLevel: 'info',
  banner: {
    js: '/* dsh-model-picker — generated from src/ by `pnpm build`. Do not edit directly. */\n' +
      '/* Function scope on purpose: DSH executes this bundle as a CLASSIC script,\n' +
      '   so esbuild\'s hoisted module-level `var` bindings would otherwise be\n' +
      '   assigned on `window`. A top-level `var CSS` overwrote window.CSS with the\n' +
      '   style string and made every host popover throw in CSS.supports(). */\n' +
      ';(() => {',
  },
  footer: {
    js: '})();',
  },
})

// --- Build-time guard: nothing may escape the IIFE ---
// DSH executes client.js as a classic script, so any module-level binding that
// esbuild hoists to the top of the file would land on `window`. The banner/footer
// above wrap the whole bundle in an IIFE on purpose; this check fails the build
// if a future refactor ever introduces a top-level declaration outside it.
import { readFileSync } from 'node:fs'

const text = readFileSync(resolve(root, 'client.js'), 'utf8')
const lines = text.split('\n')

// The closing `})();` is appended by esbuild's `footer`, so it must be the
// last non-empty line of the file. Anything else means banner/footer drifted.
let lastReal = ''
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].trim() !== '') {
    lastReal = lines[i].trim()
    break
  }
}
if (lastReal !== '})();') {
  console.error('✗ bundle does not end with the IIFE closing `})();` — check the banner/footer in scripts/build.mjs')
  process.exit(1)
}

let inIife = false
let inBlockComment = false
const offenders = []
for (const [i, line] of lines.entries()) {
  // Skip multi-line block comments (the banner) so their prose is not scanned.
  if (!inBlockComment && line.trim().startsWith('/*')) inBlockComment = true
  if (inBlockComment && line.includes('*/')) inBlockComment = false
  if (inBlockComment) continue

  const t = line.trim()
  const atTopLevel = line[0] !== ' ' && line[0] !== '\t' // column 1 only
  if (atTopLevel && t.startsWith(';(() => {')) {
    inIife = true
    continue
  }
  if (!inIife && atTopLevel && !t.startsWith('//') && /^(var|let|const|function|class)\s+/.test(t)) {
    offenders.push(`${i + 1}: ${t}`)
  }
}
if (offenders.length > 0) {
  console.error('✗ bundle escapes function scope — these top-level declarations would leak onto window:')
  for (const o of offenders) console.error('  ' + o)
  process.exit(1)
}
console.log('✓ bundle fully enclosed in function scope (no top-level declarations)')
console.log('✓ client.js rebuilt from src/')
