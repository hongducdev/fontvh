"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Magnifier } from "./icons";
import { ThemeToggle } from "./ThemeToggle";

export function SiteNav({
  fonts,
  pairings,
  licenses,
}: {
  fonts: number;
  pairings: number;
  licenses: number;
}) {
  const pathname = usePathname();
  const onFonts = pathname.startsWith("/fonts");
  const onPairings = pathname.startsWith("/pairings");
  const onLicenses = pathname.startsWith("/licenses");

  return (
    <>
      <nav
        aria-label="Chính"
        className="flex items-center gap-3 text-[14px] font-medium md:hidden"
      >
        <Link
          href="/fonts"
          className={`inline-flex min-h-[44px] items-center px-2 py-2 transition-colors ${
            onFonts ? "text-ink underline underline-offset-4" : "text-muted hover:text-ink"
          }`}
        >
          Bộ font
        </Link>
        <Link
          href="/pairings"
          className={`inline-flex min-h-[44px] items-center px-2 py-2 transition-colors ${
            onPairings ? "text-ink underline underline-offset-4" : "text-muted hover:text-ink"
          }`}
        >
          Cặp font
        </Link>
        <Link
          href="/licenses"
          className={`inline-flex min-h-[44px] items-center px-2 py-2 transition-colors ${
            onLicenses ? "text-ink underline underline-offset-4" : "text-muted hover:text-ink"
          }`}
        >
          Giấy phép
        </Link>
        <Link
          href="/fonts"
          aria-label="Tìm font"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center p-2 text-ink"
        >
          <Magnifier className="h-5 w-5" />
        </Link>
        <div className="inline-flex min-h-[44px] items-center pl-1">
          <ThemeToggle />
        </div>
      </nav>

      <nav aria-label="Chính" className="hidden md:col-span-4 md:flex">
        <Link
          href="/fonts"
          className="nav-tab flex-1"
          data-active={onFonts || undefined}
        >
          <span>Bộ font</span>
          <span className="nav-count">{fonts}</span>
        </Link>
        <Link
          href="/pairings"
          className="nav-tab flex-1"
          data-active={onPairings || undefined}
        >
          <span>Cặp font</span>
          <span className="nav-count">{pairings}</span>
        </Link>
        <Link
          href="/licenses"
          className="nav-tab flex-1"
          data-active={onLicenses || undefined}
        >
          <span>Giấy phép</span>
          <span className="nav-count">{licenses}</span>
        </Link>
      </nav>

      <div className="hidden md:col-span-2 md:flex md:items-center md:justify-end md:gap-5 md:pl-8">
        <form
          action="/fonts"
          role="search"
          className="flex w-full items-center gap-2 rounded px-2 py-1 focus-within:ring-1 focus-within:ring-ink"
        >
          <Magnifier className="shrink-0 text-muted" />
          <label htmlFor="header-q" className="sr-only">
            Tìm font
          </label>
          <input
            id="header-q"
            name="q"
            type="search"
            placeholder="Tìm font..."
            className="w-full bg-transparent text-[14px] leading-[20px] outline-none placeholder:text-muted"
          />
        </form>
        <ThemeToggle />
      </div>
    </>
  );
}
