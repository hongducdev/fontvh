---
phase: 1
title: "Tab Navigation & Layout Shell"
status: pending
priority: P1
effort: "2h"
dependencies: []
---

# Phase 1: Tab Navigation & Layout Shell

## Mục tiêu
Tạo giao diện điều hướng dạng Tab chuẩn Fontshare (Specimen, Styles, Features, Glyphs, Pairs) trên trang `/fonts/[slug]`, hỗ trợ:
- Điều hướng chuyển đổi tab mượt mà hoặc cuộn tới vị trí tương ứng.
- Giữ thanh công cụ dính trên đầu (Sticky Sub-nav) với các nút tải .zip và đếm styles/glyphs.
- Cấu trúc trang linh hoạt, hiển thị đầy đủ thông tin font (Tên, Foundry, Giấy phép, Variable, Hỗ trợ tiếng Việt).

## Danh sách công việc
- [ ] Cập nhật `app/fonts/[slug]/page.tsx` và tạo component điều phối Tabs (`FontDetailView.tsx` hoặc tương đương).
- [ ] Tích hợp 5 tab chính: Specimen, Styles, Features, Glyphs, Pairs.
- [ ] Hỗ trợ đồng bộ URL hash / state để người dùng có thể chia sẻ liên kết trực tiếp vào tab mong muốn (ví dụ `/fonts/lora#features`).
