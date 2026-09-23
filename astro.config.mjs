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
