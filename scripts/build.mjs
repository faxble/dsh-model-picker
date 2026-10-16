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
    js: '/* dsh-model-picker — generated from src/ by `pnpm build`. Do not edit directly. */',
  },
})

console.log('✓ client.js rebuilt from src/')
