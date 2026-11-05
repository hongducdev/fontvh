# Kế hoạch Triển khai: Tối ưu Responsive Toàn diện fontvh (Responsive Site)

## Mục tiêu
Tối ưu hóa toàn diện trải nghiệm giao diện người dùng (UI/UX) và khả năng tương thích đa thiết bị (Mobile 360px–480px, Tablet 768px–1024px, Desktop & Ultrawide) cho toàn bộ trang web **fontvh** theo chuẩn Typography cao cấp (lấy cảm hứng từ Fontshare, Typewolf và Google Fonts).

## Danh sách các Phase
- [x] [Phase 1: Sửa lỗi Build & Tối ưu Header, Mobile Navigation, Layout Shell](./phase-01-header-nav-foundation.md) — *Hoàn thành*
- [x] [Phase 2: Tối ưu Danh mục Bộ font & Thẻ FontshareCard trên Mobile](./phase-02-fonts-browser-and-cards.md) — *Hoàn thành*
- [x] [Phase 3: Tối ưu Trang Chi tiết Font & Thanh Sticky Sub-Nav Tabs](./phase-03-font-detail-and-sticky-tabs.md) — *Hoàn thành*
- [x] [Phase 4: Tối ưu Bộ công cụ Chuyên sâu (Soi dấu, Ký tự, Features, Cặp font)](./phase-04-inspectors-responsive.md) — *Hoàn thành*
- [x] [Phase 5: Kiểm thử Build, Kiểm tra Đa độ phân giải & Hoàn thiện](./phase-05-testing-and-polish.md) — *Hoàn thành*

## Danh sách tệp tin đã tối ưu
- `app/globals.css`: Utilities cho scrollbar-none, scroll masks (`.mask-fade-right`, `.mask-fade-edges`), safe area padding, ngăn viewport horizontal jitter.
- `components/SiteNav.tsx`: Nâng cấp điều hướng mobile, thanh tìm kiếm inline collapsible, touch targets đạt chuẩn WCAG (>= 44px).
- `app/layout.tsx`: Thêm backdrop-blur cho sticky header trên mobile, tích hợp SiteNav linh hoạt.
- `components/fonts-browser.tsx`: Sửa lỗi type TS line 500 (`family.name`), chuyển bộ pangram và category filters sang dải vuốt ngang mượt mà.
- `components/FontshareCard.tsx`: Tinh gọn header thẻ font trên màn hình nhỏ (giấu inline micro-sliders, chuyển sang drawer "Tùy chỉnh" với slider cảm ứng), áp dụng fluid specimen typography `clamp(26px, 12vw, ${size}px)`.
- `components/font-detail-tabs.tsx`: Thêm edge fade mask cho dải tab mobile vuốt ngang, tối ưu sticky action bar và fluid hero typography.
- `components/diacritics-inspector.tsx`: Sticky đóng băng cột nguyên âm đầu tiên khi vuốt ngang bảng ma trận 6 thanh điệu, bổ sung floating quick-preview bar trên mobile với nút "Xem metric ↑".
- `components/glyph-inspector.tsx`: Lưới ký tự responsive `grid-cols-6 sm:grid-cols-8 md:grid-cols-10 xl:grid-cols-12` kèm floating bar xem lại metric.
- `components/specimen-tester.tsx`: Tối ưu dải chế độ xem (Playground, Waterfall, Editorial) vuốt ngang mượt, fluid typography clamp cho live specimen.
- `components/font-pairs-inspector.tsx` & `components/pairings-view.tsx`: Responsive sliders, swap font roles, và fluid heading typography `clamp(22px, 7vw, ${size}px)`.
- `components/font-features-inspector.tsx`: Thẻ so sánh OpenType trước/sau responsive, tự động bẻ dòng và ngắt từ mượt mà trên mobile.

## Kết quả kiểm thử
- `npm run build`: Hoàn thành thành công (Exit Code 0).
- 15/15 Static Routes SSG được biên dịch và render hoàn hảo.
