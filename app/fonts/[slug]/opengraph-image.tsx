import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getFamily } from "@/lib/catalog";

export const alt = "Specimen font tiếng Việt trên fontvh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const family = getFamily(slug);
  const name = family?.name ?? "fontvh";

  let fontData: ArrayBuffer | undefined;
  if (family) {
    const candidates = [path.join(process.cwd(), "assets", "og", `${slug}.ttf`)];
    if (family.axes.length === 0) {
      const dir = path.join(process.cwd(), "fonts", slug);
      try {
        for (const entry of fs.readdirSync(dir)) {
          if (/\.(ttf|otf)$/i.test(entry)) candidates.push(path.join(dir, entry));
        }
      } catch {
        /* family chưa có file gốc */
      }
    }

    for (const candidate of candidates) {
      if (!fs.existsSync(/*turbopackIgnore: true*/ candidate)) continue;
      const buffer = fs.readFileSync(/*turbopackIgnore: true*/ candidate);
      fontData = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      ) as ArrayBuffer;
      break;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#101010",
          color: "#ffffff",
          padding: "48px 56px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#c0c0c0",
          }}
        >
          fontvh · thư viện font Việt
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 190,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            fontFamily: fontData ? "Specimen" : "sans-serif",
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#c0c0c0",
          }}
        >
          <span>Chữ Việt · dấu đầy đủ · miễn phí</span>
          <span>{family?.designer ?? ""}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "Specimen", data: fontData, weight: 400, style: "normal" }]
        : undefined,
    }
  );
}
