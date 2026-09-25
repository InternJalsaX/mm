"""Report the confidence state of the vehicle dataset.

Reads the `_verify` markers and required fields out of vehicles.js and prints
what still needs checking against the manufacturer brochures. Run it after
editing the data to confirm nothing was left half-done.

    python tools/audit-data.py
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "assets" / "js" / "data" / "vehicles.js"
IMG = ROOT / "assets" / "img" / "vehicles"

PLACEHOLDER_MARKERS = [
    ("phone", "00000 00000"),
    ("whatsapp", "910000000000"),
    ("email", "mmmotors.example"),
    ("address", "update with the real showroom address"),
]


def main() -> int:
    src = DATA.read_text(encoding="utf-8")

    # Scope to the VEHICLES array — BRANDS entries also carry an `id` field,
    # and a whole-file regex would fold the manufacturers in as if they were
    # models and shift every id/_verify pairing by one.
    start = src.index("export const VEHICLES")
    end = src.index("/* ----", start)
    body = src[start:end]

    # Parse per object block so id and _verify can never be paired across
    # neighbouring vehicles.
    blocks = re.split(r"\n  \{\n", body)[1:]
    ids: list[str] = []
    verify: dict[str, str] = {}
    for block in blocks:
        m = re.search(r"id: '([a-z0-9-]+)'", block)
        if not m:
            continue
        vid = m.group(1)
        ids.append(vid)
        vm = re.search(r"_verify: '(\w+)'", block)
        if vm:
            verify[vid] = vm.group(1)

    print(f"MM Motors — data audit\n{'=' * 52}\n")
    print(f"models in dataset: {len(ids)}\n")

    buckets: dict[str, list[str]] = {"low": [], "medium": [], "high": [], "unmarked": []}
    for vid in ids:
        buckets.setdefault(verify.get(vid, "unmarked"), []).append(vid)

    for level, label in [
        ("low", "UNVERIFIED - do not publish these figures as-is"),
        ("medium", "PLAUSIBLE - check each figure against the brochure"),
        ("high", "verified"),
        ("unmarked", "no _verify marker"),
    ]:
        rows = buckets.get(level) or []
        if not rows:
            continue
        print(f"[{level.upper():9s}] {label}")
        for vid in rows:
            photo = "photo ok " if (IMG / f"{vid}.png").exists() else "NO PHOTO "
            print(f"            {photo} {vid}")
        print()

    # Photography coverage
    missing = [v for v in ids if not (IMG / f"{v}.png").exists()]
    print(f"photography: {len(ids) - len(missing)}/{len(ids)} present")
    if missing:
        print("  missing (these render as the vector pictogram):")
        for v in missing:
            print(f"    - assets/img/vehicles/{v}.png")
    print()

    # Dealer placeholders
    stale = [name for name, marker in PLACEHOLDER_MARKERS if marker in src]
    if stale:
        print("DEALER placeholders still in place:")
        for name in stale:
            print(f"  - {name}")
        if "whatsapp" in stale:
            print("\n  NOTE: the test-ride form sends bookings to `whatsapp`.")
            print("  Until that number is real, no booking request reaches you.")
    else:
        print("dealer details: all set")

    print("\nSee VERIFY.md for the full pre-launch checklist.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
