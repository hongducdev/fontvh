import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteNav } from "@/components/SiteNav";
import { PageProgress } from "@/components/PageProgress";
import { families, licenseTypes } from "@/lib/catalog";
import { pairings } from "@/lib/pairings";
import "./globals.css";
import "./font-faces.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "fontvh — Font Việt, miễn phí",
    template: "%s · fontvh",
  },
  description:
    "Thư viện font tiếng Việt miễn phí cho cá nhân và thương mại. Xem specimen, thử chữ, tải woff2 và bản gốc.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "fontvh",
    title: "fontvh — Font Việt, miễn phí",
    description: "Thư viện font tiếng Việt miễn phí, dấu đầy đủ, tải về woff2.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem("fontvh-theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col font-sans">
        <Suspense fallback={null}>
          <PageProgress />
        </Suspense>
        <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md supports-[backdrop-filter]:bg-paper/85 transition-colors md:static">
          <div className="shell">
            <div className="grid h-16 grid-cols-[1fr_auto] items-center md:h-40 md:grid-cols-8 md:items-stretch">
              <Link
                href="/"
                className="flex items-center md:col-span-2 md:border-r md:border-line"
                aria-label="fontvh — trang chủ"
              >
                <span className="text-[24px] font-bold tracking-[-0.03em] md:text-[30px]">
                  fontvh<span className="text-muted">.</span>
                </span>
              </Link>

              <SiteNav
                fonts={families.length}
                pairings={pairings.length}
                licenses={licenseTypes.length}
              />
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-20 border-t border-line">
          <div className="shell">
            <div className="grid grid-cols-1 gap-6 py-8 text-[14px] leading-[22px] md:grid-cols-8">
              <p className="text-muted md:col-span-3">
                fontvh — thư viện font Việt. Mỗi họ chữ được kiểm tra dấu tiếng
                Việt trước khi lên thư viện.
              </p>
              <p className="text-muted md:col-span-3">
                Dùng cho cá nhân và thương mại theo giấy phép của từng họ chữ.
                File license luôn nằm trong gói tải về.
              </p>
              <div className="flex gap-5 md:col-span-2 md:justify-end">
                <Link href="/fonts" className="link-underline">
                  Bộ font
                </Link>
                <Link href="/pairings" className="link-underline">
                  Cặp font
                </Link>
                <Link href="/licenses" className="link-underline">
                  Giấy phép
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
