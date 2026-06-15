# W. Shao Laboratory Website

Source for the W. Shao Laboratory website (wenhao-shao.github.io) — Department of Chemistry, University of Georgia.

## Updating Content

Adding news, team members, research projects, publications, or photos? See **[CONTENT-GUIDE.md](CONTENT-GUIDE.md)** — a step-by-step guide that doesn't require any coding.

## For Developers

- **Pages** live in their own top-level folders (`/home/`, `/about/`, `/news/`, `/research/`, `/publications/`, `/hiring/`, `/facility/`, `/fun/`), each an `index.html`.
- **Content** is data-driven: editable lists in `/data/*.json` (news, people, projects, publications, gallery, nav) are fetched and rendered client-side by the matching `/assets/js/render-*.js` script.
- **Shared layout**: every page includes empty `<div id="site-nav">` / `<div id="site-footer">` placeholders, filled in at runtime by `/assets/js/partials.js` from `/assets/partials/nav.html` and `/assets/partials/footer.html`. Theming (light/dark) is handled by `/assets/js/theme.js`.
- **Styling**: a single shared stylesheet at `/assets/css/style.css`.
- **Preview locally**: `npx serve .` from the repo root, then open the printed local URL (root `/` redirects to `/home/`).
- **Deploy**: GitHub Pages serves the `main` branch directly — pushes to `main` go live within a minute or two, no build step.
