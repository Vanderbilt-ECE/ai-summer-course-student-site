const navTree = document.getElementById("nav-tree");
const content = document.getElementById("content");

const mdCard = async (title, path) => {
  if (!path) return "";
  const res = await fetch(path);
  if (!res.ok) return "";
  const text = await res.text();
  return `<div class="card"><h2>${title}</h2>${marked.parse(text)}</div>`;
};

async function renderTopic(topic) {
  content.innerHTML = `<h1>${topic.title}</h1>`;

  if (topic.hasSlides) {
    const slidesPath = `slides/${topic.slug}/index.html`;
    content.innerHTML += `<div class="btn-row">
      <a class="btn" target="_blank" href="${slidesPath}">Open Slides ↗</a>
    </div>
    <iframe src="${slidesPath}" style="width:100%;aspect-ratio:16/9;border:1px solid var(--border);border-radius:8px"></iframe>`;
  }
}

async function renderResources(day) {
  content.innerHTML = await mdCard("Resources", `content/${day.slug}/resources.md`);
}

async function renderWorksheet(day, worksheet) {
  content.innerHTML = await mdCard(worksheet.title, `content/${day.slug}/worksheets/${worksheet.slug}.md`);
}

function buildNav(groups) {
  navTree.innerHTML = groups
    .map(
      (group) => `
    <div class="day-block">
      <div class="day-title">${group.label}</div>
      <ul class="topic-list">
        <li data-hash="#/${group.slug}/resources">Resources</li>
        ${group.topics.map((t) => `<li data-hash="#/${group.slug}/${t.slug}">${t.title}</li>`).join("")}
      </ul>
    </div>`
    )
    .join("");

  navTree.querySelectorAll("[data-hash]").forEach((el) => {
    el.addEventListener("click", () => {
      location.hash = el.dataset.hash;
    });
  });
}

function route(groups) {
  const [_, daySlug, topicSlug, worksheetSlug] = location.hash.split("/");
  document
    .querySelectorAll(".topic-list li")
    .forEach((li) => li.classList.toggle("active", li.dataset.hash === location.hash));

  const day = groups.find((g) => g.slug === daySlug);
  if (!day) return;

  if (topicSlug === "resources") return renderResources(day);

  if (topicSlug === "worksheets") {
    const worksheet = (day.worksheets || []).find((w) => w.slug === worksheetSlug);
    if (worksheet) return renderWorksheet(day, worksheet);
    return;
  }

  const topic = day.topics.find((t) => t.slug === topicSlug);
  if (topic) return renderTopic(topic);
}

fetch("manifest.json")
  .then((r) => r.json())
  .then((manifest) => {
    buildNav(manifest);
    route(manifest);
    window.addEventListener("hashchange", () => route(manifest));
  });
