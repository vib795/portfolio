import type Lenis from "lenis";

/**
 * The live Lenis instance, shared between the component that owns it and
 * the page transition that has to move the scroll underneath its own
 * curtain.
 *
 * Lenis keeps its own idea of the scroll offset. Anything that moves the
 * page without telling it desyncs that offset, and the next wheel event
 * snaps back to where Lenis thought it was — so a jump performed behind
 * the curtain has to go through here, not through `scrollTo`.
 */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Nav height, so a section lands under the bar rather than behind it. */
export const SCROLL_OFFSET = -88;

/**
 * Jumps to `target` with no animation.
 *
 * Used only while the curtain is covering the viewport: the movement is
 * hidden, so easing it would just be time the reader waits for nothing.
 * Falls back to a native jump when Lenis is off (reduced motion).
 */
export function jumpTo(target: Element) {
  if (lenis) {
    lenis.scrollTo(target as HTMLElement, {
      offset: SCROLL_OFFSET,
      immediate: true,
    });
    return;
  }
  const top =
    target.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET;
  window.scrollTo({ top, behavior: "auto" });
}

/** Smoothly scrolls to `target`, for moves the reader can see. */
export function glideTo(target: Element) {
  if (lenis) {
    lenis.scrollTo(target as HTMLElement, { offset: SCROLL_OFFSET });
    return;
  }
  const top =
    target.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}
