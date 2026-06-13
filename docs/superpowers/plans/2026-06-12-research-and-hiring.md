# Research and Hiring Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 4 standalone `research-project/prj*.html` pages with a single `/research/project.html?id=<slug>` template driven by `data/projects.json`, add a `/research/index.html` card-grid landing page, and add the new static `/hiring/index.html` placeholder page.

**Architecture:** `data/projects.json` is an array of 4 entries (`slug`/`title`/`summary`/`image`/`body`), one per migrated project. `render-projects.js` has two responsibilities depending on which page it runs on: on `/research/index.html` it renders a card grid (image+title+summary linking to `project.html?id=<slug>`); on `/research/project.html` it reads `?id=` from the URL, finds the matching entry, and injects `title`/`body` into the page (each entry's `image` already appears inside `body` — as the leading hero for entries 1/2/4, or inline with a caption for entry 3 — so it is not injected separately). `/hiring/index.html` is static (not data-driven, per spec).

**Tech Stack:** Static HTML/CSS/vanilla JS (ES5-compatible, IIFE + `fetch` + `URLSearchParams`), same conventions as Plans 1-4. No build step.

---

## Plan Series Note (Plan 5 of 6)

This plan depends on **Plan 1** (Foundation) for the CSS variables/typography/`.container`/`.btn`/`.link-arrow`/`main section` padding, shared partials (`#site-nav`/`#site-footer`, `assets/js/partials.js`, `assets/js/theme.js`, `assets/partials/footer.html`), and the Page Template Reference head/body skeleton. It also reuses `.section-heading` / `.section-heading--spaced` (introduced in **Plan 3**) and `.text-muted` / `.mentee` / `.pub-journal` (Plan 1 / Plan 4), same as Plan 4.

**Cross-plan contracts this plan satisfies** (from Plan 2's `data/news.json` and `data/gallery.json`, both already written):
- Two news items' "Read more →" links point to `/research/project.html?id=perovskite-nanolasers` and `/research/project.html?id=templated-perovskite-optoelectronics` — **these two exact slugs are required** and are used below.
- `data/gallery.json`'s 4 non-Science tiles link to `/research/` — satisfied by Task 3's `/research/index.html`.
- The home page's "View All Research →" link points to `/research/` — same.

**Small retrofit to Plan 1's footer/partials (Task 4 of this plan):** the Hiring page needs its own "Leave a message" trigger in the main content, in addition to the one already in the site footer. `partials.js` currently wires exactly one element (`#open-message-modal`) via `getElementById`. Task 4 changes this to a class-based `.js-open-message-modal` + `querySelectorAll`, so any number of buttons on a page can open the shared `#message-modal`. This is a small, additive change to two files Plan 1 already created (`assets/partials/footer.html`, `assets/js/partials.js`).

Nothing in **Plan 6** depends on this plan for links (Fun/Facility don't link into Research).

---

## File Structure

```
data/
  projects.json              (new — 4 entries, migrated from research-project/prj1-4)
assets/
  css/style.css               (modified — append project-card, project-body styles)
  js/
    render-projects.js        (new)
    partials.js                (modified — modal-open wiring becomes class-based)
  partials/
    footer.html                (modified — "Leave a message" button gets a shared class)
  img/
    projects/                 (new — images copied from day-version/research/research-project/ and /TOC/)
      topological-nanowires.jpg
      perovskite-nanolasers.jpg
      templated-mhp-fig1.webp
      templated-mhp-fig2.jpg
      templated-mhp-fig3.jpg
      templated-mhp-fig4.jpg
      organic-phosphors.jpg
research/
  index.html                  (new)
  project.html                 (new — template, reads ?id=)
hiring/
  index.html                   (new — static placeholder)
```

---

## Task 1: Projects data file

**Files:**
- Create: `data/projects.json`
- Create: `assets/img/projects/*` (7 images, copied from `day-version/research/research-project/` and `/TOC/`)
- Modify: `assets/css/style.css`

- [ ] **Step 1: Create the projects data file**

Write `data/projects.json`. This is built in two parts below — write the file with all 4 entries as a single JSON array (the array brackets and comma placement are shown so the parts fit together).

Start the file:

```json
[
```

**Entry 1 — `topological-perovskite-nanowires`** (from `prj3_topolayer.html`, "ONGOING PROJECTS"):

```json
  {
    "slug": "topological-perovskite-nanowires",
    "title": "Topologically Modified Hybrid Layered Materials",
    "summary": "Carboxylic-acid-modified 2D perovskites self-assemble into 1D nanowires, establishing a new class of topologically-modified hybrid materials.",
    "image": "/assets/img/projects/topological-nanowires.jpg",
    "body": "<img class=\"project-fig\" src=\"/assets/img/projects/topological-nanowires.jpg\" alt=\"Topologically modified 2D perovskite nanowire crystals\"><p>Layered materials do not naturally grow beyond 2D morphologies due to their inherent in-plane symmetry. In particular, spontaneous formation of 1D structures using layered materials represents a key challenge in morphology control.</p><p>Now, with the significant tunability of organic-inorganic hybrid materials &mdash; like layered or \"2D\" perovskites &mdash; one may start to exert morphological control from the organic side, which would offer 2D perovskites the unique electronic confinement, mechanical flexibility, and optical anisotropy of semiconductor nanowires, further opening unique possibilities for customizing light-matter interactions. Nevertheless, the pursuit of a tunable, scalable, and universal bottom-up approach necessitates a fundamental redesign of the crystal growth mechanism.</p><p>The answer lies in the molecular design. Particularly, the organic cations in 2D perovskites need to extend beyond the single-molecule level and accelerate intermolecular interactions. In this regard, we modified them with carboxylic acid (COOH), a type of supramolecular synthon widely used in organic crystal design that also drives one-dimensional self-assembly. Specifically, H-bonding-driven dimerization of these directional COOH moieties helps align the organic spacers in a parallel fashion with respect to the 2D inorganic lattice. Surprisingly, the 2D perovskite now self-assembles exclusively into 1D needles and wires from solution-phase crystal growth. To highlight the establishment of secondary bonding lattices in the pristine 2D perovskite lattice, we named these new materials \"topologically-modified hybrid 2D perovskites.\"</p><p><strong>Read more:</strong></p><p>[1] <u><a href=\"https://www.science.org/doi/10.1126/science.adl0920\" target=\"_blank\">Molecular Templating of Layered Halide Perovskite Nanowires</a></u><br><span class=\"text-muted\">Shao, W.&dagger;; <span class=\"mentee\">Kim, J. H.&dagger;</span>; Simon, J.; Nian, Z.; Baek, S. -B.; Lu, Y.; Fruhling, C. B.; Yang, H.; Wang, K.; Park, J. Y.; Huang, L.; Yu, Y.; Boltasseva, A.; Savoie, B. M.; Shalaev, V. M.; Dou, L.*</span><br><span class=\"text-muted\"><span class=\"pub-journal\">Science</span> 2024, 384, 1000-1006.</span></p>"
  },
```

**Entry 2 — `perovskite-nanolasers`** (from `prj4_pvsklaser.html`, "PAST PROJECTS" — **slug required by Plan 2's news link**):

```json
  {
    "slug": "perovskite-nanolasers",
    "title": "Deterministic Synthesis of Layered Perovskite Room-Temperature Nanolasers",
    "summary": "Hydrogen-bonded organic frameworks template phase-pure quasi-2D tin halide perovskite nanowires, enabling low-threshold, ambient-stable room-temperature nanolasers.",
    "image": "/assets/img/projects/perovskite-nanolasers.jpg",
    "body": "<img class=\"project-fig\" src=\"/assets/img/projects/perovskite-nanolasers.jpg\" alt=\"Layered perovskite nanowire lasers\"><p>My solid state physics teacher, <u><a href=\"https://lsa.umich.edu/physics/people/faculty/kurdak.html\" target=\"_blank\">Cagliyan Kurdak</a></u> at the University of Michigan, used to say that there are three prerequisites for lasing: population inversion, gain medium, and cavity resonator. Intuitively, population inversion refers to the need for an excitation source to \"pump\" a significant number of electrons, excitons, or other quasi-particles in a semiconductor medium into their excited states. The emitted photon is then confined within a cavity, where it can stimulate the emission of additional photons from nearby excited particles as it passes by.</p><p>LASER, or light amplification by stimulated emission of radiation, continues to be one of the cornerstone applications of semiconductors. In the modern era, when we discuss the miniaturization of laser devices for futuristic photonic integration, an effective cavity design starts from delicate crystallization control over semiconductor morphology. Albeit widely used as bulk thin-film lasers, Group III-V semiconductor devices have posed significant challenges during their miniaturization. Achieving comparable cavity performance at smaller scales requires advanced nanofabrication techniques, such as high-resolution lithography and etching, which are often costly and time-consuming. These limitations have spurred interest in alternative miniaturized gain materials compatible with low-cost fabrication methods.</p><p>Layered metal-halide (2D) perovskites offer highly tunable optical and electronic properties, making them promising new gain materials. Unlike III-V semiconductors, cavity control in these materials can be achieved through bottom-up lattice design rather than costly top-down nanofabrication. Using a molecular templating method, we enabled scalable fabrication of 1D nanowires from 2D perovskites, which act as intrinsic Fabry&ndash;P&eacute;rot resonators. By selecting a tin (Sn) iodide lattice over lead (Pb), we optimized gain and achieved well-defined cavities that support efficient, low-loss waveguiding (&lt;3 dB/mm) and low-threshold light amplification (&lt;20 &mu;J/cm<sup>2</sup>) at 80 K.</p><p>The compositional tunability of layered perovskites enables further gain optimization, for example by increasing the thickness of inorganic layers (the <em>n</em> number) to form quasi-2D phases. This approach reduces exciton-phonon interactions that hinder optical gain. Recent studies have demonstrated room-temperature (RT) lasing from <em>n</em>=2 quasi-2D tin-iodide perovskites, though with a threshold above 300 &mu;J/cm<sup>2</sup>. However, synthesizing quasi-2D lattices presents significant phase purity challenges, which intensify as <em>n</em> increases due to the similar formation energies of different phases. Achieving phase-pure nanocrystals often requires physical exfoliation to separate mixed phases, but this low-throughput process limits the practical application of layered perovskite nanolasers.</p><p>We have recently advanced our molecular templating methods to enable scalable, deterministic synthesis of phase-pure quasi-2D tin halide perovskite nanowires. By introducing an intercalated hydrogen-bonded organic framework (HOF), we achieved controlled crystallization, resulting in exceptional phase purity and structural rigidity. This approach enabled the scalable production of quasi-2D perovskite nanowire lasers with low thresholds (&lt;100 &mu;J/cm<sup>2</sup>) at RT, high quality factors (Q &asymp; 3500), and tunable near-infrared emission (750&ndash;850 nm). Owing to their robust structure, these nanowires also exhibited remarkable stability against Sn(II) oxidation in air, allowing for the first demonstration of ambient-stable RT lasers. These results mark a significant milestone for lead-free perovskites and expand their potential in photonic and optoelectronic applications.</p><p>Credit to our RT lasing team, led by student mentee <u><a href=\"https://www.linkedin.com/in/jeong-hui-kim-8a3215201/\" target=\"_blank\">Jeong Hui Kim</a></u>, and our collaborators <u><a href=\"https://engineering.purdue.edu/~shalaev/team.php\" target=\"_blank\">Vladimir Shalaev and Alexandra Boltasseva</a></u> at Purdue University, as well as <u><a href=\"http://www.intelon.org/index.htm\" target=\"_blank\">Seok-Hyun Andy Yun</a></u> and <u><a href=\"https://fredcho.weebly.com/\" target=\"_blank\">Sangyeon (Fred) Cho</a></u> at Harvard Medical School.</p><p class=\"text-muted\"><em>Note: the writing here is a summary of Wenhao's talk at MRS Fall 2024.</em></p><p><strong>Read more:</strong></p><p>[1] <u><a href=\"https://www.science.org/doi/10.1126/science.adl0920\" target=\"_blank\">Molecular Templating Of Layered Halide Perovskite Nanowires</a></u><br><span class=\"text-muted\">Shao, W.&dagger;; <span class=\"mentee\">Kim, J. H.&dagger;</span>; Simon, J.; Nian, Z.; Baek, S. -B.; Lu, Y.; Fruhling, C. B.; Yang, H.; Wang, K.; Park, J. Y.; Huang, L.; Yu, Y.; Boltasseva, A.; Savoie, B. M.; Shalaev, V. M.; Dou, L.*</span><br><span class=\"text-muted\"><span class=\"pub-journal\">Science</span> 2024, 384, 1000-1006.</span></p><p>[2] <u><a href=\"https://arxiv.org/abs/2507.08180\" target=\"_blank\">Air-stable Room-temperature Quasi-2D Tin Iodide Perovskite Microlasers</a></u><br><span class=\"text-muted\">Cho, S.&dagger;; Shao, W.&dagger;; <span class=\"mentee\">Kim, J. H.</span>; Dou, L.*; Yun, S. -H.*</span><br><span class=\"text-muted\">Under Review. Check preprint <u><a href=\"https://arxiv.org/abs/2507.08180\" target=\"_blank\">here</a></u>.</span></p><p>[3] Hydrogen-Bonded Organic Framework Enables Phase-Pure Layered Tin Perovskite Nanowires For Room Temperature Nanolasing<br><span class=\"text-muted\"><span class=\"mentee\">Kim, J. H.&dagger;</span>; Simon, J.&dagger;; Shao, W.*; Nian, Z.; Yang, H.; Chen, P.; Triplett, B.; Li, Z.; Wu, P.; Chen, Y.; Farheen, H.; Pagadala, K.; Fruhling, C. B.; Boltasseva, A.; Savoie, B. M.; Shalaev, V. M.*; Dou, L.*</span><br><span class=\"text-muted\"><span class=\"pub-journal\">J. Am. Chem. Soc.</span> 2026, 148, 483-493.</span></p>"
  },
```

**Entry 3 — `templated-perovskite-optoelectronics`** (from `prj2_templatemhp.html`, "PAST PROJECTS" — **slug required by Plan 2's news link**):

```json
  {
    "slug": "templated-perovskite-optoelectronics",
    "title": "Templated Crystallization in Metal-Halide Perovskite Optoelectronics",
    "summary": "Molecular and substrate templates control perovskite crystallization and morphology, suppressing defects in solar cells and enabling discrete-grain microlens architectures for highly efficient LEDs.",
    "image": "/assets/img/projects/templated-mhp-fig1.webp",
    "body": "<p>Crystals invariably grow from a medium, which influences their formation. Templated crystallization uses an external template, like a surface or molecule, to guide the formation of crystals, influencing their shape, size, composition, and even the type of crystal that forms (i.e. polymorphism). A classic case is the biogenic crystallization of guanine in zebrafish. The morphology and composition of guanine crystals vary by tissue: in the skin, they form square or hexagonal platelets that assemble into organized stacks, producing iridescent coloration; in the eye, they adopt elongated shapes and arrange into multilayer arrays to enhance light reflection for improved vision in low-light conditions. The morphogenesis of guanine crystals is \"templated\" by genetic factors (Fig. 1).</p><img class=\"project-fig\" src=\"/assets/img/projects/templated-mhp-fig1.webp\" alt=\"Genetic control over biogenic crystal morphogenesis in zebrafish\"><p class=\"text-muted\"><em>Fig. 1. Genetic control over biogenic crystal morphogenesis in zebrafish [1]</em></p><p>Inspired by biology, materials scientists have explored templated crystallization of synthetic nanomaterials since the late 20th century. In recent years, interest has shifted toward metal-halide perovskites and the use of organic molecules as \"molecular templates.\" Metal-halide perovskites are a class of ionic semiconductors that adopt the classic \"ABX<sub>3</sub>\" perovskite structure (Fig. 2a), where B is a divalent metal cation (Pb<sup>2+</sup> or Sn<sup>2+</sup>), X represents halides (Cl<sup>-</sup>, Br<sup>-</sup>, or I<sup>-</sup>), and A typically consists of small monovalent cations, such as organic methylammonium (MA<sup>+</sup>) and formamidinium (FA<sup>+</sup>), or inorganic Cs<sup>+</sup>. Their soft ionic lattice enables solution processing at mild conditions, while compositional tunability allows for bandgap control from visible to near-infrared, making them interesting light absorbers and emitters. With low-cost fabrication and tunable properties, metal-halide perovskites have become a promising alternative to silicon in solar cells, while interest also extends to solid-state lighting, photodetectors, quantum materials, and photonic integration.</p><img class=\"project-fig\" src=\"/assets/img/projects/templated-mhp-fig2.jpg\" alt=\"Structure of ABX3 perovskites and SEM images of perovskite films with and without ionic liquid additive\"><p class=\"text-muted\"><em>Fig. 2. (a) The structure of classic ABX<sub>3</sub> perovskites. (b,c) Perovskite polycrystalline film morphology (b) without and (c) with ionic liquid additive. Images from scanning electron microscopy (SEM). [2]</em></p><p>Compositional and morphological control are critical in semiconductor devices. In metal-halide perovskites, compositional control primarily involves minimizing defects and impurities. While perovskites are more defect-tolerant than silicon, which requires ultra-high purity over 99.9999999% (9N), their compositional complexity and solution processing introduce challenges. For example, unreacted PbI<sub>2</sub> is a major issue in MAPbI<sub>3</sub>, a widely used low-bandgap perovskite for solar cells, as rapid crystallization often prevents complete precursor conversion (Fig. 2b). PbI<sub>2</sub>, now as an impurity, is known to decompose into gaseous I<sub>2</sub> and metallic Pb(0) under light and thermal stress during solar cell operation, acting as catalytic sites that accelerate perovskite degradation and compromise device stability.</p><p>Alternatively, crystallization can be regulated by capturing PbI<sub>2</sub> precursors and gradually converting them to MAPbI<sub>3</sub>. We recently developed an ionic liquid as a molecular template for this purpose. Ionic liquids are a type of organic salt with low melting points that usually behave as liquids near room temperature, which makes them compatible with the processing of ionic metal-halide perovskites. Our designed ionic liquid strongly coordinates with PbI<sub>2</sub>, forming an adduct that mediates crystallization and enables near-complete precursor conversion. This controlled process reduces PbI<sub>2</sub> aggregates, increases perovskite grain size, and yields smooth, low-defect polycrystalline films (Fig. 2c).</p><p>Morphological control in optoelectronic devices extends beyond individual crystals to the spatial organization of grains in polycrystalline thin films. While in solar cells grains need to be closely connected and grain boundaries carefully managed to ensure efficient extraction of photogenerated charge carriers, this may not be the case in light-emitting diodes (LEDs), where injected charges generate photons, or light, as output. Metal-halide perovskites, as excellent direct-bandgap semiconductors, can achieve near-unity internal quantum efficiency (IQE), meaning nearly all injected electrons generate photons. Nonetheless, external quantum efficiency (EQE), which concerns the photons actually emitted, can remain low due to poor outcoupling efficiency (OCE), where a significant portion of generated light is trapped within the device rather than emitted from the display area.</p><img class=\"project-fig\" src=\"/assets/img/projects/templated-mhp-fig3.jpg\" alt=\"SEM and atomic force microscopy images of perovskite films with segregated grains\"><p class=\"text-muted\"><em>Fig. 3. SEM images of perovskite films with segregated grains gradually amplified with increasing additive concentration (scale bar: 1 &micro;m). Bottom: height profile from atomic force microscopy. [3]</em></p><p>Low OCE is a common challenge in continuous polycrystalline films, as light is easily waveguided to the device edges. A smart solution to this is the formation of segregated, rather than continuous, grains. The in-situ, bottom-up formation of polycrystalline perovskite films can be templated by a combination of substrate effects, additives, and solvents. Surprisingly, careful control of these factors gave rise to the spontaneous formation of discrete islands of perovskite crystals with controllable size and packing density (Fig. 3). Randomly distributed perovskite crystals act as discrete emitters and scatterers, which, when combined with sequentially deposited layers, form convex structures. Due to the high reflectivity of the electrodes, these convex domes effectively function as microlenses to facilitate the extraction of light that would otherwise be confined to waveguide modes. This unique \"discrete island&ndash;convex dome\" morphology resulted in dramatically increased OCE, and thus highly efficient perovskite LEDs (Fig. 4).</p><img class=\"project-fig\" src=\"/assets/img/projects/templated-mhp-fig4.jpg\" alt=\"Device structure of a perovskite LED and simulated outcoupling efficiency\"><p class=\"text-muted\"><em>Fig. 4. (a) Device structure of a perovskite LED. ZnO/PEIE is the carrier (hole) transport layer as well as the substrate templating isolated grain formation when perovskites are deposited. (b) A scheme of the \"discrete island-convex dome\" structure, with light emitted from perovskites being efficiently reflected and concentrated. (c,d) Simulated OCE with varying packing density and grain height. [3]</em></p><p>In summary, crystallization is a holistic process that involves both internal and external factors. Modern semiconductors come with considerable compositional complexity, yet this also brings exciting opportunities for templated crystallization. The concept of \"molecular templating\" raised here in metal-halide perovskites illustrates how complex control in optoelectronic devices can converge to simple molecular reasons, highlighting the hierarchical aspect of our molecular design.</p><p class=\"text-muted\"><em>Note: the writing here conveys a perspective of the field.</em></p><p><strong>Read more:</strong></p><p>[1] <u><a href=\"https://www.nature.com/articles/s41589-024-01722-1\" target=\"_blank\">Genetic Control over Biogenic Crystal Morphogenesis in Zebrafish</a></u><br><span class=\"text-muted\"><span class=\"pub-journal\">Nat. Chem. Biol.</span> 2025, 21, 383-392.</span></p><p>[2] <u><a href=\"https://www.nature.com/articles/s41560-025-01906-6\" target=\"_blank\">Ionic Liquids Improve the Long-Term Stability of Perovskite Solar Cells</a></u><br><span class=\"text-muted\">Xu, W.&dagger;; Shao, W.&dagger;; Tang, Y.; Lin, C.; Yang, H.; Yang, Y. -T.; <span class=\"mentee\">Kim, J. H.</span>; Lee, G.; Kumar, P.; Pedersen, K. R.; Coffey, A. H.; Harvey, S. P.; Graham, K. R.; Zhu, C.; Zhu, K.; Dou, L.*</span><br><span class=\"text-muted\"><span class=\"pub-journal\">Nat. Energy</span> 2025.</span></p><p>[3] <u><a href=\"https://www.nature.com/articles/s41467-024-55075-3\" target=\"_blank\">Grain Engineering For Efficient Near-Infrared Perovskite Light-Emitting Diodes</a></u><br><span class=\"text-muted\">Baek, S. -B.&dagger;; Shao, W.&dagger;; Feng, W. -J.; Tang, Y.; Lee, Y. H.; Loy, J.; Gunnarsson, W. B.; Yang, H.; Zhang, Y.; Faheem, M. B.; Kaswekar, P. I.; Atapattu, H. R.; Coffey, A.; Park, J. Y.; Yang, S. J.; Yang, Y. -T.; Zhu, C.; Wang, K.; Graham, K.; Gao, F.; Qiao, Q.; Guo, L. J.; Rand, B.; Dou, L.*</span><br><span class=\"text-muted\"><span class=\"pub-journal\">Nat. Commun.</span> 2024, 15, 10760.</span></p>"
  },
```

**Entry 4 — `organic-phosphors`** (from `prj1_phosphor.html`, "PAST PROJECTS"):

```json
  {
    "slug": "organic-phosphors",
    "title": "First Principles Design of Organic Phosphors",
    "summary": "A heavy-atom-oriented design strategy (HAAM) enables metal-free organic molecules to achieve fast, efficient, near-unity room-temperature phosphorescence for OLEDs, sensors, and data encryption.",
    "image": "/assets/img/projects/organic-phosphors.jpg",
    "body": "<img class=\"project-fig\" src=\"/assets/img/projects/organic-phosphors.jpg\" alt=\"Heavy-atom-oriented orbital angular momentum manipulation in organic phosphors\"><p>Metal-free purely organic phosphors (POPs) may emit phosphorescence at room temperature. \"Metal-free\" distinguishes them from organometallic complexes, which generally rely on expensive and toxic noble-metal elements (Ir, Pt, etc.) as light-emitting centers. The key to POP design is connecting structures with excited-state profiles that allow efficient triplet exciton harvesting, which is generally governed by spin-orbit coupling (SOC) to alleviate spin-forbidden triplet-singlet transitions. However, efficient SOC relies on heavy nuclei to generate large electronic momentum, and the absence of a metal center makes it extremely difficult to harvest triplet excitons from POPs. For decades, POPs, especially in their pristine single-molecule state, were known to exhibit long lifetimes in the 10-millisecond-to-second regime with low or negligible phosphorescence quantum yield at room temperature, where considerable non-radiative decay competes with radiative triplet emission. These limitations significantly restrict POPs' performance in solid-state lighting, necessitating a universal design rule for organic molecules to exhibit fast and efficient phosphorescence.</p><p>We presented a new design strategy for fast and efficient POPs, named the \"heavy-atom-oriented orbital angular momentum manipulation\" (HAAM) strategy. The HAAM concept envisioned that the greatest amplification of the intrinsic SOC constants could be achieved when the orbitals of heavy atoms directly undergo an angular momentum change during the triplet-singlet transition. We identified selenium as a perfect heavy-atom candidate satisfying the HAAM concept, where its soft 4p electrons can readily couple to nearby molecular orbitals, and the p<sub>x</sub>-p<sub>z</sub> transition considerably varies the orbital angular momentum &mdash; which, serendipitously, sits on a heavy nucleus. The HAAM strategy was subsequently verified and benchmarked both computationally and experimentally using a series of selenium-based POPs, so that theory, simulation, and structural design converge.</p><p>The impact of the HAAM concept on the community was substantial. By establishing a direct bridge between orbital angular momentum manipulation and structural design, the HAAM strategy opened up an expanded molecular library of fast and efficient POPs and a wider choice of heavy atoms, including selenium and even tellurium. These molecular backbones demonstrated near-unity phosphorescence quantum yield at room temperature and pushed the phosphorescence lifetime below 300 microseconds. Efficient organic light-emitting diodes (OLEDs) with external quantum efficiencies over 10% were demonstrated using these candidates. Our work has also inspired other researchers to continue expanding the molecular library and optimizing performance in OLEDs, sensors, and data encryption.</p><p><strong>Read more:</strong></p><p>[1] <u><a href=\"https://pubs.acs.org/doi/10.1021/acs.accounts.2c00146\" target=\"_blank\">Metal-Free Organic Phosphors toward Fast and Efficient Room-Temperature Phosphorescence</a></u><br><span class=\"text-muted\">Shao, W.; Kim, J.*</span><br><span class=\"text-muted\"><span class=\"pub-journal\">Acc. Chem. Res.</span> 2022, 55(11), 1573-1585.</span></p><p>[2] <u><a href=\"https://pubs.rsc.org/en/content/articlelanding/2022/sc/d1sc05689a\" target=\"_blank\">Heavy Atom Oriented Orbital Angular Momentum Manipulation in Metal-Free Organic Phosphors</a></u><br><span class=\"text-muted\">Shao, W.; Jiang, H.; Ansari, R.; Zimmerman, P.; Kim, J.*</span><br><span class=\"text-muted\"><span class=\"pub-journal\">Chem. Sci.</span> 2022, 13(3), 789-797.</span></p><p>[3] <u><a href=\"https://pubs.acs.org/doi/10.1021/acs.chemmater.0c00078\" target=\"_blank\">Heavy Atom Effect of Selenium for Metal-Free Phosphorescent Light-Emitting Diodes</a></u><br><span class=\"text-muted\">Lee, D. R.; Lee, K. H.; Shao, W.; Kim, C. L.; Kim, J.*; Lee, J. Y.*</span><br><span class=\"text-muted\"><span class=\"pub-journal\">Chem. Mater.</span> 2020, 32(6), 2583-2592.</span></p>"
  }
]
```

**Content-mapping decisions** (resolved during this plan's writing — documented here rather than left as open questions):

- **Array order**: `research-body.html`'s overview page lists ongoing projects first, then past projects: prj3 (topological nanowires, ongoing) → prj4 (nanolasers, past) → prj2 (templated MHP optoelectronics, past) → prj1 (organic phosphors, past). `projects.json` preserves this order.
- **"Miniaturized chiroptics" omitted**: `research-body.html`'s "ONGOING PROJECTS" section also lists a second card, "Miniaturized chiroptics," whose link is `href=""` and whose target page has no content ("Coming Soon"). There is nothing to migrate, so it is **not** included in `projects.json`. It can be added later as a normal JSON entry once the project has real content.
- **Slugs**: `topological-perovskite-nanowires` and `organic-phosphors` are newly chosen (descriptive, kebab-case, matching the `id`-in-URL convention). `perovskite-nanolasers` and `templated-perovskite-optoelectronics` are **fixed by Plan 2's `data/news.json`** "Read more →" links and must not be changed.
- **Image sourcing** (all 7 copied in Step 3 below):
  - `topological-nanowires.jpg` ← `day-version/research/research-project/prj3_TOC.jpg` (entry 1's hero/thumbnail)
  - `perovskite-nanolasers.jpg` ← `TOC/lasing_1.jpg` (entry 2's hero/thumbnail; this source file is **also** copied to `assets/img/publications/lasing_1.jpg` by Plan 4 — copying the same source figure into two destination directories for two different pages is the same pattern Plan 4 already established)
  - `templated-mhp-fig1.webp` / `-fig2.jpg` / `-fig3.jpg` / `-fig4.jpg` ← `day-version/research/research-project/prj2_fig1.webp` / `prj2_fig2.jpg` / `prj2_fig3.jpg` / `prj2_fig4.jpg` (entry 3's four in-article figures; `fig1.webp` doubles as entry 3's card-grid thumbnail)
  - `organic-phosphors.jpg` ← `day-version/research/research-project/prj1_TOC.jpg` (entry 4's hero/thumbnail)
- **`image` field usage — hero duplication accepted for entries 1, 2, 4; not for entry 3**: in the original prj3/prj4/prj1 pages, the article opens directly with a TOC/hero image (no caption), so `body`'s first element is `<img class="project-fig" src="{image}">` — the same file serves as both the card-grid thumbnail (`image`) and the in-article opening figure. The original prj2 page has **no** leading hero; its first figure ("Fig. 1", zebrafish) appears inline mid-article with its own caption. Duplicating it as an uncaptioned leading hero would be redundant, so entry 3's `body` does **not** repeat `image` as a leading figure — `templated-mhp-fig1.webp` appears once, inline, with its original caption. `image` is used only as entry 3's card-grid thumbnail.
- **Figure captions**: only entry 3 (prj2) has in-article figure captions (`Fig. 1`–`Fig. 4`, originally `<p class="research-caption">`). These become `<p class="text-muted"><em>...</em></p>` — reusing Plan 1's existing `.text-muted` class plus a plain `<em>`, so no new caption class is needed. The "Note: the writing here conveys a perspective of the field" line follows the same `<p class="text-muted"><em>...</em></p>` pattern already used in entry 2's "Note: ... MRS Fall 2024" line.
- **Reference updates to match Plan 4's now-published citations**: prj2's "Read more" originally cited two of the lab's own papers by their pre-publication status:
  - Ref [2] "Ionic Liquids Improve Perovskite Solar Cells Long-Term Stability" had `href=""` and "Submitted." — now published. Entry 3 uses the **published** title, authors (with `&dagger;`/`.mentee` for Kim, J.H.), and citation exactly as written in Plan 4's publication #20 (`Nat. Energy` 2025, DOI `s41560-025-01906-6`).
  - Ref [3] "Grain Engineering for Efficient Near-Infrared Perovskite Light-Emitting Diodes" — entry 3 uses the same title casing, author list, and citation as Plan 4's publication #19 (`Nat. Commun.` 2024, 15, 10760), for consistency between the two pages.
  - Ref [1] (the external zebrafish paper, `Nat. Chem. Biol.` 2025) is not a lab publication and has no Plan 4 counterpart; it is wrapped in the same `<span class="pub-journal">`/`.text-muted` markup for visual consistency only.
  - prj1's three "Read more" references match Plan 4's publications #8 (`Acc. Chem. Res.` 2022), #6 (`Chem. Sci.` 2022), and #2 (`Chem. Mater.` 2020) — entry 4 uses Plan 4's exact title casing/author formatting for these.
- **Light copy-editing during HTML conversion**: ligature characters from the source HTML (eﬃcient, ampliﬁcation, veriﬁed, reﬂectivity, conﬁned) are normalized to plain "fi"/"fl" spellings; a few subject-verb agreement issues in the original prose (e.g., "ionic liquid ... usually behave as liquid", "perovskites has become ... alternatives") are smoothed without changing scientific meaning. One figure-caption typo is fixed: prj2's Fig. 4 caption labeled both sub-panels "(c)" — the first is corrected to "(b)" since the caption describes panel (a), then (b), then (c,d).
- **Paragraph splitting**: the source HTML often joins 2-3 distinct paragraphs inside one `<p>` separated by `<br><br>`. These are split into separate `<p>` tags in `body` for cleaner semantics, matching how entries 1-2 were already written.
- **New CSS classes** (`.project-fig`, `.project-body`, `.project-card*`, `.project-grid` — Step 4 below) are introduced by this plan. No new classes are needed for figure captions, citations, or "Read more" blocks — those reuse `.text-muted` / `.mentee` / `.pub-journal` from Plans 1 and 4.

- [ ] **Step 2: Verify the JSON**

Run (from repo root):

```powershell
$data = Get-Content data/projects.json -Raw | ConvertFrom-Json
$data.Count
$data | Select-Object -ExpandProperty slug
```

Expected output:

```
4
topological-perovskite-nanowires
perovskite-nanolasers
templated-perovskite-optoelectronics
organic-phosphors
```

- [ ] **Step 3: Copy project images**

Run (from repo root):

```powershell
New-Item -ItemType Directory -Force assets/img/projects | Out-Null
Copy-Item "day-version/research/research-project/prj3_TOC.jpg" "assets/img/projects/topological-nanowires.jpg"
Copy-Item "TOC/lasing_1.jpg" "assets/img/projects/perovskite-nanolasers.jpg"
Copy-Item "day-version/research/research-project/prj2_fig1.webp" "assets/img/projects/templated-mhp-fig1.webp"
Copy-Item "day-version/research/research-project/prj2_fig2.jpg" "assets/img/projects/templated-mhp-fig2.jpg"
Copy-Item "day-version/research/research-project/prj2_fig3.jpg" "assets/img/projects/templated-mhp-fig3.jpg"
Copy-Item "day-version/research/research-project/prj2_fig4.jpg" "assets/img/projects/templated-mhp-fig4.jpg"
Copy-Item "day-version/research/research-project/prj1_TOC.jpg" "assets/img/projects/organic-phosphors.jpg"
(Get-ChildItem assets/img/projects).Count
```

Expected output: `7`

- [ ] **Step 4: Append project styles to `assets/css/style.css`**

Append to `assets/css/style.css`:

```css
/* ==========================================================================
   Research: Project Grid & Detail
   ========================================================================== */
.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

.project-card {
  display: block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  color: inherit;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.project-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.project-card__img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.project-card__body {
  padding: var(--space-3);
}

.project-card__title {
  margin-top: var(--space-1);
}

.project-card__summary {
  margin-top: var(--space-1);
  color: var(--color-text-muted);
}

.project-fig {
  display: block;
  width: 100%;
  border-radius: 12px;
}

.project-body > * {
  margin-top: var(--space-3);
}

.project-body > *:first-child {
  margin-top: 0;
}

.project-body > .project-fig + p {
  margin-top: var(--space-1);
}

@media (max-width: 760px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}
```

Notes:
- `.project-grid` is a 2-column grid for the 4 cards on `/research/index.html` (2x2), collapsing to 1 column under 760px.
- `.project-card` follows the same flat card pattern as `.person-card` (Plan 3) and `.pub-highlight` (Plan 4): `var(--color-surface)` background, `var(--color-border)` border, 12px radius, accent border + lift on hover.
- `.project-body > *` gives every direct child of the body container (paragraphs and figures alike) a consistent `var(--space-3)` top margin, with the first child reset to `0`. `.project-fig + p` (a caption immediately following a figure, entry 3 only) tightens to `var(--space-1)` so captions sit close to their figure.

- [ ] **Step 5: Commit**

```bash
git add data/projects.json assets/img/projects assets/css/style.css
git commit -m "Add research projects data, images, and project layout styles"
```

---

## Task 2: render-projects.js

**Files:**
- Create: `assets/js/render-projects.js`

- [ ] **Step 1: Write the renderer**

Write `assets/js/render-projects.js`:

```js
(function () {
  'use strict';

  function projectCardHTML(project) {
    return (
      '<a class="project-card" href="/research/project.html?id=' + project.slug + '">' +
        '<img class="project-card__img" src="' + project.image + '" alt="' + project.title + '">' +
        '<div class="project-card__body">' +
          '<h3 class="project-card__title">' + project.title + '</h3>' +
          '<p class="project-card__summary">' + project.summary + '</p>' +
        '</div>' +
      '</a>'
    );
  }

  function renderGrid(grid, projects) {
    var html = '';
    for (var i = 0; i < projects.length; i++) {
      html += projectCardHTML(projects[i]);
    }
    grid.innerHTML = html;
  }

  function renderDetail(titleEl, bodyEl, projects) {
    var id = new URLSearchParams(window.location.search).get('id');
    var project = null;
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].slug === id) {
        project = projects[i];
        break;
      }
    }

    if (!project) {
      titleEl.textContent = 'Project Not Found';
      bodyEl.innerHTML = '<p>Sorry, we could not find that project. <a href="/research/">Return to Research &rarr;</a></p>';
      return;
    }

    titleEl.textContent = project.title;
    bodyEl.innerHTML = project.body;
    document.title = project.title + ' — W. Shao Laboratory';
  }

  var grid = document.getElementById('project-grid');
  var titleEl = document.getElementById('project-title');
  var bodyEl = document.getElementById('project-body');

  if (!grid && !(titleEl && bodyEl)) return;

  fetch('/data/projects.json')
    .then(function (res) { return res.json(); })
    .then(function (projects) {
      if (grid) renderGrid(grid, projects);
      if (titleEl && bodyEl) renderDetail(titleEl, bodyEl, projects);
    })
    .catch(function (err) {
      console.error('Failed to load projects:', err);
    });
})();
```

- [ ] **Step 2: Validate syntax**

Run:

```bash
node --check assets/js/render-projects.js
```

Expected: no output (success).

- [ ] **Step 3: Commit**

```bash
git add assets/js/render-projects.js
git commit -m "Add render-projects.js for research card grid and project template"
```

---

## Task 3: Research pages

**Files:**
- Create: `research/index.html`
- Create: `research/project.html`

- [ ] **Step 1: Write the research landing page**

Write `research/index.html`:

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

  <meta name="description" content="Research — W. Shao Laboratory. Organic self-assembly and organic-inorganic hybrid materials for next-generation optoelectronics.">
  <meta name="robots" content="index,follow">
  <title>Research — W. Shao Laboratory</title>
</head>
<body>
  <div id="site-nav"></div>

  <main>
    <section class="container">
      <h1 class="section-heading">Research</h1>
      <p class="text-muted">Organic self-assembly and organic-inorganic hybrid materials for next-generation optoelectronics.</p>
      <div id="project-grid" class="project-grid"></div>
    </section>
  </main>

  <div id="site-footer"></div>

  <script src="/assets/js/render-projects.js" defer></script>
  <script src="/assets/js/partials.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Write the project template page**

Write `research/project.html`:

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

  <meta name="description" content="Research project — W. Shao Laboratory.">
  <meta name="robots" content="index,follow">
  <title>Research Project — W. Shao Laboratory</title>
</head>
<body>
  <div id="site-nav"></div>

  <main>
    <section class="container">
      <h1 id="project-title" class="section-heading">Loading&hellip;</h1>
      <div id="project-body" class="project-body"></div>
      <p class="section-heading--spaced"><a class="link-arrow" href="/research/">&larr; All Research Projects</a></p>
    </section>
  </main>

  <div id="site-footer"></div>

  <script src="/assets/js/render-projects.js" defer></script>
  <script src="/assets/js/partials.js" defer></script>
</body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add research/index.html research/project.html
git commit -m "Add data-driven Research landing and project template pages"
```

---

## Task 4: Hiring page

**Files:**
- Modify: `assets/partials/footer.html` (the "Leave a message" button gets a shared class)
- Modify: `assets/js/partials.js` (modal-open wiring becomes class-based)
- Create: `hiring/index.html`

- [ ] **Step 1: Make the "Leave a message" trigger reusable**

The footer's "Leave a message" button currently has a unique `id="open-message-modal"`, and `partials.js` wires it with `getElementById`. The Hiring page (Step 3 below) needs a **second** button, in the page body, that opens the same modal. Switch to a class-based trigger so any number of buttons can open `#message-modal`.

In `assets/partials/footer.html`, find:

```html
    <button type="button" class="link-arrow" id="open-message-modal">Leave a message &rarr;</button>
```

Replace with:

```html
    <button type="button" class="link-arrow js-open-message-modal">Leave a message &rarr;</button>
```

- [ ] **Step 2: Wire all `.js-open-message-modal` buttons**

In `assets/js/partials.js`, inside `loadFooter()`, find:

```js
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
```

Replace with:

```js
        var openBtns = document.querySelectorAll('.js-open-message-modal');
        var closeBtn = document.getElementById('close-message-modal');
        var modal = document.getElementById('message-modal');
        if (!closeBtn || !modal) return;

        for (var i = 0; i < openBtns.length; i++) {
          openBtns[i].addEventListener('click', function (e) {
            e.preventDefault();
            modal.style.display = 'flex';
          });
        }
        closeBtn.addEventListener('click', function () {
          modal.style.display = 'none';
        });
```

This runs after `mount.outerHTML = html` (the footer injection), so `.js-open-message-modal` matches both the footer's own button and any already-present page-body button (Step 3) in one pass.

- [ ] **Step 3: Write the Hiring page**

Write `hiring/index.html`:

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

  <meta name="description" content="Hiring — W. Shao Laboratory. Open positions and how to get in touch.">
  <meta name="robots" content="index,follow">
  <title>Hiring — W. Shao Laboratory</title>
</head>
<body>
  <div id="site-nav"></div>

  <main>
    <section class="container">
      <h1 class="section-heading">Open Positions</h1>
      <p>There are no open positions in the lab at this time. However, we are always happy to hear from motivated students and researchers interested in organic self-assembly and organic-inorganic hybrid materials.</p>
      <p>If you would like to introduce yourself and share your background, please get in touch.</p>
      <p><button type="button" class="link-arrow js-open-message-modal">Leave a message &rarr;</button></p>
    </section>
  </main>

  <div id="site-footer"></div>

  <script src="/assets/js/partials.js" defer></script>
</body>
</html>
```

`hiring/index.html` has no page-specific `render-*.js` — it is static, per spec §3.5.

- [ ] **Step 4: Commit**

```bash
git add assets/partials/footer.html assets/js/partials.js hiring/index.html
git commit -m "Add Hiring placeholder page and make the message modal trigger reusable"
```

---

## Task 5: Manual verification

**Files:** none (verification only)

- [ ] **Step 1: Start a local server**

Run (from repo root):

```bash
npx --yes serve . -l 5000
```

Expected: "Accepting connections at http://localhost:5000"

- [ ] **Step 2: Verify the Research landing page**

Open `http://localhost:5000/research/`:

- [ ] A 2x2 grid of 4 cards renders, each with an image, title, and one-sentence summary: "Topologically Modified Hybrid Layered Materials", "Deterministic Synthesis of Layered Perovskite Room-Temperature Nanolasers", "Templated Crystallization in Metal-Halide Perovskite Optoelectronics", "First Principles Design of Organic Phosphors" — in that order.
- [ ] Hovering a card lifts it slightly and highlights the border in the accent color.
- [ ] Clicking each card navigates to `/research/project.html?id=<slug>` with the matching slug.
- [ ] Resize to <760px: the grid collapses to a single column.

- [ ] **Step 3: Verify each project template page**

- [ ] `http://localhost:5000/research/project.html?id=topological-perovskite-nanowires` — `<h1>` shows "Topologically Modified Hybrid Layered Materials"; body shows the hero image, 3 paragraphs, and a "Read more" with 1 reference (Science 2024).
- [ ] `http://localhost:5000/research/project.html?id=perovskite-nanolasers` — `<h1>` shows "Deterministic Synthesis of Layered Perovskite Room-Temperature Nanolasers"; body shows the hero image, 6 paragraphs (including the MRS Fall 2024 note), and "Read more" with 3 references (Science 2024, arXiv preprint "Under Review", JACS 2026).
- [ ] `http://localhost:5000/research/project.html?id=templated-perovskite-optoelectronics` — `<h1>` shows "Templated Crystallization in Metal-Halide Perovskite Optoelectronics"; body shows 4 figures (`templated-mhp-fig1.webp` through `-fig4.jpg`) each with an italic `Fig. N` caption directly beneath it, the "perspective of the field" note, and "Read more" with 3 references — confirm reference [2] shows "Ionic Liquids Improve the Long-Term Stability of Perovskite Solar Cells" linking to the `nature.com/articles/s41560-025-01906-6` DOI (not "Submitted.").
- [ ] `http://localhost:5000/research/project.html?id=organic-phosphors` — `<h1>` shows "First Principles Design of Organic Phosphors"; body shows the hero image, 3 paragraphs, and "Read more" with 3 references (Acc. Chem. Res. 2022, Chem. Sci. 2022, Chem. Mater. 2020).
- [ ] `http://localhost:5000/research/project.html?id=does-not-exist` — `<h1>` shows "Project Not Found" and the body shows a "Return to Research →" link back to `/research/`.
- [ ] On each project page, the "← All Research Projects" link below the body returns to `/research/`.
- [ ] In dark mode, `.text-muted` captions/citations and `.pub-journal`/`.mentee` spans (entries 2 and 3) use the dark-theme colors defined in Plans 1 and 4.

- [ ] **Step 4: Verify cross-plan links into Research**

- [ ] On `http://localhost:5000/home/`, the "Latest News" section's two research-related "Read more →" links navigate to `/research/project.html?id=perovskite-nanolasers` and `/research/project.html?id=templated-perovskite-optoelectronics`, and both render correctly (per Step 3).
- [ ] On `http://localhost:5000/home/`, the gallery section's non-Science tiles link to `/research/` and land on the card grid.
- [ ] On `http://localhost:5000/home/`, the "View All Research →" link navigates to `/research/`.

- [ ] **Step 5: Verify the Hiring page**

Open `http://localhost:5000/hiring/`:

- [ ] `<h1>` shows "Open Positions", followed by the two paragraphs of placeholder text.
- [ ] Clicking "Leave a message →" in the page body opens the same `#message-modal` as the footer's link (centered modal, Name/Email/Message fields, Send button). Closing it (✕ or click outside) works.
- [ ] The footer's own "Leave a message →" link still opens the modal too (confirms the Task 4 retrofit didn't break the existing trigger).
- [ ] The nav highlights "Hiring" as the active link.

- [ ] **Step 6: Console check**

- [ ] On `/research/`, `/research/project.html?id=organic-phosphors`, and `/hiring/`, open the browser console and confirm there are **no errors**.
