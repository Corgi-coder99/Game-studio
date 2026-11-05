# Giao diện v6

Các cảnh bảng dùng chiều cao viewport, nút Trước/Sau và chuyển cảnh thay cuộn dọc. Cảnh lớn được chia tại ranh giới thẻ, các khối không thể chia được thu vừa màn hình. Thay đổi kích thước cửa sổ tự tính lại trang.

Bộ sưu tập ưu tiên tướng đã sở hữu, bao gồm năm tướng VIP. Bấm chân dung mở cửa sổ hình nhân; trên desktop có thể kéo tướng vào chín ô cùng trang. Điện thoại dùng nút Xếp đội hoặc chọn ô. Trang bị quanh hình nhân mở kho chung bằng hình, phân trang sáu món; vẫn kiểm tra chủ sở hữu, vũ khí riêng, trạng thái chiến đấu, chi phí và giới hạn cường hóa qua luật hiện có.

Quà VIP giữ nguyên một nguồn dữ liệu: vật phẩm tại account.bag, mảnh tại account.shards, trang bị tại inventory, tướng tại owned. Không tạo bản sao vật phẩm cho UI. Túi đồ có tab riêng cho từng loại, hình vật phẩm vector nguyên bản và chân dung mảnh tướng.

Nền window-scenes-pixel.png được tạo nguyên bản, ba cảnh: đại sảnh, kho báu, quân doanh. CSS chọn vùng ảnh tương ứng. Builder nhúng ảnh một lần, không cần mạng khi chơi.

Hình tướng trên thẻ, chân dung, mảnh, đội hình và sân đấu dùng chung atlas toàn thân (tám tướng đầu chuyển sang battle-units-pixel). Cảnh nhân vật có hình phóng lớn cùng tướng ở hậu cảnh và chuyển động xuất hiện. Không đổi hình giữa thẻ và cửa sổ chi tiết.
