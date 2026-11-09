import './tools/sync-visual-theme.mjs';
import {readFile,writeFile} from 'node:fs/promises';
const items=JSON.parse(await readFile(new URL('config/items_exclusive.json',import.meta.url),'utf8')),rules=JSON.parse(await readFile(new URL('config/auction_drops.json',import.meta.url),'utf8'));
await writeFile(new URL('auction-config.mjs',import.meta.url),'// Generated from config/*.json. Edit the JSON sources, then run sync-auction-config.mjs.\nexport const exclusiveItems='+JSON.stringify(items)+';\nexport const auctionRules='+JSON.stringify(rules)+';\n');

const titleData=JSON.parse(await readFile(new URL('config/titles.json',import.meta.url),'utf8')),frameData=JSON.parse(await readFile(new URL('config/frames.json',import.meta.url),'utf8'));
await writeFile(new URL('title-config.mjs',import.meta.url),'// Generated from config/titles.json and config/frames.json.\nexport const titleDefinitions='+JSON.stringify(titleData)+';\nexport const titleFrames='+JSON.stringify(frameData)+';\n');
const bossData=JSON.parse(await readFile(new URL('config/world_bosses.json',import.meta.url),'utf8'));
await writeFile(new URL('world-boss-config.mjs',import.meta.url),'// Generated from config/world_bosses.json.\nexport const worldBossDefinitions='+JSON.stringify(bossData.bosses)+';\nexport const worldBossRules='+JSON.stringify(bossData.rules)+';\n');
const strongholdData=JSON.parse(await readFile(new URL('config/strongholds.json',import.meta.url),'utf8'));
await writeFile(new URL('stronghold-config.mjs',import.meta.url),'// Generated from config/strongholds.json.\nexport const strongholdTypes='+JSON.stringify(strongholdData.types)+';\nexport const strongholdRules='+JSON.stringify(strongholdData.rules)+';\n');
const warfareData=JSON.parse(await readFile(new URL('config/warfare.json',import.meta.url),'utf8'));
await writeFile(new URL('warfare-config.mjs',import.meta.url),'// Generated from config/warfare.json.\nexport const warfareRules='+JSON.stringify(warfareData)+';\n');
const elementalData=JSON.parse(await readFile(new URL('config/element_rules.json',import.meta.url),'utf8'));
await writeFile(new URL('element-config.mjs',import.meta.url),'// Generated from config/element_rules.json.\nexport const elementRules='+JSON.stringify(elementalData)+';\n');
const feedbackData=JSON.parse(await readFile(new URL('config/feedback.json',import.meta.url),'utf8'));
await writeFile(new URL('feedback-config.mjs',import.meta.url),'// Generated from config/feedback.json.\nexport const feedbackConfig='+JSON.stringify(feedbackData)+';\n');
