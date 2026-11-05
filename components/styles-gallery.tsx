"use client";

import { useState } from "react";
import type { FontStyle } from "@/lib/types";
import { CheckIcon, CopyIcon } from "./icons";

export function StylesGallery({
  slug,
  name,
  styles,
}: {
  slug: string;
  name: string;
  styles: FontStyle[];
}) {
  const [sample, setSample] = useState("Chữ Việt đẹp và tinh tế trong từng nét chữ");
  const [size, setSize] = useState(48);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function copyStyleCss(style: FontStyle) {
    const css = [
      `@font-face {`,
      `  font-family: '${name}';`,
      `  src: url('/fonts/${slug}/${style.file}') format('woff2');`,
      `  font-weight: ${style.weight};`,
      `  font-style: ${style.italic ? "italic" : "normal"};`,
      `  font-display: swap;`,
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
            className="range w-24 sm:w-32"
          />
          <span className="text-[14px] font-bold">{size}px</span>
        </div>
      </div>

      {/* Global Sample Text Input */}
      <div className="flex items-center gap-3 border-b border-line py-4">
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
                className="flex items-center gap-1.5 text-[13px] text-panel-muted opacity-80 hover:text-panel-ink group-hover:opacity-100"
                title="Sao chép CSS @font-face cho kiểu này"
              >
                {copiedKey === style.key ? (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    <span>Đã sao chép</span>
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
              className="mt-4 truncate leading-[1.15] tracking-[-0.02em] text-panel-ink"
              style={{
                fontFamily: `'${slug}'`,
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
