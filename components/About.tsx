import { about } from "@/lib/content";
import Scramble from "./Scramble";

/**
 * Prose in the left half, toolkit in the right, both snapped to the
 * ruling. The reference has no "about" section — this borrows its
 * section-header treatment (a label cell, then a wide heading cell) so
 * the block reads as part of the same system.
 */
export default function About() {
  return (
    <section id="about" className="relative z-10">
      <div className="shell">
        <div className="rule-b grid lg:grid-cols-4">
          <div className="border-line-strong p-6 lg:border-r">
            <p className="label">/ About</p>
          </div>
          <div className="p-6 lg:col-span-3">
            <h2 className="max-w-[20ch] text-3xl leading-tight tracking-tight lg:text-4xl">
              {about.heading.lead}{" "}
              <span className="invert-mark">{about.heading.tail}</span>
            </h2>
          </div>
        </div>

        <div className="rule-b grid lg:grid-cols-4">
          {/* Both cells span two grid columns, so a rail would otherwise
              run down the middle of a paragraph. Content cells are
              opaque panels; only empty cells show the ruling. */}
          <div className="space-y-5 border-line-strong bg-paper p-6 leading-relaxed text-ink-soft lg:col-span-2 lg:border-r">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="bg-paper lg:col-span-2">
            <p className="label rule-b p-6">
              <Scramble text="/ Toolkit" />
            </p>
            <dl>
              {about.stack.map((g, i) => (
                <div
                  key={g.label}
                  className={`flex flex-col gap-1 p-6 sm:flex-row sm:gap-6 ${
                    i > 0 ? "rule-t" : ""
                  }`}
                >
                  <dt className="text-xs uppercase tracking-[0.14em] sm:w-28 sm:shrink-0 sm:pt-1">
                    {g.label}
                  </dt>
                  <dd className="text-ink-soft">{g.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
