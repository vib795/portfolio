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

        <div className="rule-b grid lg:grid-cols-4">
          <p className="label border-line-strong p-6 lg:border-r">© {year}</p>
          <p className="label p-6 lg:col-span-3">
            All rights reserved by {profile.name}
          </p>
        </div>

        {/* The closing mark.

            Roughly a third the height it was. The reference ends on the
            same oversized logotype, but with a four-letter brand set one
            glyph per column: its rules fall between letters and each one
            reads as a graphic. A five-letter surname stretched across
            four columns has neither property, so the pattern earns less
            room here than it does there — enough to close the page,
            rather than a full screen of it.

            The mark sits in normal flow and the ruling is laid behind
            it, so the block is exactly as tall as the mark. Sizing the
            box independently is what let the two disagree: the SVG takes
            its height from its own aspect ratio, so a shorter box did
            not shorten the mark, it just let it spill over the footer. */}
        <div className="relative overflow-hidden px-5 py-8 lg:px-10 lg:py-10">
          <div
            className="absolute inset-0 grid grid-cols-2 lg:grid-cols-4"
            aria-hidden="true"
          >
            <span className="border-r border-line-strong" />
            <span className="border-line-strong lg:border-r" />
            <span className="hidden border-r border-line-strong lg:block" />
            <span className="hidden lg:block" />
          </div>

          <Wordmark
            text={profile.last}
            title={profile.name}
            className="relative h-16 w-auto text-ink sm:h-24 lg:h-36"
          />

          <span
            className="absolute left-4 top-4 size-2 bg-accent"
            aria-hidden="true"
          />
          <span
            className="absolute right-4 top-4 size-2 bg-accent"
            aria-hidden="true"
          />
          <span
            className="absolute bottom-4 left-4 size-2 bg-accent"
            aria-hidden="true"
          />
          <span
            className="absolute bottom-4 right-4 size-2 bg-accent"
            aria-hidden="true"
          />
        </div>
      </div>
    </footer>
  );
}
