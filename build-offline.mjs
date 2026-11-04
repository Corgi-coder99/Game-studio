import { readFile, mkdir, writeFile } from 'node:fs/promises';

const root = new URL('./', import.meta.url);
const [template, sourceCss, game, kingdom, map, app] = await Promise.all(
  ['index.html', 'style.css', 'game.mjs', 'kingdom.mjs', 'map.mjs', 'app.mjs'].map(file => readFile(new URL(file, root), 'utf8')),
);
let css = sourceCss + '\n' + await readFile(new URL('pixel.css', root), 'utf8');
for (const asset of ['heroes-pixel.png', 'hulao-pixel.png']) {
  const bytes = await readFile(new URL(`assets/${asset}`, root));
  css = css.replaceAll(`/assets/${asset}`, `data:image/png;base64,${bytes.toString('base64')}`);
}
// A single classic script works with file://, without module fetches or a server.
const combine = source => source.replace(/^import \{[^\n]+\} from '[^']+';\r?\n/gm, '').replace(/^export /gm, '');
let script = [game, kingdom, map, app].map(combine).join('\n').replace(/<\/script/gi, '<\\/script');
const cityPng = await readFile(new URL('assets/city-pixel.png', root));
script = script.replaceAll('/assets/city-pixel.png', `data:image/png;base64,${cityPng.toString('base64')}`);
if (/^import /m.test(script)) throw new Error('Unbundled import. Update offline builder.');
const html = template
  .replace('<link rel="stylesheet" href="/pixel.css">', '')
  .replace('<link rel="stylesheet" href="/style.css">', () => `<style>${css}</style>`)
  .replace('<script type="module" src="/app.mjs"></script>', () => `<script>\n(() => {\n${script}\n})();\n</script>`);
if (html.includes('src="/app.mjs"') || html.includes('href="/style.css"')) throw new Error('Offline template changed.');
await mkdir(new URL('offline/', root), { recursive: true });
await writeFile(new URL('offline/Thien-Menh.html', root), html);
await writeFile(new URL('offline/HUONG-DAN.txt', root), `THIEN MENH - BAN THU NGHIEM OFFLINE CHO WINDOWS\n\n1. Giai nen toan bo tep ZIP (Extract All).\n2. Nhan dup Thien-Menh.html; mo bang Microsoft Edge hoac Google Chrome.\n3. Khong can Node.js, cai dat, tai khoan hay ket noi Internet.\n\nTien do duoc luu trong trinh duyet neu trinh duyet cho phep.\nVao Studio > Xuat ban luu JSON de sao luu truoc khi doi ten/di chuyen\ntep HTML, doi trinh duyet hoac xoa du lieu. Dung Nhap ban luu JSON\nde khoi phuc. Khong dung che do InPrivate/Incognito de luu lau dai.\n\nDay la ban choi thu: Pixel Kingdom v2: xay thanh, 4 tuong, 8 ky nang, combo, linh long va PVE.\nStudio khong dieu khien Codex truc tiep va khong goi AI khi choi.\n`);
console.log('Offline build: offline/Thien-Menh.html (self-contained; no Node.js needed to play)');
