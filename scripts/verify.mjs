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
  if (html.includes('8826367697')) fail(`${file} contains the phone number`);
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
