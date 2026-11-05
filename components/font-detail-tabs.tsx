"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { FontFamily } from "@/lib/types";
import { DownloadIcon } from "./icons";
import { SpecimenTester } from "./specimen-tester";
import { StylesGallery } from "./styles-gallery";
import { FontFeaturesInspector } from "./font-features-inspector";
import { GlyphInspector } from "./glyph-inspector";
import { FontPairsInspector } from "./font-pairs-inspector";
import { EmbedCode } from "./embed-code";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

type TabKey = "all" | "specimen" | "styles" | "features" | "glyphs" | "pairings";

type Props = {
  family: FontFamily;
  allFamilies: FontFamily[];
};

export function FontDetailTabs({ family, allFamilies }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const previewStyle =
    family.styles.find((style) => !style.italic && style.weight === 400) ??
    family.styles[0];

  // Sync hash with active tab on mount and listen to hashchange
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace("#", "") as TabKey;
      if (
        ["specimen", "styles", "features", "glyphs", "pairings", "all"].includes(
          hash
        )
      ) {
        setActiveTab(hash);
      }
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const handleSelectTab = (tab: TabKey) => {
    setActiveTab(tab);
    window.history.replaceState(null, "", `#${tab}`);
    if (tab === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const tabsConfig = [
    { id: "all" as const, label: "Tất cả", shortLabel: "Tất cả" },
    { id: "specimen" as const, label: "Thử chữ (Specimen)", shortLabel: "Thử chữ" },
    { id: "styles" as const, label: `Kiểu chữ (${family.styles.length})`, shortLabel: `Kiểu (${family.styles.length})` },
    { id: "features" as const, label: "Tính năng (Features)", shortLabel: "Tính năng" },
    { id: "glyphs" as const, label: `Ký tự (${family.glyphs})`, shortLabel: `Ký tự (${family.glyphs})` },
    { id: "pairings" as const, label: "Cặp font (Pairs)", shortLabel: "Cặp font" },
  ];

  return (
    <div>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* STICKY SUB-NAV ACTION BAR (Chuẩn Fontshare)                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="shell grid h-14 grid-cols-2 items-center md:grid-cols-12">
          {/* Back link */}
          <Link
            href="/fonts"
            className="flex items-center text-[14px] font-medium text-muted hover:text-ink md:col-span-2 md:border-r md:border-line md:h-full md:pr-4"
          >
            ← Toàn bộ font
          </Link>

          {/* Fontshare Main Tabs Navigation with ARIA Tablist Pattern */}
          <div
            role="tablist"
            aria-label="Điều hướng các phân mục chi tiết font chữ"
            className="hidden items-center justify-center gap-1 overflow-x-auto text-[14px] md:col-span-7 md:flex md:h-full"
          >
            {tabsConfig.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                  onClick={() => handleSelectTab(tab.id)}
                  className={`chip px-3 py-1.5 cursor-pointer transition-colors focus-visible:ring-1 focus-visible:ring-ink ${
                    isActive ? "text-ink font-bold border-b-2 border-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Download CTA Button */}
          <div className="flex items-center justify-end md:col-span-3 md:border-l md:border-line md:h-full md:pl-6">
            <a
              href={`/api/download/${family.slug}`}
              download
              className="btn-solid flex items-center gap-2 py-2 px-4 text-[13px] md:text-[14px]"
            >
              <DownloadIcon />
              <span>Tải .zip ({formatBytes(family.size)})</span>
            </a>
          </div>
        </div>

        {/* Mobile Sub-Nav Tab strip with ARIA */}
        <div
          role="tablist"
          aria-label="Điều hướng phân mục trên di động"
          className="flex items-center gap-2 overflow-x-auto border-t border-line/60 px-4 py-2 md:hidden"
        >
          {tabsConfig.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-mobile-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={`chip whitespace-nowrap px-2.5 py-1 text-[13px] cursor-pointer ${
                  isActive ? "text-ink font-bold border-b-2 border-ink" : "text-muted hover:text-ink"
                }`}
              >
                {tab.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FONT FAMILY HERO BANNER & METADATA BAR                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="shell">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-line py-5 text-[14px] leading-[20px]">
          <span className="font-bold">{family.name}</span>
          <span className="text-muted">{family.styles.length} styles</span>
          {family.axes.length > 0 && (
            <span className="text-muted">Variable font (wght)</span>
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
            <p className="text-[15px] leading-[22px] text-muted md:text-[16px]">
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

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB CONTENT VIEWS                                             */}
      {/* ───────────────────────────────────────────────────────────── */}

      {/* TAB 1: SPECIMEN */}
      {(activeTab === "all" || activeTab === "specimen") && (
        <div id="panel-specimen" role="tabpanel" aria-labelledby="tab-specimen">
          <SpecimenTester
            slug={family.slug}
            name={family.name}
            axes={family.axes}
            styles={family.styles}
            initialWeight={previewStyle?.weight ?? 400}
          />
        </div>
      )}

      {/* TAB 2: STYLES */}
      {(activeTab === "all" || activeTab === "styles") && (
        <div id="panel-styles" role="tabpanel" aria-labelledby="tab-styles">
          <StylesGallery
            slug={family.slug}
            name={family.name}
            styles={family.styles}
          />
        </div>
      )}

      {/* TAB 3: FEATURES */}
      {(activeTab === "all" || activeTab === "features") && (
        <div id="panel-features" role="tabpanel" aria-labelledby="tab-features">
          <FontFeaturesInspector slug={family.slug} name={family.name} />
        </div>
      )}

      {/* TAB 4: GLYPHS */}
      {(activeTab === "all" || activeTab === "glyphs") && (
        <div id="panel-glyphs" role="tabpanel" aria-labelledby="tab-glyphs">
          <GlyphInspector
            slug={family.slug}
            name={family.name}
            glyphsCount={family.glyphs}
            styles={family.styles}
            metrics={family.metrics}
          />
        </div>
      )}

      {/* TAB 5: PAIRINGS */}
      {(activeTab === "all" || activeTab === "pairings") && (
        <div id="panel-pairings" role="tabpanel" aria-labelledby="tab-pairings">
          <FontPairsInspector
            family={family}
            allFamilies={allFamilies}
          />
        </div>
      )}

      {/* EMBED & CODE INTEGRATION */}
      <EmbedCode family={family} />
    </div>
  );
}
