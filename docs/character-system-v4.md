# Hệ thống chiến đấu và tiến triển v4

Roster: characters.mjs; cấp/đồ/gacha/di chuyển đội: progression.mjs; mô phỏng: tactics.mjs. Kingdom điều phối kinh tế và nhận thưởng.

Đội 3×3, đánh thường gây vật lý. Sát thủ ưu tiên hàng sau; cận chiến đánh tuyến trước còn sống. Kỹ năng có loại sát thương riêng và mục tiêu theo từng nhân vật. Mana hồi theo giây; nộ chủ yếu từ đánh/nhận sát thương. Chiêu cần 70% mana hoặc toàn bộ nộ tối đa và hết hồi chiêu.

Giảm sát thương = 100/(100+kháng tương ứng). Áp dụng hệ số kỹ năng, lực lượng còn lại, nguyên tố, binh chủng, chí mạng; sau đó chặn, khiên và HP. Phản/hút máu dựa trên HP thực mất, không tạo chuỗi phản. Đây là công thức riêng của bản thử nghiệm, không phải công thức được xác nhận của Infinity Kingdom.

Khiên không cộng dồn; tự thân tối đa 30% HP, đồng đội 15%. Chặn tối đa 70%, phản/hút tối đa 50%. Hồi sinh đúng một lần 30% HP. Kết liễu khi HP dưới 10%, vẫn tôn trọng miễn sát thương và hồi sinh. Thiêu đốt giảm hồi máu 50%. Miễn nhiễm sát thương vẫn nhận bất lợi; vô địch xóa và ngăn bất lợi, không thể gây sát thương trong thời gian hiệu lực.

Trang bị không thể đồng thời đeo cho nhiều tướng; vũ khí riêng bị khóa đúng chủ. Nhập save kiểm tra cấp/đồ/đội hình và sở hữu. Save cũ được bổ sung trường mới, giữ tài nguyên và tướng. Trận đang chạy không được lưu; xuất JSON để sao lưu.

Nghệ thuật: hai atlas RGBA mới 6×4, 24 nhân vật mỗi atlas do công cụ tạo ảnh tạo riêng. Atlas cũ giữ 8 nhân vật. Không lấy tài sản từ Infinity Kingdom.
