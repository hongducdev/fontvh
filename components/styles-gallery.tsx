"use client";

import { useState } from "react";
import type { FontStyle } from "@/lib/types";
import { CheckIcon, CopyIcon } from "./icons";

const STYLE_PRESETS = [
  "Chữ Việt đẹp và tinh tế trong từng nét chữ",
  "Gió đưa cành trúc la đà, tiếng chuông Trấn Vũ canh gà Thọ Xương",
  "Ắ Ề Ỗ Ữ Ỳ Ỵ Đ ₫ ă â ê ô ơ ư ả ạ ẽ ị ỏ ũ — 2026",
  "The quick brown fox jumps over the lazy dog",
];

export function StylesGallery({
  slug,
  name,
  styles,
}: {
  slug: string;
  name: string;
  styles: FontStyle[];
}) {
  const [sample, setSample] = useState(STYLE_PRESETS[0]);
  const [size, setSize] = useState(48);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function copyStyleCss(style: FontStyle) {
    const weightVal = style.weightRange
      ? `${style.weightRange[0]} ${style.weightRange[1]}`
      : style.weight;

    const css = [
      `@font-face {`,
      `  font-family: '${name}';`,
      `  src: url('/fonts/${slug}/${style.file}') format('woff2');`,
      `  font-weight: ${weightVal};`,
      `  font-style: ${style.italic ? "italic" : "normal"};`,
      `  font-display: swap;`,
      `}`,
      ``,
      `.my-text {`,
      `  font-family: '${name}', sans-serif;`,
      `  font-weight: ${style.weight};`,
      `  font-style: ${style.italic ? "italic" : "normal"};`,
      `}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(css);
      setCopiedKey(style.key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setCopiedKey(null);
    }
  }

  return (
    <section id="styles" className="shell mt-16 scroll-mt-20">
      {/* Header & Global Sample Controls */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-[14px] font-bold">
            {styles.length} kiểu chữ (Styles)
          </h2>
          <p className="micro mt-1">
            Gõ thử văn bản bên dưới để xem độ đậm nhạt và độ nghiêng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="micro">Cỡ chữ:</span>
          <input
            type="range"
            min={20}
            max={96}
            step={2}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="range w-24 sm:w-32 cursor-pointer"
          />
          <span className="text-[14px] font-bold min-w-[36px] text-right">{size}px</span>
        </div>
      </div>

      {/* Global Sample Text Input & Quick Preset Buttons */}
      <div className="border-b border-line py-4">
        <div className="flex items-center gap-3">
          <label htmlFor="styles-sample-input" className="micro shrink-0">
            Văn bản thử:
          </label>
          <input
            id="styles-sample-input"
            type="text"
            value={sample}
            onChange={(e) => setSample(e.target.value)}
            placeholder="Nhập câu thử cho tất cả style..."
            className="w-full bg-transparent text-[16px] leading-[20px] outline-none placeholder:text-muted"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="micro mr-1">Mẫu nhanh:</span>
          {STYLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSample(preset)}
              className="chip text-[12px] cursor-pointer"
              data-active={sample === preset || undefined}
            >
              {preset.split("—")[0].slice(0, 24)}...
            </button>
          ))}
        </div>
      </div>

      {/* Styles List */}
      <div className="divide-y divide-line border-b border-line bg-panel text-panel-ink">
        {styles.map((style) => (
          <div
            key={style.key}
            className="group px-4 py-6 transition-colors hover:bg-row-hover md:px-8 md:py-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4 text-[14px] leading-[20px] text-panel-muted">
              <div className="flex items-center gap-3">
                <span className="font-bold text-panel-ink">{style.name}</span>
                <span>{style.weight}</span>
                {style.italic && <span>Italic</span>}
                {style.variable && <span>Variable</span>}
              </div>

              <button
                type="button"
                onClick={() => copyStyleCss(style)}
                className="flex items-center gap-1.5 text-[13px] text-panel-muted opacity-80 hover:text-panel-ink group-hover:opacity-100 cursor-pointer"
                title="Sao chép CSS @font-face cho kiểu này"
              >
                {copiedKey === style.key ? (
                  <>
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 font-medium">Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-4 w-4" />
                    <span>Copy CSS</span>
                  </>
                )}
              </button>
            </div>

            <p
              className="mt-4 leading-[1.3] tracking-[-0.02em] text-panel-ink py-1 overflow-x-auto whitespace-nowrap scrollbar-none"
              style={{
                fontFamily: `'${slug}', sans-serif`,
                fontSize: `${size}px`,
                fontWeight: style.weight,
                fontStyle: style.italic ? "italic" : "normal",
              }}
            >
              {sample || `${name} ${style.name}`}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
