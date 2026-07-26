# Medium body archive

Full text of Medium posts, written by `npm run sync:medium` from the same
`<content:encoded>` payload the excerpts are sliced from.

**This is insurance, not content.** Nothing here is rendered on the site — the
`/blog/<slug>` pages show a title, an excerpt, and a link out to Medium. The
archive exists so the writing survives independently of Medium's paywall,
policy, or account decisions; if that ever matters, these bodies can be turned
into real pages.

Two limits:

- Medium's RSS carries only the ~10 most recent posts, so this captures
  everything published from now on rather than backfilling the older archive.
- Bodies that come through truncated are skipped with a warning instead of
  being saved as stubs.

One file per post, named after the same slug used in `lib/medium-posts.json`.
Safe to delete and regenerate for anything still inside the feed window.
