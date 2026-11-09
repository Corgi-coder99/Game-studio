"""Build a self-contained Android test APK using only official SDK build tools and a JDK."""
from pathlib import Path
import argparse,subprocess,shutil,os,zipfile
from tempfile import TemporaryDirectory
root=Path(__file__).resolve().parent.parent
p=argparse.ArgumentParser();p.add_argument('--sdk',required=True);p.add_argument('--keystore',required=True);args=p.parse_args()
sdk=Path(args.sdk).resolve()
build=sdk/'build-tools'/'35.0.0'
platform=sdk/'platforms'/'android-35'/'android.jar'
if not build.is_dir():build=sdk/'android-15'
if not platform.is_file():platform=sdk/'android-35'/'android.jar'
suffix='.exe' if os.name=='nt' else ''
required=[platform,build/('aapt2'+suffix),build/('zipalign'+suffix),build/'lib'/'d8.jar',build/'lib'/'apksigner.jar']
if not all(path.is_file() for path in required):
 raise SystemExit('Expected Android 35 platform and build-tools 35.0.0 under --sdk.')
if os.name!='nt':
 for tool in (build/'aapt2',build/'zipalign'):
  tool.chmod(tool.stat().st_mode|0o100)
work_root=root/'mobile'/'android-build'
work_root.mkdir(exist_ok=True)
scratch=TemporaryDirectory(dir=work_root)
work=Path(scratch.name)
classes=work/'classes'
classes.mkdir()
def run(*cmd):subprocess.run([str(c) for c in cmd],check=True,cwd=root)
sources=list((root/'mobile/android/src').rglob('*.java'))
run('javac','-encoding','UTF-8','-source','8','-target','8','-classpath',platform,'-d',classes,*sources)
assets=root/'mobile/bundle'
run(build/('aapt2'+suffix),'compile','--dir',root/'mobile/android/res','-o',work/'compiled-res.zip')
run(build/('aapt2'+suffix),'link','-I',platform,'--manifest',root/'mobile/android/AndroidManifest.xml','-A',assets,'-o',work/'base.apk',work/'compiled-res.zip')
jar=work/'classes.jar'
with zipfile.ZipFile(jar,'w') as z:
 for f in classes.rglob('*.class'):z.write(f,f.relative_to(classes).as_posix())
run('java','-cp',build/'lib'/'d8.jar','com.android.tools.r8.D8','--min-api','26','--lib',platform,'--output',work,jar)
shutil.copy(work/'base.apk',work/'unsigned.apk')
with zipfile.ZipFile(work/'unsigned.apk','a',zipfile.ZIP_DEFLATED) as z:z.write(work/'classes.dex','classes.dex')
run(build/('zipalign'+suffix),'-f','4',work/'unsigned.apk',work/'aligned.apk')
key=Path(args.keystore).resolve()
if not key.exists():run('keytool','-genkeypair','-keystore',key,'-storepass','android','-keypass','android','-alias','thien-menh-test','-dname','CN=Thien Menh Local Test','-keyalg','RSA','-keysize','2048','-validity','3650')
out=root/'mobile/release-output/Heavenly-Mandate-test.apk';out.parent.mkdir(exist_ok=True)
signer=('java','-jar',build/'lib'/'apksigner.jar')
run(*signer,'sign','--ks',key,'--ks-pass','pass:android','--key-pass','pass:android','--ks-key-alias','thien-menh-test','--out',out,work/'aligned.apk')
run(*signer,'verify','--verbose',out)
scratch.cleanup()
print(out.name,round(out.stat().st_size/1024/1024,1),'MiB; self-signed test APK; physical Bluetooth tests still required.')
