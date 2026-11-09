import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {deflateSync} from 'node:zlib';
const root=new URL('../',import.meta.url),data=JSON.parse(await readFile(new URL('config/style-bible.json',root),'utf8'));
const colors=Object.values(data.ramps).flat();if(colors.length!==47||new Set(colors).size!==47||colors.some(c=>!/^#[0-9A-F]{6}$/.test(c)))throw new Error('The Style Bible requires exactly 47 unique opaque colors.');
await writeFile(new URL('style-palette.mjs',root),'// Generated from config/style-bible.json.\nexport const goldenStyle='+JSON.stringify(data)+';\nexport const goldenPalette='+JSON.stringify(colors)+';\n');
const variables=Object.entries(data.ramps).flatMap(([ramp,values])=>values.map((color,i)=>`--${ramp}-${i+1}:${color};`)).join('');
const fontLicense=await readFile(new URL('assets/fonts/OFL-VT323.txt',root),'utf8');
const font=(await readFile(new URL(data.font.path,root))).toString('base64'),template=await readFile(new URL('style-bible.template.css',root),'utf8');
await writeFile(new URL('style-bible.css',root),`/* Generated: node tools/sync-style-bible.mjs. Font: VT323, SIL OFL 1.1.
${fontLicense}
*/\n@font-face{font-family:"Mandate Pixel";src:url(data:font/ttf;base64,${font}) format("truetype");font-weight:400;font-style:normal;font-display:swap;}\n:root{${variables}}\n${template}`);
console.log('Synchronized the 47-color Golden Warring Kingdoms theme and local Vietnamese-capable pixel font.');

await mkdir(new URL('art/',root),{recursive:true});await writeFile(new URL('art/palette.hex',root),colors.join('\n')+'\n');
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^(crc&1?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
function chunk(type,data){const code=Buffer.from(type),size=Buffer.alloc(4),crc=Buffer.alloc(4);size.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([code,data])));return Buffer.concat([size,code,data,crc]);}
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(47);ihdr.writeUInt32BE(1,4);ihdr[8]=8;ihdr[9]=6;const pixels=Buffer.from([0,...colors.flatMap(h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16),255])]);await writeFile(new URL('art/palette.png',root),Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(pixels)),chunk('IEND',Buffer.alloc(0))]));
