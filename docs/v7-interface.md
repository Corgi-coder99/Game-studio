# Giao diện v7

## Độ phân giải và kiểu chữ

Khung logic là **1920 × 1080**. Trình duyệt dùng một tỷ lệ `min(width/1920, height/1080)` cho toàn khung và căn giữa phần dư. Không đổi độ phân giải màn hình Windows. Cửa sổ nhỏ sẽ thu toàn bộ game; dùng toàn màn hình để có diện tích đọc lớn nhất. Bản đồ chuyển tọa độ chuột về khung logic trước khi chọn đối tượng.

| Vai trò | Cỡ tại khung gốc |
| --- | --- |
| Tiêu đề trang | 34 px |
| Tiêu đề khu vực | 26 px |
| Tiêu đề thẻ | 22 px |
| Nội dung, nút | 18 px |
| Nhãn | 16 px |
| Số lượng, nhãn ngắn trong ô nhỏ | 14 px trở lên |
| Mô tả trong cửa sổ | 20 px |

Kích thước hình theo ngữ cảnh: ô vật phẩm 112 px, hình mô tả 260 px, hình tướng chính 580 px vuông, hình thú trong thẻ 190 px, kỹ năng thông thường 72 px, nút kỹ năng trong giao chiến 32 px. Nguồn ảnh dùng chung, không tạo phiên bản nhân vật khác giữa các cửa sổ. Các cảnh phụ chia tại ranh giới khối theo chiều cao đo thực tế, không thu nhỏ chữ riêng từng trang.

## Túi, thú và mô tả

Túi có cột nhóm, lưới 5×4 ô, nhãn số lượng và phân trang. Bấm hình mở cửa sổ có tên, số lượng, công dụng, chỉ số, giới hạn, người đang dùng và thao tác phù hợp. Mô tả dài chia thành trang tối đa bảy đoạn. Nút dùng binh thư/tăng tốc vẫn chọn đích thật và tuân kiểm tra tài nguyên. Dữ liệu chỉ đọc từ kho hiện có, không sao chép số lượng vào trạng thái UI.

Các nhóm: tài nguyên, vật phẩm/vé, trang bị, mảnh tướng, thú, ngoại trang, mảnh bản đồ/bí kíp. Quà VIP và SSR độc quyền tiếp tục dùng kho/owned chung.

Năm thẻ thú luôn giữ nguyên hình, sao/cấp và ba nút căn hàng bên dưới; không tách bằng bộ phân trang. Hình thay đổi ở sao 5. Bấm hình để xem buff đang tính theo cấp/sao và hiệu ứng thức tỉnh.

Ảnh gear mới là atlas 5×2, mũ/giáp/vũ khí/trang sức/cổ vật, quang và ám. Dấu ☀/☾ trên góc là **ấn ngoại hình**, không phát sinh khắc hệ hay buff chiến đấu chưa có. Vũ khí riêng dùng ấn theo đường THẦN của tướng; đồ chung phân bố ổn định theo ID. THẦN và bộ SSR vẫn theo luật v5. Biểu tượng vũ khí đại diện loại ô, chưa là ảnh riêng cho từng tên vũ khí.

Hình tướng chính dùng ô ảnh vuông, căn đúng tâm giữa hai cột trang bị. Bấm ô → kho cùng loại → bấm hình xem mô tả → Trang bị. Đồ của tướng khác vẫn xem được nhưng không đeo chồng. Nút kỹ năng trong trận tách ảnh (xem mô tả) khỏi nút Dùng (thi triển), giữ điều khiển thủ công.

## Đội hình và chiến dịch

Màn đội hình có bộ sưu tập phân trang, chín ô trên nền chiến trường, rồng phía sau và bốn kế hoạch gợi ý. Thuật toán chỉ xét tướng sở hữu, cấp/sao/trang bị thực, vai trò, chỉ số và cặp combo; có đỡ đòn/hỗ trợ khi có sẵn. Vị trí ưu tiên đỡ đòn đầu, hỗ trợ/cung thủ sau. Đây là heuristic minh bạch, không phải tìm tối ưu tuyệt đối hay mô phỏng toàn bộ trận. Chỉ áp dụng khi người chơi bấm, khóa trong giao chiến/hành quân.

Bấm Xuất trận chiến dịch bật tự nối ải và tự chiêu. Thắng tự nhận thưởng một lần, chờ 1,5 giây rồi mở màn tiếp; thua hoặc xong 999 thì dừng. Có nút dừng, cày lại và tốc độ ×1/×2/×4. Không có modal kết quả chặn ải. Cảnh chỉ hiện thông báo ngắn. Dừng chiến dịch vẫn dừng hai cờ tự động và ghi trạng thái rút lui hợp lệ.

Chỉ trận công thành khu vực (`mode=bot`) phát chiến báo mới. PVE 1–999, trại cũ và BOSS bí cảnh không phát chiến báo; chiến lợi bí cảnh vẫn bắt buộc nhận qua thư. Chiến báo PVE cũ được giữ trong bản lưu để tương thích nhưng ẩn khỏi danh sách và bộ đếm chưa đọc. Bản đồ có hai nút Tổng quan / Cận cảnh rõ ràng; lớp khu vực giữ thành BOT, điểm tài nguyên, cổng thường và cổng bí cảnh.

## Kiểm tra

183 bài kiểm thử luật/trạng thái, gồm giới hạn chiến báo mới và đội hình sở hữu. Kiểm tra trình duyệt ở 1920×1080, 1366×768 và 390×844 cho bố cục/điều khiển thu phóng; các cửa sổ phụ được rà để không khuất nút. ZIP cuối phải thử qua Python ở đường dẫn có dấu cách, GET/HEAD/404 và tắt mạng sau tải HTML. BAT chưa được chạy trên Windows thực tế.

## Bổ sung theo các ảnh tham khảo cuối

Nút Thế giới mở lớp khu vực cận cảnh trước; Tổng quan mở địa đồ Tam Quốc. Lớp cận cảnh giữ thu thập, thành BOT, cổng và bí cảnh, không chuyển các chức năng này sang địa đồ.

Đội hình có trận đồ cố định trên và dải toàn bộ tướng sở hữu kéo ngang dưới. Vuốt ngang trên cảm ứng, cuộn chuột trong dải hoặc dùng hai nút mũi tên; vẫn kéo tướng từ dải vào chín ô. Lưu `squads` gồm đúng ba bộ với tướng, binh chủng, linh long và mục tiêu quân. Các bộ là phương án dùng chung kho; một bộ kích hoạt và một đạo quân thế giới xuất phát tại một thời điểm, chưa có ba cuộc hành quân đồng thời. Không tạo thêm bản sao tướng/quân.

Phân bổ quân có lựa chọn bốn binh chủng, số dự kiến và tự điền. Sức chứa = 60 + floor((cấp người chơi−1)/5) × 10, tối đa 250. Tự điền lấy min(sức chứa, kho lính), công thành yêu cầu ít nhất 60. Mục tiêu số lượng chưa trừ kho; khi xuất quân trừ đúng số thật, sau trận trả số sống sót. Tắt tự bổ sung dùng số đã chọn. Thu thập vẫn dùng 60 quân/lượt. Cỡ đạo quân công thành tác động HP và hai công theo sqrt(quân xuất phát/60), ngoài tăng trưởng binh chủng theo cấp vốn có. Chi phí quân và số sống sót theo mô hình cũ (thắng còn 80%, thua còn 50%); đây là mô hình thử nghiệm, không giả định công thức của trò chơi tham khảo.

Chiến báo công thành mở cảnh hai phe đối chiếu: kết quả, mục tiêu, thời gian, HP tổng, sát thương/hồi/nhận; mỗi trang ba tướng mỗi phe, thanh HP riêng và tình trạng bị hạ. Bấm tướng xem toàn bộ chỉ số thực đã ghi và số lần mỗi chiêu. Phân tích & gợi ý nâng cấp mở các bảng đầy đủ và lời khuyên theo trận. Số quân bắt đầu/còn lại được ghi riêng cho các trận mới; báo cáo cũ không bịa số quân còn thiếu.
