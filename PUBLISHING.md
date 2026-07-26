# Publishing guide

Everything about getting writing onto **singhcodes.dev**.

There are two kinds of posts and they work differently:

| | Written on this site | Written on Medium |
|---|---|---|
| Lives in | `content/blog/*.mdx` | `lib/medium-posts.json` |
| Card links to | `singhcodes.dev/blog/<slug>` | Medium, in a new tab |
| How it gets there | you write the file | `npm run sync:medium` |

Both feeds merge into one list, newest first, shown in the **Writing** section on
the homepage and in full at `/blog`.

Nothing is fetched at runtime. The site is fully static, so a post only changes
when you commit and push.

---

## A. Publish a new post on singhcodes.dev

### Step 1 — Create the file

```bash
cd ~/interesting-github-projects/portfolio
touch content/blog/my-new-post.mdx
```

**The filename becomes the URL.** `my-new-post.mdx` → `singhcodes.dev/blog/my-new-post`.
Use lowercase words separated by hyphens. Don't rename it after publishing or you
break the link.

### Step 2 — Add the frontmatter

Paste this at the very top of the file, between the `---` markers:

```yaml
---
title: "Your title here"
date: "2026-07-25"
excerpt: "One or two sentences. This is the card copy and the Google/social description."
tags: ["agents", "python"]
draft: true
---
```

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Card title and the page `<h1>` |
| `date` | yes | `YYYY-MM-DD`, quoted. Controls ordering and year grouping |
| `excerpt` | yes | Card copy, meta description, OpenGraph description |
| `tags` | no | Array of strings, rendered as chips |
| `draft` | no | `true` = visible locally, hidden in production |

Validation is strict on purpose: a missing `title`/`excerpt` or a malformed
`date` **fails the build and names the file**, so a broken post never reaches
production as a blank card.

### Step 3 — Write it

Standard Markdown below the frontmatter. Supported: headings (`##` to `####`),
**bold**, *italic*, `inline code`, links, blockquotes, bullet/numbered lists,
task lists, tables, images, and fenced code blocks with syntax highlighting that
follows the site's light/dark toggle.

````markdown
## A heading

Some prose with a [link](https://example.com).

```python
def hello() -> str:
    return "syntax highlighted automatically"
```
````

`content/blog/welcome-to-the-blog.mdx` is a live template showing every supported
element. Copy it as a starting point.

Images go in `public/blog/` and are referenced from the site root:

```markdown
![Describe the image for screen readers](/blog/my-diagram.png)
```

### Step 4 — Preview locally

```bash
npm run dev
```

Open http://localhost:3000/blog. Drafts show while running `dev`, marked with an
orange **DRAFT** badge, so you can read it in place before anyone else can.

### Step 5 — Publish

Set `draft: false` (or delete the line), then:

```bash
git add content/blog/my-new-post.mdx
git commit -m "post: your title here"
git push
```

Vercel builds and deploys automatically. Live on singhcodes.dev in about 20
seconds. Verify at `https://singhcodes.dev/blog`.

**To unpublish:** set `draft: true` and push again. The page starts returning 404
and the card disappears.

**Scratch work:** filenames starting with `_` are ignored entirely, so
`_half-finished-idea.mdx` is safe to commit.

---

## B. Sync posts you published on Medium

Do this whenever you publish something new on Medium.

### Step 1 — Run the sync

```bash
cd ~/interesting-github-projects/portfolio
npm run sync:medium
```

Expected output:

```
→ fetching https://medium.com/feed/@connectwithutkarshsingh
  feed returned 10 post(s)
✓ lib/medium-posts.json — 31 total (1 added, 0 updated, 20 kept off-feed)
  commit the JSON to publish the change.
```

### Step 2 — Check what changed

```bash
git diff lib/medium-posts.json
```

You should see your new post added. If you want to tidy the auto-generated
excerpt or add tags, edit `lib/medium-posts.json` by hand now — the sync will not
overwrite your edits unless Medium's own copy changes.

### Step 3 — Commit and push

```bash
git add lib/medium-posts.json
git commit -m "content: sync medium"
git push
```

### Why it says "kept off-feed"

**Medium's RSS feed only exposes your ~10 most recent stories.** Everything older
is invisible to it. So `lib/medium-posts.json` is a permanent, committed archive
and the sync **merges into it** — it never deletes. `kept off-feed` counts the
posts that live in your archive but have aged out of the feed.

This matters: without it, an older post would silently vanish from your site the
day an 11th post pushed it off the feed. That already happened once — the 2024
Raspberry Pi post dropped off the feed and was preserved by the merge.

**Never regenerate this file from scratch.** It is the source of truth, not a
cache. The 19 posts from 2023–2024 in it predate the feed window and were
backfilled once from Medium's sitemap; a fresh `sync` alone could not rebuild
them.

### If you get rate-limited

```
✗ medium sync failed: feed request rate-limited (HTTP 429) after 4 attempts.
```

Medium throttles bursts of requests. The script retries with backoff on its own;
if it still fails, wait a few minutes and rerun. **Your JSON is left untouched on
failure**, so a failed sync never damages anything.

### Syncing a different account

```bash
MEDIUM_HANDLE=@someone-else npm run sync:medium
```

### Posts published under a Medium publication

Some of your posts are published through **Stackademic**, so their URLs are
`blog.stackademic.com/...` rather than `medium.com/@...`. That is expected and
the links are correct.

---

## C. Removing a Medium post from the site

Delete its object from `lib/medium-posts.json`, then commit. It will come back
next sync **only if** it is still within Medium's 10 most recent. For older posts
the deletion is permanent, so keep a copy if you are unsure.

---

## Quick reference

```bash
npm run dev            # preview at localhost:3000 (drafts visible)
npm run sync:medium    # pull new Medium posts into the archive
npm run build          # verify a production build before pushing
git push               # deploy (Vercel, ~20s)
```

| Symptom | Cause |
|---|---|
| Build fails naming an `.mdx` file | Bad frontmatter — check `date` is `YYYY-MM-DD` and quoted |
| New post not on the live site | `draft: true` is still set |
| Post visible locally but not in production | Same — drafts are dev-only by design |
| Medium post missing after sync | It fell outside the feed window; add it to the JSON by hand |
| `sync:medium` fails with 429 | Rate limit. Wait a few minutes, rerun. Nothing was changed |
