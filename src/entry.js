/**
 * dsh-model-picker — browser half (ModuleLoader bundle entry).
 *
 * Adds a quick-pick button immediately LEFT of the composer's model dropdown
 * (the `conversation.input.model` seat) by registering into the composer's
 * `conversation.input.right` list slot. Clicking the button opens a full
 * model-selection dialog: every model grouped by provider, ranked search,
 * reasoning badges + effort picker, MRU (recent) section, current-selection
 * highlight, load/error/failure states.
 *
 * Selection is submitted through the SAME per-session `ModelDirectory` the
 * stock model dropdown uses — `ctx.modelDirectories`, provided by
 * `@deepseek-ai/dsh-client-ui-model-selection`. All surfaces share one state
 * and one `selectModel` submission path, so choosing a model here instantly
 * updates the model dropdown's label and takes effect on the session.
 *
 * Built from src/ via esbuild into a single-file ModuleLoader bundle (no
 * runtime build step, no dependency beyond the `react` the shell provides).
 */

import { zh, en } from './dict.js'
import { PICKER_CSS } from './style.js'
import {
  orderGroups, providerLabel, EMPTY_STATE, loadInputModalities, tagsFor,
  fill, searchRows, loadMRU, saveMRU, recordMRU, parseMRUKey, resolveMRU,
} from './pure.js'
import {
  IconGrid, IconSearch, IconCheck, IconClose, IconChip, IconCaret, IconClock,
} from './icons.js'

window.__ModuleLoader__.load({
  id: '@faxble/dsh-model-picker',
  factory: require => {
    const module = { exports: {} }
    const exports = module.exports

    const React = require('react')
    const {
      createElement: h, Fragment, useState, useEffect, useMemo, useRef, useSyncExternalStore, useCallback,
    } = React
    // `react-dom` is a platform seed word in the DSH shell; resolved
    // defensively so the dialog falls back to in-place rendering if absent.
    let createPortal = null
    try {
      const reactDom = require('react-dom')
      if (typeof reactDom?.createPortal === 'function') createPortal = reactDom.createPortal
    } catch { createPortal = null }

    const ID = 'dsh-model-picker'
    const NS = 'dshModelPicker'
    const inject = ['slots', 'locale', 'remote', 'remote.settings']

    // ── icons (h-bound) ───────────────────────────────────────────────────────
    const G = IconGrid(h)
    const S = IconSearch(h)
    const CK = IconCheck(h)
    const X = IconClose(h)
    const CP = IconChip(h)
    const CA = IconCaret(h)
    const CL = IconClock(h)

    // ── helpers (thin wrappers over src/pure.js, kept for call-site brevity) ──

    /**
     * Renders the quick-pick button (left of the model dropdown) and, while
     * open, the full model-selection dialog. Data and submission ride the same
     * per-session ModelDirectory the stock dropdown uses.
     * @param props - { directory } injected face + { t } locale seat.
     */
    function ModelPickerButton(props) {
      const { resolve, t, settings } = props
      const L = typeof t === 'function' ? t : key => key

      // The inject face hands us a RESOLVER instead of a resolved directory:
      // the composer renders this seat BEFORE the model seat, so this entry is
      // the first caller of directoryFor() for the session. If the session wire
      // is still warming up at that instant, directoryFor() throws and the
      // renderer caches that null face forever. Retry on a short timer until
      // the directory becomes available (self-healing; capped so addressed-
      // subagent sessions settle into the disabled button).
      const [directory, setDirectory] = useState(null)
      useEffect(() => {
        if (typeof resolve !== 'function') return
        let alive = true
        let timer = null
        let tries = 0
        const attempt = () => {
          if (!alive) return
          let resolved = null
          try {
            resolved = resolve()
          } catch (error) {
            console.error('[dsh-model-picker] resolve threw:', error)
          }
          if (resolved !== null) {
            setDirectory(resolved)
            return
          }
          tries += 1
          if (tries <= 40) timer = setTimeout(attempt, 250)
        }
        timer = setTimeout(attempt, 0)
        return () => {
          alive = false
          if (timer !== null) clearTimeout(timer)
        }
      }, [resolve])

      const usable = directory !== null
      const state = useSyncExternalStore(
        fn => (usable ? directory.store.subscribe(fn) : () => {}),
        () => (usable ? directory.store.getSnapshot() : EMPTY_STATE),
      )

      // Host-declared per-model input modalities (the configured `input`
      // lists), loaded once through the `settings` Remote and rendered as
      // capability chips per row; missing data simply renders no chips.
      const [inputMap, setInputMap] = useState(null)
      useEffect(() => {
        if (settings === undefined) return
        let alive = true
        loadInputModalities(settings).then(map => {
          if (alive) setInputMap(map)
        })
        return () => { alive = false }
      }, [settings])

      const [open, setOpen] = useState(false)
      const [query, setQuery] = useState('')
      const [providerFilter, setProviderFilter] = useState('all')  // 'all' | provider id
      const [filterOpen, setFilterOpen] = useState(false)          // custom provider dropdown
      const [effortOpen, setEffortOpen] = useState(false)          // P2-12: custom effort dropdown
      const [notice, setNotice] = useState(null)          // { text: string } selection failure
      const [highlight, setHighlight] = useState(0)        // search keyboard index
      const [renderedCount, setRenderedCount] = useState(12) // P2-11: lazy group render budget
      const [mru, setMru] = useState([])                    // P3-13: recent selection keys
      const searchRef = useRef(null)
      const triggerRef = useRef(null)
      const modalRef = useRef(null)
      const bodyRef = useRef(null)

      const busy = state.pending !== null
      const firstLoad = state.groups.length === 0 && (state.status === 'loading' || state.status === 'idle')

      // P3-13: load MRU once when the dialog opens (cheap; avoids stale list).
      useEffect(() => {
        if (open) setMru(loadMRU())
      }, [open])

      // P2-11: reveal more provider groups as the list scrolls near the bottom.
      useEffect(() => {
        if (!open) return
        const el = bodyRef.current
        if (el === null) return
        const onScroll = () => {
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 160) {
            setRenderedCount(n => Math.min(n + 12, 200))
          }
        }
        el.addEventListener('scroll', onScroll, { passive: true })
        return () => el.removeEventListener('scroll', onScroll)
      }, [open, renderedCount])

      // Close on Escape (capture: the composer also handles Escape). A nested
      // open provider menu closes first.
      useEffect(() => {
        if (!open) return
        const onKey = event => {
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            if (filterOpen) setFilterOpen(false)
            else if (effortOpen) setEffortOpen(false)
            else closeDialog()
          }
        }
        window.addEventListener('keydown', onKey, true)
        return () => window.removeEventListener('keydown', onKey, true)
      }, [open, filterOpen])

      // P2-10: focus trap — keep Tab/Shift+Tab inside the modal.
      useEffect(() => {
        if (!open) return
        const modal = modalRef.current
        if (modal === null) return
        const onKeyDown = event => {
          if (event.key !== 'Tab') return
          const focusables = modal.querySelectorAll(
            'button, input, [href], [tabindex]:not([tabindex="-1"])')
          if (focusables.length === 0) return
          const first = focusables[0]
          const last = focusables[focusables.length - 1]
          if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
            event.preventDefault()
            first.focus()
          }
        }
        modal.addEventListener('keydown', onKeyDown)
        return () => modal.removeEventListener('keydown', onKeyDown)
      }, [open, filterOpen])

      // P2-10: focus the search field on open; restore focus to the trigger on close.
      useEffect(() => {
        if (!open) return
        const timer = window.setTimeout(() => { searchRef.current?.focus() }, 40)
        return () => window.clearTimeout(timer)
      }, [open])
      useEffect(() => {
        if (!open) triggerRef.current?.focus()
      }, [open])

      const groups = useMemo(() => orderGroups(state.groups), [state.groups])

      // P3-14: ranked search rows (score desc, stable), provider filter applied.
      const filtered = useMemo(() => searchRows(groups, providerFilter, query), [groups, providerFilter, query])
      const modelCount = useMemo(() => groups.reduce((n, g) => n + g.models.length, 0), [groups])

      // P3-13: resolve MRU entries against the live catalog (skip stale).
      const recentRows = useMemo(() => {
        if (query.trim() !== '' || providerFilter !== 'all') return []
        return resolveMRU(mru, groups)
      }, [mru, groups, query, providerFilter])

      const activeIndex = Math.min(Math.max(highlight, 0), filtered.length - 1)

      // Reset highlight whenever the query, provider filter or dialog changes.
      useEffect(() => { setHighlight(0) }, [query, providerFilter, open])

      // Reset the lazy-render budget on dialog open.
      useEffect(() => { if (open) setRenderedCount(12) }, [open])

      // Close the effort dropdown on outside click (a nested sibling of the
      // provider filter menu; overlay mousedown also closes the dialog).
      useEffect(() => {
        if (!effortOpen) return
        const onDown = event => {
          if (!event.target.closest('.cmp-picker-effort')) setEffortOpen(false)
        }
        document.addEventListener('mousedown', onDown)
        return () => document.removeEventListener('mousedown', onDown)
      }, [effortOpen])

      const closeDialog = useCallback(() => {
        setFilterOpen(false)
        setEffortOpen(false)
        setOpen(false)
        setNotice(null)
      }, [])

      const openDialog = () => {
        setNotice(null)
        setQuery('')
        setFilterOpen(false)
        setEffortOpen(false)
        setRenderedCount(12)
        setOpen(true)
        if (usable) directory.load().catch(() => { /* the error lands on the store */ })
      }

      const choose = async (group, model, reasoningEffortOverride, keepOpen = false) => {
        if (!usable || busy) return
        const sameRoute = state.current !== null
          && state.current.provider === group.id && state.current.model === model.id
        const reasoningEffort = reasoningEffortOverride !== undefined
          ? reasoningEffortOverride
          : (sameRoute
              ? state.current.reasoningEffort ?? model.reasoning?.defaultEffort
              : model.reasoning?.defaultEffort)
        const selection = {
          provider: group.id,
          model: model.id,
          ...(reasoningEffort === undefined ? {} : { reasoningEffort }),
        }
        setNotice(null)
        let result
        try {
          result = await directory.select(selection)
        } catch (error) {
          setNotice(fill(L('error.select'), { message: error instanceof Error ? error.message : String(error) }))
          return
        }
        if (result && result.ok === false) {
          setNotice(result.error.code === 'session/writer-held'
            ? L('error.sessionInUse')
            : fill(L('error.select'), { message: `${result.error.code}: ${result.error.message}` }))
          return
        }
        // P3-13: persist MRU on success.
        setMru(prev => {
          const next = recordMRU(prev, group.id, model.id)
          saveMRU(next)
          return next
        })
        if (!keepOpen) {
          setOpen(false)
          setQuery('')
        } else {
          setEffortOpen(false)
        }
      }

      const reload = () => {
        setNotice(null)
        if (usable) directory.load().catch(() => { /* the error lands on the store */ })
      }

      const onSearchKeyDown = event => {
        if (event.nativeEvent?.isComposing) return
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          if (filtered.length === 0) return
          const dir = event.key === 'ArrowDown' ? 1 : -1
          setHighlight((activeIndex + dir + filtered.length) % filtered.length)
          return
        }
        if (event.key === 'Enter') {
          event.preventDefault()
          const row = filtered[activeIndex]
          if (row !== undefined && !busy) void choose(row.group, row.model)
          return
        }
      }

      // The button, always visible in the composer tool row (left of the model
      // seat). While the shared directory is still warming up (or for addressed
      // subagent sessions that expose none) the button renders disabled instead
      // of vanishing.
      if (!usable) {
        return h('button', {
          type: 'button',
          ref: triggerRef,
          className: 'cmp-picker-trigger',
          'data-cmp-state': 'unavailable',
          title: L('trigger.unavailable'),
          'aria-label': L('trigger.unavailable'),
          disabled: true,
        }, G())
      }

      const button = h('button', {
        type: 'button',
        ref: triggerRef,
        className: 'cmp-picker-trigger',
        title: L('trigger.label'),
        'aria-label': L('trigger.aria'),
        onClick: openDialog,
      }, G())

      if (!open) return button

      const current = state.current
      const currentLabel = current === null
        ? L('dialog.title')
        : `${current.model}${current.reasoningEffort ? ` · ${current.reasoningEffort}` : ''}`
      const unreasoningBadge = model => model.reasoning !== undefined && model.reasoning.efforts?.length > 0
      const filterLabel = providerFilter === 'all'
        ? L('filter.all')
        : (() => {
            const g = groups.find(g => g.id === providerFilter)
            return g !== undefined ? providerLabel(g, L) : L('filter.all')
          })()

      // P2-12: reasoning-effort picker for the currently selected model.
      const currentReasoning = (() => {
        if (current === null) return null
        for (const group of groups) {
          if (group.id !== current.provider) continue
          for (const model of group.models) {
            if (model.id !== current.model) continue
            return model.reasoning ?? null
          }
        }
        return null
      })()
      const efforts = currentReasoning?.efforts?.filter(e => e !== undefined) ?? []
      const currentEffort = current?.reasoningEffort ?? currentReasoning?.defaultEffort

      const dialog = h('div', {
        className: 'cmp-picker-overlay',
        onMouseDown: event => {
          if (event.target === event.currentTarget) closeDialog()
        },
      },
        h('div', {
          ref: modalRef,
          className: 'cmp-picker-modal',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-label': L('dialog.title'),
        },
          // Header
          h('div', { className: 'cmp-picker-head' },
            h('div', { className: 'cmp-picker-title' }, L('dialog.title')),
            h('div', { className: 'cmp-picker-subtitle' },
              fill(L('dialog.subtitle'), { providers: groups.length, models: modelCount }),
            ),
            h('button', {
              type: 'button', className: 'cmp-picker-close', 'aria-label': L('foot.close'),
              onClick: closeDialog,
            }, X()),
          ),
          // Search + provider filter
          h('div', { className: 'cmp-picker-search' },
            h('div', { className: 'cmp-picker-filter' },
              h('button', {
                type: 'button',
                className: 'cmp-picker-filter-trigger',
                'aria-haspopup': 'listbox',
                'aria-expanded': filterOpen ? 'true' : 'false',
                'aria-label': L('filter.provider'),
                onClick: () => setFilterOpen(openState => !openState),
              },
                h('span', { className: 'cmp-picker-filter-value' }, filterLabel),
                h('span', { className: 'cmp-picker-filter-caret' }, CA()),
              ),
              filterOpen && h('div', { className: 'cmp-picker-filter-menu', role: 'listbox', 'aria-label': L('filter.provider') },
                h('button', {
                  type: 'button',
                  role: 'option',
                  'aria-selected': providerFilter === 'all' ? 'true' : 'false',
                  className: 'cmp-picker-filter-opt',
                  'data-selected': providerFilter === 'all' ? 'true' : 'false',
                  onClick: () => { setProviderFilter('all'); setFilterOpen(false) },
                },
                  h('span', { className: 'cmp-picker-filter-opt-check' }, providerFilter === 'all' ? CK() : null),
                  h('span', null, L('filter.all')),
                ),
                groups.map(group => h('button', {
                  type: 'button',
                  key: group.id,
                  role: 'option',
                  'aria-selected': providerFilter === group.id ? 'true' : 'false',
                  className: 'cmp-picker-filter-opt',
                  'data-selected': providerFilter === group.id ? 'true' : 'false',
                  onClick: () => { setProviderFilter(group.id); setFilterOpen(false) },
                },
                  h('span', { className: 'cmp-picker-filter-opt-check' }, providerFilter === group.id ? CK() : null),
                  h('span', null, providerLabel(group, L)),
                )),
              ),
            ),
            h('div', { className: 'cmp-picker-search-field' },
              h('span', { className: 'cmp-picker-search-icon' }, S()),
              h('input', {
                ref: searchRef,
                type: 'text',
                role: 'searchbox',
                'aria-label': L('search.placeholder'),
                placeholder: L('search.placeholder'),
                value: query,
                onKeyDown: onSearchKeyDown,
                onChange: event => setQuery(event.target.value),
              }),
              query !== '' && h('button', {
                type: 'button', className: 'cmp-picker-search-clear', 'aria-label': L('search.clear'),
                onClick: () => { setQuery(''); searchRef.current?.focus() },
              }, X()),
            ),
          ),
          // Body
          h('div', { ref: bodyRef, className: 'cmp-picker-body' },
            // P2-10: aria-live region announces status changes to screen readers.
            h('div', { role: 'status', 'aria-live': 'polite', className: 'cmp-picker-sr-only' },
              state.status === 'loading' ? L('loading.models')
                : state.status === 'error' ? L('error.load')
                : notice !== null ? notice : '',
            ),
            state.error !== null && state.status === 'error' && (
              h('div', { className: 'cmp-picker-notice', role: 'alert' },
                h('span', null, fill(L('error.load'), { message: state.error })),
                h('button', { type: 'button', onClick: reload }, L('retry')),
              )
            ),
            notice !== null && (
              h('div', { className: 'cmp-picker-notice', role: 'alert' },
                h('span', null, notice),
              )
            ),
            state.routable === false && (
              h('div', { className: 'cmp-picker-warning' },
                h('span', null, L('badge.unroutable')),
              )
            ),
            state.failures.map(failure => (
              h('div', { className: 'cmp-picker-warning', key: `failure-${failure.id}` },
                h('span', null, fill(L('warning.groupLoad'), {
                  name: failure.id === 'deepseek-account' ? L('provider.account') : failure.name,
                  message: failure.message,
                })),
                h('button', { type: 'button', onClick: reload }, L('retry')),
              )
            )),
            firstLoad && (
              h('div', { className: 'cmp-picker-status' },
                h('span', { className: 'cmp-picker-spin' }),
                h('span', null, L('loading.models')),
              )
            ),
            !firstLoad && state.groups.length === 0 && state.status !== 'error' && (
              h('div', { className: 'cmp-picker-status' }, L('empty.models'))
            ),
            !firstLoad && filtered.length === 0 && state.groups.length > 0 && (
              h('div', { className: 'cmp-picker-status' }, L('search.empty'))
            ),
            // P3-13: recent selections section (only with no query / no filter).
            recentRows.length > 0 && h('div', { className: 'cmp-picker-group cmp-picker-recent', 'data-provider': 'other' },
              h('div', { className: 'cmp-picker-group-head' },
                h('span', null, CL()),
                h('span', null, L('badge.recent')),
              ),
              recentRows.map(({ group, model }) => {
                const selected = state.current !== null
                  && state.current.provider === group.id && state.current.model === model.id
                const pendingHere = state.pending !== null
                  && state.pending.provider === group.id && state.pending.model === model.id
                return h('button', {
                  type: 'button',
                  key: `${group.id}\u0000${model.id}`,
                  className: 'cmp-picker-row',
                  'data-selected': selected ? 'true' : 'false',
                  disabled: busy,
                  title: model.description !== undefined && model.description !== '' ? model.description : undefined,
                  onClick: () => { void choose(group, model) },
                },
                  h('div', { className: 'cmp-picker-row-main' },
                    // Provider prefix on the LEFT of the model name, so MRU rows
                    // read as "provider · model" and stay unambiguous when the
                    // same model id exists under several providers.
                    h('span', { className: 'cmp-picker-row-provider', title: providerLabel(group, L) }, providerLabel(group, L)),
                    h('span', { className: 'cmp-picker-row-name', title: model.name }, model.name),
                    unreasoningBadge(model) && h('span', { className: 'cmp-picker-badge' }, L('badge.reasoning')),
                    tagsFor(model, group, inputMap, L).map(tag => h('span', { key: tag.key, className: 'cmp-picker-cap' }, tag.label)),
                  ),
                  selected
                    ? h('span', { className: 'cmp-picker-badge-current' },
                        pendingHere ? h('span', { className: 'cmp-picker-spin' }) : CK(),
                        h('span', null, L('badge.current')),
                      )
                    : pendingHere && h('span', { className: 'cmp-picker-check' }, h('span', { className: 'cmp-picker-spin' })),
                )
              }),
            ),
            // Provider groups (P2-11: lazily rendered up to `renderedCount`).
            groups.slice(0, renderedCount).map(group => {
              const models = filtered.filter(row => row.group === group).map(row => row.model)
              if (models.length === 0) return null
              const groupLabel = providerLabel(group, L)
              const providerKey = group.id === 'deepseek-account' ? 'deepseek-account'
                : group.id === 'deepseek-official' ? 'deepseek-official' : 'other'
              return h('div', { key: group.id, className: 'cmp-picker-group', 'data-provider': providerKey },
                h('div', { className: 'cmp-picker-group-head' },
                  h('span', null, groupLabel),
                  h('span', { className: 'cmp-picker-group-count' }, String(models.length)),
                ),
                models.map(model => {
                  const selected = state.current !== null
                    && state.current.provider === group.id && state.current.model === model.id
                  const pendingHere = state.pending !== null
                    && state.pending.provider === group.id && state.pending.model === model.id
                  return h('button', {
                    type: 'button',
                    key: model.id,
                    className: 'cmp-picker-row',
                    'data-selected': selected ? 'true' : 'false',
                    disabled: busy,
                    title: model.description !== undefined && model.description !== '' ? model.description : undefined,
                    onMouseMove: () => {
                      if (filtered.length === 0) return
                      // P3-15: index cached via findIndex; rows are recreated on
                      // filter change so a scan here is acceptable, but we avoid
                      // re-scanning on every mousemove by only setting when changed.
                      const index = Math.max(filtered.findIndex(r => r.model === model && r.group === group), 0)
                      setHighlight(current => current === index ? current : index)
                    },
                    onClick: () => { void choose(group, model) },
                  },
                    h('div', { className: 'cmp-picker-row-main' },
                      h('span', { className: 'cmp-picker-row-name', title: model.name }, model.name),
                      unreasoningBadge(model) && h('span', { className: 'cmp-picker-badge' }, L('badge.reasoning')),
                      tagsFor(model, group, inputMap, L).map(tag => h('span', { key: tag.key, className: 'cmp-picker-cap' }, tag.label)),
                    ),
                    selected
                      ? h('span', { className: 'cmp-picker-badge-current' },
                          pendingHere ? h('span', { className: 'cmp-picker-spin' }) : CK(),
                          h('span', null, L('badge.current')),
                        )
                      : pendingHere && h('span', { className: 'cmp-picker-check' }, h('span', { className: 'cmp-picker-spin' })),
                  )
                }),
              )
            }),
          ),
          // Footer
          h('div', { className: 'cmp-picker-foot' },
            h('div', { className: 'cmp-picker-foot-current' },
              CP(),
              h('span', { className: 'cmp-picker-foot-name', title: currentLabel }, currentLabel),
            ),
            // P2-12: reasoning-effort selector (custom dropdown, theme-driven —
            // no native <select>, which renders a glaring system panel in dark
            // themes). Only shown when the current model exposes multiple efforts.
            efforts.length > 0 && h('div', { className: 'cmp-picker-effort' },
              h('button', {
                type: 'button',
                className: 'cmp-picker-effort-trigger',
                'aria-haspopup': 'listbox',
                'aria-expanded': effortOpen ? 'true' : 'false',
                'aria-label': L('badge.reasoning'),
                title: L('badge.reasoning'),
                onClick: () => setEffortOpen(openState => !openState),
              },
                h('span', { className: 'cmp-picker-effort-value' },
                  currentEffort !== undefined
                    ? (efforts.find(e => String(e.id) === String(currentEffort))?.name ?? String(currentEffort))
                    : L('badge.reasoning'),
                ),
                h('span', { className: 'cmp-picker-filter-caret' }, CA()),
              ),
              effortOpen && h('div', { className: 'cmp-picker-effort-menu', role: 'listbox', 'aria-label': L('badge.reasoning') },
                h('button', {
                  type: 'button',
                  role: 'option',
                  'aria-selected': currentEffort === undefined ? 'true' : 'false',
                  className: 'cmp-picker-filter-opt',
                  'data-selected': currentEffort === undefined ? 'true' : 'false',
                  onClick: () => {
                    setEffortOpen(false)
                    if (current !== null) void choose({ id: current.provider }, { id: current.model, reasoning: currentReasoning }, undefined, true)
                  },
                },
                  h('span', { className: 'cmp-picker-filter-opt-check' }, currentEffort === undefined ? CK() : null),
                  h('span', null, L('badge.reasoning')),
                ),
                efforts.map(effort => h('button', {
                  type: 'button',
                  key: String(effort.id),
                  role: 'option',
                  'aria-selected': String(currentEffort) === String(effort.id) ? 'true' : 'false',
                  className: 'cmp-picker-filter-opt',
                  'data-selected': String(currentEffort) === String(effort.id) ? 'true' : 'false',
                  onClick: () => {
                    setEffortOpen(false)
                    if (current !== null) void choose({ id: current.provider }, { id: current.model, reasoning: currentReasoning }, String(effort.id), true)
                  },
                },
                  h('span', { className: 'cmp-picker-filter-opt-check' }, String(currentEffort) === String(effort.id) ? CK() : null),
                  h('span', null, effort.name ?? String(effort.id)),
                )),
              ),
            ),
            h('button', { type: 'button', className: 'cmp-picker-foot-close', onClick: closeDialog }, L('foot.close')),
          ),
        ),
      )

      return h(Fragment, null,
        button,
        createPortal !== null ? createPortal(dialog, document.body) : dialog,
      )
    }

    // ── plugin body ───────────────────────────────────────────────────────────
    function apply(ctx) {
      // Dictionaries.
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-model-picker: dictionaries')

      // Stylesheet (removed with the plugin; dsh-client-modules also sweeps
      // style[data-plugin] on code replacement).
      ctx.effect(() => {
        const style = document.createElement('style')
        style.setAttribute('data-plugin', ID)
        style.textContent = PICKER_CSS
        document.head.appendChild(style)
        return () => { style.remove() }
      }, 'dsh-model-picker: styles')

      // The composer seat: register into `conversation.input.right` — the list
      // slot the composer bar renders immediately before the model seat.
      // `modelDirectories` is provided by @deepseek-ai/dsh-client-ui-model-selection;
      // ctx.inject waits until that service exists.
      ctx.inject(['slots', 'modelDirectories', 'remote', 'remote.settings'], scope => {
        const models = scope.modelDirectories
        const remote = scope.remote
        scope.effect(() => scope.slots.inject('conversation.input.right', () => scope.slots.register({
          name: 'conversation.input.right',
          id: ID,
          order: 100,
          locale: NS,
          inject: sessionId => ({
            // Deliberately resolve lazily from the component: this seat renders
            // before the model seat, so calling directoryFor() here (at inject
            // time) can throw while the session wire is still warming up — and
            // the renderer caches that null face for the whole entry lifetime.
            resolve: () => {
              try {
                return models.directoryFor(sessionId)
              } catch (error) {
                console.error('[dsh-model-picker] directoryFor failed:', error)
                return null
              }
            },
            // The injected `settings` Remote namespace for reading real
            // per-model input modalities (capability chips); optional, so a
            // build without it still renders rows without chips.
            settings: scope.remote.settings,
          }),
        }, ModelPickerButton)), 'dsh-model-picker: composer entry')
      })
    }

    exports.apply = apply
    exports.inject = inject
    exports.name = '@faxble/dsh-model-picker'
    return module.exports
  },
})
