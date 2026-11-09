import {runtimeModules,textureAssets} from './build-manifest.mjs';
import http from 'node:http';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import { readFile } from 'node:fs/promises';
const files = { '/': ['index.html', 'text/html; charset=utf-8'], '/app.mjs': ['app.mjs', 'text/javascript; charset=utf-8'], '/game.mjs': ['game.mjs', 'text/javascript; charset=utf-8'], '/style.css': ['style.css', 'text/css; charset=utf-8'] };
for(const module of runtimeModules)files['/'+module+'.mjs']=[module+'.mjs','text/javascript; charset=utf-8'];
files['/account.css']=['account.css','text/css; charset=utf-8'];
files['/rpg.css']=['rpg.css','text/css; charset=utf-8'];
files['/viewport.css']=['viewport.css','text/css; charset=utf-8'];
files['/visual-theme.css']=['visual-theme.css','text/css; charset=utf-8'];
files['/design.css']=['design.css','text/css; charset=utf-8'];
const port = Number(process.env.PORT || 3000);
for(const asset of textureAssets)files['/assets/'+asset]=['assets/'+asset,'image/png'];
files['/pixel.css'] = ['pixel.css', 'text/css; charset=utf-8'];
files['/kingdom.mjs'] = ['kingdom.mjs', 'text/javascript; charset=utf-8'];
files['/map.mjs'] = ['map.mjs', 'text/javascript; charset=utf-8'];
files['/immersive.css'] = ['immersive.css', 'text/css; charset=utf-8'];
const onlineFileCache=new Map();
export async function serveGameFile(req,res,cacheAssets=false) {
  const file = files[new URL(req.url, 'http://localhost').pathname];
  if (!file) { res.writeHead(404); res.end('Not found'); return; }
  try { let body,etag;if(cacheAssets&&file[1]==='image/png'){let entry=onlineFileCache.get(file[0]);if(!entry){const bytes=await readFile(new URL(file[0],import.meta.url));entry={body:bytes,etag:'"'+createHash('sha256').update(bytes).digest('hex')+'"'};onlineFileCache.set(file[0],entry);}body=entry.body;etag=entry.etag;}else body=await readFile(new URL(file[0],import.meta.url));if(etag&&req.headers['if-none-match']===etag){res.writeHead(304,{'ETag':etag,'Cache-Control':'public, max-age=3600'});res.end();return;}res.writeHead(200,{'Content-Type':file[1],'Cache-Control':etag?'public, max-age=3600':'no-store',...(etag?{'ETag':etag}:{})});res.end(body); }
  catch { res.writeHead(500); res.end('Unable to load application'); }
}
if(process.argv[1]===fileURLToPath(import.meta.url))http.createServer(serveGameFile).listen(port, '0.0.0.0', () => console.log(`Heavenly Mandate preview listening on port ${port}`));
