# Phase 5: Kiểm thử Build, Kiểm tra Đa độ phân giải & Hoàn thiện

## Mục tiêu
- Chạy kiểm tra TypeScript và build production với lệnh `npm run build`.
- Kiểm định hiển thị giao diện qua các độ phân giải tiêu chuẩn:
  - Mobile nhỏ: 360px (Android tiêu chuẩn)
  - Mobile thông dụng: 390px / 414px (iPhone 13/14/15/16)
  - Tablet: 768px (iPad dọc)
  - Desktop / Laptop: 1024px, 1440px
- Kiểm tra tính dễ tiếp cận (Accessibility), kích thước touch target đạt chuẩn WCAG (tối thiểu 44x44px).
- Báo cáo kết quả và đồng bộ kế hoạch.

## Danh sách công việc
- [x] 5.1: Chạy build production `npm run build` và xác nhận không còn bất kỳ lỗi nào (Exit code 0, 15/15 routes static SSG).
- [x] 5.2: Kiểm tra responsive trên các breakpoint chính (360px, 390px, 768px, 1024px, 1440px) với fluid typography clamp, sticky headers/sub-navs và swipeable pills.
- [x] 5.3: Hoàn tất tài liệu và đồng bộ trạng thái kế hoạch.
