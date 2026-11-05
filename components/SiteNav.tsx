"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Magnifier, XIcon } from "./icons";
import { ThemeToggle } from "./ThemeToggle";

export function SiteNav({
  fonts = 5,
  pairings = 12,
  licenses = 4,
}: {
  fonts?: number;
  pairings?: number;
  licenses?: number;
} = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const onFonts = pathname.startsWith("/fonts");
  const onPairings = pathname.startsWith("/pairings");
  const onLicenses = pathname.startsWith("/licenses");

  // Auto-focus input when mobile search is opened
  useEffect(() => {
    if (mobileSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [mobileSearchOpen]);

  // Close search when pathname changes
  useEffect(() => {
    setMobileSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/fonts?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    } else {
      router.push("/fonts");
      setMobileSearchOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div className="flex items-center justify-end md:hidden">
        {mobileSearchOpen ? (
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="flex w-full items-center gap-2 rounded bg-soft px-3 py-1.5 transition-all"
          >
            <Magnifier className="h-4 w-4 shrink-0 text-muted" />
            <label htmlFor="mobile-header-q" className="sr-only">
              Tìm font
            </label>
            <input
              ref={searchInputRef}
              id="mobile-header-q"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm font, tác giả..."
              className="w-full bg-transparent text-[14px] leading-[20px] outline-none placeholder:text-muted"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="flex h-7 w-7 items-center justify-center text-muted hover:text-ink cursor-pointer"
                aria-label="Xóa nội dung tìm kiếm"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen(false);
                setSearchQuery("");
              }}
              className="text-[13px] font-medium text-muted hover:text-ink pl-1 cursor-pointer"
            >
              Đóng
            </button>
          </form>
        ) : (
          <nav
            aria-label="Chính"
            className="flex items-center gap-0.5 sm:gap-2 text-[13px] sm:text-[14px] font-medium"
          >
            <Link
              href="/fonts"
              className={`inline-flex min-h-[44px] items-center px-1.5 sm:px-2 py-2 transition-colors ${
                onFonts ? "text-ink font-bold underline underline-offset-4" : "text-muted hover:text-ink"
              }`}
            >
              Bộ font
            </Link>
            <Link
              href="/pairings"
              className={`inline-flex min-h-[44px] items-center px-1.5 sm:px-2 py-2 transition-colors ${
                onPairings ? "text-ink font-bold underline underline-offset-4" : "text-muted hover:text-ink"
              }`}
            >
              Cặp font
            </Link>
            <Link
              href="/licenses"
              className={`inline-flex min-h-[44px] items-center px-1.5 sm:px-2 py-2 transition-colors ${
                onLicenses ? "text-ink font-bold underline underline-offset-4" : "text-muted hover:text-ink"
              }`}
            >
              Giấy phép
            </Link>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Mở tìm kiếm"
              className="inline-flex min-h-[44px] min-w-[38px] sm:min-w-[44px] items-center justify-center p-2 text-muted hover:text-ink cursor-pointer transition-colors"
            >
              <Magnifier className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div className="inline-flex min-h-[44px] items-center pl-0.5">
              <ThemeToggle />
            </div>
          </nav>
        )}
      </div>

      {/* Desktop Navigation */}
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

      {/* Desktop Search & Theme */}
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
