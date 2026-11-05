import {initInheritance,validInheritance} from './inheritance-data.mjs';
import {initRunes,validRunes,awardRunePoints,runePointsForMilestone} from './runes.mjs';
import {initMailbox,validMailbox} from './mail.mjs';
import {castleSkins} from './skins.mjs';
import {initWorld,validWorld} from './world-data.mjs';
import {initChronicle,validChronicle} from './chronicle.mjs';
import { realmFactions, realmCities } from './realms.mjs';
import { characterRoster, characterById, gradeOrder } from './characters.mjs';
import { normalizeProgression, itemTemplates, itemById, equipmentOwner } from './progression.mjs';

export const vipExclusiveIds=['haotian','taishang','yuanshi','lingbao','hongjun'];
export const vipThresholds=[0,100,300,700,1300,2200,3500,5300,7800,11100,15400,20900,27900,36900,47900,60000];
export const petCatalog=[
 {id:'qilin',name:'Ngọc Kỳ Lân',title:'Lộc khí sinh tài',bonus:'production',rate:.03,text:'Tăng sản xuất tài nguyên trong thành',artIndex:5},
 {id:'phoenix',name:'Chu Tước',title:'Liệt hỏa hồi thiên',bonus:'magic',rate:.015,text:'Tăng công phép toàn đội',artIndex:6},
 {id:'tiger',name:'Bạch Hổ',title:'Phong nha chiến ý',bonus:'physical',rate:.015,text:'Tăng công vật lý toàn đội',artIndex:7},
 {id:'tortoise',name:'Huyền Vũ',title:'Bất động thần giáp',bonus:'health',rate:.02,text:'Tăng HP toàn đội',artIndex:8},
 {id:'pixiu',name:'Tỳ Hưu',title:'Chiêu tài tiến bảo',bonus:'gather',rate:.02,text:'Tăng tốc thu thập ngoài thành',artIndex:9},
];
export const petAwakenings={qilin:{name:'Ngọc Lân Tụ Lộc',text:'+10% sản xuất trong thành, +25% lượng tài nguyên thu thập.'},phoenix:{name:'Niết Bàn Hỏa Vũ',text:'Tướng thấp HP tối đa nhất nhận một lần hồi sinh 30% HP mỗi trận; toàn đội thêm 0,5% tái sinh HP/giây khi dưới nửa máu.'},tiger:{name:'Bạch Hổ Sát Phạt',text:'Toàn đội +5% chí mạng và +30% sát thương chí mạng.'},tortoise:{name:'Huyền Giáp Trấn Thiên',text:'Đầu trận toàn đội có khiên 15% HP trong 6s và +5% chặn đòn, vẫn tuân trần 70%.'},pixiu:{name:'Thôn Kim Tụ Bảo',text:'+15% linh ngọc chiến thắng trại và +10% lượng tài nguyên thu thập.'}};
export const cosmeticCatalog=[
 {id:'frame-default',type:'frame',name:'Thanh Vân',className:'frame-default'},
 {id:'frame-jade',type:'frame',name:'Ngọc Lân',className:'frame-jade'},
 {id:'frame-imperial',type:'frame',name:'Thiên Tử',className:'frame-imperial'},
 {id:'frame-celestial',type:'frame',name:'Hồng Mông',className:'frame-celestial'},
 {id:'chat-default',type:'chat',name:'Giấy Thanh Vân',className:'chat-default'},
 {id:'chat-gold',type:'chat',name:'Kim Long Chiếu',className:'chat-gold'},
 {id:'chat-celestial',type:'chat',name:'Ngũ Sắc Thiên Thư',className:'chat-celestial'},
 ...castleSkins.map(c=>({id:c.id,type:'city',name:c.name,className:c.id})),
];
export const bagCatalog={
 gearTicket:{name:'Vé gacha trang bị',icon:'⚒',text:'Một lượt gacha trang bị riêng; có bảo hiểm SSR ở lượt 30.'},
 petGachaPoint:{name:'Điểm gacha linh thú',icon:'♧',text:'Chỉ nhận từ bảo rương VIP. Một điểm đổi một lượt gacha thú cưng; không đổi từ ngọc hoặc tài nguyên.'},
 resourcePack:{name:'Rương tài nguyên',icon:'▣',text:'Nhận 1.000 lương, gỗ và đá.'},
 xpTome:{name:'Binh thư kinh nghiệm',icon:'▤',text:'Thêm 500 EXP cho một tướng sở hữu.'},
 speedup:{name:'Lệnh tăng tốc 10 giây',icon:'⌛',text:'Giảm 10 giây xây dựng hoặc huấn luyện đang chờ.'},
 petFood:{name:'Linh quả',icon:'♧',text:'Nâng thú cưng, mỗi cấp cần 5 × cấp linh quả.'},
 summonTicket:{name:'Vé chiêu mộ',icon:'✦',text:'Một lượt quay miễn phí; dùng tại Đài chiêu mộ.'},
 ssrUniversal:{name:'Mảnh SSR vạn năng',icon:'◈',text:'Dùng cùng mảnh riêng để tăng sao SSR, tối đa 7 sao.'},
};
const accountInt=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
const accountPlain=v=>v&&typeof v==='object'&&!Array.isArray(v);
const accountText=(v,max)=>typeof v==='string'&&v.trim().length>0&&v.length<=max&&!/[\u0000-\u001f<>]/.test(v);
export function levelXPRequired(level){return 60+20*level;}
export function totalXPAtLevel(level){let sum=0;for(let n=1;n<Math.min(100,level);n++)sum+=levelXPRequired(n);return sum;}
export function playerProgress(state){let xp=state.account?.totalXP||0,level=1;while(level<100&&xp>=levelXPRequired(level)){xp-=levelXPRequired(level);level++;}return{level,xp:level===100?0:xp,required:level===100?0:levelXPRequired(level),total:state.account?.totalXP||0};}
export function vipLevel(state){const points=state.account?.vipPoints||0;let level=0;for(let n=1;n<=15;n++)if(points>=vipThresholds[n])level=n;return level;}
export function vipBonuses(state,preview=null){const level=preview??vipLevel(state);return{march:level*.025,gather:level*.03,construction:level*.04,training:level*.02,production:level*.02,defense:level*.004,freeBuildSeconds:level*1.5};}
export function petBonus(state){const id=state.account?.activePet,pet=petCatalog.find(p=>p.id===id),level=state.account?.pets?.[id]||0,star=state.account?.petStars?.[id]||1;if(!pet||!level)return{};return{[pet.bonus]:pet.rate*level*(1+.15*(star-1)),...(star===5?{awakened:id,...({qilin:{production:pet.rate*level*1.6+.1,gatherYield:.25},pixiu:{gather:pet.rate*level*1.6,loot:.15,gatherYield:.1}}[id]||{})}:{})};}
export function normalizeAccount(source){const s=initInheritance(initMailbox(initWorld(initChronicle(normalizeProgression(source)))));s.campaign??={unlocked:1,cleared:0,lastStage:1,runs:0,autoAdvance:false,autoReplay:false};s.account??={name:'Quân vương',avatar:s.team[0]||'zhaoyun',totalXP:0,vipPoints:0,claimedLevel:[],claimedVip:[],bag:{gearTicket:0,petGachaPoint:0,resourcePack:2,xpTome:2,speedup:3,petFood:10,summonTicket:0,ssrUniversal:0},shards:{},stars:{},pets:{},petStars:{},petShards:{},gearPity:0,gearPulls:0,petPulls:0,activePet:null,cosmetics:['frame-default','chat-default','city-default'],equipped:{frame:'frame-default',chat:'chat-default',city:'city-default'},realm:{faction:null,city:null},messages:[]};s.account.realm??={faction:null,city:null};s.account.petStars??=Object.fromEntries(Object.keys(s.account.pets).map(id=>[id,1]));s.account.petShards??={};s.account.gearPity??=0;s.account.gearPulls??=0;s.account.petPulls??=0;for(const id of ['gearTicket','petGachaPoint'])s.account.bag[id]??=0;return initRunes(s);}
export function validAccount(state){
 if(!validChronicle(state)||!validWorld(state)||!validMailbox(state)||!validRunes(state)||!validInheritance(state))return false;
 if(state.campaign!==undefined){const c=state.campaign;if(!accountPlain(c)||!accountInt(c.cleared,0,999)||c.unlocked!==Math.min(999,c.cleared+1)||!accountInt(c.lastStage,1,c.unlocked)||!accountInt(c.runs,0,1000000000)||typeof c.autoAdvance!=='boolean'||typeof c.autoReplay!=='boolean')return false;}
 const a=state.account;if(a===undefined)return true;
 if(!accountPlain(a)||!accountText(a.name,24)||!state.owned.includes(a.avatar)||!accountInt(a.totalXP,0,totalXPAtLevel(100))||!accountInt(a.vipPoints,0,60000))return false;
 if(a.realm!==undefined&&(!accountPlain(a.realm)||!(a.realm.faction===null&&a.realm.city===null||Object.hasOwn(realmFactions,a.realm.faction)&&realmCities.some(c=>c.id===a.realm.city&&c.faction===a.realm.faction))))return false;

 const p=playerProgress(state),v=vipLevel(state);
 for(const [key,max,isValid]of [['claimedLevel',20,n=>n%5===0&&n>=5&&n<=p.level],['claimedVip',15,n=>n>=1&&n<=v]])if(!Array.isArray(a[key])||a[key].length>max||new Set(a[key]).size!==a[key].length||!a[key].every(n=>Number.isInteger(n)&&isValid(n)))return false;
 if(!accountPlain(a.bag)||Object.keys(a.bag).length!==Object.keys(bagCatalog).length||!Object.keys(bagCatalog).every(k=>accountInt(a.bag[k],0,999999)))return false;
 for(const [key,max]of [['shards',999999],['stars',7]])if(!accountPlain(a[key])||!Object.entries(a[key]).every(([id,n])=>Object.hasOwn(characterById,id)&&accountInt(n,0,max)&&(key!=='stars'||state.owned.includes(id))))return false;
 if(!accountPlain(a.pets)||!Object.entries(a.pets).every(([id,n])=>petCatalog.some(p=>p.id===id)&&accountInt(n,1,20))||(a.activePet!==null&&(!petCatalog.some(p=>p.id===a.activePet)||!Object.hasOwn(a.pets,a.activePet))))return false;
 for(const [key,max]of [['petStars',5],['petShards',999999]])if(!accountPlain(a[key])||!Object.entries(a[key]).every(([id,n])=>petCatalog.some(p=>p.id===id)&&accountInt(n,key==='petStars'?1:0,max)&&(key!=='petStars'||Boolean(a.pets[id]))))return false;
 if(!Object.keys(a.pets).every(id=>accountInt(a.petStars[id],1,5))||!accountInt(a.gearPity,0,29)||!accountInt(a.gearPulls,0,1000000000)||!accountInt(a.petPulls,0,1000000000))return false;
 if(!Array.isArray(a.cosmetics)||a.cosmetics.length>cosmeticCatalog.length||new Set(a.cosmetics).size!==a.cosmetics.length||!a.cosmetics.every(id=>cosmeticCatalog.some(c=>c.id===id))||!accountPlain(a.equipped)||!['frame','chat','city'].every(type=>a.cosmetics.includes(a.equipped[type])&&cosmeticCatalog.some(c=>c.id===a.equipped[type]&&c.type===type)))return false;
 return Array.isArray(a.messages)&&a.messages.length<=20&&a.messages.every(m=>accountPlain(m)&&accountText(m.text,180)&&cosmeticCatalog.some(c=>c.id===m.frame&&c.type==='chat'));
}
// Mutates only a newly cloned state or explicit simulation result.
export function awardPlayerXP(state,amount){if(!Number.isInteger(amount)||amount<0)throw new Error('EXP không hợp lệ.');if(!state.account)state.account=normalizeAccount(state).account;const before=playerProgress(state).level;state.account.totalXP=Math.min(totalXPAtLevel(100),state.account.totalXP+amount);const after=playerProgress(state).level;for(let level=before+1;level<=after;level++)state.account.vipPoints=Math.min(60000,state.account.vipPoints+100+level*10);return state;}
export function milestoneReward(level){
 if(!accountInt(level,5,100)||level%5)throw new Error('Mốc cấp không hợp lệ.');
 const tier=level/5,high=level>=50;
 return{runePoints:runePointsForMilestone(level),coins:100+50*tier,resources:300*tier,essence:10*tier,bag:{resourcePack:tier,xpTome:Math.ceil(tier/2),speedup:Math.ceil(tier/2),petFood:tier*2,gearTicket:Math.ceil(tier/2),...(high?{summonTicket:5+Math.floor((level-50)/5)}:{})},ssr:level>=60,gear:high?['celestial-crown','celestial-mail','celestial-blade','celestial-pendant','celestial-relic'][(tier-10)%5]:null,cosmetics:high?[level>=80?'frame-celestial':'frame-jade',level>=80?'chat-celestial':'chat-gold',level>=80?'city-celestial':'city-jade']:[],pet:null};
}
export function vipReward(level){
 if(!accountInt(level,1,15))throw new Error('Cấp VIP không hợp lệ.');
 return{coins:500+200*level,resources:2000*level,essence:100*level,bag:{petGachaPoint:3+Math.ceil(level/2),gearTicket:3+level,summonTicket:5+2*level,ssrUniversal:15+5*level,petFood:10*level,resourcePack:3*level,xpTome:2*level,speedup:2*level},shards:10+5*level,hero:level%3===0?vipExclusiveIds[level/3-1]:null,gear:'celestial-'+['crown','mail','blade','pendant','relic'][(level-1)%5],gearLevel:Math.min(10,Math.ceil(level/2)+2),cosmetics:[...(level>=10?['frame-celestial','chat-celestial','city-celestial']:level>=5?['frame-imperial','chat-gold','city-gold']:['frame-jade']),...(level>=13?['city-vip'+level]:[])]};
}
function accountOwnHero(s,id){if(!s.owned.includes(id)){s.owned.push(id);s.heroLevels[id]=1;s.heroXP[id]=80;s.skillLevels[id]=1;}else s.account.shards[id]=Math.min(999999,(s.account.shards[id]||0)+40);}
function accountPick(pool,random){const value=random();if(!Number.isFinite(value)||value<0||value>=1)throw new Error('Kết quả quay không hợp lệ.');return pool[Math.floor(value*pool.length)];}
function accountReward(s,reward,random){
 const gearCount=(reward.gear?1:0)+(reward.hero?1:0);
 if(s.nextItemId+gearCount>=999999999)throw new Error('Đã hết mã trang bị.');
 s.coins=Math.min(Number.MAX_SAFE_INTEGER,s.coins+reward.coins);s.essence=Math.min(999999,s.essence+reward.essence);
 for(const k of ['food','wood','stone'])s.resources[k]=Math.min(999999,s.resources[k]+reward.resources);
 for(const [k,n]of Object.entries(reward.bag))s.account.bag[k]=Math.min(999999,s.account.bag[k]+n);
 for(const id of reward.cosmetics)if(!s.account.cosmetics.includes(id))s.account.cosmetics.push(id);
 if(reward.pet)s.account.pets[reward.pet]??=1;
 const regularSSR=characterRoster.filter(h=>h.grade==='SSR'&&!h.vipExclusive);
 const result={...reward};
 if(reward.ssr){const h=accountPick(regularSSR,random);accountOwnHero(s,h.id);result.ssrId=h.id;}
 if(reward.shards){const h=accountPick(regularSSR,random);s.account.shards[h.id]=Math.min(999999,(s.account.shards[h.id]||0)+reward.shards);result.shardId=h.id;}
 if(reward.hero)accountOwnHero(s,reward.hero);
 for(const templateId of [reward.gear,reward.hero?'signature-'+reward.hero:null].filter(Boolean))s.inventory.push({id:'item-'+s.nextItemId++,templateId,level:reward.gearLevel||1});
 return result;
}
export function claimMilestone(state,level,random=Math.random){const s=normalizeAccount(state);if(playerProgress(s).level<level||s.account.claimedLevel.includes(level))throw new Error('Chưa đạt mốc hoặc đã nhận quà.');const reward=accountReward(s,milestoneReward(level),random);awardRunePoints(s,level);s.account.claimedLevel.push(level);return{state:s,reward};}
export function claimVipGift(state,level,random=Math.random){const s=normalizeAccount(state);if(vipLevel(s)<level||s.account.claimedVip.includes(level))throw new Error('Chưa đạt VIP hoặc đã nhận quà.');const reward=accountReward(s,vipReward(level),random);s.account.claimedVip.push(level);return{state:s,reward};}
export function updateProfile(state,name,avatar){if(!accountText(name,24)||!state.owned.includes(avatar))throw new Error('Tên cần 1–24 ký tự và avatar phải là tướng sở hữu.');const s=normalizeAccount(state);s.account.name=name.trim();s.account.avatar=avatar;return s;}
export function equipCosmetic(state,id){const s=normalizeAccount(state),c=cosmeticCatalog.find(c=>c.id===id);if(!c||!s.account.cosmetics.includes(id))throw new Error('Chưa sở hữu ngoại trang.');s.account.equipped[c.type]=id;return s;}
export function sendLocalMessage(state,text){if(!accountText(text,180))throw new Error('Tin nhắn cần 1–180 ký tự.');const s=normalizeAccount(state);s.account.messages.push({text:text.trim(),frame:s.account.equipped.chat});s.account.messages=s.account.messages.slice(-20);return s;}
export function useBagItem(state,id,target=null,now=Date.now()){
 const s=normalizeAccount(state);if(!Object.hasOwn(bagCatalog,id)||!s.account.bag[id])throw new Error('Không đủ vật phẩm.');
 if(id==='resourcePack'){for(const key of ['food','wood','stone'])s.resources[key]=Math.min(999999,s.resources[key]+1000);}
 else if(id==='xpTome'){if(!s.owned.includes(target))throw new Error('Chọn một tướng sở hữu.');if(s.march||s.worldAI?.expedition||s.battle&&!s.battle.winner)throw new Error('Chờ đạo quân trở về.');s.heroXP[target]=Math.min(1000000,s.heroXP[target]+500);}
 else if(id==='speedup'){const job=target==='training'?s.training:target==='construction'?s.construction:null;if(!job)throw new Error('Chọn hàng đợi đang chạy.');job.endsAt=Math.max(now,job.endsAt-10000);}
 else throw new Error('Dùng vật phẩm này tại Chiêu mộ, Thú cưng hoặc Tăng sao SSR.');
 s.account.bag[id]--;return s;
}
export function setActivePet(state,id){const s=normalizeAccount(state);if(s.march||s.worldAI?.expedition||s.battle&&!s.battle.winner)throw new Error('Chờ đạo quân trở về để đổi thú cưng.');if(!petCatalog.some(p=>p.id===id)||!Object.hasOwn(s.account.pets,id))throw new Error('Chưa sở hữu thú cưng.');s.account.activePet=id;return s;}
export function levelUpPet(state,id){const s=normalizeAccount(state),level=s.account.pets[id];if(s.march||s.worldAI?.expedition||s.battle&&!s.battle.winner)throw new Error('Chờ đạo quân trở về.');if(!Number.isInteger(level)||level>=20||s.account.bag.petFood<level*5)throw new Error('Chưa đủ linh quả hoặc đã đạt cấp 20.');s.account.bag.petFood-=level*5;s.account.pets[id]++;return s;}
export function upgradeSSRStar(state,id){const s=normalizeAccount(state),h=characterById[id],star=s.account.stars[id]||0,cost=20*(star+1),specific=s.account.shards[id]||0;if(s.march||s.worldAI?.expedition||s.battle&&!s.battle.winner)throw new Error('Chờ đạo quân trở về.');if(!h||!s.owned.includes(id)||star>=7||specific+(h.grade==='SSR'?s.account.bag.ssrUniversal:0)<cost)throw new Error('Cần tướng đã sở hữu và đủ mảnh để tăng sao.');const take=Math.min(specific,cost);s.account.shards[id]=specific-take;s.account.bag.ssrUniversal-=cost-take;s.account.stars[id]=star+1;return s;}
export function salvageGear(state,id){const s=normalizeAccount(state),item=s.inventory.find(i=>i.id===id);if(s.march||s.worldAI?.expedition||s.battle&&!s.battle.winner)throw new Error('Chờ đạo quân trở về.');if(!item||equipmentOwner(s,id))throw new Error('Tháo trang bị khỏi nhân vật trước khi phân giải.');s.inventory=s.inventory.filter(i=>i.id!==id);s.essence=Math.min(999999,s.essence+10*item.level);return s;}

export function upgradePetStar(state,id){const s=normalizeAccount(state),star=s.account.petStars[id],cost=(star||1)*20;if(s.march||s.worldAI?.expedition||s.battle&&!s.battle.winner)throw new Error('Chờ đạo quân trở về.');if(!Number.isInteger(star)||star>=5||(s.account.petShards[id]||0)<cost)throw new Error('Chưa đủ mảnh linh thú hoặc đã đạt 5 sao.');s.account.petShards[id]-=cost;s.account.petStars[id]++;return s;}
export function drawPets(state,count=1,random=Math.random){if(![1,10].includes(count))throw new Error('Chọn 1 hoặc 10 lượt.');const s=normalizeAccount(state);if(s.account.bag.petGachaPoint<count)throw new Error('Chưa đủ điểm gacha linh thú. Chỉ quà VIP mới tặng điểm này.');s.account.bag.petGachaPoint-=count;const results=[];for(let i=0;i<count;i++){const pet=accountPick(petCatalog,random),duplicate=Boolean(s.account.pets[pet.id]);if(duplicate)s.account.petShards[pet.id]=Math.min(999999,(s.account.petShards[pet.id]||0)+20);else{s.account.pets[pet.id]=1;s.account.petStars[pet.id]=1;}s.account.petPulls++;results.push({...pet,duplicate});}return{state:s,results};}
export function drawEquipment(state,count=1,random=Math.random,payment='coins'){if(![1,10].includes(count)||!['coins','tickets'].includes(payment))throw new Error('Lượt quay không hợp lệ.');const s=normalizeAccount(state);if(payment==='tickets'?s.account.bag.gearTicket<count:s.coins<count*150)throw new Error('Cần vé trang bị hoặc 150 ngọc mỗi lượt.');if(s.nextItemId+count>=999999999)throw new Error('Đã hết mã trang bị.');if(payment==='tickets')s.account.bag.gearTicket-=count;else s.coins-=count*150;const results=[],weights=[.01,.03,.06,.1,.2,.25,.2,.15];for(let i=0;i<count;i++){let grade='SSR';if(s.account.gearPity!==29){const value=random();if(!Number.isFinite(value)||value<0||value>=1)throw new Error('Kết quả quay không hợp lệ.');let sum=0;grade=gradeOrder.find((_,n)=>(sum+=weights[n])>value)||'D';}const pool=itemTemplates.filter(t=>t.grade===grade&&!t.heroId),t=accountPick(pool,random),item={id:'item-'+s.nextItemId++,templateId:t.id,level:1};s.inventory.push(item);s.account.gearPity=grade==='SSR'?0:s.account.gearPity+1;s.account.gearPulls++;results.push({...t,instanceId:item.id});}return{state:s,results};}
