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
  const [running, setRunning] = useState(false);

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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(() => {
          setRunning(true);
          cancel = runScramble({
            text,
            chars: HEADING_CHARS,
            duration: DURATION,
            onFrame: setDisplay,
          });
        }, HOLD + delay);
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancel?.();
      clearTimeout(timer);
    };
  }, [text, delay]);

  return (
    <span ref={ref} className={className}>
      <span
        aria-hidden="true"
        className="scramble"
        data-run={running ? "1" : undefined}
      >
        {display.split("").map((ch, i) =>
          // A space stays outside the animated element boxes. Wrapped in
          // one it is still a break opportunity in theory, but keeping it
          // as plain text is what actually lets a long heading wrap — and
          // an unwrappable heading floors its grid track at max-content
          // and pushes the whole page wider than the viewport.
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
      <span className="sr-only">{text}</span>
    </span>
  );
}
