/**
 * Echte fotografie ophalen voor Mochi Glow, in twee fasen, met jou als keurmeester.
 *
 *   node scripts/haal-stockbeeld.mjs kandidaten   # zoeken en contactbladen maken
 *   node scripts/haal-stockbeeld.mjs kies         # jouw keuze definitief ophalen
 *
 * ── Waarom twee fasen ───────────────────────────────────────────────────────
 *
 * De eerste opzet koos zelf en schreef meteen naar `src/assets/artikelen/`. Op
 * het contactblad van 2026-08-13 bleek wat daarvan terechtkwam: een lachend
 * gezicht bij centella-asiatica, drie flesjes aura-spray met leesbaar merk bij
 * galactomyces, een honkbalfoto bij rijstextract, en een stuk of tien
 * tekeningen en schilderijen tussen de foto's. De filters keken namelijk alleen
 * naar de *titel* van een bestand, en een foto zonder beschrijvende titel glipt
 * daar zo doorheen.
 *
 * Een titel is geen betrouwbare beschrijving van een foto. Een mens die ernaar
 * kijkt wel. Daarom kiest dit script niet meer zelf: fase 1 zet per plek een
 * rijtje kandidaten op één blad, fase 2 haalt alleen op wat jij aanwijst.
 *
 * ── Waarom Pexels ───────────────────────────────────────────────────────────
 *
 * Gemeten op 2026-08-13: Openverse geeft voor rawpixel altijd `editor_1024`
 * (1024 px) en voor StockSnap een thumbnail van 960 px, ook als het origineel
 * 4608×3456 is. Elk geprobeerd URL-patroon naar een groter formaat gaf 404.
 * Langs die weg is scherp beeld dus onmogelijk, en scherpte was de hele reden
 * om van het gegenereerde beeld af te stappen (onderzoek/09, par. 4.1).
 *
 * Pexels geeft met een gratis sleutel wél het origineel, meestal 3000-6000 px
 * breed, en het is echte redactionele fotografie in plaats van archiefmateriaal.
 * Zet de sleutel in `.env` als `PEXELS_SLEUTEL=…` (aan te maken op
 * pexels.com/api). Wikimedia blijft als terugval voor onderwerpen die op een
 * fotobank niet bestaan, bijvoorbeeld houttuynia cordata of bijvoet; daar
 * levert Openverse wél het origineel.
 *
 * ── Licentie ────────────────────────────────────────────────────────────────
 *
 * Let op: de Pexels-licentie is géén CC0. Gratis voor commercieel gebruik en
 * naamsvermelding is niet verplicht, maar er zitten twee grenzen aan die hier
 * gelden: een foto mag niet als losse foto doorverkocht worden, en een
 * herkenbaar persoon of merk in beeld mag niet overkomen als aanbeveling. Dat
 * laatste is precies waarom de gezichtsregel hieronder blijft staan, hij is nu
 * niet alleen huisstijl maar ook licentievoorwaarde. Wikimedia-materiaal blijft
 * uitsluitend CC0/publiek domein. Per beeld wordt de herkomst vastgelegd in
 * `src/assets/HERKOMST.md`, ook waar naamsvermelding niet verplicht is.
 *
 * ── Twee harde regels, nu bij het kijken afgedwongen ────────────────────────
 *
 * 1. **Geen gezichten.** Vastgelegd in CLAUDE.md en onderzoek/07 par. 4.1. Huid
 *    mag wél: onderarm, schouder, handen, huidtextuur.
 * 2. **Geen belofte in beeld.** Een pot crème mag, een stralend getransformeerd
 *    gezicht niet, dat zou een claim zijn die de tekst niet mag maken.
 *
 * De tekstfilters hieronder zijn een voorselectie, geen garantie. Ze halen het
 * grofste eruit zodat er iets te kiezen valt; het contactblad is de controle.
 */

import { mkdir, writeFile, readFile, readdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const hier = dirname(fileURLToPath(import.meta.url));
const wortel = join(hier, '..');
const doelmap = join(wortel, 'src', 'assets', 'artikelen');
const keuzemap = join(wortel, 'beeldkeuze');
const kandidatenPad = join(keuzemap, 'kandidaten.json');
const keuzePad = join(keuzemap, 'KEUZE.txt');
const verslagPad = join(doelmap, 'verslag.json');
const herkomstPad = join(wortel, 'src', 'assets', 'HERKOMST.md');

const UA = { 'User-Agent': 'MochiGlow/1.0 (redactioneel beeldonderzoek)' };
const BREEDTE = 2048;
const KANDIDATEN = 6;
/** Onder deze breedte heeft ophalen geen zin: dan is 2048 px niet te halen. */
const MIN_BREEDTE = 2000;

/** Verhoog om alles opnieuw op te halen. */
const BEELDVERSIE = 7;

/* ── Sleutel ─────────────────────────────────────────────────────────────── */

async function leesEnv() {
  try {
    const tekst = await readFile(join(wortel, '.env'), 'utf8');
    for (const regel of tekst.split('\n')) {
      const m = regel.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* Geen .env is geen fout; dan draait alles op Wikimedia. */
  }
}

/* ── Voorselectie op tekst ───────────────────────────────────────────────── */

/*
  Titels en beschrijvingen die op een tekening, sjabloon of documentatiestuk
  wijzen in plaats van op redactionele fotografie.
*/
const NIET_IN_TEKST = new RegExp(
  [
    'png|sticker|clipart|clip art|illustration|illustrated|vector|drawing|sketch|icon|logo',
    'mockup|template|frame|border|collage|wallpaper|typography|poster|art print',
    'painting|engraving|lithograph|etching|woodcut|vintage ad|advertisement',
    'diagram|schema|chart|graph|infographic|figure|fig\\.|plate|labell?ed|annotated',
    'anatomy|botanical|herbarium|specimen|holotype|taxonomy|classification',
    'scan|scanned|manuscript|book page|title page|map|atlas',
    'microscope|micrograph|slide|stained',
    'museum|coin|stamp|medal|artifact|sculpture',
    'screenshot|montage|before and after',
  ].join('|'),
  'i',
);

/*
  Woorden die op een persoon in beeld duiden. Dit ving de lachende vrouw bij
  centella-asiatica niet af, want die foto had geen beschrijvende titel, maar
  Pexels levert wél een `alt`-tekst, en daar staat het meestal wel in. Het scheelt
  een hoop bladeren; de sluitende controle blijft het contactblad.
*/
const PERSOON_IN_TEKST =
  /\b(portrait|face|facial|selfie|smile|smiling|model|headshot|makeup look|lips|eye makeup|eyes|man|men|woman|women|girl|boy|person|people|lady|guy|child|kid|couple|family)\b/i;

/** Tekst in beeld is bijna altijd storend en soms een merk. */
const TEKST_IN_BEELD = /\b(sign|signage|text|lettering|quote|word|letter|banner|label|poster|billboard|book cover|logo)\b/i;

function bruikbaar(kandidaat) {
  const tekst = `${kandidaat.titel} ${kandidaat.beschrijving}`.trim();
  if (kandidaat.breedte < MIN_BREEDTE) return false;
  if (kandidaat.breedte / kandidaat.hoogte < 0.9) return false;
  if (NIET_IN_TEKST.test(tekst)) return false;
  if (PERSOON_IN_TEKST.test(tekst)) return false;
  if (TEKST_IN_BEELD.test(tekst)) return false;
  return true;
}

/**
 * Per artikel drie zoekopdrachten: hero, en twee voor in de tekst.
 *
 * De verdeling is bewust gemengd. Op verzoek staat er niet alleen grondstof en
 * plant in, maar ook huid, textuur en cosmetica, zolang het geen gezicht is en
 * geen belofte uitbeeldt.
 */
const onderwerpen = {
  /* ── Wat zit erin? ── */
  'ingredienten/centella-asiatica': ['pennywort leaves green', 'cosmetic cream texture', 'shoulder skin closeup'],
  'ingredienten/ceramiden': ['moisturizer jar white', 'dry skin hand closeup', 'cream swatch texture'],
  'ingredienten/galactomyces': ['rice fermentation jar', 'essence bottle glass', 'liquid pouring glass'],
  'ingredienten/hyaluronzuur': ['water drop macro', 'serum dropper glass', 'gel texture transparent'],
  'ingredienten/niacinamide': ['white powder dish', 'serum bottle dropper', 'arm skin texture'],
  'ingredienten/pdrn': ['salmon fillet fresh', 'glass ampoule vial', 'laboratory glass pipette'],
  'ingredienten/propolis': ['honeycomb closeup', 'propolis resin amber', 'honey dripping spoon'],
  'ingredienten/rijstextract': ['white rice grains macro', 'rice washing water bowl', 'rice bran texture'],
  'ingredienten/snail-mucin': ['snail shell spiral', 'clear gel texture macro', 'wet green leaves'],
  'ingredienten/vitamine-c': ['orange slice macro', 'amber glass bottle', 'citrus fruit closeup'],
  'ingredienten/groene-thee': ['green tea leaves', 'matcha powder bowl', 'tea steeping glass cup'],
  'ingredienten/ginseng': ['ginseng root', 'dried root slices', 'herbal infusion cup'],
  'ingredienten/bijvoet': ['mugwort herb leaves', 'dried herbs bundle', 'herbal tea bowl'],
  'ingredienten/houttuynia-cordata': ['heart shaped leaves green', 'herb leaves rain drops', 'mortar pestle herbs'],
  'ingredienten/gefermenteerde-soja': ['soybeans bowl', 'fermentation clay pots', 'soybean paste bowl'],

  /* ── Huid van binnenuit ── */
  'gut-skin/acne-en-darmonderzoek': ['petri dish laboratory', 'scientific papers stack', 'forearm skin texture'],
  'gut-skin/darm-huid-as': ['river stones balance', 'rope coil natural', 'fern frond unfurling'],
  'gut-skin/darmbarriere-en-ontstekingsprocessen': ['pebbles wall texture', 'linen fabric weave macro', 'pomegranate seeds macro'],
  'gut-skin/darmmicrobioom-en-huidmicrobioom': ['petri dish culture', 'kefir grains jar', 'skin texture macro'],
  /*
    "rubber stamp paper" leverde op 2026-08-13 nul bruikbare kandidaten op, Pexels heeft dat onderwerp domweg niet in liggend formaat. Vervangen door een
    beeld dat hetzelfde zegt: regels die ergens vastliggen.
  */
  'gut-skin/probiotica-en-de-europese-regels': ['empty glass jars shelf', 'blank document paper', 'old law books shelf'],
  'gut-skin/voeding-en-huid': ['grains seeds bowl', 'fresh vegetables board', 'olive oil pouring'],
  'gut-skin/zuivel-en-acne': ['glass of milk', 'yoghurt bowl spoon', 'cheese wedge board'],
  'gut-skin/suiker-en-glycatie': ['sugar crystals macro', 'caramel pan closeup', 'toasted bread crust'],
  'gut-skin/slaap-en-huid': ['white bed linen morning', 'water glass bedside', 'hand resting linen'],
  'gut-skin/zink-in-je-eten': ['pumpkin seeds cashews', 'oysters ice', 'wholegrain bread loaf'],
  'gut-skin/vitamine-e-op-je-bord': ['sunflower seeds macro', 'avocado half', 'olive oil glass bowl'],
  'gut-skin/biotine': ['eggs bowl brown', 'walnuts almonds board', 'cooked lentils bowl'],
  'gut-skin/collageensupplementen': ['collagen powder jar', 'bone broth pot', 'powder scoop water glass'],

  /* ── Beauty ── */
  /*
    Niet "cleansing oil bottle": elke treffer daarop was een fles met een leesbaar
    merk erop, en op een contactblad van 360 px zie je dat niet. Een zoekterm die
    om een product vraagt, levert productfotografie mét verpakking op, vraag dus
    om de stof zelf.
  */
  'beauty/dubbel-reinigen': ['golden oil texture macro', 'washcloth folded neutral', 'water splash basin'],
  'beauty/laagjes-en-volgorde': ['skincare bottles row minimal', 'cream jar open texture', 'bathroom shelf minimal'],
  'beauty/sheetmaskers': ['folded cotton sheet white', 'ceramic bowl water', 'aloe leaf cut'],
};

const bestaat = (p) => access(p).then(() => true, () => false);
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

async function haalMetGeduld(url, opties = {}, pogingen = 4) {
  for (let i = 0; i < pogingen; i++) {
    const antwoord = await fetch(url, { headers: UA, ...opties });
    if (antwoord.status !== 429) return antwoord;
    await wacht(4000 * 2 ** i);
  }
  return fetch(url, { headers: UA, ...opties });
}

/* ── Zoeken ──────────────────────────────────────────────────────────────── */

async function zoekPexels(term) {
  const sleutel = process.env.PEXELS_SLEUTEL;
  if (!sleutel) return [];

  const url =
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(term)}` +
    `&per_page=30&orientation=landscape&size=large`;
  const antwoord = await haalMetGeduld(url, { headers: { ...UA, Authorization: sleutel } });
  if (!antwoord.ok) {
    console.log(`   ! Pexels antwoordde ${antwoord.status} op "${term}"`);
    return [];
  }
  const j = await antwoord.json();
  return (j.photos ?? []).map((p) => ({
    id: `pexels-${p.id}`,
    titel: p.alt ?? '',
    beschrijving: '',
    maker: p.photographer ?? 'onbekend',
    licentie: 'pexels',
    bron: 'pexels',
    vindplaats: p.url,
    breedte: p.width,
    hoogte: p.height,
    origineel: p.src?.original,
    voorbeeld: p.src?.medium ?? p.src?.small,
  }));
}

/**
 * Terugval voor onderwerpen die geen fotobank haalt, bijvoet, houttuynia.
 * Alleen Wikimedia: dat is de enige bron in Openverse die het origineel geeft
 * in plaats van een preview (gemeten 2026-08-13).
 */
async function zoekWikimedia(term) {
  const url =
    `https://api.openverse.org/v1/images/?q=${encodeURIComponent(term)}` +
    `&license=cc0,pdm&source=wikimedia&size=large&page_size=20&category=photograph`;
  const antwoord = await haalMetGeduld(url);
  if (!antwoord.ok) return [];
  const j = await antwoord.json();
  return (j.results ?? []).map((r) => ({
    id: `wikimedia-${r.id}`,
    titel: r.title ?? '',
    beschrijving: (r.tags ?? []).map((t) => t.name).join(' '),
    maker: r.creator ?? 'onbekend',
    licentie: r.license ?? 'cc0',
    bron: 'wikimedia',
    vindplaats: r.foreign_landing_url ?? r.url,
    breedte: r.width ?? 0,
    hoogte: r.height ?? 0,
    origineel: r.url,
    voorbeeld: r.thumbnail ?? r.url,
  }));
}

async function zoekKandidaten(term) {
  const gevonden = [];
  const gezien = new Set();

  for (const zoeker of [zoekPexels, zoekWikimedia]) {
    if (gevonden.length >= KANDIDATEN) break;
    for (const k of await zoeker(term)) {
      if (gevonden.length >= KANDIDATEN) break;
      if (gezien.has(k.id) || !bruikbaar(k)) continue;
      gezien.add(k.id);
      gevonden.push(k);
    }
    await wacht(300);
  }
  return gevonden;
}

/* ── Nabewerking ─────────────────────────────────────────────────────────── */

/** Zelfde gradatie voor alle beelden, zodat losse foto's als één reeks lezen. */
async function gradeer(buffer) {
  const bron = sharp(buffer).rotate();
  const meta = await bron.metadata();
  const breedte = Math.min(meta.width ?? BREEDTE, BREEDTE);
  const hoogte = Math.round(breedte * (9 / 16));

  const korrel = Buffer.alloc(breedte * hoogte);
  for (let i = 0; i < korrel.length; i++) korrel[i] = 124 + Math.floor(Math.random() * 9);

  return bron
    .resize(breedte, hoogte, { fit: 'cover', position: 'attention' })
    .linear(1.02, -3)
    .modulate({ saturation: 0.87 })
    .composite([{ input: korrel, raw: { width: breedte, height: hoogte, channels: 1 }, blend: 'soft-light' }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
}

/* ── Opdrachtenlijst ─────────────────────────────────────────────────────── */

const opdrachten = [];
for (const [sleutel, termen] of Object.entries(onderwerpen)) {
  const slug = sleutel.split('/')[1];
  termen.forEach((term, i) => {
    opdrachten.push({
      sleutel: `${sleutel}#${i}`,
      slug,
      bestand: i === 0 ? `${slug}.jpg` : `${slug}-${i + 1}.jpg`,
      rol: i === 0 ? 'hero' : 'tekst',
      plek: i,
      term,
    });
  });
}

/* ── Fase 1: kandidaten ──────────────────────────────────────────────────── */

async function faseKandidaten(filter) {
  await mkdir(keuzemap, { recursive: true });
  const teDoen = filter ? opdrachten.filter((o) => o.slug.includes(filter)) : opdrachten;
  if (!teDoen.length) {
    console.log(`Geen enkel artikel komt overeen met "${filter}".`);
    return;
  }

  console.log(`Kandidaten zoeken voor ${teDoen.length} plekken.\n`);

  /*
    Beginnen bij wat er al ligt, niet bij niets.

    Hier stond `const alles = {}`. Een gefilterde run schreef daarmee een
    kandidatenbestand met alleen dát ene artikel erin, en gooide de andere
    zevenentwintig weg, waarna `kies` voor al die artikelen meldde dat het
    gekozen nummer "niet op het blad" stond. Even vervelend als de keuzelijst
    kwijtraken, en net zo stil.
  */
  let alles = {};
  if (await bestaat(kandidatenPad)) {
    try {
      alles = JSON.parse(await readFile(kandidatenPad, 'utf8'));
    } catch {
      /* Onleesbaar bestand betekent hooguit dat alles opnieuw gezocht wordt. */
    }
  }

  for (const [i, o] of teDoen.entries()) {
    const kandidaten = await zoekKandidaten(o.term);
    alles[o.bestand] = { ...o, kandidaten };

    const bronnen = kandidaten.map((k) => k.bron[0]).join('');
    console.log(`${i + 1}/${teDoen.length} ${o.bestand.padEnd(38)} ${kandidaten.length} kandidaten [${bronnen}], "${o.term}"`);
    await wacht(400);
  }

  await writeFile(kandidatenPad, JSON.stringify(alles, null, 2));

  /*
    Per artikel één blad: drie rijen (hero, tekst 2, tekst 3), zes kolommen.
    Alleen de artikelen die deze run gezocht zijn krijgen een nieuw blad; de rest
    houdt het blad dat er al ligt, want dat hoort bij de kandidaten die er al
    liggen.
  */
  const perSlug = {};
  for (const o of teDoen) {
    const rij = alles[o.bestand];
    if (rij) (perSlug[rij.slug] ??= []).push(rij);
  }

  for (const [slug, rijen] of Object.entries(perSlug)) {
    await maakKandidatenblad(slug, rijen.sort((a, b) => a.plek - b.plek));
  }

  await schrijfKeuzeblad();

  console.log(`\nContactbladen staan in beeldkeuze/, één per artikel.`);
  console.log(`Vul je keuze in beeldkeuze/KEUZE.txt en draai daarna:`);
  console.log(`  node scripts/haal-stockbeeld.mjs kies`);
}

async function maakKandidatenblad(slug, rijen) {
  const CEL_B = 360;
  const CEL_H = 203;
  const BIJSCHRIFT = 24;
  const MARGE = 10;
  const RIJKOP = 26;

  const breedte = MARGE * 2 + KANDIDATEN * (CEL_B + MARGE);
  const rijHoogte = RIJKOP + CEL_H + BIJSCHRIFT + MARGE;
  const hoogte = MARGE + rijen.length * rijHoogte + 40;

  const lagen = [];
  const teksten = [];

  rijen.forEach((rij, r) => {
    const top = MARGE + r * rijHoogte;
    const naam = rij.plek === 0 ? 'hero' : `tekst ${rij.plek + 1}`;
    teksten.push(`<text x="${MARGE}" y="${top + 17}" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2b2b2b">${naam}, "${rij.term}"</text>`);

    rij.kandidaten.forEach((k, c) => {
      const left = MARGE + c * (CEL_B + MARGE);
      lagen.push({ kandidaat: k, left, top: top + RIJKOP });
      const bijschrift = `${c + 1}. ${k.bron} ${k.breedte}px`;
      teksten.push(
        `<text x="${left}" y="${top + RIJKOP + CEL_H + 17}" font-family="sans-serif" font-size="14" fill="#444">${bijschrift}</text>`,
      );
    });
  });

  const tegels = [];
  for (const laag of lagen) {
    try {
      const antwoord = await haalMetGeduld(laag.kandidaat.voorbeeld);
      if (!antwoord.ok) continue;
      const buf = Buffer.from(await antwoord.arrayBuffer());
      const tegel = await sharp(buf).resize(CEL_B, CEL_H, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer();
      tegels.push({ input: tegel, left: laag.left, top: laag.top });
    } catch {
      /* Een kandidaat die niet te tonen is, kun je ook niet kiezen. */
    }
  }

  const opschrift = Buffer.from(
    `<svg width="${breedte}" height="${hoogte}"><rect width="100%" height="100%" fill="#faf7f5"/>${teksten.join('')}</svg>`,
  );

  await sharp(opschrift)
    .composite(tegels)
    .jpeg({ quality: 86 })
    .toFile(join(keuzemap, `blad-${slug}.jpg`));

  console.log(`   blad-${slug}.jpg`);
}

/**
 * De keuzelijst bijwerken zonder hem kwijt te raken.
 *
 * Let op: hier stond eerst alleen het artikel waarvoor net gezocht was. Een
 * gefilterde run (`kandidaten probiotica`) wiste daarmee de zevenentwintig
 * andere regels, inclusief keuzes die al gemaakt waren. Er wordt daarom altijd
 * over álle artikelen geschreven, en bestaande waarden blijven staan.
 */
async function schrijfKeuzeblad() {
  const regels = [
    '# Welk beeld wordt het?',
    '#',
    '# Per artikel drie nummers: hero, tekst 2, tekst 3.',
    '# De nummers staan onder de beelden op beeldkeuze/blad-<artikel>.jpg.',
    '#',
    '#   -  = nog niet gekozen, wordt overgeslagen (het oude beeld blijft staan)',
    '#   0  = geen van deze deugt; pas de zoekterm aan in het script en zoek opnieuw',
    '#',
    '# Draai daarna: node scripts/haal-stockbeeld.mjs kies',
    '',
  ];

  const bestaande = {};
  if (await bestaat(keuzePad)) {
    for (const regel of (await readFile(keuzePad, 'utf8')).split('\n')) {
      const m = regel.match(/^\s*([a-z0-9-]+)\s*:\s*(.+?)\s*$/i);
      if (m) bestaande[m[1]] = m[2];
    }
  }

  const alleSlugs = [...new Set(Object.keys(onderwerpen).map((s) => s.split('/')[1]))].sort();
  for (const slug of alleSlugs) {
    regels.push(`${slug}: ${bestaande[slug] ?? '- - -'}`);
  }

  await writeFile(keuzePad, regels.join('\n') + '\n');
}

/* ── Fase 2: kiezen ──────────────────────────────────────────────────────── */

/**
 * @param {string} [filter] Beperk tot artikelen waarvan de naam dit bevat.
 *   Zonder filter worden alle gekozen beelden opnieuw opgehaald, dat mag, maar
 *   het is zonde van de tijd als er maar één artikel bij gekomen is.
 */
async function faseKies(filter) {
  if (!(await bestaat(kandidatenPad))) {
    console.log('Er zijn nog geen kandidaten. Draai eerst: node scripts/haal-stockbeeld.mjs kandidaten');
    return;
  }

  const alles = JSON.parse(await readFile(kandidatenPad, 'utf8'));
  const keuzes = {};
  for (const regel of (await readFile(keuzePad, 'utf8')).split('\n')) {
    if (/^\s*#/.test(regel)) continue;
    const m = regel.match(/^\s*([a-z0-9-]+)\s*:\s*(.+?)\s*$/i);
    if (m) keuzes[m[1]] = m[2].trim().split(/\s+/);
  }

  /* Wat er al ligt blijft liggen, tenzij er nu een keuze voor gemaakt is. */
  const verslag = [];
  if (await bestaat(verslagPad)) {
    try {
      for (const r of JSON.parse(await readFile(verslagPad, 'utf8'))) if (r?.gelukt) verslag.push(r);
    } catch {
      /* Onleesbaar verslag betekent hooguit dat er minder geschiedenis is. */
    }
  }

  let gedaan = 0;
  let overgeslagen = 0;

  for (const o of opdrachten) {
    if (filter && !o.slug.includes(filter)) continue;
    const gekozen = keuzes[o.slug]?.[o.plek];
    if (!gekozen || gekozen === '-' || gekozen === '0') {
      overgeslagen++;
      continue;
    }

    const rij = alles[o.bestand];
    const kandidaat = rij?.kandidaten?.[Number(gekozen) - 1];
    if (!kandidaat) {
      console.log(`✗ ${o.bestand.padEnd(38)} nummer ${gekozen} bestaat niet op het blad`);
      continue;
    }

    try {
      const antwoord = await haalMetGeduld(kandidaat.origineel);
      if (!antwoord.ok) throw new Error(`ophalen: ${antwoord.status}`);
      const ruw = Buffer.from(await antwoord.arrayBuffer());

      const uit = await gradeer(ruw);
      await writeFile(join(doelmap, o.bestand), uit);
      const na = await sharp(uit).metadata();

      console.log(`✓ ${o.bestand.padEnd(38)} ${na.width}×${na.height}  ${kandidaat.bron}, ${kandidaat.titel.slice(0, 40)}`);

      const bestaandIndex = verslag.findIndex((r) => r.bestand === o.bestand);
      const regel = {
        bestand: o.bestand,
        sleutel: o.sleutel,
        rol: o.rol,
        zoekterm: o.term,
        beeldversie: BEELDVERSIE,
        titel: kandidaat.titel,
        maker: kandidaat.maker,
        licentie: kandidaat.licentie,
        bron: kandidaat.bron,
        vindplaats: kandidaat.vindplaats,
        origineel: `${kandidaat.breedte}×${kandidaat.hoogte}`,
        afmeting: `${na.width}×${na.height}`,
        bytes: uit.length,
        datum: new Date().toISOString().slice(0, 10),
        gelukt: true,
      };
      if (bestaandIndex >= 0) verslag[bestaandIndex] = regel;
      else verslag.push(regel);
      gedaan++;
    } catch (fout) {
      console.log(`✗ ${o.bestand.padEnd(38)} ${fout.message}`);
    }

    await wacht(600);
  }

  await writeFile(verslagPad, JSON.stringify(verslag, null, 2));
  await schrijfHerkomst(verslag);

  console.log(`\n${gedaan} beelden vervangen, ${overgeslagen} overgeslagen (nog geen keuze).`);
  console.log('Controleer de reeks met: node scripts/maak-contactblad.mjs');
}

/* ── HERKOMST.md ─────────────────────────────────────────────────────────── */

async function schrijfHerkomst(verslag) {
  const gelukt = verslag.filter((r) => r?.gelukt);
  const bronnen = [...new Set(gelukt.map((r) => r.bron))].sort().join(', ') || 'geen';

  const rijen = gelukt
    .map(
      (r) =>
        `| \`${r.bestand}\` | ${r.rol === 'hero' ? 'hero' : 'in de tekst'} | ${r.titel || ', '} | ${r.maker} | ${r.licentie} | ${r.bron} | ${r.origineel} → ${r.afmeting} |`,
    )
    .join('\n');

  const tekst = `# Herkomst van het beeld

Geschreven door \`scripts/haal-stockbeeld.mjs\`; niet met de hand bijwerken.

## Regels

1. Beeld wordt één keer opgehaald en in de repo gezet. De site zelf verbindt
   nooit met een externe beelddienst, dat zou de invariant "geen externe
   verzoeken" breken.
2. **Licentie.** Wikimedia-materiaal is uitsluitend CC0 of publiek domein.
   Pexels-materiaal valt onder de Pexels-licentie: gratis voor commercieel
   gebruik en zonder naamsvermeldingsplicht, maar een foto mag niet als losse
   foto doorverkocht worden en een herkenbaar persoon of merk mag niet
   overkomen als aanbeveling. De maker staat hieronder toch vermeld: kunnen
   laten zien waar iets vandaan komt hoort bij deze site.
3. **Geen gezichten.** Huid mag: onderarm, schouder, handen, textuur.
4. Beeld toont een concreet ding uit het artikel, nooit het beloofde effect.

## Werkwijze

- **Bronnen:** ${bronnen}. Pexels voorop met een gratis sleutel, dat is de enige
  route naar het origineel. Openverse levert voor rawpixel en StockSnap alleen
  previews van 1024 respectievelijk 960 px, ongeacht hoe groot het origineel is;
  elk URL-patroon naar een groter formaat gaf 404 (gemeten 2026-08-13). Wikimedia
  is de terugval voor onderwerpen die op een fotobank niet bestaan.
- **Keuze:** niet door het script maar met de hand, van een contactblad met zes
  kandidaten per plek. De tekstfilters zijn een voorselectie; een titel beschrijft
  een foto niet betrouwbaar genoeg om er een gezicht of een merk mee buiten te
  houden.
- **Nabewerking:** bijgesneden naar 16:9 op ${BREEDTE} px breed met
  aandachtsgestuurde uitsnede, verzadiging naar 0,87, een kleine contraststap en
  fijne korrel in soft-light, dezelfde gradatie voor alle beelden, zodat de
  reeks samenhangt.

## Beelden (${gelukt.length})

| Bestand | Rol | Onderwerp | Maker | Licentie | Bron | Afmeting |
| --- | --- | --- | --- | --- | --- | --- |
${rijen}
`;

  await writeFile(herkomstPad, tekst);
}

/* ── Start ───────────────────────────────────────────────────────────────── */

await leesEnv();
const opdracht = process.argv[2];

if (opdracht === 'kandidaten') {
  if (!process.env.PEXELS_SLEUTEL) {
    console.log('Let op: geen PEXELS_SLEUTEL in .env, er wordt alleen op Wikimedia gezocht.\n');
  }
  await faseKandidaten(process.argv[3]);
} else if (opdracht === 'kies') {
  await faseKies(process.argv[3]);
} else {
  console.log(`Gebruik:
  node scripts/haal-stockbeeld.mjs kandidaten [artikel]   zoeken en contactbladen maken
  node scripts/haal-stockbeeld.mjs kies                   jouw keuze definitief ophalen

Met [artikel] beperk je het zoeken tot de artikelen waarvan de naam die tekst
bevat, bijvoorbeeld "ginseng" of "vitamine".`);
}
