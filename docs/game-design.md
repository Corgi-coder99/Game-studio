# Thiên Mệnh — Pixel Kingdom v3

Mục tiêu: prototype PvE offline có vòng lặp xây thành → sản xuất → huấn luyện → lập đội 4 tướng → hành quân/thu thập/đánh trại → nhận thưởng. Infinity Kingdom là tham chiếu thể loại, không sao chép giao diện hay tài sản của họ. Hình ảnh nhân vật và công trình riêng, dựa trên huyền thoại Trung Hoa.

## Thành trì và thế giới

6 công trình cấp 1–5: Đại điện, Nông trang, Xưởng gỗ, Mỏ đá, Doanh trại, Điện linh long. Công trình khác không cao hơn Đại điện. Giá nâng từ cấp L: 100L lương, 160L gỗ, 90L đá; cần 8 + 4L giây, một thợ xây tại một thời điểm. Có thể hoàn tất ngay với 50 linh ngọc mô phỏng; chi phí tài nguyên trừ một lần lúc bắt đầu. Cấp và hiệu quả công trình chỉ tăng khi hoàn tất.

Nông trang và Xưởng gỗ sản xuất 2 × cấp/giây; Mỏ đá 1 × cấp/giây. Mỗi loại chứa tối đa 999.999. Thu nhập tính theo thời gian thực, tối đa 8 giờ vắng mặt. Huấn luyện 20 quân tốn 160 lương và 80 gỗ, mất 14 − 2 × cấp doanh trại giây (tối thiểu 4 giây). Một lượt huấn luyện tại một thời điểm, chọn riêng Thuẫn/Thương/Cung/Kỵ. Mỗi loại có kho riêng, tổng tối đa 1.000 quân trong thành. Ban đầu lần lượt có 80/40/40/20 quân. Bốn khu doanh trại dùng chung cấp nâng cấp và hàng đợi.

Thế giới gồm thành nhà, 3 trại địch tăng độ khó, 3 điểm thu thập lương/gỗ/đá. Có một đạo quân, cần đủ 4 tướng và 60 quân cùng binh chủng đang chọn. Hành quân mất 6 + 2 × cấp địa điểm giây; thu thập 20 giây nhận 500 tài nguyên; trở về 6 giây. Đang hành quân thì khóa đổi đội, linh long và chỉ số sandbox. Quân không bị trừ lại khi đang trở về. Rút trong giao chiến hao 10% quân đang mang theo, không nhận thưởng.

Đánh thắng trại: lần đầu nhận 200 × cấp linh ngọc, chơi lại nhận 60 × cấp; mỗi lần thắng nhận 150 × cấp lương và 100 × cấp gỗ, hao 20% quân; thua hao 50%. Anh hùng không mất vĩnh viễn. Trại có đội hình tướng đối thủ dùng lại roster để thử chiến thuật, không phải chiến dịch lịch sử chính xác.

## Đội hình và nhịp chiến đấu

Đúng 4 tướng khác nhau: hai vị trí đầu là tiền tuyến, hai vị trí sau là hậu tuyến. Có thể kéo thả đổi vị trí hoặc dùng nút đưa lên đầu. Đòn thường nhắm tiền phong cùng cột, rồi tiền phong còn lại, sau cùng mới đến hậu tuyến. HP trong trận = HP gốc × 2 × (1 + 0,05 × cấp doanh trại), rồi áp dụng buff đội hình; ATK = ATK gốc × cùng hệ số doanh trại, rồi áp dụng buff. Bản thử dùng chung hệ số cho HP và ATK. Địch có hệ số 0,6 + 0,25 × cấp trại.

Mỗi giây, các tướng sống hành động theo thứ tự đội ta rồi đội địch. Đòn thường 55% vật công, +20 nộ, ban đầu 40 nộ (Kỵ binh +15). Kỹ năng dùng công vật lý hoặc pháp công theo hồ sơ tướng; có giáp/kháng phép, bạo kích và hệ số lực lượng theo HP. Công thức và ví dụ ở damage-model.md. Đủ 100 nộ dùng kỹ năng và về 0 nộ. Có thể bật tự dùng hoặc bấm thủ công cho đội ta; địch luôn tự dùng. Tướng bị mê hoặc mất lượt kế tiếp. Hỏa khắc Mộc, Mộc khắc Thủy, Thủy khắc Hỏa: sát thương ×1,25. Trận tối đa 180 giây, hết thời gian tính thua. Nút tạm dừng ngừng hành quân/giao chiến, không ngừng kinh tế. Vòng mô phỏng giới hạn phần bù thời gian để giao chiến không chạy hàng giờ sau khi tab bị treo.

Ba tướng cùng hệ: +10% HP và ATK toàn đội. Hàm hỗ trợ 4 tướng cùng hệ +18% cho roster mở rộng; roster hiện tại chưa có 4 tướng cùng hệ.

## Kỹ năng và hiệu ứng riêng

| Tướng | Kỹ năng | Cơ chế | Hình hiệu ứng |
|---|---|---|---|
| Tôn Ngộ Không | Đại Náo Thiên Cung | Toàn địch 130% ATK, thêm 100% lên mục tiêu yếu nhất | Ba phân thân/gậy vàng |
| Quan Vũ | Thanh Long Yển Nguyệt | Tiền phong địch 230%, giảm 25% giáp vật lý mục tiêu trong 4s | Sóng đao xanh lục |
| Na Tra | Hỏa Luân Liên Kích | Toàn địch 110%, thiêu đốt 15 HP/s × 3s | Vòng lửa và tàn lửa đỏ |
| Gia Cát Lượng | Bát Trận Đồ | Toàn đội hồi 24% HP tối đa, khiên 30, +20% ATK trong 4s | Trận đồ bát giác xanh lam |
| Dương Tiễn | Thiên Nhãn Khai Quang | Địch yếu nhất 280%, đánh dấu chịu thêm 25% sát thương trong 4s | Tia thiên nhãn tím |
| Triệu Vân | Thất Tiến Thất Xuất | 3 nhát 95% vào địch yếu nhất tại mỗi nhát, tự khiên 45 | Ba vệt thương ngọc lam |
| Trư Bát Giới | Thiên Bồng Hộ Trận | Toàn địch 80%, khiên 55 toàn đội, tự hồi 30% HP | Sóng chấn địa màu đất |
| Điêu Thuyền | Bế Nguyệt Liên Hoàn | Toàn địch 90%, mê hoặc 1 lượt, hồi 35 HP cho đồng minh yếu nhất | Cánh hoa hồng |

Khiên hấp thụ sát thương trước HP, thay bằng giá trị cao hơn, không cộng dồn. Hồi HP không hồi sinh tướng bị hạ. Sát thương thiêu đốt trừ HP trực tiếp. Các hiệu ứng kéo dài giảm thời gian ở đầu nhịp giây. Phá giáp giảm giáp vật lý, Thiên Nhãn tăng sát thương nhận; hai hiệu ứng có thể cùng tồn tại. Hiệu ứng kỹ năng hiển thị trên bản đồ và tướng đang xuất chiêu sáng/nhích trong bảng giao chiến.

## Liên kết điển tích

Buff thụ động áp dụng lúc bắt đầu trận theo đội hình, tồn tại suốt trận. Đòn phối hợp yêu cầu đối tác còn sống; đối tác trợ kích không tốn nộ. Các combo là thiết kế gameplay dựa trên liên hệ văn học/lịch sử, không khẳng định những kỹ năng này tồn tại trong điển tích.

| Liên kết | Tướng cần có | Buff toàn đội | Đòn phối hợp |
|---|---|---|---|
| Đồng Hành Thỉnh Kinh | Ngộ Không + Bát Giới | +15% HP | Ngộ Không tung chiêu, Bát Giới trợ kích toàn địch 50% ATK |
| Long Đảm Ngọa Long | Gia Cát Lượng + Triệu Vân | +12% ATK | Bát Trận Đồ gọi thương của Triệu Vân 180% ATK |
| Hổ Tướng Thục Hán | Quan Vũ + Triệu Vân | Giảm 10% sát thương nhận | Quan Vũ tung thêm sóng đao 70% ATK toàn địch |
| Song Thần Phạt Trụ | Na Tra + Dương Tiễn | Nộ từ đòn thường tăng 20% (20 → 24) | Na Tra đánh thêm 120% ATK của Dương Tiễn lên địch đã bị Thiên Nhãn đánh dấu |

## Linh long

Chọn Hỏa/Thủy/Mộc tại Điện linh long trước khi xuất chinh. Tích 10 nộ/giây chiến đấu, 100 nộ kích hoạt tự động: Hỏa gây sát thương lên toàn địch (có khắc chế), Thủy hồi HP toàn đội, Mộc tạo khiên toàn đội. Sức mạnh = 25 + 10 × cấp điện. Không đổi linh long trong khi đội đang ra ngoài.

## Gacha, sandbox và lưu trữ

Giữ gacha v1: 100 linh ngọc/lượt, SSR 5%, SR 25%, R 70%, bảo hiểm lượt thứ 30 liên tục chưa SSR, thẻ trùng hoàn 25. Chỉ là tiền mô phỏng. Có nút mở cả 8 tướng trong Studio để kiểm thử tất cả combo mà không cần quay. Sửa HP gốc 50–300, ATK gốc 10–80; áp dụng cho đội ta từ trận mới.

V3 tương thích định dạng LocalStorage v2, dùng khóa thien-menh-kingdom-v2, đọc/migrate v1 từ khóa thien-menh-studio-v1 khi chưa có v2. Bản v2 cũ được bổ sung construction=null, troopType=shield và chuyển tổng quân hiện có thành Thuẫn binh. Giữ tướng, tiền, lượt quay, chiến thắng và overrides; chọn 4 tướng đầu từ đội cũ. Xuất/nhập JSON kiểm tra kiểu, giới hạn, danh sách và phiên bản. Bản lưu chỉ giữ tiến độ lâu dài: thu hồi đạo quân đang đi, trả quân đang mang theo, bỏ trận tạm thời. Không nhân đôi tiền thưởng vì thưởng đã tính vào tiến độ lúc kết thúc trận. Đây là sandbox, không có chống chỉnh đồng hồ/chống gian lận.

## Hình ảnh và giới hạn

Thành phố toàn màn hình với HUD nổi, bảng công trình đóng/mở theo thao tác, đường phố, tường thành, cây, đài phun nước và dân cư di chuyển. Atlas chân dung 4×2, atlas công trình trong suốt 3×2, atlas nhân vật toàn thân 4×2 và nền Hổ Lao Quan. Sân đấu riêng hiển thị tướng toàn thân, binh lính, projectile, số sát thương/hồi máu, HP, nộ và 8 hiệu ứng chiêu. Tốc độ ×1/×2, tạm dừng, báo cáo và kết quả trận có thưởng thực. Bộ dựng nhúng cả bốn PNG và mã thành một HTML, không tải qua mạng lúc chơi. Sprite tĩnh được biến đổi/bob/lunge, chưa có animation sheet nhiều khung. Chưa có âm thanh, tài khoản, PvP, liên minh hay server MMO.

## V4: phát triển nhân vật

Đặc tả đang áp dụng: [Hệ thống v4](character-system-v4.md), [56 nhân vật](characters.md). Đội hình 9 ô thay thế giới hạn 4 tướng. Tám phẩm cấp theo yêu cầu, sáu vai trò kết hợp, cấp nhân vật/trang bị/kỹ năng và tài nguyên mana hoặc nộ. Giới hạn hiệu ứng được thực thi trong mô phỏng, không chỉ hiển thị trong mô tả.

## V5 — spécification hiện hành

[Thiết kế v5](v5-systems.md) thay thế các giới hạn v3/v4 ở trên: người chơi cấp 100, VIP15, 61 tướng, 202 chiêu chủ động, 5 bị động VIP, 7 sao nhân vật, gacha riêng, linh thú thức tỉnh 5 sao, túi đồ tổng và bộ SSR/THẦN.
