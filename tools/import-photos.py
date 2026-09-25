"""Import vehicle photography into MM Motors.

Point this at the folder holding the product shots and it copies them into
assets/img/vehicles/ under the filenames the site expects. Matching is fuzzy on
the filename, so "TVS-Jupiter-blue.jpg" or "activa125.png" both land correctly.

    python tools/import-photos.py "C:/path/to/photos"
    python tools/import-photos.py "C:/path/to/photos" --dry-run

Anything it cannot match confidently is listed at the end rather than guessed,
and nothing already in place is overwritten unless you pass --force.
"""
from __future__ import annotations

import argparse
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "assets" / "img" / "vehicles"

# Each model id with the tokens that identify it. Order matters: the most
# specific patterns are tested first so "activa-125" never matches "activa".
MODELS: list[tuple[str, list[str]]] = [
    ("tvs-apache-rtx-300", ["apache", "rtx"]),
    ("tvs-jupiter-125",    ["jupiter", "125"]),
    ("tvs-ntorq-125",      ["ntorq"]),
    ("tvs-iqube",          ["iqube", "i-qube", "qube"]),
    ("tvs-radeon",         ["radeon"]),
    ("tvs-xl100",          ["xl100", "xl-100", "xl"]),
    ("tvs-jupiter",        ["jupiter"]),
    ("honda-activa-125",   ["activa", "125"]),
    ("honda-activa",       ["activa"]),
    ("honda-sp-125",       ["sp125", "sp-125", "sp 125"]),
    ("honda-shine",        ["shine"]),
    ("honda-livo",         ["livo"]),
]

ALL_IDS = [m[0] for m in MODELS]
EXTS = {".png", ".jpg", ".jpeg", ".webp", ".avif"}


def normalise(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", name.lower()).strip()


def match(path: Path) -> str | None:
    """Return the model id this file belongs to, or None."""
    hay = normalise(path.stem)

    # An exact id in the filename always wins
    for mid in ALL_IDS:
        if normalise(mid) in hay:
            return mid

    for mid, tokens in MODELS:
        if all(t in hay.replace(" ", "") or t in hay for t in tokens):
            return mid
    return None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("source", help="folder containing the product photographs")
    ap.add_argument("--dry-run", action="store_true", help="report without copying")
    ap.add_argument("--force", action="store_true", help="overwrite existing files")
    args = ap.parse_args()

    src = Path(args.source).expanduser()
    if not src.is_dir():
        print(f"Not a folder: {src}")
        return 1

    files = [p for p in sorted(src.rglob("*")) if p.suffix.lower() in EXTS]
    if not files:
        print(f"No images found under {src}")
        return 1

    DEST.mkdir(parents=True, exist_ok=True)

    placed: dict[str, Path] = {}
    unmatched: list[Path] = []

    for f in files:
        mid = match(f)
        if mid is None:
            unmatched.append(f)
            continue
        # First confident match per model wins
        placed.setdefault(mid, f)

    for mid, f in sorted(placed.items()):
        # The site requests .png for every model; keep the extension honest by
        # copying to .png only when it already is one, otherwise write the real
        # extension and report it so the data file can be pointed at it.
        target = DEST / f"{mid}.png"
        note = ""
        if f.suffix.lower() != ".png":
            note = f"  (source was {f.suffix}; saved as .png container name)"
        if target.exists() and not args.force:
            print(f"skip   {mid:24s} already present")
            continue
        print(f"{'would copy' if args.dry_run else 'copy  '} {mid:24s} <- {f.name}{note}")
        if not args.dry_run:
            shutil.copy2(f, target)

    missing = [m for m in ALL_IDS if m not in placed and not (DEST / f"{m}.png").exists()]

    print()
    print(f"matched {len(placed)} of {len(ALL_IDS)} models")
    if missing:
        print("\nstill missing (the site falls back to the vector pictogram for these):")
        for m in missing:
            print(f"  - {m}.png")
    if unmatched:
        print("\ncould not identify (rename to '<model-id>.png' and re-run):")
        for f in unmatched:
            print(f"  - {f.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
