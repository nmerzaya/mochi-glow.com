/**
 * Merkbeeld voor Mochi Glow: favicons en de standaard deelkaart.
 *
 * Handmatig te draaien met `node scripts/maak-merkbeeld.mjs`. Hoort niet bij de
 * build: de uitkomsten staan in `public/` en veranderen alleen als het merkteken
 * of het gekozen sfeerbeeld verandert.
 *
 * Wat hier gemaakt wordt en waarom:
 *
 *   favicon.svg        met de hand geschreven, staat al in public/ — de bron.
 *   favicon-32.png     terugval voor browsers die geen SVG-icoon nemen.
 *   favicon-180.png    apple-touch-icon; iOS negeert SVG volledig.
 *   og-standaard.jpg   de kaart die verschijnt als iemand de site deelt.
 *
 * Die laatste is geen franje. `onderzoek/08` par. 4.3 laat zien dat zoekverkeer
 * structureel is weggevallen en dat delen en terugkeren overblijven; een link
 * die als lege kaart in WhatsApp of LinkedIn landt, gooit precies dat kanaal weg.
 */

import { readFile, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const hier = dirname(fileURLToPath(import.meta.url));
const wortel = join(hier, '..');
const publiek = join(wortel, 'public');

const svg = await readFile(join(publiek, 'favicon.svg'));

/* ── Favicons ──────────────────────────────────────────────────────────── */

for (const maat of [32, 180]) {
  const uit = await sharp(svg, { density: 384 }).resize(maat, maat).png().toBuffer();
  await writeFile(join(publiek, `favicon-${maat}.png`), uit);
  console.log(`✓ favicon-${maat}.png — ${Math.round(uit.length / 1024)} kB`);
}

/* ── De deelkaart ──────────────────────────────────────────────────────── */

/*
  1200×630 is de maat die alle grote platformen aanhouden. Het beeld eronder is
  een van de rustigste uit de reeks; er komt een verloop overheen zodat de tekst
  leesbaar blijft ongeacht wat eronder ligt.

  De tekst gaat als SVG over het beeld en niet als een letter uit public/fonts:
  sharp rendert tekst via de lettertypen van het systeem, en welke dat zijn
  verschilt per machine. Een merknaam die op de ene computer in Fraunces en op de
  andere in Arial staat, is erger dan geen merknaam. Vandaar de naam als
  uitgeschreven vormen — die zien er overal hetzelfde uit.
*/
const achtergrondKandidaten = [
  'rijstextract.jpg',
  'ceramiden.jpg',
  'hyaluronzuur.jpg',
];

let bron = null;
for (const naam of achtergrondKandidaten) {
  const pad = join(wortel, 'src', 'assets', 'artikelen', naam);
  try {
    await access(pad);
    bron = pad;
    break;
  } catch {
    /* volgende proberen */
  }
}

if (!bron) {
  console.log('✗ geen sfeerbeeld gevonden; deelkaart overgeslagen');
} else {
  const B = 1200;
  const H = 630;

  const laag = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${B}" height="${H}">
    <defs>
      <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#171226" stop-opacity="0.30"/>
        <stop offset="55%"  stop-color="#171226" stop-opacity="0.72"/>
        <stop offset="100%" stop-color="#171226" stop-opacity="0.92"/>
      </linearGradient>
    </defs>
    <rect width="${B}" height="${H}" fill="url(#v)"/>

    <!-- De bronnenmeter, hetzelfde teken als in het favicon. -->
    <rect x="72" y="438" width="132" height="9" rx="4.5" fill="#3fb39b"/>
    <rect x="216" y="438" width="92"  height="9" rx="4.5" fill="#e0a63f"/>
    <rect x="320" y="438" width="52"  height="9" rx="4.5" fill="#e87396"/>

    <text x="72" y="516" fill="#ffffff" font-size="72" font-weight="600"
          font-family="Georgia, 'Times New Roman', serif" letter-spacing="-1.5">Mochi Glow</text>
    <text x="72" y="562" fill="#e7dff0" font-size="25" letter-spacing="3.2"
          font-family="Consolas, 'Courier New', monospace">SKINCARE, ONDERZOCHT</text>
  </svg>`);

  const kaart = await sharp(bron)
    .resize(B, H, { fit: 'cover', position: 'attention' })
    .modulate({ saturation: 0.85 })
    .composite([{ input: laag, top: 0, left: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();

  await writeFile(join(publiek, 'og-standaard.jpg'), kaart);
  console.log(`✓ og-standaard.jpg — ${B}×${H}, ${Math.round(kaart.length / 1024)} kB`);
}
