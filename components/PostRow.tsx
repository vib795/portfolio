import Link from "next/link";
import type { Post } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog";
import { ArrowRight, MediumIcon } from "./icons";

function SourceBadge({ post }: { post: Post }) {
  if (post.source === "medium") {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint">
        <MediumIcon className="size-3.5" />
        Medium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-accent">
      <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
      singhcodes.dev
    </span>
  );
}

export default function PostRow({ post, index }: { post: Post; index: number }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <article>
      {/* Every row is internal now — Medium posts route through a landing
          page on this domain, so a shared link carries our preview card. */}
      <Link
        href={post.href}
        className="group grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-4 border-t border-line py-9 md:grid-cols-[3.25rem_1fr_auto] md:gap-x-8"
      >
        <span
          className="hidden pt-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ink-faint md:block"
          aria-hidden="true"
        >
          {num}
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <SourceBadge post={post} />
            {post.draft && (
              <span className="rounded-full border border-accent px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-accent">
                Draft
              </span>
            )}
          </div>

          <h3 className="mt-3 text-[1.45rem] font-medium leading-snug tracking-tight transition-colors duration-300 group-hover:text-accent sm:text-[1.7rem]">
            {post.title}
          </h3>

          <p className="mt-2 font-mono text-xs tracking-[0.04em] text-ink-faint">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden="true"> · </span>
            {post.readingMinutes} min read
          </p>

          <p className="mt-3 max-w-prose leading-relaxed text-ink-soft">
            {post.excerpt}
          </p>

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
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

        <span className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-cream">
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </article>
  );
}
