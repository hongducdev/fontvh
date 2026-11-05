"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { FontFamily, FontStyle } from "@/lib/types";
import {
  StarIcon,
  DownloadIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  CheckIcon,
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

export function FontshareCard({
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [align, setAlign] = useState<"left" | "center" | "right">("left");
  const [columns, setColumns] = useState<"single" | "double" | "triple">("single");
  const [colorMode, setColorMode] = useState<"black" | "white">("black");
  const [appliedNotice, setAppliedNotice] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync size when globalSize changes and not locally customized
  useEffect(() => {
    if (globalSize && globalSize !== 64) {
      setSize(globalSize);
    }
  }, [globalSize]);

  // Read favorite from localStorage
  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem("fontvh_favorites") || "[]");
      if (Array.isArray(favs) && favs.includes(family.slug)) {
        setIsFavorite(true);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [family.slug]);

  // Toggle favorite
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      const favs = JSON.parse(localStorage.getItem("fontvh_favorites") || "[]");
      const updated = next
        ? Array.from(new Set([...favs, family.slug]))
        : favs.filter((s: string) => s !== family.slug);
      localStorage.setItem("fontvh_favorites", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
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
  }, []);

  // Compute active preview text:
  // If user has edited locally: use localText
  // Else if globalText is passed and non-empty: use globalText
  // Else: default to family name
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
  }, [currentText, size, leading, columns]);

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
    setColumns("single");
    setColorMode("black");
  };

  const handleApplyToAll = () => {
    onApplyToAll?.(currentText, size, weight);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 2000);
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
      className={`group relative transition-colors ${
        isLight
          ? "bg-[#fafaf8] text-[#121212]"
          : "bg-panel text-panel-ink hover:bg-row-hover"
      } ${className}`}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & INLINE CONTROLS (Fontshare Image 1 & 2 Style) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        className={`flex flex-wrap items-center justify-between gap-y-3 gap-x-6 border-b px-5 py-3.5 text-[13px] md:px-10 ${
          isLight ? "border-[#e5e5e0] text-[#555]" : "border-line text-panel-muted"
        }`}
      >
        {/* Left: Font Name & Star Icon */}
        <div className="flex items-center gap-2">
          <Link
            href={`/fonts/${family.slug}`}
            className={`font-bold text-[15px] tracking-tight hover:underline ${
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
        </div>

        {/* Center: Inline Hairline Controls (Weight, Size, Leading, Style) */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {/* Style / Variable Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsStyleDropdownOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded px-2.5 py-1 text-[13px] font-medium transition-colors cursor-pointer ${
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
                className={`absolute left-0 top-full z-40 mt-1 max-h-60 min-w-[150px] overflow-y-auto rounded-md border p-1 shadow-xl backdrop-blur-md ${
                  isLight
                    ? "border-[#ddd] bg-[#ffffff] text-[#121212]"
                    : "border-line bg-paper/95 text-panel-ink"
                }`}
              >
                {family.axes.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectVariable}
                    className={`flex w-full items-center justify-between rounded px-3 py-1.5 text-left text-[13px] transition-colors cursor-pointer ${
                      selectedStyleName === "Variable"
                        ? isLight
                          ? "bg-[#eee] font-bold"
                          : "bg-soft font-bold"
                        : "hover:bg-line/40"
                    }`}
                  >
                    <span>Variable</span>
                    {selectedStyleName === "Variable" && <CheckIcon className="h-3 w-3" />}
                  </button>
                )}
                {family.styles.map((st) => (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => handleSelectStyle(st)}
                    className={`flex w-full items-center justify-between rounded px-3 py-1.5 text-left text-[13px] transition-colors cursor-pointer ${
                      selectedStyleName === st.name && !st.italic
                        ? isLight
                          ? "bg-[#eee] font-bold"
                          : "bg-soft font-bold"
                        : "hover:bg-line/40"
                    }`}
                  >
                    <span className={st.italic ? "italic" : ""}>{st.name}</span>
                    {selectedStyleName === st.name && <CheckIcon className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Weight Slider */}
          <div className="flex items-center gap-2">
            <label htmlFor={`weight-${family.slug}`} className="text-[12px] opacity-80 cursor-pointer">
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
              className="range w-20 sm:w-24 cursor-pointer"
            />
          </div>

          {/* Size Slider */}
          <div className="flex items-center gap-2">
            <label htmlFor={`size-${family.slug}`} className="text-[12px] opacity-80 cursor-pointer">
              Size
            </label>
            <input
              id={`size-${family.slug}`}
              type="range"
              min={24}
              max={144}
              step={2}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="range w-20 sm:w-24 cursor-pointer"
            />
          </div>

          {/* Leading (Line-height) Slider */}
          <div className="flex items-center gap-2">
            <label htmlFor={`leading-${family.slug}`} className="text-[12px] opacity-80 cursor-pointer">
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
              className="range w-16 sm:w-20 cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Meta Badges (Styles count, Variable, License) */}
        <div className="flex items-center gap-4 text-[13px]">
          <span>{family.styles.length} styles</span>
          {family.axes.length > 0 && <span>Variable</span>}
          <span className="hidden sm:inline opacity-70">
            {family.license.name.includes("OFL") || family.license.name.includes("SIL")
              ? "Open Source"
              : family.license.name}
          </span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. BIG SPECIMEN TEXT (Directly Clickable & Editable in-place) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        onClick={() => textareaRef.current?.focus()}
        className="cursor-text px-5 py-8 md:px-10 md:py-12"
      >
        <label htmlFor={`specimen-input-${family.slug}`} className="sr-only">
          Chỉnh sửa chữ thử cho font {family.name}
        </label>
        <div
          className={`${
            columns === "double"
              ? "columns-1 md:columns-2 gap-8"
              : columns === "triple"
              ? "columns-1 md:columns-3 gap-6"
              : ""
          }`}
        >
          <textarea
            id={`specimen-input-${family.slug}`}
            ref={textareaRef}
            rows={1}
            value={currentText}
            onChange={handleTextChange}
            placeholder={family.name}
            spellCheck={false}
            style={{
              fontFamily: `'${family.slug}'`,
              fontSize: `${size}px`,
              fontWeight: weight,
              fontStyle: italic ? "italic" : "normal",
              lineHeight: leading,
              textAlign: align,
            }}
            className={`w-full resize-none overflow-hidden border-0 bg-transparent p-0 outline-none transition-all placeholder:opacity-30 ${
              isLight
                ? "text-[#121212] caret-[#121212] selection:bg-[#121212] selection:text-[#fafaf8]"
                : "text-panel-ink caret-panel-ink selection:bg-panel-ink selection:text-panel"
            }`}
          />
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. BOTTOM BAR (Designer info, Download & View Family)         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 border-t px-5 py-4 text-[13px] md:px-10 ${
          isLight ? "border-[#e5e5e0] text-[#666]" : "border-line text-panel-muted"
        }`}
      >
        {/* Left: Designer */}
        <span className="truncate">
          Designed by{" "}
          <span className={`underline underline-offset-4 ${isLight ? "text-[#121212]" : "text-panel-ink"}`}>
            {family.foundry || family.designer}
          </span>
        </span>

        {/* Right: Actions */}
        <div className="flex items-center gap-5">
          {/* Controls / Drawer Toggle button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            className={`chip text-[13px] transition-colors cursor-pointer ${
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
            className={`hidden items-center gap-1.5 transition-colors sm:inline-flex cursor-pointer ${
              isLight ? "text-[#555] hover:text-[#121212]" : "text-panel-muted hover:text-panel-ink"
            }`}
            title={`Tải font .zip (${formatBytes(family.size)})`}
          >
            <DownloadIcon />
            <span>Tải ({formatBytes(family.size)})</span>
          </a>

          {/* View Family / Xem họ chữ */}
          <Link
            href={`/fonts/${family.slug}`}
            className={`inline-flex items-center gap-1.5 font-bold transition-transform hover:translate-x-0.5 ${
              isLight ? "text-[#121212]" : "text-cream"
            }`}
          >
            <span>Xem họ chữ</span>
            <ArrowRightIcon />
          </Link>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. EXTENDED CONTROL DRAWER (Fontshare Image 2 Bottom Area)    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isDrawerOpen && (
        <div
          className={`border-t px-5 py-6 md:px-10 ${
            isLight
              ? "border-[#e5e5e0] bg-[#f0f0ee] text-[#444]"
              : "border-line bg-soft text-panel-muted"
          }`}
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Section 1: Text Options */}
            <div className="space-y-4 md:col-span-5">
              <h4 className={`text-[12px] font-bold uppercase tracking-wider ${isLight ? "text-[#121212]" : "text-panel-ink"}`}>
                Text
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

                {/* Columns: Single, Double, Triple */}
                <div className="flex items-center gap-2 text-[13px]">
                  <span className="opacity-70">Columns:</span>
                  <div className="flex items-center gap-1">
                    {(["single", "double", "triple"] as const).map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setColumns(col)}
                        className={`capitalize px-2 py-0.5 rounded text-[12px] transition-colors cursor-pointer ${
                          columns === col
                            ? isLight
                              ? "bg-[#121212] text-[#fff] font-bold"
                              : "bg-panel-ink text-panel font-bold"
                            : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color mode: White vs Black */}
                <div className="flex items-center gap-2 text-[13px]">
                  <span className="opacity-70">Color mode:</span>
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
                      White
                    </button>
                    <button
                      type="button"
                      onClick={() => setColorMode("black")}
                      className={`px-2 py-0.5 rounded text-[12px] transition-colors cursor-pointer ${
                        colorMode === "black"
                          ? "bg-[#ffffe3] text-[#10100e] font-bold"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      Black
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
                    {appliedNotice ? "✓ Đã áp dụng" : "Apply to All"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleReset}
                  className="chip text-[13px] opacity-70 hover:opacity-100 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Section 2: Features */}
            <div className="space-y-4 md:col-span-4 md:border-l md:border-line/40 md:pl-6">
              <h4 className={`text-[12px] font-bold uppercase tracking-wider ${isLight ? "text-[#121212]" : "text-panel-ink"}`}>
                Features
              </h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                  <span>Đủ dấu tiếng Việt</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                  <span>Fractions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                  <span>Ligatures</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                  <span>Tabular numerals</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                  <span>Ordinals</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                  <span>Stylistic sets</span>
                </li>
              </ul>
            </div>

            {/* Section 3: Styles Quick Select */}
            <div className="space-y-4 md:col-span-3 md:border-l md:border-line/40 md:pl-6">
              <h4 className={`text-[12px] font-bold uppercase tracking-wider ${isLight ? "text-[#121212]" : "text-panel-ink"}`}>
                Styles & Weights
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {family.styles.map((st) => (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => handleSelectStyle(st)}
                    className={`rounded px-2 py-1 text-[12px] transition-colors cursor-pointer ${
                      weight === st.weight && italic === st.italic
                        ? isLight
                          ? "bg-[#121212] text-[#fff] font-bold"
                          : "bg-panel-ink text-panel font-bold"
                        : isLight
                        ? "bg-[#e5e5e0] hover:bg-[#dcdcd8]"
                        : "bg-panel hover:bg-line"
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
