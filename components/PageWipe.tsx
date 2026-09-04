"use client";

import { useEffect, useState } from "react";

/** Columns of the wipe. Matches the ruling: four cells across. */
const TILES = 4;

/**
 * The accent tile wipe the reference plays on entry.
 *
 * Tiles cover the viewport and retract upward on a stagger. The whole
 * overlay unmounts when the last one finishes rather than lingering at
 * `pointer-events: none`, so it can never sit on top of the page
 * swallowing clicks.
 *
 * It renders nothing on the server. A wipe in the prerendered HTML
 * would be a full-bleed accent block covering the content for anyone
 * whose JS never arrives.
 */
export default function PageWipe() {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only on a genuine first paint, not on client-side nav back to /.
    const seen = sessionStorage.getItem("wipe-seen");
    if (seen) return;

    try {
      sessionStorage.setItem("wipe-seen", "1");
    } catch {
      // Private mode — play it anyway, just don't remember.
    }

    setPlaying(true);
    const timer = window.setTimeout(() => setPlaying(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  if (!playing) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] flex"
      aria-hidden="true"
    >
      {Array.from({ length: TILES }, (_, i) => (
        <span
          key={i}
          className="wipe-tile h-full flex-1 bg-accent"
          style={{ "--delay": `${i * 0.07}s` } as never}
        />
      ))}
    </div>
  );
}
