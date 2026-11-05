"""Package the generated HTML and Windows/Python launchers without dependencies."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from shutil import copyfile

root = Path(__file__).resolve().parent
game = root / 'offline' / 'Thien-Menh.html'
if not game.is_file():
    raise SystemExit('Run npm run build:offline first.')
archive = root / 'Thien-Menh-Windows-Python.zip'
with ZipFile(archive, 'w', ZIP_DEFLATED) as bundle:
    bundle.write(game, 'Thien-Menh.html')
    for name in ['chay_game.py', 'CHOI-NGAY.bat', 'CHAY-BANG-PYTHON.bat', 'HUONG-DAN.txt']:
        content = (root / 'windows' / name).read_text(encoding='utf-8')
        if name.endswith(('.bat', '.txt')):
            content = content.replace('\r\n', '\n').replace('\n', '\r\n')
        # BOM helps Windows Notepad display Vietnamese correctly.
        bundle.writestr(name, content.encode('utf-8-sig' if name.endswith('.txt') else 'utf-8'))
with ZipFile(archive) as bundle:
    if bundle.testzip() is not None:
        raise SystemExit('Archive integrity check failed.')
print('{} ({:.1f} MB)'.format(archive.name, archive.stat().st_size / 1024 / 1024))
versioned = root / 'Thien-Menh-Kingdom-v7-Windows.zip'
copyfile(archive, versioned)
print('Also saved: ' + versioned.name)
