"use client";

import React, { useEffect, useMemo, useRef, useState, useDeferredValue } from "react";
import type { FontMetrics, FontStyle } from "@/lib/types";
import { ChevronDownIcon } from "./icons";

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz".split("");
const NUMERAL_CHARS = "0123456789".split("");

const VI_ACCENTED_UPPER = [
  "À", "Á", "Ả", "Ã", "Ạ",
  "Ă", "Ằ", "Ắ", "Ẳ", "Ẵ", "Ặ",
  "Â", "Ầ", "Ấ", "Ẩ", "Ẫ", "Ậ",
  "Đ",
  "È", "É", "Ẻ", "Ẽ", "Ẹ",
  "Ê", "Ề", "Ế", "Ể", "Ễ", "Ệ",
  "Ì", "Í", "Ỉ", "Ĩ", "Ị",
  "Ò", "Ó", "Ỏ", "Õ", "Ọ",
  "Ô", "Ồ", "Ố", "Ổ", "Ỗ", "Ộ",
  "Ơ", "Ờ", "Ớ", "Ở", "Ỡ", "Ợ",
  "Ù", "Ú", "Ủ", "Ũ", "Ụ",
  "Ư", "Ừ", "Ứ", "Ử", "Ữ", "Ự",
  "Ỳ", "Ý", "Ỷ", "Ỹ", "Ỵ",
];

const VI_ACCENTED_LOWER = [
  "à", "á", "ả", "ã", "ạ",
  "ă", "ằ", "ắ", "ẳ", "ẵ", "ặ",
  "â", "ầ", "ấ", "ẩ", "ẫ", "ậ",
  "đ",
  "è", "é", "ẻ", "ẽ", "ẹ",
  "ê", "ề", "ế", "ể", "ễ", "ệ",
  "ì", "í", "ỉ", "ĩ", "ị",
  "ò", "ó", "ỏ", "õ", "ọ",
  "ô", "ồ", "ố", "ổ", "ỗ", "ộ",
  "ơ", "ờ", "ớ", "ở", "ỡ", "ợ",
  "ù", "ú", "ủ", "ũ", "ụ",
  "ư", "ừ", "ứ", "ử", "ữ", "ự",
  "ỳ", "ý", "ỷ", "ỹ", "ỵ",
];

const PUNCTUATION_AND_SYMBOLS = [
  "₫", "$", "€", "£", "¥", "%", "+", "-", "×", "÷", "=", "≠", "±",
  "!", '"', "#", "&", "'", "(", ")", "*", ",", ".", "/", ":", ";", "<", ">",
  "?", "@", "[", "\\", "]", "^", "_", "`", "{", "|", "}", "~",
  "©", "®", "™", "°", "«", "»", "“", "”", "‘", "’", "–", "—", "…", "•",
];

// Helper to get descriptive character name (Song ngữ Việt - Anh)
function getGlyphName(char: string): string {
  const code = char.codePointAt(0) ?? 0;
  const hex = `U+${code.toString(16).toUpperCase().padStart(4, "0")}`;

  if (char >= "A" && char <= "Z") return `Chữ ${char} hoa · Latin Capital Letter ${char} (${hex})`;
  if (char >= "a" && char <= "z") return `Chữ ${char} thường · Latin Small Letter ${char} (${hex})`;
  if (char >= "0" && char <= "9") return `Chữ số ${char} · Digit ${char} (${hex})`;
  if (char === "₫") return `Ký hiệu Đồng Việt Nam (₫) · Vietnamese Dong Sign (${hex})`;
  if (char === "Đ") return `Chữ Đ hoa có gạch · Latin Capital Letter D with Stroke (${hex})`;
  if (char === "đ") return `Chữ đ thường có gạch · Latin Small Letter D with Stroke (${hex})`;

  const viNames: Record<string, string> = {
    À: "Chữ À hoa (dấu huyền)",
    Á: "Chữ Á hoa (dấu sắc)",
    Ả: "Chữ Ả hoa (dấu hỏi)",
    Ã: "Chữ Ã hoa (dấu ngã)",
    Ạ: "Chữ Ạ hoa (dấu nặng)",
    Ă: "Chữ Ă hoa (a nón trăng)",
    Ằ: "Chữ Ằ hoa (a trăng huyền)",
    Ắ: "Chữ Ắ hoa (a trăng sắc)",
    Ẳ: "Chữ Ẳ hoa (a trăng hỏi)",
    Ẵ: "Chữ Ẵ hoa (a trăng ngã)",
    Ặ: "Chữ Ặ hoa (a trăng nặng)",
    Â: "Chữ Â hoa (a nón chóp)",
    Ầ: "Chữ Ầ hoa (a nón huyền)",
    Ấ: "Chữ Ấ hoa (a nón sắc)",
    Ẩ: "Chữ Ẩ hoa (a nón hỏi)",
    Ẫ: "Chữ Ẫ hoa (a nón ngã)",
    Ậ: "Chữ Ậ hoa (a nón nặng)",
    È: "Chữ È hoa (dấu huyền)",
    É: "Chữ É hoa (dấu sắc)",
    Ẻ: "Chữ Ẻ hoa (dấu hỏi)",
    Ẽ: "Chữ Ẽ hoa (dấu ngã)",
    Ẹ: "Chữ Ẹ hoa (dấu nặng)",
    Ê: "Chữ Ê hoa (e nón chóp)",
    Ề: "Chữ Ề hoa (e nón huyền)",
    Ế: "Chữ Ế hoa (e nón sắc)",
    Ể: "Chữ Ể hoa (e nón hỏi)",
    Ễ: "Chữ Ễ hoa (e nón ngã)",
    Ệ: "Chữ Ệ hoa (e nón nặng)",
    Ì: "Chữ Ì hoa (dấu huyền)",
    Í: "Chữ Í hoa (dấu sắc)",
    Ỉ: "Chữ Ỉ hoa (dấu hỏi)",
    Ĩ: "Chữ Ĩ hoa (dấu ngã)",
    Ị: "Chữ Ị hoa (dấu nặng)",
    Ò: "Chữ Ò hoa (dấu huyền)",
    Ó: "Chữ Ó hoa (dấu sắc)",
    Ỏ: "Chữ Ỏ hoa (dấu hỏi)",
    Õ: "Chữ Õ hoa (dấu ngã)",
    Ọ: "Chữ Ọ hoa (dấu nặng)",
    Ô: "Chữ Ô hoa (o nón chóp)",
    Ồ: "Chữ Ồ hoa (o nón huyền)",
    Ố: "Chữ Ố hoa (o nón sắc)",
    Ổ: "Chữ Ổ hoa (o nón hỏi)",
    Ỗ: "Chữ Ỗ hoa (o nón ngã)",
    Ộ: "Chữ Ộ hoa (o nón nặng)",
    Ơ: "Chữ Ơ hoa (o có râu)",
    Ờ: "Chữ Ờ hoa (o râu huyền)",
    Ớ: "Chữ Ớ hoa (o râu sắc)",
    Ở: "Chữ Ở hoa (o râu hỏi)",
    Ỡ: "Chữ Ỡ hoa (o râu ngã)",
    Ợ: "Chữ Ợ hoa (o râu nặng)",
    Ù: "Chữ Ù hoa (dấu huyền)",
    Ú: "Chữ Ú hoa (dấu sắc)",
    Ủ: "Chữ Ủ hoa (dấu hỏi)",
    Ũ: "Chữ Ũ hoa (dấu ngã)",
    Ụ: "Chữ Ụ hoa (dấu nặng)",
    Ư: "Chữ Ư hoa (u có râu)",
    Ừ: "Chữ Ừ hoa (u râu huyền)",
    Ứ: "Chữ Ứ hoa (u râu sắc)",
    Ử: "Chữ Ử hoa (u râu hỏi)",
    Ữ: "Chữ Ữ hoa (u râu ngã)",
    Ự: "Chữ Ự hoa (u râu nặng)",
    Ỳ: "Chữ Ỳ hoa (dấu huyền)",
    Ý: "Chữ Ý hoa (dấu sắc)",
    Ỷ: "Chữ Ỷ hoa (dấu hỏi)",
    Ỹ: "Chữ Ỹ hoa (dấu ngã)",
    Ỵ: "Chữ Ỵ hoa (dấu nặng)",
  };

  const symbolNames: Record<string, string> = {
    "©": "Ký hiệu Bản quyền (Copyright)",
    "®": "Ký hiệu Nhãn hiệu đã đăng ký (Registered Trademark)",
    "™": "Ký hiệu Nhãn hiệu (Trademark)",
    "°": "Ký hiệu Độ (Degree)",
    "—": "Dấu gạch ngang dài (Em Dash)",
    "–": "Dấu gạch nối vừa (En Dash)",
    "…": "Dấu ba chấm lửng (Ellipsis)",
    "•": "Dấu chấm đầu dòng (Bullet)",
  };

  if (symbolNames[char]) return `${symbolNames[char]} (${hex})`;
  if (viNames[char]) return `${viNames[char]} (${hex})`;

  const upperChar = char.toUpperCase();
  if (viNames[upperChar]) {
    return `${viNames[upperChar].replace("hoa", "thường")} (${hex})`;
  }

  return `Ký tự '${char}' (${hex})`;
}

interface GlyphGridGroupProps {
  title: string;
  chars: string[];
  selectedChar: string;
  onSelect: (char: string) => void;
  fontStyle: React.CSSProperties;
}

// Bọc React.memo để tránh re-render hàng trăm nút bấm khi chọn ký tự
const GlyphGridGroup = React.memo(function GlyphGridGroup({
  title,
  chars,
  selectedChar,
  onSelect,
  fontStyle,
}: GlyphGridGroupProps) {
  if (chars.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-baseline justify-between mb-2">
        <span className="micro font-mono text-[11px] uppercase tracking-wider text-muted">
          {title} ({chars.length})
        </span>
      </div>
      <div
        style={fontStyle}
        className="grid grid-cols-7 sm:grid-cols-11 md:grid-cols-11 border-l border-t border-line"
      >
        {chars.map((char) => {
          const isSelected = selectedChar === char;
          return (
            <button
              key={char}
              type="button"
              aria-label={getGlyphName(char)}
              aria-pressed={isSelected}
              onClick={() => onSelect(char)}
              className={`relative flex aspect-square min-h-[44px] items-center justify-center border-b border-r border-line bg-panel text-[20px] transition-colors cursor-pointer select-none ${
                isSelected
                  ? "ring-2 ring-cream z-10 font-bold bg-soft text-cream"
                  : "hover:bg-soft text-panel-ink"
              }`}
            >
              {char}
            </button>
          );
        })}
      </div>
    </div>
  );
});

type Props = {
  slug: string;
  name: string;
  glyphsCount: number;
  styles?: FontStyle[];
  metrics?: FontMetrics;
};

export function GlyphInspector({
  slug,
  name,
  glyphsCount,
  styles = [],
  metrics,
}: Props) {
  // Currently selected glyph (default 'R' like Fontshare Satoshi)
  const [selectedChar, setSelectedChar] = useState("R");
  // Render mode: solid vs outlines
  const [renderMode, setRenderMode] = useState<"solid" | "outlines">("solid");
  // Active style / weight
  const [selectedStyleKey, setSelectedStyleKey] = useState<string>(() => {
    const regular = styles.find((s) => !s.italic && s.weight === 400);
    return regular?.key ?? styles[0]?.key ?? "400";
  });
  // Set mode: basic vs full
  const [setMode, setSetMode] = useState<"basic" | "full">("basic");
  // Custom type your letters filter
  const [customInput, setCustomInput] = useState("");
  // React 18 useDeferredValue để gõ phím không bị lag giao diện
  const deferredInput = useDeferredValue(customInput);

  // Container height measurement for dynamic responsive font-size
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState(500);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const updateSize = () => {
      if (node.clientHeight > 0) {
        setCanvasHeight(node.clientHeight);
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const activeStyle =
    styles.find((s) => s.key === selectedStyleKey) ?? styles[0];
  const activeWeight = activeStyle?.weight ?? 400;
  const isItalic = activeStyle?.italic ?? false;

  const codePoint = selectedChar.codePointAt(0) ?? 82;
  const hex = `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`;
  const charTitle = getGlyphName(selectedChar);

  // Grouped filtered characters với deferredInput
  const filteredGroups = useMemo(() => {
    const query = deferredInput.trim().toLowerCase();
    const filter = (chars: string[]) =>
      !query ? chars : chars.filter((c) => query.includes(c.toLowerCase()));

    return {
      upper: filter(UPPERCASE_CHARS),
      lower: filter(LOWERCASE_CHARS),
      numerals: filter(NUMERAL_CHARS),
      viUpper: filter(VI_ACCENTED_UPPER),
      viLower: filter(VI_ACCENTED_LOWER),
      symbols: filter(PUNCTUATION_AND_SYMBOLS),
    };
  }, [deferredInput]);

  const fontStyle = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: `'${slug}', sans-serif`,
      fontWeight: activeWeight,
      fontStyle: isItalic ? "italic" : "normal",
    }),
    [slug, activeWeight, isItalic]
  );

  // Kiểm tra trạng thái tìm kiếm rỗng
  const isSearchEmpty =
    customInput.trim().length > 0 &&
    filteredGroups.upper.length === 0 &&
    filteredGroups.lower.length === 0 &&
    filteredGroups.numerals.length === 0 &&
    filteredGroups.viUpper.length === 0 &&
    filteredGroups.viLower.length === 0 &&
    filteredGroups.symbols.length === 0;

  // ─────────────────────────────────────────────────────────────
  // TYPOGRAPHY METRICS & DIACRITICS HEADROOM CALCULATION
  // Chống cắt dấu kép hoa tiếng Việt (Ắ, Ấ, Ế, Ỗ, Ớ, Ứ...)
  // ─────────────────────────────────────────────────────────────
  const rawDescent = metrics?.descent ?? -211;
  const descent = rawDescent > 0 ? -rawDescent : rawDescent; // Always negative, e.g. -265
  const capHeight = metrics?.capHeight ?? 716;
  const xHeight = metrics?.xHeight ?? 484;
  const ascender = metrics?.ascent ?? 1000;
  const unitsPerEm = metrics?.unitsPerEm ?? 1000;

  // Max accent height tính khoảng đệm cho dấu kép tiếng Việt hoa (vươn cao hơn capHeight ~38%)
  const maxAccentHeight = Math.max(ascender, Math.round(capHeight * 1.38));
  const span = maxAccentHeight + Math.abs(descent);

  // Khoảng đệm an toàn trên đỉnh và dưới đáy
  const padTop = Math.round(span * 0.15);
  const padBottom = Math.round(span * 0.12);
  const totalRange = maxAccentHeight + Math.abs(descent) + padTop + padBottom;

  // Vị trí các trục toạ độ typography
  const capHeightY = padTop + (maxAccentHeight - capHeight);
  const xHeightY = padTop + (maxAccentHeight - xHeight);
  const baselineY = padTop + maxAccentHeight;
  const descenderY = baselineY + Math.abs(descent);

  const capHeightPct = (capHeightY / totalRange) * 100;
  const xHeightPct = (xHeightY / totalRange) * 100;
  const baselinePct = (baselineY / totalRange) * 100;
  const descenderPct = (descenderY / totalRange) * 100;

  // Cỡ chữ SVG đảm bảo tỷ lệ toán học chính xác 100%
  const computedFontSize = Math.round(canvasHeight * (unitsPerEm / totalRange));

  return (
    <section id="glyphs" className="shell mt-16 scroll-mt-20">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER                                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="border-b border-line pb-6">
        <h2 className="text-[28px] font-bold md:text-[34px] tracking-tight">
          {glyphsCount} Glyphs
        </h2>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. TWO-COLUMN WORKSPACE (Chuẩn Fontshare)                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        {/* ── LEFT COLUMN: TYPOGRAPHY METRICS CANVAS ── */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Sub-header: Char Title & Solid / Outlines Toggle */}
          <div className="flex items-center justify-between border-b border-line/60 pb-3 text-[14px]">
            <div className="flex items-baseline gap-3">
              <span className="font-bold text-ink">{charTitle}</span>
              <span className="font-mono text-muted text-[13px]">{hex}</span>
            </div>

            <div
              role="group"
              aria-label="Chế độ hiển thị nét chữ"
              className="flex items-center gap-3 text-[13px]"
            >
              <button
                type="button"
                aria-pressed={renderMode === "solid"}
                onClick={() => setRenderMode("solid")}
                className={`py-1 cursor-pointer transition-colors ${
                  renderMode === "solid"
                    ? "font-bold text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                Solid
              </button>
              <span className="text-line" aria-hidden="true">|</span>
              <button
                type="button"
                aria-pressed={renderMode === "outlines"}
                onClick={() => setRenderMode("outlines")}
                className={`py-1 cursor-pointer transition-colors ${
                  renderMode === "outlines"
                    ? "font-bold text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                Outlines
              </button>
            </div>
          </div>

          {/* Metric Diagram Canvas with Real Font Metrics */}
          <div
            ref={containerRef}
            className="relative mt-4 flex min-h-[360px] md:min-h-[520px] overflow-hidden border border-line bg-panel p-6 select-none"
          >
            {/* Top Metric: Cap Height */}
            <div
              className="absolute left-6 right-6 flex items-center justify-between text-[11px] text-muted -translate-y-1/2 pointer-events-none z-10 transition-all duration-200"
              style={{ top: `${capHeightPct}%` }}
            >
              <span className="font-mono tracking-wider uppercase text-muted font-medium">
                Cap Height
              </span>
              <div className="mx-3 flex-1 border-b border-muted/50 border-dashed" />
              <span className="font-mono text-muted font-medium">{capHeight}</span>
            </div>

            {/* Metric: X height */}
            <div
              className="absolute left-6 right-6 flex items-center justify-between text-[11px] text-muted -translate-y-1/2 pointer-events-none z-10 transition-all duration-200"
              style={{ top: `${xHeightPct}%` }}
            >
              <span className="font-mono tracking-wider uppercase text-muted font-medium">
                X height
              </span>
              <div className="mx-3 flex-1 border-b border-muted/50 border-dashed" />
              <span className="font-mono text-muted font-medium">{xHeight}</span>
            </div>

            {/* SVG Glyph aligned to Real Baseline */}
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
                fill={renderMode === "solid" ? "var(--ink)" : "none"}
                stroke={renderMode === "outlines" ? "var(--ink)" : "none"}
                strokeWidth={renderMode === "outlines" ? 2 : 0}
                className="transition-colors duration-150"
              >
                {selectedChar}
              </text>
            </svg>

            {/* Metric: Baseline (Bright solid line for primary reference) */}
            <div
              className="absolute left-6 right-6 flex items-center justify-between text-[11px] text-ink -translate-y-1/2 pointer-events-none z-10 transition-all duration-200"
              style={{ top: `${baselinePct}%` }}
            >
              <span className="font-mono tracking-wider uppercase font-semibold text-ink">
                Baseline
              </span>
              <div className="mx-3 flex-1 border-b border-muted/80" />
              <span className="font-mono font-semibold text-ink">0</span>
            </div>

            {/* Bottom Metric: Descender */}
            <div
              className="absolute left-6 right-6 flex items-center justify-between text-[11px] text-muted -translate-y-1/2 pointer-events-none z-10 transition-all duration-200"
              style={{ top: `${descenderPct}%` }}
            >
              <span className="font-mono tracking-wider uppercase text-muted font-medium">
                Descender
              </span>
              <div className="mx-3 flex-1 border-b border-muted/50 border-dashed" />
              <span className="font-mono text-muted font-medium">{descent}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: CONTROLS & GROUPED GLYPH TABLE ── */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Controls Bar: Style Dropdown, Basic Set / Full Set, Type your letters */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/60 pb-3 text-[14px]">
            {/* Style Selector */}
            {styles.length > 0 && (
              <div className="relative flex items-center gap-1.5">
                <select
                  aria-label="Chọn kiểu chữ hiển thị"
                  value={selectedStyleKey}
                  onChange={(e) => setSelectedStyleKey(e.target.value)}
                  className="appearance-none bg-transparent pr-5 text-[14px] font-bold text-ink outline-none cursor-pointer"
                >
                  {styles.map((s) => (
                    <option key={s.key} value={s.key} className="bg-panel text-panel-ink">
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
              </div>
            )}

            {/* Basic Set | Full Set Toggle */}
            <div
              role="group"
              aria-label="Phạm vi bảng ký tự"
              className="flex items-center gap-3 text-[13px]"
            >
              <button
                type="button"
                aria-pressed={setMode === "basic"}
                onClick={() => setSetMode("basic")}
                className={`py-1 cursor-pointer transition-colors ${
                  setMode === "basic"
                    ? "font-bold text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                Basic Set
              </button>
              <span className="text-line" aria-hidden="true">|</span>
              <button
                type="button"
                aria-pressed={setMode === "full"}
                onClick={() => setSetMode("full")}
                className={`py-1 cursor-pointer transition-colors ${
                  setMode === "full"
                    ? "font-bold text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                Full Set
              </button>
            </div>

            {/* "Type your letters" input */}
            <div className="flex items-center gap-2">
              <span className="micro text-[13px]" aria-hidden="true">✎</span>
              <input
                type="text"
                aria-label="Nhập chữ cái để lọc"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type your letters"
                className="w-32 bg-transparent text-[13px] text-ink outline-none placeholder:text-muted/60"
              />
              {customInput && (
                <button
                  type="button"
                  aria-label="Xóa bộ lọc ký tự"
                  onClick={() => setCustomInput("")}
                  className="flex h-7 w-7 items-center justify-center rounded text-muted hover:text-ink focus-visible:ring-1 focus-visible:ring-ink cursor-pointer"
                  title="Xóa lọc"
                >
                  <span className="text-[16px] leading-none" aria-hidden="true">×</span>
                </button>
              )}
            </div>
          </div>

          {/* Grouped Glyph Tables */}
          <div className="mt-6 space-y-8">
            {/* Empty State khi tìm kiếm không thấy ký tự */}
            {isSearchEmpty ? (
              <div className="py-12 text-center border border-dashed border-line p-6">
                <p className="text-[15px] text-ink font-medium">
                  Không tìm thấy ký tự khớp với &ldquo;{customInput}&rdquo;
                </p>
                <p className="micro mt-1 text-muted">
                  Phông chữ này có thể không chứa ký hiệu bạn đã nhập.
                </p>
                <button
                  type="button"
                  onClick={() => setCustomInput("")}
                  className="btn-solid mt-4 py-1.5 px-3 text-[13px] cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <GlyphGridGroup
                  title="Uppercase"
                  chars={filteredGroups.upper}
                  selectedChar={selectedChar}
                  onSelect={setSelectedChar}
                  fontStyle={fontStyle}
                />

                <GlyphGridGroup
                  title="Lowercase"
                  chars={filteredGroups.lower}
                  selectedChar={selectedChar}
                  onSelect={setSelectedChar}
                  fontStyle={fontStyle}
                />

                <GlyphGridGroup
                  title="Numerals"
                  chars={filteredGroups.numerals}
                  selectedChar={selectedChar}
                  onSelect={setSelectedChar}
                  fontStyle={fontStyle}
                />

                {/* Tự động hiển thị nhóm ký tự tiếng Việt khi đang tìm kiếm hoặc đang ở Full Set */}
                {(setMode === "full" || customInput.trim().length > 0) && (
                  <>
                    <GlyphGridGroup
                      title="Vietnamese Uppercase (Dấu thanh hoa)"
                      chars={filteredGroups.viUpper}
                      selectedChar={selectedChar}
                      onSelect={setSelectedChar}
                      fontStyle={fontStyle}
                    />

                    <GlyphGridGroup
                      title="Vietnamese Lowercase (Dấu thanh thường)"
                      chars={filteredGroups.viLower}
                      selectedChar={selectedChar}
                      onSelect={setSelectedChar}
                      fontStyle={fontStyle}
                    />

                    <GlyphGridGroup
                      title="Punctuation & Currency (Bao gồm ký hiệu đồng ₫)"
                      chars={filteredGroups.symbols}
                      selectedChar={selectedChar}
                      onSelect={setSelectedChar}
                      fontStyle={fontStyle}
                    />
                  </>
                )}

                {/* Bottom Button: Show / Hide Full Set */}
                {!customInput && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSetMode((prev) => (prev === "basic" ? "full" : "basic"))
                      }
                      className="chip text-[13px] font-bold text-ink underline cursor-pointer"
                    >
                      {setMode === "basic" ? "Show Full Set ↓" : "Show Basic Set ↑"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
