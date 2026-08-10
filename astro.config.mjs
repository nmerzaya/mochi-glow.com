// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mochi-glow.com',
  integrations: [sitemap()],
  markdown: {
    // Externe links krijgen geen automatische target="_blank": dat wordt per
    // component geregeld, zodat affiliate-links een rel-attribuut kunnen krijgen.
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
