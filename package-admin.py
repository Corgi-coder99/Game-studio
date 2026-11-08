"""Package only the separate current developer application."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parent
source = root / 'admin'
if not (source / 'Heavenly-Mandate-DevTools.html').exists():
    raise SystemExit('Run npm run build:admin first.')
with ZipFile(root / 'Heavenly-Mandate-DevTools.zip', 'w', ZIP_DEFLATED) as archive:
    for name in ['Heavenly-Mandate-DevTools.html', 'serve.py', 'live-bridge.js', 'START-DEVTOOLS.bat', 'README.md']:
        archive.write(source / name, 'Heavenly-Mandate-DevTools/' + name)
print('Packaged separate developer workspace: Heavenly-Mandate-DevTools.zip')
