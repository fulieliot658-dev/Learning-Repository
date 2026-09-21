import { App, ROUTES } from './App.js';
import { actions } from './actions.js';
import { mountModal } from './components/Modal.js';
import { mount } from './lib/html.js';
import { db, getState, notify, setAdmin, setState, subscribe } from './store.js';

const root = document.getElementById('root');
mountModal(document.getElementById('modal'));

const TITLES = { about: 'About', projects: 'Projects', contact: 'Contact' };

// Re-render the whole tree on every state change (like React, minus the diffing),
// keeping scroll position and the focused text field.
function render() {
  const s = getState();
  const active = document.activeElement;
  const keep = active && root.contains(active) && active.id
    ? { id: active.id, start: active.selectionStart, end: active.selectionEnd }
    : null;
  const y = window.scrollY;

  mount(root, App(s));

  window.scrollTo(0, y);
  if (keep) {
    const el = document.getElementById(keep.id);
    if (el) {
      el.focus({ preventScroll: true });
      try { if (keep.start != null) el.setSelectionRange(keep.start, keep.end); } catch { /* not a text field */ }
    }
  }
  const { name, headline } = s.data.profile;
  document.title = TITLES[s.route] ? `${TITLES[s.route]} | ${name}` : `${name} | ${headline}`;
}

function syncRoute() {
  let route = location.hash.replace(/^#\/?/, '').split('?')[0] || 'home';
  if (route === 'admin') {          // private entry point: yoursite.com/#/admin
    setAdmin(true);
    notify('Manage mode is on. Your edits are saved in this browser.');
    location.replace('#/projects');
    return;
  }
  if (!(route in ROUTES)) route = 'home';
  setState({ route, menuOpen: false });
  window.scrollTo(0, 0);
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  const run = el && actions[el.dataset.action];
  if (!run) return;
  e.preventDefault();
  run(el.dataset, el);
});

// Inputs bound with data-model="key" write straight into the store.
document.addEventListener('input', (e) => {
  const key = e.target.dataset?.model;
  if (key) setState({ [key]: e.target.value });
});

document.addEventListener('change', async (e) => {
  if (e.target.id !== 'restore-file' || !e.target.files?.[0]) return;
  try { db.importJson(await e.target.files[0].text()); }
  catch (err) { notify(err.message || 'Could not read that file.', 'error'); }
});

// Contact form: opens the visitor's email app with the message filled in.
document.addEventListener('submit', (e) => {
  const form = e.target.closest?.('[data-form="message"]');
  if (!form) return;
  e.preventDefault();
  if (!form.reportValidity()) return;
  const f = new FormData(form);
  const name = String(f.get('name')).trim();
  const reply = String(f.get('reply')).trim();
  const body = `${String(f.get('body')).trim()}\n\n${name}${reply ? ` (${reply})` : ''}`;
  location.href = `mailto:${getState().data.contact.email}?subject=${encodeURIComponent(`Message from ${name}`)}&body=${encodeURIComponent(body)}`;
});

subscribe(render);
window.addEventListener('hashchange', syncRoute);
syncRoute();
