# v8 — sửa luật, hình và độ ổn định

## Đội hình và bản lưu

Đội hình tối đa **4 tướng**. Ba bộ lưu sẵn vẫn dùng chung kho. Bản lưu v7/v5 có 9 tướng được chuyển sang bốn tướng đầu theo vị trí đã lưu, trong cả đội hiện tại lẫn ba bộ. Không xóa tướng sở hữu, cấp, sao, trang bị hay tài nguyên. Hệ tọa độ 9 vị trí nội bộ được giữ cho tương thích dữ liệu kỹ năng/chiến báo, giao diện chỉ hiện bốn vị trí. Thêm tướng thứ năm vào ô trống bị từ chối; chọn ô đang có để thay thế. Gợi ý cũng chỉ chọn bốn. Combo Ngũ Hổ kích hoạt với bốn trong năm thành viên để phù hợp giới hạn đội mới.

## Công trình và luyện quân

Sáu công trình lên tối đa cấp **100**, công trình phụ không vượt Đại điện. Từ cấp L, chi phí lương/gỗ/đá là `ceil([100,160,90] × L × (1 + 0,1 × (L−1)))`. Thời gian gốc `8 + 4L + 0,6 × max(0,L−5)²` giây, sau đó áp VIP/skin như cũ. Cấp 1 giữ nguyên chi phí và thời gian v7. Kho tài nguyên/vật phẩm/tinh hoa tăng giới hạn lên **9.999.999** để tương thích Studio và các cấp xây cao.

Bốn binh chủng có bốn hàng đợi độc lập trong `trainingQueues`. Cung, thương, kỵ và thuẫn luyện đồng thời, mỗi loại một mẻ 20 lính, cùng loại phải đợi. Kiểm tra sức chứa gồm quân trong thành, quân đang luyện và quân đang hành quân để không làm mất lính khi trở về. Bản lưu một hàng đợi cũ chuyển đúng một lần. `training` còn là alias đọc tương thích; các mốc hoàn tất/EXP chỉ cộng một lần.

Chọn công trình mở cảnh quản lý riêng, có nền đại điện/nông trại/xưởng gỗ/mỏ đá/doanh trại/điện rồng, hình công trình, tài nguyên và nút chọn binh chủng. Các thao tác thật vẫn đi qua luật kiểm tra tài nguyên và hàng đợi.

## Hình và chuyển động

- Cả mười skin thành có hình riêng trong atlas 5×2, dùng nhất quán tại kho, giao diện skin, thành phố, thế giới và công thành. Không còn bốn skin dùng biểu tượng lâu đài thay hình. Hiệu ứng vẫn chỉ theo skin đang đeo.
- Ba vùng thế giới có nền cảnh pixel riêng: Thục rừng xanh, Ngụy tuyết, Ngô sông nước. Điểm lương/gỗ/đá dùng cùng hình với túi và có cửa sổ mô tả. Tên và số lượng được giữ cỡ đọc được khi zoom. Cổng có biểu tượng riêng.
- Thành phố có nền cỏ có họa tiết, bố cục mặc định tự vừa khung; pan/zoom bị giới hạn theo vùng có công trình, tránh kéo ra mảng trống. Có nút căn giữa.
- Lính dùng atlas 4 loại × 4 bước đi, dùng chung cho thành, hành quân, thu thập và giao chiến. Đạo quân có cờ, đội ngũ và tuyến đường; hướng lính đổi khi trở về. Vị trí hành quân nội suy giữa các nhịp mô phỏng.
- Tướng có nhịp lấy đà/lao tới/nghiêng người/hồi vị trí bằng easing liên tục, phản ứng trúng đòn, vệt vũ khí/ma pháp và tác động lên từng mục tiêu. Đây là chuyển động của sprite và lớp hiệu ứng, chưa phải bộ khung tay/chân riêng cho toàn bộ 61 tướng.
- Thanh kỹ năng luôn ở trong cửa sổ tướng dưới chỉ số, bấm để đọc và nâng. Sáu chỉ số chính hiện ngay; nút Tất cả chỉ số mở phần còn lại.
- Chiêu mộ có cảnh đài triệu hồi và hình tướng xem trước, kết quả có hình/mảnh thật. Vũ khí có các nhóm bổng/thương/cung/trượng/kiếm/đao/quạt/chùy thay việc dùng cùng hình kiếm.
- PVE là Thiên Tháp 999 tầng, có ảnh tháp và tiến độ. Tầng càng cao tăng enemyScale/cấp/kỹ năng; đội địch cũng tối đa bốn. Tự chuyển tầng và không gửi chiến báo PVE giữ nguyên.

## Hiệu năng

Ảnh dùng bộ nhớ đệm chung khi chuyển cảnh; nền thành và địa hình tĩnh được vẽ một lần rồi tái sử dụng. Canvas xét mật độ điểm ảnh màn hình (giới hạn 2×), tách tọa độ logic 1920×1080 khỏi bộ đệm raster. Bản đồ chạy mục tiêu 30 nhịp vẽ/giây, chiến đấu 60. Vòng mô phỏng hoạt động cập nhật 100 ms; kinh tế/AI khi rảnh mỗi giây. HUD cập nhật phần cần thiết, không dựng lại bảng thông tin và nút kỹ năng liên tục.

Mẫu Chromium headless 1920×1080 sau khởi động: 150 nhịp requestAnimationFrame trong 2,5 giây, trung vị/p95 khoảng 16,7 ms, không ghi nhận tác vụ chính trên 50 ms; bảng bản đồ đứng yên không bị dựng lại trong mẫu 2,2 giây. Đây là số đo máy thử, không bảo đảm FPS trên mọi máy Windows. Nhịp rAF là lịch trình trình duyệt, không đồng nghĩa bản đồ vẽ 60 FPS.

## Studio offline

Nút riêng Max tài nguyên & tiền, Max tiền, Max mảnh, đủ mọi loại trang bị +10 và MAX TẤT CẢ. Hoạt động trực tiếp trên máy, không gọi AI hay mạng. Max tất cả cấp người chơi/VIP, nhận quà VIP hợp lệ một lần, mở tướng thường, tăng cấp/sao/kỹ năng tướng và thú, đủ bộ SSR +10 cho các tướng, công trình 100, kho quân 1.000 và tài nguyên tối đa. Không đánh dấu đã vượt 999 tầng hoặc tự nhận bí kíp chưa đánh BOSS. Bấm lặp không tạo vô hạn bản sao bộ đồ. Xuất JSON trước nếu muốn giữ tiến độ thử nghiệm cũ.

## Kiểm tra

192 kiểm thử luật, dữ liệu, chuyển bản lưu, kho quân, cấp 100, công thức chi phí, bốn hàng đợi, cap bốn tướng và Studio. Luồng UI thử công trình/ba mẻ luyện song song, luôn hiện kỹ năng, chiêu mộ, tự vượt tháp, điểm tài nguyên, lính hành quân, mảnh bản đồ và camera có giới hạn. ZIP cuối kiểm tra qua Python tại đường dẫn có dấu cách, GET/HEAD/404 và mất mạng sau tải HTML. BAT chưa được chạy trên Windows thực tế.
