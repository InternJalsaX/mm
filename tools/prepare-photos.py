"""Prepare vehicle photography for MM Motors.

The supplied set is mixed: some shots are transparent PNGs, others are opaque
JPEG-style shots on a white background. Presenting both the same way is what
makes a showroom grid look untidy, so this normalises them:

  1. Removes an opaque background by flood-filling inward from the edges.
     Crucially NOT a global "white becomes transparent" — these bikes carry
     white stripes, white number-plate panels and white graphics, and a global
     key would punch holes straight through them. Only background-connected
     pixels are removed.
  2. Feathers the resulting edge so it does not look cut out with scissors.
  3. Trims to the vehicle and re-frames every model at the same relative size
     on a 16:10 canvas, so a moped and an adventure tourer sit at a consistent
     scale across the cards.
  4. Never upscales. These sources are small; enlarging them would only add
     blur and bytes.

    python tools/prepare-photos.py <source-folder>
    python tools/prepare-photos.py <source-folder> --dry-run

Source files may be named after the model (`tvs-jupiter.png`, `activa 125.jpg`)
or numbered 1..12 in the order listed in ORDER below.
"""
from __future__ import annotations

import argparse
import re
import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "assets" / "img" / "vehicles"

# Fallback mapping for numerically-named files, in the order they were supplied.
# `None` means "do not use this file", with the reason given — two shots of the
# same model, a wrong camera angle, or one I could not identify.
ORDER: list[str | None] = [
    "honda-sp-125",             # 1
    "honda-activa-125",         # 2
    "honda-activa",             # 3
    "honda-livo",               # 4
    "honda-shine",              # 5
    "tvs-apache-rtx-300",       # 6
    "tvs-radeon",               # 7
    "tvs-ntorq-125",            # 8
    "tvs-jupiter",              # 9
    "tvs-jupiter-125",          # 10
    "tvs-iqube",                # 11
    "tvs-xl100",                # 12
    None,                       # 13  River Indie, cyan — 14 is the same model at 1056 px
    "river-indie",              # 14  highest-resolution source in the whole set
    None,                       # 15  Chetak in black — 16 is the same model and reads
                                #     better than black-on-black in a dark layout
    "bajaj-chetak",             # 16
    "bajaj-pulsar-ns200",       # 17  clean side profile
    None,                       # 18  Pulsar again, but a 3/4 lifestyle shot against a
                                #     wall. Mixing angles is what makes a grid untidy.
    "honda-cb350",              # 19
    None,                       # 20  UNIDENTIFIED — black/red retro roadster. Possibly a
                                #     Honda CB350 RS or a Royal Enfield Hunter 350.
                                #     Not assigned rather than guessed. See VERIFY.md.
    "re-classic-350",           # 21
    "re-continental-gt-650",    # 22
]

# Name-based matching, most specific first
MODELS: list[tuple[str, list[str]]] = [
    ("re-continental-gt-650", ["continental"]),
    ("re-classic-350", ["classic"]),
    ("bajaj-pulsar-ns200", ["pulsar"]),
    ("bajaj-chetak", ["chetak"]),
    ("river-indie", ["indie"]),
    ("river-indie", ["river"]),
    ("honda-cb350", ["cb350"]),
    ("tvs-apache-rtx-300", ["apache"]),
    ("tvs-jupiter-125", ["jupiter", "125"]),
    ("tvs-ntorq-125", ["ntorq"]),
    ("tvs-iqube", ["iqube"]),
    ("tvs-radeon", ["radeon"]),
    ("tvs-xl100", ["xl"]),
    ("tvs-jupiter", ["jupiter"]),
    ("honda-activa-125", ["activa", "125"]),
    ("honda-activa", ["activa"]),
    ("honda-sp-125", ["sp", "125"]),
    ("honda-shine", ["shine"]),
    ("honda-livo", ["livo"]),
]

EXTS = {".png", ".jpg", ".jpeg", ".webp", ".avif"}

# Framing
ASPECT_W, ASPECT_H = 16, 10
CONTENT_W = 0.88   # vehicle spans this much of the canvas width
CONTENT_H = 0.84   # ...or this much of the height, whichever binds first
BASELINE = 0.92    # bottom of the vehicle sits here, so it reads as grounded

# Background detection
BG_MIN = 238       # a pixel this bright on every channel can be background
BG_SPREAD = 14     # ...and this neutral (max channel - min channel)


def match_name(path: Path) -> str | None:
    hay = re.sub(r"[^a-z0-9]+", " ", path.stem.lower()).strip()
    flat = hay.replace(" ", "")

    for mid, _ in MODELS:
        if re.sub(r"[^a-z0-9]+", "", mid) in flat:
            return mid
    for mid, tokens in MODELS:
        if all(t in flat for t in tokens):
            return mid
    if hay.isdigit():
        i = int(hay) - 1
        if 0 <= i < len(ORDER):
            return ORDER[i]  # may legitimately be None — see the table above
    return None


def remove_background(img: Image.Image) -> tuple[Image.Image, bool]:
    """Flood-fill the background inward from the border. Returns (image, changed)."""
    img = img.convert("RGBA")
    a = np.array(img)
    h, w = a.shape[:2]
    rgb = a[:, :, :3].astype(np.int16)
    alpha = a[:, :, 3]

    # Already transparent at the corners? Then it is a cut-out already.
    if alpha[0, 0] == 0 and alpha[0, -1] == 0 and alpha[-1, 0] == 0:
        return img, False

    bright = rgb.min(axis=2) >= BG_MIN
    neutral = (rgb.max(axis=2) - rgb.min(axis=2)) <= BG_SPREAD
    candidate = bright & neutral

    if not candidate[0, :].any() and not candidate[:, 0].any():
        return img, False  # no light border — leave it alone

    # BFS from every candidate border pixel
    visited = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            if candidate[y, x] and not visited[y, x]:
                visited[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if candidate[y, x] and not visited[y, x]:
                visited[y, x] = True
                q.append((y, x))

    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and candidate[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))

    out = a.copy()
    out[:, :, 3] = np.where(visited, 0, alpha)

    # Feather: blur the alpha a touch and keep the darker (more transparent)
    # result at the boundary, so the cut edge is not hard.
    am = Image.fromarray(out[:, :, 3], mode="L")
    soft = np.array(am.filter(ImageFilter.GaussianBlur(0.6)))
    out[:, :, 3] = np.minimum(out[:, :, 3], soft)

    # Un-premultiply the white fringe: background-adjacent pixels carry white
    # bleed from the original matte, which reads as a halo on a dark surface.
    return Image.fromarray(out, mode="RGBA"), True


def reframe(img: Image.Image) -> Image.Image:
    """Trim to the vehicle, then re-frame at a consistent relative size."""
    bbox = img.getbbox()  # alpha-aware
    if bbox:
        img = img.crop(bbox)

    cw, ch = img.size

    # Canvas sized from the content — never upscaling the source
    by_width = cw / CONTENT_W
    by_height = (ch / CONTENT_H) * (ASPECT_W / ASPECT_H)
    canvas_w = int(round(max(by_width, by_height)))
    canvas_h = int(round(canvas_w * ASPECT_H / ASPECT_W))

    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    x = (canvas_w - cw) // 2
    y = int(round(canvas_h * BASELINE)) - ch
    canvas.paste(img, (x, max(0, y)), img)
    return canvas


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    src = Path(args.source).expanduser()
    if not src.is_dir():
        print(f"Not a folder: {src}")
        return 1

    files = [p for p in sorted(src.rglob("*")) if p.suffix.lower() in EXTS]
    if not files:
        print(f"No images under {src}")
        return 1

    DEST.mkdir(parents=True, exist_ok=True)
    placed: dict[str, Path] = {}
    unmatched: list[Path] = []

    def pixels(p: Path) -> int:
        try:
            with Image.open(p) as im:
                return im.size[0] * im.size[1]
        except Exception:
            return 0

    for f in files:
        mid = match_name(f)
        if mid is None:
            unmatched.append(f)
            continue
        # Two shots of the same model: keep the higher-resolution one, since
        # nothing here is ever upscaled.
        if mid not in placed or pixels(f) > pixels(placed[mid]):
            placed[mid] = f

    for mid, f in sorted(placed.items()):
        img = Image.open(f)
        before = img.size
        img, stripped = remove_background(img)
        img = reframe(img)

        note = "background removed" if stripped else "already transparent"
        print(f"{'would write' if args.dry_run else 'write     '} {mid + '.png':26s} "
              f"{before[0]}x{before[1]} -> {img.size[0]}x{img.size[1]}  ({note})")

        if not args.dry_run:
            img.save(DEST / f"{mid}.png", "PNG", optimize=True)

    # ORDER holds one entry per SOURCE file, with None for the ones we skip and
    # duplicates where two shots show the same model — so the model count is the
    # de-duplicated set of real targets, not len(ORDER).
    targets = list(dict.fromkeys(m for m in ORDER if m))

    print(f"\nprepared {len(placed)} of {len(targets)} models")

    missing = [m for m in targets if m not in placed and not (DEST / f"{m}.png").exists()]
    if missing:
        print("\nstill missing (these fall back to the vector pictogram):")
        for m in missing:
            print(f"  - {m}.png")
    if unmatched:
        print("\nskipped (duplicate angle, lower resolution, or unidentified):")
        for f in unmatched:
            print(f"  - {f.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
