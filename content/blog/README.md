# Writing

> **Full step-by-step guide: [`/PUBLISHING.md`](../../PUBLISHING.md)** — start there.
> This file is the short version for when you are already in this folder.

Two sources feed the **Writing** section on the homepage and the `/blog` index:

| Source | Lives in | Where the card links |
| ------ | -------- | -------------------- |
| Posts you write here | `content/blog/*.mdx` | `singhcodes.dev/blog/<slug>` |
| Medium posts | `lib/medium-posts.json` | out to Medium, new tab |

Both are merged and sorted newest-first. Nothing is fetched at runtime — the
site stays fully static.

## Publish a new post here

1. Create `content/blog/my-post-slug.mdx`. **The filename is the URL**:
   `my-post-slug.mdx` → `singhcodes.dev/blog/my-post-slug`.
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

3. Write the body in Markdown/MDX. See `welcome-to-the-blog.mdx` for every
   supported element (code blocks, tables, quotes, task lists, images).
4. Preview with `npm run dev` → http://localhost:3000/blog
5. Commit and push. Vercel deploys in about 20 seconds.

### Frontmatter reference

| Field | Required | Notes |
| ----- | -------- | ----- |
| `title` | yes | Card title and `<h1>` |
| `date` | yes | `YYYY-MM-DD`. Drives ordering and the year grouping |
| `excerpt` | yes | Card copy, meta description, OpenGraph description |
| `tags` | no | String array, rendered as chips |
| `draft` | no | `true` = visible in `npm run dev`, hidden in production |

Validation is deliberately strict: a missing `title`/`excerpt` or a malformed
`date` **fails the build** with the filename in the error, so a broken post is
caught before it deploys rather than shipping as an empty card.

Files starting with `_` are ignored, so `_scratch.mdx` is a safe scratchpad.

Images go in `public/blog/` and are referenced from the site root:
`![Alt text](/blog/diagram.png)`.

## Refresh the Medium posts

After publishing on Medium:

```bash
npm run sync:medium
git add lib/medium-posts.json && git commit -m "content: sync medium" && git push
```

Medium's RSS feed only exposes the ~10 most recent stories, so the script
**merges** into `lib/medium-posts.json` instead of overwriting it. Posts already
captured stay on the site forever, even after they age off the feed — which is
why the JSON is committed rather than fetched at build time.

To point it at a different account, set `MEDIUM_HANDLE`:

```bash
MEDIUM_HANDLE=@someone-else npm run sync:medium
```

Posts published under a Medium *publication* (Stackademic, Better Programming,
…) appear in the feed with that publication's domain. That is expected — the
links are correct.
