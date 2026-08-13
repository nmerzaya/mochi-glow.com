/**
 * Controle op klassen zonder opmaak.
 *
 * Draai met `node scripts/controleer-opmaak.mjs`.
 *
 * Waarom dit bestaat: dit project heeft drie keer dezelfde fout gemaakt. Een
 * component werd herschreven, gaf nieuwe klassen af, en de bijbehorende opmaak
 * kwam er nooit. Dat faalt niet luidruchtig, de build slaagt, de HTML klopt,
 * en alleen wie de pagina opent ziet dat het raster weg is, dat elk beeld op
 * volle breedte staat of dat er "1. 2. 3." naast een voortgangsbalk hangt.
 *
 * Gevonden op die manier: de hele stroom (`.item*`, `.stroom`), het tweeluik en
 * het uitlegblok op de homepage, acht klassen in de vragenlijst, en de
 * voortgangsbalk die zijn opsommingstekens liet staan.
 *
 * Dit script is bewust geen onderdeel van `npm run build`. Het geeft namelijk
 * ruis: klassen die alleen als haak voor JavaScript bestaan of die een
 * `data-`attribuut schakelen, hebben terecht geen opmaak. Het is een hulpmiddel
 * om na een verbouwing langs te lopen, niet een poort.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = dirname(fileURLToPath(import.meta.url));
const wortel = join(hier, '..');

/*
  Klassen die met opzet geen opmaak hebben.

  `met-js` en `zonder-js` schakelen zichtbaarheid via een data-attribuut op de
  html-tag; `onthul` is een haak voor de scroll-animatie. `beeld--` bestaat wel
  in drie varianten maar stuurt alleen welke breedtes Astro uitsnijdt, dat is
  een eigenschap van het beeld, geen opmaak. `opening__woord` is een rasterkind
  dat aan de standaardplaatsing genoeg heeft.
*/
const uitgezonderd = new Set(['met-js', 'zonder-js', 'onthul', 'beeld--', 'opening__woord']);

async function zoek(map, exts) {
  const uit = [];
  for (const item of await readdir(map, { withFileTypes: true })) {
    const pad = join(map, item.name);
    if (item.isDirectory()) uit.push(...(await zoek(pad, exts)));
    else if (exts.includes(extname(item.name))) uit.push(pad);
  }
  return uit;
}

/* --- Alle klassen die ergens gedefinieerd zijn --- */
const stijlbestanden = await zoek(join(wortel, 'src', 'styles'), ['.css']);
const gedefinieerd = new Set();
for (const pad of stijlbestanden) {
  const css = await readFile(pad, 'utf8');
  /* Commentaar eruit, anders tellen genoemde klassen in toelichtingen mee. */
  const zonder = css.replace(/\/\*[\s\S]*?\*\//g, ' ');
  for (const m of zonder.matchAll(/\.([a-zA-Z_][\w-]*)/g)) gedefinieerd.add(m[1]);
}

/* --- Alle klassen die een component of pagina afgeeft --- */
const bronbestanden = [
  ...(await zoek(join(wortel, 'src', 'components'), ['.astro'])),
  ...(await zoek(join(wortel, 'src', 'layouts'), ['.astro'])),
  ...(await zoek(join(wortel, 'src', 'pages'), ['.astro'])),
];

const ontbreekt = new Map();
for (const pad of bronbestanden) {
  const bron = await readFile(pad, 'utf8');
  const klassen = new Set();

  /* class="..." en class={`...`}; de ${...}-stukken vallen er vanzelf uit. */
  for (const m of bron.matchAll(/class=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
    for (const k of (m[1] ?? m[2] ?? '').split(/\s+/)) {
      const schoon = k.replace(/\$\{[^}]*\}/g, '').trim();
      if (schoon && /^[a-zA-Z_][\w-]*$/.test(schoon)) klassen.add(schoon);
    }
  }

  for (const k of klassen) {
    if (gedefinieerd.has(k) || uitgezonderd.has(k)) continue;
    /*
      `class={`item item--${formaat}`}` laat na het strippen van de expressie
      `item--` over. Dat is geen klasse maar een voorvoegsel; hij telt als
      afgedekt zodra er ergens een variant met dat voorvoegsel beschreven staat.
    */
    if (k.endsWith('-') && [...gedefinieerd].some((g) => g.startsWith(k))) continue;
    const naam = relative(wortel, pad).replace(/\\/g, '/');
    if (!ontbreekt.has(naam)) ontbreekt.set(naam, []);
    ontbreekt.get(naam).push(k);
  }
}

if (ontbreekt.size === 0) {
  console.log(
    `Alle klassen hebben opmaak, ${bronbestanden.length} bestanden gecontroleerd tegen ` +
      `${gedefinieerd.size} gedefinieerde klassen.`,
  );
} else {
  console.log('Klassen zonder opmaak:\n');
  for (const [bestand, lijst] of ontbreekt) {
    console.log(`  ${bestand}`);
    for (const k of lijst) console.log(`    .${k}`);
  }
  console.log(`\n${[...ontbreekt.values()].flat().length} klasse(n) zonder opmaak.`);
}
