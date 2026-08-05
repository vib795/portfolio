import type { CSSProperties, ReactNode } from "react";

/**
 * Scroll reveal.
 *
 * Deliberately not a client component and deliberately not JS-driven.
 * The animation is a CSS `view()` timeline (see `.reveal` in globals.css),
 * so it costs no bundle, no hydration and no IntersectionObserver — and
 * where the timeline is unsupported the content simply renders visible.
 *
 * The previous Framer Motion version put `opacity:0` in the server HTML,
 * which meant the whole of /blog was blank until the bundle executed.
 * Nothing here can hide content from a reader.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /**
   * Stagger offset in seconds, kept for call-site compatibility. Scroll
   * timelines advance with the scroll rather than the clock, so this maps
   * onto a shift in the animation range: 0.05 → the reveal starts 5%
   * further into the element's entry.
   */
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={className ? `reveal ${className}` : "reveal"}
      style={
        delay
          ? ({ "--reveal-shift": `${Math.round(delay * 100)}%` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
