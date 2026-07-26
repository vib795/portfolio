# Publishing guide

Everything about getting writing onto **singhcodes.dev**.

**You write on Medium.** That is the deliberate choice — Medium has the
distribution, the tags, the recommendation feed, and the publications
(Stackademic) that a personal domain cannot replicate. This site does not try
to compete with that.

What this site does is own the **link**. Every Medium post gets a page here:

```
singhcodes.dev/blog/llm-evals-the-complete-field-guide   ← share this
        ↓  one click
blog.stackademic.com/llm-evals-...                        ← reader lands here
```

Share the singhcodes.dev link everywhere. The preview card on LinkedIn or X
shows **your** domain and **your** artwork, because the crawler stops at your
page instead of following a redirect through to Medium. The reader still ends
up on Medium, so the claps and follows land where they should.

| | Published on Medium | Written on this site |
|---|---|---|
| Lives in | `lib/medium-posts.json` | `content/blog/*.mdx` |
| `/blog/<slug>` shows | title, excerpt, **Read on Medium** | the full post |
| Indexed by Google | no (`noindex, follow`) | yes |
| How it gets there | `npm run sync:medium` | you write the file |

Nothing is fetched at runtime. The site is fully static, so a post only changes
when you commit and push.

---

## A. After you publish on Medium

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
✓ content/medium-archive/ — 10 bodies archived
  commit the JSON to publish the change.
```

### Step 2 — Check what changed

```bash
git diff lib/medium-posts.json
```

You should see your new post added. If you want to tidy the auto-generated
excerpt or add tags, edit `lib/medium-posts.json` by hand now — the sync will
not overwrite your edits unless Medium's own copy changes.

### Step 3 — Commit and push

```bash
git add lib/medium-posts.json content/medium-archive
git commit -m "content: sync medium"
git push
```

Vercel deploys in about 20 seconds. Your share link is then live at
`https://singhcodes.dev/blog/<slug>` — the slug is generated from the title,
and `git diff` shows it.

### Why it says "kept off-feed"

**Medium's RSS feed only exposes your ~10 most recent stories.** Everything
older is invisible to it. So `lib/medium-posts.json` is a permanent, committed
archive and the sync **merges into it** — it never deletes. `kept off-feed`
counts the posts that live in your archive but have aged out of the feed.

Without it, an older post would silently vanish from your site the day an 11th
post pushed it off the feed. That already happened once — the 2024 Raspberry Pi
post dropped off the feed and was preserved by the merge.

**Never regenerate this file from scratch.** It is the source of truth, not a
cache. The 19 posts from 2023–2024 in it predate the feed window and were
backfilled once from Medium's sitemap; a fresh `sync` alone cannot rebuild them.

### If a post gets accepted into a publication

You will see:

```
  1 post(s) moved to a publication URL — links updated.
```

When Stackademic (or any publication) accepts a story, Medium keeps the story
ID but changes the hostname — `connectwithutkarshsingh.medium.com/foo-abc123`
becomes `blog.stackademic.com/foo-abc123`. The sync merges on that **story ID**,
not the full URL, so the move updates the existing entry instead of filing the
same post twice. Nothing for you to do; just commit.

### If you get rate-limited

```
✗ medium sync failed: feed request rate-limited (HTTP 429) after 4 attempts.
```

Medium throttles bursts. The script retries with backoff on its own; if it still
fails, wait a few minutes and rerun. **Your JSON is left untouched on failure**,
so a failed sync never damages anything.

### Syncing a different account

```bash
MEDIUM_HANDLE=@someone-else npm run sync:medium
```

---

## B. The body archive

`content/medium-archive/<slug>.html` holds the full text of each post, pulled
from the same RSS payload the excerpt comes from. **It is insurance, not
content** — nothing in it is rendered on the site.

The point: if Medium ever changes its paywall, its policy, or your account, the
writing still exists in your repo and the landing pages can be turned into real
pages. Costs nothing and needs no change to how you work.

Two limits worth knowing:

- Only the ~10 posts currently in the feed can be captured. The older
  backfilled posts have no body and never will — this protects everything from
  now on, not retroactively.
- A post whose body comes through truncated (a paywall teaser) is skipped with
  a warning rather than archived as a stub.

---

## C. Publishing a post on this site instead

Rare, but supported — for anything that does not belong on Medium.

### Step 1 — Create the file

```bash
touch content/blog/my-new-post.mdx
```

**The filename becomes the URL.** `my-new-post.mdx` → `singhcodes.dev/blog/my-new-post`.
Use lowercase words separated by hyphens. Don't rename it after publishing or
you break the link.

### Step 2 — Add the frontmatter

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

`content/blog/welcome-to-the-blog.mdx` is a live template showing every
supported element. Copy it as a starting point.

Images go in `public/blog/` and are referenced from the site root:

```markdown
![Describe the image for screen readers](/blog/my-diagram.png)
```

### Step 4 — Preview, then publish

```bash
npm run dev     # http://localhost:3000/blog — drafts show with a DRAFT badge
```

Set `draft: false`, then commit and push.

**To unpublish:** set `draft: true` and push again. The page 404s and the card
disappears.

**Scratch work:** filenames starting with `_` are ignored entirely, so
`_half-finished-idea.mdx` is safe to commit.

---

## D. Removing a Medium post from the site

Delete its object from `lib/medium-posts.json`, then commit. It comes back next
sync **only if** it is still within Medium's 10 most recent. For older posts the
deletion is permanent, so keep a copy if you are unsure.

---

## Social preview cards

Cards are generated at build time by `app/opengraph-image.tsx` (site-wide) and
`app/blog/[slug]/opengraph-image.tsx` (per post), using the committed fonts in
`assets/fonts/`. Nothing to design or upload — a new post gets a card
automatically.

To check one before sharing:

```bash
npm run build && npx next start -p 3100
open http://localhost:3100/blog/<slug>/opengraph-image
```

---

## Quick reference

```bash
npm run sync:medium    # pull new Medium posts + archive bodies
npm run dev            # preview at localhost:3000 (drafts visible)
npm run build          # verify a production build before pushing
git push               # deploy (Vercel, ~20s)
```

| Symptom | Cause |
|---|---|
| Build fails: `Duplicate blog slug "..."` | Two posts claim one URL. Rename the `.mdx`, or edit the slug in `lib/medium-posts.json` |
| Build fails naming an `.mdx` file | Bad frontmatter — check `date` is `YYYY-MM-DD` and quoted |
| New post not on the live site | `draft: true` is still set |
| Medium post missing after sync | It fell outside the feed window; add it to the JSON by hand |
| `sync:medium` fails with 429 | Rate limit. Wait a few minutes, rerun. Nothing was changed |
| Shared link shows a blank preview | The card is built at deploy time — check the deploy finished |
