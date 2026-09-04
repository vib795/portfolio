import { navLinks, profile, socials } from "@/lib/content";
import { ArrowUpRight } from "./icons";
import ScrambleLink from "./ScrambleLink";
import Wordmark from "./Wordmark";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="relative z-10">
      <div className="shell">
        <div className="rule-t rule-b grid sm:grid-cols-2 lg:grid-cols-4">
          <nav className="border-line-strong p-6 lg:border-r">
            <p className="label">Navigate</p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-ink-soft transition-colors hover:text-accent"
                  >
                    <ScrambleLink text={l.label} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-line-strong p-6 lg:border-r">
            <p className="label">Contact</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-sm text-ink-soft transition-colors hover:text-accent"
                >
                  <ScrambleLink text={profile.email} />
                </a>
              </li>
              <li className="text-sm text-ink-soft">{profile.location}</li>
              <li className="text-sm text-ink-faint">{profile.availability}</li>
            </ul>
          </div>

          <div className="border-line-strong p-6 lg:border-r">
            <p className="label">Colophon</p>
            <ul className="mt-5 space-y-3 text-sm text-ink-soft">
              <li>Next.js · Tailwind</li>
              <li>Roboto Mono</li>
              <li>Wordmark drawn as SVG</li>
            </ul>
          </div>

          <div className="p-6">
            <p className="label text-right">Elsewhere</p>
            <ul className="mt-5 space-y-3 text-right">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm uppercase tracking-[0.12em] text-ink-soft transition-colors hover:text-accent"
                  >
                    <ScrambleLink text={s.label} />
                    <ArrowUpRight className="size-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rule-b grid lg:grid-cols-4">
          <p className="label border-line-strong p-6 lg:border-r">© {year}</p>
          <p className="label p-6 lg:col-span-3">
            All rights reserved by {profile.name}
          </p>
        </div>

        {/* The mark is sliced by the column rules rather than centred in a
            cell — the rules run behind it and reappear in the counters. */}
        <div className="relative">
          <div className="grid grid-cols-2 lg:grid-cols-4" aria-hidden="true">
            <span className="aspect-[2/1] border-r border-line-strong lg:aspect-[3/4]" />
            <span className="aspect-[2/1] border-line-strong lg:aspect-[3/4] lg:border-r" />
            <span className="hidden border-r border-line-strong lg:block" />
            <span className="hidden lg:block" />
          </div>

          <div className="absolute inset-0 flex items-center px-6 py-10 lg:px-10">
            <Wordmark
              text={profile.last}
              title={profile.name}
              className="w-full text-ink"
            />
          </div>

          <span
            className="absolute left-5 top-5 size-2.5 bg-accent"
            aria-hidden="true"
          />
          <span
            className="absolute right-5 top-5 size-2.5 bg-accent"
            aria-hidden="true"
          />
          <span
            className="absolute bottom-5 left-5 size-2.5 bg-accent"
            aria-hidden="true"
          />
          <span
            className="absolute bottom-5 right-5 size-2.5 bg-accent"
            aria-hidden="true"
          />
        </div>
      </div>
    </footer>
  );
}
