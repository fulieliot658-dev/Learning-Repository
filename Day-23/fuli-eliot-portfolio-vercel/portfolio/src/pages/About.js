import { html } from '../lib/html.js';
import { durationLabel, fmtDate, internshipProgress, internshipStatus } from '../lib/utils.js';

const SkillChip = (s, admin) => admin
  ? html`
    <li class="chip chip-admin">
      <span>${s.name}</span>
      <button type="button" data-action="skill:edit" data-id="${s.id}" aria-label="Edit ${s.name}">Edit</button>
      <button type="button" data-action="skill:delete" data-id="${s.id}" aria-label="Delete ${s.name}">&times;</button>
    </li>`
  : html`<li class="chip">${s.name}</li>`;

export const About = ({ data, admin }) => {
  const { profile, internship, skills } = data;
  const groups = [...new Set(skills.map((s) => s.group))].map((g) => [g, skills.filter((s) => s.group === g)]);
  const status = internshipStatus(internship.start, internship.end);
  const progress = Math.round(internshipProgress(internship.start, internship.end) * 100);

  return html`
    <section class="wrap page-head">
      <h1>About me</h1>
      ${admin ? html`<button type="button" class="btn btn-sm btn-ghost" data-action="profile:edit">Edit profile</button>` : ''}
    </section>

    <section class="wrap about">
      <p class="about-bio">${profile.bio}</p>
      <dl class="facts-list">
        <div><dt>Name</dt><dd>${profile.name}</dd></div>
        <div><dt>Role</dt><dd>${profile.headline}</dd></div>
        <div><dt>Studying at</dt><dd>${profile.institution}</dd></div>
        <div><dt>Based in</dt><dd>${profile.location}</dd></div>
      </dl>
    </section>

    <section class="wrap block" aria-labelledby="h-intern">
      <div class="block-head">
        <h2 id="h-intern">Internship</h2>
        ${admin ? html`<button type="button" class="btn btn-sm btn-ghost" data-action="internship:edit">Edit internship</button>` : ''}
      </div>
      <div class="intern">
        <div>
          <h3>${internship.organization}</h3>
          <p class="intern-role">${internship.role}</p>
          <p class="intern-summary">${internship.summary}</p>
        </div>
        <div class="intern-period">
          <p class="intern-dates">${fmtDate(internship.start)} to ${fmtDate(internship.end)}</p>
          <div class="bar" role="img" aria-label="Internship ${progress}% complete"><span style="width:${progress}%"></span></div>
          <p class="intern-meta">${status}, ${durationLabel(internship.start, internship.end)}</p>
        </div>
      </div>
    </section>

    <section class="wrap block" aria-labelledby="h-skills">
      <div class="block-head">
        <h2 id="h-skills">Languages and frameworks</h2>
        ${admin ? html`<button type="button" class="btn btn-sm btn-ghost" data-action="skill:add">Add skill</button>` : ''}
      </div>
      ${groups.length === 0 ? html`<p class="empty-inline">No skills listed yet.</p>` : ''}
      <div class="skill-groups">
        ${groups.map(([group, items]) => html`
          <div class="skill-group">
            <h3>${group}</h3>
            <ul class="chips">${items.map((s) => SkillChip(s, admin))}</ul>
          </div>`)}
      </div>
    </section>`;
};
