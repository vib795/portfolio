"use client";

import { useEffect, useRef } from "react";

/** Grid pitch in px. Matches the hero's graph paper (.bg-paper-grid). */
const CELL = 16;
/** Squares in the pool. Enough for a fast sweep before any is reused. */
const POOL = 36;
/** Longest gap, in cells, filled between two pointer samples, so a quick
 *  flick leaves a line instead of a few scattered squares. */
const MAX_FILL = 8;
const TONES = ["--px-1", "--px-2", "--px-3", "--px-4", "--px-5"];

/** Elements the trail stays off. Squares over a button or a field make
 *  them harder to read and to hit. */
const IGNORE =
  "a, button, input, textarea, select, label, [data-trail-ignore]";

/**
 * Stamps coloured squares onto a 16px grid behind the pointer, inside any
 * element marked `data-trail`. The pool is rendered once; moving the
 * pointer only rewrites a transform and restarts a CSS animation, so
 * nothing re-renders.
 *
 * Off on touch screens (there is no hover to follow) and under reduced
 * motion.
 */
export default function CursorTrail() {
  const pool = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    let next = 0;
    let lastCol: number | null = null;
    let lastRow: number | null = null;

    const stamp = (col: number, row: number) => {
      const el = pool.current[next];
      next = (next + 1) % POOL;
      if (!el) return;
      const tone = TONES[(col * 7 + row * 3) % TONES.length];
      el.style.transform = `translate3d(${col * CELL}px, ${row * CELL}px, 0)`;
      el.style.backgroundColor = `var(${tone})`;
      // Restart the fade: drop the flag, force a style flush, set it again.
      el.removeAttribute("data-on");
      void el.offsetWidth;
      el.setAttribute("data-on", "");
    };

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest("[data-trail]") || target.closest(IGNORE)) {
        lastCol = lastRow = null;
        return;
      }
      const col = Math.floor(e.clientX / CELL);
      const row = Math.floor(e.clientY / CELL);
      if (col === lastCol && row === lastRow) return;

      if (lastCol !== null && lastRow !== null) {
        const dc = col - lastCol;
        const dr = row - lastRow;
        const steps = Math.min(Math.max(Math.abs(dc), Math.abs(dr)), MAX_FILL);
        for (let i = 1; i < steps; i++) {
          stamp(
            Math.round(lastCol + (dc * i) / steps),
            Math.round(lastRow + (dr * i) / steps),
          );
        }
      }
      stamp(col, row);
      lastCol = col;
      lastRow = row;
    };

    // Scrolling moves the page under a still pointer; forget the last
    // cell so the next move doesn't draw a line across the jump.
    const onScroll = () => {
      lastCol = lastRow = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="trail" aria-hidden="true">
      {Array.from({ length: POOL }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            pool.current[i] = el;
          }}
          className="trail-px"
        />
      ))}
    </div>
  );
}
