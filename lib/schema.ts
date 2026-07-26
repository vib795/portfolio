// ════════════════════════════════════════════════════════════════════
//  STRUCTURED DATA (JSON-LD)
//  Tells Google who this person is and what these pages are, rather
//  than leaving it to infer from markup. Everything derives from
//  lib/content.ts so there is one source of truth.
// ════════════════════════════════════════════════════════════════════

import type { Post } from "./blog";
import { profile, socials } from "./content";

const BASE = "https://singhcodes.dev";

/**
 * Serialise for embedding in a <script> tag.
 *
 * JSON.stringify happily emits a literal "</script>" if any string contains
 * one, which would break out of the tag. Escaping "<" as < is still
 * valid JSON and closes that off regardless of what lands in a title.
 */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/** "New York, NY" -> a PostalAddress, or undefined if the shape is unexpected. */
function address() {
  const [locality, region] = profile.location.split(",").map((part) => part.trim());
  if (!locality || !region) return undefined;

  return {
    "@type": "PostalAddress",
    addressLocality: locality,
    addressRegion: region,
    addressCountry: "US",
  };
}

const person = {
  "@type": "Person",
  "@id": `${BASE}/#person`,
  name: profile.name,
  givenName: profile.first,
  familyName: profile.last,
  url: BASE,
  jobTitle: profile.role,
  description: profile.intro,
  email: `mailto:${profile.email}`,
  address: address(),
  image: `${BASE}/opengraph-image`,
  // sameAs is what lets Google connect this page to the GitHub, LinkedIn and
  // Medium profiles as one identity.
  sameAs: socials.map((social) => social.url),
};

/** Person + WebSite for the homepage. */
export function homeSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${BASE}/#website`,
        url: BASE,
        name: `${profile.name} — ${profile.role}`,
        description: profile.intro,
        publisher: { "@id": `${BASE}/#person` },
        inLanguage: "en-US",
      },
    ],
  };
}

/** Blog schema for the /blog index. */
export function blogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${BASE}/blog#blog`,
    url: `${BASE}/blog`,
    name: `Writing — ${profile.name}`,
    author: { "@id": `${BASE}/#person` },
    publisher: { "@id": `${BASE}/#person` },
    inLanguage: "en-US",
  };
}

/**
 * BlogPosting for a post hosted here.
 *
 * Not emitted for Medium landing pages: those are noindex, and claiming
 * authorship of an article whose body lives elsewhere would be misleading
 * structured data.
 */
export function blogPostingSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${BASE}/blog/${post.slug}#post`,
    url: `${BASE}/blog/${post.slug}`,
    mainEntityOfPage: `${BASE}/blog/${post.slug}`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@id": `${BASE}/#person` },
    publisher: { "@id": `${BASE}/#person` },
    image: `${BASE}/blog/${post.slug}/opengraph-image`,
    keywords: post.tags.length > 0 ? post.tags.join(", ") : undefined,
    inLanguage: "en-US",
  };
}
