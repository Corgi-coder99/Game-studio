import {characterById} from './characters.mjs';
import {getCharacterStats} from './progression.mjs';
import {bonds} from './kingdom.mjs';
export const battlePlans={balanced:{name:'Cân bằng · Vượt ải',text:'Ưu tiên tiền tuyến vững, hồi phục và sát thương nhiều mục tiêu.'},boss:{name:'BOSS · Đơn mục tiêu',text:'Ưu tiên sát thương duy trì, tốc đánh và hỗ trợ sống sót.'},siege:{name:'Công thành · Diện rộng',text:'Ưu tiên chống chịu, phá hàng đầu và kỹ năng đánh nhiều địch.'},backline:{name:'Phá hậu tuyến',text:'Ưu tiên sát thủ, chí mạng và áp lực lên tướng yếu máu.'}};
export function recommendFormation(s,plan='balanced'){
 if(!battlePlans[plan])plan='balanced';
 const chosen=[],reasons={};
 const score=h=>{const st=getCharacterStats(s,h.id);let value=st.physicalAtk*2+st.magicAtk*2+st.maxHp*.08+st.armor+st.resist+st.attackSpeed*25;
  if(plan==='boss')value+=st.physicalAtk*1.5+st.attackSpeed*40+(h.roles.includes('archer')?70:0);
  if(plan==='siege'||plan==='balanced')value+=h.skills.some(a=>a.operations?.some(o=>['enemyAll','enemyFront','enemyColumn'].includes(o.target)))?70:0;
  if(plan==='backline')value+=(h.roles.includes('assassin')?240:0)+st.crit*200;
  for(const b of bonds)if(b.ids.includes(h.id))value+=b.ids.filter(id=>chosen.includes(id)).length*75;
  return value;};
 function pick(predicate,reason){const pool=s.owned.map(id=>characterById[id]).filter(h=>h&&!chosen.includes(h.id)&&predicate(h)).sort((a,b)=>score(b)-score(a)||a.id.localeCompare(b.id));if(pool[0]){chosen.push(pool[0].id);reasons[pool[0].id]=reason;}}
 pick(h=>h.roles.includes('tank'),'Chống chịu, giữ hàng đầu');
 pick(h=>h.roles.includes('support'),'Hồi phục hoặc bảo vệ toàn đội');
 if(plan==='backline')pick(h=>h.roles.includes('assassin'),'Áp lực hậu tuyến địch');
 while(chosen.length<Math.min(5,s.owned.length)){const n=chosen.length;pick(()=>true,'Sát thương và phối hợp theo chỉ số hiện tại');if(n===chosen.length)break;}
 const formation=Array(9).fill(null);
 const sorted=chosen.slice().sort((a,b)=>Number(characterById[b].roles.includes('tank'))-Number(characterById[a].roles.includes('tank')));
 for(const id of sorted){const h=characterById[id];const rows=h.roles.includes('tank')?[0,1,2]:h.roles.includes('support')||h.roles.includes('archer')?[2,1,0]:h.roles.includes('fighter')?[0,1,2]:[1,2,0];for(const row of rows){const slot=[0,1,2].map(c=>row*3+c).find(i=>!formation[i]);if(slot!==undefined){formation[slot]=id;break;}}}
 return{plan,formation,reasons,bonds:bonds.filter(b=>b.ids.filter(id=>chosen.includes(id)).length>=(b.required||b.ids.length))};
}
