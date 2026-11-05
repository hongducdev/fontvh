"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Top Page Navigation Progress Bar using React 19 useTransition & Next.js navigation events
 * Provides an ultra-smooth visual cue when navigating between pages.
 */
export function PageProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Complete progress bar whenever route successfully changes
  useEffect(() => {
    if (isVisible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept click on internal links to kick off smooth progress transition
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target || !target.href) return;

      const targetUrl = new URL(target.href, window.location.origin);
      const isInternal = targetUrl.origin === window.location.origin;
      const isDownloadOrApi = targetUrl.pathname.startsWith("/api/");
      const isTargetBlank = target.target === "_blank";
      const isSamePageHash =
        targetUrl.pathname === window.location.pathname &&
        targetUrl.search === window.location.search &&
        targetUrl.hash !== "";

      if (
        isInternal &&
        !isDownloadOrApi &&
        !isTargetBlank &&
        !isSamePageHash &&
        (targetUrl.pathname !== window.location.pathname ||
          targetUrl.search !== window.location.search)
      ) {
        // Trigger React transition for smooth page switch
        startTransition(() => {
          setIsVisible(true);
          setProgress(25);
        });

        // Advance progress bar smoothly
        setTimeout(() => {
          setProgress((prev) => (prev < 75 ? 75 : prev));
        }, 120);
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, {
        capture: true,
      });
    };
  }, [startTransition]);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[2px] overflow-hidden pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-ink transition-all duration-300 ease-out shadow-[0_0_8px_rgba(255,255,227,0.5)]"
        style={{
          width: `${progress}%`,
          opacity: isVisible || progress > 0 ? 1 : 0,
        }}
      />
    </div>
  );
}
