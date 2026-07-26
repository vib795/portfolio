# Posts written on this site

> **Start here instead: [`/PUBLISHING.md`](../../PUBLISHING.md)** — the full guide.

This folder is for the rare post that does *not* go on Medium. Most writing is
published on Medium and pulled in by `npm run sync:medium`; those posts live in
`lib/medium-posts.json` and get a landing page at `/blog/<slug>` that links out.

Both sources merge into one list, newest first, on the homepage and at `/blog`.
Nothing is fetched at runtime — the site stays fully static.

## Publish one here

1. Create `content/blog/my-post-slug.mdx`. **The filename is the URL.**
2. Add frontmatter:

   ```yaml
   ---
   title: "Your title"
   date: "2026-07-25"      # YYYY-MM-DD — the build fails if this is malformed
   excerpt: "One or two sentences. Used on cards and as the meta description."
   tags: ["agents", "python"]
   draft: false
   ---
   ```

3. Write the body. `welcome-to-the-blog.mdx` demonstrates every supported
   element (code blocks, tables, quotes, task lists, images).
4. Preview with `npm run dev` → http://localhost:3000/blog
5. Commit and push. Vercel deploys in about 20 seconds.

Missing `title`/`excerpt` or a malformed `date` **fails the build** with the
filename in the error, so a broken post never ships as an empty card.

Files starting with `_` are ignored, so `_scratch.mdx` is a safe scratchpad.
Images go in `public/blog/` and are referenced from the site root:
`![Alt text](/blog/diagram.png)`.
