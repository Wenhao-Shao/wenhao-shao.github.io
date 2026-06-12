# Modular Site Redesign — Design Spec

**Date**: 2026-06-11
**Status**: Draft, pending spec review

## Goals

This redesign addresses six items from `Archive/memo.txt`:

1. **About page**: every person (PI, group members, mascots) gets a clickable photo+name+title card; clicking opens a detailed-bio modal (same modal pattern as "Leave a message").
2. **Hiring tab**: new nav item, placeholder "Open Positions" page for now.
3. **Hide the Fun tab** from navigation (page stays reachable).
4. **Modular, maintainable architecture**: news, about/people, gallery, research, and publications become data-driven (JSON + small render scripts, no build step), so adding content doesn't require touching HTML/CSS/JS.
5. **Featured Publications**: a Science.org-style highlight section (1 main + 4 secondary) above the existing publication list.
6. **Visual identity overhaul** (bundled in from memo item 10): minimalist/editorial style inspired by wave.engr.uga.edu — new typography and color palette, day/night consolidated into CSS-variable theming, new hero slogan, redesigned featured-news section, and redesigned home gallery section.

---

## 1. Architecture & Data Model

The `day-version/`, `night-version/`, and `BODY/` trees are replaced by a single page tree plus shared assets and data:

```
/assets/
  css/style.css          — single stylesheet; :root vars (light) + [data-theme="dark"] overrides
  js/
    theme.js              — sets data-theme on <html>, persists to localStorage, defaults to prefers-color-scheme
    partials.js           — fetches partials/{head,nav,footer}.html into every page, wires up modal(s)
    render-news.js
    render-people.js
    render-publications.js
    render-gallery.js
    render-projects.js
  partials/
    head.html             — shared <head> fragment (was BODY/head-body.html)
    nav.html              — shared nav, driven by data/nav.json
    footer.html           — shared footer + #message-modal markup
/data/
  nav.json
  news.json
  people.json
  publications.json
  gallery.json
  projects.json
/assets/img/
  people/, news/, gallery/, projects/, publications/
/index.html               — home
/about/index.html
/news/index.html
/research/index.html
/research/project.html    — template, reads ?id=<slug>
/publications/index.html
/hiring/index.html         — new, static placeholder
/facility/index.html
/fun/index.html             — unchanged structure, dropped from nav
```

### Theming

One stylesheet using CSS custom properties. A toggle button in the nav flips `document.documentElement.dataset.theme` between `"light"`/`"dark"` and persists the choice to `localStorage` (default: `prefers-color-scheme`). See color tokens in §2.

### Content model

Each list-type content area (news, people, publications, gallery, research projects) is a JSON array in `/data/`. A small `render-*.js` script per content type fetches its JSON file and builds the DOM on the relevant page(s). Adding an item = appending an object to the array.

### Research projects (fully templated)

`/research/project.html?id=<slug>` is a single template. `render-projects.js` finds the matching `projects.json` entry and injects `title`/`image`/`body` (an HTML string containing the project's full write-up — paragraphs, figures, links) into the template. The 4 existing project pages are migrated into `projects.json` entries once, as part of this work; new projects afterward are pure JSON additions.

### Shared partials

`partials/head.html`, `nav.html`, and `footer.html` are fetched into every page via `partials.js` (extends the existing `BODY/head-body.html` fetch pattern). The "Leave a message" modal (`#message-modal`) lives in `footer.html` so it's available site-wide; `partials.js` wires up its open/close handlers after injection.

### Error handling & testing

Render scripts wrap `fetch`/parse in try/catch and fail gracefully — log to console, leave the section empty — rather than breaking the page. No automated test suite (keeps the no-build-step constraint); verification is manual, checking each changed page in both themes and at mobile/tablet/desktop widths.

---

## 2. Visual Identity

### Typography

Single family: **Manrope** (Google Fonts), varying weight for hierarchy — replaces "Montserrat".

| Level | Size | Weight | Line height | Letter spacing | Use |
|-------|------|--------|-------------|-----------------|-----|
| Display | 48px (clamp 32–48) | 800 | 1.1 | -0.02em | Hero brand name |
| H1 | 36px | 800 | 1.15 | -0.02em | Page titles |
| H2 | 24px | 800 | 1.2 | -0.01em | Section headings ("Group Members", "Latest News") |
| H3 | 18px | 700 | 1.3 | normal | Card titles, names |
| Lead | 20px | 500 | 1.4 | normal | Hero slogan, intros |
| Body | 16px | 400 | 1.6 | normal | Paragraphs, bios |
| Nav/label | 13px | 600 | 1.4 | 0.08–0.12em (uppercase) | Nav links, tags, captions |

### Color tokens (Navy & White)

```css
:root {
  --color-bg: #ffffff;
  --color-surface: #f7f8fa;
  --color-text: #1a1f2b;
  --color-text-muted: #6a7078;
  --color-accent: #1f3a5f;
  --color-border: #e3e6ea;
}
[data-theme="dark"] {
  --color-bg: #14181f;
  --color-surface: #1c222c;
  --color-text: #e8eaed;
  --color-text-muted: #9aa0a6;
  --color-accent: #5b8def;
  --color-border: #2a3038;
}
```

### Navigation (`data/nav.json`)

```json
[
  {"label": "Home", "href": "/"},
  {"label": "News", "href": "/news/"},
  {"label": "About", "href": "/about/"},
  {"label": "Research", "href": "/research/"},
  {"label": "Facility", "href": "/facility/"},
  {"label": "Publications", "href": "/publications/"},
  {"label": "Hiring", "href": "/hiring/"}
]
```

Brand "Shao Lab" on the left, links from `nav.json` in the center/right, theme-toggle icon on the far right. Fun is omitted from this list (page remains live at `/fun/`). On narrow viewports the link list collapses into a hamburger menu (responsive-patterns work).

### Footer (`partials/footer.html`)

Existing social links (LinkedIn, Twitter/X, UGA profile) plus a new **"Leave a message"** link that opens `#message-modal`.

---

## 3. Page Designs

### 3.1 Home Page (`/index.html`)

**Hero**:
- "W. Shao Laboratory" — Display
- "Electronic and Photonic Materials Discovery" — Lead, accent color (kept from current copy)
- "Department of Chemistry · University of Georgia" — muted caption
- "Where chemistry meets light." — Lead, **replaces "- Welcome!"**

**Latest News** (from `data/news.json`):

```json
{
  "date": "2026-05-15",
  "title": "New paper published in JACS",
  "tag": "Publication",
  "image": "/assets/img/news/2026-jacs.jpg",
  "link": "/publications/#jacs-2026",
  "excerpt": "Our latest work on triplet-triplet annihilation in hybrid frameworks explores...",
  "featured": "large"
}
```

- `featured: "large"` items populate the **auto-cycling featured card** (image, tag, headline, excerpt, "Read more →"). Crossfades every ~5s, pauses on hover/focus/touch, with dot indicators for position. Default ~3 items, but any count works — the carousel just cycles through all of them.
- `featured: "small"` items populate the static **"More News"** list beside it (date + title, typically 3 items).
- Items with neither `featured` value don't appear on the home page but still appear on `/news/`.
- `excerpt` is only used for `"large"` items.
- "View all →" links to `/news/`.

**Explore the Research** (gallery, from `data/gallery.json`, 5 entries):

```json
{"image": "/assets/img/gallery/triplet-emitters.jpg", "title": "Organic Triplet Emitters", "link": "/research/project.html?id=triplet-emitters"}
```

- Asymmetric two-row mosaic: top row = 2 tiles (wide + narrow), bottom row = 3 equal tiles.
- Each tile: background image + always-visible bottom gradient overlay with `title` (no hover dependency — works on touch).
- `link` can point anywhere (a project page, `/about/`, etc.) — gallery is a general showcase, not strictly tied to `projects.json`.
- "View All Research →" links to `/research/`.

### 3.2 About Page (`/about/index.html`)

`data/people.json`:

```json
{
  "slug": "wenhao-shao",
  "name": "Wenhao Shao",
  "title": "Assistant Professor of Chemistry",
  "photo": "/assets/img/people/wenhao-shao.jpg",
  "section": "pi",
  "blurb": "Molecular design, self-assembly, and photophysics of organic semiconductors.",
  "bio": "<p>Wenhao was born and raised in Shanghai, China...</p>"
}
```

`section` is one of `"pi" | "member" | "mascot"`. `blurb` is optional, used only for the PI card.

**PI card** (large/featured): photo + name + title + the one-line `blurb` shown directly on the card — this extra content is what makes it visually larger than member cards. Clicking opens `#person-modal` with the full `bio`, plus **"Leave a message"** and **"Download CV"** buttons.

**Group Members**: `<h2>` divider, then a card grid (photo + name + title only) for all `section: "member"` entries. Click → `#person-modal` with full bio + email.

**Mascots**: separate `<h2>` divider, own card grid — same card component/styling as Group Members. Click → `#person-modal` with their bio.

**Modals**: `#person-modal` and `#message-modal` share the existing `.modal-overlay > .modal-content > .close-modal` CSS. `#person-modal` is populated dynamically by `render-people.js` based on the clicked card. The PI modal's "Leave a message" button closes `#person-modal` and opens `#message-modal` (sequential, not stacked).

Proposed `title` values:

| Person | Title |
|---|---|
| Wenhao Shao | Assistant Professor of Chemistry |
| Le Wei | Postdoctoral Researcher |
| Chooi Wai Loon | Ph.D. Student, Physics & Astronomy |
| Wang Yue | Ph.D. Student, Chemistry |
| Ichchha Badgujjar | Ph.D. Student, Chemistry (Rotation) |
| Snowball | Lab Mascot (Pomeranian) |
| Sidney | Service Dog in Training |

### 3.3 Publications Page (`/publications/index.html`)

`data/publications.json`:

```json
{
  "title": "Triplet–Triplet Annihilation in Hybrid Organic–Inorganic Frameworks",
  "authors": "W. Shao, ... <span class=\"mentee\">Y. Wang</span>...",
  "journal": "J. Am. Chem. Soc.",
  "year": 2026,
  "link": "https://doi.org/...",
  "newsLink": "/news/#jacs-2026",
  "featured": "main",
  "highlightImage": "/assets/img/publications/jacs-2026.jpg",
  "highlightDescription": "A new class of hybrid materials enables efficient upconversion through controlled molecular packing, opening pathways for next-generation photonic devices."
}
```

`authors`, `newsLink`, `featured`, `highlightImage`, `highlightDescription` are optional, omitted when not applicable.

**Featured Publications** (above the list, "big left + 2×2 right" layout): the entry with `featured: "main"` renders as the large left card (image + title + `highlightDescription`); entries with `featured: "secondary"` (typically 4) fill the 2×2 grid on the right (image + title only). Re-featuring a paper later is just changing its `featured` value.

**Publication list** (below): `render-publications.js` iterates all entries sorted by `year`/date descending, generating `<li data-year="...">` markup matching today's structure, with `authors` rendered as HTML (mentee/corresponding-author `<span>` styling lives in the JSON string, same pattern as `bio`). Two improvements fall out of this:
- List numbering (`reversed start="N"`) is computed from `publications.json.length`.
- The year-filter dropdown's options are derived from the distinct `year` values present in the data.

### 3.4 Research Pages (`/research/index.html`, `/research/project.html`)

`data/projects.json`:

```json
{
  "slug": "triplet-emitters",
  "title": "Organic Triplet Emitters",
  "summary": "Designing molecules for efficient triplet-state photophysics.",
  "image": "/assets/img/projects/triplet-emitters.jpg",
  "body": "<p>...full write-up, figures, links...</p>"
}
```

- `/research/index.html`: card grid from `projects.json` (image + title + summary), linking to `/research/project.html?id=<slug>`.
- `/research/project.html`: reads `?id=`, renders the matching entry's `title`/`image`/`body`.
- The 4 existing project pages are migrated into `projects.json[].body` once during implementation.

### 3.5 Hiring Page (`/hiring/index.html`, new)

Static page, not JSON-driven (not on the "editable content" list). Placeholder content: "Open Positions" heading + a short paragraph (no positions currently open / encourages interested candidates to reach out) + link to "Leave a message".

### 3.6 Fun & Facility Pages

No structural changes — both pick up the new shared partials/stylesheet automatically. Fun stays live at `/fun/` but off the nav; Facility just gets the visual refresh.

---

## 4. Migration & Housekeeping

- `BODY/*.html` templates retire: content moves into `data/*.json` (about/news/publications/projects), or becomes the new shared partials (`head-body.html` → `partials/head.html`).
- Images move from `/<version>/about/...`, `/TOC/...`, etc. into `/assets/img/{people,news,gallery,projects,publications}/`.
- Old `/day-version/...` and `/night-version/...` URLs will 404 (flattened to a single page tree, per project decision).
