# AI Summer Course — Student Site

Static site (no build step) for students: slide decks + a resources page per topic.
Organized by **topic, not day** — since material sometimes carries over from one day
to the next, a day-based label would go stale.

No schedule is published here (that's teacher-site only).

## How it's structured

- `content/topic-slug/resources.md` — one hand-written page per topic: a short
  description + notebook links (e.g. Colab links). Seeded with a template on first
  sync, then never overwritten — edit it freely.
- `slides/topic-slug/` — static Slidev builds (`slidev build`).
- `manifest.json` — generated flat list of topics the site reads to build navigation.
- `index.html` / `app.js` / `style.css` — the whole site. Vanilla JS, `marked.js` from
  a CDN for markdown rendering.

## Updating content

Whenever a Slidev deck changes, or a new topic folder is added under `Day N/`, re-run:

```
node scripts/sync.mjs
```

This rebuilds every Slidev deck and regenerates `manifest.json`, and seeds a
`resources.md` for any new topic (existing ones are left untouched). Use
`--skip-slides` to skip the slide rebuild:

```
node scripts/sync.mjs --skip-slides
```

Then fill in `content/<topic>/resources.md` with a description and notebook links,
commit, and push — GitHub Actions redeploys automatically.

## First-time setup

```
gh repo create Vanderbilt-ECE/ai-summer-course-student-site --public --source=. --push
```

Then in the repo settings on GitHub: **Settings → Pages → Source → GitHub Actions**.
