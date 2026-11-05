"use client";

import { useMemo, useState } from "react";
import { CheckIcon, CopyIcon, XIcon } from "./icons";

const VI_UPPER = [
  "À", "Á", "Ả", "Ã", "Ạ",
  "Ă", "Ằ", "Ắ", "Ẳ", "Ẵ", "Ặ",
  "Â", "Ầ", "Ấ", "Ẩ", "Ẫ", "Ậ",
  "Đ",
  "È", "É", "Ẻ", "Ẽ", "Ẹ",
  "Ê", "Ề", "Ế", "Ể", "Ễ", "Ệ",
  "Ì", "Í", "Ỉ", "Ĩ", "Ị",
  "Ò", "Ó", "Ỏ", "Õ", "Ọ",
  "Ô", "Ồ", "Ố", "Ổ", "Ỗ", "Ộ",
  "Ơ", "Ờ", "Ớ", "Ở", "Ỡ", "Ợ",
  "Ù", "Ú", "Ủ", "Ũ", "Ụ",
  "Ư", "Ừ", "Ứ", "Ử", "Ữ", "Ự",
  "Ỳ", "Ý", "Ỷ", "Ỹ", "Ỵ",
];

const VI_LOWER = [
  "à", "á", "ả", "ã", "ạ",
  "ă", "ằ", "ắ", "ẳ", "ẵ", "ặ",
  "â", "ầ", "ấ", "ẩ", "ẫ", "ậ",
  "đ",
  "è", "é", "ẻ", "ẽ", "ẹ",
  "ê", "ề", "ế", "ể", "ễ", "ệ",
  "ì", "í", "ỉ", "ĩ", "ị",
  "ò", "ó", "ỏ", "õ", "ọ",
  "ô", "ồ", "ố", "ổ", "ỗ", "ộ",
  "ơ", "ờ", "ớ", "ở", "ỡ", "ợ",
  "ù", "ú", "ủ", "ũ", "ụ",
  "ư", "ừ", "ứ", "ử", "ữ", "ự",
  "ỳ", "ý", "ỷ", "ỹ", "ỵ",
];

const BASIC_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const BASIC_LOWER = "abcdefghijklmnopqrstuvwxyz".split("");
const NUMBERS = "0123456789".split("");
const SYMBOLS = [
  "!", '"', "#", "$", "%", "&", "'", "(", ")", "*",
  "+", ",", "-", ".", "/", ":", ";", "<", "=", ">",
  "?", "@", "[", "\\", "]", "^", "_", "`", "{", "|",
  "}", "~", "₫", "€", "£", "¥", "©", "®", "™", "°",
  "«", "»", "“", "”", "‘", "’", "–", "—", "…", "•",
];

type GlyphCategory = "vi" | "upper" | "lower" | "num" | "sym";

type SelectedGlyph = {
  char: string;
  codePoint: number;
  hex: string;
  html: string;
};

export function GlyphInspector({
  slug,
  name,
  glyphsCount,
}: {
  slug: string;
  name: string;
  glyphsCount: number;
}) {
  const [tab, setTab] = useState<GlyphCategory>("vi");
  const [selected, setSelected] = useState<SelectedGlyph | null>(null);
  const [copied, setCopied] = useState(false);

  const list = useMemo(() => {
    switch (tab) {
      case "vi":
        return [...VI_UPPER, ...VI_LOWER, "₫"];
      case "upper":
        return BASIC_UPPER;
      case "lower":
        return BASIC_LOWER;
      case "num":
        return NUMBERS;
      case "sym":
        return SYMBOLS;
    }
  }, [tab]);

  function inspectChar(char: string) {
    const codePoint = char.codePointAt(0) ?? 0;
    const hex = `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`;
    const html = `&#x${codePoint.toString(16)};`;
    setSelected({ char, codePoint, hex, html });
    setCopied(false);
  }

  async function copyChar(char: string) {
    try {
      await navigator.clipboard.writeText(char);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="glyphs" className="shell mt-16 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-[14px] font-bold">Bộ ký tự & Glyph</h2>
          <p className="micro mt-1">
            {glyphsCount} glyphs · Hỗ trợ toàn diện tiếng Việt và ký tự Latin mở rộng
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[14px]">
          <button
            type="button"
            onClick={() => setTab("vi")}
            className="chip font-medium"
            data-active={tab === "vi" || undefined}
          >
            Tiếng Việt ({VI_UPPER.length + VI_LOWER.length + 1})
          </button>
          <button
            type="button"
            onClick={() => setTab("upper")}
            className="chip font-medium"
            data-active={tab === "upper" || undefined}
          >
            Chữ hoa ({BASIC_UPPER.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("lower")}
            className="chip font-medium"
            data-active={tab === "lower" || undefined}
          >
            Chữ thường ({BASIC_LOWER.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("num")}
            className="chip font-medium"
            data-active={tab === "num" || undefined}
          >
            Chữ số ({NUMBERS.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("sym")}
            className="chip font-medium"
            data-active={tab === "sym" || undefined}
          >
            Ký hiệu ({SYMBOLS.length})
          </button>
        </div>
      </div>

      {/* Glyph Grid */}
      <div className="mt-4 grid grid-cols-6 border-l border-t border-line sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16">
        {list.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => inspectChar(char)}
            className="group relative flex h-16 items-center justify-center border-b border-r border-line bg-panel transition-colors hover:bg-solid-bg hover:text-solid-ink"
            style={{ fontFamily: `'${slug}'` }}
            title={`Bấm để soi ký tự ${char}`}
          >
            <span className="text-[26px] leading-none transition-transform group-hover:scale-125">
              {char}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Glyph Inspector Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md border border-line bg-panel p-8 text-panel-ink shadow-2xl">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 text-panel-muted hover:text-panel-ink"
              aria-label="Đóng bảng soi ký tự"
            >
              <XIcon className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center border-b border-line/60 pb-8 pt-2">
              <span
                className="text-[120px] leading-none text-panel-ink"
                style={{ fontFamily: `'${slug}'` }}
              >
                {selected.char}
              </span>
              <span className="micro mt-4 font-mono text-[15px]">
                {name}
              </span>
            </div>

            <div className="mt-6 space-y-3 text-[14px]">
              <div className="flex items-center justify-between border-b border-line/40 py-2">
                <span className="text-panel-muted">Unicode</span>
                <span className="font-mono font-bold text-panel-ink">
                  {selected.hex}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-line/40 py-2">
                <span className="text-panel-muted">Mã số Decimal</span>
                <span className="font-mono text-panel-ink">
                  {selected.codePoint}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-line/40 py-2">
                <span className="text-panel-muted">HTML Entity</span>
                <span className="font-mono text-panel-ink">
                  {selected.html}
                </span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => copyChar(selected.char)}
                className="btn-solid flex-1 gap-2"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                <span>{copied ? "Đã sao chép" : "Sao chép ký tự"}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="btn"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
