"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { FontFamily } from "@/lib/types";
import { ArrowRightIcon } from "./icons";
import { CustomSelect } from "./custom-select";

type Props = {
  family: FontFamily;
  allFamilies: FontFamily[];
};

export function FontPairsInspector({ family, allFamilies }: Props) {
  // Available partner fonts (excluding the current font) - memoized to prevent re-filtering on keystroke
  const partnerOptions = useMemo(
    () => allFamilies.filter((f) => f.slug !== family.slug),
    [allFamilies, family.slug]
  );
  const initialPartner = partnerOptions[0] ?? family;

  // Studio states
  const [partnerSlug, setPartnerSlug] = useState(initialPartner.slug);
  const [isCurrentHeading, setIsCurrentHeading] = useState(true);
  const [headingSize, setHeadingSize] = useState(48);
  const [bodySize, setBodySize] = useState(16);

  // Editable preview texts
  const [headlineText, setHeadlineText] = useState(
    "Nghệ thuật xếp chữ & Văn hoá Việt Nam."
  );
  const [bodyText, setBodyText] = useState(
    "Mỗi con chữ mang trong mình hơi thở lịch sử, sự cân bằng hài hòa giữa độ mảnh dẻ của dấu thanh và tính đăng đối trong cấu trúc chữ Latinh hiện đại."
  );

  const partnerFamily = useMemo(
    () => allFamilies.find((f) => f.slug === partnerSlug) ?? initialPartner,
    [allFamilies, partnerSlug, initialPartner]
  );

  const selectOptions = useMemo(
    () =>
      partnerOptions.map((f) => ({
        value: f.slug,
        label: f.name,
        sublabel: f.categories.join(", "),
      })),
    [partnerOptions]
  );

  // Determine which font is assigned to which role
  const headingFont = isCurrentHeading ? family : partnerFamily;
  const bodyFont = isCurrentHeading ? partnerFamily : family;

  const swapRoles = () => {
    setIsCurrentHeading((prev) => !prev);
  };

  return (
    <section className="shell py-8 md:py-12">
      {/* Section Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-[20px] font-bold tracking-tight text-ink md:text-[24px]">
            Phối cặp Font chữ (Pairing Studio)
          </h2>
          <p className="mt-1 text-[13px] text-muted md:text-[14px]">
            Thử nghiệm ghép đôi {family.name} với các kiểu chữ đối lập để kiểm tra độ hài hòa thị giác.
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
            <CustomSelect
              id="partner-font-select"
              aria-label="Chọn font phối hợp"
              value={partnerSlug}
              onChange={setPartnerSlug}
              options={selectOptions}
            />
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
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
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
              <span className="font-mono text-[12px] min-w-[28px]">{headingSize}px</span>
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
              <span className="font-mono text-[12px] min-w-[28px]">{bodySize}px</span>
            </div>
          </div>
        </div>

        {/* Live Pairing Canvas */}
        <div className="py-6 sm:py-8 space-y-6">
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
                fontSize: `clamp(24px, 8vw, ${headingSize}px)`,
                fontWeight: 700,
                lineHeight: 1.12,
              }}
              className="w-full resize-none border-0 bg-transparent p-0 tracking-tight text-panel-ink outline-none break-words"
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
              className="w-full resize-none border-0 bg-transparent p-0 text-panel-muted outline-none break-words"
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
    </section>
  );
}
