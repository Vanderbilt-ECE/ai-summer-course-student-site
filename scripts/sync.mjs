#!/usr/bin/env node
// Builds student-site/{slides,content} + manifest.json from this repo's
// Slidev projects (Day N / Topic). Topics are grouped by day (so nav order
// matches how the course actually runs) but each group is labeled by that
// day's theme, not "Day N" — material sometimes carries over into the next
// day, so a literal day number would go stale. The theme is read from the
// vault's "Day N Schedule.md" heading; the schedule file itself is never
// copied into the student site.
//
// Run: node scripts/sync.mjs [--skip-slides]
//
// ponytail: content/day-N/resources.md is seeded once per day and never
// overwritten by re-sync, since it holds hand-written topic descriptions +
// notebook links. Worksheets are the one exception: a "## Worksheets" link
// is appended (idempotently) whenever a new worksheet file shows up, since
// otherwise a freshly-added worksheet would be silently unreachable.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..");
const SRC_DIR = path.resolve(OUT_DIR, "..");
const VAULT_DIR =
  "/Users/jonathan/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/vault/Summer AI Course";

const ORG = "Vanderbilt-ECE";
const REPO = "ai-summer-course-student-site";
const BRANCH = "main";
const BASE = `/${REPO}/`;

const SKIP_SLIDES = process.argv.includes("--skip-slides");

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Appends a link to a worksheet page under "## Worksheets" in resources.md,
// creating the heading if needed. No-op if the link is already there.
function ensureWorksheetLink(resourcesPath, title, hash) {
  if (!existsSync(resourcesPath)) return;
  const text = readFileSync(resourcesPath, "utf8");
  if (text.includes(hash)) return;
  const link = `- [${title}](${hash})\n`;
  const updated = text.includes("## Worksheets\n")
    ? text.replace("## Worksheets\n", `## Worksheets\n\n${link}`)
    : `${text.trimEnd()}\n\n## Worksheets\n\n${link}`;
  writeFileSync(resourcesPath, updated);
}

// "# Day 2 — Data Exploration & Data Cleaning" -> "Data Exploration & Data Cleaning"
function dayTheme(dayName) {
  const schedulePath = path.join(VAULT_DIR, dayName, `${dayName} Schedule.md`);
  if (existsSync(schedulePath)) {
    const match = readFileSync(schedulePath, "utf8").match(/^#\s*Day\s*\d+\s*[—–-]\s*(.+)$/m);
    if (match) return match[1].trim();
  }
  return dayName; // ponytail: falls back to "Day N" if the vault heading is missing/renamed
}

const days = readdirSync(SRC_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^Day \d+$/.test(d.name))
  .map((d) => ({ name: d.name, num: Number(d.name.replace("Day ", "")) }))
  .sort((a, b) => a.num - b.num);

const groups = [];

for (const { name: dayName, num } of days) {
  const srcDayDir = path.join(SRC_DIR, dayName);
  const topicDirs = readdirSync(srcDayDir, { withFileTypes: true }).filter(
    (d) => d.isDirectory() && d.name !== "Notebooks" && !d.name.startsWith(".")
  );

  const topics = [];
  for (const t of topicDirs) {
    const title = t.name;
    const slug = slugify(title);
    const topicSrcDir = path.join(srcDayDir, title);

    const slidesEntry = path.join(topicSrcDir, "slides.md");
    let hasSlides = existsSync(path.join(OUT_DIR, "slides", slug, "index.html"));
    if (existsSync(slidesEntry) && !SKIP_SLIDES) {
      const slidesOut = path.join(OUT_DIR, "slides", slug);
      console.log(`Building slides: ${dayName} / ${title}`);
      try {
        execSync(
          `PATH=/opt/homebrew/opt/node@20/bin:$PATH node_modules/.bin/slidev build slides.md --base "${BASE}slides/${slug}/" --out "${slidesOut}"`,
          { cwd: topicSrcDir, stdio: "inherit" }
        );
        hasSlides = true;
      } catch (err) {
        console.error(`  ! slidev build failed for ${title}, skipping slides for this topic`);
      }
    }

    topics.push({ slug, title, hasSlides });
  }

  const daySlug = `day-${num}`;
  const dayContentDir = path.join(OUT_DIR, "content", daySlug);
  mkdirSync(dayContentDir, { recursive: true });
  const resourcesPath = path.join(dayContentDir, "resources.md");
  if (!existsSync(resourcesPath)) {
    const body = topics
      .map((t) => `## ${t.title}\n\n_Add a short description here._\n`)
      .join("\n");
    writeFileSync(resourcesPath, `# ${dayTheme(dayName)}\n\n${body}\n## Notebooks\n\n- [ ] link notebook(s) here\n`);
  }

  // Worksheets: any "*Worksheet*.md" file under Day N/Notebooks/ becomes its
  // own standalone page, copied verbatim and linked from resources.md.
  const notebooksDir = path.join(srcDayDir, "Notebooks");
  const worksheets = [];
  if (existsSync(notebooksDir)) {
    const worksheetFiles = readdirSync(notebooksDir).filter((f) => /worksheet.*\.md$/i.test(f));
    if (worksheetFiles.length) {
      const worksheetsOutDir = path.join(dayContentDir, "worksheets");
      mkdirSync(worksheetsOutDir, { recursive: true });
      for (const file of worksheetFiles) {
        const text = readFileSync(path.join(notebooksDir, file), "utf8");
        const title = (text.match(/^#\s+(.+)$/m)?.[1] ?? file.replace(/\.md$/, "")).trim();
        const slug = slugify(title);
        writeFileSync(path.join(worksheetsOutDir, `${slug}.md`), text);
        worksheets.push({ slug, title });
        ensureWorksheetLink(resourcesPath, title, `#/${daySlug}/worksheets/${slug}`);
      }
    }
  }

  groups.push({ slug: daySlug, label: dayTheme(dayName), topics, worksheets });
}

writeFileSync(
  path.join(OUT_DIR, "config.js"),
  `window.SITE_CONFIG = ${JSON.stringify({ org: ORG, repo: REPO, branch: BRANCH }, null, 2)};\n`
);
writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(groups, null, 2));

const topicCount = groups.reduce((n, g) => n + g.topics.length, 0);
console.log(`\nDone. ${groups.length} day-groups, ${topicCount} topics synced.`);
