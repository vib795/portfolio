import { projects, type Project } from "@/lib/content";
import Reveal from "./Reveal";
import SectionTag from "./SectionTag";
import { ArrowUpRight } from "./icons";

function Motif({ index }: { index: number }) {
  const base = "var(--line-strong)";
  const accent = "var(--accent)";
  const cls =
    "absolute inset-0 size-full transition-transform duration-500 group-hover:scale-[1.04]";

  switch (index % 6) {
    case 0:
      return (
        <svg viewBox="0 0 320 200" className={cls} fill="none" aria-hidden="true">
          <circle cx="160" cy="103" r="24" stroke={base} strokeWidth="1.5" />
          <circle cx="160" cy="103" r="48" stroke={base} strokeWidth="1.5" />
          <circle cx="160" cy="103" r="72" stroke={base} strokeWidth="1.5" />
          <circle cx="160" cy="103" r="9" fill={accent} />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 320 200" className={cls} fill="none" aria-hidden="true">
          <line x1="44" y1="152" x2="276" y2="152" stroke={base} strokeWidth="1.5" />
          <polyline
            points="52,132 96,90 138,116 182,64 224,100 268,56"
            stroke={base}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="268" cy="56" r="6" fill={accent} />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 320 200" className={cls} fill="none" aria-hidden="true">
          {[56, 86, 116, 146].map((y, i) => (
            <path
              key={y}
              d={`M12 ${y} C 96 ${y - 28}, 224 ${y + 28}, 308 ${y}`}
              stroke={i === 1 ? accent : base}
              strokeWidth="1.5"
            />
          ))}
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 320 200" className={cls} fill="none" aria-hidden="true">
          <g stroke={base} strokeWidth="1.5">
            <line x1="74" y1="66" x2="160" y2="106" />
            <line x1="160" y1="106" x2="250" y2="60" />
            <line x1="160" y1="106" x2="106" y2="150" />
            <line x1="160" y1="106" x2="232" y2="146" />
          </g>
          <g fill="var(--paper)" stroke={base} strokeWidth="1.5">
            <circle cx="74" cy="66" r="11" />
            <circle cx="250" cy="60" r="11" />
            <circle cx="106" cy="150" r="11" />
            <circle cx="232" cy="146" r="11" />
          </g>
          <circle cx="160" cy="106" r="14" fill={accent} />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 320 200" className={cls} fill="none" aria-hidden="true">
          <line x1="44" y1="158" x2="276" y2="158" stroke={base} strokeWidth="1.5" />
          {[
            [66, 58],
            [102, 94],
            [138, 46],
            [174, 110],
            [210, 74],
            [246, 126],
          ].map(([x, h], i) => (
            <rect
              key={x}
              x={x}
              y={158 - h}
              width="22"
              height={h}
              rx="3"
              fill={i === 3 ? accent : "none"}
              stroke={base}
              strokeWidth="1.5"
            />
          ))}
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 320 200" className={cls} fill="none" aria-hidden="true">
          <rect
            x="98"
            y="40"
            width="124"
            height="120"
            rx="8"
            stroke={base}
            strokeWidth="1.5"
          />
          {[66, 86, 106, 126].map((y, i) => (
            <line
              key={y}
              x1="120"
              y1={y}
              x2={i === 0 ? 188 : i === 3 ? 164 : 200}
              y2={y}
              stroke={i === 0 ? accent : base}
              strokeWidth={i === 0 ? 3 : 2}
              strokeLinecap="round"
            />
          ))}
        </svg>
      );
  }
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  const inner = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface-sunken transition-colors duration-300 group-hover:border-ink">
        <Motif index={index} />
        <span className="absolute left-5 top-4 font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
          {num}
        </span>
        <span className="absolute right-5 top-4 font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
          {project.category}
        </span>
        {project.link && (
          <span className="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full border border-line bg-paper text-ink transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-cream">
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        )}
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="text-[1.6rem] font-medium tracking-tight transition-colors duration-300 group-hover:text-accent">
          {project.name}
        </h3>
        <span className="font-mono text-sm text-ink-faint">{project.year}</span>
      </div>
      <p className="mt-2.5 max-w-prose leading-relaxed text-ink-soft">
        {project.blurb}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ink-soft"
          >
            {s}
          </span>
        ))}
      </div>
    </>
  );

  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        {inner}
      </a>
    );
  }
  return <div className="group block">{inner}</div>;
}

export default function Work() {
  return (
    <section id="work" className="border-t border-line bg-paper-dim">
      <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <Reveal>
          <SectionTag index="02" label="Selected Work" />
        </Reveal>
        <Reveal delay={0.05} className="mt-9">
          <h2 className="text-[clamp(2.2rem,5vw,4.25rem)] font-bold leading-[1.04] tracking-[-0.03em]">
            Recent work{" "}
            <span className="text-ink-faint">in AI and systems.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:gap-y-16">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={(i % 2) * 0.08}>
              <ProjectCard project={p} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
