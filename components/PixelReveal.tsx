"use client";

import { useEffect, useRef, type ReactNode } from "react";

const COLS = 6;
const ROWS = 3;
const TONES = 5;

/** Deterministic scatter so server and client agree. */
const order = Array.from({ length: COLS * ROWS }, (_, i) => i)
  .map((i) => ({ i, k: Math.sin(i * 91.7 + 13.1) }))
  .sort((a, b) => a.k - b.k)
  .reduce<number[]>((acc, e, pos) => {
    acc[e.i] = pos;
    return acc;
  }, []);

/**
 * Covers a panel with flat pixel-colour blocks that blink away in a
 * scattered order the first time it scrolls into view.
 *
 * The cover is armed only after mount and only for a panel that starts
 * off-screen, so the server HTML never hides anything and a panel
 * already in view at load is left alone.
 */
export default function PixelReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.dataset.px = "armed";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.px = "go";
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      {children}
      <div className="px-cover" aria-hidden="true">
        {order.map((pos, i) => (
          <span
            key={i}
            style={
              {
                "--c": `var(--px-${((i * 3 + Math.floor(i / COLS)) % TONES) + 1})`,
                "--d": `${(pos * 0.028).toFixed(3)}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
