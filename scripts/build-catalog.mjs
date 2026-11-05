import fs from "node:fs";
import path from "node:path";
import * as fontkit from "fontkit";
import { compress } from "wawoff2";

const ROOT = process.cwd();
const FONTS_DIR = path.join(ROOT, "fonts");
const PUBLIC_DIR = path.join(ROOT, "public", "fonts");
const DATA_DIR = path.join(ROOT, "data");
const FONT_EXT = new Set([".ttf", ".otf", ".woff2"]);
const VI_CHARS =
  "àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ" +
  "ÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ";
const LATIN_PROBE = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const WEIGHT_NAMES = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
};

function styleName(font, weight, italic) {
  const subfamily = (font.subfamilyName ?? "").trim();
  if (subfamily && subfamily.toLowerCase() !== "regular") return subfamily;
  const base = WEIGHT_NAMES[weight] ?? `Weight ${weight}`;
  return italic ? `${base} Italic` : base;
}

const LICENSE_NAMES = {
  ofl: "SIL Open Font License 1.1",
  "cc0": "CC0 1.0 Universal",
  "commercial-free": "Miễn phí cho mọi mục đích",
  proprietary: "Giấy phép riêng của nhà thiết kế",
};

const titleCase = (slug) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

function loadMeta(dir) {
  const file = path.join(dir, "meta.json");
  if (!fs.existsSync(file)) return {};
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    console.warn(`[catalog] lỗi đọc meta.json ở ${dir}: ${error.message}`);
    return {};
  }
}

function openFont(file) {
  try {
    return fontkit.openSync(file);
  } catch (error) {
    console.warn(`[catalog] bỏ qua ${file}: ${error.message}`);
    return null;
  }
}

function familyNameOf(font, fallback) {
  const records = font["name"]?.records ?? {};
  return (
    records["16"]?.en ||
    records["21"]?.en ||
    records.familyName?.en ||
    font.familyName ||
    fallback
  );
}

function isItalic(font) {
  return (
    Boolean(font["head"]?.macStyle?.italic) ||
    (font["post"]?.italicAngle ?? 0) !== 0 ||
    /italic|oblique/i.test(font.subfamilyName ?? "")
  );
}

function weightOf(font) {
  const value = Number(font["OS/2"]?.usWeightClass ?? 400);
  return Number.isFinite(value) ? value : 400;
}

function coverage(font) {
  const set = new Set(font.characterSet);
  const has = (chars) =>
    [...chars].every((ch) => set.has(ch.codePointAt(0)));
  return {
    vietnamese: has(VI_CHARS),
    latin: has(LATIN_PROBE),
    dong: set.has(0x20ab),
  };
}

async function toWoff2(sourceBuffer, ext) {
  if (ext === ".woff2") return sourceBuffer;
  return Buffer.from(await compress(sourceBuffer));
}

async function buildFamily(dir) {
  const slug = path.basename(dir);
  const meta = loadMeta(dir);
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && FONT_EXT.has(path.extname(e.name).toLowerCase()))
    .map((e) => path.join(dir, e.name))
    .sort();

  if (entries.length === 0) return null;

  fs.mkdirSync(path.join(PUBLIC_DIR, slug), { recursive: true });

  const styles = [];
  const axes = [];
  let displayName = meta.name || titleCase(slug);
  let vietnamese = false;
  let latin = false;
  let dong = false;
  let glyphs = 0;
  let size = 0;
  let metrics = null;

  for (const file of entries) {
    const font = openFont(file);
    if (!font) continue;

    const ext = path.extname(file).toLowerCase();
    const buffer = fs.readFileSync(file);
    size += buffer.byteLength;
    glyphs = Math.max(glyphs, font.numGlyphs);
    displayName = meta.name || familyNameOf(font, displayName);

    if (!metrics && font) {
      const upm = Number(font.unitsPerEm) || 1000;
      metrics = {
        unitsPerEm: upm,
        ascent: Number(font.ascent) || upm,
        descent: Number(font.descent) || -200,
        capHeight: Number(font.capHeight) || Math.round(upm * 0.7),
        xHeight: Number(font.xHeight) || Math.round(upm * 0.5),
        lineGap: Number(font.lineGap) || 0,
      };
    }

    const cov = coverage(font);
    vietnamese = vietnamese || cov.vietnamese;
    latin = latin || cov.latin;
    dong = dong || cov.dong;

    const variation = font.variationAxes ?? null;
    const variable = Boolean(variation && Object.keys(variation).length > 0);
    const italic = isItalic(font);

    if (variable) {
      const base = italic ? "variable-italic" : "variable";
      const outName = `${base}.woff2`;
      fs.writeFileSync(path.join(PUBLIC_DIR, slug, outName), await toWoff2(buffer, ext));

      for (const [tag, axis] of Object.entries(variation)) {
        if (!axes.some((a) => a.tag === tag)) {
          axes.push({
            tag,
            min: Number(axis.min),
            max: Number(axis.max),
            default: Number(axis.default),
          });
        }
      }

      const wght = variation.wght;
      const named = Object.entries(font.namedVariations ?? {})
        .map(([name, values]) => ({ name, values }))
        .filter(({ values }) => typeof values.wght === "number")
        .sort((a, b) => a.values.wght - b.values.wght);

      const instances =
        named.length > 0
          ? named
          : [{ name: "Regular", values: { wght: wght?.default ?? 400 } }];

      for (const { name, values } of instances) {
        const weight = Number(values.wght);
        if (styles.some((s) => s.weight === weight && s.italic === italic)) continue;
        styles.push({
          key: `${weight}${italic ? "-italic" : ""}`,
          name,
          weight,
          italic,
          file: outName,
          variable: true,
          weightRange: wght ? [Number(wght.min), Number(wght.max)] : undefined,
        });
      }
      continue;
    }

    const weight = weightOf(font);
    const outName = `${weight}${italic ? "-italic" : ""}.woff2`;
    fs.writeFileSync(path.join(PUBLIC_DIR, slug, outName), await toWoff2(buffer, ext));
    styles.push({
      key: `${weight}${italic ? "-italic" : ""}`,
      name: styleName(font, weight, italic),
      weight,
      italic,
      file: outName,
      variable: false,
    });
  }

  if (styles.length === 0) return null;

  styles.sort((a, b) => a.weight - b.weight || Number(a.italic) - Number(b.italic));

  const plain = styles.filter((s) => !s.italic);
  const previewStyle =
    plain.find((s) => s.weight === 400) || plain[0] || styles[0];

  const licenseId = meta.license || (fs.existsSync(path.join(dir, "OFL.txt")) ? "ofl" : "commercial-free");
  let licenseFile = meta.licenseFile ?? null;
  if (!licenseFile) {
    if (fs.existsSync(path.join(dir, "OFL.txt"))) {
      licenseFile = "OFL.txt";
    } else if (fs.existsSync(path.join(dir, "LICENSE.txt"))) {
      licenseFile = "LICENSE.txt";
    }
  }

  return {
    slug,
    name: displayName,
    designer: meta.designer || "Chưa rõ",
    foundry: meta.foundry || "",
    description: meta.description || "",
    categories: meta.categories?.length ? meta.categories : ["sans"],
    license: {
      id: licenseId,
      name: LICENSE_NAMES[licenseId] || LICENSE_NAMES["commercial-free"],
      file: licenseFile,
      url: meta.licenseUrl || (licenseId === "ofl" ? "https://openfontlicense.org" : ""),
    },
    styles,
    axes,
    metrics: metrics || {
      unitsPerEm: 1000,
      ascent: 1000,
      descent: -200,
      capHeight: 700,
      xHeight: 500,
      lineGap: 0,
    },
    languages: [vietnamese ? "vi" : null, latin ? "latin" : null].filter(Boolean),
    vietnamese,
    dong,
    glyphs,
    size,
    releasedAt: meta.releasedAt || null,
    sourceUrl: meta.sourceUrl || null,
    preview: {
      family: slug,
      weight: previewStyle.weight,
      style: previewStyle.italic ? "italic" : "normal",
    },
  };
}

fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
fs.mkdirSync(PUBLIC_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

const families = [];
for (const entry of fs.readdirSync(FONTS_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
  const family = await buildFamily(path.join(FONTS_DIR, entry.name));
  if (family) families.push(family);
}

families.sort((a, b) => a.name.localeCompare(b.name, "vi"));

const catalog = {
  generatedAt: new Date().toISOString(),
  families,
  stats: {
    families: families.length,
    styles: families.reduce((sum, f) => sum + f.styles.length, 0),
  },
};

fs.writeFileSync(path.join(DATA_DIR, "catalog.json"), JSON.stringify(catalog, null, 2));

const seenFaces = new Set();
const faces = [];
for (const family of families) {
  for (const style of family.styles) {
    const key = `${family.slug}:${style.file}`;
    if (seenFaces.has(key)) continue;
    seenFaces.add(key);
    const weight =
      style.variable && style.weightRange
        ? `${style.weightRange[0]} ${style.weightRange[1]}`
        : style.weight;
    faces.push(
      `@font-face{font-family:'${family.slug}';src:url('/fonts/${family.slug}/${style.file}') format('woff2');font-weight:${weight};font-style:${style.italic ? "italic" : "normal"};font-display:swap;}`
    );
  }
}
fs.writeFileSync(path.join(ROOT, "app", "font-faces.css"), faces.join("\n") + "\n");

const missingVi = families.filter((f) => !f.vietnamese).map((f) => f.slug);
console.log(
  `[catalog] ${catalog.stats.families} family · ${catalog.stats.styles} style → data/catalog.json`
);
if (missingVi.length) console.warn(`[catalog] thiếu dấu tiếng Việt: ${missingVi.join(", ")}`);
