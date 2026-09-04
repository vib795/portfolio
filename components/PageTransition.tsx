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
 * ms — columns 0.72s + the 0.14s random stagger, plus the border's lead.
 *
 * The reference runs 1.1s columns on a 0.2s stagger, but it is masking a
 * real page load: every navigation there is a round trip, and the
 * curtain is covering time the reader would spend waiting anyway. These
 * routes are prerendered and arrive instantly, so the same timing is
 * just a wall. Two thirds of it keeps the gesture and drops the wait.
 */
const COVER_MS = 900;

/** ms — the same run in reverse, after which the layer stops painting. */
const CLEAR_MS = 1000;

/**
 * A same-page jump runs the curtain at 0.6x.
 *
 * The full timing is calibrated to a route change, where the curtain is
 * also covering a navigation the reader would otherwise wait through.
 * Jumping to a section three screens down has no such wait to mask, and
 * at full speed the ceremony costs more than the move is worth.
 */
const FAST = 0.6;
const COVER_FAST_MS = Math.round(COVER_MS * FAST);
const CLEAR_FAST_MS = Math.round(CLEAR_MS * FAST);

/**
 * The share of pixels along a column's leading edge that dissolve rather
 * than arriving square. The reference filters its pixel list at 0.75.
 */
const DISSOLVE_P = 0.75;

/**
 * The orange curtain the reference draws across a page navigation.
 *
 * Six columns rise from the bottom of the viewport on a randomised
 * stagger, hold, then collapse to the top on the page that follows. Each
 * column carries a 3 × 6 grid of accent squares, and the five squares at
 * its leading edge fade in (or out) individually — so the edge of the
 * curtain pixelates rather than arriving as a clean line. A one-pixel
 * rule in the deeper accent rides the right edge of every column,
 * sliding vertically a beat ahead of the column itself.
 *
 * Two things are deliberate here:
 *
 * The clear direction is server-rendered and runs on CSS alone. The
 * curtain is in the HTML at rest and animates away without waiting for a
 * bundle, which is why a full page load never flashes uncovered content
 * first. `animation-fill-mode: both` leaves it at `scaleY(0)`, so even if
 * the JS never arrives it ends up out of the way.
 *
 * Every delay is derived from a seeded hash rather than `Math.random()`.
 * The stagger has to look random and be *identical* on the server and on
 * the client, or hydration tears.
 */
export default function PageTransition() {
  const [state, setState] = useState<"cover" | "clear" | "idle">("clear");
  const [fast, setFast] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const busy = useRef(false);
  const first = useRef(true);
  /** Hash to land on once a route change completes, if the link had one. */
  const pendingHash = useRef<string | null>(null);

  // Let the clear finish, then stop painting the layer entirely.
  useEffect(() => {
    if (state !== "clear") return;
    const t = window.setTimeout(
      () => setState("idle"),
      fast ? CLEAR_FAST_MS : CLEAR_MS,
    );
    return () => clearTimeout(t);
  }, [state, fast]);

  // A route landed. Put the reader where the link pointed, then uncover.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const hash = pendingHash.current;
    pendingHash.current = null;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) jumpTo(target);
    }
    busy.current = false;
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

      // A jump inside this page. The reference leaves these to its
      // smooth scroll and curtains only route changes, which is why its
      // nav behaves two different ways depending on which item you
      // press. Covering both makes the bar answer consistently — and
      // because the curtain hides the movement, the jump underneath is
      // instant rather than a long scroll the reader cannot see anyway.
      if (samePage) {
        const destination = document.querySelector(hash as string);
        if (!destination) return;

        e.preventDefault();
        // preventDefault, but never stop propagation. This listener
        // is on the document in the capture phase, so it runs ahead of
        // React's root listener — halting the event here would swallow
        // the component's own onClick, and a mobile menu link would
        // curtain without ever closing the menu behind it. SmoothScroll
        // checks `defaultPrevented` instead, which stands it down.
        busy.current = true;
        setFast(true);
        setState("cover");
        window.setTimeout(() => {
          jumpTo(destination);
          history.pushState(null, "", hash);
          busy.current = false;
          setState("clear");
        }, COVER_FAST_MS);
        return;
      }

      // A real route change — including one carrying a hash, which is
      // how the logo gets you home from /blog. Matching on the hash
      // alone used to drop that case out of the transition entirely.
      e.preventDefault();
      busy.current = true;
      pendingHash.current = hash;
      setFast(false);
      setState("cover");
      window.setTimeout(
        () => router.push(link.pathname + link.search),
        COVER_MS,
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
          // 0–0.14s: the reference's random 0.2s stagger, scaled with the rest.
          style={{ "--d": `${(seeded(c + 1) * 0.14).toFixed(3)}s` } as CSSProperties}
        >
          {Array.from({ length: PIXELS }, (_, p) => {
            const n = c * PIXELS + p;
            // Only the leading edge dissolves: the top row on the way in,
            // the bottom rows on the way out. The body of the column is a
            // solid block, which is what makes the edge read as an edge.
            const edge = state === "cover" ? p <= 4 : p >= 13;
            const dissolves = edge && seeded(n + 100) < DISSOLVE_P;
            return (
              <span
                key={p}
                className="pt-px"
                data-dissolve={dissolves || undefined}
                style={
                  { "--pd": `${(seeded(n + 200)).toFixed(3)}s` } as CSSProperties
                }
              />
            );
          })}
          <span className="pt-border" />
        </div>
      ))}
    </div>
  );
}
