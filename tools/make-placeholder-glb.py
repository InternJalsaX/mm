"""Write a clearly-marked placeholder GLB.

The 3D viewer loads real scooter models from paths held in data
(assets/js/data/vehicles.js -> MODELS_3D). Until those exist, this script
emits a valid glTF-binary so the GLTFLoader path can be exercised end to end
rather than being written blind: loading, Draco setup, fade-in, framing,
disposal and the loading state are all real code paths that need a real file.

The shape is deliberately a plain block at roughly scooter proportions and is
named PLACEHOLDER_not_a_real_scooter so it can never be mistaken for a
delivered asset. Run:  python tools/make-placeholder-glb.py
"""
from __future__ import annotations

import json
import struct
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "assets/models/placeholder-scooter.glb"

# Rough scooter bounding box in metres: 1.85 long, 1.15 tall, 0.72 wide.
LX, LY, LZ = 1.85, 1.15, 0.72
hx, hz = LX / 2, LZ / 2

# 8 corners, y from 0 (ground) up, so it sits on the floor like the real scene.
V = [
    (-hx, 0.0, -hz), (hx, 0.0, -hz), (hx, LY, -hz), (-hx, LY, -hz),
    (-hx, 0.0,  hz), (hx, 0.0,  hz), (hx, LY,  hz), (-hx, LY,  hz),
]
F = [
    (0, 1, 2), (0, 2, 3),  (4, 6, 5), (4, 7, 6),
    (0, 4, 5), (0, 5, 1),  (3, 2, 6), (3, 6, 7),
    (0, 3, 7), (0, 7, 4),  (1, 5, 6), (1, 6, 2),
]

idx = b"".join(struct.pack("<H", i) for f in F for i in f)
if len(idx) % 4:                      # accessors must start 4-byte aligned
    idx += b"\x00" * (4 - len(idx) % 4)
pos = b"".join(struct.pack("<fff", *v) for v in V)
blob = idx + pos

gltf = {
    "asset": {"version": "2.0", "generator": "MM Motors placeholder (tools/make-placeholder-glb.py)"},
    "scene": 0,
    "scenes": [{"nodes": [0], "name": "PLACEHOLDER_showroom"}],
    "nodes": [{"mesh": 0, "name": "PLACEHOLDER_not_a_real_scooter"}],
    "meshes": [{
        "name": "PLACEHOLDER_block",
        "primitives": [{"attributes": {"POSITION": 1}, "indices": 0, "material": 0}],
    }],
    "materials": [{
        "name": "PLACEHOLDER_matte",
        "pbrMetallicRoughness": {
            "baseColorFactor": [0.80, 0.78, 0.74, 1.0],
            "metallicFactor": 0.0,
            "roughnessFactor": 0.75,
        },
    }],
    "buffers": [{"byteLength": len(blob)}],
    "bufferViews": [
        {"buffer": 0, "byteOffset": 0, "byteLength": len(idx), "target": 34963},
        {"buffer": 0, "byteOffset": len(idx), "byteLength": len(pos), "target": 34962},
    ],
    "accessors": [
        {"bufferView": 0, "componentType": 5123, "count": len(F) * 3, "type": "SCALAR"},
        {"bufferView": 1, "componentType": 5126, "count": len(V), "type": "VEC3",
         "min": [-hx, 0.0, -hz], "max": [hx, LY, hz]},
    ],
}

js = json.dumps(gltf, separators=(",", ":")).encode("utf-8")
js += b" " * (-len(js) % 4)            # JSON chunk pads with spaces
bn = blob + b"\x00" * (-len(blob) % 4)  # BIN chunk pads with zeros

glb = struct.pack("<III", 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(bn))
glb += struct.pack("<II", len(js), 0x4E4F534A) + js
glb += struct.pack("<II", len(bn), 0x004E4942) + bn

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_bytes(glb)
print(f"wrote {OUT.relative_to(OUT.parent.parent.parent)} ({len(glb)} bytes)")
