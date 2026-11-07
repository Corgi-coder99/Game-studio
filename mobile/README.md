# Thiên Mệnh v12 — Android và iPhone/iPad

Lõi game được đóng trong ứng dụng native sử dụng WebView/WKWebView. Mọi ảnh và mã game nằm sẵn trong ứng dụng; chơi đơn không dùng Internet. Android dùng API Bluetooth LE của hệ điều hành; iOS dùng CoreBluetooth. Không cần tài khoản, server Internet hay AI khi chơi.

## Android

Cài `Thien-Menh-v12-Android.apk` (Android 8 trở lên, WebView hệ thống còn được cập nhật). Đây là APK thử nghiệm ký cục bộ, không phải bản Play Store. Cho phép cài ứng dụng từ nguồn đang dùng nếu hệ điều hành hỏi. Chạy ngang màn hình; kéo và chụm hai ngón để xem thành/bản đồ. Studio → Xuất bản lưu mở hộp thoại lưu JSON trên Android.

Đã biên dịch mã Java với Android SDK 35, tạo dex, đóng gói và xác minh chữ ký APK v2/v3. Chưa cài và chạy trên điện thoại thật trong môi trường này; chưa kiểm tra phần cứng Bluetooth/range/băng thông hoặc vòng đời khi tắt màn hình.

Để tự build trên Linux với JDK và SDK chính thức đã giải nén (platform `android-35`, build-tools `android-15`):

```sh
npm run build:offline
python3 mobile/build-android.py --sdk /path/to/sdk/extracted --keystore /private/path/test.keystore
```

Giữ keystore riêng nếu muốn ký các bản cập nhật cùng chữ ký. Không đưa keystore vào Git. Xuất bản lưu trước khi thay ứng dụng ký bởi khóa khác.

## iPhone / iPad

`Thien-Menh-v12-iOS-Project.zip` có dự án Xcode, mã Swift, lõi game và toàn bộ ảnh offline. Cần iOS/iPadOS 16.4 trở lên. Giải nén trên Mac, mở `ThienMenh.xcodeproj`, chọn Team trong Signing & Capabilities, cắm iPhone/iPad và Run. Có thể dùng tài khoản phát triển Apple phù hợp với cách cài/thiết bị của bạn. Không có IPA đã ký: môi trường Linux hiện tại không có Xcode, Apple SDK hay chứng chỉ của bạn. Dự án Swift chưa được biên dịch/kiểm tra trên Xcode hoặc iPhone thật.

Để tạo lại dự án đầy đủ từ nguồn:

```sh
npm run build:offline
python3 mobile/prepare-ios.py
```

## Phòng Bluetooth chung Android ↔ iOS

1. Một máy mở Đồng hành → Tạo phòng Bluetooth. Máy chủ cần hỗ trợ BLE peripheral/advertising; nếu không, đổi máy khác làm chủ.
2. Các máy còn lại nhập mã 4 số chủ phòng, chọn tìm Bluetooth và chọn máy chủ được tìm thấy.
3. Cho phép Bluetooth/Thiết bị ở gần (Android cũ có thể hỏi vị trí để quét). Giữ Bluetooth bật, ứng dụng ở phía trước và các máy ở gần nhau. Không cần Wi-Fi, LAN hoặc Internet.
4. Phòng tối đa 4 máy. Sàn đấu giá, thư thu hộ, di chuyển thành và quân được máy chủ xử lý theo thứ tự. Game solo tạm dừng trong phòng để tránh hai bản kho đồ cùng thay đổi.
5. Đội hình lấy từ ba đội đã lưu trước khi vào phòng. Đặt đội trấn thủ để chặn BOT; đội còn lại tấn công thành người chơi hoặc hình ảo điểm đến. Bản đồ chung hiển thị các thành/đường hành quân. Các trận dùng chỉ số/đội hình thật và cơ chế theo lượt; giao diện phòng hiện tiến trình/kết quả thay vì mở lại màn chiến đấu solo.
6. Khi mất kết nối, phòng và tài sản đặt cọc được giữ, không tự phát bản sao vật phẩm. Nối lại chủ phòng. Máy chủ có thể khôi phục phòng đã lưu sau khi mở lại app; chia sẻ mã mới. Không xóa dữ liệu máy chủ khi còn giao dịch.
7. Đóng/rời phòng khi đang kết nối sẽ hủy các giao dịch đang mở có liên quan, hoàn vật phẩm/vàng đặt cọc và hoàn quân còn sống. Chủ phòng giữ dữ liệu phòng trong bộ nhớ cục bộ.

Hai ứng dụng dùng cùng UUID GATT và cùng giao thức chia gói/ghép gói ASCII; dữ liệu được nén và chỉ truyền phần thay đổi sau bản đồng bộ đầu. Điều này đã được kiểm thử ở lớp dữ liệu và hai phiên trình duyệt, **chưa được xác minh Bluetooth Android ↔ iOS bằng hai thiết bị thật**. Không coi bản này là bản phát hành multiplayer đã chứng nhận phần cứng.

## Kiểm thử trên máy tính

Đồng hành có chế độ rõ tên “kiểm thử cục bộ”: mở hai thẻ cùng trình duyệt, đổi ID thiết bị thử ở một thẻ trước khi tạo/vào phòng. Chế độ này dùng BroadcastChannel trong cùng trình duyệt, không giả làm Bluetooth. Dùng bản lưu thử; hai thẻ cùng origin chia sẻ vùng lưu trình duyệt.

## Đấu giá, thư và tiền vàng

Sàn Vạn Bảo Lâu nằm trong thành. Chọn/kéo món chưa đeo, chọn số lượng và định giá trong biên 50–200% bảng giá. Không giao dịch vật phẩm/tướng VIP bị khóa hoặc điểm gacha thú. Đấu giá 60 giây; lượt sau tăng ít nhất 5%. Vật phẩm và tiền đặt cọc được trừ trước; người bị vượt giá được hoàn lại. Hết hạn không có giá thì hoàn món.

Thư thu hộ giữ vật phẩm 10 phút, có thể yêu cầu vàng hoặc vật phẩm có thể giao dịch trong túi người nhận, với giá trị tương đương. Người nhận phải thanh toán đủ mới nhận món. Từ chối/hủy/hết hạn hoàn món, mỗi lệnh có mã chống thực thi trùng. Ngọc giữ riêng cho chiêu mộ; cửa hàng mua bán và giao dịch dùng vàng. Tỉ lệ cơ sở: 4 thức ăn = 2 gỗ = 1 đá = 1 vàng, quy đổi theo lô trong Thương Các. Thắng cướp thành BOT nhận 50 + 20 × cấp BOT vàng; thắng PvP lấy tối đa 10% vàng và 5% vật tư người thua, có giới hạn kho.
