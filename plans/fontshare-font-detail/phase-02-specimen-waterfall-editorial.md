---
phase: 2
title: "Specimen Nâng cao (Waterfall & Editorial Layout)"
status: pending
priority: P1
effort: "2h"
dependencies: [1]
---

# Phase 2: Specimen Nâng cao (Waterfall & Editorial Layout)

## Mục tiêu
Nâng cấp `components/specimen-tester.tsx` để cung cấp trải nghiệm thử chữ toàn diện như Satoshi trên Fontshare:
- Chế độ xem Custom Hero Specimen (nhập liệu trực tiếp, chỉnh size, weight, line-height, letter-spacing, text-transform, đảo màu canvas).
- Chế độ xem Waterfall (Type Ladder): Hiển thị font ở các bậc kích thước giảm dần (96px, 72px, 60px, 48px, 36px, 24px, 18px, 14px, 12px) với câu pangram tiếng Việt hoặc text tùy chỉnh.
- Chế độ xem Editorial / Magazine: Bố cục bài báo hoàn chỉnh (Title, Subhead, 2 cột nội dung văn bản) để người dùng thẩm định độ dễ đọc ở kích thước chữ thực tế (Body text rhythm).

## Danh sách công việc
- [ ] Bổ sung bộ chuyển đổi chế độ xem trong Specimen: `[Khung thử tự do]`, `[Thang kích thước Waterfall]`, `[Bố cục bài báo Editorial]`.
- [ ] Xây dựng giao diện Waterfall bậc thang kích thước chữ.
- [ ] Xây dựng layout Editorial đa cột với văn bản tiếng Việt mẫu tinh tế.
