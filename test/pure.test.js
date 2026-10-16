import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  orderGroups, providerLabel, EMPTY_STATE, loadInputModalities, tagsFor,
  fill, searchScore, searchRows, loadMRU, saveMRU, recordMRU, parseMRUKey, resolveMRU,
} from '../src/pure.js'

const L = key => key

// ── orderGroups ─────────────────────────────────────────────────────────────
test('orderGroups: account and official first, rest in catalog order', () => {
  const groups = [
    { id: 'z-provider', models: [] },
    { id: 'deepseek-official', models: [] },
    { id: 'deepseek-account', models: [] },
    { id: 'a-provider', models: [] },
  ]
  const ordered = orderGroups(groups)
  assert.deepEqual(ordered.map(g => g.id), ['deepseek-account', 'deepseek-official', 'z-provider', 'a-provider'])
})

test('orderGroups: dedupes by id, first occurrence wins', () => {
  const groups = [
    { id: 'deepseek-account', models: [1] },
    { id: 'deepseek-account', models: [2] },
    { id: 'x', models: [] },
  ]
  const ordered = orderGroups(groups)
  assert.equal(ordered.length, 2)
  assert.equal(ordered[0].models.length, 1)
})

test('orderGroups: does not mutate input', () => {
  const groups = [{ id: 'b' }, { id: 'a' }]
  orderGroups(groups)
  assert.equal(groups[0].id, 'b')
})

// ── providerLabel ───────────────────────────────────────────────────────────
test('providerLabel: deepseek-account uses localized label', () => {
  const t = key => key === 'provider.account' ? '账号' : key
  assert.equal(providerLabel({ id: 'deepseek-account' }, t), '账号')
})

test('providerLabel: other providers use name, falling back to id', () => {
  assert.equal(providerLabel({ id: 'p1', name: 'P One' }, L), 'P One')
  assert.equal(providerLabel({ id: 'p2' }, L), 'p2')
})

// ── fill ────────────────────────────────────────────────────────────────────
test('fill: substitutes placeholders and skips missing keys', () => {
  assert.equal(fill('{a} and {b}', { a: 'x', b: 'y' }), 'x and y')
  assert.equal(fill('{a}{missing}', { a: 'x' }), 'x')
})

test('fill: no placeholders passes through', () => {
  assert.equal(fill('plain', {}), 'plain')
})

// ── tagsFor ─────────────────────────────────────────────────────────────────
test('tagsFor: returns localized capability chips from inputMap', () => {
  const model = { id: 'm1' }
  const group = { id: 'p1' }
  const inputMap = { p1: { m1: ['text', 'image'] } }
  const t = key => key === 'tag.text' ? 'Text' : key === 'tag.image' ? 'Image' : key
  const tags = tagsFor(model, group, inputMap, t)
  assert.deepEqual(tags.map(x => x.label), ['Text', 'Image'])
})

test('tagsFor: no chips when modalities missing or empty', () => {
  const model = { id: 'm1' }
  const group = { id: 'p1' }
  assert.deepEqual(tagsFor(model, group, { p1: { m1: [] } }, L), [])
  assert.deepEqual(tagsFor(model, group, { p2: { m1: ['text'] } }, L), [])
  assert.deepEqual(tagsFor(model, group, null, L), [])
})

// ── loadInputModalities ─────────────────────────────────────────────────────
test('loadInputModalities: builds provider->model->input map from settings', async () => {
  const settings = {
    describe: async () => ({
      ok: true,
      value: {
        namespaces: [
          { value: { providers: {
            'p1': { models: [{ id: 'm1', input: ['text'] }, { id: 'm2', input: ['text', 'image'] }, { id: 'm3' }] },
            'p2': { models: [] },
            'p3': 'not-an-object',
          } } },
        ],
      },
    }),
  }
  const map = await loadInputModalities(settings)
  assert.deepEqual(map, {
    p1: { m1: ['text'], m2: ['text', 'image'] },
  })
})

test('loadInputModalities: empty map when describe fails', async () => {
  const settings = { describe: async () => ({ ok: false }) }
  assert.deepEqual(await loadInputModalities(settings), {})
})

test('loadInputModalities: tolerates missing settings / throwing remote', async () => {
  assert.deepEqual(await loadInputModalities(undefined), {})
  const settings = { describe: async () => { throw new Error('boom') } }
  assert.deepEqual(await loadInputModalities(settings), {})
})

// ── searchScore / searchRows ────────────────────────────────────────────────
const group = { id: 'p1', name: 'Provider One' }
const model = { id: 'deepseek-v4-flash-ga-260731', name: 'deepseek-v4-flash-ga' }

test('searchScore: exact beats prefix beats substring; no query = 1', () => {
  assert.equal(searchScore(model, group, ''), 1)
  assert.equal(searchScore({ id: 'abc', name: 'abc' }, group, 'abc'), 6)
  assert.equal(searchScore({ id: 'abcdef', name: 'abcdef' }, group, 'abc'), 5)
  assert.equal(searchScore({ id: 'xxabcdefyy', name: 'xxabcdefyy' }, group, 'abc'), 4)
  assert.equal(searchScore(model, group, 'p1'), 3)
  assert.equal(searchScore(model, group, 'Provider'), 2)
  assert.equal(searchScore(model, group, 'nope'), 0)
})

test('searchRows: excludes non-matching, ranks best first, applies provider filter', () => {
  const groups = [
    { id: 'p1', name: 'P1', models: [
      { id: 'zebra', name: 'zebra' },
      { id: 'apple', name: 'apple' },
    ] },
    { id: 'p2', name: 'P2', models: [{ id: 'apple-extra', name: 'apple-extra' }] },
  ]
  const rows = searchRows(groups, 'all', 'apple')
  assert.deepEqual(rows.map(r => r.model.id), ['apple', 'apple-extra'])
  const filtered = searchRows(groups, 'p2', 'apple')
  assert.deepEqual(filtered.map(r => r.model.id), ['apple-extra'])
})

test('searchRows: case-insensitive', () => {
  const groups = [{ id: 'g', name: 'G', models: [{ id: 'ABC', name: 'ABC' }] }]
  assert.equal(searchRows(groups, 'all', 'abc').length, 1)
  assert.equal(searchRows(groups, 'all', 'ABC').length, 1)
})

// ── MRU ─────────────────────────────────────────────────────────────────────
test('recordMRU: moves a key to the front, dedupes, bounds to max', () => {
  let list = []
  list = recordMRU(list, 'p1', 'm1')
  list = recordMRU(list, 'p2', 'm2')
  list = recordMRU(list, 'p1', 'm1') // re-select p1/m1 -> front
  assert.deepEqual(list, ['p1\u0000m1', 'p2\u0000m2'])
  list = recordMRU(list, 'p3', 'm3', 2)
  assert.deepEqual(list, ['p3\u0000m3', 'p1\u0000m1'])
})

test('parseMRUKey: round-trips and rejects malformed', () => {
  assert.deepEqual(parseMRUKey('p\u0000m'), { provider: 'p', model: 'm' })
  assert.equal(parseMRUKey('no-sep'), null)
  assert.equal(parseMRUKey('\u0000'), null)
  assert.equal(parseMRUKey(null), null)
})

test('resolveMRU: only keeps selections that still exist in live groups', () => {
  const groups = [
    { id: 'p1', models: [{ id: 'm1' }, { id: 'm2' }] },
    { id: 'p2', models: [{ id: 'm3' }] },
  ]
  const resolved = resolveMRU(['p1\u0000m1', 'p9\u0000gone', 'p2\u0000m3'], groups)
  assert.deepEqual(resolved.map(r => r.model.id), ['m1', 'm3'])
})

test('loadMRU/saveMRU: round-trip through a fake storage', () => {
  const store = new Map()
  const storage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) }
  saveMRU(['a\u0000b'], storage)
  assert.deepEqual(loadMRU(storage), ['a\u0000b'])
})

test('loadMRU: tolerates corrupt JSON and missing storage', () => {
  const bad = { getItem: () => '{corrupt', setItem: () => {} }
  assert.deepEqual(loadMRU(bad), [])
  assert.deepEqual(loadMRU(null), [])
})

test('EMPTY_STATE is frozen', () => {
  assert.ok(Object.isFrozen(EMPTY_STATE))
})
