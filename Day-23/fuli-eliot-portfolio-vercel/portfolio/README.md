# Fuli Eliot Nchongtakang: Portfolio

Vanilla JavaScript (ES modules), structured like a React app (components, pages,
a store, actions) but with no framework and **no build step**.

## Run it

```bash
npx serve .          # or use VS Code "Live Server"
```

Do not double-click `index.html`: browsers block JavaScript modules on `file://`.

## Deploy on Vercel

1. Push this folder to GitHub (for example as `portfolio/` inside `Learning-Repository`).
2. In Vercel, import the repository. If the portfolio is in a subfolder, set **Root Directory** to it.
3. Framework Preset: **Other**. Leave Build Command and Output Directory empty.

## Editing your site (CRUD)

Open `https://your-site.vercel.app/#/admin` to switch on **Manage mode** (a yellow bar appears).

| What | Create | Read | Update | Delete |
|---|---|---|---|---|
| Projects | Add project | Projects page | Edit | Delete |
| Skills | Add skill | About page | Edit | x button |
| Profile, internship, contact | | About and Contact pages | Edit buttons | leave a field empty |

**Deployed status is automatic.** A project shows the grey "Not deployed yet" badge until it has a
live link. Edit the project, paste the Vercel link into "Live link", save, and it turns green
and gets a "Live demo" button.

Projects with neither a GitHub link nor a live link are not accepted.

## Making your edits visible to everyone

This site has no server or database, so edits are saved **in your own browser** (localStorage).
Visitors see the published data in `src/data/seed.js`. To publish:

1. In Manage mode, click **Download seed.js**.
2. Replace `src/data/seed.js` with the downloaded file.
3. Commit and push. Vercel redeploys and every visitor sees your changes.

Use **Back up** / **Restore** to move your edits between browsers, and **Reset** to discard local
changes and go back to the published version.

## Structure

```
index.html
src/
  main.js            entry: router, events, render loop
  App.js             picks the page and wraps it in Layout
  store.js           state + CRUD (db.*) + localStorage
  actions.js         every button's behaviour
  forms.js           fields for the add/edit dialogs
  data/seed.js       published data
  components/        Layout, ProjectRow, Modal
  pages/             Home, About, Projects, Contact
  lib/               html`` template helper, utilities
  styles.css
```
