import { navLinks, profile, socials } from "@/lib/content";
import { Logo } from "./icons";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-dark text-cream">
      <div className="mx-auto max-w-[88rem] border-t border-dark-line px-5 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <a href="#top" className="inline-flex items-center gap-2.5">
              <Logo className="size-8" tone="cream" />
              <span className="font-mono text-sm font-medium">
                {profile.first.toLowerCase()}
                <span className="text-accent">_</span>
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-cream-soft">
              {profile.role} building considered software for the web. Always
              happy to talk shop.
            </p>
          </div>

          <div className="flex gap-14 sm:gap-24">
            <nav className="flex flex-col gap-3">
              <span className="mb-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-cream-soft/60">
                Navigate
              </span>
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="link-line w-fit text-sm text-cream-soft transition-colors hover:text-cream"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                className="link-line w-fit text-sm text-cream-soft transition-colors hover:text-cream"
              >
                Contact
              </a>
            </nav>
            <nav className="flex flex-col gap-3">
              <span className="mb-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-cream-soft/60">
                Elsewhere
              </span>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line w-fit text-sm text-cream-soft transition-colors hover:text-cream"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-dark-line pt-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-cream-soft/60 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {profile.name}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent" />
            Built with Next.js + Tailwind
          </span>
          <a
            href="#top"
            className="link-line w-fit transition-colors hover:text-cream"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
