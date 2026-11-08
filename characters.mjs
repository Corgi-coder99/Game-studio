export const gradeOrder = ['SSR','SSS','SS','S','A','B','C','D'];
export const gradeColors = { SSR:'#bdf8ff', SSS:'#ffb43b', SS:'#ffd34e', S:'#ff535b', A:'#ff983d', B:'#bd85ff', C:'#2456b8', D:'#61cf71' };
export const gradePaints={SSR:'linear-gradient(115deg,#ff536e,#ffcf4e,#62e1a6,#55c8ff,#ba83ff)',SSS:'linear-gradient(115deg,#c92137,#ff5f47,#ffd65a,#b27b12)',SS:'#ffd34e',S:'#ff535b',A:'#ff983d',B:'#bd85ff',C:'#2456b8',D:'#61cf71'};
export const archetypeLabels={fighter:'Fighter',tank:'Tank',assassin:'Assassin',support:'Support',mage:'Mage',archer:'Archer'};
export const effectDescriptions={block:'Blocks up to 70% of damage after defense.',reflect:'Reflects up to 50% of health actually lost; reflected damage cannot chain.',lifesteal:'Restores up to 50% of damage actually dealt, capped by maximum health.',regen:'Regenerates health each second while below 50% health.',revive:'Revives once per battle with 30% maximum health.',execute:'Executes targets below 10% health unless protected by damage immunity or invincibility.',heal:'Restores health; burning reduces healing received.',burn:'Deals magic damage over time and reduces healing by 50%.',stun:'Prevents normal attacks and skills for the stun duration.',slow:'Reduces attack speed by 35%.',manaLock:'Reduces mana regeneration by 50%; does not affect rage.',immune:'Prevents damage but does not block negative status effects.',invincible:'Clears and blocks negative effects and prevents damage; the hero cannot attack or deal damage.',shield:'Shields do not stack: capped at 30% of the caster’s maximum health or 15% of another recipient’s.',exposed:'Reduces physical resistance by 25%.',marked:'Increases damage received by 25%.',boost:'Increases physical and magic attack by 20%.'};

const D=(target,scale,damageType='physical')=>({effect:'damage',target,scale,damageType});
const E=(effect,target,duration=4,value=0)=>({effect,target,duration,value});
const H=(target,value)=>({effect:'heal',target,value});
const S=(target,value)=>({effect:'shield',target,value,duration:6});
// Weapons and signature moves are original game adaptations of literary/historical motifs.
const rows = [
 ['wukong','Tôn Ngộ Không','SSR',['fighter','assassin'],'Tây Du','Hỏa','Như Ý Kim Cô Bổng','Đại Náo Thiên Cung',[D('enemyAll',1.3),D('enemyWeak',1.4),E('immune','self',2)],{lifesteal:.2,revive:true}],
 ['guanyu','Quan Vũ','SSR',['fighter','tank'],'Tam Quốc','Mộc','Thanh Long Yển Nguyệt Đao','Thanh Long Trảm',[D('enemyFront',2.1),E('exposed','enemyFront',5)],{block:.2,execute:true}],
 ['nezha','Na Tra','SS',['mage','fighter'],'Phong Thần','Hỏa','Hỏa Tiêm Thương và Phong Hỏa Luân','Tam Đầu Lục Tý',[D('enemyAll',1.3,'magic'),E('burn','enemyAll',4,.18),E('slow','enemyAll',3)],{revive:true}],
 ['zhugeliang','Gia Cát Lượng','SSS',['support','mage'],'Tam Quốc','Thủy','Bạch Vũ Phiến','Bát Trận Đồ',[H('allyAll',.24),S('allyAll',.18),E('boost','allyAll',4)],{regen:.02}],
 ['erlang','Dương Tiễn','SSS',['assassin','mage'],'Phong Thần','Thủy','Tam Tiêm Lưỡng Nhận Đao','Thiên Nhãn Khai Quang',[D('enemyBack',2.8,'magic'),E('marked','enemyBack',5)],{execute:true}],
 ['zhaoyun','Triệu Vân','S',['fighter','assassin'],'Tam Quốc','Mộc','Long Đảm Lượng Ngân Thương','Thất Tiến Thất Xuất',[D('enemyWeak',.95),D('enemyWeak',.95),D('enemyWeak',.95),S('self',.3)],{lifesteal:.12}],
 ['bajie','Trư Bát Giới','A',['tank','support'],'Tây Du','Thủy','Cửu Xỉ Đinh Ba','Thiên Bồng Hộ Trận',[D('enemyFront',1.1),S('allyAll',.2),H('self',.3)],{block:.35,regen:.025},'rage'],
 ['diaochan','Điêu Thuyền','A',['support','mage'],'Tam Quốc','Mộc','Nguyệt Ảnh Phiến','Bế Nguyệt Liên Hoàn',[D('enemyAll',.9,'magic'),E('stun','enemyBack',1.8),H('weakAlly',.25)],{}],
 ['liubei','Lưu Bị','S',['support','fighter'],'Tam Quốc','Mộc','Thư Hùng Song Kiếm','Nhân Đức Phục Hưng',[H('allyAll',.2),E('boost','allyAll',5),S('weakAlly',.15)],{regen:.02}],
 ['zhangfei','Trương Phi','SS',['tank','fighter'],'Tam Quốc','Hỏa','Trượng Bát Xà Mâu','Trường Bản Hùng Uy',[D('enemyFront',1.8),E('stun','enemyFront',2),S('self',.3)],{block:.4,reflect:.2}],
 ['machao','Mã Siêu','S',['fighter','assassin'],'Tam Quốc','Mộc','Hổ Đầu Trạm Kim Thương','Tây Lương Đột Kích',[D('enemyColumn',2.2),E('slow','enemyColumn',4)],{lifesteal:.18}],
 ['huangzhong','Hoàng Trung','S',['archer'],'Tam Quốc','Mộc','Thiết Thai Cung','Bách Bộ Xuyên Dương',[D('enemyBack',2.6),E('exposed','enemyBack',5)],{execute:true}],
 ['lubu','Lữ Bố','SSS',['fighter','assassin'],'Tam Quốc','Hỏa','Phương Thiên Họa Kích','Vô Song Thiên Hạ',[D('enemyAll',1.5),D('enemyWeak',1.5)],{lifesteal:.3,reflect:.15}],
 ['caocao','Tào Tháo','SS',['support','tank'],'Tam Quốc','Thủy','Ỷ Thiên Kiếm','Thiên Hạ Quy Tâm',[E('manaLock','enemyAll',5),E('boost','allyAll',5),S('allyAll',.15)],{block:.2}],
 ['sunquan','Tôn Quyền','A',['support'],'Tam Quốc','Thủy','Bích Nhãn Bảo Kiếm','Giang Đông Cố Thủ',[S('allyAll',.15),H('weakAlly',.3),E('immune','weakAlly',2)],{}],
 ['zhouyu','Chu Du','SS',['mage','support'],'Tam Quốc','Hỏa','Hỏa Phượng Cầm','Xích Bích Hỏa Công',[D('enemyAll',1.5,'magic'),E('burn','enemyAll',5,.2)],{lifesteal:.15}],
 ['simayi','Tư Mã Ý','SSS',['mage','support'],'Tam Quốc','Thủy','Huyền Minh Trượng','Quỷ Mưu Thôn Phệ',[D('enemyAll',1.4,'magic'),E('manaLock','enemyAll',6),E('marked','enemyWeak',5)],{lifesteal:.3}],
 ['huatuo','Hoa Đà','S',['support'],'Tam Quốc','Mộc','Thanh Nang Dược Hạp','Thanh Nang Tế Thế',[H('allyAll',.3),E('immune','weakAlly',2)],{regen:.04}],
 ['zhangliao','Trương Liêu','A',['fighter','assassin'],'Tam Quốc','Thủy','Hoàng Long Câu Liêm Đao','Uy Chấn Tiêu Diêu',[D('enemyBack',2.1),E('stun','enemyBack',1.5)],{lifesteal:.1}],
 ['xuchu','Hứa Chử','A',['tank'],'Tam Quốc','Mộc','Hổ Si Đại Đao','Hổ Si Bất Khuất',[S('self',.3),E('immune','self',2),D('enemyFront',1.5)],{block:.45,reflect:.2}],
 ['dianwei','Điển Vi','A',['tank','fighter'],'Tam Quốc','Hỏa','Song Thiết Kích','Cổ Chi Ác Lai',[D('enemyFront',1.8),S('self',.3)],{reflect:.4,regen:.02}],
 ['sunshangxiang','Tôn Thượng Hương','S',['archer','assassin'],'Tam Quốc','Hỏa','Long Phụng Loan Cung','Kiêu Cơ Liên Xạ',[D('enemyBack',1.4),D('enemyWeak',1.4),E('slow','enemyBack',4)],{lifesteal:.15}],
 ['zhenji','Chân Cơ','A',['mage','support'],'Tam Quốc','Thủy','Lạc Thủy Huyền Cầm','Lạc Thần Phú',[D('enemyAll',1.1,'magic'),E('slow','enemyAll',5),H('allyAll',.12)],{}],
 ['huangyueying','Hoàng Nguyệt Anh','B',['support','archer'],'Tam Quốc','Mộc','Mộc Ngưu Cơ Nỏ','Bát Quái Cơ Quan',[D('enemyColumn',1.7),S('allyAll',.12)],{block:.1}],
 ['ganning','Cam Ninh','B',['assassin'],'Tam Quốc','Thủy','Cẩm Phàm Song Đao','Bách Kỵ Dạ Tập',[D('enemyBack',2.3),E('exposed','enemyBack',4)],{execute:true}],
 ['xuhuang','Từ Hoảng','B',['fighter','tank'],'Tam Quốc','Mộc','Khai Sơn Đại Phủ','Trường Khu Trực Nhập',[D('enemyFront',2),E('exposed','enemyFront',4)],{block:.25}],
 ['jiangwei','Khương Duy','B',['fighter','support'],'Tam Quốc','Thủy','Lục Trầm Thương','Cửu Phạt Trung Nguyên',[D('enemyColumn',1.6),E('boost','allyAll',3)],{lifesteal:.1}],
 ['pangtong','Bàng Thống','A',['mage','support'],'Tam Quốc','Hỏa','Phượng Sồ Liên Hoàn Phiến','Hỏa Phượng Liên Hoàn',[E('marked','enemyAll',4),D('enemyAll',1.1,'magic'),E('burn','enemyFront',4,.16)],{}],
 ['yujin','Vu Cấm','C',['tank'],'Tam Quốc','Thủy','Trấn Quân Trường Thương','Nghiêm Quân Thiết Bích',[S('allyAll',.12),E('slow','enemyFront',3)],{block:.25}],
 ['zhangbao','Trương Bào','C',['fighter'],'Tam Quốc','Hỏa','Hắc Thiết Xà Mâu','Hổ Tử Phá Quân',[D('enemyFront',1.8),E('stun','enemyFront',1)],{lifesteal:.1}],
 ['guanping','Quan Bình','C',['fighter','tank'],'Tam Quốc','Mộc','Thanh Long Hộ Đao','Trung Nghĩa Hộ Chủ',[D('enemyFront',1.6),S('weakAlly',.15)],{block:.2}],
 ['zhoucang','Chu Thương','D',['tank'],'Tam Quốc','Mộc','Hộ Chủ Đại Đao','Cận Vệ Thiết Tâm',[S('self',.28),S('weakAlly',.12)],{block:.3}],
 ['liaohua','Liêu Hóa','D',['fighter'],'Tam Quốc','Mộc','Thục Quân Trường Đao','Lão Tướng Xung Phong',[D('enemyFront',1.6),E('slow','enemyFront',3)],{regen:.02}],
 ['lusu','Lỗ Túc','B',['support'],'Tam Quốc','Thủy','Hòa Minh Ngọc Quyển','Liên Minh Hộ Trận',[H('allyAll',.16),S('allyAll',.12),E('manaLock','enemyWeak',4)],{}],
 ['redboy','Hồng Hài Nhi','SS',['mage'],'Tây Du','Hỏa','Hỏa Vân Thương','Tam Muội Chân Hỏa',[D('enemyAll',1.7,'magic'),E('burn','enemyAll',5,.25)],{lifesteal:.2}],
 ['shawujing','Sa Tăng','A',['tank','support'],'Tây Du','Thủy','Hàng Yêu Bảo Trượng','Lưu Sa Hộ Pháp',[S('allyAll',.15),E('stun','enemyFront',1.5)],{block:.4,regen:.02},'rage'],
 ['tangsanzang','Đường Tăng','S',['support'],'Tây Du','Mộc','Cửu Hoàn Tích Trượng','Từ Bi Phật Quang',[H('allyAll',.32),E('invincible','self',2.5)],{revive:true}],
 ['whitedragon','Bạch Long Mã','B',['fighter','support'],'Tây Du','Thủy','Long Giác Linh Kiếm','Long Hành Hộ Giá',[D('enemyColumn',1.6),H('weakAlly',.2),E('boost','allyAll',3)],{regen:.02}],
 ['bulldemon','Ngưu Ma Vương','SS',['tank','fighter'],'Tây Du','Mộc','Hỗn Thiết Côn','Bình Thiên Đại Lực',[D('enemyFront',2),E('stun','enemyFront',2),S('self',.3)],{block:.45,reflect:.25}],
 ['ironfan','Thiết Phiến Công Chúa','S',['mage','support'],'Tây Du','Mộc','Ba Tiêu Phiến','Cuồng Phong Thiết Phiến',[D('enemyAll',1.4,'magic'),E('slow','enemyAll',5),E('manaLock','enemyBack',4)],{}],
 ['lijing','Lý Tịnh','SS',['tank','support'],'Phong Thần','Mộc','Linh Lung Bảo Tháp','Bảo Tháp Trấn Yêu',[E('stun','enemyFront',2),S('allyAll',.15),E('immune','self',2)],{block:.4}],
 ['jiangziya','Khương Tử Nha','SSS',['support','mage'],'Phong Thần','Thủy','Đả Thần Tiên','Phong Thần Chiếu Lệnh',[D('enemyAll',1.3,'magic'),E('stun','enemyAll',1.5),H('allyAll',.2)],{revive:true}],
 ['leizhenzi','Lôi Chấn Tử','S',['archer','mage'],'Phong Thần','Thủy','Phong Lôi Hoàng Kim Côn','Phong Lôi Song Dực',[D('enemyBack',2,'magic'),E('stun','enemyBack',2)],{lifesteal:.1}],
 ['daji','Đát Kỷ','SS',['assassin','mage'],'Phong Thần','Hỏa','Cửu Vĩ Huyền Châu','Cửu Vĩ Mị Hoặc',[D('enemyBack',2.2,'magic'),E('stun','enemyBack',2),E('manaLock','enemyBack',5)],{lifesteal:.3}],
 ['shengongbao','Thân Công Báo','A',['mage','support'],'Phong Thần','Thủy','Hắc Báo Linh Trượng','Đạo Hữu Dừng Bước',[D('enemyWeak',2,'magic'),E('slow','enemyAll',4),E('manaLock','enemyAll',3)],{}],
 ['tuxingsun','Thổ Hành Tôn','B',['assassin'],'Phong Thần','Mộc','Khổn Tiên Thằng','Độn Thổ Phục Kích',[D('enemyBack',2),E('stun','enemyWeak',2)],{execute:true}],
 ['longji','Long Cát Công Chúa','B',['support','mage'],'Phong Thần','Thủy','Tứ Hải Bình','Cam Lộ Thanh Tâm',[H('allyAll',.23),E('immune','weakAlly',2)],{regen:.02}],
 ['houyi','Hậu Nghệ','SSR',['archer'],'Thần Thoại','Hỏa','Xạ Nhật Thần Cung','Cửu Nhật Lạc Thiên',[D('enemyAll',1.8),D('enemyWeak',2)],{execute:true,lifesteal:.2}],
 ['change','Hằng Nga','SSS',['support','mage'],'Thần Thoại','Thủy','Quảng Hàn Nguyệt Luân','Quảng Hàn Tịnh Nguyệt',[H('allyAll',.28),E('slow','enemyAll',4),S('allyAll',.15)],{regen:.03}],
 ['nuwa','Nữ Oa','SSR',['support','mage'],'Thần Thoại','Mộc','Ngũ Sắc Bổ Thiên Thạch','Bổ Thiên Tái Sinh',[H('allyAll',.38),E('immune','allyAll',2),E('invincible','self',2)],{revive:true,regen:.025}],
 ['fuxi','Phục Hy','SSR',['support','mage'],'Thần Thoại','Thủy','Phục Hy Cầm','Tiên Thiên Bát Quái',[D('enemyAll',1.5,'magic'),E('manaLock','enemyAll',5),E('boost','allyAll',5)],{block:.2}],
 ['shennong','Thần Nông','SSS',['support','tank'],'Thần Thoại','Mộc','Thần Nông Đỉnh','Bách Thảo Hồi Xuân',[H('allyAll',.35),S('allyAll',.15),E('immune','self',2)],{regen:.04,block:.3}],
 ['xingtian','Hình Thiên','SSS',['tank','fighter'],'Thần Thoại','Hỏa','Can Thích Chiến Phủ','Bất Khuất Chiến Hồn',[D('enemyFront',2.4),E('invincible','self',2)],{revive:true,reflect:.4}],
 ['jingwei','Tinh Vệ','C',['archer','support'],'Thần Thoại','Thủy','Tinh Vệ Linh Vũ','Tinh Vệ Điền Hải',[D('enemyBack',1.5),E('slow','enemyBack',4),S('weakAlly',.12)],{}],
 ['kuafu','Khoa Phụ','SS',['tank','fighter'],'Thần Thoại','Mộc','Đào Mộc Thần Trượng','Trục Nhật Đại Địa',[D('enemyFront',2),H('self',.3),E('stun','enemyFront',1.5)],{block:.5,regen:.03}],
 ['pangu','Bàn Cổ','SSR',['tank','fighter'],'Thần Thoại','Hỏa','Khai Thiên Thần Phủ','Khai Thiên Tích Địa',[D('enemyAll',2.1),E('immune','self',2),S('self',.3)],{block:.6,reflect:.35}],
 ['hongjun','Hồng Quân Đạo Tổ','SSR',['support','mage'],'Thái Sơ','Thủy','Tạo Hóa Ngọc Điệp','Hồng Mông Diễn Đạo',[D('enemyAll',2.1,'magic'),E('manaLock','enemyAll',5),H('allyAll',.3),E('boost','allyAll',5)],{revive:true,regen:.03}],
 ['yuanshi','Nguyên Thủy Thiên Tôn','SSR',['mage','tank'],'Thái Sơ','Mộc','Bàn Cổ Phiên','Ngọc Thanh Khai Giới',[D('enemyAll',2.5,'magic'),E('stun','enemyFront',2),S('allyAll',.15)],{block:.4,reflect:.2}],
 ['taishang','Thái Thượng Lão Quân','SSR',['support','mage'],'Thái Sơ','Hỏa','Thái Cực Đồ','Cửu Chuyển Kim Đan',[H('allyAll',.42),S('allyAll',.15),E('immune','weakAlly',3)],{revive:true,regen:.04}],
 ['lingbao','Linh Bảo Thiên Tôn','SSR',['assassin','mage'],'Thái Sơ','Thủy','Tru Tiên Tứ Kiếm','Tru Tiên Kiếm Trận',[D('enemyBack',3,'magic'),D('enemyAll',1.6,'magic'),E('marked','enemyAll',4)],{execute:true,lifesteal:.3}],
 ['haotian','Hạo Thiên Thượng Đế','SSR',['tank','fighter'],'Thái Sơ','Hỏa','Hạo Thiên Tinh Kiếm','Thiên Đình Ngự Lệnh',[D('enemyAll',2.3),E('immune','allyAll',2),E('boost','allyAll',4)],{block:.55,reflect:.35,revive:true}],

];
const legacy = [
 [118,32,'猴','#ec9860','Tề Thiên Đại Thánh','SSR'],[145,26,'義','#7fb49a','Võ Thánh','SSR'],[105,27,'蓮','#e8939f','Tam Thái Tử','SR'],[100,28,'龍','#93b8db','Ngọa Long','SR'],[120,24,'眼','#b2a1d7','Nhị Lang Thần','SR'],[108,22,'槍','#b7c8c3','Thường Sơn Tử Long','R'],[150,16,'豬','#c5a58a','Thiên Bồng Nguyên Soái','R'],[95,25,'月','#cfacd1','Bế Nguyệt','R'],
];
export const characterRoster = rows.map((row,index)=>{
  const [id,name,grade,roles,faction,originalElement,weapon,skillName,operations,passives,resourceOverride]=row;
  const element=index>=56?(['lingbao'].includes(id)?'Bóng tối':'Ánh sáng'):['pangu','bajie','zhangfei','bulldemon','tuxingsun','xingtian','dianwei','xuhuang','dongzhuo','zhoutai','zhurong','menghuo'].includes(id)?'Thổ':['houyi','zhaoyun','erlang','machao','sunce','zhangliao','huangzhong','xiahouyuan','xiahoudun','yangjian','jinzha','muzha'].includes(id)?'Kim':originalElement;
  const resource=resourceOverride||(roles.includes('mage')||roles.includes('support')?'mana':'rage');
  const base=legacy[index]||[roles.includes('tank')?145:roles.includes('support')?105:115,roles.includes('tank')?22:roles.includes('mage')?29:27,'✦',gradeColors[grade],weapon,grade];
  const dark=['lubu','caocao','zhouyu','simayi','zhangliao','ganning','pangtong','redboy','bulldemon','ironfan','daji','shengongbao','tuxingsun','xingtian','lingbao'].includes(id);const divine={path:dark?'dark':'light',name:skillName+(dark?' · Diệt Thế Ám Vực':' · Vĩnh Hằng Quang Vực'),lore:'The fractured Mandate awakens the divine path within '+weapon+' and '+skillName+' from '+faction+'.'};
  return {id,name,grade,rarity:base[5],roles,faction,element,weapon,title:base[4],hp:base[0],atk:base[1],glyph:base[2],color:base[3],resource,passives,preferredRows:roles.includes('tank')?[0]:roles.includes('fighter')?[0,1]:roles.includes('assassin')?[1,2]:roles.includes('support')||roles.includes('archer')?[2]:[1,2],fx:index<8?['monkey','crescent','flame','formation','beam','spear','quake','petal'][index]:['fuxi','jiangziya'].includes(id)||!operations.some(o=>o.effect==='damage')?'formation':operations.some(o=>o.effect==='burn')?'flame':roles.includes('assassin')?'beam':roles.includes('archer')?'spear':roles.includes('mage')?(element==='Thủy'?'beam':'petal'):roles.includes('tank')?'quake':'crescent',skill:{name:skillName,operations,cooldown:5+index%3,cost:resource==='mana'?.7:1},divine,vipExclusive:index>=56,artIndex:index};
});
// Active ability families adapt each character's signature weapon and original myth motif.
const extraAbilityFamilies={
 tank:[['Hộ Thể',9,[S('self',.3),E('immune','self',1)]],['Trấn Địa',6,[D('enemyFront',1.35),E('stun','enemyFront',1.2)]],['Hộ Đạo',9,[S('allyAll',.15),E('invincible','self',1.5)]]],
 fighter:[['Phá Trận',1,[D('enemyFront',1.45),E('slow','enemyFront',3)]],['Chiến Ý',5,[D('enemyColumn',1.1),S('self',.2)]],['Vạn Quân',0,[D('enemyAll',2),E('marked','enemyFront',3)]]],
 assassin:[['Ảnh Tập',12,[D('enemyBack',1.6),E('marked','enemyBack',3)]],['Truy Hồn',4,[D('enemyWeak',2),E('stun','enemyWeak',1)]],['Vô Ảnh',13,[D('enemyAll',1.5),E('immune','self',1)]]],
 support:[['Dưỡng Tâm',8,[H('weakAlly',.3),E('boost','allyAll',3)]],['Hộ Mệnh',9,[S('allyAll',.12),E('slow','enemyAll',2)]],['Tịnh Thế',14,[H('allyAll',.22),E('immune','weakAlly',1)]]],
 mage:[['Pháp Ấn',10,[D('enemyColumn',1.6,'magic'),E('burn','enemyColumn',3,.12)]],['Huyền Trận',3,[D('enemyAll',1.1,'magic'),E('slow','enemyAll',2.5)]],['Thiên Phạt',12,[D('enemyAll',1.6,'magic'),E('manaLock','enemyAll',4)]]],
 archer:[['Xuyên Vân',11,[D('enemyBack',1.6),E('marked','enemyBack',2)]],['Liên Tiễn',5,[D('enemyColumn',1.4),E('slow','enemyColumn',3)]],['Vạn Tiễn',11,[D('enemyAll',1.8),E('boost','self',3)]]],
};
for(const hero of characterRoster){
 const count=['SSR','SSS'].includes(hero.grade)?4:3,family=extraAbilityFamilies[hero.roles[0]],mainIcon=hero.artIndex<8?hero.artIndex:hero.skill.operations.some(o=>o.effect==='heal')?8:hero.roles.includes('archer')?11:hero.roles.includes('assassin')?12:hero.roles.includes('tank')?9:hero.roles.includes('mage')?10:1;
 hero.skills=[{...hero.skill,index:0,iconIndex:mainIcon,fx:hero.fx},...family.slice(0,count-1).map(([tag,iconIndex,operations],i)=>({name:hero.skill.name+' · '+tag,index:i+1,iconIndex,operations:operations.map(op=>({...op})),cooldown:7+i*2+hero.artIndex%3,cost:hero.resource==='mana'?[.4,.35,.55][i]:[.5,.45,.65][i],fx:operations.some(op=>op.effect==='heal')?'formation':operations.some(op=>op.effect==='burn')?'flame':iconIndex===9?'formation':hero.fx}))];
 if(hero.vipExclusive)hero.passiveSkill={name:({hongjun:'Vạn Pháp Quy Nhất',yuanshi:'Ngọc Thanh Bất Diệt',taishang:'Cửu Chuyển Đan Tâm',lingbao:'Kiếm Tâm Diệt Thế',haotian:'Thiên Mệnh Đế Uy'})[hero.id],iconIndex:({hongjun:3,yuanshi:9,taishang:15,lingbao:12,haotian:14})[hero.id],text:({hongjun:'+20% hồi mana, +15% hiệu quả hồi máu.',yuanshi:'+15% kháng phép, +10% chặn đòn (tối đa 70%).',taishang:'Thêm 1% tái sinh HP/giây dưới nửa máu; nội tại hồi sinh vẫn chỉ một lần.',lingbao:'+15% xuyên kháng phép, +10% hút máu (tối đa 50%).',haotian:'+10% HP tối đa và +15% công vật lý.'})[hero.id]};
}
export const characterById = Object.fromEntries(characterRoster.map(h=>[h.id,h]));
