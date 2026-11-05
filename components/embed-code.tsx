"use client";

import { useState } from "react";
import type { FontFamily } from "@/lib/types";
import { CheckIcon, CopyIcon } from "./icons";

type Props = {
  family: FontFamily;
};

export function EmbedCode({ family }: Props) {
  const [tab, setTab] = useState<"css" | "html" | "tailwind">("css");
  const [copied, setCopied] = useState(false);

  const regularStyle =
    family.styles.find((s) => !s.italic && s.weight === 400) ?? family.styles[0];

  const cssSnippet = [
    `/* Nhúng ${family.name} bằng CSS */`,
    `@font-face {`,
    `  font-family: '${family.name}';`,
    `  src: url('/fonts/${family.slug}/${regularStyle.file}') format('woff2');`,
    `  font-weight: ${regularStyle.variable && regularStyle.weightRange ? `${regularStyle.weightRange[0]} ${regularStyle.weightRange[1]}` : regularStyle.weight};`,
    `  font-style: ${regularStyle.italic ? "italic" : "normal"};`,
    `  font-display: swap;`,
    `}`,
    ``,
    `body {`,
    `  font-family: '${family.name}', system-ui, sans-serif;`,
    `}`,
  ].join("\n");

  const htmlSnippet = [
    `<!-- Nhúng qua thẻ link preload trong <head> -->`,
    `<link`,
    `  rel="preload"`,
    `  href="/fonts/${family.slug}/${regularStyle.file}"`,
    `  as="font"`,
    `  type="font/woff2"`,
    `  crossorigin="anonymous"`,
    `/>`,
  ].join("\n");

  const tailwindSnippet = [
    `// tailwind.config.js hoặc @theme inline`,
    `module.exports = {`,
    `  theme: {`,
    `    extend: {`,
    `      fontFamily: {`,
    `        '${family.slug}': ['"${family.name}"', 'sans-serif'],`,
    `      },`,
    `    },`,
    `  },`,
    `};`,
  ].join("\n");

  const currentSnippet =
    tab === "css" ? cssSnippet : tab === "html" ? htmlSnippet : tailwindSnippet;

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(currentSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="embed" className="shell mt-16 scroll-mt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-[14px] font-bold">Mã nhúng cho website</h2>
          <p className="micro mt-1">
            Dùng trực tiếp định dạng WOFF2 tối ưu dung lượng cao
          </p>
        </div>

        <div className="flex items-center gap-4 text-[14px]">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setTab("css")}
              className="chip font-medium"
              data-active={tab === "css" || undefined}
            >
              CSS @font-face
            </button>
            <button
              type="button"
              onClick={() => setTab("html")}
              className="chip font-medium"
              data-active={tab === "html" || undefined}
            >
              HTML &lt;link&gt;
            </button>
            <button
              type="button"
              onClick={() => setTab("tailwind")}
              className="chip font-medium"
              data-active={tab === "tailwind" || undefined}
            >
              Tailwind CSS
            </button>
          </div>

          <button
            type="button"
            onClick={copySnippet}
            className="btn ml-2 flex items-center gap-1.5 py-1.5 text-[13px]"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>{copied ? "Đã copy" : "Copy code"}</span>
          </button>
        </div>
      </div>

      <pre className="mt-4 overflow-x-auto border border-line bg-soft p-5 text-[14px] leading-[20px] font-mono text-ink">
        <code>{currentSnippet}</code>
      </pre>
    </section>
  );
}
