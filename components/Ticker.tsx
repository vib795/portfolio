import { marquee, profile } from "@/lib/content";

/**
 * The coloured band under the hero. Each block is one stack item in mono
 * on a flat pixel colour, with the availability line repeated between
 * runs. Same seamless construction as the old tech rail: two identical
 * runs, shifted by exactly -50%.
 */
export default function Ticker() {
  const items = [profile.availability.toLowerCase(), ...marquee.map((m) => m.toLowerCase())];
  return (
    <div className="rule-b overflow-hidden" aria-label="Core stack">
      <div className="marquee-track [animation-duration:44s]">
        {[0, 1].map((run) => (
          <div key={run} className="flex" aria-hidden={run === 1}>
            {items.map((item, i) => {
              const tone = (i % 5) + 1;
              return (
                <span
                  key={item}
                  data-tone={tone}
                  className="ticker-block flex shrink-0 items-center gap-3 px-6 py-3"
                  style={{ background: `var(--px-${tone})` }}
                >
                  <span aria-hidden="true">■</span>
                  {item}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
