export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&family=Syne:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap";

export const WIDGET_CSS = `
:root {
  --bg: #08080a;
  --surface: #111114;
  --surface-up: #19191e;
  --text: #eae8e3;
  --muted: #7a7874;
  --accent: #c4f24a;
  --accent-dim: rgba(196,242,74,0.1);
  --border: rgba(255,255,255,0.055);
  --emoji: 'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif;
  --serif: 'DM Serif Display', Georgia, serif;
  --sans: 'Instrument Sans', system-ui, sans-serif;
  --mono: 'JetBrains Mono', monospace;
  --display: 'Syne', sans-serif;
  --elegant: 'Fraunces', serif;
  --classic: 'Cormorant Garamond', serif;
}

* { margin:0; padding:0; box-sizing:border-box; }

body {
  background: transparent;
  color: var(--text);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
}

/* ══════════════════════════════════════════════
   LAYOUT 1 — CONTEXTUAL HERO (2×2)
═══════════════════════════════════════════════ */
.w1 {
  width:100vw; height:100vh; border-radius:0;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding:16px; position:relative; overflow:hidden;
}
.w1 .icon { font-size:clamp(16px, 15vmin, 26px); margin-bottom:4px; filter:drop-shadow(0 2px 5px rgba(0,0,0,.12)); font-family:var(--emoji); }
.w1 .val { font-family:var(--sans); font-size:clamp(18px, 19vmin, 32px); font-weight:800; line-height:1; }
.w1 .sub { font-size:clamp(9px, 8vmin, 13px); font-weight:500; margin-top:2px; }

.w1-morning {
  background: linear-gradient(145deg,#f2873a,#f9c9a0);
  box-shadow: 0 8px 28px rgba(242,135,58,.25), inset 0 1px 0 rgba(255,255,255,.2);
}
.w1-morning .val { color:#1a0e04; }
.w1-morning .sub { color:rgba(26,14,4,.6); }

.w1-urgent {
  background: linear-gradient(145deg,#7c2ddb,#3b1170);
  box-shadow: 0 8px 28px rgba(124,45,219,.3), inset 0 1px 0 rgba(255,255,255,.1);
}
.w1-urgent .val { color:#fff; }
.w1-urgent .sub { color:rgba(255,255,255,.55); }

.w1-night {
  background: linear-gradient(145deg,#141e38,#0b1228);
  box-shadow: 0 8px 28px rgba(11,18,40,.5), inset 0 1px 0 rgba(255,255,255,.04);
}
.w1-night .val { color:#c0d4f7; }
.w1-night .sub { color:rgba(192,212,247,.45); }

.w1-focus {
  background: linear-gradient(145deg,#0d9488,#065f56);
  box-shadow: 0 8px 28px rgba(13,148,136,.3), inset 0 1px 0 rgba(255,255,255,.12);
}
.w1-focus .val { color:#f0fdfa; }
.w1-focus .sub { color:rgba(240,253,250,.55); }

.w1-alert {
  background: linear-gradient(145deg,#e04040,#8b1a1a);
  box-shadow: 0 8px 28px rgba(224,64,64,.3), inset 0 1px 0 rgba(255,255,255,.1);
}
.w1-alert .val { color:#fff; }
.w1-alert .sub { color:rgba(255,255,255,.55); }

.w1-calm {
  background: linear-gradient(145deg,#b8a9e8,#7b6bbf);
  box-shadow: 0 8px 28px rgba(184,169,232,.25), inset 0 1px 0 rgba(255,255,255,.18);
}
.w1-calm .val { color:#1e1340; }
.w1-calm .sub { color:rgba(30,19,64,.5); }

.w1-weather {
  background: linear-gradient(145deg,#56b4f9,#2e7ad1);
  box-shadow: 0 8px 28px rgba(86,180,249,.25), inset 0 1px 0 rgba(255,255,255,.2);
}
.w1-weather .val { color:#fff; }
.w1-weather .sub { color:rgba(255,255,255,.6); }

.w1-energy {
  background: linear-gradient(145deg,#f59e0b,#ea580c);
  box-shadow: 0 8px 28px rgba(245,158,11,.28), inset 0 1px 0 rgba(255,255,255,.15);
}
.w1-energy .val { color:#fff; }
.w1-energy .sub { color:rgba(255,255,255,.6); }

.w1-eink {
  background: #f3f1ec;
  box-shadow: 0 8px 28px rgba(0,0,0,.2);
  border: 1.5px solid #d8d5ce;
}
.w1-eink .val { color:#111; font-family:var(--mono); font-weight:700; }
.w1-eink .sub { color:#888; }
.w1-eink .icon { filter:grayscale(1) contrast(1.2); }

/* ══════════════════════════════════════════════
   LAYOUT 2 — BENTO BOX (2×4 wide)
═══════════════════════════════════════════════ */
.w2 {
  width:100vw; height:100vh; border-radius:0;
  padding:6px; display:grid;
  grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr; gap:8px;
  overflow:hidden;
}
.w2 .cell {
  border-radius:14px; padding:10px 11px;
  display:flex; flex-direction:column; justify-content:space-between;
  position:relative; overflow:hidden;
}
.w2 .cell::after {
  content:''; position:absolute; inset:0; border-radius:14px;
  pointer-events:none;
}
.w2 .cell-icon {
  width:26px; height:26px; border-radius:8px;
  display:flex; align-items:center; justify-content:center; font-size:13px;
  font-family:var(--emoji);
}
.w2 .cell-head {
  font-family:var(--mono); font-size:9px; font-weight:600;
  letter-spacing:.1em; text-transform:uppercase; margin-top:3px;
}
.w2 .cell-val { font-size:16px; font-weight:700; line-height:1.2; margin-top:auto; padding-top:4px; padding-bottom:2px; }

.w2-frost {
  background: rgba(255,255,255,.03);
  backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
  border: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 6px 28px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04);
}
.w2-frost .cell { background:rgba(255,255,255,.06); }
.w2-frost .cell::after { border:1px solid rgba(255,255,255,.06); }
.w2-frost .cell-head { color:#8a8780; }
.w2-frost .cell-val { color:#f0eee8; }

.w2-cream {
  background: #f7f5f0;
  border: 1px solid #ddd9d0;
  box-shadow: 0 6px 28px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.06);
}
.w2-cream .cell { background:#edeae2; }
.w2-cream .cell::after { border:1px solid #ddd9d0; }
.w2-cream .cell-head { color:#a09888; }
.w2-cream .cell-val { color:#1a1810; }

.w2-charcoal {
  background: #18181c;
  border: 1px solid rgba(255,255,255,.05);
  box-shadow: 0 6px 28px rgba(0,0,0,.5);
}
.w2-charcoal .cell { background:#232328; }
.w2-charcoal .cell::after { border:1px solid rgba(255,255,255,.06); }
.w2-charcoal .cell-head { color:#666; }
.w2-charcoal .cell-val { color:#e4e2dc; }

.w2-ocean {
  background: linear-gradient(150deg,#0a2640,#081a2e);
  border: 1px solid rgba(80,160,255,.1);
  box-shadow: 0 6px 28px rgba(0,0,0,.45);
}
.w2-ocean .cell { background:rgba(80,160,255,.08); }
.w2-ocean .cell::after { border:1px solid rgba(80,160,255,.1); }
.w2-ocean .cell-head { color:rgba(130,190,255,.5); }
.w2-ocean .cell-val { color:#c4e0ff; }

.w2-neon {
  background: #0c0c0c;
  border: 1px solid rgba(196,242,74,.15);
  box-shadow: 0 6px 28px rgba(0,0,0,.5), 0 0 80px rgba(196,242,74,.04);
}
.w2-neon .cell { background:rgba(196,242,74,.05); }
.w2-neon .cell::after { border:1px solid rgba(196,242,74,.1); }
.w2-neon .cell-head { color:rgba(196,242,74,.55); }
.w2-neon .cell-val { color:#d4f57a; }

.w2-eink {
  background: #f0ede6;
  border: 1.5px solid #c8c4ba;
  box-shadow: 0 6px 28px rgba(0,0,0,.1);
}
.w2-eink .cell { background:#e6e3db; }
.w2-eink .cell::after { border:1.5px solid #ccc8be; }
.w2-eink .cell-head { color:#999; }
.w2-eink .cell-val { color:#2a2a28; font-family:var(--mono); }
.w2-eink .cell-icon { filter:grayscale(1); }

/* ══════════════════════════════════════════════
   LAYOUT 3 — TIMELINE (4×4 square)
═══════════════════════════════════════════════ */
.w3 {
  width:100vw; height:100vh; border-radius:0;
  padding:22px 18px 18px; display:flex; flex-direction:column;
  overflow:hidden;
}
.w3-head {
  font-family:var(--serif); font-size:19px; font-weight:700;
  margin-bottom:14px; line-height:1.2;
}
.w3-list { flex:1; display:flex; flex-direction:column; }
.w3-row {
  display:flex; align-items:flex-start; gap:12px; padding-bottom:13px;
}
.w3-gut {
  width:30px; display:flex; flex-direction:column; align-items:center; flex-shrink:0;
}
.w3-time {
  font-family:var(--mono); font-size:10px; font-weight:500; white-space:nowrap;
  line-height:1; margin-bottom:5px;
}
.w3-dot {
  width:9px; height:9px; border-radius:50%; border:2px solid; flex-shrink:0;
  position:relative; z-index:2;
}
.w3-line { width:2px; flex:1; min-height:10px; margin-top:3px; }
.w3-body {}
.w3-ev { font-family:var(--sans); font-size:13.5px; font-weight:500; line-height:1.3; }
.w3-meta { font-size:11px; margin-top:1px; }

.w3-light {
  background:#fafaf8;
  box-shadow: 0 8px 36px rgba(0,0,0,.3);
}
.w3-light .w3-head { color:#111; }
.w3-light .w3-time { color:#aaa; }
.w3-light .w3-dot { border-color:#d4d4d0; background:#fafaf8; }
.w3-light .w3-dot.past { border-color:#0d7df2; background:#0d7df2; }
.w3-light .w3-dot.active { border-color:#0d7df2; background:#0d7df2; box-shadow:0 0 0 3px rgba(13,125,242,.18); }
.w3-light .w3-line { background:#e8e8e4; }
.w3-light .w3-row.is-past .w3-line { background:#0d7df2; }
.w3-light .w3-row.is-active .w3-line { background:linear-gradient(to bottom,#0d7df2,#e8e8e4); }
.w3-light .w3-ev { color:#222; }
.w3-light .w3-row.is-active .w3-ev { color:#0d7df2; font-weight:600; }
.w3-light .w3-row.is-past .w3-ev { color:#bbb; text-decoration:line-through; text-decoration-color:#ddd; }
.w3-light .w3-meta { color:#bbb; }

.w3-dark {
  background:#141418;
  border:1px solid rgba(255,255,255,.05);
  box-shadow: 0 8px 36px rgba(0,0,0,.5);
}
.w3-dark .w3-head { color:#e0ddd8; }
.w3-dark .w3-time { color:#555; }
.w3-dark .w3-dot { border-color:#333; background:#141418; }
.w3-dark .w3-dot.past { border-color:#0d7df2; background:#0d7df2; }
.w3-dark .w3-dot.active { border-color:#0d7df2; background:#0d7df2; box-shadow:0 0 0 3px rgba(13,125,242,.2); }
.w3-dark .w3-line { background:#222; }
.w3-dark .w3-row.is-past .w3-line { background:#0d7df2; }
.w3-dark .w3-row.is-active .w3-line { background:linear-gradient(to bottom,#0d7df2,#222); }
.w3-dark .w3-ev { color:#ccc; }
.w3-dark .w3-row.is-active .w3-ev { color:#5aacff; font-weight:600; }
.w3-dark .w3-row.is-past .w3-ev { color:#555; text-decoration:line-through; text-decoration-color:#333; }
.w3-dark .w3-meta { color:#555; }

.w3-emerald {
  background:#f7f9f5;
  box-shadow: 0 8px 36px rgba(0,0,0,.25);
}
.w3-emerald .w3-head { color:#1a2e1a; }
.w3-emerald .w3-time { color:#a0b09a; }
.w3-emerald .w3-dot { border-color:#cddac8; background:#f7f9f5; }
.w3-emerald .w3-dot.past { border-color:#16a34a; background:#16a34a; }
.w3-emerald .w3-dot.active { border-color:#16a34a; background:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,.18); }
.w3-emerald .w3-line { background:#dde8d8; }
.w3-emerald .w3-row.is-past .w3-line { background:#16a34a; }
.w3-emerald .w3-row.is-active .w3-line { background:linear-gradient(to bottom,#16a34a,#dde8d8); }
.w3-emerald .w3-ev { color:#2d3d2d; }
.w3-emerald .w3-row.is-active .w3-ev { color:#16a34a; font-weight:600; }
.w3-emerald .w3-row.is-past .w3-ev { color:#b5c4b0; text-decoration:line-through; text-decoration-color:#d0ddc8; }
.w3-emerald .w3-meta { color:#b0c0a8; }

.w3-amber {
  background:#1a1612;
  border:1px solid rgba(245,158,11,.08);
  box-shadow: 0 8px 36px rgba(0,0,0,.5);
}
.w3-amber .w3-head { color:#f5e6c8; font-family:var(--elegant); }
.w3-amber .w3-time { color:#5a4a30; }
.w3-amber .w3-dot { border-color:#3a3020; background:#1a1612; }
.w3-amber .w3-dot.past { border-color:#f59e0b; background:#f59e0b; }
.w3-amber .w3-dot.active { border-color:#f59e0b; background:#f59e0b; box-shadow:0 0 0 3px rgba(245,158,11,.2); }
.w3-amber .w3-line { background:#2a2418; }
.w3-amber .w3-row.is-past .w3-line { background:#f59e0b; }
.w3-amber .w3-row.is-active .w3-line { background:linear-gradient(to bottom,#f59e0b,#2a2418); }
.w3-amber .w3-ev { color:#d4c4a0; }
.w3-amber .w3-row.is-active .w3-ev { color:#f5c842; font-weight:600; }
.w3-amber .w3-row.is-past .w3-ev { color:#5a4a30; text-decoration:line-through; text-decoration-color:#3a3020; }
.w3-amber .w3-meta { color:#5a4a30; }

.w3-eink {
  background:#edeae3;
  border:1.5px solid #ccc8be;
  box-shadow: 0 8px 36px rgba(0,0,0,.15);
}
.w3-eink .w3-head { color:#222; font-family:var(--mono); font-size:16px; }
.w3-eink .w3-time { color:#999; }
.w3-eink .w3-dot { border-color:#bbb8b0; background:#edeae3; }
.w3-eink .w3-dot.past { border-color:#444; background:#444; }
.w3-eink .w3-dot.active { border-color:#222; background:#222; box-shadow:0 0 0 3px rgba(0,0,0,.1); }
.w3-eink .w3-line { background:#d4d0c8; }
.w3-eink .w3-row.is-past .w3-line { background:#888; }
.w3-eink .w3-row.is-active .w3-line { background:linear-gradient(to bottom,#444,#d4d0c8); }
.w3-eink .w3-ev { color:#333; font-family:var(--mono); font-size:12px; }
.w3-eink .w3-row.is-active .w3-ev { color:#111; font-weight:700; }
.w3-eink .w3-row.is-past .w3-ev { color:#aaa; text-decoration:line-through; }
.w3-eink .w3-meta { color:#aaa; font-family:var(--mono); font-size:10px; }

/* ══════════════════════════════════════════════
   LAYOUT 4 — MINIMALIST STACK (2×4 wide)
═══════════════════════════════════════════════ */
.w4 {
  width:100vw; height:100vh; border-radius:0;
  padding:22px 24px; display:flex; flex-direction:column;
  justify-content:space-between; overflow:hidden;
}
.w4 .top { font-size:10px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; }
.w4 .mid { font-size:26px; line-height:1.15; letter-spacing:-0.01em; }
.w4 .bot { font-size:13px; font-weight:400; font-style:italic; line-height:1.4; }

.w4-light {
  background:#f5f4f0;
  box-shadow: 0 8px 36px rgba(0,0,0,.25);
}
.w4-light .top { color:#aaa; font-family:var(--mono); }
.w4-light .mid { color:#1a1a18; font-family:var(--serif); }
.w4-light .bot { color:rgba(26,26,24,.38); }

.w4-dark {
  background:#111113;
  box-shadow: 0 8px 36px rgba(0,0,0,.5);
}
.w4-dark .top { color:#444; font-family:var(--mono); }
.w4-dark .mid { color:#e8e6e1; font-family:var(--serif); }
.w4-dark .bot { color:rgba(232,230,225,.3); }

.w4-editorial {
  background:#f0eee6;
  box-shadow: 0 8px 36px rgba(0,0,0,.2);
}
.w4-editorial .top { color:#b0a890; font-family:var(--sans); font-weight:600; letter-spacing:.18em; }
.w4-editorial .mid { color:#1a1810; font-family:var(--display); font-weight:700; font-size:24px; }
.w4-editorial .bot { color:rgba(26,24,16,.35); font-family:var(--classic); font-size:14px; }

.w4-ink {
  background:#1a1714;
  border:1px solid rgba(245,230,200,.06);
  box-shadow: 0 8px 36px rgba(0,0,0,.5);
}
.w4-ink .top { color:#5a5040; font-family:var(--mono); }
.w4-ink .mid { color:#f5e6c8; font-family:var(--elegant); font-weight:300; font-size:24px; }
.w4-ink .bot { color:rgba(245,230,200,.28); font-family:var(--classic); font-style:italic; }

.w4-brutal {
  background:#fff;
  border:3px solid #111;
  box-shadow: 6px 6px 0 #111;
  border-radius:0;
}
.w4-brutal .top { color:#111; font-family:var(--mono); }
.w4-brutal .mid { color:#111; font-family:var(--display); font-weight:800; font-size:22px; text-transform:uppercase; }
.w4-brutal .bot { color:#666; font-style:normal; font-family:var(--mono); font-size:11px; }

.w4-neon {
  background:#0a0a0a;
  border:1px solid rgba(196,242,74,.1);
  box-shadow: 0 8px 36px rgba(0,0,0,.5), 0 0 80px rgba(196,242,74,.03);
}
.w4-neon .top { color:rgba(196,242,74,.5); font-family:var(--mono); }
.w4-neon .mid { color:var(--accent); font-family:var(--sans); font-weight:700; }
.w4-neon .bot { color:rgba(196,242,74,.25); }

.w4-eink {
  background:#edeae3;
  border:1.5px solid #ccc8be;
  box-shadow: 0 8px 36px rgba(0,0,0,.12);
}
.w4-eink .top { color:#999; font-family:var(--mono); }
.w4-eink .mid { color:#222; font-family:var(--mono); font-weight:600; font-size:22px; }
.w4-eink .bot { color:#999; font-style:normal; font-family:var(--mono); font-size:11px; }

/* ══════════════════════════════════════════════
   BONUS: ORIGINAL CONCEPTS
═══════════════════════════════════════════════ */

/* Concept A: Progress Ring (2×2) */
.wc-ring {
  width:100vw; height:100vh; border-radius:0;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding:16px; position:relative; overflow:hidden;
}
.wc-ring svg { position:absolute; inset:14px; }
.wc-ring .ring-bg { fill:none; stroke-width:5; }
.wc-ring .ring-fg { fill:none; stroke-width:5; stroke-linecap:round;
  transform:rotate(-90deg); transform-origin:center;
  stroke-dasharray:408; transition:stroke-dashoffset .8s ease;
}
.wc-ring .ring-center { position:relative; z-index:1; text-align:center; }
.wc-ring .ring-pct { font-size:34px; font-weight:800; line-height:1; }
.wc-ring .ring-label { font-size:11px; font-weight:500; margin-top:2px; }

.wc-ring-dark {
  background:#141418; border:1px solid rgba(255,255,255,.04);
  box-shadow: 0 8px 28px rgba(0,0,0,.5);
}
.wc-ring-dark .ring-bg { stroke:rgba(255,255,255,.06); }
.wc-ring-dark .ring-fg { stroke:var(--accent); }
.wc-ring-dark .ring-pct { color:var(--text); }
.wc-ring-dark .ring-label { color:var(--muted); }

.wc-ring-light {
  background:#f7f6f2;
  box-shadow: 0 8px 28px rgba(0,0,0,.15);
}
.wc-ring-light .ring-bg { stroke:#e8e5de; }
.wc-ring-light .ring-fg { stroke:#0d7df2; }
.wc-ring-light .ring-pct { color:#111; }
.wc-ring-light .ring-label { color:#999; }

/* Concept B: Companion Quote (2×4 wide) */
.wc-quote {
  width:100vw; height:100vh; border-radius:0;
  padding:20px 24px; display:flex; flex-direction:column;
  justify-content:center; gap:10px; overflow:hidden; position:relative;
}
.wc-quote .q-mark {
  font-family:var(--serif); font-size:48px; line-height:1;
  position:absolute; top:10px; left:18px; opacity:.12;
}
.wc-quote .q-text {
  font-family:var(--elegant); font-size:18px; font-weight:300;
  line-height:1.45; position:relative; z-index:1;
}
.wc-quote .q-from {
  font-family:var(--mono); font-size:9px; font-weight:600;
  letter-spacing:.15em; text-transform:uppercase;
}

.wc-quote-warm {
  background: linear-gradient(145deg,#1a1612,#120e0a);
  border:1px solid rgba(245,200,120,.06);
  box-shadow: 0 8px 28px rgba(0,0,0,.5);
}
.wc-quote-warm .q-mark { color:#f5c878; }
.wc-quote-warm .q-text { color:#f5e6c8; }
.wc-quote-warm .q-from { color:#8a7a58; }

.wc-quote-frost {
  background: rgba(255,255,255,.04);
  backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
  border:1px solid rgba(255,255,255,.06);
  box-shadow: 0 8px 28px rgba(0,0,0,.3);
}
.wc-quote-frost .q-mark { color:#fff; }
.wc-quote-frost .q-text { color:#e0ddd8; }
.wc-quote-frost .q-from { color:#666; }

/* Concept C: Streak Flame (2×2) */
.wc-streak {
  width:100vw; height:100vh; border-radius:0;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding:16px; position:relative; overflow:hidden;
}
.wc-streak .flame { font-size:40px; line-height:1; margin-bottom:2px; font-family:var(--emoji); }
.wc-streak .streak-num { font-size:36px; font-weight:800; line-height:1; }
.wc-streak .streak-lab { font-size:11px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; margin-top:2px; }

.wc-streak-fire {
  background:linear-gradient(160deg,#f59e0b,#ea580c,#b91c1c);
  box-shadow: 0 8px 28px rgba(234,88,12,.3), inset 0 1px 0 rgba(255,255,255,.15);
}
.wc-streak-fire .streak-num { color:#fff; }
.wc-streak-fire .streak-lab { color:rgba(255,255,255,.6); }

.wc-streak-cool {
  background:#141418;
  border:1px solid rgba(255,255,255,.04);
  box-shadow: 0 8px 28px rgba(0,0,0,.5);
}
.wc-streak-cool .streak-num { color:var(--accent); }
.wc-streak-cool .streak-lab { color:var(--muted); }

/* Concept D: Daily Score (2×4 wide) */
.wc-score {
  width:100vw; height:100vh; border-radius:0;
  padding:20px 24px; display:flex; align-items:center; gap:20px;
  overflow:hidden;
}
.wc-score-number {
  font-size:56px; font-weight:800; line-height:1; flex-shrink:0;
  font-family:var(--display);
}
.wc-score-details { flex:1; }
.wc-score-title { font-size:14px; font-weight:600; margin-bottom:6px; }
.wc-score-bars { display:flex; flex-direction:column; gap:6px; }
.wc-score-bar { display:flex; align-items:center; gap:8px; }
.wc-score-bar-label { font-family:var(--mono); font-size:9px; font-weight:500; letter-spacing:.1em; text-transform:uppercase; width:48px; flex-shrink:0; }
.wc-score-bar-track { flex:1; height:6px; border-radius:3px; overflow:hidden; }
.wc-score-bar-fill { height:100%; border-radius:3px; }

.wc-score-dark {
  background:#141418; border:1px solid rgba(255,255,255,.04);
  box-shadow: 0 8px 28px rgba(0,0,0,.5);
}
.wc-score-dark .wc-score-number { color:var(--accent); }
.wc-score-dark .wc-score-title { color:var(--text); }
.wc-score-dark .wc-score-bar-label { color:var(--muted); }
.wc-score-dark .wc-score-bar-track { background:rgba(255,255,255,.06); }

.wc-score-light {
  background:#f5f4f0;
  box-shadow: 0 8px 28px rgba(0,0,0,.18);
}
.wc-score-light .wc-score-number { color:#0d7df2; }
.wc-score-light .wc-score-title { color:#222; }
.wc-score-light .wc-score-bar-label { color:#999; }
.wc-score-light .wc-score-bar-track { background:#e8e5de; }

/* ══════════════════════════════════════════════
   LAYOUT 3B — TIMELINE + TASKS VARIANTS
═══════════════════════════════════════════════ */

.w3-dot.task-dot {
  border-radius: 3px !important;
}
.w3-light .w3-dot.task-dot { border-color:#bbb; background:#fafaf8; }
.w3-light .w3-dot.task-dot.done { border-color:#16a34a; background:#16a34a; }
.w3-light .w3-row.is-task .w3-ev { color:#555; font-weight:400; font-size:12.5px; }
.w3-light .w3-row.is-task.is-done .w3-ev { color:#bbb; text-decoration:line-through; text-decoration-color:#ddd; }

.w3-dark .w3-dot.task-dot { border-color:#444; background:#141418; }
.w3-dark .w3-dot.task-dot.done { border-color:#16a34a; background:#16a34a; }
.w3-dark .w3-row.is-task .w3-ev { color:#888; font-weight:400; font-size:12.5px; }
.w3-dark .w3-row.is-task.is-done .w3-ev { color:#444; text-decoration:line-through; text-decoration-color:#333; }

.w3-tag {
  display:inline-block; font-family:var(--mono); font-size:7.5px; font-weight:600;
  letter-spacing:.08em; text-transform:uppercase; padding:2px 5px;
  border-radius:4px; margin-left:5px; vertical-align:1px;
}
.w3-light .w3-tag { background:rgba(13,125,242,.08); color:#0d7df2; }
.w3-light .w3-tag.tag-task { background:rgba(22,163,74,.08); color:#16a34a; }
.w3-dark .w3-tag { background:rgba(90,172,255,.1); color:#5aacff; }
.w3-dark .w3-tag.tag-task { background:rgba(100,255,150,.08); color:#66e090; }

.w3-task-block {
  margin-top:auto; padding-top:8px;
  border-top:1px dashed;
}
.w3-light .w3-task-block { border-color:#e0ddd8; }
.w3-dark .w3-task-block { border-color:#2a2a30; }

.w3-task-block-head {
  display:flex; align-items:center; justify-content:space-between; margin-bottom:5px;
}
.w3-task-block-title {
  font-family:var(--mono); font-size:9px; font-weight:600;
  letter-spacing:.12em; text-transform:uppercase;
}
.w3-task-block-count {
  font-family:var(--mono); font-size:9px; font-weight:500;
}
.w3-light .w3-task-block-title { color:#bbb; }
.w3-light .w3-task-block-count { color:#bbb; }
.w3-dark .w3-task-block-title { color:#555; }
.w3-dark .w3-task-block-count { color:#555; }

.w3-task-item {
  display:flex; align-items:center; gap:7px; padding:2.5px 0;
}
.w3-task-check {
  width:11px; height:11px; border-radius:3px; border:1.5px solid;
  flex-shrink:0; display:flex; align-items:center; justify-content:center;
  font-size:7px; font-weight:700;
}
.w3-light .w3-task-check { border-color:#ccc; }
.w3-light .w3-task-check.checked { border-color:#16a34a; background:#16a34a; color:#fff; }
.w3-dark .w3-task-check { border-color:#444; }
.w3-dark .w3-task-check.checked { border-color:#16a34a; background:#16a34a; color:#fff; }

.w3-task-text { font-size:12px; font-weight:400; }
.w3-light .w3-task-text { color:#555; }
.w3-light .w3-task-text.done { color:#bbb; text-decoration:line-through; text-decoration-color:#ddd; }
.w3-dark .w3-task-text { color:#999; }
.w3-dark .w3-task-text.done { color:#444; text-decoration:line-through; text-decoration-color:#333; }

.w3-subtasks {
  display:flex; flex-direction:column; gap:2px; margin-top:3px; padding-left:1px;
}
.w3-subtask {
  display:flex; align-items:center; gap:5px;
}
.w3-subtask-check {
  width:9px; height:9px; border-radius:2px; border:1.5px solid;
  flex-shrink:0; display:flex; align-items:center; justify-content:center;
  font-size:6px; font-weight:700;
}
.w3-subtask-text { font-size:11px; }

.w3-light .w3-subtask-check { border-color:#d4d4d0; }
.w3-light .w3-subtask-check.checked { border-color:#0d7df2; background:#0d7df2; color:#fff; }
.w3-light .w3-subtask-text { color:#888; }
.w3-light .w3-subtask-text.done { color:#c0c0bc; text-decoration:line-through; text-decoration-color:#ddd; }

.w3-dark .w3-subtask-check { border-color:#3a3a3e; }
.w3-dark .w3-subtask-check.checked { border-color:#5aacff; background:#5aacff; color:#fff; }
.w3-dark .w3-subtask-text { color:#666; }
.w3-dark .w3-subtask-text.done { color:#3a3a3e; text-decoration:line-through; text-decoration-color:#2a2a2e; }

.w3-float-task {
  padding:9px 11px; border-radius:11px; margin-top:auto;
  display:flex; align-items:center; gap:9px;
}
.w3-light .w3-float-task { background:rgba(13,125,242,.05); border:1px solid rgba(13,125,242,.1); }
.w3-dark .w3-float-task { background:rgba(90,172,255,.05); border:1px solid rgba(90,172,255,.07); }

.w3-float-icon { font-size:16px; flex-shrink:0; line-height:1; }
.w3-float-content { flex:1; min-width:0; }
.w3-float-label {
  font-family:var(--mono); font-size:8px; font-weight:600;
  letter-spacing:.12em; text-transform:uppercase;
}
.w3-light .w3-float-label { color:#0d7df2; }
.w3-dark .w3-float-label { color:#5aacff; }
.w3-float-title { font-size:13px; font-weight:600; margin-top:1px; }
.w3-light .w3-float-title { color:#222; }
.w3-dark .w3-float-title { color:#ddd; }
.w3-float-sub { font-size:10px; margin-top:0px; }
.w3-light .w3-float-sub { color:#aaa; }
.w3-dark .w3-float-sub { color:#555; }

.w3-progress-head {
  margin-bottom:12px;
}
.w3-progress-top {
  display:flex; align-items:baseline; justify-content:space-between; margin-bottom:5px;
}
.w3-progress-greeting { font-family:var(--serif); font-size:18px; font-weight:700; }
.w3-progress-fraction { font-family:var(--mono); font-size:11px; font-weight:500; }
.w3-light .w3-progress-greeting { color:#111; }
.w3-light .w3-progress-fraction { color:#0d7df2; }
.w3-dark .w3-progress-greeting { color:#e0ddd8; }
.w3-dark .w3-progress-fraction { color:#5aacff; }

.w3-progress-track {
  width:100%; height:4px; border-radius:2px; overflow:hidden;
}
.w3-light .w3-progress-track { background:#e8e5de; }
.w3-dark .w3-progress-track { background:rgba(255,255,255,.06); }

.w3-progress-fill {
  height:100%; border-radius:2px;
}
.w3-light .w3-progress-fill { background:#0d7df2; }
.w3-dark .w3-progress-fill { background:#5aacff; }
`;
