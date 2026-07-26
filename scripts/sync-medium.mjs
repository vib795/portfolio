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

import { writeFile, readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";

const HANDLE = process.env.MEDIUM_HANDLE ?? "@connectwithutkarshsingh";
const FEED_URL = `https://medium.com/feed/${HANDLE}`;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SNAPSHOT = path.join(root, "lib", "medium-posts.json");
const ARCHIVE_DIR = path.join(root, "content", "medium-archive");

const WORDS_PER_MINUTE = 220;
const EXCERPT_MAX = 190;

/** Below this, <content:encoded> is a paywall teaser rather than a real post. */
const MIN_ARCHIVE_BYTES = 1500;

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

/**
 * Identity for the merge.
 *
 * A Medium URL ends in the story's 12-hex ID, and that ID survives the story
 * being accepted into a publication — at which point the hostname changes
 * from the personal subdomain to e.g. blog.stackademic.com. Keying on the
 * full URL treats that as a brand new post and files the same story twice,
 * which is exactly what happened to "LLM evals: the complete field guide".
 *
 * Falls back to the whole URL for anything without an ID, so a hand-added
 * entry still merges predictably.
 */
function postKey(url) {
  const match = /-([0-9a-f]{12})$/i.exec(String(url ?? ""));
  return match ? match[1].toLowerCase() : String(url ?? "");
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
    const bodyHtml = String(item["content:encoded"] ?? "");
    const bodyText = htmlToText(bodyHtml || item.description);

    if (!url || !title || !date) {
      console.warn(`  ! skipped item with missing title/link/date: ${title || url || "(empty)"}`);
      return [];
    }

    const words = bodyText ? bodyText.split(" ").length : 0;

    return [
      {
        post: {
          slug: toSlug(title),
          title,
          date,
          excerpt: toExcerpt(bodyText),
          tags: asArray(item.category).map(htmlToText).filter(Boolean).slice(0, 4),
          readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
          url,
        },
        bodyHtml,
      },
    ];
  });
}

/**
 * Medium's RSS carries the full post body in <content:encoded> — the same
 * value the excerpt is sliced from, otherwise discarded. Keeping a copy costs
 * nothing and means the writing survives independently of Medium.
 *
 * Nothing here is rendered on the site; it is insurance, not content. Only
 * the ~10 posts currently in the feed can be captured, so this protects
 * everything published from now on rather than backfilling the archive.
 */
async function archiveBodies(entries) {
  await mkdir(ARCHIVE_DIR, { recursive: true });

  let written = 0;
  let skipped = 0;

  for (const { post, bodyHtml } of entries) {
    if (bodyHtml.length < MIN_ARCHIVE_BYTES) {
      console.warn(
        `  ! body came through truncated (${bodyHtml.length}B) — not archived: ${post.title}`,
      );
      skipped += 1;
      continue;
    }

    await writeFile(path.join(ARCHIVE_DIR, `${post.slug}.html`), `${bodyHtml}\n`, "utf8");
    written += 1;
  }

  return { written, skipped };
}

async function main() {
  console.log(`→ fetching ${FEED_URL}`);
  const entries = parseItems(await fetchFeed());
  const items = entries.map((entry) => entry.post);
  console.log(`  feed returned ${items.length} post(s)`);

  const existing = await readSnapshot();
  const byId = new Map(existing.map((post) => [postKey(post.url), post]));

  let added = 0;
  let updated = 0;
  let moved = 0;

  for (const item of items) {
    const key = postKey(item.url);
    const prior = byId.get(key);

    if (!prior) {
      added += 1;
    } else if (JSON.stringify(prior) !== JSON.stringify(item)) {
      // The feed is authoritative about where a story currently lives, so a
      // publication move overwrites the older personal-domain URL.
      if (prior.url !== item.url) moved += 1;
      updated += 1;
    }
    byId.set(key, item);
  }

  const feedIds = new Set(items.map((i) => postKey(i.url)));
  const kept = existing.filter((post) => !feedIds.has(postKey(post.url))).length;

  const merged = [...byId.values()].sort(
    (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
  );

  await writeFile(SNAPSHOT, `${JSON.stringify(merged, null, 2)}\n`, "utf8");

  console.log(
    `✓ lib/medium-posts.json — ${merged.length} total (${added} added, ${updated} updated, ${kept} kept off-feed)`,
  );
  if (moved) {
    console.log(`  ${moved} post(s) moved to a publication URL — links updated.`);
  }

  const archive = await archiveBodies(entries);
  console.log(
    `✓ content/medium-archive/ — ${archive.written} bodies archived` +
      (archive.skipped ? `, ${archive.skipped} truncated and skipped` : ""),
  );

  if (added || updated) console.log("  commit the JSON to publish the change.");
}

main().catch((error) => {
  console.error(`✗ medium sync failed: ${error.message}`);
  process.exitCode = 1;
});
