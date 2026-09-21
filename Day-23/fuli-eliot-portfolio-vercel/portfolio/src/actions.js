// Every clickable thing in the UI has a data-action="name". They all land here.
import { db, getState, setAdmin, setState, notify } from './store.js';
import { openConfirm, openForm } from './components/Modal.js';
import { contactForm, internshipForm, profileForm, projectForm, skillForm } from './forms.js';
import { download } from './lib/utils.js';

const data = () => getState().data;
const categories = () => [...new Set(data().projects.map((p) => p.category).filter(Boolean))];
const skillGroups = () => [...new Set(['Front-end', 'Back-end and databases', 'Tools', ...data().skills.map((s) => s.group)])];
const byId = (list, id) => list.find((x) => x.id === id);
const stamp = () => new Date().toISOString().slice(0, 10);

export const actions = {
  skip: () => document.getElementById('main')?.focus(),
  'nav:toggle': () => setState({ menuOpen: !getState().menuOpen }),

  'filter:status': ({ value }) => setState({ status: value }),
  'filter:clear': () => setState({ query: '', category: 'All', status: 'all' }),

  'project:add': () => openForm({ ...projectForm(null, categories()), onSubmit: db.addProject }),
  'project:edit': ({ id }) => {
    const p = byId(data().projects, id);
    if (p) openForm({ ...projectForm(p, categories()), onSubmit: (v) => db.updateProject(id, v) });
  },
  'project:delete': ({ id }) => {
    const p = byId(data().projects, id);
    if (p) openConfirm({
      title: `Delete ${p.title}?`,
      message: 'This removes the project from your portfolio. Your GitHub repository and Vercel deployment are not touched.',
      onConfirm: () => db.deleteProject(id),
    });
  },

  'profile:edit': () => openForm({ ...profileForm(data().profile), onSubmit: db.saveProfile }),
  'internship:edit': () => openForm({ ...internshipForm(data().internship), onSubmit: db.saveInternship }),
  'contact:edit': () => openForm({ ...contactForm(data().contact), onSubmit: db.saveContact }),

  'skill:add': () => openForm({ ...skillForm(null, skillGroups()), onSubmit: db.addSkill }),
  'skill:edit': ({ id }) => {
    const s = byId(data().skills, id);
    if (s) openForm({ ...skillForm(s, skillGroups()), onSubmit: (v) => db.updateSkill(id, v) });
  },
  'skill:delete': ({ id }) => {
    const s = byId(data().skills, id);
    if (s) openConfirm({ title: `Delete ${s.name}?`, message: 'This removes the skill from your About page.', onConfirm: () => db.deleteSkill(id) });
  },

  'admin:publish': () => {
    download('seed.js', db.exportSeed(), 'text/javascript');
    notify('seed.js downloaded. Replace src/data/seed.js in your repository and push to publish.');
  },
  'admin:backup': () => {
    download(`portfolio-backup-${stamp()}.json`, db.backupJson(), 'application/json');
    notify('Backup downloaded');
  },
  'admin:reset': () => openConfirm({
    title: 'Reset to the published version?',
    message: 'Everything you changed in this browser and have not published will be lost. Download a backup first if you want to keep it.',
    confirmLabel: 'Reset',
    onConfirm: db.reset,
  }),
  'admin:exit': () => { setAdmin(false); notify('Manage mode is off'); },
};
