"use client";

import { useEffect, useState } from "react";

/**
 * The field of slowly drifting marks the reference floats behind its
 * hero — small squares and rings that rise, rotate and fade out.
 *
 * One keyframe block drives the whole field; each mark carries its own
 * duration, offset, rotation and scale as CSS custom properties. That
 * keeps it to a single animation with no per-element CSS.
 *
 * Positions are generated on the client, after mount. Random values
 * produced during render would differ between the server pass and the
 * client pass and trip a hydration mismatch.
 */

const COUNT = 14;

type Mark = {
  left: number;
  top: number;
  size: number;
  dur: number;
  delay: number;
  tx: number;
  ty: number;
  r0: number;
  r1: number;
  ring: boolean;
};

export default function Drift({ className }: { className?: string }) {
  const [marks, setMarks] = useState<Mark[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setMarks(
      Array.from({ length: COUNT }, () => ({
        left: Math.random() * 100,
        top: 30 + Math.random() * 70,
        size: 4 + Math.random() * 7,
        // The reference spreads these across 3–13s so the field never
        // falls into a visible common rhythm.
        dur: 3 + Math.random() * 10,
        delay: -Math.random() * 10,
        tx: (Math.random() - 0.5) * 120,
        ty: -(90 + Math.random() * 190),
        r0: Math.random() * 90,
        r1: Math.random() * 260 - 130,
        ring: Math.random() > 0.55,
      })),
    );
  }, []);

  if (marks.length === 0) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      {marks.map((m, i) => (
        <span
          key={i}
          className={`drift absolute ${
            m.ring ? "border border-accent" : "bg-accent"
          }`}
          style={
            {
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
              "--dur": `${m.dur}s`,
              "--delay": `${m.delay}s`,
              "--tx": `${m.tx}px`,
              "--ty": `${m.ty}px`,
              "--r0": `${m.r0}deg`,
              "--r1": `${m.r1}deg`,
              "--peak": m.ring ? 0.5 : 0.75,
            } as never
          }
        />
      ))}
    </div>
  );
}
