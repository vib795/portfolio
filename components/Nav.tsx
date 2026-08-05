"use client";

import { useEffect, useState, type CSSProperties, type ComponentType } from "react";
import { navLinks, profile, socials } from "@/lib/content";
import { ArrowRight, GitHubIcon, LinkedInIcon, Logo, MediumIcon } from "./icons";
import ThemeToggle from "./ThemeToggle";

const socialIcons: Record<string, ComponentType<{ className?: string }>> = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  Medium: MediumIcon,
};

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled || menuOpen
            ? "border-line bg-paper/85 backdrop-blur-md"
            : "border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[4.5rem] max-w-[88rem] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a
            href="/#top"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5"
            aria-label={`${profile.name} — back to top`}
          >
            <Logo className="size-8" />
            <span className="font-mono text-[0.95rem] font-medium tracking-tight text-ink">
              {profile.first.toLowerCase()}
              <span className="text-accent">_</span>
            </span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="link-line font-mono text-[0.78rem] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <span className="h-3.5 w-px bg-line" aria-hidden="true" />
            <div className="flex items-center gap-4">
              {socials.map((s) => {
                const Icon = socialIcons[s.label];
                return (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-ink-soft transition-colors hover:text-accent"
                  >
                    {Icon ? <Icon className="size-[1.1rem]" /> : s.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="/#contact"
              className="group hidden items-center gap-2 rounded-full bg-ink py-2.5 pl-5 pr-4 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-accent md:inline-flex"
            >
              Contact
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex size-10 items-center justify-center md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {/* Both bars share one origin and are separated by transform.
                  The previous version animated `top` through transition-all,
                  which relayouts every frame for a purely visual morph. */}
              <span className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 top-1.5 block h-[2px] w-6 bg-ink transition-transform duration-200 ease-out ${
                    menuOpen ? "rotate-45" : "-translate-y-1.5"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-[2px] w-6 bg-ink transition-transform duration-200 ease-out ${
                    menuOpen ? "-rotate-45" : "translate-y-1.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Stays mounted; CSS handles enter/exit via @starting-style and
          allow-discrete (see `.mobile-menu` in globals.css). `inert` keeps
          the closed menu out of the tab order and off screen readers. */}
      <div
        className="mobile-menu fixed inset-0 z-40 bg-paper md:hidden"
        data-open={menuOpen}
        inert={!menuOpen}
      >
        <div className="flex h-full flex-col justify-between px-5 pb-10 pt-28">
          <nav className="flex flex-col">
            {navLinks.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ "--i": i } as CSSProperties}
                className="mobile-menu-link border-b border-line py-5 text-4xl font-medium tracking-tight"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-5">
            <a
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-full bg-ink px-6 py-4 font-mono text-sm uppercase tracking-[0.14em] text-paper"
            >
              Get in touch
              <ArrowRight className="size-4" />
            </a>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {socials.map((s) => {
                const Icon = socialIcons[s.label];
                return (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink"
                  >
                    {Icon && <Icon className="size-4" />}
                    {s.label}
                  </a>
                );
              })}
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              {profile.availability}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
