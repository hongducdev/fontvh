"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { FontPairing } from "@/lib/pairings";
import { ArrowRightIcon, SwapIcon, CheckIcon, CopyIcon } from "./icons";

function PairingCard({ pairing }: { pairing: FontPairing }) {
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
    const css = `/* Font Pairing: ${pairing.title} */\n/* Heading (${headFont.name}) */\nfont-family: '${headFont.slug}', sans-serif;\nfont-weight: ${headWeight};\n\n/* Body (${bodyFont.name}) */\nfont-family: '${bodyFont.slug}', sans-serif;\nfont-weight: ${bodyWeight};`;
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="border-b border-line bg-panel p-6 text-panel-ink transition-colors md:p-10">
      {/* Header Info & Tag */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line/60 pb-5 text-[14px]">
        <div className="flex flex-wrap items-baseline gap-4">
          <h2 className="text-[16px] font-bold leading-tight">{pairing.title}</h2>
          <span className="text-panel-muted font-medium">
            {pairing.category}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {pairing.tags.map((tag) => (
            <span
              key={tag}
              className="border border-line px-2 py-0.5 text-[13px] text-panel-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-4 max-w-3xl text-[14px] leading-[22px] text-panel-muted">
        {pairing.description}
      </p>

      {/* Interactive Controls Strip */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-line/40 py-3 text-[14px]">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="micro">Tiêu đề:</span>
            <input
              type="range"
              min={24}
              max={80}
              step={2}
              value={headingSize}
              onChange={(e) => setHeadingSize(Number(e.target.value))}
              className="range w-20 sm:w-28 cursor-pointer"
            />
            <span className="text-[13px] font-bold">{headingSize}px</span>
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
            <span className="text-[13px] font-bold">{bodySize}px</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={copyPairCss}
            className="chip flex items-center gap-1.5 text-[13px] hover:text-panel-ink cursor-pointer"
            title="Sao chép CSS cho cặp font này"
          >
            {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
            <span>{copied ? "Đã chép CSS" : "Copy CSS"}</span>
          </button>

          <button
            type="button"
            onClick={() => setSwapped((prev) => !prev)}
            className="chip flex items-center gap-1.5 text-[13px] hover:text-panel-ink cursor-pointer"
          >
            <SwapIcon />
            <span>Đổi vị trí font</span>
          </button>
        </div>
      </div>

      {/* Live Specimen Preview (Directly editable & auto-wrapping) */}
      <div className="my-8 space-y-5">
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
              fontSize: `${headingSize}px`,
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
            className="w-full resize-none overflow-hidden bg-transparent leading-[1.65] text-panel-ink outline-none break-words"
            style={{
              fontFamily: `'${bodyFont.slug}', sans-serif`,
              fontSize: `${bodySize}px`,
              fontWeight: bodyWeight,
            }}
          />
        </div>
      </div>

      {/* Footer: Font Details & Links */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/60 pt-5 text-[14px] text-panel-muted">
        <div className="flex flex-wrap items-center gap-4">
          <span>
            Tiêu đề:{" "}
            <Link
              href={`/fonts/${headFont.slug}`}
              className="font-bold text-panel-ink hover:underline"
            >
              {headFont.name} ({headWeight})
            </Link>
          </span>
          <span>·</span>
          <span>
            Đoạn văn:{" "}
            <Link
              href={`/fonts/${bodyFont.slug}`}
              className="font-bold text-panel-ink hover:underline"
            >
              {bodyFont.name} ({bodyWeight})
            </Link>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`/fonts/${headFont.slug}`}
            className="inline-flex items-center gap-1 font-bold text-panel-ink hover:underline"
          >
            <span>Khám phá {headFont.name}</span>
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PairingsView({ pairings }: { pairings: FontPairing[] }) {
  return (
    <div className="shell pb-20">
      <div className="border-b border-line py-8 md:py-12">
        <p className="micro">Tuyển tập phối hợp font</p>
        <h1 className="mt-4 text-[clamp(40px,7vw,100px)] leading-[0.95] tracking-[-0.03em]">
          Cặp font
        </h1>
        <p className="mt-5 max-w-2xl text-[16px] leading-[22px] text-muted md:text-[16px] md:leading-[24px]">
          Các bộ đôi font chữ tương thích cao, được tuyển chọn đặc biệt cho giao
          diện số, ấn bản điện tử và tạp chí tiếng Việt. Bấm trực tiếp vào văn
          bản để chỉnh sửa thử nghiệm.
        </p>
      </div>

      <div className="divide-y divide-line">
        {pairings.map((pairing) => (
          <PairingCard key={pairing.id} pairing={pairing} />
        ))}
      </div>
    </div>
  );
}
