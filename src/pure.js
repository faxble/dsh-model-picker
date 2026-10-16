/**
 * Pure logic for dsh-model-picker — no React, no DOM, no DSH runtime imports.
 * Kept dependency-free so it can be unit-tested with plain `node --test`.
 */

/** Provider display order: account and official first, others keep catalog order. */
export function orderGroups(groups) {
  const seen = new Set()
  const unique = groups.filter(group => {
    if (seen.has(group.id)) return false
    seen.add(group.id)
    return true
  })
  return unique.sort((left, right) => {
    const rank = id => id === 'deepseek-account' ? 0 : id === 'deepseek-official' ? 1 : 2
    return rank(left.id) - rank(right.id)
  })
}

export function providerLabel(group, t) {
  return group.id === 'deepseek-account' ? t('provider.account') : (group.name || group.id)
}

/** Stable snapshot used while the session's directory is unavailable. */
export const EMPTY_STATE = Object.freeze({ current: null, routable: null, groups: [], failures: [], status: 'idle', pending: null, error: null })

/**
 * Real per-model input modalities straight from the user's own settings
 * document (the `llm-pi-ai` provider `input` lists, e.g.
 * `providers.volcengine-agent-plan.models[].input: [text, image]`), read
 * through the existing `settings` Remote — never guessed from description
 * text and no reliance on catalog/discovery internals.
 *
 * Every namespace is scanned for a `providers` map whose profiles carry
 * model `input` arrays. Returns providerId -> modelId -> ['text', 'image'];
 * an unavailable Remote or unexpected shape simply yields no chips.
 *
 * Note: the resulting map is keyed by the *provider config key* (e.g.
 * `volcengine-agent-plan`), which the Host catalog also uses as its group id
 * (verified against DSH's modelCatalog/ACP sources), so lookups with
 * `group.id` match reliably.
 */
export async function loadInputModalities(settings) {
  const map = {}
  if (settings === undefined || typeof settings.describe !== 'function') return map
  try {
    const describe = await settings.describe()
    if (!describe.ok) return map
    for (const ns of describe.value.namespaces) {
      const providers = ns.value?.providers
      if (providers === null || typeof providers !== 'object' || Array.isArray(providers)) continue
      for (const [providerId, profile] of Object.entries(providers)) {
        if (profile === null || typeof profile !== 'object' || Array.isArray(profile)) continue
        const models = profile.models
        if (!Array.isArray(models)) continue
        const perModel = {}
        for (const model of models) {
          if (model !== null && typeof model === 'object'
            && typeof model.id === 'string'
            && Array.isArray(model.input) && model.input.length > 0) {
            perModel[model.id] = [...model.input]
          }
        }
        if (Object.keys(perModel).length > 0) map[providerId] = perModel
      }
    }
  } catch {
    // Remote unavailable; the picker still works, just without capability chips.
  }
  return map
}

/** Capability chips for one model from the Host-declared input modalities. */
export function tagsFor(model, group, inputMap, L) {
  const mods = inputMap !== null ? inputMap?.[group.id]?.[model.id] : undefined
  if (mods === undefined || mods.length === 0) return []
  const tags = []
  if (mods.includes('text')) tags.push({ key: 'text', label: L('tag.text') })
  if (mods.includes('image')) tags.push({ key: 'image', label: L('tag.image') })
  return tags
}

/** Fill a template string: 'a {x} b' with {x: 'v'}. */
export function fill(template, params) {
  return template.replace(/\{(\w+)\}/g, (_, key) => (params[key] === undefined ? '' : String(params[key])))
}

/** Case-insensitive substring match on model name (and provider id/name). */
export function matches(model, group, query) {
  const q = query.trim().toLowerCase()
  if (q === '') return true
  if (model.name.toLowerCase().includes(q)) return true
  if (model.id.toLowerCase().includes(q)) return true
  if (group.id.toLowerCase().includes(q)) return true
  return group.name?.toLowerCase().includes(q) ?? false
}

/**
 * P3-14: rank matching rows so better matches float to the top.
 * Exact name/id hit beats prefix beats substring; case-insensitive.
 * Returns a sort score (higher = better). Non-matching rows are excluded.
 */
export function searchScore(model, group, query) {
  const q = query.trim().toLowerCase()
  if (q === '') return 1 // no query: keep catalog order
  const name = model.name.toLowerCase()
  const id = model.id.toLowerCase()
  const gid = group.id.toLowerCase()
  if (name === q || id === q) return 6
  if (name.startsWith(q) || id.startsWith(q)) return 5
  if (name.includes(q) || id.includes(q)) return 4
  if (gid === q) return 3
  if (gid.includes(q) || group.name?.toLowerCase().includes(q)) return 2
  return 0
}

/**
 * P3-14: filter + rank rows in one pass. Returns rows sorted by score desc,
 * stable for equal scores (catalog order preserved via index tiebreak).
 */
export function searchRows(groups, providerFilter, query) {
  const q = query.trim()
  const rows = []
  for (const group of groups) {
    if (providerFilter !== 'all' && group.id !== providerFilter) continue
    for (const model of group.models) {
      const score = searchScore(model, group, q)
      if (score <= 0) continue
      rows.push({ group, model, score })
    }
  }
  rows.sort((a, b) => b.score - a.score)
  return rows
}

/**
 * P3-13: MRU (most recently used) model keys, persisted in localStorage.
 * Each entry is `${provider}\u0000${model}`. `max` bounds the list.
 */
const STORAGE_KEY = 'dsh-model-picker:mru'
const DEFAULT_MAX = 8

export function loadMRU(storage = null, max = DEFAULT_MAX) {
  try {
    const src = storage ?? globalThis.localStorage
    const raw = src?.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(x => typeof x === 'string').slice(0, max)
  } catch {
    return []
  }
}

export function saveMRU(list, storage = null) {
  try {
    const src = storage ?? globalThis.localStorage
    src?.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // localStorage unavailable (e.g. private mode) — MRU silently disabled.
  }
}

/** Record a selection at the front of the MRU list; returns the new list. */
export function recordMRU(list, provider, model, max = DEFAULT_MAX) {
  const key = `${provider}\u0000${model}`
  const next = [key, ...list.filter(k => k !== key)]
  return next.slice(0, max)
}

/** Split a stored MRU key back into { provider, model } (or null if malformed). */
export function parseMRUKey(key) {
  if (typeof key !== 'string') return null
  const sep = key.indexOf('\u0000')
  if (sep <= 0 || sep === key.length - 1) return null
  return { provider: key.slice(0, sep), model: key.slice(sep + 1) }
}

/**
 * P3-13: resolve MRU entries against live groups, returning only still-valid
 * selections, each with its group/model refs. Order = MRU order.
 */
export function resolveMRU(list, groups) {
  const byKey = new Map()
  for (const group of groups) {
    for (const model of group.models) byKey.set(`${group.id}\u0000${model.id}`, { group, model })
  }
  const out = []
  for (const key of list) {
    const resolved = byKey.get(key)
    if (resolved !== undefined) out.push(resolved)
  }
  return out
}
