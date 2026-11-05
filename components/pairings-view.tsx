"use client";

import { useState, useRef, useEffect, useMemo, memo } from "react";
import Link from "next/link";
import type { FontPairing } from "@/lib/pairings";
import { ArrowRightIcon, SwapIcon, CheckIcon, CopyIcon } from "./icons";

// Vercel Best Practice: rerender-memo & rendering-content-visibility
// Memoize individual pairing cards with content-visibility to keep list interactions fast
const PairingCard = memo(function PairingCard({ pairing }: { pairing: FontPairing }) {
  const [swapped, setSwapped] = useState(false);
  const [headingText, setHeadingText] = useState(pairing.heading.sample);
  const [bodyText, setBodyText] = useState(pairing.body.sample);
  const [headingSize, setHeadingSize] = useState(48);
  const [bodySize, setBodySize] = useState(16);
  const [copied, setCopied] = useState(false);

  const headFont = swapped ? pairing.body : pairing.heading;
  const bodyFont = swapped ? pairing.heading : pairing.body;

  // Typographic hierarchy: ensure heading gets bold weight and body gets comfortable reading weight
  const headWeight = swapped ? 700 : pairing.heading.weight;
  const bodyWeight = swapped ? 400 : pairing.body.weight;

  const headingRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textareas
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.style.height = "auto";
      headingRef.current.style.height = `${headingRef.current.scrollHeight}px`;
    }
  }, [headingText, headingSize]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.style.height = "auto";
      bodyRef.current.style.height = `${bodyRef.current.scrollHeight}px`;
    }
  }, [bodyText, bodySize]);

  const copyPairCss = async () => {
    const css = `/* Font Pairing: ${pairing.title} */
/* Heading (${headFont.name}) */
font-family: '${headFont.slug}', sans-serif;
font-weight: ${headWeight};

/* Body (${bodyFont.name}) */
font-family: '${bodyFont.slug}', sans-serif;
font-weight: ${bodyWeight};`;
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="border-b border-line bg-panel p-5 sm:p-6 text-panel-ink transition-colors md:p-10 cv-card">
      {/* Header Info & Tag */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line/60 pb-5 text-[14px]">
        <div className="flex flex-wrap items-baseline gap-3 sm:gap-4">
          <h2 className="text-[16px] sm:text-[18px] font-bold leading-tight">{pairing.title}</h2>
          <span className="text-panel-muted font-medium text-[13px] sm:text-[14px]">
            {pairing.category}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {pairing.tags.map((tag) => (
            <span
              key={tag}
              className="border border-line px-2 py-0.5 text-[12px] sm:text-[13px] text-panel-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-4 max-w-3xl text-[13px] sm:text-[14px] leading-[22px] text-panel-muted">
        {pairing.description}
      </p>

      {/* Interactive Controls Strip */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-line/40 py-2.5 sm:py-3 text-[13px] sm:text-[14px]">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="micro">Tiêu đề:</span>
            <input
              type="range"
              min={24}
              max={80}
              step={2}
              value={headingSize}
              onChange={(e) => setHeadingSize(Number(e.target.value))}
              className="range w-18 sm:w-28 cursor-pointer"
            />
            <span className="text-[12px] sm:text-[13px] font-bold min-w-[28px]">{headingSize}px</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="micro">Đoạn văn:</span>
            <input
              type="range"
              min={13}
              max={24}
              step={1}
              value={bodySize}
              onChange={(e) => setBodySize(Number(e.target.value))}
              className="range w-16 sm:w-24 cursor-pointer"
            />
            <span className="text-[12px] sm:text-[13px] font-bold min-w-[28px]">{bodySize}px</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={copyPairCss}
            className="chip flex items-center gap-1.5 text-[12px] sm:text-[13px] hover:text-panel-ink cursor-pointer"
            title="Sao chép CSS cho cặp font này"
          >
            {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
            <span>{copied ? "Đã chép" : "Copy CSS"}</span>
          </button>

          <button
            type="button"
            onClick={() => setSwapped((prev) => !prev)}
            className="chip flex items-center gap-1.5 text-[12px] sm:text-[13px] hover:text-panel-ink cursor-pointer"
          >
            <SwapIcon />
            <span>Đổi font</span>
          </button>
        </div>
      </div>

      {/* Live Specimen Preview (Directly editable & auto-wrapping) */}
      <div className="my-6 sm:my-8 space-y-4 sm:space-y-5">
        <div>
          <label htmlFor={`head-${pairing.id}`} className="sr-only">
            Nội dung tiêu đề
          </label>
          <textarea
            id={`head-${pairing.id}`}
            ref={headingRef}
            rows={1}
            value={headingText}
            onChange={(e) => setHeadingText(e.target.value)}
            className="w-full resize-none overflow-hidden bg-transparent leading-[1.22] tracking-[-0.02em] text-panel-ink outline-none break-words"
            style={{
              fontFamily: `'${headFont.slug}', sans-serif`,
              fontSize: `clamp(22px, 7vw, ${headingSize}px)`,
              fontWeight: headWeight,
            }}
          />
        </div>

        <div>
          <label htmlFor={`body-${pairing.id}`} className="sr-only">
            Nội dung đoạn văn
          </label>
          <textarea
            id={`body-${pairing.id}`}
            ref={bodyRef}
            rows={3}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="w-full resize-none overflow-hidden bg-transparent leading-[1.65] text-panel-muted outline-none break-words"
            style={{
              fontFamily: `'${bodyFont.slug}', sans-serif`,
              fontSize: `${bodySize}px`,
              fontWeight: bodyWeight,
            }}
          />
        </div>
      </div>

      {/* Footer: Font Details & Links */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4 sm:pt-5 text-[13px] sm:text-[14px] text-panel-muted">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span>
            Tiêu đề:{" "}
            <Link
              href={`/fonts/${headFont.slug}`}
              className="font-bold text-panel-ink hover:underline"
            >
              {headFont.name}
            </Link>
          </span>
          <span className="text-line" aria-hidden="true">·</span>
          <span>
            Đoạn văn:{" "}
            <Link
              href={`/fonts/${bodyFont.slug}`}
              className="font-bold text-panel-ink hover:underline"
            >
              {bodyFont.name}
            </Link>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`/fonts/${headFont.slug}`}
            className="inline-flex items-center gap-1 font-bold text-panel-ink hover:underline"
          >
            <span>Chi tiết {headFont.name}</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
});

export function PairingsView({ pairings }: { pairings: FontPairing[] }) {
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const allTags = useMemo(
    () => Array.from(new Set(pairings.flatMap((p) => [p.category, ...p.tags]))),
    [pairings]
  );

  const filtered = useMemo(
    () =>
      selectedTag === "all"
        ? pairings
        : pairings.filter(
            (p) => p.category === selectedTag || p.tags.includes(selectedTag)
          ),
    [pairings, selectedTag]
  );

  return (
    <div className="pb-20">
      {/* Hero Header */}
      <div className="shell border-b border-line py-8 md:py-12">
        <p className="micro">Tuyển tập phối hợp font</p>
        <h1 className="mt-4 text-[clamp(40px,7vw,100px)] leading-[0.95] tracking-[-0.03em]">
          Cặp font
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-muted">
          Các bộ đôi font chữ tương thích cao, được tuyển chọn đặc biệt cho giao
          diện số, ấn bản điện tử và tạp chí tiếng Việt. Bấm trực tiếp vào văn
          bản để chỉnh sửa thử nghiệm.
        </p>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 md:top-0 z-20 border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="shell flex items-center justify-between py-3.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-fade-right">
            <span className="micro mr-1 shrink-0 hidden sm:inline">Phân loại:</span>
            <button
              type="button"
              onClick={() => setSelectedTag("all")}
              className={`shrink-0 rounded px-2.5 sm:px-3 py-1 text-[12px] sm:text-[13px] font-bold transition-colors cursor-pointer ${
                selectedTag === "all"
                  ? "bg-solid-bg text-solid-ink"
                  : "bg-soft text-muted hover:text-ink"
              }`}
            >
              Tất cả ({pairings.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`shrink-0 rounded px-2.5 sm:px-3 py-1 text-[12px] sm:text-[13px] font-medium transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? "bg-solid-bg text-solid-ink font-bold"
                    : "bg-soft text-muted hover:text-ink"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <span className="micro hidden font-mono md:inline">
            {filtered.length} phối ngẫu
          </span>
        </div>
      </div>

      {/* Pairings List */}
      <div>
        {filtered.map((pairing) => (
          <PairingCard key={pairing.id} pairing={pairing} />
        ))}
      </div>
    </div>
  );
}
