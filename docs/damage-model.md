# Mô hình sát thương v3

Đây là công thức do dự án thiết kế để thử nghiệm chiến thuật và có thể kiểm thử. Chưa xác minh được công thức nội bộ của Infinity Kingdom; không sử dụng các hằng số này như số liệu chính thức của game đó. Nguồn và giới hạn đối chiếu ghi trong reference-analysis.md.

## Các bước tính

1. Chọn công và phòng thủ: đòn thường dùng physicalAtk/armor; kỹ năng dùng loại của tướng (bảng bên dưới). Pháp công bằng ATK × 1,12 cho tướng phép, ×0,8 cho tướng vật lý. Vật công bằng ATK sau buff đội hình/binh chủng.
2. Phá giáp của Quan Vũ giảm 25% giáp vật lý trong thời gian hiệu lực. Không giảm kháng phép.
3. Giảm sát thương theo `100 / (100 + phòng thủ)`; giáp/kháng không âm.
4. Hệ số lực lượng còn lại: `0,6 + 0,4 × HP hiện tại / HP tối đa`. Khiên giúp bảo toàn HP và sức mạnh đội quân.
5. Nhân hệ số kỹ năng, khắc nguyên tố (1,25 nếu có), khắc binh chủng (1,2 nếu có), buff công (1,2), dấu Thiên Nhãn (1,25), giảm sát thương Hổ Tướng (0,9) và bạo kích (1,5 nếu có).
6. Làm tròn đến số nguyên, tối thiểu 1. Khiên hấp thụ trước, phần còn lại trừ HP; báo cáo ghi HP thực mất và lượng khiên hấp thụ. Thiêu đốt gây 15 sát thương chuẩn mỗi giây, đi thẳng vào HP.

Ví dụ ở đầy lực lượng: vật công 100, giáp địch 100, khắc nguyên tố, đòn hệ số 1 → `round(100 × 100/200 × 1,25) = 63`. Pháp công 150, kháng phép địch 50 cùng điều kiện → 125; nếu bạo kích → 188. Các ví dụ này được xác minh trong kingdom.test.mjs.

## Hồ sơ tướng

| Tướng | Loại kỹ năng | Giáp | Kháng phép | Tỷ lệ bạo kích |
|---|---|---:|---:|---:|
| Tôn Ngộ Không | Vật lý | 28 | 20 | 12% |
| Quan Vũ | Vật lý | 35 | 24 | 8% |
| Na Tra | Phép | 18 | 28 | 8% |
| Gia Cát Lượng | Phép / hỗ trợ | 18 | 34 | 5% |
| Dương Tiễn | Phép | 26 | 30 | 10% |
| Triệu Vân | Vật lý | 30 | 22 | 10% |
| Trư Bát Giới | Vật lý / hộ vệ | 40 | 28 | 5% |
| Điêu Thuyền | Phép / khống chế | 18 | 32 | 5% |

Bạo kích dùng bộ sinh số giả ngẫu nhiên có seed theo trại và đội hình để tái hiện kết quả khi kiểm thử. Không dùng cho gacha (gacha vẫn theo cơ chế cũ).

## Binh chủng, vị trí và phối hợp

- Thuẫn: +12% HP, khắc Thương. Thương: +5% ATK, khắc Kỵ. Cung: +10% ATK, khắc Thuẫn. Kỵ: +15 nộ ban đầu, khắc Cung.
- Mỗi loại có kho quân riêng; xuất chinh lấy đúng 60 quân loại đang chọn, thu thập/trở về/thu hồi bản lưu hoàn quân đúng loại.
- Hai ô đầu là hàng trước, hai ô sau là hàng sau. Đòn thường ưu tiên tiền phong cùng cột, sau đó tiền phong còn lại; khi cả hai bị hạ mới đánh hàng sau. Một số kỹ năng có quy tắc chọn mục tiêu riêng.
- Khiên không cộng dồn, lấy giá trị cao hơn; hồi máu không hồi sinh. Buff/khắc chế áp dụng cùng các combo điển tích đã ghi trong game-design.md.
- Báo cáo trong sân đấu ghi sát thương cả hai phe theo vật lý/phép/chuẩn, số lần bạo kích, khiên hấp thụ; đây không phải bảng chỉ tính sát thương của đội người chơi.
