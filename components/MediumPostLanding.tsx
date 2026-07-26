import Link from "next/link";
import type { Post } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog";
import { ArrowRight, ArrowUpRight, MediumIcon } from "./icons";

/**
 * Landing page for a post whose body lives on Medium.
 *
 * The point is the share link: pasting singhcodes.dev/blog/<slug> anywhere
 * unfurls with this site's card and this site's domain, and the reader still
 * lands on Medium one click later — where the audience and the claps are.
 * A bare redirect would hand the preview card straight to Medium instead.
 */
export default function MediumPostLanding({
  post,
  related,
}: {
  post: Post;
  related: Post[];
}) {
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

          {/* Block-level flex, not inline-flex: the back link above is inline,
              so an inline badge would sit on the same line and collide. */}
          <p className="mt-7 flex w-fit items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint">
            <MediumIcon className="size-3.5" />
            Published on Medium
          </p>

          <h1 className="mt-5 text-[clamp(2.1rem,5.2vw,3.6rem)] font-bold leading-[1.06] tracking-[-0.03em]">
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
        <p className="text-[1.15rem] leading-[1.75] text-ink-soft sm:text-[1.22rem]">
          {post.excerpt}
        </p>

        {post.mediumUrl && (
          <div className="mt-12 rounded-2xl border border-line bg-surface-sunken p-7 sm:p-9">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint">
              Read the rest
            </p>
            <p className="mt-3 max-w-prose leading-relaxed text-ink-soft">
              The full post lives on Medium, where I publish everything.
            </p>

            <a
              href={post.mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 font-mono text-[0.76rem] uppercase tracking-[0.16em] text-cream transition-colors duration-300 hover:bg-accent-deep"
            >
              <MediumIcon className="size-4" />
              Read on Medium
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-paper-dim">
          <div className="mx-auto max-w-[52rem] px-5 py-14 sm:px-8 sm:py-16">
            <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-ink-faint">
              Keep reading
            </h2>
            <ul className="mt-7">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={item.href}
                    className="group flex items-baseline justify-between gap-6 border-t border-line py-5 first:border-t-0 first:pt-0"
                  >
                    <span className="font-medium leading-snug transition-colors duration-300 group-hover:text-accent">
                      {item.title}
                    </span>
                    <span className="shrink-0 font-mono text-[0.7rem] tracking-[0.04em] text-ink-faint">
                      {formatPostDate(item.date)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
