"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type ComponentType,
} from "react";
import { usePathname } from "next/navigation";
import { navLinks, profile, socials } from "@/lib/content";
import { ArrowRight, GitHubIcon, LinkedInIcon, MediumIcon } from "./icons";
import ScrambleLink from "./ScrambleLink";
import ThemeToggle from "./ThemeToggle";
import Wordmark from "./Wordmark";

const socialIcons: Record<string, ComponentType<{ className?: string }>> = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  Medium: MediumIcon,
};

/**
 * The header is itself a row of the module grid: each group sits in its
 * own cell with a hairline between, and the bar carries a single bottom
 * rule. The active link is marked with corner ticks rather than an
 * underline — the reference brackets it top-left and bottom-right.
 */
export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Only /blog is a real route; the rest are same-page anchors, and an
  // anchor is never "current" in the way a route is.
  const isActive = (href: string) =>
    href.startsWith("/blog") && pathname.startsWith("/blog");

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line-strong bg-paper/90 backdrop-blur-md">
        <div className="shell">
          <nav className="flex h-16 items-stretch lg:h-[4.5rem]">
            <a
              href="/#top"
              onClick={() => setMenuOpen(false)}
              className="flex shrink-0 items-center gap-3 pr-5 lg:w-1/4 lg:border-r lg:border-line-strong lg:pl-6"
              aria-label={`${profile.name} — back to top`}
            >
              <span className="notch-sm flex size-8 items-center justify-center bg-accent">
                <Wordmark text="US" className="h-3 w-auto text-accent-ink" />
              </span>
              <span className="text-[0.95rem] font-medium tracking-tight">
                <ScrambleLink text={profile.handle} />
              </span>
            </a>

            <div className="hidden flex-1 items-center gap-8 border-r border-line-strong px-8 lg:flex">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`link-ticks p-1.5 text-sm transition-colors hover:text-accent ${
                    isActive(l.href) ? "text-ink" : "text-ink-soft"
                  }`}
                >
                  <ScrambleLink text={l.label} />
                </a>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-4 lg:ml-0 lg:w-1/4 lg:justify-between lg:pl-6">
              <div className="hidden items-center gap-4 lg:flex">
                {socials.map((s) => {
                  const Icon = socialIcons[s.label];
                  return (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="text-ink-faint transition-colors hover:text-accent"
                    >
                      {Icon ? <Icon className="size-[1.05rem]" /> : s.label}
                    </a>
                  );
                })}
              </div>
              <ThemeToggle />
              <a
                href="/#contact"
                className="notch-sm hidden bg-accent px-5 py-3 text-[0.7rem] uppercase tracking-[0.14em] text-accent-ink transition-colors hover:bg-accent-deep sm:inline-block sm:px-7"
              >
                <ScrambleLink text="Get in touch" />
              </a>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex size-10 items-center justify-center lg:hidden"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                {/* Both bars share one origin and are separated by
                    transform, so the morph never triggers layout. */}
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
        </div>
      </header>

      {/* Stays mounted; CSS handles enter/exit via @starting-style and
          allow-discrete (see `.mobile-menu` in globals.css). `inert` keeps
          the closed menu out of the tab order and off screen readers. */}
      <div
        className="mobile-menu fixed inset-0 z-40 bg-paper lg:hidden"
        data-open={menuOpen}
        inert={!menuOpen}
      >
        <div className="flex h-full flex-col justify-between px-5 pb-10 pt-24">
          <nav className="flex flex-col border-t border-line-strong">
            {navLinks.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ "--i": i } as CSSProperties}
                className="mobile-menu-link border-b border-line-strong py-5 text-3xl tracking-tight"
              >
                <ScrambleLink text={l.label} />
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-5">
            <a
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="notch-lg flex items-center justify-between bg-accent px-6 py-4 text-sm uppercase tracking-[0.14em] text-accent-ink"
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
                    className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink"
                  >
                    {Icon && <Icon className="size-4" />}
                    <ScrambleLink text={s.label} />
                  </a>
                );
              })}
            </div>
            <p className="label">{profile.availability}</p>
          </div>
        </div>
      </div>
    </>
  );
}
