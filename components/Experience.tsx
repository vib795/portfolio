"use client";

import { useState } from "react";
import { certifications, education, experience } from "@/lib/content";
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

export default function Experience() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="experience" className="relative z-10">
      <div className="shell">
        <div className="rule-b grid lg:grid-cols-4">
          <div className="border-line-strong p-6 lg:border-r">
            <p className="label">/ Experience</p>
          </div>
          <div className="p-6 lg:col-span-3">
            <h2 className="text-3xl tracking-tight lg:text-4xl">
              <Scramble text="Where I've spent my time" />
            </h2>
          </div>
        </div>

        {experience.map((role, i) => {
          const isOpen = open === i;
          return (
            /* Opaque: a role row runs the full width, so the rails must
               stop at its edge rather than crossing the bullets. */
            <div key={role.period} className="rule-b bg-paper">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-5 p-6 text-left"
                >
                  <span className="hidden w-40 shrink-0 text-sm text-ink-faint lg:block">
                    {role.period}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xl tracking-tight transition-colors duration-200 group-hover:text-accent">
                      {role.role}
                    </span>
                    <span className="mt-1 block text-sm text-ink-soft">
                      {role.company}
                      {role.client && (
                        <span className="text-ink-faint">
                          {" · "}
                          {role.client}
                        </span>
                      )}
                      <span className="text-ink-faint lg:hidden">
                        {" · "}
                        {role.period}
                      </span>
                    </span>
                  </span>
                  <PlusMinus open={isOpen} />
                </button>
              </h3>
              {/* Stays mounted and is collapsed by CSS, so the text is in
                  the server HTML rather than appearing only once a bundle
                  has run. See `.accordion-panel` in globals.css. */}
              <div
                className="accordion-panel"
                data-open={isOpen}
                aria-hidden={!isOpen}
              >
                <div>
                  <div className="px-6 pb-8 lg:pl-[13.75rem]">
                    <p className="max-w-2xl text-ink-soft">{role.summary}</p>
                    <ul className="mt-4 space-y-2.5">
                      {role.points.map((pt) => (
                        <li key={pt} className="flex gap-3">
                          <span
                            className="mt-[0.55rem] size-1.5 shrink-0 bg-accent"
                            aria-hidden="true"
                          />
                          <span className="max-w-2xl leading-relaxed text-ink-soft">
                            {pt}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

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
