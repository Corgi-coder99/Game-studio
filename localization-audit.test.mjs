import {realmSetup} from './campaign-ui.mjs';
import test from 'node:test';import assert from 'node:assert/strict';import{kingdomInitial}from'./kingdom.mjs';import{characterRoster}from'./characters.mjs';import{renderDescription,inventoryEntries}from'./gallery-ui.mjs';import{englishText,setEnglishPlayerNames}from'./english.mjs';import{runeCatalog,runeEffectText}from'./runes.mjs';
const vietnamese=/[À-ÖØ-öø-ỹĐđ]/;
test('mailbox renders legacy notices and empty or populated rewards in English',async()=>{
 const {mailPage}=await import('./strategy-ui.mjs');
 const {secretRealms}=await import('./inheritance-data.mjs');
 const s=kingdomInitial(),realm=secretRealms[0];
 const render=tab=>englishText(mailPage(s,()=>'',null,tab));
 assert.equal(vietnamese.test(render('parcels')),false);
 s.mailbox.notices.push({id:1,title:'Tin chiến tuyến',text:'Trấn Thanh Phong: kế hoạch gather, 90 quân, 2 công trình.',read:false});
 assert.match(render('notices'),/Gathering resources · 90 troops · 2 buildings/);
 assert.equal(vietnamese.test(render('notices')),false);
 s.mailbox.parcels.push({id:2,realmId:realm.id,manualId:realm.manualId,
  reward:{coins:100,food:200,wood:300,stone:400,essence:5,playerXP:6,heroXP:7},claimed:false});
 assert.match(render('parcels'),/Claim All Rewards/);
 assert.equal(vietnamese.test(render('parcels')),false);
 s.mailbox.parcels[0].claimed=true;
 assert.match(render('parcels'),/✓ Claimed/);
});
test('regional site panels use English in complete sentences',async()=>{
 const {regionPanel,regionToolbar}=await import('./world-ui.mjs');
 const s=kingdomInitial();
 const ids=['portal','home',...Object.keys(s.worldAI.nodes),...Object.keys(s.worldAI.wild),...s.worldAI.bots.map(b=>b.id)];
 for(const id of ids)assert.equal(vietnamese.test(englishText(regionPanel(s,id))),false,id);
 assert.equal(vietnamese.test(englishText(regionToolbar(s))),false);
 const wood=Object.keys(s.worldAI.nodes).find(id=>id.endsWith('-1'));
 const panel=regionPanel(s,wood);
 assert.match(panel,/Each trip gathers up to 1,000 before spirit beast bonuses/);
 assert.match(panel,/Send 60 Troops to Gather/);
});
test('all hero, skill, shard and inventory description captions are English',()=>{const s=kingdomInitial(),keys=[];for(const h of characterRoster){keys.push('hero:'+h.id,'shard:'+h.id);for(let i=0;i<h.skills.length;i++)keys.push('skill:'+h.id+':'+i);if(h.passiveSkill)keys.push('skill:'+h.id+':passive');}for(const tab of ['resources','items','gear','longs','pets','cosmetics','manuals'])for(const e of inventoryEntries(s,tab,()=>''))keys.push(e.key);for(const key of keys){const text=englishText(renderDescription(s,key,()=>''));assert.equal(vietnamese.test(text),false,key+': '+text);}});
test('rune descriptions retain precise English effects at all ranks and user names remain untouched',()=>{for(const node of runeCatalog)for(const rank of [1,node.maxRank])assert.equal(vietnamese.test(runeEffectText(node,rank)),false);assert.match(runeEffectText(runeCatalog.find(n=>n.id==='regen')),/Restore 0.1%/);setEnglishPlayerNames(['Quang Long']);assert.equal(englishText('Quang Long'),'Quang Long');setEnglishPlayerNames([]);assert.equal(englishText('The healer restores health.'),'The healer restores health.');});

test('first-run kingdom selection has English headings, explanations and troop labels',()=>{for(const faction of ['wei','shu','wu']){const html=englishText(realmSetup(kingdomInitial(),faction));assert.equal(vietnamese.test(html),false);assert.ok(!html.includes('Wounded'));}});

test('gold, jade and spear infantry retain distinct presentation labels',()=>{assert.equal(englishText('Vàng'),'Gold');assert.equal(englishText('Ngọc'),'Jade');assert.equal(englishText('Linh ngọc'),'Jade');assert.equal(englishText('Thương binh'),'Spear Infantry');});

test('legacy notification translations remain English',async()=>{const {englishErrorPairs}=await import('./english-errors.mjs');for(const [source]of englishErrorPairs)assert.equal(vietnamese.test(englishText(source)),false,source);});

test('populated siege reports render English summaries, analysis, old advice and unit details',async()=>{const {createTacticsBattle,tickTactics}=await import('./tactics.mjs'),{recordBattleMail}=await import('./mail.mjs'),{mailPage}=await import('./strategy-ui.mjs'),{battleComparisonPage}=await import('./army-ui.mjs');for(const outcome of ['ally','enemy','retreat']){const s=kingdomInitial();let b=createTacticsBattle(s,{id:'bot-test',name:'Trấn Thanh Phong',level:1,enemies:['wukong','guanyu']});for(let i=0;i<6;i++)b=tickTactics(b,1,true,s.dragon,1);b.winner=outcome;recordBattleMail(s,b,{mode:'bot',target:'Trấn Thanh Phong'});const r=s.mailbox.reports[0];r.advice=['Báo cáo cũ còn tiếng Việt'];const before=structuredClone(r);for(const html of [battleComparisonPage(s,()=>''),mailPage(s,()=>''),renderDescription(s,`battleunit:${r.id}:allies-0`,()=>''),renderDescription(s,`battleunit:${r.id}:enemies-0`,()=> '')])assert.equal(vietnamese.test(englishText(html)),false,html);assert.deepEqual(r,before);assert.ok(mailPage(s,()=> '').includes('Advice Based on Battle Statistics'));}});

test('production and healing captions are English with real active jobs and wounded troops',async()=>{const{productionPage,medicalPage}=await import('./civic-ui.mjs'),{startProduction,startHealing}=await import('./civic.mjs');const s=kingdomInitial();for(const id of ['farm','wood','stone'])for(const state of [s,startProduction(s,id)])assert.equal(vietnamese.test(englishText(productionPage(state,id))),false);s.medical.wounded.shield=10;for(const state of [s,startHealing(s,'shield',10)])assert.equal(vietnamese.test(englishText(medicalPage(state))),false);});

test('legacy hidden-realm victory notices translate before names without corrupting word fragments',async()=>{const {mailNoticeText}=await import('./mail-copy.mjs');const {secretRealms,inheritanceManuals}=await import('./inheritance-data.mjs');for(const r of secretRealms){const texts=['BOSS '+r.bossName+' đã bị đánh bại','Chiến lợi và bí kíp '+inheritanceManuals.find(m=>m.id===r.manualId).name+' đang chờ nhận trong Hộp thư → Chiến lợi bí cảnh.'];for(const raw of texts){const text=englishText(mailNoticeText(raw));assert.equal(/[À-ÖØ-öø-ỹĐđ]/.test(text),false,text);assert.equal(text.includes('Stonenh'),false,text);}}assert.equal(mailNoticeText('10 đá, 20 gỗ'),'10 Stone, 20 Wood');});

test('profile placeholders, download guide and launcher prompts use English',async()=>{const{readFileSync}=await import('node:fs');const{profilePage}=await import('./account-ui.mjs');assert.equal(vietnamese.test(englishText(profilePage(kingdomInitial(),()=>''))),false);for(const file of ['windows/README.txt','windows/Play.bat','windows/Serve-with-Python.bat'])assert.equal(vietnamese.test(readFileSync(file,'utf8')),false,file);});
