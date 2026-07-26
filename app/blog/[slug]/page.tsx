import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MediumPostLanding from "@/components/MediumPostLanding";
import { ArrowRight } from "@/components/icons";
import {
  formatPostDate,
  getAllPostSlugs,
  getMediumPost,
  getPost,
  getRelatedPosts,
  getSitePost,
  type Post,
} from "@/lib/blog";
import { profile, socials } from "@/lib/content";
import { blogPostingSchema, jsonLd } from "@/lib/schema";

// Every post — on-site or Medium — is known at build time, so anything
// else is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const shared: Metadata = {
    title: `${post.title} — ${profile.name}`,
    description: post.excerpt,
    // Must be set on both branches: the root layout declares canonical "/",
    // and without an override every post page would claim the homepage as
    // its canonical URL.
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [profile.name],
      tags: post.tags,
    },
  };

  if (post.source === "medium") {
    // The body lives on Medium; this page is an excerpt plus a link. Keeping
    // it out of the index stops a thin page competing with the real post,
    // which is where the reads should land. `follow` so the outbound link
    // still carries.
    return { ...shared, robots: { index: false, follow: true } };
  }

  return shared;
}

const mdxOptions: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          // Dual themes emit --shiki-light / --shiki-dark vars; globals.css
          // picks the right one so code follows the site's theme toggle.
          theme: { light: "github-light", dark: "github-dark-dimmed" },
          keepBackground: false,
        },
      ],
    ],
  },
};

function SiteArticle({ post, body }: { post: Post; body: string }) {
  return (
    <article>
      <header className="border-b border-line">
        <div className="mx-auto max-w-[52rem] px-5 pb-14 pt-36 sm:px-8 sm:pb-16 sm:pt-44">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-faint transition-colors hover:text-accent"
          >
            <ArrowRight className="size-3.5 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="link-line">All writing</span>
          </Link>

          {post.draft && (
            <p className="mt-6 inline-block rounded-full border border-accent px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
              Draft — visible in dev only
            </p>
          )}

          <h1 className="mt-7 text-[clamp(2.1rem,5.2vw,3.6rem)] font-bold leading-[1.06] tracking-[-0.03em]">
            {post.title}
          </h1>

          <p className="mt-6 font-mono text-xs tracking-[0.04em] text-ink-faint">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden="true"> · </span>
            {post.readingMinutes} min read
          </p>

          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-soft"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-[52rem] px-5 py-16 sm:px-8 sm:py-20">
        <div className="article">
          <MDXRemote source={body} options={mdxOptions} />
        </div>
      </div>
    </article>
  );
}

function PostShell({ children }: { children: React.ReactNode }) {
  const medium = socials.find((s) => s.label === "Medium");

  return (
    <>
      <Nav />
      <main id="top">
        {children}

        <section className="border-t border-line bg-paper-dim">
          <div className="mx-auto flex max-w-[52rem] flex-col gap-5 px-5 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-soft">
              Written by {profile.name}
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link
                href="/blog"
                className="link-line font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink transition-colors hover:text-accent"
              >
                More writing
              </Link>
              {medium && (
                <a
                  href={medium.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink transition-colors hover:text-accent"
                >
                  Follow on Medium
                </a>
              )}
              <Link
                href="/#contact"
                className="link-line font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink transition-colors hover:text-accent"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const site = getSitePost(slug);
  if (site) {
    return (
      <>
        {/* Only posts hosted here get BlogPosting markup — see lib/schema.ts. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(blogPostingSchema(site.post)) }}
        />
        <PostShell>
          <SiteArticle post={site.post} body={site.body} />
        </PostShell>
      </>
    );
  }

  const medium = getMediumPost(slug);
  if (!medium) notFound();

  return (
    <PostShell>
      <MediumPostLanding post={medium} related={getRelatedPosts(slug)} />
    </PostShell>
  );
}
