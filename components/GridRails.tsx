/**
 * The permanent hairline ruling the whole design hangs off.
 *
 * Drawn once as a fixed, non-interactive layer rather than as borders on
 * each section. Two reasons: a rule never breaks where two sections meet,
 * and a shared edge never doubles to 2px because two neighbours both drew
 * it. The rails stay put while the page scrolls, which is what makes the
 * content read as though it were placed onto a sheet of graph paper.
 *
 * Four columns from `lg`, two from `sm`, and outer edges only on a phone.
 * Each span owns the rule on its right edge, so the number of spans
 * rendered at a breakpoint is one less than that breakpoint's column
 * count — see `.rails-inner` in globals.css.
 */
export default function GridRails() {
  return (
    <div className="rails px-5 md:px-0" aria-hidden="true">
      <div className="rails-inner">
        <span className="hidden sm:block" />
        <span className="hidden lg:block" />
        <span className="hidden lg:block" />
      </div>
    </div>
  );
}
