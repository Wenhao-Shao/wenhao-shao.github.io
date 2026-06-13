# Fun Page Refresh & Site Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the Fun page its visual refresh, retrofit the one page outside the new tree that still hardcodes `day-version/` paths (`widget/unit_conversion/index.html`), then retire the legacy `BODY/`, `day-version/`, and `night-version/` trees — completing the flattened single-page-tree architecture from the spec.

**Architecture:** `/fun/index.html` is a new static page (not data-driven, matching the Hiring page's low-churn precedent from Plan 5) built on the Page Template and reusing Plan 5's existing `.project-grid`/`.project-card` CSS for two cards (Mind Map, Unit Conversion) — no new CSS needed. `facility/index.html` gets a one-line heading-class fix so it matches the `.section-heading` convention introduced in Plan 3 (after Plan 1 was written). `widget/unit_conversion/index.html` is retrofitted to the Page Template's head/nav/footer (theme.js, shared stylesheet, `#site-nav`/`#site-footer`, partials.js) while its page-specific `<style>` block and conversion `<script>` are left untouched — this is required because this plan deletes `day-version/`/`night-version/` entirely, and that page is the only thing outside those trees that still points into them. After verifying the `assets/img/*` migrations from Plans 2, 4, and 5 are complete (35 files across 5 directories), `BODY/` (11 retired templates), `day-version/`, and `night-version/` are removed via `git rm -r`.

**Tech Stack:** Same as Plans 1-5 — static HTML/CSS/vanilla ES5 JS, no build step, `npx serve` for local preview, PowerShell for file-count verification, `git rm -r` for directory removal.

---

This is **Plan 6 of 6**. It depends on:
- **Plan 1** (Foundation) for the Page Template (head/nav/footer skeleton), `assets/css/style.css` tokens (`--space-4`, `.text-lead`), `assets/partials/{nav,footer}.html`, `assets/js/{theme,partials}.js`, `data/nav.json` (already excludes "Fun", per spec), and the existing `facility/index.html`.
- **Plan 3** for the `.section-heading` convention (didn't exist when Plan 1 wrote `facility/index.html`).
- **Plan 5** for `.project-grid` / `.project-card` / `.project-card__img` / `.project-card__body` / `.project-card__title` / `.project-card__summary` (in `assets/css/style.css`, under the "Research: Project Grid & Detail" comment block) — reused here verbatim for the Fun page's two cards.
- **Plans 2, 4, 5** for the `assets/img/{news,gallery,people,publications,projects}` copies that Task 4 verifies before this plan deletes their source directories.

## Content-mapping decisions

These are mechanical decisions made while writing this plan, documented here so the rationale isn't lost:

1. **Unit Conversion card image is a placeholder.** The legacy `BODY/fun-body.html` pointed the Unit Conversion card at `/widget/unit_conversion/unit_conversion.png`, but that file does not exist anywhere in the repo — a pre-existing broken image. Task 1 uses `/assets/icons/SWH_logo.png` (already present after Plan 1) as a placeholder thumbnail instead of carrying the broken reference forward.
2. **Widget retrofit is head/nav/footer only.** `widget/unit_conversion/index.html`'s own `.widget-container`/`.widget-content` styling (white card, hardcoded `#333` text, etc.) and its conversion `<script>` are left completely untouched. In dark mode, the site nav/footer will switch themes but the widget card stays light — same as an embedded tool with its own look. Redesigning the widget itself is out of scope for this plan.
3. **`.widget-container` margin shrinks from `120px auto 40px` to `var(--space-4) auto`.** The old `120px` top margin existed to clear the legacy nav. The new `.site-nav` is `position: sticky` and only ~72px tall, so that much clearance is no longer needed; `var(--space-4)` (40px) matches the existing bottom margin for a symmetric result. The mobile-only override (`margin-top: 80px` under 600px) is removed for the same reason.
4. **`<main>` wraps `.widget-container` directly**, not `<section class="container">` — `.widget-container` already defines its own `max-width`/`padding`/`margin`, and wrapping it in `.container` (1100px max-width, different padding) would conflict with that. The retrofit's new `<head>` block uses the Page Template's 2-space indentation (per "copy verbatim"); the preserved `<style>`/body content keeps its existing 4-space indentation. This mismatch is cosmetic only.
5. **`day-version/icons/500px.svg` and `day-version/icons/day_night.png` are intentionally not migrated.** `500px.svg` was a social-platform icon not present in the new `assets/partials/footer.html`; `day_night.png` was the old day/night toggle image, superseded by the new `.theme-toggle` sun/moon SVGs in `assets/partials/nav.html`. Both are dropped along with `day-version/` in Task 6.
6. **`data/nav.json` needs no change.** Plan 1 already wrote it without a "Fun" entry, satisfying the spec's "Fun stays live at `/fun/` but off the nav."

---

## Task 1: Fun page — visual refresh

**Files:**
- Create: `fun/index.html`

- [ ] **Step 1: Create the Fun page**

Write `fun/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y8E59MSLP3"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-0V2HS5NSS6');
  </script>

  <script src="/assets/js/theme.js"></script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="icon" href="/assets/icons/SWH_logo.png">

  <meta name="description" content="Fun — W. Shao Laboratory">
  <meta name="robots" content="index,follow">
  <title>Fun — W. Shao Laboratory</title>
</head>
<body>
  <div id="site-nav"></div>

  <main>
    <section class="container">
      <h1 class="section-heading">Fun</h1>
      <p class="text-lead">A couple of small tools built along the way.</p>

      <div class="project-grid">
        <a class="project-card" href="/widget/mindmap/index.html">
          <img class="project-card__img" src="/widget/mindmap/mindmap.png" alt="Mind Map tool screenshot">
          <div class="project-card__body">
            <h3 class="project-card__title">Mind Map</h3>
            <p class="project-card__summary">Node/edge graph for brainstorming and summarizing ideas.</p>
          </div>
        </a>
        <a class="project-card" href="/widget/unit_conversion/index.html">
          <img class="project-card__img" src="/assets/icons/SWH_logo.png" alt="Unit Conversion tool">
          <div class="project-card__body">
            <h3 class="project-card__title">Unit Conversion</h3>
            <p class="project-card__summary">Tool for converting between different units of measurement.</p>
          </div>
        </a>
      </div>
    </section>
  </main>

  <div id="site-footer"></div>

  <script src="/assets/js/partials.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Ensure the local static server is running**

If the server from Plan 1 (`npx --yes serve . -l 5000`) isn't still running, start it from the repo root and leave it running:

```powershell
npx --yes serve . -l 5000
```

- [ ] **Step 3: Manual verification in browser**

Open `http://localhost:5000/fun/` and check:

- [ ] Page renders in Manrope, light theme by default, matching `/facility/`.
- [ ] Nav bar shows the same 7 links as every other page (Home / News / About / Research / Facility / Publications / Hiring) — **no "Fun" link appears in the nav**, and none of the 7 links is highlighted as active (since `/fun/` isn't in `nav.json`).
- [ ] Heading "Fun" renders in the same style as "Facility" on `/facility/`, with the intro line below it in `.text-lead` size.
- [ ] Two cards appear side by side (2-column grid) on desktop: "Mind Map" (with the mind-map screenshot thumbnail) and "Unit Conversion" (with the lab logo as a placeholder thumbnail).
- [ ] Resize below ~760px: the two cards stack into a single column.
- [ ] Hovering a card lifts it slightly and shows an accent-colored border (same hover effect as the Research project cards).
- [ ] Click the "Mind Map" card: navigates to `/widget/mindmap/index.html` and the mind-map tool loads.
- [ ] Go back, click the "Unit Conversion" card: navigates to `/widget/unit_conversion/index.html` (this page is retrofitted in Task 3 of this plan — for now it may still show the old styling).
- [ ] Toggle dark mode: nav, footer, heading, intro text, and card backgrounds all switch to the dark theme; reload — persists.
- [ ] No console errors on page load.

- [ ] **Step 4: Commit**

```bash
git add fun/index.html
git commit -m "Add Fun page on the shared theme/nav/footer template"
```

---

## Task 2: Facility page — heading-class retrofit

**Files:**
- Modify: `facility/index.html`

- [ ] **Step 1: Update the heading to use `.section-heading`**

`facility/index.html` currently has (written by Plan 1, before the `.section-heading` convention existed):

```html
      <h1>Facility</h1>
```

Edit `facility/index.html`, changing this line to:

```html
      <h1 class="section-heading">Facility</h1>
```

- [ ] **Step 2: Manual verification in browser**

Open `http://localhost:5000/facility/` and check:

- [ ] Page still renders correctly — heading "Facility" appears above the "coming soon" paragraph with the same visual weight as before (`.section-heading` only adds `margin-bottom`, no size/weight change).
- [ ] In dev tools, confirm `<h1>` now has `class="section-heading"`.
- [ ] No console errors.

- [ ] **Step 3: Commit**

```bash
git add facility/index.html
git commit -m "Apply .section-heading convention to Facility page heading"
```

---

## Task 3: Retrofit `widget/unit_conversion/index.html` off `day-version/`

**Files:**
- Modify: `widget/unit_conversion/index.html`

This page is the only file outside `day-version/`/`night-version/`/`BODY/` that hardcodes paths into those trees (stylesheet, favicon, nav links, footer icons, day/night switch link). Task 6 of this plan deletes those trees, so this page must be retrofitted first. Six targeted edits follow; the page's own `<style>` block (conversion-grid layout) and `<script>` (conversion logic) are untouched.

- [ ] **Step 1: Replace the `<head>` metadata with the Page Template head**

Find this block at the top of `widget/unit_conversion/index.html` (everything between `<head>` and the page's `<style>` block):

```html
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y8E59MSLP3"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-0V2HS5NSS6');
    </script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unit Conversion Widget - Shao Lab</title>
    <link rel="stylesheet" href="../../day-version/styles/style.css" />
    <link rel="icon" href="../../day-version/icons/SWH_logo.png" />
```

Replace it with:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y8E59MSLP3"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-0V2HS5NSS6');
  </script>

  <script src="/assets/js/theme.js"></script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="icon" href="/assets/icons/SWH_logo.png">

  <meta name="description" content="Unit Conversion Widget — W. Shao Laboratory">
  <meta name="robots" content="index,follow">
  <title>Unit Conversion Widget — W. Shao Laboratory</title>
```

The page's existing `<style>` block (starting with `.widget-container { ... }`) immediately follows and is untouched by this edit.

- [ ] **Step 2: Shrink the `.widget-container` top margin**

Find:

```html
        .widget-container {
            max-width: 1400px;
            margin: 120px auto 40px;
            padding: 40px 20px;
        }
```

Replace with:

```html
        .widget-container {
            max-width: 1400px;
            margin: var(--space-4) auto;
            padding: 40px 20px;
        }
```

- [ ] **Step 3: Remove the now-unnecessary mobile margin override**

Find (inside the `@media (max-width: 600px)` block):

```html
            .input-group input {
                font-size: 1em;
                padding: 14px;
            }

            .widget-container {
                margin-top: 80px;
            }
        }
```

Replace with:

```html
            .input-group input {
                font-size: 1em;
                padding: 14px;
            }
        }
```

- [ ] **Step 4: Replace the legacy header/nav with `#site-nav` and open `<main>`**

Find:

```html
    <!-- Header Navigation -->
    <header>
        <nav>
            <div class="logo">
                <a href="../../day-version/index.html">
                    <img src="../../day-version/icons/SWH_logo.png" alt="logo" width="80px" height="70px"/>
                </a>
            </div>
            <ul>
                <li><a class="nonactive" href="../../day-version/index.html">Home</a></li>
                <li><a class="nonactive" href="../../day-version/news/news.html">News</a></li>
                <li><a class="nonactive" href="../../day-version/about/about.html">About</a></li>
                <li><a class="nonactive" href="../../day-version/research/research.html">Research</a></li>
                <li><a class="nonactive" href="../../day-version/facility/facility.html">Facility</a></li>
                <li><a class="nonactive" href="../../day-version/publications/publications.html">Publications</a></li>
                <li><a class="active" href="../../day-version/fun/fun.html">Fun</a></li>
                <a class="switch" href="../../night-version/fun/fun.html">
                    <img src="../../day-version/icons/day_night.png" alt="switch" width="20px" height="20px"/>
                </a>
            </ul>
        </nav>
    </header>

    <!-- Widget Content -->
    <div class="widget-container">
```

Replace with:

```html
    <div id="site-nav"></div>

    <main>
    <!-- Widget Content -->
    <div class="widget-container">
```

- [ ] **Step 5: Replace the legacy footer with `#site-footer` and close `<main>`**

Find:

```html
    </div>

    <!-- Footer -->
    <footer>
        <h4>
            <a href="https://www.linkedin.com/in/cali-li/"><u>Website Developed by Cali Li</u></a> <br>
            wenjingli199707 at gmail dot com <br>
            &copy;Copyright &copy;2024 All rights reserved
        </h4>

        <ul>
            <li>
                <a href="https://www.linkedin.com/in/wenhao-shao/" target="_blank">
                    <img src="../../day-version/icons/linkedin.svg" alt="linkedin-social" height="40px"/>
                </a>
            </li>
            <li>
                <a href="https://twitter.com/whshao" target="_blank">
                    <img src="../../day-version/icons/twitter.svg" alt="twitter-social" height="40px"/>
                </a>
            </li>
            <li>
                <a href="https://www.chem.uga.edu/directory/people/wenhao-shao" target="_blank">
                    <img src="../../day-version/icons/UGA.svg" alt="UGA-profile" height="40px"/>
                </a>
            </li>
        </ul>
    </footer>

    <script>
```

Replace with:

```html
    </div>
    </main>

    <div id="site-footer"></div>

    <script>
```

The conversion `<script>` block (energy/length conversion logic) immediately follows and is untouched by this edit.

- [ ] **Step 6: Add `partials.js` before `</body>`**

Find the end of the file:

```html
    </script>
</body>
</html>
```

Replace with:

```html
    </script>

    <script src="/assets/js/partials.js" defer></script>
</body>
</html>
```

- [ ] **Step 7: Manual verification in browser**

Open `http://localhost:5000/widget/unit_conversion/` and check:

- [ ] Nav bar and footer match every other page (Manrope, 7 nav links, theme toggle, "Leave a message" modal) — no "Fun" link, none of the 7 links highlighted.
- [ ] The widget card itself (white background, "Unit Conversion Widget" heading, Energy/Length sections) renders as before, now with `var(--space-4)` of space above it instead of the old large gap.
- [ ] Type a value into the "Hartree (Eh)" field — all other Energy fields populate. Type into "Ångström (Å)" — Length fields populate. Conversion logic still works.
- [ ] Toggle dark mode: nav and footer switch to dark theme; the widget card stays white/light (expected — see content-mapping decision 2). Reload — dark mode persists.
- [ ] In the browser Network tab, confirm no requests to `day-version/` or `night-version/` paths.
- [ ] No console errors.
- [ ] From `/fun/`, the "Unit Conversion" card now links into a page that matches the rest of the site's chrome.

- [ ] **Step 8: Commit**

```bash
git add widget/unit_conversion/index.html
git commit -m "Retrofit Unit Conversion widget onto shared theme/nav/footer, drop day-version dependency"
```

---

## Task 4: Verify image migrations before deleting source directories

**Files:** none (verification only)

Plans 2, 4, and 5 copied images from `day-version/`, `TOC/`, and `news_img/` into `assets/img/{news,gallery,people,publications,projects}/`. Before Tasks 5-6 delete `BODY/`, `day-version/`, and `night-version/`, confirm those copies all landed.

- [ ] **Step 1: Count files in each `assets/img/` subdirectory**

Run from the repo root:

```powershell
"people","news","gallery","projects","publications" | ForEach-Object {
  $count = (Get-ChildItem "assets/img/$_" -File -ErrorAction SilentlyContinue).Count
  "$_ : $count"
}
```

Expected output:

```
people : 7
news : 11
gallery : 5
projects : 7
publications : 5
```

- [ ] **Step 2: If any count doesn't match**

STOP. Do not proceed to Tasks 5-6. A mismatch means a Copy-Item step from Plan 2 (`news`: 11, `gallery`: 5), Plan 3 (`people`: 7), Plan 4 (`publications`: 5), or Plan 5 (`projects`: 7) wasn't completed — go back and re-run that plan's image-copy step before continuing here.

---

## Task 5: Retire `BODY/`

**Files:**
- Delete: `BODY/about-body.html`
- Delete: `BODY/facility-body.html`
- Delete: `BODY/fun-body.html`
- Delete: `BODY/head-body.html`
- Delete: `BODY/news-body.html`
- Delete: `BODY/prj1-body.html`
- Delete: `BODY/prj2-body.html`
- Delete: `BODY/prj3-body.html`
- Delete: `BODY/prj4-body.html`
- Delete: `BODY/publications-body.html`
- Delete: `BODY/research-body.html`

Every file's content has already been migrated:

| File | Migrated to |
|---|---|
| `about-body.html` | `data/people.json` (Plan 3) |
| `facility-body.html` | Its `<section class="intro">` was empty — nothing to migrate; `facility/index.html` was rebuilt fresh in Plan 1 |
| `fun-body.html` | `/fun/index.html` (Task 1, this plan) |
| `head-body.html` | The Page Template `<head>` (Plan 1) |
| `news-body.html` | `data/news.json` (Plan 2) |
| `prj1-body.html` … `prj4-body.html` | The four entries in `data/projects.json` (Plan 5) |
| `publications-body.html` | `data/publications.json` (Plan 4) |
| `research-body.html` | `/research/index.html` card grid (Plan 5) |

- [ ] **Step 1: Remove the directory**

```bash
git rm -r BODY
```

- [ ] **Step 2: Commit**

```bash
git commit -m "Remove retired BODY/ templates (content migrated to data/*.json and shared partials)"
```

---

## Task 6: Remove `day-version/` and `night-version/`

**Files:**
- Delete: `day-version/` (entire directory)
- Delete: `night-version/` (entire directory)

This is the final step in flattening the site to a single page tree (spec §4: "Old `/day-version/...` and `/night-version/...` URLs will 404 ... per project decision"). Two files outside these trees referenced them — the root `/index.html` splash (retargeted to `/home/` in Plan 2) and `widget/unit_conversion/index.html` (retrofitted in Task 3 of this plan). `day-version/icons/500px.svg` and `day-version/icons/day_night.png` are not migrated anywhere (see content-mapping decision 5) and are intentionally lost with this deletion.

- [ ] **Step 1: Pre-deletion verification checklist**

With the local server running (`npx --yes serve . -l 5000`), open each of the following in a browser and confirm it loads with **no console errors** and **no requests to `day-version/` or `night-version/`** in the Network tab:

- [ ] `/` — splash page, redirects to `/home/`
- [ ] `/home/`
- [ ] `/about/`
- [ ] `/news/`
- [ ] `/research/`
- [ ] `/research/project.html?id=topological-perovskite-nanowires`
- [ ] `/research/project.html?id=perovskite-nanolasers`
- [ ] `/research/project.html?id=templated-perovskite-optoelectronics`
- [ ] `/research/project.html?id=organic-phosphors`
- [ ] `/publications/`
- [ ] `/hiring/`
- [ ] `/facility/`
- [ ] `/fun/`
- [ ] `/widget/mindmap/index.html`
- [ ] `/widget/unit_conversion/index.html`

- [ ] **Step 2: Confirm no remaining references**

Run from the repo root:

```powershell
Get-ChildItem -Recurse -File -Include *.html,*.js,*.json,*.css |
  Where-Object { $_.FullName -notmatch '\\(day-version|night-version|BODY|docs|Archive|\.git)\\' } |
  Select-String -Pattern 'day-version|night-version' |
  ForEach-Object { $_.Path }
```

Expected output: nothing (no lines printed). If any file is listed, stop and resolve that reference before deleting.

- [ ] **Step 3: Remove the directories**

```bash
git rm -r day-version night-version
```

- [ ] **Step 4: Commit**

```bash
git commit -m "Remove retired day-version/ and night-version/ trees, completing flattened page architecture"
```

---

## Task 7: Final whole-site verification

**Files:** none (verification only)

- [ ] **Step 1: Re-run the pre-deletion checklist pages**

Repeat all 15 checks from Task 6 Step 1 — every page should still load identically now that `day-version/`/`night-version/`/`BODY/` are gone.

- [ ] **Step 2: Confirm "Fun" is reachable but not in the nav**

- [ ] On every page's nav bar, confirm the 7 links are exactly: Home, News, About, Research, Facility, Publications, Hiring — "Fun" is never one of them.
- [ ] Navigating directly to `/fun/` still works and shows the page from Task 1.

- [ ] **Step 3: Confirm dark mode works end-to-end**

- [ ] From `/fun/`, toggle dark mode, then click through to `/widget/mindmap/index.html` and back to `/fun/` via the browser back button — dark mode persists across navigation (via `localStorage`, set by `assets/js/theme.js`).

- [ ] **Step 4: Confirm the working tree is clean**

```bash
git status
```

Expected: `nothing to commit, working tree clean` (assuming all prior plans' commits are also done).

- [ ] **Step 5: Mark the redesign complete**

This is the last task of the last plan (6 of 6) in the modular site redesign (`docs/superpowers/specs/2026-06-11-modular-site-redesign-design.md`). No further commit is needed for this step — it's a checkpoint confirming all six plans have been executed and verified.
