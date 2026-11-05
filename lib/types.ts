export type FontStyle = {
  key: string;
  name: string;
  weight: number;
  italic: boolean;
  file: string;
  variable: boolean;
  weightRange?: [number, number];
};

export type FontAxis = {
  tag: string;
  min: number;
  max: number;
  default: number;
};

export type FontLicense = {
  id: string;
  name: string;
  file: string | null;
  url?: string;
};

export type FontMetrics = {
  unitsPerEm: number;
  ascent: number;
  descent: number;
  capHeight: number;
  xHeight: number;
  lineGap?: number;
};

export type FontFamily = {
  slug: string;
  name: string;
  designer: string;
  foundry: string;
  description: string;
  categories: string[];
  license: FontLicense;
  styles: FontStyle[];
  axes: FontAxis[];
  metrics: FontMetrics;
  languages: string[];
  vietnamese: boolean;
  dong: boolean;
  glyphs: number;
  size: number;
  releasedAt: string | null;
  sourceUrl?: string | null;
  preview: { family: string; weight: number; style: "normal" | "italic" };
};

export type Catalog = {
  generatedAt: string;
  families: FontFamily[];
  stats: { families: number; styles: number };
};
