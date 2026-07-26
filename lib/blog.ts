// ════════════════════════════════════════════════════════════════════
//  BLOG SOURCES
//  Two feeds, one list:
//    · content/blog/*.mdx  — posts written here, hosted on this domain
//    · lib/medium-posts.json — snapshot of Medium, refreshed by
//      `npm run sync:medium`; those cards link out to Medium.
//
//  Server-only: this reads from disk, so import it from Server
//  Components (never from a "use client" file).
// ════════════════════════════════════════════════════════════════════

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import mediumSnapshot from "./medium-posts.json";

export type PostSource = "medium" | "site";

export type Post = {
  slug: string;
  title: string;
  /** ISO yyyy-mm-dd */
  date: string;
  excerpt: string;
  tags: string[];
  readingMinutes: number;
  source: PostSource;
  /** Absolute Medium URL, or an on-site /blog/<slug> path. */
  href: string;
  external: boolean;
  draft: boolean;
};

type MediumEntry = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingMinutes: number;
  url: string;
};

export const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const WORDS_PER_MINUTE = 220;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Drafts are visible while running `npm run dev`, never in a production build. */
const showDrafts = process.env.NODE_ENV === "development";

function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function fail(file: string, message: string): never {
  throw new Error(`Invalid blog post — content/blog/${file}: ${message}`);
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v)).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

/**
 * Posts authored in this repo. Frontmatter is validated loudly: a typo in a
 * date or a missing title fails the build rather than shipping a broken card.
 */
export function getSitePosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");

      if (!data.title) fail(file, "frontmatter is missing `title`.");

      // gray-matter turns an unquoted YAML date into a Date object; both the
      // quoted string and the bare form must normalise to the same ISO day.
      const rawDate =
        data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : String(data.date ?? "").trim();

      if (!ISO_DATE.test(rawDate)) {
        fail(file, `\`date\` must be YYYY-MM-DD (got ${JSON.stringify(data.date ?? null)}).`);
      }
      if (Number.isNaN(new Date(rawDate).getTime())) {
        fail(file, `\`date\` is not a real calendar date (got "${rawDate}").`);
      }

      const excerpt = String(data.excerpt ?? "").trim();
      if (!excerpt) fail(file, "frontmatter is missing `excerpt` (used on cards and for SEO).");

      return {
        slug,
        title: String(data.title).trim(),
        date: rawDate,
        excerpt,
        tags: toStringArray(data.tags),
        readingMinutes: readingMinutes(content),
        source: "site" as const,
        href: `/blog/${slug}`,
        external: false,
        draft: data.draft === true,
      };
    })
    .filter((post) => showDrafts || !post.draft);
}

/** Medium posts from the committed snapshot. Never drafts — they are already public. */
export function getMediumPosts(): Post[] {
  return (mediumSnapshot as MediumEntry[]).map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    date: entry.date,
    excerpt: entry.excerpt,
    tags: entry.tags ?? [],
    readingMinutes: entry.readingMinutes,
    source: "medium" as const,
    href: entry.url,
    external: true,
    draft: false,
  }));
}

/** Everything, newest first. */
export function getAllPosts(): Post[] {
  return [...getSitePosts(), ...getMediumPosts()].sort(
    (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
  );
}

/** The MDX body plus metadata for one on-site post, or null if there is no such post. */
export function getSitePost(slug: string): { post: Post; body: string } | null {
  const post = getSitePosts().find((p) => p.slug === slug);
  if (!post) return null;

  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
  return { post, body: matter(raw).content };
}

/** Slugs for generateStaticParams — drafts included in dev so they are previewable. */
export function getSitePostSlugs(): string[] {
  return getSitePosts().map((post) => post.slug);
}

export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatPostMonth(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
