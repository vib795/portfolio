"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * One-shot scroll reveal.
 *
 * The previous version used `animation-timeline: view()`, which is
 * scroll-*linked*: scrolling back up ran the animation backwards and
 * partially un-revealed content that had already arrived. This fires
 * once and stays put, which is how the reference behaves.
 *
 * The hidden state is never in the server HTML. On mount the element
 * is measured first: anything already on screen is marked shown
 * without ever being hidden, so there is no flash and the prerender
 * still contains real, visible content.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Seconds of stagger, applied as a CSS transition-delay. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already visible at mount → show it, never hide it.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.dataset.reveal = "shown";
      return;
    }

    el.dataset.reveal = "hidden";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "shown";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as never) : undefined}
    >
      {children}
    </div>
  );
}
