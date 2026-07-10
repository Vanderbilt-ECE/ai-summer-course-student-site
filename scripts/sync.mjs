#!/usr/bin/env node
// Builds student-site/{slides,content} + manifest.json from this repo's
// Slidev projects (Day N / Topic). Flat topic list (no days, no schedule) so
// material can carry over across days without relabeling.
//
// Run: node scripts/sync.mjs [--skip-slides]
//
// ponytail: resources.md is seeded once per topic and never overwritten by
// re-sync, since it holds hand-written descriptions + notebook links.

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..");
const SRC_DIR = path.resolve(OUT_DIR, "..");

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

const days = readdirSync(SRC_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^Day \d+$/.test(d.name))
  .map((d) => ({ name: d.name, num: Number(d.name.replace("Day ", "")) }))
  .sort((a, b) => a.num - b.num);

const topics = [];

for (const { name: dayName } of days) {
  const srcDayDir = path.join(SRC_DIR, dayName);
  const topicDirs = readdirSync(srcDayDir, { withFileTypes: true }).filter(
    (d) => d.isDirectory() && d.name !== "Notebooks" && !d.name.startsWith(".")
  );

  for (const t of topicDirs) {
    const title = t.name;
    const slug = slugify(title);
    const topicSrcDir = path.join(srcDayDir, title);
    const contentDir = path.join(OUT_DIR, "content", slug);
    mkdirSync(contentDir, { recursive: true });

    const resourcesPath = path.join(contentDir, "resources.md");
    if (!existsSync(resourcesPath)) {
      writeFileSync(resourcesPath, `# ${title}\n\n_Add a short description here._\n\n## Notebooks\n\n- [ ] link notebook(s) here\n`);
    }

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
}

writeFileSync(
  path.join(OUT_DIR, "config.js"),
  `window.SITE_CONFIG = ${JSON.stringify({ org: ORG, repo: REPO, branch: BRANCH }, null, 2)};\n`
);
writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(topics, null, 2));

console.log(`\nDone. ${topics.length} topics synced.`);
