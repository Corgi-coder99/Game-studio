// Translate historical system notices before the generic UI catalog replaces names.
const mailPhrases=[
 ['Chiến lợi và tài nguyên đang chờ nhận trong Hộp thư → Chiến lợi bí cảnh.','Resources are ready to claim under Hidden Realm Rewards.'],
 ['Chiến lợi và bí kíp ','Loot and the martial manual '],
 [' đang chờ nhận trong Hộp thư → Chiến lợi bí cảnh.',' are ready to claim under Hidden Realm Rewards.'],
 ['Hình ảo đã chịu đủ 5 lượt tấn công. Thành ở nguyên chỗ cũ; khóa di chuyển 60 giây.','The destination ghost took five attacks. The city stays at its origin; travel is blocked for 60 seconds.'],
 [' đã bị đánh bại',' was defeated'],
 ['Thành đã đến','The city arrived at'],['các thành địa phương mới đã xuất hiện.','new local cities have appeared.'],
 ['BOT địa phương tấn công điểm đến','Local BOTs attacked the destination'],['BOT địa phương đánh lén thành','Local BOTs raided the city'],
 ['đang trấn giữ bí kíp. Thắng BOSS rồi nhận chiến lợi qua hộp thư.','guards the martial manual. Defeat the boss and collect the loot from the Reward Inbox.'],
 ['Vào cổng không gian để đến bí cảnh.','Use the portal to enter the hidden realm.'],['Cổng ẩn gần','Hidden portal near'],[' tại tọa độ ',' at coordinates '],
 ['Phát hiện mảnh bản đồ: ','Map fragment discovered: '],['Điểm đến bị phá hủy','Destination destroyed'],['Di chuyển tọa độ','City relocation'],['Đang di chuyển tới','Traveling to'],['Đã đến tọa độ','Destination reached'],['Tập kích hình ảo','Ghost under attack'],['Qua cổng','By portal'],['Đã đến ','Arrived at '],['Tin chiến tuyến','Frontline notice'],
 ['Đã dịch chuyển đến ','Teleported to '],['Giao thương với ','Traded with '],['Thiện chí với ','Relations with '],[' tăng. Từ 20 điểm được hỗ trợ giảm tổn thất tập kích.',' improved. At 20 relations, allies help reduce raid losses.'],
 [' chặn cuộc tập kích của ',' intercepted a raid by '],[' tập kích ngoại vi, lấy ',' raided the outskirts and took '],[' (đồng minh đã bảo vệ một nửa).',' (allies protected half).'],['Giao chiến với ','Battle against '],['Thu thập +','Gathered +'],['kế hoạch ','plan '],[' quân, ',' troops, '],[' công trình.',' buildings.'],['Đội ','Army '],[' lương',' Food'],[' gỗ',' Wood'],[' đá',' Stone'],[' giây',' seconds'],[' lượt.',' hits.'],
 ['tập kích','raid'],['tổn thất','losses'],['bảo vệ','protected'],['thiệt hại','damage'],['chiến thắng','victory'],['thất bại','defeat']
].sort((a,b)=>b[0].length-a[0].length);
export function mailNoticeText(value){let text=String(value);for(const [from,to]of mailPhrases){const escaped=from.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),boundary=/[\p{L}\p{N}]$/u.test(from)?'(?=$|[^\\p{L}\\p{N}])':'';text=text.replace(new RegExp(escaped+boundary,'gu'),()=>to);}return text.replace(/: plan (gather|train|build|defend|scout|raid), (\d+) troops, (\d+) buildings\.$/,(_,plan,troops,buildings)=>
  ': '+({gather:'Gathering resources',train:'Training troops',build:'Building',defend:'Fortifying defenses',scout:'Scouting',raid:'Preparing a raid'})[plan]+
  ' · '+troops+' troops · '+buildings+' buildings.');
}
