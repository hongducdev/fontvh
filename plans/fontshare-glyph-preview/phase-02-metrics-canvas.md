---
phase: 2
title: "Typography Metrics Canvas & Solid/Outlines Render"
status: pending
priority: P1
effort: "2h"
dependencies: [1]
---

# Phase 2: Typography Metrics Canvas & Solid/Outlines Render

## Mục tiêu
Dựng cột trái giống 100% hình ảnh mẫu [Image 2]:
- Hiển thị tên ký tự và mã Unicode ở góc trên (`Capital Letter R  U+0052`).
- Nút chuyển đổi `Solid` | `Outlines` (khi Outlines thì chữ dùng viền trong suốt `-webkit-text-stroke`).
- Bốn đường lưới thước đo ngang:
  - `Cap Height` (trên cùng, hiển thị số ví dụ 716).
  - `X height` (ngang đỉnh chữ thường, hiển thị số ví dụ 484).
  - `Baseline` (chân chữ, hiển thị số 0).
  - `Descender` (đáy chữ thường có đuôi g, y, p, q, j, hiển thị số âm ví dụ -211).
- Chữ cái phóng to căn chỉnh chuẩn xác theo tỷ lệ metric.
