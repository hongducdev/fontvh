# Phase 3: Stress Test Playground & Tích hợp vào FontDetailTabs

> Trạng thái: **Hoàn thành (Completed)**  
> Mục tiêu: Hoàn thiện khu vực thử nghiệm từ ngữ thực tế và gắn tab "Soi dấu" vào trang chi tiết font chữ.

## Công việc hoàn thành
1. Bổ sung mục Stress Test vào `components/diacritics-inspector.tsx`:
   - Phân loại bộ từ: Dấu móc & mũ kép, Dấu nặng chân chữ, Chữ hoa có dấu, Văn bản mẫu.
   - Thanh trượt chỉnh cỡ chữ (20px - 64px), ô nhập liệu thử dấu tự do kèm thẻ chọn nhanh.
2. Tích hợp Tab vào `components/font-detail-tabs.tsx`:
   - Thêm tab `diacritics` ("Soi dấu") vào tab bar desktop & mobile.
   - Hash URL hỗ trợ `#diacritics` đồng bộ 2 chiều.
3. Kiểm thử & biên dịch:
   - `npx tsc --noEmit` đạt 0 lỗi.
   - `npm run build` xuất thành công 15/15 trang tĩnh.
