// Offline research: persistent ranks, immediate material costs, no real-time service.
export const technologyCatalog=[
 {id:'infantry-arms',name:'Rèn binh khí',branch:'infantry',stat:'attack',step:.03,icon:1,gate:1},
 {id:'infantry-armor',name:'Giáp trận tinh luyện',branch:'infantry',stat:'defense',step:.04,icon:9,gate:1},
 {id:'infantry-march',name:'Hành quân thần tốc',branch:'infantry',stat:'march',step:.04,icon:5,gate:1},
 {id:'city-arms',name:'Hỏa lực công thành',branch:'city',stat:'attack',step:.025,icon:2,gate:5},
 {id:'city-walls',name:'Thành đồng vách sắt',branch:'city',stat:'defense',step:.03,icon:3,gate:5},
 {id:'city-vitality',name:'Hậu cần chiến tuyến',branch:'city',stat:'health',step:.03,icon:8,gate:5},
 {id:'work-planning',name:'Điều phối nhân công',branch:'production',stat:'labor',step:.03,icon:5,gate:1},
 {id:'ration-saving',name:'Dưỡng dân tiết lương',branch:'production',stat:'foodSaving',step:.03,icon:8,gate:1},
 {id:'production-tools',name:'Công cụ tinh luyện',branch:'production',stat:'productionTime',step:.025,icon:1,gate:3},
 {id:'double-harvest',name:'Phong điều vũ thuận',branch:'production',stat:'doubleHarvest',step:.02,icon:14,gate:5},
];
export function initTechnology(s){s.technology??={ranks:{}};return s;}
export function technologyCost(node,rank){const n=rank+1,m=node.branch==='city'?2:1;return{food:300*n*n*m,wood:240*n*n*m,stone:180*n*n*m};}
export function validTechnology(s){const t=s.technology;return t===undefined||!!(t&&typeof t==='object'&&!Array.isArray(t)&&t.ranks&&typeof t.ranks==='object'&&!Array.isArray(t.ranks)&&Object.entries(t.ranks).every(([id,n])=>technologyCatalog.some(x=>x.id===id)&&Number.isInteger(n)&&n>=0&&n<=10));}
export function technologyBonus(s,branch,stat){return technologyCatalog.filter(n=>n.branch===branch&&n.stat===stat).reduce((sum,n)=>sum+n.step*(s.technology?.ranks[n.id]||0),0);}
export function researchTechnology(state,id){const s=initTechnology(structuredClone(state)),node=technologyCatalog.find(n=>n.id===id);if(!node)throw new Error('Kĩ thuật không tồn tại.');const rank=s.technology.ranks[id]||0;if(s.march||s.worldAI?.expedition||s.battle&&!s.battle.winner)throw new Error('Chờ đạo quân trở về trước khi nghiên cứu.');if(rank>=10||s.levels.hall<node.gate+rank*5)throw new Error('Cần nâng Đại điện hoặc đã đạt tối đa.');const cost=technologyCost(node,rank);if(Object.entries(cost).some(([k,n])=>s.resources[k]<n))throw new Error('Chưa đủ vật tư nghiên cứu.');for(const[k,n]of Object.entries(cost))s.resources[k]-=n;s.technology.ranks[id]=rank+1;return s;}
