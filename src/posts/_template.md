---
title: Post Title
date: 2026-08-18
tags: Unity, Devlog
excerpt: One or two sentences shown on the devlog list page and in link previews.
---

Opening paragraph. Inline styles work: **bold**, *italic*, `code`, and
[links](https://example.com). Consecutive lines join into one paragraph;
a blank line starts a new one.

## A Section Heading

Drop media files in public/images/ (or public/clips/) and reference them
from the site root. Anything ending in .mp4 or .webm renders as a muted
looping clip; .gif, .png, .webp, .jpg render as images:

![Short description for accessibility](/clips/example.webm "Optional caption shown under the clip")

![A screenshot](/images/example.png)

### A Smaller Heading

Interactive pieces registered in src/components/interactive.js can be
embedded full-width with:

@interactive dungeon-exploded

Notes on this file: the filename becomes the URL slug (my-post.md →
/devlog/my-post). Files starting with _ (like this template) never
publish. Add `draft: true` to the frontmatter to keep a post out of the
live site while you work on it. Read time is computed from word count;
add a `readTime: 4 min` line to override it. To draft with a live
preview, run `npm run dev` and open /editor.
