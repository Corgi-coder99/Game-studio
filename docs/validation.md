# Kiểm tra bản Pixel Kingdom v2

Đã thực hiện trên môi trường Linux/Chromium của phiên phát triển, không phải máy Windows thực tế.

- `npm test`: 6 kiểm thử roster/gacha/v1 và 21 kiểm thử kingdom đạt. Bao gồm cả 8 kỹ năng, 4 đòn phối hợp, 3 linh long, kinh tế, huấn luyện, di chuyển/thu thập, tạm dừng/rút quân, chiến thắng và thưởng một lần, kiểm tra/migrate bản lưu.
- Chromium: nâng Đại điện và Doanh trại, huấn luyện hoàn tất, đổi linh long, thu thập/trở về, tạm dừng/tiếp tục, chiêu thủ công, hoàn tất trận PvE và nhận thưởng. Chọn đội 4 tướng với hai liên kết cùng hoạt động, chỉnh chỉ số, xuất/nhập bản lưu, từ chối bản lưu sai và tải lại trang.
- Cả 6 màn vừa khổ 390px, không tràn ngang. Kiểm tra trực tiếp nhấp chọn cả 6 công trình trên bản đồ bằng tọa độ và mở đúng bảng công trình.
- Bản HTML độc lập được nạp với mạng tắt: canvas vẽ công trình từ PNG nhúng, hiển thị tướng và nâng công trình, không gửi yêu cầu mạng bên ngoài và không có lỗi JavaScript.
- Gói ZIP được giải nén vào đường dẫn có dấu cách. Máy chủ `chay_game.py` chạy từ thư mục làm việc khác; GET/HEAD trả đúng HTML, đường dẫn ngoài game trả 404. Chromium mở game từ máy chủ Python và hoàn tất trận thắng; không lỗi trang hoặc yêu cầu ra Internet.
- Cả ZIP phiên bản v2 và ZIP tương thích được kiểm tra CRC, HTML bên trong khớp tệp build mới nhất, BAT có dòng CRLF và đường dẫn mở trình duyệt rõ ràng.

Chưa kiểm thử `.bat` trên Windows thật hoặc thao tác mở `file://` trong môi trường này (bị chính sách trình duyệt quản lý chặn). Dữ liệu và logic đã kiểm thử; cần xác minh launcher trên máy người dùng. Chưa có kiểm thử PvP/MMO vì các tính năng đó không thuộc prototype.
