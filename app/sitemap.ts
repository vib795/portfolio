import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://singhcodes.dev";

/**
 * Every post, from both sources.
 *
 * These URLs are crawlable but not all of them are canonical to this
 * domain: a Medium landing page declares the Medium original as its
 * canonical, so Google folds it into that post instead of indexing this
 * one. That is the intent — the reads belong on Medium. Search Console
 * reports them as "Alternate page with proper canonical tag", which is an
 * exclusion rather than an error, and listing them is what gets the pages
 * crawled and their canonicals discovered in the first place.
 *
 * What must never appear here is a `noindex` URL — that earns a real
 * "Submitted URL marked 'noindex'" error. Keep this file in step with
 * generateMetadata in app/blog/[slug]/page.tsx: if a page is ever set back
 * to noindex, drop it from this list in the same commit.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(`${post.date}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts,
  ];
}
