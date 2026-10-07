"""Regenerates public/img from the source assets. Strips ALL metadata (EXIF, GPS, XMP).
Usage: python3 -I scripts/prepare-images.py <source_dir> <out_dir>
Source files are never modified."""
import sys
from PIL import Image
src, out = sys.argv[1] + '/', sys.argv[2] + '/'
c = Image.open(src + '7quinn.png').convert('RGBA'); c.info.clear()
c.save(out + 'aria-character.png', optimize=True)
c.save(out + 'aria-character.webp', quality=92, method=6, exact=True)
for f, name in [('AirBrush_20261007045443.jpg', 'aria-photo-01'), ('AirBrush_20261007045816.jpg', 'aria-photo-02')]:
    im = Image.open(src + f).convert('RGB'); w, h = im.size
    im.save(out + name + '.webp', quality=88, method=6)
    im.resize((860, round(h * 860 / w)), Image.LANCZOS).save(out + name + '-860.webp', quality=86, method=6)
