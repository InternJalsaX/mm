# Brand logos

Drop a manufacturer logo here as `<brand-id>.svg` (preferred), `.png` or
`.webp` and the browse grid uses it automatically — `brand_logo()` in
`tools/build-pages.py` looks for the file on disk, so no code or data edit
is needed. Rebuild with `python tools/build-pages.py`.

Brand ids come from `BRANDS` in `assets/js/data/vehicles.js`:

    tvs.svg  honda.svg  bajaj.svg  royalenfield.svg  river.svg

Until a file exists, the tile falls back to a typographic wordmark built
from the brand name. That is deliberate: these are third-party trademarks
and the files have to come from the manufacturer or the dealership's own
brand pack, not from a web search.
