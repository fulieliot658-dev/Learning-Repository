import { Layout } from './components/Layout.js';
import { Home } from './pages/Home.js';
import { About } from './pages/About.js';
import { Projects } from './pages/Projects.js';
import { Contact } from './pages/Contact.js';
import { isDirty } from './store.js';

export const ROUTES = { home: Home, about: About, projects: Projects, contact: Contact };

export function App(state) {
  const Page = ROUTES[state.route] || Home;
  return Layout({ ...state, dirty: isDirty(), children: Page(state) });
}
