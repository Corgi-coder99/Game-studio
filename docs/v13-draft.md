# Cập nhật: cảm ứng và Tháp Luyện Ngục

Bản cập nhật dành cho nhánh `codex/thien-menh-offline`. Không thay đổi nhánh main.

- Khung cảm ứng dùng hệ tọa độ 1280 theo chiều ngang, 720 theo chiều dọc, tận dụng chiều cao màn hình. Thay đổi chiều cao Safari chỉ cập nhật khung nhìn, không dựng lại bản đồ. Trang được cố định; cuộn trong danh sách và kéo/pinch trên canvas được xử lý riêng.
- Nút điều khiển lớn hơn, danh sách Long Linh cuộn trong khung, bảy ảnh vuông dùng atlas 7 × 4. Ảnh biểu tượng Điện Long Linh mở đúng cửa sổ thay vì bị trình xem ảnh chặn.
- Bộ rồng bay mới do công cụ tạo ảnh sinh từ đồ họa gốc: bốn tư thế cánh, thân duỗi, đuôi chuyển động nhẹ. Thành và PVE dùng chung bộ khung hình; mỗi đội vẫn chỉ một long hỗ trợ.
- Kỹ năng bổ sung đường khí tới mục tiêu, vòng va chạm, hạt sáng và kiếm khí/băng kiếm tùy họ kỹ năng. Không thay sát thương vì hiệu ứng đồ họa.
- Mỗi tầng 1–999 có ba đợt: quái tiền tiêu, công thành, boss lớn. Tăng hệ số địch và máu để kéo dài giao tranh. Giữ nguyên HP, mana/nộ, hồi chiêu, trạng thái, tướng đã ngã và lượt hồi sinh đã dùng giữa các đợt. Chỉ thưởng/mở tầng mới sau boss; thua dừng tự nối. Kỹ năng hồi phục trong trận vẫn hoạt động.
- Đội tháp chạy riêng với ba đội thế giới. Tiến trình trận là tạm thời; lưu bền vẫn dừng tháp theo quy tắc cũ.

Cần thử tiếp trên iPhone thật: kiểm thử trình duyệt mô phỏng không xác nhận được thanh Safari, vùng tai thỏ hoặc cảm giác chạm trên thiết bị thật.

## Kiểm tra bản nháp

- 242 kiểm thử tự động đạt, không có lỗi; `git diff --check` sạch.
- Chạy dev server; kiểm tra Chromium cảm ứng 926×428, 428×926 và desktop 1440×900: không lỗi JavaScript, khung thay đổi chiều cao không remount canvas, danh sách bảy long cuộn được, atlas không còn khóa ở 50% giữa hai hàng.
- `npm run build:web` (bao gồm build offline) và `python3 package-windows.py` thành công. ZIP giải nén trong đường dẫn có dấu cách, GET/HEAD/404, vào tháp và ảnh nhúng khi tắt mạng đều qua.
- PWA đã kiểm tra lỗi tải/retry, kiểm tra hash, sửa cache bị thiếu, chơi offline và mở lại sau đóng trình duyệt. Chưa chạy BAT trên Windows; chưa kiểm tra Safari/iPhone thật. Không tạo APK/IPA mới trong đợt này.
