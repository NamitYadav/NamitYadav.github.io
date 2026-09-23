// Content rules from the spec (§4.4). Node only, no dependencies.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { createHash } from 'node:crypto';

const dist = process.env.DIST ?? 'dist';
let failed = false;
const fail = (msg) => { failed = true; console.error(`verify: ${msg}`); };
const walk = (dir, ext) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name), ext) : e.name.endsWith(ext) ? [join(dir, e.name)] : []);

// SHA-256 of the 10-digit phone number, so this public repo doesn't publish what it guards.
// Non-digits are stripped first so a formatted paste (+91 xxxxx xxxxx, xxx-xxx-xxxx) is caught too.
const PHONE_SHA256 = 'ea6c6bd5b8c27433b51ac447ef8f3326cb848658933574f30b168b93949aadd6';
const hasPhone = (text) => {
  const d = text.replace(/\D/g, '');
  for (let i = 0; i + 10 <= d.length; i++) {
    if (createHash('sha256').update(d.slice(i, i + 10)).digest('hex') === PHONE_SHA256) return true;
  }
  return false;
};

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
