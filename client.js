/* dsh-model-picker — generated from src/ by `pnpm build`. Do not edit directly. */

// src/dict.js
var zh = {
  "trigger.label": "\u6A21\u578B\u901F\u9009",
  "trigger.aria": "\u6253\u5F00\u6A21\u578B\u901F\u9009\u7A97\u53E3",
  "trigger.unavailable": "\u6A21\u578B\u76EE\u5F55\u52A0\u8F7D\u4E2D\u2026",
  "filter.all": "\u5168\u90E8\u63D0\u4F9B\u5546",
  "filter.provider": "\u6309\u63D0\u4F9B\u5546\u7B5B\u9009",
  "dialog.title": "\u9009\u62E9\u6A21\u578B",
  "dialog.subtitle": "{providers} \u4E2A\u63D0\u4F9B\u5546 \xB7 {models} \u4E2A\u6A21\u578B",
  "search.placeholder": "\u641C\u7D22\u6A21\u578B\u2026",
  "search.clear": "\u6E05\u9664\u641C\u7D22",
  "search.empty": "\u6CA1\u6709\u5339\u914D\u7684\u6A21\u578B\u3002",
  "empty.models": "\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u3002",
  "loading.models": "\u6B63\u5728\u52A0\u8F7D\u6A21\u578B\u5217\u8868\u2026",
  "loading.selecting": "\u6B63\u5728\u5207\u6362\u6A21\u578B\u2026",
  "error.load": "\u6A21\u578B\u5217\u8868\u52A0\u8F7D\u5931\u8D25\uFF1A{message}",
  "error.select": "\u6A21\u578B\u5207\u6362\u5931\u8D25\uFF1A{message}",
  "error.sessionInUse": "\u5F53\u524D\u4F1A\u8BDD\u5DF2\u88AB\u5360\u7528\uFF08\u53EF\u80FD\u7531\u5176\u4ED6\u6B63\u5728\u8FD0\u884C\u7684 DSH \u5B9E\u4F8B\u4F7F\u7528\uFF09\uFF0C\u8BF7\u9000\u51FA\u540E\u91CD\u8BD5\u3002",
  "retry": "\u91CD\u8BD5",
  "badge.reasoning": "\u63A8\u7406",
  "badge.current": "\u5F53\u524D",
  "badge.unroutable": "\u5F53\u524D\u6A21\u578B\u5DF2\u4E0D\u5728\u53EF\u7528\u5217\u8868",
  "badge.recent": "\u6700\u8FD1\u4F7F\u7528",
  "warning.groupLoad": "{name} \u52A0\u8F7D\u5931\u8D25\uFF1A{message}",
  "foot.current": "\u5F53\u524D",
  "foot.close": "\u5173\u95ED",
  "provider.account": "DeepSeek \u8D26\u53F7",
  "tag.text": "\u{1F4DD} \u6587\u672C",
  "tag.image": "\u{1F5BC}\uFE0F \u56FE\u50CF"
};
var en = {
  "trigger.label": "Model picker",
  "trigger.aria": "Open model picker",
  "trigger.unavailable": "Model directory is loading\u2026",
  "filter.all": "All providers",
  "filter.provider": "Filter by provider",
  "dialog.title": "Select model",
  "dialog.subtitle": "{providers} providers \xB7 {models} models",
  "search.placeholder": "Search models\u2026",
  "search.clear": "Clear search",
  "search.empty": "No matching models.",
  "empty.models": "No models available.",
  "loading.models": "Loading models\u2026",
  "loading.selecting": "Switching model\u2026",
  "error.load": "Failed to load models: {message}",
  "error.select": "Failed to switch model: {message}",
  "error.sessionInUse": "This session is in use by another running DSH instance. Quit it and try again.",
  "retry": "Retry",
  "badge.reasoning": "Reasoning",
  "badge.current": "Current",
  "badge.unroutable": "Current model is no longer available",
  "badge.recent": "Recent",
  "warning.groupLoad": "{name} failed to load: {message}",
  "foot.current": "Current",
  "foot.close": "Close",
  "provider.account": "DeepSeek Account",
  "tag.text": "\u{1F4DD} Text",
  "tag.image": "\u{1F5BC}\uFE0F Image"
};

// src/style.js
var CSS = `
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
   resolves dark in dark themes \u2014 wrong on the soft brand highlight. */
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
/* Provider prefix shown to the LEFT of the model name in MRU rows \u2014
   reads as "provider \xB7 model". Secondary text, capped so it never
   crowds the model name. */
.cmp-picker-row-provider {
  flex: none;
  max-width: 132px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-tertiary, #8a919c);
}
.cmp-picker-row-provider::after {
  content: ' \xB7 ';
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
/* P2-10: visually hidden but exposed to screen readers (aria-live region). */
.cmp-picker-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
/* P2-12: reasoning-effort selector in the footer (custom dropdown,
   mirroring the provider filter \u2014 no native <select>). */
.cmp-picker-effort {
  position: relative;
  flex: none;
}
.cmp-picker-effort-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--dsw-alias-border-l1, #e4e7ec);
  border-radius: 8px;
  outline: none;
  background: var(--dsw-alias-bg-base, rgba(128, 133, 140, 0.08));
  color: var(--dsw-alias-label-primary, #1f2329);
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
}
.cmp-picker-effort-trigger:focus-visible {
  box-shadow: 0 0 0 1.5px var(--dsw-focus-ring-color, rgba(57, 100, 254, 0.45));
}
.cmp-picker-effort-value {
  max-width: 110px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cmp-picker-effort-menu {
  position: absolute;
  bottom: calc(100% + 4px);
  right: 0;
  z-index: 3010;
  width: 180px;
  max-height: 240px;
  overflow-y: auto;
  padding: 4px;
  border: 1px solid var(--dsw-alias-border-l1, #e4e7ec);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-2, #ffffff);
  box-shadow: var(--dsw-elevation-prominent, 0 8px 24px rgba(0, 0, 0, 0.2));
}
/* P3-13: recent-selections group. */
.cmp-picker-recent .cmp-picker-group-head {
  color: var(--dsw-alias-label-secondary, #5f6672);
}
.cmp-picker-recent .cmp-picker-group-head::before {
  background: var(--dsw-alias-brand-primary, #3964fe);
}
`;

// src/pure.js
function orderGroups(groups) {
  const seen = /* @__PURE__ */ new Set();
  const unique = groups.filter((group) => {
    if (seen.has(group.id)) return false;
    seen.add(group.id);
    return true;
  });
  return unique.sort((left, right) => {
    const rank = (id) => id === "deepseek-account" ? 0 : id === "deepseek-official" ? 1 : 2;
    return rank(left.id) - rank(right.id);
  });
}
function providerLabel(group, t) {
  return group.id === "deepseek-account" ? t("provider.account") : group.name || group.id;
}
var EMPTY_STATE = Object.freeze({ current: null, routable: null, groups: [], failures: [], status: "idle", pending: null, error: null });
async function loadInputModalities(settings) {
  const map = {};
  if (settings === void 0 || typeof settings.describe !== "function") return map;
  try {
    const describe = await settings.describe();
    if (!describe.ok) return map;
    for (const ns of describe.value.namespaces) {
      const providers = ns.value?.providers;
      if (providers === null || typeof providers !== "object" || Array.isArray(providers)) continue;
      for (const [providerId, profile] of Object.entries(providers)) {
        if (profile === null || typeof profile !== "object" || Array.isArray(profile)) continue;
        const models = profile.models;
        if (!Array.isArray(models)) continue;
        const perModel = {};
        for (const model of models) {
          if (model !== null && typeof model === "object" && typeof model.id === "string" && Array.isArray(model.input) && model.input.length > 0) {
            perModel[model.id] = [...model.input];
          }
        }
        if (Object.keys(perModel).length > 0) map[providerId] = perModel;
      }
    }
  } catch {
  }
  return map;
}
function tagsFor(model, group, inputMap, L) {
  const mods = inputMap !== null ? inputMap?.[group.id]?.[model.id] : void 0;
  if (mods === void 0 || mods.length === 0) return [];
  const tags = [];
  if (mods.includes("text")) tags.push({ key: "text", label: L("tag.text") });
  if (mods.includes("image")) tags.push({ key: "image", label: L("tag.image") });
  return tags;
}
function fill(template, params) {
  return template.replace(/\{(\w+)\}/g, (_, key) => params[key] === void 0 ? "" : String(params[key]));
}
function searchScore(model, group, query) {
  const q = query.trim().toLowerCase();
  if (q === "") return 1;
  const name = model.name.toLowerCase();
  const id = model.id.toLowerCase();
  const gid = group.id.toLowerCase();
  if (name === q || id === q) return 6;
  if (name.startsWith(q) || id.startsWith(q)) return 5;
  if (name.includes(q) || id.includes(q)) return 4;
  if (gid === q) return 3;
  if (gid.includes(q) || group.name?.toLowerCase().includes(q)) return 2;
  return 0;
}
function searchRows(groups, providerFilter, query) {
  const q = query.trim();
  const rows = [];
  for (const group of groups) {
    if (providerFilter !== "all" && group.id !== providerFilter) continue;
    for (const model of group.models) {
      const score = searchScore(model, group, q);
      if (score <= 0) continue;
      rows.push({ group, model, score });
    }
  }
  rows.sort((a, b) => b.score - a.score);
  return rows;
}
var STORAGE_KEY = "dsh-model-picker:mru";
var DEFAULT_MAX = 8;
function loadMRU(storage = null, max = DEFAULT_MAX) {
  try {
    const src = storage ?? globalThis.localStorage;
    const raw = src?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === "string").slice(0, max);
  } catch {
    return [];
  }
}
function saveMRU(list, storage = null) {
  try {
    const src = storage ?? globalThis.localStorage;
    src?.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
  }
}
function recordMRU(list, provider, model, max = DEFAULT_MAX) {
  const key = `${provider}\0${model}`;
  const next = [key, ...list.filter((k) => k !== key)];
  return next.slice(0, max);
}
function resolveMRU(list, groups) {
  const byKey = /* @__PURE__ */ new Map();
  for (const group of groups) {
    for (const model of group.models) byKey.set(`${group.id}\0${model.id}`, { group, model });
  }
  const out = [];
  for (const key of list) {
    const resolved = byKey.get(key);
    if (resolved !== void 0) out.push(resolved);
  }
  return out;
}

// src/icons.js
var IconGrid = (h) => () => h(
  "svg",
  { viewBox: "0 0 16 16", width: 16, height: 16, fill: "currentColor", "aria-hidden": true },
  h("rect", { x: 3, y: 3, width: 4, height: 4, rx: 1.2 }),
  h("rect", { x: 9, y: 3, width: 4, height: 4, rx: 1.2 }),
  h("rect", { x: 3, y: 9, width: 4, height: 4, rx: 1.2 }),
  h("rect", { x: 9, y: 9, width: 4, height: 4, rx: 1.2 })
);
var IconSearch = (h) => () => h(
  "svg",
  { viewBox: "0 0 16 16", width: 14, height: 14, fill: "none", "aria-hidden": true },
  h("circle", { cx: 7, cy: 7, r: 4.5, stroke: "currentColor", strokeWidth: 1.5 }),
  h("path", { d: "M10.5 10.5 L13.5 13.5", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" })
);
var IconCheck = (h) => () => h(
  "svg",
  { viewBox: "0 0 16 16", width: 15, height: 15, fill: "none", "aria-hidden": true },
  h("path", { d: "M3 8.5 L6.2 11.7 L13 4.8", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })
);
var IconClose = (h) => () => h(
  "svg",
  { viewBox: "0 0 16 16", width: 14, height: 14, fill: "none", "aria-hidden": true },
  h("path", { d: "M4 4 L12 12 M12 4 L4 12", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" })
);
var IconChip = (h) => () => h(
  "svg",
  { viewBox: "0 0 16 16", width: 14, height: 14, fill: "none", "aria-hidden": true },
  h("rect", { x: 4.5, y: 4.5, width: 7, height: 7, rx: 2, stroke: "currentColor", strokeWidth: 1.3 }),
  h("path", { d: "M8 4.5 V3.2 M8 12.8 V11.5 M4.5 8 H3.2 M12.8 8 H11.5", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" })
);
var IconCaret = (h) => () => h(
  "svg",
  { viewBox: "0 0 16 16", width: 12, height: 12, fill: "none", "aria-hidden": true },
  h("path", { d: "M4 6 L8 10 L12 6", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" })
);
var IconClock = (h) => () => h(
  "svg",
  { viewBox: "0 0 16 16", width: 14, height: 14, fill: "none", "aria-hidden": true },
  h("circle", { cx: 8, cy: 8, r: 5.5, stroke: "currentColor", strokeWidth: 1.4 }),
  h("path", { d: "M8 5 V8 L10.2 9.4", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" })
);

// src/entry.js
window.__ModuleLoader__.load({
  id: "dsh-model-picker",
  factory: (require2) => {
    const module = { exports: {} };
    const exports = module.exports;
    const React = require2("react");
    const {
      createElement: h,
      Fragment,
      useState,
      useEffect,
      useMemo,
      useRef,
      useSyncExternalStore,
      useCallback
    } = React;
    let createPortal = null;
    try {
      const reactDom = require2("react-dom");
      if (typeof reactDom?.createPortal === "function") createPortal = reactDom.createPortal;
    } catch {
      createPortal = null;
    }
    const ID = "dsh-model-picker";
    const NS = "dshModelPicker";
    const inject = ["slots", "locale", "remote", "remote.settings"];
    const G = IconGrid(h);
    const S = IconSearch(h);
    const CK = IconCheck(h);
    const X = IconClose(h);
    const CP = IconChip(h);
    const CA = IconCaret(h);
    const CL = IconClock(h);
    function ModelPickerButton(props) {
      const { resolve, t, settings } = props;
      const L = typeof t === "function" ? t : (key) => key;
      const [directory, setDirectory] = useState(null);
      useEffect(() => {
        if (typeof resolve !== "function") return;
        let alive = true;
        let timer = null;
        let tries = 0;
        const attempt = () => {
          if (!alive) return;
          let resolved = null;
          try {
            resolved = resolve();
          } catch (error) {
            console.error("[dsh-model-picker] resolve threw:", error);
          }
          if (resolved !== null) {
            setDirectory(resolved);
            return;
          }
          tries += 1;
          if (tries <= 40) timer = setTimeout(attempt, 250);
        };
        timer = setTimeout(attempt, 0);
        return () => {
          alive = false;
          if (timer !== null) clearTimeout(timer);
        };
      }, [resolve]);
      const usable = directory !== null;
      const state = useSyncExternalStore(
        (fn) => usable ? directory.store.subscribe(fn) : () => {
        },
        () => usable ? directory.store.getSnapshot() : EMPTY_STATE
      );
      const [inputMap, setInputMap] = useState(null);
      useEffect(() => {
        if (settings === void 0) return;
        let alive = true;
        loadInputModalities(settings).then((map) => {
          if (alive) setInputMap(map);
        });
        return () => {
          alive = false;
        };
      }, [settings]);
      const [open, setOpen] = useState(false);
      const [query, setQuery] = useState("");
      const [providerFilter, setProviderFilter] = useState("all");
      const [filterOpen, setFilterOpen] = useState(false);
      const [effortOpen, setEffortOpen] = useState(false);
      const [notice, setNotice] = useState(null);
      const [highlight, setHighlight] = useState(0);
      const [renderedCount, setRenderedCount] = useState(12);
      const [mru, setMru] = useState([]);
      const searchRef = useRef(null);
      const triggerRef = useRef(null);
      const modalRef = useRef(null);
      const bodyRef = useRef(null);
      const busy = state.pending !== null;
      const firstLoad = state.groups.length === 0 && (state.status === "loading" || state.status === "idle");
      useEffect(() => {
        if (open) setMru(loadMRU());
      }, [open]);
      useEffect(() => {
        if (!open) return;
        const el = bodyRef.current;
        if (el === null) return;
        const onScroll = () => {
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 160) {
            setRenderedCount((n) => Math.min(n + 12, 200));
          }
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
      }, [open, renderedCount]);
      useEffect(() => {
        if (!open) return;
        const onKey = (event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            if (filterOpen) setFilterOpen(false);
            else if (effortOpen) setEffortOpen(false);
            else closeDialog();
          }
        };
        window.addEventListener("keydown", onKey, true);
        return () => window.removeEventListener("keydown", onKey, true);
      }, [open, filterOpen]);
      useEffect(() => {
        if (!open) return;
        const modal = modalRef.current;
        if (modal === null) return;
        const onKeyDown = (event) => {
          if (event.key !== "Tab") return;
          const focusables = modal.querySelectorAll(
            'button, input, [href], [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
            event.preventDefault();
            first.focus();
          }
        };
        modal.addEventListener("keydown", onKeyDown);
        return () => modal.removeEventListener("keydown", onKeyDown);
      }, [open, filterOpen]);
      useEffect(() => {
        if (!open) return;
        const timer = window.setTimeout(() => {
          searchRef.current?.focus();
        }, 40);
        return () => window.clearTimeout(timer);
      }, [open]);
      useEffect(() => {
        if (!open) triggerRef.current?.focus();
      }, [open]);
      const groups = useMemo(() => orderGroups(state.groups), [state.groups]);
      const filtered = useMemo(() => searchRows(groups, providerFilter, query), [groups, providerFilter, query]);
      const modelCount = useMemo(() => groups.reduce((n, g) => n + g.models.length, 0), [groups]);
      const recentRows = useMemo(() => {
        if (query.trim() !== "" || providerFilter !== "all") return [];
        return resolveMRU(mru, groups);
      }, [mru, groups, query, providerFilter]);
      const activeIndex = Math.min(Math.max(highlight, 0), filtered.length - 1);
      useEffect(() => {
        setHighlight(0);
      }, [query, providerFilter, open]);
      useEffect(() => {
        if (open) setRenderedCount(12);
      }, [open]);
      useEffect(() => {
        if (!effortOpen) return;
        const onDown = (event) => {
          if (!event.target.closest(".cmp-picker-effort")) setEffortOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
      }, [effortOpen]);
      const closeDialog = useCallback(() => {
        setFilterOpen(false);
        setEffortOpen(false);
        setOpen(false);
        setNotice(null);
      }, []);
      const openDialog = () => {
        setNotice(null);
        setQuery("");
        setFilterOpen(false);
        setEffortOpen(false);
        setRenderedCount(12);
        setOpen(true);
        if (usable) directory.load().catch(() => {
        });
      };
      const choose = async (group, model, reasoningEffortOverride, keepOpen = false) => {
        if (!usable || busy) return;
        const sameRoute = state.current !== null && state.current.provider === group.id && state.current.model === model.id;
        const reasoningEffort = reasoningEffortOverride !== void 0 ? reasoningEffortOverride : sameRoute ? state.current.reasoningEffort ?? model.reasoning?.defaultEffort : model.reasoning?.defaultEffort;
        const selection = {
          provider: group.id,
          model: model.id,
          ...reasoningEffort === void 0 ? {} : { reasoningEffort }
        };
        setNotice(null);
        let result;
        try {
          result = await directory.select(selection);
        } catch (error) {
          setNotice(fill(L("error.select"), { message: error instanceof Error ? error.message : String(error) }));
          return;
        }
        if (result && result.ok === false) {
          setNotice(result.error.code === "session/writer-held" ? L("error.sessionInUse") : fill(L("error.select"), { message: `${result.error.code}: ${result.error.message}` }));
          return;
        }
        setMru((prev) => {
          const next = recordMRU(prev, group.id, model.id);
          saveMRU(next);
          return next;
        });
        if (!keepOpen) {
          setOpen(false);
          setQuery("");
        } else {
          setEffortOpen(false);
        }
      };
      const reload = () => {
        setNotice(null);
        if (usable) directory.load().catch(() => {
        });
      };
      const onSearchKeyDown = (event) => {
        if (event.nativeEvent?.isComposing) return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          if (filtered.length === 0) return;
          const dir = event.key === "ArrowDown" ? 1 : -1;
          setHighlight((activeIndex + dir + filtered.length) % filtered.length);
          return;
        }
        if (event.key === "Enter") {
          event.preventDefault();
          const row = filtered[activeIndex];
          if (row !== void 0 && !busy) void choose(row.group, row.model);
          return;
        }
      };
      if (!usable) {
        return h("button", {
          type: "button",
          ref: triggerRef,
          className: "cmp-picker-trigger",
          "data-cmp-state": "unavailable",
          title: L("trigger.unavailable"),
          "aria-label": L("trigger.unavailable"),
          disabled: true
        }, G());
      }
      const button = h("button", {
        type: "button",
        ref: triggerRef,
        className: "cmp-picker-trigger",
        title: L("trigger.label"),
        "aria-label": L("trigger.aria"),
        onClick: openDialog
      }, G());
      if (!open) return button;
      const current = state.current;
      const currentLabel = current === null ? L("dialog.title") : `${current.model}${current.reasoningEffort ? ` \xB7 ${current.reasoningEffort}` : ""}`;
      const unreasoningBadge = (model) => model.reasoning !== void 0 && model.reasoning.efforts?.length > 0;
      const filterLabel = providerFilter === "all" ? L("filter.all") : (() => {
        const g = groups.find((g2) => g2.id === providerFilter);
        return g !== void 0 ? providerLabel(g, L) : L("filter.all");
      })();
      const currentReasoning = (() => {
        if (current === null) return null;
        for (const group of groups) {
          if (group.id !== current.provider) continue;
          for (const model of group.models) {
            if (model.id !== current.model) continue;
            return model.reasoning ?? null;
          }
        }
        return null;
      })();
      const efforts = currentReasoning?.efforts?.filter((e) => e !== void 0) ?? [];
      const currentEffort = current?.reasoningEffort ?? currentReasoning?.defaultEffort;
      const dialog = h(
        "div",
        {
          className: "cmp-picker-overlay",
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) closeDialog();
          }
        },
        h(
          "div",
          {
            ref: modalRef,
            className: "cmp-picker-modal",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": L("dialog.title")
          },
          // Header
          h(
            "div",
            { className: "cmp-picker-head" },
            h("div", { className: "cmp-picker-title" }, L("dialog.title")),
            h(
              "div",
              { className: "cmp-picker-subtitle" },
              fill(L("dialog.subtitle"), { providers: groups.length, models: modelCount })
            ),
            h("button", {
              type: "button",
              className: "cmp-picker-close",
              "aria-label": L("foot.close"),
              onClick: closeDialog
            }, X())
          ),
          // Search + provider filter
          h(
            "div",
            { className: "cmp-picker-search" },
            h(
              "div",
              { className: "cmp-picker-filter" },
              h(
                "button",
                {
                  type: "button",
                  className: "cmp-picker-filter-trigger",
                  "aria-haspopup": "listbox",
                  "aria-expanded": filterOpen ? "true" : "false",
                  "aria-label": L("filter.provider"),
                  onClick: () => setFilterOpen((openState) => !openState)
                },
                h("span", { className: "cmp-picker-filter-value" }, filterLabel),
                h("span", { className: "cmp-picker-filter-caret" }, CA())
              ),
              filterOpen && h(
                "div",
                { className: "cmp-picker-filter-menu", role: "listbox", "aria-label": L("filter.provider") },
                h(
                  "button",
                  {
                    type: "button",
                    role: "option",
                    "aria-selected": providerFilter === "all" ? "true" : "false",
                    className: "cmp-picker-filter-opt",
                    "data-selected": providerFilter === "all" ? "true" : "false",
                    onClick: () => {
                      setProviderFilter("all");
                      setFilterOpen(false);
                    }
                  },
                  h("span", { className: "cmp-picker-filter-opt-check" }, providerFilter === "all" ? CK() : null),
                  h("span", null, L("filter.all"))
                ),
                groups.map((group) => h(
                  "button",
                  {
                    type: "button",
                    key: group.id,
                    role: "option",
                    "aria-selected": providerFilter === group.id ? "true" : "false",
                    className: "cmp-picker-filter-opt",
                    "data-selected": providerFilter === group.id ? "true" : "false",
                    onClick: () => {
                      setProviderFilter(group.id);
                      setFilterOpen(false);
                    }
                  },
                  h("span", { className: "cmp-picker-filter-opt-check" }, providerFilter === group.id ? CK() : null),
                  h("span", null, providerLabel(group, L))
                ))
              )
            ),
            h(
              "div",
              { className: "cmp-picker-search-field" },
              h("span", { className: "cmp-picker-search-icon" }, S()),
              h("input", {
                ref: searchRef,
                type: "text",
                role: "searchbox",
                "aria-label": L("search.placeholder"),
                placeholder: L("search.placeholder"),
                value: query,
                onKeyDown: onSearchKeyDown,
                onChange: (event) => setQuery(event.target.value)
              }),
              query !== "" && h("button", {
                type: "button",
                className: "cmp-picker-search-clear",
                "aria-label": L("search.clear"),
                onClick: () => {
                  setQuery("");
                  searchRef.current?.focus();
                }
              }, X())
            )
          ),
          // Body
          h(
            "div",
            { ref: bodyRef, className: "cmp-picker-body" },
            // P2-10: aria-live region announces status changes to screen readers.
            h(
              "div",
              { role: "status", "aria-live": "polite", className: "cmp-picker-sr-only" },
              state.status === "loading" ? L("loading.models") : state.status === "error" ? L("error.load") : notice !== null ? notice : ""
            ),
            state.error !== null && state.status === "error" && h(
              "div",
              { className: "cmp-picker-notice", role: "alert" },
              h("span", null, fill(L("error.load"), { message: state.error })),
              h("button", { type: "button", onClick: reload }, L("retry"))
            ),
            notice !== null && h(
              "div",
              { className: "cmp-picker-notice", role: "alert" },
              h("span", null, notice)
            ),
            state.routable === false && h(
              "div",
              { className: "cmp-picker-warning" },
              h("span", null, L("badge.unroutable"))
            ),
            state.failures.map((failure) => h(
              "div",
              { className: "cmp-picker-warning", key: `failure-${failure.id}` },
              h("span", null, fill(L("warning.groupLoad"), {
                name: failure.id === "deepseek-account" ? L("provider.account") : failure.name,
                message: failure.message
              })),
              h("button", { type: "button", onClick: reload }, L("retry"))
            )),
            firstLoad && h(
              "div",
              { className: "cmp-picker-status" },
              h("span", { className: "cmp-picker-spin" }),
              h("span", null, L("loading.models"))
            ),
            !firstLoad && state.groups.length === 0 && state.status !== "error" && h("div", { className: "cmp-picker-status" }, L("empty.models")),
            !firstLoad && filtered.length === 0 && state.groups.length > 0 && h("div", { className: "cmp-picker-status" }, L("search.empty")),
            // P3-13: recent selections section (only with no query / no filter).
            recentRows.length > 0 && h(
              "div",
              { className: "cmp-picker-group cmp-picker-recent", "data-provider": "other" },
              h(
                "div",
                { className: "cmp-picker-group-head" },
                h("span", null, CL()),
                h("span", null, L("badge.recent"))
              ),
              recentRows.map(({ group, model }) => {
                const selected = state.current !== null && state.current.provider === group.id && state.current.model === model.id;
                const pendingHere = state.pending !== null && state.pending.provider === group.id && state.pending.model === model.id;
                return h(
                  "button",
                  {
                    type: "button",
                    key: `${group.id}\0${model.id}`,
                    className: "cmp-picker-row",
                    "data-selected": selected ? "true" : "false",
                    disabled: busy,
                    title: model.description !== void 0 && model.description !== "" ? model.description : void 0,
                    onClick: () => {
                      void choose(group, model);
                    }
                  },
                  h(
                    "div",
                    { className: "cmp-picker-row-main" },
                    // Provider prefix on the LEFT of the model name, so MRU rows
                    // read as "provider · model" and stay unambiguous when the
                    // same model id exists under several providers.
                    h("span", { className: "cmp-picker-row-provider", title: providerLabel(group, L) }, providerLabel(group, L)),
                    h("span", { className: "cmp-picker-row-name", title: model.name }, model.name),
                    unreasoningBadge(model) && h("span", { className: "cmp-picker-badge" }, L("badge.reasoning")),
                    tagsFor(model, group, inputMap, L).map((tag) => h("span", { key: tag.key, className: "cmp-picker-cap" }, tag.label))
                  ),
                  selected ? h(
                    "span",
                    { className: "cmp-picker-badge-current" },
                    pendingHere ? h("span", { className: "cmp-picker-spin" }) : CK(),
                    h("span", null, L("badge.current"))
                  ) : pendingHere && h("span", { className: "cmp-picker-check" }, h("span", { className: "cmp-picker-spin" }))
                );
              })
            ),
            // Provider groups (P2-11: lazily rendered up to `renderedCount`).
            groups.slice(0, renderedCount).map((group) => {
              const models = filtered.filter((row) => row.group === group).map((row) => row.model);
              if (models.length === 0) return null;
              const groupLabel = providerLabel(group, L);
              const providerKey = group.id === "deepseek-account" ? "deepseek-account" : group.id === "deepseek-official" ? "deepseek-official" : "other";
              return h(
                "div",
                { key: group.id, className: "cmp-picker-group", "data-provider": providerKey },
                h(
                  "div",
                  { className: "cmp-picker-group-head" },
                  h("span", null, groupLabel),
                  h("span", { className: "cmp-picker-group-count" }, String(models.length))
                ),
                models.map((model) => {
                  const selected = state.current !== null && state.current.provider === group.id && state.current.model === model.id;
                  const pendingHere = state.pending !== null && state.pending.provider === group.id && state.pending.model === model.id;
                  return h(
                    "button",
                    {
                      type: "button",
                      key: model.id,
                      className: "cmp-picker-row",
                      "data-selected": selected ? "true" : "false",
                      disabled: busy,
                      title: model.description !== void 0 && model.description !== "" ? model.description : void 0,
                      onMouseMove: () => {
                        if (filtered.length === 0) return;
                        const index = Math.max(filtered.findIndex((r) => r.model === model && r.group === group), 0);
                        setHighlight((current2) => current2 === index ? current2 : index);
                      },
                      onClick: () => {
                        void choose(group, model);
                      }
                    },
                    h(
                      "div",
                      { className: "cmp-picker-row-main" },
                      h("span", { className: "cmp-picker-row-name", title: model.name }, model.name),
                      unreasoningBadge(model) && h("span", { className: "cmp-picker-badge" }, L("badge.reasoning")),
                      tagsFor(model, group, inputMap, L).map((tag) => h("span", { key: tag.key, className: "cmp-picker-cap" }, tag.label))
                    ),
                    selected ? h(
                      "span",
                      { className: "cmp-picker-badge-current" },
                      pendingHere ? h("span", { className: "cmp-picker-spin" }) : CK(),
                      h("span", null, L("badge.current"))
                    ) : pendingHere && h("span", { className: "cmp-picker-check" }, h("span", { className: "cmp-picker-spin" }))
                  );
                })
              );
            })
          ),
          // Footer
          h(
            "div",
            { className: "cmp-picker-foot" },
            h(
              "div",
              { className: "cmp-picker-foot-current" },
              CP(),
              h("span", { className: "cmp-picker-foot-name", title: currentLabel }, currentLabel)
            ),
            // P2-12: reasoning-effort selector (custom dropdown, theme-driven —
            // no native <select>, which renders a glaring system panel in dark
            // themes). Only shown when the current model exposes multiple efforts.
            efforts.length > 0 && h(
              "div",
              { className: "cmp-picker-effort" },
              h(
                "button",
                {
                  type: "button",
                  className: "cmp-picker-effort-trigger",
                  "aria-haspopup": "listbox",
                  "aria-expanded": effortOpen ? "true" : "false",
                  "aria-label": L("badge.reasoning"),
                  title: L("badge.reasoning"),
                  onClick: () => setEffortOpen((openState) => !openState)
                },
                h(
                  "span",
                  { className: "cmp-picker-effort-value" },
                  currentEffort !== void 0 ? efforts.find((e) => String(e.id) === String(currentEffort))?.name ?? String(currentEffort) : L("badge.reasoning")
                ),
                h("span", { className: "cmp-picker-filter-caret" }, CA())
              ),
              effortOpen && h(
                "div",
                { className: "cmp-picker-effort-menu", role: "listbox", "aria-label": L("badge.reasoning") },
                h(
                  "button",
                  {
                    type: "button",
                    role: "option",
                    "aria-selected": currentEffort === void 0 ? "true" : "false",
                    className: "cmp-picker-filter-opt",
                    "data-selected": currentEffort === void 0 ? "true" : "false",
                    onClick: () => {
                      setEffortOpen(false);
                      if (current !== null) void choose({ id: current.provider }, { id: current.model, reasoning: currentReasoning }, void 0, true);
                    }
                  },
                  h("span", { className: "cmp-picker-filter-opt-check" }, currentEffort === void 0 ? CK() : null),
                  h("span", null, L("badge.reasoning"))
                ),
                efforts.map((effort) => h(
                  "button",
                  {
                    type: "button",
                    key: String(effort.id),
                    role: "option",
                    "aria-selected": String(currentEffort) === String(effort.id) ? "true" : "false",
                    className: "cmp-picker-filter-opt",
                    "data-selected": String(currentEffort) === String(effort.id) ? "true" : "false",
                    onClick: () => {
                      setEffortOpen(false);
                      if (current !== null) void choose({ id: current.provider }, { id: current.model, reasoning: currentReasoning }, String(effort.id), true);
                    }
                  },
                  h("span", { className: "cmp-picker-filter-opt-check" }, String(currentEffort) === String(effort.id) ? CK() : null),
                  h("span", null, effort.name ?? String(effort.id))
                ))
              )
            ),
            h("button", { type: "button", className: "cmp-picker-foot-close", onClick: closeDialog }, L("foot.close"))
          )
        )
      );
      return h(
        Fragment,
        null,
        button,
        createPortal !== null ? createPortal(dialog, document.body) : dialog
      );
    }
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-model-picker: dictionaries");
      ctx.effect(() => {
        const style = document.createElement("style");
        style.setAttribute("data-plugin", ID);
        style.textContent = CSS;
        document.head.appendChild(style);
        return () => {
          style.remove();
        };
      }, "dsh-model-picker: styles");
      ctx.inject(["slots", "modelDirectories", "remote", "remote.settings"], (scope) => {
        const models = scope.modelDirectories;
        const remote = scope.remote;
        scope.effect(() => scope.slots.inject("conversation.input.right", () => scope.slots.register({
          name: "conversation.input.right",
          id: ID,
          order: 100,
          locale: NS,
          inject: (sessionId) => ({
            // Deliberately resolve lazily from the component: this seat renders
            // before the model seat, so calling directoryFor() here (at inject
            // time) can throw while the session wire is still warming up — and
            // the renderer caches that null face for the whole entry lifetime.
            resolve: () => {
              try {
                return models.directoryFor(sessionId);
              } catch (error) {
                console.error("[dsh-model-picker] directoryFor failed:", error);
                return null;
              }
            },
            // The injected `settings` Remote namespace for reading real
            // per-model input modalities (capability chips); optional, so a
            // build without it still renders rows without chips.
            settings: scope.remote.settings
          })
        }, ModelPickerButton)), "dsh-model-picker: composer entry");
      });
    }
    exports.apply = apply;
    exports.inject = inject;
    exports.name = "dsh-model-picker";
    return module.exports;
  }
});
