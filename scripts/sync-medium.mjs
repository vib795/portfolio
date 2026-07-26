// ════════════════════════════════════════════════════════════════════
//  MEDIUM SYNC
//  Pulls the Medium RSS feed and merges it into lib/medium-posts.json.
//
//  Medium's feed only exposes the ~10 most recent stories, so this
//  MERGES rather than overwrites: posts already in the snapshot are
//  kept forever, even once they age off the feed. Run it after
//  publishing on Medium, then commit the updated JSON.
//
//      npm run sync:medium
// ════════════════════════════════════════════════════════════════════

import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";

const HANDLE = process.env.MEDIUM_HANDLE ?? "@connectwithutkarshsingh";
const FEED_URL = `https://medium.com/feed/${HANDLE}`;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SNAPSHOT = path.join(root, "lib", "medium-posts.json");

const WORDS_PER_MINUTE = 220;
const EXCERPT_MAX = 190;

/** Decode the handful of entities Medium actually emits, then drop all markup. */
function htmlToText(html) {
  return String(html ?? "")
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    // &amp; must come last so "&amp;lt;" cannot become a live "<".
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Truncate on a word boundary so excerpts never end mid-word. */
function toExcerpt(text) {
  if (text.length <= EXCERPT_MAX) return text;
  const cut = text.slice(0, EXCERPT_MAX);
  const lastSpace = cut.lastIndexOf(" ");
  const body = lastSpace > 80 ? cut.slice(0, lastSpace) : cut;
  return `${body.replace(/[,;:.\s]+$/, "")}…`;
}

/** Strip Medium's RSS tracking query string and trailing slash. */
function cleanUrl(link) {
  try {
    const url = new URL(String(link));
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return String(link ?? "").trim();
  }
}

function toSlug(title) {
  return String(title)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72)
    .replace(/-+$/, "");
}

function toIsoDate(pubDate) {
  const parsed = new Date(String(pubDate));
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function asArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

async function readSnapshot() {
  try {
    const raw = await readFile(SNAPSHOT, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw new Error(
      `lib/medium-posts.json exists but could not be parsed — fix or delete it before syncing.\n${error.message}`,
    );
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Medium sits behind Cloudflare and will hand out a 429 if it sees a burst of
 * traffic from your IP. That is transient, so back off and retry rather than
 * failing the sync outright.
 */
async function fetchFeed(attempt = 1) {
  const MAX_ATTEMPTS = 4;
  const response = await fetch(FEED_URL, {
    headers: { "user-agent": "singhcodes.dev-blog-sync" },
  });

  if (response.ok) return response.text();

  const retryable = response.status === 429 || response.status >= 500;
  if (retryable && attempt < MAX_ATTEMPTS) {
    const waitMs = 2 ** attempt * 2000;
    console.warn(
      `  ! HTTP ${response.status} — retrying in ${waitMs / 1000}s (attempt ${attempt}/${MAX_ATTEMPTS - 1})`,
    );
    await sleep(waitMs);
    return fetchFeed(attempt + 1);
  }

  throw new Error(
    response.status === 429
      ? `feed request rate-limited (HTTP 429) after ${attempt} attempts. Medium throttles bursts — wait a few minutes and run it again. lib/medium-posts.json was left untouched.`
      : `feed request failed — HTTP ${response.status} for ${FEED_URL}`,
  );
}

function parseItems(xml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    // Keep every value a string — otherwise a numeric-looking title or date gets coerced.
    parseTagValue: false,
    parseAttributeValue: false,
    trimValues: true,
  });

  const feed = parser.parse(xml);
  const items = asArray(feed?.rss?.channel?.item);
  if (items.length === 0) {
    throw new Error("feed parsed but contained no <item> entries");
  }

  return items.flatMap((item) => {
    const url = cleanUrl(item.link);
    const title = htmlToText(item.title);
    const date = toIsoDate(item.pubDate);
    const bodyText = htmlToText(item["content:encoded"] ?? item.description);

    if (!url || !title || !date) {
      console.warn(`  ! skipped item with missing title/link/date: ${title || url || "(empty)"}`);
      return [];
    }

    const words = bodyText ? bodyText.split(" ").length : 0;

    return [
      {
        slug: toSlug(title),
        title,
        date,
        excerpt: toExcerpt(bodyText),
        tags: asArray(item.category).map(htmlToText).filter(Boolean).slice(0, 4),
        readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
        url,
      },
    ];
  });
}

async function main() {
  console.log(`→ fetching ${FEED_URL}`);
  const items = parseItems(await fetchFeed());
  console.log(`  feed returned ${items.length} post(s)`);

  const existing = await readSnapshot();
  const byUrl = new Map(existing.map((post) => [post.url, post]));

  let added = 0;
  let updated = 0;

  for (const item of items) {
    const prior = byUrl.get(item.url);
    if (!prior) {
      added += 1;
    } else if (JSON.stringify(prior) !== JSON.stringify(item)) {
      updated += 1;
    }
    byUrl.set(item.url, item);
  }

  const feedUrls = new Set(items.map((i) => i.url));
  const kept = existing.filter((post) => !feedUrls.has(post.url)).length;

  const merged = [...byUrl.values()].sort(
    (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
  );

  await writeFile(SNAPSHOT, `${JSON.stringify(merged, null, 2)}\n`, "utf8");

  console.log(
    `✓ lib/medium-posts.json — ${merged.length} total (${added} added, ${updated} updated, ${kept} kept off-feed)`,
  );
  if (added || updated) console.log("  commit the JSON to publish the change.");
}

main().catch((error) => {
  console.error(`✗ medium sync failed: ${error.message}`);
  process.exitCode = 1;
});
