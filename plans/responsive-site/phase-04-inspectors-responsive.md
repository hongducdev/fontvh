# Phase 4: Tối ưu Bộ công cụ Chuyên sâu (Soi dấu, Ký tự, Features, Cặp font)

## Mục tiêu
- **Soi Dấu Tiếng Việt (`components/diacritics-inspector.tsx`)**:
  - Đóng băng (Sticky) cột nguyên âm đầu tiên (`row.baseChar`) khi người dùng cuộn ngang bảng ma trận 6 thanh điệu trên mobile, giúp không bị mất ngữ cảnh nguyên âm đang xem.
  - Thêm dòng thông báo gợi ý cuộn ngang ("Vuốt ngang để xem đủ 6 thanh điệu →").
  - Tối ưu kích thước ô hiển thị và phản hồi khi chạm (touch feedback), kèm thanh mini preview bar ở mobile với nút xem metrics.
- **Soi Ký tự Glyph Inspector (`components/glyph-inspector.tsx`)**:
  - Tối ưu số cột lưới theo kích thước màn hình (`grid-cols-6 sm:grid-cols-8 md:grid-cols-10 xl:grid-cols-12`).
  - Khi người dùng cuộn xuống chọn ký tự trong bảng ở mobile, bổ sung thanh mini-bar cố định dưới đáy hiển thị ký tự vừa chọn, mã Unicode và nút "Xem thước đo" cuộn mượt lên diagram.
- **Tính năng OpenType (`components/font-features-inspector.tsx`)**:
  - Đảm bảo thẻ so sánh trước/sau xếp chồng hoàn hảo, font chữ so sánh co giãn linh hoạt theo chiều rộng màn hình.
- **Studio Cặp Font (`components/font-pairs-inspector.tsx` & `components/pairings-view.tsx`)**:
  - Tối ưu bộ thanh trượt kích cỡ, ô nhập văn bản thử nghiệm và nút hoán đổi vai trò font trên mobile, ứng dụng fluid clamp typography.

## Danh sách công việc
- [x] 4.1: Sticky cột nguyên âm và thêm chỉ báo cuộn cho Ma trận Soi dấu (`components/diacritics-inspector.tsx`).
- [x] 4.2: Thêm thanh mini-action bar khi chọn glyph trên mobile và tối ưu lưới ký tự (`components/glyph-inspector.tsx`).
- [x] 4.3: Tinh chỉnh giao diện OpenType Features và code snippets trên màn hình nhỏ.
- [x] 4.4: Tối ưu Studio ghép cặp font và trang `/pairings` trên mobile.
