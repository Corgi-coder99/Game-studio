from pathlib import Path
import argparse,struct,json
from shutil import copyfile,copytree
from zipfile import ZipFile,ZIP_DEFLATED
parser=argparse.ArgumentParser();parser.add_argument('--store',action='store_true');parser.add_argument('--app-icon',help='Approved opaque 1024×1024 PNG for App Store release');args=parser.parse_args()
root=Path(__file__).resolve().parent.parent
bundle=root/'mobile/bundle';ios=root/'mobile/ios';dest=ios/'ThienMenh'
if not (bundle/'index.html').exists():raise SystemExit('Run npm run build:offline first.')
html=(bundle/'index.html').read_text()
if args.store:
 if not args.app_icon:raise SystemExit('--store requires --app-icon: an approved opaque 1024×1024 PNG.')
 icon=Path(args.app_icon).read_bytes()
 if icon[:8]!=b'\x89PNG\r\n\x1a\n' or struct.unpack('>II',icon[16:24])!=(1024,1024) or icon[25]!=2:raise SystemExit('Use an opaque 1024×1024 RGB PNG app icon.')
 catalog=dest/'Assets.xcassets/AppIcon.appiconset';catalog.mkdir(parents=True,exist_ok=True);copyfile(args.app_icon,catalog/'AppIcon.png')
 (catalog/'Contents.json').write_text(json.dumps({'images':[{'filename':'AppIcon.png','idiom':'universal','platform':'ios','size':'1024x1024'}],'info':{'author':'xcode','version':1}}))
 html=html.replace('name="game-distribution" content="preview"','name="game-distribution" content="store"')
(dest/'Thien-Menh.html').write_text(html);copytree(bundle/'assets',dest/'assets',dirs_exist_ok=True)
out=root/'mobile/release-output/Heavenly-Mandate-iOS-Source.zip';out.parent.mkdir(exist_ok=True)
with ZipFile(out,'w',ZIP_DEFLATED) as z:
 for f in ios.rglob('*'):
  if f.is_file():
   if args.store and f.name=='project.pbxproj':z.writestr(f.relative_to(ios).as_posix(),f.read_text().replace('INFOPLIST_FILE=ThienMenh/Info.plist;','INFOPLIST_FILE=ThienMenh/Info.plist;ASSETCATALOG_COMPILER_APPICON_NAME=AppIcon;'))
   else:z.write(f,f.relative_to(ios).as_posix())
 z.write(root/'mobile/README.md','HUONG-DAN.md')
print(out.name,round(out.stat().st_size/1024/1024,1),'MiB. Open Xcode project on macOS, select Signing Team and physical iPhone/iPad.')
