---
phase: 4
title: "Glyphs Search & Enhanced Inspector"
status: pending
priority: P2
effort: "2h"
dependencies: [1]
---

# Phase 4: Glyphs Search & Enhanced Inspector

## Mục tiêu
Nâng cấp `components/glyph-inspector.tsx` để đạt độ chi tiết và trực quan tương tự tab Glyphs của Fontshare Satoshi:
- Bộ lọc danh mục mở rộng: Tiếng Việt (đầy đủ 134 ký tự có dấu), Chữ hoa Latin, Chữ thường Latin, Chữ số & Tiền tệ (₫, $, €, £, ¥), Ký hiệu & Dấu câu, Latinh mở rộng.
- Thanh tìm kiếm ký tự tức thì (nhập ký tự hoặc mã Unicode hex ví dụ "0041" để lọc nhanh).
- Modal / Panel soi ký tự phóng to kích thước lớn, hiển thị tên ký tự, mã Unicode (U+XXXX), mã HTML Entity, mã CSS Unicode escape (`\XXXX`), cùng nút copy một chạm.

## Danh sách công việc
- [ ] Thêm thanh tìm kiếm glyph thời gian thực vào `glyph-inspector.tsx`.
- [ ] Mở rộng kho glyph và danh mục hiển thị (đặc biệt là ký tự tiền tệ ₫ và Latin Extended).
- [ ] Hoàn thiện modal soi chi tiết với đầy đủ thông số mã code và nút sao chép.
