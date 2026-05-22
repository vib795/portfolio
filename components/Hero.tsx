import { profile, socials } from "@/lib/content";
import { ArrowRight, ArrowUpRight } from "./icons";
import ParticleName from "./ParticleName";

function Rings({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="110" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="14" fill="var(--accent)" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden pb-20 pt-32"
    >
      <div className="absolute inset-0 -z-20 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_72%_58%_at_50%_30%,#000,transparent)]" />
      <Rings className="pointer-events-none absolute -right-44 -top-24 -z-10 h-[32rem] w-[32rem] text-line-strong" />
      <div className="pointer-events-none absolute -left-24 bottom-0 -z-10 size-[26rem] rounded-full bg-accent/[0.07] blur-3xl" />

      <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <div
          className="rise-in flex items-center gap-3"
          style={{ animationDelay: "0.05s" }}
        >
          <span className="size-2 rounded-full bg-accent" />
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-ink-soft">
            {profile.role}
            <span className="text-ink-faint"> — Portfolio 2026</span>
          </span>
        </div>

        <div className="mt-8 grid gap-x-12 gap-y-9 lg:mt-10 lg:grid-cols-12 lg:items-end">
          <ParticleName
            first={profile.first}
            last={profile.last}
            className="lg:col-span-7"
          />

          <div
            className="rise-in lg:col-span-5 lg:pb-3"
            style={{ animationDelay: "0.34s" }}
          >
            <p className="max-w-md text-lg leading-relaxed text-ink-soft sm:text-xl">
              {profile.intro}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="#work"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 font-mono text-xs uppercase tracking-[0.16em] text-cream transition-colors hover:bg-accent"
              >
                Selected work
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                className="link-line font-mono text-xs uppercase tracking-[0.16em] text-ink"
              >
                Get in touch
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-ink-faint transition-colors hover:text-ink"
                >
                  {s.label}
                  <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="rise-in mt-14 flex items-center justify-between border-t border-line pt-5 lg:mt-20"
          style={{ animationDelay: "0.48s" }}
        >
          <span className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {profile.availability}
          </span>
          <span className="hidden font-mono text-xs uppercase tracking-[0.16em] text-ink-faint sm:block">
            {profile.location}
          </span>
        </div>
      </div>
    </section>
  );
}
