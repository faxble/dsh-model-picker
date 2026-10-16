/** Inline SVG icons (16px, currentColor). Each is a function of `h` (React.createElement). */

export const IconGrid = h => () => h('svg', { viewBox: '0 0 16 16', width: 16, height: 16, fill: 'currentColor', 'aria-hidden': true },
  h('rect', { x: 3, y: 3, width: 4, height: 4, rx: 1.2 }),
  h('rect', { x: 9, y: 3, width: 4, height: 4, rx: 1.2 }),
  h('rect', { x: 3, y: 9, width: 4, height: 4, rx: 1.2 }),
  h('rect', { x: 9, y: 9, width: 4, height: 4, rx: 1.2 }),
)

export const IconSearch = h => () => h('svg', { viewBox: '0 0 16 16', width: 14, height: 14, fill: 'none', 'aria-hidden': true },
  h('circle', { cx: 7, cy: 7, r: 4.5, stroke: 'currentColor', strokeWidth: 1.5 }),
  h('path', { d: 'M10.5 10.5 L13.5 13.5', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }),
)

export const IconCheck = h => () => h('svg', { viewBox: '0 0 16 16', width: 15, height: 15, fill: 'none', 'aria-hidden': true },
  h('path', { d: 'M3 8.5 L6.2 11.7 L13 4.8', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
)

export const IconClose = h => () => h('svg', { viewBox: '0 0 16 16', width: 14, height: 14, fill: 'none', 'aria-hidden': true },
  h('path', { d: 'M4 4 L12 12 M12 4 L4 12', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }),
)

export const IconChip = h => () => h('svg', { viewBox: '0 0 16 16', width: 14, height: 14, fill: 'none', 'aria-hidden': true },
  h('rect', { x: 4.5, y: 4.5, width: 7, height: 7, rx: 2, stroke: 'currentColor', strokeWidth: 1.3 }),
  h('path', { d: 'M8 4.5 V3.2 M8 12.8 V11.5 M4.5 8 H3.2 M12.8 8 H11.5', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' }),
)

export const IconCaret = h => () => h('svg', { viewBox: '0 0 16 16', width: 12, height: 12, fill: 'none', 'aria-hidden': true },
  h('path', { d: 'M4 6 L8 10 L12 6', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
)

export const IconClock = h => () => h('svg', { viewBox: '0 0 16 16', width: 14, height: 14, fill: 'none', 'aria-hidden': true },
  h('circle', { cx: 8, cy: 8, r: 5.5, stroke: 'currentColor', strokeWidth: 1.4 }),
  h('path', { d: 'M8 5 V8 L10.2 9.4', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }),
)
