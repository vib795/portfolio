// ════════════════════════════════════════════════════════════════════
//  ICON GENERATION
//  Rasterises app/icon.svg into the formats an SVG favicon doesn't
//  cover: a real multi-size .ico for legacy clients, and PNGs for the
//  web manifest.
//
//      npm run icons
//
//  Only needs re-running if app/icon.svg changes. Outputs are
//  committed so the build never depends on this script.
// ════════════════════════════════════════════════════════════════════

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(root, "app", "icon.svg");

/** Background of the mark, matching the rect fill in icon.svg. */
const MARK_BG = "#1b1613";

/** Sizes embedded in favicon.ico: 16 the browser tab, 32 the bookmark bar,
 *  48 the Windows shortcut. */
const ICO_SIZES = [16, 32, 48];

async function render(svg, size) {
  return sharp(svg, { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Assemble an ICO container.
 *
 * sharp cannot write .ico (verified: format.ico.output is false), but the
 * format has allowed PNG-encoded entries since Vista, so the container is
 * just a header plus a directory pointing at PNG blobs.
 *
 *   ICONDIR       6 bytes   reserved=0, type=1, imageCount
 *   ICONDIRENTRY  16 bytes  per image, then the PNG payloads
 */
function buildIco(images) {
  const HEADER = 6;
  const ENTRY = 16;

  const header = Buffer.alloc(HEADER);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon (2 would be cursor)
  header.writeUInt16LE(images.length, 4);

  let offset = HEADER + ENTRY * images.length;
  const entries = [];

  for (const { size, data } of images) {
    const entry = Buffer.alloc(ENTRY);
    // 0 means 256 in these fields; none of our sizes reach it, but be explicit.
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // palette size — 0 for truecolour
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

/**
 * Maskable icons get cropped to a circle by Android, so the glyph has to sit
 * inside roughly the middle 80%. Scale the mark down and pad it with the
 * background colour rather than letting the launcher clip the chevron.
 */
async function renderMaskable(svg, size) {
  const glyph = await render(svg, Math.round(size * 0.62));

  return sharp({
    create: { width: size, height: size, channels: 4, background: MARK_BG },
  })
    .composite([{ input: glyph, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  const svg = await readFile(SOURCE);
  await mkdir(path.join(root, "public"), { recursive: true });

  const icoImages = [];
  for (const size of ICO_SIZES) {
    icoImages.push({ size, data: await render(svg, size) });
  }
  const ico = buildIco(icoImages);
  await writeFile(path.join(root, "app", "favicon.ico"), ico);
  console.log(`✓ app/favicon.ico — ${ICO_SIZES.join("/")}px, ${ico.length} bytes`);

  for (const size of [192, 512]) {
    const png = await render(svg, size);
    await writeFile(path.join(root, "public", `icon-${size}.png`), png);
    console.log(`✓ public/icon-${size}.png — ${png.length} bytes`);
  }

  const maskable = await renderMaskable(svg, 512);
  await writeFile(path.join(root, "public", "icon-maskable-512.png"), maskable);
  console.log(`✓ public/icon-maskable-512.png — ${maskable.length} bytes`);
}

main().catch((error) => {
  console.error(`✗ icon generation failed: ${error.message}`);
  process.exitCode = 1;
});
