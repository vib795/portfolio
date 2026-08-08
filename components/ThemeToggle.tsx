"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./icons";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage may be unavailable (private mode, etc.)
    }
    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
    >
      {/* Both icons stay mounted and cross-rotate. Swapping the element
          outright made the one visibly-stateful control on the page the
          only thing that changed with no transition at all.
          Scaled to 0.75 rather than 0 — nothing appears from nothing. */}
      {mounted && (
        <>
          <SunIcon
            className={`absolute size-[1.05rem] transition-[opacity,transform] duration-200 ease-out ${
              isDark
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-75 opacity-0"
            }`}
          />
          <MoonIcon
            className={`absolute size-[1.05rem] transition-[opacity,transform] duration-200 ease-out ${
              isDark
                ? "rotate-90 scale-75 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
          />
        </>
      )}
    </button>
  );
}
