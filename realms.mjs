export const realmFactions={
 wei:{name:'Tào Ngụy',color:'#d65c63',troop:'cavalry',troopName:'Kỵ binh',capital:'xuchang',text:'+15% HP và công vật lý Kỵ binh trong trận.'},
 shu:{name:'Thục Hán',color:'#578fdf',troop:'spear',troopName:'Thương binh',capital:'chengdu',text:'+15% HP và công vật lý Thương binh trong trận.'},
 wu:{name:'Đông Ngô',color:'#68bd7c',troop:'bow',troopName:'Cung binh',capital:'jianye',text:'+15% HP và công vật lý Cung binh trong trận.'},
};
export const realmCities=[
 {id:'ye',name:'Nghiệp Thành',faction:'wei',x:640,y:160,node:'camp1'},
 {id:'luoyang',name:'Lạc Dương',faction:'wei',x:510,y:265,node:'camp3'},
 {id:'xuchang',name:'Hứa Xương',faction:'wei',x:640,y:310,node:'camp1'},
 {id:'chengdu',name:'Thành Đô',faction:'shu',x:235,y:440,node:'grove'},
 {id:'hanzhong',name:'Hán Trung',faction:'shu',x:365,y:350,node:'quarry'},
 {id:'jiangzhou',name:'Giang Châu',faction:'shu',x:380,y:510,node:'grain'},
 {id:'wuchang',name:'Vũ Xương',faction:'wu',x:625,y:485,node:'camp2'},
 {id:'jianye',name:'Kiến Nghiệp',faction:'wu',x:810,y:425,node:'camp2'},
 {id:'kuaiji',name:'Cối Kê',faction:'wu',x:890,y:555,node:'grain'},
];
export function realmBonus(state){const realm=state.account?.realm,f=realmFactions[realm?.faction];return f&&state.troopType===f.troop?.15:0;}
export function chooseRealm(state,faction,city){const f=realmFactions[faction];if(!Object.hasOwn(realmFactions,faction)||!realmCities.some(c=>c.id===city&&c.faction===faction))throw new Error('Chọn thành thuộc quốc gia đã chọn.');if(state.account?.realm?.faction)throw new Error('Quốc gia đã được chọn cho bản lưu này.');const s=structuredClone(state);s.account.realm={faction,city};return s;}
