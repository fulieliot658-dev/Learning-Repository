# Frontpage

A customizable content aggregator that pulls RSS and Atom feeds into one well-designed reading dashboard.

**Live URL:** _[paste your deployed URL here]_

---

## Overview

Frontpage is a reading dashboard for people who follow 20+ blogs and can't keep up. It has three ways in — a chronological feed, a ranked digest, and a discovery surface — and it's built keyboard-first so triaging 50 items takes under a minute.

The build in this repo is the **frontend-only path** described in `spec/technical-requirements.md`: a single self-contained page with no framework, no build step and no runtime dependencies. Reading state lives in `sessionStorage` for guests and `localStorage` once you create an account, which mirrors the persistence rule in the spec ("guest data is session-scoped").

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | None — vanilla JS, ~1,400 lines |
| Database | `localStorage` (account) / `sessionStorage` (guest) |
| Authentication | Client-side account shim (see Known Limitations) |
| Hosting | Static HTML — any host |
| Styling | Hand-written CSS using `starter/tokens.css` verbatim |
| Icons | Hand-drawn SVG sprite in the Lucide style (1.75px stroke) |

---

## Design Decisions

### Content Discovery & Onboarding

**The problem I was solving:** A new user has an empty dashboard and probably doesn't have feed URLs to hand. Worse, the two users arriving are opposites — one has a 90-feed OPML export from Inoreader, the other has never heard of RSS.

**My approach:** One "Discover" surface with four entry points, ordered by how much the user already knows:

1. **Starter packs** — five curated bundles ("Frontend essentials", "Design & research", "Infrastructure & shipping", "Keeping up with AI", "The daily briefing"). One click adds 2–5 feeds. This is the fastest path from zero to a useful dashboard.
2. **The catalogue** — all 19 feeds grouped by category, each with a follow toggle, description and format. For people who want to pick individually.
3. **Add by URL** — for people who already know what they want. Validates the URL shape before it does anything else and gives a specific error ("That doesn't look like a web address") rather than a generic failure.
4. **OPML import** — with a preview step before anything is committed.

**Why I chose this approach:** Ordering by user knowledge means nobody has to scroll past a surface that isn't for them. Packs are first because the cold-start user is the one most likely to bounce.

The empty state points at Discover rather than apologising. Every empty screen in the app names the action that fills it.

**What I'd do differently:** Add topic search over feed titles and descriptions. With 19 feeds a catalogue is scannable; at 200 it isn't.

### Digest / Summary View

**The problem I was solving:** Somebody who checks in once a day doesn't want a reverse-chronological wall. They want to know what they missed, in the order it matters.

**My approach:** A visit-based digest with a deterministic three-tier structure:

- **Lead story** — one item, presented at a size the rest of the app never uses, with an explicit line saying *why* it was picked.
- **One from each of your other sources** — capped at six, deduplicated by feed, so a prolific blog can't take the whole digest.
- **Everything else** — collapsed into a title-only list with a "mark everything else read" button.

The ranking function is four rules and is visible in the code:

```
score = 100 − (age in hours × 0.8)
      + 18 if the feed provides full content
      −  8 if the source is paywalled
      − 14 if the source is high-volume (Hacker News, Sidebar)
```

Above it there's a stat bar: new since last visit, total unread, minutes to read the picks, categories covered.

**Why I chose this approach:** The digest has to be visibly different from the feed or it's just a second feed. Three things make it different: the one-per-source rule, the "minutes to read" honesty, and the explicit "picked because…" line. Opaque ranking makes people distrust a digest; a rule you can read in one sentence doesn't.

It's visit-based rather than daily because a daily digest is wrong for anyone whose schedule isn't daily. When there's nothing new it degrades gracefully to "best of what's still unread" rather than showing an empty page, and when you're fully caught up it says so and stops.

**What I'd do differently:** The down-ranking of high-volume sources is hard-coded. It should be learned from the user's own read rate per feed — a source you never open should sink on its own.

### Layout Customization

**The problem I was solving:** Dense-list readers and magazine readers want genuinely different products.

**My approach:** Three layouts, one global toggle in the toolbar:

| Layout | Shows | For |
|--------|-------|-----|
| **Compact** | Title, source, time on one line | Triage — ~30 items per screen |
| **Comfortable** (default) | Title, source, time, two-line excerpt, category, read time | Browsing |
| **Magazine** | Card grid with a generated gradient, three-line excerpt | Grazing |

**Why I chose this approach:** Three is the number where each option has an obvious job. I dropped split-pane because the reader view already does that job better on a laptop, and a fourth option would have made the toggle need a label.

The preference is global rather than per-category — a per-category setting sounds flexible but means the same feed looks different depending on how you arrived at it, which breaks the scanning rhythm the whole design is built around. It persists per device, which is the right granularity for something that's really a screen-size preference.

Magazine collapses to a single column below 60rem; compact keeps its density because dense lists are *better* on a phone, not worse.

**What I'd do differently:** Remember a different layout for mobile and desktop on the same account.

### Other Design Choices

**Feed items have exactly three pieces of metadata** — source, relative time, category — against the anti-pattern list in `guidance/patterns.md`. Read time only appears when the feed actually carries full content, which makes it information rather than decoration.

**Read state is a shape change, not just an opacity change.** Unread is a filled dot and medium-weight title; read is a hollow ring and regular weight. Two channels, so it survives colour blindness and low contrast.

**Unread counts cap at 99+.** Anxiety-inducing counts are called out as a dark pattern in the guidance, and I agree with it.

**The guest prompt appears once**, as a strip above the feed, and says what signing up does rather than blocking anything.

**Errors are specific.** The failing feed says "504 Gateway Timeout — the feed server didn't respond within 10s. Retrying in 32 min." Retry shows exponential backoff rather than hammering.

**The stale feed is not an error.** A List Apart publishes rarely; it gets a clock icon and the copy says the feed is reachable, the source is just quiet.

---

## Development Journey

### Initial Approach vs. Final

Started with the feed view because it's where 90% of the time goes, and let the sidebar and digest follow from what the feed needed. The digest was originally a filter on the main feed; it became a separate view once it was clear the lead-story treatment couldn't coexist with a uniform list.

### Decisions Reconsidered

- **Per-category layouts** — built, then removed. Inconsistency cost more than flexibility gained.
- **Four layouts** — split-pane was cut because the reader overlay covers the same need.
- **Digest as a mode** — became a view. A mode would have meant two meanings for the same toolbar.

### What Surprised Me

How much of the design work is copywriting. The digest's "picked because it's the newest full-length piece from a source you read most" does more for trust than any amount of visual polish on the card.

### Session Breakdown

| Session | Focus | What I Accomplished |
|---------|-------|-------------------|
| 1 | Foundation | Tokens, shell, sidebar, feed list, read/unread |
| 2 | Design challenges | Digest ranking, three layouts, Discover |
| 3 | Depth | Reader view, OPML, keyboard system, command palette, accessibility pass |

---

## Differentiators

### Accessibility-First Reading

**Why I chose this:** The product is for people who read for hours. Reading comfort controls aren't a compliance checkbox here, they're a feature of the core loop.

**How it enhances the product:** Reading settings control text size, line length (32–58rem), contrast, animation and letter spacing, and they apply live. The reader view uses Georgia at 1.72 line-height because the brand kit asks for warmth in long-form.

**Implementation highlights:**

- Skip link; `<nav>` / `<main>` landmarks; heading hierarchy with no skipped levels
- Every status uses icon + colour + text, never colour alone
- `aria-live` announcements for cursor movement, read/unread changes, refresh completion and search result counts
- Focus trapped in the reader and every dialog, restored on close
- `:focus-visible` throughout, so mouse users never see a ring
- High-contrast mode that raises secondary text and borders past AA
- Respects `prefers-reduced-motion`, plus an explicit off switch for people whose OS setting doesn't reflect what they want
- 44px touch targets on mobile; `env(safe-area-inset-*)` handled

### Keyboard Navigation

`j`/`k` move, `o` opens, `s` saves, `m` toggles read, `v` opens the original, `r` refreshes, `/` searches, `?` shows the reference, `g h`/`g d`/`g s`/`g f` jump, `⌘K` opens a command palette over every category, feed, layout and action. The cursor scrolls into view and announces itself. Shortcuts are suppressed inside inputs and inside dialogs.

---

## Self-Assessment

| Category | Rating | Notes |
|----------|--------|-------|
| Works for real users | /5 | Runs end-to-end; feed fetching is stubbed (see limitations) |
| Feed parsing robustness | /5 | OPML parsing is real; RSS/Atom parsing needs the server component |
| Design-it-yourself features | /5 | Digest ranking and the three-layout system are the strongest parts |
| Design quality | /5 | Brand kit applied without deviation |
| Responsive design | /5 | Sidebar → overlay, bottom tab bar, safe-area insets |
| Performance | /5 | One file, no dependencies, no layout shift |
| Accessibility | /5 | Chosen differentiator |
| Edge case handling | /5 | Empty, error, stale, paywalled, no-results, fully-caught-up |
| Code quality | /5 | Clean separation, but `render()` redraws more than it needs to |
| Landing page | /5 | Hero shows the product rather than describing it |
| Guest experience | /5 | Full dashboard on first click |

### Lighthouse Scores

| Category | Score |
|----------|-------|
| Performance | |
| Accessibility | |
| Best Practices | |
| SEO | |

### Strengths

The digest. It's the feature most likely to be shallow in other submissions, and the ranking rules plus the "picked because" line make it feel like a product decision rather than a filter.

### Areas for Improvement

`render()` rebuilds the whole list on every state change. Fine at 44 items, wrong at 4,000 — it needs targeted DOM updates or virtualization before the item list grows.

---

## Known Limitations

- **Feed content is representative demo data.** RSS can't be fetched from a browser because of CORS, and this build has no server component. The parsing logic, error states and feed metadata all reflect the real feeds in `data/sample-feeds.json`, but the articles are stand-ins. Adding a server route and swapping the `ITEMS` constant for its response is the remaining work.
- **Auth is a client-side shim.** Creating an account switches persistence from session to local storage. There's no password, no reset flow and no cross-device sync.
- **OPML export can't trigger a download** in a sandboxed page, so it opens a copyable panel instead.
- **Category CRUD isn't implemented** — the five categories come from the sample data structure.
- **No virtualization** on long lists.

---

## Project Structure

```
frontpage/
├── index.html            # Markup, SVG icon sprite, landing page
├── favicon.svg
├── css/
│   ├── tokens.css        # Design tokens (light + dark + high contrast)
│   ├── app.css           # Application styles
│   ├── starter-tokens.css  # Unmodified starter/tokens.css, for reference
│   └── tailwind.css      # Unmodified starter/tailwind.css, unused
├── js/
│   ├── data.js           # Feeds, categories, items, starter packs
│   └── app.js            # State, rendering, reader, dialogs, keyboard
├── data/
│   ├── sample-feeds.json
│   └── sample-feeds.opml
└── README.md
```

`js/app.js` is organised in the order it runs: state and persistence, selectors,
sidebar, item markup, views (feed / digest / discover), the reader overlay,
actions, dialogs, the command palette, navigation, the keyboard handler,
delegated click handling, and entry.

---

## Running Locally

There is no build step and no dependencies. Serve the folder over HTTP:

```bash
cd frontpage
npx serve .
# or: python3 -m http.server 8000
```

Opening `index.html` directly from the filesystem works too.

---

## Acknowledgments

Built as a [Frontend Mentor Product Challenge](https://www.frontendmentor.io).
