/**
 * Contrastcontrole op de tekstkleuren.
 *
 * Draai met `node scripts/controleer-contrast.mjs`.
 *
 * tokens.css stelt dat alle tekstkleuren op WCAG 2.2 AA zijn doorgerekend. Dat
 * gold voor de combinaties die er tóen waren. Bij de merkherziening zijn er
 * nieuwe bijgekomen, een jade label op wit, en twee meldingen op een gekleurd
 * vlak, en een bewering die niet nagerekend is, is geen bewering.
 *
 * AA vraagt 4,5:1 voor gewone tekst en 3:1 voor grote tekst (>= 24px, of
 * >= 18,66px vet).
 */

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = dirname(fileURLToPath(import.meta.url));
const css = await readFile(join(hier, '..', 'src', 'styles', 'tokens.css'), 'utf8');

const tokens = Object.fromEntries(
  [...css.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)].map((m) => [m[1], m[2]]),
);

function rgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** Relatieve luminantie volgens WCAG 2.x. */
function luminantie(hex) {
  const [r, g, b] = rgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function verhouding(a, b) {
  const [l1, l2] = [luminantie(a), luminantie(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/* Elke combinatie die daadwerkelijk als tekst op de site voorkomt. */
const combinaties = [
  ['broodtekst op de grond', '--kleur-inkt', '--kleur-grond', 4.5],
  ['broodtekst op wit', '--kleur-inkt', '--kleur-vlies', 4.5],
  ['gedempte tekst op de grond', '--kleur-inkt-half', '--kleur-grond', 4.5],
  ['gedempte tekst op wit', '--kleur-inkt-half', '--kleur-vlies', 4.5],
  ['stille tekst op de diepe grond', '--kleur-inkt-stil', '--kleur-grond-diep', 4.5],
  ['link/accent op de grond', '--kleur-orchidee', '--kleur-grond', 4.5],
  ['link/accent op wit', '--kleur-orchidee', '--kleur-vlies', 4.5],
  ['rubrieklabel op het orchideevlak', '--kleur-orchidee', '--kleur-orchidee-vlak', 4.5],
  /* Nieuw bij de merkherziening: */
  ['claimlabel jade op wit', '--kleur-jade', '--kleur-vlies', 4.5],
  ['claimtekst op wit', '--kleur-inkt-half', '--kleur-vlies', 4.5],
  ['disclosure-tekst op het warme vlak', '--kleur-inkt-half', '--kleur-accent-warm-vlak', 4.5],
  ['medische tekst op het let-op-vlak', '--kleur-inkt-half', '--kleur-let-op-vlak', 4.5],
  /* De bewijsschaal als tekst in de legenda. */
  ['jade op wit', '--kleur-jade', '--kleur-vlies', 4.5],
  ['amber op wit', '--kleur-amber', '--kleur-vlies', 4.5],
  ['roos op wit', '--kleur-roos', '--kleur-vlies', 4.5],
];

let gezakt = 0;
console.log('Contrast (WCAG 2.2 AA)\n');
for (const [naam, voor, achter, eis] of combinaties) {
  const a = tokens[voor];
  const b = tokens[achter];
  if (!a || !b) {
    console.log(`  ?  ${naam.padEnd(38)} token ontbreekt (${voor} of ${achter})`);
    gezakt++;
    continue;
  }
  const v = verhouding(a, b);
  const ok = v >= eis;
  if (!ok) gezakt++;
  console.log(`  ${ok ? '✓' : '✗'}  ${naam.padEnd(38)} ${v.toFixed(2)}:1  (eis ${eis}:1)`);
}

console.log(
  gezakt === 0
    ? `\nAlle ${combinaties.length} combinaties halen AA.`
    : `\n${gezakt} combinatie(s) halen AA niet.`,
);
process.exit(gezakt === 0 ? 0 : 1);
