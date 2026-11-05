# Kế hoạch Nâng cấp Chi tiết Review Font theo Phong cách Fontshare (Satoshi)

> Trạng thái: **Hoàn thành (Completed)**  
> Tham chiếu: `https://www.fontshare.com/fonts/satoshi`  
> Dự án: `fontvh` (`/fonts/[slug]`)  
> Ngày hoàn thành: 2026-11-05

---

## 1. Mục tiêu Tổng quan
Tái cấu trúc và nâng cấp toàn diện trang chi tiết font (`/fonts/[slug]`) để mang đến trải nghiệm thẩm định kiểu chữ chuyên sâu, tinh tế và tương tác thời gian thực tương đương với Fontshare Satoshi:
1. **Specimen Studio**: Đa chế độ xem gồm Thử tự do (Playground), Bậc thang kích thước chuẩn Fontshare (Waterfall ladder: 96px → 12px), và Bố cục bài báo tạp chí hai cột (Editorial layout).
2. **Styles Catalog**: Trình diễn toàn bộ hệ thống trọng lượng/kiểu dáng với khả năng đồng bộ câu mẫu và thanh trượt cỡ chữ.
3. **OpenType Features Inspector**: Công cụ tương tác trực quan với các tính năng typography nâng cao (`liga`, `ss01`, `frac`, `tnum`, `case`, `zero`, `sups`, `locl`) kèm nút bật/tắt và copy mã CSS tương ứng.
4. **Glyphs Character Map**: Bản đồ ký tự phân chia theo danh mục (Tiếng Việt 134 ký tự, Chữ hoa, Chữ thường, Số & Tiền tệ `₫`, Dấu câu, Latinh mở rộng), thanh tìm kiếm glyph thời gian thực và modal soi chi tiết chuẩn typographic.
5. **Pairs Studio**: Phòng thử phối hợp font tương tác trực tiếp, cho phép hoán đổi vai trò Tiêu đề / Văn bản và điều chỉnh tỷ lệ cấp bậc thị giác.

---

## 2. Tiến độ triển khai các Phase

| Phase | Nội dung | Trạng thái |
| :--- | :--- | :---: |
| **Phase 1** | Tab Navigation & Layout Shell (`components/font-detail-tabs.tsx`, `app/fonts/[slug]/page.tsx`) | **Hoàn thành** |
| **Phase 2** | Specimen Nâng cao: Playground, Waterfall & Editorial (`components/specimen-tester.tsx`) | **Hoàn thành** |
| **Phase 3** | OpenType Features Inspector tương tác (`components/font-features-inspector.tsx`) | **Hoàn thành** |
| **Phase 4** | Glyphs Search & Modal Inspector (`components/glyph-inspector.tsx`) | **Hoàn thành** |
| **Phase 5** | Pairs Studio, Tích hợp & Kiểm thử (`components/font-pairs-inspector.tsx`) | **Hoàn thành** |

---

## 3. Danh sách File thay đổi và tạo mới
- [`app/fonts/[slug]/page.tsx`](file:///D:/MyProjects/fontvh/app/fonts/[slug]/page.tsx): Điều phối qua Server Component & tích hợp `FontDetailTabs`.
- [`components/font-detail-tabs.tsx`](file:///D:/MyProjects/fontvh/components/font-detail-tabs.tsx): Sticky sub-nav header với 5 tab điều hướng, Hero banner, bảng thông số kỹ thuật và giấy phép.
- [`components/specimen-tester.tsx`](file:///D:/MyProjects/fontvh/components/specimen-tester.tsx): Bổ sung 3 chế độ xem (Playground, Waterfall, Editorial) với đầy đủ thanh trượt typographic controls.
- [`components/font-features-inspector.tsx`](file:///D:/MyProjects/fontvh/components/font-features-inspector.tsx): Bộ kiểm tra OpenType features với công tắc ON/OFF, so sánh trực quan và sao chép CSS.
- [`components/glyph-inspector.tsx`](file:///D:/MyProjects/fontvh/components/glyph-inspector.tsx): Danh mục ký tự mở rộng, tìm kiếm tức thì theo chữ cái / hex Unicode, modal soi ký tự chi tiết có phím tắt Escape.
- [`components/font-pairs-inspector.tsx`](file:///D:/MyProjects/fontvh/components/font-pairs-inspector.tsx): Phòng thử phối font tương tác với tính năng đổi vai trò và slider cỡ chữ.
- [`components/icons.tsx`](file:///D:/MyProjects/fontvh/components/icons.tsx): Bổ sung `SearchIcon`.
