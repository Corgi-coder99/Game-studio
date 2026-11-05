export const castleSkins=[
 {id:'city-default',name:'Thanh Vân Thành',source:'Có sẵn',artIndex:null,bonuses:{}},
 {id:'city-jade',name:'Ngọc Bích Tiên Thành',source:'Quà cấp 50+',artIndex:null,bonuses:{production:.05}},
 {id:'city-gold',name:'Hoàng Kim Đế Đô',source:'Quà VIP 5+',artIndex:null,bonuses:{march:.05}},
 {id:'city-celestial',name:'Hồng Mông Thiên Cung',source:'Quà cấp 80+ / VIP 10+',artIndex:null,bonuses:{health:.05}},
 {id:'city-bamboo',name:'Trúc Lâm Tiên Phủ',source:'Nhiệm vụ vượt 10 ải',artIndex:0,bonuses:{production:.05,gather:.1}},
 {id:'city-tortoise',name:'Huyền Vũ Thạch Thành',source:'Nhiệm vụ thắng 10 thành BOT',artIndex:1,bonuses:{armor:.1,resist:.1,construction:.1}},
 {id:'city-phoenix',name:'Chu Tước Hỏa Thành',source:'Nhiệm vụ 100 chiến thắng',artIndex:2,bonuses:{magic:.08,training:.1}},
 {id:'city-vip13',name:'Vân Tiêu Thần Cung',source:'Bảo rương VIP 13 độc quyền',artIndex:3,vip:13,bonuses:{production:.15,construction:.15}},
 {id:'city-vip14',name:'Vực Sâu Hắc Long Thành',source:'Bảo rương VIP 14 độc quyền',artIndex:4,vip:14,bonuses:{physical:.1,magic:.1,march:.15}},
 {id:'city-vip15',name:'Hồng Mông Tinh Điện',source:'Bảo rương VIP 15 độc quyền',artIndex:5,vip:15,bonuses:{health:.15,physical:.12,magic:.12,gather:.2,construction:.2}},
];
export const skinEffectNames={production:'Sản xuất',gather:'Tốc độ thu thập',march:'Tốc độ hành quân',construction:'Tốc độ xây',training:'Tốc độ huấn luyện',health:'HP toàn đội',physical:'Công vật lý toàn đội',magic:'Công phép toàn đội',armor:'Giáp toàn đội',resist:'Kháng phép toàn đội'};
export function skinBonus(s){const id=s.account?.equipped?.city;return s.account?.cosmetics?.includes(id)?castleSkins.find(c=>c.id===id)?.bonuses||{}:{};}
export function skinEffectText(skin){return Object.entries(skin.bonuses).map(([key,value])=>`${skinEffectNames[key]} +${Math.round(value*100)}%`).join(' · ')||'Chưa có hiệu ứng đặc biệt.';}
export function castleSkinArt(id){const skin=castleSkins.find(c=>c.id===id);return skin?.artIndex!==null&&skin?.artIndex!==undefined?`<span class="castle-skin-art" style="--cx:${skin.artIndex%3*50}%;--cy:${Math.floor(skin.artIndex/3)*100}%" role="img" aria-label="${skin.name}"></span>`:'<span class="castle-default-art" role="img" aria-label="Thành trì">♜</span>';}
