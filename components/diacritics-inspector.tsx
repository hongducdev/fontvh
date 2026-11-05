"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import type { FontMetrics, FontStyle } from "@/lib/types";
import {
  VIETNAMESE_TONES,
  VIETNAMESE_DIACRITIC_MATRIX,
  STRESS_TEST_CASES,
  type DiacriticCharInfo,
} from "@/lib/vietnamese-diacritics";
import { CopyIcon, CheckIcon } from "./icons";
import { CustomSelect } from "./custom-select";

// Vercel Best Practice: js-index-maps & rerender-lazy-state-init
// Hoist static default char and matrix cell map outside component scope to avoid O(n) finds on every render
const DEFAULT_DIACRITIC_CHAR: DiacriticCharInfo =
  VIETNAMESE_DIACRITIC_MATRIX.find((r) => r.id === "o-horn")?.chars.find(
    (c) => c.tone === "hook"
  ) ?? VIETNAMESE_DIACRITIC_MATRIX[0].chars[1];

const MATRIX_CELL_MAP = new Map<string, DiacriticCharInfo>();
for (const row of VIETNAMESE_DIACRITIC_MATRIX) {
  for (const c of row.chars) {
    MATRIX_CELL_MAP.set(`${row.id}:${c.tone}`, c);
  }
}

interface Props {
  slug: string;
  name: string;
  styles: FontStyle[];
  metrics?: FontMetrics;
  isTabActive?: boolean;
}

export function DiacriticsInspector({ slug, name, styles, metrics, isTabActive = true }: Props) {
  // Styles selector
  const [selectedStyleKey, setSelectedStyleKey] = useState<string>(
    styles[0]?.key ?? "regular"
  );
  const activeStyle =
    styles.find((s) => s.key === selectedStyleKey) ?? styles[0];
  const activeWeight = activeStyle?.weight ?? 400;
  const isItalic = activeStyle?.italic ?? false;

  const [selectedChar, setSelectedChar] = useState<DiacriticCharInfo>(DEFAULT_DIACRITIC_CHAR);
  const [displayCase, setDisplayCase] = useState<"both" | "lower" | "upper">("both");
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Stress test states
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [customText, setCustomText] = useState<string>("Khỏe khoắn, phở bò, lượn lờ, bận rộn, trực nhật...");
  const [stressFontSize, setStressFontSize] = useState<number>(36);

  // Dynamic canvas height measurement for responsive font-size calculation
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState<number>(440);

  useEffect(() => {
    const node = canvasContainerRef.current;
    if (!node) return;
    const update = () => {
      if (node.clientHeight > 0) setCanvasHeight(node.clientHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  // Safe clipboard helper
  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Typographic Metrics calculation with diacritic headroom protection
  const rawDescent = metrics?.descent ?? -211;
  const descent = rawDescent > 0 ? -rawDescent : rawDescent; // Always negative
  const capHeight = metrics?.capHeight ?? 716;
  const xHeight = metrics?.xHeight ?? 484;
  const ascender = metrics?.ascent ?? 1000;
  const unitsPerEm = metrics?.unitsPerEm ?? 1000;

  // Maximum diacritic height calculation (accommodating Vietnamese double-stacked marks: Ắ, Ấ, Ề, Ố, Ớ...)
  const maxAccentHeight = Math.max(ascender, Math.round(capHeight * 1.38));
  const span = maxAccentHeight + Math.abs(descent);
  const padTop = Math.round(span * 0.16);
  const padBottom = Math.round(span * 0.12);
  const totalRange = maxAccentHeight + Math.abs(descent) + padTop + padBottom;

  // Exact vertical guideline offsets (as percentage of total container)
  const accentCeilingY = padTop + (maxAccentHeight - Math.round(capHeight * 1.35));
  const capHeightY = padTop + (maxAccentHeight - capHeight);
  const xHeightY = padTop + (maxAccentHeight - xHeight);
  const baselineY = padTop + maxAccentHeight;
  const descenderY = baselineY + Math.abs(descent);

  const accentCeilingPct = (accentCeilingY / totalRange) * 100;
  const capHeightPct = (capHeightY / totalRange) * 100;
  const xHeightPct = (xHeightY / totalRange) * 100;
  const baselinePct = (baselineY / totalRange) * 100;
  const descenderPct = (descenderY / totalRange) * 100;

  // Font size mathematically scaled to canvas height & unitsPerEm
  const baseComputedFontSize = Math.round(canvasHeight * (unitsPerEm / totalRange));
  const computedFontSize = displayCase === "both"
    ? Math.round(baseComputedFontSize * 0.75)
    : baseComputedFontSize;

  const fontStyle = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: `'${slug}', sans-serif`,
      fontWeight: activeWeight,
      fontStyle: isItalic ? "italic" : "normal",
    }),
    [slug, activeWeight, isItalic]
  );

  // Filter stress test cases
  const filteredStressCases = useMemo(() => {
    if (activeCategory === "all") return STRESS_TEST_CASES;
    return STRESS_TEST_CASES.filter((c) => c.id === activeCategory);
  }, [activeCategory]);

  const charToDisplayInZoom =
    displayCase === "both"
      ? `${selectedChar.upper} ${selectedChar.lower}`
      : displayCase === "upper"
      ? selectedChar.upper
      : selectedChar.lower;

  const scrollToZoom = () => {
    canvasContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section id="diacritics" className="shell mt-16 scroll-mt-20">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col gap-4 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block rounded bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-amber-700 dark:text-amber-300">
              Chuyên sâu Tiếng Việt
            </span>
            <span className="text-[12px] text-muted">134 Glyphs có dấu · 6 Thanh điệu</span>
          </div>
          <h2 className="text-[26px] sm:text-[28px] font-bold tracking-tight md:text-[34px]">
            Bản Soi Dấu & Neo Vị Trí (Diacritics Inspector)
          </h2>
          <p className="mt-1.5 max-w-2xl text-[13px] sm:text-[14px] leading-relaxed text-muted md:text-[15px]">
            Kiểm tra tỷ lệ độ dày nét, khoảng hở chống dính (collision), độ cao của dấu mũ (â, ê, ô), dấu móc (ơ, ư) và dấu thanh trên font <strong>{name}</strong>.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Style Selector */}
          <CustomSelect
            aria-label="Chọn kiểu chữ"
            value={selectedStyleKey}
            onChange={setSelectedStyleKey}
            options={styles.map((s) => ({
              value: s.key,
              label: s.name,
            }))}
            size="sm"
          />

          {/* Upper / Lower / Both selector */}
          <div className="flex items-center rounded border border-line bg-paper p-0.5 text-[12px]">
            <button
              type="button"
              onClick={() => setDisplayCase("both")}
              className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                displayCase === "both"
                  ? "bg-ink font-semibold text-paper"
                  : "text-muted hover:text-ink"
              }`}
            >
              Cả hai
            </button>
            <button
              type="button"
              onClick={() => setDisplayCase("upper")}
              className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                displayCase === "upper"
                  ? "bg-ink font-semibold text-paper"
                  : "text-muted hover:text-ink"
              }`}
            >
              Chữ hoa
            </button>
            <button
              type="button"
              onClick={() => setDisplayCase("lower")}
              className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                displayCase === "lower"
                  ? "bg-ink font-semibold text-paper"
                  : "text-muted hover:text-ink"
              }`}
            >
              Chữ thường
            </button>
          </div>
        </div>
      </div>

      {/* 2. TWO-COLUMN WORKSPACE: LEFT ZOOM INSPECTOR + RIGHT MATRIX */}
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* ── LEFT COLUMN: FOCUSED ZOOM CANVAS (Sticky on desktop) ── */}
        <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-24 self-start">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                Đang soi chi tiết
              </span>
              <h3 className="text-[17px] font-bold text-ink">
                {selectedChar.upper} / {selectedChar.lower}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowGuides((prev) => !prev)}
              className={`rounded border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                showGuides
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                  : "border-line text-muted hover:text-ink"
              }`}
            >
              {showGuides ? "Ẩn lưới trục" : "Hiện lưới trục"}
            </button>
          </div>

          {/* Metric Diagram Canvas with mathematical SVG scaling */}
          <div
            ref={canvasContainerRef}
            className="relative mt-4 flex min-h-[340px] md:min-h-[440px] w-full items-center justify-center overflow-hidden rounded border border-line bg-panel p-6 select-none"
          >
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Typography Guideline Overlays */}
            {showGuides && (
              <>
                {/* Accent Ceiling Guide (Vietnamese double-stack limit) */}
                <div
                  className="absolute left-4 right-4 flex items-center justify-between text-[10px] text-amber-600 dark:text-amber-400 -translate-y-1/2 pointer-events-none z-10 transition-all duration-200"
                  style={{ top: `${accentCeilingPct}%` }}
                >
                  <span className="font-mono tracking-wider uppercase font-semibold">
                    Đỉnh dấu mũ (Accent Top)
                  </span>
                  <div className="mx-2 flex-1 border-b border-amber-500/50 border-dotted" />
                  <span className="font-mono text-[9px]">Max Diacritic</span>
                </div>

                {/* Cap Height Guide */}
                <div
                  className="absolute left-4 right-4 flex items-center justify-between text-[10px] text-muted -translate-y-1/2 pointer-events-none z-10 transition-all duration-200"
                  style={{ top: `${capHeightPct}%` }}
                >
                  <span className="font-mono tracking-wider uppercase">Cap Height</span>
                  <div className="mx-2 flex-1 border-b border-muted/40 border-dashed" />
                  <span className="font-mono text-[9px]">{capHeight}</span>
                </div>

                {/* X-Height Guide */}
                <div
                  className="absolute left-4 right-4 flex items-center justify-between text-[10px] text-muted -translate-y-1/2 pointer-events-none z-10 transition-all duration-200"
                  style={{ top: `${xHeightPct}%` }}
                >
                  <span className="font-mono tracking-wider uppercase">X-Height</span>
                  <div className="mx-2 flex-1 border-b border-muted/30 border-dashed" />
                  <span className="font-mono text-[9px]">{xHeight}</span>
                </div>

                {/* Baseline (Alphabetic = 0) */}
                <div
                  className="absolute left-4 right-4 flex items-center justify-between text-[10px] font-bold text-ink -translate-y-1/2 pointer-events-none z-10 transition-all duration-200"
                  style={{ top: `${baselinePct}%` }}
                >
                  <span className="font-mono tracking-wider uppercase">Baseline</span>
                  <div className="mx-2 flex-1 border-b border-ink/40" />
                  <span className="font-mono text-[9px]">0</span>
                </div>

                {/* Descender Guide */}
                <div
                  className="absolute left-4 right-4 flex items-center justify-between text-[10px] text-muted -translate-y-1/2 pointer-events-none z-10 transition-all duration-200"
                  style={{ top: `${descenderPct}%` }}
                >
                  <span className="font-mono tracking-wider uppercase">Descender</span>
                  <div className="mx-2 flex-1 border-b border-muted/30 border-dashed" />
                  <span className="font-mono text-[9px]">{descent}</span>
                </div>
              </>
            )}

            {/* Mathematically Anchored SVG Text on exact Baseline */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
              aria-hidden="true"
            >
              <text
                x="50%"
                y={`${baselinePct}%`}
                textAnchor="middle"
                dominantBaseline="alphabetic"
                fontSize={computedFontSize}
                fontFamily={`'${slug}', sans-serif`}
                fontWeight={activeWeight}
                fontStyle={isItalic ? "italic" : "normal"}
                fill="currentColor"
                className="text-panel-ink transition-all duration-200"
              >
                {charToDisplayInZoom}
              </text>
            </svg>
          </div>

          {/* Glyph Anatomy Metadata Panel */}
          <div className="mt-4 rounded border border-line bg-panel p-4 text-[12px] space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono text-muted block">Chữ hoa</span>
                <span className="text-[16px] font-bold text-ink" style={fontStyle}>
                  {selectedChar.upper}
                </span>
                <p className="text-[11px] text-muted truncate mt-0.5">{selectedChar.upperName}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="font-mono text-[10px] bg-paper px-1.5 py-0.5 rounded border border-line">
                    {selectedChar.upperUnicode}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedChar.upper, "upper")}
                    className="p-1 text-muted hover:text-ink cursor-pointer"
                    title="Sao chép chữ hoa"
                    aria-label={`Sao chép ${selectedChar.upper}`}
                  >
                    {copiedKey === "upper" ? (
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <CopyIcon className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-muted block">Chữ thường</span>
                <span className="text-[16px] font-bold text-ink" style={fontStyle}>
                  {selectedChar.lower}
                </span>
                <p className="text-[11px] text-muted truncate mt-0.5">{selectedChar.lowerName}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="font-mono text-[10px] bg-paper px-1.5 py-0.5 rounded border border-line">
                    {selectedChar.lowerUnicode}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedChar.lower, "lower")}
                    className="p-1 text-muted hover:text-ink cursor-pointer"
                    title="Sao chép chữ thường"
                    aria-label={`Sao chép ${selectedChar.lower}`}
                  >
                    {copiedKey === "lower" ? (
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <CopyIcon className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-line/60 pt-2.5 flex items-center justify-between text-[11px] text-muted">
              <span>Thanh điệu: <strong className="text-ink">{selectedChar.tone}</strong></span>
              <span>Font: <strong className="text-ink">{name} ({activeStyle.name})</strong></span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: FULL 6-TONE DIACRITICS MATRIX TABLE ── */}
        <div className="lg:col-span-7">
          <div className="border-b border-line pb-3">
            <h3 className="text-[17px] font-bold text-ink">
              Ma Trận 6 Thanh Điệu (Full Diacritics Matrix)
            </h3>
            <p className="text-[12px] text-muted mt-0.5">
              Bấm vào bất kỳ ô ký tự nào để phóng to kiểm tra góc đặt dấu và tỷ lệ nét.
            </p>
          </div>

          <div className="mt-4 overflow-x-auto rounded border border-line bg-paper">
            <table className="w-full text-center border-collapse min-w-[560px]">
              {/* Matrix Table Header: 6 Tone columns */}
              <thead>
                <tr className="border-b border-line bg-panel text-[12px]">
                  <th className="py-2.5 px-3 text-left font-mono font-medium text-muted w-24">
                    Gốc
                  </th>
                  {VIETNAMESE_TONES.map((t) => (
                    <th key={t.id} className="py-2.5 px-2 font-medium">
                      <div className="flex flex-col items-center">
                        <span className="text-ink font-semibold">{t.name}</span>
                        <span className="text-[10px] text-muted font-mono">{t.symbol}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Matrix Body: Exact 7-column layout with sticky first column */}
              <tbody className="divide-y divide-line/60 text-[14px]">
                {VIETNAMESE_DIACRITIC_MATRIX.map((row) => (
                  <tr key={row.id} className="hover:bg-panel/40 transition-colors">
                    {/* Row Label (Sticky on horizontal scroll) */}
                    <td className="sticky left-0 z-10 bg-panel py-3 px-3 text-left border-r border-line font-medium text-[13px] shadow-[1px_0_0_0_var(--line)]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-ink">{row.baseChar}</span>
                        <span className="text-[11px] text-muted truncate max-w-[80px]\" title={row.name}>
                          {row.accentType === "base" ? "" : `(${row.accentType})`}
                        </span>
                      </div>
                    </td>

                    {/* 6 Tone Cells - O(1) indexed via MATRIX_CELL_MAP */}
                    {VIETNAMESE_TONES.map((t) => {
                      const charItem = MATRIX_CELL_MAP.get(`${row.id}:${t.id}`);

                      if (!charItem) {
                        return (
                          <td key={t.id} className="p-1 text-center text-line text-[13px] select-none">
                            —
                          </td>
                        );
                      }

                      const isSelected =
                        selectedChar.upper === charItem.upper &&
                        selectedChar.lower === charItem.lower;

                      const charToRender =
                        displayCase === "both"
                          ? `${charItem.upper} ${charItem.lower}`
                          : displayCase === "upper"
                          ? charItem.upper
                          : charItem.lower;

                      return (
                        <td key={t.id} className="p-1">
                          <button
                            type="button"
                            aria-label={`${charItem.upperName} / ${charItem.lowerName}`}
                            onClick={() => setSelectedChar(charItem)}
                            className={`w-full py-2.5 px-1 rounded flex flex-col items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-amber-500/15 ring-1.5 ring-amber-500 font-bold text-ink"
                                : "hover:bg-panel text-panel-ink"
                            }`}
                          >
                            <span
                              className="text-[19px] sm:text-[20px] md:text-[22px] leading-tight"
                              style={fontStyle}
                            >
                              {charToRender}
                            </span>
                            <span className="text-[9px] font-mono text-muted mt-0.5 opacity-70">
                              {charItem.lowerUnicode.replace("U+", "")}
                            </span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. STRESS TEST PLAYGROUND */}
      <div className="mt-16 border-t border-line pt-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-block rounded bg-panel px-2 py-0.5 text-[11px] font-semibold text-muted">
              Stress Test Cụm Từ
            </span>
            <h3 className="mt-1.5 text-[20px] sm:text-[22px] font-bold tracking-tight md:text-[26px]">
              Thử Nghiệm Cụm Từ & Câu Dấu Nhạy Cảm
            </h3>
            <p className="mt-1 text-[13px] sm:text-[14px] text-muted">
              Kiểm tra nhịp điệu (rhythm), khoảng cách từ (kerning), và độ cân đối của dấu trong câu dài.
            </p>
          </div>

          {/* Size slider */}
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-muted font-mono">{stressFontSize}px</span>
            <input
              type="range"
              min="20"
              max="64"
              value={stressFontSize}
              onChange={(e) => setStressFontSize(Number(e.target.value))}
              aria-label="Kích thước chữ stress test"
              className="w-28 sm:w-32 accent-ink cursor-pointer"
            />
          </div>
        </div>

        {/* Category switcher (Horizontal scrollable on mobile) */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar mask-fade-right pb-1">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 rounded-full px-3.5 py-1 text-[13px] font-medium transition-colors cursor-pointer ${
              activeCategory === "all"
                ? "bg-ink text-paper"
                : "border border-line bg-paper text-muted hover:text-ink"
            }`}
          >
            Tất cả bộ từ
          </button>
          {STRESS_TEST_CASES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`shrink-0 rounded-full px-3.5 py-1 text-[13px] font-medium transition-colors cursor-pointer ${
                activeCategory === c.id
                  ? "bg-ink text-paper"
                  : "border border-line bg-paper text-muted hover:text-ink"
              }`}
            >
              {c.category}
            </button>
          ))}
        </div>

        {/* Word Chips and Sample Sentences */}
        <div className="mt-8 space-y-6">
          {filteredStressCases.map((testCase) => (
            <div key={testCase.id} className="rounded border border-line bg-paper p-4 sm:p-5 cv-card">
              <div className="flex items-center justify-between border-b border-line/60 pb-2 mb-4">
                <div>
                  <h4 className="font-bold text-ink text-[14px] sm:text-[15px]">{testCase.category}</h4>
                  <p className="text-[12px] text-muted">{testCase.description}</p>
                </div>
              </div>

              {/* Word Chips */}
              <div className="flex flex-wrap gap-2">
                {testCase.words.map((word) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() => setCustomText(word)}
                    title="Bấm để đưa vào ô gõ thử nghiệm"
                    className="rounded border border-line bg-panel/60 px-2.5 sm:px-3 py-1.5 text-panel-ink hover:border-ink hover:bg-paper transition-all cursor-pointer"
                    style={{ ...fontStyle, fontSize: `${Math.min(stressFontSize, 28)}px` }}
                  >
                    {word}
                  </button>
                ))}
              </div>

              {/* Sample Sentence */}
              <div className="mt-4 rounded bg-panel p-3 sm:p-3.5 border border-line/40">
                <span className="text-[10px] uppercase font-mono text-muted block mb-1">
                  Đoạn câu ngữ cảnh:
                </span>
                <p
                  className="text-panel-ink leading-relaxed break-words"
                  style={{ ...fontStyle, fontSize: `${stressFontSize}px` }}
                >
                  {testCase.sentence}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Sandbox Textarea */}
        <div className="mt-8 rounded border border-line bg-paper p-4 sm:p-5">
          <label htmlFor="custom-stress-test" className="text-[12px] font-bold uppercase tracking-wider text-muted block mb-2">
            Gõ Thử Tùy Biến (Live Typing Sandbox)
          </label>
          <textarea
            id="custom-stress-test"
            rows={2}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full bg-transparent outline-none text-panel-ink leading-relaxed resize-y border-b border-line pb-3 focus:border-ink"
            style={{ ...fontStyle, fontSize: `${stressFontSize}px` }}
            placeholder="Gõ chữ tiếng Việt bất kỳ có dấu..."
          />
        </div>
      </div>

      {/* Mobile Sticky Quick Preview Bar */}
      {isTabActive && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-30 flex items-center justify-between rounded-lg border border-line bg-panel/95 px-4 py-2.5 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-3">
            <span style={fontStyle} className="text-[26px] leading-none text-panel-ink">
              {selectedChar.upper} {selectedChar.lower}
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-[12px] font-bold text-ink">
                {selectedChar.lowerUnicode}
              </span>
              <span className="max-w-[140px] truncate text-[11px] text-muted">
                {selectedChar.upperName}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={scrollToZoom}
            className="chip text-[12px] font-medium text-ink cursor-pointer"
          >
            Xem metric ↑
          </button>
        </div>
      )}
    </section>
  );
}
