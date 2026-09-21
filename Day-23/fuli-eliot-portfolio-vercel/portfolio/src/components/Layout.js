import { html, raw } from '../lib/html.js';
import { acronym, initials } from '../lib/utils.js';

const NAV = [
  ['home', 'Home', '#/'],
  ['about', 'About', '#/about'],
  ['projects', 'Projects', '#/projects'],
  ['contact', 'Contact', '#/contact'],
];

const AdminBar = (dirty) => html`
  <div class="adminbar" role="region" aria-label="Site management">
    <div class="wrap adminbar-in">
      <p class="adminbar-status">
        <strong>Manage mode</strong>
        <span>${dirty ? 'Changes are saved in this browser but not published yet.' : 'Everything here matches the published site.'}</span>
      </p>
      <div class="adminbar-actions">
        <button type="button" class="btn btn-sm btn-dark" data-action="admin:publish">Download seed.js</button>
        <button type="button" class="btn btn-sm btn-light" data-action="admin:backup">Back up</button>
        <label class="btn btn-sm btn-light" for="restore-file">Restore</label>
        <input id="restore-file" type="file" accept="application/json,.json" hidden>
        <button type="button" class="btn btn-sm btn-light" data-action="admin:reset">Reset</button>
        <button type="button" class="btn btn-sm btn-light" data-action="admin:exit">Exit manage mode</button>
      </div>
    </div>
  </div>`;

export const Layout = ({ route, admin, menuOpen, dirty, toast, data, children }) => {
  const { profile } = data;
  const shortName = profile.name.split(/\s+/).slice(0, 2).join(' ');
  return html`
    <a class="skip" href="#main" data-action="skip">Skip to content</a>
    <header class="site-header">
      <div class="wrap header-in">
        <a class="brand" href="#/" aria-label="${profile.name}, home">
          <span class="brand-mark">${initials(profile.name)}</span>
          <span class="brand-name">${shortName}</span>
        </a>
        <button type="button" id="nav-toggle" class="nav-toggle" data-action="nav:toggle" aria-expanded="${String(menuOpen)}" aria-controls="site-nav">Menu</button>
        <nav id="site-nav" class="nav ${menuOpen ? 'is-open' : ''}" aria-label="Main">
          ${NAV.map(([id, label, href]) => html`<a href="${href}" ${route === id ? raw('aria-current="page"') : ''}>${label}</a>`)}
        </nav>
      </div>
    </header>
    ${admin ? AdminBar(dirty) : ''}
    <main id="main" class="main" tabindex="-1">${children}</main>
    <footer class="site-footer">
      <div class="wrap footer-in">
        <p>${profile.name}</p>
        <p>${acronym(profile.institution)}, ${profile.location}</p>
      </div>
    </footer>
    <div class="toast-region" aria-live="polite">
      ${toast ? html`<div class="toast toast-${toast.type}">${toast.msg}</div>` : ''}
    </div>`;
};
