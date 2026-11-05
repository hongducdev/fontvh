"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

interface FeatureConfig {
  id: string;
  tag: string;
  cssProperty: string;
  name: string;
  description: string;
  defaultText: string;
  defaultActive: boolean;
  category: "ligatures" | "alternates" | "numerics" | "punctuation" | "localized";
}

const OPENTYPE_FEATURES: FeatureConfig[] = [
  {
    id: "liga",
    tag: "liga, dlig",
    cssProperty: '"liga" 1, "dlig" 1',
    name: "Ligatures (Chữ ghép / Nối nét)",
    description:
      "Tự động kết hợp các cặp ký tự liền kề có nét chạm nhau (như fi, fl, ff, ffi, ffl, Th, st) thành một glyph liền mạch tinh tế.",
    defaultText: "Office first flight affiliate difficult shuffle craft Staff five",
    defaultActive: true,
    category: "ligatures",
  },
  {
    id: "ss01",
    tag: "ss01, salt",
    cssProperty: '"ss01" 1, "salt" 1',
    name: "Stylistic Alternates (Kiểu dáng thay thế)",
    description:
      "Cung cấp các biến thể chữ cái hình học hoặc tối giản (như chữ 'a' một tầng, chữ 'g' mở, nét cong chữ 't' hoặc 'Q' thanh lịch).",
    defaultText: "Digital Agency & Creative Studio Quality Design (a, g, y, Q, t)",
    defaultActive: true,
    category: "alternates",
  },
  {
    id: "frac",
    tag: "frac",
    cssProperty: '"frac" 1',
    name: "Fractions (Phân số chuẩn)",
    description:
      "Tự động chuyển các số ngăn cách bởi dấu gạch chéo thành phân số typography chuẩn xác với tử số và mẫu số thu nhỏ cân xứng.",
    defaultText: "1/2 tách trà, 3/4 muỗng mật ong, 5/8 ounce vani, 7/16 milimet",
    defaultActive: true,
    category: "numerics",
  },
  {
    id: "tnum",
    tag: "tnum",
    cssProperty: '"tnum" 1',
    name: "Tabular Figures (Chữ số thẳng cột)",
    description:
      "Đặt tất cả chữ số có chiều rộng bằng nhau (monospaced) để các con số căn thẳng hàng chuẩn xác trong bảng biểu tài chính.",
    defaultText: "2024: 1,840,500 ₫ (+12.4%)\n2025: 2,930,120 ₫ (+59.2%)\n2026: 7,105,890 ₫ (+142.5%)",
    defaultActive: true,
    category: "numerics",
  },
  {
    id: "case",
    tag: "case",
    cssProperty: '"case" 1',
    name: "Case-Sensitive Forms (Dấu câu căn chữ hoa)",
    description:
      "Dịch chuyển các dấu câu như ngoặc đơn, ngoặc vuông, gạch nối, dấu hai chấm lên cao để căn giữa hoàn hảo với chiều cao chữ HOA (Cap-height).",
    defaultText: "(VIETNAM) [DESIGN] {FONTS} H-A-N-O-I · 2026:TYPO",
    defaultActive: true,
    category: "punctuation",
  },
  {
    id: "zero",
    tag: "zero",
    cssProperty: '"zero" 1',
    name: "Slashed Zero (Số 0 gạch chéo)",
    description:
      "Thêm nét gạch chéo qua số 0 để người đọc dễ dàng phân biệt với chữ cái hoa 'O' trong lập trình, biển số hoặc mã tài khoản.",
    defaultText: "MÃ SỐ: 00980 · PIN: 0408 · SO SÁNH: O0O0 (Chữ O & Số 0)",
    defaultActive: false,
    category: "numerics",
  },
  {
    id: "sups",
    tag: "sups, subs",
    cssProperty: '"sups" 1',
    name: "Superscript & Subscript (Số mũ & Chỉ số dưới)",
    description:
      "Hiển thị số mũ trên (x² + y³ = z⁵, thứ tự 1st, 2nd) hoặc chỉ số dưới (H₂O, CO₂) theo tỷ lệ đường nét cân chỉnh chuyên biệt.",
    defaultText: "Phương trình: x2 + y3 = z5 · Thứ tự: 1st, 2nd, 3rd · Hóa học: H2O + CO2",
    defaultActive: false,
    category: "numerics",
  },
  {
    id: "locl",
    tag: "locl",
    cssProperty: '"locl" 1',
    name: "Localized Vietnamese Forms (Dấu thanh tiếng Việt chuẩn)",
    description:
      "Tối ưu vị trí của 5 dấu thanh (sắc, huyền, hỏi, ngã, nặng) khi đặt trên các nguyên âm có nón như â, ă, ê, ô, ơ, ư, đảm bảo dấu không bị dính nét.",
    defaultText: "Thuyền buồm chở ngập nắng chiều vàng óng ả trên dòng sông Hương xứ Huế.",
    defaultActive: true,
    category: "localized",
  },
];

export function FontFeaturesInspector({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  // Active feature state dictionary
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const f of OPENTYPE_FEATURES) {
      initial[f.id] = f.defaultActive;
    }
    return initial;
  });

  // Custom text per feature
  const [texts, setTexts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const f of OPENTYPE_FEATURES) {
      initial[f.id] = f.defaultText;
    }
    return initial;
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleFeature = (id: string) => {
    setActiveStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateText = (id: string, newText: string) => {
    setTexts((prev) => ({ ...prev, [id]: newText }));
  };

  const copyCssSnippet = async (feature: FeatureConfig) => {
    const css = `/* Kích hoạt ${feature.name} trong CSS */\nfont-feature-settings: ${feature.cssProperty};`;
    try {
      await navigator.clipboard.writeText(css);
      setCopiedId(feature.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  };

  const resetAll = () => {
    const initialStates: Record<string, boolean> = {};
    const initialTexts: Record<string, string> = {};
    for (const f of OPENTYPE_FEATURES) {
      initialStates[f.id] = f.defaultActive;
      initialTexts[f.id] = f.defaultText;
    }
    setActiveStates(initialStates);
    setTexts(initialTexts);
  };

  return (
    <section id="features" className="shell mt-16 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-bold md:text-[20px]">
              Tính năng OpenType (Features)
            </h2>
            <span className="rounded bg-soft px-2 py-0.5 text-[12px] font-mono font-medium text-muted">
              {OPENTYPE_FEATURES.length} features
            </span>
          </div>
          <p className="micro mt-1">
            Khám phá các tính năng typographic nâng cao của {name} với công tắc bật/tắt trực quan thời gian thực
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetAll}
            className="chip text-[13px] text-muted hover:text-ink cursor-pointer"
          >
            Đặt lại mặc định
          </button>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="mt-8 space-y-6">
        {OPENTYPE_FEATURES.map((feature) => {
          const isActive = activeStates[feature.id] ?? false;
          const currentText = texts[feature.id] ?? feature.defaultText;
          const isMultiline = currentText.includes("\n");

          return (
            <div
              key={feature.id}
              className="border border-line bg-panel p-6 text-panel-ink transition-colors md:p-8"
            >
              {/* Feature Meta Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line/60 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-[16px] md:text-[17px]">
                      {feature.name}
                    </span>
                    <span className="rounded border border-line bg-soft px-2 py-0.5 font-mono text-[12px] font-bold text-cream">
                      {feature.tag}
                    </span>
                  </div>
                  <p className="max-w-2xl text-[14px] leading-relaxed text-panel-muted">
                    {feature.description}
                  </p>
                </div>

                {/* Controls: Switch ON/OFF & Copy CSS */}
                <div className="flex items-center gap-4">
                  {/* Interactive Toggle Switch without invalid label wrapper */}
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-[13px] font-medium text-panel-muted">
                      {isActive ? "BẬT" : "TẮT"}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isActive}
                      aria-label={`Bật tắt tính năng ${feature.name}`}
                      onClick={() => toggleFeature(feature.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                        isActive ? "bg-cream" : "bg-line"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-paper transition-transform ${
                          isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Copy CSS Button */}
                  <button
                    type="button"
                    onClick={() => copyCssSnippet(feature)}
                    className="flex items-center gap-1.5 rounded border border-line/60 px-2.5 py-1 text-[12px] font-medium text-panel-muted hover:border-line hover:text-panel-ink cursor-pointer"
                    title={`Sao chép CSS font-feature-settings: ${feature.cssProperty}`}
                  >
                    {copiedId === feature.id ? (
                      <>
                        <CheckIcon className="h-3.5 w-3.5 text-green-400" />
                        <span className="text-green-400">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-3.5 w-3.5" />
                        <span>Copy CSS</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Live Preview Display with OpenType Active/Inactive Comparison */}
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Column 1: Feature Preview (Live toggled) */}
                <div
                  className={`rounded border p-5 transition-colors ${
                    isActive
                      ? "border-cream/40 bg-soft"
                      : "border-line/40 bg-panel opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 text-[12px] text-panel-muted">
                    <span className="font-mono font-medium">
                      {isActive ? `KHI BẬT (${feature.tag})` : "HIỆN ĐANG TẮT"}
                    </span>
                    <span className="font-mono text-[11px] text-cream">
                      {isActive
                        ? `font-feature-settings: ${feature.cssProperty}`
                        : "font-feature-settings: normal"}
                    </span>
                  </div>

                  <div
                    className="mt-2 text-[26px] leading-[1.3] text-panel-ink md:text-[32px]"
                    style={{
                      fontFamily: `'${slug}', sans-serif`,
                      fontFeatureSettings: isActive ? feature.cssProperty : "normal",
                      whiteSpace: isMultiline ? "pre-line" : "normal",
                    }}
                  >
                    {currentText}
                  </div>
                </div>

                {/* Column 2: Standard / Reference Off */}
                <div className="rounded border border-line/40 bg-panel/60 p-5">
                  <div className="flex items-center justify-between pb-3 text-[12px] text-panel-muted">
                    <span className="font-mono font-medium">
                      THAM CHIẾU (Không áp dụng feature)
                    </span>
                    <span className="font-mono text-[11px] text-panel-muted">
                      font-feature-settings: normal
                    </span>
                  </div>

                  <div
                    className="mt-2 text-[26px] leading-[1.3] text-panel-ink opacity-70 md:text-[32px]"
                    style={{
                      fontFamily: `'${slug}', sans-serif`,
                      fontFeatureSettings: "normal",
                      whiteSpace: isMultiline ? "pre-line" : "normal",
                    }}
                  >
                    {currentText}
                  </div>
                </div>
              </div>

              {/* Editable Sample Text Box */}
              <div className="mt-4 flex items-center gap-3 border-t border-line/40 pt-3">
                <label
                  htmlFor={`input-${feature.id}`}
                  className="micro shrink-0 text-[12px]"
                >
                  Thử chữ riêng:
                </label>
                <input
                  id={`input-${feature.id}`}
                  type="text"
                  aria-label={`Thử chữ riêng cho tính năng ${feature.name}`}
                  value={currentText}
                  onChange={(e) => updateText(feature.id, e.target.value)}
                  placeholder="Gõ văn bản để kiểm tra..."
                  className="w-full bg-transparent text-[14px] text-panel-ink outline-none placeholder:text-muted/60"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
