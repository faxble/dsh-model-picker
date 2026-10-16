/**
 * dsh-model-picker — Host half (no-op).
 *
 * This plugin is browser-surface only: it augments the composer's model
 * selector with a quick-pick button + full model dialog. The Host row exists
 * solely so the bundle has a row whose `name` is the bare package name, which
 * is what the browser half (declared by package.json `dsh.client`) binds to.
 * No Host services are required, so `inject` stays empty and `apply` does
 * nothing.
 */

export const name = 'dsh-model-picker'

export const inject = []

export function apply() {
  // Browser half only — nothing to do on the Host side.
}
