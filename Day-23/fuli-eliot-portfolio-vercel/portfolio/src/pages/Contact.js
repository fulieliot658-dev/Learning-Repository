import { html } from '../lib/html.js';
import { safeUrl } from '../lib/utils.js';

const link = (href, text) => html`<a href="${href}" ${href.startsWith('http') ? html`target="_blank" rel="noopener noreferrer"` : ''}>${text}</a>`;
const shown = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

export const Contact = ({ data, admin }) => {
  const { contact: c, internship } = data;
  const github = safeUrl(c.github);
  const linkedin = safeUrl(c.linkedin);
  const rows = [
    ['Address', c.address && html`<span class="pre">${c.address}</span>`],
    ['Email', c.email && link(`mailto:${c.email}`, c.email)],
    ['Phone', c.phone && link(`tel:${c.phone.replace(/[^\d+]/g, '')}`, c.phone)],
    ['GitHub', github && link(github, shown(github))],
    ['LinkedIn', linkedin && link(linkedin, shown(linkedin))],
  ].filter(([, value]) => value || admin);

  return html`
    <section class="wrap page-head">
      <div>
        <h1>Contact</h1>
        <p class="page-intro">Currently ${internship.role.toLowerCase()} at ${internship.organization}. Reach me using any of the details below.</p>
      </div>
      ${admin ? html`<button type="button" class="btn btn-sm btn-ghost" data-action="contact:edit">Edit contact details</button>` : ''}
    </section>

    <section class="wrap contact">
      <dl class="facts-list">
        ${rows.map(([label, value]) => html`<div><dt>${label}</dt><dd>${value || html`<span class="muted">Not added yet</span>`}</dd></div>`)}
      </dl>

      ${c.email ? html`
        <form class="message" data-form="message" novalidate>
          <h2>Send a message</h2>
          <div class="field"><label for="m-name">Your name</label><input id="m-name" name="name" required autocomplete="name"></div>
          <div class="field"><label for="m-reply">Your email (optional)</label><input id="m-reply" name="reply" type="email" autocomplete="email"></div>
          <div class="field"><label for="m-body">Message</label><textarea id="m-body" name="body" rows="5" required></textarea></div>
          <p class="help">This opens your email app with the message ready to send.</p>
          <button type="submit" class="btn btn-primary">Write email</button>
        </form>` : admin ? html`<p class="note">Add an email address to show a message form here.</p>` : ''}
    </section>`;
};
