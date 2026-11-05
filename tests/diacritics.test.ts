import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  VIETNAMESE_TONES,
  VIETNAMESE_DIACRITIC_MATRIX,
  STRESS_TEST_CASES,
} from "../lib/vietnamese-diacritics.ts";

describe("Vietnamese Diacritics System & Matrix Tests", () => {
  test("VIETNAMESE_TONES defines all 6 canonical Vietnamese tones", () => {
    assert.equal(VIETNAMESE_TONES.length, 6, "Must define exactly 6 Vietnamese tones");
    const toneIds = VIETNAMESE_TONES.map((t) => t.id);
    assert.deepEqual(toneIds, ["none", "grave", "acute", "hook", "tilde", "dot"]);
  });

  test("VIETNAMESE_DIACRITIC_MATRIX covers all vowels and D with stroke", () => {
    assert.equal(VIETNAMESE_DIACRITIC_MATRIX.length, 13, "Must contain 13 vowel/consonant rows (A, Ă, Â, E, Ê, I, O, Ô, Ơ, U, Ư, Y, D)");
    
    const rowIds = VIETNAMESE_DIACRITIC_MATRIX.map((r) => r.id);
    const expectedIds = [
      "a-base",
      "a-breve",
      "a-circumflex",
      "e-base",
      "e-circumflex",
      "i-base",
      "o-base",
      "o-circumflex",
      "o-horn",
      "u-base",
      "u-horn",
      "y-base",
      "d-stroke",
    ];
    assert.deepEqual(rowIds, expectedIds);
  });

  test("Every matrix entry has matching Unicode format and uppercase/lowercase consistency", () => {
    let totalGlyphs = 0;
    for (const row of VIETNAMESE_DIACRITIC_MATRIX) {
      assert.ok(row.chars.length > 0, `Row ${row.id} must have chars`);
      for (const char of row.chars) {
        totalGlyphs++;
        assert.ok(char.upper, "Upper char required");
        assert.ok(char.lower, "Lower char required");
        assert.match(char.upperUnicode, /^U\+[0-9A-F]{4}$/, `Invalid upper Unicode format: ${char.upperUnicode}`);
        assert.match(char.lowerUnicode, /^U\+[0-9A-F]{4}$/, `Invalid lower Unicode format: ${char.lowerUnicode}`);

        // Verify unicode points match characters
        const upperCode = parseInt(char.upperUnicode.replace("U+", ""), 16);
        const lowerCode = parseInt(char.lowerUnicode.replace("U+", ""), 16);
        assert.equal(char.upper.codePointAt(0), upperCode, `Upper char code point mismatch for ${char.upper}`);
        assert.equal(char.lower.codePointAt(0), lowerCode, `Lower char code point mismatch for ${char.lower}`);
      }
    }
    // Vietnamese full alphabet diacritic matrix has 74 positions (12 vowel groups * 6 tones + 2 d-stroke positions: D, Đ)
    assert.equal(totalGlyphs, 74, "Total diacritic positions in matrix must equal 74 (72 vowel tones + 2 d-stroke)");
  });

  test("STRESS_TEST_CASES includes diacritic collisions and double accents", () => {
    assert.ok(STRESS_TEST_CASES.length >= 4, "Must have at least 4 stress test categories");
    for (const testCase of STRESS_TEST_CASES) {
      assert.ok(testCase.id && testCase.category, "Test case must have id and category");
      assert.ok(Array.isArray(testCase.words) && testCase.words.length > 0, `Words array empty in ${testCase.id}`);
      assert.ok(testCase.sentence && testCase.sentence.length > 10, `Sentence too short in ${testCase.id}`);
    }
  });
});
