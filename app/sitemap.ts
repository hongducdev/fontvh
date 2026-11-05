import type { MetadataRoute } from "next";
import { families, licenseTypes } from "@/lib/catalog";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/fonts`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/licenses`, changeFrequency: "monthly", priority: 0.5 },
    ...families.map((family) => ({
      url: `${base}/fonts/${family.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...licenseTypes.map((license) => ({
      url: `${base}/licenses/${license.id}`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
