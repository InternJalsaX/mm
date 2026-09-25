# MM MOTORS

A digital showroom for a multi-brand two-wheeler dealership — TVS, Honda,
Bajaj, Royal Enfield and River. Petrol and electric, 18 models.

Built from the MM Motors Brand Bible. The design decisions and their reasoning
are in **[DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)**.

> **Before this goes public, read [VERIFY.md](VERIFY.md).** The specifications
> are real and plausible but were not taken from your current brochures, and
> every price is an indicative placeholder. Several model names need
> confirming, and the site now asserts dealership agreements with five
> manufacturers — §34 forbids inventing those, so check them.

---

## Run it

```bash
python mm-motors/serve.py 8124
```

Then open <http://localhost:8124>. The dev server sets no-store headers so CSS
and JS changes appear on reload.

ES modules need a server — opening `index.html` from the filesystem will not work.

## The photography

All 18 models have a photograph in place. Resolution varies from 1056 px down to
227 px — VERIFY.md §6 lists which five are worth re-sourcing. To replace any:

```bash
python tools/prepare-photos.py "C:/path/to/photos"
```

That matches files by name (or by number 1–22 in the supplied order), keys out an
opaque background by flood-filling inward from the edges, feathers the edge, and
re-frames every model at the same relative size on a 16:10 canvas with a shared
wheel baseline. It never upscales. Add `--dry-run` to preview.

`tools/import-photos.py` is the plain copy-and-rename version, for assets that
are already cut out and framed.

If a photograph is ever missing, that vehicle falls back to a technical
pictogram rather than a broken image — so the site is never in a broken state.

## Check the data

```bash
python tools/audit-data.py
```

Reports which models still have unverified figures, which photographs are
missing, and whether the dealership contact details are still placeholders.

---

## Structure

```
index.html            Homepage — the showroom entrance
models.html           Browse · also the Petrol and Electric worlds via ?fuel=
model.html?m=<id>     Product page
brand.html?b=<id>     Manufacturer page
compare.html          Comparison, up to three models
finder.html           Find Your Ride
test-ride.html        Test ride request
services.html         Buy · Finance · Insure · Exchange · Service · Experience

assets/css/
  tokens.css          Colour, type, space, motion. Change the brand here.
  base.css            Reset, type roles, layout, components, chrome
  home.css            Homepage sections
  product.css         Product, browse, brand, compare, forms

assets/js/
  app.js              Shell: chrome behaviour, then a lazy page module
  data/vehicles.js    ← ALL vehicle facts live here. Single source of truth.
  art.js              Photo + fallback resolution, component callouts
  art-shapes.js       Pictogram geometry
  showroom3d.js       WebGL stage (lazy, gated, procedural — no model download)
  machine.js          The "Inside the machine" scroll story
  match.js            Find Your Ride scoring, with reasons
  compare-view.js     Comparison table and the same-unit rule
  garage.js           Shortlist that persists across pages
  motion.js           Reveals, counters, scroll progress
  ui.js               Component render functions
  pages/*.js          One module per page

tools/
  build-pages.py      Generates the 8 HTML files from one shared shell
  prepare-photos.py   Keys, feathers and re-frames vehicle photography
  import-photos.py    Plain copy-and-rename, for already-prepared assets
  audit-data.py       Data confidence report
```

### Adding a model

Add one object to `VEHICLES` in `assets/js/data/vehicles.js` and drop a photo at
`assets/img/vehicles/<id>.png`. It appears on the homepage, in browse, in the
filters, in the finder, in the comparison picker and on its own product page.
No page changes.

### Adding a manufacturer

Add an entry to `BRANDS` and give its vehicles that `brand` id. The homepage
brand index, the mobile drawer, the footer list, the filters, the trademark line
and every "N models / N manufacturers" count in the copy all derive from the
data — none of it needs editing by hand.

The one structural change that going from two manufacturers to five forced was
the homepage. Two brands worked as side-by-side expanding panels; five collapse
to roughly 200 px each, which is narrower than the wordmark they carry. It is a
full-width editorial index now, which scales to any number of manufacturers.

### Editing page copy or chrome

Page content and the shared header/footer live in `tools/build-pages.py`. Edit
there and run:

```bash
python tools/build-pages.py
```

Editing the `.html` files directly works too, but the next build overwrites
them — and the chrome would then differ between pages, which is the problem the
generator exists to prevent.

---

## How the brand rules are enforced in code

The Brand Bible's trust principles are not comments, they are behaviour:

- **Every figure carries its qualifier.** `metric()` renders a `claimed` / `IDC`
  tag next to any value whose data carries one. There is no code path that
  prints a claimed figure bare.
- **Mileage and range are never conflated.** The comparison marks a "best" value
  only when every column in that row shares a unit — so an electric iQube
  against a petrol Activa marks only price and kerb weight, and leaves
  mileage-vs-range, battery, charging and fuel capacity unmarked. Sorting by
  efficiency groups by fuel first.
- **No on-road price exists in the data model.** Only `price.from`, `price.to`
  and a `note`, and the UI always appends "Confirm with MM Motors".
- **The finder explains itself.** `match()` returns reasons, ordered
  most-specific-first, and a recommendation without a stated reason is treated
  as a bug.
- **One accent colour.** Petrol and electric are distinguished by a monospace
  label and filled-vs-outlined indicators, never by a second accent.

## Performance and accessibility

- No framework, no build step, no bundler. Each page loads its own module.
- Reveals and counters run on IntersectionObserver and CSS transitions — nothing
  on the critical path depends on a motion library. GSAP loads lazily for the
  scroll story only, and if the CDN is unreachable those sections resolve to
  their finished state.
- Native scroll throughout. No scroll hijacking.
- **One WebGL context per page, ever.** Created lazily when its section nears the
  viewport, stopped the moment it leaves. Skipped entirely under reduced motion,
  below 900px, on ≤4 cores, on Save-Data, or without WebGL — the pictogram
  exploded view takes over with identical content.
- Geometry for the 3D stage is generated in the browser, so there is no model
  file to download.
- `prefers-reduced-motion` resolves every animation to its final state. The hero
  headline uses a keyframe with `both` fill rather than a JS-toggled class, so
  it can never be left hidden by a frame that did not run.
- Real buttons and selects throughout, with visible focus rings. Filter and
  finder controls restore focus after the re-render that follows a selection.

## Known limitations

- **No backend.** The test-ride form validates, then composes the request and
  hands it to WhatsApp — which is how this dealership actually takes bookings,
  and is honest about where the information goes. Replace `deliver()` in
  `assets/js/pages/test-ride.js` to POST to a real endpoint instead.
- **Product and brand pages render client-side** from the data module, so they
  need JavaScript. The chrome, headings and copy are in the HTML; the vehicle
  detail is not. If search indexing of individual model pages matters, these
  should be pre-rendered — `tools/build-pages.py` is the natural place to do it.
- The 3D stage is a stylized object built from an extruded profile, not a CAD
  model of any specific vehicle. It is there to explain how a scooter is laid
  out. The photographs are the product representation.
- **The photography is low resolution, unevenly.** Sources range from 1056 px
  (River Indie) down to 227 px (Bajaj, Royal Enfield, Honda CB350). The product
  hero shows a vehicle at up to roughly 700 px CSS, so that last group is scaled
  about 3× and looks soft. Nothing was upscaled — upscaling adds blur and bytes
  and no detail. Higher-resolution versions dropped through
  `tools/prepare-photos.py` fix it with no code change.
- **One supplied photograph is unused** — a black/red retro roadster I could not
  identify as either a Honda CB350 RS or a Royal Enfield Hunter 350. Guessing
  would have put the wrong manufacturer on a product page. See VERIFY.md §1.
