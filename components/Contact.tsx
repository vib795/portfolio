import type { ReactNode } from "react";
import { contact, profile } from "@/lib/content";
import ScrambleLink from "./ScrambleLink";

/** The outlined cross the reference parks in the empty cell beside its
 *  closing call to action. */
function Plus({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M44 8h32v36h36v32H76v36H44V76H8V44h36Z" />
    </svg>
  );
}

/** A small square glyph box pinned to a grid intersection — the
 *  reference hangs these off the ruling at section corners. */
function NodeBox({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`absolute z-10 flex size-11 items-center justify-center border border-line-strong bg-paper text-ink-faint ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="relative z-10">
      <div className="shell">
        <div className="rule-b relative grid lg:grid-cols-4">
          <NodeBox className="-left-px -top-px">
            <svg
              viewBox="0 0 16 16"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </NodeBox>

          <div className="border-line-strong bg-paper p-6 pt-20 lg:col-span-2 lg:border-r">
            <p className="flex items-center gap-3 text-2xl uppercase tracking-tight lg:text-3xl">
              <span className="text-accent" aria-hidden="true">
                ▸
              </span>
              {contact.heading.lead}
            </p>
            <h2 className="mt-3 text-2xl uppercase tracking-tight lg:text-3xl">
              <span className="invert-mark">{contact.heading.tail}</span>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
              {contact.body}
            </p>
          </div>

          <div className="relative hidden items-center justify-center border-r border-line-strong lg:flex">
            <Plus className="size-32 text-ink-faint" />
            <NodeBox className="-bottom-px -right-px">
              <span className="block size-3 rounded-full border border-current" />
            </NodeBox>
          </div>

          <div className="flex flex-col justify-center gap-3 p-6">
            <a
              href={`mailto:${profile.email}`}
              className="notch-lg block bg-accent px-6 py-4 text-center text-sm uppercase tracking-[0.14em] text-accent-ink transition-colors hover:bg-accent-deep"
            >
              <ScrambleLink text="Email me" />
            </a>
            {/* Outlined notch: a 1px-padded parent supplies the border and
                the clipped child supplies the fill. A clipped element
                cannot render a border of its own. */}
            <a
              href={contact.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="notch-lg block bg-accent p-px"
            >
              <span className="notch-lg block bg-paper px-6 py-4 text-center text-sm uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent">
                <ScrambleLink text="Book a call" />
              </span>
            </a>
          </div>
        </div>

        {/* No social row here — the footer's fourth column already
            carries them, and the reference never repeats a link group. */}
      </div>
    </section>
  );
}
