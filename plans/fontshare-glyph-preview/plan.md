# Kế hoạch Xây dựng Giao diện Soi Ký tự Glyph Preview Chuẩn Fontshare

> Trạng thái: **Hoàn thành (Completed)**  
> Tham chiếu: Fontshare Satoshi Glyphs Inspection (Image 2)  
> Mục tiêu: Thay thế bảng ký tự dạng lưới phẳng cũ (Image 1) bằng không gian làm việc 2 cột chuẩn typographic của Fontshare.

---

## 1. Phân tích Yêu cầu từ Hình ảnh Mẫu (Image 2)

Giao diện mới gồm 2 khu vực chính:
1. **Tiêu đề & Đếm số lượng**: `{glyphsCount} Glyphs`.
2. **Cột trái - Khung thẩm định chi tiết (Glyph Metrics Canvas)**:
   - Header: Tên đầy đủ của ký tự (ví dụ: `Latin Capital Letter R`), Mã Unicode (`U+0052`).
   - Chuyển đổi hiển thị: `Solid` (nét đặc) | `Outlines` (nét viền trong suốt).
   - Khung vẽ canvas kích thước lớn với 4 đường tham chiếu typographic tiêu chuẩn:
     - **Cap Height**: Đường đỉnh chữ hoa kèm giá trị số (`716`).
     - **X height**: Đường đỉnh chữ thường kèm giá trị số (`484`).
     - **Baseline**: Đường chân cơ sở kèm giá trị số (`0`).
     - **Descender**: Đường chân đuôi kèm giá trị số âm (`-211`).
   - Ký tự được phóng to căn khớp chính xác với đường Baseline và Cap Height.
3. **Cột phải - Bảng điều khiển & Lưới chọn ký tự**:
   - Header điều khiển:
     - Dropdown chọn trọng số kiểu chữ (kết nối trực tiếp dữ liệu styles của họ phông).
     - Chế độ hiển thị: `Basic Set` (chữ hoa, chữ thường, số cơ bản) | `Full Set` (mở rộng đầy đủ tiếng Việt, dấu câu, ký hiệu).
     - Ô nhập gõ chữ tự do: `✎ Type your letters` để lọc hoặc xem các chữ mong muốn.
   - Lưới ký tự phân nhóm trực quan có nhãn bên lề:
     - **Uppercase**: A, B, C, D... Ký tự đang chọn có viền trắng/cream làm nổi bật `[ R ]`.
     - **Lowercase**: a, b, c, d...
     - **Numerals**: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.
     - **Full Set / Vietnamese**: Toàn bộ hệ ký tự có dấu tiếng Việt (hoa & thường) và dấu câu / ký hiệu tiền tệ `₫`.

---

## 2. Các Phase triển khai

| Phase | Nội dung công việc | Trạng thái |
| :--- | :--- | :---: |
| **Phase 1** | Cấu hình & tính toán Font Metrics (Cap Height, X height, Baseline, Descender) | **Hoàn thành** |
| **Phase 2** | Xây dựng Typography Metrics Canvas với chế độ Solid / Outlines | **Hoàn thành** |
| **Phase 3** | Xây dựng Bảng ký tự phân nhóm (Uppercase, Lowercase, Numerals, Vietnamese) với Controls | **Hoàn thành** |
| **Phase 4** | Ghép nối vào `glyph-inspector.tsx`, tinh chỉnh responsive và kiểm thử build | **Hoàn thành** |
