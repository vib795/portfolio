"use client";

import { useState } from "react";
import { certifications, education, experience } from "@/lib/content";
import Reveal from "./Reveal";
import SectionTag from "./SectionTag";

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span className="relative ml-auto flex size-8 shrink-0 items-center justify-center rounded-full border border-line transition-colors duration-300 group-hover:border-ink">
      <span className="absolute h-[1.5px] w-3.5 bg-ink" />
      <span
        className={`absolute h-[1.5px] w-3.5 bg-ink transition-transform duration-300 ${
          open ? "rotate-0" : "rotate-90"
        }`}
      />
    </span>
  );
}

export default function Experience() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="experience" className="border-t border-line">
      <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <Reveal>
          <SectionTag index="03" label="Experience" />
        </Reveal>
        <Reveal delay={0.05} className="mt-9">
          <h2 className="text-[clamp(2.2rem,5vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            Where I&apos;ve{" "}
            <span className="text-ink-faint">spent my time.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 border-b border-line lg:mt-16">
          {experience.map((role, i) => {
            const isOpen = open === i;
            return (
              <div key={role.period} className="border-t border-line">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center gap-5 py-6 text-left sm:gap-8 sm:py-7"
                  >
                    <span className="hidden w-32 shrink-0 font-mono text-sm text-ink-faint sm:block">
                      {role.period}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xl font-medium tracking-tight transition-colors duration-200 group-hover:text-accent sm:text-2xl">
                        {role.role}
                      </span>
                      <span className="mt-0.5 block font-mono text-sm text-ink-soft">
                        {role.company}
                        {role.client && (
                          <span className="text-ink-faint">
                            {" · "}
                            {role.client}
                          </span>
                        )}
                        <span className="text-ink-faint sm:hidden">
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
                    <div className="pb-8 sm:pl-40">
                      <p className="max-w-2xl text-ink-soft">{role.summary}</p>
                      <ul className="mt-4 space-y-2.5">
                        {role.points.map((pt) => (
                          <li key={pt} className="flex gap-3">
                            <span className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-accent" />
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
        </Reveal>

        {/* Education sits directly under the roles: the accordion jumps from
            Nov 2018 to Mar 2021, and the M.S. is what fills that gap. */}
        <Reveal
          delay={0.15}
          className="mt-16 grid gap-x-12 gap-y-10 lg:mt-20 lg:grid-cols-12"
        >
          <div className="lg:col-span-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
              / Education
            </p>
            <dl className="mt-3">
              {education.map((e) => (
                <div
                  key={e.title}
                  className="flex flex-col gap-1 border-t border-line py-4 sm:flex-row sm:gap-6"
                >
                  <dt className="font-mono text-sm text-ink-faint sm:w-28 sm:shrink-0 sm:pt-0.5">
                    {e.period}
                  </dt>
                  <dd>
                    <span className="block font-medium tracking-tight">
                      {e.title}
                    </span>
                    <span className="mt-0.5 block font-mono text-sm text-ink-soft">
                      {e.org}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
              / Certifications
            </p>
            <ul className="mt-3">
              {certifications.map((c) => (
                <li
                  key={c}
                  className="flex gap-3 border-t border-line py-4 leading-relaxed text-ink-soft"
                >
                  <span className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
