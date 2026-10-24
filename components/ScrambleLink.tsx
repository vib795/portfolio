"use client";

import { useEffect, useRef, useState } from "react";
import { LINK_CHARS, motionOK, runScramble } from "@/lib/scramble";

/** Seconds. The reference tweens link hovers over 0.8s. */
const ENTER = 0.8;

/** On mouseleave it reverses the same tween at `timeScale(1.5)`. */
const LEAVE = ENTER / 1.5;

type Props = {
  text: string;
  className?: string;
};

/**
 * Scrambles a piece of link text while the pointer is over it.
 *
 * The reference marks the interactive element `scramble-link` and the
 * text inside it `scramble-text`, then binds the hover to the *outer*
 * one. That distinction matters: a nav item is a padded box, and binding
 * to the text alone would leave the padding dead. So this walks up to its
 * nearest link, button, or declared host and listens there — drop it
 * inside any link and the whole link becomes the hover target.
 *
 * Desktop pointers only, exactly as the reference gates it. On a phone
 * there is no hover, and a tap would churn the text under the thumb that
 * is trying to read it.
 *
 * The real string stays in the DOM in a `sr-only` span, so the scramble
 * is decoration on top of text that is already correct in the prerender
 * and correct to a screen reader. Nothing here has to run for the link to
 * say what it says.
 */
export default function ScrambleLink({ text, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // `data-scramble-host` is this codebase's version of the
    // reference's `scramble-link` attribute: it lets a container that
    // isn't itself a link — a whole project card, say — declare that it
    // owns the hover. Otherwise the nearest link or button does.
    const host = el.closest("[data-scramble-host], a, button") ?? el;
    let cancel: (() => void) | null = null;

    const play = (duration: number) => {
      // The reference's own cutoff. Below it the site has a tap menu,
      // not a hover menu.
      if (window.innerWidth <= 767) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
        return;
      if (!motionOK()) return;

      cancel?.();
      cancel = runScramble({
        text,
        chars: LINK_CHARS,
        duration,
        onFrame: setDisplay,
      });
    };

    const enter = () => play(ENTER);
    const leave = () => play(LEAVE);

    host.addEventListener("mouseenter", enter);
    host.addEventListener("mouseleave", leave);
    return () => {
      host.removeEventListener("mouseenter", enter);
      host.removeEventListener("mouseleave", leave);
      cancel?.();
      setDisplay(text);
    };
  }, [text]);

  return (
    <span
      ref={ref}
      className={`relative inline-block max-w-full overflow-hidden align-top ${className ?? ""}`}
    >
      {/* The real string, invisible, owns the box — width and line
          breaks, so a long post title still wraps on a phone. The
          scrambling copy is laid over it at the same width, out of flow,
          so glyphs of a different width (Mona Sans is proportional) can
          never resize the button, pill or nav item around it, and the
          box clips it so a wider glyph never spills past the edge. A label
          that must stay on one line gets `whitespace-nowrap` from its
          parent, which both layers inherit. */}
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {display}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
