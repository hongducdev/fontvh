import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SpecimenTester } from "@/components/specimen-tester";
import { StylesGallery } from "@/components/styles-gallery";
import { GlyphInspector } from "@/components/glyph-inspector";
import { EmbedCode } from "@/components/embed-code";
import { ArrowRightIcon, DownloadIcon } from "@/components/icons";
import { getFamily, families } from "@/lib/catalog";
import { getPairingsForFamily } from "@/lib/pairings";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function generateStaticParams() {
  return families.map((family) => ({ slug: family.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const family = getFamily(slug);
  if (!family) return { title: "Không tìm thấy font" };

  return {
    title: family.name,
    description: family.description,
    openGraph: {
      title: `${family.name} · fontvh`,
      description: family.description,
    },
  };
}

export default async function FontDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const family = getFamily(slug);
  if (!family) notFound();

  const previewStyle =
    family.styles.find((style) => !style.italic && style.weight === 400) ??
    family.styles[0];

  const matchingPairings = getPairingsForFamily(family.slug);

  return (
    <div className="pb-24">
      {/* Sticky Sub-nav Action Bar */}
      <div className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-xs">
        <div className="shell grid h-14 grid-cols-2 items-center md:grid-cols-12">
          {/* Back link */}
          <Link
            href="/fonts"
            className="flex items-center text-[14px] font-medium text-muted hover:text-ink md:col-span-2 md:border-r md:border-line md:h-full md:pr-4"
          >
            ← Bộ font
          </Link>

          {/* Anchor Navigation Links */}
          <div className="hidden items-center justify-center gap-6 text-[14px] md:col-span-7 md:flex md:h-full">
            <a href="#specimen" className="chip">
              Thử chữ
            </a>
            <a href="#styles" className="chip">
              Kiểu chữ ({family.styles.length})
            </a>
            <a href="#glyphs" className="chip">
              Ký tự ({family.glyphs})
            </a>
            {matchingPairings.length > 0 && (
              <a href="#pairings" className="chip">
                Cặp font
              </a>
            )}
            <a href="#embed" className="chip">
              Mã nhúng
            </a>
            <a href="#license" className="chip">
              Giấy phép
            </a>
          </div>

          {/* Download CTA Button */}
          <div className="flex items-center justify-end md:col-span-3 md:border-l md:border-line md:h-full md:pl-6">
            <a
              href={`/api/download/${family.slug}`}
              download
              className="btn-solid flex items-center gap-2 py-2 px-4 text-[14px]"
            >
              <DownloadIcon />
              <span>Tải .zip ({formatBytes(family.size)})</span>
            </a>
          </div>
        </div>
      </div>

      {/* Font Family Title & Header Info */}
      <div className="shell">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-line py-5 text-[14px] leading-[20px]">
          <span className="font-bold">{family.name}</span>
          <span className="text-muted">{family.styles.length} styles</span>
          {family.axes.length > 0 && (
            <span className="text-muted">Variable font</span>
          )}
          <span className="capitalize text-muted">
            {family.categories.join(" · ")}
          </span>
          <span className="ml-auto hidden text-muted sm:inline">
            {family.vietnamese
              ? "✓ Đầy đủ 134 ký tự có dấu tiếng Việt"
              : "Thiếu một số dấu tiếng Việt"}
          </span>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 border-b border-line md:grid-cols-12">
          {/* Huge Family Title */}
          <div className="py-10 md:col-span-8 md:border-r md:border-line md:py-16 md:pr-10">
            <h1
              className="text-[clamp(56px,11vw,160px)] leading-[0.95] tracking-[-0.03em]"
              style={{
                fontFamily: `'${family.slug}'`,
                fontWeight: previewStyle?.weight ?? 400,
                fontStyle: previewStyle?.italic ? "italic" : "normal",
              }}
            >
              {family.name}
            </h1>
          </div>

          {/* Details & Description Column */}
          <div className="flex flex-col justify-between gap-8 border-t border-line py-8 md:col-span-4 md:border-t-0 md:py-16 md:pl-8">
            <p className="text-[15px] leading-[20px] text-muted md:text-[16px] md:leading-[22px]">
              {family.description}
            </p>

            <div className="space-y-2 border-t border-line/60 pt-6 text-[14px]">
              <div className="flex items-center justify-between text-muted">
                <span>Giấy phép</span>
                <Link
                  href={`/licenses/${family.license.id}`}
                  className="link-underline font-medium text-ink"
                >
                  {family.license.name}
                </Link>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Số lượng ký tự</span>
                <span className="font-medium text-ink">{family.glyphs} glyphs</span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Thiết kế bởi</span>
                <span className="font-medium text-ink">{family.designer}</span>
              </div>
              {family.foundry && family.foundry !== family.designer && (
                <div className="flex items-center justify-between text-muted">
                  <span>Foundry</span>
                  <span className="font-medium text-ink">{family.foundry}</span>
                </div>
              )}
              {family.sourceUrl && (
                <div className="flex items-center justify-between text-muted">
                  <span>Nguồn tham khảo</span>
                  <a
                    href={family.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline font-medium text-ink"
                  >
                    Xem trên Behance ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Specimen Tester */}
      <SpecimenTester
        slug={family.slug}
        name={family.name}
        axes={family.axes}
        styles={family.styles}
        initialWeight={previewStyle?.weight ?? 400}
      />

      {/* Styles Gallery */}
      <StylesGallery
        slug={family.slug}
        name={family.name}
        styles={family.styles}
      />

      {/* Interactive Glyph Inspector */}
      <GlyphInspector
        slug={family.slug}
        name={family.name}
        glyphsCount={family.glyphs}
      />

      {/* Curated Font Pairings for this family */}
      {matchingPairings.length > 0 && (
        <section id="pairings" className="shell mt-16 scroll-mt-20">
          <div className="flex items-baseline justify-between border-b border-line pb-4">
            <div>
              <h2 className="text-[14px] font-bold">Cặp font gợi ý</h2>
              <p className="micro mt-1">
                Kết hợp ăn ý với {family.name} trong thiết kế
              </p>
            </div>
            <Link href="/pairings" className="chip">
              Xem toàn bộ cặp font →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-line border-b border-line bg-panel p-6 text-panel-ink md:p-8">
            {matchingPairings.map((pair) => (
              <div
                key={pair.id}
                className="py-6 first:pt-0 last:pb-0"
              >
                <div className="flex items-baseline justify-between text-[14px]">
                  <span className="font-bold text-panel-ink">{pair.title}</span>
                  <span className="text-panel-muted">{pair.category}</span>
                </div>
                <div className="my-5 space-y-2">
                  <p
                    className="text-[28px] leading-tight md:text-[36px]"
                    style={{
                      fontFamily: `'${pair.heading.slug}'`,
                      fontWeight: pair.heading.weight,
                    }}
                  >
                    {pair.heading.sample}
                  </p>
                  <p
                    className="text-[16px] leading-[22px] text-panel-muted md:text-[15px]"
                    style={{
                      fontFamily: `'${pair.body.slug}'`,
                      fontWeight: pair.body.weight,
                    }}
                  >
                    {pair.body.sample}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[14px] text-panel-muted">
                  <span>
                    {pair.heading.name} + {pair.body.name}
                  </span>
                  <Link
                    href="/pairings"
                    className="inline-flex items-center gap-1 font-bold text-cream hover:underline"
                  >
                    <span>Thử nghiệm cặp font này</span>
                    <ArrowRightIcon />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Web Embed Code */}
      <EmbedCode family={family} />

      {/* Licensing & Commercial Rights Grid */}
      <section id="license" className="shell mt-16 scroll-mt-20">
        <div className="grid grid-cols-1 border-t border-line md:grid-cols-12">
          {/* Permission Matrix */}
          <div className="border-b border-line py-8 md:col-span-6 md:border-b-0 md:border-r md:border-line md:py-12 md:pr-10">
            <p className="micro">Quyền sử dụng & Giấy phép</p>
            <h3 className="mt-2 text-[20px] font-bold">
              100% Miễn phí cá nhân & Thương mại
            </h3>
            <p className="mt-3 text-[15px] leading-[20px] text-muted">
              Họ chữ {family.name} được phát hành dưới giấy phép{" "}
              <Link
                href={`/licenses/${family.license.id}`}
                className="link-underline font-medium text-ink"
              >
                {family.license.name}
              </Link>
              . Bạn có toàn quyền sử dụng hợp pháp trong các dự án sau:
            </p>

            <div className="mt-6 space-y-2.5 text-[14px]">
              <div className="flex items-center gap-2.5 text-ink">
                <span className="font-bold text-green-500">✓</span>
                <span>Sử dụng cho dự án thương mại & cá nhân</span>
              </div>
              <div className="flex items-center gap-2.5 text-ink">
                <span className="font-bold text-green-500">✓</span>
                <span>Nhúng vào website và ứng dụng trực tuyến</span>
              </div>
              <div className="flex items-center gap-2.5 text-ink">
                <span className="font-bold text-green-500">✓</span>
                <span>Sử dụng trong in ấn, ấn phẩm báo chí và bao bì</span>
              </div>
              <div className="flex items-center gap-2.5 text-ink">
                <span className="font-bold text-green-500">✓</span>
                <span>Đóng gói vào ứng dụng di động & desktop</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted">
                <span className="font-bold text-red-500">✗</span>
                <span>Không được bán lại file font nguyên bản</span>
              </div>
            </div>

            <div className="mt-8">
              <a
                href={`/api/download/${family.slug}`}
                download
                className="btn-solid inline-flex items-center gap-2"
              >
                <DownloadIcon />
                <span>Tải gói font đầy đủ .zip ({formatBytes(family.size)})</span>
              </a>
              <p className="micro mt-3">
                Gói tải về bao gồm các file .woff2, bản gốc và file giấy phép chính thức.
              </p>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="py-8 md:col-span-6 md:py-12 md:pl-10">
            <p className="micro">Thông số kỹ thuật họ chữ</p>
            <dl className="mt-6 divide-y divide-line text-[14px]">
              {[
                ["Tên họ chữ", family.name],
                ["Nhà thiết kế", family.designer],
                ["Foundry", family.foundry || family.designer],
                ["Phát hành", family.releasedAt ?? "—"],
                ["Phân loại", family.categories.join(", ")],
                ["Số lượng kiểu", `${family.styles.length} styles`],
                ["Variable font", family.axes.length > 0 ? "Hỗ trợ (wght)" : "Không"],
                ["Số glyphs", String(family.glyphs)],
                ["Ký tự tiếng Việt", family.vietnamese ? "Đầy đủ 134 ký tự" : "Cơ bản"],
                ["Ký hiệu đồng (₫)", family.dong ? "Có hỗ trợ" : "Chưa có"],
                ["Dung lượng tải về", formatBytes(family.size)],
                ...(family.sourceUrl ? [["Dự án Behance", family.sourceUrl]] : []),
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <dt className="text-muted">{label}</dt>
                  <dd className="font-medium text-ink text-right">
                    {value.startsWith("http") ? (
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline hover:text-ink"
                      >
                        Xem dự án gốc ↗
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
