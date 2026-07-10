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
// notebook links.

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
          `npx slidev build slides.md --base "${BASE}slides/${slug}/" --out "${slidesOut}"`,
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

  groups.push({ slug: daySlug, label: dayTheme(dayName), topics });
}

writeFileSync(
  path.join(OUT_DIR, "config.js"),
  `window.SITE_CONFIG = ${JSON.stringify({ org: ORG, repo: REPO, branch: BRANCH }, null, 2)};\n`
);
writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(groups, null, 2));

const topicCount = groups.reduce((n, g) => n + g.topics.length, 0);
console.log(`\nDone. ${groups.length} day-groups, ${topicCount} topics synced.`);
