import {runtimeModules,textureAssets,styleFiles} from './build-manifest.mjs';
import {assetAlphabet,encodeAsset85,decodeAsset85} from './asset-encoding.mjs';
import { readFile, mkdir, writeFile, readdir, unlink } from 'node:fs/promises';

const root = new URL('./', import.meta.url);
const moduleFiles=runtimeModules;
const assetNames=textureAssets;
const [template,styles,sources,assetBytes]=await Promise.all([
 readFile(new URL('index.html',root),'utf8'),
 Promise.all(styleFiles.map(f=>readFile(new URL(f+'.css',root),'utf8'))),
 Promise.all(moduleFiles.map(f=>readFile(new URL(f+'.mjs',root),'utf8'))),
 Promise.all(assetNames.map(f=>readFile(new URL('assets/'+f,root)))),
]);
const combine=source=>source.replace(/^import \{[^\n]+\} from '[^']+';\r?\n/gm,'').replace(/^export /gm,'');
let script=sources.map(combine).join('\n');
if(/^import /m.test(script))throw new Error('Unbundled import. Update offline builder.');
// Store each PNG once; browser-local Blob URLs work with file:// and without networking.
for(const name of assetNames)for(const quote of ["'",'"'])script=script.replaceAll(quote+'/assets/'+name+quote,"offlineAssetUrls["+JSON.stringify(name)+"]");
const images=Object.fromEntries(assetNames.map((name,i)=>[name,encodeAsset85(assetBytes[i])]));
const prelude=`const assetAlphabet=${JSON.stringify(assetAlphabet)};const decodeAsset85=${decodeAsset85.toString()};\nconst offlineImageData=${JSON.stringify(images)};\nconst offlineAssetUrls={};\nfor(const [name,data] of Object.entries(offlineImageData)){const bytes=decodeAsset85(data);offlineAssetUrls[name]=URL.createObjectURL(new Blob([bytes],{type:'image/png'}));}\nlet offlineCss=${JSON.stringify(styles.join('\n'))};\nfor(const [name,url]of Object.entries(offlineAssetUrls))offlineCss=offlineCss.replaceAll('/assets/'+name,url);\ndocument.getElementById('offline-style').textContent=offlineCss;\n`;
script=(prelude+script).replace(/<\/script/gi,'<\\/script');
let html=template.replace(/<link rel="stylesheet" href="\/(?:style|pixel|immersive|rpg|account|viewport|design|style-bible)\.css">/g,'');
html=html.replace('</head>','<style id="offline-style"></style></head>').replace('<script type="module" src="/app.mjs"></script>',()=>`<script>\n(() => {\n${script}\n})();\n</script>`);
if(html.includes('src="/app.mjs"')||html.includes('href="/style.css"'))throw new Error('Offline template changed.');
await mkdir(new URL('offline/',root),{recursive:true});
if(Buffer.byteLength(html)>99*1024*1024)throw new Error('Standalone HTML exceeds the 99 MiB release budget. Optimize atlases before shipping.');
await writeFile(new URL('offline/Thien-Menh.html',root),html);
await writeFile(new URL('offline/HUONG-DAN.txt',root),await readFile(new URL('windows/HUONG-DAN.txt',root),'utf8'));
console.log('Offline build: offline/Thien-Menh.html (all active PNGs embedded once; no network or Node.js needed)');
// Native packages load local PNGs directly, avoiding the memory cost of a large embedded asset script.
let nativeScript=sources.map(combine).join('\n').replaceAll('/assets/','assets/').replace(/<\/script/gi,'<\\/script');
let nativeHtml=template.replace(/<link rel="stylesheet" href="\/(?:style|pixel|immersive|rpg|account|viewport|design|style-bible)\.css">/g,'');
nativeHtml=nativeHtml.replace('</head>','<style>'+styles.join('\n').replaceAll('/assets/','assets/')+'</style></head>').replace('<script type="module" src="/app.mjs"></script>',()=>'<script>(()=>{\n'+nativeScript+'\n})();</script>');
await mkdir(new URL('mobile/bundle/assets/',root),{recursive:true});
await writeFile(new URL('mobile/bundle/index.html',root),nativeHtml);
for(const name of await readdir(new URL('mobile/bundle/assets/',root)))if(name.endsWith('.png')&&!assetNames.includes(name))await unlink(new URL('mobile/bundle/assets/'+name,root));
await Promise.all(assetNames.map((name,i)=>writeFile(new URL('mobile/bundle/assets/'+name,root),assetBytes[i])));
console.log('Native bundle: mobile/bundle/index.html + local PNGs (no runtime network)');
