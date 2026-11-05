# fontvh

Thư viện font tiếng Việt: duyệt họ chữ, thử specimen, tải woff2 + bản gốc.
Next.js 16 (App Router) + Tailwind 4, catalog sinh tự động từ file font.

## Chạy

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

`catalog` chạy tự động trước `dev` và `build`: quét `fonts/`, đọc metadata bằng
fontkit, chuyển sang woff2, ghi `data/catalog.json` + `app/font-faces.css`.

## Thêm một họ chữ

```
fonts/<slug>/
  meta.json          # tuỳ chọn nhưng nên có
  *.ttf | *.otf      # bản gốc, tự động chuyển woff2
  OFL.txt            # nếu dùng giấy phép OFL
```

`meta.json`:

```json
{
  "name": "Tên hiển thị",
  "designer": "Người vẽ",
  "foundry": "Xưởng chữ",
  "description": "Mô tả ngắn bằng tiếng Việt.",
  "categories": ["sans", "serif", "display", "mono", "script"],
  "license": "ofl",
  "releasedAt": "2025-01-01"
}
```

`license` nhận `ofl`, `cc0`, `commercial-free`, `proprietary`. Nếu bỏ trống,
catalog suy ra `ofl` khi có `OFL.txt`, ngược lại là `commercial-free`.

Chạy `npm run catalog` rồi tải lại trang. Không cần sửa code.

## Catalog tự tính

- `weight`, `italic`: đọc từ OS/2, head, post của file font.
- `axes`: trục variable (`wght`…) và tên các instance có sẵn.
- `vietnamese`: kiểm tra đủ 134 ký tự có dấu trên cmap của font.
- `dong`: ký hiệu `₫`.
- `glyphs`, `size`: số glyph và dung lượng bản gốc.

Font thiếu dấu vẫn lên thư viện nhưng bị đánh dấu “Thiếu dấu” và bị loại khỏi
bộ lọc “Đủ dấu tiếng Việt”.

## Font demo

Bốn họ chữ đầu tiên (Be Vietnam Pro, Lora, Manrope, Playfair Display) là font OFL dùng để kiểm chứng pipeline — thay bằng font của bạn trong `fonts/` khi có.

## Giấy phép

Chỉ đưa lên thư viện những font bạn có quyền phân phối lại. Gói tải về luôn
kèm file license gốc nếu có trong thư mục family.

## Ảnh chia sẻ (OG)

Mỗi họ chữ có ảnh OG riêng tại `/fonts/<slug>/opengraph-image`. Ảnh dùng font
của chính họ chữ khi tìm được instance tĩnh:

1. `assets/og/<slug>.ttf` — ưu tiên, dùng cho font variable.
2. File `.ttf`/`.otf` không variable trong `fonts/<slug>/`.
3. Không có → chữ hệ thống.

Tạo instance tĩnh bằng fonttools:

```bash
python -m fontTools.varLib.instancer "fonts/lora/Lora[wght].ttf" wght=400 -o assets/og/lora.ttf
```

## Triển khai

Đặt `NEXT_PUBLIC_SITE_URL` (ví dụ `https://fontvh.vn`) để sitemap, robots và
canonical dùng đúng domain.
