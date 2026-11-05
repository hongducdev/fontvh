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
    text: "Ắ Ề Ỗ Ữ Ỹ Ỵ Đ ₫ ă â ê ô ơ ư ả ạ ẽ ị ỏ ũ — Tiếng chuông chùa ngân vang chiều tà.",
  },
  {
    label: "Bảng chữ cái",
    text: "A B C D E F G H I K L M N O P Q R S T U V X Y Z · a b c d e f g h i k l m n o p q r s t u v x y z",
  },
  {
    label: "Chữ số & Giá",
    text: "0 1 2 3 4 5 6 7 8 9 · ₫ 150.000 · +84 (0) 90 123 4567 · $1,250.00",
  },
];

const SIZE_PRESETS = [16, 24, 36, 48, 64, 96, 128, 160];

const WATERFALL_SIZES = [96, 72, 60, 48, 36, 24, 20, 16, 14, 12];

type SpecimenMode = "playground" | "waterfall" | "editorial";

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

  // View mode
  const [mode, setMode] = useState<SpecimenMode>("playground");

  // Controls
  const [text, setText] = useState(PRESET_TEXTS[0].text);
  const [waterfallText, setWaterfallText] = useState(
    "Gió đưa cành trúc la đà, tiếng chuông Trấn Vũ canh gà Thọ Xương."
  );
  const [size, setSize] = useState(72);
  const [lineHeight, setLineHeight] = useState(1.15);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [weight, setWeight] = useState(() => {
    if (!weightAxis) return initialWeight;
    return Math.min(Math.max(initialWeight, weightAxis.min), weightAxis.max);
  });
  const [italic, setItalic] = useState(false);
  const [align, setAlign] = useState<"left" | "center" | "right">("left");
  const [textTransform, setTextTransform] = useState<
    "none" | "uppercase" | "lowercase"
  >("none");
  const [invertCanvas, setInvertCanvas] = useState(false);
  const [copied, setCopied] = useState(false);

  // Editorial content states (editable in-place)
  const [editorialHeadline, setEditorialHeadline] = useState(
    "Nghệ thuật chữ & Bản sắc thị giác Việt Nam"
  );
  const [editorialSubhead, setEditorialSubhead] = useState(
    "Khám phá sự giao thoa hài hòa giữa đường nét hình học hiện đại và hệ thống dấu thanh Quốc ngữ tinh tế."
  );
  const [editorialLead, setEditorialLead] = useState(
    "Từ những ấn phẩm báo chí đầu thế kỷ hai mươi cho đến các ứng dụng giao diện số đương đại, nghệ thuật thiết kế kiểu chữ (typography) tiếng Việt không ngừng phát triển, tìm kiếm sự cân bằng tuyệt đối giữa công năng truyền đạt và mỹ cảm hình khối."
  );
  const [editorialBody, setEditorialBody] = useState(
    "Mỗi dấu sắc, huyền, hỏi, ngã, nặng khi đặt trên các nguyên âm có nón như Â, Ă, Ê, Ô, Ơ, Ư là một bài toán hình học đầy thách thức. Người thiết kế phải cân nhắc tỉ mỉ từng micromet để dấu không bị chạm vào ký tự kế cận hoặc làm thủng nhịp điệu đen trắng trên từng dòng văn bản. Khi được chế tác chuẩn xác, một họ chữ đẹp sẽ làm nổi bật vẻ sang trọng và trang nhã của tiếng Việt."
  );

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
      {/* Specimen Mode Selector & Preset Toolbar */}
      <div className="shell">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-4">
          {/* Mode Switcher: Playground | Waterfall | Editorial */}
          <div className="flex items-center gap-2">
            <span className="micro mr-1">Chế độ xem:</span>
            <button
              type="button"
              onClick={() => setMode("playground")}
              className={`rounded px-3 py-1.5 text-[13px] font-bold transition-colors cursor-pointer ${
                mode === "playground"
                  ? "bg-solid-bg text-solid-ink"
                  : "bg-soft text-muted hover:text-ink"
              }`}
            >
              Thử tự do
            </button>
            <button
              type="button"
              onClick={() => setMode("waterfall")}
              className={`rounded px-3 py-1.5 text-[13px] font-bold transition-colors cursor-pointer ${
                mode === "waterfall"
                  ? "bg-solid-bg text-solid-ink"
                  : "bg-soft text-muted hover:text-ink"
              }`}
            >
              Bậc thang (Waterfall)
            </button>
            <button
              type="button"
              onClick={() => setMode("editorial")}
              className={`rounded px-3 py-1.5 text-[13px] font-bold transition-colors cursor-pointer ${
                mode === "editorial"
                  ? "bg-solid-bg text-solid-ink"
                  : "bg-soft text-muted hover:text-ink"
              }`}
            >
              Bài báo (Editorial)
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="chip text-[13px] text-muted hover:text-ink cursor-pointer"
            >
              Đặt lại
            </button>
            <button
              type="button"
              onClick={copyCss}
              className="btn flex items-center gap-1.5 text-[13px] py-1.5 px-3 cursor-pointer"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span>{copied ? "Đã copy CSS" : "Copy CSS"}</span>
            </button>
          </div>
        </div>

        {/* Global Controls Grid */}
        <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-4 md:gap-8 border-b border-line">
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
                  aria-label="Độ đậm phông chữ"
                  min={weightAxis.min}
                  max={weightAxis.max}
                  step={1}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="range mt-3 cursor-pointer"
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
                      className="chip text-[13px] cursor-pointer"
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
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setItalic((prev) => !prev)}
                  className="chip italic text-[13px] cursor-pointer"
                  data-active={italic || undefined}
                >
                  Italic (Nghiêng)
                </button>
              </div>
            )}
          </div>

          {/* Size (chỉ áp dụng trực tiếp cho Playground) */}
          <div>
            <div className="flex items-baseline justify-between text-[14px]">
              <span className="micro">
                {mode === "playground" ? "Cỡ chữ" : "Kích thước cơ sở"}
              </span>
              <span className="font-bold">{size}px</span>
            </div>
            <input
              type="range"
              aria-label="Cỡ chữ"
              min={12}
              max={180}
              step={1}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="range mt-3 cursor-pointer"
            />
            {mode === "playground" && (
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                {SIZE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSize(preset)}
                    className="chip text-[12px] cursor-pointer"
                    data-active={size === preset || undefined}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Line Height & Letter Spacing */}
          <div>
            <div className="flex items-baseline justify-between text-[14px]">
              <span className="micro">Giãn dòng</span>
              <span className="font-bold">{lineHeight.toFixed(2)}</span>
            </div>
            <input
              type="range"
              aria-label="Giãn dòng"
              min={0.8}
              max={2.2}
              step={0.05}
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="range mt-3 cursor-pointer"
            />

            <div className="mt-4 flex items-baseline justify-between text-[14px]">
              <span className="micro">Khoảng cách chữ</span>
              <span className="font-bold">{letterSpacing.toFixed(2)}em</span>
            </div>
            <input
              type="range"
              aria-label="Khoảng cách chữ"
              min={-0.05}
              max={0.25}
              step={0.01}
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(Number(e.target.value))}
              className="range mt-3 cursor-pointer"
            />
          </div>

          {/* Alignment & Invert Canvas */}
          <div>
            <span className="micro">Căn lề & Hiển thị</span>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setAlign("left")}
                className="chip text-[13px] cursor-pointer"
                data-active={align === "left" || undefined}
              >
                Trái
              </button>
              <button
                type="button"
                onClick={() => setAlign("center")}
                className="chip text-[13px] cursor-pointer"
                data-active={align === "center" || undefined}
              >
                Giữa
              </button>
              <button
                type="button"
                onClick={() => setAlign("right")}
                className="chip text-[13px] cursor-pointer"
                data-active={align === "right" || undefined}
              >
                Phải
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTextTransform("none")}
                className="chip text-[13px] cursor-pointer"
                data-active={textTransform === "none" || undefined}
              >
                Aa thường
              </button>
              <button
                type="button"
                onClick={() => setTextTransform("uppercase")}
                className="chip text-[13px] cursor-pointer"
                data-active={textTransform === "uppercase" || undefined}
              >
                AA HOA
              </button>
              <button
                type="button"
                onClick={() => setTextTransform("lowercase")}
                className="chip text-[13px] cursor-pointer"
                data-active={textTransform === "lowercase" || undefined}
              >
                aa nhỏ
              </button>
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => setInvertCanvas((prev) => !prev)}
                className="chip text-[13px] cursor-pointer"
                data-active={invertCanvas || undefined}
              >
                Đảo màu nền ô thử
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODE 1: PLAYGROUND (Thử tự do)                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      {mode === "playground" && (
        <div
          className={`transition-colors ${
            invertCanvas ? "bg-ink text-paper" : "bg-panel text-panel-ink"
          }`}
        >
          {/* Preset Buttons */}
          <div className="shell flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line/40 py-3">
            <span className="micro mr-1">Câu mẫu:</span>
            {PRESET_TEXTS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setText(preset.text)}
                className="chip text-[13px] cursor-pointer"
                data-active={text === preset.text || undefined}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="shell min-h-[300px] overflow-hidden py-12 md:py-20">
            <label htmlFor="specimen-live-input" className="sr-only">
              Văn bản thử nghiệm font trực tiếp
            </label>
            <textarea
              id="specimen-live-input"
              rows={Math.max(2, Math.ceil(text.length / 45))}
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{
                fontFamily: `'${slug}', sans-serif`,
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
            <p className="micro mt-6 text-center opacity-40">
              (Bấm trực tiếp vào đoạn văn trên để chỉnh sửa nội dung bất kỳ)
            </p>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODE 2: WATERFALL (Bậc thang kích thước chuẩn Fontshare)      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {mode === "waterfall" && (
        <div
          className={`transition-colors ${
            invertCanvas ? "bg-ink text-paper" : "bg-panel text-panel-ink"
          }`}
        >
          {/* Waterfall sample sentence input */}
          <div className="shell flex items-center gap-3 border-b border-line/40 py-3.5">
            <label htmlFor="waterfall-sample-input" className="micro shrink-0">
              Văn bản thử:
            </label>
            <input
              id="waterfall-sample-input"
              type="text"
              aria-label="Văn bản thử bậc thang kích thước"
              value={waterfallText}
              onChange={(e) => setWaterfallText(e.target.value)}
              placeholder="Nhập câu thử cho bậc thang kích thước..."
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
            />
          </div>

          <div className="shell divide-y divide-line/40 py-8">
            {WATERFALL_SIZES.map((fontSize) => (
              <div
                key={fontSize}
                className="group flex flex-col gap-2 py-5 transition-colors first:pt-2 last:pb-2 md:flex-row md:items-baseline md:gap-8"
              >
                {/* Size Badge */}
                <div className="w-16 shrink-0 font-mono text-[13px] font-bold text-muted group-hover:text-cream">
                  {fontSize}px
                </div>

                {/* Text Line */}
                <p
                  className="flex-1 truncate"
                  style={{
                    fontFamily: `'${slug}', sans-serif`,
                    fontSize: `${fontSize}px`,
                    fontWeight: weight,
                    fontStyle: italic ? "italic" : "normal",
                    lineHeight: 1.2,
                    letterSpacing: `${letterSpacing}em`,
                    textAlign: align,
                    textTransform,
                  }}
                >
                  {waterfallText}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODE 3: EDITORIAL (Bố cục bài báo tạp chí hoàn chỉnh)        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {mode === "editorial" && (
        <div
          className={`transition-colors ${
            invertCanvas ? "bg-ink text-paper" : "bg-panel text-panel-ink"
          }`}
        >
          <div className="shell max-w-5xl py-12 md:py-20">
            {/* Kicker */}
            <div className="mb-4">
              <span className="rounded bg-soft px-3 py-1 font-mono text-[12px] font-bold uppercase tracking-wider text-muted">
                Ấn phẩm đặc biệt · Nghệ thuật Typography
              </span>
            </div>

            {/* Editable Headline */}
            <textarea
              rows={2}
              aria-label="Tiêu đề bài báo mẫu"
              value={editorialHeadline}
              onChange={(e) => setEditorialHeadline(e.target.value)}
              style={{
                fontFamily: `'${slug}', sans-serif`,
                fontWeight: Math.max(weight, 600),
                fontStyle: italic ? "italic" : "normal",
                lineHeight: 1.08,
                letterSpacing: `${letterSpacing}em`,
                textAlign: align,
              }}
              className="w-full resize-none border-0 bg-transparent p-0 text-[38px] tracking-tight outline-none md:text-[56px] lg:text-[68px]"
            />

            {/* Editable Subhead / Deck */}
            <div className="mt-4 border-b border-line/60 pb-8">
              <textarea
                rows={2}
                aria-label="Tiêu đề phụ bài báo mẫu"
                value={editorialSubhead}
                onChange={(e) => setEditorialSubhead(e.target.value)}
                style={{
                  fontFamily: `'${slug}', sans-serif`,
                  fontWeight: Math.min(weight, 500),
                  fontStyle: italic ? "italic" : "normal",
                  lineHeight: 1.35,
                  letterSpacing: `${letterSpacing}em`,
                  textAlign: align,
                }}
                className="w-full resize-none border-0 bg-transparent p-0 text-[18px] text-muted outline-none md:text-[22px]"
              />
            </div>

            {/* Two-Column Editorial Article Body */}
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 text-[16px] leading-[1.65]">
              {/* Column 1 */}
              <div>
                <p className="micro mb-2 font-mono text-[11px] uppercase">
                  Phần I: Khởi nguồn & Cấu trúc
                </p>
                <textarea
                  rows={6}
                  aria-label="Nội dung phần I bài báo mẫu"
                  value={editorialLead}
                  onChange={(e) => setEditorialLead(e.target.value)}
                  style={{
                    fontFamily: `'${slug}', sans-serif`,
                    fontWeight: weight,
                    fontStyle: italic ? "italic" : "normal",
                    lineHeight,
                    letterSpacing: `${letterSpacing}em`,
                    textAlign: align,
                  }}
                  className="w-full resize-none border-0 bg-transparent p-0 text-[16px] leading-relaxed outline-none"
                />
              </div>

              {/* Column 2 */}
              <div>
                <p className="micro mb-2 font-mono text-[11px] uppercase">
                  Phần II: Dấu thanh & Nhịp điệu
                </p>
                <textarea
                  rows={6}
                  aria-label="Nội dung phần II bài báo mẫu"
                  value={editorialBody}
                  onChange={(e) => setEditorialBody(e.target.value)}
                  style={{
                    fontFamily: `'${slug}', sans-serif`,
                    fontWeight: weight,
                    fontStyle: italic ? "italic" : "normal",
                    lineHeight,
                    letterSpacing: `${letterSpacing}em`,
                    textAlign: align,
                  }}
                  className="w-full resize-none border-0 bg-transparent p-0 text-[16px] leading-relaxed outline-none"
                />
              </div>
            </div>

            {/* Pull Quote Box */}
            <div className="mt-12 border-l-2 border-cream pl-6 py-2">
              <p
                className="text-[20px] italic leading-snug text-cream md:text-[24px]"
                style={{
                  fontFamily: `'${slug}', sans-serif`,
                  fontWeight: Math.max(weight, 500),
                }}
              >
                “Kiểu chữ không đơn thuần là công cụ biểu đạt ngôn từ — nó chính là âm hưởng thị giác truyền tải cảm xúc của toàn bộ tác phẩm.”
              </p>
              <p className="micro mt-3 font-mono text-[12px]">
                Trích dẫn từ bài luận Typography Việt Nam đương đại
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
