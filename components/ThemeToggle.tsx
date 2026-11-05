"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === "light" || current === "dark") setTheme(current);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("fontvh-theme", next);
    } catch {
      /* storage không khả dụng */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"
      }
      title={theme === "dark" ? "Nền sáng" : "Nền tối"}
      className="flex shrink-0 items-center gap-1.5 py-1"
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          theme === "light" ? "bg-ink" : "border border-faint"
        }`}
      />
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          theme === "dark" ? "bg-ink" : "border border-faint"
        }`}
      />
    </button>
  );
}
