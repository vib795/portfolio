import { about } from "@/lib/content";
import Reveal from "./Reveal";
import SectionTag from "./SectionTag";

export default function About() {
  return (
    <section id="about">
      <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <Reveal>
          <SectionTag index="01" label="About" />
        </Reveal>

        <Reveal delay={0.05} className="mt-9">
          <h2 className="max-w-[18ch] text-[clamp(2.2rem,5vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            {about.heading.lead}{" "}
            <span className="text-ink-faint">{about.heading.tail}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-x-12 gap-y-12 lg:mt-20 lg:grid-cols-12">
          <Reveal delay={0.1} className="lg:col-span-6">
            <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-5 lg:col-start-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
              / Toolkit
            </p>
            <dl className="mt-3">
              {about.stack.map((g) => (
                <div
                  key={g.label}
                  className="flex flex-col gap-1 border-t border-line py-4 sm:flex-row sm:gap-6"
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.14em] text-ink sm:w-28 sm:shrink-0 sm:pt-1">
                    {g.label}
                  </dt>
                  <dd className="text-ink-soft">{g.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
