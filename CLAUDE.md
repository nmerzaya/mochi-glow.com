# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Context voor Claude Code bij het werken in deze projectmap. Lees dit bestand eerst, samen met `PLAN.md`, `ARCHITECTUUR.md` en `TAKEN.md`. `HERZIENING.md` beschrijft de herziening van augustus 2026 en is op 2026-08-12 volledig uitgevoerd; het is bewaard als verslag, niet als opdracht, en is niet langer leidend boven de rest.

## Project

**Mochi Glow** (`mochi-glow.com`), een zelfvoorzienende, Nederlandstalige contentsite over K-beauty-ingrediënten en de gut-skin(darm-huid)-connectie, bedoeld voor monetisatie via affiliate links en display-advertenties (Google AdSense). Budget is nul euro, met één uitzondering: een eigen domeinnaam (~€10-15/jaar). De volledige technische stack is open source en gratis.

Uitgangspunten:
- **Doelgroep/toon:** vrouwelijk, warm, maar duidelijk en clean design. Licht kleurenpalet.
- **Niche:** twee contentpijlers, (1) K-beauty-ingrediënten (commercieel, affiliate-driven) en (2) gut-skin-wetenschap (autoriteit, minder commercieel, trekt links/vertrouwen aan). Algemene/brede "skincare" is bewust géén pijler in v1, te verzadigd om mee te concurreren.
- **Persona:** "Noor", een pseudoniem. Géén persoonlijke informatie, geen foto's, geen privéleven. Volledige anonimiteit is expliciet afgewezen, dat schaadt vertrouwen (E-E-A-T) in een gezondheids-/beautyniche te veel.
- **Content is research-based:** er worden geen producten aangekocht om te testen. Content bestaat uit ingrediënt-uitleg, wetenschap-samenvattingen en vergelijkingen met bronvermelding, géén "ik heb dit getest"-taal, want dat kan niet waargemaakt worden.

Volledige onderbouwing van alle keuzes staat in de map `onderzoek/` (zie onderaan).

## Huidige staat

De site is compleet en bouwt lokaal (28 pagina's), maar staat nog niet online. Er is een lokale git-repo met één commit; er is nog **geen** GitHub-remote en nog **geen** Cloudflare Pages-project. `DEPLOY.md` beschrijft die stappen; ze vragen allemaal om accounts en inloggegevens van de eigenaar.

De contentbatch is er: **28 artikelen**, vijftien in `src/content/ingredienten/` en dertien in `src/content/gut-skin/`. Daarmee is de ondergrens uit `PLAN.md` (15-20) ruim gehaald.

De pijlers heten voor de lezer **"Wat zit erin?"**, **"Huid van binnenuit"** en sinds 2026-08-13 **"Tips & routines"**; de collectienamen (`ingredienten`, `gut-skin`, `beauty`) en de URL's zijn ongewijzigd gebleven, want die wijzigen breekt links en indexering. Alle labels staan in `pijlers` in `src/config.ts`.

De derde pijler is er op verzoek van de eigenaar bij gekomen en gaat over de handeling in plaats van de stof: volgorde, gewoontes, werkwijzen. Er staan drie artikelen in (`dubbel-reinigen`, `laagjes-en-volgorde`, `sheetmaskers`). Let op dat juist hier therapeutische taal op de loer ligt, een tip beschrijft wat je dóét, nooit wat het oplevert.

Daarnaast zijn er twee interactieve onderdelen, allebei gebouwd op hetzelfde `Vragenlijst.astro`: `/routine` (vijf vragen, uitkomst is één van vijf routines) en `/eetritme` (zes vragen over wanneer je eet, uitkomst is één van vijf ritmes). Zonder JavaScript is elk van die pagina's een overzicht van alle uitkomsten. De onderbouwing van de eerste herziening, kleur, beeld, geloofwaardigheid, vragenlijstvorm en beweging, staat in `onderzoek/06-kleur-beeld-en-interactie.md`; die van de tweede in `onderzoek/07-herziening-beeld-en-voedingspijler.md`.

`HERZIENING.md` is uitgevoerd en afgerond op 2026-08-12; het bestand is niet langer leidend boven de rest.

Het domein is `mochi-glow.com`, geregistreerd via Cloudflare. De site heette in een eerdere fase "Mochi Skin" op `mochiskin.nl`; die naam komt nog voor in `onderzoek/04-vormgeving-en-eisen.md`, en dat blijft zo, onderzoeksbestanden worden niet met terugwerkende kracht aangepast.

Nog open vóór livegang: de publisher-ID in `public/ads.txt` en `advertentiesActief` in `src/config.ts`. Allebei hangen ze af van goedkeuring door AdSense en staan ze met uitleg in `DEPLOY.md`. De andere twee punten zijn afgerond: `repo:` in `public/admin/config.yml` wijst naar `nmerzaya/mochi-glow.com`, en `data/toegestane-claims.json` is op 2026-08-12 geverifieerd (zie `onderzoek/07`, par. 4.4).

Daar is sinds augustus 2026 de maildienst bij gekomen: de drie Brevo-secrets in Cloudflare en `mailActief` in `src/config.ts`. Zie de aparte paragraaf verderop en `DEPLOY.md`.

## Commando's

```
npm install
npm run dev        # lokale ontwikkelserver
npm run build      # productie-build (draait eerst npm run check)
npm run preview    # de gebouwde site bekijken
npm run check      # alleen de compliance-controle
```

Node 20 of nieuwer. `predev`/`prebuild` draaien `scripts/kopieer-klaro.mjs`, dat Klaro uit `node_modules` naar `public/klaro/` kopieert, die map staat daarom in `.gitignore` en hoort niet handmatig gevuld te worden.

Er zijn **geen tests en geen linter**. Dat is een openstaande keuze, niet iets dat per ongeluk ontbreekt, voeg ze niet ongevraagd toe. `npm run check` is de facto de enige poort: het is geen linter maar een juridische controle (zie hieronder). `tsconfig.json` staat wel op `astro/tsconfigs/strict`, maar er is geen `astro check`-script en `@astrojs/check` is niet geïnstalleerd; typefouten blokkeren de build dus niet.

## Compliance zit in code, niet in een checklist

Dit is het belangrijkste om te begrijpen aan dit project. De site staat in een niche waar de meeste voor de hand liggende beweringen wettelijk verboden zijn. Die regels zijn daarom afgedwongen op drie plekken die samen gelezen moeten worden:

1. **`scripts/check-compliance.mjs`**, draait als eerste stap van elke build en weigert een artikel bij therapeutische taal, gesuggereerde eigen tests, niet-toegestane darmclaims, claims die niet letterlijk in `data/toegestane-claims.json` staan, minder dan 800 woorden, minder dan 2 bronnen bij `gezondheidsclaims: true`, of een verkeerd aantal beelden in de tekst (regel 8b: één tot drie, met alt-tekst, en verwijzend naar `src/assets/`). Het controleert ook `src/data/routinetest.ts` en `src/data/eetritme.ts`, want die teksten worden net zo gelezen als een alinea. Een overtreding is dus niet te publiceren. De patronen zijn bewust streng: liever een terechte weigering te veel dan een overtreding te weinig, een gewoon Nederlands woord als "behandelt" of "draagt bij aan" slaat ook aan, en dan is herschrijven het juiste antwoord, geen uitzondering.
2. **`src/content.config.ts`**, het schema stuurt gedrag, het is geen administratie. `affiliate: true` laat `ArtikelLayout.astro` de disclosure automatisch als eerste blok plaatsen; `gezondheidsclaims: true` zet de medische disclaimer aan; `productType` bepaalt welk wettelijk regime geldt.
3. **`src/config.ts`**, alle sitebrede teksten en namen op één plek, plus de vlag `advertentiesActief`.

De ontsnappingsklep is `taalUitzonderingen` in de frontmatter: een artikel dat een verboden term beschrijvend gebruikt (bijvoorbeeld om uit te leggen dat een crème niets mag "genezen") declareert die term mét reden van minimaal 15 tekens. Zo blijft een uitzondering zichtbaar en toetsbaar in plaats van stilzwijgend. Voeg nooit een term toe aan de uitzonderingen om een terechte melding weg te krijgen.

### De gut-skin-pijler kent twee sporen, en niets ertussenin

De NVWA rekent een verwijzing naar wetenschappelijke of medische publicaties zélf tot een ontoelaatbare medische claim op een pagina die een levensmiddel aanprijst. Tot augustus 2026 was die pijler daarom op schemaniveau niet-commercieel. Sinds `onderzoek/07` par. 4.3 is dat een eigenschap van het artikel in plaats van de pijler, met precies twee toegestane combinaties:

| spoor | `productType` | `affiliate` | mag naar onderzoek verwijzen |
|---|---|---|---|
| wetenschap | `geen` | `false` | ja |
| commercieel | `voeding-supplement` | mag `true` | **nee** |

Alles daartussenin is een fout en geen keuze; schema én controlescript weigeren het. Bij `voeding-supplement` slaat de controle aan op links naar medische domeinen, op onderzoeksverwijzingen in wóórden (ook in de zichtbare titel van een bron), en toont `Bronnenlijst.astro` de bronnen zonder klikbare link.

**Let op de siteniveau-toets.** DV8-03 geldt voor de website, niet voor de pagina: een commercieel voedingsartikel over een onderwerp waarover elders op de site mét onderzoekslinks geschreven wordt, brengt de site als geheel in overtreding, ook al klopt elke pagina op zichzelf. Het controlescript toetst dat op `tags`. Geef een commercieel voedingsartikel dus nooit een tag die al op een artikel met medische bronnen staat. Dat is de reden dat het commerciële spoor over vitamine E gaat en niet over vitamine C.

De onderzoeksverwijzingsregel is bewust **niet** met `taalUitzonderingen` te overrulen: de ontsnappingsklep is het juiste spoor kiezen.

## Stack

Motivatie per keuze staat in `ARCHITECTUUR.md`; hieronder alleen wát er gekozen is.

- **Astro** (v7), content collections + `astro:assets` beeldoptimalisatie, standaard geen JavaScript. Plus `@astrojs/sitemap` en `@astrojs/rss`.
- **Cloudflare Pages**, hosting, auto-deploy bij push (gratis laag: 1 gelijktijdige build). Nog niet ingericht.
- **Sveltia CMS** op `/admin`, git-based; bewust *niet* Decap CMS (CVE-2025-57520). `public/admin/config.yml` moet exact overeenkomen met `src/content.config.ts`; wijk je in het één af, dan faalt de build op het ander, dat is de bedoeling.
- **Klaro**, zelfgehoste cookie consent, laadt vóór alle andere scripts. Het venster verschijnt zodra er werkelijk iets te kiezen valt, dat wil zeggen zodra `ga4MeetID` gevuld is óf `advertentiesActief` aanstaat; staan die allebei uit, dan is er geen toestemmingsvenster, want een banner tonen voor cookies die niet geplaatst worden is misleidend. `ga4MeetID` stáát gevuld sinds commit `a3e5bc9`, dus het venster is er; de zin "nul byte JavaScript op de site" die hier eerder stond, gold alleen daarvóór.
- **GitHub** (publieke repo), vereist voor zowel Cloudflare Pages als Sveltia CMS. Nog aan te maken.

Wijk hier niet van af zonder `ARCHITECTUUR.md` → "Waarom geen andere opties" te lezen.

## Afspraken

**Taal:** alle content, code-comments waar zinvol, en documentatie in het Nederlands. Variabelen/bestandsnamen in het Engels (standaardconventie), met als uitzondering dat de bestaande code Nederlandse namen gebruikt voor domeinbegrippen (`bronnen`, `taalUitzonderingen`, `ruweTekst`); volg de omringende code.

**Wat nooit in de content mag:**
- Therapeutische of medische claims over cosmetica (bv. "geneest", "vermindert ontsteking"), verboden onder EU-Verordening 1223/2009 en 655/2013.
- Ongeautoriseerde gezondheidsclaims over darmgezondheid/supplementen, alleen claims die voorkomen in het EFSA-register (Verordening 1924/2006) zijn toegestaan. Voor probiotica bestaat géén enkele toegestane claim; het woord "probiotisch" geldt zelf al als claim.
- Eigen testervaring suggereren ("ik heb getest", "mijn ervaring"), er wordt niet getest, dus dit mag niet gesuggereerd worden. Gebruik in plaats daarvan uitleg-, vergelijkings- en samenvattingsformats met bronvermelding.
- Persoonlijke informatie over de maker.

**Wat altijd in elk artikel met een affiliate link moet:** een reclame-disclosure als eerste zin van het artikel (niet in een voetnoot). Vereist sinds de aangescherpte Reclamecode Social Media & Influencer Marketing (RSM) per 1 juli 2026. Dit wordt niet getypt maar afgedwongen, zie de invarianten hieronder.

**Volgorde van werken:** eerst de technische basis en verplichte pagina's, dán de eerste contentbatch (15-20 artikelen), en pas dáárna affiliate-programma's en AdSense aanvragen. Niet eerder aanvragen, een te vroege, afgewezen aanvraag (vooral bij Amazon Associates) kan niet opnieuw beoordeeld worden; je moet dan volledig opnieuw solliciteren. Zie `TAKEN.md` voor de exacte fasering.

**Afbeeldingen:** de site gebruikt uitsluitend **echte fotografie**. De SVG-illustraties van vóór augustus 2026 zijn volledig verwijderd, niet bewaard als terugval, zie `onderzoek/07`, par. 4.1. Vier harde regels:
1. **Geen gegenereerd beeld.** Geen enkele AI-foto op de site, in geen enkele rol, dit is een eis van de eigenaar, vastgelegd op 2026-08-13. `scripts/genereer-beeld.mjs` staat er nog als geschiedenis en mag niet meer gedraaid worden. Het weerlegt niet `onderzoek/07` par. 4.1, maar gaat er wél overheen.
2. **Geen gezichten.** Niet van de persona ("Noor") en niet van modellen. Wel: grondstoffen, bereiding, textuur, en huid zonder gezicht (onderarm, schouder, hand). Dit is sinds de overstap op Pexels niet alleen huisstijl maar ook licentievoorwaarde: een herkenbaar persoon mag niet overkomen als aanbeveling.
3. Productafbeeldingen zijn bij voorkeur echte pers-/marketingbeelden van het merk zelf (gebruikelijk en toegestaan bij affiliate-content). Let bij stockfoto's op leesbare merken in beeld, een willekeurig merk op een pagina die een ánder product aanprijst, is misleidend.
4. Beeld toont een concreet ding uit het artikel, nooit het beloofde effect. Een korrel rijst mag, een stralende huid niet. Dezelfde regel als voor de tekst.

Praktisch: `scripts/haal-stockbeeld.mjs` draait handmatig en in twee fasen, nooit als onderdeel van de build, de site zelf verbindt nooit met een beeldbank, want dat zou de invariant "geen externe verzoeken" breken.

```
node scripts/haal-stockbeeld.mjs kandidaten [artikel]   # zoekt en maakt contactbladen in beeldkeuze/
node scripts/haal-stockbeeld.mjs kies                   # haalt op wat in beeldkeuze/KEUZE.txt staat
node scripts/maak-contactblad.mjs                       # de hele reeks op één blad, ter controle
```

**Het script kiest niet zelf, en dat is de kern.** De eerste opzet koos automatisch op basis van de titel van een bestand, en zette daarmee een lachend gezicht, drie flesjes met leesbaar merk en een honkbalfoto op de site. Een titel beschrijft een foto niet betrouwbaar genoeg; een mens die kijkt wel. Fase 1 zet zes kandidaten per plek op een contactblad, fase 2 haalt alleen op wat er in `KEUZE.txt` is aangewezen. Draai fase 2 nooit met ongecontroleerde keuzes.

**Bron:** Pexels met een gratis sleutel (`PEXELS_SLEUTEL` in `.env`) levert het origineel, meestal 3000-9000 px. Openverse geeft voor rawpixel en StockSnap altijd een preview van 1024 respectievelijk 960 px, ongeacht de grootte van het origineel, en elk URL-patroon naar een groter formaat geeft 404, gemeten 2026-08-13. Wikimedia is de terugval voor onderwerpen die op een fotobank niet bestaan (bijvoet, houttuynia). Let op: de Pexels-licentie is géén CC0. `src/assets/HERKOMST.md` wordt door het script geschreven en legt per beeld herkomst, maker en licentie vast.

De deelkaart `public/og-standaard.jpg` wordt door `scripts/maak-merkbeeld.mjs` opgebouwd uit `rijstextract.jpg`; draai dat script opnieuw zodra dat beeld verandert.

**Pins voor Pinterest** komen uit `node scripts/maak-pins.mjs`: één staand beeld van 1000×1500 per artikel, in `pins/`, die map staat in `.gitignore` en komt niet op de site. Twee dingen om niet omver te gooien:

1. **De teksten komen letterlijk uit `titel` en `beschrijving` in de frontmatter.** `check-compliance.mjs` haalt juist die twee velden door dezelfde verboden-taal- en claimpatronen als de body (zie `zoekIn` daar). Een pintekst is een reclame-uiting over cosmetica of voeding en valt onder dezelfde verordeningen als de site; een ter plekke bedachte, pakkendere zin ontsnapt aan de controle. Wil je andere pintekst, wijzig dan het artikel.
2. **Nooit het kale beeld uit `src/assets/artikelen/` plaatsen.** De Pexels-licentie staat commercieel gebruik toe maar niet het doorgeven van een ongewijzigde foto als losse foto. Een pin is bijgesneden, kleurgecorrigeerd en voorzien van een tekstvlak, en dus geen ongewijzigde foto.

Rich Pins vragen niets extra's: `og:type="article"`, `og:title`, `og:description` en `article:published_time` staan al in `BasisLayout.astro`. Het domein claimen kan met `pinterestVerificatie` in `src/config.ts`.

## Invarianten bij het bouwen

- De affiliate-disclosure wordt niet handmatig getypt: `affiliate: true` in de frontmatter laat `ArtikelLayout.astro` de tekst uit `disclosureTekst` (`src/config.ts`) automatisch als eerste blok plaatsen. Het moet onmogelijk blijven dit te vergeten.
- Drie content collections: **`ingredienten`**, **`gut-skin`** en **`beauty`** (die laatste sinds 2026-08-13; leesbaar label "Tips & routines", over de handeling in plaats van de stof). (Let op: `ARCHITECTUUR.md` en `TAKEN.md` noemen de eerste nog `kbeauty-ingredienten`, de code is leidend.) De verplichte pagina's (privacy, cookiebeleid, affiliate-disclaimer, algemene voorwaarden, contact, over, redactionele richtlijnen) zijn losse statische pagina's in `src/pages/`, géén collectie.
- Klaro blokkeert standaard: een advertentiescript staat als `type="text/plain"` met `data-name="adsense"` in de HTML en wordt pas ná toestemming vrijgegeven. **Google Analytics is hierop de uitzondering** en draait sinds commit `f125aac` op Consent Mode v2: `consent default: denied` wordt gezet vóórdat `gtag.js` laadt, waarna het script wél meteen wordt opgehaald. Er gaan dus geen cookies of identifiers weg zonder toestemming, maar bij het openen van de pagina gaat er wel een verzoek, en daarmee een IP-adres, naar googletagmanager.com. Die afweging staat uitgeschreven in `BasisLayout.astro` en is eerlijk beschreven in `/privacybeleid`; wijzig het één niet zonder het ander. Wie het strenger wil: `ga4MeetID` in `src/config.ts` op `null`.
- Geen externe verzoeken vanaf de site: geen CDN's, geen tracking, geen lettertype van een derde partij. Dat is een AVG-keuze, niet alleen een prestatiekeuze. **Let op de precieze grens:** de regel verbiedt een verbinding met een derde partij, niet een eigen letter. De site serveert sinds augustus 2026 drie zelfgehoste lettertypen uit `public/fonts/` (Fraunces, Newsreader, IBM Plex Mono, alle drie SIL OFL). Zelfde herkomst, geen derde partij, geen IP-adres dat weglekt. Opgehaald met `scripts/haal-letters.mjs`, licenties in `public/fonts/LICENTIE.md`. Controleer na een wijziging dat `dist/index.html` nog steeds geen enkele externe URL bevat.
- `uitgelicht: true` wérkt nu: de homepage kiest het nieuwste artikel met die vlag en valt terug op het nieuwste artikel überhaupt als niemand hem heeft gezet. De uitgelichte plek is dus nooit leeg.
- **Beeld is verplicht en heeft geen terugval.** `ArtikelBeeld.astro` bestaat niet meer; `Beeld.astro` toont één echte afbeelding en kiest alleen nog de uitsnedes per gebruikssituatie (`kaart`, `kop`, `breed`). Omdat er geen terugval is, is `afbeelding` in het schema verplicht, een vergeten beeld hoort een bouwfout te geven, geen gat op de pagina. Elk artikel heeft daarnaast twee beelden in de lopende tekst als gewone `![alt](../../assets/artikelen/…)`-verwijzingen; `npm run check` bewaakt dat het er één tot drie zijn, dat ze alt-tekst hebben en dat het pad naar `src/assets/` wijst (alleen dan optimaliseert Astro ze).
- **Het `accent`-veld kleurt het vlak achter het beeld**, via `.accent-* .item__vlak` en `.accent-*.artikel__beeld` in `globaal.css`. Die regels stonden een tijd op `.kaart__vlak`/`.uitgelicht__vlak`, klassen die na de opmaakherziening niet meer bestonden, waardoor het veld stilzwijgend niets deed. Verplaats ze mee als de kaartopmaak weer verandert.
- Tekstkleuren in `src/styles/tokens.css` zijn getoetst op WCAG 2.2 AA. De `-zacht`-varianten zijn uitsluitend voor vlakken en randen, nooit voor tekst. Dat geldt ook voor de drie `--kleur-glans-*`-tinten: die zijn er voor verloopvlakken en halen geen enkele contrasteis.
- **De speelse laag heeft een grens, en die is opzettelijk.** `--rond-speels` en `--kleur-accent-warm` horen uitsluitend op de header van de homepage, de twee vragenlijsten, badges/pillen en, sinds 2026-08-13, op verzoek van de eigenaar, het cookievenster. Broodtekst, artikelpagina's, kaarten en tabellen blijven redactioneel. De onderbouwing staat in `onderzoek/06`, par. 4.3; de reden dat het als invariant is opgeschreven, is dat dit project al één keer eerder ongemerkt van vormgevingsrichting wisselde (`onderzoek/04` par. 4.1 koos speels, commit 5f38fc9 draaide dat om).
- **Geen enkele animatie start vanzelf.** De lopende band is bij de herziening van augustus 2026 verdwenen; wat overblijft is één scroll-gestuurde onthulling (`@keyframes onthullen` in `globaal.css`), die door de lezer wordt aangedreven en achter `prefers-reduced-motion: no-preference` staat. Komt er ooit weer beweging die vanzelf begint en langer dan vijf seconden duurt, dan valt die onder WCAG 2.2 SC 2.2.2 en heeft hij een echte pauzeknop nodig, `prefers-reduced-motion` alléén is daarvoor niet genoeg, want de W3C-toelichting noemt die mediaquery niet als manier om aan het criterium te voldoen.
- **De vragenlijsten (`/routine` en `/eetritme`) mogen geen diagnose stellen en niets verkopen.** Vragen gaan over hoe de huid aanvoelt, wat iemand prettig vindt en hoe een dag eruitziet, nooit over een aandoening; uitkomsten beloven geen effect en noemen geen merken of producten. Zodra er wél een product in komt, geldt de disclosureplicht ook op die pagina.
- **Alle tekst van de vragenlijsten staat in `src/data/routinetest.ts` en `src/data/eetritme.ts`, en nergens anders.** `scripts/check-compliance.mjs` leest beide bestanden en haalt elke tekenreeks erin langs dezelfde verboden-taalpatronen als de artikelen, inclusief de claimcontrole. Zet je die teksten rechtstreeks in een `.astro`-bestand, dan ontsnappen ze aan die controle. Beide pagina's delen één component, `Vragenlijst.astro`.
- **De vragenlijsten slaan uit zichzelf niets op en sturen uit zichzelf niets weg**: geen cookie, geen localStorage, geen netwerkverzoek. Sinds augustus 2026 is er precies één uitzondering, en die begint altijd bij de lezer: onder de uitkomst staat de mogelijkheid hem naar je eigen adres te laten sturen. Drukt niemand op die knop, dan gaat er niets weg. Gaat er wel iets weg, dan zijn dat het adres en de id van de uitkomst, nooit de antwoorden. Zo staat het in het privacybeleid, dus zo moet het blijven.

## De maildienst: `functions/` en de vlag `mailActief`

Sinds augustus 2026 kan een bezoeker zich aanmelden voor bericht bij een nieuw artikel, en de uitkomst van een vragenlijst naar zichzelf laten mailen. Dat is de eerste code op deze site die niet statisch is. Vier dingen om te weten:

1. **`functions/api/*.ts` zijn Cloudflare Pages Functions**, geen onderdeel van de Astro-build. Elk bestand wordt vanzelf een eindpunt (`aanmelden.ts` → `/api/aanmelden`). Ze bestaan alleen op Cloudflare **Pages**; op Workers doet die map niets, en dat is de reden dat `wrangler.jsonc` op `pages_build_output_dir` staat en niet op `assets`. `astro dev` serveert ze niet, gebruik `npx wrangler pages dev dist` met een `.dev.vars` (zie `DEPLOY.md`).
2. **De browser stuurt nooit tekst mee, alleen een id.** `/api/uitslag` haalt de inhoud van de mail uit `src/data/`, precies dezelfde bron als de pagina, en dus dezelfde bron waar `npm run check` overheen gaat. Zou de pagina de tekst meesturen, dan kon iemand willekeurige inhoud onder de naam van deze site laten versturen én zou die inhoud buiten de compliance-controle vallen. Draai dat niet om.
3. **`mailActief` in `src/config.ts` zet beide formulieren aan en uit.** Staat hij `false`, dan staat er geen formulier op de site en vertellen `/privacybeleid` en `/cookiebeleid` er ook niet over; die teksten hangen op dezelfde vlag. Zet je hem aan zonder dat de Brevo-secrets in Cloudflare staan, dan vraagt de site een adres en antwoordt daarna dat het niet kan, precies wat `/contact` al eerder heeft afgewezen.
4. **`BREVO_SLEUTEL` hoort nooit in deze repo.** Anders dan de Web3Forms-sleutel, die sowieso in de HTML van elk formulier staat, kan met deze sleutel mail namens dit domein verstuurd worden. Hij hoort in Cloudflare Pages als secret.

## Openstaande placeholders vóór livegang

Deze staan bewust op een tijdelijke waarde en moeten ingevuld worden; ze zijn ook in `README.md` opgesomd:

- `public/admin/config.yml` → `repo: GEBRUIKERSNAAM/mochi-glow` invullen zodra de GitHub-repo bestaat.
- `public/ads.txt` → publisher-ID invullen ná goedkeuring van AdSense.
- `src/config.ts` → `advertentiesActief` op `true` bij livegang van advertenties.
- Cloudflare Pages → de secrets `BREVO_SLEUTEL`, `BREVO_LIJST_ID` en `BREVO_DOI_SJABLOON`, en daarna `mailActief` in `src/config.ts` op `true`. In die volgorde: de vlag aanzetten zonder de secrets levert een formulier op dat een adres vraagt en daarna zegt dat het niet kan.

## Omgeving

**Shell:** Windows PowerShell 5.1. `&&` geeft daar een parserfout; gebruik `npm run build; if ($?) { npm run preview }`. (Binnen `package.json` werkt `&&` wél, npm draait scripts via `cmd.exe`.)

**Locatie:** het project staat in een OneDrive-map. `node_modules/` bestaat en staat in `.gitignore`; OneDrive-sync kan builds vertragen en bestanden vergrendelen.

## Onderzoeksregels

Voor dit project is een vaste onderzoeksmethode gebruikt, vastgelegd in `onderzoek/`. Volg dezelfde methode als er later nieuw onderzoek nodig is (bv. bij het kiezen van specifieke affiliate-producten, of het verifiëren van een nieuwe claim):

1. **Vraagstelling eerst.** Formuleer een hoofdvraag, 3-5 deelvragen, wat expliciet buiten scope valt, en wanneer het onderzoek "af" is, vóór je gaat zoeken.
2. **Log elke bron, trek geen conclusies tijdens het loggen.** Elke bron krijgt een code, link, type (A = primair/officieel, B = secundair/vakmedia, C = tertiair/blog of community), raadpleegdatum, status en de gebruikte zoekterm.
3. **Verifieer elke bron door hem te openen.** Bestaat de pagina nog, en komt de inhoud daadwerkelijk overeen met het onderwerp waarvoor hij gelogd is? Bronnen die niet bestaan, leeg/geblokkeerd zijn, of niet overeenkomen krijgen status `onbruikbaar` met reden.
4. **Zoek expliciet naar tegenspraak vóór je concludeert.** Voor elke (voorlopige) conclusie: zoek actief naar bronnen die hem onderuithalen. Vind je niets, documenteer dan de zoekterm en waarom dat aannemelijk niets oplevert.
5. **Pas ná stap 1-4 een conclusie of bouwbeslissing nemen.**

Dezelfde A/B/C-typering wordt in het contentschema gebruikt voor de bronnen onder een artikel.

## Map `onderzoek/`

Bevat het volledige onderzoek dat aan dit project ten grondslag ligt:
- `00-vraagstelling.md`, hoofdvraag, 5 deelvragen, scope-afbakening, definitie van "af".
- `01-bronnen.md`, 45 gelogde en geverifieerde bronnen (36 bruikbaar, 9 gemarkeerd onbruikbaar met reden).
- `03-tegenspraak.md`, expliciete tegenspraak-check per deelvraag, incl. één deelvraag waar bewust niets tegensprekends is gevonden (met onderbouwing).
- `04-vormgeving-en-eisen.md`, vormgeving, E-E-A-T, claims op voeding/supplementen en toegankelijkheid. **Par. 4.3 is de bron voor de taalregels in `check-compliance.mjs`**; par. 4.1 voor de ontwerptokens.
- `05-bronnen-contentbatch.md`, de bronnen achter de zestien artikelen.
- `06-kleur-beeld-en-interactie.md`, kleur, beeld, geloofwaardigheid, vragenlijstvorm en beweging. Bron voor de speelse laag in `tokens.css` en voor de routinetest. **Belangrijkste uitkomst is een negatief resultaat:** kleurpsychologie levert geen bruikbare regels om een palet uit af te leiden, want het effect van een kleur hangt aantoonbaar van de context af. Onderbouw een kleurkeuze hier dus nooit met "kleur X staat voor Y".
- `07-herziening-beeld-en-voedingspijler.md`, de beeldpijplijn en de splitsing van de tweede pijler. **Par. 4.1** is de bron voor het beeldbeleid (aangehaald vanuit `Beeld.astro` en `content.config.ts`), **par. 4.3** voor het twee-sporenmodel en de siteniveau-toets, **par. 4.4** voor de claimverificatie. Bevat twee weerlegde aannames: een Pollinations-token verhoogt de resolutie níét, en de claimlijst bleek grotendeels geparafraseerd in plaats van geciteerd.
- `08-markt-koper-en-commerciele-waarde.md`, marktomvang, de koper en het verdienmodel, met **de persona in par. 5**. Twee uitkomsten die het plan raken: Nederland is de snelst groeiende K-beautymarkt van Europa (+220,4% import in een half jaar), en het oorspronkelijke verdienmodel uit `PLAN.md`, informatieve artikelen die zoekverkeer trekken, is structureel verzwakt door AI-antwoorden in de zoekmachine (58% minder doorkliks). Bouw op terugkerend publiek, niet op zoekposities.
- `09-aandacht-vertrouwen-en-klikgedrag.md`, waarop vertrouwen, aandacht en klikken berusten. **Par. 4.1**: vormgevingskwaliteit is het eerste en zwaarste vertrouwensoordeel, boven de inhoud, daarom is ontwerp hier een commerciële hefboom. **Par. 4.3**: een klik wordt beslist op de eerste twee woorden van een link. **Par. 4.6** legt vast wat er nadrukkelijk níét gebouwd wordt, en waarom: kunstmatige urgentie is sinds de DSA verboden (boetes tot 6% van de wereldomzet) én werkt bij deze sceptische doelgroep averechts.

De nummering springt van `01` naar `03`; er is geen `02-`-bestand en geen enkel document verwijst ernaar, er ontbreekt dus niets.

Deze bestanden zijn de bron van waarheid voor **waarom** de keuzes in `ARCHITECTUUR.md` en `PLAN.md` zijn gemaakt. Wijzig ze niet met terugwerkende kracht om latere beslissingen te "rechtvaardigen", voeg bij nieuw onderzoek een nieuw genummerd bestand toe (bv. `07-...md`).
