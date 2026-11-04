# Kiểm tra Pixel Kingdom v4

Kiểm tra trên Linux với Node, Python và Chromium; chưa chạy BAT trên Windows thực tế.

- 96 kiểm thử đạt: 6 legacy, 9 kingdom và 81 nhân vật/chiến đấu. Bao gồm 56 kỹ năng, phẩm cấp, tăng chỉ số, trang bị, đội 9 ô, nhập save, gacha, hiệu ứng và giới hạn, liên kết, phần thưởng và mô phỏng theo bước thời gian.
- Trình duyệt: mở 56 thẻ, 9 ô đội hình, tăng cấp tướng/kỹ năng, đeo và cường hóa kiếm, rèn vũ khí riêng, lưu và tải lại đội 9 tướng, xuất hiện 9 nút kỹ năng trong trận.
- ZIP v4 giải nén trong đường dẫn có dấu cách; Python chạy từ thư mục khác. GET/HEAD trả đúng HTML và đường dẫn mã nguồn bị trả 404. Nhấp Đại điện, đóng bằng Escape, mở danh sách 56 tướng và 9 ô từ chính ZIP; không lỗi trang, không gọi mạng ngoài.
- Bố cục các màn ở chiều rộng 390px không tràn ngang. HTML nhúng được chạy với mạng tắt, mở đủ 56 thẻ và không lỗi JavaScript.
- Ảnh kiểm tra trong docs/screenshots/kingdom-v4-*.png.

Các kiểm tra v3 trước đây về xây dựng/huấn luyện/thu thập tiếp tục được bảo vệ bởi kiểm thử kingdom. Công thức sát thương là thiết kế của bản thử, chưa xác nhận công thức Infinity Kingdom. Chưa kiểm tra trực tiếp file:// trong trình duyệt quản lý; dùng Python launcher đã kiểm tra hoặc CHOI-NGAY.bat để mở HTML trên Windows.
