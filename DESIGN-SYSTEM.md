# MM MOTORS — Design System & Build Spec

Derived from the MM Motors Brand Bible. This document is the decision record; the code
implements it. Where the Brand Bible offered a choice, the choice made here is final.

---

## 1. VISUAL DESIGN SYSTEM

### 1.1 Signature accent — DECIDED

The Brand Bible offers four directions and instructs: *"Choose ONE final accent rather than
mixing several."*

**Chosen: ELECTRIC ORANGE — `#FF4B12`**

Rationale:
- **Vivid red** collides with Honda's brand red; a dealership accent must not read as one
  manufacturer's colour.
- **Cobalt blue** collides with TVS navy/blue.
- **Acid green** codes as "EV-only" and would unbalance a portfolio that is majority petrol.
- **Electric orange** is neutral across both manufacturers, carries energy and
  mechanical warmth, holds legible contrast on both deep black and warm white, and reads as
  automotive signal rather than tech-startup gradient.

The accent is *never* used as a large fill. It is reserved for: primary CTAs, active states,
focus rings, data highlights, section indices, and the single hairline that marks "you are
here".

### 1.2 Palette

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0A0A0B` | Deep black. Primary dark surface. |
| `--ink-raise` | `#111215` | Raised dark surface (cards on black) |
| `--graphite` | `#1A1C20` | Graphite panels, spec blocks |
| `--graphite-line` | `#2A2D33` | Hairlines on dark |
| `--steel` | `#6E747C` | Metallic grey, secondary text on dark |
| `--mist` | `#A9AEB6` | Body text on dark |
| `--paper` | `#F3F0EA` | Warm white. Primary light surface. |
| `--paper-raise` | `#FAF8F4` | Raised light surface |
| `--paper-line` | `#DED9D0` | Hairlines on light |
| `--accent` | `#FF4B12` | Signature accent |
| `--accent-deep` | `#D63A08` | Accent pressed / on light text |

Fuel type is **never** encoded by a second accent colour. Petrol and electric are
distinguished by a monospace label plus a glyph, and by *filled* (electric) vs *outlined*
(petrol) indicators. One accent only.

### 1.3 Typography

Three roles, three families, all variable, all with system fallbacks.

| Role | Family | Use |
|---|---|---|
| Display / Heading | **Archivo** | Brand statements, section titles, model names, big numbers |
| Body | **Inter** | Descriptions, explanations, form labels |
| Data | **JetBrains Mono** | Spec units, labels, indices, tags, prices' currency marks |

Numbers get deliberate weight: specification values render in Archivo 600–700 at large
optical sizes with `font-variant-numeric: tabular-nums`, with the **unit** in JetBrains Mono
at a smaller size and lower contrast. This makes "113.3 **cc**" read as engineering data, not
marketing copy — per Brand Bible §19.

Fluid scale (`clamp`, viewport-responsive, no JS):

```
--fs-display  clamp(3.25rem, 11.5vw, 11rem)     tracking -0.04em
--fs-h1       clamp(2.25rem, 5.6vw, 4.75rem)    tracking -0.03em
--fs-h2       clamp(1.75rem, 3.4vw, 2.875rem)   tracking -0.02em
--fs-h3       clamp(1.0625rem, 1.5vw, 1.375rem)
--fs-body     clamp(0.9375rem, 1.05vw, 1.0625rem)
--fs-data     0.8125rem   (mono, +0.08em tracking, uppercase)
--fs-micro    0.6875rem   (mono, +0.12em tracking, uppercase)
--fs-metric   clamp(1.75rem, 3vw, 2.75rem)      big spec numbers
```

### 1.4 Surface, line, radius

Automotive precision means **tight radii and hairlines**, not soft cards.

- `--r-xs: 2px` · `--r-sm: 4px` · `--r-md: 8px` · pills only for chips/tags.
- Every division is a 1px hairline (`--graphite-line` / `--paper-line`). No drop shadows on
  light surfaces. On dark, depth comes from surface value, not blur.
- **No glassmorphism.** One exception: the fixed header gains a `backdrop-filter` blur only
  after scroll, to keep type legible over imagery.
- Layout: `--gutter: clamp(20px, 4.5vw, 72px)`, max content width `1680px`, 12-column grid.

### 1.5 Motion tokens

```
--e-out    cubic-bezier(0.16, 1, 0.30, 1)     entrances, reveals
--e-inout  cubic-bezier(0.65, 0, 0.35, 1)     state changes
--e-snap   cubic-bezier(0.34, 0.9, 0.24, 1)   micro-interactions
--t-fast   160ms   --t-base 280ms   --t-slow 520ms   --t-cine 900ms
```

No `back`/`elastic`/`bounce` easings anywhere. Nothing floats idly. Per Brand Bible §25 the
experience must feel *engineered*, not playful.

---

## 2. INFORMATION ARCHITECTURE

Mirrors the mandated hierarchy **MM Motors → Manufacturer → Model → Variant**.

```
/                     Homepage — the showroom entrance
/brand.html?b=tvs     Manufacturer world (TVS / Honda)
/models.html          Browse — filter by fuel, brand, type, budget, priority
  ?fuel=petrol        Petrol world
  ?fuel=electric      Electric world
/model.html?m=<id>    Model detail (digital showroom object) — variants live inside
/compare.html         Comparison tool (up to 3 models)
/finder.html          Find Your Ride — guided recommendation
/test-ride.html       Test ride booking
/services.html        Buy · Finance · Insure · Exchange · Service · Experience
```

**Decision: one data-driven template per level, not one HTML file per model.** Vehicle facts
live in a single module (`assets/js/data/vehicles.js`). Adding a manufacturer or model means
adding a data object — no redesign, no new page. This is the direct implementation of Brand
Bible §9 ("built so additional manufacturers can be added without redesigning the system")
and §34 (a single source of truth is the only way to keep specifications accurate).

Persistent orientation (Brand Bible §35 — *Where am I?*): every page carries a breadcrumb rail
`MM MOTORS / TVS / JUPITER 110` in mono caps, and the header marks the active section.

---

## 3. HOMEPAGE STRUCTURE

| # | Section | Job |
|---|---|---|
| 01 | **INTRO** | `YOUR NEXT RIDE, CLEARLY.` Statement + live vehicle silhouette. Sets tone in one screen. |
| 02 | **BRANDS** | The hero discovery experience. Expanding full-bleed manufacturer panels. |
| 03 | **PETROL / ELECTRIC** | Split world. Interactive divider; each side states its own concerns. |
| 04 | **FIND YOUR RIDE** | 4-question guided finder, inline, with explained matches. |
| 05 | **FEATURED MODELS** | Four curated models. Price · fuel · engine/battery · mileage/range. |
| 06 | **INSIDE THE MACHINE** | Scroll-controlled 3D component reveal. Answers *how does it work?* |
| 07 | **COMPARE** | Visual head-to-head strip → full tool. |
| 08 | **TEST RIDE** | `FEEL IT BEFORE YOU DECIDE.` Primary conversion. |
| 09 | **SERVICES** | Buy · Finance · Insure · Exchange · Service · Experience. |

BRANDS comes before any product grid, deliberately — the customer must understand *what
dealership this is* within seconds (§27, §28).

---

## 4. COMPONENT SYSTEM

Primitives (`assets/css/base.css`):

- `.btn` — `--accent` primary, outline secondary, ghost tertiary. 48px min target.
- `.eyebrow` — mono micro label with index number and accent hairline.
- `.fuel-tag` — petrol (outlined) / electric (filled) indicator.
- `.metric` — the atomic spec unit: value (Archivo, tabular) + unit (mono) + label (mono
  micro) + optional `claimed` qualifier.
- `.metric-row` — Level-1 quick-decision strip of five metrics.
- `.spec-table` — two-column hairline table for Levels 2–6.
- `.v-card` — model card: art, name, fuel tag, price, 3 metrics, compare toggle.
- `.brand-panel` — expanding manufacturer panel.
- `.swatch` — colour variant selector, drives the vehicle art's paint token.
- `.rail` — breadcrumb / orientation rail.
- `.disclosure` — the trust note. Mandatory on every spec block.
- `.sticky-cta` — mobile-only bottom conversion bar.

**Vehicle media.** Product photography is the presentation. All twelve models
are supplied as side-profile shots.

The set arrived mixed: the seven TVS files were true cut-outs, the five Honda
files were opaque shots on white. Presenting both the same way is what makes a
showroom grid look untidy, so `tools/prepare-photos.py` normalises them:

- **Background removal by edge flood-fill**, not a global white key. These bikes
  carry white stripe graphics and white number-plate panels; keying every white
  pixel would punch holes straight through them. Only background-connected
  pixels are removed, then the alpha edge is feathered so it does not look cut
  out with scissors.
- **Consistent re-framing.** Every model is trimmed to its bodywork and placed
  on a 16:10 canvas at the same relative size, with the wheels on a shared
  baseline — so a moped and a 300 cc adventure tourer sit at a believable
  common scale across a grid.
- **Never upscaled.** The sources are small (360–372 px wide). Enlarging them
  would add blur and bytes and no detail.

**Presentation: a lit stage, not a plate.** Because every image is now a true
cut-out, the vehicle sits directly on the brand's deep black, lit by a pool of
light on the floor plus a contact shadow. That is the Brand Bible's own
description of the showroom — the vehicle is the hero, the environment is
minimal (§43, §44).

> This reverses an earlier decision in this build. While the photographs were
> still unavailable and assumed to be on white, every vehicle was composited
> onto a warm-white "studio plate" with `multiply`, because screening white onto
> black produces a white rectangle. Once the assets turned out to be keyable,
> the plate became a container around a hero that did not need one. The same
> component still flips to a warm tint on `.on-light` sections, so one rule
> serves both surfaces.

**Fallback: the technical pictogram** (`art-shapes.js`). Heavy round-cap stroked
geometry, parameterised, with every component in a named group
(`data-part="wheel-front"`, `"battery"`, `"engine"`, `"storage"` …).

It is not decoration — it does real work: it stands in whenever a photograph is
missing or fails to load so the interface never shows a grey box; it provides the
colour configurator (recolour = swap one CSS custom property); it provides the
exploded view and component highlighting; and it substitutes for the WebGL scene
under reduced motion or on low-power devices. A few KB, vector-sharp at any size,
correct in both themes.

---

## 5. VEHICLE DATA STRUCTURE

Every vehicle is one object. The shape enforces the Brand Bible's six-level hierarchy (§12),
so a model cannot be added without its Level-1 quick-decision data.

```js
{
  id, brand, model, name, fuel: 'petrol'|'electric', type: 'scooter'|'motorcycle',
  art: 'scooter'|'motorcycle',
  price: { from, to, note },              // note is always shown, never omitted
  headline, blurb,
  quick:   [ 5 × metric ],                // LEVEL 1 — price, fuel, engine/motor, mileage/range, weight
  perf:    [ metric… ],                   // LEVEL 2
  practical:[ metric… ],                  // LEVEL 3
  tech:    [ string… ],                   // LEVEL 4
  safety:  [ string… ],                   // LEVEL 5
  ownership:{ warranty, service, finance, exchange },  // LEVEL 6
  colours: [ { name, paint, paintDark } ],
  variants:[ { name, note, from } ],
  match:   { use:[], priority:[], budget }, // powers Find Your Ride
  featured: bool
}
```

Every `metric` may carry `qualifier: 'claimed' | 'idc' | 'real-world'`. The UI renders the
qualifier as a visible mono tag. **Claimed range and real-world range can never be confused**
(§34, and the explicit brief requirement).

Prices carry `note: 'Indicative ex-showroom'` and every price in the interface is followed by
"Confirm current pricing with MM Motors." Nothing is presented as an on-road price, because
on-road pricing is registration-, insurance- and location-dependent and MM Motors has not
supplied it.

---

## 6. INTERACTION & MOTION SYSTEM

- **Native scroll.** No scroll-hijacking or smooth-scroll library. Brand Bible §40: "3D and
  animation should never make scrolling feel stuck."
- **GSAP + ScrollTrigger** for reveals, pinned sequences and the 3D camera. Every reveal is a
  transform + opacity only (GPU-friendly), never layout properties.
- **Reveal grammar:** content rises 24px and fades over `--t-slow` with `--e-out`,
  stagger 60ms. Once. Never on scroll-back.
- **Scroll story** (§26) is used exactly once per page, in INSIDE THE MACHINE:
  `Approach → Reveal → Inspect → Understand → Compare`.
- **Micro-interactions:** hairline draws in, chip fills, metric value counts up once.
- **`prefers-reduced-motion: reduce`** — all ScrollTriggers resolve to final state
  immediately, the 3D scene is replaced by its static SVG exploded view, counters print their
  final value. No information is ever motion-gated.
- **Keyboard:** brand panels, swatches, compare toggles and the finder are all real buttons /
  radios with visible `:focus-visible` accent rings.

### 3D budget

- **One** WebGL context on a page, ever. Created lazily via dynamic `import()` when its
  section enters the viewport; `renderer.setAnimationLoop` is stopped the moment it leaves.
- `devicePixelRatio` capped at 2 (1.5 on mobile). No shadow maps — contact shadow is a baked
  radial-gradient plane. Geometry is procedural (extruded profile + primitives), so there is
  no model download.
- Skipped entirely when: no WebGL, reduced motion, viewport < 720px, or
  `navigator.hardwareConcurrency <= 4`. The SVG exploded view takes over with identical
  content and callouts.
