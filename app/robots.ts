import type { MetadataRoute } from "next";

const BASE = "https://singhcodes.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}

// The Medium landing pages under /blog/<slug> are deliberately NOT disallowed
// here. They carry `noindex, follow` in their metadata, and a crawler has to
// fetch a page to see that tag — a robots.txt Disallow would hide the noindex
// and let the URLs get indexed anyway from inbound links, which is the
// opposite of the intent.
