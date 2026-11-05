---
phase: 1
title: "Font Metrics Calculation & Data Schema"
status: pending
priority: P1
effort: "1h"
dependencies: []
---

# Phase 1: Font Metrics Calculation & Data Schema

## Mục tiêu
Cung cấp bộ thông số typographic chính xác cho từng font (Cap Height, X Height, Baseline, Descender, Units Per Em) để hiển thị trên thước đo của Canvas.

## Công việc
- [ ] Bổ sung trường `metrics` vào kiểu dữ liệu hoặc tính toán trực tiếp theo tỷ lệ chuẩn typography.
- [ ] Xây dựng từ điển tra cứu tên đầy đủ của ký tự (ví dụ: 'R' -> 'Capital Letter R', 'à' -> 'Latin Small Letter A with Grave', v.v.).
