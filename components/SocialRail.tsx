import { socials } from "@/lib/content";
import { GitHubIcon, LinkedInIcon, MediumIcon } from "./icons";
import type { ComponentType } from "react";

const icons: Record<string, ComponentType<{ className?: string }>> = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  Medium: MediumIcon,
};

/**
 * The fixed vertical rail the reference pins to the right edge, one
 * bordered cell per link. Desktop only — on a phone it would sit on
 * top of the content, and the footer already carries the same links.
 */
export default function SocialRail() {
  return (
    <div className="fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 flex-col border-y border-l border-line-strong bg-paper/90 backdrop-blur-md xl:flex">
      {socials.map((s) => {
        const Icon = icons[s.label];
        return (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="flex size-11 items-center justify-center text-ink-faint transition-colors duration-300 hover:bg-accent hover:text-accent-ink [&+a]:border-t [&+a]:border-line-strong"
          >
            {Icon ? <Icon className="size-[1.05rem]" /> : s.label}
          </a>
        );
      })}
    </div>
  );
}
