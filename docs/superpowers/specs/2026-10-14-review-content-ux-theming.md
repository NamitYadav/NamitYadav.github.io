# Review: content, UX and theming

**Date:** 2026-10-14
**Scope:** The site as of `1ec0699`. All copy in `cv.ts` and the four case studies, plus a browser pass on both themes at 1280px and 375px with contrast measured on every visible text node.
**Baseline:** `check`, `build` and `verify` all pass. The contrast check finds no failures in Gruvbox or Gruvbox light, and there is no overflow at 375px.
**Deliverable:** this report, then fixes on approval in one commit. **Status (2026-10-14):** all approved and landed. C4 needed no change: the case-study pages still render three tiles, so the comment still holds. Contrast after T1/T2: light hover 8.42:1, dark hover 5.29:1.

Severity: P2 real issue · P3 polish. Resume-bound copy (the 11+ years, the Hevo bullets, the "Frontend Enthusiast" title line) is out of scope by Namit's earlier decisions.

## Content

| # | Sev | Where | Defect → fix |
|---|---|---|---|
| C1 | P2 | `work/react-18-migration.md` Problem | Says "Two React majors … behind". In Jul 2024, when the work started, React 18 was the only newer major; 19 went stable in Dec 2024. An interviewer who knows the dates will catch it. → "A React major and four Node LTS lines behind". |
| C2 | P3 | `work/module-federation.md` | The case study's title is the micro-frontend, but half of the Approach covers other work: the document generator and Cypress. The "teams in the TMS: 6" metric is context, not an outcome. → Cut the doc-gen and Cypress bullets, since the experience bullets already cover them. Replace the metric with one that is an outcome, e.g. "daily deploys". |
| C3 | P3 | `README.md` | "Title line, summary, hero stats, …" — the hero stats were removed in `a7712cb`. → Drop "hero stats". |
| C4 | P3 | `components/Stat.astro` comment | "so three tiles don't fill the first screen" describes the deleted home stats row. Stat now serves only the case-study pages. → Update the comment. |

## Theming

| # | Sev | Where | Defect → fix |
|---|---|---|---|
| T1 | P3 | `index.astro` primary CTA, light | `hover:bg-emerald-800` isn't remapped, so Gruvbox light's CTA hover turns Tailwind's teal-green (`oklch(43.2% .095 166.9)`), off-palette. → Add `--color-emerald-800` to the gruvbox block (e.g. `#4a470b`). |
| T2 | P3 | Same, dark | `dark:hover:bg-emerald-500` equals `-400` (`#b8bb26`), so the dark CTA has no hover feedback. → `dark:hover:bg-emerald-600` (`#98971a`, dark text still passes). |

## Cross-app (with interview-prep, same origin)
- interview-prep is getting a System theme that resolves to the same Gruvbox pair (its round-9 X1/X2). After that, both apps follow the OS by default. They keep separate storage keys, which is fine.
- `verify.mjs` checks only this repo's `dist`. interview-prep's public surfaces are scrubbed by hand in its round 9, X1.
