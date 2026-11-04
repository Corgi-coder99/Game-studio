# Thiên Mệnh — bản chơi thử 0.1

Mục tiêu: thử vòng lặp sưu tầm anh hùng → lập đội → chiến đấu → nhận tiền → chiêu mộ. Giao diện tiếng Việt, dùng trình duyệt, chưa cần tài khoản.

## Nhân vật và chiến đấu

8 nhân vật lấy cảm hứng từ Tam Quốc, Tây Du Ký và Phong Thần. Chân dung pixel 2D được tạo bằng AI, dùng atlas 4 cột × 2 hàng trong assets/heroes-pixel.png, theo đúng thứ tự danh sách nhân vật. Nền Hổ Lao Quan dùng assets/hulao-pixel.png. Ảnh tĩnh hiện dùng cho thẻ, đội hình và chiến đấu; chưa có hoạt ảnh sprite. Bản offline nhúng toàn bộ PNG vào HTML. Đội gồm đúng 5 tướng khác nhau. Mỗi tướng còn sống của người chơi đánh một lần mỗi vòng, lần lượt từ trái sang phải; người chơi chọn địch. Sau đó các địch còn sống phản công, ưu tiên tướng đầu tiên còn sống. Không ngẫu nhiên trong chiến đấu.

Hỏa khắc Mộc, Mộc khắc Thủy, Thủy khắc Hỏa: sát thương ×1,35. Mỗi vòng thứ 3, từng tướng có thể chọn tuyệt kỹ ×1,6 thay cho đòn đánh thường. Sát thương làm tròn số nguyên. HP về 0 thì không được hành động hoặc chọn làm mục tiêu. Thắng khi toàn bộ địch bị hạ; thua khi toàn bộ đội bị hạ. Có thể chơi lại một ải duy nhất. Phần thưởng: thắng 300, thua 50 linh ngọc.

## Gacha mô phỏng

Ban đầu: 1.800 linh ngọc, 5 tướng (Triệu Vân, Trư Bát Giới, Điêu Thuyền, Na Tra, Gia Cát Lượng). Một lượt giá 100; có nút 1 hoặc 10 lượt. Tỷ lệ cơ bản: SSR 5%, SR 25%, R 70%; chọn đều trong nhóm hiếm tương ứng. Lượt thứ 30 liên tiếp chưa nhận SSR bảo đảm SSR; nhận SSR đặt lại bộ đếm. Trong lượt bảo hiểm, xác suất SSR là 100%. Thẻ trùng hoàn lại 25 linh ngọc. Không thanh toán, không tiền thật, không giao dịch.

## Studio và lưu trữ

Sửa HP (50–300) và ATK (10–80) theo nhân vật; áp dụng cho đội người chơi từ trận mới, không thay địch. Có khôi phục từng thẻ. Dữ liệu nằm trong localStorage; cho phép xuất/nhập JSON có kiểm tra cấu trúc. Xóa dữ liệu trình duyệt sẽ mất tiến độ nếu chưa xuất. Không đồng bộ giữa thiết bị. Đây là sandbox: chỉnh dữ liệu và chơi lại để thử cân bằng là chủ đích, không phải nền kinh tế chống gian lận.

Studio hỗ trợ Codex qua AGENTS.md, thiết kế và mẫu yêu cầu có thể sao chép. Chưa có tích hợp API hay bộ điều phối Codex từ trình duyệt. Không mô phỏng các slash command/hook riêng của Claude.

## Bước tiếp theo

1. Thử độ vui và cân bằng ải đầu; thêm kỹ năng riêng, vai trò hỗ trợ và vị trí chiến thuật.
2. Thêm ải, cốt truyện, lưu chiến dịch và tranh gốc.
3. Chỉ bổ sung tài khoản, backend hoặc tự động hóa Codex khi đã xác định nhu cầu và ngân sách.
