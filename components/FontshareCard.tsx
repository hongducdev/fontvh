"use client";

import { useEffect, useRef, useState, memo, useSyncExternalStore } from "react";
import Link from "next/link";
import type { FontFamily, FontStyle } from "@/lib/types";
import {
  isFavorite as checkIsFavorite,
  toggleFavorite as doToggleFavorite,
  subscribeFavorites,
} from "@/lib/favorites";
import {
  StarIcon,
  DownloadIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  CheckIcon,
  CopyIcon,
} from "./icons";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

type Props = {
  family: FontFamily;
  globalText?: string;
  globalSize?: number;
  onApplyToAll?: (text: string, size: number, weight: number) => void;
  className?: string;
};

export const FontshareCard = memo(function FontshareCard({
  family,
  globalText,
  globalSize,
  onApplyToAll,
  className = "",
}: Props) {
  const weightAxis = family.axes.find((axis) => axis.tag === "wght");
  const defaultStyle =
    family.styles.find(
      (s) => !s.italic && s.weight === family.preview.weight
    ) ??
    family.styles.find((s) => !s.italic) ??
    family.styles[0];

  const fallbackGeneric = family.categories.includes("serif")
    ? "serif"
    : family.categories.includes("monospace") || family.categories.includes("mono")
    ? "monospace"
    : "sans-serif";

  // State
  const [localText, setLocalText] = useState<string | null>(null);
  const [isCustomized, setIsCustomized] = useState(false);
  const [weight, setWeight] = useState(defaultStyle?.weight ?? 400);
  const [size, setSize] = useState(globalSize ?? 88);
  const [leading, setLeading] = useState(1.05);
  const [italic, setItalic] = useState(defaultStyle?.italic ?? false);
  const [selectedStyleName, setSelectedStyleName] = useState<string>(
    family.axes.length > 0 ? "Variable" : defaultStyle?.name ?? "Regular"
  );
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [align, setAlign] = useState<"left" | "center" | "right">("left");
  const [colorMode, setColorMode] = useState<"black" | "white">("black");
  const [appliedNotice, setAppliedNotice] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync size when globalSize changes and not locally customized
  useEffect(() => {
    if (globalSize !== undefined && !isCustomized) {
      setSize(globalSize);
    }
  }, [globalSize, isCustomized]);

  // Vercel Best Practice: js-cache-storage & client-event-listeners via useSyncExternalStore
  const isFavorite = useSyncExternalStore(
    subscribeFavorites,
    () => checkIsFavorite(family.slug),
    () => false
  );

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    doToggleFavorite(family.slug);
  };

  // Vercel Best Practice (client-event-listeners): Only attach listener when dropdown is open
  useEffect(() => {
    if (!isStyleDropdownOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsStyleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isStyleDropdownOpen]);

  const currentText = isCustomized
    ? localText ?? ""
    : globalText && globalText.trim().length > 0
    ? globalText
    : family.name;

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currentText, size, leading]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsCustomized(true);
    setLocalText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSelectStyle = (style: FontStyle) => {
    setSelectedStyleName(style.name);
    setWeight(style.weight);
    setItalic(style.italic);
    setIsStyleDropdownOpen(false);
  };

  const handleSelectVariable = () => {
    setSelectedStyleName("Variable");
    setIsStyleDropdownOpen(false);
  };

  const handleReset = () => {
    setIsCustomized(false);
    setLocalText(null);
    setSize(globalSize ?? 88);
    setWeight(defaultStyle?.weight ?? 400);
    setLeading(1.05);
    setItalic(defaultStyle?.italic ?? false);
    setSelectedStyleName(family.axes.length > 0 ? "Variable" : defaultStyle?.name ?? "Regular");
    setAlign("left");
    setColorMode("black");
  };

  const handleApplyToAll = () => {
    onApplyToAll?.(currentText, size, weight);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 2000);
  };

  const handleCopyCss = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const decl = `font-family: '${family.slug}', ${fallbackGeneric}; font-weight: ${weight}; font-style: ${italic ? "italic" : "normal"};`;
      await navigator.clipboard.writeText(decl);
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2000);
    } catch {
      // Fallback
    }
  };

  const isLight = colorMode === "white";

  return (
    <div
      style={
        isLight
          ? ({
              "--ink": "#101010",
              "--faint": "#cfcfc8",
              "--muted": "#666666",
              "--panel-ink": "#101010",
              "--panel-muted": "#666666",
              "--panel-line": "#e5e5e0",
            } as React.CSSProperties)
          : undefined
      }
      className={`group relative cv-card transition-colors ${
        isLight
          ? "bg-[#fafaf8] text-[#121212]"
          : "bg-panel text-panel-ink hover:bg-row-hover"
      } ${className}`}
    >
      {/* 1. TOP HEADER & INLINE CONTROLS */}
      <div
        className={`flex flex-wrap items-center justify-between gap-y-2.5 gap-x-4 border-b px-4 py-3 text-[13px] sm:px-6 md:px-10 md:py-3.5 ${
          isLight ? "border-[#e5e5e0] text-[#555]" : "border-line text-panel-muted"
        }`}
      >
        {/* Left: Font Name & Star Icon & Style Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={`/fonts/${family.slug}`}
            className={`font-bold text-[15px] sm:text-[16px] tracking-tight hover:underline ${
              isLight ? "text-[#121212]" : "text-panel-ink"
            }`}
          >
            {family.name}
          </Link>
          <button
            type="button"
            onClick={toggleFavorite}
            className={`p-1 transition-colors cursor-pointer ${
              isFavorite
                ? "text-yellow-400"
                : isLight
                ? "text-[#888] hover:text-[#121212]"
                : "text-panel-muted hover:text-panel-ink"
            }`}
            title={isFavorite ? "Đã lưu vào yêu thích" : "Lưu vào yêu thích"}
            aria-label={`Yêu thích font ${family.name}`}
          >
            <StarIcon filled={isFavorite} className="h-4 w-4" />
          </button>

          {/* Style / Variable Dropdown */}
          <div className="relative ml-0.5 sm:ml-1" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsStyleDropdownOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded px-2.5 py-1 text-[12px] sm:text-[13px] font-medium transition-colors cursor-pointer ${
                isLight
                  ? "bg-[#e8e8e4] text-[#121212] hover:bg-[#deded8]"
                  : "bg-soft text-panel-ink hover:bg-line"
              }`}
              title="Chọn kiểu chữ"
            >
              <span>{selectedStyleName}</span>
              <ChevronDownIcon
                className={`opacity-70 transition-transform duration-150 ${
                  isStyleDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isStyleDropdownOpen && (
              <div
                className={`absolute left-0 top-full z-30 mt-1 max-h-60 w-48 overflow-y-auto rounded border shadow-xl ${
                  isLight
                    ? "border-[#d0d0c8] bg-[#ffffff] text-[#121212]"
                    : "border-line bg-panel text-panel-ink shadow-black/60"
                }`}
              >
                {family.axes.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectVariable}
                    className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px] font-bold transition-colors cursor-pointer ${
                      selectedStyleName === "Variable"
                        ? isLight
                          ? "bg-[#eaeae6]"
                          : "bg-soft"
                        : isLight
                        ? "hover:bg-[#f2f2ee]"
                        : "hover:bg-row-hover"
                    }`}
                  >
                    <span>Variable (Đa trục)</span>
                    <span className="text-[10px] opacity-60">
                      {family.axes.map((a) => a.tag).join(", ")}
                    </span>
                  </button>
                )}
                {family.styles.map((style) => (
                  <button
                    key={style.key}
                    type="button"
                    onClick={() => handleSelectStyle(style)}
                    className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px] transition-colors cursor-pointer ${
                      selectedStyleName === style.name
                        ? isLight
                          ? "bg-[#eaeae6] font-bold"
                          : "bg-soft font-bold"
                        : isLight
                        ? "hover:bg-[#f2f2ee]"
                        : "hover:bg-row-hover"
                    }`}
                  >
                    <span className={style.italic ? "italic" : ""}>
                      {style.name}
                    </span>
                    <span className="font-mono text-[10px] opacity-60">
                      {style.weight}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Inline Sliders (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-[12px]">
          {/* Weight Slider */}
          <div className="flex items-center gap-2">
            <label htmlFor={`weight-${family.slug}`} className="opacity-75 font-medium">
              Weight
            </label>
            <input
              id={`weight-${family.slug}`}
              type="range"
              min={weightAxis?.min ?? 100}
              max={weightAxis?.max ?? 900}
              step={weightAxis ? 1 : 100}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="range w-16 sm:w-20 cursor-pointer"
            />
            <span className="font-mono text-[11px] opacity-75 min-w-[28px] text-right">{weight}</span>
          </div>

          {/* Size Slider */}
          <div className="flex items-center gap-2">
            <label htmlFor={`size-${family.slug}`} className="opacity-75 font-medium">
              Size
            </label>
            <input
              id={`size-${family.slug}`}
              type="range"
              min={24}
              max={144}
              step={2}
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setIsCustomized(true);
              }}
              className="range w-16 sm:w-20 cursor-pointer"
            />
            <span className="font-mono text-[11px] opacity-75 min-w-[34px] text-right">{size}px</span>
          </div>

          {/* Line-height / Leading Slider */}
          <div className="flex items-center gap-2">
            <label htmlFor={`leading-${family.slug}`} className="opacity-75 font-medium">
              Leading
            </label>
            <input
              id={`leading-${family.slug}`}
              type="range"
              min={0.8}
              max={2.0}
              step={0.05}
              value={leading}
              onChange={(e) => setLeading(Number(e.target.value))}
              className="range w-14 sm:w-16 cursor-pointer"
            />
            <span className="font-mono text-[11px] opacity-75 min-w-[28px] text-right">{leading.toFixed(2)}</span>
          </div>
        </div>

        {/* Right: Meta Badges */}
        <div className="flex items-center gap-3 sm:gap-4 text-[12px] sm:text-[13px]">
          <span>{family.styles.length} styles</span>
          {family.axes.length > 0 && (
            <span className="rounded bg-soft px-1.5 py-0.5 text-[11px] font-bold">
              Variable
            </span>
          )}
          <span className="hidden sm:inline opacity-70">
            {family.license?.name
              ? family.license.name.includes("OFL") || family.license.name.includes("SIL")
                ? "Open Source"
                : family.license.name
              : "Free"}
          </span>
        </div>
      </div>

      {/* 2. BIG SPECIMEN TEXT (Directly Clickable & Editable with Fluid clamp scaling) */}
      <div
        onClick={() => textareaRef.current?.focus()}
        className="cursor-text px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-12"
      >
        <label htmlFor={`specimen-input-${family.slug}`} className="sr-only">
          Chỉnh sửa chữ thử cho font {family.name}
        </label>
        <div>
          <textarea
            id={`specimen-input-${family.slug}`}
            ref={textareaRef}
            rows={1}
            value={currentText}
            onChange={handleTextChange}
            placeholder={family.name}
            spellCheck={false}
            style={{
              fontFamily: `'${family.slug}', ${fallbackGeneric}`,
              fontSize: `clamp(26px, 12vw, ${size}px)`,
              fontWeight: weight,
              fontVariationSettings: weightAxis ? `'wght' ${weight}` : undefined,
              fontStyle: italic ? "italic" : "normal",
              lineHeight: leading,
              textAlign: align,
            }}
            className={`w-full resize-none overflow-hidden border-0 bg-transparent p-0 outline-none transition-colors break-words placeholder:opacity-30 ${
              isLight
                ? "text-[#121212] caret-[#121212] selection:bg-[#121212] selection:text-[#fafaf8]"
                : "text-panel-ink caret-panel-ink selection:bg-panel-ink selection:text-panel"
            }`}
          />
        </div>
      </div>

      {/* 3. BOTTOM BAR (Designer info, Copy CSS, Download & View Family) */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3.5 text-[12px] sm:text-[13px] sm:px-6 md:px-10 md:py-4 ${
          isLight ? "border-[#e5e5e0] text-[#666]" : "border-line text-panel-muted"
        }`}
      >
        {/* Left: Designer */}
        <span className="truncate max-w-[200px] sm:max-w-xs md:max-w-md">
          Designed by{" "}
          <span className={`underline underline-offset-4 ${isLight ? "text-[#121212]" : "text-panel-ink"}`}>
            {family.foundry || family.designer || "Không rõ"}
          </span>
        </span>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Copy CSS */}
          <button
            type="button"
            onClick={handleCopyCss}
            className="inline-flex min-h-[38px] items-center gap-1.5 text-panel-muted hover:text-panel-ink cursor-pointer"
            title="Sao chép CSS font-family"
          >
            {copiedCss ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            <span className="hidden xs:inline">{copiedCss ? "Đã chép" : "Copy CSS"}</span>
          </button>

          {/* Controls / Drawer Toggle button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            className={`inline-flex min-h-[38px] items-center gap-1 chip text-[12px] sm:text-[13px] transition-colors cursor-pointer ${
              isDrawerOpen ? "font-bold text-ink" : ""
            }`}
          >
            <span>Tùy chỉnh</span>
            <ChevronDownIcon
              className={`transition-transform duration-200 ${
                isDrawerOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Download Zip */}
          <a
            href={`/api/download/${family.slug}`}
            download
            className={`inline-flex min-h-[38px] items-center gap-1.5 transition-colors cursor-pointer ${
              isLight ? "text-[#555] hover:text-[#121212] border-b border-transparent" : "text-panel-muted hover:text-panel-ink"
            }`}
            title={`Tải font .zip (${formatBytes(family.size)})`}
          >
            <DownloadIcon />
            <span className="hidden sm:inline">Tải ({formatBytes(family.size)})</span>
          </a>

          {/* View Family / Xem họ chữ */}
          <Link
            href={`/fonts/${family.slug}`}
            className="inline-flex min-h-[38px] items-center gap-1.5 font-bold text-panel-ink transition-transform hover:translate-x-0.5 hover:underline"
          >
            <span>Chi tiết</span>
            <ArrowRightIcon />
          </Link>
        </div>
      </div>

      {/* 4. EXTENDED CONTROL DRAWER */}
      {isDrawerOpen && (
        <div
          className={`border-t px-4 py-5 sm:px-6 sm:py-6 md:px-10 ${
            isLight
              ? "border-[#e5e5e0] bg-[#f0f0ee] text-[#444]"
              : "border-line bg-soft text-panel-muted"
          }`}
        >
          {/* Mobile-only Sliders Strip inside Drawer */}
          <div className="space-y-4 md:hidden border-b border-line/40 pb-5 mb-5">
            <h4 className={`text-[12px] font-bold uppercase tracking-wider ${isLight ? "text-[#121212]" : "text-panel-ink"}`}>
              Kích thước & Trọng số
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Mobile Weight */}
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span>Độ đậm (Weight)</span>
                  <span className="font-mono font-bold">{weight}</span>
                </div>
                <input
                  type="range"
                  min={weightAxis?.min ?? 100}
                  max={weightAxis?.max ?? 900}
                  step={weightAxis ? 1 : 100}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="range w-full"
                />
              </div>
              {/* Mobile Size */}
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span>Cỡ chữ (Size)</span>
                  <span className="font-mono font-bold">{size}px</span>
                </div>
                <input
                  type="range"
                  min={24}
                  max={144}
                  step={2}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="range w-full"
                />
              </div>
              {/* Mobile Leading */}
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span>Giãn dòng (Leading)</span>
                  <span className="font-mono font-bold">{leading.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0.8}
                  max={2.0}
                  step={0.05}
                  value={leading}
                  onChange={(e) => setLeading(Number(e.target.value))}
                  className="range w-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
            {/* Section 1: Text Options */}
            <div className="space-y-4 md:col-span-6">
              <h4 className={`text-[12px] font-bold uppercase tracking-wider ${isLight ? "text-[#121212]" : "text-panel-ink"}`}>
                Tùy chọn hiển thị
              </h4>

              <div className="flex flex-wrap items-center gap-6">
                {/* Text Alignment */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setAlign("left")}
                    aria-label="Căn trái"
                    className={`rounded p-1.5 transition-colors cursor-pointer ${
                      align === "left"
                        ? isLight
                          ? "bg-[#ddd] text-[#121212]"
                          : "bg-panel text-panel-ink"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <AlignLeftIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlign("center")}
                    aria-label="Căn giữa"
                    className={`rounded p-1.5 transition-colors cursor-pointer ${
                      align === "center"
                        ? isLight
                          ? "bg-[#ddd] text-[#121212]"
                          : "bg-panel text-panel-ink"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <AlignCenterIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlign("right")}
                    aria-label="Căn phải"
                    className={`rounded p-1.5 transition-colors cursor-pointer ${
                      align === "right"
                        ? isLight
                          ? "bg-[#ddd] text-[#121212]"
                          : "bg-panel text-panel-ink"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <AlignRightIcon />
                  </button>
                </div>

                {/* Color mode: White vs Black */}
                <div className="flex items-center gap-2 text-[13px]">
                  <span className="opacity-70">Thẻ màu:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setColorMode("white")}
                      className={`px-2 py-0.5 rounded text-[12px] transition-colors cursor-pointer ${
                        colorMode === "white"
                          ? "bg-[#121212] text-[#ffffff] font-bold"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      Sáng
                    </button>
                    <button
                      type="button"
                      onClick={() => setColorMode("black")}
                      className={`px-2 py-0.5 rounded text-[12px] transition-colors cursor-pointer ${
                        colorMode === "black"
                          ? "bg-solid-bg text-solid-ink font-bold"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      Tối
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Apply to All & Reset */}
              <div className="flex items-center gap-4 pt-2">
                {onApplyToAll && (
                  <button
                    type="button"
                    onClick={handleApplyToAll}
                    className={`chip text-[13px] font-bold transition-colors cursor-pointer ${
                      isLight ? "text-[#121212]" : "text-panel-ink"
                    }`}
                  >
                    {appliedNotice ? "✓ Đã áp dụng" : "Áp dụng cho tất cả"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleReset}
                  className="chip text-[13px] opacity-70 hover:opacity-100 cursor-pointer"
                >
                  Đặt lại
                </button>
              </div>
            </div>

            {/* Section 2: Quick Styles */}
            <div className="space-y-4 md:col-span-6">
              <h4 className={`text-[12px] font-bold uppercase tracking-wider ${isLight ? "text-[#121212]" : "text-panel-ink"}`}>
                Kiểu chữ ({family.styles.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {family.styles.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => handleSelectStyle(s)}
                    className={`rounded px-2.5 py-1 text-[12px] transition-colors cursor-pointer ${
                      weight === s.weight && italic === s.italic
                        ? isLight
                          ? "bg-[#121212] text-white font-bold"
                          : "bg-solid-bg text-solid-ink font-bold"
                        : isLight
                        ? "bg-[#e5e5e0] text-[#333] hover:bg-[#d8d8d2]"
                        : "bg-panel text-panel-ink hover:bg-line"
                    }`}
                  >
                    <span className={s.italic ? "italic" : ""}>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
