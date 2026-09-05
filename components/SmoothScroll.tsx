"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { glideTo, setLenis } from "@/lib/scroll";

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
    /* Reloading restores the previous scroll offset, which lands the page
       a few dozen pixels down with the hero mark clipped under the fixed
       nav and no gap above it — that reads as broken rather than as
       "where you left off". Reset only on an actual reload, and only when
       no hash is asking for a section: back/forward keeps its restored
       position, which is the one case where restoring is the right call.

       Runs before the reduced-motion bail below, so it applies whether or
       not Lenis ends up driving the scroll. */
    const [nav] = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    const wasReloaded = nav?.type === "reload" && !window.location.hash;
    if (wasReloaded) window.scrollTo(0, 0);

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

    // Published so the page transition can move the scroll behind its
    // own curtain without desyncing Lenis.
    setLenis(lenis);

    /* The reset above happens during hydration, but the browser can still
       apply its restored offset after that — enough to leave the page a
       few pixels down with Lenis anchored there. Repeat it through Lenis
       once it owns the scroll, so both agree on zero. */
    if (wasReloaded) lenis.scrollTo(0, { immediate: true });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Anchor links that the page transition did not claim. It listens
    // in the capture phase and stops propagation on the ones it takes,
    // so anything reaching here is an ordinary in-page link and gets an
    // ordinary smooth scroll. Lenis owns the scroll position either way,
    // so letting the browser jump would desync its internal offset.
    const onClick = (e: MouseEvent) => {
      // Already claimed by the page transition, which runs first.
      if (e.defaultPrevented) return;
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
      glideTo(target);
      history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      setLenis(null);
      lenis.destroy();
      root.classList.remove("lenis");
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);

  return null;
}
