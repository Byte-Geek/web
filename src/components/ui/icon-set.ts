export const ICONS = {
  code: { markup: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>' },
  shield: { markup: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/> <path d="m9 12 2 2 4-4"/>' },
  layers: { markup: '<path d="m12 3 9 5-9 5-9-5z"/> <path d="m3 13 9 5 9-5"/>' },
  // Home service cards, as in the design: a shield with its right half filled, three stacked layers.
  shieldHalf: {
    markup:
      '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/> <path d="M12 6.2 17 8.1V12c0 3-2 5.5-5 6.6z" fill="currentColor" stroke="none"/>',
  },
  stack: { markup: '<path d="m12 3 9 4.5-9 4.5-9-4.5z"/> <path d="m3 12 9 4.5 9-4.5"/> <path d="m3 16.5 9 4.5 9-4.5"/>' },
  finger: { markup: '<path d="M7 10a5 5 0 0 1 10 0v3M12 10v6M9 12v4a3 3 0 0 0 1 2M15 14c0 3-1 5-2 6M5 14c0-6 2-9 7-9"/>' },
  search: { markup: '<circle cx="11" cy="11" r="6"/> <path d="m20 20-4.5-4.5"/>' },
  lock: { markup: '<rect x="5" y="10" width="14" height="10" rx="2"/> <path d="M8 10V7a4 4 0 0 1 8 0v3"/>' },
  check: { markup: '<circle cx="12" cy="12" r="9"/> <path d="m8 12 3 3 5-6"/>' },
  users: {
    markup:
      '<circle cx="9" cy="8" r="3"/> <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/> <circle cx="17" cy="9" r="2.5"/> <path d="M16 14c3 0 5 2 5 5"/>',
  },
  clock: { markup: '<circle cx="12" cy="12" r="9"/> <path d="M12 7v5l3 2"/>' },
  box: { markup: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/> <path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>' },
  badge: { markup: '<path d="M7 4h10v10l-5 3-5-3z"/> <path d="m9 18-1 3M15 18l1 3"/>' },
  pulse: { markup: '<path d="M2 12h4l2-6 4 12 3-9 2 3h5"/>' },
  cloud: { markup: '<path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A4 4 0 0 1 17 18z"/>' },
  grad: { markup: '<path d="m2 9 10-5 10 5-10 5z"/> <path d="M6 11v5c3 2 9 2 12 0v-5"/>' },
  gov: { markup: '<path d="M3 9 12 4l9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18"/>' },
  bolt: { markup: '<path d="M13 3 5 13h6l-1 8 8-10h-6z"/>' },
  signal: { markup: '<path d="M12 20v-6M8.5 9.5a5 5 0 0 1 7 0M5.6 6.6a9 9 0 0 1 12.8 0"/> <circle cx="12" cy="12.5" r="1.5"/>' },
  bank: { markup: '<path d="M3 10h18M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18M12 3l9 5H3z"/>' },
  health: { markup: '<rect x="4" y="4" width="16" height="16" rx="3"/> <path d="M12 8v8M8 12h8"/>' },
  building: { markup: '<path d="M5 21V5l7-2v18M12 8h7v13M3 21h18M8 8v.5M8 12v.5M8 16v.5M15.5 12v.5M15.5 16v.5"/>' },
  eye: { markup: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12"/> <circle cx="12" cy="12" r="3"/>' },
  target: { markup: '<circle cx="12" cy="12" r="9"/> <circle cx="12" cy="12" r="5"/> <circle cx="12" cy="12" r="1"/>' },
  spark: { markup: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>' },
  handshake: {
    markup:
      '<path d="m11 17 2 2a1.4 1.4 0 0 0 2-2M14 14l2.5 2.5a1.4 1.4 0 0 0 2-2l-3-3M3 11l4-4 5 1 3-3 6 6-2 2M3 11l6 6a1.4 1.4 0 0 0 2-2l-1-1"/>',
  },
  arrow: { viewBox: "0 0 16 16", markup: '<path d="M3 8h10M9 4l4 4-4 4"/>' },
  ne: { viewBox: "0 0 16 16", markup: '<path d="M4 12 12 4M6 4h6v6"/>' },
  down: { viewBox: "0 0 20 20", markup: '<path d="m5 8 5 5 5-5"/>' },
  menu: { markup: '<path d="M4 7h16M4 12h16M4 17h16"/>' },
  close: { markup: '<path d="M6 6l12 12M18 6 6 18"/>' },
  sun: {
    markup:
      '<circle cx="12" cy="12" r="4"/> <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
  },
  moon: { markup: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>' },
  mail: { markup: '<rect x="3" y="5" width="18" height="14" rx="2"/> <path d="m3 7 9 6 9-6"/>' },
  phone: { markup: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>' },
  pin: { markup: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12"/> <circle cx="12" cy="9" r="2.5"/>' },
  key: { markup: '<circle cx="8" cy="15" r="4"/> <path d="m11 12 9-9M17 6l3 3M15 8l2 2"/>' },
  copy: {
    markup: '<rect x="8" y="8" width="12" height="12" rx="2"/> <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  },
  globe: { markup: '<circle cx="12" cy="12" r="9"/> <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>' },
  alert: { markup: '<circle cx="12" cy="12" r="9"/> <path d="M12 7v6M12 16.5v.5"/>' },
  linkedin: {
    filled: true,
    markup:
      '<path d="M4 9h3v11H4zM5.5 4a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6M10 9h3v1.6c.5-.9 1.6-1.8 3.3-1.8 3.4 0 3.7 2.2 3.7 5V20h-3v-5.3c0-1.3 0-3-1.8-3s-2.2 1.4-2.2 2.9V20h-3z"/>',
  },
  youtube: {
    filled: true,
    markup:
      '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8M10 15V9l5.2 3z"/>',
  },
  facebook: { filled: true, markup: '<path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v7h4v-7h3l.5-4H14V8.6c0-.4.3-.6.6-.6z"/>' },
  telegram: {
    filled: true,
    markup:
      '<path d="M21.5 4.2 2.9 11.4c-1.2.5-1.2 1.3 0 1.6l4.7 1.5 1.8 5.6c.2.6.5.7 1 .3l2.6-2.2 4.9 3.6c.9.5 1.5.2 1.7-.8l3.2-15.1c.3-1.3-.5-1.9-1.3-1.7M9.5 14.2l8.6-7.6-6.8 8.7z"/>',
  },
  x: {
    filled: true,
    markup: '<path d="M17.7 3h3.2l-7 8 8.3 10h-6.5l-5-6.2L5 21H1.8l7.5-8.6L1.3 3h6.6l4.6 5.7zm-1.1 16.2h1.8L7.1 4.7H5.2z"/>',
  },
} as const;

export type IconName = keyof typeof ICONS;
