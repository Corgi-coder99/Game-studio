import {runtimeModules,textureAssets} from './build-manifest.mjs';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
const files = { '/': ['index.html', 'text/html; charset=utf-8'], '/app.mjs': ['app.mjs', 'text/javascript; charset=utf-8'], '/game.mjs': ['game.mjs', 'text/javascript; charset=utf-8'], '/style.css': ['style.css', 'text/css; charset=utf-8'] };
for(const module of runtimeModules)files['/'+module+'.mjs']=[module+'.mjs','text/javascript; charset=utf-8'];
files['/account.css']=['account.css','text/css; charset=utf-8'];
files['/rpg.css']=['rpg.css','text/css; charset=utf-8'];
files['/viewport.css']=['viewport.css','text/css; charset=utf-8'];
files['/design.css']=['design.css','text/css; charset=utf-8'];
const port = Number(process.env.PORT || 3000);
for(const asset of textureAssets)files['/assets/'+asset]=['assets/'+asset,'image/png'];
files['/pixel.css'] = ['pixel.css', 'text/css; charset=utf-8'];
files['/kingdom.mjs'] = ['kingdom.mjs', 'text/javascript; charset=utf-8'];
files['/map.mjs'] = ['map.mjs', 'text/javascript; charset=utf-8'];
files['/immersive.css'] = ['immersive.css', 'text/css; charset=utf-8'];
http.createServer(async (req, res) => {
  const file = files[new URL(req.url, 'http://localhost').pathname];
  if (!file) { res.writeHead(404); res.end('Not found'); return; }
  try { const body = await readFile(new URL(file[0], import.meta.url)); res.writeHead(200, { 'Content-Type': file[1], 'Cache-Control': 'no-store' }); res.end(body); }
  catch { res.writeHead(500); res.end('Unable to load application'); }
}).listen(port, '0.0.0.0', () => console.log(`Heavenly Mandate preview listening on port ${port}`));
