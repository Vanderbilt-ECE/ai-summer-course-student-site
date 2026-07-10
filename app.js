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

  content.innerHTML += await mdCard("Resources", `content/${topic.slug}/resources.md`);
}

function buildNav(manifest) {
  navTree.innerHTML = `<ul class="topic-list">
    ${manifest.map((t) => `<li data-hash="#/${t.slug}">${t.title}</li>`).join("")}
  </ul>`;

  navTree.querySelectorAll("[data-hash]").forEach((el) => {
    el.addEventListener("click", () => {
      location.hash = el.dataset.hash;
    });
  });
}

function route(manifest) {
  const [_, slug] = location.hash.split("/");
  document
    .querySelectorAll(".topic-list li")
    .forEach((li) => li.classList.toggle("active", li.dataset.hash === location.hash));

  const topic = manifest.find((t) => t.slug === slug);
  if (topic) return renderTopic(topic);
}

fetch("manifest.json")
  .then((r) => r.json())
  .then((manifest) => {
    buildNav(manifest);
    route(manifest);
    window.addEventListener("hashchange", () => route(manifest));
  });
