# Vehicle photography

The site loads `assets/img/vehicles/<model-id>.png` for every model. All twelve
are currently in place.

If a file is ever missing, that vehicle falls back to the technical pictogram
rather than a broken image — so the interface is never in a broken state.

## Replacing them

```
python tools/prepare-photos.py "C:/path/to/photos"
```

Source files can be named after the model (`tvs-jupiter.png`, `activa 125.jpg`)
or numbered `1`–`12` in this order:

```
 1  honda-sp-125          red motorcycle
 2  honda-activa-125      maroon scooter
 3  honda-activa          blue scooter
 4  honda-livo            blue motorcycle, neon graphics
 5  honda-shine           all-black motorcycle
 6  tvs-apache-rtx-300    olive-green adventure bike
 7  tvs-radeon            blue commuter motorcycle
 8  tvs-ntorq-125         black scooter, red wheels
 9  tvs-jupiter           blue scooter
10  tvs-jupiter-125       maroon scooter, chrome
11  tvs-iqube             blue/beige scooter, plug badge
12  tvs-xl100             peach moped
```

Add `--dry-run` to see what it would do first.

## What the tool does for you

- **Removes an opaque background** by flood-filling inward from the edges. This
  is deliberately *not* a global "white becomes transparent" key — these bikes
  carry white stripe graphics and white number-plate panels, and a global key
  would punch holes straight through them.
- **Feathers the alpha edge** so the cut-out does not look done with scissors.
- **Re-frames every model** at the same relative size on a 16:10 canvas with a
  shared wheel baseline, so a moped and an adventure tourer sit at a believable
  common scale across a grid.
- **Never upscales.**

## What the source images should be

- **Side profile**, consistently — the layout and the pictogram fallback both
  assume side-on, and mixing angles across cards is the fastest way to make a
  showroom look untidy.
- **White or transparent background.** Either works; white gets keyed out.
- **~1200 px wide or more.** The current set is only 360–372 px, which is the one
  real quality limitation on the site: the product hero shows a vehicle at up to
  roughly 700 px CSS, so it looks soft on a large screen.
- **Do not pre-crop tightly.** The tool trims and re-frames; it just needs to be
  able to find the edges.

## Rights

These are manufacturer press images. Using TVS and Honda product photography for
models MM Motors actually sells is normal dealer practice — but confirm with each
manufacturer's dealer marketing team that you are within the terms they supply
assets under before the site goes public.
