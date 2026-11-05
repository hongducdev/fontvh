import type { Metadata } from "next";

type LicenseInfo = {
  id: string;
  name: string;
  summary: string;
  permissions: string[];
  conditions: string[];
  url: string;
};

const LICENSES: Record<string, Omit<LicenseInfo, "id">> = {
  ofl: {
    name: "SIL Open Font License 1.1",
    summary:
      "Giấy phép phổ biến nhất cho font mã nguồn mở. Được dùng, sửa, nhúng vào sản phẩm và phân phối lại, miễn giữ nguyên thông báo bản quyền.",
    permissions: [
      "Dùng cho mục đích cá nhân và thương mại, kể cả nhúng vào ứng dụng, website, sách in.",
      "Sửa đổi font và phân phối bản sửa, miễn không dùng tên gốc (Reserved Font Name) cho bản sửa.",
      "Đóng gói kèm sản phẩm khác, kể cả sản phẩm bán.",
    ],
    conditions: [
      "Không được bán font riêng lẻ như một sản phẩm độc lập.",
      "Bản phân phối phải kèm file giấy phép OFL và thông báo bản quyền.",
    ],
    url: "https://openfontlicense.org",
  },
  "commercial-free": {
    name: "Miễn phí cho mọi mục đích",
    summary:
      "Nhà thiết kế cho phép dùng font miễn phí cho cá nhân và thương mại. Điều khoản cụ thể nằm trong file license đi kèm gói tải.",
    permissions: [
      "Dùng trên website, sản phẩm in, ứng dụng.",
      "Nhúng vào sản phẩm bán ra.",
    ],
    conditions: [
      "Không bán lại font dưới dạng file.",
      "Đọc file license trong gói tải để biết điều khoản đầy đủ.",
    ],
    url: "",
  },
  cc0: {
    name: "CC0 1.0 Universal",
    summary:
      "Font được hiến tặng cho phạm vi công cộng. Không cần ghi nguồn, không hạn chế mục đích sử dụng.",
    permissions: ["Mọi mục đích, kể cả thương mại.", "Không cần attribution."],
    conditions: ["Không bảo hành chất lượng từ tác giả."],
    url: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  proprietary: {
    name: "Giấy phép riêng của nhà thiết kế",
    summary:
      "Điều khoản do nhà thiết kế đặt riêng. Đọc file license trong gói tải trước khi dùng cho thương mại.",
    permissions: ["Theo quy định trong file license."],
    conditions: ["Liên hệ nhà thiết kế nếu cần quyền ngoài phạm vi."],
    url: "",
  },
};

export function licenseInfo(id: string): LicenseInfo | undefined {
  const entry = LICENSES[id];
  return entry ? { id, ...entry } : undefined;
}

export type { LicenseInfo };
