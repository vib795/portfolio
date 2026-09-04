import { marquee } from "@/lib/content";

/**
 * The horizontal rail of names under the hero — the reference runs its
 * partner logos here, in bordered cells, desaturated until hover.
 *
 * Same construction as the wordmark marquee: two identical runs, a
 * -50% shift, no visible seam. Slower than the display mark (36s vs
 * 50s) because the items are small and a slow crawl reads as stalled.
 */
export default function TechRail() {
  return (
    <div className="rule-b overflow-hidden" aria-label="Core stack">
      <div className="marquee-track [animation-duration:36s]">
        {[0, 1].map((run) => (
          <div key={run} className="flex" aria-hidden={run === 1}>
            {marquee.map((item) => (
              <span
                key={item}
                className="desaturate flex shrink-0 items-center border-r border-line-strong px-10 py-6 text-sm uppercase tracking-[0.14em]"
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
