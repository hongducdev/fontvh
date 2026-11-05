import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/download/**": ["./fonts/**/*", "./public/fonts/**/*"],
    "/fonts/**/opengraph-image": ["./fonts/**/*", "./assets/og/**/*"],
  },
};

export default nextConfig;
