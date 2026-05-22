"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { experience } from "@/lib/content";
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
                        <span className="text-ink-faint sm:hidden">
                          {" · "}
                          {role.period}
                        </span>
                      </span>
                    </span>
                    <PlusMinus open={isOpen} />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
