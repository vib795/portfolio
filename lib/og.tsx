// ════════════════════════════════════════════════════════════════════
//  OPEN GRAPH CARDS
//  Shared layout + fonts for every generated social preview image, so
//  the homepage card and the per-post cards stay identical.
//
//  Rendered by Satori (via next/og), which is not a browser: no CSS
//  variables, no Tailwind, no external fonts. Colours are the literal
//  dark-theme hexes from globals.css and the font is read off disk.
// ════════════════════════════════════════════════════════════════════

import fs from "node:fs";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** Dark-theme tokens, copied from globals.css. */
const C = {
  bg: "#15120e",
  ink: "#f1ece1",
  inkSoft: "#b3a896",
  inkFaint: "#8a8070",
  line: "#332c22",
  accent: "#e8400c",
};

const FONT_DIR = path.join(process.cwd(), "assets", "fonts");

/**
 * Satori needs real font binaries — next/font is a browser-side concern and
 * is invisible here. These are read at build time, so the TTFs are committed
 * rather than fetched, keeping the build offline and deterministic.
 */
export function loadOgFonts() {
  return [
    {
      name: "Space Grotesk",
      data: fs.readFileSync(path.join(FONT_DIR, "SpaceGrotesk-500.ttf")),
      weight: 500 as const,
      style: "normal" as const,
    },
    {
      name: "Space Grotesk",
      data: fs.readFileSync(path.join(FONT_DIR, "SpaceGrotesk-700.ttf")),
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}

/**
 * Long titles have to shrink or they overflow the card. Satori exposes no
 * text-measuring API, so this approximates from character count — tuned
 * against the longest real titles in the Medium archive.
 */
function titleSize(title: string): number {
  if (title.length <= 38) return 78;
  if (title.length <= 62) return 64;
  if (title.length <= 92) return 52;
  return 44;
}

/** Hard cap so a runaway title can never push the footer off the card. */
function clampTitle(title: string, max = 130): string {
  if (title.length <= max) return title;
  const cut = title.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const body = lastSpace > 60 ? cut.slice(0, lastSpace) : cut;
  return `${body.replace(/[,;:.\s]+$/, "")}…`;
}

export type OgCardProps = {
  /** Small uppercase line above the title — section or source. */
  eyebrow: string;
  title: string;
  /** Footer left-hand line — the site identity. */
  footer: string;
  /** Optional right-aligned footer detail, e.g. a date and read time. */
  meta?: string;
};

export function OgCard({ eyebrow, title, footer, meta }: OgCardProps) {
  const text = clampTitle(title);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: C.bg,
        borderTop: `10px solid ${C.accent}`,
        padding: "72px 80px 64px",
        fontFamily: "Space Grotesk",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: C.accent,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 10,
              background: C.accent,
            }}
          />
          {eyebrow}
        </div>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            fontSize: titleSize(text),
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -2,
            color: C.ink,
          }}
        >
          {text}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `2px solid ${C.line}`,
          paddingTop: 28,
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: 1,
          color: C.inkSoft,
        }}
      >
        <div style={{ display: "flex" }}>{footer}</div>
        {meta && <div style={{ display: "flex", color: C.inkFaint }}>{meta}</div>}
      </div>
    </div>
  );
}
