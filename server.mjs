import http from 'node:http';
import { readFile } from 'node:fs/promises';
const files = { '/': ['index.html', 'text/html; charset=utf-8'], '/app.mjs': ['app.mjs', 'text/javascript; charset=utf-8'], '/game.mjs': ['game.mjs', 'text/javascript; charset=utf-8'], '/style.css': ['style.css', 'text/css; charset=utf-8'] };
for(const module of ['room-client','peer-map','commerce','relocation','room','realm-ui','environment','scene-art','city-layout','civic-ui','hunting','civic','elements','long-ui','shop','city-life','operations','skill-vfx','world-art','technology','systems-ui','combat-motion','sandbox','art-cache','city-rules','squads','army-ui','recommendations','gallery-ui','viewport-ui','characters','progression','account','account-ui','character-ui','inventory-ui','realms','realm-map','campaign','campaign-ui','chronicle','wildlife','world-data','world-sim','world-ui','region-map','troops','skins','runes','mail','strategy-ui','inheritance-data','inheritance-sim','inheritance-combat','inheritance-ui','inheritance-map','tactics'])files['/'+module+'.mjs']=[module+'.mjs','text/javascript; charset=utf-8'];
files['/account.css']=['account.css','text/css; charset=utf-8'];
files['/rpg.css']=['rpg.css','text/css; charset=utf-8'];
files['/viewport.css']=['viewport.css','text/css; charset=utf-8'];
files['/design.css']=['design.css','text/css; charset=utf-8'];
const port = Number(process.env.PORT || 3000);
for (const asset of ['heroes-pixel.png', 'hulao-pixel.png', 'city-pixel.png', 'battle-units-pixel.png','roster-a-pixel.png','roster-b-pixel.png','celestial-pets-pixel.png','pets-awakened-pixel.png','skills-pixel.png','castle-skins-pixel.png','window-scenes-pixel.png','elemental-dragons-pixel.png','equipment-icons-pixel.png','inventory-icons-pixel.png','troops-walk-pixel.png','trial-tower-pixel.png','weapon-icons-pixel.png','building-scenes-pixel.png','living-terrain-pixel.png','world-sites-pixel.png','equipment-rarity-pixel.png','weapon-rarity-pixel.png','city-life-pixel.png','summon-temple-pixel.png','seven-dragons-pixel.png','element-icons-pixel.png','rune-gems-pixel.png','dragon-flight-pixel.png','wildlife-walk-pixel.png','province-props-pixel.png','navigation-icons-pixel.png','village-motion-pixel.png','summon-plaza-pixel.png','blind-boxes-pixel.png','skill-frames-pixel.png','city-foundation-pixel.png']) {
  files[`/assets/${asset}`] = [`assets/${asset}`, 'image/png'];
}
files['/pixel.css'] = ['pixel.css', 'text/css; charset=utf-8'];
files['/kingdom.mjs'] = ['kingdom.mjs', 'text/javascript; charset=utf-8'];
files['/map.mjs'] = ['map.mjs', 'text/javascript; charset=utf-8'];
files['/immersive.css'] = ['immersive.css', 'text/css; charset=utf-8'];
http.createServer(async (req, res) => {
  const file = files[new URL(req.url, 'http://localhost').pathname];
  if (!file) { res.writeHead(404); res.end('Not found'); return; }
  try { const body = await readFile(new URL(file[0], import.meta.url)); res.writeHead(200, { 'Content-Type': file[1], 'Cache-Control': 'no-store' }); res.end(body); }
  catch { res.writeHead(500); res.end('Unable to load application'); }
}).listen(port, '0.0.0.0', () => console.log(`Legend Studio listening on port ${port}`));
