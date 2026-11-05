"use client";

import { useMemo, useState } from "react";
import type { FontAxis, FontStyle } from "@/lib/types";

type Props = {
  slug: string;
  name: string;
  axes: FontAxis[];
  styles: FontStyle[];
  initialWeight: number;
};

const DEFAULTS = {
  text: "Chữ Việt đẹp, đọc dễ.",
  size: 96,
  lineHeight: 1.1,
  italic: false,
};

const SIZE_PRESETS = [16, 24, 32, 40, 50, 64, 96, 120, 160];

export function SpecimenControls({ slug, name, axes, styles, initialWeight }: Props) {
  const weightAxis = axes.find((axis) => axis.tag === "wght");
  const italicStyles = styles.filter((style) => style.italic);

  const [text, setText] = useState(DEFAULTS.text);
  const [size, setSize] = useState(DEFAULTS.size);
  const [lineHeight, setLineHeight] = useState(DEFAULTS.lineHeight);
  const [weight, setWeight] = useState(() => {
    if (!weightAxis) return initialWeight;
    return Math.min(Math.max(initialWeight, weightAxis.min), weightAxis.max);
  });
  const [italic, setItalic] = useState(false);
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => {
    const file = styles.find((style) => !style.italic)?.file ?? styles[0]?.file;
    const weightValue =
      weightAxis && styles[0]?.weightRange
        ? `${styles[0].weightRange[0]} ${styles[0].weightRange[1]}`
        : weight;
    return [
      `@font-face {`,
      `  font-family: '${name}';`,
      `  src: url('${typeof window !== "undefined" ? window.location.origin : ""}/fonts/${slug}/${file}') format('woff2');`,
      `  font-weight: ${weightValue};`,
      `  font-style: normal;`,
      `  font-display: swap;`,
      `}`,
      ``,
      `.specimen { font-family: '${name}', serif; }`,
    ].join("\n");
  }, [name, slug, styles, weight, weightAxis]);

  async function copyCss() {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setText(DEFAULTS.text);
    setSize(DEFAULTS.size);
    setLineHeight(DEFAULTS.lineHeight);
    setWeight(
      weightAxis
        ? Math.min(Math.max(initialWeight, weightAxis.min), weightAxis.max)
        : initialWeight
    );
    setItalic(false);
  }

  return (
    <div className="border-b border-line">
      <div className="shell">
        <div className="grid grid-cols-1 border-b border-line md:grid-cols-8">
          <div className="py-5 md:col-span-5 md:border-r md:border-line md:pr-8">
            <label htmlFor="specimen-text" className="micro">
              Chữ thử
            </label>
            <input
              id="specimen-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="mt-3 w-full bg-transparent text-[16px] leading-[24px] outline-none placeholder:text-faint"
              placeholder="Nhập chữ để thử…"
            />
          </div>

          <div className="flex flex-wrap items-center gap-5 border-t border-line py-5 md:col-span-3 md:justify-end md:border-t-0 md:pl-8">
            {italicStyles.length > 0 && (
              <button
                type="button"
                aria-pressed={italic}
                onClick={() => setItalic((value) => !value)}
                className="chip italic"
                data-active={italic || undefined}
              >
                Italic
              </button>
            )}
            <button type="button" onClick={reset} className="chip">
              Đặt lại
            </button>
            <button type="button" onClick={copyCss} className="btn">
              {copied ? "Đã copy" : "Copy CSS"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 py-6 md:grid-cols-3 md:gap-10">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="specimen-size" className="micro">
                Cỡ chữ
              </label>
              <span className="text-[14px] font-bold leading-[20px]">
                {size}px
              </span>
            </div>
            <input
              id="specimen-size"
              type="range"
              min={12}
              max={200}
              step={1}
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              className="range mt-4"
            />
            <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              {SIZE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSize(preset)}
                  className="chip"
                  data-active={size === preset || undefined}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="specimen-line" className="micro">
                Giãn dòng
              </label>
              <span className="text-[14px] font-bold leading-[20px]">
                {lineHeight.toFixed(2)}
              </span>
            </div>
            <input
              id="specimen-line"
              type="range"
              min={0.8}
              max={2}
              step={0.05}
              value={lineHeight}
              onChange={(event) => setLineHeight(Number(event.target.value))}
              className="range mt-4"
            />
          </div>

          {weightAxis ? (
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor="specimen-weight" className="micro">
                  Độ đậm
                </label>
                <span className="text-[14px] font-bold leading-[20px]">
                  {weight}
                </span>
              </div>
              <input
                id="specimen-weight"
                type="range"
                min={weightAxis.min}
                max={weightAxis.max}
                step={1}
                value={weight}
                onChange={(event) => setWeight(Number(event.target.value))}
                className="range mt-4"
              />
            </div>
          ) : (
            <div>
              <span className="micro">Kiểu chữ</span>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                {styles.map((style) => (
                  <button
                    key={style.key}
                    type="button"
                    onClick={() => {
                      setWeight(style.weight);
                      setItalic(style.italic);
                    }}
                    className="chip"
                    data-active={
                      (weight === style.weight && italic === style.italic) ||
                      undefined
                    }
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-line bg-panel">
        <div className="shell min-h-[220px] overflow-hidden py-10 md:py-16">
          <p
            style={{
              fontFamily: `'${slug}', serif`,
              fontSize: `clamp(24px, ${size / 16}rem, 200px)`,
              fontWeight: weight,
              fontStyle: italic ? "italic" : "normal",
              lineHeight,
            }}
            className="break-words text-panel-ink"
          >
            {text || " "}
          </p>
        </div>
      </div>
    </div>
  );
}
