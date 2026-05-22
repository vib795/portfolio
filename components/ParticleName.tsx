"use client";

import { useEffect, useRef } from "react";

type Particle = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

// Dense, fine grain — the name stays solid and only the region near the
// cursor dissolves into compact static; clicking detonates the whole name.
const MARGIN = 90; // canvas padding (room for the click explosion)
const STEP = 1.5; // sampling step — small = very dense pack
const DOT = 2; // particle size in CSS px
const SPRING = 0.14; // pull back toward home (snappy, keeps it compact)
const FRICTION = 0.72; // heavy damping = compact, settles fast
const RADIUS = 130; // cursor influence radius
const JITTER = 4.6; // random grain agitation near the cursor
const PUSH = 1.5; // gentle displacement away from the cursor
const CURSOR_DECAY = 0.88; // cursor influence fades when the mouse stops

export default function ParticleName({
  first,
  last,
  className,
}: {
  first: string;
  last: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const h1 = h1Ref.current;
    const canvas = canvasRef.current;
    if (!wrap || !h1 || !canvas) return;

    // Runs on desktop and touch; reduced-motion keeps the plain <h1>.
    const enabled = !window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!enabled) return;

    const ctx = canvas.getContext("2d");
    const off = document.createElement("canvas");
    const octx = off.getContext("2d", { willReadFrequently: true });
    if (!ctx || !octx) return;

    let particles: Particle[] = [];
    let raf = 0;
    let cx = -9999;
    let cy = -9999;
    let cursorStrength = 0;
    let idle = false;
    let cssW = 0;
    let cssH = 0;
    let dpr = 1;
    let img: ImageData | null = null;
    let buf32: Uint32Array | null = null;
    let resizeTimer = 0;

    // particle ink follows the active theme's --ink token
    const readInk = () => {
      const hex = getComputedStyle(document.documentElement)
        .getPropertyValue("--ink")
        .trim();
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return ((0xff << 24) | (b << 16) | (g << 8) | r) >>> 0;
    };
    let ink32 = readInk();

    const layout = () => {
      const r = wrap.getBoundingClientRect();
      cssW = r.width + MARGIN * 2;
      cssH = r.height + MARGIN * 2;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      img = ctx.createImageData(canvas.width, canvas.height);
      buf32 = new Uint32Array(img.data.buffer);
    };

    const sample = () => {
      layout();
      off.width = canvas.width;
      off.height = canvas.height;
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
      octx.clearRect(0, 0, cssW, cssH);
      octx.fillStyle = "#000";
      octx.textBaseline = "alphabetic";
      const wr = wrap.getBoundingClientRect();
      for (const span of Array.from(h1.children) as HTMLElement[]) {
        const sr = span.getBoundingClientRect();
        const cs = getComputedStyle(span);
        octx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const text = span.textContent ?? "";
        const m = octx.measureText(text);
        octx.fillText(
          text,
          sr.left - wr.left + MARGIN,
          sr.top - wr.top + MARGIN + m.actualBoundingBoxAscent,
        );
      }
      const data = octx.getImageData(0, 0, off.width, off.height).data;
      const next: Particle[] = [];
      for (let y = 0; y < cssH; y += STEP) {
        for (let x = 0; x < cssW; x += STEP) {
          const bx = Math.min(off.width - 1, (x * dpr) | 0);
          const by = Math.min(off.height - 1, (y * dpr) | 0);
          if (data[(by * off.width + bx) * 4 + 3] > 130) {
            next.push({ hx: x, hy: y, x, y, vx: 0, vy: 0 });
          }
        }
      }
      particles = next;
      idle = false;
    };

    const render = () => {
      if (!img || !buf32) return;
      buf32.fill(0);
      const W = canvas.width;
      const H = canvas.height;
      const block = Math.max(1, Math.round(DOT * dpr));
      for (const p of particles) {
        const bx = (p.x * dpr) | 0;
        const by = (p.y * dpr) | 0;
        for (let oy = 0; oy < block; oy++) {
          const yy = by + oy;
          if (yy < 0 || yy >= H) continue;
          const row = yy * W;
          for (let ox = 0; ox < block; ox++) {
            const xx = bx + ox;
            if (xx >= 0 && xx < W) buf32[row + xx] = ink32;
          }
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const tick = () => {
      cursorStrength *= CURSOR_DECAY;
      if (cursorStrength > 0.03 || !idle) {
        const active = cursorStrength > 0.03;
        const r2 = RADIUS * RADIUS;
        let maxE = 0;
        for (const p of particles) {
          let ax = (p.hx - p.x) * SPRING;
          let ay = (p.hy - p.y) * SPRING;
          if (active) {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const d2 = dx * dx + dy * dy;
            if (d2 < r2) {
              const d = Math.sqrt(d2) || 0.01;
              const prox = (1 - d / RADIUS) * cursorStrength;
              ax += (Math.random() * 2 - 1) * JITTER * prox;
              ay += (Math.random() * 2 - 1) * JITTER * prox;
              ax += (dx / d) * PUSH * prox;
              ay += (dy / d) * PUSH * prox;
            }
          }
          p.vx = (p.vx + ax) * FRICTION;
          p.vy = (p.vy + ay) * FRICTION;
          p.x += p.vx;
          p.y += p.vy;
          const e =
            Math.abs(p.x - p.hx) +
            Math.abs(p.y - p.hy) +
            Math.abs(p.vx) +
            Math.abs(p.vy);
          if (e > maxE) maxE = e;
        }
        if (!active && maxE < 0.6) {
          for (const p of particles) {
            p.x = p.hx;
            p.y = p.hy;
            p.vx = 0;
            p.vy = 0;
          }
          idle = true;
        } else {
          idle = false;
        }
        render();
      }
      raf = requestAnimationFrame(tick);
    };

    // Detonate the whole wordmark — every particle gets an outward kick.
    const burst = () => {
      for (const p of particles) {
        const a = Math.random() * Math.PI * 2;
        const s = 9 + Math.random() * 16;
        p.vx = Math.cos(a) * s;
        p.vy = Math.sin(a) * s;
      }
      idle = false;
    };

    const insideName = (clientX: number, clientY: number) => {
      const wr = wrap.getBoundingClientRect();
      return (
        clientX >= wr.left &&
        clientX <= wr.right &&
        clientY >= wr.top &&
        clientY <= wr.bottom
      );
    };

    const onMove = (e: PointerEvent) => {
      const cr = canvas.getBoundingClientRect();
      cx = e.clientX - cr.left;
      cy = e.clientY - cr.top;
      if (
        e.clientX >= cr.left &&
        e.clientX <= cr.right &&
        e.clientY >= cr.top &&
        e.clientY <= cr.bottom
      ) {
        cursorStrength = 1;
        idle = false;
      }
    };

    let lastBurst = 0;
    const tryBurst = (clientX: number, clientY: number) => {
      const now = performance.now();
      if (now - lastBurst < 200) return; // dedupe pointerdown + click pair
      if (insideName(clientX, clientY)) {
        lastBurst = now;
        burst();
      }
    };
    // mouse/pen explode on press; touch explodes on a tap, not a scroll
    let touchStart: { x: number; y: number; t: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        touchStart = { x: e.clientX, y: e.clientY, t: performance.now() };
      } else {
        tryBurst(e.clientX, e.clientY);
      }
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !touchStart) return;
      const moved =
        Math.abs(e.clientX - touchStart.x) +
        Math.abs(e.clientY - touchStart.y);
      if (moved < 14 && performance.now() - touchStart.t < 500) {
        tryBurst(e.clientX, e.clientY);
      }
      touchStart = null;
    };
    const onClick = (e: MouseEvent) => tryBurst(e.clientX, e.clientY);

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        sample();
        render();
      }, 200);
    };

    sample();
    render(); // paint the solid name immediately
    canvas.style.opacity = "1";
    h1.style.opacity = "0";
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    // repaint with the new ink color when the theme is toggled
    const themeObserver = new MutationObserver(() => {
      ink32 = readInk();
      render();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      themeObserver.disconnect();
      clearTimeout(resizeTimer);
      cancelAnimationFrame(raf);
      h1.style.opacity = "1";
      canvas.style.opacity = "0";
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`}>
      <h1
        ref={h1Ref}
        className="font-bold leading-[0.9] tracking-[-0.04em] text-[clamp(3.6rem,12vw,10.5rem)]"
        style={{ transition: "opacity 0.3s ease" }}
      >
        <span className="rise-in block" style={{ animationDelay: "0.12s" }}>
          {first}
        </span>
        <span className="rise-in block" style={{ animationDelay: "0.2s" }}>
          {last}
        </span>
      </h1>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute opacity-0"
        style={{
          top: `-${MARGIN}px`,
          left: `-${MARGIN}px`,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}
