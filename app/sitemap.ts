import type { MetadataRoute } from "next";
import { getSitePosts } from "@/lib/blog";

const BASE = "https://singhcodes.dev";

/**
 * Only indexable URLs belong here.
 *
 * The Medium landing pages are `noindex` by design — the real post lives on
 * Medium and should be the thing that ranks. Listing them would earn a
 * "Submitted URL marked 'noindex'" warning in Search Console for every one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSitePosts()
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
