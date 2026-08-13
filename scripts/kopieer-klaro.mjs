/**
 * Kopieert Klaro vanuit node_modules naar public/klaro/.
 *
 * Waarom niet gewoon importeren in het component? Astro bundelt `<script>`-tags
 * van een component ook wanneer dat component niet gerenderd wordt. Klaro zou dan
 * op elke pagina meeliften terwijl er (zolang er geen advertenties zijn) niets te
 * blokkeren valt. Door de bestanden zelf te hosten en met `is:inline` te laden,
 * staat er geen byte JavaScript op de site tot advertenties daadwerkelijk aan gaan.
 *
 * Waarom niet vanaf een CDN? Dat zou het IP-adres van elke bezoeker naar een derde
 * partij sturen, precies wat een toestemmingsoplossing hoort te voorkomen.
 *
 * Draait automatisch via `npm run prebuild` en `npm run predev`.
 */

import { copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = dirname(fileURLToPath(import.meta.url));
const wortel = join(hier, '..');
const bron = join(wortel, 'node_modules', 'klaro', 'dist');
const doel = join(wortel, 'public', 'klaro');

const bestanden = ['klaro-no-translations.js', 'klaro.css'];

if (!existsSync(bron)) {
  console.error('Klaro niet gevonden in node_modules. Draai eerst `npm install`.');
  process.exit(1);
}

await mkdir(doel, { recursive: true });

for (const bestand of bestanden) {
  await copyFile(join(bron, bestand), join(doel, bestand));
}

console.log(`Klaro gekopieerd naar public/klaro/ (${bestanden.join(', ')})`);
