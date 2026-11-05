# Thiết kế v5 — tài khoản, nhân vật, linh thú và kho

## Chỉ số và phẩm cấp

SSR > SSS > SS > S > A > B > C > D, màu tương ứng ngũ sắc / đỏ vàng / vàng / đỏ / cam / tím / xanh biển đậm / xanh lá. Áp dụng cho thẻ tướng, trang bị, kết quả quay và nhãn.

Mọi tướng có 0–7 sao. Quay trùng nhận mảnh riêng: SSR 40, SSS 30, SS 25, S 20, A 15, B 12, C 10, D 8; giữ hoàn 25 ngọc và 10 tinh hoa. Chi phí mỗi sao 20/40/60/80/100/120/140; ưu tiên mảnh riêng, SSR mới được bù bằng mảnh vạn năng. Mỗi sao +8% HP, hai công, hai kháng. Nhân vật vẫn tăng cấp 1–60.

202 kỹ năng chủ động: mỗi tướng thường có 3; SSS và SSR có 4. Năm SSR VIP thêm bị động số 5. Kỹ năng chủ động có chi phí mana/nộ, hồi chiêu và cấp 1–5 riêng. Kỹ năng chính giữ combo cũ; kỹ năng phụ không tự kích combo chính. Tự động ưu tiên chiêu chính khi sẵn sàng rồi chiêu phụ; thủ công dùng các nút biểu tượng dưới chân dung trong trận. Biểu tượng dùng atlas 4×4, chia theo vũ khí và hiệu ứng; chi tiết hiển thị tên, tác dụng và cấp.

## Trang bị và THẦN

Mũ/giáp/vũ khí/trang sức/cổ vật, đủ tám phẩm cấp. Cường hóa +1–+10. Trang bị thường rèn được; bộ thần trang SSR nhận qua quà và gacha riêng. Vũ khí riêng chỉ đeo đúng tướng, vũ khí VIP chỉ phát trong quà VIP.

SSR có xuyên giáp, xuyên kháng phép, né tránh, tăng sát thương chí mạng và giảm thời gian hiệu ứng xấu. Các chỉ số này tác động trong tactics.mjs. Đủ năm món SSR ở đủ năm ô: nhân ba các chỉ số chiến đấu, rồi áp trần: chặn 70%, phản/hút 50%, chí mạng 75%, tốc đánh 3,5/s, tái sinh 8%/s, xuyên 80%, né 50%, kháng thời gian bất lợi 70%. Không nhân cấp hay trạng thái hồi sinh/kết liễu.

Mỗi lần dùng thành công bất kỳ kỹ năng chủ động nào tăng đếm. Ở lần 3, 6, 9… kích THẦN nếu đủ bộ SSR:

- Ánh sáng: miễn sát thương 1s; hồi 30% HP tối đa trong 1s, chịu hệ số hồi máu và thiêu đốt. Vẫn nhận debuff, không phải vô địch.
- Bóng tối: xóa khiên, miễn sát thương, vô địch, tăng công và buff THẦN có thời hạn của toàn địch. Gây hư không 40% công phép/s trong 6s, chịu kháng phép. Trong 6s, debuff mới tăng 50% thời gian và cường độ; debuff đang có được kéo dài/tăng cường. Trần thời gian 12s. Không xóa cấp, trang bị, sao hoặc nội tại vĩnh viễn.

Đường THẦN cố định trong dữ liệu tướng. Tên quang/ám vực gắn với tuyệt kỹ và vũ khí điển tích; đây là diễn giải gameplay, không khẳng định lịch sử có phép thời không.

## Hồ sơ, EXP và VIP

EXP để từ cấp L lên tiếp theo: 60 + 20L. Người chơi tối đa 100. Hoàn tất công trình: 100 × cấp mới EXP; huấn luyện: 30; thu thập: 70; thắng trại: 120 × cấp trại. Mỗi cấp mới cho 100 + 10 × cấp điểm VIP, cộng một lần khi vượt cấp, tối đa 60.000 điểm / VIP15.

20 quà cấp 5…100 tăng dần tài nguyên/vật phẩm. Từ 50 có vé quay, thần trang và khung chân dung/chat/skin thành; từ 60 mỗi mốc nhận SSR thường ngẫu nhiên (trùng → 40 mảnh). Không có SSR VIP trong quà thường.

VIP1…15 có quà riêng nhận một lần: tài nguyên, tinh hoa, vé, mảnh SSR, linh quả, thần trang, ngoại trang và điểm gacha thú. VIP3 Hạo Thiên; VIP6 Thái Thượng; VIP9 Nguyên Thủy; VIP12 Linh Bảo; VIP15 Hồng Quân. Kèm vũ khí riêng, không nằm gacha hoặc nút mở tướng sandbox.

Mỗi cấp VIP tăng tốc hành quân 2,5%, thu thập 3%, xây dựng 4%, huấn luyện 2%, sản xuất 2%, hai kháng đội ta 0,4%; giảm chờ xây thêm 1,5s. Thời gian = gốc/(1+tốc độ), xây còn tối thiểu 0,5s. Chốt thời gian khi bắt đầu, không đổi hàng đợi/hành quân đang chạy. Không mua bằng tiền thật.

## Ba gacha độc lập

- Tướng: 100 ngọc hoặc 1 vé/lượt, có bảo hiểm SSR lượt thứ 30 chưa ra SSR. Mảnh trùng theo phẩm cấp.
- Trang bị: 150 ngọc hoặc 1 vé trang bị/lượt. Pity riêng 30, không ảnh hưởng pity tướng; mỗi món trùng là một instance mới, giữ riêng cấp và người đeo.
- Thú cưng: 1 điểm/lượt, 5 thú đều 20%. Điểm chỉ phát trong bảo rương VIP; không đổi bằng ngọc, EXP hoặc quà cấp thường. Trùng nhận 20 mảnh của đúng thú. Không có pet miễn phí lúc bắt đầu.

Tỷ lệ tướng/trang bị: 1/3/6/10/20/25/20/15% theo SSR→D. Hệ thống offline dùng ngẫu nhiên máy, không có cam kết chống gian lận.

## Thú cưng và thức tỉnh

Thú nhận được có 1 sao/cấp 1. Cấp tối đa 20 bằng linh quả (5 × cấp hiện tại). Sao tối đa 5, tốn 20/40/60/80 mảnh để từ sao 1→5. Buff gốc = hệ số thú × cấp × (1 + 0,15 × (sao−1)). Chỉ thú đang đồng hành tác động; khóa đổi/nâng khi đang hành quân.

Sao 5 đổi sang atlas thức tỉnh và mở kỹ năng:

- Ngọc Kỳ Lân — Ngọc Lân Tụ Lộc: thêm 10% sản xuất, +25% sản lượng thu thập.
- Chu Tước — Niết Bàn Hỏa Vũ: tướng có HP tối đa thấp nhất nhận hồi sinh một lần 30% HP; toàn đội thêm tái sinh 0,5% HP/s khi dưới nửa máu. Không tăng số lần hồi sinh vốn có.
- Bạch Hổ — Sát Phạt: +5% chí mạng, +30% sát thương chí mạng.
- Huyền Vũ — Trấn Thiên: khiên đầu trận 15% HP/6s toàn đội, +5% chặn, chịu trần.
- Tỳ Hưu — Thôn Kim Tụ Bảo: +15% ngọc thắng trại, +10% sản lượng thu thập.

Linh long Hỏa/Thủy/Mộc vẫn là hệ hỗ trợ riêng, không tiêu điểm thú.

## Túi Càn Khôn và lưu trữ

Sáu tab: tài nguyên; vật phẩm; trang bị; mảnh tướng; thú/mảnh; ngoại trang. Có số lượng, công dụng, người đang đeo và nơi sử dụng. Tài nguyên cập nhật trực tiếp, bao gồm ngọc, lương/gỗ/đá, tinh hoa, VIP, EXP, quân trong thành/viễn chinh, EXP từng tướng. Vật phẩm có rương, binh thư, tăng tốc, linh quả, ba loại vé/điểm và mảnh SSR vạn năng.

Bỏ giới hạn 500 ô trang bị; phân trang 48 món. Đồ đang đeo vẫn tính một món; chỉ được phân giải sau tháo. Tài nguyên/material giữ trần an toàn hiện có. Lưu bằng LocalStorage và xuất JSON; giới hạn thực tế là dung lượng trình duyệt. Nhập JSON kiểm tra kiểu/giới hạn/sở hữu/ô/sao/claim; quà không phát trùng. Revision5 bổ sung field vào save v1–v4; vẫn dùng khóa lưu v2. Không có backend, thanh toán hoặc AI lúc chơi.


## Chiến dịch 1–999 và Tam Quốc

Chọn một lần quốc gia/thành khi tạo bản lưu: Ngụy (đỏ), Thục (xanh biển), Ngô (xanh lá). Thành gốc thuộc quốc gia đã chọn. Khi dùng đúng Kỵ/Thương/Cung tương ứng, +15% HP và vật công đội. Bản đồ lãnh thổ là sơ đồ chiến thuật thời Tam Quốc, không phải ranh giới hành chính đúng mọi giai đoạn lịch sử. Có 9 thành để chọn khu vực.

Chiến dịch có 999 cấu hình địch tăng dần cấp, số tướng và hệ số. Mở lần lượt, không cần tiêu quân dự bị. Thưởng tự nhận đúng một lần mỗi trận: tài nguyên, EXP người/tướng, tinh hoa; mốc lần đầu 5/10/25 có rương/vé, mỗi 100 có thần trang. Có nối màn, lặp cày màn, ×1/×2/×4 và dừng. Thua dừng tự nối; không chạy tiếp sau nạp save. Campaign và quân thế giới không được hoạt động đồng thời.

## Bản đồ khu vực, BOT và cổng

9 khu vực × 3 thành BOT = 27 BOT; 9 × 6 điểm lương/gỗ/đá = 54 điểm thu thập. Mỗi lần xuất quân cần 60 quân đã chọn; thu thập tối đa 500 × cấp điểm, có bonus linh thú; kho cạn tái tạo sau 60 giây chơi. Quân trở về một lần, kể cả khi tải lại save.

BOT dùng quyết định luật offline, không gọi AI dịch vụ: ưu tiên luyện khi thiếu quân, xây khi đủ gỗ/đá, thu thập khi thiếu; tăng cấp công trình/thành, trinh sát, đổi binh chủng sau thua. Có trinh sát/giao thương/kết giao; quan hệ từ20 có hỗ trợ, dưới−40 có thể tập kích ngoại vi nếu đủ lực. Đây là mô phỏng kinh tế/quân sự nhẹ, không khẳng định là AI nguyên bản AoE. Kinh tế BOT chỉ tiến khi tab game hiển thị, không cướp tài nguyên trong thời gian đóng game.

Công thành bắt đầu sau hành quân, dùng engine tướng/kỹ năng thực; scene có hai thành, quân, HP và đạn công thành. Thắng nhận EXP/tài nguyên, hao20% quân mang theo; thua hao50%; rút hao10% và không tính chuỗi thua. BOT phòng thủ thích nghi. Cổng đổi vùng hoạt động, hồi5s, miễn phí; không đổi quốc gia/thành gốc và không dùng khi quân đang đi.

## Quà thời gian, nhiệm vụ và danh hiệu

Thời gian chỉ cộng theo phiên đang mở và tab hiển thị, giới hạn phần bù mỗi nhịp2s; không lấy giờ máy/vắng mặt để mở quà. Mốc1/5/15/30/60/120/240/480/1440 phút có lương/gỗ/đá, nhận một lần. Kinh tế thành trì vẫn giữ cơ chế thu nhập vắng mặt8h của bản cũ.

19 nhiệm vụ gồm mốc PvE, chiến thắng, chuỗi thắng/thua, thắng BOT, thu thập, dịch chuyển, xây, huấn luyện và24h chơi. Kỷ lục chuỗi được giữ sau khi chuỗi kết thúc. Thắng liên tiếp100 nhận Bách Chiến Bách Thắng; thua liên tiếp100 nhận Bất Khuất. Danh hiệu chỉ là dấu ấn, không buff cộng dồn. Rút không được tính trận thua. Quà/nhiệm vụ được đánh dấu đã nhận, không lặp khi tải save.

## Skin và hiệu ứng riêng

10 skin, chỉ `equipped.city` đang sở hữu được áp dụng. Không tổng bonus từ bộ sưu tập. Ba skin nhiệm vụ có atlas riêng: Trúc Lâm (PvE10), Huyền Vũ (BOT10), Chu Tước (thắng100). VIP13 Vân Tiêu Thần Cung, VIP14 Vực Sâu Hắc Long Thành, VIP15 Hồng Mông Tinh Điện là thiết kế riêng không phát ở nhiệm vụ. Skin thay hall, thành trên bản đồ và thành khi công thành. Các bonus sản xuất/xây/thu thập/hành quân/huấn luyện/tấn công/phòng thủ được tính thực theo từng skin trong skins.mjs.

## Binh chủng tự tăng cấp

Bốn binh chủng cùng cấp người chơi, tối đa100. Mỗi cấp có HP/vật công/giáp/kháng/tốc đánh/chí mạng riêng; Thương/Cung/Kỵ giữ khắc chế và buff nền cũ, Thuẫn giữ thiên hướng tank. Bảng đơn vị và hệ số hỗ trợ đội hình ở Binh bộ. Mỗi chỉ số tăng từng cấp, không chỉ đổi tên; quân sinh ra ở các thời điểm khác nhau cùng dùng cấp hiện tại. Kỵ có tăng tốc hành quân theo cấp. Cấp riêng đơn vị không đồng nghĩa cấp công trình Doanh trại.


## Bảng ngọc

26 ô, mở dần cấp5…100; mở bảng ở cấp5. Chỉ nhận điểm khi nhận quà mốc cấp người chơi, số điểm mỗi mốc = cấp/5 +2, tổng250 điểm qua20 gói. Lên cấp đơn thuần hoặc nhận VIP không phát điểm ngọc. Save đã nhận quà cấp nhưng chưa có bảng ngọc được bổ sung điểm tương ứng, không reset tiến độ.

Mỗi ô thường tối đa10 hạng, chi phí = giá gốc + phần nguyên(hạng hiện tại/3). Các ô đặc biệt hồi sinh/kết liễu/miễn nhiễm/vô địch tối đa1 hạng và đòi cấp60/80/90/100, giá12/15/18/20 điểm. Có hoàn toàn bộ điểm miễn phí; không đổi khi đang hành quân, thu thập hay chiến đấu. Điểm đã tiêu + điểm còn phải bằng tổng điểm kiếm được.

Hiệu ứng áp dụng mọi tướng đồng minh từ trận mới: HP, hai công, hai kháng, giảm vật lý/phép, chí mạng, tốc đánh, hồi mana/nộ, chặn, phản, hút, tái sinh, hồi máu, sức khiên, kháng thời gian bất lợi; xác suất đòn thường thiêu đốt/chậm/choáng/khóa hồi mana. Hồi sinh chỉ một lần30%HP; kết liễu dưới10%; miễn/vô địch ở đầu trận1s theo ngọc. Không tạo proc dây chuyền từ DoT/phản đòn. Các trần cũ vẫn áp dụng, giảm sát thương vật lý/phép thêm trần50%. Ngọc chỉ buff bên người chơi, không vô tình dùng cho địch.

## Hộp thư chiến tuyến

Tự ghi khi thắng/thua/rút khỏi chiến dịch, trại thế giới hoặc công thành, đúng một lần ở khâu kết toán. Giữ60 báo cáo mới nhất,40 tin thế giới; đọc/chưa đọc được lưu. Báo cáo tách hai đội: vật lý/phép/chuẩn thực gây, HP thực nhận, chặn, khiên hấp thụ, hồi máu, khiên tạo, bạo kích, số lần dùng từng chiêu, mana/nộ đã tiêu, số hiệu ứng gây, hồi sinh, thời gian hoạt động và THẦN. Ghi riêng đóng góp linh long để tổng không thiếu nguồn này.

DPS tính theo giây chiến đấu mô phỏng, không theo thời gian thật khi tua. Khiên đã tạo có thể bị xóa trước khi hấp thụ nên hai số không nhất thiết bằng nhau. Gợi ý là luật đọc số liệu: tuyến trước bị hạ, loại sát thương chính của địch, lượng hồi so với damage, số lần dùng chiêu và chủ lực đóng góp; không tự thay đội hình hoặc tiêu tài nguyên. Nội dung báo cáo nhập từ JSON được kiểm tra và escape khi hiển thị.


## Bí cảnh và bí kíp truyền thừa

Sáu bí cảnh cố định gần cổng không gian ở các khu vực khác nhau. Mỗi nơi có một mảnh bản đồ giấu tại một điểm tài nguyên; mảnh được tìm khi thực sự thu thập tại điểm đó, không rơi từ gacha/rương. Mảnh không tiêu hao, mở chính xác tọa độ cổng và lựa chọn dịch chuyển. Khi chưa có mảnh không thể vào bí cảnh bằng API/game UI. Có thể rời qua cổng sau khi xong hoạt động.

Mỗi bí cảnh có BOSS một tướng hộ pháp cấp5/15/25/40/60/80, HP nhân lớn và kháng thời gian debuff. BOSS dùng engine thật; chỉ thắng mới sinh chiến lợi. Toàn bộ ngọc/tài nguyên/tinh hoa/EXP và bí kíp được đưa vào gói thư chờ nhận, không tự cộng khi kill. Lần đầu có bí kíp, đánh lại có tài nguyên; gói chưa nhận không bị loại khi lịch sử thư đầy. Claim một lần, EXP tướng cấp đúng các tướng đã tham chiến. Thua/rút/tải lại không tự phát bí kíp.

Mỗi tướng có một ô truyền thừa thêm vào3–4 chiêu gốc, không thay bị động VIP. Một bí kíp đã học dùng được cho mọi tướng, kể cả gắn cùng bí kíp nhiều người. Có tiêu hao/hồi riêng, dùng tự động hoặc thủ công; thêm vào thống kê thư và chu kỳ THẦN cho lần dùng chủ động thực. Hóa thân không tự tăng số chiêu hay tạo combo/THẦN bổ sung.

Sáu hiệu ứng gốc trong inheritance-combat.mjs:

- Vạn Kiếm Quy Tông: bốn phi kiếm, mỗi giây tự tìm địch yếu nhất, damage dựa tổng hai công.
- Càn Khôn Na Di: đảo vị trí hai địch; nếu chỉ có một địch thì trì hoãn nhịp đòn thường2s, không choáng.
- Nhất Khí Hóa Tam Thanh: hai chiêu thường kế tiếp có hóa thân lặp40% sức mạnh không thêm mana/nộ; không áp cho chính bí kíp.
- Tuế Nguyệt Luân Hồi: đọc trạng thái bản thân3s trước để phục hồi HP/tài nguyên tới mức đã ghi, bớt2s hồi chiêu thường; không hồi sinh, không tua đồng hồ trận hoặc hồi bí kíp.
- Bắc Minh Thôn Thiên: mượn tối đa20% hai công từ địch mạnh nhất6s rồi trả; không hút quá50% công gốc mục tiêu tổng cộng; chuyển tối đa25 mana/nộ.
- Hỗn Nguyên Quy Nhất: phân phối lại HP còn sống theo tỷ lệ, giữ tổng HP; liên kết6s chuyển15% tổn thất sang đồng minh khỏe nhất, không phản dây chuyền.

Bản đồ/Thư viện/Túi Càn Khôn/Hộp thư đều chỉ cùng dữ liệu sở hữu; ô chiêu trong trận lưu snapshot bí kíp và tên chiêu để báo cáo cũ vẫn chính xác sau khi đổi trang bị.
