"use client";

import { useEffect, useRef, useState } from "react";

// The reference loads GSAP + ScrambleTextPlugin (~60KB) to cycle random
// glyphs into a heading as it settles. This is the same effect without the
// dependency: one rAF loop, one string, resolved left to right.

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}#*+-_=";

/** ms each character spends scrambling before it locks to its real value */
const DWELL = 34;

type Props = {
  text: string;
  className?: string;
  /** Delay before the run starts, so several marks can cascade. */
  delay?: number;
};

/**
 * Scrambles `text` into place once, when it first scrolls into view.
 *
 * The real string is always in the DOM on the server render and is what a
 * screen reader announces — the scramble is a visual overlay on an element
 * marked `aria-hidden`. That keeps the prerendered HTML honest, which the
 * headline invariant in this repo requires: nothing meaningful may depend
 * on a bundle having run.
 */
export default function Scramble({ text, className, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let timer = 0;
    let start = 0;

    const run = (now: number) => {
      if (!start) start = now;
      // Characters resolve one after another; each one's scramble window
      // closes at index * DWELL.
      const settled = Math.floor((now - start) / DWELL);

      if (settled >= text.length) {
        setDisplay(text);
        return;
      }

      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (i < settled || ch === " ") return ch;
            return POOL[Math.floor(Math.random() * POOL.length)];
          })
          .join(""),
      );
      raf = requestAnimationFrame(run);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(() => {
          raf = requestAnimationFrame(run);
        }, delay);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [text, delay]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="scramble">
        {display}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
