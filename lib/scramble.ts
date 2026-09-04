/**
 * The text-scramble the reference runs on headings and link hovers.
 *
 * It loads GSAP + ScrambleTextPlugin (~60KB) for this. The plugin's
 * observable behaviour is small enough to reproduce directly: hold every
 * character on a random glyph, then resolve them left to right over the
 * tween's duration, re-rolling the unresolved ones on a fixed interval.
 *
 * Both glyph pools below are the reference's own, read off its source.
 * They are not random punctuation — they are letters that share a
 * skeleton with the surrounding monospace, which is why the scramble
 * reads as interference rather than as noise.
 */

/** Headings, on scroll. Upper case, matching the type it runs under. */
export const HEADING_CHARS = "021ZROTXINSOPSEKN";

/** Links, on hover. Lower case, and a little longer. */
export const LINK_CHARS = "021zrotxinsmopsweknm";

/**
 * How long an unresolved character holds a glyph before re-rolling.
 *
 * GSAP re-rolls about every 60ms at `speed: 1`, and every scramble on the
 * reference is set to `speed: 2`.
 */
const ROLL_MS = 30;

type Options = {
  text: string;
  chars: string;
  /** Seconds, matching the reference's tween durations. */
  duration: number;
  onFrame: (value: string) => void;
};

/**
 * Runs one scramble and returns a cancel function.
 *
 * Whitespace never scrambles — the reference splits on characters and
 * leaves the gaps alone, which is what keeps a multi-word heading legible
 * as a shape while its letters are still churning.
 */
export function runScramble({ text, chars, duration, onFrame }: Options) {
  const total = duration * 1000;
  const glyphs = chars.length;
  let raf = 0;
  let start = 0;
  let lastRoll = -Infinity;

  const tick = (now: number) => {
    if (!start) start = now;
    const progress = Math.min(1, (now - start) / total);

    if (progress >= 1) {
      onFrame(text);
      return;
    }

    if (now - lastRoll >= ROLL_MS) {
      lastRoll = now;
      const settled = Math.floor(progress * text.length);
      let out = "";
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        out +=
          i < settled || ch === " "
            ? ch
            : chars[(Math.random() * glyphs) | 0];
      }
      onFrame(out);
    }

    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

/**
 * A stable pseudo-random number for an integer seed.
 *
 * The flicker order and the curtain's stagger both need to look random
 * while being identical on the server and on the client — `Math.random()`
 * in a render would tear hydration apart. This is the usual hash-a-sine
 * trick, which is deterministic everywhere.
 */
export function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Whether motion should run at all for this visitor. */
export function motionOK() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
