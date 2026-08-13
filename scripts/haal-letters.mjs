/**
 * Lettertypen zelf hosten voor Mochi Glow.
 *
 * Handmatig te draaien met `node scripts/haal-letters.mjs`; dit hoort
 * nadrukkelijk niet bij `npm run build`. De bestanden worden één keer opgehaald,
 * in `public/fonts/` gezet en daarna niet meer aangeraakt.
 *
 * ── Waarom dit mag, en waarom het moet ──────────────────────────────────────
 *
 * De invariant in CLAUDE.md luidt: geen externe verzoeken vanaf de site, geen
 * externe lettertypen. Dat is een AVG-keuze, een lettertype van Google Fonts
 * laat de browser van elke bezoeker een verbinding met Google opzetten en hun
 * IP-adres meesturen.
 *
 * Zelf hosten heeft dat bezwaar niet: het bestand komt van hetzelfde domein als
 * de rest van de site, er is geen derde partij en er lekt niets. De invariant
 * blijft dus volledig overeind. Dit script haalt de bestanden op tijdens het
 * bouwen, precies zoals scripts/genereer-beeld.mjs dat voor beeld doet.
 *
 * Waarom het moet: onderzoek/09 par. 4.1 stelt vast dat ontwerpkwaliteit het
 * eerste en zwaarste vertrouwensoordeel is dat een bezoeker velt, nog vóór de
 * inhoud. Systeemletters lezen als een onopgemaakt document. Voor een site die
 * volledig van geloofwaardigheid leeft, is dat de duurste besparing die er is.
 *
 * ── De keuze ────────────────────────────────────────────────────────────────
 *
 * Drie families, alle drie onder de SIL Open Font License 1.1, dus vrij te
 * gebruiken en te herdistribueren, passend bij het nul-euro-uitgangspunt en bij
 * de open-source-lijn uit ARCHITECTUUR.md.
 *
 *   Fraunces      koppen. Een warme old-style met optische maatvoering en een
 *                 SOFT-as die de vormen zachter maakt. Bewust NIET Didot of
 *                 Bodoni: tokens.css legt uit dat die combinatie precies is waar
 *                 elk gegenereerd ontwerp op uitkomt. Fraunces is eigenzinnig en
 *                 sluit aan op de richting "het laboratorium van zachte dingen".
 *   Newsreader    broodtekst. Getekend om op een scherm gelézen te worden, met
 *                 lager contrast dan Fraunces zodat de twee naast elkaar niet
 *                 met elkaar concurreren.
 *   IBM Plex Mono de derde stem: alles wat een méting is. Technisch van karakter
 *                 zonder koud te worden.
 *
 * Alleen de latijnse subset, als variabele woff2. Dat scheelt fors: één bestand
 * per familie in plaats van een gewicht per bestand.
 */

import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = dirname(fileURLToPath(import.meta.url));
const wortel = join(hier, '..');
const doelmap = join(wortel, 'public', 'fonts');
const licentiePad = join(doelmap, 'LICENTIE.md');

/*
  Een moderne user-agent is nodig: Google Fonts kijkt ernaar en levert alleen
  woff2 aan browsers die het aankunnen. Zonder dit krijg je truetype terug, wat
  ongeveer twee keer zo groot is.
*/
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const families = [
  {
    naam: 'Fraunces',
    bestand: 'fraunces-variabel.woff2',
    /* opsz laat de letter zich aanpassen aan de graad; SOFT rondt de vormen af. */
    css: 'Fraunces:opsz,wght,SOFT@9..144,300..700,0..100',
    licentie: 'SIL Open Font License 1.1, Undercase Type',
  },
  {
    naam: 'Newsreader',
    bestand: 'newsreader-variabel.woff2',
    css: 'Newsreader:opsz,wght@6..72,300..600',
    licentie: 'SIL Open Font License 1.1, Production Type',
  },
  {
    naam: 'IBM Plex Mono',
    bestand: 'plex-mono-400.woff2',
    css: 'IBM+Plex+Mono:wght@400',
    licentie: 'SIL Open Font License 1.1, IBM',
  },
  {
    naam: 'IBM Plex Mono',
    bestand: 'plex-mono-500.woff2',
    css: 'IBM+Plex+Mono:wght@500',
    licentie: 'SIL Open Font License 1.1, IBM',
  },
];

const bestaat = (pad) =>
  access(pad).then(
    () => true,
    () => false,
  );

/**
 * Haalt de stylesheet op en vist er de woff2-URL van de latijnse subset uit.
 *
 * Google levert per subset een `@font-face`-blok met een `unicode-range`
 * erboven als commentaar. De latijnse subset is te herkennen aan het bereik dat
 * met U+0000 begint; die willen we, en de andere (cyrillisch, grieks, vietnamees)
 * juist niet, want die zouden het bestand onnodig vergroten.
 */
async function vindWoff2(cssNaam) {
  const url = `https://fonts.googleapis.com/css2?family=${cssNaam}&display=swap`;
  const antwoord = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!antwoord.ok) throw new Error(`stylesheet ${antwoord.status} ${antwoord.statusText}`);
  const css = await antwoord.text();

  const blokken = css.split('@font-face').slice(1);
  let terugval = null;

  for (const blok of blokken) {
    const bron = blok.match(/src:\s*url\((https:\/\/[^)]+\.woff2)\)/);
    if (!bron) continue;
    if (/unicode-range:[^;]*U\+0000/i.test(blok)) return bron[1];
    terugval ??= bron[1];
  }

  if (terugval) return terugval;
  throw new Error('geen woff2 gevonden in de stylesheet');
}

await mkdir(doelmap, { recursive: true });

const verslag = [];
for (const familie of families) {
  const doel = join(doelmap, familie.bestand);
  if (await bestaat(doel)) {
    console.log(`,  ${familie.bestand} staat er al, overgeslagen`);
    verslag.push({ ...familie, overgeslagen: true });
    continue;
  }

  try {
    const woff2 = await vindWoff2(familie.css);
    const antwoord = await fetch(woff2, { headers: { 'User-Agent': UA } });
    if (!antwoord.ok) throw new Error(`${antwoord.status} ${antwoord.statusText}`);

    const inhoud = Buffer.from(await antwoord.arrayBuffer());
    if (inhoud.length < 2000) throw new Error(`verdacht klein bestand (${inhoud.length} bytes)`);

    await writeFile(doel, inhoud);
    console.log(`✓ ${familie.bestand}, ${Math.round(inhoud.length / 1024)} kB`);
    verslag.push({ ...familie, bytes: inhoud.length });
  } catch (fout) {
    console.log(`✗ ${familie.bestand}, ${fout.message}`);
    verslag.push({ ...familie, fout: fout.message });
  }
}

/*
  De licentie meeleveren is geen formaliteit: de OFL vereist dat de licentie bij
  het lettertype blijft wanneer je het herdistribueert, en dat doet een site die
  het bestand zelf serveert.
*/
const gelukt = verslag.filter((r) => !r.fout);
await writeFile(
  licentiePad,
  `# Lettertypen

Deze map wordt gevuld door \`scripts/haal-letters.mjs\`. De bestanden worden door
Mochi Glow zelf geserveerd en niet van een externe dienst geladen; zie de
toelichting boven in dat script.

Alle onderstaande letters vallen onder de **SIL Open Font License 1.1**, die
gebruik, aanpassing en herdistributie toestaat, ook commercieel, mits de licentie
meegeleverd wordt. Dat is precies waar dit bestand voor dient.

De volledige licentietekst: https://openfontlicense.org/

| Bestand | Familie | Herkomst en licentie |
| --- | --- | --- |
${gelukt.map((r) => `| \`${r.bestand}\` | ${r.naam} | ${r.licentie} |`).join('\n')}

Opgehaald op ${new Date().toISOString().slice(0, 10)} via de Google Fonts API,
uitsluitend de latijnse subset.
`,
);

const mislukt = verslag.filter((r) => r.fout);
console.log(`\nKlaar. ${gelukt.length} beschikbaar, ${mislukt.length} mislukt.`);
