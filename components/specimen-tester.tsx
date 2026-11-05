"use client";

import { useMemo, useState } from "react";
import type { FontAxis, FontStyle } from "@/lib/types";
import { CheckIcon, CopyIcon } from "./icons";

const PRESET_TEXTS = [
  { label: "Tiêu đề", text: "Chữ Việt đẹp và tinh tế." },
  {
    label: "Đoạn văn",
    text: "Mỗi dấu thanh trong hệ chữ Quốc ngữ đòi hỏi sự cân nhắc tỉ mỉ về trọng lượng, độ nghiêng và khoảng cách không gian, giúp mắt người đọc lướt êm ái mà không bị gián đoạn.",
  },
  {
    label: "Đủ dấu",
    text: "Ắ Ề Ỗ ữ ỹ ỵ Đ ₫ ă â ê ô ơ ư ả ạ ẽ ị ỏ ũ — Tiếng chuông chùa ngân vang chiều tà.",
  },
  {
    label: "Bảng chữ cái",
    text: "A B C D E F G H I K L M N O P Q R S T U V X Y Z · a b c d e f g h i k l m n o p q r s t u v x y z",
  },
  {
    label: "Chữ số",
    text: "0 1 2 3 4 5 6 7 8 9 · ₫ 150.000 · +84 (0) 90 123 4567",
  },
];

const SIZE_PRESETS = [16, 24, 36, 48, 64, 96, 128, 160];

type Props = {
  slug: string;
  name: string;
  axes: FontAxis[];
  styles: FontStyle[];
  initialWeight: number;
};

export function SpecimenTester({
  slug,
  name,
  axes,
  styles,
  initialWeight,
}: Props) {
  const weightAxis = axes.find((axis) => axis.tag === "wght");
  const italicStyles = styles.filter((style) => style.italic);

  const [text, setText] = useState(PRESET_TEXTS[0].text);
  const [size, setSize] = useState(72);
  const [lineHeight, setLineHeight] = useState(1.15);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [weight, setWeight] = useState(() => {
    if (!weightAxis) return initialWeight;
    return Math.min(Math.max(initialWeight, weightAxis.min), weightAxis.max);
  });
  const [italic, setItalic] = useState(false);
  const [align, setAlign] = useState<"left" | "center" | "right">("left");
  const [textTransform, setTextTransform] = useState<"none" | "uppercase" | "lowercase">("none");
  const [invertCanvas, setInvertCanvas] = useState(false);
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
      `  src: url('/fonts/${slug}/${file}') format('woff2');`,
      `  font-weight: ${weightValue};`,
      `  font-style: ${italic ? "italic" : "normal"};`,
      `  font-display: swap;`,
      `}`,
      ``,
      `.my-heading {`,
      `  font-family: '${name}', sans-serif;`,
      `  font-weight: ${weight};`,
      `  font-style: ${italic ? "italic" : "normal"};`,
      `  font-size: ${size}px;`,
      `  line-height: ${lineHeight};`,
      `  letter-spacing: ${letterSpacing}em;`,
      `}`,
    ].join("\n");
  }, [name, slug, styles, weight, weightAxis, italic, size, lineHeight, letterSpacing]);

  async function copyCss() {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setText(PRESET_TEXTS[0].text);
    setSize(72);
    setLineHeight(1.15);
    setLetterSpacing(0);
    setWeight(
      weightAxis
        ? Math.min(Math.max(initialWeight, weightAxis.min), weightAxis.max)
        : initialWeight
    );
    setItalic(false);
    setAlign("left");
    setTextTransform("none");
    setInvertCanvas(false);
  }

  return (
    <div id="specimen" className="border-b border-line scroll-mt-20">
      {/* Control Strip */}
      <div className="shell">
        {/* Preset Sentences & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="micro mr-1">Mẫu chữ:</span>
            {PRESET_TEXTS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setText(preset.text)}
                className="chip text-[13px]"
                data-active={text === preset.text || undefined}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="chip text-[13px] text-muted hover:text-ink"
            >
              Đặt lại
            </button>
            <button
              type="button"
              onClick={copyCss}
              className="btn flex items-center gap-1.5 text-[13px] py-1.5 px-3"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span>{copied ? "Đã copy CSS" : "Copy CSS"}</span>
            </button>
          </div>
        </div>

        {/* Sliders Grid: Size, Line Height, Tracking, Weight, Alignment, Transform */}
        <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-4 md:gap-8">
          {/* Size */}
          <div>
            <div className="flex items-baseline justify-between text-[14px]">
              <span className="micro">Cỡ chữ</span>
              <span className="font-bold">{size}px</span>
            </div>
            <input
              type="range"
              min={12}
              max={180}
              step={1}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="range mt-3"
            />
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
              {SIZE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSize(preset)}
                  className="chip text-[12px]"
                  data-active={size === preset || undefined}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Line Height & Letter Spacing */}
          <div>
            <div className="flex items-baseline justify-between text-[14px]">
              <span className="micro">Giãn dòng</span>
              <span className="font-bold">{lineHeight.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.8}
              max={2.2}
              step={0.05}
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="range mt-3"
            />

            <div className="mt-5 flex items-baseline justify-between text-[14px]">
              <span className="micro">Khoảng cách chữ</span>
              <span className="font-bold">{letterSpacing.toFixed(2)}em</span>
            </div>
            <input
              type="range"
              min={-0.05}
              max={0.25}
              step={0.01}
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(Number(e.target.value))}
              className="range mt-3"
            />
          </div>

          {/* Weight */}
          <div>
            {weightAxis ? (
              <>
                <div className="flex items-baseline justify-between text-[14px]">
                  <span className="micro">Độ đậm (Variable)</span>
                  <span className="font-bold">{weight}</span>
                </div>
                <input
                  type="range"
                  min={weightAxis.min}
                  max={weightAxis.max}
                  step={1}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="range mt-3"
                />
              </>
            ) : (
              <>
                <span className="micro">Kiểu chữ & Trọng số</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {styles.map((style) => (
                    <button
                      key={style.key}
                      type="button"
                      onClick={() => {
                        setWeight(style.weight);
                        setItalic(style.italic);
                      }}
                      className="chip text-[13px]"
                      data-active={
                        (weight === style.weight && italic === style.italic) ||
                        undefined
                      }
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            {italicStyles.length > 0 && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setItalic((prev) => !prev)}
                  className="chip italic text-[14px]"
                  data-active={italic || undefined}
                >
                  Italic (Nghiêng)
                </button>
              </div>
            )}
          </div>

          {/* Formatting: Align, Transform, Theme Toggle Canvas */}
          <div>
            <span className="micro">Căn lề & Định dạng</span>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setAlign("left")}
                className="chip text-[13px]"
                data-active={align === "left" || undefined}
              >
                Trái
              </button>
              <button
                type="button"
                onClick={() => setAlign("center")}
                className="chip text-[13px]"
                data-active={align === "center" || undefined}
              >
                Giữa
              </button>
              <button
                type="button"
                onClick={() => setAlign("right")}
                className="chip text-[13px]"
                data-active={align === "right" || undefined}
              >
                Phải
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTextTransform("none")}
                className="chip text-[13px]"
                data-active={textTransform === "none" || undefined}
              >
                Aa thường
              </button>
              <button
                type="button"
                onClick={() => setTextTransform("uppercase")}
                className="chip text-[13px]"
                data-active={textTransform === "uppercase" || undefined}
              >
                AA HOA
              </button>
              <button
                type="button"
                onClick={() => setTextTransform("lowercase")}
                className="chip text-[13px]"
                data-active={textTransform === "lowercase" || undefined}
              >
                aa nhỏ
              </button>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setInvertCanvas((prev) => !prev)}
                className="chip text-[13px]"
                data-active={invertCanvas || undefined}
              >
                Đảo màu nền ô thử
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Specimen Canvas: Directly In-place Editable! */}
      <div
        className={`border-t border-line transition-colors ${
          invertCanvas ? "bg-ink text-paper" : "bg-panel text-panel-ink"
        }`}
      >
        <div className="shell min-h-[280px] overflow-hidden py-12 md:py-20">
          <label htmlFor="specimen-live-input" className="sr-only">
            Văn bản thử nghiệm font trực tiếp
          </label>
          <textarea
            id="specimen-live-input"
            rows={Math.max(2, Math.ceil(text.length / 50))}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              fontFamily: `'${slug}', serif`,
              fontSize: `${size}px`,
              fontWeight: weight,
              fontStyle: italic ? "italic" : "normal",
              lineHeight,
              letterSpacing: `${letterSpacing}em`,
              textAlign: align,
              textTransform,
            }}
            placeholder="Bấm vào đây để gõ nội dung bất kỳ…"
            className="w-full resize-none border-0 bg-transparent p-0 outline-none"
          />
          <p className="micro mt-4 text-center opacity-40">
            (Bấm trực tiếp vào đoạn văn trên để chỉnh sửa nội dung)
          </p>
        </div>
      </div>
    </div>
  );
}
