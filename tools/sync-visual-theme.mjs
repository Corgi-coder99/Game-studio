import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),data=JSON.parse(await readFile(new URL('config/visual-theme.json',root),'utf8'));
const colors=Object.values(data.ramps).flat();if(colors.some(c=>!/^#[0-9A-F]{6}$/.test(c)))throw new Error('Visual theme tokens must be RGB hexadecimal colors.');
await writeFile(new URL('visual-theme.mjs',root),'// Generated from config/visual-theme.json.\nexport const visualTheme='+JSON.stringify(data)+';\n');
const variables=Object.entries(data.ramps).flatMap(([ramp,values])=>values.map((color,i)=>`--${ramp}-${i+1}:${color};`)).join('');
const fontLicense=await readFile(new URL('assets/fonts/OFL-VT323.txt',root),'utf8');
const font=(await readFile(new URL(data.font.path,root))).toString('base64'),template=await readFile(new URL('visual-theme.template.css',root),'utf8');
await writeFile(new URL('visual-theme.css',root),`/* Generated: node tools/sync-visual-theme.mjs. Font: VT323, SIL OFL 1.1.
${fontLicense}
*/\n@font-face{font-family:"Mandate Pixel";src:url(data:font/ttf;base64,${font}) format("truetype");font-weight:400;font-style:normal;font-display:swap;}\n:root{${variables}}\n${template}`);
console.log('Synchronized the reference-art interface tokens and local pixel font.');
