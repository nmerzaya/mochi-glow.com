/**
 * Pinterest-beeld voor elk artikel.
 *
 * Handmatig te draaien met `node scripts/maak-pins.mjs`. Hoort net als
 * `maak-merkbeeld.mjs` en `haal-stockbeeld.mjs` níét bij de build: de uitkomst
 * gaat naar `pins/`, die map staat in `.gitignore` en komt niet op de site.
 *
 * ── Waarom een eigen beeld en niet gewoon de deelkaart ──────────────────────
 *
 * `og-standaard.jpg` en de deelkaart per artikel zijn 1200×630, liggend. Dat is
 * de maat die WhatsApp, LinkedIn en Google aanhouden. Pinterest is het enige
 * kanaal dat staand werkt: 2:3, en een liggende kaart wordt daar een streepje.
 * Vandaar 1000×1500.
 *
 * ── Waarom de foto niet naar 2:3 wordt bijgesneden ──────────────────────────
 *
 * Het beeld in `src/assets/artikelen/` is 16:9 op 2048 px. Daar 2:3 uit snijden
 * betekent ruim zestig procent van de breedte weggooien én de rest opblazen. De
 * foto krijgt daarom het bovenste vierkant, precies wat er zonder vergroting uit
 * past, en de onderste 500 px is een vlak in de huisstijl waar de tekst op staat.
 * Tekst op een vlak is bovendien leesbaar op de postzegelgrootte waarop een pin
 * in de praktijk bekeken wordt; tekst over een foto is dat niet.
 *
 * ── Waarom de teksten uit de frontmatter komen en nergens anders vandaan ────
 *
 * Dit is de kern. Een pintitel en -beschrijving zijn reclame-uitingen over
 * cosmetica en voeding, en daar gelden dezelfde regels voor als voor een alinea
 * op de site: Verordening 1223/2009 en 655/2013, en voor voeding 1924/2006.
 * `scripts/check-compliance.mjs` haalt `titel` en `beschrijving` uit de
 * frontmatter door exact dezelfde patronen als de body (zie `zoekIn` daar). Wat
 * hier op de pin en in `pins/PINTEREST.md` belandt, is dus al goedgekeurd.
 *
 * Schrijf voor een pin nooit een nieuwe, pakkendere zin. Die ontsnapt aan de
 * controle, en juist op Pinterest ligt de verleiding van een belofte ("gladde
 * huid in 7 dagen") het dichtst bij de oppervlakte.
 */

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join, dirname, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import matter from 'gray-matter';

const hier = dirname(fileURLToPath(import.meta.url));
const wortel = join(hier, '..');
const uitMap = join(wortel, 'pins');

const B = 1000;
const H = 1500;
const FOTO = 1000; /* het vierkant bovenaan */
const MARGE = 72;

/* Letterlijk overgenomen uit src/styles/tokens.css. */
const GROND = '#f2eff5';
const INKT = '#171226';
const INKT_HALF = '#574d6b';
const ORCHIDEE = '#6b2c64';
const RAND = '#ddd6e6';

/*
  Dezelfde letterkeuze als in `maak-merkbeeld.mjs`, en om dezelfde reden: sharp
  rendert tekst met de lettertypen van het systeem, niet met die uit
  `public/fonts/`. Georgia en Consolas staan op vrijwel elke Windows- en
  Mac-machine; de terugvallen erachter vangen de rest op.
*/
const SCHREEF = "Georgia, 'Times New Roman', serif";
const MONO = "Consolas, 'Courier New', monospace";

const collecties = ['ingredienten', 'gut-skin', 'beauty'];

/*
  De leesbare naam van een pijler staat in `src/config.ts`. Dat is TypeScript en
  dus niet zomaar te importeren in een los .mjs-script; het bestand wordt daarom
  als tekst gelezen, net zoals `check-compliance.mjs` dat met de datamodules
  doet. Ontbreekt een naam, dan stopt het script: een pin met het verkeerde
  rubrieklabel is erger dan geen pin.
*/
const configBron = await readFile(join(wortel, 'src', 'config.ts'), 'utf8');

function pijlerNaam(sleutel) {
  const patroon = new RegExp(`['"]?${sleutel}['"]?:\\s*\\{[^}]*?naam:\\s*'([^']+)'`);
  const gevonden = configBron.match(patroon);
  if (!gevonden) {
    console.error(`✗ geen pijlernaam gevonden voor "${sleutel}" in src/config.ts`);
    process.exit(1);
  }
  return gevonden[1];
}

const escape = (t) =>
  t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/*
  SVG breekt tekst niet zelf af. De breedte wordt geschat op de gemiddelde
  letterbreedte van een schreefletter, ongeveer 0,52 × de korpsgrootte. Dat is
  grof, maar het hoeft alleen te voorkomen dat een regel buiten de marge valt, en
  daarvoor is te voorzichtig beter dan te krap.
*/
function breekAf(tekst, korps, maxBreedte) {
  const perRegel = Math.floor(maxBreedte / (korps * 0.52));
  const woorden = tekst.split(/\s+/);
  const regels = [];
  let nu = '';

  for (const woord of woorden) {
    const kandidaat = nu ? `${nu} ${woord}` : woord;
    if (kandidaat.length > perRegel && nu) {
      regels.push(nu);
      nu = woord;
    } else {
      nu = kandidaat;
    }
  }
  if (nu) regels.push(nu);
  return regels;
}

/* Lange titels krijgen een kleiner korps in plaats van een vierde regel. */
function korpsVoor(titel) {
  if (titel.length <= 42) return 62;
  if (titel.length <= 62) return 54;
  return 46;
}

function bouwVlak(titel, rubriek) {
  const korps = korpsVoor(titel);
  const regels = breekAf(titel, korps, B - MARGE * 2);
  const regelhoogte = Math.round(korps * 1.22);

  /* De titel staat onder het rubrieklabel en boven de voetregel, verticaal
     gecentreerd in wat daartussen overblijft. */
  const blokTop = FOTO + 132;
  const blokRuimte = H - blokTop - 96;
  const start = blokTop + (blokRuimte - regels.length * regelhoogte) / 2 + korps * 0.78;

  const titelRegels = regels
    .map(
      (regel, i) =>
        `<text x="${MARGE}" y="${Math.round(start + i * regelhoogte)}" fill="${INKT}"
           font-size="${korps}" font-weight="600" font-family="${SCHREEF}"
           letter-spacing="-0.8">${escape(regel)}</text>`,
    )
    .join('\n    ');

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${B}" height="${H}">
    <rect x="0" y="${FOTO}" width="${B}" height="${H - FOTO}" fill="${GROND}"/>

    <!-- De bronnenmeter, hetzelfde teken als in het favicon en op de deelkaart. -->
    <rect x="${MARGE}" y="${FOTO + 60}" width="104" height="8" rx="4" fill="#3fb39b"/>
    <rect x="${MARGE + 116}" y="${FOTO + 60}" width="72" height="8" rx="4" fill="#e0a63f"/>
    <rect x="${MARGE + 200}" y="${FOTO + 60}" width="40" height="8" rx="4" fill="#e87396"/>

    <text x="${MARGE}" y="${FOTO + 108}" fill="${ORCHIDEE}" font-size="23"
          letter-spacing="3" font-family="${MONO}">${escape(rubriek.toUpperCase())}</text>

    ${titelRegels}

    <line x1="${MARGE}" y1="${H - 108}" x2="${B - MARGE}" y2="${H - 108}" stroke="${RAND}" stroke-width="1"/>
    <text x="${MARGE}" y="${H - 62}" fill="${INKT_HALF}" font-size="26"
          font-family="${SCHREEF}">mochi-glow.com</text>
    <text x="${B - MARGE}" y="${H - 62}" fill="${INKT_HALF}" font-size="20" text-anchor="end"
          letter-spacing="2.4" font-family="${MONO}">SKINCARE, ONDERZOCHT</text>
  </svg>`);
}

/* ── Doorloop ──────────────────────────────────────────────────────────── */

await mkdir(uitMap, { recursive: true });

const regels = [];
let gemaakt = 0;
let overgeslagen = 0;

for (const collectie of collecties) {
  const map = join(wortel, 'src', 'content', collectie);
  const rubriek = pijlerNaam(collectie);

  let bestanden;
  try {
    bestanden = (await readdir(map)).filter((n) => n.endsWith('.md'));
  } catch {
    console.log(`· collectie ${collectie} bestaat niet, overgeslagen`);
    continue;
  }

  for (const bestand of bestanden.sort()) {
    const slug = basename(bestand, '.md');
    const { data: fm } = matter(await readFile(join(map, bestand), 'utf8'));

    if (!fm.titel || !fm.beschrijving || !fm.afbeelding) {
      console.log(`✗ ${collectie}/${slug}: titel, beschrijving of afbeelding ontbreekt`);
      overgeslagen++;
      continue;
    }

    /* `afbeelding` staat relatief aan het artikel, zoals ../../assets/... */
    const fotopad = resolve(map, fm.afbeelding);

    let foto;
    try {
      foto = await sharp(fotopad)
        .resize(FOTO, FOTO, { fit: 'cover', position: 'attention' })
        .modulate({ saturation: 0.92 })
        .toBuffer();
    } catch {
      console.log(`✗ ${collectie}/${slug}: beeld niet te lezen (${fm.afbeelding})`);
      overgeslagen++;
      continue;
    }

    const pin = await sharp({
      create: { width: B, height: H, channels: 3, background: GROND },
    })
      .composite([
        { input: foto, top: 0, left: 0 },
        { input: bouwVlak(fm.titel, rubriek), top: 0, left: 0 },
      ])
      .jpeg({ quality: 88, mozjpeg: true })
      .toBuffer();

    await writeFile(join(uitMap, `${slug}.jpg`), pin);
    gemaakt++;

    regels.push(
      [
        `### ${fm.titel}`,
        '',
        `- **Beeld:** \`pins/${slug}.jpg\``,
        `- **Link:** https://mochi-glow.com/${collectie}/${slug}`,
        `- **Titel:** ${fm.titel}`,
        `- **Beschrijving:** ${fm.beschrijving}`,
        '',
      ].join('\n'),
    );
  }
}

const lijst = `# Pins, klaar om te plaatsen

Gemaakt door \`node scripts/maak-pins.mjs\`; niet met de hand bijwerken, een
volgende run overschrijft dit bestand.

## Hoe te gebruiken

Per artikel staat hieronder één pin: het beeldbestand, de link waar de pin
naartoe moet, en de twee teksten. Upload het beeld op Pinterest, plak de link in
het bestemmings-URL-veld, en neem titel en beschrijving **letterlijk** over.

## Waarom letterlijk

Titel en beschrijving komen woord voor woord uit de frontmatter van het artikel.
\`npm run check\` haalt juist die twee velden door dezelfde verboden-taal- en
claimpatronen als de lopende tekst. Ze zijn dus getoetst.

Een eigen, pakkendere zin bedenken op het moment van plaatsen ontsnapt aan die
toets. Dat is geen theoretisch risico: een pin is een reclame-uiting over
cosmetica of voeding, en daarvoor gelden Verordening 1223/2009 en 655/2013,
respectievelijk 1924/2006, net zo hard als voor de site zelf. Wil je een andere
tekst, wijzig dan de frontmatter van het artikel, draai \`npm run check\`, en
draai dit script opnieuw.

## Over het beeld

De foto's komen van Pexels. De Pexels-licentie staat commercieel gebruik toe maar
verbiedt het doorgeven van een ongewijzigde foto als losse foto. Een pin is geen
ongewijzigde foto: er zit een bijgesneden uitsnede, een kleurcorrectie, een
tekstvlak en het merkteken op. Plaats daarom altijd deze bestanden, en nooit het
kale beeld uit \`src/assets/artikelen/\`. Herkomst per foto staat in
\`src/assets/HERKOMST.md\`.

---

${regels.join('\n')}`;

await writeFile(join(uitMap, 'PINTEREST.md'), lijst);

console.log(
  `\n✓ ${gemaakt} pin(s) in pins/, ${B}×${H}${overgeslagen ? `, ${overgeslagen} overgeslagen` : ''}`,
);
console.log('  Teksten en links staan in pins/PINTEREST.md');
