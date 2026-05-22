import { contact, profile, socials } from "@/lib/content";
import Reveal from "./Reveal";
import SectionTag from "./SectionTag";
import { ArrowUpRight } from "./icons";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden bg-dark text-cream"
    >
      <div className="absolute inset-0 -z-10 bg-grid-dark opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000,transparent)]" />
      <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-44">
        <Reveal>
          <SectionTag index="04" label="Contact" tone="cream" />
        </Reveal>

        <Reveal delay={0.05} className="mt-9">
          <h2 className="max-w-[16ch] text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[1.03] tracking-[-0.03em]">
            {contact.heading.lead}{" "}
            <span className="text-cream-soft">{contact.heading.tail}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-7 max-w-xl">
          <p className="text-lg leading-relaxed text-cream-soft">
            {contact.body}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12 lg:mt-16">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center gap-3 sm:gap-5"
          >
            <span className="link-line text-[clamp(1.6rem,5.4vw,3.6rem)] font-medium tracking-tight">
              {profile.email}
            </span>
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-dark-line transition-colors duration-300 group-hover:border-accent group-hover:bg-accent sm:size-16">
              <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:size-6" />
            </span>
          </a>
        </Reveal>

        <Reveal
          delay={0.2}
          className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-dark-line pt-7 lg:mt-20"
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.12em] text-cream-soft transition-colors hover:text-cream"
            >
              <span className="link-line">{s.label}</span>
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
