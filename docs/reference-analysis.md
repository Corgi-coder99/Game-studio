# Đối chiếu tham chiếu v3

## Nguồn trực tiếp sử dụng

Ảnh thứ hai do người dùng gửi trong cuộc trò chuyện: màn thành phố Infinity Kingdom với công trình lớn chiếm phần lớn màn hình, đường phố nối các khu, HUD tài nguyên trên cùng, avatar góc trái, các hàng đợi bên trái và cụm nút nổi phía dưới/phải. Các nhãn Spearmen, Bowmen, Cavalry và Shieldmen Barracks hiển thị trực tiếp trên ảnh.

V3 chuyển từ mô hình thành phố nhỏ trong bảng quản trị sang thành phố pixel toàn màn hình, bỏ sidebar cố định, dùng bảng công trình chỉ mở khi chọn. Có bốn doanh trại/binh chủng với kho quân thật và hàng đợi thật. Tài sản đồ họa, tên nhân vật, mã giao diện và hiệu ứng đều do dự án tạo riêng.

## Tra cứu đã thử và giới hạn

- Video được chỉ định: https://www.youtube.com/watch?v=Ya0V-0oP7V0 . Kết nối qua proxy nhận lỗi CONNECT 403. Chính sách mạng thực tế vẫn chưa cấp YouTube; chưa xem video hoặc Shorts và không dùng chúng làm bằng chứng đã quan sát.
- MP4 người dùng tải lên vượt giới hạn chuyển tệp 32 MiB của công cụ; chưa đọc được nội dung.
- Đã tìm repository công khai qua GitHub Search với truy vấn Infinity Kingdom guide/combat/Infinity Kingdom. https://github.com/jesson1982/Infinity-Kingdom chỉ có README hai dòng, không có thông tin cơ chế để sử dụng.
- https://github.com/xinxiangchen/infinity_kingdom có README tự mô tả là một Godot action/boss-rush prototype với Knight/Ranger/Mage. Đây là dự án trùng tên, không phải tài liệu của game tham chiếu; đã loại khỏi căn cứ thiết kế và không sao chép mã/tài sản.

Không tìm được nguồn truy cập được để xác nhận công thức sát thương hay các con số kỹ năng gốc. Các hằng số trong damage-model.md là mô hình thử nghiệm minh bạch của dự án, không phải số liệu khai thác từ Infinity Kingdom. Việc đối chiếu hiện tại đáng tin cậy nhất ở bố cục thành phố trong ảnh, chưa phải khẳng định tương đương toàn bộ gameplay game gốc.

## Quyết định triển khai và phần chưa có

Đội bốn anh hùng, hai hàng trước/sau, linh long, nộ khí, bốn binh chủng, tự giao chiến và điều khiển chiêu thủ công là hướng gameplay được chọn cho bản offline. Giữ bộ nhân vật Trung Hoa, ba hệ Hỏa/Mộc/Thủy và bốn combo điển tích của dự án. Chưa có MMO/PvP/liên minh, Tower of Knowledge, trang bị, toàn bộ hệ nguyên tố hay bộ kỹ năng của game gốc.
