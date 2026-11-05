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
        className="flex items-center gap-4 text-[14px] font-medium md:hidden"
      >
        <Link
          href="/fonts"
          className={
            onFonts ? "text-ink underline underline-offset-4" : "text-muted"
          }
        >
          Bộ font
        </Link>
        <Link
          href="/pairings"
          className={
            onPairings ? "text-ink underline underline-offset-4" : "text-muted"
          }
        >
          Cặp font
        </Link>
        <Link
          href="/licenses"
          className={
            onLicenses ? "text-ink underline underline-offset-4" : "text-muted"
          }
        >
          Giấy phép
        </Link>
        <Link href="/fonts" aria-label="Tìm font" className="text-ink">
          <Magnifier className="h-5 w-5" />
        </Link>
        <ThemeToggle />
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
          className="flex w-full items-center gap-3"
        >
          <Magnifier />
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
