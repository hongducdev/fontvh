import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

describe("Catalog Integrity & Structure Tests", () => {
  const catalogPath = path.join(rootDir, "data", "catalog.json");

  test("data/catalog.json exists and is valid JSON", () => {
    assert.equal(fs.existsSync(catalogPath), true, "data/catalog.json must exist");
    const content = fs.readFileSync(catalogPath, "utf-8");
    const json = JSON.parse(content);
    assert.ok(json, "Parsed catalog cannot be null or undefined");
    assert.ok(Array.isArray(json.families), "catalog.families must be an array");
    assert.ok(json.families.length > 0, "catalog must contain at least 1 font family");
  });

  test("Every font family has required fields and valid schema", () => {
    const raw = fs.readFileSync(catalogPath, "utf-8");
    const catalog = JSON.parse(raw);

    for (const family of catalog.families) {
      assert.ok(family.slug && typeof family.slug === "string", `Family must have string slug: ${JSON.stringify(family)}`);
      assert.ok(family.name && typeof family.name === "string", `Family must have string name: ${family.slug}`);
      assert.ok(typeof family.designer === "string", `Family must have designer string: ${family.slug}`);
      assert.ok(family.license && family.license.id && family.license.name, `Family license invalid: ${family.slug}`);
      assert.ok(Array.isArray(family.categories) && family.categories.length > 0, `Family categories invalid: ${family.slug}`);
      assert.ok(Array.isArray(family.styles) && family.styles.length > 0, `Family styles must not be empty: ${family.slug}`);
      assert.equal(typeof family.glyphs, "number", `Family glyphs must be number: ${family.slug}`);
      assert.ok(family.glyphs > 0, `Family glyphs must be > 0: ${family.slug}`);
      assert.equal(typeof family.vietnamese, "boolean", `vietnamese must be boolean: ${family.slug}`);
    }
  });

  test("Every font style has valid weight, format, and physical font file", () => {
    const raw = fs.readFileSync(catalogPath, "utf-8");
    const catalog = JSON.parse(raw);

    for (const family of catalog.families) {
      for (const style of family.styles) {
        assert.ok(style.weight >= 100 && style.weight <= 950, `Style weight out of bounds in ${family.slug}: ${style.weight}`);
        assert.equal(typeof style.italic, "boolean", `Style italic must be boolean in ${family.slug}`);
        assert.ok(style.file, `Style must define file path: ${family.slug} / ${style.name}`);

        // Font files are served from public/fonts/<family.slug>/<style.file>
        const filePath = path.join(rootDir, "public", "fonts", family.slug, style.file);
        assert.equal(
          fs.existsSync(filePath),
          true,
          `Font file referenced does not exist on disk: ${filePath}`
        );
      }
    }
  });

  test("Every font family has valid metrics and diacritic headroom", () => {
    const raw = fs.readFileSync(catalogPath, "utf-8");
    const catalog = JSON.parse(raw);

    for (const family of catalog.families) {
      assert.ok(family.metrics, `Family ${family.slug} is missing metrics`);
      const { unitsPerEm, ascent, descent, capHeight, xHeight } = family.metrics;
      // OpenType standard UPM ranges from 16 to 16384 (standard fonts: 400, 1000, 2048)
      assert.ok(unitsPerEm >= 100 && unitsPerEm <= 16384, `Invalid unitsPerEm for ${family.slug}: ${unitsPerEm}`);
      assert.ok(ascent > 0, `Ascent must be positive in ${family.slug}`);
      assert.ok(descent <= 0, `Descent should be negative or zero in ${family.slug}`);
      assert.ok(capHeight > 0 && capHeight <= ascent, `CapHeight out of range in ${family.slug}`);
      assert.ok(xHeight > 0 && xHeight <= capHeight, `X-Height should be less than CapHeight in ${family.slug}`);
    }
  });
});
