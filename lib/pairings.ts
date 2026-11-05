export type FontPairing = {
  id: string;
  title: string;
  category: string;
  description: string;
  heading: {
    slug: string;
    name: string;
    weight: number;
    italic?: boolean;
    sample: string;
  };
  body: {
    slug: string;
    name: string;
    weight: number;
    italic?: boolean;
    sample: string;
  };
  tags: string[];
};

export const pairings: FontPairing[] = [
  {
    id: "playfair-be-vietnam-pro",
    title: "Tạp chí & Văn hóa đương đại",
    category: "Serif + Sans",
    description:
      "Nét tương phản quý phái của Playfair Display kết hợp với sự trong trẻo, dễ đọc của Be Vietnam Pro. Lý tưởng cho tạp chí, bài xã luận, poster và trang chủ thương hiệu cao cấp.",
    heading: {
      slug: "playfair-display",
      name: "Playfair Display",
      weight: 700,
      sample: "Nghệ thuật Typography và Bản sắc Việt Nam.",
    },
    body: {
      slug: "be-vietnam-pro",
      name: "Be Vietnam Pro",
      weight: 400,
      sample:
        "Chữ viết không đơn thuần là phương tiện ghi lại âm thanh; đó là một cấu trúc thị giác mang theo tâm hồn, thẩm mỹ và nhịp sống của cả một nền văn hóa qua từng nét vẽ.",
    },
    tags: ["Editorial", "Tạp chí", "Thanh lịch"],
  },
  {
    id: "lora-manrope",
    title: "Ấn bản số & Tri thức hiện đại",
    category: "Serif + Sans",
    description:
      "Đường cong thư pháp mềm mại của Lora làm nổi bật tiêu đề, nâng đỡ bởi hình khối chuẩn mực, tối giản của Manrope ở phần văn bản.",
    heading: {
      slug: "lora",
      name: "Lora",
      weight: 600,
      sample: "Gìn giữ trọn vẹn thanh điệu tiếng Việt.",
    },
    body: {
      slug: "manrope",
      name: "Manrope",
      weight: 400,
      sample:
        "Mỗi dấu thanh trong hệ chữ Quốc ngữ đòi hỏi sự cân nhắc tỉ mỉ về trọng lượng, độ nghiêng và khoảng cách không gian, giúp mắt người đọc lướt êm ái mà không bị gián đoạn.",
    },
    tags: ["Xuất bản", "Hiện đại", "Dễ đọc"],
  },
  {
    id: "be-vietnam-pro-lora",
    title: "Tiêu đề dứt khoát & Đoạn văn thư thái",
    category: "Sans + Serif",
    description:
      "Sự kết hợp đảo chiều được ưa chuộng trên các nền tảng đọc sách: tiêu đề Be Vietnam Pro dứt khoát dẫn dắt mắt đọc vào những trang văn bản Lora đậm chất văn chương.",
    heading: {
      slug: "be-vietnam-pro",
      name: "Be Vietnam Pro",
      weight: 700,
      sample: "Chữ Việt đẹp tử tế cho người làm nghề sáng tạo.",
    },
    body: {
      slug: "lora",
      name: "Lora",
      weight: 400,
      sample:
        "Khi một bộ font được trau chuốt dấu thanh tiếng Việt từ bản thiết kế gốc, từng con chữ như cất lên tiếng nói tự nhiên, hài hòa và sống động trên mọi màn hình hiển thị.",
    },
    tags: ["Sách báo", "Blog", "Văn chương"],
  },
  {
    id: "playfair-manrope",
    title: "Trưng bày nghệ thuật & Kiến trúc",
    category: "Display + Sans",
    description:
      "Tương phản kịch tính giữa nét thanh nét đậm của Playfair Display với sự lạnh lùng, chuẩn xác của Manrope. Hoàn hảo cho portfolio thiết kế, sự kiện nghệ thuật và kiến trúc.",
    heading: {
      slug: "playfair-display",
      name: "Playfair Display",
      weight: 800,
      sample: "Không gian kiến trúc và ngôn ngữ hình thể.",
    },
    body: {
      slug: "manrope",
      name: "Manrope",
      weight: 400,
      sample:
        "Tự do sáng tạo luôn bắt nguồn từ sự kỷ luật của tỷ lệ. Khoảng trống giữa các ký tự cũng quan trọng như nét mực đen in dấu trên trang giấy trắng.",
    },
    tags: ["Triển lãm", "Kiến trúc", "Sang trọng"],
  },
  {
    id: "nha-trang-duo-be-vietnam-pro",
    title: "Sóng biển nhiệt đới & Nhận diện số",
    category: "Display + Sans",
    description:
      "Nét uốn lượn phóng khoáng mang cảm hứng sóng biển Nha Trang kết hợp cùng Be Vietnam Pro trong trẻo, đa dụng. Lựa chọn nổi bật cho typography poster, thương hiệu du lịch, lễ hội mùa hè và ấn phẩm truyền thông.",
    heading: {
      slug: "nha-trang-duo-display",
      name: "SCCTLM Nha Trang Duo Display",
      weight: 400,
      sample: "NHA TRANG DUO — VŨ ĐIỆU CỦA SÓNG BIỂN",
    },
    body: {
      slug: "be-vietnam-pro",
      name: "Be Vietnam Pro",
      weight: 400,
      sample:
        "Cảm hứng từ những cú xoay lướt sóng và đường cong mềm mại của đại dương, tạo nên diện mạo hiện đại, khỏe khoắn và tràn đầy năng lượng cho từng con chữ tiếng Việt.",
    },
    tags: ["Display", "Du lịch", "Mùa hè", "Poster"],
  },
];

export function getPairing(id: string): FontPairing | undefined {
  return pairings.find((pairing) => pairing.id === id);
}

export function getPairingsForFamily(slug: string): FontPairing[] {
  return pairings.filter(
    (pairing) => pairing.heading.slug === slug || pairing.body.slug === slug
  );
}
