import { html, raw } from '../lib/html.js';
import { ProjectRow } from '../components/ProjectRow.js';

const STATUS = [['all', 'All'], ['live', 'Live'], ['code', 'Code only']];
const SORTS = [['live', 'Live first'], ['newest', 'Newest first'], ['oldest', 'Oldest first'], ['az', 'A to Z']];

function visibleProjects({ data, query, category, status, sort }) {
  const q = query.trim().toLowerCase();
  const list = data.projects.filter((p) =>
    (category === 'All' || p.category === category) &&
    (status === 'all' || (status === 'live') === Boolean(p.liveUrl)) &&
    (!q || [p.title, p.description, p.category, ...p.tech].join(' ').toLowerCase().includes(q)));
  if (sort === 'az') return list.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
  if (sort === 'oldest') return list;
  const newest = list.reverse();
  return sort === 'live' ? newest.sort((a, b) => Boolean(b.liveUrl) - Boolean(a.liveUrl)) : newest;
}

export const Projects = (state) => {
  const { data, admin, query, category, status, sort } = state;
  const all = data.projects;
  const liveCount = all.filter((p) => p.liveUrl).length;
  const categories = ['All', ...new Set(all.map((p) => p.category).filter(Boolean))];
  const list = visibleProjects(state);
  const filtered = query.trim() || category !== 'All' || status !== 'all';

  return html`
    <section class="wrap page-head">
      <div>
        <h1>Projects</h1>
        <p class="page-intro">${all.length} projects from my learning repository, ${liveCount} deployed so far. A project switches to Live when it has a live link.</p>
      </div>
      ${admin ? html`<button type="button" class="btn btn-primary" data-action="project:add">Add project</button>` : ''}
    </section>

    <section class="wrap" aria-label="Project index">
      <div class="toolbar">
        <div class="field-inline">
          <label for="search">Search</label>
          <input id="search" type="search" data-model="query" value="${query}" placeholder="Title, technology or category" autocomplete="off">
        </div>
        <div class="field-inline">
          <label for="category">Category</label>
          <select id="category" data-model="category">
            ${categories.map((c) => html`<option value="${c}" ${c === category ? raw('selected') : ''}>${c}</option>`)}
          </select>
        </div>
        <div class="field-inline">
          <label for="sort">Sort</label>
          <select id="sort" data-model="sort">
            ${SORTS.map(([v, l]) => html`<option value="${v}" ${v === sort ? raw('selected') : ''}>${l}</option>`)}
          </select>
        </div>
        <div class="segmented" role="group" aria-label="Deployment status">
          ${STATUS.map(([v, l]) => html`<button type="button" id="status-${v}" data-action="filter:status" data-value="${v}" aria-pressed="${String(status === v)}">${l}</button>`)}
        </div>
      </div>

      <p class="count" aria-live="polite">Showing ${list.length} of ${all.length}</p>

      ${list.length
        ? html`<ul class="index">${list.map((p) => ProjectRow(p, admin))}</ul>`
        : html`
          <div class="empty">
            <h2>${filtered ? 'No projects match these filters' : 'No projects yet'}</h2>
            <p>${filtered ? 'Try a different search or clear the filters.' : admin ? 'Add your first project with a GitHub or live link.' : 'Check back soon.'}</p>
            ${filtered
              ? html`<button type="button" class="btn btn-ghost" data-action="filter:clear">Clear filters</button>`
              : admin ? html`<button type="button" class="btn btn-primary" data-action="project:add">Add project</button>` : ''}
          </div>`}
    </section>`;
};
