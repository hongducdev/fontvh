import raw from "@/data/catalog.json";
import type { Catalog, FontFamily } from "./types";

export const catalog = raw as unknown as Catalog;
export const families: FontFamily[] = catalog.families;

export function getFamily(slug: string): FontFamily | undefined {
  return families.find((family) => family.slug === slug);
}

export const categories = Array.from(
  new Set(families.flatMap((family) => family.categories))
).sort((a, b) => a.localeCompare(b, "vi"));

export const licenseTypes = Array.from(
  new Map(
    families.map((family) => [
      family.license.id,
      { id: family.license.id, name: family.license.name },
    ])
  ).values()
);
