"use client";

import { useEffect, useMemo, useState, useTransition, useCallback } from "react";
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
import { CustomSelect } from "./custom-select";

const PANGRAM_PRESETS = [
  { label: "Tên font", text: "" },
  { label: "Hồn Việt", text: "Hồn Việt ngàn năm tỏa sáng" },
  { label: "Thơ ca", text: "Gió đưa cành trúc la đà, tiếng chuông Trấn Vũ" },
  { label: "Đủ dấu", text: "Ắ Ề Ỗ Ữ Ỳ Ỵ Đ ₫ ă â ê ô ơ ư ả ạ ẽ ị ỏ ũ" },
  { label: "Triết lý", text: "Chữ Việt đẹp tử tế trong từng đường nét thiết kế" },
  { label: "A - Z", text: "A B C D E F G H I K L M N O P Q R S T U V X Y" },
  { label: "0 - 9", text: "0 1 2 3 4 5 6 7 8 9 · ₫ $ € £ ¥ & @ #" },
  { label: "Latin", text: "The quick brown fox jumps over the lazy dog" },
];

const SIZE_PRESETS = [24, 36, 48, 64, 88, 120];

// Vercel Best Practice: js-hoist-regexp (hoist regex creation outside render functions)
const DIACRITICS_REGEX = /[\u0300-\u036f]/g;
const STROKE_D_REGEX = /đ/g;

// Normalize Vietnamese string: lowercase first, strip diacritics, convert đ/Đ to d
const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .replace(STROKE_D_REGEX, "d");

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
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
  const [isPending, startTransition] = useTransition();

  // Instant input state for zero-latency typing
  const [searchInputValue, setSearchInputValue] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [text, setText] = useState("");
  const [size, setSize] = useState(88);
  const [category, setCategory] = useState(initialCategory);
  const [onlyVariable, setOnlyVariable] = useState(initialVariable);
  const [onlyVietnamese, setOnlyVietnamese] = useState(initialVi);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<"default" | "name" | "styles">("default");

  // Sync search & filters with URL without reloading
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    if (category) url.searchParams.set("category", category);
    else url.searchParams.delete("category");
    if (onlyVariable) url.searchParams.set("variable", "1");
    else url.searchParams.delete("variable");
    if (onlyVietnamese) url.searchParams.set("vi", "1");
    else url.searchParams.delete("vi");
    window.history.replaceState(null, "", url.toString());
  }, [query, category, onlyVariable, onlyVietnamese]);

  // Vercel Best Practice: js-index-maps (Pre-compute normalized search index for fast O(1) text search)
  const searchIndex = useMemo(() => {
    const map = new Map<string, string>();
    for (const f of families) {
      map.set(
        f.slug,
        normalize([f.name, f.designer, f.foundry, ...f.categories].join(" "))
      );
    }
    return map;
  }, [families]);

  const filtered = useMemo(() => {
    const q = query ? normalize(query) : "";
    const result = families.filter((family) => {
      if (category && !family.categories.includes(category)) return false;
      if (onlyVietnamese && !family.vietnamese) return false;
      if (onlyVariable && family.axes.length === 0) return false;
      if (!q) return true;
      const haystack = searchIndex.get(family.slug) ?? "";
      return haystack.includes(q);
    });

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    } else if (sortBy === "styles") {
      result.sort((a, b) => b.styles.length - a.styles.length);
    }
    return result;
  }, [families, searchIndex, query, category, onlyVietnamese, onlyVariable, sortBy]);

  // Vercel Best Practice: rerender-memo (Stable callback avoids breaking child React.memo)
  const handleApplyToAll = useCallback((newText: string, newSize: number) => {
    setText(newText);
    setSize(newSize);
  }, []);

  const hasActiveFilters =
    Boolean(query) ||
    Boolean(category) ||
    onlyVariable ||
    onlyVietnamese ||
    text !== "" ||
    size !== 88 ||
    sortBy !== "default";

  const resetAll = () => {
    setSearchInputValue("");
    setQuery("");
    setText("");
    setSize(88);
    setCategory("");
    setOnlyVariable(false);
    setOnlyVietnamese(false);
    setSortBy("default");
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInputValue(val);
    startTransition(() => {
      setQuery(val);
    });
  };

  const clearSearchInput = () => {
    setSearchInputValue("");
    startTransition(() => {
      setQuery("");
    });
  };

  const handleCategoryChange = (cat: string) => {
    startTransition(() => {
      setCategory(cat);
    });
  };

  const handleToggleVietnamese = () => {
    startTransition(() => {
      setOnlyVietnamese((prev) => !prev);
    });
  };

  const handleToggleVariable = () => {
    startTransition(() => {
      setOnlyVariable((prev) => !prev);
    });
  };

  const handleSortChange = (newSort: "default" | "name" | "styles") => {
    startTransition(() => {
      setSortBy(newSort);
    });
  };

  return (
    <div className="shell pb-24 pt-4 md:pt-8">
      {/* Search & Global Controls Header */}
      <div className="border-b border-line">
        {/* Row 1: Big Search Input & Global Specimen Text input */}
        <div className="grid grid-cols-1 gap-2 border-b border-line py-3 md:grid-cols-12 md:gap-4 md:py-4">
          {/* Big Search Input */}
          <div className="relative flex items-center md:col-span-6">
            <Magnifier className="mr-3 shrink-0 text-muted" />
            <label htmlFor="search-families-input" className="sr-only">
              Tìm theo tên họ chữ, tác giả hoặc nhà phát hành
            </label>
            <input
              id="search-families-input"
              type="search"
              value={searchInputValue}
              onChange={handleSearchInputChange}
              placeholder="Tìm theo tên họ chữ, tác giả..."
              className="w-full bg-transparent text-[16px] sm:text-[18px] md:text-[20px] font-medium leading-tight outline-none placeholder:text-muted"
            />
            {searchInputValue && (
              <button
                type="button"
                onClick={clearSearchInput}
                className="p-1 text-muted hover:text-ink cursor-pointer"
                title="Xóa tìm kiếm"
                aria-label="Xóa nội dung tìm kiếm"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Global Specimen Sample Text */}
          <div className="relative flex items-center border-t border-line/60 pt-2 md:col-span-6 md:border-t-0 md:border-l md:border-line md:pl-6 md:pt-0">
            <label htmlFor="custom-sample-text-input" className="sr-only">
              Nhập chữ thử nghiệm chung cho toàn bộ danh sách font
            </label>
            <input
              id="custom-sample-text-input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập chữ thử nghiệm chung..."
              className="w-full bg-transparent text-[14px] sm:text-[15px] outline-none placeholder:text-muted"
            />
            {text && (
              <button
                type="button"
                onClick={() => setText("")}
                className="p-1 text-muted hover:text-ink cursor-pointer"
                title="Xóa chữ thử"
                aria-label="Xóa nội dung thử"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Pangrams & Font Size Slider + View Mode */}
        <div className="grid grid-cols-1 items-center gap-4 py-3.5 md:grid-cols-12 md:py-4">
          {/* Pangram Preset Pills (Swipeable on mobile with smooth fade mask) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-fade-right pb-1 md:pb-0 md:flex-wrap md:mask-none md:col-span-6">
            <span className="micro mr-1 shrink-0 text-[12px] sm:text-[13px]">Mẫu câu:</span>
            {PANGRAM_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setText(p.text)}
                className="chip text-[12px] sm:text-[13px] shrink-0 cursor-pointer"
                data-active={text === p.text || undefined}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Font Size Slider & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-3 md:col-span-6 md:border-t-0 md:justify-end md:pt-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <label htmlFor="font-size-slider" className="micro shrink-0 text-[12px] sm:text-[13px]">
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
                className="range w-20 sm:w-32 cursor-pointer"
              />
              <span className="min-w-[36px] text-right font-mono text-[13px] sm:text-[14px] font-bold">
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
            <div className="flex items-center gap-1 rounded bg-soft p-1">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="Xem dạng danh sách mẫu chữ"
                title="Dạng danh sách mẫu chữ"
                className={`rounded p-1.5 transition-colors cursor-pointer ${
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
                aria-label="Xem dạng lưới thẻ font"
                title="Dạng lưới thẻ font"
                className={`rounded p-1.5 transition-colors cursor-pointer ${
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

        {/* Row 3: Category Pills Filter & Meta status */}
        <div className="border-t border-line/60 py-3 md:py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-fade-right pb-1 md:pb-0 md:flex-wrap md:mask-none">
              <span className="micro mr-1 shrink-0 text-[12px] sm:text-[13px]">Phân loại:</span>
              <button
                type="button"
                onClick={() => handleCategoryChange("")}
                className="chip cursor-pointer"
                data-active={category === "" || undefined}
              >
                Tất cả ({families.length})
              </button>
              {categories.map((cat) => {
                const count = families.filter((f) =>
                  f.categories.includes(cat)
                ).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className="chip capitalize cursor-pointer"
                    data-active={category === cat || undefined}
                  >
                    {cat} ({count})
                  </button>
                );
              })}

              <span className="mx-2 h-4 w-px bg-line" />

              <button
                type="button"
                onClick={handleToggleVietnamese}
                className="chip cursor-pointer"
                data-active={onlyVietnamese || undefined}
              >
                ✓ Đủ dấu tiếng Việt
              </button>
              <button
                type="button"
                onClick={handleToggleVariable}
                className="chip cursor-pointer"
                data-active={onlyVariable || undefined}
              >
                Variable font
              </button>
            </div>

            <div className="flex items-center gap-3 ml-auto md:ml-0">
              <CustomSelect
                value={sortBy}
                onChange={(val) =>
                  handleSortChange(val as "default" | "name" | "styles")
                }
                aria-label="Sắp xếp font"
                size="sm"
                align="right"
                options={[
                  { value: "default", label: "Sắp xếp: Mặc định" },
                  { value: "name", label: "Tên A → Z" },
                  { value: "styles", label: "Nhiều kiểu chữ nhất" },
                ]}
              />

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="link-underline text-[12px] sm:text-[13px] text-muted hover:text-ink cursor-pointer"
                >
                  Đặt lại
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Font Family Cards Container */}
      <div className="mt-8">
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
                onApplyToAll={handleApplyToAll}
              />
            ))}
          </div>
        ) : (
          /* GRID VIEW — Visual cards with font details */
          <div className="grid grid-cols-1 gap-px border-b border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((family) => {
              const defaultStyle =
                family.styles.find(
                  (s) => !s.italic && s.weight === family.preview.weight
                ) ??
                family.styles.find((s) => !s.italic) ??
                family.styles[0];

              return (
                <div
                  key={family.slug}
                  className="group flex flex-col justify-between bg-panel p-6 cv-card card-hover-smooth"
                >
                  <div>
                    <div className="flex items-baseline justify-between">
                      <Link
                        href={`/fonts/${family.slug}`}
                        className="text-[17px] font-bold tracking-tight text-panel-ink hover:underline"
                      >
                        {family.name}
                      </Link>
                      <span className="text-[12px] text-panel-muted">
                        {family.styles.length} kiểu
                      </span>
                    </div>

                    <p className="mt-1 text-[13px] text-panel-muted">
                      {family.designer}
                    </p>

                    {/* Specimen Preview */}
                    <div
                      className="my-8 overflow-hidden text-ellipsis whitespace-nowrap text-panel-ink"
                      style={{
                        fontFamily: `'${family.slug}', ${
                          family.categories.includes("serif")
                            ? "serif"
                            : family.categories.includes("monospace") ||
                              family.categories.includes("mono")
                            ? "monospace"
                            : "sans-serif"
                        }`,
                        fontSize: "clamp(24px, 8vw, 36px)",
                        lineHeight: 1.15,
                        fontWeight: defaultStyle?.weight ?? 400,
                        fontStyle: defaultStyle?.italic ? "italic" : "normal",
                      }}
                    >
                      {text || family.name}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-line pt-4 text-[13px]">
                    <div className="flex items-center gap-2">
                      {family.axes.length > 0 && (
                        <span className="rounded bg-soft px-1.5 py-0.5 text-[11px] font-bold text-panel-ink">
                          Variable
                        </span>
                      )}
                      {family.vietnamese && (
                        <span className="text-[12px] text-panel-muted">Tiếng Việt</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/download/${family.slug}`}
                        download
                        className="p-1.5 text-panel-muted transition-colors hover:text-panel-ink active:scale-90"
                        title={`Tải về .zip (${formatBytes(family.size)})`}
                        aria-label={`Tải về ${family.name}`}
                      >
                        <DownloadIcon />
                      </a>
                      <Link
                        href={`/fonts/${family.slug}`}
                        className="text-[13px] font-medium text-panel-ink hover:underline"
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
    </div>
  );
}
