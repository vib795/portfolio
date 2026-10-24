"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ROWS = 7;
const MIN_COLS = 10;
const MAX_COLS = 28;
/** Smallest cell, in px, before columns are dropped — keeps a tap target. */
const MIN_CELL = 24;
const GAP = 4;
const LIVES = 3;
const BEST_KEY = "commit-streak-best";

type Cell = { s: "e" | "l" | "c"; born: number; life: number; tone: number };
type Phase = "idle" | "play" | "over";
type Hud = { score: number; commits: number; streak: number; topStreak: number; lives: number };

const EMPTY_HUD: Hud = { score: 0, commits: 0, streak: 0, topStreak: 0, lives: LIVES };

/** Deterministic 0..1 noise, so the idle board renders the same on the
 *  server and the client. */
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Faster spawns and shorter lives as the run goes on. */
const spawnGap = (commits: number) => Math.max(320, 950 - commits * 14);
const lifeFor = (commits: number) => Math.max(1000, 2400 - commits * 18);

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeBest(score: number) {
  try {
    localStorage.setItem(BEST_KEY, String(score));
  } catch {
    /* private mode: the best score just isn't remembered */
  }
}

/**
 * A contribution graph you fill by hand. Squares light up in the pixel
 * colours and fade; tap one before it dies to commit it. Faster taps
 * land as darker greens. Let three expire and the run ends, leaving the
 * graph you built.
 *
 * Cells are painted by writing `data-s` straight onto the DOM from a
 * requestAnimationFrame loop. React renders the board once per column
 * count and only re-renders for the HUD, which changes on a hit or a
 * miss, never per frame.
 */
export default function CommitStreak() {
  const boardRef = useRef<HTMLDivElement>(null);
  const cellEls = useRef<(HTMLDivElement | null)[]>([]);
  const cells = useRef<Cell[]>([]);
  const hudRef = useRef<Hud>({ ...EMPTY_HUD });
  const clock = useRef({ t: 0, last: 0, nextSpawn: 0, raf: 0 });

  const [cols, setCols] = useState(MAX_COLS);
  const [phase, setPhase] = useState<Phase>("idle");
  const [hud, setHud] = useState<Hud>(EMPTY_HUD);
  const [best, setBest] = useState(0);
  const phaseRef = useRef<Phase>("idle");
  /** Best score before this run, so a tie isn't called a new best. */
  const prevBest = useRef(0);

  const paint = (i: number, s: string) => {
    const el = cellEls.current[i];
    if (el && el.dataset.s !== s) el.dataset.s = s;
  };

  /** The resting board: a believable contribution graph, sparse on the
   *  left and busier toward "today". */
  const paintIdle = useCallback((n: number) => {
    const width = n / ROWS;
    for (let i = 0; i < n; i++) {
      const bias = (i % width) / width;
      const r = hash(i + 1);
      const level = r < 0.55 - bias * 0.3 ? 0 : Math.min(4, Math.ceil(r * 4 * (0.6 + bias)));
      paint(i, level ? `c${level}` : "e");
    }
  }, []);

  // Fit the column count to the container. Frozen during a run so the
  // board doesn't reshuffle under someone's finger.
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const fit = () => {
      if (phaseRef.current === "play") return;
      const n = Math.floor((board.clientWidth + GAP) / (MIN_CELL + GAP));
      setCols(Math.max(MIN_COLS, Math.min(MAX_COLS, n)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(board);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setBest(readBest());
  }, []);

  useEffect(() => {
    if (phaseRef.current !== "play") paintIdle(cols * ROWS);
  }, [cols, paintIdle]);

  useEffect(() => () => cancelAnimationFrame(clock.current.raf), []);

  const pushHud = () => setHud({ ...hudRef.current });

  const end = useCallback(() => {
    cancelAnimationFrame(clock.current.raf);
    phaseRef.current = "over";
    setPhase("over");
    cells.current.forEach((c, i) => {
      if (c.s === "l") {
        c.s = "e";
        paint(i, "e");
      }
    });
    const score = hudRef.current.score;
    if (score > readBest()) {
      writeBest(score);
      setBest(score);
    }
  }, []);

  const spawn = () => {
    const free: number[] = [];
    cells.current.forEach((c, i) => c.s === "e" && free.push(i));
    if (free.length === 0) return;
    const i = free[Math.floor(Math.random() * free.length)];
    const tone = 1 + Math.floor(Math.random() * 5);
    cells.current[i] = {
      s: "l",
      born: clock.current.t,
      life: lifeFor(hudRef.current.commits),
      tone,
    };
    cellEls.current[i]?.style.setProperty("--c", `var(--px-${tone})`);
    paint(i, "l4");
  };

  const expire = (i: number) => {
    cells.current[i].s = "e";
    paint(i, "miss");
    window.setTimeout(() => {
      if (cells.current[i]?.s === "e") paint(i, "e");
    }, 320);
    const h = hudRef.current;
    h.lives -= 1;
    h.streak = 0;
    pushHud();
    if (h.lives <= 0) end();
  };

  const tick = (now: number) => {
    const c = clock.current;
    // Clamp the step so a backgrounded tab (rAF paused) resumes where it
    // left off instead of expiring every lit square at once.
    const dt = Math.min(now - (c.last || now), 100);
    c.last = now;
    c.t += dt;

    if (c.t >= c.nextSpawn) {
      spawn();
      c.nextSpawn = c.t + spawnGap(hudRef.current.commits);
    }

    let lit = 0;
    let free = 0;
    cells.current.forEach((cell, i) => {
      if (phaseRef.current !== "play") return;
      if (cell.s === "e") free++;
      if (cell.s !== "l") return;
      const frac = 1 - (c.t - cell.born) / cell.life;
      if (frac <= 0) {
        expire(i);
        return;
      }
      lit++;
      paint(i, `l${Math.ceil(frac * 4)}`);
    });

    if (phaseRef.current !== "play") return;
    // A full board with nothing left to catch is a finished graph.
    if (free === 0 && lit === 0) {
      end();
      return;
    }
    c.raf = requestAnimationFrame(tick);
  };

  const start = () => {
    const n = cols * ROWS;
    cells.current = Array.from({ length: n }, () => ({ s: "e", born: 0, life: 0, tone: 1 }));
    for (let i = 0; i < n; i++) paint(i, "e");
    hudRef.current = { ...EMPTY_HUD };
    prevBest.current = readBest();
    pushHud();
    clock.current = { t: 0, last: 0, nextSpawn: 500, raf: 0 };
    phaseRef.current = "play";
    setPhase("play");
    clock.current.raf = requestAnimationFrame(tick);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (phaseRef.current !== "play") return;
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-i]");
    if (!target) return;
    const i = Number(target.dataset.i);
    const cell = cells.current[i];
    const h = hudRef.current;

    if (cell?.s === "l") {
      const frac = 1 - (clock.current.t - cell.born) / cell.life;
      const level = Math.max(1, Math.min(4, Math.ceil(frac * 4)));
      cell.s = "c";
      paint(i, `c${level}`);
      target.removeAttribute("data-pop");
      void target.offsetWidth;
      target.setAttribute("data-pop", "");
      h.commits += 1;
      h.score += level;
      h.streak += 1;
      h.topStreak = Math.max(h.topStreak, h.streak);
    } else {
      // Tapping a dead square breaks the streak, not a life.
      h.streak = 0;
      const board = boardRef.current;
      if (board) {
        board.removeAttribute("data-shake");
        void board.offsetWidth;
        board.setAttribute("data-shake", "");
      }
    }
    pushHud();
  };

  const pad = (n: number, w = 3) => String(n).padStart(w, "0");

  return (
    <section id="play" className="relative z-10" data-trail>
      <div className="shell">
        <div className="rule-b grid lg:grid-cols-4">
          <div className="border-line-strong p-6 lg:border-r">
            <p className="fn-tag">utkarsh.play()</p>
          </div>
          <div className="border-line-strong bg-paper p-6 lg:col-span-2 lg:border-r">
            <h2 className="slash-title text-4xl lg:text-6xl">commit-streak</h2>
            <p className="mt-4 max-w-[46ch] leading-relaxed text-ink-soft">
              Squares light up and fade. Tap them before they go out to commit
              them to the graph. Faster taps land as darker greens. Miss three
              and the run is over.
            </p>
          </div>
          <dl className="grid grid-cols-2 bg-surface font-mono text-sm">
            {[
              ["contributions", pad(hud.score)],
              ["streak", pad(hud.streak, 2)],
              ["best", pad(best)],
              ["lives", "■".repeat(hud.lives) + "□".repeat(LIVES - hud.lives)],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`p-5 ${i % 2 ? "border-l border-line-strong" : ""} ${i > 1 ? "border-t border-line-strong" : ""}`}
              >
                <dt className="text-ink-faint">{k}</dt>
                <dd className="mt-1 text-xl tabular-nums text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rule-b relative bg-paper p-4 lg:p-6">
          <div
            ref={boardRef}
            className="cs-board"
            style={{ "--cols": cols } as React.CSSProperties}
            onPointerDown={onPointerDown}
            data-trail-ignore
            role="application"
            aria-label="Commit streak game board"
          >
            {Array.from({ length: cols * ROWS }, (_, i) => (
              <div
                key={`${cols}-${i}`}
                data-i={i}
                ref={(el) => {
                  cellEls.current[i] = el;
                }}
                className="cs-cell"
              />
            ))}
          </div>

          {phase !== "play" && (
            <div className="absolute inset-0 flex items-center justify-center bg-paper/55 p-4 backdrop-blur-[2px]">
              <div className="w-full max-w-sm border border-line-strong bg-surface p-6 text-center">
                {phase === "over" ? (
                  <>
                    <p className="fn-tag">git log --oneline | wc -l</p>
                    <p className="mt-2 text-4xl tracking-tight tabular-nums" aria-live="polite">
                      {hud.score} contributions
                    </p>
                    <p className="mt-2 text-sm text-ink-soft">
                      {hud.commits} commits · longest streak {hud.topStreak}
                      {hud.score > prevBest.current ? " · new best" : ""}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="fn-tag">git commit --often</p>
                    <p className="mt-2 text-2xl tracking-tight">Fill the graph.</p>
                  </>
                )}
                <button
                  type="button"
                  onClick={start}
                  className="notch-sm mt-5 w-full bg-accent px-5 py-3 text-sm text-accent-ink transition-colors hover:bg-accent-deep"
                >
                  {phase === "over" ? "Play again" : "Start"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-2 font-mono text-xs text-ink-faint">
            less
            {[0, 1, 2, 3, 4].map((l) => (
              <span
                key={l}
                className="size-3 rounded-[3px]"
                style={{ background: `var(--gh-${l})` }}
              />
            ))}
            more
          </div>
        </div>
      </div>
    </section>
  );
}
