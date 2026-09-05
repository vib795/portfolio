// ════════════════════════════════════════════════════════════════════
//  WORDMARK
//
//  The reference sets its huge display text in LabsAmiga, a licensed
//  face we can't ship. Rather than substitute a Google font that reads
//  wrong at 180px, the mark is drawn: each glyph is a centerline
//  skeleton stroked at 48 units on a 140 × 200 body.
//
//  Stroking a skeleton (instead of filling an outline) is what buys the
//  style for free. `stroke-linecap="round"` gives every terminal the
//  rounded cap the reference has, and `stroke-linejoin="round"` rounds
//  the outer corner of a bend while the inner corner stays square —
//  which is precisely how that face is built.
// ════════════════════════════════════════════════════════════════════

/** Glyph body: 140 wide, 200 tall.
 *
 *  Advance has to clear BODY + STROKE, not just BODY — round caps bleed
 *  half a stroke past each end of a path, so an advance of 180 on a
 *  140-wide body made neighbouring glyphs overlap by 8 units. 210 leaves
 *  a 24-unit visual gap, which matches the reference's letterfit and
 *  lands a ten-character mark at ~156px tall across a 1320px container. */
const BODY = 140;
const ADVANCE = 210;
const HEIGHT = 200;
const STROKE = 46;
const PAD = STROKE / 2; // round caps bleed half a stroke past the path

/** Centerline skeletons. Multiple subpaths per glyph are fine — they
 *  share one stroke, so `M` just lifts the pen. */
const GLYPHS: Record<string, string> = {
  A: "M0 200 L42 0 H98 L140 200 M24 125 H116",
  C: "M140 0 H0 V200 H140",
  D: "M0 0 H90 L140 50 V150 L90 200 H0 Z",
  E: "M140 0 H0 V200 H140 M0 100 H105",
  F: "M0 200 V0 H135 M0 95 H100",
  G: "M140 0 H0 V200 H140 V105 H70",
  H: "M0 0 V200 M140 0 V200 M0 100 H140",
  I: "M20 0 H120 M70 0 V200 M20 200 H120",
  K: "M0 0 V200 M140 0 L0 108 L140 200",
  L: "M0 0 V200 H135",
  N: "M0 200 V0 L140 200 V0",
  O: "M0 0 H140 V200 H0 Z",
  P: "M0 200 V0 H140 V85 H30",
  R: "M0 200 V0 H140 V85 H30 M65 85 L140 200",
  S: "M140 0 H0 V100 H140 V200 H0",
  T: "M0 0 H140 M70 0 V200",
  U: "M0 0 V200 H140 V0",
  V: "M0 0 L70 200 L140 0",
  W: "M0 0 L35 200 L70 70 L105 200 L140 0",
  _: "M0 200 H140",
  "-": "M10 100 H130",
  " ": "",
};

type Props = {
  /** Uppercased before lookup. Unknown characters render as a blank cell. */
  text: string;
  className?: string;
  /** Rendered as the accessible name. Pass nothing for a decorative mark
   *  that sits beside real text — the footer slice, for instance. */
  title?: string;
  /** Per-glyph animation delays, indexed by character position, published
   *  to each path as `--fd`. Lets a caller stagger a per-character effect
   *  across the mark without this component knowing what the effect is.
   *  Omit it and no style is set at all. */
  charDelays?: string[];
};

/**
 * Renders `text` as one inline SVG. The viewBox is computed from the
 * glyph count so the mark always fills its container edge to edge.
 */
export default function Wordmark({
  text,
  className,
  title,
  charDelays,
}: Props) {
  const chars = [...text.toUpperCase()];
  const width = (chars.length - 1) * ADVANCE + BODY;

  return (
    <svg
      viewBox={`${-PAD} ${-PAD} ${width + STROKE} ${HEIGHT + STROKE}`}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
    >
      {chars.map((ch, i) => {
        const d = GLYPHS[ch];
        if (!d) return null;
        return (
          // Keyed by position, not by glyph. A key of `${ch}-${i}` changes
          // the moment a character does, so React unmounts and remounts the
          // path — which restarts any CSS animation on it. While the hero
          // mark scrambles that happens every ~30ms, and a per-glyph
          // flicker would be reset before it could play a single frame.
          <path
            key={i}
            d={d}
            transform={`translate(${i * ADVANCE} 0)`}
            style={
              charDelays
                ? ({ "--fd": charDelays[i] } as React.CSSProperties)
                : undefined
            }
          />
        );
      })}
    </svg>
  );
}

/** Aspect ratio of a mark, so a caller can reserve exact space for it
 *  and avoid a layout shift. */
export function wordmarkRatio(text: string) {
  const n = [...text].length;
  return ((n - 1) * ADVANCE + BODY + STROKE) / (HEIGHT + STROKE);
}
