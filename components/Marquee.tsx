import { marquee } from "@/lib/content";

export default function Marquee() {
  const row = [...marquee, ...marquee];
  return (
    <section
      aria-hidden="true"
      className="marquee-group overflow-hidden border-y border-line bg-paper-dim"
    >
      <div className="flex w-max animate-marquee">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center py-5 font-mono text-sm uppercase tracking-[0.16em] text-ink-soft"
          >
            <span className="px-8">{item}</span>
            <svg
              viewBox="0 0 8 8"
              className="size-[7px] shrink-0"
              aria-hidden="true"
            >
              <path d="M4 0 8 4 4 8 0 4Z" fill="var(--accent)" />
            </svg>
          </span>
        ))}
      </div>
    </section>
  );
}
