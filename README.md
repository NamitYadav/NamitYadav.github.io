# namityadav.github.io

Personal CV site. Astro + Tailwind 4, deployed to GitHub Pages by Actions.

- `npm run dev` — dev server
- `npm run check && npm run build && npm run verify` — what CI runs
- Case studies: `src/content/work/*.md`. Posts: `src/content/posts/*.md` (`draft: true` hides one).
- Title line, summary, How I work principles, experience, skills, links: `src/data/cv.ts`. CV file: `public/Namit_Yadav_CV.pdf`.
- Content rules and internal links (every `/path` and `#anchor` in `dist`) are checked by `scripts/verify.mjs`; see `docs/superpowers/specs/`.
- Analytics: cookie-free GoatCounter (`namit-yadav.goatcounter.com`), loaded in `Base.astro`. Hero and footer contact links send `hero: <label>` / `footer: <label>` click events. Localhost is not counted.
