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
          <div key={run} className="flex items-center gap-10 pr-10">
            {[0, 1].map((copy) => (
              <Wordmark
                key={copy}
                text={text}
                title={run === 0 && copy === 0 ? title : undefined}
                className="h-[10.5rem] w-auto shrink-0 text-ink lg:h-[11.5rem]"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
