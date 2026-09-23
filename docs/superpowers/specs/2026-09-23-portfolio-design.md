# Portfolio site — design spec

**Date:** 2026-09-23
**Live target:** https://namityadav.github.io/ (repo `NamitYadav/NamitYadav.github.io`, GitHub Pages user site)
**Sibling:** https://namityadav.github.io/interview-prep/ keeps its own repo and subpath; nothing is shared at runtime.

## 1. Goal

A public CV site for the Berlin frontend job search (Nov 2026 start). A recruiter or hiring
manager lands, understands within 30 seconds who Namit is and what he has shipped, and can
do one of three things without hunting: download the CV, email, or read a case study.

Success criteria:
- Home page communicates title, years, and three headline outcomes above the fold on a phone.
- Download CV, Email, GitHub, LinkedIn reachable from the hero and the footer.
- Every case study and post has its own crawlable URL with correct title/description/OG tags
  so a LinkedIn share renders a card.
- Lighthouse (mobile) ≥ 95 on performance, accessibility, best practices, SEO. Static HTML,
  self-hosted font, no third-party requests.
- `npm run build` + `npm run verify` fail if the content rules in §4.4 are violated.

Non-goals for v1: analytics, contact form, i18n (German), dynamic OG images, comments,
search, headshot, CMS. Each is a later addition if a need shows up; none blocks the goal.

## 2. Decisions (from brainstorming, 2026-09-23)

| Topic | Decision |
|---|---|
| Audience | Berlin recruiters/hiring managers; job-search first, long-lived second |
| Sections | Hero + summary + CTA · Selected work (case studies) · Experience · Skills · Writing |
| Relocation | **Not mentioned anywhere on the site.** Not in copy, meta, or the CV link text. |
| Contact | Email `namityadav2007@gmail.com`, GitHub, LinkedIn, Download CV (PDF). **No phone number.** |
| Case studies | React 17→18 / Node 14→22 migration · Feature-flag & experimentation infra · 95+ data grids → tanstack ADR · Forto micro-frontend (Module Federation) |
| Writing | Markdown files in repo, built at build time. Section hidden when there are no published posts. |
| Hosting | User site at the root. `site: 'https://namityadav.github.io'`, `base: '/'`. |
| Look | Match interview-prep: GeistMono Nerd Font, zinc ramp, four themes (dark, light, gruvbox, gruvbox-light) |
| Stack | Astro (latest stable) + Tailwind CSS 4 via `@tailwindcss/vite`. Zero client JS except the theme toggle. |

Why Astro over the interview-prep Vite+React SPA: a CV site is documents, not an app.
Astro gives one static HTML file per page (shareable, indexable URLs), markdown content
collections with frontmatter validation built in, and no React runtime to ship. The
Tailwind theme CSS, fonts, Pages workflow and spec→plan→build process carry over unchanged.

## 3. Site map

| URL | Page | Notes |
|---|---|---|
| `/` | Home: single scroll page | Hero → Selected work (4 cards) → Experience → Skills → Writing (latest 3, if any) → Footer |
| `/work/<slug>/` | Case study | One per entry in `src/content/work/` |
| `/writing/` | Post index | All published posts, newest first. Only built when ≥1 post. |
| `/writing/<slug>/` | Post | One per published entry in `src/content/posts/` |
| `/Namit_Yadav_CV.pdf` | The resume | Static file in `public/`. Updating the CV = re-export PDF, replace file. |
| `/rss.xml` | Feed of posts | `@astrojs/rss`. Always built; empty and unlinked when there are no posts. |
| `/sitemap-index.xml` | Sitemap | `@astrojs/sitemap` |
| `/robots.txt` | Allow all, sitemap pointer | Static file in `public/` |
| `/404.html` | Not found | `src/pages/404.astro`; GitHub Pages serves it for unknown paths |

Navigation: a slim top bar with `Work`, `Experience`, `Writing` (anchors on home, real
links elsewhere) and the theme toggle. Footer repeats the four contact actions.

Slugs (fixed, they become public URLs):
`react-18-migration`, `feature-flags`, `data-grid-consolidation`, `module-federation`.

## 4. Content

### 4.1 Hero + summary
- Name, title line: `Frontend Tech Lead · 11+ years · React at scale`.
- Two-sentence summary adapted from the resume's opening paragraph (large React SPAs;
  migrations, progressive rollout, quality gates across multi-app codebases).
- Three headline metrics as a row of stat tiles:
  `6 apps migrated React 17→18 & Node 14→22` · `Snyk vulns 734→215, critical −81%` ·
  `95+ data grids → 1 implementation (ADR)`.
- CTA row: Download CV · Email · GitHub · LinkedIn.

### 4.2 Selected work (case studies)
`src/content/work/<slug>.md`, frontmatter validated by the collection schema:

```yaml
title: string
company: string           # Zinier | Forto
period: string            # "2024–2025"
summary: string           # one sentence, shown on the card
metrics: { label: string, value: string }[]   # 1–3, shown on card and page header
tags: string[]            # e.g. [React, Migration, Security]
order: number             # card order on home
```

Body structure, same headings in every study so they read as a set:
**Context** · **Problem** · **Approach** · **Outcome**, plus **What I'd do differently**
once Namit has written that lesson for a study.

v1 drafts (decision 2026-09-23: ship resume-only drafts) assert only what the resume
carries. Details it lacks (team size, timeline, a specific incident, a rejected
alternative) are listed as questions in the plan's handoff for Namit to fold in later. A
`<!-- TODO(namit): ... -->` comment may be used to park an open question in a file; the
verify script (§4.4) fails the build while any remains.

Resume facts each study starts from:
- **react-18-migration** — 6 frontend apps, React 17→18.3.1, Node 14→22, Redux 5 and
  React Router 6.26 upgraded in one coordinated move; Snyk vulnerabilities 734→215,
  critical 64→12 (−81%).
- **feature-flags** — flag and experimentation infra in the shared component library
  (Firebase Remote Config, GA4), shipped in three apps; used to roll out a major component
  rewrite per organisation behind a flag with automatic fallback to the legacy path.
- **data-grid-consolidation** — ADR consolidating 95+ data grids onto one
  `@tanstack/react-table` implementation; three phases sequenced by risk, QA checkpoint
  per phase, defined rollback triggers.
- **module-federation** — Forto TMS, Process & Workflows team (one of six); team
  micro-frontend via Webpack Module Federation decoupling the release cycle; also the
  document-generation component for legally operative shipping documents (HBL) via
  pdfgeneratorapi.

### 4.3 Experience, skills, links
Typed data in `src/data/cv.ts`, transcribed from the resume:
- `experience`: Zinier (Tech Lead – Frontend, Jul 2024–present), Forto (Senior FE,
  Dec 2020–Jun 2024), Hevo (FE, Dec 2019–Oct 2020), Empyra (Tech Lead – FE,
  Nov 2017–Dec 2019), Appunfold (FE Dev, Mar–Nov 2017), Infosys (Senior Systems Eng,
  Jul 2014–Mar 2017). Each: company, role, location, period, 2–4 bullets. Bullets that
  have a case study link to it.
- `skills`: the resume's six groups (Technical Leadership · Core Frontend ·
  State & Architecture · Testing & Quality · Infrastructure & Tools · AI-assisted
  development) rendered as a labelled list, not a bar chart.
- `education`, `languages`: one line each.
- `links`: email, GitHub `https://github.com/NamitYadav`, LinkedIn
  `https://www.linkedin.com/in/namit1211/`, CV path.

### 4.4 Content rules, enforced
`scripts/verify.mjs` runs after `astro build` in CI and locally (`npm run verify`). It reads
every `dist/**/*.html` and fails if:
- any file contains `relocat` (case-insensitive) or the phone number digits;
- any file contains `TODO(namit)`;
- `index.html` lacks a link to `/Namit_Yadav_CV.pdf`, a `mailto:namityadav2007@gmail.com`,
  and one `/work/<slug>/` link per work entry;
- `public/Namit_Yadav_CV.pdf` is missing.
~40 lines, Node only, no dependencies. This is the project's one runnable check besides
`astro check`.

### 4.5 Writing (posts)
`src/content/posts/<slug>.md` with frontmatter `title`, `date`, `description`,
`tags: string[]`, `draft: boolean = false`. Drafts are excluded from the build entirely (index,
pages, RSS, sitemap). The home Writing section, the Writing nav item, the RSS `<link>` and
the `/writing/` index are only generated when at least one published post exists, so v1 can
launch with the folder empty and nothing on the site points at a blank page. `/rss.xml`
itself always builds (a static endpoint cannot opt out); with no posts it is an empty,
unlinked feed.

## 5. Visual design

Copied from interview-prep, not shared as a package (two repos, two copies, no coupling):
- `public/fonts/GeistMonoNerdFont-{Regular,Medium,SemiBold}.woff2` + its LICENSE file.
- The `@font-face`, `@theme`, `@custom-variant dark`, and `[data-theme='gruvbox'],
  [data-theme='gruvbox-light']` palette blocks from `interview-prep/src/index.css` into
  `src/styles/global.css`. Single mono face for everything.
- Theme model: `data-theme` on `<html>`; values `dark` (default) · `light` · `gruvbox` ·
  `gruvbox-light`; localStorage key `portfolio:theme`; pre-paint inline script in the
  layout `<head>` identical in shape to interview-prep's. The toggle is a 2×2 button grid
  with `aria-pressed`, driven by ~15 lines of inline vanilla JS. No framework on the client.
- Layout: one column, `max-w-3xl`, generous vertical rhythm; section titles in the
  interview-prep style (small caps label + rule). Cards use the zinc surface pair.
- Markdown bodies get a hand-written `.prose` block (headings, paragraphs, lists, code,
  blockquote, links) using the same theme variables. No `@tailwindcss/typography`.
- Print stylesheet on the home page: hides nav/toggle/footer buttons, forces light
  palette, so "print to PDF" produces a readable one-page CV as a fallback to the real one.
- `prefers-reduced-motion` respected; the only motion is the theme cross-fade.

## 6. Components and files

```
NamitYadav.github.io/
├─ astro.config.mjs            site, integrations: tailwind (vite plugin), sitemap, rss handled in pages
├─ package.json                dev · build · check · verify · preview
├─ tsconfig.json               extends astro/tsconfigs/strict
├─ public/
│  ├─ fonts/…                  copied from interview-prep
│  ├─ Namit_Yadav_CV.pdf       input from Namit
│  ├─ og.png                   1200×630, name + title, made once by hand
│  ├─ favicon.svg              text glyph, like interview-prep
│  └─ robots.txt
├─ src/
│  ├─ styles/global.css        Tailwind import + theme blocks + .prose + print
│  ├─ content.config.ts        `work` and `posts` collections, zod schemas from §4
│  ├─ content/work/*.md        four case studies
│  ├─ content/posts/*.md       zero or more posts
│  ├─ data/cv.ts               experience, skills, education, languages, links
│  ├─ layouts/Base.astro       <head> (meta, OG, canonical, JSON-LD Person, theme script), nav, footer, skip link
│  ├─ components/
│  │  ├─ ThemeToggle.astro
│  │  ├─ Section.astro         label + rule + slot
│  │  ├─ Stat.astro            metric tile
│  │  ├─ WorkCard.astro
│  │  └─ PostList.astro
│  └─ pages/
│     ├─ index.astro
│     ├─ 404.astro
│     ├─ work/[slug].astro
│     ├─ writing/[...index].astro  rest route; getStaticPaths returns [] when no posts, so /writing/ is not built
│     ├─ writing/[slug].astro
│     └─ rss.xml.ts
├─ scripts/verify.mjs          §4.4
├─ .github/workflows/pages.yml same shape as interview-prep: npm ci → check → build → verify → upload → deploy
└─ docs/superpowers/specs/     this file, later plans
```

`Base.astro` props: `title`, `description`, optional `ogType`. Title pattern
`<page> · Namit Yadav`, home is `Namit Yadav · Frontend Tech Lead`. JSON-LD `Person` with
name, jobTitle, url, sameAs (GitHub, LinkedIn).

## 7. Build, CI, deploy

- `npm run dev` Astro dev server. `npm run build` → `dist/`. `npm run check` = `astro check`
  (TypeScript + frontmatter schemas). `npm run verify` = `node scripts/verify.mjs`.
- Workflow triggers: push to `main`, PRs to `main` (build + verify only), manual.
  Steps mirror interview-prep's `pages.yml`; the deploy job uses `actions/deploy-pages`
  with the `github-pages` environment. Node 22.
- Repo settings once: Pages source = GitHub Actions. No custom domain in v1.
- Dependabot for npm, weekly, same as interview-prep.

## 8. Accessibility

Landmarks (`header`/`nav`/`main`/`footer`), skip link, heading order, visible focus rings,
theme buttons with `aria-pressed`, link text that says what it does ("Download CV (PDF)"),
contrast already tuned in the copied gruvbox ramp, no motion beyond the theme fade.

## 9. Inputs needed from Namit before launch

1. ~~LinkedIn profile URL.~~ Provided: `https://www.linkedin.com/in/namit1211/`.
2. `Namit_Yadav_CV.pdf`: v1 ships the current resume
   (`~/Downloads/Namit_Yadav_Resume_2026.pdf`) as-is, per Namit. The verify script only
   scans built HTML, so the PDF's contents are Namit's call. Swap the file later if wanted.
3. Answers to the case-study questions listed in the plan's handoff (deepen the drafts later).
4. Optionally 1–2 posts; otherwise Writing stays hidden at launch.

## 10. Later, if needed

Analytics (Plausible or GA4 tag) · contact form (Formspree) · per-page OG images ·
German version · headshot · a `now` page · custom domain with CNAME.

## 11. Staff positioning pass (2026-09-23, after review)

Review found the site read as senior/lead: "Tech Lead" label everywhere, IC-voiced summary,
output metrics, no scope numbers, no statement of how Namit works. Decisions:

| Topic | Decision |
|---|---|
| Label | Official title kept: **Frontend Tech Lead** in the title line, home `<title>`, JSON-LD `jobTitle`, OG. Namit is not staff yet (2026-09-23); the summary carries staff-level scope so the reader infers the level. |
| Scope numbers (public) | 15 frontend engineers, 4 pods, 7 mentees, 6 apps, ~20 customer organisations; all 4 pods on the shared library and flag layer; reported bugs −30% after quality gates. |
| Hero stats | `4 of 4 pods` · `−30% bugs` · `95+ → 1` kept as the ADR *decision*, labelled so; delivery progress stays in the study. Snyk numbers move to the bullets. |
| Summary | Staff voice: functional lead, writes the decisions, builds the shared platform, owns the quality gates. |
| How I work | New home section `#how-i-work` (nav item too): five principles in `cv.ts`, each traceable to a case study. |
| Skills | Cut Git, Responsive web design, JavaScript (ES6+), "Prompt design"; add Hiring, Micro-frontends. |
| Case studies | Snyk card summary states 734 → 215 instead of a second percentage. Scope numbers and ADR review with pod leads added. React 18 "worked alone" reframed as proving the pattern before scaling with two juniors. |
| Fonts | Unchanged. interview-prep uses GeistMono only, so parity means mono everywhere. |
| Out of band | GitHub profile (bio, website, location, README) is Namit's to change; text supplied in chat. `Namit_Yadav_CV.pdf` still says "Frontend engineer" and carries the relocation line and phone by Namit's earlier decision; re-export when the CV is next updated. |
