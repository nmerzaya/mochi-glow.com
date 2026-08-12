/**
 * Beeldgeneratie voor Mochi Glow.
 *
 * Handmatig te draaien met `node scripts/genereer-beeld.mjs`; dit hoort
 * nadrukkelijk niet bij `npm run build`. Beeld wordt één keer opgehaald, in de
 * repo gezet en daarna niet meer aangeraakt — de site zelf verbindt nooit met
 * pollinations.ai, want dat zou de invariant "geen externe verzoeken" breken.
 *
 * Waarom `src/assets/artikelen/` en niet `public/images/`: het veld `afbeelding`
 * in `src/content.config.ts` is `image()`, en die helper verwacht een pad dat
 * relatief is aan het markdown-bestand en binnen `src/` ligt. Alleen dan
 * optimaliseert Astro het beeld naar WebP in meerdere breedtes en zet het de
 * afmetingen in de HTML, zodat de pagina niet verspringt tijdens het laden. Een
 * bestand in `public/` gaat ongemoeid en op volle grootte naar elke telefoon.
 *
 * ── Resolutie ───────────────────────────────────────────────────────────────
 *
 * Pollinations levert maximaal ongeveer 0,6 megapixel, ongeacht wat je vraagt.
 * Gemeten op 2026-08-11: 2048×1152 gevraagd gaf 1024×576 terug, 1440×900 gaf
 * 971×607, en 1024×1024 gaf 768×768. De modelnaam maakt niets uit — `/models`
 * geeft alleen `sana`, en `flux` of `turbo` vallen daar stilzwijgend op terug.
 *
 * Een token verandert dat NIET. Hier stond eerder dat `POLLINATIONS_TOKEN` echt
 * op 1920×1080 zou genereren en dat het opschalen dan verviel. Dat is op
 * 2026-08-12 gemeten en het klopt niet: met token is er 84 keer op 1920×1080
 * gevraagd en kwam er 84 keer 1024×576 terug. Wat een token wél doet, is een
 * ruimer aanvraagtempo geven; registreren kan gratis op auth.pollinations.ai.
 *
 * Elk beeld wordt daarom na het ophalen lokaal 2× opgeschaald met sharp
 * (Lanczos3 plus een milde unsharp mask). Dat voegt geen detail toe, maar
 * voorkomt dat de browser zelf moet interpoleren en geeft Astro genoeg pixels
 * om nette WebP-varianten uit te snijden.
 *
 * ── Hervatbaar ──────────────────────────────────────────────────────────────
 *
 * Ruim tachtig beelden met een wachttijd van zestien seconden ertussen duurt
 * bijna een uur. Een script dat na een storing van voren af aan begint is
 * daarmee onbruikbaar, dus wordt per bestand bijgehouden met welke stijlversie
 * het gemaakt is. Bestaat het bestand al in de huidige stijlversie, dan slaat
 * de run het over. Verhoog `STIJLVERSIE` om alles opnieuw te laten maken.
 */

import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

/*
  De token uit `.env` inlezen. Dit stond hierboven al beschreven als de manier om
  hem mee te geven, maar er was niets dat het bestand daadwerkelijk laadde —
  `process.env.POLLINATIONS_TOKEN` bleef dus altijd leeg en elke run viel stil
  terug op de anonieme laag. `loadEnvFile` zit sinds Node 20.12 in de standaard­
  bibliotheek, dus dit kost geen dependency. Ontbreekt het bestand, dan gooit het
  en gaan we door zonder token; dat is een geldige route, alleen op lagere
  resolutie.
*/
try {
  process.loadEnvFile();
} catch {
  /* Geen .env — dan geldt wat er in de omgeving staat, of niets. */
}

const hier = dirname(fileURLToPath(import.meta.url));
const wortel = join(hier, '..');
const doelmap = join(wortel, 'src', 'assets', 'artikelen');
const verslagPad = join(doelmap, 'verslag.json');
const herkomstPad = join(wortel, 'src', 'assets', 'HERKOMST.md');

/**
 * Verhoog dit als de stijl verandert; dan wordt alles opnieuw gegenereerd.
 *
 * 3 (2026-08-12) — overgestapt op een Pollinations-token. Versie 2 is zonder
 * token gemaakt: opgevraagd op 1024×576 en lokaal 2× opgeschaald. Met token komt
 * er echt 1920×1080 uit. Alleen de nieuwe beelden op token halen zou de reeks in
 * twee zichtbaar verschillende kwaliteiten splitsen, dus gaat alles opnieuw.
 */
const STIJLVERSIE = 3;

const PAUZE_MS = 16_000;
const DOELBREEDTE = 2048;

/* Zonder token is dit de feitelijke bovengrens; ermee wordt het 1920×1080. */
const token = process.env.POLLINATIONS_TOKEN?.trim() || null;
const BREEDTE = token ? 1920 : 1024;
const HOOGTE = token ? 1080 : 576;

/*
  ── De stijl ────────────────────────────────────────────────────────────────

  Eén zin, één keer vastgelegd, overal hergebruikt. Dit is wat vierentachtig
  losse plaatjes tot één reeks maakt: hetzelfde licht, dezelfde
  kleurtemperatuur, dezelfde scherptediepte, dezelfde hoeveelheid lucht
  eromheen. Het onderwerp verschilt per artikel, de behandeling nooit.

  Er staat bewust geen kleur per artikel in. Een eerdere versie varieerde de
  prompt mee met het `accent`-veld, waardoor de reeks uit elkaar viel in vier
  kleurfamilies. De accentkleur is een teken in de opmaak, niet in het beeld.
*/
const STIJL = [
  'editorial still life photograph',
  'soft diffused north-facing daylight from one side',
  'warm neutral white balance around 5000K',
  'shallow depth of field with the near edge crisp',
  'muted dusty palette of bone white, warm grey and faded plum',
  'matte finish, fine film grain, no gloss',
  'generous negative space, quiet composition, subject slightly off-centre',
  'photographed on medium format',
].join(', ');

/*
  Wat er nooit in mag. De eerste vier houden de beelden schoon; `no faces`
  volgt uit de opdracht (`HERZIENING.md`, par. 1) en `no brand packaging`
  uit de regel in `CLAUDE.md` dat er geen bestaand, koopbaar product
  nagebootst wordt — dat zou de lezer misleiden over wat hij koopt.
*/
const NIET = 'no text, no lettering, no logo, no watermark, no faces, no brand packaging, no labels';

/**
 * Onderwerpen per artikel: één hero plus twee beelden voor in de tekst.
 *
 * Elk onderwerp is een ding uit de wereld van het artikel — de grondstof, de
 * bereiding, de textuur — en nooit een illustratie van het effect ervan. Een
 * korrel rijst mag, een stralende huid niet. Dat is dezelfde regel als voor de
 * tekst: niets afbeelden wat niet geclaimd mag worden.
 *
 * Waar huid in beeld komt, is dat een onderarm, een schouder of een hand.
 * Nooit een gezicht.
 */
const onderwerpen = {
  /* ── Wat zit erin? — bestaand ── */
  'ingredienten/centella-asiatica': [
    'a cluster of round pennywort leaves with scalloped edges, still wet with dew, on damp dark earth',
    'dried centella leaves and thin stems loose in a shallow unglazed ceramic dish',
    'one translucent green leaf held up against soft light, fine veins visible',
  ],
  'ingredienten/ceramiden': [
    'extreme macro of stacked translucent layers, like thin sheets of mica seen edge-on',
    'close-up of dry flaking skin texture on the back of a hand in raking light',
    'a thick smear of white balm across pale stone, catching the light along one edge',
  ],
  'ingredienten/galactomyces': [
    'a glass vessel of cloudy rice ferment with fine bubbles rising, on a worn wooden counter',
    'macro of koji rice culture, pale fuzzy grains spread in a shallow wooden tray',
    'milky filtrate being poured through fine cloth into a plain glass beaker',
  ],
  'ingredienten/hyaluronzuur': [
    'a single water droplet suspended on a taut translucent surface, refracting the light behind it',
    'macro of a clear viscous gel drawn upward into a thin thread between two fingertips',
    'beads of condensation running down cold glass, very shallow focus',
  ],
  'ingredienten/niacinamide': [
    'fine white crystalline powder heaped in a small glass dish on pale linen',
    'close-up of shoulder skin texture in soft raking light',
    'a glass dropper releasing one clear drop above a plain glass surface',
  ],
  'ingredienten/pdrn': [
    'macro of salmon skin, silvery iridescent scales, resting on crushed ice',
    'a slender empty glass ampoule lying on brushed cold steel',
    'a twisted translucent ribbon of gel coiled like a helix on dark wet stone',
  ],
  'ingredienten/propolis': [
    'a broken fragment of honeycomb with dark amber resin in the cells, backlit',
    'raw propolis chunks, dark and waxy, in a small carved wooden bowl',
    'thick amber liquid drawing out slowly from the back of a spoon',
  ],
  'ingredienten/rijstextract': [
    'raw white rice grains scattered across pale linen, macro, one grain in sharp focus',
    'cloudy rice washing water standing in a wide ceramic bowl, seen from directly above',
    'fermenting rice mash in an earthenware crock with the wooden lid pushed aside',
  ],
  'ingredienten/snail-mucin': [
    'a glossy spiral shell seen from directly above on wet dark slate',
    'macro of a clear viscous trail across dark glass, catching a thin line of light',
    'damp green leaves in low soft light with water beading on the surface',
  ],
  'ingredienten/vitamine-c': [
    'a citrus cross-section, macro, pulp segments translucent and backlit',
    'a small amber glass bottle on a windowsill casting a long shadow',
    'white crystalline powder spilling from a folded paper packet onto grey stone',
  ],

  /* ── Wat zit erin? — nieuw ── */
  'ingredienten/groene-thee': [
    'fresh green tea leaves, macro, still wet from rain, on dark slate',
    'loose dried green tea heaped in a small ceramic scoop on linen',
    'pale green tea steeping in a clear glass cup with steam rising',
  ],
  'ingredienten/ginseng': [
    'a whole ginseng root with fine pale tendrils lying on dark soil, macro',
    'thin slices of dried ginseng arranged in a row on a worn wooden board',
    'an amber infusion in a small earthenware cup, seen from just above the rim',
  ],
  'ingredienten/bijvoet': [
    'fresh mugwort leaves with the silvery underside showing, macro, soft daylight',
    'a bundle of dried mugwort tied with rough twine hanging against a pale plaster wall',
    'a dark herbal infusion in a shallow stone bowl with steam lifting off it',
  ],
  'ingredienten/houttuynia-cordata': [
    'heart-shaped houttuynia leaves wet with rain, macro, deep green against dark earth',
    'houttuynia growing densely in shade, low soft light, shallow focus',
    'crushed green leaves in a rough stone mortar with a pestle beside it',
  ],
  'ingredienten/gefermenteerde-soja': [
    'dried soybeans heaped in a wooden bowl, macro, warm side light',
    'traditional Korean earthenware fermentation jars on a stone terrace in morning light',
    'dark fermented soybean paste in a ceramic dish, thick textured surface',
  ],

  /* ── Huid van binnenuit — wetenschapsspoor, bestaand ── */
  'gut-skin/acne-en-darmonderzoek': [
    'two empty glass petri dishes side by side on a pale grey surface',
    'a stack of printed pages with dense unreadable text, very shallow focus',
    'close-up of forearm skin texture with fine hair in soft raking light',
  ],
  'gut-skin/darm-huid-as': [
    'two smooth river stones on pale sand joined by a single taut strand of thread',
    'a long coiled length of natural rope on a linen sheet, seen from above',
    'macro of a fern frond unfurling, backlit',
  ],
  'gut-skin/darmbarriere-en-ontstekingsprocessen': [
    'a dense wall of small round pebbles fitted tightly together with one gap between them',
    'macro of woven linen fabric with a single thread pulled loose',
    'pomegranate seeds packed tightly in their pale membrane, close-up',
  ],
  'gut-skin/darmmicrobioom-en-huidmicrobioom': [
    'two circular fields of scattered poppy seeds on white paper, one dense and one sparse',
    'macro of kefir grains in a clear glass jar, soft daylight',
    'close-up of forearm skin texture in low raking light, fine detail',
  ],
  'gut-skin/probiotica-en-de-europese-regels': [
    'an empty glass petri dish on a pale grey desk beside a folded blank document',
    'rows of plain unlabelled glass jars on a wooden shelf',
    'a wooden rubber stamp and an ink pad resting on a blank paper form',
  ],
  'gut-skin/voeding-en-huid': [
    'a shallow ceramic bowl of mixed grains and seeds beside a handful of fresh greens',
    'a wooden board with sliced raw vegetables, seen from above in natural light',
    'olive oil being poured in a thin stream into a small white dish',
  ],

  /* ── Huid van binnenuit — wetenschapsspoor, nieuw ── */
  'gut-skin/zuivel-en-acne': [
    'a plain glass of milk on a pale table, strong side light, shallow focus',
    'a wedge of hard cheese and a small pot of yoghurt on rough linen',
    'close-up of a spoon lifting thick set yoghurt out of a ceramic pot',
  ],
  'gut-skin/suiker-en-glycatie': [
    'white sugar crystals spilled across dark slate, extreme macro',
    'caramel darkening in a pan, close-up of the surface catching light',
    'a torn slice of toasted bread, crust texture in raking light',
  ],
  'gut-skin/slaap-en-huid': [
    'rumpled white linen bedding in early morning light, empty, no people',
    'a bedside table with a plain glass of water, dawn light through a thin curtain',
    'a hand resting open on a linen sheet, soft focus, no face',
  ],

  /* ── Huid van binnenuit — commercieel spoor, nieuw ── */
  'gut-skin/zink-in-je-eten': [
    'pumpkin seeds and cashews spilled from a paper bag across pale linen, macro',
    'fresh oysters on crushed ice seen from directly above',
    'a loaf of wholegrain bread torn open, crumb texture in macro',
  ],
  /*
    Bewust géén vitamine C hier, hoe voor de hand liggend dat ook is. DV8-03 toetst
    op siteniveau: er staat al een artikel over vitamine C als cosmetisch
    ingrediënt dat naar onderzoek linkt, en een commercieel voedingsartikel over
    hetzelfde onderwerp zou de site als geheel in overtreding brengen. Vitamine E
    heeft een even bruikbare goedgekeurde claim en nergens anders op de site een
    tegenhanger. De controle in check-compliance.mjs bewaakt dit.
  */
  'gut-skin/vitamine-e-op-je-bord': [
    'sunflower seeds spilling from a folded paper packet onto pale stone, macro',
    'a halved avocado on a wooden board, flesh catching the light',
    'golden oil being poured in a thin stream into a small glass bowl',
  ],
  'gut-skin/biotine': [
    'brown eggs in a wire basket with one cracked open into a small white bowl',
    'walnuts and almonds scattered on a worn wooden board, macro',
    'cooked lentils in a ceramic bowl with steam rising, close-up',
  ],
  'gut-skin/collageensupplementen': [
    'a plain unlabelled amber glass jar of white powder beside a small measuring spoon on pale stone',
    'bone broth simmering gently in a pot, close-up of the surface',
    'a scoop of fine white powder dissolving in a clear glass of water',
  ],
};

const wacht = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const bestaat = (pad) =>
  access(pad).then(
    () => true,
    () => false,
  );

/** Stabiel zaad: dezelfde sleutel levert bij een herhaling hetzelfde beeld. */
function zaadVan(tekst) {
  let som = 0;
  for (let i = 0; i < tekst.length; i++) som = (som * 31 + tekst.charCodeAt(i)) % 100000;
  return som;
}

async function haalOp(prompt, bestandsnaam, seed) {
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=${BREEDTE}&height=${HOOGTE}&nologo=true&seed=${seed}`;

  const antwoord = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!antwoord.ok) throw new Error(`${antwoord.status} ${antwoord.statusText}`);

  const inhoud = Buffer.from(await antwoord.arrayBuffer());
  if (inhoud.length < 5000) throw new Error(`verdacht klein bestand (${inhoud.length} bytes)`);

  const bron = sharp(inhoud);
  const { width = 0, height = 0 } = await bron.metadata();

  /*
    Alleen opschalen als het beeld daadwerkelijk kleiner terugkwam dan bedoeld.
    Met een token gebeurt dat niet en blijft de originele scherpte behouden;
    tweemaal door een resize halen zou die alleen maar zachter maken.

    De drempel is bewust 1,25 en niet 1,01. Met token komt er 1920 breed uit
    terwijl DOELBREEDTE 2048 is, dus schaal = 1,067 — met de oude drempel ging
    dat beeld alsnog door een resize plus unsharp mask, precies wat hierboven
    staat te vermijden. Onder 1,25 valt er niets te winnen: die paar procent
    interpoleert de browser net zo goed, en zonder het detailverlies.
  */
  const schaal = width > 0 ? Math.min(2, DOELBREEDTE / width) : 1;
  const bewerkt =
    schaal >= 1.25
      ? bron
          .resize(Math.round(width * schaal), Math.round(height * schaal), { kernel: 'lanczos3' })
          .sharpen({ sigma: 0.7, m1: 0.5, m2: 0.5 })
      : bron;

  const uit = await bewerkt.jpeg({ quality: 92, mozjpeg: true }).toBuffer();
  await writeFile(join(doelmap, bestandsnaam), uit);

  const na = await sharp(uit).metadata();
  return {
    bytes: uit.length,
    breedte: na.width,
    hoogte: na.height,
    gegenereerd: `${width}×${height}`,
    /*
      Of er daadwerkelijk is opgeschaald, en niet of er een token was. Dat waren
      tot 2026-08-12 hetzelfde, in de veronderstelling dat een token hogere
      resolutie oplevert. Gemeten bij de run van die dag: dat doet het niet — de
      dienst gaf ook mét token 1024×576 terug op elk van de 84 verzoeken. Het
      verslag hoort te melden wat er gebeurd is, niet wat de bedoeling was.
    */
    opgeschaald: schaal >= 1.25,
  };
}

/* ------------------------------------------------------------------ *
   Opdrachtenlijst
 * ------------------------------------------------------------------ */

await mkdir(doelmap, { recursive: true });

/** Wat er bij een eerdere run al gelukt is, en met welke stijlversie. */
const eerder = new Map();
if (await bestaat(verslagPad)) {
  try {
    for (const regel of JSON.parse(await readFile(verslagPad, 'utf8'))) {
      if (regel.gelukt) eerder.set(regel.bestand, regel);
    }
  } catch {
    /* Onleesbaar verslag betekent hooguit dat alles opnieuw gemaakt wordt. */
  }
}

const opdrachten = [];
for (const [sleutel, lijst] of Object.entries(onderwerpen)) {
  const slug = sleutel.split('/')[1];
  lijst.forEach((onderwerp, i) => {
    const bestand = i === 0 ? `${slug}.jpg` : `${slug}-${i + 1}.jpg`;
    opdrachten.push({
      sleutel: `${sleutel}#${i}`,
      bestand,
      rol: i === 0 ? 'hero' : 'tekst',
      onderwerp,
      prompt: `${onderwerp}, ${STIJL}, ${NIET}`,
    });
  });
}

/* Overslaan wat er al staat in de huidige stijlversie. */
const teDoen = [];
for (const opdracht of opdrachten) {
  const vorig = eerder.get(opdracht.bestand);
  const heeftBestand = await bestaat(join(doelmap, opdracht.bestand));
  if (heeftBestand && vorig?.stijlversie === STIJLVERSIE) {
    opdracht.overgeslagen = true;
    continue;
  }
  teDoen.push(opdracht);
}

const minuten = Math.round((teDoen.length * (PAUZE_MS + 12_000)) / 60000);

/*
  Of de token gevonden is, staat bovenaan de uitvoer en niet ergens halverwege.
  Een run van veertig minuten die achteraf op de anonieme laag blijkt te hebben
  gedraaid, is veertig minuten weg. De waarde zelf wordt nooit getoond.
*/
console.log(
  token
    ? 'Token gevonden — dat geeft een ruimer aanvraagtempo, geen hogere resolutie.'
    : 'Geen POLLINATIONS_TOKEN gevonden in .env of de omgeving; het aanvraagtempo is dan krapper.',
);
console.log('De dienst levert hoe dan ook ~0,6 megapixel; beelden worden lokaal 2× opgeschaald.');
console.log(
  `Stijlversie ${STIJLVERSIE}. ${opdrachten.length} beelden in totaal, ` +
    `${opdrachten.length - teDoen.length} al aanwezig, ${teDoen.length} op te halen ` +
    `(~${minuten} minuten). Resolutie: ${BREEDTE}×${HOOGTE}${token ? ' met token' : ', daarna 2× opgeschaald'}.\n`,
);

/* ------------------------------------------------------------------ *
   Uitvoeren
 * ------------------------------------------------------------------ */

const verslag = [];
for (const opdracht of opdrachten) {
  if (opdracht.overgeslagen) {
    verslag.push(eerder.get(opdracht.bestand));
  }
}

for (const [index, opdracht] of teDoen.entries()) {
  const nummer = `${index + 1}/${teDoen.length}`;
  try {
    const uitkomst = await haalOp(opdracht.prompt, opdracht.bestand, zaadVan(opdracht.sleutel));
    console.log(
      `${nummer} ✓ ${opdracht.bestand} — ${uitkomst.gegenereerd} → ${uitkomst.breedte}×${uitkomst.hoogte}, ${Math.round(uitkomst.bytes / 1024)} kB`,
    );
    verslag.push({
      bestand: opdracht.bestand,
      sleutel: opdracht.sleutel,
      rol: opdracht.rol,
      onderwerp: opdracht.onderwerp,
      prompt: opdracht.prompt,
      stijlversie: STIJLVERSIE,
      gegenereerd: uitkomst.gegenereerd,
      afmeting: `${uitkomst.breedte}×${uitkomst.hoogte}`,
      bytes: uitkomst.bytes,
      opgeschaald: uitkomst.opgeschaald,
      datum: new Date().toISOString().slice(0, 10),
      gelukt: true,
    });
  } catch (fout) {
    console.log(`${nummer} ✗ ${opdracht.bestand} — ${fout.message}`);
    verslag.push({
      bestand: opdracht.bestand,
      sleutel: opdracht.sleutel,
      stijlversie: STIJLVERSIE,
      gelukt: false,
      fout: fout.message,
    });
  }

  /* Tussentijds wegschrijven, zodat een afgebroken run niet alles kwijt is. */
  await writeFile(verslagPad, JSON.stringify(verslag, null, 2));
  if (index < teDoen.length - 1) await wacht(PAUZE_MS);
}

await writeFile(verslagPad, JSON.stringify(verslag, null, 2));
await schrijfHerkomst(verslag);

const mislukt = verslag.filter((r) => !r?.gelukt);
console.log(`\nKlaar. ${verslag.length - mislukt.length} gelukt, ${mislukt.length} mislukt.`);
if (mislukt.length) console.log('Mislukt:', mislukt.map((r) => r.bestand).join(', '));

/* ------------------------------------------------------------------ *
   Herkomst vastleggen

   Wie AI-beeld gebruikt, hoort na te kunnen laten zien wát er gegenereerd is
   en waarmee. Dit bestand is de vindplaats waar `/redactionele-richtlijnen`
   de lezer naar verwijst.
 * ------------------------------------------------------------------ */

async function schrijfHerkomst(regels) {
  const gelukt = regels.filter((r) => r?.gelukt);
  const regel = (r) =>
    `| \`${r.bestand}\` | ${r.rol === 'hero' ? 'hero' : 'in de tekst'} | ${r.onderwerp} | ${r.gegenereerd} → ${r.afmeting} | ${r.datum} |`;

  const inhoud = `# Herkomst van het beeld

Dit bestand wordt geschreven door \`scripts/genereer-beeld.mjs\` en is niet met
de hand bij te werken — draai het script opnieuw.

## Regels

1. Beeld wordt bij het bouwen één keer opgehaald en in de repo gezet. De site
   zelf verbindt nooit met een beeldgenerator; dat zou de invariant "geen
   externe verzoeken" breken.
2. Er staat geen enkel gezicht op de site. Geen AI-portret wordt gepresenteerd
   als foto van een bestaand persoon.
3. Geen AI-nabootsing van een specifiek, koopbaar product. Dat zou de lezer
   misleiden over wat hij daadwerkelijk koopt.
4. Beeld toont een concreet ding uit het artikel — de grondstof, de bereiding,
   de textuur — en nooit het beloofde effect. Dezelfde regel als voor de tekst.

## Werkwijze

- **Generator:** Pollinations.ai, model \`sana\` (het enige dat de dienst
  aanbiedt; \`flux\` en \`turbo\` vallen daar stilzwijgend op terug).
- **Stijlversie:** ${STIJLVERSIE}. Eén vaste stijlzin voor alle beelden, zodat de
  reeks samenhangt: \`${STIJL}\`
- **Uitgesloten:** \`${NIET}\`
- **Resolutie:** de dienst levert ongeveer 0,6 megapixel (1024×576), ongeacht wat
  er gevraagd wordt. Dat geldt ook mét \`POLLINATIONS_TOKEN\`: bij de meting van
  2026-08-12 is er op 1920×1080 gevraagd en kwam er op elk verzoek 1024×576
  terug. Een token verhoogt de resolutie dus niet — het geeft alleen een ruimer
  aanvraagtempo.
- **Nabewerking:** ${gelukt.some((r) => r.opgeschaald) ? 'de beelden zijn na het ophalen met sharp 2× opgeschaald (Lanczos3 en een milde unsharp mask) en als JPEG kwaliteit 92 weggeschreven. Dat voegt geen detail toe, maar voorkomt dat de browser zelf moet interpoleren en geeft Astro genoeg pixels voor nette WebP-varianten' : 'geen opschaling nodig geweest; de beelden zijn als JPEG kwaliteit 92 weggeschreven'}.

## Beelden (${gelukt.length})

| Bestand | Rol | Onderwerp | Afmeting | Datum |
| --- | --- | --- | --- | --- |
${gelukt.map(regel).join('\n')}
`;

  await writeFile(herkomstPad, inhoud);
}
