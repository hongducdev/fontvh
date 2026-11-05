import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";

describe("Favorites Cached Store Tests", () => {
  // Setup mock window.localStorage
  let storage: Record<string, string> = {};

  beforeEach(() => {
    storage = {};
    (globalThis as unknown as { window: unknown }).window = {
      localStorage: {
        getItem: (key: string) => storage[key] ?? null,
        setItem: (key: string, val: string) => {
          storage[key] = val;
        },
      },
    };
  });

  test("toggleFavorite adds and removes items and triggers subscribers", async () => {
    // Dynamic import to pick up fresh mocked environment
    const { isFavorite, toggleFavorite, subscribeFavorites } = await import(
      "../lib/favorites.ts"
    );

    let notifyCount = 0;
    const unsubscribe = subscribeFavorites(() => {
      notifyCount++;
    });

    // Initial state
    assert.equal(isFavorite("be-vietnam-pro"), false);

    // Toggle on
    const res1 = toggleFavorite("be-vietnam-pro");
    assert.equal(res1, true);
    assert.equal(isFavorite("be-vietnam-pro"), true);
    assert.equal(notifyCount, 1);

    // Toggle off
    const res2 = toggleFavorite("be-vietnam-pro");
    assert.equal(res2, false);
    assert.equal(isFavorite("be-vietnam-pro"), false);
    assert.equal(notifyCount, 2);

    unsubscribe();
    toggleFavorite("lora");
    assert.equal(notifyCount, 2, "Subscriber should not be called after unsubscribe");
  });
});
