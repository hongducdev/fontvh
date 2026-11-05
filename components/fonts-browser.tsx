"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { FontFamily } from "@/lib/types";
import { FontshareCard } from "./FontshareCard";
import {
  Magnifier,
  ListIcon,
  GridIcon,
  DownloadIcon,
  XIcon,
} from "./icons";

const PANGRAM_PRESETS = [
  { label: "Tên font", text: "" },
  { label: "Hồn Việt", text: "Hồn Việt ngàn năm tỏa sáng" },
  { label: "Thơ ca", text: "Gió đưa cành trúc la đà, tiếng chuông Trấn Vũ" },
  { label: "Đủ dấu", text: "Ắ Ề Ỗ Ữ Ỹ Ỵ Đ ₫ ă â ê ô ơ ư ả ạ ẽ ị ỏ ũ" },
  { label: "Triết lý", text: "Chữ Việt đẹp tử tế trong từng đường nét thiết kế" },
  { label: "A - Z", text: "A B C D E F G H I K L M N O P Q R S T U V X Y" },
  { label: "0 - 9", text: "0 1 2 3 4 5 6 7 8 9 · ₫ $ € £ ¥ & @ #" },
  { label: "Latin", text: "The quick brown fox jumps over the lazy dog" },
];

const SIZE_PRESETS = [24, 36, 48, 64, 88, 120];

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .toLowerCase()
    .trim();

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

type Props = {
  families: FontFamily[];
  categories: string[];
  initialCategory?: string;
  initialQuery?: string;
  initialVariable?: boolean;
  initialVi?: boolean;
};

export function FontsBrowser({
  families,
  categories,
  initialCategory = "",
  initialQuery = "",
  initialVariable = false,
  initialVi = false,
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [text, setText] = useState("");
  const [size, setSize] = useState(88);
  const [category, setCategory] = useState(initialCategory);
  const [onlyVariable, setOnlyVariable] = useState(initialVariable);
  const [onlyVietnamese, setOnlyVietnamese] = useState(initialVi);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<"default" | "name" | "styles">("default");

  const filtered = useMemo(() => {
    const q = normalize(query);
    const result = families.filter((family) => {
      if (category && !family.categories.includes(category)) return false;
      if (onlyVietnamese && !family.vietnamese) return false;
      if (onlyVariable && family.axes.length === 0) return false;
      if (!q) return true;
      const haystack = normalize(
        [
          family.name,
          family.designer,
          family.foundry,
          ...family.categories,
        ].join(" ")
      );
      return haystack.includes(q);
    });

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    } else if (sortBy === "styles") {
      result.sort((a, b) => b.styles.length - a.styles.length);
    }
    return result;
  }, [families, query, category, onlyVietnamese, onlyVariable, sortBy]);

  const hasActiveFilters =
    Boolean(query) ||
    Boolean(category) ||
    onlyVariable ||
    onlyVietnamese ||
    text !== "" ||
    size !== 88;

  function resetAll() {
    setQuery("");
    setText("");
    setSize(88);
    setCategory("");
    setOnlyVariable(false);
    setOnlyVietnamese(false);
    setSortBy("default");
  }

  return (
    <div className="shell pb-20">
      {/* Page Title & Count */}
      <div className="flex items-baseline justify-between border-b border-line py-5">
        <h1 className="text-[14px] font-bold tracking-tight">Bộ font</h1>
        <p className="micro">
          {filtered.length} / {families.length} họ chữ
        </p>
      </div>

      {/* Fontshare Signature Interactive Control Bar */}
      <div className="border-b border-line">
        {/* Row 1: Search & Custom Specimen Text Input */}
        <div className="grid grid-cols-1 border-b border-line md:grid-cols-12">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-line py-4 md:col-span-4 md:border-b-0 md:border-r md:border-line md:pr-6">
            <Magnifier className="text-muted" />
            <label htmlFor="search-fonts" className="sr-only">
              Tìm theo tên, nhà thiết kế
            </label>
            <input
              id="search-fonts"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên, nhà thiết kế…"
              className="w-full bg-transparent text-[14px] leading-[20px] outline-none placeholder:text-muted"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-muted hover:text-ink cursor-pointer"
                aria-label="Xóa tìm kiếm"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Live Preview Text Input */}
          <div className="flex items-center gap-3 py-4 md:col-span-8 md:pl-6">
            <label htmlFor="custom-preview-text" className="micro shrink-0">
              Chữ thử chung
            </label>
            <input
              id="custom-preview-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập chữ thử cho tất cả font (hoặc bấm trực tiếp vào tên font bên dưới để gõ)…"
              className="w-full bg-transparent text-[15px] leading-[22px] outline-none placeholder:text-faint"
            />
            {text && (
              <button
                type="button"
                onClick={() => setText("")}
                className="text-muted hover:text-ink cursor-pointer"
                aria-label="Xóa nội dung thử"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Pangrams & Font Size Slider + View Mode */}
        <div className="grid grid-cols-1 items-center gap-4 py-4 md:grid-cols-12">
          {/* Pangram Preset Pills */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 md:col-span-6">
            <span className="micro mr-1">Mẫu câu:</span>
            {PANGRAM_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setText(p.text)}
                className="chip text-[13px] cursor-pointer"
                data-active={text === p.text || undefined}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Font Size Slider & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4 md:col-span-6 md:border-t-0 md:justify-end md:pt-0">
            <div className="flex items-center gap-3">
              <label htmlFor="font-size-slider" className="micro shrink-0">
                Cỡ chữ chung
              </label>
              <input
                id="font-size-slider"
                type="range"
                min={24}
                max={144}
                step={2}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="range w-24 sm:w-32 cursor-pointer"
              />
              <span className="min-w-[40px] text-right text-[14px] font-bold">
                {size}px
              </span>
              <div className="hidden items-center gap-1.5 lg:flex">
                {SIZE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSize(preset)}
                    className="chip text-[13px] cursor-pointer"
                    data-active={size === preset || undefined}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle: List vs Grid */}
            <div className="flex items-center gap-1 border-l border-line pl-4">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="Dạng danh sách (List view)"
                title="Dạng danh sách"
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-solid-bg text-solid-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                <ListIcon />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Dạng lưới (Grid view)"
                title="Dạng lưới"
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-solid-bg text-solid-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                <GridIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Categories & Feature Filters & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line py-3 text-[14px]">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <button
              type="button"
              onClick={() => setCategory("")}
              className="chip font-medium cursor-pointer"
              data-active={category === "" || undefined}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className="chip capitalize font-medium cursor-pointer"
                data-active={category === cat || undefined}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Extra Filters & Sort & Reset */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setOnlyVietnamese((prev) => !prev)}
              className="chip cursor-pointer"
              data-active={onlyVietnamese || undefined}
            >
              ✓ Đủ dấu tiếng Việt
            </button>
            <button
              type="button"
              onClick={() => setOnlyVariable((prev) => !prev)}
              className="chip cursor-pointer"
              data-active={onlyVariable || undefined}
            >
              Variable font
            </button>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "default" | "name" | "styles")
              }
              aria-label="Sắp xếp font"
              className="bg-transparent text-[14px] font-medium text-muted outline-none hover:text-ink cursor-pointer"
            >
              <option value="default" className="bg-paper text-ink">
                Sắp xếp: Mặc định
              </option>
              <option value="name" className="bg-paper text-ink">
                Tên A → Z
              </option>
              <option value="styles" className="bg-paper text-ink">
                Nhiều kiểu chữ nhất
              </option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAll}
                className="link-underline text-[13px] text-muted hover:text-ink cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Font Display List or Grid */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-[18px] font-bold">Không tìm thấy họ chữ phù hợp</p>
          <p className="mt-2 text-[14px] text-muted">
            Thử đổi từ khóa hoặc xóa bớt bộ lọc để duyệt thêm font.
          </p>
          <button
            type="button"
            onClick={resetAll}
            className="btn-solid mt-6 text-[14px] cursor-pointer"
          >
            Xem tất cả {families.length} họ chữ
          </button>
        </div>
      ) : viewMode === "list" ? (
        /* LIST VIEW — Signature Fontshare typographic specimen rows */
        <div className="divide-y divide-line border-b border-line">
          {filtered.map((family) => (
            <FontshareCard
              key={family.slug}
              family={family}
              globalText={text}
              globalSize={size}
              onApplyToAll={(newText, newSize) => {
                setText(newText);
                setSize(newSize);
              }}
            />
          ))}
        </div>
      ) : (
        /* GRID VIEW — 2-column cards layout */
        <div className="grid grid-cols-1 divide-y divide-line border-b border-line md:grid-cols-2 md:divide-x md:divide-y-0">
          {filtered.map((family) => {
            const previewStyle =
              family.styles.find(
                (s) => !s.italic && s.weight === family.preview.weight
              ) ??
              family.styles.find((s) => !s.italic) ??
              family.styles[0];

            return (
              <div
                key={family.slug}
                className="group flex flex-col justify-between bg-panel p-6 transition-colors hover:bg-row-hover md:p-8"
              >
                <div>
                  <div className="flex items-baseline justify-between text-[14px] leading-[20px]">
                    <div className="flex items-baseline gap-3">
                      <Link
                        href={`/fonts/${family.slug}`}
                        className="font-bold hover:underline"
                      >
                        {family.name}
                      </Link>
                      <span className="text-panel-muted">
                        {family.styles.length} styles
                      </span>
                    </div>
                    <span className="text-[13px] capitalize text-panel-muted">
                      {family.categories.join(", ")}
                    </span>
                  </div>

                  <Link
                    href={`/fonts/${family.slug}`}
                    className="my-8 block min-h-[100px] overflow-hidden"
                  >
                    <p
                      className="line-clamp-2 leading-[1.15] tracking-[-0.02em] text-panel-ink"
                      style={{
                        fontFamily: `'${family.slug}'`,
                        fontSize: `clamp(28px, ${Math.min(size, 80)}px, 80px)`,
                        fontWeight: previewStyle?.weight ?? 400,
                        fontStyle: previewStyle?.italic ? "italic" : "normal",
                      }}
                    >
                      {text || family.name}
                    </p>
                  </Link>
                </div>

                <div className="flex items-center justify-between border-t border-line/60 pt-4 text-[14px] text-panel-muted">
                  <span className="truncate pr-2">{family.designer}</span>
                  <div className="flex shrink-0 items-center gap-3">
                    <a
                      href={`/api/download/${family.slug}`}
                      download
                      className="hover:text-panel-ink"
                      aria-label={`Tải ${family.name}`}
                    >
                      <DownloadIcon />
                    </a>
                    <Link
                      href={`/fonts/${family.slug}`}
                      className="font-bold text-cream hover:underline"
                    >
                      Chi tiết →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
