/**
 * dsh-model-picker — browser half.
 *
 * Adds a quick-pick button immediately LEFT of the composer's model dropdown
 * (the `conversation.input.model` seat) by registering into the composer's
 * `conversation.input.right` list slot, which the composer bar renders right
 * before the model seat. Clicking the button opens a full model-selection
 * dialog: every model grouped by provider, fuzzy search, reasoning badges,
 * current-selection highlight, load/error/failure states.
 *
 * Selection is submitted through the SAME per-session `ModelDirectory` the
 * stock model dropdown (and the /model popup) uses — `ctx.modelDirectories`,
 * provided by `@deepseek-ai/dsh-client-ui-model-selection`. Because all three
 * surfaces share one state and one `selectModel` submission path, choosing a
 * model here instantly updates the model dropdown's label and takes effect on
 * the session ("a switch made in either entry is what the other shows next").
 *
 * Hand-written ModuleLoader bundle: no build step, no dependency beyond the
 * `react` the shell already provides. All colour comes from theme variables so
 * the page survives a scheme switch.
 */
window.__ModuleLoader__.load({
  id: 'dsh-model-picker',
  factory: require => {
    const module = { exports: {} }
    const exports = module.exports

    const React = require('react')
    const {
      createElement: h, Fragment, useState, useEffect, useMemo, useRef, useSyncExternalStore,
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

    // ── copy ──────────────────────────────────────────────────────────────────
    const zh = {
      'trigger.label': '模型速选',
      'trigger.aria': '打开模型速选窗口',
      'trigger.unavailable': '模型目录加载中…',
      'filter.all': '全部提供商',
      'filter.provider': '按提供商筛选',
      'dialog.title': '选择模型',
      'dialog.subtitle': '{providers} 个提供商 · {models} 个模型',
      'search.placeholder': '搜索模型…',
      'search.clear': '清除搜索',
      'search.empty': '没有匹配的模型。',
      'empty.models': '没有可用的模型。',
      'loading.models': '正在加载模型列表…',
      'loading.selecting': '正在切换模型…',
      'error.load': '模型列表加载失败：{message}',
      'error.select': '模型切换失败：{message}',
      'error.sessionInUse': '当前会话已被占用（可能由其他正在运行的 DSH 实例使用），请退出后重试。',
      'retry': '重试',
      'badge.reasoning': '推理',
      'badge.current': '当前',
      'badge.unroutable': '当前模型已不在可用列表',
      'warning.groupLoad': '{name} 加载失败：{message}',
      'foot.current': '当前',
      'foot.close': '关闭',
      'provider.account': 'DeepSeek 账号',
    }
    const en = {
      'trigger.label': 'Model picker',
      'trigger.aria': 'Open model picker',
      'trigger.unavailable': 'Model directory is loading…',
      'filter.all': 'All providers',
      'filter.provider': 'Filter by provider',
      'dialog.title': 'Select model',
      'dialog.subtitle': '{providers} providers · {models} models',
      'search.placeholder': 'Search models…',
      'search.clear': 'Clear search',
      'search.empty': 'No matching models.',
      'empty.models': 'No models available.',
      'loading.models': 'Loading models…',
      'loading.selecting': 'Switching model…',
      'error.load': 'Failed to load models: {message}',
      'error.select': 'Failed to switch model: {message}',
      'error.sessionInUse': 'This session is in use by another running DSH instance. Quit it and try again.',
      'retry': 'Retry',
      'badge.reasoning': 'Reasoning',
      'badge.current': 'Current',
      'badge.unroutable': 'Current model is no longer available',
      'warning.groupLoad': '{name} failed to load: {message}',
      'foot.current': 'Current',
      'foot.close': 'Close',
      'provider.account': 'DeepSeek Account',
    }

    // ── styles (theme-token driven, injected once) ───────────────────────────
    const CSS = `
.cmp-picker-trigger {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 999px;
  corner-shape: round;
  background: var(--dsw-specific-selector, rgba(128, 133, 140, 0.16));
  color: var(--dsw-alias-label-primary, #1f2329);
  cursor: pointer;
  transition: background 120ms ease;
}
.cmp-picker-trigger:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover-solid, var(--dsw-alias-interactive-bg-hover, rgba(128, 133, 140, 0.24)));
}
.cmp-picker-trigger:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary, #3964fe));
}
.cmp-picker-trigger:disabled {
  opacity: 0.5;
  cursor: default;
}
.cmp-picker-overlay {
  /* fixed + vw/vh (instead of inset:0) keeps the modal centered on the real
     viewport even when an app container (transform/contain) acts as the
     fixed containing block and is wider than the window. */
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(6, 8, 14, 0.42);
  backdrop-filter: blur(3px);
  animation: cmp-picker-fade 140ms ease;
}
@keyframes cmp-picker-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
.cmp-picker-modal,
.cmp-picker-overlay,
.cmp-picker-modal * {
  box-sizing: border-box;
}
.cmp-picker-modal {
  display: flex;
  flex-direction: column;
  width: 560px;
  max-width: calc(100vw - 48px);
  max-height: min(76vh, 680px);
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1, #e4e7ec);
  border-radius: 16px;
  background: var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-1, #ffffff));
  box-shadow: var(--dsw-elevation-prominent, 0 12px 40px rgba(0, 0, 0, 0.22));
  color: var(--dsw-alias-label-primary, #1f2329);
  animation: cmp-picker-pop 160ms cubic-bezier(0.2, 0.8, 0.3, 1);
}
@keyframes cmp-picker-pop {
  from { opacity: 0; transform: translateY(8px) scale(0.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.cmp-picker-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 24px 12px;
}
.cmp-picker-title {
  flex: 1;
  min-width: 0;
  font-size: 15px;
  line-height: 22px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #1f2329);
}
.cmp-picker-subtitle {
  flex: none;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-tertiary, #8a919c);
  white-space: nowrap;
}
.cmp-picker-close {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #5f6672);
  cursor: pointer;
}
.cmp-picker-close:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 133, 140, 0.14));
}
.cmp-picker-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px 14px;
}
.cmp-picker-filter {
  position: relative;
  flex: none;
}
.cmp-picker-filter-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 148px;
  height: 36px;
  padding: 0 8px 0 10px;
  border: 1px solid var(--dsw-alias-border-l1, #e4e7ec);
  border-radius: 10px;
  outline: none;
  background: var(--dsw-alias-bg-base, rgba(128, 133, 140, 0.08));
  color: var(--dsw-alias-label-primary, #1f2329);
  font-size: 13px;
  line-height: 20px;
  cursor: pointer;
}
.cmp-picker-filter-trigger:focus-visible {
  box-shadow: 0 0 0 1.5px var(--dsw-focus-ring-color, rgba(57, 100, 254, 0.45));
}
.cmp-picker-filter-value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}
.cmp-picker-filter-caret {
  flex: none;
  display: grid;
  place-items: center;
  color: var(--dsw-alias-label-tertiary, #8a919c);
}
.cmp-picker-filter-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 3010;
  width: 230px;
  max-height: 280px;
  overflow-y: auto;
  padding: 4px;
  border: 1px solid var(--dsw-alias-border-l1, #e4e7ec);
  border-radius: 12px;
  /* Opaque panel: an overlay/translucent variable here would show the model
     list through the menu. layer-2 is a solid surface in both themes. */
  background: var(--dsw-alias-bg-layer-2, #ffffff);
  box-shadow: var(--dsw-elevation-prominent, 0 8px 24px rgba(0, 0, 0, 0.2));
}
.cmp-picker-filter-opt {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-primary, #1f2329);
  font-size: 13px;
  line-height: 20px;
  text-align: left;
  cursor: pointer;
}
.cmp-picker-filter-opt:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 133, 140, 0.12));
}
.cmp-picker-filter-opt[data-selected='true'] {
  background: var(--dsw-alias-brand-primary-soft, rgba(57, 100, 254, 0.14));
  color: var(--dsw-alias-label-primary, #1f2329);
  font-weight: 600;
}
.cmp-picker-filter-opt-check {
  flex: none;
  width: 14px;
  display: grid;
  place-items: center;
  color: var(--dsw-alias-brand-primary, #3964fe);
}
.cmp-picker-search-field {
  position: relative;
  flex: 1;
  min-width: 0;
}
.cmp-picker-search-field input {
  width: 100%;
  height: 36px;
  padding: 0 34px 0 36px;
  border: 1px solid var(--dsw-alias-border-l1, #e4e7ec);
  border-radius: 10px;
  outline: none;
  background: var(--dsw-alias-bg-base, rgba(128, 133, 140, 0.08));
  color: var(--dsw-alias-label-primary, #1f2329);
  font-size: 13px;
  line-height: 20px;
}
.cmp-picker-search-field input::placeholder {
  color: var(--dsw-alias-label-tertiary, #8a919c);
}
.cmp-picker-search-field input:focus {
  border-color: transparent;
  box-shadow: 0 0 0 1.5px var(--dsw-focus-ring-color, rgba(57, 100, 254, 0.45));
}
.cmp-picker-search-icon {
  position: absolute;
  left: 11px;
  top: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  color: var(--dsw-alias-label-tertiary, #8a919c);
}
.cmp-picker-search-clear {
  position: absolute;
  right: 5px;
  top: 5px;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-tertiary, #8a919c);
  cursor: pointer;
}
.cmp-picker-search-clear:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 133, 140, 0.14));
  color: var(--dsw-alias-label-primary, #1f2329);
}
.cmp-picker-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 14px 12px;
  scrollbar-width: thin;
  scrollbar-color: var(--dsw-alias-scrollbar-bg-l2, rgba(128, 133, 140, 0.4)) transparent;
}
/* Provider group card: one calm tinted panel per provider (no jumping hues),
   the colored head bar below tells the providers apart. */
.cmp-picker-group {
  border-radius: 12px;
  margin-bottom: 10px;
  background: var(--dsw-alias-bg-layer-1, rgba(128, 133, 140, 0.05));
  border: 1px solid var(--dsw-alias-border-l1, rgba(128, 133, 140, 0.12));
}
.cmp-picker-group:last-child {
  margin-bottom: 0;
}
.cmp-picker-group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px 6px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.cmp-picker-group-head::before {
  content: '';
  flex: none;
  width: 4px;
  height: 14px;
  border-radius: 2px;
  background: var(--dsw-alias-label-tertiary, #8a919c);
}
.cmp-picker-group[data-provider='deepseek-account'] .cmp-picker-group-head {
  color: var(--cmp-account, #3964fe);
}
.cmp-picker-group[data-provider='deepseek-account'] .cmp-picker-group-head::before {
  background: var(--cmp-account, #3964fe);
}
.cmp-picker-group[data-provider='deepseek-official'] .cmp-picker-group-head {
  color: var(--cmp-official, #0d9488);
}
.cmp-picker-group[data-provider='deepseek-official'] .cmp-picker-group-head::before {
  background: var(--cmp-official, #0d9488);
}
.cmp-picker-group[data-provider='other'] .cmp-picker-group-head {
  color: var(--dsw-alias-label-secondary, #5f6672);
}
.cmp-picker-group[data-provider='other'] .cmp-picker-group-head::before {
  background: var(--dsw-alias-label-tertiary, #8a919c);
}
.cmp-picker-group-count {
  font-weight: 400;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary, #8a919c);
  background: rgba(128, 133, 140, 0.12);
  border-radius: 999px;
  padding: 0 7px;
  line-height: 16px;
}
.cmp-picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 10px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: var(--dsw-alias-label-primary, #1f2329);
}
.cmp-picker-row:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 133, 140, 0.12));
}
.cmp-picker-row:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary, #3964fe));
}
.cmp-picker-row[data-selected='true'] {
  background: var(--dsw-alias-brand-primary-soft, rgba(57, 100, 254, 0.1));
  color: var(--dsw-alias-label-primary, #f0f2f5);
}
.cmp-picker-row:disabled {
  opacity: 0.6;
  cursor: default;
}
.cmp-picker-row-main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.cmp-picker-row-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
}
/* Selected name keeps the theme's primary text color: the brand-text token is
   the color for text ON the brand color (a light-theme design value) and
   resolves dark in dark themes — wrong on the soft brand highlight. */
.cmp-picker-row[data-selected='true'] .cmp-picker-row-name {
  color: var(--dsw-alias-label-primary, #f0f2f5);
  font-weight: 600;
}
.cmp-picker-row-desc {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-tertiary, #8a919c);
}
.cmp-picker-cap {
  flex: none;
  padding: 0 6px;
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-1, rgba(128, 133, 140, 0.12));
  color: var(--dsw-alias-label-secondary, #5f6672);
  font-size: 11px;
  line-height: 18px;
  font-weight: 500;
}
.cmp-picker-badge {
  flex: none;
  padding: 1px 7px;
  border-radius: 999px;
  background: var(--dsw-alias-menu-group-header-fill, rgba(128, 133, 140, 0.14));
  color: var(--dsw-alias-label-secondary, #5f6672);
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
}
.cmp-picker-badge-current {
  flex: none;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 1px 7px;
  border-radius: 999px;
  background: var(--dsw-alias-brand-primary-soft, rgba(57, 100, 254, 0.12));
  color: var(--dsw-alias-brand-text, var(--dsw-alias-brand-primary, #3964fe));
  font-size: 11px;
  line-height: 16px;
  font-weight: 600;
}
.cmp-picker-check {
  flex: none;
  display: grid;
  place-items: center;
  color: var(--dsw-alias-brand-primary, #3964fe);
}
.cmp-picker-spin {
  flex: none;
  width: 14px;
  height: 14px;
  border: 2px solid var(--dsw-alias-state-idle-primary, rgba(128, 133, 140, 0.35));
  border-top-color: var(--dsw-alias-brand-primary, #3964fe);
  border-radius: 50%;
  animation: cmp-picker-rotate 700ms linear infinite;
}
@keyframes cmp-picker-rotate {
  to { transform: rotate(360deg); }
}
.cmp-picker-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 26px 12px;
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-tertiary, #8a919c);
}
.cmp-picker-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 4px 8px 8px;
  padding: 8px 10px;
  border-radius: 10px;
  background: var(--dsw-alias-state-error-primary, rgba(208, 48, 80, 0.1));
  color: var(--dsw-alias-state-error-primary, #d03050);
  font-size: 12px;
  line-height: 18px;
}
.cmp-picker-warning {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 4px 8px;
  padding: 8px 10px;
  border-radius: 10px;
  background: var(--dsw-alias-state-warn-primary, rgba(216, 134, 28, 0.12));
  color: var(--dsw-alias-state-warn-primary, #b0761a);
  font-size: 12px;
  line-height: 18px;
}
.cmp-picker-warning button,
.cmp-picker-notice button {
  flex: none;
  margin-left: auto;
  padding: 1px 8px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: inherit;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  cursor: pointer;
}
.cmp-picker-warning button:hover,
.cmp-picker-notice button:hover {
  background: rgba(128, 133, 140, 0.14);
}
.cmp-picker-foot {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-top: 1px solid var(--dsw-alias-border-l1, #e4e7ec);
}
.cmp-picker-foot-current {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary, #5f6672);
}
.cmp-picker-foot-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #1f2329);
}
.cmp-picker-foot-close {
  flex: none;
  padding: 5px 14px;
  border: 1px solid var(--dsw-alias-border-l1, #e4e7ec);
  border-radius: 9px;
  background: transparent;
  color: var(--dsw-alias-label-primary, #1f2329);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  cursor: pointer;
}
.cmp-picker-foot-close:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 133, 140, 0.12));
}
`

    // ── helpers ──────────────────────────────────────────────────────────────
    /** Provider display order: account and official first, others keep catalog order. */
    function orderGroups(groups) {
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

    function providerLabel(group, t) {
      return group.id === 'deepseek-account' ? t('provider.account') : (group.name || group.id)
    }

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
     */
    async function loadInputModalities(settings) {
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
    function tagsFor(model, group, inputMap) {
      const mods = inputMap !== null ? inputMap?.[group.id]?.[model.id] : undefined
      if (mods === undefined || mods.length === 0) return []
      const tags = []
      if (mods.includes('text')) tags.push({ key: 'text', label: '📝 文本' })
      if (mods.includes('image')) tags.push({ key: 'image', label: '🖼️ 图像' })
      return tags
    }

    /** Case-insensitive substring match on model name (and provider id/name). */
    function matches(model, group, query) {
      const q = query.trim().toLowerCase()
      if (q === '') return true
      if (model.name.toLowerCase().includes(q)) return true
      if (model.id.toLowerCase().includes(q)) return true
      if (group.id.toLowerCase().includes(q)) return true
      return group.name?.toLowerCase().includes(q) ?? false
    }

    /** Fill a template string: 'a {x} b' with {x: 'v'}. */
    function fill(template, params) {
      return template.replace(/\{(\w+)\}/g, (_, key) => (params[key] === undefined ? '' : String(params[key])))
    }

    // Inline icons (16px, currentColor).
    const IconGrid = () => h('svg', { viewBox: '0 0 16 16', width: 16, height: 16, fill: 'currentColor', 'aria-hidden': true },
      h('rect', { x: 3, y: 3, width: 4, height: 4, rx: 1.2 }),
      h('rect', { x: 9, y: 3, width: 4, height: 4, rx: 1.2 }),
      h('rect', { x: 3, y: 9, width: 4, height: 4, rx: 1.2 }),
      h('rect', { x: 9, y: 9, width: 4, height: 4, rx: 1.2 }),
    )
    const IconSearch = () => h('svg', { viewBox: '0 0 16 16', width: 14, height: 14, fill: 'none', 'aria-hidden': true },
      h('circle', { cx: 7, cy: 7, r: 4.5, stroke: 'currentColor', strokeWidth: 1.5 }),
      h('path', { d: 'M10.5 10.5 L13.5 13.5', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }),
    )
    const IconCheck = () => h('svg', { viewBox: '0 0 16 16', width: 15, height: 15, fill: 'none', 'aria-hidden': true },
      h('path', { d: 'M3 8.5 L6.2 11.7 L13 4.8', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
    )
    const IconClose = () => h('svg', { viewBox: '0 0 16 16', width: 14, height: 14, fill: 'none', 'aria-hidden': true },
      h('path', { d: 'M4 4 L12 12 M12 4 L4 12', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }),
    )
    const IconChip = () => h('svg', { viewBox: '0 0 16 16', width: 14, height: 14, fill: 'none', 'aria-hidden': true },
      h('rect', { x: 4.5, y: 4.5, width: 7, height: 7, rx: 2, stroke: 'currentColor', strokeWidth: 1.3 }),
      h('path', { d: 'M8 4.5 V3.2 M8 12.8 V11.5 M4.5 8 H3.2 M12.8 8 H11.5', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' }),
    )
    const IconCaret = () => h('svg', { viewBox: '0 0 16 16', width: 12, height: 12, fill: 'none', 'aria-hidden': true },
      h('path', { d: 'M4 6 L8 10 L12 6', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
    )

    /** Stable snapshot used while the session's directory is unavailable. */
    const EMPTY_STATE = Object.freeze({ current: null, routable: null, groups: [], failures: [], status: 'idle', pending: null, error: null })

    // ── the composer seat component ───────────────────────────────────────────
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
      const [notice, setNotice] = useState(null)          // { text: string } selection failure
      const [highlight, setHighlight] = useState(0)        // search keyboard index
      const searchRef = useRef(null)

      const busy = state.pending !== null
      const firstLoad = state.groups.length === 0 && (state.status === 'loading' || state.status === 'idle')

      // Close on Escape (capture: the composer also handles Escape). A nested
      // open provider menu closes first.
      useEffect(() => {
        if (!open) return
        const onKey = event => {
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            if (filterOpen) setFilterOpen(false)
            else setOpen(false)
          }
        }
        window.addEventListener('keydown', onKey, true)
        return () => window.removeEventListener('keydown', onKey, true)
      }, [open, filterOpen])

      // Focus the search field on open.
      useEffect(() => {
        if (!open) return
        const timer = window.setTimeout(() => { searchRef.current?.focus() }, 40)
        return () => window.clearTimeout(timer)
      }, [open])

      const groups = useMemo(() => orderGroups(state.groups), [state.groups])
      const filtered = useMemo(() => {
        const q = query.trim()
        const rows = []
        for (const group of groups) {
          if (providerFilter !== 'all' && group.id !== providerFilter) continue
          const models = group.models.filter(model => matches(model, group, q))
          if (models.length === 0) continue
          for (const model of models) rows.push({ group, model })
        }
        return rows
      }, [groups, query, providerFilter])
      const modelCount = useMemo(() => groups.reduce((n, g) => n + g.models.length, 0), [groups])

      const selectedIndex = filtered.findIndex(row =>
        state.current !== null && row.group.id === state.current.provider && row.model.id === state.current.model)
      const activeIndex = Math.min(Math.max(highlight, 0), filtered.length - 1)

      // Reset highlight whenever the query, provider filter or dialog changes.
      useEffect(() => { setHighlight(0) }, [query, providerFilter, open])

      const openDialog = () => {
        setNotice(null)
        setQuery('')
        setFilterOpen(false)
        setOpen(true)
        if (usable) directory.load().catch(() => { /* the error lands on the store */ })
      }

      const choose = async (group, model) => {
        if (!usable || busy) return
        const sameRoute = state.current !== null
          && state.current.provider === group.id && state.current.model === model.id
        const reasoningEffort = sameRoute
          ? state.current.reasoningEffort ?? model.reasoning?.defaultEffort
          : model.reasoning?.defaultEffort
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
        setOpen(false)
        setQuery('')
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
          className: 'cmp-picker-trigger',
          'data-cmp-state': 'unavailable',
          title: L('trigger.unavailable'),
          'aria-label': L('trigger.unavailable'),
          disabled: true,
        }, h(IconGrid))
      }

      const button = h('button', {
        type: 'button',
        className: 'cmp-picker-trigger',
        title: L('trigger.label'),
        'aria-label': L('trigger.aria'),
        onClick: openDialog,
      }, h(IconGrid))

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

      const dialog = h('div', {
        className: 'cmp-picker-overlay',
        onMouseDown: event => {
          if (event.target === event.currentTarget) setOpen(false)
        },
      },
        h('div', {
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
              onClick: () => setOpen(false),
            }, h(IconClose)),
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
                h('span', { className: 'cmp-picker-filter-caret' }, h(IconCaret)),
              ),
              filterOpen && h('div', { className: 'cmp-picker-filter-menu', role: 'listbox' },
                h('button', {
                  type: 'button',
                  role: 'option',
                  'aria-selected': providerFilter === 'all' ? 'true' : 'false',
                  className: 'cmp-picker-filter-opt',
                  'data-selected': providerFilter === 'all' ? 'true' : 'false',
                  onClick: () => { setProviderFilter('all'); setFilterOpen(false) },
                },
                  h('span', { className: 'cmp-picker-filter-opt-check' }, providerFilter === 'all' ? h(IconCheck) : null),
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
                  h('span', { className: 'cmp-picker-filter-opt-check' }, providerFilter === group.id ? h(IconCheck) : null),
                  h('span', null, providerLabel(group, L)),
                )),
              ),
            ),
            h('div', { className: 'cmp-picker-search-field' },
              h('span', { className: 'cmp-picker-search-icon' }, h(IconSearch)),
              h('input', {
                ref: searchRef,
                type: 'text',
                role: 'searchbox',
                placeholder: L('search.placeholder'),
                value: query,
                onKeyDown: onSearchKeyDown,
                onChange: event => setQuery(event.target.value),
              }),
              query !== '' && h('button', {
                type: 'button', className: 'cmp-picker-search-clear', 'aria-label': L('search.clear'),
                onClick: () => { setQuery(''); searchRef.current?.focus() },
              }, h(IconClose)),
            ),
          ),
          // Body
          h('div', { className: 'cmp-picker-body' },
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
            // Provider groups
            groups.map(group => {
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
                      const index = Math.max(filtered.findIndex(r => r.model === model && r.group === group), 0)
                      setHighlight(current => current === index ? current : index)
                    },
                    onClick: () => { void choose(group, model) },
                  },
                    h('div', { className: 'cmp-picker-row-main' },
                      h('span', { className: 'cmp-picker-row-name', title: model.name }, model.name),
                      unreasoningBadge(model) && h('span', { className: 'cmp-picker-badge' }, L('badge.reasoning')),
                      tagsFor(model, group, inputMap).map(tag => h('span', { key: tag.key, className: 'cmp-picker-cap' }, tag.label)),
                    ),
                    selected
                      ? h('span', { className: 'cmp-picker-badge-current' },
                          pendingHere ? h('span', { className: 'cmp-picker-spin' }) : h(IconCheck),
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
              h(IconChip),
              h('span', { className: 'cmp-picker-foot-name', title: currentLabel }, currentLabel),
            ),
            h('button', { type: 'button', className: 'cmp-picker-foot-close', onClick: () => setOpen(false) }, L('foot.close')),
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
        style.textContent = CSS
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
    exports.name = 'dsh-model-picker'
    return module.exports
  },
})
