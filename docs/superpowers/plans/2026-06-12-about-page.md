# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/about/index.html` — a data-driven About page with a featured PI card, a "Group Members" grid, and a "Mascots" grid, where every card opens a shared `#person-modal` with that person's full bio (plus, for the PI, "Leave a message" and "Download CV" buttons) — backed by a new `data/people.json` and `assets/js/render-people.js`.

**Architecture:** `data/people.json` holds 7 entries (1 PI + 4 group members + 2 mascots), each with `slug`/`name`/`title`/`photo`/`section`/`bio`, plus optional `blurb` (PI only), `email`, and `cv` (PI only). `assets/js/render-people.js` fetches this file once and renders three sections: the PI into `#about-pi` as a larger "featured" card, group members into `#people-members` as a grid, and mascots into `#people-mascots` as a grid (same card component, `.person-card--featured` modifier for the PI). Every card is a `<button data-slug="...">`; clicking it populates and opens `#person-modal` — a new modal that reuses Plan 1's `.modal-overlay`/`.modal-content`/`.close-modal` styling. Inside the PI's modal, "Leave a message" closes `#person-modal` and opens the site-wide `#message-modal` (looked up lazily at click time, since `partials.js` injects the footer/modal asynchronously).

**Tech Stack:** Static HTML/CSS/vanilla ES5 JS, no build step. Follows the same IIFE + `fetch().then().catch()` pattern as `assets/js/render-news.js` / `assets/js/render-gallery.js` from Plan 2.

---

## Plan Series Note (Plan 3 of 6)

This plan builds on **Plan 1** (`docs/superpowers/plans/2026-06-12-foundation-theming-and-navigation.md`), which must be implemented first. It uses, without modification:
- CSS tokens/typography/layout/buttons defined in `assets/css/style.css` (`--space-*`, `.text-muted`, `.text-label`, `.btn`, `.btn-primary`, `.link-arrow`, `h1`/`h2`/`h3`).
- The "Page Template" `<head>`/`<body>` structure (copied verbatim into `about/index.html` below).
- `assets/js/theme.js` and `assets/js/partials.js` (loaded by every page, unchanged).
- `.modal-overlay` / `.modal-content` / `.close-modal` and the form-input styles — `#person-modal` (new, this plan) reuses these classes exactly like `#message-modal` does.
- `assets/partials/footer.html`'s `#message-modal` and `partials.js`'s `loadFooter()`, which wires `#open-message-modal` / `#close-message-modal` / `#message-modal` after injecting the footer.

**Cross-plan note:** Plan 2's `data/news.json` contains a `featured: "large"` entry ("New Postdoc") whose `link` is `/about/`. That link 404s until this plan creates `about/index.html` — no action is needed here beyond building the page at this path; Task 4's verification confirms the link now resolves.

---

## File Structure

```
data/
  people.json                (new — 7 entries: PI + 4 group members + 2 mascots)
assets/
  css/style.css               (modified — append "About: Person Cards" and "About: Person Modal" sections)
  js/
    render-people.js           (new)
  img/
    people/                     (new — 7 images copied from day-version/about/)
  files/
    CV_Wenhao_Shao.pdf          (new — copied/renamed from Archive/)
about/
  index.html                    (new)
```

---

## Task 1: People data, images, CV, and styles

**Files:**
- Create: `data/people.json`
- Create: `assets/img/people/wenhao-shao.jpg`, `le-wei.jpg`, `chooi-wai-loon.jpg`, `wang-yue.png`, `ichchha-badgujjar.jpg`, `snowball.jpg`, `sidney.png` (copied from `day-version/about/`)
- Create: `assets/files/CV_Wenhao_Shao.pdf` (copied/renamed from `Archive/CV_Wenhao Shao.pdf`)
- Modify: `assets/css/style.css`

- [ ] **Step 1: Create the people data file**

Write `data/people.json`:

```json
[
  {
    "slug": "wenhao-shao",
    "name": "Wenhao Shao",
    "title": "Assistant Professor of Chemistry",
    "photo": "/assets/img/people/wenhao-shao.jpg",
    "section": "pi",
    "blurb": "Molecular design, self-assembly, and photophysics of organic and organic-inorganic hybrid semiconductors.",
    "bio": "<p>Wenhao was born and raised in Shanghai, China. He earned his B.S. in Chemistry from Fudan University in 2017, with a thesis focusing on rare-earth upconversion luminescent nanoparticles under Professors <a href=\"https://chembioins.sjtu.edu.cn/info/1028/1325.htm\" target=\"_blank\"><u>Fuyou Li</u></a> and <a href=\"https://chemistry.fudan.edu.cn/chemen/a3/6b/c22414a238443/page.htm\" target=\"_blank\"><u>Wei Feng</u></a>. He completed his Ph.D. in Chemistry at the University of Michigan, Ann Arbor, in 2022, working with Professor <a href=\"https://mse.engin.umich.edu/people/jinsang\" target=\"_blank\"><u>Jinsang Kim</u></a> on the computation-assisted molecular design, synthesis, and photophysics of organic triplet emitters. He then joined Purdue University as a postdoctoral researcher in Professor <a href=\"https://letiandougroup.com/\" target=\"_blank\"><u>Letian Dou</u></a>’s group, focusing on metal-halide perovskites.</p><p>In 2025, Wenhao began his independent career as an <a href=\"https://www.chem.uga.edu/directory/people/wenhao-shao\" target=\"_blank\"><u>Assistant Professor of Chemistry</u></a> at the <a href=\"https://www.chem.uga.edu/research\" target=\"_blank\"><u>University of Georgia</u></a>. His research interests include molecular design, self-assembly, and photophysics of purely organic semiconductors and organic-inorganic hybrid materials, with an emphasis on their photonic and electronic applications.</p><p><strong>Address</strong><br>3254 iSTEM-2, 302 E Campus Rd, Athens, GA 30602</p>",
    "email": "swh at uga dot edu",
    "cv": "/assets/files/CV_Wenhao_Shao.pdf"
  },
  {
    "slug": "le-wei",
    "name": "Le Wei",
    "title": "Postdoctoral Researcher",
    "photo": "/assets/img/people/le-wei.jpg",
    "section": "member",
    "bio": "<p>Dr. Wei received his Ph.D. in Electrical Engineering from Iowa State University. His research focuses on photonic devices and micro/nanofabrication, with experience in semiconductor processing (e.g., oxidation, etching, photolithography, thin-film deposition) and optical instrumentation. His prior work includes chalcogenide material–based photonic crystal structures and resonant/pyroelectric device platforms for wavelength-selective sensing, as well as related modeling and simulation using tools such as Lumerical FDTD, Synopsys Rsoft, and COMSOL Multiphysics.</p>",
    "email": "weile1209 at uga dot edu"
  },
  {
    "slug": "chooi-wai-loon",
    "name": "Chooi Wai Loon",
    "title": "Ph.D. Student, Physics &amp; Astronomy",
    "photo": "/assets/img/people/chooi-wai-loon.jpg",
    "section": "member",
    "bio": "<p>Wai Loon was born in Kedah but raised mostly in Malacca, Malaysia. He earned his B.S. in Industrial Physics from Universiti Malaysia Sabah in 2022, completing a thesis on simulation-based studies of organic molecules for organic light-emitting diode applications. He is currently a Ph.D. student in the Department of Physics and Astronomy and joined the lab in Fall 2025.</p>",
    "email": "wc92424 at uga dot edu"
  },
  {
    "slug": "wang-yue",
    "name": "Wang Yue",
    "title": "Ph.D. Student, Chemistry",
    "photo": "/assets/img/people/wang-yue.png",
    "section": "member",
    "bio": "<p>Yue earned her Bachelor’s degree from Sichuan Agricultural University. Her research interest focuses on the design and synthesis of novel crystalline materials, as well as their potential applications in biomedical research. Yue is currently a Ph.D. student in the Department of Chemistry and joined the lab in Fall 2025.</p>",
    "email": "Yue.Wang6 at uga dot edu"
  },
  {
    "slug": "ichchha-badgujjar",
    "name": "Ichchha Badgujjar",
    "title": "Ph.D. Student, Chemistry (Rotation)",
    "photo": "/assets/img/people/ichchha-badgujjar.jpg",
    "section": "member",
    "bio": "<p>Ichchha is a second-year Ph.D. student in the Department of Chemistry. She joined the lab in Fall 2025 as a rotating student.</p>",
    "email": "Ichchha.Badgujjar at uga dot edu"
  },
  {
    "slug": "snowball",
    "name": "Snowball",
    "title": "Lab Mascot (Pomeranian)",
    "photo": "/assets/img/people/snowball.jpg",
    "section": "mascot",
    "bio": "<p>Dogtor “Snowball” the Pomeranian was born in February 2024 in West Lafayette, IN.</p>",
    "email": "snowball.pom2024@gmail.com"
  },
  {
    "slug": "sidney",
    "name": "Sidney",
    "title": "Service Dog in Training",
    "photo": "/assets/img/people/sidney.png",
    "section": "mascot",
    "bio": "<p>Hi everyone! I’m Sidney, and I’m a fantastic Service Dog in training! You’ll see me around the office sometimes for a little visit. Don’t worry, when you’re busy or out, I’m the quietest dog—just chilling patiently under the desk. If those long experiments are making you stressed, come over and give me a good pet! It’s my job to help you relax! 🐾</p>"
  }
]
```

This migrates all 7 entries from `BODY/about-body.html`, in the same order (PI, then 4 group members, then 2 mascots). Content notes:
- All original `<a target="_blank"><u>...</u></a>` links in Wenhao's bio are preserved verbatim. `<br><br>`-separated blocks become separate `<p>` tags.
- Wenhao's email ("swh at uga dot edu") moves out of `bio` into the new `email` field (see below); `bio`'s closing paragraph keeps just the mailing address.
- `email` (optional, all 7 entries except Sidney, who had none in the source) and `cv` (PI only) are two fields beyond the spec's literal `people.json` example — added because the spec's prose requires them: "Click → `#person-modal` with full bio **and email**" (members/mascots) and "'Leave a message' and **'Download CV'** buttons" (PI).
- `blurb` is the spec's one-line PI summary, condensed from Wenhao's "research interests" sentence.
- Minor copy-edits during migration: "focuing" → "focusing", "second year" → "second-year", straight quotes/apostrophes normalized to curly (`'` → `’`, `"` → `“`/`”`), and Sidney's `:feet:` placeholder → 🐾.
- `ichchha-badgujjar.jpg` is copied from `about_Default.jpg` (the source has no dedicated photo for Ichchha); `name` is expanded from "Ichchha" to "Ichchha Badgujjar" per the spec's proposed title table (her surname is confirmed by her UGA email).

- [ ] **Step 2: Validate the JSON**

```powershell
(Get-Content data/people.json -Raw | ConvertFrom-Json).Count
```

Expected: `7`

- [ ] **Step 3: Copy people photos**

Run (from repo root, in PowerShell):

```powershell
New-Item -ItemType Directory -Force assets/img/people | Out-Null
Copy-Item "day-version/about/about_Wenhao_Shao.jpg" assets/img/people/wenhao-shao.jpg
Copy-Item "day-version/about/about_Le_Wei.jpg" assets/img/people/le-wei.jpg
Copy-Item "day-version/about/about_Wai_Loon.jpg" assets/img/people/chooi-wai-loon.jpg
Copy-Item "day-version/about/about_Yue_Wang.png" assets/img/people/wang-yue.png
Copy-Item "day-version/about/about_Default.jpg" assets/img/people/ichchha-badgujjar.jpg
Copy-Item "day-version/about/about_Snowball.jpg" assets/img/people/snowball.jpg
Copy-Item "day-version/about/about_Sidney.png" assets/img/people/sidney.png
```

Verify:

```powershell
(Get-ChildItem assets/img/people).Count
```

Expected: `7`

- [ ] **Step 4: Copy and rename the PI's CV**

Run (from repo root, in PowerShell):

```powershell
New-Item -ItemType Directory -Force assets/files | Out-Null
Copy-Item "Archive/CV_Wenhao Shao.pdf" "assets/files/CV_Wenhao_Shao.pdf"
```

Verify:

```powershell
Test-Path assets/files/CV_Wenhao_Shao.pdf
```

Expected: `True`

- [ ] **Step 5: Append person-card and person-modal styles**

Append to the end of `assets/css/style.css`:

```css

/* ==========================================================================
   About: Person Cards
   ========================================================================== */
.section-heading {
  margin-bottom: var(--space-3);
}

.section-heading--spaced {
  margin-top: var(--space-5);
}

.people-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
}

.person-card {
  display: block;
  width: 100%;
  text-align: left;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  padding: 0;
  margin: 0;
  color: inherit;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.person-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.person-card__photo {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
}

.person-card__body {
  padding: var(--space-2);
}

.person-card__title {
  margin-top: 0.25rem;
}

.person-card--featured {
  display: grid;
  grid-template-columns: 220px 1fr;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3);
  margin-bottom: var(--space-5);
}

.person-card--featured .person-card__photo {
  border-radius: 8px;
}

.person-card--featured .person-card__body {
  padding: 0;
}

.person-card--featured .person-card__blurb {
  margin-top: var(--space-2);
}

@media (max-width: 760px) {
  .people-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .person-card--featured {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .person-card--featured .person-card__photo {
    max-width: 220px;
    margin: 0 auto;
  }
}

/* ==========================================================================
   About: Person Modal
   ========================================================================== */
.person-modal__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.person-modal__photo {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.person-modal__bio p {
  margin-top: var(--space-2);
}

.person-modal__bio p:first-child {
  margin-top: 0;
}

.person-modal__email {
  margin-top: var(--space-2);
}

.person-modal__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
}
```

`.section-heading` / `.section-heading--spaced` are small composable utilities used on the page's `<h1>`/`<h2>` headings (Task 3) to get consistent spacing without redefining `h1`/`h2` margins globally: `.section-heading--spaced`'s `margin-top: var(--space-5)` collapses with `.person-card--featured`'s `margin-bottom: var(--space-5)` above "Group Members", so the gap stays 4rem instead of stacking to 8rem.

- [ ] **Step 6: Commit**

```bash
git add data/people.json assets/img/people/ assets/files/CV_Wenhao_Shao.pdf assets/css/style.css
git commit -m "Add people data, photos, CV, and person-card/modal styles"
```

---

## Task 2: People render script

**Files:**
- Create: `assets/js/render-people.js`

- [ ] **Step 1: Create the render script**

Write `assets/js/render-people.js`:

```javascript
(function () {
  function personCardHTML(person, featured) {
    var cardClass = featured ? 'person-card person-card--featured' : 'person-card';
    var blurb = (featured && person.blurb)
      ? '<p class="person-card__blurb text-muted">' + person.blurb + '</p>'
      : '';

    return '' +
      '<button type="button" class="' + cardClass + '" data-slug="' + person.slug + '">' +
        '<img class="person-card__photo" src="' + person.photo + '" alt="' + person.name + '">' +
        '<div class="person-card__body">' +
          '<h3>' + person.name + '</h3>' +
          '<p class="person-card__title text-muted">' + person.title + '</p>' +
          blurb +
        '</div>' +
      '</button>';
  }

  function personModalHTML(person) {
    var email = person.email
      ? '<p class="person-modal__email"><strong>Email:</strong> ' + person.email + '</p>'
      : '';

    var actions = '';
    if (person.section === 'pi') {
      var cvBtn = person.cv
        ? '<a class="btn" href="' + person.cv + '" download>Download CV</a>'
        : '';
      actions = '' +
        '<div class="person-modal__actions">' +
          '<button type="button" class="btn btn-primary" id="person-modal-message">Leave a message</button>' +
          cvBtn +
        '</div>';
    }

    return '' +
      '<div class="person-modal__header">' +
        '<img class="person-modal__photo" src="' + person.photo + '" alt="' + person.name + '">' +
        '<div>' +
          '<h2>' + person.name + '</h2>' +
          '<p class="text-muted">' + person.title + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="person-modal__bio">' + person.bio + '</div>' +
      email +
      actions;
  }

  function openModal(person) {
    var modal = document.getElementById('person-modal');
    var body = document.getElementById('person-modal-body');
    if (!modal || !body) return;

    body.innerHTML = personModalHTML(person);
    modal.style.display = 'flex';

    var msgBtn = document.getElementById('person-modal-message');
    if (msgBtn) {
      msgBtn.addEventListener('click', function () {
        modal.style.display = 'none';
        var messageModal = document.getElementById('message-modal');
        if (messageModal) messageModal.style.display = 'flex';
      });
    }
  }

  function wireCards(mount, people) {
    var cards = mount.querySelectorAll('[data-slug]');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var slug = card.getAttribute('data-slug');
        var person = people.filter(function (p) { return p.slug === slug; })[0];
        if (person) openModal(person);
      });
    });
  }

  var pi = document.getElementById('about-pi');
  var members = document.getElementById('people-members');
  var mascots = document.getElementById('people-mascots');
  var modal = document.getElementById('person-modal');
  var closeBtn = document.getElementById('close-person-modal');

  if (!pi && !members && !mascots) return;

  if (modal && closeBtn) {
    closeBtn.addEventListener('click', function () {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  fetch('/data/people.json')
    .then(function (res) { return res.json(); })
    .then(function (people) {
      var pis = people.filter(function (p) { return p.section === 'pi'; });
      var memberList = people.filter(function (p) { return p.section === 'member'; });
      var mascotList = people.filter(function (p) { return p.section === 'mascot'; });

      if (pi && pis.length > 0) {
        pi.innerHTML = personCardHTML(pis[0], true);
        wireCards(pi, people);
      }
      if (members) {
        members.innerHTML = memberList.map(function (p) { return personCardHTML(p, false); }).join('');
        wireCards(members, people);
      }
      if (mascots) {
        mascots.innerHTML = mascotList.map(function (p) { return personCardHTML(p, false); }).join('');
        wireCards(mascots, people);
      }
    })
    .catch(function (err) {
      console.error('Failed to load people:', err);
    });
})();
```

- [ ] **Step 2: Syntax-check the script**

```powershell
node --check assets/js/render-people.js
```

Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add assets/js/render-people.js
git commit -m "Add render-people.js for About page cards and bio modal"
```

---

## Task 3: About page

**Files:**
- Create: `about/index.html`

- [ ] **Step 1: Create the About page**

Write `about/index.html`:

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

  <meta name="description" content="About — W. Shao Laboratory. Meet our principal investigator, group members, and lab mascots.">
  <meta name="robots" content="index,follow">
  <title>About — W. Shao Laboratory</title>
</head>
<body>
  <div id="site-nav"></div>

  <main>
    <section class="container">
      <h1 class="section-heading">About</h1>
      <div id="about-pi"></div>

      <h2 class="section-heading section-heading--spaced">Group Members</h2>
      <div id="people-members" class="people-grid"></div>

      <h2 class="section-heading section-heading--spaced">Mascots</h2>
      <div id="people-mascots" class="people-grid"></div>
    </section>
  </main>

  <div id="person-modal" class="modal-overlay" style="display:none;">
    <div class="modal-content">
      <button type="button" class="close-modal" id="close-person-modal" aria-label="Close">&times;</button>
      <div id="person-modal-body"></div>
    </div>
  </div>

  <div id="site-footer"></div>

  <script src="/assets/js/render-people.js" defer></script>
  <script src="/assets/js/partials.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add about/index.html
git commit -m "Add About page with PI, group members, and mascots"
```

---

## Task 4: Manual verification

- [ ] **Step 1: Start a local static server**

Run (from repo root, leave running in its own terminal):

```powershell
npx --yes serve . -l 5000
```

Expected: output ending with something like `Accepting connections at http://localhost:5000`.

- [ ] **Step 2: Manual verification — About page**

Open `http://localhost:5000/about/` and check:

- [ ] **PI card**: Wenhao Shao's photo, name, title ("Assistant Professor of Chemistry"), and the one-line `blurb` all render in a single large card above "Group Members" — visibly larger/wider than the member cards below it.
- [ ] Click the PI card: `#person-modal` opens showing Wenhao's photo, name, title, full two-paragraph bio (with the Fuyou Li / Wei Feng / Jinsang Kim / Letian Dou links each opening in a new tab), the address paragraph, "Email: swh at uga dot edu", and two buttons — "Leave a message" and "Download CV".
- [ ] Click "Download CV": `assets/files/CV_Wenhao_Shao.pdf` downloads/opens.
- [ ] Click "Leave a message" (inside the person modal): `#person-modal` closes and `#message-modal` (the same "Leave a message" form used site-wide) opens in its place.
- [ ] Close `#message-modal`, then click outside `#person-modal` (on the dark overlay) for one of the member cards — confirm clicking the overlay closes the modal, and the `&times;` button also closes it.
- [ ] **Group Members**: a 4-column grid below "Group Members" shows Le Wei, Chooi Wai Loon, Wang Yue, and Ichchha Badgujjar (photo + name + title only on the card). Click each — `#person-modal` shows that person's full bio and "Email: ...".
- [ ] **Mascots**: a grid below "Mascots" shows Snowball and Sidney. Click Snowball — modal shows its bio and "Email: snowball.pom2024@gmail.com". Click Sidney — modal shows its bio (ending with 🐾) and **no** "Email:" line (Sidney has no `email` field).
- [ ] Toggle dark mode (moon/sun icon in nav): PI card, member/mascot cards, and `#person-modal` all remain readable — text stays legible and card borders remain visible against the dark background.
- [ ] Resize to a narrow viewport (<760px): the "Group Members" and "Mascots" grids both collapse to 2 columns, and the PI card stacks into a single column (photo centered above the name/title/blurb).
- [ ] In the browser console, confirm there are **no errors** on page load or on any of the interactions above.

- [ ] **Step 3: Manual verification — cross-plan link from home page**

On `http://localhost:5000/home/`, in the "Latest News" featured carousel, find the "New Postdoc" story and click its "Read more →" link.

- [ ] It navigates to `http://localhost:5000/about/` (no longer a 404, now that this plan exists) and the page loads correctly.
