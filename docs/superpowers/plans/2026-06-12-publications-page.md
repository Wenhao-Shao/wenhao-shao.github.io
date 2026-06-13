# Publications Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded `BODY/publications-body.html` list with a data-driven `/publications/index.html` that reads `data/publications.json`, renders a "Featured Publications" highlight section (1 main + 4 secondary) above a reversed-numbered publication list with a data-derived year filter.

**Architecture:** A single `data/publications.json` array (24 entries, newest first) drives everything via `assets/js/render-publications.js`. Each entry carries `title`/`authors`/`journal`/`year`/`citation` (always) plus optional `link`/`featured`/`highlightImage`/`highlightDescription`/`newsHighlight`. `citation` is a self-contained HTML blob holding the journal name (wrapped in `.pub-journal`), year, volume/pages — or "Under Review." text — so the list renderer doesn't need conditional formatting logic for that part. The year-filter `<select>` options and the `reversed start="24"` numbering are both derived from the array at render time.

**Tech Stack:** Static HTML/CSS/vanilla JS (ES5-compatible, IIFE + `fetch`), same conventions as Plans 1-3. No build step.

---

## Plan Series Note (Plan 4 of 6)

This plan depends on **Plan 1** (Foundation) for:
- `assets/css/style.css` base (CSS variables, typography, `.container`, `main section` padding, `.btn`/`.btn-primary`, `.text-muted`/`.text-label`)
- `assets/partials/{nav,footer}.html` + `assets/js/partials.js` (site nav/footer injection)
- `assets/js/theme.js` (dark-mode toggle)
- The "Page Template Reference" head/body skeleton (GA snippet, Manrope font links, `#site-nav`/`#site-footer` mounts)

It also reuses the `.section-heading` / `.section-heading--spaced` utility classes (margin-only, generic heading-spacing helpers introduced in **Plan 3**'s CSS additions) — so Plan 3 must run before this plan. Otherwise it does not depend on Plans 2 or 3, and nothing in Plans 5-6 depends on it for cross-page links — `/publications/` is a leaf page in the link graph (other pages link *to* it, it links *out* to external DOIs and `/news/`).

**Cross-plan note**: Plan 2's `data/news.json` was checked for `/publications/#...` anchors — none exist, so `newsLink` is omitted from all 24 entries in this migration (consistent with "optional, omitted when not applicable" per spec §3.3).

**Image sourcing**: Plan 2 already copied 5 of the 8 `/TOC/*.jpg` images into `assets/img/gallery/` (`Map_purple-gold.jpg`, `twist_1.jpg`, `helical_1.jpg`, `bear.jpg`, `chocolate.jpg`). This plan copies from `/TOC/` again into a separate `assets/img/publications/` directory — copying (not moving) is safe and intentional: the same source figure can illustrate both a home-page gallery tile and a publications highlight card, which are different pages with different purposes. This plan uses `lasing_1.jpg`, `helical_2.jpg`, and `earth.jpg` (previously unclaimed) plus re-copies `Map_purple-gold.jpg` and `bear.jpg` (already used by Plan 2, copied independently into `assets/img/publications/`).

---

## File Structure

```
data/
  publications.json        (new — 24 entries, migrated from BODY/publications-body.html)
assets/
  css/style.css             (modified — append publication-list + featured-publications styles)
  js/
    render-publications.js  (new)
  img/
    publications/           (new — 5 images copied from /TOC/)
      lasing_1.jpg
      Map_purple-gold.jpg
      helical_2.jpg
      earth.jpg
      bear.jpg
publications/
  index.html                (new)
```

---

## Task 1: Publications data file

**Files:**
- Create: `data/publications.json`
- Create: `assets/img/publications/lasing_1.jpg`, `Map_purple-gold.jpg`, `helical_2.jpg`, `earth.jpg`, `bear.jpg` (copied from `/TOC/`)
- Modify: `assets/css/style.css`

- [ ] **Step 1: Create the publications data file**

Write `data/publications.json`:

```json
[
  {
    "title": "Geometric Frustration in Morphologically Chiral Nanoribbons of Layered Perovskites",
    "authors": "Shao, W.*; Nian, Z.; Lu, Y.; Yang, H.; Yu, Y.; Savoie, B. M.; Dou, L.*",
    "year": 2026,
    "citation": "Under Review."
  },
  {
    "title": "Air-stable Room-temperature Quasi-2D Tin Iodide Perovskite Microlasers",
    "authors": "Cho, S.&dagger;; Shao, W.&dagger;; <span class=\"mentee\">Kim, J. H.</span>; Dou, L.*; Yun, S. -H.*",
    "year": 2025,
    "citation": "Under Review. Check preprint <u><a href=\"https://arxiv.org/abs/2507.08180\" target=\"_blank\">here</a></u>."
  },
  {
    "title": "Hydrogen-Bonded Organic Framework Enables Phase-Pure Layered Tin Perovskite Nanowires For Room Temperature Nanolasing",
    "authors": "<span class=\"mentee\">Kim, J. H.&dagger;</span>; Simon, J.&dagger;; Shao, W.*; Nian, Z.; Yang, H.; Chen, P.; Triplett, B.; Li, Z.; Wu, P.; Chen, Y.; Farheen, H.; Pagadala, K.; Fruhling, C. B.; Boltasseva, A.; Savoie, B. M.; Shalaev, V. M.*; Dou, L.*",
    "journal": "J. Am. Chem. Soc.",
    "year": 2026,
    "link": "https://pubs.acs.org/doi/full/10.1021/jacs.5c14431",
    "citation": "<span class=\"pub-journal\">J. Am. Chem. Soc.</span> 2026, 148, 483-493.",
    "featured": "secondary",
    "highlightImage": "/assets/img/publications/Map_purple-gold.jpg"
  },
  {
    "title": "Modulation of the Electronic and Vibrational Landscape in Lead Organic Chalcogenides",
    "authors": "Yang, H.*; Shao, W.; Cai, Y.; Ajayakumar, A.; Faraji, M.; Chen, M.; Dou, L.*; Huang, L.*",
    "journal": "J. Am. Chem. Soc.",
    "year": 2025,
    "link": "https://pubs.acs.org/doi/10.1021/jacs.5c16205",
    "citation": "<span class=\"pub-journal\">J. Am. Chem. Soc.</span> 2025, 147, 45549-45557."
  },
  {
    "title": "Ionic Liquids Improve the Long-Term Stability of Perovskite Solar Cells",
    "authors": "Xu, W.&dagger;; Shao, W.&dagger;; Tang, Y.; Lin, C.; Yang, H.; Yang, Y. -T.; <span class=\"mentee\">Kim, J. H.</span>; Lee, G.; Kumar, P.; Pedersen, K. R.; Coffey, A. H.; Harvey, S. P.; Graham, K. R.; Zhu, C.; Zhu, K.; Dou, L.*",
    "journal": "Nat. Energy",
    "year": 2025,
    "link": "https://www.nature.com/articles/s41560-025-01906-6",
    "citation": "<span class=\"pub-journal\">Nat. Energy</span> 2025.",
    "newsHighlight": "&bull; News highlight: <u><a href=\"https://scienmag.com/ionic-liquids-boost-perovskite-solar-cell-stability/\" target=\"_blank\">Science Magazine</a></u>, <u><a href=\"https://bioengineer.org/ionic-liquids-boost-perovskite-solar-cell-stability/\" target=\"_blank\">Bioengineer.org</a></u>.",
    "featured": "secondary",
    "highlightImage": "/assets/img/publications/earth.jpg"
  },
  {
    "title": "Grain Engineering For Efficient Near-Infrared Perovskite Light-Emitting Diodes",
    "authors": "Baek, S. -B.&dagger;; Shao, W.&dagger;; Feng, W. -J.; Tang, Y.; Lee, Y. H.; Loy, J.; Gunnarsson, W. B.; Yang, H.; Zhang, Y.; Faheem, M. B.; Kaswekar, P. I.; Atapattu, H. R.; Coffey, A.; Park, J. Y.; Yang, S. J.; Yang, Y. -T.; Zhu, C.; Wang, K.; Graham, K.; Gao, F.; Qiao, Q.; Guo, L. J.; Rand, B.; Dou, L.*",
    "journal": "Nat. Commun.",
    "year": 2024,
    "link": "https://www.nature.com/articles/s41467-024-55075-3",
    "citation": "<span class=\"pub-journal\">Nat. Commun.</span> 2024, 15, 10760."
  },
  {
    "title": "Microsecond Triplet Emission From Organic Chromophore-Transition Metal Dichalcogenide Hybrids Via Through-Space Spin Orbit Proximity Effect",
    "authors": "Choi, J.&dagger;; Im, H.&dagger;; Kim, D. W.; Jiang, H.; Stark, A.; Shao, W.; Zimmerman, P. M.; Jeon, G. W.; Jang, J. W.; Hwang, E. H.; Kim, S.*; Park, D. H.*; Kim, J.*",
    "journal": "Nat. Commun.",
    "year": 2024,
    "link": "https://www.nature.com/articles/s41467-024-51501-8",
    "citation": "<span class=\"pub-journal\">Nat. Commun.</span> 2024, 15, 10282.",
    "newsHighlight": "&bull; News highlight: <u><a href=\"https://news.engin.umich.edu/2024/12/faster-organic-phosphorescence-for-better-display-tech/\" target=\"_blank\">Michigan Engineering</a></u>.",
    "featured": "secondary",
    "highlightImage": "/assets/img/publications/bear.jpg"
  },
  {
    "title": "Exciton Dynamics In Layered Halide Perovskite Light-Emitting Diodes",
    "authors": "Baek, S. -D.; Yang, S. J.; Yang, H.; Shao, W.; Yang, Y. -T.; Dou, L.*",
    "journal": "Adv. Mater.",
    "year": 2024,
    "link": "https://advanced.onlinelibrary.wiley.com/doi/full/10.1002/adma.202411998",
    "citation": "<span class=\"pub-journal\">Adv. Mater.</span> 2024, 2411998."
  },
  {
    "title": "A Pyrrole Modified 3,4-Propylenedioxythiophene Conjugated Polymer As Hole Transport Layer For Efficient And Stable Perovskite Solar Cells",
    "authors": "Tang, Y.; Ma, K.; Shao, W.; Lee, Y. H.; Abtahi, A.; Sun, J.; Yang, J.; Coffey, A. H.; Atapattu, H.; Ahmed, M.; Hu, Q.; Xu, W.; Dani, R.; Wang, L.; Zhu, C.; Graham, K. R.; Mei, J.*; Dou, L.*",
    "journal": "Small",
    "year": 2024,
    "link": "https://onlinelibrary.wiley.com/doi/full/10.1002/smll.202408440",
    "citation": "<span class=\"pub-journal\">Small</span> 2024, 2408440."
  },
  {
    "title": "Two-Dimensional Lattice Confined Single-Molecule-Like Aggregates",
    "authors": "Wang, K.; Lin, Z. -Y.; De, A.; Kocoj, C.; Shao, W.; Yang, H.; Coffey, A.; Fruhling, C. B.; Tang, Y.; Varadharajan, D.; Zhu, C.; Boltasseva, A.; Shalaev, V. M.; Guo, P.; Savoie, B. M.*; Dou, L.*",
    "journal": "Nature",
    "year": 2024,
    "link": "https://www.nature.com/articles/s41586-024-07925-9",
    "citation": "<span class=\"pub-journal\">Nature</span> 2024, 633, 567-574.",
    "featured": "secondary",
    "highlightImage": "/assets/img/publications/helical_2.jpg"
  },
  {
    "title": "Triplet Management At Ligand-Perovskite Interface To Enhanced Photovoltaics Performance",
    "authors": "Tang, Y.; Yang, H.; Sun, J.; Wu, Z.; Shao, W.; Joy, S.; <span class=\"mentee\">Kim, J. H.</span>; Xu, W.; Coffey, A. H.; Lee, Y. H.; Lin, C.; Wang, L.; Ma, K.; Zhu, C.; Graham, K. R.; Tao, S.; Huang, L.; Dou, L.*",
    "journal": "ACS Energy Lett.",
    "year": 2024,
    "link": "https://pubs.acs.org/doi/full/10.1021/acsenergylett.4c01853",
    "citation": "<span class=\"pub-journal\">ACS Energy Lett.</span> 2024, 9, 4323-4330."
  },
  {
    "title": "Molecular Templating Of Layered Halide Perovskite Nanowires",
    "authors": "Shao, W.&dagger;; <span class=\"mentee\">Kim, J. H.&dagger;</span>; Simon, J.; Nian, Z.; Baek, S. -B.; Lu, Y.; Fruhling, C. B.; Yang, H.; Wang, K.; Park, J. Y.; Huang, L.; Yu, Y.; Boltasseva, A.; Savoie, B. M.; Shalaev, V. M.; Dou, L.*",
    "journal": "Science",
    "year": 2024,
    "link": "https://www.science.org/doi/10.1126/science.adl0920",
    "citation": "<span class=\"pub-journal\">Science</span> 2024, 384, 1000-1006.",
    "newsHighlight": "&bull; News highlight: <u><a href=\"https://www.purdue.edu/newsroom/releases/2024/Q2/purdue-researchers-crystal-engineering-modifies-2d-metal-halide-perovskites-into-1d-nanowires.html\" target=\"_blank\">Purdue</a></u>, <u><a href=\"https://bioengineer.org/purdue-researchers-crystal-engineering-modifies-2d-metal-halide-perovskites-into-1d-nanowires/\" target=\"_blank\">Bioengineer.org</a></u>, <u><a href=\"https://www.sciencedaily.com/releases/2024/06/240606152212.htm\" target=\"_blank\">ScienceDaily</a></u>, <u><a href=\"https://phys.org/news/2024-06-crystal-2d-metal-halide-perovskites.html\" target=\"_blank\">Phys.org</a></u>.",
    "featured": "main",
    "highlightImage": "/assets/img/publications/lasing_1.jpg",
    "highlightDescription": "A crystal-engineering strategy uses small-molecule templating to convert two-dimensional halide perovskites into phase-pure, one-dimensional nanowires, enabling room-temperature lasing and opening new routes to perovskite nanophotonics."
  },
  {
    "title": "Ligand-Variant Two-Dimensional Halide Perovskite Lateral Heterostructure",
    "authors": "Yang, H.; Shao, W.; Sun, J.; Kim, J. H.; Lee, Y. H.; Huang, L.; Dou, L.*",
    "journal": "MRS Bulletin",
    "year": 2024,
    "link": "https://link.springer.com/article/10.1557/s43577-024-00718-5",
    "citation": "<span class=\"pub-journal\">MRS Bulletin</span> 2024, 49, 1-7."
  },
  {
    "title": "Balancing The Phosphorescence And Fluorescence Of A Double-Ring Porphyrin Using Different Lanthanides For Ratiometric Oxygen Sensing",
    "authors": "Zhao, H.&dagger;*; Wang, Q.&dagger;; Wang, S.; Yin, J.; Wang, H.; Shao, W.; Yao, Z.; Yao, J.; Zang, L.*",
    "journal": "Inorg. Chem. Front.",
    "year": 2023,
    "link": "https://pubs.rsc.org/en/content/articlehtml/2023/qi/d3qi01306e",
    "citation": "<span class=\"pub-journal\">Inorg. Chem. Front.</span> 2023, 10, 5161-5166."
  },
  {
    "title": "Light-Emitting Organic Semiconductor-Incorporated Perovskites: Fundamental Properties And Device Applications",
    "authors": "Shao, W.; Yang, S.; Wang, K.; Dou, L.*",
    "journal": "J. Phys. Chem. Lett.",
    "year": 2023,
    "link": "https://pubs.acs.org/doi/10.1021/acs.jpclett.2c03882",
    "citation": "<span class=\"pub-journal\">J. Phys. Chem. Lett.</span> 2023, 14(8), 2034-2046."
  },
  {
    "title": "Polarity-Induced Dual Room-Temperature Phosphorescence Involving The T2 States Of Pure Organic Phosphors",
    "authors": "Zang, L.; Shao, W.; Bolton, O.; Ansari, R.; Yoon, S. -J.; Heo, J. -M.; Kieffer, J.; Matzger, A. J.; Kim, J.*",
    "journal": "J. Mater. Chem. C",
    "year": 2022,
    "link": "https://pubs.rsc.org/en/content/articlelanding/2022/tc/d2tc02152h",
    "citation": "<span class=\"pub-journal\">J. Mater. Chem. C</span> 2022, 10, 14746-14753."
  },
  {
    "title": "Metal-Free Organic Phosphors Toward Fast And Efficient Room-Temperature Phosphorescence",
    "authors": "Shao, W.; Kim, J.*",
    "journal": "Acc. Chem. Res.",
    "year": 2022,
    "link": "https://pubs.acs.org/doi/10.1021/acs.accounts.2c00146",
    "citation": "<span class=\"pub-journal\">Acc. Chem. Res.</span> 2022, 55(11), 1573-1585."
  },
  {
    "title": "Metal-Free Organic Triplet-Emitters With On-Off Switchable Excited State Intramolecular Proton Transfer",
    "authors": "Shao, W.; <span class=\"mentee\">Hao, J.</span>; Jiang, H.; Zimmerman, P.; Kim, J.*",
    "journal": "Adv. Funct. Mater.",
    "year": 2022,
    "link": "https://advanced.onlinelibrary.wiley.com/doi/full/10.1002/adfm.202201256",
    "citation": "<span class=\"pub-journal\">Adv. Funct. Mater.</span> 2022, 32(29), 2201256."
  },
  {
    "title": "Heavy Atom Oriented Orbital Angular Momentum Manipulation In Metal-Free Organic Phosphors",
    "authors": "Shao, W.; Jiang, H.; Ansari, R.; Zimmerman, P.; Kim, J.*",
    "journal": "Chem. Sci.",
    "year": 2022,
    "link": "https://pubs.rsc.org/en/content/articlelanding/2022/sc/d1sc05689a",
    "citation": "<span class=\"pub-journal\">Chem. Sci.</span> 2022, 13(3), 789-797."
  },
  {
    "title": "Charge Transfer As The Key Parameter Affecting The Color Purity Of Thermally Activated Delayed Fluorescence Emitters",
    "authors": "Ansari, R.; Shao, W.; Yoon, S. -J.; Kim, J.*; Kieffer, J.*",
    "journal": "ACS Appl. Mater. Interfaces",
    "year": 2021,
    "link": "https://pubs.acs.org/doi/full/10.1021/acsami.1c02943",
    "citation": "<span class=\"pub-journal\">ACS Appl. Mater. Interfaces</span> 2021, 13, 28529-28537."
  },
  {
    "title": "Organic Light-Emitting Diode Employing Metal-Free Organic Phosphor",
    "authors": "Song, B.&dagger;; Shao, W.&dagger;; Jung, J.; Yoon, S. -J.; Kim, J.*",
    "journal": "ACS Appl. Mater. Interfaces",
    "year": 2020,
    "link": "https://pubs.acs.org/doi/full/10.1021/acsami.9b20181",
    "citation": "<span class=\"pub-journal\">ACS Appl. Mater. Interfaces</span> 2020, 12(5), 6137-6143."
  },
  {
    "title": "Photoresponsive Luminescence Switching Of Metal-Free Organic Phosphors Doped Polymer Matrices",
    "authors": "Zang, L.; Shao, W.; Kwon, M. S.*; Zhang, Z.; Kim, J.*",
    "journal": "Adv. Opt. Mater.",
    "year": 2020,
    "link": "https://advanced.onlinelibrary.wiley.com/doi/full/10.1002/adom.202000654",
    "citation": "<span class=\"pub-journal\">Adv. Opt. Mater.</span> 2020, 8(23), 2000654."
  },
  {
    "title": "Heavy Atom Effect Of Selenium For Metal-Free Phosphorescent Light-Emitting Diodes",
    "authors": "Lee, D. R.; Lee, K. H.; Shao, W.; Kim, C. L.; Kim, J.*; Lee, J. Y.*",
    "journal": "Chem. Mater.",
    "year": 2020,
    "link": "https://pubs.acs.org/doi/10.1021/acs.chemmater.0c00078",
    "citation": "<span class=\"pub-journal\">Chem. Mater.</span> 2020, 32(6), 2583-2592."
  },
  {
    "title": "An Anterior Cruciate Ligament Failure Mechanism",
    "authors": "Chen, J.; Kim, J. -H.; Shao, W.; Schlecht, S. H.; Baek, S. Y.; Jones, A. K.; Ahn, T.; Ashton-Miller, J. A.; Banaszak Holl, M. M.; Wojtys, E. M.*",
    "journal": "Am. J. Sports Med.",
    "year": 2019,
    "link": "https://journals.sagepub.com/doi/full/10.1177/0363546519854450",
    "citation": "<span class=\"pub-journal\">Am. J. Sports Med.</span> 2019, 47, 2067-2076."
  }
]
```

**Content-mapping decisions** (documented per the brainstorming/plan-writing handoff, so reviewers can see the reasoning without re-deriving it):

- **Array order** is newest-first (original document order, entry "24" through entry "1"), so `reversed start="24"` with no per-`<li>` `value` attributes reproduces the original numbering automatically — index 0 gets number 24, index 23 gets number 1.
- **`citation` field** is a self-contained HTML blob covering "journal + year + volume/pages" (wrapped with `.pub-journal` around the journal name) or, for the two not-yet-published entries, "Under Review." text. This means `render-publications.js` never needs to conditionally assemble journal/year/pages — it just drops `citation` into the `<li>` verbatim. `journal` (plain string, no markup) and `year` (number) are kept as separate fields purely for **filtering** (`data-year`) and **featured-tag display** ("Journal · Year"); they are omitted on the two "Under Review" entries (#24, #23) since those have no journal yet and aren't featured.
- **`.mentee` styling**: original used inline `<span style="color: #006151;"><u>NAME</u></span>` (and one `#006154` typo variant, on the "Ionic Liquids..." entry). Both become `<span class="mentee">NAME</span>`, with color **and** underline moved into the `.mentee` CSS class (Step 5) — fixing the stray color typo as part of the migration.
- **`*` and `†` symbols** remain plain characters in `authors` (no markup), matching the original — the legend line ("† Equal contribution | * Corresponding | Mentee") is reproduced in Task 3's HTML.
- **`&dagger;`** is used instead of a literal `†` character in the JSON source for portability across editors/encodings; it renders as `†` in HTML.
- **Journal name fix**: "ACS Eng. Lett." (original, entry "14") is corrected to the standard abbreviation **"ACS Energy Lett."** — a copy-edit fix, same precedent as Plan 3's minor text corrections.
- **Title fix**: "Ligang-Variant..." (original, entry "12") is corrected to **"Ligand-Variant..."** (the chemical term "ligand", not "Ligang") — likely a typo in the source HTML.
- **`newsHighlight` field** (new, not in the spec's literal example but additive/optional — spec says fields are "omitted when not applicable", and this is simply another optional field for the 3 entries that have press coverage) holds the "• News highlight: ..." line as its own HTML blob, rendered on its own line below `citation`.
- **Featured selection** (1 main + 4 secondary): **main** is "Molecular Templating Of Layered Halide Perovskite Nanowires" (*Science*, 2024) — the lab's flagship paper, already referenced as such in Plan 2's home gallery. **Secondary**: the JACS 2026 nanolasing paper (continues the nanowire story), the Nature 2024 lattice-confined-aggregates paper, the Nat. Energy 2025 solar-cell-stability paper (has press coverage), and the Nat. Commun. 2024 triplet-emission paper (W. Shao's own molecular-design work, has press coverage) — chosen for topic diversity (nanowires/lasing, fundamental photophysics, solar energy, organic emitters) and recency/impact.
- **`highlightImage` sourcing**: 5 images copied from `/TOC/` into `assets/img/publications/` (Step 3). `lasing_1.jpg` ("Layered Perovskite Nanowires" per its `alt` text in `day-version/index.html`) is the closest visual match for the *Science* paper's main highlight. The other 4 reuse existing `/TOC/` artwork as representative figures — `Map_purple-gold.jpg` (also used by Plan 2's home gallery for the same nanowire/nanolasing theme), `helical_2.jpg`, `earth.jpg`, and `bear.jpg`. Reusing a TOC figure across the home gallery and the publications highlight is intentional: the same source image legitimately represents that paper's visual abstract on both pages.
- **`newsLink`**: omitted from all 24 entries — Plan 2's `data/news.json` has no `/publications/#...` anchors to link back to.

- [ ] **Step 2: Validate the JSON**

Run (PowerShell):

```powershell
(Get-Content data/publications.json -Raw | ConvertFrom-Json).Count
```

Expected: `24`

- [ ] **Step 3: Copy publication highlight images**

Run (from repo root, in PowerShell):

```powershell
New-Item -ItemType Directory -Force assets/img/publications | Out-Null
Copy-Item TOC/lasing_1.jpg assets/img/publications/lasing_1.jpg
Copy-Item TOC/Map_purple-gold.jpg assets/img/publications/Map_purple-gold.jpg
Copy-Item TOC/helical_2.jpg assets/img/publications/helical_2.jpg
Copy-Item TOC/earth.jpg assets/img/publications/earth.jpg
Copy-Item TOC/bear.jpg assets/img/publications/bear.jpg
```

Verify:

```powershell
(Get-ChildItem assets/img/publications).Count
```

Expected: `5`

- [ ] **Step 4: Append publication styles**

Append to the end of `assets/css/style.css`:

```css

/* ==========================================================================
   Publications: Featured
   ========================================================================== */
.featured-pubs {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.pub-highlight {
  display: block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.15s ease;
}

.pub-highlight:hover {
  border-color: var(--color-accent);
}

.pub-highlight__media {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  display: block;
}

.pub-highlight__body {
  padding: var(--space-2);
}

.pub-highlight__tag {
  display: block;
}

.pub-highlight__title {
  margin-top: 0.25rem;
}

.pub-highlight__desc {
  margin-top: var(--space-1);
}

.featured-pubs__main {
  flex: 1.4;
}

.featured-pubs__main .pub-highlight__media {
  aspect-ratio: 16 / 9;
}

.featured-pubs__main .pub-highlight__title {
  font-size: 1.25rem;
}

.featured-pubs__grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
}

.featured-pubs__grid .pub-highlight__media {
  aspect-ratio: 1 / 1;
}

.featured-pubs__grid .pub-highlight__title {
  font-size: 0.9375rem;
}

@media (max-width: 760px) {
  .featured-pubs {
    flex-direction: column;
  }
}

/* ==========================================================================
   Publications: List
   ========================================================================== */
.pub-filter {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-bottom: var(--space-3);
}

.pub-filter select {
  font: inherit;
  font-size: 0.9375rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  color: var(--color-text);
}

.pub-legend {
  margin-bottom: var(--space-3);
}

.pub-list {
  list-style-position: outside;
  padding-left: 1.5em;
}

.pub-list li {
  margin-bottom: var(--space-3);
  line-height: 1.6;
}

.pub-list li::marker {
  color: var(--color-text-muted);
}

.pub-list li > a:first-child {
  text-decoration: underline;
}

.pub-authors {
  color: var(--color-text-muted);
}

.pub-journal {
  color: var(--color-accent);
  font-weight: 600;
}

.pub-news {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.mentee {
  color: #00795f;
  text-decoration: underline;
}

[data-theme="dark"] .mentee {
  color: #5fd9b9;
}
```

Notes on a few choices:
- `.pub-list li > a:first-child` underlines only the **title link** (the renderer always emits it as the first child of each `<li>` — see Task 2). Inner links inside `authors`/`citation`/`newsHighlight` (news-highlight sources, the preprint "here" link) carry their own `<u>` tags in the JSON, matching the convention already used for links inside `bio` HTML in Plan 3's `people.json`.
- `.mentee` replaces the original inline `color: #006151` (and the `#006154` typo) with a single class, adds `text-decoration: underline` to preserve the original's `<u>` wrapping, and gets a brighter dark-mode override (`#5fd9b9`) for contrast against the dark background — the original hardcoded color would be illegible in dark mode.
- `.pub-journal` uses `var(--color-accent)` instead of the original's hardcoded maroon `#800020`, so it adapts automatically between light/dark themes like the rest of the new palette.

- [ ] **Step 5: Commit the data file, images, and styles**

```bash
git add data/publications.json assets/img/publications/ assets/css/style.css
git commit -m "Add publications data, highlight images, and publication styles"
```

---

## Task 2: render-publications.js

**Files:**
- Create: `assets/js/render-publications.js`

- [ ] **Step 1: Write the render script**

Write `assets/js/render-publications.js`:

```javascript
(function () {
  function featuredCardHTML(pub, isMain) {
    var media = pub.highlightImage
      ? '<img class="pub-highlight__media" src="' + pub.highlightImage + '" alt="' + pub.title + '">'
      : '';
    var tag = pub.journal ? pub.journal + ' &middot; ' + pub.year : String(pub.year);
    var desc = (isMain && pub.highlightDescription)
      ? '<p class="pub-highlight__desc text-muted">' + pub.highlightDescription + '</p>'
      : '';

    return '' +
      '<a class="pub-highlight" href="' + pub.link + '" target="_blank">' +
        media +
        '<div class="pub-highlight__body">' +
          '<span class="pub-highlight__tag text-label text-muted">' + tag + '</span>' +
          '<h3 class="pub-highlight__title">' + pub.title + '</h3>' +
          desc +
        '</div>' +
      '</a>';
  }

  function listItemHTML(pub) {
    var titleEl = pub.link
      ? '<a href="' + pub.link + '" target="_blank">' + pub.title + '</a>'
      : '<span>' + pub.title + '</span>';
    var news = pub.newsHighlight
      ? '<br><span class="pub-news">' + pub.newsHighlight + '</span>'
      : '';

    return '' +
      '<li data-year="' + pub.year + '">' +
        titleEl + '<br>' +
        '<span class="pub-authors">' + pub.authors + '</span><br>' +
        pub.citation +
        news +
      '</li>';
  }

  var featuredMount = document.getElementById('featured-pubs');
  var listMount = document.getElementById('pub-list');
  var filterSelect = document.getElementById('year-filter');

  if (!featuredMount && !listMount) return;

  fetch('/data/publications.json')
    .then(function (res) { return res.json(); })
    .then(function (pubs) {
      if (featuredMount) {
        var main = pubs.filter(function (p) { return p.featured === 'main'; })[0];
        var secondary = pubs.filter(function (p) { return p.featured === 'secondary'; });

        if (main) {
          var grid = secondary.map(function (p) { return featuredCardHTML(p, false); }).join('');
          featuredMount.innerHTML = '' +
            '<div class="featured-pubs">' +
              '<div class="featured-pubs__main">' + featuredCardHTML(main, true) + '</div>' +
              '<div class="featured-pubs__grid">' + grid + '</div>' +
            '</div>';
        }
      }

      if (listMount) {
        listMount.setAttribute('start', String(pubs.length));
        listMount.innerHTML = pubs.map(listItemHTML).join('');
      }

      if (filterSelect && listMount) {
        var years = [];
        pubs.forEach(function (p) {
          if (years.indexOf(p.year) === -1) years.push(p.year);
        });
        years.sort(function (a, b) { return b - a; });

        years.forEach(function (year) {
          var option = document.createElement('option');
          option.value = String(year);
          option.textContent = String(year);
          filterSelect.appendChild(option);
        });

        filterSelect.addEventListener('change', function () {
          var value = filterSelect.value;
          var items = listMount.querySelectorAll('li');
          items.forEach(function (li) {
            li.style.display = (value === 'all' || li.getAttribute('data-year') === value) ? '' : 'none';
          });
        });
      }
    })
    .catch(function (err) {
      console.error('Failed to load publications:', err);
    });
})();
```

Notes:
- `featuredCardHTML` is reused for both the main card and each secondary card; `isMain` only controls the description and the (CSS-driven) larger sizing.
- `listItemHTML`'s `<li>` always emits the title as its **first child** — either an `<a>` (when `link` is present) or a plain `<span>` (entries #24/#23, "Under Review", have no `link`). This is what `.pub-list li > a:first-child` (Task 1, Step 4) targets for the underline.
- The year `<select>` starts with only the static `<option value="all">All</option>` (from Task 3's HTML); this script appends one `<option>` per distinct `year` value, sorted descending, so 2026 appears first.
- The `change` listener toggles `li.style.display`, matching the show/hide approach of the original `filterPubs()`.

- [ ] **Step 2: Validate syntax**

Run:

```bash
node --check assets/js/render-publications.js
```

Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add assets/js/render-publications.js
git commit -m "Add render-publications.js for featured publications and publication list"
```

---

## Task 3: Publications page

**Files:**
- Create: `publications/index.html`

- [ ] **Step 1: Write the page**

Write `publications/index.html`:

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

  <meta name="description" content="Publications — W. Shao Laboratory. Peer-reviewed journal articles on organic and hybrid semiconductor photophysics.">
  <meta name="robots" content="index,follow">
  <title>Publications — W. Shao Laboratory</title>
</head>
<body>
  <div id="site-nav"></div>

  <main>
    <section class="container">
      <h1 class="section-heading">Publications</h1>
      <p class="text-muted">Visit <u><a href="https://scholar.google.com/citations?user=Hf78oFgAAAAJ&hl=en&oi=ao" target="_blank">Google Scholar</a></u> for a complete list.</p>

      <h2 class="section-heading section-heading--spaced">Featured Publications</h2>
      <div id="featured-pubs"></div>

      <h2 class="section-heading section-heading--spaced">Peer-Reviewed Journal Articles</h2>

      <div class="pub-filter">
        <label for="year-filter">Filter by year:</label>
        <select id="year-filter">
          <option value="all">All</option>
        </select>
      </div>

      <p class="pub-legend text-muted text-label">&dagger; Equal contribution &nbsp;|&nbsp; * Corresponding &nbsp;|&nbsp; <span class="mentee">Mentee</span></p>

      <ol id="pub-list" class="pub-list" reversed></ol>
    </section>
  </main>

  <div id="site-footer"></div>

  <script src="/assets/js/render-publications.js" defer></script>
  <script src="/assets/js/partials.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add publications/index.html
git commit -m "Add data-driven Publications page"
```

---

## Task 4: Manual verification

**Files:** none (verification only)

- [ ] **Step 1: Start a local server**

Run (from repo root):

```bash
npx --yes serve . -l 5000
```

Expected output includes:

```
Accepting connections at http://localhost:5000
```

- [ ] **Step 2: Verify the Publications page**

Open `http://localhost:5000/publications/` and check:

- [ ] Page loads with the shared nav and footer (injected by `partials.js`); "Publications" is present in the nav.
- [ ] **Featured Publications**: one large card on the left (image, tag "Science · 2024", title "Molecular Templating Of Layered Halide Perovskite Nanowires", and the highlight description paragraph) and a 2×2 grid of 4 smaller cards on the right (each with image, tag, and title — no description). All 5 cards are clickable links that open the paper's DOI in a new tab.
- [ ] **Peer-Reviewed Journal Articles**: a numbered list of 24 entries, numbered **24 down to 1** (reversed numbering, computed from `data/publications.json.length`).
- [ ] Entry #24 ("Geometric Frustration...") and #23 ("Air-stable Room-temperature...") show **"Under Review."** instead of a journal/year/pages line; their titles are plain (not links). Entry #23's "Check preprint here." link opens the arXiv page in a new tab.
- [ ] Mentee names (e.g., "Kim, J. H." in entries #22/#20/#13, "Hao, J." in entry #7) render in teal with an underline via `.mentee`.
- [ ] Entries #13 (Science), #18 (Nat. Commun.), and #20 (Nat. Energy) show a "• News highlight: ..." line below the citation, with working links.
- [ ] **Year filter**: the dropdown has options "All", 2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019 (8 years + All). Selecting "2024" shows only the 2024 entries (#19-#12); selecting "All" restores the full list.
- [ ] The legend line ("† Equal contribution | * Corresponding | Mentee") renders below the filter, with "Mentee" styled via `.mentee`.

- [ ] **Step 3: Verify dark mode**

Toggle the theme switch in the nav and confirm:
- [ ] `.pub-journal` text (e.g., "J. Am. Chem. Soc.") remains legible (uses `--color-accent`, which flips to a lighter blue in dark mode).
- [ ] `.mentee` names remain legible (lighter teal `#5fd9b9` in dark mode).
- [ ] Featured cards' `.pub-highlight` surface/border colors match the dark theme.

- [ ] **Step 4: Verify responsive layout**

Resize the browser to under 760px width and confirm:
- [ ] The featured section stacks vertically — the main card first, then the 2×2 grid below it.
- [ ] The publication list and year filter remain readable (no horizontal overflow).

- [ ] **Step 5: Verify navigation entry point and console**

- [ ] From `http://localhost:5000/home/`, click "Publications" in the nav and confirm it navigates to `/publications/` and the page renders as in Step 2.
- [ ] Open the browser console on `/publications/` and confirm there are no errors (a failed `fetch` would log via `console.error` but not throw).
