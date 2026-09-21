// The app's single source of truth. Works like a tiny Redux/Zustand store:
//   getState() / setState(patch) / subscribe(listener), plus `db` for CRUD.
import { seed } from './data/seed.js';
import { safeUrl, splitTags, uid } from './lib/utils.js';

const DATA_KEY = 'portfolio:data:v1';
const ADMIN_KEY = 'portfolio:admin';

const str = (v, max = 4000) => String(v ?? '').trim().slice(0, max);
const clone = (o) => JSON.parse(JSON.stringify(o));
const pick = (o, keys) => Object.fromEntries(keys.map((k) => [k, str(o?.[k])]));

const PROFILE = ['name', 'headline', 'tagline', 'bio', 'institution', 'location'];
const INTERNSHIP = ['organization', 'role', 'start', 'end', 'summary'];
const CONTACT = ['email', 'phone', 'address', 'github', 'linkedin'];

const cleanContact = (o) => {
  const c = pick(o, CONTACT);
  c.github = safeUrl(c.github);
  c.linkedin = safeUrl(c.linkedin);
  return c;
};

export const cleanProject = (p) => ({
  id: str(p?.id, 80) || uid(),
  title: str(p?.title, 120),
  category: str(p?.category, 60),
  description: str(p?.description, 600),
  repoUrl: safeUrl(p?.repoUrl),
  liveUrl: safeUrl(p?.liveUrl),
  tech: splitTags(p?.tech).map((t) => t.slice(0, 40)).slice(0, 12),
});

const cleanSkill = (s) => ({ id: str(s?.id, 80) || uid(), name: str(s?.name, 60), group: str(s?.group, 60) || 'Other' });

// Turns any object (saved data, imported backup) into a safe, complete data object.
export function normalize(input) {
  const d = input && typeof input === 'object' ? input : {};
  const seen = new Set();
  const unique = (item) => {
    if (seen.has(item.id)) item.id = uid();
    seen.add(item.id);
    return item;
  };
  return {
    revision: Number.isInteger(d.revision) ? d.revision : 0,
    profile: pick(d.profile ?? seed.profile, PROFILE),
    internship: pick(d.internship ?? seed.internship, INTERNSHIP),
    contact: cleanContact(d.contact ?? seed.contact),
    skills: (Array.isArray(d.skills) ? d.skills : seed.skills).map(cleanSkill).filter((s) => s.name).map(unique),
    projects: (Array.isArray(d.projects) ? d.projects : seed.projects)
      .map(cleanProject)
      .filter((p) => p.title && (p.repoUrl || p.liveUrl))
      .map(unique),
  };
}

const published = normalize(seed);
const stripRevision = (d) => JSON.stringify({ ...d, revision: 0 });

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(DATA_KEY) || 'null');
    // A newer published seed always wins over older local edits.
    if (saved && Number.isInteger(saved.revision) && saved.revision >= published.revision) return normalize(saved);
  } catch { /* storage blocked or corrupted: fall back to published data */ }
  return clone(published);
}

const readAdmin = () => {
  try { return localStorage.getItem(ADMIN_KEY) === '1'; } catch { return false; }
};

const state = {
  data: load(),
  route: 'home',
  admin: readAdmin(),
  menuOpen: false,
  query: '',
  category: 'All',
  status: 'all',
  sort: 'live',
  toast: null,
};

const listeners = new Set();
export const getState = () => state;
export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const setState = (patch) => { Object.assign(state, patch); listeners.forEach((fn) => fn(state)); };
export const isDirty = () => stripRevision(state.data) !== stripRevision(published);

let toastTimer;
export function notify(msg, type = 'ok') {
  clearTimeout(toastTimer);
  setState({ toast: { msg, type } });
  toastTimer = setTimeout(() => setState({ toast: null }), 4000);
}

function commit(mutate, message) {
  const next = clone(state.data);
  mutate(next);
  let stored = true;
  try { localStorage.setItem(DATA_KEY, JSON.stringify(next)); } catch { stored = false; }
  setState({ data: next });
  if (!stored) notify('Saved for this visit only. Your browser is blocking storage.', 'warn');
  else if (message) notify(message);
}

export function setAdmin(on) {
  try { localStorage.setItem(ADMIN_KEY, on ? '1' : '0'); } catch { /* ignore */ }
  setState({ admin: on });
}

export const db = {
  addProject: (v) => commit((d) => { d.projects.push(cleanProject({ ...v, id: uid() })); }, 'Project added'),
  updateProject: (id, v) => commit((d) => {
    const i = d.projects.findIndex((p) => p.id === id);
    if (i > -1) d.projects[i] = cleanProject({ ...v, id });
  }, 'Project saved'),
  deleteProject: (id) => commit((d) => { d.projects = d.projects.filter((p) => p.id !== id); }, 'Project deleted'),

  saveProfile: (v) => commit((d) => { d.profile = pick(v, PROFILE); }, 'Profile saved'),
  saveInternship: (v) => commit((d) => { d.internship = pick(v, INTERNSHIP); }, 'Internship saved'),
  saveContact: (v) => commit((d) => { d.contact = cleanContact(v); }, 'Contact details saved'),

  addSkill: (v) => commit((d) => { d.skills.push(cleanSkill({ ...v, id: uid() })); }, 'Skill added'),
  updateSkill: (id, v) => commit((d) => {
    const i = d.skills.findIndex((s) => s.id === id);
    if (i > -1) d.skills[i] = cleanSkill({ ...v, id });
  }, 'Skill saved'),
  deleteSkill: (id) => commit((d) => { d.skills = d.skills.filter((s) => s.id !== id); }, 'Skill deleted'),

  reset() {
    try { localStorage.removeItem(DATA_KEY); } catch { /* ignore */ }
    setState({ data: clone(published) });
    notify('Reset to the published version');
  },

  importJson(text) {
    let parsed;
    try { parsed = JSON.parse(text); } catch { throw new Error('That file is not valid JSON.'); }
    if (!parsed || !Array.isArray(parsed.projects)) throw new Error('That file is not a portfolio backup.');
    const data = normalize(parsed);
    data.revision = Math.max(data.revision, published.revision);
    commit((d) => { Object.assign(d, data); }, 'Backup restored');
  },

  backupJson: () => JSON.stringify(state.data, null, 2),

  // A ready-to-commit replacement for src/data/seed.js.
  exportSeed() {
    const out = { ...clone(state.data), revision: state.data.revision + 1 };
    return `// Published data. Replace src/data/seed.js with this file, then push to GitHub.\nexport const seed = ${JSON.stringify(out, null, 2)};\n`;
  },
};
