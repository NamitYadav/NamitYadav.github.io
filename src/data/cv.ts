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
  'I build and maintain large React single-page applications. Recent work: framework migrations at scale, ' +
  'progressive-rollout and feature-flag infrastructure, and automated quality gates across multi-app codebases.';

// Short enough to survive a search-result snippet (~155-160 chars); the fuller
// on-page summary above is for humans already on the site.
export const shortDescription =
  'Frontend Tech Lead with 11+ years building large-scale React applications. ' +
  'Case studies on migrations, feature flags and grid consolidation.';

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
        text: 'Led the migration of 6 apps from React 17 to 18 and Node 14 to 22 in one coordinated move; Snyk vulnerabilities 734 → 215.',
        work: 'react-18-migration',
      },
      {
        text: 'Built feature-flag and experimentation infrastructure in the shared component library, shipped across three apps.',
        work: 'feature-flags',
      },
      {
        text: 'Authored the ADR consolidating 95+ data grids onto one @tanstack/react-table implementation.',
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
        text: "Built the team's micro-frontend with Webpack Module Federation, decoupling its release cycle from the other five teams.",
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
  { group: 'Technical leadership', items: ['ADRs', 'Technical strategy', 'Mentorship', 'Project management', 'RCA', 'Progressive delivery'] },
  { group: 'Core frontend', items: ['JavaScript (ES6+)', 'TypeScript', 'React', 'Node', 'CSS Modules', 'Webpack'] },
  { group: 'State & architecture', items: ['Redux', 'MobX', 'React Context', 'Module Federation'] },
  { group: 'Testing & quality', items: ['Jest', 'React Testing Library', 'Cypress', 'Playwright', 'Visual regression', 'TDD', 'Feature flags'] },
  { group: 'Infrastructure & tools', items: ['CI/CD', 'Git', 'Performance optimisation', 'Responsive web design'] },
  { group: 'AI-assisted development', items: ['Codemods', 'Agent-assisted refactoring', 'Prompt design for code generation'] },
];

export const education = 'B.Tech (CSE), Inderprastha Engineering College, Ghaziabad · 2010 – 2014';
export const languages = 'English, Hindi';
