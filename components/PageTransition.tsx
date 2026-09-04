"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname, useRouter } from "next/navigation";
import { seeded } from "@/lib/scramble";

/** Six columns: four over the module grid, one per gutter. */
const COLS = 6;

/** Each column is a 3 × 6 mosaic. The reference's is exactly this. */
const PIXELS = 18;

/** ms — cols 1.1s + the 0.2s random stagger, plus the border's lead-in. */
const COVER_MS = 1350;

/** ms — the same run in reverse, after which the layer stops painting. */
const CLEAR_MS = 1500;

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
  const router = useRouter();
  const pathname = usePathname();
  const busy = useRef(false);
  const first = useRef(true);

  // Let the load-clear finish, then stop painting the layer entirely.
  useEffect(() => {
    if (state !== "clear") return;
    const t = window.setTimeout(() => setState("idle"), CLEAR_MS);
    return () => clearTimeout(t);
  }, [state]);

  // A route landed. Uncover it.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
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

      // The reference's own predicate, verbatim in intent: same origin,
      // not an in-page anchor, not a new tab, not where we already are.
      // In-page anchors are excluded because they belong to the smooth
      // scroll — curtaining a jump to #work would be absurd.
      if (
        href.includes("#") ||
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        link.origin !== window.location.origin ||
        link.pathname === window.location.pathname
      )
        return;

      if (busy.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      e.preventDefault();
      busy.current = true;
      setState("cover");
      window.setTimeout(
        () => router.push(link.pathname + link.search),
        COVER_MS,
      );
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  if (state === "idle") return null;

  return (
    <div className="page-transition" data-state={state} aria-hidden="true">
      {Array.from({ length: COLS }, (_, c) => (
        <div
          key={c}
          className="pt-col"
          // 0–0.2s, the reference's `stagger: { from: "random", amount: 0.2 }`.
          style={{ "--d": `${(seeded(c + 1) * 0.2).toFixed(3)}s` } as CSSProperties}
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
