import { navLinks, profile, socials } from "@/lib/content";
import { ArrowUpRight } from "./icons";
import ScrambleLink from "./ScrambleLink";

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

          {/* Deliberately empty, so the fixed rails show through and the
              four-column ruling stays intact. The reference leaves cells
              blank in its own footer for the same reason — a column of
              build trivia is not what a reader needs here. */}
          <div className="hidden border-line-strong lg:block lg:border-r" />

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

        {/* Last row on the page, so its bottom rule is the page's own
            closing edge. */}
        <div className="rule-b grid lg:grid-cols-4">
          <p className="label border-line-strong p-6 lg:border-r">© {year}</p>
          <p className="label p-6 lg:col-span-3">
            All rights reserved by {profile.name}
          </p>
        </div>

      </div>
    </footer>
  );
}
