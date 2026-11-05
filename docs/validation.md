# Kiểm tra Thiên Mệnh v5

Thực hiện trên Linux bằng Node, Python và Chromium; không phải Windows thật.

- **171 kiểm thử đạt:** 6 legacy, 9 kingdom, 86 nhân vật/chiến đấu, 24 tài khoản, 7 chiến dịch/quốc gia, 14 khu vực/AI/skin/binh chủng, 12 ngọc/thư, 13 truyền thừa.
- Kiểm tra đủ61 nhân vật,202 chiêu gốc và6 bí kíp. Hiệu ứng chặn/phản/hút/khiên/hồi sinh/vô địch, bộ SSR/THẦN, bảng ngọc và chiêu riêng có tác động thực; không chỉ mô tả.
- Trình duyệt desktop: hồ sơ,20 mốc quà,VIP15/5 SSR độc quyền,gacha ba hệ,thú thức tỉnh5 sao,tướng7 sao,trang bị/bộ SSR,ngoại trang,nhập/xuất JSON và lưu lại.
- Quốc gia/thành chọn một lần,9 thành trên bản đồ. Chiến dịch1…999,thực chạy nối màn ở×4,thưởng không trùng,dừng,tải lại giữ tiến độ; không cho chơi màn chưa mở.
- Khu vực: thu thập và hoàn quân,AI tự quyết định xây/luyện/thu thập,cổng đi/khứ hồi,giao thương,BOT công thành thực và thưởng. Quà thời gian,nhiệm vụ,VIP13/14/15 skin,Binh bộ100 hoạt động. Chỉ skin đang dùng đóng góp buff.
- Bảng ngọc: khóa theo cấp,điểm chỉ qua quà mốc,phân/hoàn điểm,bảo toàn điểm và lưu preset. Thư từ trận thực có hai bảng tướng,gợi ý,đọc/chưa đọc,đóng góp linh long.
- Truyền thừa: thu tài nguyên tìm mảnh,hiện cổng ẩn,vào bí cảnh,thắng BOSS,quà chờ trong thư (chưa tự cộng),nhận một lần,gắn ô thêm,dùng phi kiếm trong trận kế tiếp,báo cáo/lưu lại đúng. BOSS kết toán được lưu ngay khi kết thúc.
- Các màn thêm mới được kiểm tra chiều rộng390px; bảng số liệu thư cuộn trong vùng riêng,không làm tràn toàn trang.
- Offline builder gộp mã cổ điển và10 PNG đúng cú pháp,nhúng mỗi PNG một lần thành Blob URL; không cần tải module/ảnh qua mạng.

Ảnh kiểm tra trong docs/screenshots/kingdom-v5-*.png. ZIP cuối đã được giải nén vào thư mục có dấu cách, chạy chay_game.py từ thư mục làm việc khác. CRC và nội dung HTML trùng bản build; GET/HEAD đúng, đường dẫn mã nguồn trả404. Sau khi tải một HTML cục bộ, mạng bị tắt: ảnh/biểu tượng/skin nhúng vẫn hiện; đã thử VIP13–15, quân100, quà thời gian, ngọc, thu thập, cổng, BOSS, thư chiến lợi, học bí kíp, dùng chiêu truyền thừa khi công thành, thắng/nhận nhiệm vụ và xem báo cáo từng tướng. Không lỗi JavaScript hoặc yêu cầu HTTP ngoài.

Giới hạn: chưa chạy BAT trên Windows thật; chưa mở trực tiếp file:// trong trình duyệt quản lý của môi trường này. Python và nội dung HTML được kiểm tra. Sprite là ảnh tĩnh có chuyển động/hiệu ứng canvas,chưa có hoạt ảnh nhiều khung. AI BOT là heuristic offline,không tuyên bố là AI gốc AoE. Công thức là thiết kế riêng,chưa xác nhận công thức nội bộ Infinity Kingdom.
