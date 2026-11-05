import Link from "next/link";
import { FontCard } from "@/components/FontCard";
import { ArrowRightIcon } from "@/components/icons";
import { catalog, families } from "@/lib/catalog";
import { pairings } from "@/lib/pairings";

const FEATURES = [
  {
    title: "134 ký tự dấu tiếng Việt",
    body: "Tất cả các nguyên âm có dấu và dấu phụ (ngang, huyền, sắc, hỏi, ngã, nặng) được kiểm tra kỹ lưỡng trên từng file font, bảo đảm không lỗi ô vuông hay nhảy dấu.",
  },
  {
    title: "Miễn phí thương mại 100%",
    body: "Tự do sử dụng cho website, ứng dụng, ấn phẩm in ấn, logo và tài liệu quảng cáo. Kèm đầy đủ file bản quyền chính thức trong gói tải về.",
  },
  {
    title: "Tối ưu WOFF2 & File gốc",
    body: "Định dạng WOFF2 nén siêu nhẹ cho tốc độ tải trang cao nhất, cùng gói file gốc đầy đủ phục vụ cho các phần mềm thiết kế chuyên nghiệp.",
  },
];

export default function HomePage() {
  const hero =
    families.find((family) => family.slug === "be-vietnam-pro") ?? families[0];

  const featuredPairing = pairings[0];

  return (
    <>
      <div className="shell">
        {/* Ticker / Top stats bar */}
        <div className="grid grid-cols-1 gap-2 border-b border-line py-5 md:grid-cols-8">
          <p className="micro md:col-span-5">
            fontvh · Thư viện font Việt · {catalog.stats.families} họ chữ tuyển chọn ·{" "}
            {catalog.stats.styles} style
          </p>
          <p className="micro md:col-span-3 md:text-right">
            100% Miễn phí cho cá nhân và thương mại
          </p>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 border-b border-line md:grid-cols-8">
          <div className="md:col-span-6 md:pr-10">
            <h1
              className="py-10 text-[clamp(64px,12vw,180px)] font-medium leading-[0.9] tracking-[-0.04em] md:py-16"
              style={hero ? { fontFamily: `'${hero.slug}'` } : undefined}
            >
              Chữ Việt
              <br />
              tử tế.
            </h1>
          </div>
          <div className="flex flex-col justify-end gap-8 border-t border-line py-8 md:col-span-2 md:border-t-0 md:border-l md:border-line md:py-16 md:pl-8">
            <p className="text-[15px] leading-[22px] text-muted md:text-[16px] md:leading-[24px]">
              Thư viện font chữ tinh hoa được kiểm duyệt dấu thanh tiếng Việt cẩn
              trọng: vị trí chuẩn xác, khoảng cách êm ái, sắc nét trên mọi màn
              hình hiển thị.
            </p>
            <div className="flex flex-col items-start gap-3">
              <Link href="/fonts" className="btn-solid w-full sm:w-auto">
                Khám phá bộ font
              </Link>
              <Link
                href="/pairings"
                className="link-underline text-[14px] font-bold"
              >
                Xem các cặp font phối hợp →
              </Link>
              <Link
                href="/licenses"
                className="link-underline text-[14px] text-muted hover:text-ink"
              >
                Đọc điều khoản giấy phép
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Fonts Section */}
      <section className="shell mt-16">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <div>
            <h2 className="text-[14px] font-bold">Mới trong bộ sưu tập</h2>
            <p className="micro mt-1">
              Các họ chữ phổ biến nhất trong cộng đồng thiết kế
            </p>
          </div>
          <Link href="/fonts" className="chip">
            Xem toàn bộ {families.length} họ chữ →
          </Link>
        </div>
        <div className="mt-px flex flex-col divide-y divide-line">
          {families.map((family) => (
            <FontCard key={family.slug} family={family} />
          ))}
        </div>
      </section>

      {/* Featured Font Pairing Showcase */}
      {featuredPairing && (
        <section className="shell mt-16">
          <div className="flex items-baseline justify-between border-b border-line pb-4">
            <div>
              <h2 className="text-[14px] font-bold">Cặp font tiêu biểu</h2>
              <p className="micro mt-1">
                Phối hợp hoàn hảo giữa tiêu đề và văn bản
              </p>
            </div>
            <Link href="/pairings" className="chip">
              Khám phá tất cả cặp font →
            </Link>
          </div>

          <div className="border-b border-line bg-panel p-6 text-panel-ink md:p-12">
            <div className="flex items-baseline justify-between text-[14px] text-panel-muted">
              <span className="font-bold text-panel-ink">
                {featuredPairing.title}
              </span>
              <span>{featuredPairing.category}</span>
            </div>

            <div className="my-8 space-y-4">
              <h3
                className="text-[clamp(32px,6vw,72px)] leading-[1.05] tracking-[-0.02em] text-panel-ink"
                style={{
                  fontFamily: `'${featuredPairing.heading.slug}'`,
                  fontWeight: featuredPairing.heading.weight,
                }}
              >
                {featuredPairing.heading.sample}
              </h3>
              <p
                className="max-w-4xl text-[16px] leading-[26px] text-panel-muted md:text-[18px] md:leading-[30px]"
                style={{
                  fontFamily: `'${featuredPairing.body.slug}'`,
                  fontWeight: featuredPairing.body.weight,
                }}
              >
                {featuredPairing.body.sample}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/60 pt-6 text-[14px] text-panel-muted">
              <div>
                Tiêu đề:{" "}
                <Link
                  href={`/fonts/${featuredPairing.heading.slug}`}
                  className="font-bold text-panel-ink underline decoration-panel-muted underline-offset-4"
                >
                  {featuredPairing.heading.name}
                </Link>{" "}
                + Đoạn văn:{" "}
                <Link
                  href={`/fonts/${featuredPairing.body.slug}`}
                  className="font-bold text-panel-ink underline decoration-panel-muted underline-offset-4"
                >
                  {featuredPairing.body.name}
                </Link>
              </div>

              <Link
                href="/pairings"
                className="inline-flex items-center gap-1.5 font-bold text-cream hover:underline"
              >
                <span>Thử nghiệm cặp font này</span>
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Value Proposition Grid (Fontshare 3-box feature strip) */}
      <section className="shell mt-16">
        <div className="grid grid-cols-1 border-t border-line md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className={`border-b border-line py-8 md:border-b-0 md:py-12 ${
                index === 0 ? "md:pr-8" : "md:border-l md:px-8"
              } ${index === 2 ? "md:pr-0" : ""}`}
            >
              <h3 className="text-[16px] font-bold leading-[20px]">
                {feature.title}
              </h3>
              <p className="mt-3 text-[15px] leading-[20px] text-muted">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
