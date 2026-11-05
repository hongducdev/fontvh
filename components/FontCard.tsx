"use client";

import { memo } from "react";
import type { FontFamily } from "@/lib/types";
import { FontshareCard } from "./FontshareCard";

export const FontCard = memo(function FontCard({
  family,
  sample,
}: {
  family: FontFamily;
  sample?: string;
}) {
  return <FontshareCard family={family} globalText={sample} />;
});
