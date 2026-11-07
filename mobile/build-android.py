"""Build a self-contained Android test APK using only official SDK build tools and a JDK."""
from pathlib import Path
import argparse,subprocess,shutil,os,zipfile
root=Path(__file__).resolve().parent.parent
p=argparse.ArgumentParser();p.add_argument('--sdk',required=True);p.add_argument('--keystore',required=True);args=p.parse_args()
sdk=Path(args.sdk).resolve();build=sdk/'android-15';platform=sdk/'android-35'/'android.jar'
if not platform.exists():raise SystemExit('Expected extracted Android 35 platform and build-tools 35 under --sdk.')
work=root/'mobile'/'android-build';work.mkdir(exist_ok=True);classes=work/'classes';classes.mkdir(exist_ok=True)
for name in ['aapt2','d8','zipalign','apksigner']:(build/name).chmod(0o755)
def run(*cmd):subprocess.run([str(c) for c in cmd],check=True,cwd=root)
sources=list((root/'mobile/android/src').rglob('*.java'))
run('java','-m','jdk.compiler/com.sun.tools.javac.Main','-source','8','-target','8','-classpath',platform,'-d',classes,*sources)
assets=root/'mobile/bundle'
run(build/'aapt2','link','-I',platform,'--manifest',root/'mobile/android/AndroidManifest.xml','-A',assets,'-o',work/'base.apk')
jar=work/'classes.jar'
with zipfile.ZipFile(jar,'w') as z:
 for f in classes.rglob('*.class'):z.write(f,f.relative_to(classes).as_posix())
run(build/'d8','--min-api','26','--lib',platform,'--output',work,jar)
shutil.copy(work/'base.apk',work/'unsigned.apk')
with zipfile.ZipFile(work/'unsigned.apk','a',zipfile.ZIP_DEFLATED) as z:z.write(work/'classes.dex','classes.dex')
run(build/'zipalign','-f','4',work/'unsigned.apk',work/'aligned.apk')
key=Path(args.keystore).resolve()
if not key.exists():run('keytool','-genkeypair','-keystore',key,'-storepass','android','-keypass','android','-alias','thien-menh-test','-dname','CN=Thien Menh Local Test','-keyalg','RSA','-keysize','2048','-validity','3650')
out=root/'Thien-Menh-v12-Android.apk'
run(build/'apksigner','sign','--ks',key,'--ks-pass','pass:android','--key-pass','pass:android','--ks-key-alias','thien-menh-test','--out',out,work/'aligned.apk')
run(build/'apksigner','verify','--verbose',out)
print(out.name,round(out.stat().st_size/1024/1024,1),'MiB; self-signed test APK; physical Bluetooth tests still required.')
