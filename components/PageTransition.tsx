"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname, useRouter } from "next/navigation";
import { seeded } from "@/lib/scramble";
import { jumpTo } from "@/lib/scroll";

/** Six columns: four over the module grid, one per gutter. */
const COLS = 6;

/** Each column is a 3 × 6 mosaic. The reference's is exactly this. */
const PIXELS = 18;

/**
 * ms for a whole sweep: in, a beat at full cover, and out.
 *
 * The reference spends 1.1s on the cover alone, but it is masking a real
 * page load — every navigation there is a round trip, and the curtain is
 * covering time the reader would wait through anyway. These routes are
 * prerendered and arrive in a frame, so the same timing is not drama, it
 * is a queue.
 */
const SWEEP_MS = 780;

/** ms — the widest column stagger, added to every total below. */
const STAGGER_MS = 80;

/**
 * ms into a sweep at which every column is down.
 *
 * The keyframe holds full cover from 42% to 58%, but each column starts
 * up to STAGGER_MS late — so the window where *all* of them are down is
 * the intersection, not the keyframe's own hold. Swapping the route at
 * the nominal midpoint let the last column swap a sliver of the page in
 * plain view.
 */
const MID_MS = Math.round(SWEEP_MS * 0.5 + STAGGER_MS * 0.5);

/** ms — the load reveal, which is the back half of a sweep on its own. */
const CLEAR_MS = 560;

/**
 * A same-page jump runs the whole thing at 0.62x.
 *
 * The full timing is calibrated to a route change, where the curtain is
 * also covering a render. Jumping to a section on this page has nothing
 * to cover, so the same duration is pure ceremony.
 */
const FAST = 0.62;

/**
 * The share of squares along a column's edges that are punched out.
 * The reference filters its pixel list at 0.75.
 */
const DISSOLVE_P = 0.75;

/** Rows deep the erosion reaches at each end of a column. */
const EDGE = 5;

/**
 * The orange curtain drawn across a navigation.
 *
 * Six columns aligned to the module grid, each a 3 × 6 mosaic of accent
 * squares with a 1px rule in the deeper accent down its right edge. They
 * travel up the viewport on a randomised stagger: in from below, a beat
 * at full cover while the route changes behind them, then out through
 * the top.
 *
 * The single most important thing here is that this is ONE animation.
 *
 * It used to be two — a cover that scaled from the bottom, then a clear
 * that scaled from the top — and the handoff was visible as a lurch. Two
 * separate causes, both fixed by collapsing them into one keyframe:
 * the second animation restarted from scratch rather than continuing the
 * first, and the eroded squares switched from the top rows to the bottom
 * rows between phases, so half the mosaic popped. Now the columns simply
 * keep moving in one direction and never reverse, and the erosion is
 * baked into both ends at once and never changes.
 *
 * Two other things are deliberate:
 *
 * The load reveal is server-rendered and runs on CSS alone. The curtain
 * is in the HTML at rest and animates away without waiting for a bundle,
 * which is why a cold load never flashes uncovered content first.
 * `animation-fill-mode: both` parks it off-screen, so even if the JS
 * never arrives it ends up out of the way.
 *
 * Every delay comes from a seeded hash rather than `Math.random()`. The
 * stagger has to look random and be *identical* on the server and the
 * client, or hydration tears.
 */
export default function PageTransition() {
  const [state, setState] = useState<"sweep" | "clear" | "idle">("clear");
  const [fast, setFast] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const busy = useRef(false);
  const first = useRef(true);

  // Stop painting the layer once whatever is running has finished.
  useEffect(() => {
    if (state === "idle") return;
    const base = state === "sweep" ? SWEEP_MS : CLEAR_MS;
    const total = (base + STAGGER_MS) * (fast ? FAST : 1);
    const t = window.setTimeout(() => {
      busy.current = false;
      setState("idle");
    }, total);
    return () => clearTimeout(t);
  }, [state, fast]);

  // Browser back and forward change the route without a click. A sweep
  // already covers its own route change, so this only has to catch the
  // navigations nothing else is driving.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (busy.current) return;
    setFast(false);
    setState("clear");
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Anything the browser would treat as "open elsewhere" is left
      // alone — a middle click, a modified click, a new tab.
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;

      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a");
      if (!(link instanceof HTMLAnchorElement)) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Never ours: another origin, a new tab, a download.
      if (
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        link.origin !== window.location.origin
      )
        return;

      if (busy.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const samePage = link.pathname === window.location.pathname;
      const hash = link.hash && link.hash !== "#" ? link.hash : null;

      // Already here, and pointing nowhere in particular.
      if (samePage && !hash) return;

      const destination = samePage ? document.querySelector(hash as string) : null;
      if (samePage && !destination) return;

      // preventDefault, but never stop propagation. This listener is on
      // the document in the capture phase, so it runs ahead of React's
      // root listener — halting the event here would swallow the
      // component's own onClick, and a mobile menu link would sweep
      // without ever closing the menu behind it. SmoothScroll checks
      // `defaultPrevented` instead, which stands it down.
      e.preventDefault();
      busy.current = true;

      // A same-page jump gets the quick sweep. The reference leaves
      // these to its smooth scroll and curtains only route changes,
      // which is why its nav answers two different ways depending on
      // which item you press. Covering both makes the bar consistent —
      // and because the curtain hides the movement, the jump underneath
      // is instant rather than a long scroll nobody can see.
      const quick = samePage;
      setFast(quick);
      setState("sweep");

      // Fire at full cover, in the beat the keyframe holds for exactly
      // this. Before it the change would show; after it the curtain has
      // already started lifting on the old page.
      window.setTimeout(
        () => {
          if (samePage) {
            jumpTo(destination as Element);
            history.pushState(null, "", hash);
            return;
          }
          router.push(link.pathname + link.search + (hash ?? ""));
        },
        MID_MS * (quick ? FAST : 1),
      );
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  if (state === "idle") return null;

  return (
    <div
      className="page-transition"
      data-state={state}
      data-speed={fast ? "fast" : undefined}
      aria-hidden="true"
    >
      {Array.from({ length: COLS }, (_, c) => (
        <div
          key={c}
          className="pt-col"
          style={
            {
              "--d": `${(seeded(c + 1) * (STAGGER_MS / 1000)).toFixed(3)}s`,
            } as CSSProperties
          }
        >
          {Array.from({ length: PIXELS }, (_, p) => {
            const n = c * PIXELS + p;
            // Both ends are eroded, always. Recomputing this per phase
            // is what used to make half the mosaic pop mid-transition.
            const edge = p < EDGE || p >= PIXELS - EDGE;
            const punched = edge && seeded(n + 100) < DISSOLVE_P;
            return (
              <span key={p} className="pt-px" data-punched={punched || undefined} />
            );
          })}
          <span className="pt-border" />
        </div>
      ))}
    </div>
  );
}
