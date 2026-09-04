import Wordmark from "./Wordmark";

/**
 * The hero mark, scrolling forever.
 *
 * The reference runs its display wordmark as a horizontal marquee at
 * 50s linear infinite. The track holds two identical runs and shifts
 * by exactly -50%, so run B arrives where run A started and the loop
 * has no visible seam — translating a single run by -100% would leave
 * a gap the width of the viewport.
 *
 * `aria-hidden` on the copies keeps a screen reader from reading the
 * mark twice; the accessible name lives on the first run only.
 *
 * The gap between repeats is a blank glyph slot, not padding. The space
 * glyph is an empty path with a full advance, so the gap is exactly one
 * character wide and scales with the mark — a fixed 40px of flex padding
 * read as no gap at all under a mark this tall, which is what it was.
 */
export default function WordmarkMarquee({
  text,
  title,
  className,
}: {
  text: string;
  title?: string;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div className="marquee-track">
        {[0, 1].map((run) => (
          <div key={run} className="flex items-center">
            {[0, 1].map((copy) => (
              <Wordmark
                key={copy}
                text={`${text} `}
                title={run === 0 && copy === 0 ? title : undefined}
                className="h-[7rem] w-auto shrink-0 text-ink lg:h-[8rem]"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
