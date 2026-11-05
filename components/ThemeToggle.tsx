"use client";

import { useEffect, useState, useRef } from "react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const transitionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === "light" || current === "dark") {
      setTheme(current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";

    // Kích hoạt class transition màu sắc mềm mại (fade nhẹ nhàng)
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    document.documentElement.classList.add("theme-transitioning");
    setTheme(next);
    document.documentElement.dataset.theme = next;

    try {
      localStorage.setItem("fontvh-theme", next);
    } catch {
      /* localStorage không khả dụng */
    }

    // Tự động gỡ bỏ sau khi hoàn tất transition để không ảnh hưởng hiệu năng cuộn/gõ
    transitionTimeoutRef.current = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
      transitionTimeoutRef.current = null;
    }, 350);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"
      }
      title={theme === "dark" ? "Nền sáng" : "Nền tối"}
      className="flex shrink-0 items-center gap-1.5 py-1 px-1 rounded cursor-pointer transition-transform active:scale-90"
    >
      <span
        className={`h-2.5 w-2.5 rounded-full transition-colors duration-200 ${
          theme === "light" ? "bg-ink" : "border border-faint"
        }`}
      />
      <span
        className={`h-2.5 w-2.5 rounded-full transition-colors duration-200 ${
          theme === "dark" ? "bg-ink" : "border border-faint"
        }`}
      />
    </button>
  );
}
