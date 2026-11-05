# Phase 1: Sửa lỗi Build & Tối ưu Header, Mobile Navigation, Layout Shell

## Mục tiêu
- Khắc phục lỗi TypeScript hiện tại trong `components/fonts-browser.tsx` (`family.preview.text` -> `family.name`).
- Hoàn thiện trải nghiệm Header và Điều hướng trên thiết bị di động (Mobile Navigation):
  - Tối ưu kích thước header, đảm bảo khoảng cách padding an toàn (`env(safe-area-inset)`).
  - Tích hợp ô tìm kiếm mở rộng (expandable search) hoặc modal tìm kiếm nhanh trên mobile khi bấm biểu tượng kính lúp thay vì chỉ chuyển hướng đơn thuần.
  - Đảm bảo touch target >= 44x44px cho tất cả các liên kết và nút bật tắt giao diện sáng/tối.
- Thêm các tiện ích CSS trong `app/globals.css` hỗ trợ thanh cuộn ẩn (`scrollbar-none`), hiệu ứng bóng mờ cạnh cuộn (`mask-fade`).

## Danh sách công việc
- [x] 1.1: Sửa lỗi type `family.preview.text` trong `components/fonts-browser.tsx`.
- [x] 1.2: Bổ sung CSS utilities trong `app/globals.css` (ẩn scrollbar, fade mask, touch targets).
- [x] 1.3: Nâng cấp `components/SiteNav.tsx` hỗ trợ thanh tìm kiếm inline/expandable trên mobile và tối ưu touch target.
- [x] 1.4: Tinh chỉnh header trong `app/layout.tsx` và footer trên các kích thước màn hình nhỏ.
