// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mochi-glow.com',
  integrations: [sitemap()],
  image: {
    /*
      Zonder deze regel krijgen beelden die in de markdown zelf staan géén srcset.
      Astro vult `widths` alleen aan als `layout` iets anders is dan 'none', en
      'none' is de standaard; `Beeld.astro` ontsnapt daaraan alleen doordat het
      zijn breedtes expliciet meegeeft. Een beeld in een artikel zou dus als één
      bestand van 2048 pixels naar elke telefoon gaan.

      `Beeld.astro` blijft ongemoeid: Astro gebruikt `||=`, dus expliciet
      opgegeven breedtes en `sizes` winnen. `responsiveStyles` staat standaard uit,
      dus er wordt ook geen CSS ingespoten.
    */
    layout: 'constrained',
  },
  markdown: {
    // Externe links krijgen geen automatische target="_blank": dat wordt per
    // component geregeld, zodat affiliate-links een rel-attribuut kunnen krijgen.
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
