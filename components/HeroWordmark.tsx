"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motionOK, runScramble, seeded } from "@/lib/scramble";
import Wordmark from "./Wordmark";

/**
 * The pool the mark can scramble through.
 *
 * Not HEADING_CHARS. That pool is mostly digits and letters this mark
 * cannot draw — Wordmark.tsx holds paths for exactly nineteen glyphs and
 * renders a blank cell for anything else, so scrambling into a `Z` or a
 * `0` would punch a hole in the word. This is the drawable set, and it
 * has to stay in step with GLYPHS in Wordmark.tsx.
 */
const MARK_CHARS = "ACDEFGHIKLNOPRSTUVW";

/** Seconds. Slower than a heading (0.8s) — the mark is far larger, and
 *  the same rate reads as frantic at this size. */
const DURATION = 1.2;

/**
 * ms to wait before the mount run.
 *
 * The page opens behind the orange curtain, which takes CLEAR_MS + one
 * STAGGER_MS — 640ms — to sweep off. Starting on mount spends the first
 * half of the scramble behind a wall nobody can see through. Holding
 * until just before the curtain finishes puts the settle, which is the
 * part worth watching, in full view. Keep in step with PageTransition.
 */
const CURTAIN_MS = 500;

export default function HeroWordmark({
  text,
  title,
  className,
}: {
  text: string;
  title?: string;
  className?: string;
}) {
  /* Settled text is the initial state, so the server HTML holds the real
     word and a client that never hydrates still shows PORTFOLIO. The
     scramble only ever runs after mount. */
  const [display, setDisplay] = useState(text);
  const [running, setRunning] = useState(false);
  const cancel = useRef<(() => void) | null>(null);

  /* The same seeded shuffle the headings use, so the mark flickers up in
     a scattered order rather than left to right — the resolve is already
     left to right, and running both in the same direction collapses the
     two effects into one. Seeded because this renders on the server too;
     Math.random here would tear hydration. */
  const charDelays = useMemo(() => {
    const idx = text.split("").map((_, i) => i);
    return idx
      .map((i) => ({ i, k: seeded(i + text.length * 7 + 1) }))
      .sort((a, b) => a.k - b.k)
      .reduce<string[]>((acc, entry, position) => {
        acc[entry.i] = `${(position * 0.05).toFixed(2)}s`;
        return acc;
      }, []);
  }, [text]);

  const play = useCallback(() => {
    if (!motionOK()) return;
    cancel.current?.();
    setRunning(true);
    cancel.current = runScramble({
      text,
      chars: MARK_CHARS,
      duration: DURATION,
      onFrame: setDisplay,
    });
  }, [text]);

  useEffect(() => {
    const t = window.setTimeout(play, CURTAIN_MS);
    return () => {
      window.clearTimeout(t);
      cancel.current?.();
    };
  }, [play]);

  /* Replaying on hover is the same affordance the nav and project titles
     already have, so the mark rewards a pointer the way the rest of the
     site does. Guarded to fine pointers: on touch there is no hover, and
     a tap would otherwise fire it on every scroll-by. */
  const onEnter = () => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    play();
  };

  return (
    <div
      className={`mark-flicker flex justify-center overflow-hidden ${className ?? ""}`}
      data-run={running ? "1" : undefined}
    >
      {/* Width-driven, height-capped. A marquee could afford to overflow
          because it scrolled the rest of the mark past you; a static one
          cannot — at 390px a height-driven mark is 850px wide and the
          phone only ever sees the middle few letters. Sizing by width
          makes it fit any viewport, and the max-height keeps the desktop
          mark at the size it already had rather than letting it grow to
          174px to fill the shell. preserveAspectRatio centres the glyphs
          inside the capped box.

          `title` is passed unchanged while `text` scrambles, so the
          accessible name stays "… — portfolio" throughout. */}
      <Wordmark
        text={display}
        title={title}
        charDelays={charDelays}
        className="h-auto max-h-[7rem] w-full text-ink lg:max-h-[8rem]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0"
        onMouseEnter={onEnter}
      />
    </div>
  );
}
