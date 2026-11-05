"use client";

import type { FontFamily } from "@/lib/types";
import { FontshareCard } from "./FontshareCard";

export function FontCard({
  family,
  sample,
}: {
  family: FontFamily;
  sample?: string;
}) {
  return <FontshareCard family={family} globalText={sample} />;
}
