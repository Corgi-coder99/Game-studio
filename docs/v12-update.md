# v12 — Tiên thành, giao dịch và bản cài điện thoại

## Cảnh và triệu hồi

Thế giới dùng ba nền tự nhiên liền cảnh (Thục, Ngụy, Ngô), có rừng núi, sông nước và cỏ chuyển tiếp; bỏ các cụm cây có đế đất như nhãn dán. Thành mở rộng khung đất và phân khu, dùng một nền thành hoàn chỉnh chứa tường/cổng/cầu nối liền cùng góc nhìn. Có sân vườn, kênh, nhà dân, đèn, hạc, dân đi lại/làm việc và rồng. Chu kỳ ngày (6–18 giờ), chạng vạng và đêm lấy `Date.getHours()` trên thiết bị của người chơi; có mặt trời, trăng, sao và mây chuyển động. Không lấy giờ UTC của máy chủ để ép ngày/đêm.

Tám hộp mảnh D→SSR dùng atlas pixel riêng, từ gỗ đơn giản tới hộp tiên ngọc. Chiêu mộ hỗ trợ 1/10/100 bằng ngọc hoặc vé. Mỗi lô trả tiền, tính pity và trao tất cả kết quả một lần; hiện cả lô thành thẻ có icon, tên, phẩm và mảnh. Lô 100 cuộn được; không đợi từng tướng. Hiệu ứng lóe pixel từ tâm mở ra trong 0,65s, tắt khi đóng; bỏ qua không đổi thưởng. Tám họ hiệu ứng chiến đấu có 8 khung xuất hiện/va chạm/tan biến, cỡ nhỏ trên mục tiêu, thay dải cánh hoa hình học lớn. Đòn thường cũng dùng hiệu ứng pixel.

## Vàng và thương mại

Vàng được lưu riêng trong `commerce.gold`, không đổi tên/mất số ngọc cũ. Đổi lô ở Thương Các theo 4 thức ăn = 2 gỗ = 1 đá = 1 vàng. Không có vòng đổi tạo tiền. Cửa hàng hộp/mảnh dùng vàng; ngọc vẫn chiêu mộ/tăng cấp theo luật cũ. Thắng BOT nhận thêm 50 + 20 × cấp BOT vàng. PvP thành công chuyển tối đa 10% vàng không đặt cọc và 5% từng vật tư của đối thủ, không tự tạo tiền; trần kho vẫn 9.999.999.

Vạn Bảo Lâu là công trình đấu giá, mở hệ thống phòng thật. Túi trong phòng cho kéo thả hoặc bấm chọn, nhập số lượng rồi tính giá. Định giá và giới hạn 50–200% giá cơ sở được kiểm tra tại máy chủ phòng, không chỉ trong giao diện. Đấu giá 60 giây, tăng ít nhất 5% mỗi lần, giữ món và tiền trước, hoàn tiền khi bị vượt giá; hết hạn trao một lần. Không hủy khi đã có người đặt giá. Đồ đang đeo, vũ khí riêng/VIP, điểm gacha thú và mảnh VIP không giao dịch.

Thư Tín Các gửi món có điều kiện vàng hoặc vật phẩm tương đương (50–200% giá món), giữ tối đa 10 phút. Thanh toán đủ mới chuyển món; từ chối/hủy/hết hạn hoàn lại một lần. Kho được kiểm tra cả phần đang đặt cọc để không làm mất tiền/vật phẩm khi hoàn. Chủ phòng kiểm tra người gửi lệnh, mã lệnh, số dư, quyền sở hữu và trạng thái. Đây là phòng chơi tin cậy offline, không phải nền kinh tế có tài khoản/anti-cheat Internet.

## Di chuyển thành và giao chiến

Chọn thành hoặc tọa độ trên bản đồ đại lục (x150–950, y100–650); thời gian thường = tối thiểu 10s, hoặc khoảng cách ×0,15s. Cổng đi trong 1s, có hồi cổng 5s. Trong khi đi, thành gốc còn tại chỗ và hình ảo xuất hiện ở điểm đến, kèm thông báo đang di chuyển. Hình ảo chịu 5 lượt đánh rồi hủy; thành về nguyên vị trí và không thể bắt đầu di chuyển 60s. Nhiệm vụ sống trong bản lưu, không tự mất khi mở lại.

Đến mỗi vùng tạo thế hệ ba BOT mới (tên/vị trí/cấp/kho/quân), giữ ID nền để tương thích bản lưu. Vào nước khác quốc gia gốc khiến BOT bản địa thù địch, chủ động tập kích; đang đi có thể đánh hình ảo, sau khi đến có thể cướp vật tư hoặc bị đội trấn thủ chặn. Trong phòng, người chơi dùng ba đội đã lưu để trấn thủ BOT hoặc xuất 60 quân công thành/hình ảo. Tướng/đội đang triển khai không được dùng trùng. PvP dùng đội hình, trang bị và luật theo lượt thật; có quân dành riêng cho giao chiến và thương vong hai phía. Bản đồ phòng hiển thị đường hành quân, tiến trình và kết quả; chưa phát lại trận PvP bằng màn chiến đấu đầy đủ của solo.

## Điện thoại và kết nối

Xem [mobile/README.md](../mobile/README.md). APK Android là ứng dụng native chứa lõi game WebView, mã Bluetooth LE Java và tất cả ảnh/mã cục bộ; không cần mạng để chơi đơn. Dự án Xcode iPhone/iPad chứa WKWebView, CoreBluetooth Swift và cùng lõi game. Hai phía dùng cùng UUID/giao thức GATT, chia/ghép gói, nén và gửi bản cập nhật thay vì lặp toàn bộ kho.

Phòng tối đa bốn thiết bị, một chủ xử lý mọi lệnh theo thứ tự; game solo tạm dừng trong phòng để tránh hai kho thay đổi cùng lúc. Mất kết nối giữ dữ liệu/đặt cọc tại chủ; có khôi phục phòng chủ đã lưu và kết nối lại. Đóng/rời khi còn kết nối hoàn các giao dịch/quân còn sống, không tự nhân bản phần đang đặt cọc. Không xóa dữ liệu máy chủ khi còn phòng/giao dịch chưa kết thúc.

Chế độ kiểm thử máy tính dùng BroadcastChannel, được ghi rõ trên giao diện; không giả là Bluetooth. Native bundle tách PNG cục bộ khỏi mã HTML, giảm bộ nhớ so với nhúng 100MB base64 vào WebView. Windows vẫn có HTML độc lập để tương thích.

## Kiểm chứng và giới hạn

235 kiểm thử, gồm 18 kiểm thử mới cho vàng, lô 100, chu kỳ giờ địa phương, di chuyển/hình ảo, đấu giá, thư, bảo toàn quân/tài sản, đồng bộ nén và cập nhật. Hai phiên trình duyệt thật đã tạo phòng, kéo thả món, đặt giá, chốt phiên, thanh toán thư, di chuyển chung và đánh hình ảo. Có kiểm tra bản đóng gói cuối khi ngắt mạng.

Android đã biên dịch Java với SDK35, tạo dex/APK và xác minh chữ ký v2/v3; là APK test ký cục bộ. Chưa chạy trên điện thoại thật hoặc kiểm tra phần cứng Bluetooth. iOS là dự án Xcode đầy đủ tài nguyên, chưa biên dịch/ký vì môi trường Linux không có Xcode/Apple SDK/chứng chỉ. Chưa kiểm tra kết nối Android↔iOS thực tế; cần hai máy thật để xác nhận tương thích, băng thông và hành vi khi app vào nền. Không có IPA đã ký. BAT cũng chưa chạy trên Windows. Toàn bộ 61 tướng chưa có hoạt họa tay/chân riêng theo từng khung; hiệu ứng phép mới là atlas động.
