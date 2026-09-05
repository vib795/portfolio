"use client";

import { useEffect, useMemo, useState } from "react";
import { motionOK, seeded } from "@/lib/scramble";
import Wordmark from "./Wordmark";

/**
 * ms to wait before the mark arrives.
 *
 * The page opens behind the orange curtain, which takes CLEAR_MS + one
 * STAGGER_MS — 640ms — to sweep off. Starting on mount spends the arrival
 * behind a wall nobody can see through. Holding until just before the
 * curtain finishes means the glyphs blank and begin assembling while it
 * is still down, so the lift reveals a mark already coming together
 * rather than one that pops. Keep in step with PageTransition.
 */
const CURTAIN_MS = 500;

/** Entrance length: char-flicker's 0.4s plus the widest stagger (0.4s).
 *  After this the mark hands over to the idle loop. */
const ENTER_MS = 900;

export default function HeroWordmark({
  text,
  title,
  className,
}: {
  text: string;
  title?: string;
  className?: string;
}) {
  const [phase, setPhase] = useState<"idle" | "in" | "loop">("idle");

  /* The same seeded shuffle the headings use, so glyphs arrive in a
     scattered order rather than left to right. Seeded, not random: this
     renders on the server too, and Math.random would tear hydration. */
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

  useEffect(() => {
    if (!motionOK()) return;
    const enter = window.setTimeout(() => setPhase("in"), CURTAIN_MS);
    const loop = window.setTimeout(
      () => setPhase("loop"),
      CURTAIN_MS + ENTER_MS,
    );
    return () => {
      window.clearTimeout(enter);
      window.clearTimeout(loop);
    };
  }, []);

  return (
    <div
      className={`mark-flicker flex justify-center overflow-hidden ${className ?? ""}`}
      data-phase={phase === "idle" ? undefined : phase}
    >
      {/* Width-driven, height-capped. A marquee could afford to overflow
          because it scrolled the rest of the mark past you; a static one
          cannot — at 390px a height-driven mark is 850px wide and the
          phone only ever sees the middle few letters. Sizing by width
          makes it fit any viewport, and the max-height keeps the desktop
          mark at the size it already had rather than letting it grow to
          174px to fill the shell. preserveAspectRatio centres the glyphs
          inside the capped box. */}
      <Wordmark
        text={text}
        title={title}
        charDelays={charDelays}
        className="h-auto max-h-[7rem] w-full text-ink lg:max-h-[8rem]"
      />
    </div>
  );
}
