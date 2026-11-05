"use client";

import { useState } from "react";
import Link from "next/link";
import type { FontFamily } from "@/lib/types";
import { ArrowRightIcon } from "./icons";
import { getPairingsForFamily } from "@/lib/pairings";

type Props = {
  family: FontFamily;
  allFamilies: FontFamily[];
};

export function FontPairsInspector({ family, allFamilies }: Props) {
  const curatedPairs = getPairingsForFamily(family.slug);

  // Available partner fonts (excluding the current font)
  const partnerOptions = allFamilies.filter((f) => f.slug !== family.slug);
  const initialPartner = partnerOptions[0] ?? family;

  // Studio states
  const [partnerSlug, setPartnerSlug] = useState(initialPartner.slug);
  const [isCurrentHeading, setIsCurrentHeading] = useState(true);
  const [headingSize, setHeadingSize] = useState(48);
  const [bodySize, setBodySize] = useState(16);
  const [headlineText, setHeadlineText] = useState(
    "Kiểu chữ định hình cảm xúc thị giác của mọi thông điệp."
  );
  const [bodyText, setBodyText] = useState(
    "Sự kết hợp hài hòa giữa một họ chữ có cá tính mạnh mẽ cho phần tiêu đề và một kiểu chữ trong sáng, dễ đọc cho phần văn bản giúp người xem tiếp nhận thông tin tự nhiên, nâng tầm thẩm mỹ của toàn bộ sản phẩm thiết kế."
  );

  const partnerFamily =
    allFamilies.find((f) => f.slug === partnerSlug) ?? initialPartner;

  const headingFont = isCurrentHeading ? family : partnerFamily;
  const bodyFont = isCurrentHeading ? partnerFamily : family;

  const swapRoles = () => {
    setIsCurrentHeading((prev) => !prev);
  };

  return (
    <section id="pairings" className="shell mt-16 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-bold md:text-[20px]">
              Cặp font phối hợp (Pairs)
            </h2>
            <span className="rounded bg-soft px-2 py-0.5 text-[12px] font-mono font-medium text-muted">
              Interactive Pairing Studio
            </span>
          </div>
          <p className="micro mt-1">
            Thử nghiệm kết hợp {family.name} với các kiểu chữ tương phản và bổ trợ trong thư viện
          </p>
        </div>

        <Link href="/pairings" className="chip text-[13px] text-muted hover:text-ink">
          Xem toàn bộ cặp font tuyển chọn →
        </Link>
      </div>

      {/* Interactive Pairing Studio Controls */}
      <div className="mt-8 border border-line bg-panel p-6 text-panel-ink md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/60 pb-6">
          {/* Partner Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="partner-font-select" className="micro text-[13px]">
              Phối cùng font:
            </label>
            <select
              id="partner-font-select"
              aria-label="Chọn font phối hợp"
              value={partnerSlug}
              onChange={(e) => setPartnerSlug(e.target.value)}
              className="rounded border border-line bg-soft px-3 py-1.5 text-[14px] font-medium text-panel-ink outline-none cursor-pointer"
            >
              {partnerOptions.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.name} ({f.categories.join(", ")})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Roles Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={swapRoles}
              className="btn flex items-center gap-2 py-1.5 px-3 text-[13px] cursor-pointer"
              title="Đổi vai trò giữa Tiêu đề và Văn bản"
            >
              <span>⇄ Hoán đổi vai trò</span>
            </button>
          </div>

          {/* Sliders for Heading and Body */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="micro text-[12px]">Cỡ Tiêu đề:</span>
              <input
                type="range"
                aria-label="Cỡ chữ tiêu đề trong phòng thử cặp font"
                min={28}
                max={72}
                step={2}
                value={headingSize}
                onChange={(e) => setHeadingSize(Number(e.target.value))}
                className="range w-20 cursor-pointer"
              />
              <span className="font-mono text-[12px]">{headingSize}px</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="micro text-[12px]">Cỡ Văn bản:</span>
              <input
                type="range"
                aria-label="Cỡ chữ văn bản trong phòng thử cặp font"
                min={14}
                max={22}
                step={1}
                value={bodySize}
                onChange={(e) => setBodySize(Number(e.target.value))}
                className="range w-20 cursor-pointer"
              />
              <span className="font-mono text-[12px]">{bodySize}px</span>
            </div>
          </div>
        </div>

        {/* Live Pairing Canvas */}
        <div className="py-8 space-y-6">
          {/* Heading preview */}
          <div>
            <div className="mb-2 flex items-center justify-between text-[12px] text-panel-muted">
              <span>
                TIÊU ĐỀ: <strong>{headingFont.name}</strong> ({isCurrentHeading ? "Font hiện tại" : "Font phối cùng"})
              </span>
              <span className="font-mono">{headingSize}px</span>
            </div>
            <textarea
              rows={2}
              aria-label="Văn bản tiêu đề cặp font"
              value={headlineText}
              onChange={(e) => setHeadlineText(e.target.value)}
              style={{
                fontFamily: `'${headingFont.slug}', sans-serif`,
                fontSize: `${headingSize}px`,
                fontWeight: 700,
                lineHeight: 1.12,
              }}
              className="w-full resize-none border-0 bg-transparent p-0 tracking-tight text-panel-ink outline-none"
              placeholder="Gõ tiêu đề thử nghiệm..."
            />
          </div>

          {/* Body preview */}
          <div className="border-t border-line/40 pt-6">
            <div className="mb-2 flex items-center justify-between text-[12px] text-panel-muted">
              <span>
                VĂN BẢN (BODY): <strong>{bodyFont.name}</strong> ({!isCurrentHeading ? "Font hiện tại" : "Font phối cùng"})
              </span>
              <span className="font-mono">{bodySize}px</span>
            </div>
            <textarea
              rows={4}
              aria-label="Đoạn văn bản mẫu cặp font"
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              style={{
                fontFamily: `'${bodyFont.slug}', sans-serif`,
                fontSize: `${bodySize}px`,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
              className="w-full resize-none border-0 bg-transparent p-0 text-panel-muted outline-none"
              placeholder="Gõ đoạn văn bản thử nghiệm..."
            />
          </div>
        </div>

        {/* Footer info & Catalog links */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/60 pt-4 text-[13px] text-panel-muted">
          <span>
            Kết hợp hoàn hảo: <strong className="text-panel-ink">{headingFont.name}</strong> (Display / Heading) +{" "}
            <strong className="text-panel-ink">{bodyFont.name}</strong> (Body Text)
          </span>

          <Link
            href={`/fonts/${partnerFamily.slug}`}
            className="inline-flex items-center gap-1 font-bold text-cream hover:underline"
          >
            <span>Khám phá họ chữ {partnerFamily.name}</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Curated Recommendations for this family */}
      {curatedPairs.length > 0 && (
        <div className="mt-8">
          <h3 className="micro mb-4 font-mono uppercase text-[12px]">
            Các phối hợp được đề xuất riêng cho {family.name}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {curatedPairs.map((pair) => (
              <div
                key={pair.id}
                className="border border-line bg-panel p-6 text-panel-ink transition-colors hover:bg-soft"
              >
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="font-bold">{pair.title}</span>
                  <span className="text-panel-muted">{pair.category}</span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-panel-muted">
                  {pair.description}
                </p>
                <div className="my-4 border-l-2 border-line pl-3">
                  <p
                    className="text-[20px] font-bold text-panel-ink"
                    style={{ fontFamily: `'${pair.heading.slug}'` }}
                  >
                    {pair.heading.name}
                  </p>
                  <p
                    className="text-[14px] text-panel-muted"
                    style={{ fontFamily: `'${pair.body.slug}'` }}
                  >
                    {pair.body.name}
                  </p>
                </div>
                <Link
                  href="/pairings"
                  className="inline-flex items-center gap-1 text-[13px] font-bold text-cream hover:underline"
                >
                  <span>Mở trong phòng thử cặp font</span>
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
