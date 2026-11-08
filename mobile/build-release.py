"""Build and validate an unsigned Play-ready AAB structure using official local tools.
Signing/upload and Play Console pricing remain the publisher's responsibility.
"""
from pathlib import Path
import argparse, subprocess, shutil, zipfile, tempfile
ROOT=Path(__file__).resolve().parent.parent
p=argparse.ArgumentParser()
p.add_argument('--sdk',required=True,help='Extracted SDK containing android-15 build tools and android-35/android.jar or newer')
p.add_argument('--bundletool',required=True,help='Official bundletool-all JAR')
args=p.parse_args();sdk=Path(args.sdk).resolve();tools=sdk/'android-15';platform=next((f for f in [sdk/'android-36/android.jar',sdk/'android-35/android.jar']if f.is_file()),None)
if platform is None:raise SystemExit('Android platform JAR not found.')
jar=Path(args.bundletool).resolve()
if not jar.is_file():raise SystemExit('Supply the official bundletool-all JAR.')
bundle=ROOT/'mobile/bundle'
if not (bundle/'index.html').is_file():raise SystemExit('Run npm run build:offline first.')
out=ROOT/'mobile/release-output';out.mkdir(exist_ok=True)
def run(*cmd):subprocess.run([str(c)for c in cmd],check=True,cwd=ROOT)
with tempfile.TemporaryDirectory(prefix='mandate-release-')as folder:
 work=Path(folder);classes=work/'classes';classes.mkdir();assets=work/'assets';shutil.copytree(bundle,assets)
 html=(assets/'index.html').read_text();assert 'heavenly-mandate-dev-v1'not in html and 'function sandboxMax'not in html
 if 'name="game-distribution" content="preview"'not in html:raise SystemExit('Missing distribution marker.')
 (assets/'index.html').write_text(html.replace('name="game-distribution" content="preview"','name="game-distribution" content="store"'))
 sources=list((ROOT/'mobile/android/src').rglob('*.java'))
 run('java','-m','jdk.compiler/com.sun.tools.javac.Main','-source','8','-target','8','-classpath',platform,'-d',classes,*sources)
 classjar=work/'classes.jar'
 with zipfile.ZipFile(classjar,'w')as z:
  for f in classes.rglob('*.class'):z.write(f,f.relative_to(classes).as_posix())
 run(tools/'d8','--min-api','26','--lib',platform,'--output',work,classjar)
 run(tools/'aapt2','compile','--dir',ROOT/'mobile/android/res','-o',work/'compiled-res.zip')
 run(tools/'aapt2','link','--proto-format','-I',platform,'--manifest',ROOT/'mobile/android/AndroidManifest.xml','-A',assets,'-o',work/'resources.apk',work/'compiled-res.zip')
 with zipfile.ZipFile(work/'resources.apk')as resources,zipfile.ZipFile(work/'base.zip','w',zipfile.ZIP_DEFLATED)as z:
  for name in resources.namelist():z.writestr('manifest/AndroidManifest.xml'if name=='AndroidManifest.xml'else name,resources.read(name))
  z.write(work/'classes.dex','dex/classes.dex')
 target=out/'Heavenly-Mandate-unsigned.aab'
 if target.exists():target.unlink()
 run('java','-jar',jar,'build-bundle','--modules='+str(work/'base.zip'),'--output='+str(target))
 run('java','-jar',jar,'validate','--bundle='+str(target))
 print('Validated unsigned bundle:',target)
 print('Not signed or uploaded. Configure app pricing, signing, declarations and device testing before submission.')
