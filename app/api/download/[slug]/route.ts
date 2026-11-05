import fs from "node:fs";
import path from "node:path";
import { zipSync, strToU8 } from "fflate";
import { getFamily } from "@/lib/catalog";

export const runtime = "nodejs";

const ACCEPTED = /\.(ttf|otf|woff2|txt|md)$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const family = getFamily(slug);
  if (!family) {
    return new Response("Không tìm thấy font", { status: 404 });
  }

  const files: Record<string, Uint8Array> = {};
  const sourceDir = path.join(process.cwd(), "fonts", slug);

  for (const name of fs.readdirSync(sourceDir)) {
    if (!ACCEPTED.test(name)) continue;
    files[`${slug}/${name}`] = new Uint8Array(
      fs.readFileSync(path.join(sourceDir, name))
    );
  }

  const webDir = path.join(process.cwd(), "public", "fonts", slug);
  if (fs.existsSync(webDir)) {
    for (const name of fs.readdirSync(webDir)) {
      if (!name.endsWith(".woff2")) continue;
      files[`${slug}/woff2/${name}`] = new Uint8Array(
        fs.readFileSync(path.join(webDir, name))
      );
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
    `Nguồn: fontvh`,
  ]
    .filter(Boolean)
    .join("\n");

  files[`${slug}/README.txt`] = strToU8(readme);

  const archive = zipSync(files, { level: 6 });

  return new Response(new Uint8Array(archive), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${slug}.zip"`,
      "Content-Length": String(archive.length),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
