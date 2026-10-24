"""Download FLUX card art listed in art/sources.json and save compressed WebP files."""
import io, json, pathlib, urllib.request
from PIL import Image

src = pathlib.Path("art/sources.json")
out = pathlib.Path("art")
for name, url in json.loads(src.read_text()).items():
    with urllib.request.urlopen(url, timeout=60) as r:
        img = Image.open(io.BytesIO(r.read())).convert("RGB")
    img.thumbnail((960, 960), Image.LANCZOS)
    dest = out / f"{name}.webp"
    img.save(dest, "WEBP", quality=80, method=6)
    print(f"{dest}: {img.size[0]}x{img.size[1]}, {dest.stat().st_size // 1024} KB")
