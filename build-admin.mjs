import {readFile,writeFile} from 'node:fs/promises';
import {runtimeModules} from './build-manifest.mjs';
const combine=source=>source.replace(/^import \{[^\n]+\} from '[^']+';\r?\n/gm,'').replace(/^export /gm,'');
const modules=[...runtimeModules.filter(n=>n!=='app'),'admin/dev-model'];
const sources=await Promise.all(modules.map(n=>readFile(n+'.mjs','utf8')));
const script='(()=>{\n'+sources.map(combine).join('\n')+'\n'+await readFile('admin/controller.js','utf8')+'\n})();';
if(/^import /m.test(script))throw new Error('Unbundled developer dependency.');
await writeFile('admin/Heavenly-Mandate-DevTools.html',(await readFile('admin/index.html','utf8')).replace('/*DEV_SCRIPT*/',()=>script.replace(/<\/script/gi,'<\\/script')));
console.log('Separate offline developer app built.');
