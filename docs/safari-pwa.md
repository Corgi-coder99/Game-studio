# Chơi Thiên Mệnh trên Safari / iPhone

Trang dự kiến: https://corgi-coder99.github.io/Game-studio/

## Bật GitHub Pages một lần (chủ kho)

Mở https://github.com/Corgi-coder99/Game-studio/settings/pages bằng tài khoản chủ kho. Trong Build and deployment: Source → Deploy from a branch; Branch → `main`; Folder → `/docs`; Save. Dùng main cho bản hoàn chỉnh đã được cho phép phát hành. Chờ GitHub xuất bản xong, thường vài phút, rồi mở đường dẫn chơi phía trên. API cấu hình Pages bị chặn trong kết nối của phiên làm việc, nên không thể bật hoặc xác nhận trạng thái Pages qua API tại đây. Không coi URL dự kiến là đã hoạt động trước khi bật Pages.

## Trên iPhone

1. Mở đường dẫn chơi bằng Safari bình thường, dùng Wi-Fi lần đầu.
2. Safari → Chia sẻ → Thêm vào Màn hình chính → Thêm.
3. Mở biểu tượng Thiên Mệnh khi còn Wi-Fi. Bấm Tải game về máy nếu cần; giữ mở tới khi hiện **Sẵn sàng offline**. Gói khoảng 75 MB.
4. Xoay ngang và bấm Chơi ngay. Chỉ bật chế độ máy bay sau khi màn hình bên trong biểu tượng đã báo sẵn sàng.

Một số bản iOS tách dữ liệu của Safari và ứng dụng Màn hình chính, nên cần xác nhận sẵn sàng trong chính biểu tượng đã thêm.

Tiến độ nằm trong vùng lưu của website trên iPhone này. Studio → Xuất bản lưu để giữ bản sao JSON trong Tệp; không cần Mac/TestFlight. Không dùng Bluetooth trong bản Safari. Bộ nhớ đệm của website chịu quản lý dung lượng của iOS; nếu máy đã xóa dữ liệu website, cần mở có mạng để tải lại.

## Build và kiểm tra

`npm run build:web` tạo `docs/index.html`, `game.html`, manifest, service worker và 30 PNG game + icon riêng. Đường dẫn đều tương đối để chạy dưới `/Game-studio/`. Không đưa ZIP/APK hoặc base64 HTML 100MB vào website. Gói native/Windows và luật gameplay v12 giữ nguyên.

Service worker tải tối đa ba tệp cùng lúc, đối chiếu SHA-256 với bản build, giữ phần tải thành công để tiếp tục nếu mạng ngắt, chỉ ghi dấu sẵn sàng khi đủ tất cả tệp. Kiểm tra trạng thái phát hiện cache thiếu ảnh và có sửa lại. Loại header nén HTTP sau khi lưu nội dung đã giải nén để HTML/JS/CSS chạy đúng từ cache trên GitHub Pages. Cache có phiên bản và phạm vi riêng của dự án, không xóa tiến độ localStorage. Bản cập nhật tải đủ trước khi người chơi chọn kích hoạt.

`npm test` gồm 235 kiểm thử gameplay/bản lưu và 5 kiểm thử web/cache. `python3 web/test-browser.py` kiểm tra bằng Chromium có giả lập cảm ứng iPhone (cần Python Playwright và Chromium): tải lỗi, tải tiếp, cache thiếu ảnh, HTTP gzip, chơi offline và đóng/mở lại trình duyệt. Chưa thử Safari trên iPhone thật hoặc WebKit vì môi trường chưa có trình duyệt WebKit.
