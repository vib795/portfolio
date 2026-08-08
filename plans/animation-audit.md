# Animation audit — singhcodes.dev

- **Branch**: `audit/animations`
- **Base commit**: `6508c0a`
- **Method**: `improve-animations` skill (Emil Kowalski's motion bar)

The site ran three motion systems at once — Framer Motion, Tailwind utilities and
hand-written CSS — with no shared tokens. It now runs one: CSS, driven by tokens
in `app/globals.css`. `framer-motion` is no longer a dependency.

## Fixed

| # | Sev | Where | Problem | Fix |
|---|---|---|---|---|
| 1 | HIGH | `components/Reveal.tsx` | Prerendered HTML shipped 36 elements on `/` and 37 on `/blog` at `opacity:0`. On `/blog` that was the whole page body — h1, intro, all 30 posts — invisible until the bundle hydrated. No JS meant no content. | Rewritten as a **server** component driving a CSS `view()` timeline. Zero JS, zero hydration dependency, and the `@supports` guard degrades to *visible*. |
| 2 | HIGH | `components/ParticleName.tsx` | `pointermove` bound to `window` called `getBoundingClientRect()` on every mouse move anywhere on the page — a forced layout read while reading the footer. The rAF loop also never stopped and was not visibility-gated. | Rect cached, refreshed on scroll/resize. Loop parks when settled and is gated by `IntersectionObserver`. Measured **60 fps → 0 fps** when idle or off-screen; still wakes on pointer/tap. |
| 3 | MED | `Nav.tsx`, `Experience.tsx` | Reduced motion honoured only in `Reveal`. The CSS block could not reach Framer (it drives inline styles, not CSS transitions) and there was no `MotionConfig`. | All motion is CSS now, so the media query actually governs it. |
| 4 | MED | `globals.css` | Blanket `transition-duration:0.01ms !important` on `*` killed hover colour, focus rings — every non-motion affordance. | Scoped to non-moving properties; colour/opacity/focus feedback retained. |
| 5 | MED | `Experience.tsx` | Accordion animated `height: 0 → auto` through Framer — layout + paint every frame on the homepage's only real interaction. | `.accordion-panel`, `grid-template-rows: 0fr→1fr`, 300ms `--ease-out`. Panels stay mounted, so the text is in the server HTML. |
| 6 | MED | `globals.css` | `.link-line` ran 350ms on a Material *ease-in-out* where hover wants `ease`, and was **ungated** — the underline stuck open after a touch tap. | 220ms `ease`, wrapped in `@media (hover:hover) and (pointer:fine)`, plus a `:focus-visible` branch for keyboards. |
| 7 | MED | `Nav.tsx` ×2, `Work.tsx`, `PostRow.tsx` | Four `transition-all`. The hamburger animated `top`, a layout property, for a purely visual morph. | Named properties. Hamburger bars share one origin and separate via `transform`. |
| 8 | MED | repo-wide | No motion tokens: durations `200/300/500ms`, `0.25/0.4/0.65`, `0.85s/0.35s`; curves split across two cubic-beziers, `"easeOut"` and bare `ease`. | One `@theme` block: `--ease-out`, `--ease-in-out`, `--duration-fast/base/slow`. |
| 9 | MED | `Reveal.tsx`, `Work.tsx` | 650ms reveal ×36 and a 500ms hover scale — both read as lag. | Reveal is scroll-linked (no duration); hover scale 300ms. |
| 10 | LOW | `Nav.tsx` | Mobile menu was a pure opacity fade with no transform. | `scale(0.98)` → `none`. Never `scale(0)`. |
| 11 | LOW | `Hero.tsx`, `ParticleName.tsx` | Hero fully settled at **1.33s**. | 0.6s duration, delays compressed — settles at **~0.92s**. |
| — | — | `ThemeToggle.tsx` | Icon hard-swapped; the one stateful control on the page was the only thing with no transition. | Both icons stay mounted and cross-rotate, 200ms. Scaled to 0.75, never 0. |

## Rejected during vetting

Ungated `hover:` motion across 11 components was **not** a real finding. The built
CSS proves Tailwind v4 already wraps every `hover:`/`group-hover:` variant in
`@media (hover:hover)`. Only the two hand-written rules in `globals.css` escaped
it, and those are #6.

## Verified in-browser

Chromium against the dev server:

- `CSS.supports("animation-timeline: view()")` → true; above-fold reveals at
  opacity 1, below-fold waiting on scroll.
- Scrolled to the true bottom of `/` and `/blog` — **no element stuck faded**
  (the main risk of a `view()` range that ends too late).
- Accordion eases out cleanly: 52 → 164 → 231 → 259 → 270 → 274px.
- Mobile menu: closed `display:none` + `inert`; open staggers links at
  60/105/150/195ms; on close `allow-discrete` holds `display:block` through the
  fade, then drops to `none` and restores `inert`.
- Theme icons crossfade `["1","0"]` → `["0","1"]`.
- Prerendered HTML: `opacity:0` count **36/37 → 0/0**.

## Not done

Deliberately left alone, since they change behaviour rather than fix a defect:

- View transition on `/blog` → `/blog/<slug>` (title morph).
- Stagger on accordion bullet points.
- The infinite `animate-ping` on the hero availability dot — it is a live-status
  indicator, and reduced motion now switches it off properly.
