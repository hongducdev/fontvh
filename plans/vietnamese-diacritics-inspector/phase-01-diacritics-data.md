# Phase 1: Chuẩn hóa Bộ Dữ liệu Dấu tiếng Việt (Diacritics Data Engine)

> Trạng thái: **Hoàn thành (Completed)**  
> Mục tiêu: Xây dựng module dữ liệu chuyên biệt cho toàn bộ 134 ký tự có dấu tiếng Việt, phân loại theo nhóm nguyên âm, thanh điệu, dấu phụ, và danh sách các cụm từ kiểm thử (stress test words).

## Công việc hoàn thành
1. Tạo `lib/vietnamese-diacritics.ts`:
   - Định nghĩa các hằng số: 6 thanh điệu (Ngang, Huyền, Sắc, Hỏi, Ngã, Nặng).
   - Bảng phân rã ma trận: `A`, `Ă`, `Â`, `E`, `Ê`, `I`, `O`, `Ô`, `Ơ`, `U`, `Ư`, `Y`, `Đ`.
   - Mỗi ký tự gồm: ký tự hoa, ký tự thường, tên Unicode tiếng Anh, mô tả tiếng Việt, mã Hex.
   - Danh sách cụm từ thử nghiệm Stress Test Cases (dấu kép, dấu móc, chữ hoa có dấu, dấu nặng).
