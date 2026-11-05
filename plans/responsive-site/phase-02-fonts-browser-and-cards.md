# Phase 2: Tối ưu Danh mục Bộ font & Thẻ FontshareCard trên Mobile

## Mục tiêu
- **Toolbar & Filter Controls trong `components/fonts-browser.tsx`**:
  - Hàng Pangram presets: chuyển từ nhiều dòng wrap gây vỡ layout sang dải cuộn ngang mượt mà (`overflow-x-auto`) có hiệu ứng fade cạnh (`mask-fade-right`).
  - Hàng Danh mục (Category pills): cuộn ngang không che khuất màn hình.
  - Tối ưu kích thước chữ thử và khoảng cách trên màn hình hẹp.
- **Thẻ `components/FontshareCard.tsx`**:
  - Header thẻ: Ẩn 3 thanh trượt Weight / Size / Leading dạng micro-slider trên mobile (`hidden md:flex`), giữ lại tên font, ngôi sao yêu thích, kiểu chữ dropdown và số lượng kiểu chữ / Variable badge.
  - Chuyển toàn bộ các thanh trượt chi tiết vào ngăn kéo "Tùy chỉnh" (`isDrawerOpen`) khi mở trên mobile với thanh trượt to bản dễ chạm.
  - Ô Textarea Specimen: áp dụng CSS fluid scaling `clamp(26px, 12vw, ${size}px)` để chữ lớn không tràn màn hình và xóa minHeight cố định theo pixel gây khoảng trống thừa.
  - Bottom bar: Đảm bảo tên tác giả không đẩy tràn nút tải về; các nút bấm có chiều cao tối thiểu 38-44px thân thiện với ngón tay.

## Danh sách công việc
- [x] 2.1: Tối ưu hàng mẫu câu Pangram và bộ lọc danh mục trong `components/fonts-browser.tsx` trên mobile.
- [x] 2.2: Tinh gọn Header thẻ font và chuyển thanh trượt chi tiết vào ngăn kéo trên mobile trong `components/FontshareCard.tsx`.
- [x] 2.3: Áp dụng fluid typography `clamp()` cho ô chữ thử trong `components/FontshareCard.tsx`.
- [x] 2.4: Hoàn thiện thanh thao tác dưới đáy thẻ font (Bottom Bar) cho trải nghiệm ngón tay cái (thumb-friendly).
