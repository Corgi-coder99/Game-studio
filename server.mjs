import http from 'node:http';
import { readFile } from 'node:fs/promises';
const files = { '/': ['index.html', 'text/html; charset=utf-8'], '/app.mjs': ['app.mjs', 'text/javascript; charset=utf-8'], '/game.mjs': ['game.mjs', 'text/javascript; charset=utf-8'], '/style.css': ['style.css', 'text/css; charset=utf-8'] };
const port = Number(process.env.PORT || 3000);
for (const asset of ['heroes-pixel.png', 'hulao-pixel.png', 'city-pixel.png']) {
  files[`/assets/${asset}`] = [`assets/${asset}`, 'image/png'];
}
files['/pixel.css'] = ['pixel.css', 'text/css; charset=utf-8'];
files['/kingdom.mjs'] = ['kingdom.mjs', 'text/javascript; charset=utf-8'];
files['/map.mjs'] = ['map.mjs', 'text/javascript; charset=utf-8'];
http.createServer(async (req, res) => {
  const file = files[new URL(req.url, 'http://localhost').pathname];
  if (!file) { res.writeHead(404); res.end('Not found'); return; }
  try { const body = await readFile(new URL(file[0], import.meta.url)); res.writeHead(200, { 'Content-Type': file[1], 'Cache-Control': 'no-store' }); res.end(body); }
  catch { res.writeHead(500); res.end('Unable to load application'); }
}).listen(port, '0.0.0.0', () => console.log(`Legend Studio listening on port ${port}`));
