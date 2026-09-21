import { html } from '../lib/html.js';
import { repoPath, safeUrl } from '../lib/utils.js';

// One line in the project index. "Live" is derived from liveUrl: add a live
// link to a project and its status flips from grey to green automatically.
export const ProjectRow = (p, admin) => {
  const repo = safeUrl(p.repoUrl);
  const live = safeUrl(p.liveUrl);
  return html`
    <li class="row ${live ? 'is-live' : ''}">
      <div class="row-status">
        <span class="status ${live ? 'status-live' : 'status-idle'}">${live ? 'Live' : 'Not deployed yet'}</span>
      </div>
      <div class="row-main">
        <h3>${p.title}</h3>
        ${p.description ? html`<p class="row-desc">${p.description}</p>` : ''}
        <p class="row-meta">
          <code>${repoPath(p)}</code>
          ${p.category ? html`<span>${p.category}</span>` : ''}
          ${p.tech.map((t) => html`<span class="tag">${t}</span>`)}
        </p>
      </div>
      <div class="row-actions">
        ${repo ? html`<a class="btn btn-ghost btn-sm" href="${repo}" target="_blank" rel="noopener noreferrer">View code</a>` : ''}
        ${live
          ? html`<a class="btn btn-primary btn-sm" href="${live}" target="_blank" rel="noopener noreferrer">Live demo</a>`
          : html`<span class="btn btn-sm btn-off" aria-disabled="true">No live demo</span>`}
        ${admin ? html`
          <span class="row-admin">
            <button type="button" class="link-btn" data-action="project:edit" data-id="${p.id}">Edit</button>
            <button type="button" class="link-btn link-danger" data-action="project:delete" data-id="${p.id}">Delete</button>
          </span>` : ''}
      </div>
    </li>`;
};
