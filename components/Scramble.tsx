"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HEADING_CHARS, motionOK, runScramble, seeded } from "@/lib/scramble";

/** Seconds. The reference's heading tween. */
const DURATION = 0.8;

/** ms the reference waits after a heading crosses its trigger line. */
const HOLD = 300;

type Props = {
  text: string;
  className?: string;
  /** Extra delay, so several marks can cascade. */
  delay?: number;
};

/**
 * Scrambles a heading into place the first time it scrolls into view.
 *
 * Two things happen at once, which is how the reference does it and why
 * its headings arrive the way they do:
 *
 *   the string resolves left to right through a pool of glyphs, and
 *   each character independently flickers up from nothing, in random
 *   order, on a 0.05s stagger.
 *
 * Either alone is a cliché. Together they read as a signal locking on.
 *
 * The trigger is `top 92%` on the reference — a heading starts when its
 * top edge is 8% up from the bottom of the viewport — which is the same
 * line `Reveal` uses, so a section's heading and its body arrive
 * together rather than in two waves.
 *
 * The real string is always in the server HTML inside a `sr-only` span.
 * The scrambling copy is `aria-hidden`, so nothing meaningful depends on
 * this component having run.
 */
export default function Scramble({ text, className, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  /* idle → run → done. Only `run` draws the per-letter layer; before and
     after it the heading is ordinary text. Splitting a word into one span
     per letter drops kerning between them, so the letters come out wider
     than the word — left in place after the animation, that layer wrapped
     "selected-work" onto a second line its box had no room for. */
  const [phase, setPhase] = useState<"idle" | "run" | "done">("idle");
  const running = phase === "run";
  // A stable shuffle of character positions. Seeded, not random: this
  // renders on the server too, and a mismatch would break hydration.
  const flickerOrder = useMemo(() => {
    const idx = text.split("").map((_, i) => i);
    return idx
      .map((i) => ({ i, k: seeded(i + text.length * 7 + 1) }))
      .sort((a, b) => a.k - b.k)
      .reduce<number[]>((acc, entry, position) => {
        acc[entry.i] = position;
        return acc;
      }, []);
  }, [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionOK()) return;

    let cancel: (() => void) | null = null;
    let timer = 0;
    let doneTimer = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(() => {
          // A heading that already needs two lines (a long title on a
          // phone) is left alone: the scrambling layer holds one line, so
          // running it would rewrap the heading for the length of the
          // animation.
          const real = el.firstElementChild;
          if (real && real.getClientRects().length > 1) return;

          setPhase("run");
          cancel = runScramble({
            text,
            chars: HEADING_CHARS,
            duration: DURATION,
            onFrame: setDisplay,
          });
          // Hand back to plain text once both the scramble and the slowest
          // character's flicker (0.4s after a stagger of 0.05s per place)
          // have finished.
          const flickerMs = 400 + (text.length - 1) * 50;
          doneTimer = window.setTimeout(
            () => setPhase("done"),
            Math.max(DURATION * 1000, flickerMs) + 50,
          );
        }, HOLD + delay);
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancel?.();
      clearTimeout(timer);
      clearTimeout(doneTimer);
    };
  }, [text, delay]);

  return (
    <span
      ref={ref}
      className={`relative inline-block max-w-full align-top ${className ?? ""}`}
    >
      {/* The real string always owns the box. It is the visible text
          before and after the animation, and only turns invisible while
          the scrambling copy is drawn over it. */}
      <span aria-hidden="true" className={running ? "invisible" : undefined}>
        {text}
      </span>
      {running && (
        <span
          aria-hidden="true"
          className="scramble absolute left-0 top-0 whitespace-nowrap"
          data-run="1"
        >
          {display.split("").map((ch, i) =>
            ch === " " ? (
              <span key={i}> </span>
            ) : (
              <span
                key={i}
                className="scramble-char"
                style={
                  { "--fd": `${((flickerOrder[i] ?? 0) * 0.05).toFixed(2)}s` } as {
                    [key: string]: string;
                  }
                }
              >
                {ch}
              </span>
            ),
          )}
        </span>
      )}
      <span className="sr-only">{text}</span>
    </span>
  );
}
