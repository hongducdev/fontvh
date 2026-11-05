# Kế hoạch Xây dựng Bản soi dấu tiếng Việt chuyên sâu (Diacritics & Anchor Inspector)

> Trạng thái: **Hoàn thành (Completed)**  
> Mục tiêu: Cung cấp công cụ chuyên sâu cho Type Designer & Web Developer để thẩm định chất lượng việt hóa của font chữ: vị trí dấu thanh, dấu mũ, dấu móc, độ cân đối, va chạm và khả năng hỗ trợ Unicode tiếng Việt đầy đủ.

---

## 1. Phân tích Bài toán & Giá trị cốt lõi

### Vấn đề thực tế trong Font tiếng Việt:
1. **Lỗi va chạm (Collision):** Dấu thanh (`'`,`~`,`?`) đè lên dấu mũ (`â`,`ê`,`ô`) hoặc dấu trăng (`ă`).
2. **Lỗi đặt dấu móc (Horn Placement):** Móc trên `ơ`, `ư` đặt quá xa thân chữ, dính bết, hoặc kích thước bất tương xứng.
3. **Lỗi dấu nặng (Dot Below):** Dấu nặng nằm quá sát chân chữ hoặc rơi quá thấp.
4. **Lỗi kích thước dấu (Diacritic Scale):** Dấu thanh teo nhỏ, mỏng manh không tương xứng với độ dày của nét chữ hoa hoặc chữ đậm (Bold).
5. **Cụm từ kiểm tra thực tế (Stress Test):** Người dùng cần nhìn thấy các từ tiếng Việt "nặng dấu" trong ngữ cảnh tự nhiên để đánh giá nhịp điệu (rhythm) và khoảng cách chữ (kerning).

---

## 2. Kiến trúc & Các thành phần chính

Giao diện **Diacritics & Anchor Inspector** gồm 3 khu vực:

### A. Diacritics Matrix (Ma trận Dấu tiếng Việt)
- Phân nhóm trực quan:
  - **Nguyên âm cơ bản:** A, E, I, O, U, Y & các biến thể có dấu (hoa & thường).
  - **Nguyên âm có dấu phụ:** Ă, Â, Ê, Ô, Ơ, Ư (đầy đủ 5 dấu thanh: sắc, huyền, hỏi, ngã, nặng).
  - **Ký tự đặc biệt:** Đ, đ.
- Tương tác: Click vào bất kỳ chữ nào để đưa vào Khung soi phóng to (Anchor & Metrics Inspector).

### B. Anchor & Metrics Inspector (Khung soi chi tiết ký tự)
- Khung hiển thị SVG lớn với tỷ lệ chính xác từ font metrics (`unitsPerEm`).
- Tùy chọn hiển thị đường dóng (Typographic Guides):
  - **Diacritics Ceiling**: Đỉnh dấu phụ cao nhất (chống cắt dấu hoa).
  - **Cap Height**: Đỉnh chữ hoa.
  - **X-Height**: Đỉnh chữ thường.
  - **Baseline**: Đường chân cơ sở.
  - **Descender**: Đáy chân ký tự có đuôi (`y, p, q`).
- Hiển thị thông tin ký tự: Tên Unicode, mã Hex (`U+1EDE`), phân loại dấu, nút sao chép ký tự hoa/thường.
- So sánh song song: Hoa vs Thường (`Ơ` / `ơ`, `Ở` / `ở`).

### C. Stress Test Playground (Thử nghiệm Cụm từ nhạy cảm)
- Danh sách các bộ từ "thách thức" độ hoàn thiện của font:
  - Dấu kép & móc: *khỏe khoắn, phở bò, cổ thụ, cửa sổ, lượn lờ, bận rộn...*
  - Chữ Đ & hoa: *Đà Lạt, Đường đời, Điểm tựa, Đồng khởi...*
  - Câu toàn vẹn tiếng Việt: *"Việt Nam đất nước ta ơi, mênh mông biển lúa đâu trời đẹp hơn."*
- Cho phép chỉnh Size, Style (Regular, Medium, Bold, Italic...) và ô gõ thử tự do với bộ gõ tiếng Việt.

---

## 3. Các Phase triển khai

| Phase | Nội dung công việc | File liên quan | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Phase 1** | Chuẩn hóa bộ dữ liệu ký tự dấu & ma trận nguyên âm tiếng Việt | `lib/vietnamese-diacritics.ts` | **Hoàn thành** |
| **Phase 2** | Xây dựng Component `DiacriticsInspector` với Typographic Guides | `components/diacritics-inspector.tsx` | **Hoàn thành** |
| **Phase 3** | Xây dựng khu vực Stress Test, tích hợp Tab vào `FontDetailTabs` | `components/font-detail-tabs.tsx`, `components/diacritics-inspector.tsx` | **Hoàn thành** |
