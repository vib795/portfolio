"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scroll, matching the reference's scroll feel.
 *
 * The reference runs Lenis too (its <html> carries the `lenis` class).
 * Lenis is MIT-licensed, so this is the real library rather than an
 * approximation of it.
 *
 * Two things have to be handed over when Lenis takes the scroll:
 * native `scroll-behavior: smooth` (they fight, and the native one
 * wins in a way that stutters), and same-page anchor clicks, which
 * must be routed through Lenis so the nav still lands on a section.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    root.classList.add("lenis");

    const lenis = new Lenis({
      duration: 1.05,
      // Slightly front-loaded ease-out: fast to start, long settle.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Anchor links: Lenis owns the scroll position, so letting the
    // browser jump would desync its internal offset.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href) return;

      const hash = href.startsWith("#")
        ? href
        : href.startsWith("/#") && window.location.pathname === "/"
          ? href.slice(1)
          : null;
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -88 });
      history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      root.classList.remove("lenis");
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);

  return null;
}
