/** All styles for dsh-model-picker — theme-token driven, injected once. */
export const CSS = `
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
/* Provider name shown beside the model name in MRU rows (secondary text). */
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
   mirroring the provider filter — no native <select>). */
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
`
