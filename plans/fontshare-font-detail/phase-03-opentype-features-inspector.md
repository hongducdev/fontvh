---
phase: 3
title: "OpenType Features Inspector"
status: pending
priority: P1
effort: "3h"
dependencies: [1]
---

# Phase 3: OpenType Features Inspector

## Mục tiêu
Fontshare nổi tiếng với tab "Features" cho phép thử nghiệm trực quan các tính năng typography nâng cao của file font. Tạo component mới `components/font-features-inspector.tsx` để cung cấp trải nghiệm này.

## Tính năng OpenType được hỗ trợ:
1. **Ligatures (`liga`, `dlig`)**: fi, fl, ff, ffi, ffl, Th, st.
2. **Stylistic Alternates (`salt`, `ss01`, `ss02`)**: Các kiểu dáng chữ cái thay thế (ví dụ chữ a, g, t dạng hình học vs truyền thống).
3. **Fractions (`frac`)**: Biến 1/2, 3/4, 5/8 thành phân số typography chuẩn.
4. **Tabular Figures vs Proportional Figures (`tnum` / `pnum`)**: Số thẳng cột phục vụ bảng biểu kế toán vs số tự nhiên.
5. **Case-Sensitive Forms (`case`)**: Nâng vị trí dấu ngoặc ( [ { và gạch nối - — lên ngang tầm chữ hoa.
6. **Slashed Zero (`zero`)**: Số 0 có gạch chéo phân biệt với chữ O.
7. **Superscript & Subscript (`sups`, `subs`)**: Số mũ x² + y³ = z⁵ và chỉ số dưới H₂O.
8. **Vietnamese Localized Forms / Accents (`locl`)**: Trọng âm dấu tiếng Việt cân đối chuẩn mực.

## Danh sách công việc
- [ ] Tạo component `components/font-features-inspector.tsx`.
- [ ] Mỗi feature có công tắc toggle (ON / OFF) tương tác trực tiếp với CSS `font-feature-settings`.
- [ ] Cho phép người dùng chỉnh sửa chuỗi văn bản thử nghiệm của từng feature.
- [ ] Hiển thị thông số CSS tương ứng để nhà phát triển dễ dàng copy vào dự án của họ.
