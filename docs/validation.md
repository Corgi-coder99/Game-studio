# Kiểm tra Pixel Kingdom v3

Thực hiện bằng Node/Python/Chromium trên Linux trong phiên phát triển, không phải Windows thực tế.

- `npm test`: 33 kiểm thử đạt (6 legacy/gacha, 27 kingdom). Kiểm tra 8 kỹ năng, 4 combo, 3 linh long, kinh tế, hoàn thưởng một lần, hàng đợi xây dựng/tăng tốc, kho quân từng loại, huấn luyện/thu thập/hoàn quân đúng loại, đội hình trước/sau, chuyển bản lưu cũ, công thức giáp/kháng phép/bạo kích/lực lượng và khiên.
- Luồng Chromium đầy đủ: thành phố toàn màn hình và bảng nổi mặc định đóng; xây dựng, tăng tốc 50 ngọc, huấn luyện Cung binh, thu thập/trở về bảo toàn quân, tự chuyển sân đấu, kỹ năng thủ công, tạm dừng, tốc độ ×2, chiến thắng/200 ngọc thưởng, báo cáo sát thương, hai combo cùng hoạt động, sandbox và chỉnh chỉ số, xuất/nhập JSON, từ chối JSON sai, tải lại trang giữ dữ liệu.
- Cả 6 màn vừa chiều rộng 390px, không tràn ngang. Thành phố trên điện thoại có thể kéo và thu phóng; các công trình ngoài khung có thể chọn qua danh sách.
- Bản HTML được nạp với mạng tắt: công trình, avatar và chiến trường dùng ảnh nhúng; không có yêu cầu HTTP ra ngoài, không có lỗi JavaScript. Chuyển từ hành quân sang chiến trường hoạt động khi mạng tắt.
- Kéo thả thật bằng thao tác chuột Chromium: đổi vị trí hai ô, kéo Ngộ Không từ bộ sưu tập vào ô đội hình; bản lưu và hai liên kết đang hoạt động phản ánh đội mới. Bảng đội hình được giữ nổi trên desktop để có thể kéo thẻ khi cuộn danh sách.
- ZIP cuối được giải nén vào đường dẫn có dấu cách, chạy `chay_game.py` từ thư mục làm việc khác. GET/HEAD trả đúng HTML, các đường dẫn mã nguồn trả 404. Chromium nhấp Đại điện trên canvas và đóng bằng Escape, kéo thả đội hình rồi hoàn tất một trận thắng từ chính ZIP này; không lỗi trang hoặc yêu cầu mạng bên ngoài.
- Vẽ bản đồ được giới hạn khoảng 30 FPS; lớp địa hình được dựng sẵn và chỉ dựng cho chế độ đang mở.

Chưa chạy `.bat` trên Windows thật hoặc mở `file://` trong trình duyệt quản lý của môi trường này (đường dẫn tệp bị chính sách chặn). Windows launcher đã cấu hình mở Edge/Chrome; Python server và toàn bộ nội dung HTML đã được kiểm tra. Công thức sát thương là thiết kế của bản thử, chưa xác minh được công thức Infinity Kingdom gốc; xem reference-analysis.md.
