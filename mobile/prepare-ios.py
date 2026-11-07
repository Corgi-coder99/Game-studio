from pathlib import Path
from shutil import copyfile,copytree
from zipfile import ZipFile,ZIP_DEFLATED
root=Path(__file__).resolve().parent.parent
bundle=root/'mobile/bundle';ios=root/'mobile/ios';dest=ios/'ThienMenh'
if not (bundle/'index.html').exists():raise SystemExit('Run npm run build:offline first.')
copyfile(bundle/'index.html',dest/'Thien-Menh.html');copytree(bundle/'assets',dest/'assets',dirs_exist_ok=True)
out=root/'Thien-Menh-v12-iOS-Project.zip'
with ZipFile(out,'w',ZIP_DEFLATED) as z:
 for f in ios.rglob('*'):
  if f.is_file():z.write(f,f.relative_to(ios).as_posix())
 z.write(root/'mobile/README.md','HUONG-DAN.md')
print(out.name,round(out.stat().st_size/1024/1024,1),'MiB. Open Xcode project on macOS, select Signing Team and physical iPhone/iPad.')
