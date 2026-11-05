export const timeGiftMinutes=[1,5,15,30,60,120,240,480,1440];
export const titleCatalog={victor100:'Bách Chiến Bách Thắng',unyielding100:'Bất Khuất',conqueror:'Thiên Mệnh Cửu Cực',botLord:'Chinh Phục Quần Hùng',harvester:'Kho Lẫm Thiên Hạ',veteran:'Người Gác Thành'};
export const questCatalog=[
 {id:'campaign-1',name:'Bước đầu chinh chiến',metric:'campaign',target:1,resource:600},
 {id:'campaign-10',name:'Phá mười cửa ải',metric:'campaign',target:10,resource:1800,skin:'city-bamboo'},
 {id:'campaign-100',name:'Trăm ải anh hùng',metric:'campaign',target:100,resource:8000},
 {id:'campaign-999',name:'Cửu châu quy nhất',metric:'campaign',target:999,resource:90000,title:'conqueror'},
 {id:'wins-10',name:'Mười chiến thắng',metric:'wins',target:10,resource:2000},
 {id:'wins-100',name:'Bách chiến thành danh',metric:'wins',target:100,resource:12000,skin:'city-phoenix'},
 {id:'streak-win-10',name:'Khí thế như hồng',metric:'bestWinStreak',target:10,resource:3000},
 {id:'streak-win-100',name:'Thắng liên tiếp 100 trận',metric:'bestWinStreak',target:100,resource:40000,title:'victor100'},
 {id:'streak-loss-10',name:'Thất bại là mẹ thành công',metric:'bestLossStreak',target:10,resource:3000},
 {id:'streak-loss-100',name:'Thua liên tiếp 100 trận, vẫn đứng dậy',metric:'bestLossStreak',target:100,resource:40000,title:'unyielding100'},
 {id:'bot-1',name:'Chạm trán quần hùng',metric:'botWins',target:1,resource:1500},
 {id:'bot-10',name:'Mở mang bờ cõi',metric:'botWins',target:10,resource:6000,skin:'city-tortoise'},
 {id:'bot-100',name:'Bá chủ quần hùng',metric:'botWins',target:100,resource:25000,title:'botLord'},
 {id:'gather-5',name:'Tích lương dựng nghiệp',metric:'gathers',target:5,resource:2000},
 {id:'gather-50',name:'Kho lẫm thiên hạ',metric:'gathers',target:50,resource:20000,title:'harvester'},
 {id:'teleport-3',name:'Hành giả thời không',metric:'teleports',target:3,resource:3000},
 {id:'build-5',name:'Thành cao hào sâu',metric:'builds',target:5,resource:5000},
 {id:'train-10',name:'Tinh binh cường quốc',metric:'trainings',target:10,resource:4000},
 {id:'play-day',name:'Một ngày giữ thành',metric:'onlineSeconds',target:86400,resource:20000,title:'veteran'},
];
export function initChronicle(s){s.chronicle??={onlineSeconds:0,claimedTime:[],claimedQuests:[],titles:[],equippedTitle:null,stats:{winStreak:0,lossStreak:0,bestWinStreak:0,bestLossStreak:0,losses:0,botWins:0,gathers:0,teleports:0,builds:0,trainings:0}};return s;}
export function registerBattle(s,won,bot=false){initChronicle(s);const st=s.chronicle.stats;if(won){st.winStreak++;st.lossStreak=0;st.bestWinStreak=Math.max(st.bestWinStreak,st.winStreak);if(bot)st.botWins++;}else{st.lossStreak++;st.winStreak=0;st.losses++;st.bestLossStreak=Math.max(st.bestLossStreak,st.lossStreak);}return s;}
export function questProgress(s,q){return q.metric==='campaign'?s.campaign?.cleared||0:q.metric==='wins'?s.wins:q.metric==='onlineSeconds'?s.chronicle?.onlineSeconds||0:s.chronicle?.stats[q.metric]||0;}
export function timeGiftReward(minutes){if(!timeGiftMinutes.includes(minutes))throw new Error('Mốc thời gian không hợp lệ.');return{food:300+minutes*30,wood:300+minutes*30,stone:150+minutes*20};}
function chronicleGrant(s,reward){for(const k of ['food','wood','stone'])s.resources[k]=Math.min(9999999,s.resources[k]+reward[k]);}
export function claimTimeGift(state,minutes){const s=initChronicle(structuredClone(state));if(!timeGiftMinutes.includes(minutes)||s.chronicle.onlineSeconds<minutes*60||s.chronicle.claimedTime.includes(minutes))throw new Error('Chưa đủ thời gian chơi hoặc đã nhận quà.');chronicleGrant(s,timeGiftReward(minutes));s.chronicle.claimedTime.push(minutes);return s;}
export function claimQuest(state,id){const s=initChronicle(structuredClone(state)),q=questCatalog.find(q=>q.id===id);if(!q||questProgress(s,q)<q.target||s.chronicle.claimedQuests.includes(id))throw new Error('Chưa hoàn thành hoặc đã nhận thưởng.');chronicleGrant(s,{food:q.resource,wood:q.resource,stone:Math.round(q.resource*.7)});s.coins+=Math.round(q.resource*.05);if(q.title&&!s.chronicle.titles.includes(q.title))s.chronicle.titles.push(q.title);if(q.skin&&!s.account.cosmetics.includes(q.skin))s.account.cosmetics.push(q.skin);s.chronicle.claimedQuests.push(id);return s;}
export function equipTitle(state,id){const s=initChronicle(structuredClone(state));if(id!==''&&!s.chronicle.titles.includes(id))throw new Error('Chưa sở hữu danh hiệu.');s.chronicle.equippedTitle=id||null;return s;}
export function validChronicle(s){const c=s.chronicle;if(c===undefined)return true;const obj=v=>v&&typeof v==='object'&&!Array.isArray(v),integer=n=>Number.isInteger(n)&&n>=0&&n<=1000000000;if(!obj(c)||!Number.isFinite(c.onlineSeconds)||c.onlineSeconds<0||c.onlineSeconds>1000000000||!obj(c.stats)||!['winStreak','lossStreak','bestWinStreak','bestLossStreak','losses','botWins','gathers','teleports','builds','trainings'].every(k=>integer(c.stats[k])))return false;for(const [key,test]of [['claimedTime',n=>timeGiftMinutes.includes(n)&&c.onlineSeconds>=n*60],['claimedQuests',id=>questCatalog.some(q=>q.id===id&&questProgress(s,q)>=q.target)],['titles',id=>Object.hasOwn(titleCatalog,id)]])if(!Array.isArray(c[key])||new Set(c[key]).size!==c[key].length||!c[key].every(test))return false;return c.equippedTitle===null||c.titles.includes(c.equippedTitle);}
