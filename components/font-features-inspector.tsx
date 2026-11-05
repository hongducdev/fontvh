"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

interface FeatureConfig {
  id: string;
  tag: string;
  name: string;
  description: string;
  cssProperty: string;
  inactiveCssProperty: string;
  defaultActive: boolean;
  defaultText: string;
}

const OPENTYPE_FEATURES: FeatureConfig[] = [
  {
    id: "liga",
    tag: "liga",
    name: "Standard Ligatures (Chữ ghép tiêu chuẩn)",
    description:
      "Tự động kết hợp các cặp ký tự liền kề như fi, fl, ffi, ff, tt để loại bỏ các điểm va chạm hình học giữa nét cong của 'f' và dấu chấm của 'i'.",
    cssProperty: '"liga" 1',
    inactiveCssProperty: '"liga" 0, "clig" 0',
    defaultActive: true,
    defaultText: "Office first flight affiliate difficult shuffle craft Staff five",
  },
  {
    id: "dlig",
    tag: "dlig",
    name: "Discretionary Ligatures (Chữ ghép mỹ thuật)",
    description:
      "Các liên kết chữ mang tính trang trí cao hơn như st, ct, sp, ch, mang lại phong cách cổ điển thanh lịch cho tiêu đề ấn phẩm.",
    cssProperty: '"dlig" 1',
    inactiveCssProperty: '"dlig" 0',
    defaultActive: false,
    defaultText: "Star structure special contact aesthetic abstract posture",
  },
  {
    id: "tnum",
    tag: "tnum",
    name: "Tabular Figures (Chữ số đồng rộng)",
    description:
      "Các chữ số có cùng một bề rộng (monospaced), giúp các cột số liệu, bảng giá, báo cáo tài chính thẳng hàng một cách hoàn hảo theo chiều dọc.",
    cssProperty: '"tnum" 1',
    inactiveCssProperty: '"tnum" 0, "pnum" 1',
    defaultActive: false,
    defaultText: "11,111.00 ₫\n88,888.00 ₫\n19,203.50 ₫\n94,765.25 ₫",
  },
  {
    id: "pnum",
    tag: "pnum",
    name: "Proportional Figures (Chữ số tỷ lệ)",
    description:
      "Chữ số có bề rộng tỷ lệ tự nhiên với hình dáng con chữ (số 1 hẹp hơn số 8), tối ưu nhịp điệu khi đọc trong các đoạn văn bản dài.",
    cssProperty: '"pnum" 1',
    inactiveCssProperty: '"pnum" 0, "tnum" 1',
    defaultActive: true,
    defaultText: "Năm 1995, có 1.250 dự án trị giá 8.840 tỷ đồng được cấp phép.",
  },
  {
    id: "onum",
    tag: "onum",
    name: "Oldstyle Figures (Chữ số cổ điển / Nhảy dòng)",
    description:
      "Chữ số có các nét nhô lên (ascender) và thụt xuống (descender) hài hòa tự nhiên với chiều cao x-height của chữ cái thường.",
    cssProperty: '"onum" 1',
    inactiveCssProperty: '"onum" 0, "lnum" 1',
    defaultActive: false,
    defaultText: "Xuất bản lần thứ 3 vào năm 1789, tái bản năm 1845 và 1923.",
  },
  {
    id: "lnum",
    tag: "lnum",
    name: "Lining Figures (Chữ số chiều cao chữ hoa)",
    description:
      "Chữ số có cùng chiều cao với chữ in hoa, đứng đều trên baseline, phù hợp khi đặt cùng các từ in hoa hoặc làm tiêu đề.",
    cssProperty: '"lnum" 1',
    inactiveCssProperty: '"lnum" 0',
    defaultActive: true,
    defaultText: "ISO 9001:2015 · MÃ ĐƠN HÀNG #89201 · PHÒNG 402B",
  },
  {
    id: "frac",
    tag: "frac",
    name: "Fractions (Phân số tự động)",
    description:
      "Tự động chuyển các cụm số và dấu gạch chéo thành phân số chuẩn typo thanh mảnh với tử số và mẫu số thu nhỏ.",
    cssProperty: '"frac" 1',
    inactiveCssProperty: '"frac" 0',
    defaultActive: false,
    defaultText: "1/2 1/4 3/4 1/8 3/8 5/8 7/8 2/3 1/3",
  },
  {
    id: "ordn",
    tag: "ordn",
    name: "Ordinals (Số thứ tự thu nhỏ)",
    description:
      "Thu nhỏ các ký tự hậu tố chỉ số thứ tự (như 1st, 2nd, 3rd, 1er, 1o, 1a) lên góc trên bên phải.",
    cssProperty: '"ordn" 1',
    inactiveCssProperty: '"ordn" 0',
    defaultActive: false,
    defaultText: "1st place · 2nd edition · 3rd volume · No 1º premio · 1er",
  },
  {
    id: "smcp",
    tag: "smcp",
    name: "Small Capitals (Chữ hoa nhỏ / Small Caps)",
    description:
      "Chuyển đổi chữ cái thường thành chữ in hoa có chiều cao bằng x-height, được thiết kế đồng bộ về độ dày và nét vẽ thay vì co nhỏ chữ hoa thông thường.",
    cssProperty: '"smcp" 1',
    inactiveCssProperty: '"smcp" 0',
    defaultActive: false,
    defaultText: "Chữ Hoa Nhỏ Tạo Sự Tinh Tế Cho Các Đoạn Trích Dẫn Và Tiêu Đề Phụ.",
  },
  {
    id: "c2sc",
    tag: "c2sc",
    name: "Capitals to Small Caps (Hoa sang Hoa nhỏ)",
    description:
      "Chuyển đổi toàn bộ chữ cái in hoa chuẩn thành chữ hoa nhỏ (Small Caps), tạo sự đồng nhất tuyệt đối cho toàn bộ câu.",
    cssProperty: '"c2sc" 1',
    inactiveCssProperty: '"c2sc" 0',
    defaultActive: false,
    defaultText: "VIỆT NAM QUỐC NGỮ NGHỆ THUẬT TYPOGRAPHY HIỆN ĐẠI",
  },
  {
    id: "zero",
    tag: "zero",
    name: "Slashed Zero (Số 0 có gạch chéo)",
    description:
      "Thêm nét gạch chéo bên trong số 0 để phân biệt tuyệt đối với chữ cái O hoa, rất quan trọng trong code, tài chính và lập trình.",
    cssProperty: '"zero" 1',
    inactiveCssProperty: '"zero" 0',
    defaultActive: false,
    defaultText: "Mã 0O0 · Port 8080 · IP 192.168.0.1 · Số tài khoản: 00710009280",
  },
  {
    id: "case",
    tag: "case",
    name: "Case-Sensitive Forms (Dấu câu theo chữ hoa)",
    description:
      "Tự động nâng các dấu câu như ngoặc đơn (), ngoặc vuông [], gạch ngang — và dấu hai chấm : lên giữa chiều cao chữ hoa khi câu toàn chữ in hoa.",
    cssProperty: '"case" 1',
    inactiveCssProperty: '"case" 0',
    defaultActive: false,
    defaultText: "[THÔNG BÁO] (HÀ NỘI — SÀI GÒN) {2026}: PHIÊN BẢN MỚI",
  },
];

interface Props {
  slug: string;
  name: string;
}

export function FontFeaturesInspector({ slug, name }: Props) {
  // State for toggle switch per feature
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
    <section id="features" className="shell py-12 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-6">
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
                    <span className="rounded border border-line bg-soft px-2 py-0.5 font-mono text-[12px] font-bold text-ink">
                      {feature.tag}
                    </span>
                  </div>
                  <p className="max-w-2xl text-[14px] leading-relaxed text-panel-muted">
                    {feature.description}
                  </p>
                </div>

                {/* Controls: Switch ON/OFF & Copy CSS */}
                <div className="flex items-center gap-4">
                  {/* Interactive Toggle Switch */}
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
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:ring-1 focus-visible:ring-ink cursor-pointer ${
                        isActive ? "bg-solid-bg" : "bg-line"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                          isActive
                            ? "translate-x-6 bg-solid-ink"
                            : "translate-x-1 bg-paper"
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
                        <CheckIcon className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-green-500 font-medium">Đã chép</span>
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
                      ? "border-line bg-soft"
                      : "border-line/40 bg-panel opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 text-[12px] text-panel-muted">
                    <span className="font-mono font-medium">
                      {isActive ? `KHI BẬT (${feature.tag})` : "HIỆN ĐANG TẮT"}
                    </span>
                    <span className="font-mono text-[11px] text-ink">
                      {isActive
                        ? `font-feature-settings: ${feature.cssProperty}`
                        : `font-feature-settings: ${feature.inactiveCssProperty}`}
                    </span>
                  </div>

                  <div
                    className="mt-2 text-[26px] leading-[1.3] text-panel-ink md:text-[32px]"
                    style={{
                      fontFamily: `'${slug}', sans-serif`,
                      fontFeatureSettings: isActive ? feature.cssProperty : feature.inactiveCssProperty,
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
                      THAM CHIẾU (Tắt tính năng)
                    </span>
                    <span className="font-mono text-[11px] text-panel-muted">
                      font-feature-settings: {feature.inactiveCssProperty}
                    </span>
                  </div>

                  <div
                    className="mt-2 text-[26px] leading-[1.3] text-panel-ink opacity-70 md:text-[32px]"
                    style={{
                      fontFamily: `'${slug}', sans-serif`,
                      fontFeatureSettings: feature.inactiveCssProperty,
                      whiteSpace: isMultiline ? "pre-line" : "normal",
                    }}
                  >
                    {currentText}
                  </div>
                </div>
              </div>

              {/* Editable Sample Text Box (Stacked vertically) */}
              <div className="mt-5 flex flex-col gap-2 border-t border-line/40 pt-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`input-${feature.id}`}
                    className="micro text-[12px] font-medium text-panel-muted"
                  >
                    Thử chữ riêng:
                  </label>
                  {currentText !== feature.defaultText && (
                    <button
                      type="button"
                      onClick={() => updateText(feature.id, feature.defaultText)}
                      className="text-[12px] text-muted hover:text-ink cursor-pointer"
                    >
                      Khôi phục câu mẫu mặc định
                    </button>
                  )}
                </div>

                {isMultiline ? (
                  <textarea
                    id={`input-${feature.id}`}
                    rows={3}
                    aria-label={`Thử chữ riêng cho tính năng ${feature.name}`}
                    value={currentText}
                    onChange={(e) => updateText(feature.id, e.target.value)}
                    className="w-full resize-y rounded border border-line/60 bg-paper/40 px-3.5 py-2 text-[14px] text-panel-ink outline-none transition-colors focus:border-ink placeholder:text-muted/60"
                  />
                ) : (
                  <input
                    id={`input-${feature.id}`}
                    type="text"
                    aria-label={`Thử chữ riêng cho tính năng ${feature.name}`}
                    value={currentText}
                    onChange={(e) => updateText(feature.id, e.target.value)}
                    placeholder="Gõ văn bản để kiểm tra..."
                    className="w-full rounded border border-line/60 bg-paper/40 px-3.5 py-2 text-[14px] text-panel-ink outline-none transition-colors focus:border-ink placeholder:text-muted/60"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
