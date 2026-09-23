export type Bullet = { text: string; work?: string }; // work = case-study slug to link
export type Role = {
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: Bullet[];
};

export const titleLine = 'Frontend Enthusiast · 11+ years · React at scale';

export const summary =
  "Functional lead for Zinier's frontend: 15 engineers in four pods, six React apps, around 20 customer organisations. " +
  'I write the architecture decisions, build the shared platform every pod ships on, and own the quality gates in every pipeline.';

// Short enough to survive a search-result snippet (~155-160 chars); the fuller
// on-page summary above is for humans already on the site.
export const shortDescription =
  'Frontend Tech Lead, 11+ years of React at scale. Functional lead for a 15-engineer frontend org; ' +
  'case studies on migrations, feature flags and ADRs.';

export const principles = [
  {
    title: 'Decide in writing',
    text: 'Architecture decisions go in an ADR with the rejected alternatives and the consequences, reviewed before code moves. The record is what lets fifteen engineers in four pods disagree once and then ship the same way.',
  },
  {
    title: 'Ship dark, roll out per customer',
    text: 'Large changes land on the main branch behind a flag and go live one organisation at a time, with the legacy path as the fallback. Rollback is a config change, not a release.',
  },
  {
    title: 'Put the gate ahead of the deploy',
    text: 'Lint, unit tests and visual regression run on every pipeline, not after an incident. Reported bugs fell 30% once the gates were in.',
  },
  {
    title: 'Migrate once, not per app',
    text: 'When six apps share one library, upgrading them in a single coordinated move beats six partial ones: the library targets one set of peer versions and nobody maintains two.',
  },
  {
    title: 'Write down what went wrong',
    text: 'Every case study here ends with what I would do differently. The estimate I got wrong and the test I added late are the most useful part of the record.',
  },
];

export const links = {
  email: 'namityadav2007@gmail.com',
  github: 'https://github.com/NamitYadav',
  linkedin: 'https://www.linkedin.com/in/namit1211/',
  cv: '/Namit_Yadav_CV.pdf',
};

// Hero buttons and footer; first entry is the primary CTA.
export const contactLinks: [string, string][] = [
  ['Download CV (PDF)', links.cv],
  ['Email', `mailto:${links.email}`],
  ['GitHub', links.github],
  ['LinkedIn', links.linkedin],
];
// Everything but mailto (CV, GitHub, LinkedIn) opens in a new tab.
export const newTab = (href: string) => (href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener' });

export const experience: Role[] = [
  {
    company: 'Zinier',
    role: 'Technical Lead – Frontend',
    location: 'Bengaluru',
    period: 'Jul 2024 – present',
    bullets: [
      {
        text: 'Functional lead for a 15-engineer frontend org across four pods. Mentor 7 engineers through structured 1:1s and career planning; contribute to frontend hiring.',
      },
      {
        text: 'Led the migration of 6 apps from React 17 to 18 and Node 14 to 22 in one coordinated move; Snyk vulnerabilities 734 → 215.',
        work: 'react-18-migration',
      },
      {
        text: 'Built the feature-flag and experimentation layer in the shared component library. Every pod ships on it, rolling out per customer organisation with automatic fallback.',
        work: 'feature-flags',
      },
      {
        text: 'Authored the ADR consolidating data grids onto one @tanstack/react-table implementation; 45+ grids migrated so far.',
        work: 'data-grid-consolidation',
      },
      {
        text: 'Put lint, unit-test, CSS-lint and visual-regression gates (Storybook, Playwright) on every deployment pipeline; reported bugs fell 30%. Built a Slack bot tracking PR review quality.',
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
        text: "Built the team's micro-frontend with Webpack Module Federation; the team moved from synced releases to daily deploys, 2–3× the frequency.",
        work: 'module-federation',
      },
      {
        text: 'Built the document-generation component for shipping paperwork (House Bill of Lading and related freight documents) via pdfgeneratorapi — legally operative documents where a data error delays a shipment.',
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
  { group: 'Technical leadership', items: ['ADRs', 'Technical strategy', 'Mentorship', 'Hiring', 'RCA', 'Progressive delivery'] },
  { group: 'Core frontend', items: ['TypeScript', 'React', 'Node', 'CSS Modules', 'Webpack'] },
  { group: 'State & architecture', items: ['Redux', 'MobX', 'React Context', 'Micro-frontends', 'Module Federation'] },
  { group: 'Testing & quality', items: ['Jest', 'React Testing Library', 'Cypress', 'Playwright', 'Visual regression', 'TDD'] },
  { group: 'Delivery & infrastructure', items: ['CI/CD quality gates', 'Feature flags (Firebase Remote Config)', 'Performance optimisation'] },
  { group: 'AI-assisted development', items: ['Codemods', 'Agent-assisted migrations and refactors'] },
];

export const education = 'B.Tech (CSE), Inderprastha Engineering College, Ghaziabad · 2010 – 2014';
export const languages = 'English, Hindi';
