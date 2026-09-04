import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import PostRow from "./PostRow";
import Scramble from "./Scramble";
import ScrambleLink from "./ScrambleLink";
import { ArrowRight } from "./icons";

const HOMEPAGE_LIMIT = 5;

export default function Writing() {
  const posts = getAllPosts();
  if (posts.length === 0) return null;

  const featured = posts.slice(0, HOMEPAGE_LIMIT);

  return (
    <section id="writing" className="relative z-10">
      <div className="shell">
        <div className="rule-b grid lg:grid-cols-4">
          <div className="border-line-strong p-6 lg:border-r">
            <p className="label">/ Writing</p>
          </div>
          <div className="border-line-strong p-6 lg:col-span-2 lg:border-r">
            <h2 className="text-3xl tracking-tight lg:text-4xl">
              <Scramble text="Notes from building" />
            </h2>
          </div>
          <div className="p-6">
            <p className="label">Posts</p>
            <p className="mt-2 text-5xl tracking-tight tabular-nums">
              {String(posts.length).padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Opaque for the same reason the hero's featured cell is: post
            excerpts run the full width, and a rail through a line of
            prose reads as a rendering fault rather than as structure. */}
        <div className="rule-b bg-paper px-4 lg:px-6">
          {featured.map((post, i) => (
            <PostRow key={post.href} post={post} index={i} />
          ))}
        </div>

        <div className="rule-b p-6">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.16em] text-ink transition-colors hover:text-accent"
          >
            <span className="link-line">
              <ScrambleLink
                text={
                  posts.length > featured.length
                    ? `All ${posts.length} posts`
                    : "All posts"
                }
              />
            </span>
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
