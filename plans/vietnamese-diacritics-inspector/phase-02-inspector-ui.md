# Phase 2: Xây dựng Giao diện Soi Dấu & Thước đo (Diacritics & Anchor Canvas)

> Trạng thái: **Hoàn thành (Completed)**  
> Mục tiêu: Dựng giao diện chuẩn typographic tương tự phong cách Fontshare / Typewolf, tối ưu cho việc quan sát dấu.

## Công việc hoàn thành
1. Tạo component `components/diacritics-inspector.tsx`:
   - Thanh điều khiển: Style selector, Toggle Thước đo typographic, Switch chế độ hiển thị (Aa, A, a).
   - Cột trái: Khung soi phóng to (Anchor Zoom View) với SVG căn chuẩn chính xác tỉ lệ metrics.
   - Thước typographic 5 đường dóng: Accent Ceiling, Cap Height, X-Height, Baseline, Descender.
   - Cột phải: Bảng Ma trận Dấu (Vowel Matrix Grid) 6 thanh điệu x 13 nguyên âm.
