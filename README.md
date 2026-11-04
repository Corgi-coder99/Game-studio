# Game-studio
Personal game studio

---

# Thiên Mệnh · Codex Legend Studio

Bản đầu game gacha thẻ bài chiến thuật tiếng Việt, kèm công cụ chỉnh thẻ và quy trình phát triển dành cho Codex. Lấy cảm hứng về cách tổ chức công việc từ [Claude Code Game Studios](https://github.com/Donchitos/Claude-Code-Game-Studios); đây là triển khai gọn độc lập, chưa tương đương toàn bộ agents, skills và hooks của dự án đó.

## Chạy

### Tải bản thử cho Windows

Mở tệp [Thien-Menh-Windows-Python.zip](Thien-Menh-Windows-Python.zip) trên GitHub, bấm **Download raw file** (biểu tượng tải xuống). Giải nén tất cả rồi nhấp đúp `CHOI-NGAY.bat`; nếu máy có Python 3, có thể dùng `CHAY-BANG-PYTHON.bat`. Bản này có đầy đủ hình pixel và không cần Internet khi chơi.

### Windows: chơi offline, không cài Node.js

Gói `Thien-Menh-Windows-Python.zip` có cả hai cách: nhấp đúp `CHOI-NGAY.bat` để mở HTML trực tiếp, hoặc `CHAY-BANG-PYTHON.bat` để dùng Python 3 và tự mở trình duyệt. Có thể chạy thủ công `py -3 chay_game.py` hoặc `python chay_game.py`. Không cần thư viện Python bổ sung. Máy chủ Python chỉ lắng nghe trên máy cá nhân, mặc định cổng 8765; Ctrl+C để dừng.

Chạy `python package-windows.py` sau khi build offline để tạo lại ZIP này. Bản lưu HTML và Python dùng vùng lưu trình duyệt riêng: xuất/nhập JSON để chuyển tiến độ giữa hai cách chạy.

Giải nén `Thien-Menh-Windows-Offline.zip`, rồi nhấp đúp `Thien-Menh.html` bên trong. Mở bằng Microsoft Edge hoặc Google Chrome. Tệp này chứa sẵn toàn bộ giao diện và logic, không cần Internet hoặc máy chủ.

Tiến độ phụ thuộc trình duyệt và đường dẫn tệp. Vào **Studio → Xuất bản lưu JSON** để sao lưu trước khi chuyển tệp, đổi trình duyệt hoặc xóa dữ liệu. Nhập lại JSON để khôi phục; tránh chế độ InPrivate/Incognito nếu muốn giữ tiến độ.

### Phát triển mã nguồn

Cần Node.js 22 trở lên. Không có thư viện cần cài, không cần API key.

```sh
cd /workspace/Game-studio
npm test
npm run dev
```

Máy chủ dùng cổng 3000, có thể đổi bằng biến `PORT`. Mở bằng trình duyệt trên máy chạy ứng dụng hoặc cơ chế chuyển tiếp cổng của môi trường phát triển. Không triển khai công khai trong bước này.

Ảnh PNG gốc nằm trong `assets/`, CSS pixel trong `pixel.css`. Bản offline nhúng ảnh trực tiếp để không cần tệp ảnh đi kèm.

`npm run build:offline` tạo lại `offline/Thien-Menh.html` và hướng dẫn. Chỉ người phát triển cần Node.js để tạo bản này; người chơi không cần. Kiểm tra bản tạo bằng cách mở trực tiếp tệp HTML, không qua máy chủ.

## Có gì

- 8 anh hùng, bộ sưu tập, lọc phe và đội 5 tướng.
- Gacha 1/10 lượt, bảo hiểm SSR, hoàn tiền thẻ trùng; toàn bộ là tiền mô phỏng.
- Một trận chiến theo lượt có chọn mục tiêu, hệ khắc chế, tuyệt kỹ và thưởng kết thúc trận.
- Studio chỉnh HP/ATK, xuất/nhập bản lưu, khôi phục dữ liệu và sao chép yêu cầu cho Codex.
- Lưu cục bộ trên trình duyệt; giao diện đáp ứng màn hình nhỏ.

Đọc [thiết kế](docs/game-design.md) để biết luật cụ thể. Codex đọc [AGENTS.md](AGENTS.md) và làm việc trực tiếp trong kho: giao diện Studio hiện không khởi chạy Codex hoặc agent.

## Chi phí và giới hạn

Game không gọi AI và không dùng dịch vụ trả phí. Có thể chạy trên máy cá nhân hoặc triển khai các tệp frontend lên dịch vụ static hosting phù hợp. Phí sử dụng Codex và hosting nếu có phụ thuộc nhà cung cấp và mức sử dụng, không được bao gồm hay bảo đảm miễn phí bởi dự án này.

Đây là prototype có chân dung pixel 2D và nền Hổ Lao Quan tạo bằng AI; chưa có hoạt ảnh nhân vật, âm thanh, tài khoản, PvP, thanh toán hay chống gian lận. Các bản lưu JSON là dữ liệu thử nghiệm do người chơi sửa được; không dùng cho nền kinh tế tiền thật.
