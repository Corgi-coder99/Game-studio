import { readFile, mkdir, writeFile } from 'node:fs/promises';

const root = new URL('./', import.meta.url);
const [template,sourceCss,characters,game,progression,tactics,kingdom,map,app] = await Promise.all(
  ['index.html','style.css','characters.mjs','game.mjs','progression.mjs','tactics.mjs','kingdom.mjs','map.mjs','app.mjs'].map(file => readFile(new URL(file, root), 'utf8')),
);
let css = sourceCss + '\n' + await readFile(new URL('pixel.css', root), 'utf8') + '\n' + await readFile(new URL('immersive.css', root), 'utf8')+'\n'+await readFile(new URL('rpg.css',root),'utf8');
for (const asset of ['heroes-pixel.png','hulao-pixel.png','roster-a-pixel.png','roster-b-pixel.png']) {
  const bytes = await readFile(new URL(`assets/${asset}`, root));
  css = css.replaceAll(`/assets/${asset}`, `data:image/png;base64,${bytes.toString('base64')}`);
}
// A single classic script works with file://, without module fetches or a server.
const combine = source => source.replace(/^import \{[^\n]+\} from '[^']+';\r?\n/gm, '').replace(/^export /gm, '');
let script = [characters,game,progression,tactics,kingdom,map,app].map(combine).join('\n').replace(/<\/script/gi, '<\\/script');
for (const name of ['city-pixel.png','battle-units-pixel.png','hulao-pixel.png','roster-a-pixel.png','roster-b-pixel.png']) {
 const png = await readFile(new URL('assets/'+name, root));
 script = script.replaceAll('/assets/'+name, `data:image/png;base64,${png.toString('base64')}`);
}
if (/^import /m.test(script)) throw new Error('Unbundled import. Update offline builder.');
const html = template
  .replace('<link rel="stylesheet" href="/pixel.css">', '')
  .replace('<link rel="stylesheet" href="/immersive.css">', '')
  .replace('<link rel="stylesheet" href="/rpg.css">', '')
  .replace('<link rel="stylesheet" href="/style.css">', () => `<style>${css}</style>`)
  .replace('<script type="module" src="/app.mjs"></script>', () => `<script>\n(() => {\n${script}\n})();\n</script>`);
if (html.includes('src="/app.mjs"') || html.includes('href="/style.css"')) throw new Error('Offline template changed.');
await mkdir(new URL('offline/', root), { recursive: true });
await writeFile(new URL('offline/Thien-Menh.html', root), html);
await writeFile(new URL('offline/HUONG-DAN.txt', root), `THIEN MENH - BAN THU NGHIEM OFFLINE CHO WINDOWS\n\n1. Giai nen toan bo tep ZIP (Extract All).\n2. Nhan dup Thien-Menh.html; mo bang Microsoft Edge hoac Google Chrome.\n3. Khong can Node.js, cai dat, tai khoan hay ket noi Internet.\n\nTien do duoc luu trong trinh duyet neu trinh duyet cho phep.\nVao Studio > Xuat ban luu JSON de sao luu truoc khi doi ten/di chuyen\ntep HTML, doi trinh duyet hoac xoa du lieu. Dung Nhap ban luu JSON\nde khoi phuc. Khong dung che do InPrivate/Incognito de luu lau dai.\n\nDay la ban choi thu: Pixel Kingdom v4: xay thanh, 56 tuong, doi hinh 9 o, trang bi va ky nang, combo, linh long va PVE.\nStudio khong dieu khien Codex truc tiep va khong goi AI khi choi.\n`);
console.log('Offline build: offline/Thien-Menh.html (self-contained; no Node.js needed to play)');
