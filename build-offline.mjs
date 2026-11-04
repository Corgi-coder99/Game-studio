import { readFile, mkdir, writeFile } from 'node:fs/promises';

const root = new URL('./', import.meta.url);
const [template, sourceCss, game, app] = await Promise.all(
  ['index.html', 'style.css', 'game.mjs', 'app.mjs'].map(file => readFile(new URL(file, root), 'utf8')),
);
let css = sourceCss + '\n' + await readFile(new URL('pixel.css', root), 'utf8');
for (const asset of ['heroes-pixel.png', 'hulao-pixel.png']) {
  const bytes = await readFile(new URL(`assets/${asset}`, root));
  css = css.replaceAll(`/assets/${asset}`, `data:image/png;base64,${bytes.toString('base64')}`);
}
// A single classic script works with file://, without module fetches or a server.
const logic = game.replace(/^export /gm, '');
const ui = app.replace(/^import \{[^\n]+\} from '\.\/game\.mjs';\r?\n/, '');
if (ui === app) throw new Error('Game import changed: update the offline bundler.');
const script = `${logic}\n${ui}`.replace(/<\/script/gi, '<\\/script');
const html = template
  .replace('<link rel="stylesheet" href="/pixel.css">', '')
  .replace('<link rel="stylesheet" href="/style.css">', () => `<style>${css}</style>`)
  .replace('<script type="module" src="/app.mjs"></script>', () => `<script>\n(() => {\n${script}\n})();\n</script>`);
if (html.includes('src="/app.mjs"') || html.includes('href="/style.css"')) throw new Error('Offline template changed.');
await mkdir(new URL('offline/', root), { recursive: true });
await writeFile(new URL('offline/Thien-Menh.html', root), html);
await writeFile(new URL('offline/HUONG-DAN.txt', root), `THIEN MENH - BAN THU NGHIEM OFFLINE CHO WINDOWS\r\n\r\n1. Giai nen toan bo tep ZIP (Extract All).\r\n2. Nhan dup Thien-Menh.html; mo bang Microsoft Edge hoac Google Chrome.\r\n3. Khong can Node.js, cai dat, tai khoan hay ket noi Internet.\r\n\r\nTien do duoc luu trong trinh duyet neu trinh duyet cho phep.\r\nVao Studio > Xuat ban luu JSON de sao luu truoc khi doi ten/di chuyen\r\ntep HTML, doi trinh duyet hoac xoa du lieu. Dung Nhap ban luu JSON\r\nde khoi phuc. Khong dung che do InPrivate/Incognito de luu lau dai.\r\n\r\nDay la ban choi thu: 8 nhan vat, 1 ai, gacha bang tien mo phong.\r\nStudio khong dieu khien Codex truc tiep va khong goi AI khi choi.\r\n`);
console.log('Offline build: offline/Thien-Menh.html (self-contained; no Node.js needed to play)');
