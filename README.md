# namityadav.github.io

Personal CV site. Astro + Tailwind 4, deployed to GitHub Pages by Actions.

- `npm run dev` — dev server
- `npm run check && npm run build && npm run verify` — what CI runs
- Case studies: `src/content/work/*.md`. Posts: `src/content/posts/*.md` (`draft: true` hides one).
- Title line, summary, hero stats, How I work principles, experience, skills, links: `src/data/cv.ts`. CV file: `public/Namit_Yadav_CV.pdf`.
- Content rules enforced by `scripts/verify.mjs`; see `docs/superpowers/specs/`.
