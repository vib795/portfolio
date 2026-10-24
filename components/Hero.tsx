import { profile, projects } from "@/lib/content";
import { ArrowRight, ArrowUpRight } from "./icons";
import HeroWordmark from "./HeroWordmark";
import Ticker from "./Ticker";

const featured = projects[0];

/** Five flat squares hung off the wordmark's top-right corner, each
 *  winking out on its own clock. */
const CLUSTER = [
  { x: 0, y: 0, tone: 1, dur: 5.2, delay: 0.4 },
  { x: 1, y: 0, tone: 1, dur: 6.1, delay: 2.1 },
  { x: 1, y: 1, tone: 1, dur: 4.7, delay: 1.2 },
  { x: 2, y: 1, tone: 2, dur: 7.3, delay: 3.4 },
  { x: 0, y: 2, tone: 4, dur: 5.9, delay: 0.9 },
];

export default function Hero() {
  return (
    <section id="top" className="relative z-10 pt-24 lg:pt-[6.5rem]">
      <div className="shell">
        <div className="rule-b relative py-7 lg:py-9">
          <HeroWordmark
            text="PORTFOLIO"
            title={`${profile.name} — portfolio`}
            className="relative"
          />
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 hidden grid-cols-3 sm:grid lg:right-6 lg:top-5"
          >
            {CLUSTER.map((p, i) => (
              <span
                key={i}
                className="px-wink size-3 lg:size-5"
                style={
                  {
                    gridColumn: p.x + 1,
                    gridRow: p.y + 1,
                    background: `var(--px-${p.tone})`,
                    "--dur": `${p.dur}s`,
                    "--delay": `${p.delay}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </span>
        </div>

        <div className="rule-b grid lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-12 border-line-strong p-6 lg:border-r">
            <p className="flex flex-wrap justify-between gap-x-6 gap-y-2 font-mono text-sm">
              <span>
                {profile.location.toLowerCase()} / {profile.role.toLowerCase()}
              </span>
              <span>
                open-to-work
                <span className="caret" aria-hidden="true" />
              </span>
            </p>
            <h1 className="slash-title text-5xl leading-none sm:text-6xl lg:text-7xl">
              now-shipping
            </h1>
          </div>

          <div className="flex flex-col bg-paper" data-trail-ignore>
            <p className="p-6 text-xl leading-snug text-ink-soft lg:text-2xl">
              {profile.intro}
            </p>
            <div className="mt-auto flex flex-col gap-3 border-t border-line-strong p-6">
              <a
                href="#work"
                className="notch-lg group flex items-center justify-between bg-accent px-5 py-5 text-accent-ink transition-colors hover:bg-accent-deep"
              >
                See what I&apos;ve shipped
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#play"
                className="notch-lg group flex items-center justify-between border border-line-strong bg-surface px-5 py-4 text-ink transition-colors hover:border-ink"
              >
                Play commit-streak
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* The open field. Graph paper on the same 16px pitch the cursor
            trail snaps to, so the squares land in the cells. */}
        <div className="rule-b bg-paper-grid relative grid min-h-[18rem] lg:grid-cols-2">
          <p className="hidden self-end p-6 font-mono text-xs text-ink-faint lg:block">
            move your cursor here ↘
          </p>
          <div className="flex items-end p-4 lg:p-6">
            <article
              className="w-full border border-line-strong bg-surface"
              data-trail-ignore
            >
              <div className="flex border-b border-line-strong font-mono text-xs">
                <span className="bg-accent px-3 py-2 text-accent-ink">new</span>
                <span className="border-r border-line-strong px-3 py-2">
                  {featured.facet.toLowerCase()}
                </span>
                <span className="px-3 py-2 text-ink-faint">{featured.year}</span>
              </div>
              <div className="p-5">
                <h2 className="text-2xl tracking-tight">{featured.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                  {featured.blurb}
                </p>
              </div>
              <div className="grid grid-cols-3 border-t border-line-strong">
                {featured.stats.slice(0, 3).map((s, i) => (
                  <div
                    key={s.label}
                    className={`p-4 ${i ? "border-l border-line-strong" : ""}`}
                  >
                    <p className="tracking-tight tabular-nums">{s.value}</p>
                    <p className="label mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>

        <Ticker />
      </div>
    </section>
  );
}
