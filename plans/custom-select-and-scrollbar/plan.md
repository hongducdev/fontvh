# Plan: Cải thiện giao diện Select và Scrollbar theo phong cách fontvh

## 1. Bối cảnh & Vấn đề
- **Select**: Ảnh đính kèm từ người dùng cho thấy khi nhấp vào thẻ `<select>` (cụ thể là ở bộ chọn cặp font - Pairing Studio), trình duyệt mở popup danh sách `option` mặc định của hệ điều hành với nền trắng tinh, highlight xanh lam Windows, không ăn nhập với tông nền tối đen (`#000000`/`#0d0d0d`) và thiết kế tối giản, sắc nét của fontvh.
- **Scrollbar**: Chưa có cấu hình tùy chỉnh cho thanh cuộn toàn site. Trên Windows, thanh cuộn mặc định to 16-17px, màu xám nhạt phá vỡ phong cách typography cao cấp.

## 2. Giải pháp

### Phần A: Global CSS (`app/globals.css`)
1. **Scrollbar styling**:
   - WebKit scrollbar (`::-webkit-scrollbar`, `::-webkit-scrollbar-thumb`, `::-webkit-scrollbar-track`):
     - Mảnh (6px - 8px), bo góc tròn dạng capsule nhẹ.
     - Dark theme: Thumb màu bán trong suốt `rgba(255, 255, 255, 0.18)`, hover lên `rgba(255, 255, 255, 0.32)`.
     - Light theme: Thumb màu `rgba(0, 0, 0, 0.18)`, hover lên `rgba(0, 0, 0, 0.32)`.
   - Chuẩn CSS hiện đại `scrollbar-width: thin` và `scrollbar-color` cho Firefox.
   - Thêm helper classes: `.scrollbar-thin`, `.scrollbar-none` / `.no-scrollbar`, `.custom-scrollbar`.

2. **Native Select fallback styling**:
   - Khai báo `color-scheme: dark` / `light` trực tiếp trên thẻ `select`.
   - Thiết lập `background-color: var(--panel)` và `color: var(--panel-ink)` cho thẻ `select` và `option`.
   - Giúp mọi thẻ `<select>` nguyên bản (nếu còn dùng) không bao giờ bị popup trắng chói mắt.

### Phần B: Tạo Component `<CustomSelect>` (`components/custom-select.tsx`)
- Thay thế dropdown native bằng component UI custom thanh lịch, đúng chuẩn editorial design:
  - Nút bấm (Trigger): Hairline border (`border border-line`), nền `bg-panel` hoặc `bg-soft`, chữ `text-panel-ink`, chevron icon xoay mượt khi mở/đóng.
  - Hộp menu chọn (Dropdown menu): Nổi trên cùng (`z-50`), nền `bg-panel`, viền `border border-line`, đổ bóng `shadow-2xl`, hiệu ứng bo góc nhẹ, có thanh cuộn mượt (`custom-scrollbar`) khi danh sách dài.
  - Các mục chọn (Option item): Hiệu ứng hover mềm mại `hover:bg-soft`, hiển thị nhãn font (label) + phụ đề phân loại (sublabel) mờ tinh tế, có đánh dấu `CheckIcon` cho mục đang được chọn.
  - Accessibility: Đầy đủ điều hướng bằng bàn phím (Phím mũi tên lên/xuống, Enter, Space, Escape, Tab), click ra ngoài tự động đóng menu (`pointerdown` event listener).

### Phần C: Áp dụng vào các trang/thành phần
1. `components/font-pairs-inspector.tsx`: Thay thế `partner-font-select` (nơi xuất hiện trong ảnh của người dùng).
2. `components/diacritics-inspector.tsx`: Thay thế bộ chọn kiểu dáng chữ (Style Selector).
3. `components/glyph-inspector.tsx`: Thay thế bộ chọn kiểu dáng chữ của bảng glyphs.
4. `components/fonts-browser.tsx`: Nâng cấp bộ chọn sắp xếp (Sort By).

---

## 3. Kế hoạch triển khai
- [x] Nghiên cứu cấu trúc code và nguyên nhân lỗi giao diện
- [x] Cập nhật `app/globals.css` với các rule scrollbar và native select
- [x] Viết component `components/custom-select.tsx`
- [x] Tích hợp vào `components/font-pairs-inspector.tsx`
- [x] Tích hợp vào `components/diacritics-inspector.tsx`
- [x] Tích hợp vào `components/glyph-inspector.tsx`
- [x] Tích hợp vào `components/fonts-browser.tsx`
- [x] Kiểm tra build dự án (`npm run build`) đảm bảo không có lỗi type/compile
