import { characterRoster, characterById, gradeOrder, archetypeLabels, effectDescriptions } from './characters.mjs';

export const maxTeamSize=5;
export const gearSlots=['helmet','armor','weapon','jewelry','relic'];
export const gearSlotNames={helmet:'Mũ',armor:'Giáp',weapon:'Vũ khí',jewelry:'Trang sức',relic:'Cổ vật đặc biệt'};
export const statNames={maxHp:'Máu',physicalAtk:'Công vật lý',magicAtk:'Công phép',armor:'Kháng vật lý',resist:'Kháng phép',crit:'Chí mạng',attackSpeed:'Tốc độ đánh',manaMax:'Mana tối đa',rageMax:'Nộ tối đa',manaRegen:'Hồi mana/giây',rageRegen:'Hồi nộ/giây'};
export const levelLimit=60, skillLimit=5, gearLimit=10;
const gradeFactors={SSR:1.55,SSS:1.4,SS:1.3,S:1.2,A:1.1,B:1,C:.9,D:.8};
export const shardYield={SSR:40,SSS:30,SS:25,S:20,A:15,B:12,C:10,D:8};
export const rareStatNames={armorPen:'Xuyên giáp',magicPen:'Xuyên kháng phép',critDamage:'Sát thương chí mạng',dodge:'Né tránh',tenacity:'Kháng thời gian bất lợi'};
const PItem=(id,name,slot,bonuses,grade='B',heroId=null)=>({id,name,slot,bonuses,grade,heroId});
export const itemTemplates=[
 PItem('bronze-helm','Thanh Đồng Khôi','helmet',{maxHp:45,armor:6,resist:3}),
 PItem('jade-helm','Ngọc Linh Quan','helmet',{maxHp:65,manaMax:25,magicAtk:12},'A'),
 PItem('phoenix-helm','Phượng Hoàng Quan','helmet',{maxHp:90,crit:.025,revive:true},'SS'),
 PItem('iron-mail','Thiết Lân Giáp','armor',{maxHp:90,armor:15,block:.05}),
 PItem('river-mail','Lưu Thủy Pháp Y','armor',{maxHp:70,resist:20,regen:.004},'A'),
 PItem('thorn-mail','Kinh Cức Giáp','armor',{maxHp:90,armor:15,reflect:.1},'S'),
 PItem('bronze-sword','Thanh Phong Kiếm','weapon',{physicalAtk:18,magicAtk:6}),
 PItem('jade-staff','Linh Ngọc Pháp Trượng','weapon',{physicalAtk:7,magicAtk:26,manaMax:15},'A'),
 PItem('wind-bow','Truy Phong Cung','weapon',{physicalAtk:23,attackSpeed:.05},'A'),
 PItem('jade-pendant','Dưỡng Tâm Ngọc','jewelry',{maxHp:45,manaMax:25,manaRegen:2}),
 PItem('tiger-fang','Hổ Nha Bội','jewelry',{crit:.04,lifesteal:.05},'S'),
 PItem('storm-ring','Phong Lôi Giới','jewelry',{attackSpeed:.08,physicalAtk:12},'S'),
 PItem('stone-shell','Huyền Vũ Giáp Phiến','relic',{block:.12,armor:12},'SS'),
 PItem('mirror','Hồi Quang Kính','relic',{reflect:.15,resist:14},'SS'),
 PItem('blood-pearl','Huyết Ngọc Châu','relic',{lifesteal:.15,physicalAtk:10,magicAtk:10},'SS'),
 PItem('lotus','Thanh Liên Bảo Tọa','relic',{maxHp:80,healPower:.08,regen:.004},'SS'),
 PItem('spirit-bell','Tụ Linh Chung','relic',{manaMax:30,manaRegen:3,rageMax:20,rageRegen:2},'S'),
 ...gradeOrder.filter(g=>g!=='SSR').flatMap((grade,index)=>gearSlots.map((slot,i)=>{const f=[2.6,2.2,1.8,1.4,1.15,.9,.7][index],base=[{maxHp:40,armor:7,resist:7},{maxHp:70,armor:12,resist:10},{physicalAtk:20,magicAtk:20},{maxHp:25,manaMax:10,rageMax:8},{maxHp:30,physicalAtk:8,magicAtk:8}][i],bonuses=Object.fromEntries(Object.entries(base).map(([k,v])=>[k,Math.round(v*f)]));if(index<=2)bonuses[slot==='armor'?'block':slot==='relic'?'reflect':'lifesteal']=[.08,.05,.025][index];return PItem('crafted-'+grade+'-'+slot,grade+' · '+gearSlotNames[slot],slot,bonuses,grade);})),
 ...['crown','mail','blade','pendant','relic'].map((id,i)=>({...PItem('celestial-'+id,['Thiên Mệnh Đế Quan','Cửu Thiên Thần Giáp','Tinh Hà Thần Binh','Thái Sơ Ngọc Bội','Hồng Mông Cổ Ấn'][i],gearSlots[i],[{maxHp:320,armor:48,resist:48,tenacity:.15},{maxHp:440,armor:70,resist:70,block:.12,dodge:.08},{physicalAtk:130,magicAtk:130,crit:.08,armorPen:.2,magicPen:.2},{maxHp:180,manaMax:90,rageMax:50,manaRegen:8,rageRegen:4,critDamage:.3},{maxHp:320,physicalAtk:70,magicAtk:70,lifesteal:.15,armorPen:.1,magicPen:.1}][i],'SSR'),rewardOnly:true})),
 ...characterRoster.map(h=>PItem('signature-'+h.id,h.weapon,'weapon',h.resource==='mana'?{physicalAtk:14,magicAtk:35,manaMax:30,crit:.03}:{physicalAtk:35,magicAtk:14,rageMax:20,attackSpeed:.06},h.grade,h.id)),
];
export const itemById=Object.fromEntries(itemTemplates.map(i=>[i.id,i]));
const knownHero=id=>typeof id==='string'&&Object.hasOwn(characterById,id);
const plain=v=>v&&typeof v==='object'&&!Array.isArray(v);
const bounded=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
export function defaultFormation(team) {
 const slots=Array(9).fill(null);
 for(const id of team.slice(0,maxTeamSize)){const h=characterById[id];if(!h||slots.includes(id))continue;const preferred=(h.roles.includes('support')||h.roles.includes('mage')||h.roles.includes('archer'))?[6,8,7,0,2]:[0,2,6,7,8];const slot=[...preferred,...Array.from({length:9},(_,i)=>i)].find(i=>slots[i]===null);if(slot!==undefined)slots[slot]=id;}
 return slots;
}
export function normalizeProgression(source) {
 const s=structuredClone(source);s.revision=9;
 s.heroSkillRanks=s.heroSkillRanks||{};s.heroLevels=s.heroLevels||{};s.heroXP=s.heroXP||{};s.skillLevels=s.skillLevels||{};s.heroGear=s.heroGear||{};s.essence=s.essence??100;
 for(const id of s.owned){s.heroLevels[id]??=1;s.heroXP[id]??=80;s.skillLevels[id]??=1;}
 if(!s.inventory){s.inventory=itemTemplates.filter(t=>!t.heroId&&!t.rewardOnly&&!t.id.startsWith('crafted-')).map((t,i)=>({id:'item-'+(i+1),templateId:t.id,level:1}));}
 s.nextItemId=s.nextItemId||Math.max(0,...s.inventory.map(i=>Number(i.id.slice(5))))+1;
 s.formation=s.formation||defaultFormation(s.team);let count=0;s.formation=s.formation.map(id=>id&&count++<maxTeamSize?id:null);s.team=s.formation.filter(Boolean);
 return s;
}
export function validProgression(s) {
 if(s.revision!==undefined&&![4,5,8,9].includes(s.revision))return false;
 for(const [key,min,max]of [['heroLevels',1,levelLimit],['skillLevels',1,skillLimit],['heroXP',0,1000000]])if(s[key]!==undefined&&(!plain(s[key])||!Object.entries(s[key]).every(([id,n])=>knownHero(id)&&bounded(n,min,max))))return false;
 if(s.heroSkillRanks!==undefined&&(!plain(s.heroSkillRanks)||!Object.entries(s.heroSkillRanks).every(([id,ranks])=>knownHero(id)&&plain(ranks)&&Object.entries(ranks).every(([index,rank])=>/^[1-3]$/.test(index)&&Number(index)<characterById[id].skills.length&&bounded(rank,1,5)))))return false;
 if(s.essence!==undefined&&!bounded(s.essence,0,9999999))return false;
 if((s.revision===8&&s.formation?.filter(Boolean).length>4)||(s.revision===9&&s.formation?.filter(Boolean).length>maxTeamSize))return false;
 if(s.formation!==undefined&&(!Array.isArray(s.formation)||s.formation.length!==9||!s.formation.every(id=>id===null||knownHero(id)&&s.owned.includes(id))||new Set(s.formation.filter(Boolean)).size!==s.formation.filter(Boolean).length||JSON.stringify(s.formation.filter(Boolean))!==JSON.stringify(s.team)))return false;
 if(s.inventory!==undefined){
  if(!Array.isArray(s.inventory)||!s.inventory.every(i=>plain(i)&&/^item-[1-9]\d{0,8}$/.test(i.id)&&Object.hasOwn(itemById,i.templateId)&&bounded(i.level,1,gearLimit))||new Set(s.inventory.map(i=>i.id)).size!==s.inventory.length)return false;
  if(s.nextItemId!==undefined&&(!bounded(s.nextItemId,1,1000000000)||s.inventory.some(i=>Number(i.id.slice(5))>=s.nextItemId)))return false;
 }
 if(s.heroGear!==undefined){
  if(!plain(s.heroGear))return false;const used=new Set();
  for(const [id,slots]of Object.entries(s.heroGear)){if(!knownHero(id)||!s.owned.includes(id)||!plain(slots))return false;for(const [slot,instance]of Object.entries(slots)){const item=s.inventory?.find(i=>i.id===instance),template=item&&itemById[item.templateId];if(!gearSlots.includes(slot)||!template||template.slot!==slot||template.heroId&&template.heroId!==id||used.has(instance))return false;used.add(instance);}}
 }
 return true;
}
export function getCharacterStats(state,id,slot=null) {
 const h=characterById[id];if(!h)throw new Error('Nhân vật không hợp lệ.');
 const level=state.heroLevels?.[id]||1,l=level-1,g=gradeFactors[h.grade],tank=h.roles.includes('tank'),assassin=h.roles.includes('assassin'),mage=h.roles.includes('mage'),support=h.roles.includes('support');
 const baseHp=(state.overrides?.[id]?.hp??h.hp)*4,baseAtk=(state.overrides?.[id]?.atk??h.atk)*2;
 const stats={level,maxHp:baseHp*g*(1+.085*l),physicalAtk:baseAtk*g*(1+.065*l)*(support&&!mage?.8:1),magicAtk:baseAtk*g*(1+.065*l)*(mage?1.15:support?1:.65),armor:(tank?42:assassin?20:28)*g*(1+.05*l),resist:(mage||support?35:tank?32:23)*g*(1+.05*l),crit:(assassin?.09:.05)+(7-gradeOrder.indexOf(h.grade))*.004+l*.0015,attackSpeed:(tank?.7:assassin?1.05:h.roles.includes('archer')?1:mage?.8:.9)*(1+.008*l),manaMax:100*g+2*l,rageMax:100+l,manaRegen:12*g+.4*l,rageRegen:1+.035*l,healPower:0,armorPen:0,magicPen:0,critDamage:1.5,dodge:0,tenacity:0,block:h.passives.block||0,reflect:h.passives.reflect||0,lifesteal:h.passives.lifesteal||0,regen:h.passives.regen||0,revive:Boolean(h.passives.revive),execute:Boolean(h.passives.execute)};
 if(h.vipExclusive){if(id==='hongjun'){stats.manaRegen*=1.2;stats.healPower+=.15;}if(id==='yuanshi'){stats.resist*=1.15;stats.block+=.1;}if(id==='taishang')stats.regen+=.01;if(id==='lingbao'){stats.magicPen+=.15;stats.lifesteal+=.1;}if(id==='haotian'){stats.maxHp*=1.1;stats.physicalAtk*=1.15;}}
 for(const instanceId of Object.values(state.heroGear?.[id]||{})){const item=state.inventory?.find(i=>i.id===instanceId),template=item&&itemById[item.templateId];if(!template)continue;const factor=1+(item.level-1)*.12;for(const [k,v]of Object.entries(template.bonuses)){if(typeof v==='boolean')stats[k]=stats[k]||v;else stats[k]=(stats[k]||0)+v*factor;}}
 const star=state.account?.stars?.[id]||0;for(const k of ['maxHp','physicalAtk','magicAtk','armor','resist'])stats[k]*=1+.08*star;
 const equipped=gearSlots.map(k=>state.inventory?.find(i=>i.id===state.heroGear?.[id]?.[k])).filter(Boolean);stats.divineSet=equipped.length===5&&equipped.every(i=>itemById[i.templateId].grade==='SSR');if(stats.divineSet)for(const k of Object.keys(stats))if(typeof stats[k]==='number'&&k!=='level')stats[k]*=3;
 const position=slot??state.formation?.indexOf(id)??-1,row=position<0?-1:Math.floor(position/3);
 if(row===0&&tank){stats.armor*=1.1;stats.resist*=1.1;stats.block+=.05;}
 if(row===0&&h.roles.includes('fighter'))stats.physicalAtk*=1.08;
 if(row===1&&assassin)stats.crit+=.05;
 if(row===1&&mage)stats.magicAtk*=1.05;
 if(row===2&&support)stats.healPower+=.1;
 if(row===2&&h.roles.includes('archer'))stats.physicalAtk*=1.1;
 for(const k of ['maxHp','physicalAtk','magicAtk','armor','resist','manaMax','rageMax'])stats[k]=Math.round(stats[k]);
 stats.armorPen=Math.min(.8,stats.armorPen);stats.magicPen=Math.min(.8,stats.magicPen);stats.dodge=Math.min(.5,stats.dodge);stats.tenacity=Math.min(.7,stats.tenacity);stats.block=Math.min(.7,stats.block);stats.reflect=Math.min(.5,stats.reflect);stats.lifesteal=Math.min(.5,stats.lifesteal);stats.crit=Math.min(.75,stats.crit);stats.attackSpeed=Math.min(3.5,stats.attackSpeed);stats.regen=Math.min(.08,stats.regen);
 return stats;
}
export function describeSkill(h,level=1) {
 if(h.skill.description)return h.skill.description;
 const targetNames={self:'bản thân',allyAll:'toàn đội',weakAlly:'đồng minh yếu nhất',enemyAll:'toàn địch',enemyFront:'hàng đầu địch',enemyBack:'hàng sau địch',enemyWeak:'địch yếu nhất',enemyColumn:'một cột địch'};
 return h.skill.operations.map(op=>op.effect==='damage'?`${Math.round(op.scale*(1+.08*(level-1))*100)}% ${op.damageType==='magic'?'công phép':'công vật lý'} lên ${targetNames[op.target]}`:op.effect==='heal'?`Hồi ${Math.round(op.value*(1+.04*(level-1))*100)}% HP cho ${targetNames[op.target]}`:op.effect==='shield'?`Tạo khiên cho ${targetNames[op.target]} (bản thân ≤30%, đồng đội ≤15%)`:`${({burn:'Thiêu đốt + giảm hồi máu',stun:'Choáng',slow:'Làm chậm',manaLock:'Giảm hồi mana',immune:'Miễn sát thương',invincible:'Vô địch và ngừng tấn công',exposed:'Phá giáp',marked:'Đánh dấu',boost:'Tăng công'})[op.effect]} ${targetNames[op.target]} ${op.duration}s`).join('; ')+'.';
}
export function passiveText(h){return Object.entries(h.passives).map(([key,value])=>`${effectDescriptions[key]}${typeof value==='number'?` Mức gốc ${Math.round(value*100)}%.`:''}`).join(' ');}
function ownedCheck(s,id){if(!knownHero(id)||!s.owned.includes(id))throw new Error('Bạn chưa sở hữu nhân vật này.');}
export function heroAssignedElsewhere(s,id){return s.squads?.presets?.findIndex((p,i)=>i!==s.squads.active&&p.formation.includes(id))??-1;}
export function assignFormation(state,id,slot) {
 ownedCheck(state,id);if(heroAssignedElsewhere(state,id)>=0)throw new Error('This hero is assigned to another world squad. Remove the hero there first.');if(!bounded(slot,0,8))throw new Error('Ô đội hình không hợp lệ.');
 const s=normalizeProgression(state),old=s.formation.indexOf(id),displaced=s.formation[slot];if(old<0&&!displaced&&s.team.length>=maxTeamSize)throw new Error('A formation supports at most five heroes. Chọn một vị trí để thay thế.');
 if(old>=0)s.formation[old]=displaced;
 s.formation[slot]=id;s.team=s.formation.filter(Boolean);return s;
}
export function toggleFormation(state,id){ownedCheck(state,id);if(!state.team.includes(id)&&heroAssignedElsewhere(state,id)>=0)throw new Error('This hero is assigned to another world squad.');const s=normalizeProgression(state),old=s.formation.indexOf(id);if(old>=0)s.formation[old]=null;else{if(s.team.length>=maxTeamSize)throw new Error('A formation supports at most five heroes. Chọn một vị trí để thay thế.');const slot=[...defaultFormation([id]).map((v,i)=>v?i:null).filter(v=>v!==null),0,2,6,8,...Array.from({length:9},(_,i)=>i)].find(i=>!s.formation[i]);s.formation[slot]=id;}s.team=s.formation.filter(Boolean);return s;}
export function heroLevelCost(s,id){const level=s.heroLevels?.[id]||1;return{xp:30+level*15,coins:30+level*20,food:50*level};}
export function levelUpHero(state,id){ownedCheck(state,id);const s=normalizeProgression(state),price=heroLevelCost(s,id);if(s.heroLevels[id]>=levelLimit)throw new Error('Đã đạt cấp 60.');if(s.heroXP[id]<price.xp||s.coins<price.coins||s.resources.food<price.food)throw new Error('Chưa đủ kinh nghiệm, linh ngọc hoặc lương thực.');s.heroXP[id]-=price.xp;s.coins-=price.coins;s.resources.food-=price.food;s.heroLevels[id]++;return s;}
export function getSkillRank(s,id,index=0){return index===0?s.skillLevels?.[id]||1:s.heroSkillRanks?.[id]?.[index]||1;}
export function levelUpSkill(state,id,index=0){ownedCheck(state,id);if(!Number.isInteger(index)||!characterById[id].skills[index])throw new Error('Kỹ năng không hợp lệ.');const s=normalizeProgression(state),level=getSkillRank(s,id,index);if(level>=skillLimit)throw new Error('Kỹ năng đã đạt cấp 5.');if(s.essence<level*20||s.coins<level*50)throw new Error('Chưa đủ tinh hoa hoặc linh ngọc.');s.essence-=level*20;s.coins-=level*50;if(index===0)s.skillLevels[id]++;else{s.heroSkillRanks[id]??={};s.heroSkillRanks[id][index]=level+1;}return s;}

export function forgeItem(state,templateId){const template=itemById[templateId];if(!Object.hasOwn(itemById,templateId))throw new Error('Bản vẽ không hợp lệ.');if(template.rewardOnly||template.heroId&&characterById[template.heroId].vipExclusive)throw new Error('Trang bị này chỉ nhận từ quà thưởng.');if(template.heroId)ownedCheck(state,template.heroId);const s=normalizeProgression(state),cost=template.heroId?400:150;if(s.coins<cost)throw new Error('Chưa đủ linh ngọc để rèn.');if(s.nextItemId>=999999999)throw new Error('Đã hết mã trang bị.');s.coins-=cost;s.inventory.push({id:'item-'+s.nextItemId++,templateId,level:1});return s;}
export function equipmentOwner(s,instanceId){return Object.entries(s.heroGear||{}).find(([,slots])=>Object.values(slots).includes(instanceId))?.[0]||null;}
export function equipItem(state,id,slot,instanceId){ownedCheck(state,id);if(!gearSlots.includes(slot))throw new Error('Ô trang bị không hợp lệ.');const s=normalizeProgression(state);s.heroGear[id]??={};if(!instanceId){delete s.heroGear[id][slot];return s;}const item=s.inventory.find(i=>i.id===instanceId),template=item&&itemById[item.templateId],owner=equipmentOwner(s,instanceId);if(!template||template.slot!==slot||template.heroId&&template.heroId!==id)throw new Error('Trang bị không phù hợp với nhân vật/ô này.');if(owner&&owner!==id)throw new Error('Trang bị đang được nhân vật khác sử dụng.');s.heroGear[id][slot]=instanceId;return s;}
export function enhanceItem(state,instanceId){const s=normalizeProgression(state),item=s.inventory.find(i=>i.id===instanceId);if(!item)throw new Error('Trang bị không tồn tại.');if(item.level>=gearLimit)throw new Error('Trang bị đã đạt +10.');const cost=item.level*80;if(s.coins<cost)throw new Error('Chưa đủ linh ngọc để cường hóa.');s.coins-=cost;item.level++;return s;}
export function grantHeroXP(s,amount){for(const id of s.team)s.heroXP[id]=Math.min(1000000,(s.heroXP[id]||0)+amount);s.essence=Math.min(9999999,(s.essence||0)+Math.round(amount/4));}
export function pullCharacters(state,count=1,random=Math.random,payment='coins'){if(!['coins','tickets'].includes(payment)||![1,10,100].includes(count)||(payment==='tickets'?(state.account?.bag?.summonTicket||0)<count:state.coins<count*100))throw new Error('Không đủ linh ngọc.');const s=normalizeProgression(state),results=[];if(payment==='tickets')s.account.bag.summonTicket-=count;else s.coins-=count*100;const weights=[.01,.03,.06,.1,.2,.25,.2,.15];for(let n=0;n<count;n++){let grade='SSR';if(s.pity!==29){let value=random(),sum=0;grade=gradeOrder.find((_,i)=>(sum+=weights[i])>value)||'D';}const pool=characterRoster.filter(h=>h.grade===grade&&!h.vipExclusive),h=pool[Math.min(pool.length-1,Math.floor(random()*pool.length))],duplicate=s.owned.includes(h.id);if(duplicate){if(s.account)s.account.shards[h.id]=Math.min(9999999,(s.account.shards[h.id]||0)+shardYield[h.grade]);s.coins+=25;s.essence=Math.min(9999999,s.essence+10);}else{s.owned.push(h.id);s.heroLevels[h.id]=1;s.heroXP[h.id]=80;s.skillLevels[h.id]=1;}s.pity=grade==='SSR'?0:s.pity+1;s.pulls++;results.push({...h,duplicate});}return{state:s,results};}
