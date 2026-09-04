import { profile, projects } from "@/lib/content";
import { ArrowRight } from "./icons";
import Wordmark from "./Wordmark";

/** The cell the reference reserves for its newest incubation. */
const featured = projects[0];

/** Decorative isometric motif for the figure cell — the reference puts a
 *  wireframe object in a tick-framed box here. Drawn, not imported. */
function Motif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M60 14 84 28v28L60 70 36 56V28Z" />
      <path d="M60 42 84 28M60 42v28M60 42 36 28" />
      <path d="M36 56 12 70v28l24 14 24-14V70" />
      <path d="M84 56l24 14v28l-24 14-24-14" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative z-10 pt-16 lg:pt-[4.5rem]">
      <div className="shell">
        {/* The mark scales to its container, so its height is a function
            of the glyph count rather than a font-size that has to be
            re-tuned at every breakpoint. */}
        <div className="rule-b px-4 py-10 lg:px-6 lg:py-14">
          <Wordmark
            text="PORT_FOLIO"
            title={`${profile.name} — portfolio`}
            className="w-full text-ink"
          />
        </div>

        <div className="rule-b grid lg:grid-cols-4">
          <div className="flex flex-col justify-between gap-8 border-line-strong p-6 lg:border-r">
            <p className="flex gap-3 text-lg leading-snug">
              <span
                className="mt-2 size-2 shrink-0 bg-accent"
                aria-hidden="true"
              />
              <span>{profile.intro}</span>
            </p>
            <p className="label">
              {profile.role} / {profile.location}
            </p>
          </div>

          <div className="hidden items-center justify-center border-r border-line-strong p-6 lg:flex">
            <span className="frame-ticks block p-7">
              <Motif className="size-28 text-ink-faint" />
            </span>
          </div>

          {/* Opaque. A cell that holds copy is a panel sitting on the
              ruling, so the fixed rails must stop at its edge — only
              deliberately empty cells let the rails show through. */}
          <div className="bg-surface lg:col-span-2">
            <div className="rule-b flex">
              <span className="bg-accent px-4 py-2 text-xs uppercase tracking-[0.14em] text-accent-ink">
                New
              </span>
              <span className="border-x border-line-strong px-4 py-2 text-xs uppercase tracking-[0.14em]">
                {featured.facet}
              </span>
              <span className="px-4 py-2 text-xs uppercase tracking-[0.14em] text-ink-faint">
                {featured.year}
              </span>
            </div>
            <div className="p-6">
              <h2 className="text-2xl tracking-tight">{featured.name}</h2>
              <p className="mt-3 max-w-prose leading-relaxed text-ink-soft">
                {featured.blurb}
              </p>
            </div>
          </div>
        </div>

        <div className="rule-b grid lg:grid-cols-4">
          <div className="border-line-strong p-6 lg:border-r">
            <p className="label">Projects</p>
            <p className="mt-2 text-5xl tracking-tight tabular-nums">
              {String(projects.length).padStart(2, "0")}
            </p>
          </div>

          <div className="hidden border-r border-line-strong lg:block" />

          {/* Three stats, not four. The block spans two grid columns, so a
              fourth cell would push a label straight through the rail at
              the halfway rule — the reference shows three here for the
              same reason. */}
          <div className="grid grid-cols-3 bg-surface lg:col-span-2 lg:grid-cols-[repeat(3,1fr)_auto]">
            {featured.stats.slice(0, 3).map((s) => (
              <div
                key={s.label}
                className="border-t border-line-strong p-5 first:border-l-0 sm:border-l lg:border-t-0"
              >
                <p className="text-xl tracking-tight tabular-nums">{s.value}</p>
                <p className="label mt-1.5">{s.label}</p>
              </div>
            ))}
            {featured.link && (
              <a
                href={featured.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group col-span-3 flex items-center justify-center border-t border-line-strong p-5 transition-colors hover:bg-accent sm:border-l lg:col-span-1 lg:border-t-0 lg:px-8"
                aria-label={`${featured.name} — open project`}
              >
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent-ink" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
