// Published data. This is what every visitor sees.
// Edit it in the browser (open /#/admin), then use "Download seed.js" and
// replace this file to publish your changes for everyone.
const REPO = 'https://github.com/fulieliot658-dev/Learning-Repository';
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const project = (path, title, category, extra = {}) => ({
  id: slug(path || title),
  title,
  category,
  description: '',
  repoUrl: path ? `${REPO}/${extra.blob ? 'blob' : 'tree'}/main/${path}` : '',
  liveUrl: '',
  tech: [],
  ...extra.fields,
});

const day = (path) => project(path, path.replace(/^Day[-_]/, 'Day '), 'Learning project');

export const seed = {
  revision: 1,
  profile: {
    name: 'Fuli Eliot Nchongtakang',
    headline: 'Front-end and back-end developer',
    tagline: 'Building my skills, one project at a time.',
    bio: 'I am an aspiring software developer focused on practical web development, responsive design and continuous learning. I work across the front end and the back end, from HTML, CSS, SCSS and React to MySQL and PostgreSQL, and I use Git and GitHub to snapshot and Vercel for hosting everything I build.',
    institution: 'Heritage Higher Institute of Peace and Development Studies (HEHIPEDS)',
    location: 'Yaoundé, Cameroon',
  },
  internship: {
    organization: 'Tech Innovation Center Cameroon',
    role: 'Intern',
    start: '2026-07-15',
    end: '2026-09-21',
    summary: 'Hands-on experience with Enterprise Design Thinking, dialogue, responsive design and interactive design.',
  },
  skills: [
    ['HTML', 'Front-end'], ['CSS', 'Front-end'], ['Sassy CSS (SCSS)', 'Front-end'], ['JavaScript', 'Front-end'], ['React', 'Front-end'],
    ['MySQL', 'Back-end and databases'], ['PostgreSQL', 'Back-end and databases'],
    ['Git', 'Tools'], ['GitHub', 'Tools'],
  ].map(([name, group]) => ({ id: slug(name), name, group })),
  contact: {
    email: '',
    phone: '',
    address: 'HEHIPEDS, Yaoundé, Cameroon',
    github: 'https://github.com/fulieliot658-dev',
    linkedin: '',
  },
  projects: [
    ...['Day-1', 'Day-2', 'Day-3', 'Day-4', 'Day-5', 'Day-6', 'Day_7'].map(day),
    project('Day_9/tic-website', 'TIC Website', 'Web development', {
      fields: { liveUrl: 'https://tic-website-steel.vercel.app/', tech: ['HTML', 'CSS', 'JavaScript'] },
    }),
    ...['Day_10', 'Day_11', 'Day_12', 'Day-13', 'Day-14', 'Day-15', 'Day-16', 'Day_17', 'Day_18', 'Day-19', 'Day-20', 'Day-21', 'Day-22'].map(day),
    project('my-first-app', 'My First App', 'React and Vite', {
      fields: { liveUrl: 'https://my-first-app-wheat-one.vercel.app/', tech: ['React', 'Vite'] },
    }),
    project('my-sass-project', 'My Sass Project', 'Sass and front-end', { fields: { tech: ['SCSS'] } }),
    project('CSS1.html', 'CSS Practice', 'HTML and CSS', { blob: true, fields: { tech: ['HTML', 'CSS'] } }),
    project('', 'Canvas Project', 'Web project', {
      fields: { id: 'canvas-project', liveUrl: 'https://my-canvas-rosy.vercel.app/' },
    }),
  ],
};
