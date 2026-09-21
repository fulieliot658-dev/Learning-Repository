// Field definitions for every create/edit dialog.
export const projectForm = (project, categories) => ({
  title: project ? 'Edit project' : 'Add project',
  intro: 'A project needs at least one link. It shows as Live as soon as you add a live link.',
  submitLabel: project ? 'Save project' : 'Add project',
  values: project ? { ...project, tech: project.tech.join(', ') } : {},
  fields: [
    { name: 'title', label: 'Title', required: true, maxLength: 120, placeholder: 'Day 23' },
    { name: 'category', label: 'Category', maxLength: 60, datalist: categories, placeholder: 'Learning project' },
    { name: 'description', label: 'Description', type: 'textarea', rows: 3, maxLength: 600 },
    { name: 'repoUrl', label: 'GitHub link', type: 'url', placeholder: 'https://github.com/…' },
    { name: 'liveUrl', label: 'Live link (Vercel)', type: 'url', placeholder: 'https://your-project.vercel.app', help: 'Leave empty if the project is not deployed yet.' },
    { name: 'tech', label: 'Technologies', placeholder: 'HTML, CSS, JavaScript', help: 'Separate with commas.' },
  ],
  validate: (v) => (!v.repoUrl && !v.liveUrl ? { repoUrl: 'Add a GitHub link or a live link. Projects without links are not listed.' } : {}),
});

export const profileForm = (profile) => ({
  title: 'Edit profile',
  submitLabel: 'Save profile',
  values: profile,
  fields: [
    { name: 'name', label: 'Full name', required: true, maxLength: 80 },
    { name: 'headline', label: 'Role', maxLength: 80, placeholder: 'Front-end and back-end developer' },
    { name: 'tagline', label: 'Tagline', maxLength: 120 },
    { name: 'bio', label: 'About me', type: 'textarea', rows: 6, maxLength: 1200 },
    { name: 'institution', label: 'Institution', maxLength: 120 },
    { name: 'location', label: 'Location', maxLength: 80 },
  ],
});

export const internshipForm = (internship) => ({
  title: 'Edit internship',
  submitLabel: 'Save internship',
  values: internship,
  fields: [
    { name: 'organization', label: 'Organization', required: true, maxLength: 120 },
    { name: 'role', label: 'Role', maxLength: 80 },
    { name: 'start', label: 'Start date', type: 'date', required: true },
    { name: 'end', label: 'End date', type: 'date', required: true },
    { name: 'summary', label: 'What you did', type: 'textarea', rows: 4, maxLength: 600 },
  ],
  validate: (v) => (v.start && v.end && v.end < v.start ? { end: 'The end date must be after the start date.' } : {}),
});

export const contactForm = (contact) => ({
  title: 'Edit contact details',
  intro: 'Only the details you fill in are shown to visitors.',
  submitLabel: 'Save contact details',
  values: contact,
  fields: [
    { name: 'address', label: 'Address', type: 'textarea', rows: 3, maxLength: 300, placeholder: 'HEHIPEDS, Yaoundé, Cameroon' },
    { name: 'email', label: 'Email', type: 'email', maxLength: 120 },
    { name: 'phone', label: 'Phone or WhatsApp', maxLength: 40, placeholder: '+237 …' },
    { name: 'github', label: 'GitHub profile', type: 'url', placeholder: 'https://github.com/…' },
    { name: 'linkedin', label: 'LinkedIn profile', type: 'url', placeholder: 'https://linkedin.com/in/…' },
  ],
});

export const skillForm = (skill, groups) => ({
  title: skill ? 'Edit skill' : 'Add skill',
  submitLabel: skill ? 'Save skill' : 'Add skill',
  values: skill || {},
  fields: [
    { name: 'name', label: 'Name', required: true, maxLength: 60, placeholder: 'TypeScript' },
    { name: 'group', label: 'Group', required: true, maxLength: 60, datalist: groups, placeholder: 'Front-end' },
  ],
});
