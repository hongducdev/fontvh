/**
 * Shared in-memory and external store for user font favorites.
 * Follows Vercel React Best Practices:
 * - Rule 7.5 (js-cache-storage): Cache Storage API calls to avoid repetitive I/O & JSON parsing
 * - Rule 4.1 (client-event-listeners): Single synchronized subscriber pattern
 */

let cachedFavorites: Set<string> | null = null;
const listeners = new Set<() => void>();

function initFavorites(): Set<string> {
  if (cachedFavorites !== null) return cachedFavorites;
  if (typeof window === "undefined") {
    cachedFavorites = new Set();
    return cachedFavorites;
  }
  try {
    const raw = window.localStorage.getItem("fontvh_favorites");
    const arr = raw ? JSON.parse(raw) : [];
    cachedFavorites = new Set(Array.isArray(arr) ? arr : []);
  } catch {
    cachedFavorites = new Set();
  }
  return cachedFavorites;
}

export function isFavorite(slug: string): boolean {
  return initFavorites().has(slug);
}

export function toggleFavorite(slug: string): boolean {
  const set = initFavorites();
  const next = !set.has(slug);
  if (next) {
    set.add(slug);
  } else {
    set.delete(slug);
  }

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        "fontvh_favorites",
        JSON.stringify(Array.from(set))
      );
    } catch {
      // Ignore localStorage errors (e.g. private browsing quota)
    }
  }

  listeners.forEach((listener) => listener());
  return next;
}

export function subscribeFavorites(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
