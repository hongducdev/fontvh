import fs from "node:fs";
import path from "node:path";
import { zip, strToU8 } from "fflate";
import { getFamily } from "@/lib/catalog";

export const runtime = "nodejs";

const ACCEPTED = /\.(ttf|otf|woff2|txt|md)$/i;
const SAFE_SLUG = /^[a-z0-9-]+$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!SAFE_SLUG.test(slug)) {
    return new Response("Mã phông chữ không hợp lệ", { status: 400 });
  }

  const family = getFamily(slug);
  if (!family) {
    return new Response("Không tìm thấy font", { status: 404 });
  }

  const files: Record<string, Uint8Array> = {};
  const sourceDir = path.join(process.cwd(), "fonts", slug);

  if (fs.existsSync(sourceDir)) {
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !ACCEPTED.test(entry.name)) continue;
      try {
        files[`${slug}/${entry.name}`] = new Uint8Array(
          fs.readFileSync(path.join(sourceDir, entry.name))
        );
      } catch {
        // Skip unreadable file
      }
    }
  }

  const webDir = path.join(process.cwd(), "public", "fonts", slug);
  if (fs.existsSync(webDir)) {
    const webEntries = fs.readdirSync(webDir, { withFileTypes: true });
    for (const entry of webEntries) {
      if (!entry.isFile() || !entry.name.endsWith(".woff2")) continue;
      try {
        files[`${slug}/woff2/${entry.name}`] = new Uint8Array(
          fs.readFileSync(path.join(webDir, entry.name))
        );
      } catch {
        // Skip
      }
    }
  }

  const readme = [
    `${family.name}`,
    `${family.designer}${family.foundry ? ` · ${family.foundry}` : ""}`,
    ``,
    `Giấy phép: ${family.license.name}`,
    family.license.file ? `File giấy phép: ${family.license.file}` : "",
    family.license.url ? `Tham khảo: ${family.license.url}` : "",
    ``,
    `woff2/ dùng cho web, bản gốc dùng cho thiết kế và in ấn.`,
    `Nguồn: fontvh (https://fontvh.com)`,
  ]
    .filter(Boolean)
    .join("\n");

  files[`${slug}/README.txt`] = strToU8(readme);

  try {
    const archive = await new Promise<Uint8Array>((resolve, reject) => {
      zip(files, { level: 6 }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    return new Response(new Uint8Array(archive), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${slug}.zip"`,
        "Content-Length": String(archive.length),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response("Lỗi đóng gói file zip", { status: 500 });
  }
}
