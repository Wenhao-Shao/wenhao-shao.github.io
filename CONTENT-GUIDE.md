# Website Content Guide

This guide explains how to update the W. Shao Laboratory website **without writing any code**. Almost everything you'll want to change — news, team members, research projects, publications, photos — lives in a handful of simple files in the `data/` folder.

If you just want to know which file to open, jump to the **Quick Reference** below.

---

## Quick Reference

| I want to... | Edit this file | Also add photos to |
|---|---|---|
| Post a news update | `data/news.json` | `assets/img/news/` |
| Add/edit a team member, mascot, or the PI bio | `data/people.json` | `assets/img/people/` |
| Add a research project | `data/projects.json` | `assets/img/projects/` |
| Add a publication | `data/publications.json` | `assets/img/publications/` |
| Change the home page photo gallery | `data/gallery.json` | `assets/img/gallery/` |
| Edit the Hiring, Facility, or Fun page text | `hiring/index.html`, `facility/index.html`, `fun/index.html` | — |
| Change the top menu | `data/nav.json` | — |

---

## 1. How This Website Works

The site is split into two kinds of files:

- **Content files** (what this guide is about) — live in the `data/` folder and end in `.json`. Each one is a simple list of entries: news posts, people, projects, publications, or gallery photos. **This is the only folder most updates require.**
- **Design files** — everything else (page layouts, styling, scripts). You shouldn't need to touch these for routine updates.

### Understanding a `.json` file

Open `data/news.json` and you'll see something like this:

```json
[
  {
    "date": "Feb 2026",
    "title": "New Postdoc",
    "image": "/assets/img/news/2602_1.jpg",
    "body": "<p>We warmly welcome...</p>"
  },
  {
    "date": "Jan 2026",
    "title": "Another Story",
    "image": "/assets/img/news/2601_1.png",
    "body": "<p>Some details...</p>"
  }
]
```

A few rules that matter:

- The whole file is wrapped in square brackets `[ ... ]` — this is "the list."
- Each entry (one news post, one person, one project...) is wrapped in curly braces `{ ... }`.
- Every entry **except the last one** in the list needs a comma `,` after its closing `}`.
- Every piece of text must be inside double quotes `"..."`.
- Every line except the last in an entry needs a comma `,` at the end.

**The #1 mistake** is a missing or extra comma. If the page breaks after an edit, this is almost always the cause — see [Troubleshooting](#10-if-something-goes-wrong) below.

> **Tip:** Don't use straight double quotes (`"`) *inside* your text — they will break the file. If you need to show a quote, use curly "smart quotes" instead (most word processors do this automatically). Special characters like em dashes (—), accented letters (é, ü), and Greek letters (μ, λ, °) can be typed directly — no special codes needed.

### Rich text: the `body` / `bio` fields

Some fields (like `body` on a news post, or `bio` for a person) hold a small chunk of formatted text using simple HTML tags. You can mix and match these:

| Tag | What it does | Example |
|---|---|---|
| `<p>...</p>` | A paragraph | `<p>This is a paragraph.</p>` |
| `<strong>...</strong>` | **Bold** text | `<strong>important</strong>` |
| `<em>...</em>` | *Italic* text | `<em>Science</em>` |
| `<br>` | A line break (no closing tag) | `Line one<br>Line two` |
| `<a href="URL" target="_blank" rel="noopener">text</a>` | A clickable link that opens in a new tab | `<a href="https://example.com" target="_blank" rel="noopener">our paper</a>` |

Every paragraph of text needs its own `<p>...</p>` wrapper. To write a new multi-paragraph story, it looks like:

```json
"body": "<p>First paragraph here.</p><p>Second paragraph here.</p>"
```

---

## 2. Posting News

**File:** `data/news.json`

Each news item looks like this:

```json
{
  "date": "Mar 2026",
  "title": "Your Headline Here",
  "tag": "People",
  "image": "/assets/img/news/2603_1.jpg",
  "link": "https://example.com/some-link",
  "excerpt": "A one-sentence summary shown on the home page.",
  "body": "<p>The full story goes here. You can write several paragraphs.</p>",
  "featured": "large"
}
```

**Field guide:**

| Field | Required? | What it is |
|---|---|---|
| `date` | Yes | Shown next to the story, e.g. `"Mar 2026"` or `"Mar 5 2026"`. Free text. |
| `title` | Yes | The headline. |
| `image` | Yes | Path to a photo (see [Adding Photos](#9-adding-photos)). |
| `body` | Yes | The full story, shown on the News page. Use `<p>` paragraphs. |
| `tag` | No | A short label like `"People"`, `"Publication"`, or `"Award"`. Only shown on featured home-page cards. |
| `link` | Only if `featured: "large"` | Where "Read more" goes — can be an external URL or an internal link like `/research/project.html?id=some-project`. |
| `excerpt` | Only if `featured: "large"` | A one-sentence teaser shown on the home page. |
| `featured` | No | Controls whether this appears on the **home page** (see below). |

**How `featured` works:**

- Every news item, with or without `featured`, always shows up on the full **News** page (`/news/`).
- `"featured": "large"` → also appears as a big rotating story at the top of "Latest News" on the **home page**. Needs `excerpt` and `link`.
- `"featured": "small"` → also appears in the short "More News" list on the home page (just date + title).
- No `featured` field → only appears on the News page, not the home page.

**To add a new post:** copy an existing entry (including its `{` and `}`), paste it as the **first** entry in the list (right after the opening `[`), add a comma after its closing `}`, then edit the fields. New items go at the top — that's what makes them "latest."

---

## 3. Updating the Team (About Page)

**File:** `data/people.json`

Each person/mascot looks like this:

```json
{
  "slug": "first-last",
  "name": "First Last",
  "title": "Ph.D. Student, Chemistry",
  "photo": "/assets/img/people/first-last.jpg",
  "section": "member",
  "bio": "<p>A paragraph or two about this person.</p>",
  "email": "username at uga dot edu"
}
```

**Field guide:**

| Field | Required? | What it is |
|---|---|---|
| `slug` | Yes | A unique short ID, lowercase with hyphens (e.g. `"jane-doe"`). No spaces. Used internally — pick once and don't change it later. |
| `name` | Yes | Full name (shown on the card and pop-up). |
| `title` | Yes | Position, e.g. `"Ph.D. Student, Chemistry"` or `"Postdoctoral Researcher"`. |
| `photo` | Yes | Path to a square photo (see [Adding Photos](#9-adding-photos)). |
| `section` | Yes | `"pi"`, `"member"`, or `"mascot"` — see below. |
| `bio` | Yes | Shown in the pop-up window when their card is clicked. Can be several `<p>` paragraphs. |
| `email` | No | Shown in the pop-up. Lab convention writes it as `"name at uga dot edu"` to avoid spam. |
| `blurb` | PI only | A one-sentence research summary shown directly on the page under the PI's name. |
| `cv` | PI only | Path to a PDF (e.g. `/assets/files/CV_Name.pdf`), adds a "Download CV" button to the PI's pop-up. |

**The `section` field:**

- `"pi"` — the lab's Principal Investigator. **There should only be one.** This person is shown large at the top of the About page with their `blurb`.
- `"member"` — everyone in the "Group Members" grid.
- `"mascot"` — everyone (everydog) in the "Mascots" grid.

**To add someone new:** copy an existing entry with `"section": "member"` (or `"mascot"`), paste it where you want them to appear (order in the file = order on the page), give them a unique `slug`, and fill in their details. Add their photo to `assets/img/people/`.

**To remove someone:** delete their whole `{ ... }` entry, including the comma that separates it from the next entry.

---

## 4. Adding a Research Project

**File:** `data/projects.json`

Each project looks like this:

```json
{
  "slug": "your-project-slug",
  "title": "Project Title",
  "summary": "A one- or two-sentence summary shown on the Research page card.",
  "image": "/assets/img/projects/your-project-slug.jpg",
  "body": "<img class=\"project-fig\" src=\"/assets/img/projects/your-project-slug.jpg\" alt=\"Description of the figure\"><p>The full write-up goes here, as one or more paragraphs.</p>"
}
```

**Field guide:**

| Field | What it is |
|---|---|
| `slug` | A unique short ID, lowercase with hyphens, no spaces. This becomes part of the project's web address (`/research/project.html?id=your-project-slug`). **Pick it carefully and don't change it later** — other pages may link to it. |
| `title` | The project's full title. |
| `summary` | Short teaser shown on the Research page grid. |
| `image` | The thumbnail photo for the grid card. |
| `body` | The full project write-up shown on its own page. Can include multiple `<p>` paragraphs and extra figures. |

**Adding figures inside `body`:** use this pattern (note the `\"` — when you write a quote mark *inside* an already-quoted field, it must have a backslash before it):

```
<img class=\"project-fig\" src=\"/assets/img/projects/figure-2.jpg\" alt=\"Description for screen readers\">
```

**Linking a news post to a project:** in `data/news.json`, set that post's `"link"` to `/research/project.html?id=your-project-slug`.

**To add a new project:** copy an existing entry, paste it where you want it to appear in the Research grid, give it a new `slug`, and fill in the details. Add its image(s) to `assets/img/projects/`.

---

## 5. Adding a Publication

**File:** `data/publications.json`

### A regular entry

```json
{
  "title": "Paper Title Goes Here",
  "authors": "Last, F.; Shao, W.*",
  "journal": "J. Am. Chem. Soc.",
  "year": 2026,
  "link": "https://doi.org/...",
  "citation": "<span class=\"pub-journal\">J. Am. Chem. Soc.</span> 2026, 148, 1-10."
}
```

**Field guide:**

| Field | Required? | What it is |
|---|---|---|
| `title` | Yes | Paper title. |
| `authors` | Yes | Author list (formatting notes below). |
| `journal` | No | Journal name. Omit for "Under Review" / preprints. |
| `year` | Yes | A plain number, e.g. `2026` (no quotes). |
| `link` | No | URL to the paper. If omitted, the title won't be a clickable link. |
| `citation` | Yes | The formatted citation line shown after the authors, e.g. journal, year, volume, pages. For unpublished work, you can write something like `"Under Review."` |
| `newsHighlight` | No | Extra line(s) for press coverage, e.g. `"&bull; News highlight: <a href=\"...\" target=\"_blank\" rel=\"noopener\">Some Outlet</a>."` |

**Author formatting conventions** (already used throughout the file — match this style for consistency):

- `&dagger;` → renders as a `†` symbol (equal contribution).
- `*` → marks the corresponding author (typed directly).
- `<span class="mentee">Name</span>` → visually highlights a trainee/mentee's name.

A legend explaining these symbols is already shown on the Publications page, so just follow the same notation.

**Where new entries go:** the list is numbered with the newest paper at the top getting the highest number. **Add new publications at the very top of the list** (right after the opening `[`).

### Featured Publications (the highlight section at the top of the Publications page)

Up to **one** entry can be `"featured": "main"` — this becomes the big highlight card. It needs:

```json
"featured": "main",
"highlightImage": "/assets/img/publications/your-image.jpg",
"highlightDescription": "A short 1-3 sentence description of the paper's significance, shown under the title."
```

Up to about **four** entries can be `"featured": "secondary"` — these become the smaller highlight cards next to the main one. They need:

```json
"featured": "secondary",
"highlightImage": "/assets/img/publications/your-image.jpg"
```

To feature a different paper, move the `"featured"`, `"highlightImage"`, and (for `"main"`) `"highlightDescription"` fields to that paper's entry, and remove them from the old one (or just edit the existing one in place). Only **one** `"main"` should exist at a time.

---

## 6. Updating the Home Page Photo Gallery

**File:** `data/gallery.json`

This controls the "Explore the Research" photo mosaic on the home page. It must contain **exactly 5 entries** — the layout is designed around 2 larger photos on top and 3 smaller ones below, in this order:

```json
{
  "image": "/assets/img/gallery/your-photo.jpg",
  "title": "Caption shown on the photo",
  "link": "/research/"
}
```

| Field | What it is |
|---|---|
| `image` | The photo (see [Adding Photos](#9-adding-photos)). |
| `title` | Caption overlaid on the photo. |
| `link` | Where clicking the photo goes — a project page, the Research page, or an external article. |

To swap a photo, edit the entry in place (don't add or remove entries — keep it at 5).

---

## 7. Editing the Simple Pages (Hiring, Facility, Fun)

The **Hiring**, **Facility**, and **Fun** pages are plain text, not data files — but they're simple enough to edit safely if you're careful.

Open `hiring/index.html` (or `facility/index.html`, `fun/index.html`) and look for text between `<p>` and `</p>` tags. For example:

```html
<p>There are no open positions in the lab at this time. However, we are always happy to hear from motivated students and researchers...</p>
```

You can safely change the **words** between `<p>` and `</p>`. Don't change, delete, or add anything containing `<` or `>` — those are structural tags that control the page layout. If you're ever unsure whether something is safe to edit, leave it as-is and ask for help.

---

## 8. Updating the Menu

**File:** `data/nav.json`

This is the list of links in the top navigation bar:

```json
[
  { "label": "Home", "href": "/home/" },
  { "label": "News", "href": "/news/" },
  { "label": "About", "href": "/about/" },
  { "label": "Research", "href": "/research/" },
  { "label": "Facility", "href": "/facility/" },
  { "label": "Publications", "href": "/publications/" },
  { "label": "Hiring", "href": "/hiring/" }
]
```

- `label` is the text shown in the menu.
- `href` is the page it links to.
- The order in the file is the order shown in the menu.

To add a link, copy one of the lines, give it a new `label` and `href`, and add a comma. To remove a link, delete its line (and make sure the last line in the list has **no** trailing comma).

---

## 9. Adding Photos

Photos live in subfolders of `assets/img/`, organized by content type:

| Folder | Used for | Best shape |
|---|---|---|
| `assets/img/news/` | News post photos | Landscape (wide), at least ~1200px wide |
| `assets/img/people/` | Team member & mascot photos | Square, at least ~500×500px |
| `assets/img/projects/` | Research project photos & figures | Landscape (16:9), at least ~1200×675px |
| `assets/img/publications/` | Publication highlight images | Landscape for the "main" highlight, square for "secondary" highlights |
| `assets/img/gallery/` | Home page photo mosaic | Roughly square, at least ~800×800px |

**Notes:**

- The website automatically crops photos to fit, so they don't need to be a perfect match — just close to the shape above so important parts of the image aren't cropped out.
- Use `.jpg`, `.png`, or `.webp` files.
- Name files in lowercase with hyphens or underscores instead of spaces (e.g. `new-postdoc.jpg`, not `New Postdoc.JPG`). For people and projects, matching the photo filename to the `slug` (e.g. `jane-doe.jpg`) keeps things tidy.
- In the data file, the `image`/`photo` path always starts with `/assets/img/...` — double-check the folder, filename, and capitalization match exactly, since these are case-sensitive.

---

## 10. Saving and Publishing Your Changes

This website is hosted on **GitHub Pages**: whatever is in the `main` branch is the live website. Changes usually go live within a minute or two of being saved.

**Easiest way — edit directly on GitHub.com:**

1. Go to the file you want to edit in the repository on github.com.
2. Click the pencil ("Edit this file") icon.
3. Make your changes.
4. Before saving a `.json` file, it's worth pasting the **whole file's contents** into a free JSON checker like [jsonlint.com](https://jsonlint.com) to catch typos (missing commas, quotes, etc.) before they go live.
5. Scroll down and click "Commit changes."

**If you're working from a computer with the project downloaded** (e.g. via GitHub Desktop), edit and save the file locally, then commit and push your changes the same way you would for any update.

---

## 11. If Something Goes Wrong

**A page goes blank or stops showing its content after an edit to a `data/*.json` file.**
This almost always means the file's punctuation is broken — usually a missing/extra comma or quote mark. Fixes:

1. Paste the file's contents into [jsonlint.com](https://jsonlint.com) — it will point to the exact line with the problem.
2. Common culprits: a comma after the **last** item in a list (remove it), or a missing comma between two items (add it), or a stray `"` inside text (replace with curly quotes).
3. If you can't find the issue, use GitHub's "History" for that file to view a previous working version, and either copy from it or restore it.

**An image doesn't show up.**
Check that:
- The path in the data file starts with `/assets/img/...`.
- The filename, including capitalization and extension (`.jpg` vs `.JPG` vs `.png`), matches the actual file exactly.
- The file was actually uploaded to the right folder.

**I want to change the menu order, page layout, colors, or fonts.**
That goes beyond this guide — those live in the design files (`assets/css/style.css` and the page templates). Ask a developer for help with those changes.

