"use client";

import { useMemo, useState } from "react";
import type { FontFamily } from "@/lib/types";
import { CheckIcon, CopyIcon } from "./icons";

type Props = {
  family: FontFamily;
};

type TokenType =
  | "comment"
  | "string"
  | "keyword"
  | "property"
  | "value"
  | "function"
  | "number"
  | "tag"
  | "attr"
  | "punctuation"
  | "plain";

interface Token {
  type: TokenType;
  text: string;
}

const TOKEN_CLASS: Record<TokenType, string> = {
  comment: "text-code-comment italic",
  string: "text-code-string",
  keyword: "text-code-keyword font-medium",
  property: "text-code-property font-medium",
  value: "text-code-value",
  function: "text-code-function",
  number: "text-code-number font-medium",
  tag: "text-code-tag font-medium",
  attr: "text-code-attr",
  punctuation: "text-code-punct",
  plain: "text-ink",
};

function tokenizeCss(line: string): Token[] {
  if (line.trim().startsWith("/*")) {
    return [{ type: "comment", text: line }];
  }
  const tokens: Token[] = [];
  let lastIndex = 0;
  const regex =
    /(\/\*[\s\S]*?\*\/)|('(?:\\'|[^'])*'|"(?:\\"|[^"])*")|(@font-face\b|\bbody\b|@theme\b)|(\b(?:font-family|font-weight|font-style|font-display|src)\b|--font-[\w-]+)|(\b(?:url|format)\b)|(\b(?:swap|normal|italic|serif|sans-serif|monospace|system-ui)\b)|(\b\d+\b)|([{}();:,])/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "plain",
        text: line.slice(lastIndex, match.index),
      });
    }
    let type: TokenType = "plain";
    if (match[1]) type = "comment";
    else if (match[2]) type = "string";
    else if (match[3]) type = "keyword";
    else if (match[4]) type = "property";
    else if (match[5]) type = "function";
    else if (match[6]) type = "value";
    else if (match[7]) type = "number";
    else if (match[8]) type = "punctuation";

    tokens.push({ type, text: match[0] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push({
      type: "plain",
      text: line.slice(lastIndex),
    });
  }

  return tokens.length > 0 ? tokens : [{ type: "plain", text: line || " " }];
}

function tokenizeHtml(line: string): Token[] {
  if (line.trim().startsWith("<!--")) {
    return [{ type: "comment", text: line }];
  }
  const tokens: Token[] = [];
  let lastIndex = 0;
  const regex =
    /(<!--[\s\S]*?-->)|("(?:\\"|[^"])*"|'(?:\\'|[^'])*')|(<\/?[a-zA-Z0-9-]+\b|\/>|>|<)|(\b(?:rel|href|as|type|crossorigin|style|font-family)\b)|([=])/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "plain",
        text: line.slice(lastIndex, match.index),
      });
    }
    let type: TokenType = "plain";
    if (match[1]) type = "comment";
    else if (match[2]) type = "string";
    else if (match[3]) type = "tag";
    else if (match[4]) type = "attr";
    else if (match[5]) type = "punctuation";

    tokens.push({ type, text: match[0] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push({
      type: "plain",
      text: line.slice(lastIndex),
    });
  }

  return tokens.length > 0 ? tokens : [{ type: "plain", text: line || " " }];
}

function tokenizeTailwind(line: string): Token[] {
  if (line.trim().startsWith("//") || line.trim().startsWith("/*")) {
    return [{ type: "comment", text: line }];
  }
  const tokens: Token[] = [];
  let lastIndex = 0;
  const regex =
    /(\/\/.*|\/\*[\s\S]*?\*\/)|('(?:\\'|[^'])*'|"(?:\\"|[^"])*")|(@theme\b|\b(?:module\.exports|module|exports)\b)|(\b(?:theme|extend|fontFamily)\b|--font-[\w-]+)|(\b(?:sans-serif|serif|monospace)\b)|([{}()[\\],;:=])/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "plain",
        text: line.slice(lastIndex, match.index),
      });
    }
    let type: TokenType = "plain";
    if (match[1]) type = "comment";
    else if (match[2]) type = "string";
    else if (match[3]) type = "keyword";
    else if (match[4]) type = "property";
    else if (match[5]) type = "value";
    else if (match[6]) type = "punctuation";

    tokens.push({ type, text: match[0] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push({
      type: "plain",
      text: line.slice(lastIndex),
    });
  }

  return tokens.length > 0 ? tokens : [{ type: "plain", text: line || " " }];
}

function tokenizeLine(line: string, tab: "css" | "html" | "tailwind"): Token[] {
  switch (tab) {
    case "css":
      return tokenizeCss(line);
    case "html":
      return tokenizeHtml(line);
    case "tailwind":
      return tokenizeTailwind(line);
  }
}

export function EmbedCode({ family }: Props) {
  const [tab, setTab] = useState<"css" | "html" | "tailwind">("css");
  const [copied, setCopied] = useState(false);

  const fallbackGeneric = family.categories.includes("serif")
    ? "Georgia, serif"
    : family.categories.includes("monospace") || family.categories.includes("mono")
    ? "monospace"
    : "sans-serif";

  const regularStyle =
    family.styles.find((s) => !s.italic && s.weight === 400) ?? family.styles[0];

  const cssSnippet = useMemo(
    () =>
      [
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
        `  font-family: '${family.name}', ${fallbackGeneric};`,
        `}`,
      ].join("\n"),
    [family, regularStyle, fallbackGeneric]
  );

  const htmlSnippet = useMemo(
    () =>
      [
        `<!-- 1. Preload font WOFF2 để trình duyệt ưu tiên tải sớm -->`,
        `<link`,
        `  rel="preload"`,
        `  href="/fonts/${family.slug}/${regularStyle.file}"`,
        `  as="font"`,
        `  type="font/woff2"`,
        `  crossorigin="anonymous"`,
        `/>`,
        ``,
        `<!-- 2. Khai báo @font-face trong thẻ <style> -->`,
        `<style>`,
        `  @font-face {`,
        `    font-family: '${family.name}';`,
        `    src: url('/fonts/${family.slug}/${regularStyle.file}') format('woff2');`,
        `    font-weight: ${regularStyle.variable && regularStyle.weightRange ? `${regularStyle.weightRange[0]} ${regularStyle.weightRange[1]}` : regularStyle.weight};`,
        `    font-style: ${regularStyle.italic ? "italic" : "normal"};`,
        `    font-display: swap;`,
        `  }`,
        `  body {`,
        `    font-family: '${family.name}', ${fallbackGeneric};`,
        `  }`,
        `</style>`,
      ].join("\n"),
    [family, regularStyle, fallbackGeneric]
  );

  const tailwindSnippet = useMemo(
    () =>
      [
        `/* Cách 1: Tailwind CSS v4 (Thêm vào globals.css) */`,
        `@theme {`,
        `  --font-${family.slug}: '${family.name}', ${fallbackGeneric};`,
        `}`,
        ``,
        `/* Cách 2: Tailwind CSS v3 (tailwind.config.js) */`,
        `module.exports = {`,
        `  theme: {`,
        `    extend: {`,
        `      fontFamily: {`,
        `        '${family.slug}': ['"${family.name}"', '${fallbackGeneric.split(",")[0].trim()}'],`,
        `      },`,
        `    },`,
        `  },`,
        `};`,
      ].join("\n"),
    [family, fallbackGeneric]
  );

  const currentSnippet =
    tab === "css" ? cssSnippet : tab === "html" ? htmlSnippet : tailwindSnippet;

  const lines = useMemo(() => currentSnippet.split("\n"), [currentSnippet]);

  const fileInfo = useMemo(() => {
    switch (tab) {
      case "css":
        return { name: "fonts.css", lang: "CSS" };
      case "html":
        return { name: "index.html", lang: "HTML" };
      case "tailwind":
        return { name: "tailwind.config.js", lang: "JavaScript" };
    }
  }, [tab]);

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
      {/* Header bar */}
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
              className="chip font-medium cursor-pointer"
              data-active={tab === "css" || undefined}
            >
              CSS @font-face
            </button>
            <button
              type="button"
              onClick={() => setTab("html")}
              className="chip font-medium cursor-pointer"
              data-active={tab === "html" || undefined}
            >
              HTML &lt;link&gt;
            </button>
            <button
              type="button"
              onClick={() => setTab("tailwind")}
              className="chip font-medium cursor-pointer"
              data-active={tab === "tailwind" || undefined}
            >
              Tailwind CSS
            </button>
          </div>

          <button
            type="button"
            onClick={copySnippet}
            className="btn ml-2 flex items-center gap-1.5 py-1.5 text-[13px] cursor-pointer"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>{copied ? "Đã copy" : "Copy mã"}</span>
          </button>
        </div>
      </div>

      {/* Code window with line numbers and syntax highlighting */}
      <div className="mt-6 overflow-hidden rounded-lg border border-code-border bg-code-bg font-mono shadow-sm">
        {/* Title bar */}
        <div className="flex h-10 items-center justify-between border-b border-code-border bg-code-header px-4 text-[12px] select-none">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[13px] font-medium text-muted">{fileInfo.name}</span>
          <span className="rounded bg-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
            {fileInfo.lang}
          </span>
        </div>

        {/* Code body */}
        <pre className="m-0 overflow-x-auto p-4 text-[13px] leading-[22px] font-mono scrollbar-thin">
          <code className="block">
            {lines.map((line, i) => {
              const tokens = tokenizeLine(line, tab);
              return (
                <div key={i} className="flex items-start hover:bg-white/[0.02]">
                  <span
                    className="w-10 shrink-0 select-none pr-4 text-right font-mono text-[12px] text-code-line-num"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 whitespace-pre">
                    {tokens.map((token, j) => (
                      <span key={j} className={TOKEN_CLASS[token.type]}>
                        {token.text}
                      </span>
                    ))}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </section>
  );
}
