import { html } from '../lib/html.js';
import { acronym, fmtDate, internshipStatus, repoPath } from '../lib/utils.js';

const RepoPanel = (projects) => {
  const liveCount = projects.filter((p) => p.liveUrl).length;
  const listing = [...projects].reverse().sort((a, b) => Boolean(b.liveUrl) - Boolean(a.liveUrl)).slice(0, 9);
  return html`
    <aside class="repo" aria-label="Repository index">
      <div class="repo-bar">
        <span class="repo-title">Learning-Repository</span>
        <a href="#/projects">See all ${projects.length}</a>
      </div>
      <ul class="repo-list">
        ${listing.map((p) => html`
          <li>
            <span class="dot ${p.liveUrl ? 'dot-live' : ''}" aria-hidden="true"></span>
            <span class="repo-name">${repoPath(p)}</span>
            <span class="repo-state">${p.liveUrl ? 'live' : 'code only'}</span>
          </li>`)}
      </ul>
      <p class="repo-foot">${liveCount} of ${projects.length} projects deployed</p>
    </aside>`;
};

export const Home = ({ data }) => {
  const { profile, projects, skills, internship } = data;
  return html`
    <section class="wrap hero">
      <div class="hero-main">
        <h1>${profile.name}</h1>
        <p class="hero-role">${profile.headline}</p>
        <p class="hero-tagline">${profile.tagline}</p>
        <p class="hero-bio">${profile.bio}</p>
        <div class="cta">
          <a class="btn btn-primary" href="#/projects">View projects</a>
          <a class="btn btn-ghost" href="#/contact">Contact me</a>
        </div>
      </div>
      ${RepoPanel(projects)}
    </section>

    <section class="wrap now" aria-label="At a glance">
      <dl class="facts-row">
        <div><dt>Studying at</dt><dd>${acronym(profile.institution)}, ${profile.location}</dd></div>
        <div>
          <dt>Internship</dt>
          <dd>${internship.organization}<span class="sub">${fmtDate(internship.start)} to ${fmtDate(internship.end)}, ${internshipStatus(internship.start, internship.end).toLowerCase()}</span></dd>
        </div>
        <div><dt>Works with</dt><dd>${skills.map((s) => s.name).join(', ')}</dd></div>
      </dl>
    </section>`;
};
