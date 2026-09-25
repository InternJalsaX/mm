# VERIFY BEFORE LAUNCH

Brand Bible §34: *"Never invent mileage, range, prices, warranty, battery capacity,
engine specifications, manufacturer claims or dealer relationships."*

Every figure on this site is presented as manufacturer-claimed and carries a
visible qualifier, and no on-road price is stated anywhere. But **the dataset was
assembled from general knowledge of these models, not from your current
brochures.** That makes this document the most important file in the build.

Nothing here is a placeholder like "XX cc" — the figures are real and plausible,
which is exactly why they are dangerous if wrong. A wrong mileage number reads as
authoritative.

**Do not publish until the table below is checked against the current dealer
brochures from all five manufacturers.**

MM Motors is recorded here as representing **TVS, Honda, Bajaj, Royal Enfield
and River** — 18 models. Brand Bible §34 forbids inventing dealer
relationships, so confirm each of those five is a real dealership agreement
before the site is public.

Everything lives in one file: `assets/js/data/vehicles.js`.

---

## 1. Model identification — CHECK FIRST

A wrong model name is the worst failure mode on this site: the name, the
specifications and the photograph would all be confidently mismatched.

### Genuinely uncertain — confirm before publishing

| Data entry | Photograph | Could also be |
|---|---|---|
| `honda-sp-125` | red motorcycle, wing badge on tank | Honda Unicorn, or Livo |
| `honda-shine` | all-black motorcycle | Honda Unicorn, or SP 125 in black |
| `bajaj-pulsar-ns200` | black naked bike, red alloys | Pulsar NS160, N160 or N250 — the NS and N families look alike at thumbnail size |
| `bajaj-chetak` | teal retro electric scooter | Confident it is a Chetak; confirm which variant (2903 / 3501) you stock |
| `honda-cb350` | silver retro roadster | Confident it is a CB350; confirm the trim naming |

### One photograph is not used at all

**Source image 20** — a black-and-red retro roadster — I could not identify. It
is most likely a **Honda CB350 RS** or a **Royal Enfield Hunter 350**, and those
are different manufacturers, so guessing was not acceptable. It is marked `None`
in the mapping table in `tools/prepare-photos.py` and is currently unused.

Tell me which model it is and I will add it.

### Identified with high confidence

Jupiter 110, Jupiter 125, NTorq 125, iQube, Radeon, Apache RTX 300, XL100,
Activa 110, Activa 125, Livo, Classic 350, Continental GT 650 and Indie — most
carry visible model badging in the photograph.

---

## 2. Prices — ALL NEED REPLACING

Every price is an **indicative placeholder range**, not a quotation. They are
plausible for these segments but they are not your prices.

- 18 models × `price.from` and `price.to`
- Every variant's `from` inside `variants[]`

The UI already labels these "Indicative ex-showroom · Confirm with MM Motors",
and no on-road figure is claimed anywhere. Replace all of them with your actual
ex-showroom prices. If you want on-road prices shown instead, that needs a
location field and a different disclosure — tell me and I will wire it.

---

## 3. Specifications by confidence

### MEDIUM — plausible, verify each figure

| Model | Watch particularly |
|---|---|
| `tvs-jupiter` | 113.3 cc is the current generation; older Jupiters are 109.7 cc. Confirm which you sell. Claimed 57 km/l, 33 L storage, 5.1 L tank. |
| `tvs-jupiter-125` | 8.15 PS / 10.5 Nm and the 57 km/l claim. |
| `tvs-ntorq-125` | 9.4 PS, 10.5 Nm, 95 km/h, 22 L storage, 47 km/l. |
| `tvs-iqube` | **Most important on the site.** The page shows the 3.4 kWh pack: 100 km IDC, 4.4 kW peak, 78 km/h, 4h30m to 80%. Confirm the pack sizes you stock and each one's IDC range. |
| `tvs-radeon` | The 69.3 km/l claim especially — high-mileage claims attract scrutiny. |
| `honda-activa` | 109.51 cc, 7.79 PS, 8.90 Nm are solid. **The 47 km/l figure is the risk** — Honda has quoted both ~47 and ~60 km/l for Activa generations under different test methods. Use the figure in your current brochure and make sure the qualifier matches it. |
| `honda-activa-125` | 8.29 PS, 10.4 Nm, and the mileage claim. |

### The newly added manufacturers — all need checking

| Model | Notes |
|---|---|
| `river-indie` | 4.0 kWh / 161 km claimed / 3.5 hrs / 6.4 kW come **from the Brand Bible itself**, which cited them as its example EV figures. Confirm against River's current brochure. The 43 L boot and 90 km/h top speed are my figures. |
| `bajaj-chetak` | 3.2 kWh, 127 km IDC, 4.2 kW, 63 km/h, 35 L. Marked LOW — the Chetak range has changed variants repeatedly. |
| `bajaj-pulsar-ns200` | 199.5 cc, 24.5 PS, 18.74 Nm, 12 L, 158 kg. Also blocked on the identification question above. |
| `re-classic-350` | 349 cc J-series, 20.2 PS, 27 Nm, 13 L, 195 kg. Reasonably solid, but check the variant ladder and the prices. |
| `re-continental-gt-650` | 648 cc twin, 47 PS, 52 Nm, 12.5 L, 214 kg. Check current variant names. |
| `honda-cb350` | 348.36 cc, 21 PS, 30 Nm, 15 L, 181 kg. Check the trim naming. |

### LOW — treat as unverified

| Model | Notes |
|---|---|
| `tvs-apache-rtx-300` | Recent model. 35.6 PS / 28.5 Nm / 14 L are best estimates. The feature and electronics lists need checking item by item. |
| `tvs-xl100` | Deliberately sparse because I was not confident. Fill in properly from the brochure. |
| `honda-sp-125` | Blocked on the identification question above. |
| `honda-shine` | Blocked on the identification question above. |
| `honda-livo` | 8.79 PS, 9.30 Nm, 9.1 L tank, 65 km/l all need checking. |

Each vehicle carries a `_verify` field (`medium` / `low`) recording this. It is
never rendered — it exists so this audit can be regenerated:

```bash
python tools/audit-data.py
```

---

## 4. Ownership text — written generically on purpose

`ownership.warranty`, `.service`, `.finance` and `.exchange` say "confirm current
term with MM Motors" rather than stating a period, because inventing a warranty
term is the single worst thing this site could do.

Replace them with your real terms. The one that matters most is the **iQube
battery warranty** — years *and* the kilometre cap. EV buyers ask, and a vague
answer costs you the sale.

---

## 5. Dealership details — placeholders

In `DEALER` at the top of `vehicles.js`:

```js
phone:    '+91 00000 00000'      // placeholder
whatsapp: '910000000000'         // placeholder — the test ride form posts here
email:    'hello@mmmotors.example'
address:  'Service Road, Bengaluru — update with the real showroom address'
hours:    'Mon–Sat 09:30–19:30 · Sun 10:00–17:00'
```

The test-ride form composes a WhatsApp message to `whatsapp`. **Until that number
is real, no booking reaches you.** Fix it before the site is public.

---

## 6. Photography — in place, but resolution varies a lot

All 18 models have a photograph. Resolution is the real limitation, and it is
now uneven across the floor:

| Source width | Models | At hero size |
|---|---|---|
| 1056 px | River Indie | good |
| 360 px | 5 Honda scooters and commuters | soft |
| 372 px | the 7 TVS models | soft |
| **227 px** | Chetak, Pulsar NS200, Classic 350, Continental GT 650, CB350 | **noticeably soft** |

The product hero shows a vehicle at up to roughly 700 px CSS, so that last group
is being scaled about 3×. Nothing was upscaled — upscaling adds blur and bytes
and no detail — but the browser still has to enlarge them to fill the stage.

**Those five 227 px models are the ones worth re-sourcing first.**

If you can get the same shots at ~1200 px wide or more, drop them in a folder and
re-run:

```
python tools/prepare-photos.py "C:/path/to/higher-res/photos"
```

Everything else — keying, framing, the shared wheel baseline — happens
automatically. Also confirm with TVS and Honda dealer marketing that you are
within the terms these press images are supplied under.

## 7. Colours

Colour names are real for these models; the hex values are my approximations for
the swatches, not manufacturer paint codes. They drive only the illustration and
the swatch chips, so they are cosmetic — but correct them if a customer might
choose a colour from the screen.

---

## 8. What is already safe

To be clear about what does *not* need checking:

- Claimed / IDC / real-world qualifiers render as visible tags next to every
  figure, so no claimed number can be mistaken for a measured one.
- Comparison rows only mark a "best" value when every column shares the same
  unit. Comparing the iQube against the Activa marks only price and kerb
  weight — mileage vs range, battery, charging and fuel capacity are all
  correctly left unmarked.
- Sorting by "mileage / range" groups by fuel type first, so 161 km never
  outranks 69 km/l.
- No on-road price is stated anywhere on the site.
- The EMI estimator states that it is indicative, not an offer of credit, and
  that it is calculated on the ex-showroom price.
- Every specification block carries the disclosure note.
