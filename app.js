const GITHUB_USERNAME = "bobdude247";
const EXCLUDED_REPOS = new Set(["portfolio-explorer"]);

const statusEl = document.getElementById("status");
const projectsGridEl = document.getElementById("projectsGrid");
const searchInputEl = document.getElementById("searchInput");
const cardTemplate = document.getElementById("projectCardTemplate");

let allProjects = [];

async function fetchAllRepos(username) {
  const perPage = 100;
  let page = 1;
  let repos = [];

  while (true) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`
    );

    if (!response.ok) {
      throw new Error(`GitHub API request failed (${response.status}).`);
    }

    const chunk = await response.json();
    repos = repos.concat(chunk);

    if (chunk.length < perPage) {
      break;
    }
    page += 1;
  }

  return repos;
}

function normalizeDescription(text) {
  return text?.trim() || "No description provided.";
}

function getPagesUrl(repo) {
  if (repo.homepage && /^https?:\/\//i.test(repo.homepage)) {
    return repo.homepage;
  }

  if (!repo.has_pages) {
    return null;
  }

  return `https://${repo.owner.login}.github.io/${repo.name}/`;
}

function toProject(repo) {
  return {
    id: repo.id,
    name: repo.name,
    description: normalizeDescription(repo.description),
    repoUrl: repo.html_url,
    appUrl: getPagesUrl(repo),
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    updatedAt: repo.updated_at,
  };
}

function isExcludedRepo(repoName) {
  return EXCLUDED_REPOS.has(String(repoName).toLowerCase());
}

function renderProjects(projects) {
  projectsGridEl.innerHTML = "";

  if (projects.length === 0) {
    statusEl.textContent = "No hosted project pages matched your search.";
    return;
  }

  statusEl.textContent = `${projects.length} hosted project page${projects.length === 1 ? "" : "s"} found.`;

  const fragment = document.createDocumentFragment();

  for (const project of projects) {
    const card = cardTemplate.content.cloneNode(true);
    const titleEl = card.querySelector(".project-title");
    const descriptionEl = card.querySelector(".project-description");
    const visitLinkEl = card.querySelector(".visit-link");
    const repoLinkEl = card.querySelector(".repo-link");

    titleEl.textContent = project.name;
    descriptionEl.textContent = project.description;

    visitLinkEl.href = project.appUrl;
    visitLinkEl.setAttribute("aria-label", `Open hosted app for ${project.name}`);

    repoLinkEl.href = project.repoUrl;
    repoLinkEl.setAttribute("aria-label", `Open repository for ${project.name}`);

    fragment.appendChild(card);
  }

  projectsGridEl.appendChild(fragment);
}

function filterProjects(query) {
  const value = query.trim().toLowerCase();
  if (!value) {
    return allProjects;
  }

  return allProjects.filter((project) => {
    return (
      project.name.toLowerCase().includes(value) ||
      project.description.toLowerCase().includes(value) ||
      project.topics.some((topic) => topic.toLowerCase().includes(value))
    );
  });
}

async function init() {
  try {
    statusEl.textContent = "Loading projects from GitHub...";

    const repos = await fetchAllRepos(GITHUB_USERNAME);

    allProjects = repos
      .filter((repo) => !isExcludedRepo(repo.name))
      .map(toProject)
      .filter((project) => Boolean(project.appUrl))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    renderProjects(allProjects);
  } catch (error) {
    statusEl.textContent = `Could not load projects: ${error.message}`;
  }
}

searchInputEl.addEventListener("input", (event) => {
  const filtered = filterProjects(event.target.value);
  renderProjects(filtered);
});

init();
