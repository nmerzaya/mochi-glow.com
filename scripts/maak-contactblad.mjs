/**
 * Contactblad: alle artikelbeelden als één overzicht.
 *
 * Draai met `node scripts/maak-contactblad.mjs`. Schrijft naar
 * `contactblad.jpg` in de projectmap (staat in .gitignore, het is een
 * hulpmiddel, geen onderdeel van de site).
 *
 * Waarom dit bestaat: er staan vierentachtig beelden op de site en twee regels
 * die per stuk gecontroleerd moeten worden, geen gezichten, en het onderwerp
 * moet kloppen bij het artikel. Vierentachtig bestanden los openen is
 * onbegonnen werk en precies het soort controle dat in de praktijk overgeslagen
 * wordt. Op één blad is het een kwestie van kijken.
 *
 * De bestandsnaam staat onder elk beeld, zodat een uitschieter meteen te
 * herleiden is naar het artikel waar hij bij hoort.
 */

import { readdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const hier = dirname(fileURLToPath(import.meta.url));
const wortel = join(hier, '..');
const map = join(wortel, 'src', 'assets', 'artikelen');

const KOLOMMEN = 6;
const CEL_B = 320;
const CEL_H = 180;
const BIJSCHRIFT = 26;
const MARGE = 8;

const bestanden = (await readdir(map)).filter((f) => f.endsWith('.jpg')).sort();
if (bestanden.length === 0) {
  console.log('Geen beelden gevonden.');
  process.exit(0);
}

const rijen = Math.ceil(bestanden.length / KOLOMMEN);
const totaalB = KOLOMMEN * (CEL_B + MARGE) + MARGE;
const totaalH = rijen * (CEL_H + BIJSCHRIFT + MARGE) + MARGE;

const lagen = [];
for (const [i, naam] of bestanden.entries()) {
  const kol = i % KOLOMMEN;
  const rij = Math.floor(i / KOLOMMEN);
  const x = MARGE + kol * (CEL_B + MARGE);
  const y = MARGE + rij * (CEL_H + BIJSCHRIFT + MARGE);

  try {
    const mini = await sharp(join(map, naam))
      .resize(CEL_B, CEL_H, { fit: 'cover' })
      .jpeg({ quality: 82 })
      .toBuffer();
    lagen.push({ input: mini, top: y, left: x });
  } catch {
    /* Onleesbaar bestand: cel blijft leeg, het bijschrift verraadt welke. */
  }

  const label = naam.replace('.jpg', '');
  lagen.push({
    input: Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${CEL_B}" height="${BIJSCHRIFT}">
         <text x="2" y="17" font-family="monospace" font-size="13" fill="#171226">${
           label.length > 40 ? label.slice(0, 39) + '…' : label
         }</text>
       </svg>`,
    ),
    top: y + CEL_H + 2,
    left: x,
  });
}

const blad = await sharp({
  create: { width: totaalB, height: totaalH, channels: 3, background: '#f2eff5' },
})
  .composite(lagen)
  .jpeg({ quality: 86, mozjpeg: true })
  .toBuffer();

await writeFile(join(wortel, 'contactblad.jpg'), blad);
console.log(`contactblad.jpg, ${bestanden.length} beelden, ${totaalB}×${totaalH}`);
