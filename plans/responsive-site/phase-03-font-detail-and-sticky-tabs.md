# Phase 3: Tối ưu Trang Chi tiết Font & Dải Tab Sticky trên Mobile

## Mục tiêu
- **Dải Tab Sticky (`components/font-detail-tabs.tsx`)**:
  - Dải tab phụ di động: thêm cuộn ngang với hiệu ứng mặt nạ bóng mờ (`no-scrollbar mask-fade-right`), đảm bảo các nút tab có diện tích chạm an toàn (`min-h-[38px]`).
  - Nút tải về CTA trên thanh sticky: thích ứng co giãn linh hoạt trên mobile, không bị vỡ hoặc đẩy lệch header.
- **Hero Metadata & Banner**:
  - Banner tiêu đề font siêu lớn: sử dụng kích thước fluid `text-[38px] sm:text-[64px] md:text-[96px] lg:text-[124px]` để tên dài không bị gãy 3 hàng trên điện thoại nhỏ.
  - Hàng thông số (styles, variable, giấy phép, kích thước) co giãn mượt mà không bị tràn viền.

## Danh sách công việc
- [x] 3.1: Tinh chỉnh dải tab sticky trên mobile với hỗ trợ swipe, fade mask và diện tích chạm an toàn.
- [x] 3.2: Tối ưu hàng Hero Metadata và tiêu đề font lớn trên màn hình hẹp trong `components/font-detail-tabs.tsx`.
