import { readFile, mkdir, writeFile } from 'node:fs/promises';

const root = new URL('./', import.meta.url);
const moduleFiles=['characters','game','progression','realms','skins','chronicle','world-data','inheritance-data','runes','mail','account','troops','inventory-ui','account-ui','character-ui','inheritance-ui','strategy-ui','inheritance-combat','tactics','kingdom','inheritance-sim','world-sim','world-ui','region-map','campaign','campaign-ui','realm-map','inheritance-map','map','app'];
const assetNames=['heroes-pixel.png','hulao-pixel.png','city-pixel.png','battle-units-pixel.png','roster-a-pixel.png','roster-b-pixel.png','celestial-pets-pixel.png','pets-awakened-pixel.png','skills-pixel.png','castle-skins-pixel.png'];
const [template,styles,sources,assetBytes]=await Promise.all([
 readFile(new URL('index.html',root),'utf8'),
 Promise.all(['style','pixel','immersive','rpg','account'].map(f=>readFile(new URL(f+'.css',root),'utf8'))),
 Promise.all(moduleFiles.map(f=>readFile(new URL(f+'.mjs',root),'utf8'))),
 Promise.all(assetNames.map(f=>readFile(new URL('assets/'+f,root)))),
]);
const combine=source=>source.replace(/^import \{[^\n]+\} from '[^']+';\r?\n/gm,'').replace(/^export /gm,'');
let script=sources.map(combine).join('\n');
if(/^import /m.test(script))throw new Error('Unbundled import. Update offline builder.');
// Store each PNG once; browser-local Blob URLs work with file:// and without networking.
for(const name of assetNames)for(const quote of ["'",'"'])script=script.replaceAll(quote+'/assets/'+name+quote,"offlineAssetUrls["+JSON.stringify(name)+"]");
const images=Object.fromEntries(assetNames.map((name,i)=>[name,assetBytes[i].toString('base64')]));
const prelude=`const offlineImageData=${JSON.stringify(images)};\nconst offlineAssetUrls={};\nfor(const [name,data] of Object.entries(offlineImageData)){const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0));offlineAssetUrls[name]=URL.createObjectURL(new Blob([bytes],{type:'image/png'}));}\nlet offlineCss=${JSON.stringify(styles.join('\n'))};\nfor(const [name,url]of Object.entries(offlineAssetUrls))offlineCss=offlineCss.replaceAll('/assets/'+name,url);\ndocument.getElementById('offline-style').textContent=offlineCss;\n`;
script=(prelude+script).replace(/<\/script/gi,'<\\/script');
let html=template.replace(/<link rel="stylesheet" href="\/(?:style|pixel|immersive|rpg|account)\.css">/g,'');
html=html.replace('</head>','<style id="offline-style"></style></head>').replace('<script type="module" src="/app.mjs"></script>',()=>`<script>\n(() => {\n${script}\n})();\n</script>`);
if(html.includes('src="/app.mjs"')||html.includes('href="/style.css"'))throw new Error('Offline template changed.');
await mkdir(new URL('offline/',root),{recursive:true});
await writeFile(new URL('offline/Thien-Menh.html',root),html);
await writeFile(new URL('offline/HUONG-DAN.txt',root),await readFile(new URL('windows/HUONG-DAN.txt',root),'utf8'));
console.log('Offline build: offline/Thien-Menh.html (all ten PNGs embedded once; no network or Node.js needed)');
