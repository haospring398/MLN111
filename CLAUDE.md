# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page React site for the MLN111 (Marxist-Leninist Philosophy) course assignment, themed "Nhận thức & Thực tiễn" (Cognition & Practice). Aesthetic is dark-academic editorial — serif Fraunces + Inter, ox-blood/terracotta accent on near-black, no rounded corners except pills and the arrow circle.

Deployed on Vercel. `vercel.json` rewrites every path to `/` because the app is one HTML file with section anchors driven by hash navigation and in-page scroll.

## Commands

```bash
npm run dev       # Vite dev server (HMR)
npm run build     # Production build to dist/
npm run preview   # Serve dist/ locally
```

No tests, no lint, no typecheck — Vite + plain React, no TS, no ESLint config.

## Architecture

**Almost all code lives in two files:** `src/App.jsx` (~1600 lines) and `src/index.css` (~1750 lines). `main.jsx` is a 7-line StrictMode mount. Everything — every section component, every dataset, every primitive — sits inside `App.jsx`. Do not refactor into separate component files unless asked; the single-file layout is intentional and the existing edits assume it.

### App.jsx layout (in this order)

1. **Hooks** — `useReveal` (IntersectionObserver → adds `.is-visible` for the `.reveal` opacity/translateY animation), `useParallax` (rAF-driven `translate3d` on a ref, respects `prefers-reduced-motion`, gated by an IO so it only runs in viewport), `useActiveSection` (which section id is currently in the middle band of the viewport — drives nav underline).
2. **Primitives** — `Rev` (reveal wrapper, takes `delay` in 0.1 s units), `Label`, `Dash` (the `<span>` hairline used inside section headings), `Pull` (left-bordered blockquote with cite), `SectionMargin` (the "marginalia" aside used in Quiz + AI Usage), `CrossLink` (pill-button CTA block).
3. **`Loader`** — full-viewport overlay with hand-drawn "MLN-111" SVG (each `<path>` uses `pathLength="100"` so the `stroke-dasharray: 100; stroke-dashoffset: 100` animation works regardless of geometry), bar fill, label fade. Hides itself after 1800 ms.
4. **`Nav`** — sticky 3-column nav. Takes `showPrep` to conditionally include the "Phản biện" link. Mobile burger opens a fixed full-screen drawer; opening locks `document.body.style.overflow`.
5. **Sections in render order**: `Hero` → `CQSection` → `TheorySection` → `StatsSection` → `TriptychDivider` → `CompareSection` → `Quiz` → (`Rebuttal` if prep) → `Glossary` → `AISection` → `References` → `Footer`. Section components are named with the `Section`/`Divider` suffix where the user spec required it — don't rename them; the `App()` default export references those exact names.
6. **Data constants** sit immediately before the component that consumes them: `QUIZ`, `REBUTTAL`, `GLOSSARY`, `REFERENCES`. The Quiz data uses keys `q / opts / ans / ex` (NOT `options/correct/explain` — that shape was migrated, do not reintroduce the old keys).
7. **`App()` default export** wraps everything in `<Loader />` + `<div id="app-root">`. The hidden "Phản biện" rebuttal section is gated by `URLSearchParams ... get("prep") === "true"`.

### CSS structure (`src/index.css`)

- `:root` design tokens at the top. **Always use the variables**, never re-introduce hex literals. The accent is `--color-accent: #C44A3F` (terracotta); any `#8C2A26` or `rgba(140, 42, 38, …)` is stale and should be migrated.
- Self-hosted fonts only. `@font-face` blocks at the top reference `/fonts/*.woff2` (split by `latin` + `vietnamese` subset with `unicode-range` so the browser only pulls the Vietnamese woff2 when Vietnamese codepoints appear). No `@import` from Google Fonts; `index.html` also has no Google Fonts `<link>` and instead preloads two woff2s. Keep it that way.
- Hard rules baked in: `border-radius: 0 !important` on all `<img>`; the only rounded shapes are `.pill-btn` / `.nav-pill` (`--pill-radius: 999px`) and `.arrow-btn` (`50%`). No `box-shadow` for elevation — only the `inset` accent glow on `#app-root`. No gradient backgrounds for surfaces; gradient overlays exist on images only.
- `#app-root` carries `--border-frame` (1 px accent) + `inset 0 0 80px var(--color-accent-glow)`. `body::before` paints `/img/bg-texture.jpg` desaturated/dimmed as a fixed background under the whole page.
- Reveal: `.reveal { opacity: 0; transform: translateY(50px); transition: … }` flips to `.is-visible`. `prefers-reduced-motion: reduce` neutralises every animation including the loader (which it `display: none`s).
- Accordion pattern (Rebuttal + Glossary): expand via `grid-template-rows: 0fr → 1fr` transition. The inner div carries `overflow: hidden`. Don't use `max-height` here.
- The "marginalia" pattern: section gets `section-with-margin` (grid `1fr / 200px`, capped `max-width: 1440px`); main content goes in `.section-main`; the aside (`<SectionMargin>`) is sticky to `var(--nav-height) + 3rem` and hides below 1024 px.
- Theory's pull-quote + hands-book is a `.theory-quote-grid` (1fr / image col). It used to be a CSS float; do **not** revert. `<Rev>` cannot wrap the floated element because `transform` creates a BFC and kills wrap behaviour.

## Assets (`public/`)

- `public/fonts/*.woff2` — 8 self-hosted font files (Inter 400/500 × latin/vietnamese, Fraunces variable wght normal+italic × latin/vietnamese). Sourced from `cdn.jsdelivr.net/npm/@fontsource[-variable]@5/files/...` if any need to be re-downloaded.
- `public/img/*.jpg|png` — Hero (`socrates.png` transparent cutout + `socrates.jpg` legacy fallback, `book-notes.jpg`, `manuscript-bg.jpg`), Theory (`bookshelf.jpg`, `hands-book.jpg`), CQ (`student-library.jpg`), Stats (`gears.jpg`, `student-work.jpg`), Triptych (`triptych.jpg`), Compare (`theory-practice.jpg`), and `bg-texture.jpg` for the body backdrop. Hero images use `loading="eager"`; everything below the fold uses `loading="lazy" decoding="async"`.

## Conventions worth honouring

- Section heading pattern: `Word <Dash /> <i>continuation</i>` — use `<i>` for stylistic italic in headings (`<em>` is reserved for semantic emphasis; the codebase migrated away from `<em>` in headings on purpose).
- Stat-source cites that mention a public URL should be rendered as `<a className="stat-source stat-source-link">` opening in a new tab with `rel="noopener noreferrer"` and a trailing `↗`. The same canonical URLs are listed in the `REFERENCES` array — keep them in sync if either changes.
- Hidden "Phản biện" (rebuttal) section is the only feature gated by a URL flag (`?prep=true`). It must NOT appear in normal navigation.
- Don't pass `showPrep` through React Context. The flag is computed once in `App()` and passed as a prop to `Nav` and used inline to conditionally render `<Rebuttal />`.
- Inline styles are fine for one-off positioning/sizing (Hero floating elements, Stats image overlay, etc.) — the codebase mixes inline + class freely. Don't refactor everything to classes; match the surrounding pattern.
