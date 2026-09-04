"use client";

import { useMemo, useState } from "react";
import {
  projects,
  workFacets,
  type Project,
  type WorkFacet,
} from "@/lib/content";
import { ArrowRight, ArrowUpRight } from "./icons";
import Scramble from "./Scramble";
import ScrambleLink from "./ScrambleLink";

/**
 * One project, drawn the way the reference draws a portfolio company: a
 * tag chip sitting on the panel's top rule, a tall panel, then a 2x2
 * block of stats with a full-height arrow cell beside it.
 */
function ProjectCard({
  project,
  hidden,
}: {
  project: Project;
  hidden?: boolean;
}) {
  return (
    <article className="group" data-scramble-host hidden={hidden}>
      {/* Facet and year ride the panel's top rule together, the way the
          hero's featured cell chips its own row. The year is not
          decoration — it is how a reader dates the work, and the card
          is the only place it appears. */}
      <div className="flex">
        <span className="-mb-px border border-line-strong bg-paper px-3 py-1.5 text-xs uppercase tracking-[0.12em]">
          {project.facet}
        </span>
        <span className="-mb-px -ml-px border border-line-strong bg-paper px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-ink-faint">
          {project.year}
        </span>
      </div>

      <div className="flex min-h-[13rem] flex-col justify-center border border-line-strong bg-surface p-7 transition-colors duration-200 group-hover:bg-surface-sunken">
        <p className="label">{project.category}</p>
        <h3 className="mt-2 text-2xl tracking-tight">
          <ScrambleLink text={project.name} />
          {project.link && (
            <ArrowUpRight className="ml-2 inline size-4 text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
          )}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">
          {project.blurb}
        </p>
        <p className="mt-4 text-xs text-ink-faint">{project.stack.join(" · ")}</p>
      </div>

      {/* Stats in a 2x2 with the arrow beside them, full height — the
          reference's exact cell arrangement. The stats are their own
          nested grid rather than three columns on one grid: with five
          children in a three-column track the fourth stat wraps into the
          arrow's column and `row-span-2` never takes effect. */}
      {/* Opaque: a card is a panel laid on top of the ruling, so the fixed
          rails must not show through its stat cells the way they do
          through an empty grid cell. */}
      <div className="-mt-px grid grid-cols-[1fr_auto] border border-line-strong bg-surface transition-colors duration-200 group-hover:bg-surface-sunken">
        <div className="grid grid-cols-2">
          {project.stats.slice(0, 4).map((s, i) => (
            <div
              key={s.label}
              className={`p-4 ${i % 2 === 1 ? "border-l border-line-strong" : ""} ${
                i > 1 ? "border-t border-line-strong" : ""
              }`}
            >
              <p className="tracking-tight tabular-nums">{s.value}</p>
              <p className="label mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} — open project`}
            className="flex items-center justify-center border-l border-line-strong px-7 transition-colors hover:bg-accent hover:text-accent-ink"
          >
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        ) : (
          <div
            aria-hidden="true"
            className="flex items-center justify-center border-l border-line-strong px-7 text-ink-faint"
          >
            <ArrowRight className="size-5" />
          </div>
        )}
      </div>
    </article>
  );
}

export default function WorkGrid() {
  const [facet, setFacet] = useState<WorkFacet>("Featured");
  const [query, setQuery] = useState("");

  // Names of the projects the current filter admits — not a filtered
  // list. Every project is rendered either way; see below.
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      // A search looks across everything. The default tab shows four
      // projects, so honouring the facet here would mean typing
      // "python" and being told nothing matches while three Python
      // projects sit one tab away.
      if (!q) {
        // Featured cuts across the facets rather than being one of
        // them, so it is matched on its own flag, not on `p.facet`.
        if (facet === "Featured") return Boolean(p.featured);
        if (facet !== "All" && p.facet !== facet) return false;
        return true;
      }
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.blurb.toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [facet, query]);

  const visible = useMemo(() => new Set(shown.map((p) => p.name)), [shown]);

  return (
    <section id="work" className="relative z-10">
      <div className="shell">
        <div className="rule-b grid lg:grid-cols-4">
          <div className="border-line-strong p-6 lg:border-r">
            <p className="label">/ Selected work</p>
          </div>
          <div className="p-6 lg:col-span-3">
            <h2 className="text-3xl tracking-tight lg:text-4xl">
              <Scramble text="What I've shipped" />
            </h2>
          </div>
        </div>

        {/* The filter row is sticky under the header, exactly as the
            reference keeps its pills in view while the grid scrolls. */}
        <div className="rule-b sticky top-16 z-20 flex flex-col gap-4 bg-paper/95 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between lg:top-[4.5rem] lg:p-5">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter projects"
          >
            {workFacets.map((f) => {
              const active = f === facet;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFacet(f)}
                  aria-pressed={active}
                  className={`notch-sm px-4 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-inverse text-inverse-ink"
                      : "bg-surface text-ink-soft hover:text-ink"
                  }`}
                >
                  <ScrambleLink text={f} />
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-3 border border-line-strong bg-surface px-4 py-2.5 sm:w-72">
            <svg
              viewBox="0 0 16 16"
              className="size-4 shrink-0 text-ink-faint"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="m10.5 10.5 4 4" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search projects"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-faint"
            />
          </label>
        </div>

        <div className="rule-b grid gap-x-8 gap-y-10 p-4 sm:grid-cols-2 lg:gap-x-10 lg:p-6">
          {/* Every project is rendered, always; the filter only hides.
              Dropping the non-matching ones from the tree would take
              them out of the server HTML too, and with Featured as the
              default that means ten of the fourteen never reach a
              crawler or a reader without JS. Same contract as
              `.accordion-panel`: mounted, and hidden by CSS. `hidden`
              also takes a filtered card out of the tab order and off
              screen readers, which `display: none` alone would not
              guarantee. */}
          {projects.map((p) => (
            <ProjectCard
              key={p.name}
              project={p}
              hidden={!visible.has(p.name)}
            />
          ))}
          {shown.length === 0 && (
            <p className="py-16 text-center text-ink-faint sm:col-span-2">
              Nothing matches {`"${query}"`}.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
