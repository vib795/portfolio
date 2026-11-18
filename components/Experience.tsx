"use client";

import { useState } from "react";
import {
  certifications,
  education,
  experience,
  type Bullet,
} from "@/lib/content";
import Scramble from "./Scramble";

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span className="relative ml-auto flex size-8 shrink-0 items-center justify-center border border-line-strong transition-colors duration-200 group-hover:border-accent">
      <span className="absolute h-px w-3.5 bg-ink" />
      <span
        className={`absolute h-px w-3.5 bg-ink transition-transform duration-300 ${
          open ? "rotate-0" : "rotate-90"
        }`}
      />
    </span>
  );
}

/** The date column, then the content column, matching the role rows. */
function Line({
  period,
  className,
  children,
}: {
  period?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rule-b flex gap-5 bg-paper px-6 ${className ?? ""}`}>
      <span className="hidden w-40 shrink-0 text-sm text-ink-faint lg:block">
        {period}
      </span>
      <div className="min-w-0 flex-1">
        {children}
        {period && (
          <span className="mt-1 block text-sm text-ink-faint lg:hidden">
            {period}
          </span>
        )}
      </div>
    </div>
  );
}

function RoleRow({
  title,
  sub,
  period,
  points,
  open,
  onToggle,
}: {
  title: string;
  sub?: string;
  period?: string;
  points: Bullet[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    /* Opaque: a role row runs the full width, so the rails must stop at
       its edge rather than crossing the bullets. */
    <div className="rule-b bg-paper">
      <h4>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="group flex w-full items-center gap-5 p-6 text-left"
        >
          <span className="hidden w-40 shrink-0 text-sm text-ink-faint lg:block">
            {period}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xl tracking-tight transition-colors duration-200 group-hover:text-accent">
              {title}
            </span>
            {(sub || period) && (
              <span className="mt-1 block text-sm text-ink-soft">
                {sub}
                {period && (
                  <span className="text-ink-faint lg:hidden">
                    {sub ? " · " : ""}
                    {period}
                  </span>
                )}
              </span>
            )}
          </span>
          <PlusMinus open={open} />
        </button>
      </h4>
      {/* Stays mounted and is collapsed by CSS, so the text is in the
          server HTML rather than appearing only once a bundle has run.
          See `.accordion-panel` in globals.css. */}
      <div className="accordion-panel" data-open={open} aria-hidden={!open}>
        <div>
          <ul className="space-y-2.5 px-6 pb-8 lg:pl-[13.75rem]">
            {points.map((pt) => (
              <li key={pt.lead} className="flex gap-3">
                <span
                  className="mt-[0.55rem] size-1.5 shrink-0 bg-accent"
                  aria-hidden="true"
                />
                <span className="max-w-2xl leading-relaxed text-ink-soft">
                  <strong className="font-medium text-ink">{pt.lead}:</strong>{" "}
                  {pt.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const first = experience[0];
  const firstPos = first.positions[0];
  const [open, setOpen] = useState<string | null>(
    `${first.company}/${firstPos.title}/${firstPos.clientRoles?.[0]?.role ?? ""}`,
  );
  const toggle = (id: string) => setOpen((cur) => (cur === id ? null : id));

  return (
    <section id="experience" className="relative z-10">
      <div className="shell">
        <div className="rule-b grid lg:grid-cols-4">
          <div className="border-line-strong p-6 lg:border-r">
            <p className="fn-tag">utkarsh.experience()</p>
          </div>
          <div className="p-6 lg:col-span-3">
            <h2 className="slash-title text-4xl lg:text-6xl">
              <Scramble text="experience" />
            </h2>
          </div>
        </div>

        {/* Laid out like the resume: employer, then each title held there,
            then (at EY) the client roles under that title. */}
        {experience.map((emp) => (
          <div key={emp.company}>
            <Line period={emp.period} className="pb-4 pt-10">
              <h3 className="text-2xl tracking-tight lg:text-3xl">
                {emp.company}
                <span className="text-base text-ink-faint"> · {emp.meta}</span>
              </h3>
            </Line>

            {emp.positions.map((pos) => {
              const base = `${emp.company}/${pos.title}`;
              if (!pos.clientRoles) {
                const id = `${base}/`;
                return (
                  <RoleRow
                    key={id}
                    title={pos.title}
                    period={pos.period}
                    points={pos.points ?? []}
                    open={open === id}
                    onToggle={() => toggle(id)}
                  />
                );
              }
              return (
                <div key={base}>
                  <Line period={pos.period} className="py-3">
                    <p className="font-medium text-accent">{pos.title}</p>
                  </Line>
                  {pos.clientRoles.map((cr) => {
                    const id = `${base}/${cr.role}`;
                    return (
                      <RoleRow
                        key={id}
                        title={cr.role}
                        sub={`Client role · ${cr.client}`}
                        period={cr.period}
                        points={cr.points}
                        open={open === id}
                        onToggle={() => toggle(id)}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}

        {/* Education sits directly under the roles: the accordion jumps
            from Nov 2018 to Mar 2021, and the M.S. is what fills that
            gap. */}
        <div className="rule-b grid lg:grid-cols-4">
          <div className="border-line-strong p-6 lg:border-r">
            <p className="label">/ Education</p>
          </div>
          <div className="border-line-strong bg-paper lg:col-span-2 lg:border-r">
            {education.map((e, i) => (
              <div
                key={e.title}
                className={`flex flex-col gap-1 p-6 sm:flex-row sm:gap-6 ${
                  i > 0 ? "rule-t" : ""
                }`}
              >
                <span className="text-sm text-ink-faint sm:w-28 sm:shrink-0 sm:pt-0.5">
                  {e.period}
                </span>
                <span>
                  <span className="block tracking-tight">{e.title}</span>
                  <span className="mt-0.5 block text-sm text-ink-soft">
                    {e.org}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div className="p-6">
            <p className="label">/ Certifications</p>
            <ul className="mt-4 space-y-3">
              {certifications.map((c) => (
                <li
                  key={c}
                  className="flex gap-3 leading-relaxed text-ink-soft"
                >
                  <span
                    className="mt-2 size-1.5 shrink-0 bg-accent"
                    aria-hidden="true"
                  />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
