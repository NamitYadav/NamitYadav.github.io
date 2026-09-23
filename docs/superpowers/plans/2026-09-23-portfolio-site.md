# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship https://namityadav.github.io/ — a static CV site (hero, four case studies, experience, skills, optional posts) built with Astro, deployed by GitHub Actions to GitHub Pages.

**Architecture:** Astro static site, one HTML file per page. Case studies and posts are markdown content collections with zod-validated frontmatter; experience/skills/links are a typed TypeScript module. Tailwind 4 with the theme CSS, fonts and four themes copied verbatim from `~/personal/interview-prep`. Zero client JS except two `is:inline` scripts (pre-paint theme, theme toggle). A 40-line Node script enforces the content rules after every build.

**Tech Stack:** Node 22+ (local is 24), Astro ^7.3, `@tailwindcss/vite` ^4.3, `@astrojs/sitemap` ^3.7, `@astrojs/rss` ^4.0, `@astrojs/check` ^0.9 + TypeScript ^5.9 (not 7: check's peer range is `^5 || ^6`). No test framework; the checks are `astro check`, `astro build`, `scripts/verify.mjs`.

**Spec:** `docs/superpowers/specs/2026-09-23-portfolio-design.md`

## Global Constraints

- Site URL `https://namityadav.github.io`, `base: '/'`. Repo `NamitYadav/NamitYadav.github.io`, branch `main`.
- **Relocation is never mentioned** anywhere in built HTML (verify fails on `/relocat/i`).
- **Phone number never appears** (verify fails on it).
- Public email is `namityadav2007@gmail.com`. GitHub `https://github.com/NamitYadav`. LinkedIn `https://www.linkedin.com/in/namit1211/`.
- CV served at `/Namit_Yadav_CV.pdf`; link text "Download CV (PDF)".
- Work slugs are public URLs and fixed: `react-18-migration`, `feature-flags`, `data-grid-consolidation`, `module-federation`. Link form `/work/<slug>/` (trailing slash, Astro `directory` build format).
- Theme: `data-theme` on `<html>`, values `dark` (default) · `light` · `gruvbox` · `gruvbox-light`, localStorage key `portfolio:theme`.
- Title pattern: home `Namit Yadav · Frontend Tech Lead`; other pages `<page> · Namit Yadav`.
- Case-study markdown uses exactly these H2s in order: Context · Problem · Approach · Outcome. ("What I'd do differently" is added per study once Namit writes it.)
- Content questions for Namit are listed in Task 8's handoff, not embedded in the markdown. If a `<!-- TODO(namit): ... -->` comment is ever added to `src/content/**/*.md`, verify fails while it remains.
- No new runtime dependencies beyond the Tech Stack list. No `@tailwindcss/typography`.
- Commit after every task. Author is already configured in the repo (`Namit Yadav <namityadav2007@gmail.com>`). End every commit message with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Run every command from the repo root `/Users/namit/personal/namityadav.github.io`.

## Review Focus

1. **A work entry with 0 or 4 metrics, or a missing `order`,** must fail `astro build` with a schema error, not render a broken card. Pinned in Task 2 (bad-frontmatter probe).
2. **A post with `draft: true`** must not appear in `/writing/`, have no `/writing/<slug>/` page, and be absent from `rss.xml`. Pinned in Task 6.
3. **Zero published posts** must produce no `/writing/` page, no "Writing" nav item, no Writing section, no RSS `<link>`; `rss.xml` still builds but is empty and unreferenced. Pinned in Task 6.
4. **`TODO(namit)` inside an HTML comment in markdown** must still fail verify even though browsers hide comments. Verify scans the markdown sources, not just dist. Pinned in Task 7.
5. **A garbage or unknown value in `localStorage['portfolio:theme']`** (e.g. `"solarized"`, `""`) must leave the page on the default dark theme, not set `data-theme="solarized"`. Pinned in Task 3 (script whitelists values; checked with a node one-liner against the emitted HTML).

---

### Task 1: Scaffold, styles, static assets, green build

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `src/pages/index.astro` (placeholder, replaced in Task 4)
- Create: `public/robots.txt`, `public/favicon.svg`
- Copy: `public/fonts/*` from interview-prep, `public/Namit_Yadav_CV.pdf` from `~/Downloads/Namit_Yadav_Resume_2026.pdf`
- Modify: `.gitignore` (already has `node_modules`, `dist`, `.astro`; nothing to add, just confirm)

**Interfaces:**
- Produces: `npm run dev|build|check|verify|preview`; `src/styles/global.css` with Tailwind, fonts, theme variables, `.prose`, print rules. Every later task imports nothing else for styling.

- [ ] **Step 1: package.json**

```json
{
  "name": "namityadav.github.io",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "check": "astro check",
    "verify": "node scripts/verify.mjs",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/rss": "^4.0.19",
    "@astrojs/sitemap": "^3.7.4",
    "astro": "^7.3.4"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.10",
    "@tailwindcss/vite": "^4.3.3",
    "tailwindcss": "^4.3.3",
    "typescript": "^5.9.3"
  }
}
```

- [ ] **Step 2: astro.config.mjs**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://namityadav.github.io',
  base: '/',
  integrations: [sitemap()],
  // ponytail: no syntax highlighting; .prose styles code blocks with theme vars.
  // Turn shiki back on with a dual light/dark theme if a post needs it.
  markdown: { syntaxHighlight: false },
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Copy static assets**

```bash
mkdir -p public/fonts scripts
cp ../interview-prep/public/fonts/GeistMonoNerdFont-Regular.woff2 ../interview-prep/public/fonts/GeistMonoNerdFont-Medium.woff2 ../interview-prep/public/fonts/GeistMonoNerdFont-SemiBold.woff2 ../interview-prep/public/fonts/LICENSE-GeistMono-NerdFont.txt public/fonts/
cp ~/Downloads/Namit_Yadav_Resume_2026.pdf public/Namit_Yadav_CV.pdf
ls -la public/fonts public/Namit_Yadav_CV.pdf
```
Expected: four font files (~29–31 KB each woff2, 4 KB license) and the PDF.

- [ ] **Step 5: public/robots.txt and public/favicon.svg**

`public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://namityadav.github.io/sitemap-index.xml
```

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#09090b"/><text x="50" y="70" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-weight="600" font-size="62" fill="#34d399">N</text></svg>
```

- [ ] **Step 6: src/styles/global.css**

The `@font-face`, `@theme`, `@custom-variant dark`, gruvbox palette, `html`/`:root`/`body`, cursor/transition, focus ring and reduced-motion blocks are copied verbatim from `../interview-prep/src/index.css`. Only the `.animate-fade-in`, view-transition and comment text about interview-prep components are dropped. `.prose` and print are new.

```css
@import "tailwindcss";

/* GeistMono Nerd Font, self-hosted from public/fonts (Nerd Fonts release, OFL — see
   the LICENSE file beside them). One face for the whole site, so --font-sans and
   --font-mono resolve to the same family. Weights 400/500/600 only, Latin subset. */
@font-face {
  font-family: 'GeistMono Nerd Font';
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/GeistMonoNerdFont-Regular.woff2') format('woff2');
}
@font-face {
  font-family: 'GeistMono Nerd Font';
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/GeistMonoNerdFont-Medium.woff2') format('woff2');
}
@font-face {
  font-family: 'GeistMono Nerd Font';
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/GeistMonoNerdFont-SemiBold.woff2') format('woff2');
}

@theme {
  --font-sans: 'GeistMono Nerd Font', ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-mono: 'GeistMono Nerd Font', ui-monospace, SFMono-Regular, Menlo, monospace;
}

/* dark: fires for the two dark themes (dark, gruvbox) but not for light or
   gruvbox-light, which reuse the undecorated classes as their palette. */
@custom-variant dark (&:where([data-theme='dark'] *, [data-theme='dark'], [data-theme='gruvbox'] *, [data-theme='gruvbox']));

/* Gruvbox is a palette swap and nothing else: redefining Tailwind's color variables
   remaps every existing zinc/emerald/red/amber utility in place, so no component
   needs to know a second theme exists. gruvbox-light shares this ramp and renders the
   undecorated (non-dark:) classes. */
[data-theme='gruvbox'], [data-theme='gruvbox-light'] {
  --color-white: #fbf1c7;
  --color-black: #1d2021;
  --color-zinc-50: #fbf1c7;
  --color-zinc-100: #ebdbb2;
  --color-zinc-200: #d5c4a1;
  --color-zinc-300: #bdae93;
  --color-zinc-400: #a89984;
  --color-zinc-500: #928374;
  --color-zinc-600: #7c6f64;
  --color-zinc-700: #504945;
  --color-zinc-800: #3c3836;
  --color-zinc-900: #282828;
  --color-zinc-950: #1d2021;

  --color-emerald-50: #f2f0c9;
  --color-emerald-400: #b8bb26;
  --color-emerald-500: #b8bb26;
  --color-emerald-600: #98971a;
  --color-emerald-700: #5f5c0e;
  --color-emerald-950: #3c3a15;

  --color-red-400: #ff6b5b;
  --color-red-500: #fb4934;
  --color-red-600: #cc241d;
  --color-red-700: #9d0006;

  --color-amber-100: #f9e2a0;
  --color-amber-400: #fabd2f;
  --color-amber-500: #fabd2f;
  --color-amber-600: #d79921;
  --color-amber-900: #5c4a11;
}

/* 18px on a default browser, as a percentage so a raised default scales up. */
html { font-size: 112.5%; scroll-behavior: smooth; }
:root { color-scheme: dark; }
[data-theme='light'], [data-theme='gruvbox-light'] { color-scheme: light; }
body { @apply bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 antialiased; }

button, a, label, select, summary, [role='button'] { cursor: pointer; }
a, button, [role='button'] {
  transition: color 150ms ease, background-color 150ms ease, border-color 150ms ease, opacity 150ms ease;
}

@layer base {
  :focus-visible {
    outline: 2px solid var(--color-emerald-500);
    outline-offset: 2px;
  }
}

/* Markdown bodies (case studies, posts). Hand-written; no typography plugin. */
.prose { @apply leading-relaxed text-zinc-800 dark:text-zinc-200; }
.prose > * + * { margin-top: 1em; }
.prose h2 { @apply mt-10 text-lg font-semibold text-zinc-900 dark:text-zinc-100; }
.prose h3 { @apply mt-6 font-semibold text-zinc-900 dark:text-zinc-100; }
.prose ul { @apply list-disc pl-6; }
.prose ol { @apply list-decimal pl-6; }
.prose li + li { margin-top: 0.25em; }
.prose a { @apply text-emerald-700 underline underline-offset-2 dark:text-emerald-400; }
.prose strong { @apply font-semibold text-zinc-900 dark:text-zinc-100; }
.prose code { @apply rounded bg-zinc-200 px-1 py-0.5 text-[0.9em] dark:bg-zinc-800; }
.prose pre { @apply overflow-x-auto rounded-md border border-zinc-200 bg-zinc-100 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900; }
.prose pre code { @apply bg-transparent p-0; }
.prose blockquote { @apply border-l-2 border-zinc-300 pl-4 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400; }
.prose hr { @apply border-zinc-200 dark:border-zinc-800; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}

/* Print = fallback CV. Browsers drop backgrounds; force black on white so the
   dark themes don't print light text on white paper. Chrome hides itself with
   Tailwind's print:hidden at the call site. */
@media print {
  html { font-size: 11pt; }
  html, body { background: #fff !important; }
  body, body * { color: #000 !important; border-color: #999 !important; }
  a { text-decoration: none; }
}
```

- [ ] **Step 7: Placeholder page so the build has an entry**

`src/pages/index.astro`:
```astro
---
import '../styles/global.css';
---
<html lang="en" data-theme="dark">
  <head><meta charset="utf-8" /><title>Namit Yadav</title></head>
  <body class="p-8">scaffold</body>
</html>
```

- [ ] **Step 8: Install and build**

```bash
npm install && npm run build && ls dist && grep -o "GeistMonoNerdFont" dist/_astro/*.css | wc -l
```
Expected: `dist/` contains `index.html`, `_astro/`, `fonts/`, `Namit_Yadav_CV.pdf`, `favicon.svg`, `robots.txt`, `sitemap-index.xml`. The count is `3` (three font faces in the bundled CSS). If `npm install` warns about a TypeScript peer, confirm `typescript` resolved to 5.x with `npm ls typescript`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold astro site with theme css and static assets

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Data and content (cv.ts, collections, four case studies)

**Files:**
- Create: `src/data/cv.ts`
- Create: `src/content.config.ts`
- Create: `src/content/work/react-18-migration.md`, `feature-flags.md`, `data-grid-consolidation.md`, `module-federation.md`
- Create: `src/content/posts/.gitkeep`

**Interfaces:**
- Produces from `src/data/cv.ts`: `summary: string`, `titleLine: string`, `stats: { value: string; label: string }[]`, `experience: Role[]`, `skills: { group: string; items: string[] }[]`, `education: string`, `languages: string`, `links: { email, github, linkedin, cv }` (all strings; `email` is the bare address, callers add `mailto:`).
- Produces collections `work` (schema below, entry `id` = slug) and `posts` (`title, date: Date, description, tags, draft`).

- [ ] **Step 1: src/data/cv.ts**

```ts
export type Bullet = { text: string; work?: string }; // work = case-study slug to link
export type Role = {
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: Bullet[];
};

export const titleLine = 'Frontend Tech Lead · 11+ years · React at scale';

export const summary =
  'Frontend engineer with 11+ years building and maintaining large React single-page applications. ' +
  'Recent work spans large-scale framework migrations, progressive-rollout and feature-flag infrastructure, ' +
  'and automated quality gates across multi-app codebases.';

export const stats = [
  { value: '6 apps', label: 'migrated React 17→18 & Node 14→22' },
  { value: '734 → 215', label: 'Snyk vulnerabilities, critical −81%' },
  { value: '95+ → 1', label: 'data grids onto one implementation (ADR)' },
];

export const links = {
  email: 'namityadav2007@gmail.com',
  github: 'https://github.com/NamitYadav',
  linkedin: 'https://www.linkedin.com/in/namit1211/',
  cv: '/Namit_Yadav_CV.pdf',
};

export const experience: Role[] = [
  {
    company: 'Zinier',
    role: 'Technical Lead – Frontend',
    location: 'Bengaluru',
    period: 'Jul 2024 – present',
    bullets: [
      {
        text: 'Led migration of 6 frontend applications from React 17 to 18.3.1 and Node 14 to 22, upgrading the state and routing chain in one coordinated move (Redux 5, React Router 6.26). Snyk-reported vulnerabilities 734 → 215, critical issues down 81% (64 → 12).',
        work: 'react-18-migration',
      },
      {
        text: 'Built feature-flag and experimentation infrastructure in the shared component library (Firebase Remote Config, GA4), shipped across three applications; used it to roll out a major component rewrite per organisation behind a flag with automatic fallback.',
        work: 'feature-flags',
      },
      {
        text: 'Authored the ADR consolidating 95+ data grids onto a single @tanstack/react-table implementation: three phases sequenced by risk, a QA checkpoint per phase, defined rollback triggers.',
        work: 'data-grid-consolidation',
      },
      {
        text: 'Introduced visual regression testing (Storybook, Playwright) and added lint, unit-test and CSS-lint gates to every deployment pipeline. Built a Slack code-review bot tracking PR review quality. Mentored engineers through structured 1:1s and contributed to frontend hiring.',
      },
    ],
  },
  {
    company: 'Forto',
    role: 'Senior Frontend Engineer',
    location: 'Berlin',
    period: 'Dec 2020 – Jun 2024',
    bullets: [
      {
        text: "Owned frontend delivery end to end for the Process & Workflows team, one of six cross-functional teams building Forto's Transport Management System.",
      },
      {
        text: "Built the team's micro-frontend with Webpack Module Federation, decoupling its release cycle from the other teams' and allowing independent deployment.",
        work: 'module-federation',
      },
      {
        text: 'Built the document-generation component for shipping paperwork (House Bill of Lading and related freight documents) via pdfgeneratorapi — legally operative documents where a data error delays a shipment.',
        work: 'module-federation',
      },
      {
        text: 'Introduced end-to-end testing with Cypress; contributed reusable components to the centralised design system used by all six teams; mentored junior engineers and ran onboarding.',
      },
    ],
  },
  {
    company: 'Hevo',
    role: 'Frontend Engineer',
    location: 'Bengaluru',
    period: 'Dec 2019 – Oct 2020',
    bullets: [
      { text: 'Engineered the frontend for a high-scale data integration platform, maintaining >90% code coverage through TDD.' },
      { text: 'Partnered with backend and QA to architect end-to-end features from conception to production.' },
    ],
  },
  {
    company: 'Empyra',
    role: 'Technical Lead – Frontend',
    location: 'Bengaluru',
    period: 'Nov 2017 – Dec 2019',
    bullets: [
      { text: 'Promoted from Senior Frontend Engineer. Led a team of five engineers delivering the Cynaptx Career Services portal.' },
      { text: 'Drove the departmental shift from class components to React Hooks, improving reusability and team velocity.' },
    ],
  },
  {
    company: 'Appunfold',
    role: 'Frontend Developer',
    location: 'Bengaluru',
    period: 'Mar 2017 – Nov 2017',
    bullets: [{ text: 'Built the front end for Appunfold (now UserIQ), a mobile customer-experience platform.' }],
  },
  {
    company: 'Infosys',
    role: 'Senior Systems Engineer',
    location: 'Bengaluru',
    period: 'Jul 2014 – Mar 2017',
    bullets: [
      { text: 'Built a bank loan-origination application (Java, Ext JS) for Goldman Sachs and engineered securities data queries in SecDb.' },
    ],
  },
];

export const skills = [
  { group: 'Technical leadership', items: ['ADRs', 'Technical strategy', 'Mentorship', 'Project management', 'RCA', 'Progressive delivery'] },
  { group: 'Core frontend', items: ['JavaScript (ES6+)', 'TypeScript', 'React', 'Node', 'CSS Modules', 'Webpack'] },
  { group: 'State & architecture', items: ['Redux', 'MobX', 'React Context', 'Module Federation'] },
  { group: 'Testing & quality', items: ['Jest', 'React Testing Library', 'Cypress', 'Playwright', 'Visual regression', 'TDD', 'Feature flags'] },
  { group: 'Infrastructure & tools', items: ['CI/CD', 'Git', 'Performance optimisation', 'Responsive web design'] },
  { group: 'AI-assisted development', items: ['Codemods', 'Agent-assisted refactoring', 'Prompt design for code generation'] },
];

export const education = 'B.Tech (CSE), Inderprastha Engineering College, Ghaziabad · 2010 – 2014';
export const languages = 'English, Hindi';
```

- [ ] **Step 2: src/content.config.ts**

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    period: z.string(),
    summary: z.string(),
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).min(1).max(3),
    tags: z.array(z.string()),
    order: z.number(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, posts };
```

- [ ] **Step 3: Four case studies**

Drafted from resume facts only. Nothing is asserted that the resume does not carry; the open questions that would deepen each study are listed in Task 8's handoff for Namit to answer in the markdown later.

`src/content/work/react-18-migration.md`:
```md
---
title: "Six apps from React 17 to 18 and Node 14 to 22, in one move"
company: Zinier
period: "2024 – 2025"
summary: "One coordinated upgrade of framework, runtime, state and routing across six production apps, cutting Snyk-reported vulnerabilities by 71%."
metrics:
  - { label: "apps migrated", value: "6" }
  - { label: "Snyk vulnerabilities", value: "734 → 215" }
  - { label: "critical issues", value: "−81%" }
tags: [React, Node, Migration, Security]
order: 1
---

## Context

Zinier's field-service platform is six React single-page applications sharing one component library. When I joined as frontend tech lead in 2024 they were all on React 17 and Node 14.

## Problem

Two React majors and four Node LTS releases behind, with 734 Snyk-reported vulnerabilities, 64 of them critical, that could not be cleared without moving the dependency tree. Migrating one app at a time would have left the shared library supporting two React majors for the whole period, doubling every library change.

## Approach

- Upgraded the whole chain in one coordinated move, React 18.3.1, Node 22, Redux 5, React Router 6.26, so the shared library only ever targeted one set of peer versions.
- Held each app to the existing lint, unit-test and visual-regression gates before it shipped.

## Outcome

All six apps on React 18 and Node 22. Snyk vulnerabilities went from 734 to 215 and critical issues from 64 to 12, an 81% reduction.

```

`src/content/work/feature-flags.md`:
```md
---
title: "Feature flags and experimentation in the shared component library"
company: Zinier
period: "2024 – 2025"
summary: "Flag and experiment infrastructure built once in the shared library and shipped in three apps, used to roll out a major component rewrite per organisation with automatic fallback."
metrics:
  - { label: "apps using it", value: "3" }
  - { label: "rollout unit", value: "per organisation" }
  - { label: "fallback", value: "automatic" }
tags: [Feature flags, Progressive delivery, Firebase, GA4]
order: 2
---

## Context

Three of Zinier's apps needed to ship a rewrite of a central component to customers with very different risk tolerances. There was no shared way to turn a change on for one organisation and off for another.

## Problem

Without flags, a rewrite ships to everyone at once or not at all. A regression for one large customer becomes an incident for all of them, and a rollback means a redeploy.

## Approach

- Built the flag and experimentation layer in the shared component library, backed by Firebase Remote Config for the flag values and GA4 for exposure and outcome events, so every app got it by upgrading the library.
- Rolled the component rewrite out per organisation behind a flag, with automatic fallback to the legacy implementation when the new path failed.

## Outcome

The rewrite reached production one organisation at a time, and turning it off for a customer became a config change instead of a release.

```

`src/content/work/data-grid-consolidation.md`:
```md
---
title: "Consolidating 95+ data grids onto one implementation"
company: Zinier
period: "2025"
summary: "An architecture decision record moving 95+ hand-rolled data grids onto a single @tanstack/react-table implementation, sequenced in three risk-ordered phases with rollback triggers."
metrics:
  - { label: "grids consolidated", value: "95+" }
  - { label: "target implementations", value: "1" }
  - { label: "phases", value: "3" }
tags: [Architecture, ADR, TanStack Table, Migration]
order: 3
---

## Context

Across six apps, tables had been built one at a time for years. The count passed 95, spread over several grid libraries and copy-pasted variants.

## Problem

Every grid fix, accessibility improvement or design change had to be made dozens of times. The cost of a table feature scaled with the number of grids, not the difficulty of the feature.

## Approach

- Wrote the ADR: one `@tanstack/react-table` implementation in the shared library, with the decision, alternatives and consequences written down for review.
- Split the migration into three phases sequenced by risk, low-traffic internal grids first, customer-facing grids last.
- Put a QA checkpoint at the end of each phase and defined the rollback triggers in advance, so the decision to stop was made before anyone was under pressure.

## Outcome

The record fixed the shape of the migration before any code moved: one target implementation, three risk-ordered phases, a QA checkpoint after each, and rollback triggers agreed up front.

```

`src/content/work/module-federation.md`:
```md
---
title: "A team micro-frontend with Webpack Module Federation"
company: Forto
period: "2020 – 2024"
summary: "Decoupled the Process & Workflows team's release cycle from five other teams inside Forto's Transport Management System, and built the component that generates legally operative shipping documents."
metrics:
  - { label: "teams in the TMS", value: "6" }
  - { label: "release cycle", value: "independent" }
  - { label: "documents", value: "HBL & freight" }
tags: [Micro-frontends, Module Federation, Webpack, Logistics]
order: 4
---

## Context

Forto's Transport Management System was built by six cross-functional teams. I owned frontend delivery for the Process & Workflows team.

## Problem

A single frontend build meant one team's release could be held up by another's unfinished work, and every deploy carried every team's risk.

## Approach

- Built the team's micro-frontend with Webpack Module Federation, exposing our workflows as remotes consumed by the host shell, so we deployed on our own schedule.
- Built the document-generation component for House Bills of Lading and related freight paperwork via pdfgeneratorapi. These documents are legally operative: a data error delays a shipment.
- Introduced end-to-end testing with Cypress and contributed reusable components to the design system used by all six teams.

## Outcome

The team released independently of the other five, and shipping paperwork was produced from validated data inside the TMS.

```

- [ ] **Step 4: Empty posts folder**

```bash
mkdir -p src/content/posts && touch src/content/posts/.gitkeep
```

- [ ] **Step 5: Probe the schema (Review Focus 1)**

```bash
cat > src/content/work/tmp-bad.md <<'EOF'
---
title: "bad"
company: Zinier
period: "2025"
summary: "no metrics, no order"
metrics: []
tags: []
---
body
EOF
npx astro sync; echo "exit=$?"
rm src/content/work/tmp-bad.md
npx astro sync; echo "exit=$?"
```
Expected: first `exit=1` with a zod error naming `metrics` (too small) and `order` (required); second `exit=0`. If `astro sync` exits 0 with the bad file present, it is not validating unused collections in this Astro version: leave the bad file in place, run `npm run build` instead (still expected to fail with the same zod error), then delete it.

- [ ] **Step 6: Type check**

```bash
npm run check
```
Expected: `0 errors`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "content: cv data, work and posts collections, four case-study drafts

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Base layout, theme toggle, 404

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/ThemeToggle.astro`, `src/pages/404.astro`
- Modify: `src/pages/index.astro` (use Base; still placeholder body)

**Interfaces:**
- Produces `Base.astro` props `{ title: string; description: string; ogType?: 'website' | 'article' }`, a default slot rendered inside `<main id="main">`. Nav shows Work, Experience, and Writing only when a published post exists.
- Consumes `links` from `src/data/cv.ts`; `posts` collection.

- [ ] **Step 1: src/components/ThemeToggle.astro**

```astro
---
const themes = [
  ['dark', 'Dark'],
  ['light', 'Light'],
  ['gruvbox', 'Gruvbox'],
  ['gruvbox-light', 'Gruvbox light'],
] as const;
---
<div class="grid grid-cols-2 gap-1" role="group" aria-label="Theme">
  {themes.map(([value, label]) => (
    <button
      type="button"
      data-theme-value={value}
      aria-pressed="false"
      class="rounded border border-zinc-300 px-2 py-0.5 text-xs text-zinc-600 hover:border-zinc-500 aria-pressed:border-emerald-600 aria-pressed:text-emerald-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:aria-pressed:border-emerald-400 dark:aria-pressed:text-emerald-400"
    >{label}</button>
  ))}
</div>
<script is:inline>
  (function () {
    var root = document.documentElement;
    var buttons = document.querySelectorAll('[data-theme-value]');
    function sync() {
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.themeValue === root.dataset.theme));
      });
    }
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        root.dataset.theme = b.dataset.themeValue;
        try { localStorage.setItem('portfolio:theme', b.dataset.themeValue); } catch (e) {}
        sync();
      });
    });
    sync();
  })();
</script>
```

- [ ] **Step 2: src/layouts/Base.astro**

```astro
---
import '../styles/global.css';
import { getCollection } from 'astro:content';
import ThemeToggle from '../components/ThemeToggle.astro';
import { links } from '../data/cv';

interface Props {
  title: string;
  description: string;
  ogType?: 'website' | 'article';
}
const { title, description, ogType = 'website' } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const ogImage = new URL('/og.png', Astro.site);
const hasPosts = (await getCollection('posts', ({ data }) => !data.draft)).length > 0;
const nav: [string, string][] = [
  ['Work', '/#work'],
  ['Experience', '/#experience'],
  ...(hasPosts ? [['Writing', '/writing/'] as [string, string]] : []),
];
const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Namit Yadav',
  jobTitle: 'Frontend Tech Lead',
  url: Astro.site?.href,
  sameAs: [links.github, links.linkedin],
};
const contact: [string, string][] = [
  ['Download CV (PDF)', links.cv],
  ['Email', `mailto:${links.email}`],
  ['GitHub', links.github],
  ['LinkedIn', links.linkedin],
];
---
<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="sitemap" href="/sitemap-index.xml" />
    {hasPosts && <link rel="alternate" type="application/rss+xml" title="Namit Yadav · Writing" href="/rss.xml" />}
    <meta property="og:type" content={ogType} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:site_name" content="Namit Yadav" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#09090b" />
    <script type="application/ld+json" set:html={JSON.stringify(person)} />
    <script is:inline>
      // Runs before first paint so the page never flashes the default theme.
      // Key duplicated in ThemeToggle.astro; keep the two in sync.
      try {
        var t = localStorage.getItem('portfolio:theme');
        if (t === 'light' || t === 'gruvbox' || t === 'gruvbox-light') document.documentElement.dataset.theme = t;
      } catch (e) {}
    </script>
  </head>
  <body class="min-h-screen flex flex-col">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-emerald-600 focus:px-3 focus:py-2 focus:text-white">Skip to content</a>
    <header class="print:hidden border-b border-zinc-200 dark:border-zinc-800">
      <nav aria-label="Main" class="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <a href="/" class="font-semibold text-zinc-900 hover:text-emerald-700 dark:text-zinc-100 dark:hover:text-emerald-400">namit yadav</a>
        <div class="flex items-center gap-4">
          <ul class="flex gap-4 text-sm">
            {nav.map(([label, href]) => (
              <li><a href={href} class="text-zinc-600 hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-400">{label}</a></li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
    <main id="main" class="mx-auto w-full max-w-3xl flex-1 px-4 pb-16">
      <slot />
    </main>
    <footer class="print:hidden border-t border-zinc-200 dark:border-zinc-800">
      <div class="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-zinc-600 dark:text-zinc-400">
        <ul class="flex flex-wrap gap-4">
          {contact.map(([label, href]) => (
            <li><a href={href} class="hover:text-emerald-700 dark:hover:text-emerald-400">{label}</a></li>
          ))}
        </ul>
        <p>© {new Date().getFullYear()} Namit Yadav</p>
      </div>
    </footer>
  </body>
</html>
```

- [ ] **Step 3: src/pages/404.astro**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Not found · Namit Yadav" description="This page does not exist.">
  <section class="py-24">
    <p class="text-xs font-semibold uppercase tracking-widest text-zinc-500">404</p>
    <h1 class="mt-2 text-2xl font-semibold">Nothing here.</h1>
    <p class="mt-4"><a href="/" class="text-emerald-700 underline underline-offset-2 dark:text-emerald-400">Back to the start</a></p>
  </section>
</Base>
```

- [ ] **Step 4: Point index.astro at Base (placeholder body)**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Namit Yadav · Frontend Tech Lead" description="placeholder">
  <p class="py-12">scaffold</p>
</Base>
```

- [ ] **Step 5: Build and inspect**

```bash
npm run check && npm run build && grep -o '<meta property="og:[a-z_]*" content="[^"]*"' dist/index.html && grep -c 'aria-pressed' dist/index.html && grep -o 'href="/writing/"' dist/index.html; echo "writing-links=$?"; ls dist/404.html
```
Expected: og:type/title/description/url/image/site_name lines with `content="https://namityadav.github.io/"` for url; `4` aria-pressed buttons; `writing-links=1` (no Writing nav item since there are no posts); `dist/404.html` exists.

- [ ] **Step 6: Theme-script whitelist (Review Focus 5)**

```bash
node -e "
const html = require('fs').readFileSync('dist/index.html','utf8');
const m = html.match(/<script>([\s\S]*?portfolio:theme[\s\S]*?)<\/script>/);
if (!m) throw new Error('theme script missing');
for (const v of ['solarized','','dark']) {
  const doc = { documentElement: { dataset: { theme: 'dark' } } };
  const localStorage = { getItem: () => v };
  new Function('document','localStorage', m[1])(doc, localStorage);
  if (doc.documentElement.dataset.theme !== 'dark') throw new Error('accepted '+JSON.stringify(v));
}
const doc = { documentElement: { dataset: { theme: 'dark' } } };
new Function('document','localStorage', m[1])(doc, { getItem: () => 'gruvbox' });
if (doc.documentElement.dataset.theme !== 'gruvbox') throw new Error('rejected gruvbox');
console.log('theme script ok');
"
```
Expected: `theme script ok`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: base layout with meta, theme toggle, nav, footer and 404

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Home page

**Files:**
- Create: `src/components/Section.astro`, `src/components/Stat.astro`, `src/components/WorkCard.astro`
- Modify: `src/pages/index.astro` (replace placeholder)

**Interfaces:**
- `Section` props `{ id: string; label: string }`, slot.
- `Stat` props `{ value: string; label: string }`.
- `WorkCard` props `{ entry: CollectionEntry<'work'> }`, links to `/work/${entry.id}/`.
- Consumes everything exported from `src/data/cv.ts` and the `work` collection.

- [ ] **Step 1: Section.astro**

```astro
---
interface Props { id: string; label: string }
const { id, label } = Astro.props;
---
<section id={id} class="scroll-mt-20 py-10">
  <h2 class="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
    <span>{label}</span>
    <span class="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" aria-hidden="true"></span>
  </h2>
  <slot />
</section>
```

- [ ] **Step 2: Stat.astro**

```astro
---
interface Props { value: string; label: string }
const { value, label } = Astro.props;
---
<div class="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
  <p class="text-xl font-semibold text-emerald-700 dark:text-emerald-400">{value}</p>
  <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
</div>
```

- [ ] **Step 3: WorkCard.astro**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props { entry: CollectionEntry<'work'> }
const { entry } = Astro.props;
const { title, company, period, summary, metrics, tags } = entry.data;
---
<a href={`/work/${entry.id}/`} class="group block rounded-md border border-zinc-200 bg-white p-5 hover:border-emerald-600 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-400">
  <p class="text-xs text-zinc-500 dark:text-zinc-400">{company} · {period}</p>
  <h3 class="mt-1 font-semibold text-zinc-900 group-hover:text-emerald-700 dark:text-zinc-100 dark:group-hover:text-emerald-400">{title}</h3>
  <p class="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{summary}</p>
  <dl class="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
    {metrics.map((m) => (
      <div>
        <dt class="sr-only">{m.label}</dt>
        <dd><span class="font-semibold text-emerald-700 dark:text-emerald-400">{m.value}</span> <span class="text-zinc-500 dark:text-zinc-400">{m.label}</span></dd>
      </div>
    ))}
  </dl>
  <ul class="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400" aria-label="Tags">
    {tags.map((t) => <li class="rounded border border-zinc-200 px-1.5 py-0.5 dark:border-zinc-700">{t}</li>)}
  </ul>
</a>
```

- [ ] **Step 4: index.astro**

```astro
---
import { getCollection } from 'astro:content';
import Base from '../layouts/Base.astro';
import Section from '../components/Section.astro';
import Stat from '../components/Stat.astro';
import WorkCard from '../components/WorkCard.astro';
import { titleLine, summary, stats, experience, skills, education, languages, links } from '../data/cv';

const work = (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
const cta: [string, string][] = [
  ['Download CV (PDF)', links.cv],
  ['Email', `mailto:${links.email}`],
  ['GitHub', links.github],
  ['LinkedIn', links.linkedin],
];
const description = `${titleLine}. ${summary}`;
---
<Base title="Namit Yadav · Frontend Tech Lead" description={description}>
  <section class="py-12">
    <h1 class="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">Namit Yadav</h1>
    <p class="mt-2 text-emerald-700 dark:text-emerald-400">{titleLine}</p>
    <p class="mt-6 max-w-prose text-zinc-700 dark:text-zinc-300">{summary}</p>
    <div class="mt-8 grid gap-3 sm:grid-cols-3">
      {stats.map((s) => <Stat {...s} />)}
    </div>
    <ul class="print:hidden mt-8 flex flex-wrap gap-3">
      {cta.map(([label, href], i) => (
        <li>
          <a href={href} class:list={[
            'inline-block rounded-md border px-4 py-2 text-sm',
            i === 0
              ? 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 dark:border-emerald-400 dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-500'
              : 'border-zinc-300 text-zinc-800 hover:border-emerald-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-emerald-400',
          ]}>{label}</a>
        </li>
      ))}
    </ul>
    <p class="hidden print:block mt-4 text-sm">{links.email} · github.com/NamitYadav · linkedin.com/in/namit1211</p>
  </section>

  <Section id="work" label="Selected work">
    <div class="grid gap-4 sm:grid-cols-2">
      {work.map((entry) => <WorkCard entry={entry} />)}
    </div>
  </Section>

  <Section id="experience" label="Experience">
    <ol class="space-y-8">
      {experience.map((role) => (
        <li>
          <div class="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 class="font-semibold text-zinc-900 dark:text-zinc-100">{role.role} · {role.company}</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">{role.location} · {role.period}</p>
          </div>
          <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            {role.bullets.map((b) => (
              <li>
                {b.text}
                {b.work && <> <a href={`/work/${b.work}/`} class="text-emerald-700 underline underline-offset-2 dark:text-emerald-400">Case study →</a></>}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  </Section>

  <Section id="skills" label="Skills">
    <dl class="grid gap-4 sm:grid-cols-2">
      {skills.map((s) => (
        <div>
          <dt class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{s.group}</dt>
          <dd class="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{s.items.join(' · ')}</dd>
        </div>
      ))}
    </dl>
    <p class="mt-8 text-sm text-zinc-500 dark:text-zinc-400">{education} · {languages}</p>
  </Section>
</Base>
```

- [ ] **Step 5: Build and inspect**

```bash
npm run check && npm run build && for s in react-18-migration feature-flags data-grid-consolidation module-federation; do grep -c "href=\"/work/$s/\"" dist/index.html; done && grep -c 'href="/Namit_Yadav_CV.pdf"' dist/index.html && grep -c 'mailto:namityadav2007@gmail.com' dist/index.html && grep -ci 'relocat' dist/index.html
```
Expected: the four slug counts are ≥1 each (card plus experience links; module-federation appears 3 times); CV link `2` (hero + footer); mailto `2`; the last two greps print `0`.

- [ ] **Step 6: Eyeball once**

```bash
npm run preview &
sleep 2; curl -s http://localhost:4321/ | head -c 400; kill %1
```
Optional: open http://localhost:4321/ in a browser, switch all four themes, check the hero fits a 390px-wide viewport with the three stat tiles stacked. Fix spacing only if something overflows horizontally.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: home page with hero, work cards, experience and skills

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Case-study pages

**Files:**
- Create: `src/pages/work/[slug].astro`

**Interfaces:**
- Consumes `work` collection, `Stat`, `Base`. Produces `/work/<slug>/index.html` per entry, `ogType="article"`.

- [ ] **Step 1: src/pages/work/[slug].astro**

```astro
---
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import Base from '../../layouts/Base.astro';
import Stat from '../../components/Stat.astro';

export async function getStaticPaths() {
  const work = await getCollection('work');
  return work.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}
interface Props { entry: CollectionEntry<'work'> }
const { entry } = Astro.props;
const { title, company, period, summary, metrics, tags } = entry.data;
const { Content } = await render(entry);
---
<Base title={`${title} · Namit Yadav`} description={summary} ogType="article">
  <article class="py-12">
    <p class="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
      <a href="/#work" class="hover:text-emerald-700 dark:hover:text-emerald-400">Selected work</a> · {company} · {period}
    </p>
    <h1 class="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{title}</h1>
    <p class="mt-4 max-w-prose text-zinc-700 dark:text-zinc-300">{summary}</p>
    <div class="mt-6 grid gap-3 sm:grid-cols-3">
      {metrics.map((m) => <Stat value={m.value} label={m.label} />)}
    </div>
    <ul class="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400" aria-label="Tags">
      {tags.map((t) => <li class="rounded border border-zinc-200 px-1.5 py-0.5 dark:border-zinc-700">{t}</li>)}
    </ul>
    <div class="prose mt-10">
      <Content />
    </div>
    <p class="mt-12"><a href="/#work" class="text-emerald-700 underline underline-offset-2 dark:text-emerald-400">← All work</a></p>
  </article>
</Base>
```

- [ ] **Step 2: Build and inspect**

```bash
npm run check && npm run build && ls dist/work && grep -o '<meta property="og:type" content="[a-z]*"' dist/work/react-18-migration/index.html && grep -c '<h2' dist/work/react-18-migration/index.html && grep -o '<link rel="canonical" href="[^"]*"' dist/work/feature-flags/index.html
```
Expected: four directories; `og:type` `article`; `4` h2s; canonical `https://namityadav.github.io/work/feature-flags/`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: case-study pages

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Writing (posts, index, RSS, conditional sections)

**Files:**
- Create: `src/components/PostList.astro`, `src/pages/writing/[...index].astro`, `src/pages/writing/[slug].astro`, `src/pages/rss.xml.ts`
- Modify: `src/pages/index.astro` (Writing section when posts exist)

**Interfaces:**
- `PostList` props `{ posts: CollectionEntry<'posts'>[] }`.
- `/writing/` exists only when ≥1 published post (rest-param route returning zero paths otherwise). `/rss.xml` always builds; it has zero items and nothing links to it when there are no posts (Base already gates the `<link rel="alternate">` on `hasPosts`).
- Date shown as ISO `YYYY-MM-DD`.

- [ ] **Step 1: PostList.astro**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props { posts: CollectionEntry<'posts'>[] }
const { posts } = Astro.props;
const iso = (d: Date) => d.toISOString().slice(0, 10);
---
<ul class="space-y-6">
  {posts.map((p) => (
    <li>
      <p class="text-xs text-zinc-500 dark:text-zinc-400"><time datetime={iso(p.data.date)}>{iso(p.data.date)}</time></p>
      <h3 class="mt-1 font-semibold"><a href={`/writing/${p.id}/`} class="text-zinc-900 hover:text-emerald-700 dark:text-zinc-100 dark:hover:text-emerald-400">{p.data.title}</a></h3>
      <p class="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{p.data.description}</p>
    </li>
  ))}
</ul>
```

- [ ] **Step 2: src/pages/writing/[...index].astro**

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import PostList from '../../components/PostList.astro';

// Rest param + undefined = the bare /writing/ URL. Returning [] when there are
// no published posts means the page is not built at all.
export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.length ? [{ params: { index: undefined } }] : [];
}
const posts = (await getCollection('posts', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<Base title="Writing · Namit Yadav" description="Notes on frontend engineering, migrations and leading teams.">
  <section class="py-12">
    <h1 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Writing</h1>
    <div class="mt-8"><PostList posts={posts} /></div>
    <p class="mt-10 text-sm text-zinc-500 dark:text-zinc-400"><a href="/rss.xml" class="hover:text-emerald-700 dark:hover:text-emerald-400">RSS</a></p>
  </section>
</Base>
```

- [ ] **Step 3: src/pages/writing/[slug].astro**

```astro
---
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import Base from '../../layouts/Base.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}
interface Props { entry: CollectionEntry<'posts'> }
const { entry } = Astro.props;
const { title, date, description, tags } = entry.data;
const iso = date.toISOString().slice(0, 10);
const { Content } = await render(entry);
---
<Base title={`${title} · Namit Yadav`} description={description} ogType="article">
  <article class="py-12">
    <p class="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
      <a href="/writing/" class="hover:text-emerald-700 dark:hover:text-emerald-400">Writing</a> · <time datetime={iso}>{iso}</time>
    </p>
    <h1 class="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{title}</h1>
    <p class="mt-4 max-w-prose text-zinc-700 dark:text-zinc-300">{description}</p>
    {tags.length > 0 && (
      <ul class="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400" aria-label="Tags">
        {tags.map((t) => <li class="rounded border border-zinc-200 px-1.5 py-0.5 dark:border-zinc-700">{t}</li>)}
      </ul>
    )}
    <div class="prose mt-10"><Content /></div>
    <p class="mt-12"><a href="/writing/" class="text-emerald-700 underline underline-offset-2 dark:text-emerald-400">← All posts</a></p>
  </article>
</Base>
```

- [ ] **Step 4: src/pages/rss.xml.ts**

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return rss({
    title: 'Namit Yadav · Writing',
    description: 'Notes on frontend engineering, migrations and leading teams.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.description,
      link: `/writing/${p.id}/`,
    })),
  });
}
```

- [ ] **Step 5: Home Writing section**

In `src/pages/index.astro` frontmatter, add after the `work` line:
```ts
import PostList from '../components/PostList.astro';
const posts = (await getCollection('posts', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 3);
```
(Put the `import` with the other imports.) After the Skills `</Section>`, add:
```astro
  {posts.length > 0 && (
    <Section id="writing" label="Writing">
      <PostList posts={posts} />
      <p class="mt-8 text-sm"><a href="/writing/" class="text-emerald-700 underline underline-offset-2 dark:text-emerald-400">All posts →</a></p>
    </Section>
  )}
```

- [ ] **Step 6: Probe with temp posts (Review Focus 2 and 3)**

```bash
cat > src/content/posts/tmp-live.md <<'EOF'
---
title: "Live post"
date: 2026-09-01
description: "Visible."
tags: [test]
---
Body **live**.
EOF
cat > src/content/posts/tmp-draft.md <<'EOF'
---
title: "Draft post"
date: 2026-09-02
description: "Hidden."
draft: true
---
Body draft.
EOF
npm run check && npm run build
test -f dist/writing/index.html && echo "index built"
test -f dist/writing/tmp-live/index.html && echo "live built"
test ! -e dist/writing/tmp-draft && echo "draft absent"
grep -c "tmp-live" dist/rss.xml; grep -c "tmp-draft" dist/rss.xml
grep -c 'href="/writing/"' dist/index.html
grep -c 'rel="alternate"' dist/index.html
grep -c "tmp-draft" dist/sitemap-0.xml
```
Expected, in order: `index built`, `live built`, `draft absent`, `1`, `0`, `≥2` (nav + "All posts"), `1`, `0`.

Then remove and rebuild:
```bash
rm src/content/posts/tmp-live.md src/content/posts/tmp-draft.md
npm run build
test ! -e dist/writing && echo "no writing dir"
grep -c 'href="/writing/"' dist/index.html; grep -c 'rel="alternate"' dist/index.html
grep -c '<item>' dist/rss.xml
```
Expected: `no writing dir`, `0`, `0`, `0`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: writing section, post pages, index and rss, hidden until a post exists

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Content-rule verifier and OG image

**Files:**
- Create: `scripts/verify.mjs`, `public/og.png`

**Interfaces:**
- `npm run verify` reads `dist/` (override with `DIST=<dir>`) and `src/content/`; exit 1 with one `verify: <reason>` line per violation, exit 0 printing `verify: ok`.

- [ ] **Step 1: scripts/verify.mjs**

```js
// Content rules from the spec (§4.4). Node only, no dependencies.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const dist = process.env.DIST ?? 'dist';
let failed = false;
const fail = (msg) => { failed = true; console.error(`verify: ${msg}`); };
const walk = (dir, ext) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name), ext) : e.name.endsWith(ext) ? [join(dir, e.name)] : []);

if (!existsSync(join(dist, 'index.html'))) {
  console.error(`verify: ${dist}/index.html missing; run the build first`);
  process.exit(1);
}

for (const file of walk(dist, '.html')) {
  const html = readFileSync(file, 'utf8');
  if (/relocat/i.test(html)) fail(`${file} mentions relocation`);
  if (hasPhone(html)) fail(`${file} contains the phone number`);
}

// Markdown sources, not dist: an HTML comment survives into dist but a reader
// never sees it, and a TODO could also live in frontmatter that never renders.
for (const file of walk('src/content', '.md')) {
  if (readFileSync(file, 'utf8').includes('TODO(namit)')) fail(`${file} has an open TODO(namit)`);
}

const index = readFileSync(join(dist, 'index.html'), 'utf8');
if (!index.includes('href="/Namit_Yadav_CV.pdf"')) fail('index.html lacks the CV link');
if (!index.includes('href="mailto:namityadav2007@gmail.com"')) fail('index.html lacks the email link');
for (const file of walk('src/content/work', '.md')) {
  const slug = basename(file, '.md');
  if (!index.includes(`href="/work/${slug}/"`)) fail(`index.html lacks a link to /work/${slug}/`);
}
if (!existsSync('public/Namit_Yadav_CV.pdf')) fail('public/Namit_Yadav_CV.pdf missing');

if (failed) process.exit(1);
console.log('verify: ok');
```

- [ ] **Step 2: Self-check against a bad dist (Review Focus 4)**

```bash
BAD=/private/tmp/claude-502/-Users-namit-personal/9761d5a4-0ff5-4409-a2be-f450c7bba8e1/scratchpad/baddist
mkdir -p "$BAD/work/x" && printf '<p>Relocating soon, call <phone></p>' > "$BAD/index.html" && printf 'ok' > "$BAD/work/x/index.html"
printf -- '---\ntitle: t\ndate: 2026-01-01\ndescription: d\ndraft: true\n---\n<!-- TODO(namit): fixture -->\n' > src/content/posts/tmp-todo.md
DIST="$BAD" node scripts/verify.mjs; echo "exit=$?"
rm src/content/posts/tmp-todo.md
```
Expected: `exit=1` and lines containing `mentions relocation`, `contains the phone number`, `lacks the CV link`, `lacks the email link`, four `lacks a link to /work/…/` lines, and `src/content/posts/tmp-todo.md has an open TODO(namit)` (a draft post never reaches dist, which is why verify reads the sources).

- [ ] **Step 3: Run against the real build**

```bash
npm run build && npm run verify; echo "exit=$?"
```
Expected: `verify: ok`, `exit=0`.

- [ ] **Step 4: OG image (1200×630 PNG, made once)**

```bash
osascript -l JavaScript <<'EOF'
ObjC.import('AppKit');
var W = 1200, H = 630;
var img = $.NSImage.alloc.initWithSize($.NSMakeSize(W, H));
img.lockFocus;
$.NSColor.colorWithSRGBRedGreenBlueAlpha(0.035, 0.035, 0.043, 1).setFill;
$.NSRectFill($.NSMakeRect(0, 0, W, H));
function draw(text, size, y, color) {
  var attrs = $.NSMutableDictionary.alloc.init;
  attrs.setObjectForKey($.NSFont.fontWithNameSize('Menlo', size), $.NSFontAttributeName);
  attrs.setObjectForKey(color, $.NSForegroundColorAttributeName);
  $.NSString.stringWithString(text).drawAtPointWithAttributes($.NSMakePoint(80, y), attrs);
}
draw('Namit Yadav', 76, 330, $.NSColor.whiteColor);
draw('Frontend Tech Lead · 11+ years · React at scale', 34, 262, $.NSColor.colorWithSRGBRedGreenBlueAlpha(0.2, 0.83, 0.6, 1));
draw('namityadav.github.io', 28, 96, $.NSColor.colorWithSRGBRedGreenBlueAlpha(0.63, 0.63, 0.67, 1));
img.unlockFocus;
var rep = $.NSBitmapImageRep.imageRepWithData(img.TIFFRepresentation);
var png = rep.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $.NSDictionary.dictionary);
png.writeToFileAtomically('public/og.png', true);
EOF
sips -g pixelWidth -g pixelHeight public/og.png
```
Expected: 1200×630. On a Retina Mac the TIFF may come out 2400×1260; then run `sips -z 630 1200 public/og.png` and re-check. Open `public/og.png` once and confirm the three lines are legible. If the script errors for any reason, ship without `og.png` and remove the `og:image` meta from `Base.astro`; a missing image must not block launch.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: content-rule verifier and og image

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: CI, repo, first deploy

**Files:**
- Create: `.github/workflows/pages.yml`, `.github/dependabot.yml`, `README.md`

**Interfaces:**
- Pushes to `main` deploy; PRs build + verify only.

- [ ] **Step 1: .github/workflows/pages.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm run build
      - run: npm run verify
      - if: github.event_name != 'pull_request'
        uses: actions/upload-pages-artifact@v5
        with:
          path: dist
  deploy:
    needs: build
    if: github.event_name != 'pull_request'
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: .github/dependabot.yml**

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

- [ ] **Step 3: README.md**

```md
# namityadav.github.io

Personal CV site. Astro + Tailwind 4, deployed to GitHub Pages by Actions.

- `npm run dev` — dev server
- `npm run check && npm run build && npm run verify` — what CI runs
- Case studies: `src/content/work/*.md`. Posts: `src/content/posts/*.md` (`draft: true` hides one).
- Experience, skills, links: `src/data/cv.ts`. CV file: `public/Namit_Yadav_CV.pdf`.
- Content rules enforced by `scripts/verify.mjs`; see `docs/superpowers/specs/`.
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "ci: pages workflow, dependabot, readme

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

- [ ] **Step 5: Create the GitHub repo and push**

```bash
gh repo create NamitYadav/NamitYadav.github.io --public --source . --remote origin --push --description "Namit Yadav — frontend tech lead. CV and case studies."
gh api -X POST repos/NamitYadav/NamitYadav.github.io/pages -f build_type=workflow
```
Expected: repo created, `main` pushed, Pages configured with source "GitHub Actions". If the second call returns 409, Pages was already enabled; run `gh api -X PUT repos/NamitYadav/NamitYadav.github.io/pages -f build_type=workflow` instead.

- [ ] **Step 6: Watch the first run**

```bash
gh run list --limit 1
gh run watch "$(gh run list --limit 1 --json databaseId -q '.[0].databaseId')" --exit-status; echo "exit=$?"
```
Expected: both jobs green, `exit=0`. Then:
```bash
curl -sI https://namityadav.github.io/ | head -1
curl -s https://namityadav.github.io/ | grep -c 'href="/Namit_Yadav_CV.pdf"'
```
Expected: `HTTP/2 200`, `2`.

- [ ] **Step 7: Handoff**

Report to Namit: the live URL and the open questions below, each of which deepens one case study once answered in its markdown (add a "What I'd do differently" H2 to a study when he supplies the lesson). Do not answer them on his behalf.

  - ...
  - team size, and how many engineers worked on the migration alongside you.
  - what did the recipe look like in practice (codemods? a migration branch per app? a checklist)? How long did the whole thing take?
  - confirm "no rollback", or replace with what actually happened.
  - one honest lesson: something you would sequence differently, automate earlier, or not do.
  - what triggered the fallback (a runtime error boundary? a health check? a manual kill switch)? How was the rollout order of organisations chosen?
  - anything measurable: number of orgs rolled out, incidents avoided, time from first org to 100%.
  - one honest lesson.
  - which libraries or patterns were in use before, roughly how many of each.
  - which alternatives did the ADR reject (AG Grid? keep MUI DataGrid?) and why.
  - current status. How many grids migrated so far, what changed for the team, any measurable effect on time-to-change.
  - one honest lesson.
  - how were shared dependencies (React, the design system) versioned between host and remotes? Any incident the setup prevented or caused?
  - anything measurable: deploy frequency before/after, document volume.
  - one honest lesson.
