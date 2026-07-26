import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import PostRow from "./PostRow";
import Reveal from "./Reveal";
import SectionTag from "./SectionTag";
import { ArrowRight } from "./icons";

const HOMEPAGE_LIMIT = 5;

export default function Writing() {
  const posts = getAllPosts();
  if (posts.length === 0) return null;

  const featured = posts.slice(0, HOMEPAGE_LIMIT);

  return (
    <section id="writing" className="border-t border-line bg-paper-dim">
      <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <Reveal>
          <SectionTag index="04" label="Writing" />
        </Reveal>
        <Reveal delay={0.05} className="mt-9">
          <h2 className="text-[clamp(2.2rem,5vw,4.25rem)] font-bold leading-[1.04] tracking-[-0.03em]">
            Notes from <span className="text-ink-faint">building things.</span>
          </h2>
        </Reveal>

        <div className="mt-12 lg:mt-16">
          {featured.map((post, i) => (
            <Reveal key={post.href} delay={Math.min(i, 3) * 0.05}>
              <PostRow post={post} index={i} />
            </Reveal>
          ))}
        </div>

        <Reveal className="border-t border-line pt-9">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 font-mono text-[0.78rem] uppercase tracking-[0.16em] text-ink transition-colors hover:text-accent"
          >
            <span className="link-line">
              {posts.length > featured.length
                ? `All ${posts.length} posts`
                : "All posts"}
            </span>
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
