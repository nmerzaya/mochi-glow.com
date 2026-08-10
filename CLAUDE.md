# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Context voor Claude Code bij het werken in deze projectmap. Lees dit bestand eerst, samen met `PLAN.md`, `ARCHITECTUUR.md` en `TAKEN.md`.

## Project

**Mochi Glow** (`mochi-glow.com`) — een zelfvoorzienende, Nederlandstalige contentsite over K-beauty-ingrediënten en de gut-skin(darm-huid)-connectie, bedoeld voor monetisatie via affiliate links en display-advertenties (Google AdSense). Budget is nul euro, met één uitzondering: een eigen domeinnaam (~€10-15/jaar). De volledige technische stack is open source en gratis.

Uitgangspunten:
- **Doelgroep/toon:** vrouwelijk, warm, maar duidelijk en clean design. Licht kleurenpalet.
- **Niche:** twee contentpijlers — (1) K-beauty-ingrediënten (commercieel, affiliate-driven) en (2) gut-skin-wetenschap (autoriteit, minder commercieel, trekt links/vertrouwen aan). Algemene/brede "skincare" is bewust géén pijler in v1 — te verzadigd om mee te concurreren.
- **Persona:** "Noor", een pseudoniem. Géén persoonlijke informatie, geen foto's, geen privéleven. Volledige anonimiteit is expliciet afgewezen — dat schaadt vertrouwen (E-E-A-T) in een gezondheids-/beautyniche te veel.
- **Content is research-based:** er worden geen producten aangekocht om te testen. Content bestaat uit ingrediënt-uitleg, wetenschap-samenvattingen en vergelijkingen met bronvermelding — géén "ik heb dit getest"-taal, want dat kan niet waargemaakt worden.

Volledige onderbouwing van alle keuzes staat in de map `onderzoek/` (zie onderaan).

## Huidige staat

De site is compleet en bouwt lokaal (27 pagina's), maar staat nog niet online. Er is een lokale git-repo met één commit; er is nog **geen** GitHub-remote en nog **geen** Cloudflare Pages-project. `DEPLOY.md` beschrijft die stappen; ze vragen allemaal om accounts en inloggegevens van de eigenaar.

De contentbatch is er: **16 artikelen**, tien in `src/content/ingredienten/` en zes in `src/content/gut-skin/`. Daarmee is de ondergrens uit `PLAN.md` (15-20) gehaald.

Het domein is `mochi-glow.com`, geregistreerd via Cloudflare. De site heette in een eerdere fase "Mochi Skin" op `mochiskin.nl`; die naam komt nog voor in `onderzoek/04-vormgeving-en-eisen.md`, en dat blijft zo — onderzoeksbestanden worden niet met terugwerkende kracht aangepast.

Nog open vóór livegang: `repo:` in `public/admin/config.yml`, het verifiëren van `data/toegestane-claims.json`, de publisher-ID in `public/ads.txt`, en `advertentiesActief` in `src/config.ts`. Alle vier staan met uitleg in `DEPLOY.md`.

## Commando's

```
npm install
npm run dev        # lokale ontwikkelserver
npm run build      # productie-build (draait eerst npm run check)
npm run preview    # de gebouwde site bekijken
npm run check      # alleen de compliance-controle
```

Node 20 of nieuwer. `predev`/`prebuild` draaien `scripts/kopieer-klaro.mjs`, dat Klaro uit `node_modules` naar `public/klaro/` kopieert — die map staat daarom in `.gitignore` en hoort niet handmatig gevuld te worden.

Er zijn **geen tests en geen linter**. Dat is een openstaande keuze, niet iets dat per ongeluk ontbreekt — voeg ze niet ongevraagd toe. `npm run check` is de facto de enige poort: het is geen linter maar een juridische controle (zie hieronder). `tsconfig.json` staat wel op `astro/tsconfigs/strict`, maar er is geen `astro check`-script en `@astrojs/check` is niet geïnstalleerd; typefouten blokkeren de build dus niet.

## Compliance zit in code, niet in een checklist

Dit is het belangrijkste om te begrijpen aan dit project. De site staat in een niche waar de meeste voor de hand liggende beweringen wettelijk verboden zijn. Die regels zijn daarom afgedwongen op drie plekken die samen gelezen moeten worden:

1. **`scripts/check-compliance.mjs`** — draait als eerste stap van elke build en weigert een artikel bij therapeutische taal, gesuggereerde eigen tests, niet-toegestane darmclaims, claims die niet letterlijk in `data/toegestane-claims.json` staan, minder dan 800 woorden, of minder dan 2 bronnen bij `gezondheidsclaims: true`. Een overtreding is dus niet te publiceren. De patronen zijn bewust streng: liever een terechte weigering te veel dan een overtreding te weinig.
2. **`src/content.config.ts`** — het schema stuurt gedrag, het is geen administratie. `affiliate: true` laat `ArtikelLayout.astro` de disclosure automatisch als eerste blok plaatsen; `gezondheidsclaims: true` zet de medische disclaimer aan; `productType` bepaalt welk wettelijk regime geldt.
3. **`src/config.ts`** — alle sitebrede teksten en namen op één plek, plus de vlag `advertentiesActief`.

De ontsnappingsklep is `taalUitzonderingen` in de frontmatter: een artikel dat een verboden term beschrijvend gebruikt (bijvoorbeeld om uit te leggen dat een crème niets mag "genezen") declareert die term mét reden van minimaal 15 tekens. Zo blijft een uitzondering zichtbaar en toetsbaar in plaats van stilzwijgend. Voeg nooit een term toe aan de uitzonderingen om een terechte melding weg te krijgen.

### De gut-skin-pijler is op schemaniveau niet-commercieel

`affiliate` en `productType` zijn in die collectie `z.literal(false)` respectievelijk `z.literal('geen')` — geen boolean. Dat is geen stijlkeuze: de NVWA rekent een verwijzing naar wetenschappelijke of medische publicaties zélf tot een ontoelaatbare medische claim op een pagina die een levensmiddel aanprijst. Door in die pijler niets te verkopen, mogen die artikelen wél naar onderzoek linken. Bij `productType: 'voeding-supplement'` slaat de controle daarom aan op links naar medische domeinen, en toont `Bronnenlijst.astro` de bronnen zonder klikbare link. Maak `affiliate` in gut-skin nooit alsnog instelbaar.

## Stack

Motivatie per keuze staat in `ARCHITECTUUR.md`; hieronder alleen wát er gekozen is.

- **Astro** (v7) — content collections + `astro:assets` beeldoptimalisatie, standaard geen JavaScript. Plus `@astrojs/sitemap` en `@astrojs/rss`.
- **Cloudflare Pages** — hosting, auto-deploy bij push (gratis laag: 1 gelijktijdige build). Nog niet ingericht.
- **Sveltia CMS** op `/admin` — git-based; bewust *niet* Decap CMS (CVE-2025-57520). `public/admin/config.yml` moet exact overeenkomen met `src/content.config.ts`; wijk je in het één af, dan faalt de build op het ander — dat is de bedoeling.
- **Klaro** — zelfgehoste cookie consent, laadt vóór alle andere scripts. Staat pas aan als `advertentiesActief` in `src/config.ts` op `true` gaat; zolang er geen advertentiescript is, verschijnt er ook geen toestemmingsvenster (een banner tonen voor cookies die niet geplaatst worden is misleidend) en staat er nul byte JavaScript op de site.
- **GitHub** (publieke repo) — vereist voor zowel Cloudflare Pages als Sveltia CMS. Nog aan te maken.

Wijk hier niet van af zonder `ARCHITECTUUR.md` → "Waarom geen andere opties" te lezen.

## Afspraken

**Taal:** alle content, code-comments waar zinvol, en documentatie in het Nederlands. Variabelen/bestandsnamen in het Engels (standaardconventie) — met als uitzondering dat de bestaande code Nederlandse namen gebruikt voor domeinbegrippen (`bronnen`, `taalUitzonderingen`, `ruweTekst`); volg de omringende code.

**Wat nooit in de content mag:**
- Therapeutische of medische claims over cosmetica (bv. "geneest", "vermindert ontsteking") — verboden onder EU-Verordening 1223/2009 en 655/2013.
- Ongeautoriseerde gezondheidsclaims over darmgezondheid/supplementen — alleen claims die voorkomen in het EFSA-register (Verordening 1924/2006) zijn toegestaan. Voor probiotica bestaat géén enkele toegestane claim; het woord "probiotisch" geldt zelf al als claim.
- Eigen testervaring suggereren ("ik heb getest", "mijn ervaring") — er wordt niet getest, dus dit mag niet gesuggereerd worden. Gebruik in plaats daarvan uitleg-, vergelijkings- en samenvattingsformats met bronvermelding.
- Persoonlijke informatie over de maker.

**Wat altijd in elk artikel met een affiliate link moet:** een reclame-disclosure als eerste zin van het artikel (niet in een voetnoot). Vereist sinds de aangescherpte Reclamecode Social Media & Influencer Marketing (RSM) per 1 juli 2026. Dit wordt niet getypt maar afgedwongen — zie de invarianten hieronder.

**Volgorde van werken:** eerst de technische basis en verplichte pagina's, dán de eerste contentbatch (15-20 artikelen), en pas dáárna affiliate-programma's en AdSense aanvragen. Niet eerder aanvragen — een te vroege, afgewezen aanvraag (vooral bij Amazon Associates) kan niet opnieuw beoordeeld worden; je moet dan volledig opnieuw solliciteren. Zie `TAKEN.md` voor de exacte fasering.

**Afbeeldingen:** geen eigen fotografie (geen producten aangeschaft). Het ontwerp vangt dat op met accentkleuren per artikel (`accent: roze | paars | perzik | mint`) in plaats van beeld. Gebruik verder alleen toegestane, licentievrije bronnen of duidelijk gelabelde AI-beelden; wees terughoudend met AI-beelden omdat generieke plaatjes slecht presteren in een visuele niche als beauty.

## Invarianten bij het bouwen

- De affiliate-disclosure wordt niet handmatig getypt: `affiliate: true` in de frontmatter laat `ArtikelLayout.astro` de tekst uit `disclosureTekst` (`src/config.ts`) automatisch als eerste blok plaatsen. Het moet onmogelijk blijven dit te vergeten.
- Twee content collections: **`ingredienten`** en **`gut-skin`**. (Let op: `ARCHITECTUUR.md` en `TAKEN.md` noemen de eerste nog `kbeauty-ingredienten` — de code is leidend.) De verplichte pagina's (privacy, cookiebeleid, affiliate-disclaimer, algemene voorwaarden, contact, over, redactionele richtlijnen) zijn losse statische pagina's in `src/pages/`, géén collectie.
- Klaro blokkeert standaard; advertentie- en analyticsscripts laden pas na toestemming, als `type="text/plain"` met `data-name="adsense"`.
- Geen externe verzoeken vanaf de site: geen CDN's, geen externe lettertypen, geen tracking. Dat is een AVG-keuze, niet alleen een prestatiekeuze.
- `uitgelicht`, `afbeelding` en `alt` staan wél in het schema en in de CMS-interface, maar worden nergens uitgelezen: de homepage sorteert puur op datum en toont de nieuwste zes respectievelijk drie. Ga er dus niet vanuit dat `uitgelicht: true` iets doet — bouw het eerst.
- Beeld komt van `ArtikelBeeld.astro`: eigen, inline SVG-illustraties in de accentkleur, géén fotografie en géén AI-beeld. Het motief volgt uit het optionele veld `motief`, en anders deterministisch uit de slug — elk artikel heeft dus altijd beeld. Kaart en artikel gebruiken hetzelfde zaad zodat ze dezelfde tekening tonen. De gevulde vormen zijn wit omdat ze op een vlak in de zachte accentkleur liggen; maak ze niet accentkleurig, dan vallen ze weg tegen hun achtergrond.
- Tekstkleuren in `src/styles/tokens.css` zijn getoetst op WCAG 2.2 AA. De `-zacht`-varianten zijn uitsluitend voor vlakken en randen, nooit voor tekst.

## Openstaande placeholders vóór livegang

Deze staan bewust op een tijdelijke waarde en moeten ingevuld worden; ze zijn ook in `README.md` opgesomd:

- `public/admin/config.yml` → `repo: GEBRUIKERSNAAM/mochi-glow` invullen zodra de GitHub-repo bestaat.
- `data/toegestane-claims.json` → elke claim nalezen in het officiële EU-register en `geverifieerd` op `true` zetten. Zolang die vlag `false` is, waarschuwt de controle bij elk gebruik van een goedgekeurde claim.
- `public/ads.txt` → publisher-ID invullen ná goedkeuring van AdSense.
- `src/config.ts` → `advertentiesActief` op `true` bij livegang van advertenties.

## Omgeving

**Shell:** Windows PowerShell 5.1. `&&` geeft daar een parserfout; gebruik `npm run build; if ($?) { npm run preview }`. (Binnen `package.json` werkt `&&` wél — npm draait scripts via `cmd.exe`.)

**Locatie:** het project staat in een OneDrive-map. `node_modules/` bestaat en staat in `.gitignore`; OneDrive-sync kan builds vertragen en bestanden vergrendelen.

## Onderzoeksregels

Voor dit project is een vaste onderzoeksmethode gebruikt, vastgelegd in `onderzoek/`. Volg dezelfde methode als er later nieuw onderzoek nodig is (bv. bij het kiezen van specifieke affiliate-producten, of het verifiëren van een nieuwe claim):

1. **Vraagstelling eerst.** Formuleer een hoofdvraag, 3-5 deelvragen, wat expliciet buiten scope valt, en wanneer het onderzoek "af" is — vóór je gaat zoeken.
2. **Log elke bron, trek geen conclusies tijdens het loggen.** Elke bron krijgt een code, link, type (A = primair/officieel, B = secundair/vakmedia, C = tertiair/blog of community), raadpleegdatum, status en de gebruikte zoekterm.
3. **Verifieer elke bron door hem te openen.** Bestaat de pagina nog, en komt de inhoud daadwerkelijk overeen met het onderwerp waarvoor hij gelogd is? Bronnen die niet bestaan, leeg/geblokkeerd zijn, of niet overeenkomen krijgen status `onbruikbaar` met reden.
4. **Zoek expliciet naar tegenspraak vóór je concludeert.** Voor elke (voorlopige) conclusie: zoek actief naar bronnen die hem onderuithalen. Vind je niets, documenteer dan de zoekterm en waarom dat aannemelijk niets oplevert.
5. **Pas ná stap 1-4 een conclusie of bouwbeslissing nemen.**

Dezelfde A/B/C-typering wordt in het contentschema gebruikt voor de bronnen onder een artikel.

## Map `onderzoek/`

Bevat het volledige onderzoek dat aan dit project ten grondslag ligt:
- `00-vraagstelling.md` — hoofdvraag, 5 deelvragen, scope-afbakening, definitie van "af".
- `01-bronnen.md` — 45 gelogde en geverifieerde bronnen (36 bruikbaar, 9 gemarkeerd onbruikbaar met reden).
- `03-tegenspraak.md` — expliciete tegenspraak-check per deelvraag, incl. één deelvraag waar bewust niets tegensprekends is gevonden (met onderbouwing).
- `04-vormgeving-en-eisen.md` — vormgeving, E-E-A-T, claims op voeding/supplementen en toegankelijkheid. **Par. 4.3 is de bron voor de taalregels in `check-compliance.mjs`**; par. 4.1 voor de ontwerptokens.

De nummering springt van `01` naar `03`; er is geen `02-`-bestand en geen enkel document verwijst ernaar — er ontbreekt dus niets.

Deze bestanden zijn de bron van waarheid voor **waarom** de keuzes in `ARCHITECTUUR.md` en `PLAN.md` zijn gemaakt. Wijzig ze niet met terugwerkende kracht om latere beslissingen te "rechtvaardigen" — voeg bij nieuw onderzoek een nieuw genummerd bestand toe (bv. `05-...md`).
