import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://singhcodes.dev";

/**
 * Only indexable URLs belong here — which is now every post, from both
 * sources.
 *
 * Medium landing pages used to be `noindex`, so listing them would have
 * earned a "Submitted URL marked 'noindex'" error in Search Console for
 * each one. They are indexable and canonical to this domain as of this
 * change, so they belong here — but the two must be kept in step. If a page
 * is ever set back to `noindex`, drop it from this list in the same commit.
 * See generateMetadata in app/blog/[slug]/page.tsx.
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
