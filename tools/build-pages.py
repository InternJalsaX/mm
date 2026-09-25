"""Generate the MM Motors HTML pages from one shared shell.

The site is eight static pages that share a header, a mobile drawer, a footer
and a sticky conversion bar. Hand-maintaining that chrome in eight files means
it drifts. This script is the single source for it.

    python tools/build-pages.py

Page *content* lives in the BODIES dict below. Vehicle data lives in
assets/js/data/vehicles.js and is never duplicated here.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

ARROW = (
    '<svg class="btn__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">'
    '<path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" '
    'stroke-linecap="round" stroke-linejoin="round"/></svg>'
)

LOGO_MARK = (
    '<svg class="logo__mark" viewBox="0 0 32 32" aria-hidden="true">'
    '<path d="M2 25V7l6 10.5L14 7v18" stroke="#FF4B12" stroke-width="2.8" fill="none" stroke-linejoin="round"/>'
    '<path d="M17 25V7l6 10.5L29 7v18" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linejoin="round"/>'
    '</svg>'
)

WA_ICON = (
    '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style="width:18px;height:18px">'
    '<path d="M10 .8a9 9 0 00-7.7 13.7L.8 19.2l4.9-1.4A9 9 0 1010 .8zm0 16.4a7.4 7.4 0 01-3.8-1l-.3-.2-2.8.8.8-2.7'
    '-.2-.3A7.4 7.4 0 1110 17.2zm4.2-5.4c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.6.8c-.1.1-.3.2-.5.1a6 6 0 01-2.9'
    '-2.6c-.1-.2 0-.3.1-.5l.5-.6c.1-.2.1-.3 0-.5L8 5.9c-.2-.4-.4-.4-.5-.4h-.4c-.2 0-.5.1-.7.3-.3.3-.8.8-.8 1.8 0 1 '
    '.7 2 .8 2.2a8.5 8.5 0 003.3 2.9c1.6.6 1.9.5 2.3.5.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1a.4.4 0 00-.3-.3z"/></svg>'
)

FAVICON = (
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>"
    "<rect width='32' height='32' fill='%230A0A0B'/>"
    "<path d='M5 24V8l5.5 9L16 8v16' stroke='%23FF4B12' stroke-width='2.6' fill='none'/>"
    "<path d='M18 24V8l5.5 9L29 8v16' stroke='%23F3F0EA' stroke-width='2.6' fill='none'/></svg>"
)

NAV = [
    ("brand", "brand.html?b=tvs", "Brands"),
    ("petrol", "models.html?fuel=petrol", "Petrol"),
    ("electric", "models.html?fuel=electric", "Electric"),
    ("finder", "finder.html", "Find your ride"),
    ("compare", "compare.html", "Compare"),
    ("services", "services.html", "Services"),
]

SHELL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<meta name="theme-color" content="#0A0A0B">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:type" content="website">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;500;600;700&amp;family=Inter:wght@400;500&amp;family=JetBrains+Mono:wght@500;600&amp;display=swap">

<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/base.css">
{css}

<link rel="icon" href="{favicon}">
{head_extra}</head>

<body class="{body_class}" data-page="{page}">

<a class="skip-link" href="#main">Skip to content</a>

<header class="hdr">
  <div class="hdr__inner">
    <a class="logo" href="index.html" aria-label="MM Motors — home">
      {logo}
      MM Motors
      <span class="logo__sub">{logo_sub}</span>
    </a>

    <nav class="nav" aria-label="Main">
{nav_links}
    </nav>

    <div class="hdr__cta">
      <a class="btn btn--primary btn--sm" href="test-ride.html">Book a test ride</a>
      <button class="hdr__burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>
</header>

<div class="drawer" id="drawer" data-open="false">
  <button class="drawer__close" type="button" aria-label="Close menu">
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
  </button>
{drawer_brands}
  <a class="drawer__link" href="models.html?fuel=petrol">Petrol</a>
  <a class="drawer__link" href="models.html?fuel=electric">Electric</a>
  <a class="drawer__link" href="finder.html">Find your ride</a>
  <a class="drawer__link" href="compare.html">Compare</a>
  <a class="drawer__link" href="services.html">Services</a>
  <a class="drawer__link" href="test-ride.html">Book a test ride</a>
</div>

<main id="main">
{body}
</main>

<footer class="ftr">
  <div class="wrap">
    <div class="ftr__top">
      <div class="ftr__col">
        <a class="logo" href="index.html" style="margin-bottom:var(--s-4)">
          {logo}
          MM Motors
        </a>
        <p style="font-size:var(--fs-small);max-width:34ch;color:var(--steel)">
          A multi-brand two-wheeler showroom. Discover, compare and ride before
          you decide.
        </p>
        <p class="micro" style="margin-top:var(--s-4)">
          <span data-dealer="address"></span><br>
          <span data-dealer="hours"></span>
        </p>
      </div>

      <div class="ftr__col">
        <h4>Brands</h4>
        <ul>
{footer_brands}
          <li><a href="models.html?fuel=petrol">All petrol</a></li>
          <li><a href="models.html?fuel=electric">All electric</a></li>
        </ul>
      </div>

      <div class="ftr__col">
        <h4>Decide</h4>
        <ul>
          <li><a href="finder.html">Find your ride</a></li>
          <li><a href="compare.html">Compare models</a></li>
          <li><a href="models.html">Browse everything</a></li>
          <li><a href="test-ride.html">Book a test ride</a></li>
        </ul>
      </div>

      <div class="ftr__col">
        <h4>Talk to us</h4>
        <ul>
          <li><a data-dealer="phone" href="#"></a></li>
          <li><a data-dealer="email" href="#"></a></li>
          <li><a data-whatsapp href="#">WhatsApp</a></li>
          <li><a href="services.html">Services</a></li>
        </ul>
      </div>
    </div>

    <div class="ftr__bottom">
      <p class="micro">© <span data-year></span> MM Motors · Independent dealership</p>
      <p class="micro" style="max-width:58ch;text-transform:none;letter-spacing:0.04em;line-height:1.7">
        {trademark_names} are trademarks of their respective manufacturers. All
        specifications shown are manufacturer-claimed and may vary by variant.
        Prices are indicative ex-showroom, not on-road. Confirm everything with
        MM Motors before purchase.
      </p>
    </div>
  </div>
</footer>

<div class="sticky-cta">
  <a class="btn btn--primary" href="test-ride.html">Book a test ride</a>
  <a class="btn btn--outline" data-whatsapp href="#" aria-label="WhatsApp MM Motors">{wa}</a>
</div>

<script type="module" src="assets/js/app.js"></script>
</body>
</html>
"""

IMPORTMAP = """<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/"
  }
}
</script>
"""


def brand_counts() -> list[tuple[str, str, int]]:
    """Read brand ids, names and model counts straight out of vehicles.js.

    Hard-coding "7 models" in the drawer is how navigation goes stale the first
    time somebody adds a bike.
    """
    src = (ROOT / "assets" / "js" / "data" / "vehicles.js").read_text(encoding="utf-8")

    brands_block = src[src.index("export const BRANDS"): src.index("export const QUALIFIERS")]
    brands = re.findall(r"id: '(\w+)',\s*\n\s*name: '([^']+)'", brands_block)

    vehicles_block = src[src.index("export const VEHICLES"):]
    pairs = re.findall(r"brand: '(\w+)'", vehicles_block)

    return [(bid, name, pairs.count(bid)) for bid, name in brands]


def counts() -> dict[str, int]:
    src = (ROOT / "assets" / "js" / "data" / "vehicles.js").read_text(encoding="utf-8")
    vehicles_block = src[src.index("export const VEHICLES"):]
    fuels = re.findall(r"fuel: '(\w+)'", vehicles_block)
    return {
        "brands": len(brand_counts()),
        "models": len(fuels),
        "petrol": fuels.count("petrol"),
        "electric": fuels.count("electric"),
    }


WORDS = (
    "zero one two three four five six seven eight nine ten eleven twelve "
    "thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty"
).split()


def in_words(n: int) -> str:
    return WORDS[n] if n < len(WORDS) else str(n)


def hero_lede() -> str:
    c = counts()
    return (
        f"{in_words(c['brands']).capitalize()} manufacturers, "
        f"{in_words(c['models'])} models, petrol and electric. Compare them on "
        "figures that are actually published — then ride the two you shortlisted."
    )


def hero_stats() -> str:
    c = counts()
    rows = [
        ("Manufacturers", c["brands"]),
        ("Models", c["models"]),
        ("Electric", c["electric"]),
    ]
    cells = "".join(
        f'\n            <div><dt class="micro">{label}</dt>'
        f'<dd class="hero__stat">{n}</dd></div>'
        for label, n in rows
    )
    return cells + "\n          "


def logo_sub() -> str:
    return f"{len(brand_counts())} brands"


def footer_brands() -> str:
    return "\n".join(
        f'          <li><a href="brand.html?b={bid}">{name}</a></li>'
        for bid, name, _ in brand_counts()
    )


def trademark_names() -> str:
    names = [name for _, name, _ in brand_counts()]
    return ", ".join(names[:-1]) + f" and {names[-1]}" if len(names) > 1 else names[0]


def drawer_brands() -> str:
    rows = []
    for bid, name, count in brand_counts():
        rows.append(
            f'  <a class="drawer__link" href="brand.html?b={bid}">{name} '
            f'<span class="micro">{count} model{"" if count == 1 else "s"}</span></a>'
        )
    return "\n".join(rows)


def nav_links(active: str) -> str:
    out = []
    for key, href, label in NAV:
        cur = ' aria-current="page"' if key == active else ""
        out.append(
            f'      <a class="nav__link" data-nav="{key}" href="{href}"{cur}>{label}</a>'
        )
    return "\n".join(out)


def sec_head(index, eyebrow, title, aside=""):
    aside_html = f'<div data-reveal="fade">{aside}</div>' if aside else ""
    return f"""<header class="sec-head">
        <div>
          <p class="eyebrow" data-index="{index}" data-reveal="fade">{eyebrow}</p>
          <h2 class="h2" data-reveal>{title}</h2>
        </div>
        {aside_html}
      </header>"""


# ==========================================================================
# PAGE BODIES
# ==========================================================================

BODY_INDEX = """
  <!-- ====================== 01 · INTRO ====================== -->
  <section class="hero wrap" id="intro">
    <div class="hero__grid" aria-hidden="true"></div>

    <div class="hero__main">
      <div class="hero__head">
        <p class="eyebrow" data-reveal="fade" data-index="01">Multi-brand two-wheeler showroom</p>
        <h1 class="display hero__title">
          <span class="line">Your next ride,</span>
          <span class="line thin">clearly.</span>
        </h1>
      </div>

      <div class="hero__body">
        <div class="hero__aside" data-reveal-group>
          <p class="lede" data-reveal="fade" data-reveal-delay="180">
            {hero_lede}
          </p>
          <div class="cluster" data-reveal="fade" data-reveal-delay="180">
            <a class="btn btn--primary" href="finder.html">Find your ride ARROW</a>
            <a class="btn btn--outline" href="#brands">See the brands</a>
          </div>
          <dl class="hero__stats" data-reveal="fade" data-reveal-delay="180">{hero_stats}</dl>
        </div>

        <figure class="hero__art" id="hero-art">
          <figcaption class="hero__artcap micro"></figcaption>
        </figure>
      </div>
    </div>

    <div class="hero__foot">
      <span class="scroll-cue">
        <span class="scroll-cue__bar"></span>
        Scroll to enter the showroom
      </span>
      <span class="micro">Discover · Compare · Ride</span>
    </div>
  </section>

  <div class="ticker" aria-hidden="true">
    <div class="ticker__track" id="ticker"></div>
  </div>

  <!-- ====================== 02 · BRANDS ====================== -->
  <section class="section section--tight" id="brands">
    <div class="wrap">
      <header class="sec-head">
        <div>
          <p class="eyebrow" data-index="02" data-reveal="fade">The floor</p>
          <h2 class="h2" data-reveal>Five manufacturers.<br>Pick a doorway.</h2>
        </div>
        <p class="body-dim" data-reveal="fade" style="max-width:36ch;font-size:var(--fs-small)">
          This page shows you who MM Motors represents — not a product grid.
          Open a manufacturer and you get its models, grouped and specified.
        </p>
      </header>
    </div>
    <div class="brand-index" id="brand-index" data-reveal="fade"></div>
  </section>

  <!-- ====================== 03 · PETROL / ELECTRIC ====================== -->
  <section class="section section--flush" id="worlds">
    <div class="wrap">
      <header class="sec-head" style="margin-bottom:var(--s-6)">
        <div>
          <p class="eyebrow" data-index="03" data-reveal="fade">Two ways to move</p>
          <h2 class="h2" data-reveal>Petrol or electric.<br>Different questions.</h2>
        </div>
      </header>
    </div>
    <div class="split" id="split"></div>
  </section>

  <!-- ====================== 04 · FIND YOUR RIDE ====================== -->
  <section class="section on-light" id="find">
    <div class="wrap">
      <header class="sec-head">
        <div>
          <p class="eyebrow" data-index="04" data-reveal="fade">Find your ride</p>
          <h2 class="h2" data-reveal>Don't know yet?<br>Answer four questions.</h2>
        </div>
        <a class="link-rule" data-reveal="fade" href="finder.html">Open the full finder ARROW</a>
      </header>
      <div class="finder" id="finder"></div>
    </div>
  </section>

  <!-- ====================== 06 · INSIDE THE MACHINE ====================== -->
  <section class="machine" id="machine" aria-labelledby="machine-title">
    <div class="machine__track">
      <div class="machine__stage on-graphite">
        <div class="machine__mode">
          <div>
            <p class="eyebrow" data-reveal="fade" data-index="05" style="margin:0">Inside the machine</p>
            <h2 class="h3" id="machine-title" style="margin-top:6px">Scroll to take it apart</h2>
          </div>
          <div class="cluster" role="group" aria-label="Powertrain to inspect">
            <button class="chip" type="button" data-machine="petrol" aria-pressed="true">Petrol</button>
            <button class="chip" type="button" data-machine="electric" aria-pressed="false">Electric</button>
          </div>
        </div>

        <div class="machine__viewport" id="machine-viewport"></div>

        <div class="machine__hud">
          <div class="callout" id="machine-callout" aria-live="polite">
            <p class="callout__q"></p>
            <h3 class="callout__title"></h3>
            <p class="callout__copy"></p>
          </div>
          <div class="machine__progress" id="machine-progress" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ====================== 07 · COMPARE ====================== -->
  <section class="section on-light" id="compare">
    <div class="wrap">
      <header class="sec-head">
        <div>
          <p class="eyebrow" data-index="06" data-reveal="fade">Compare</p>
          <h2 class="h2" data-reveal>Two models.<br>One honest table.</h2>
        </div>
        <a class="link-rule" data-reveal="fade" href="compare.html">Full comparison tool ARROW</a>
      </header>
      <div id="compare-strip" data-reveal></div>
      <p class="disclosure" style="margin-top:var(--s-5)">
        Petrol mileage and electric range are measured differently and are not
        interchangeable. Every figure here carries its own qualifier, and no
        "best" is marked where the units differ.
      </p>
    </div>
  </section>

  <!-- ====================== 08 · TEST RIDE ====================== -->
  <section class="section testride" id="testride">
    <div class="wrap testride__inner">
      <div class="stack-lg">
        <p class="eyebrow" data-index="07" data-reveal="fade">Experience</p>
        <h2 class="h1" data-reveal>Feel it before<br>you decide.</h2>
        <p class="lede" data-reveal="fade">
          Specifications narrow it down to two. Ten minutes in the saddle decides
          which one. Bring a licence — we'll have both ready.
        </p>
        <div class="cluster" data-reveal="fade">
          <a class="btn btn--primary" href="test-ride.html">Book a test ride ARROW</a>
          <a class="btn btn--outline" data-whatsapp href="#">WhatsApp MM Motors</a>
        </div>
        <dl class="metric-row" data-reveal="fade" style="max-width:560px">
          <div class="metric"><dt class="metric__label">Test rides</dt><dd class="metric__value">7<span class="metric__unit">days a week</span></dd></div>
          <div class="metric"><dt class="metric__label">Duration</dt><dd class="metric__value">10<span class="metric__unit">minutes+</span></dd></div>
          <div class="metric"><dt class="metric__label">Cost</dt><dd class="metric__value">Free<span class="metric__unit">no obligation</span></dd></div>
        </dl>
      </div>
      <div class="testride__art" id="testride-art" data-reveal="scale" aria-hidden="true"></div>
    </div>
  </section>

  <!-- ====================== 09 · SERVICES ====================== -->
  <section class="section" id="services">
    <div class="wrap">
      <header class="sec-head">
        <div>
          <p class="eyebrow" data-index="08" data-reveal="fade">Services</p>
          <h2 class="h2" data-reveal>Everything after<br>the handshake.</h2>
        </div>
        <a class="link-rule" data-reveal="fade" href="services.html">All services ARROW</a>
      </header>
      <div class="services" data-reveal-group>
        <a class="service" href="models.html" data-reveal="fade">
          <span class="service__idx">01</span><span class="service__name">Buy</span>
          <span class="service__copy">{count_models} models across {count_brands} manufacturers, petrol and electric, on one floor.</span>
        </a>
        <a class="service" href="services.html#finance" data-reveal="fade">
          <span class="service__idx">02</span><span class="service__name">Finance</span>
          <span class="service__copy">EMI through our lending partners. Estimate it yourself on any model page.</span>
        </a>
        <a class="service" href="services.html#insure" data-reveal="fade">
          <span class="service__idx">03</span><span class="service__name">Insure</span>
          <span class="service__copy">Policy set up at the time of registration, renewals handled in-showroom.</span>
        </a>
        <a class="service" href="services.html#exchange" data-reveal="fade">
          <span class="service__idx">04</span><span class="service__name">Exchange</span>
          <span class="service__copy">Bring your old two-wheeler. We evaluate it against the new purchase.</span>
        </a>
        <a class="service" href="services.html#service" data-reveal="fade">
          <span class="service__idx">05</span><span class="service__name">Service</span>
          <span class="service__copy">Periodic servicing and repairs for everything we sell, at our own bay.</span>
        </a>
        <a class="service" href="test-ride.html" data-reveal="fade">
          <span class="service__idx">06</span><span class="service__name">Experience</span>
          <span class="service__copy">Test rides, seven days a week. The only part of this you cannot do online.</span>
        </a>
      </div>
    </div>
  </section>
"""

BODY_MODEL = """
  <noscript>
    <div class="wrap" style="padding-top:110px">
      <div class="empty" style="max-width:62ch">
        <p class="eyebrow" data-reveal="fade" data-index="!">JavaScript is off</p>
        <h1 class="h2">This page builds its detail from our model data.</h1>
        <p class="body-dim">
          Specifications, colours and variants are rendered in the browser, so
          with JavaScript disabled there is nothing to show here. Everything is
          still reachable — call MM Motors and we will read you any figure you
          need.
        </p>
        <div class="cluster">
          <a class="btn btn--primary" href="models.html">All models</a>
          <a class="btn btn--outline" href="services.html">Services</a>
          <a class="btn btn--outline" href="test-ride.html">Book a test ride</a>
        </div>
      </div>
    </div>
  </noscript>

  <div class="wrap" id="model-rail"></div>

  <section class="p-hero wrap" id="model-hero"></section>

  <nav class="p-nav" aria-label="On this page">
    <div class="wrap p-nav__inner" id="model-nav"></div>
  </nav>

  <div class="wrap" id="model-body"></div>

  <section class="section testride">
    <div class="wrap testride__inner">
      <div class="stack-lg">
        <p class="eyebrow" data-index="→" data-reveal="fade">Experience</p>
        <h2 class="h1" data-reveal>Feel it before<br>you decide.</h2>
        <p class="lede" data-reveal="fade" id="model-tr-copy"></p>
        <div class="cluster" data-reveal="fade">
          <a class="btn btn--primary" id="model-tr-cta" href="test-ride.html">Book a test ride ARROW</a>
          <a class="btn btn--outline" data-whatsapp href="#">WhatsApp MM Motors</a>
        </div>
      </div>
      <div class="testride__art" id="model-tr-art" data-reveal="scale" aria-hidden="true"></div>
    </div>
  </section>

  <section class="section" id="model-related"></section>
"""

BODY_MODELS = """
  <section class="page-head wrap">
    <div id="models-rail"></div>
    <div class="page-head__inner" data-reveal-group>
      <div>
        <p class="eyebrow" data-reveal="fade" data-index="→" id="models-eyebrow">The floor</p>
        <h1 class="h1 page-head__title" data-reveal id="models-title">Every model<br>on the floor.</h1>
      </div>
      <p class="lede" data-reveal="fade" id="models-lede">
        {count_models} two-wheelers from {count_brands} manufacturers. Filter by what
        actually decides it for you, then shortlist up to three to compare.
      </p>
    </div>
  </section>

  <section class="section section--tight wrap">
    <div class="browse">
      <aside class="filters" id="filters" aria-label="Filter models"></aside>
      <div>
        <div class="browse__bar">
          <p class="browse__count" id="browse-count"></p>
          <div class="cluster">
            <label class="filter-group__title" for="sort">Sort</label>
            <select class="field__select" id="sort" style="min-height:40px;width:auto;padding-block:8px">
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
              <option value="eff-desc">Mileage / range, high to low</option>
              <option value="weight-asc">Kerb weight, light to heavy</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
        <div class="v-grid" id="browse-grid" data-reveal-group></div>
        <p class="disclosure" style="margin-top:var(--s-6)">
          Manufacturer-claimed figures. Petrol mileage in km/l and electric range
          in km are measured differently and cannot be compared directly. Prices
          are indicative ex-showroom. Confirm with MM Motors.
        </p>
      </div>
    </div>
  </section>
"""

BODY_BRAND = """
  <noscript>
    <div class="wrap" style="padding-top:110px">
      <div class="empty" style="max-width:62ch">
        <p class="eyebrow" data-reveal="fade" data-index="!">JavaScript is off</p>
        <h1 class="h2">This page builds its detail from our model data.</h1>
        <p class="body-dim">
          Specifications, colours and variants are rendered in the browser, so
          with JavaScript disabled there is nothing to show here. Everything is
          still reachable — call MM Motors and we will read you any figure you
          need.
        </p>
        <div class="cluster">
          <a class="btn btn--primary" href="models.html">All models</a>
          <a class="btn btn--outline" href="services.html">Services</a>
          <a class="btn btn--outline" href="test-ride.html">Book a test ride</a>
        </div>
      </div>
    </div>
  </noscript>

  <section class="brand-hero wrap" id="brand-hero"></section>
  <section class="section section--tight wrap" id="brand-models"></section>
  <section class="section on-light" id="brand-close"></section>
"""

BODY_COMPARE = """
  <section class="page-head wrap">
    <div class="page-head__inner" data-reveal-group>
      <div>
        <p class="eyebrow" data-reveal="fade" data-index="→">Compare</p>
        <h1 class="h1 page-head__title" data-reveal>Put them<br>side by side.</h1>
      </div>
      <p class="lede" data-reveal="fade">
        Up to three models at once. Where a figure is the strongest in the row it
        is marked — but only when the units actually match.
      </p>
    </div>
  </section>

  <section class="section section--tight wrap">
    <div class="cmp-page">
      <div>
        <header class="sec-head" style="margin-bottom:var(--s-5)">
          <div>
            <p class="eyebrow" data-reveal="fade" data-index="01">Pick models</p>
            <h2 class="h3" data-reveal>Choose up to three</h2>
          </div>
          <button class="btn btn--ghost btn--sm" type="button" data-garage-clear>Clear all</button>
        </header>
        <div class="cmp-picker" id="cmp-picker"></div>
      </div>

      <div id="cmp-result"></div>
    </div>
  </section>
"""

BODY_FINDER = """
  <section class="page-head wrap">
    <div class="page-head__inner" data-reveal-group>
      <div>
        <p class="eyebrow" data-reveal="fade" data-index="→">Find your ride</p>
        <h1 class="h1 page-head__title" data-reveal>Tell us how<br>you'll use it.</h1>
      </div>
      <p class="lede" data-reveal="fade">
        Four questions. No email, no phone number, no sales call. The result
        explains why each model matched, so you can disagree with it.
      </p>
    </div>
  </section>

  <section class="section section--tight wrap">
    <div class="finder" id="finder-full"></div>
  </section>

  <section class="section on-light wrap">
    <header class="sec-head">
      <div>
        <p class="eyebrow" data-index="→" data-reveal="fade">Still stuck?</p>
        <h2 class="h2" data-reveal>Some questions<br>a website can't answer.</h2>
      </div>
    </header>
    <div class="own-grid">
      <div class="own-card" data-reveal>
        <h4>Can you flat-foot it?</h4>
        <p>Seat height is published, but whether it suits your inseam is something you find out in ten seconds in the showroom.</p>
      </div>
      <div class="own-card" data-reveal>
        <h4>Will an EV work for you?</h4>
        <p>It depends entirely on where you park overnight. If you cannot run a cable to it, range is the wrong thing to be comparing.</p>
      </div>
      <div class="own-card" data-reveal>
        <h4>Does the boot fit your helmet?</h4>
        <p>Litres are litres, but helmet shapes differ. Bring yours and we will try it in the underseat storage.</p>
      </div>
      <div class="own-card" data-reveal>
        <h4>What will it really cost?</h4>
        <p>Every price on this site is ex-showroom. On-road depends on registration, insurance and accessories — ask us for the real number.</p>
      </div>
    </div>
    <div class="cluster" style="margin-top:var(--s-6)">
      <a class="btn btn--primary" href="test-ride.html">Book a test ride ARROW</a>
      <a class="btn btn--outline" data-whatsapp href="#">WhatsApp MM Motors</a>
    </div>
  </section>
"""

BODY_TESTRIDE = """
  <section class="page-head wrap">
    <div class="page-head__inner" data-reveal-group>
      <div>
        <p class="eyebrow" data-reveal="fade" data-index="→">Experience</p>
        <h1 class="h1 page-head__title" data-reveal>Feel it before<br>you decide.</h1>
      </div>
      <p class="lede" data-reveal="fade">
        Ten minutes, no cost, no obligation. Ride two models back to back — that
        is when the decision actually gets made.
      </p>
    </div>
  </section>

  <section class="section section--tight wrap">
    <div class="book">
      <form class="stack-lg" id="tr-form" novalidate>
        <div class="form-grid">
          <div class="field field--full">
            <label class="field__label" for="tr-models">Which models?</label>
            <div class="cmp-picker" id="tr-models"></div>
            <p class="form-note">Pick up to three. Anything in your garage is already selected.</p>
          </div>

          <div class="field">
            <label class="field__label" for="tr-name">Your name</label>
            <input class="field__input" id="tr-name" name="name" required autocomplete="name">
          </div>

          <div class="field">
            <label class="field__label" for="tr-phone">Phone</label>
            <input class="field__input" id="tr-phone" name="phone" type="tel" required
                   inputmode="tel" autocomplete="tel" placeholder="10-digit mobile">
          </div>

          <div class="field">
            <label class="field__label" for="tr-date">Preferred date</label>
            <input class="field__input" id="tr-date" name="date" type="date" required>
          </div>

          <div class="field">
            <label class="field__label" for="tr-slot">Preferred time</label>
            <select class="field__select" id="tr-slot" name="slot">
              <option>Morning · 09:30–12:00</option>
              <option>Afternoon · 12:00–16:00</option>
              <option>Evening · 16:00–19:30</option>
            </select>
          </div>

          <div class="field field--full">
            <label class="field__label" for="tr-note">Anything we should know?</label>
            <textarea class="field__area" id="tr-note" name="note"
                      placeholder="First two-wheeler, riding with a pillion, upgrading from something else…"></textarea>
          </div>
        </div>

        <div class="stack">
          <button class="btn btn--primary" type="submit">Request this test ride ARROW</button>
          <p class="form-note">
            You need a valid two-wheeler licence to ride. We will confirm the slot
            by phone — nothing is booked until we do.
          </p>
        </div>
      </form>

      <aside class="book__aside">
        <p class="eyebrow" data-reveal="fade" data-index="→" style="margin:0">How it works</p>
        <ol class="steps-list">
          <li><span class="micro">01</span><span>Send this request with the models you want to ride.</span></li>
          <li><span class="micro">02</span><span>We call you back to confirm the slot and check availability.</span></li>
          <li><span class="micro">03</span><span>Bring your licence. We have the vehicles charged, fuelled and ready.</span></li>
          <li><span class="micro">04</span><span>Ride them back to back. That comparison is the whole point.</span></li>
        </ol>
        <hr class="hairline">
        <div class="stack">
          <p class="micro">MM Motors</p>
          <p style="font-size:var(--fs-small);color:var(--fg-dim)">
            <span data-dealer="address"></span><br>
            <span data-dealer="hours"></span>
          </p>
          <a class="btn btn--outline btn--sm" data-dealer="phone" href="#"></a>
          <a class="btn btn--outline btn--sm" data-whatsapp href="#">WhatsApp MM Motors</a>
        </div>
      </aside>
    </div>
  </section>
"""

BODY_SERVICES = """
  <section class="page-head wrap">
    <div class="page-head__inner" data-reveal-group>
      <div>
        <p class="eyebrow" data-reveal="fade" data-index="→">Services</p>
        <h1 class="h1 page-head__title" data-reveal>Everything after<br>the handshake.</h1>
      </div>
      <p class="lede" data-reveal="fade">
        Buying the vehicle is one afternoon. Owning it is the next five years.
        These are the six things MM Motors does about that.
      </p>
    </div>
  </section>

  <div class="wrap" data-reveal-group>
    <section class="svc" data-reveal id="buy">
      <div class="p-sec__label">
        <span class="p-sec__idx">01</span>
        <h2 class="p-sec__title">Buy</h2>
      </div>
      <div class="svc__body">
        <p class="body-dim">{count_models} models from {count_brands} manufacturers, petrol and electric, on one floor — so you can compare a 110 cc scooter against an electric one against a 350 cc roadster without driving across the city five times.</p>
        <ul class="svc__list">
          <li><span class="micro">01</span><span>Every variant of every model we list, including the ones that are not on display.</span></li>
          <li><span class="micro">02</span><span>Registration and number plate handled here.</span></li>
          <li><span class="micro">03</span><span>Accessories fitted before delivery, not after.</span></li>
        </ul>
        <a class="link-rule" href="models.html">Browse all models ARROW</a>
      </div>
    </section>

    <section class="svc" data-reveal id="finance">
      <div class="p-sec__label">
        <span class="p-sec__idx">02</span>
        <h2 class="p-sec__title">Finance</h2>
      </div>
      <div class="svc__body">
        <p class="body-dim">EMI through our lending partners. Every model page has an estimator you can use before you talk to anybody — it is deliberately rough, because the real rate depends on your credit profile and we are not going to pretend otherwise.</p>
        <ul class="svc__list">
          <li><span class="micro">01</span><span>Down payment, tenure and rate are all yours to change.</span></li>
          <li><span class="micro">02</span><span>Approval depends on documents and eligibility, not on us.</span></li>
          <li><span class="micro">03</span><span>Ask for the on-road figure before you calculate anything seriously.</span></li>
        </ul>
        <p class="disclosure">Any EMI figure on this site is an indicative estimate on a simple reducing-balance calculation. It is not an offer of credit and not a quotation.</p>
      </div>
    </section>

    <section class="svc" data-reveal id="insure">
      <div class="p-sec__label">
        <span class="p-sec__idx">03</span>
        <h2 class="p-sec__title">Insure</h2>
      </div>
      <div class="svc__body">
        <p class="body-dim">Third-party cover is a legal requirement; comprehensive cover is the one that matters when a scooter goes missing from outside your building. We set the policy up at registration and handle renewals here.</p>
        <ul class="svc__list">
          <li><span class="micro">01</span><span>Policy issued before delivery, so the vehicle never leaves uninsured.</span></li>
          <li><span class="micro">02</span><span>Renewal reminders and renewal itself, in-showroom.</span></li>
          <li><span class="micro">03</span><span>Claim paperwork support if you need it.</span></li>
        </ul>
      </div>
    </section>

    <section class="svc" data-reveal id="exchange">
      <div class="p-sec__label">
        <span class="p-sec__idx">04</span>
        <h2 class="p-sec__title">Exchange</h2>
      </div>
      <div class="svc__body">
        <p class="body-dim">Bring the old two-wheeler with you. We evaluate it against the new purchase — condition, kilometres, service history and papers. The figure comes from what it is actually worth, which is sometimes less than you hoped and occasionally more.</p>
        <ul class="svc__list">
          <li><span class="micro">01</span><span>Valuation done in the showroom, with you present.</span></li>
          <li><span class="micro">02</span><span>Bring the RC, insurance and service records.</span></li>
          <li><span class="micro">03</span><span>Transfer paperwork handled as part of the deal.</span></li>
        </ul>
      </div>
    </section>

    <section class="svc" data-reveal id="service">
      <div class="p-sec__label">
        <span class="p-sec__idx">05</span>
        <h2 class="p-sec__title">Service</h2>
      </div>
      <div class="svc__body">
        <p class="body-dim">Our own service bay, for everything we sell. Petrol vehicles follow the manufacturer's periodic schedule. Electric ones need far less — no oil, no clutch, no chain — but the battery health check is the one you should never skip.</p>
        <ul class="svc__list">
          <li><span class="micro">01</span><span>Periodic services as per the manufacturer schedule for your model.</span></li>
          <li><span class="micro">02</span><span>Genuine parts, and we will tell you when a part is not worth replacing yet.</span></li>
          <li><span class="micro">03</span><span>Battery health reporting for electric vehicles.</span></li>
        </ul>
      </div>
    </section>

    <section class="svc" data-reveal id="experience">
      <div class="p-sec__label">
        <span class="p-sec__idx">06</span>
        <h2 class="p-sec__title">Experience</h2>
      </div>
      <div class="svc__body">
        <p class="body-dim">The test ride. It is the only part of choosing a two-wheeler that cannot be done on a website, which is precisely why the rest of this site exists — to get you down to two models worth riding.</p>
        <ul class="svc__list">
          <li><span class="micro">01</span><span>Seven days a week, ten minutes or more, at no cost.</span></li>
          <li><span class="micro">02</span><span>Two models back to back, so the difference is obvious.</span></li>
          <li><span class="micro">03</span><span>Valid two-wheeler licence required.</span></li>
        </ul>
        <a class="link-rule" href="test-ride.html">Book a test ride ARROW</a>
      </div>
    </section>
  </div>

  <section class="section wrap">
    <div class="band">
      <h2 class="h2" data-reveal>Talk to<br>MM Motors.</h2>
      <div class="stack-lg" data-reveal="fade">
        <p class="body-dim">
          The fastest way to get a straight answer about price, availability or
          whether a model suits you is to ask. We would rather tell you a vehicle
          is wrong for you than sell it to you twice.
        </p>
        <div class="cluster">
          <a class="btn btn--primary" data-dealer="phone" href="#"></a>
          <a class="btn btn--outline" data-whatsapp href="#">WhatsApp MM Motors</a>
        </div>
        <p class="micro">
          <span data-dealer="address"></span><br>
          <span data-dealer="hours"></span>
        </p>
      </div>
    </div>
  </section>
"""

# ==========================================================================

PAGES = {
    "index.html": dict(
        page="home",
        active="",
        title="MM Motors — Find your ride. Scooters and motorcycles, petrol and electric.",
        description=(
            "MM Motors is a multi-brand two-wheeler showroom. "
            "Compare petrol and electric scooters and motorcycles on published "
            "specifications, then book a test ride."
        ),
        css=["home"],
        body=BODY_INDEX,
        three=True,
    ),
    "models.html": dict(
        page="models",
        active="petrol",
        title="All models — MM Motors",
        description="Every two-wheeler at MM Motors. Filter by fuel, manufacturer, budget and what matters most to you.",
        css=["home", "product"],
        body=BODY_MODELS,
    ),
    "model.html": dict(
        page="model",
        active="",
        title="Model — MM Motors",
        description="Full specifications, colours, variants and ownership details, with every figure labelled as manufacturer-claimed.",
        css=["home", "product"],
        body=BODY_MODEL,
        three=True,
    ),
    "brand.html": dict(
        page="brand",
        active="brand",
        title="Brand — MM Motors",
        description="The manufacturers MM Motors represents, and every model each of them builds.",
        css=["home", "product"],
        body=BODY_BRAND,
    ),
    "compare.html": dict(
        page="compare",
        active="compare",
        title="Compare models — MM Motors",
        description="Compare up to three two-wheelers side by side on price, engine, mileage, range, weight and storage.",
        css=["home", "product"],
        body=BODY_COMPARE,
    ),
    "finder.html": dict(
        page="finder",
        active="finder",
        title="Find your ride — MM Motors",
        description="Four questions, then a shortlist of two-wheelers that fit how you actually ride — with the reasoning shown.",
        css=["home", "product"],
        body=BODY_FINDER,
    ),
    "test-ride.html": dict(
        page="test-ride",
        active="",
        title="Book a test ride — MM Motors",
        description="Request a test ride at MM Motors. Ten minutes, no cost, no obligation. Ride two models back to back.",
        css=["home", "product"],
        body=BODY_TESTRIDE,
    ),
    "services.html": dict(
        page="services",
        active="services",
        title="Services — MM Motors",
        description="Buy, finance, insure, exchange, service and experience. What MM Motors does after the sale.",
        css=["home", "product"],
        body=BODY_SERVICES,
    ),
}


def build() -> None:
    for filename, spec in PAGES.items():
        css = "\n".join(
            f'<link rel="stylesheet" href="assets/css/{name}.css">' for name in spec["css"]
        )
        head_extra = IMPORTMAP if spec.get("three") else ""
        # Body placeholders are substituted explicitly, not via .format(), so a
        # stray brace in an inline style can never blow the build up.
        body = spec["body"].replace("ARROW", ARROW)
        for token, value in (
            ("{hero_lede}", hero_lede()),
            ("{hero_stats}", hero_stats()),
            ("{count_models}", str(counts()["models"])),
            ("{count_brands}", in_words(counts()["brands"])),
        ):
            body = body.replace(token, value)

        html = SHELL.format(
            title=spec["title"],
            description=spec["description"],
            css=css,
            favicon=FAVICON,
            head_extra=head_extra,
            body_class=spec.get("body_class", "on-dark"),
            page=spec["page"],
            logo=LOGO_MARK,
            nav_links=nav_links(spec["active"]),
            drawer_brands=drawer_brands(),
            hero_lede=hero_lede(),
            hero_stats=hero_stats(),
            logo_sub=logo_sub(),
            footer_brands=footer_brands(),
            trademark_names=trademark_names(),
            body=body,
            wa=WA_ICON,
        )
        (ROOT / filename).write_text(html, encoding="utf-8")
        print(f"wrote {filename}")


if __name__ == "__main__":
    build()
