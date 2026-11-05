import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pairings } from "../lib/pairings.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

describe("Font Pairings System Tests", () => {
  const catalogPath = path.join(rootDir, "data", "catalog.json");
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
  const availableSlugs = new Set(catalog.families.map((f: { slug: string }) => f.slug));

  test("All pairings reference existing font families in the catalog", () => {
    assert.ok(pairings.length > 0, "Must have defined pairings");

    for (const pairing of pairings) {
      assert.ok(pairing.id, "Pairing must have an id");
      assert.ok(pairing.title, "Pairing must have a title");
      assert.ok(pairing.heading, "Pairing must have heading config");
      assert.ok(pairing.body, "Pairing must have body config");

      // Verify heading font exists in catalog
      assert.ok(
        availableSlugs.has(pairing.heading.slug),
        `Heading font '${pairing.heading.slug}' in pairing '${pairing.id}' does not exist in catalog`
      );

      // Verify body font exists in catalog
      assert.ok(
        availableSlugs.has(pairing.body.slug),
        `Body font '${pairing.body.slug}' in pairing '${pairing.id}' does not exist in catalog`
      );
    }
  });

  test("All pairings have valid sample text and tags", () => {
    for (const pairing of pairings) {
      assert.ok(pairing.heading.sample && pairing.heading.sample.length > 5, `Heading sample empty for ${pairing.id}`);
      assert.ok(pairing.body.sample && pairing.body.sample.length > 20, `Body sample too short for ${pairing.id}`);
      assert.ok(Array.isArray(pairing.tags) && pairing.tags.length > 0, `Pairing ${pairing.id} must have tags`);
    }
  });
});
