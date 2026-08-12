/**
 * Compliance-controle voor Mochi Glow.
 *
 * Draait via `npm run check` en als eerste stap van `npm run build`, zodat een
 * artikel dat de regels overtreedt niet gepubliceerd kán worden.
 *
 * De regels komen uit CLAUDE.md ("Wat nooit in de content mag") en uit
 * onderzoek/04-vormgeving-en-eisen.md, par. 4.3. Ze staan hier in code en niet in
 * een checklist, omdat een checklist vergeten wordt en een build-fout niet.
 *
 * Uitgangspunt: liever een terechte weigering te veel dan een overtreding te
 * weinig. Elke melding noemt bestand, regelnummer en de reden.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import matter from 'gray-matter';

const hier = dirname(fileURLToPath(import.meta.url));
const wortel = join(hier, '..');
const contentMap = join(wortel, 'src', 'content');

const toegestaneClaims = JSON.parse(await readFile(join(wortel, 'data', 'toegestane-claims.json'), 'utf8'));

/* ------------------------------------------------------------------ *
   Regels
 * ------------------------------------------------------------------ */

/**
 * Therapeutische en medische taal. Verboden bij cosmetica onder Verordening
 * 1223/2009 en 655/2013, en bij levensmiddelen onder 1924/2006.
 */
const therapeutischeTaal = [
  { patroon: /\bgeneest\b|\bgenezen\b|\bgenezing\b/giu, uitleg: 'suggereert genezing' },
  { patroon: /\bbehandelt\b|\bbehandeling van\b/giu, uitleg: 'suggereert een medische behandeling' },
  { patroon: /\bbestrijdt\b|\bbestrijding van\b/giu, uitleg: 'suggereert het bestrijden van een aandoening' },
  { patroon: /\bvermindert\s+(de\s+)?ontsteking/giu, uitleg: 'ontstekingsremmende claim' },
  { patroon: /\bontstekingsremmend/giu, uitleg: 'ontstekingsremmende claim' },
  { patroon: /\bantibacterieel\b|\bantimicrobieel\b/giu, uitleg: 'werkingsclaim met medisch karakter' },
  { patroon: /\bherstelt\s+(de\s+)?(huidbarrière|schade|beschadigde)/giu, uitleg: 'herstelclaim' },
  { patroon: /\bvoorkomt\s+(acne|eczeem|rosacea|puistjes|rimpels)/giu, uitleg: 'preventieclaim over een aandoening' },
  { patroon: /\bwerkt\s+tegen\s+(acne|eczeem|rosacea)/giu, uitleg: 'claim over een aandoening' },
  { patroon: /\bmedisch bewezen\b|\bklinisch bewezen\b/giu, uitleg: 'onbewijsbare autoriteitsclaim' },
  { patroon: /\bdetox(t|en|ificatie)?\b/giu, uitleg: 'detoxclaim — geen erkende fysiologische werking' },
];

/**
 * Taal die eigen gebruik of eigen tests suggereert. Mag niet: er worden geen
 * producten aangeschaft (CLAUDE.md).
 */
const testervaringTaal = [
  { patroon: /\bik heb\s+(dit|deze|het|hem|ze)?\s*getest\b/giu, uitleg: 'suggereert een eigen test' },
  { patroon: /\bzelf getest\b|\bgetest door mij\b/giu, uitleg: 'suggereert een eigen test' },
  { patroon: /\bmijn ervaring\b|\bmijn huid werd\b|\bbij mij werkte\b/giu, uitleg: 'suggereert eigen gebruik' },
  { patroon: /\bik gebruik (dit|deze|het) (product|serum|crème|middel)/giu, uitleg: 'suggereert eigen gebruik' },
  { patroon: /\bna \d+ weken gebruik merkte ik\b/giu, uitleg: 'suggereert eigen gebruik' },
  { patroon: /\bik raad (dit|deze) .{0,20}\baan omdat ik\b/giu, uitleg: 'suggereert eigen gebruik' },
];

/**
 * Claims rond darmgezondheid. Er bestaat géén toegestane EU-claim voor
 * probiotica; het woord zelf geldt al als gezondheidsclaim (onderzoek 04, DV8-02).
 */
const darmClaimTaal = [
  { patroon: /\bgoed voor je darmen\b|\bgoed voor de darmen\b/giu, uitleg: 'niet-toegestane darmclaim' },
  { patroon: /\b(verbetert|herstelt|ondersteunt|versterkt)\s+(je\s+|de\s+|het\s+)?(darmflora|microbioom|darmgezondheid)/giu, uitleg: 'niet-toegestane darmclaim' },
  { patroon: /\bprobiotica\s+(helpen|zorgen|verbeteren|herstellen)/giu, uitleg: 'niet-toegestane probioticaclaim' },
  { patroon: /\bondersteunt de spijsvertering\b/giu, uitleg: 'niet-toegestane claim over spijsvertering' },
  { patroon: /\bin balans brengen?\b.{0,30}\b(darm|microbioom)/giu, uitleg: 'vage darmclaim zonder toegestane grondslag' },
];

/**
 * Verwijzingen naar onderzoek, in wóórden.
 *
 * De NVWA verbiedt medische informatie op een pagina die een levensmiddel
 * aanprijst, en rekent daar uitdrukkelijk ook een link naar een wetenschappelijk
 * vakblad toe (DV8-03, onderzoek/04 par. 4.3). De regel hieronder over
 * `medischeDomeinen` vangt alleen URL's. Maar "een meta-analyse uit 2021 liet
 * zien dat…" is precies dezelfde verwijzing, alleen zonder link, en glipte er
 * tot nu toe doorheen.
 *
 * Deze lijst geldt uitsluitend bij `productType: 'voeding-supplement'`. In de
 * rest van de site is naar onderzoek verwijzen juist de bedoeling.
 *
 * LET OP — anders dan alle andere regels in dit bestand is deze niet met
 * `taalUitzonderingen` te overrulen. De overige regels gaan over het beschríjven
 * van verboden taal, en een artikel dat uitlegt wat er niet mag, bevat zulke
 * woorden onvermijdelijk. Deze regel gaat over een structureel verbod: er is
 * geen legitieme reden om onderzoek aan te halen op een pagina die een
 * levensmiddel aanprijst. Wie dat wil, hoort in het wetenschapsspoor te
 * schrijven (`productType: 'geen'`, geen affiliate). De ontsnappingsklep is het
 * juiste spoor kiezen, niet een uitzondering aanvragen.
 */
const onderzoeksverwijzing = [
  /* "uit een studie", "volgens het onderzoek" — het lidwoord is verplicht, zodat
     een kale "in onderzoek" hier niet in valt. */
  {
    patroon:
      /\b(?:uit|in|volgens)\s+(?:een|het|de|dit|dat|deze|dezelfde|recent|nieuw)\s+(?:recente\s+|grote\s+|kleine\s+|nieuwe\s+|systematische\s+|Nederlandse\s+|Koreaanse\s+)?(?:onderzoek(?:en)?|studie|studies|review|reviews|meta-?analyses?|overzichtsartikel(?:en)?|publicatie|trial)\b/giu,
    uitleg: 'verwijzing naar een onderzoek',
  },
  /* "uit onderzoek blijkt" — de vaste Nederlandse constructie, zonder lidwoord. */
  {
    patroon: /\b(?:uit|volgens)\s+onderzoek\s+(?:blijkt|blijken|weten\s+we|is\s+bekend|volgt)\b/giu,
    uitleg: 'onderzoek als bewijsvoering',
  },
  {
    patroon:
      /\b(?:onderzoekers?|wetenschappers?|auteurs)\s+(?:\w+\s+){0,2}(?:vond(?:en)?|vinden|toonde(?:n)?|tonen|aantoonden|concludeer(?:de|den|t|en)|beschrijv(?:en|t)|schrijven|zag(?:en)?|meld(?:en|de)|rapporteer(?:den|t|en)|keken|onderzochten|stelden\s+vast|suggereren)\b/giu,
    uitleg: 'uitspraak toegeschreven aan onderzoekers',
  },
  {
    patroon:
      /\b(?:een|de|het|die|dit|deze)\s+(?:recente\s+|grote\s+|kleine\s+|nieuwe\s+|systematische\s+|Nederlandse\s+)?(?:studie|onderzoek|review|meta-?analyse|overzichtsartikel|trial|publicatie)\s+(?:uit|van|in|naar|onder|met|toonde|toont|liet|laat|vond|vindt|keek|beschrijft|concludeert|suggereert|vergeleek|volgde)\b/giu,
    uitleg: 'verwijzing naar een specifiek onderzoek',
  },
  {
    patroon:
      /\b(?:studie|studies|onderzoek(?:en)?|review|reviews|meta-?analyse|publicatie|artikel|overzichtsartikel|trial)\s+(?:uit|van)\s+(?:19|20)\d{2}\b/giu,
    uitleg: 'gedateerde verwijzing naar een publicatie',
  },
  {
    patroon:
      /\b(?:onderzoek(?:en)?|studie|studies|de\s+wetenschap|de\s+literatuur)\s+(?:laat|laten|toont|tonen|wijst|wijzen|suggereert|suggereren|bevestigt|bevestigen|ondersteunt|ondersteunen)\b/giu,
    uitleg: 'onderzoek als bewijsvoering',
  },
  /* Methodevocabulaire: in een aanprijzende tekst bestaat hier geen onschuldig gebruik van. */
  {
    patroon:
      /\b(?:meta-?analyses?|systematische\s+review|dubbelblind\w*|placebo-?gecontroleerd\w*|gerandomiseerd\w*|peer-?reviewed|klinisch(?:e)?\s+(?:onderzoek|studie|studies|trial|trials)|in\s+vitro|in\s+vivo|cohort\w*|proefpersonen|steekproef|controlegroep|effectgrootte|RCT)\b/giu,
    uitleg: 'vocabulaire uit wetenschappelijk onderzoek',
  },
  /* Namen van vakbladen. `Nature Republic` is een K-beautymerk, geen tijdschrift. */
  {
    patroon:
      /\b(?:The\s+Lancet|Lancet|JAMA|BMJ|NEJM|New\s+England\s+Journal|Cochrane|PubMed|Journal\s+of\s+\w+|Frontiers\s+in\s+\w+|Nutrients|Microorganisms|BioEssays|Nature\b(?!\s+Republic))/gu,
    uitleg: 'naam van een wetenschappelijk tijdschrift',
  },
  /* Citatievormen: "e.a.", "et al.", "(2016)", doi, PMID. */
  {
    patroon: /(?:\be\.\s?a\.|\bet\s+al\.|\bdoi:|\bPMID\b|\bPMC\d|\((?:19|20)\d{2}\))/gu,
    uitleg: 'citatievorm — verwijst naar een publicatie',
  },
  {
    patroon:
      /\bwetenschappelijk(?:e)?\s+(?:onderzoek\w*|bron\w*|publicatie\w*|literatuur|bewijs\w*|studie\w*|consensus)\b/giu,
    uitleg: 'verwijzing naar wetenschappelijke bronnen',
  },
  {
    patroon:
      /\b(?:is|zijn|werd|werden)\s+(?:wetenschappelijk\s+|klinisch\s+)?(?:aangetoond|bewezen|onderzocht)\s+(?:dat|in|door)\b/giu,
    uitleg: 'beroep op onderzoek als bewijs',
  },
];

/**
 * De kale zelfstandige naamwoorden. Die zijn te gewoon om er een fout van te
 * maken — "onderzoeken" is ook een werkwoord, en "bewijs" heeft een dagelijkse
 * betekenis — maar in een artikel dat een levensmiddel aanprijst is elk van deze
 * woorden een reden om de zin nog eens te lezen. Vandaar een waarschuwing.
 */
const onderzoeksWoordenZacht =
  /\b(?:onderzoek|onderzoeken|onderzocht|studie|studies|wetenschap|wetenschappelijk\w*|bewijs|bewezen|aangetoond|literatuur|dermatolo\w+)\b/giu;

/** Externe bronnen die als "medische informatie" gelden (NVWA, onderzoek 04 par. 4.3). */
const medischeDomeinen = [
  'pubmed.ncbi.nlm.nih.gov', 'ncbi.nlm.nih.gov', 'doi.org', 'thelancet.com', 'nature.com',
  'sciencedirect.com', 'mdpi.com', 'cochrane.org', 'nih.gov', 'who.int', 'link.springer.com',
  'onlinelibrary.wiley.com', 'jamanetwork.com', 'bmj.com', 'nejm.org', 'frontiersin.org',
  'karger.com', 'tandfonline.com',
];

/** Patroon dat een gezondheidsclaim over een voedingsstof herkent. */
const claimPatroon = /\b[A-ZÀ-Ý]?[\wÀ-ÿ]+(?:\s+[\wÀ-ÿ]+){0,3}\s+dra(?:agt|gen)\s+bij\s+(?:tot|aan)\s+[^.!?]+/gu;

/* ------------------------------------------------------------------ *
   Hulpfuncties
 * ------------------------------------------------------------------ */

const fouten = [];
const waarschuwingen = [];

/*
  Voor de site-brede controle onderaan. DV8-03 zegt niet "deze pagina" maar
  "deze website": prijst de site ergens een levensmiddel aan, dan mag er
  "ergens anders op die site" geen medische informatie over diezelfde waar
  staan. Zolang de site nergens een levensmiddel aanprees, was dat vanzelf
  goed. Sinds er een commercieel spoor bestaat, niet meer.

  Tags zijn het enige onderwerp dat elk artikel zelf declareert, dus daarop
  wordt getoetst.
*/
const aangeprezenOnderwerpen = new Map();
const onderzoeksOnderwerpen = new Map();

const onthoud = (kaart, tags, bestand) => {
  for (const tag of tags) {
    const sleutel = normaliseer(String(tag));
    if (!sleutel) continue;
    if (!kaart.has(sleutel)) kaart.set(sleutel, new Set());
    kaart.get(sleutel).add(bestand);
  }
};

function meld(lijst, bestand, regel, bericht) {
  lijst.push({ bestand, regel, bericht });
}

/** Zoekt het regelnummer van de eerste positie in de tekst. */
function regelVan(tekst, index) {
  return tekst.slice(0, index).split('\n').length;
}

function normaliseer(tekst) {
  return tekst
    .toLowerCase()
    .replace(/[.,;:!?'"()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function vindMarkdownBestanden(map) {
  const gevonden = [];
  let items;
  try {
    items = await readdir(map, { withFileTypes: true });
  } catch {
    return gevonden;
  }
  for (const item of items) {
    const pad = join(map, item.name);
    if (item.isDirectory()) {
      gevonden.push(...(await vindMarkdownBestanden(pad)));
    } else if (extname(item.name) === '.md') {
      gevonden.push(pad);
    }
  }
  return gevonden;
}

function telWoorden(tekst) {
  return tekst
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_>\[\]()|-]/g, ' ')
    .split(/\s+/)
    .filter((w) => /[\p{L}]/u.test(w)).length;
}

/* ------------------------------------------------------------------ *
   Controle per bestand
 * ------------------------------------------------------------------ */

function controleer(bestandspad, ruweTekst) {
  const naam = relative(wortel, bestandspad).replace(/\\/g, '/');
  const { data: fm, content } = matter(ruweTekst);
  const inGutSkin = naam.includes('/gut-skin/');

  const zoekIn = `${fm.titel ?? ''}\n${fm.beschrijving ?? ''}\n${content}`;

  /*
    Regelnummers moeten naar het bestand op schijf wijzen, niet naar een positie
    in een tekenreeks die hier in het geheugen is samengesteld. `zoekIn` mist de
    frontmatter en heeft er twee kunstmatige regels vóór geplakt; zonder deze
    correctie wees elke melding tientallen regels te hoog.
  */
  const voorloop = ruweTekst.split('\n').length - content.split('\n').length;
  const regelInBestand = (index) => Math.max(1, voorloop + regelVan(zoekIn, index) - 2);
  const regelInBody = (index) => Math.max(1, voorloop + regelVan(content, index));

  /* --- 1. Verplichte velden --- */
  for (const veld of ['titel', 'beschrijving', 'publicatiedatum']) {
    if (fm[veld] === undefined || fm[veld] === null || fm[veld] === '') {
      meld(fouten, naam, 1, `verplicht frontmatter-veld ontbreekt: ${veld}`);
    }
  }

  const productType = fm.productType ?? 'geen';
  const affiliate = fm.affiliate === true;
  const gezondheidsclaims = fm.gezondheidsclaims === true;
  const bronnen = Array.isArray(fm.bronnen) ? fm.bronnen : [];

  /*
    Uitzonderingen die het artikel zelf declareert. Nodig omdat deze site uitlegt
    wát er niet geclaimd mag worden — dan komt zo'n term onvermijdelijk in de tekst
    voor. De reden staat in de frontmatter, dus een uitzondering blijft zichtbaar
    en toetsbaar in plaats van stilzwijgend.
  */
  const uitzonderingen = Array.isArray(fm.taalUitzonderingen) ? fm.taalUitzonderingen : [];
  const isUitgezonderd = (gevonden) =>
    uitzonderingen.some((u) => normaliseer(String(u.term ?? '')) === normaliseer(gevonden));

  for (const uitzondering of uitzonderingen) {
    if (!uitzondering?.reden || String(uitzondering.reden).trim().length < 15) {
      meld(fouten, naam, 1, `taaluitzondering "${uitzondering?.term}" heeft geen bruikbare reden`);
    }
  }

  /* --- 2. Altijd verboden taal --- */
  for (const groep of [therapeutischeTaal, testervaringTaal, darmClaimTaal]) {
    for (const { patroon, uitleg } of groep) {
      for (const treffer of zoekIn.matchAll(patroon)) {
        if (isUitgezonderd(treffer[0])) continue;
        meld(fouten, naam, regelInBestand(treffer.index ?? 0), `"${treffer[0].trim()}" — ${uitleg}`);
      }
    }
  }

  /* --- 3. Het woord "probiotisch" bij een aangeprezen levensmiddel --- */
  if (productType === 'voeding-supplement') {
    for (const treffer of zoekIn.matchAll(/\bprobiotic(a|um)?\b|\bprobiotisch(e)?\b/giu)) {
      meld(
        fouten,
        naam,
        regelInBestand(treffer.index ?? 0),
        `"${treffer[0]}" mag niet in een artikel dat een levensmiddel aanprijst: het woord is zelf een gezondheidsclaim en er is geen toegestane variant`,
      );
    }
  }

  /* --- 4. Claims over voedingsstoffen moeten uit de goedgekeurde lijst komen --- */
  const alleToegestaan = [...toegestaneClaims.claims, ...toegestaneClaims.darmclaims].map(normaliseer);
  for (const treffer of zoekIn.matchAll(claimPatroon)) {
    const zin = normaliseer(treffer[0]);
    const bekend = alleToegestaan.some((claim) => zin.includes(claim) || claim.includes(zin));
    if (!bekend) {
      meld(
        fouten,
        naam,
        regelInBestand(treffer.index ?? 0),
        `claim "${treffer[0].trim().slice(0, 90)}" staat niet in data/toegestane-claims.json`,
      );
    }
  }

  /* --- 5. Geen medische links op een pagina die een levensmiddel aanprijst --- */
  if (productType === 'voeding-supplement') {
    /* Eerst de verwijzingen in woorden; zie de toelichting bij `onderzoeksverwijzing`. */
    for (const { patroon, uitleg } of onderzoeksverwijzing) {
      for (const treffer of zoekIn.matchAll(patroon)) {
        meld(
          fouten,
          naam,
          regelInBestand(treffer.index ?? 0),
          `"${treffer[0].trim()}" — ${uitleg}. Een pagina die een levensmiddel aanprijst mag niet naar onderzoek verwijzen, ook niet in woorden (NVWA, DV8-03). Herschrijf de zin, of zet productType op "geen" en haal de affiliate-links weg; dan mag de verwijzing wél.`,
        );
      }
    }
    for (const treffer of zoekIn.matchAll(onderzoeksWoordenZacht)) {
      meld(
        waarschuwingen,
        naam,
        regelInBestand(treffer.index ?? 0),
        `"${treffer[0]}" — dit artikel prijst een levensmiddel aan; elke verwijzing naar onderzoek is hier juridisch riskant. Lees de zin na.`,
      );
    }

    /*
      Ook de titels van de bronnen. `Bronnenlijst.astro` toont die als gewone
      tekst zodra links niet zijn toegestaan — een bronvermelding met de naam van
      een vakblad erin is dan nog steeds precies de verwijzing die niet mag,
      alleen zonder anker eromheen.
    */
    for (const bron of bronnen) {
      for (const { patroon, uitleg } of onderzoeksverwijzing) {
        for (const treffer of String(bron.titel ?? '').matchAll(patroon)) {
          meld(
            fouten,
            naam,
            1,
            `bron "${bron.titel}" bevat "${treffer[0].trim()}" — ${uitleg}; ook de zichtbare titel van een bron mag hier niet naar onderzoek verwijzen`,
          );
        }
      }
    }

    const links = [...zoekIn.matchAll(/https?:\/\/([^\s)\]"']+)/gu)];
    for (const link of links) {
      const host = link[1].toLowerCase();
      if (medischeDomeinen.some((d) => host.startsWith(d) || host.includes(`.${d}`) || host.includes(d))) {
        meld(
          fouten,
          naam,
          regelInBestand(link.index ?? 0),
          `link naar ${host.split('/')[0]} — een verwijzing naar medische of wetenschappelijke publicaties geldt bij voeding en supplementen zelf als ontoelaatbare medische claim`,
        );
      }
    }
    for (const bron of bronnen) {
      const host = String(bron.url ?? '').toLowerCase();
      if (medischeDomeinen.some((d) => host.includes(d))) {
        meld(fouten, naam, 1, `bron "${bron.titel}" verwijst naar een medische publicatie; niet toegestaan bij productType voeding-supplement`);
      }
    }
  }

  /* --- 6. Onderbouwing --- */
  if (gezondheidsclaims && bronnen.length < 2) {
    meld(fouten, naam, 1, `gezondheidsclaims: true vereist minimaal 2 bronnen, gevonden: ${bronnen.length}`);
  }

  /* --- 7. Samenhang tussen velden --- */
  if (affiliate && productType === 'geen') {
    meld(fouten, naam, 1, 'affiliate: true vereist een productType (cosmetica of voeding-supplement)');
  }
  /*
    De tweede pijler kent twee sporen en niets ertussenin. Zie de toelichting bij
    de gut-skin-collectie in src/content.config.ts. Dit staat hier dubbel — het
    schema handhaaft het ook — omdat deze controle als eerste draait en dus als
    eerste een leesbare fout hoort te geven.
  */
  if (inGutSkin) {
    if (affiliate && productType !== 'voeding-supplement') {
      meld(
        fouten,
        naam,
        1,
        'affiliate-links in deze pijler betekenen dat je een levensmiddel aanprijst; dat vereist productType: voeding-supplement, en daarmee vervalt het recht om naar onderzoek te verwijzen',
      );
    }
    if (productType === 'cosmetica') {
      meld(fouten, naam, 1, 'productType: cosmetica hoort niet in de pijler over voeding en huid');
    }
  }

  /* --- 8. Omvang --- */
  const woorden = telWoorden(content);
  if (woorden < 800) {
    meld(fouten, naam, 1, `artikel telt ${woorden} woorden, minimaal 800 vereist`);
  }

  /*
    --- 8b. Beeld in de tekst ---

    Elk artikel krijgt naast het beeld bovenaan één tot drie beelden verspreid
    door de tekst; dat magazineritme is een eigenschap van de site en niet iets
    wat de schrijver moet onthouden. Alt-tekst is geen formaliteit maar de enige
    manier waarop iemand die het beeld niet ziet weet wat er staat, dus een lege
    of nietszeggende alt is een fout en geen waarschuwing.
  */
  const beelden = [...content.matchAll(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/gu)];
  if (beelden.length < 1 || beelden.length > 3) {
    meld(
      fouten,
      naam,
      1,
      `artikel heeft ${beelden.length} beeld(en) in de tekst, verwacht 1 tot 3 (het beeld bovenaan staat in de frontmatter en telt niet mee)`,
    );
  }
  for (const beeld of beelden) {
    const altTekst = beeld[1].trim();
    const regel = regelInBody(beeld.index ?? 0);
    if (altTekst.length < 10) {
      meld(
        fouten,
        naam,
        regel,
        altTekst
          ? `alt-tekst "${altTekst}" is te kort om iets te beschrijven`
          : 'beeld in de tekst zonder alt-tekst',
      );
    }
    /*
      Alleen een relatief pad naar src/assets/ komt door astro:assets heen. Een
      bestand in public/ gaat ongemoeid en op volle grootte naar elke telefoon.
      Dat stond tot nu toe alleen als comment in genereer-beeld.mjs; hier wordt
      het gecontroleerd.
    */
    if (!beeld[2].startsWith('../../assets/artikelen/')) {
      meld(
        fouten,
        naam,
        regel,
        `beeld "${beeld[2]}" moet relatief naar src/assets/artikelen/ verwijzen; alleen dan optimaliseert Astro het naar WebP in meerdere breedtes`,
      );
    }
  }

  /* --- 8c. Onderwerpen onthouden voor de site-brede toets onderaan --- */
  const tags = Array.isArray(fm.tags) ? fm.tags : [];
  if (productType === 'voeding-supplement') {
    onthoud(aangeprezenOnderwerpen, tags, naam);
  }
  const heeftMedischeVindplaats =
    [...zoekIn.matchAll(/https?:\/\/([^\s)\]"']+)/gu)].some((link) =>
      medischeDomeinen.some((d) => link[1].toLowerCase().includes(d)),
    ) || bronnen.some((b) => medischeDomeinen.some((d) => String(b.url ?? '').toLowerCase().includes(d)));
  if (heeftMedischeVindplaats) {
    onthoud(onderzoeksOnderwerpen, tags, naam);
  }

  /* --- 9. Zachte signalen --- */
  if (bronnen.length === 0) {
    meld(waarschuwingen, naam, 1, 'geen bronnen opgegeven');
  }
  if (!toegestaneClaims.geverifieerd && /dra(agt|gen) bij/u.test(zoekIn)) {
    meld(
      waarschuwingen,
      naam,
      1,
      'dit artikel gebruikt een goedgekeurde claim, maar data/toegestane-claims.json staat nog op geverifieerd: false',
    );
  }
}

/* ------------------------------------------------------------------ *
   Controle van losse tekstmodules

   Niet alle zichtbare tekst staat in artikelen. De routinetest heeft eigen
   vragen, antwoorden en routineteksten, en die worden door een bezoeker net zo
   gelezen als een alinea uit een artikel. Zonder deze controle zou dat het
   enige stuk tekst op de site zijn dat ongecontroleerd doorglipt.

   Wat hier wél en niet geldt: de taalregels gelden onverkort, de regels over
   woordaantal, bronnen en frontmatter niet — een vragenlijst is geen artikel.
 * ------------------------------------------------------------------ */

/**
 * Haalt de zichtbare tekst uit een TypeScript-module: commentaar valt af,
 * tekenreeksen blijven over.
 *
 * Commentaar wordt vervangen door evenveel spaties in plaats van verwijderd,
 * zodat regelnummers blijven kloppen met het bestand op schijf.
 *
 * Alleen tekenreeksen controleren en niet de hele broncode is een bewuste
 * keuze: een comment dat uitlegt wélke term verboden is, hoort geen fout op te
 * leveren. Artikelen hebben daar `taalUitzonderingen` voor; een datamodule
 * heeft geen frontmatter om zoiets in te declareren.
 */
function tekstenUitModule(bron) {
  const zonderCommentaar = bron
    .replace(/\/\*[\s\S]*?\*\//g, (blok) => blok.replace(/[^\n]/g, ' '))
    .replace(/\/\/[^\n]*/g, (regel) => ' '.repeat(regel.length));

  const gevonden = [];
  const tekenreeks = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
  for (const treffer of zonderCommentaar.matchAll(tekenreeks)) {
    const waarde = treffer[1] ?? treffer[2] ?? treffer[3] ?? '';
    if (!waarde.trim()) continue;
    gevonden.push({
      tekst: waarde.replace(/\\(['"`])/g, '$1'),
      index: treffer.index ?? 0,
    });
  }
  return gevonden;
}

function controleerModule(bestandspad, bron) {
  const naam = relative(wortel, bestandspad).replace(/\\/g, '/');

  for (const stuk of tekstenUitModule(bron)) {
    for (const groep of [therapeutischeTaal, testervaringTaal, darmClaimTaal]) {
      for (const { patroon, uitleg } of groep) {
        for (const treffer of stuk.tekst.matchAll(patroon)) {
          meld(fouten, naam, regelVan(bron, stuk.index), `"${treffer[0].trim()}" — ${uitleg}`);
        }
      }
    }

    for (const treffer of stuk.tekst.matchAll(claimPatroon)) {
      const zin = normaliseer(treffer[0]);
      const alleToegestaan = [...toegestaneClaims.claims, ...toegestaneClaims.darmclaims].map(normaliseer);
      if (!alleToegestaan.some((claim) => zin.includes(claim) || claim.includes(zin))) {
        meld(
          fouten,
          naam,
          regelVan(bron, stuk.index),
          `claim "${treffer[0].trim().slice(0, 90)}" staat niet in data/toegestane-claims.json`,
        );
      }
    }
  }
}

/* ------------------------------------------------------------------ *
   Uitvoeren
 * ------------------------------------------------------------------ */

const modules = [
  join(wortel, 'src', 'data', 'routinetest.ts'),
  join(wortel, 'src', 'data', 'eetritme.ts'),
];

const bestanden = await vindMarkdownBestanden(contentMap);

if (bestanden.length === 0) {
  console.log('Geen artikelen gevonden in src/content — niets te controleren.');
  process.exit(0);
}

for (const bestand of bestanden) {
  controleer(bestand, await readFile(bestand, 'utf8'));
}

/* ------------------------------------------------------------------ *
   Site-brede toets — DV8-03

   "Een website waarop een levensmiddel wordt verhandeld of aangeprezen, mag
   niet ergens anders op die site medische informatie bevatten over deze waar."
   Dat is een eis aan de site, niet aan de pagina. Een commercieel voedingsartikel
   over een onderwerp waar elders op de site een artikel met onderzoekslinks over
   staat, brengt de site dus als geheel in overtreding — ook al klopt elke pagina
   op zichzelf.
 * ------------------------------------------------------------------ */

for (const [onderwerp, aanprijzers] of aangeprezenOnderwerpen) {
  const verwijzers = onderzoeksOnderwerpen.get(onderwerp);
  if (!verwijzers) continue;
  const elders = [...verwijzers].filter((bestand) => !aanprijzers.has(bestand));
  if (elders.length === 0) continue;
  meld(
    fouten,
    [...aanprijzers].join(', '),
    1,
    `prijst een levensmiddel aan onder het onderwerp "${onderwerp}", terwijl ${elders.join(' en ')} over hetzelfde onderwerp naar medisch of wetenschappelijk onderzoek verwijst. De NVWA toetst dit op siteniveau, niet per pagina (DV8-03): kies een ander onderwerp voor het commerciële artikel, of haal de onderzoeksverwijzingen elders weg.`,
  );
}

let gecontroleerdeModules = 0;
for (const module of modules) {
  let bron;
  try {
    bron = await readFile(module, 'utf8');
  } catch {
    /* Ontbreekt de module, dan faalt de build er even verderop toch al op. */
    continue;
  }
  controleerModule(module, bron);
  gecontroleerdeModules++;
}

const groepeer = (lijst) => {
  const perBestand = new Map();
  for (const item of lijst) {
    if (!perBestand.has(item.bestand)) perBestand.set(item.bestand, []);
    perBestand.get(item.bestand).push(item);
  }
  return perBestand;
};

if (waarschuwingen.length > 0) {
  console.log(`\nLet op (${waarschuwingen.length}):`);
  for (const [bestand, items] of groepeer(waarschuwingen)) {
    console.log(`  ${bestand}`);
    for (const item of items) console.log(`    regel ${item.regel}: ${item.bericht}`);
  }
}

if (fouten.length > 0) {
  console.error(`\nCompliance-controle afgekeurd — ${fouten.length} probleem(en) in ${groepeer(fouten).size} bestand(en):\n`);
  for (const [bestand, items] of groepeer(fouten)) {
    console.error(`  ${bestand}`);
    for (const item of items) console.error(`    regel ${item.regel}: ${item.bericht}`);
  }
  console.error('\nRegels staan in CLAUDE.md en onderzoek/04-vormgeving-en-eisen.md, par. 4.3.');
  process.exit(1);
}

console.log(
  `Compliance-controle akkoord — ${bestanden.length} artikel(en) en ${gecontroleerdeModules} tekstmodule(s) gecontroleerd, geen overtredingen.`,
);
