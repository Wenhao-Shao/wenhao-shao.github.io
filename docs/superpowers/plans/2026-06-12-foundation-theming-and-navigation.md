# Foundation: Theming, Typography & Shared Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the new visual identity (Manrope typography, Navy & White CSS-variable theming with a light/dark toggle) and a shared nav/footer partial system, proven end-to-end on a real page (`/facility/`).

**Architecture:** `assets/css/style.css` defines design tokens (`:root` / `[data-theme="dark"]`) plus the typography, nav, footer, modal, and button components every future page uses. `assets/js/theme.js` is loaded synchronously in `<head>` — it applies `data-theme` before first paint and exposes `window.toggleTheme()`. `assets/js/partials.js` (deferred) fetches `assets/partials/nav.html` + `data/nav.json` and `assets/partials/footer.html`, injects them into `<div id="site-nav">` / `<div id="site-footer">` placeholders, marks the active nav link, and wires the theme toggle, mobile-nav toggle, and `#message-modal` open/close. `facility/index.html` is the first page built on this new template — it's the smallest existing page, currently empty, so it's the cheapest place to prove the foundation works.

**Tech Stack:** Static HTML/CSS/vanilla ES5 JS, no build step, Google Fonts (Manrope), Formspree (existing form endpoint `mnnvojry`), served from the repo root by GitHub Pages (`wenhao-shao.github.io` is a user-site repo, so root-relative URLs like `/assets/...` resolve correctly both in production and via a local static server).

---

## Plan Series & Architecture Note

This is **Plan 1 of 6** implementing `docs/superpowers/specs/2026-06-11-modular-site-redesign-design.md`. Later plans (Home; About; Publications; Research + Hiring; Fun refresh + cleanup) all build pages using the **Page Template** defined at the end of this plan (see "Page Template Reference for Future Plans") and append new component CSS to `assets/css/style.css` / new `render-*.js` scripts alongside `partials.js`.

**One deviation from the spec's literal file tree, with rationale:** the spec lists `assets/partials/head.html` as a fetched partial alongside `nav.html`/`footer.html`. In practice, content injected via `element.outerHTML = html` does **not** execute `<script>` tags, and a `<head>` partial fetched asynchronously would cause a flash of unstyled/wrong-theme content before `style.css` and `theme.js` load. So:
- `assets/partials/nav.html` and `assets/partials/footer.html` **are** fetched partials (the real DRY win — they're large and repeated on every page).
- There is **no** `assets/partials/head.html`. Each page's `<head>` instead directly contains a small (~15-line), near-identical block: meta tags, the Manrope font link, the `style.css` link, the favicon, the GA snippet, and a synchronous `<script src="/assets/js/theme.js">`. This is documented verbatim below as the "Page Template" so every future page starts from the same block.

All file paths below are repo-root-relative (e.g. `assets/css/style.css`). The same path with a leading `/` is the URL/fetch path used inside HTML/JS (e.g. `/assets/css/style.css`).

---

## File Structure

```
assets/
  css/style.css        (new — design tokens, typography, nav/footer/modal/button components)
  js/theme.js           (new — sync theme detection + toggleTheme())
  js/partials.js        (new — fetches+wires nav.html, nav.json, footer.html)
  partials/
    nav.html            (new — nav markup, links populated from data/nav.json)
    footer.html         (new — footer + #message-modal markup)
  icons/
    linkedin.svg        (copied from day-version/icons/linkedin.svg)
    twitter.svg         (copied from day-version/icons/twitter.svg)
    UGA.svg             (copied from day-version/icons/UGA.svg)
    SWH_logo.png        (copied from day-version/icons/SWH_logo.png)
data/
  nav.json              (new — 7 nav links)
facility/
  index.html            (new — first page on the new template)
```

---

## Task 1: Design tokens, typography & component styles

**Files:**
- Create: `assets/css/style.css`
- Create: `assets/icons/linkedin.svg` (copy of `day-version/icons/linkedin.svg`)
- Create: `assets/icons/twitter.svg` (copy of `day-version/icons/twitter.svg`)
- Create: `assets/icons/UGA.svg` (copy of `day-version/icons/UGA.svg`)
- Create: `assets/icons/SWH_logo.png` (copy of `day-version/icons/SWH_logo.png`)

- [ ] **Step 1: Create the stylesheet**

Write `assets/css/style.css`:

```css
/* ==========================================================================
   W. Shao Laboratory — Global Stylesheet
   Design tokens live as CSS custom properties on :root and are overridden
   by [data-theme="dark"]. assets/js/theme.js sets data-theme on <html>.
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Reset                                                                    */
/* ---------------------------------------------------------------------- */
*, *::before, *::after {
  box-sizing: border-box;
}

html, body, h1, h2, h3, h4, p, ul, ol, figure {
  margin: 0;
}

ul, ol {
  padding: 0;
  list-style: none;
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font: inherit;
  cursor: pointer;
}

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* ---------------------------------------------------------------------- */
/* Design tokens                                                           */
/* ---------------------------------------------------------------------- */
:root {
  --color-bg: #ffffff;
  --color-surface: #f7f8fa;
  --color-text: #1a1f2b;
  --color-text-muted: #6a7078;
  --color-accent: #1f3a5f;
  --color-border: #e3e6ea;

  --font-sans: 'Manrope', ui-sans-serif, system-ui, sans-serif;

  --container-width: 1100px;
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;
  --space-5: 4rem;
}

[data-theme="dark"] {
  --color-bg: #14181f;
  --color-surface: #1c222c;
  --color-text: #e8eaed;
  --color-text-muted: #9aa0a6;
  --color-accent: #5b8def;
  --color-border: #2a3038;
}

/* ---------------------------------------------------------------------- */
/* Base                                                                     */
/* ---------------------------------------------------------------------- */
html {
  font-size: 100%;
}

body {
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background 0.2s ease, color 0.2s ease;
}

/* ---------------------------------------------------------------------- */
/* Typography scale                                                        */
/* ---------------------------------------------------------------------- */
h1 {
  font-size: 2.25rem; /* 36px */
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

h2 {
  font-size: 1.5rem; /* 24px */
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.01em;
  text-wrap: balance;
}

h3 {
  font-size: 1.125rem; /* 18px */
  font-weight: 700;
  line-height: 1.3;
}

.text-display {
  font-size: clamp(2rem, 1.5rem + 2.5vw, 3rem); /* 32-48px */
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.text-lead {
  font-size: 1.25rem; /* 20px */
  font-weight: 500;
  line-height: 1.4;
}

.text-muted {
  color: var(--color-text-muted);
}

.text-label {
  font-size: 0.8125rem; /* 13px */
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

p {
  max-width: 65ch;
  text-wrap: pretty;
}

/* ---------------------------------------------------------------------- */
/* Layout                                                                   */
/* ---------------------------------------------------------------------- */
.container {
  width: 100%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--space-3);
}

main section {
  padding: var(--space-5) 0;
}

/* ---------------------------------------------------------------------- */
/* Buttons & links                                                          */
/* ---------------------------------------------------------------------- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.6em 1.4em;
  border: 1px solid var(--color-accent);
  border-radius: 999px;
  background: transparent;
  color: var(--color-accent);
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.15s ease, color 0.15s ease;
}

.btn:hover {
  background: var(--color-accent);
  color: var(--color-bg);
}

.btn-primary {
  background: var(--color-accent);
  color: var(--color-bg);
}

.btn-primary:hover {
  opacity: 0.85;
  background: var(--color-accent);
  color: var(--color-bg);
}

.link-arrow {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-accent);
  white-space: nowrap;
  border: none;
  background: none;
  padding: 0;
}

/* ==========================================================================
   Navigation
   ========================================================================== */
.site-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.site-nav .container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  min-height: 72px;
  flex-wrap: wrap;
}

.site-nav__brand {
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.site-nav__links {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  list-style: none;
  margin: 0 auto;
  padding: 0;
}

.site-nav__links a {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  padding: 0.5em 0;
  border-bottom: 2px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.site-nav__links a:hover,
.site-nav__links a.active {
  color: var(--color-text);
  border-bottom-color: var(--color-accent);
}

.theme-toggle {
  border: none;
  background: none;
  padding: 0.4em;
  display: inline-flex;
  border-radius: 50%;
  color: var(--color-text);
}

.theme-toggle:hover {
  background: var(--color-surface);
}

.theme-toggle svg {
  width: 20px;
  height: 20px;
}

.theme-toggle .icon-sun { display: none; }
.theme-toggle .icon-moon { display: block; }
[data-theme="dark"] .theme-toggle .icon-sun { display: block; }
[data-theme="dark"] .theme-toggle .icon-moon { display: none; }

.nav-toggle {
  display: none;
  border: none;
  background: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--color-text);
  padding: 0.25em 0.5em;
}

@media (max-width: 860px) {
  .nav-toggle {
    display: inline-flex;
    order: 2;
  }

  .theme-toggle {
    order: 3;
  }

  .site-nav__links {
    order: 4;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    padding: var(--space-2) var(--space-3) var(--space-3);
    margin: 0;
    display: none;
  }

  .site-nav__links.open {
    display: flex;
  }
}

/* ==========================================================================
   Footer
   ========================================================================== */
.site-footer {
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-5);
}

.site-footer .container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding-top: var(--space-3);
  padding-bottom: var(--space-3);
}

.site-footer__credit {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.site-footer__credit a {
  color: var(--color-text-muted);
  text-decoration: underline;
}

.site-footer__links {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.site-footer__icons {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.site-footer__icons img {
  width: 22px;
  height: 22px;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.site-footer__icons img:hover {
  opacity: 1;
}

/* ==========================================================================
   Modal (Leave a message, person bio, etc.)
   ========================================================================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 24, 33, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: var(--space-2);
}

.modal-content {
  background: var(--color-bg);
  color: var(--color-text);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  min-width: 320px;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
}

.close-modal {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  font-size: 1.75rem;
  line-height: 1;
  color: var(--color-text-muted);
  cursor: pointer;
  font-weight: bold;
  background: none;
  border: none;
  padding: 0;
}

.close-modal:hover {
  color: var(--color-text);
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.6em 0.8em;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: 1rem;
}

.modal-content label {
  font-size: 0.8125rem;
  font-weight: 600;
  display: block;
  margin-bottom: 0.25rem;
}

.modal-content button[type="submit"] {
  background: var(--color-accent);
  color: var(--color-bg);
  border: none;
  padding: 0.7em 2em;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
}

.modal-content button[type="submit"]:hover {
  opacity: 0.85;
}

/* ==========================================================================
   Responsive base
   ========================================================================== */
@media (max-width: 600px) {
  :root {
    --space-5: 2.5rem;
  }
}
```

- [ ] **Step 2: Copy icon assets**

Run (from repo root, in PowerShell):

```powershell
New-Item -ItemType Directory -Force assets/icons | Out-Null
Copy-Item day-version/icons/linkedin.svg assets/icons/linkedin.svg
Copy-Item day-version/icons/twitter.svg assets/icons/twitter.svg
Copy-Item day-version/icons/UGA.svg assets/icons/UGA.svg
Copy-Item day-version/icons/SWH_logo.png assets/icons/SWH_logo.png
```

Expected: no output (Copy-Item is silent on success). Verify with:

```powershell
Get-ChildItem assets/icons
```

Expected: lists `SWH_logo.png`, `UGA.svg`, `linkedin.svg`, `twitter.svg`.

- [ ] **Step 3: Commit**

```bash
git add assets/css/style.css assets/icons/
git commit -m "Add design tokens, typography, and component styles for redesign"
```

---

## Task 2: Theme & partials scripts

**Files:**
- Create: `assets/js/theme.js`
- Create: `assets/js/partials.js`

- [ ] **Step 1: Create the theme script**

Write `assets/js/theme.js`:

```javascript
(function () {
  var STORAGE_KEY = 'theme';

  var stored = localStorage.getItem(STORAGE_KEY);
  var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  window.toggleTheme = function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  };
})();
```

- [ ] **Step 2: Create the partials script**

Write `assets/js/partials.js`:

```javascript
(function () {
  function setActiveLink(link) {
    var href = link.getAttribute('href');
    var path = window.location.pathname;
    if (path === href || (href !== '/' && path.indexOf(href) === 0)) {
      link.classList.add('active');
    }
  }

  function loadNav() {
    var mount = document.getElementById('site-nav');
    if (!mount) return;

    fetch('/assets/partials/nav.html')
      .then(function (res) { return res.text(); })
      .then(function (html) {
        mount.outerHTML = html;
        return fetch('/data/nav.json');
      })
      .then(function (res) { return res.json(); })
      .then(function (links) {
        var list = document.getElementById('site-nav-links');
        if (!list) return;

        links.forEach(function (item) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = item.href;
          a.textContent = item.label;
          setActiveLink(a);
          li.appendChild(a);
          list.appendChild(li);
        });

        var themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
          themeToggle.addEventListener('click', window.toggleTheme);
        }

        var navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
          navToggle.addEventListener('click', function () {
            list.classList.toggle('open');
          });
        }
      })
      .catch(function (err) {
        console.error('Failed to load navigation:', err);
      });
  }

  function loadFooter() {
    var mount = document.getElementById('site-footer');
    if (!mount) return;

    fetch('/assets/partials/footer.html')
      .then(function (res) { return res.text(); })
      .then(function (html) {
        mount.outerHTML = html;

        var openBtn = document.getElementById('open-message-modal');
        var closeBtn = document.getElementById('close-message-modal');
        var modal = document.getElementById('message-modal');
        if (!openBtn || !closeBtn || !modal) return;

        openBtn.addEventListener('click', function (e) {
          e.preventDefault();
          modal.style.display = 'flex';
        });
        closeBtn.addEventListener('click', function () {
          modal.style.display = 'none';
        });
        modal.addEventListener('click', function (e) {
          if (e.target === modal) modal.style.display = 'none';
        });
      })
      .catch(function (err) {
        console.error('Failed to load footer:', err);
      });
  }

  loadNav();
  loadFooter();
})();
```

- [ ] **Step 3: Commit**

```bash
git add assets/js/theme.js assets/js/partials.js
git commit -m "Add theme toggle and shared nav/footer partial loader"
```

---

## Task 3: Nav config and nav/footer partials

**Files:**
- Create: `data/nav.json`
- Create: `assets/partials/nav.html`
- Create: `assets/partials/footer.html`

- [ ] **Step 1: Create the nav config**

Write `data/nav.json`:

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

- [ ] **Step 2: Create the nav partial**

Write `assets/partials/nav.html`:

```html
<nav class="site-nav">
  <div class="container">
    <a href="/home/" class="site-nav__brand">Shao Lab</a>
    <button class="nav-toggle" id="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false">&#9776;</button>
    <ul class="site-nav__links" id="site-nav-links"></ul>
    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle dark mode">
      <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
      </svg>
      <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
  </div>
</nav>
```

- [ ] **Step 3: Create the footer partial**

Write `assets/partials/footer.html`:

```html
<footer class="site-footer">
  <div class="container">
    <p class="site-footer__credit">
      &copy; 2026 W. Shao Laboratory, Department of Chemistry, University of Georgia.<br>
      Website by <a href="https://www.linkedin.com/in/cali-li/" target="_blank" rel="noopener">Cali Li</a>.
    </p>
    <div class="site-footer__links">
      <button type="button" class="link-arrow" id="open-message-modal">Leave a message &rarr;</button>
    </div>
    <div class="site-footer__icons">
      <a href="https://www.linkedin.com/in/wenhao-shao/" target="_blank" rel="noopener" aria-label="LinkedIn">
        <img src="/assets/icons/linkedin.svg" alt="LinkedIn">
      </a>
      <a href="https://twitter.com/whshao" target="_blank" rel="noopener" aria-label="Twitter/X">
        <img src="/assets/icons/twitter.svg" alt="Twitter/X">
      </a>
      <a href="https://www.chem.uga.edu/directory/people/wenhao-shao" target="_blank" rel="noopener" aria-label="UGA Chemistry profile">
        <img src="/assets/icons/UGA.svg" alt="UGA Chemistry profile">
      </a>
    </div>
  </div>
</footer>

<div id="message-modal" class="modal-overlay" style="display:none;">
  <div class="modal-content">
    <button type="button" class="close-modal" id="close-message-modal" aria-label="Close">&times;</button>
    <h2>Leave a message</h2>
    <p class="text-muted">Have a question or want to get in touch? Send a note and we'll get back to you.</p>
    <form action="https://formspree.io/f/mnnvojry" method="POST">
      <label for="msg-name">Name</label>
      <input type="text" id="msg-name" name="name" required>
      <label for="msg-email">Email</label>
      <input type="email" id="msg-email" name="email" required>
      <label for="msg-comment">Message</label>
      <textarea id="msg-comment" name="comment" rows="4" required></textarea>
      <button type="submit">Send</button>
    </form>
  </div>
</div>
```

- [ ] **Step 4: Validate the JSON**

Run:

```powershell
Get-Content data/nav.json -Raw | ConvertFrom-Json | ForEach-Object { $_.label }
```

Expected output:

```
Home
News
About
Research
Facility
Publications
Hiring
```

- [ ] **Step 5: Commit**

```bash
git add data/nav.json assets/partials/
git commit -m "Add nav config and shared nav/footer partials"
```

---

## Task 4: Facility page — first page on the new template

**Files:**
- Create: `facility/index.html`

- [ ] **Step 1: Create the Facility page**

Write `facility/index.html`:

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

  <meta name="description" content="Facility — W. Shao Laboratory">
  <meta name="robots" content="index,follow">
  <title>Facility — W. Shao Laboratory</title>
</head>
<body>
  <div id="site-nav"></div>

  <main>
    <section class="container">
      <h1>Facility</h1>
      <p class="text-lead">Details about our laboratory spaces and instrumentation are coming soon.</p>
    </section>
  </main>

  <div id="site-footer"></div>

  <script src="/assets/js/partials.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Start a local static server**

Run (from repo root, leave running in its own terminal):

```powershell
npx --yes serve . -l 5000
```

Expected: output ending with something like `Accepting connections at http://localhost:5000`.

- [ ] **Step 3: Manual verification in browser**

Open `http://localhost:5000/facility/` and check:

- [ ] Page renders in **Manrope** (check via browser dev tools — computed `font-family` on `<body>` starts with `Manrope`).
- [ ] Background is white, text near-black, "Facility" heading is bold/large (`h1`, 36px, weight 800) — matches the light tokens in `:root`.
- [ ] Nav bar shows brand "Shao Lab" on the left, then **Home / News / About / Research / Facility / Publications / Hiring**, then a moon icon on the right. **Facility** is the only link with an underline/highlight (`.active` styling).
- [ ] Click the moon icon: background turns dark navy (`#14181f`), text becomes light, icon switches to a sun. Reload the page — dark theme persists (read from `localStorage`).
- [ ] Click the sun icon to switch back to light; reload — light persists.
- [ ] Scroll to the footer: copyright line, "Leave a message →" link, and three social icons (LinkedIn, Twitter/X, UGA) are visible.
- [ ] Click "Leave a message →": a centered modal opens with Name / Email / Message fields and a Send button. Click the `×` (or click outside the modal) to close it.
- [ ] Resize the browser to <860px wide: the link list disappears and a `☰` button appears next to the theme toggle; clicking `☰` reveals the links stacked vertically.
- [ ] In the browser console, confirm there are **no errors** (a 404 for `/home/`, `/news/`, etc. when *clicking* those nav links is expected at this stage — those pages don't exist until later plans — but page **load** itself should be error-free).

- [ ] **Step 4: Commit**

```bash
git add facility/index.html
git commit -m "Add Facility page on the new shared theme/nav/footer template"
```

---

## Page Template Reference for Future Plans

Every new page created in Plans 2-6 starts from this exact structure. Copy the `<head>` block verbatim (only `<meta name="description">` and `<title>` change per page), and keep the `#site-nav` / `#site-footer` mount points plus the two `<script>` tags at the end of `<body>`:

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

  <meta name="description" content="PAGE DESCRIPTION — W. Shao Laboratory">
  <meta name="robots" content="index,follow">
  <title>PAGE TITLE — W. Shao Laboratory</title>

  <!-- page-specific <link rel="stylesheet"> for additional component CSS, if any, goes here -->
</head>
<body>
  <div id="site-nav"></div>

  <main>
    <!-- page content: one or more <section class="container"> blocks -->
  </main>

  <div id="site-footer"></div>

  <!-- page-specific render-*.js scripts go here, before partials.js -->
  <script src="/assets/js/partials.js" defer></script>
</body>
</html>
```

Notes for whoever writes Plans 2-6:
- `main section { padding: var(--space-5) 0; }` is already defined — wrap each page section in `<section class="container">...</section>` to get consistent vertical rhythm and the 1100px max-width.
- New component CSS (news cards, gallery mosaic, people cards, publication cards, project layout) is **appended** to `assets/css/style.css` under its own `==== Section Name ====` comment block — one stylesheet, per spec §1.
- New `render-*.js` scripts follow the same pattern as `partials.js`: an IIFE that fetches a JSON file from `/data/`, builds DOM nodes, and fails gracefully (try/catch around fetch/parse, `console.error` + leave the section empty) per spec's "Error handling & testing".
- The active-link logic in `partials.js` (`path.indexOf(href) === 0`) already makes `/research/project.html` highlight the "Research" nav item, since `/research/project.html`.indexOf(`/research/`) === 0.
