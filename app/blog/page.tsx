import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PostRow from "@/components/PostRow";
import Reveal from "@/components/Reveal";
import SectionTag from "@/components/SectionTag";
import { getAllPosts } from "@/lib/blog";
import { profile } from "@/lib/content";

const DESCRIPTION =
  "Essays and field notes on AI systems, agents, backend engineering, and the things I build on the side.";

export const metadata: Metadata = {
  title: `Writing — ${profile.name}`,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Writing — ${profile.name}`,
    description: DESCRIPTION,
    url: "/blog",
    type: "website",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const years = [...new Set(posts.map((p) => p.date.slice(0, 4)))].sort((a, b) =>
    b.localeCompare(a),
  );

  return (
    <>
      <Nav />
      <main id="top">
        <section className="border-b border-line">
          <div className="mx-auto max-w-[88rem] px-5 pb-16 pt-36 sm:px-8 sm:pb-20 sm:pt-44 lg:px-12">
            <Reveal>
              <SectionTag index="04" label="Writing" />
            </Reveal>
            <Reveal delay={0.05} className="mt-9">
              <h1 className="max-w-4xl text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.03em]">
                Notes from{" "}
                <span className="text-ink-faint">building things.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="mt-7">
              <p className="max-w-prose leading-relaxed text-ink-soft">
                {posts.length} posts on AI systems, agents, backend engineering,
                and side projects. Some live here, some on Medium — the Medium
                ones open in a new tab.
              </p>
            </Reveal>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-[88rem] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12 lg:pb-40">
            {years.map((year) => (
              <div key={year} className="pt-16 first:pt-12">
                <Reveal>
                  <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-ink-faint">
                    {year}
                  </h2>
                </Reveal>
                <div className="mt-6">
                  {posts
                    .map((post, absoluteIndex) => ({ post, absoluteIndex }))
                    .filter(({ post }) => post.date.startsWith(year))
                    .map(({ post, absoluteIndex }, i) => (
                      <Reveal key={post.href} delay={Math.min(i, 3) * 0.05}>
                        <PostRow post={post} index={absoluteIndex} />
                      </Reveal>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
