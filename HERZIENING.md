# HERZIENING.md

Grote herziening van Mochi Glow — beeld, content, structuur, interactie en UI/UX. Vastgelegd op 2026-08-10, na kritische review van de live site door de eigenaar. Dit bestand beschrijft wijzigingen ten opzichte van wat in `CLAUDE.md`, `PLAN.md` en `ARCHITECTUUR.md` stond; waar dit ermee in tegenspraak is, is dít bestand leidend totdat die drie bestanden zijn bijgewerkt.

## Aanleiding

Bij een kritische blik op de live site (`mochi-glow.com`) kwamen vijf punten naar voren:
1. Beeld is inconsistent (SVG-illustraties naast één losse fotorealistische hero) en de hero-foto botst met de regel dat de persona nooit als echt gezicht getoond mag worden.
2. Content is te beperkt qua onderwerp en te formeel/streng van toon.
3. Menu-labels zijn onduidelijk — "Ingrediënten" leest als productcatalogus.
4. De routinetest is te generiek.
5. De algehele UI/UX oogt te "templated"/kinderlijk voor een beauty-lifestylemerk.

## 1. Beeld — volledig vervangen, niet aanvullen

Vervang alle bestaande beelden (zowel de SVG-illustraties op kaarten/artikelen als de losse hero-foto) door consistente, realistische, editorial-achtige fotografie via Pollinations.ai.

- **Geen gezichten.** Wel: close-ups van ingrediënten (bv. rijst, groene thee, fermentatie), huid/lichaamsdelen zonder gezicht (handen, schouders, huidtextuur), voeding.
- **Hoge resolutie** — scherp op elk scherm, dus een groot formaat opvragen bij de Pollinations-aanroep.
- **2 tot 4 afbeeldingen per artikel:** één hero-afbeelding bovenaan/bij de kaart, plus 1-3 extra beelden verspreid door de tekst voor een magazine-ritme.
- **Consistente stijlbeschrijving** in elke prompt (kleurtemperatuur, licht, compositie) zodat de site samenhangt — leg deze stijl één keer vast (bijvoorbeeld als herbruikbare promptsjabloon) en hergebruik hem overal.
- **Verwijder de SVG-illustratielogica** uit `ArtikelBeeld.astro` volledig; dit is geen fallback meer, het wordt vervangen.
- De twee bestaande harde regels uit `CLAUDE.md` blijven onverkort gelden: geen AI-gezicht dat als echte foto van de persona ("Noor") gepresenteerd wordt, en productafbeeldingen bij voorkeur als echt persmateriaal in plaats van AI-nabootsing van een specifiek bestaand product.

## 2. Content — meer, breder, en een andere toon

- Schrijf nieuwe artikelen binnen de bestaande pijler **Skincare/ingrediënten** én breid **Voeding & huid** fors uit met content over hoe voeding de huid beïnvloedt, en over natuurlijke, voedingsgerelateerde ingrediënten in K-beauty specifiek.
- Herschrijf zowel nieuwe als de **bestaande 16 artikelen** naar een toon die informatief blijft maar minder streng/formeel aanvoelt — wat luchtiger, met meer sfeer, zonder feitelijke claims te verzwakken of te verzinnen. Laat elk herschreven artikel opnieuw door `npm run check` lopen voordat het als klaar geldt.

### Compliance-nuance — belangrijk, niet overslaan

De gut-skin/voeding-pijler is in de huidige architectuur bewust niet-commercieel (`affiliate: z.literal(false)`, `productType: z.literal('geen')`) — dat is precies waarom die artikelen wél vrij naar wetenschappelijk onderzoek mogen linken zonder onder de zwaardere regels voor gezondheidsclaims te vallen. NVWA-onderzoek (2026-08-10) bevestigt: Verordening 1924/2006 geldt voor elke "commerciële communicatie" over voeding, en de NVWA rekent daar expliciet product reviews en internetpresentaties onder. Zodra er commercieel belang bijkomt, mag alleen nog met EFSA-goedgekeurde claims gewerkt worden, én geldt de regel dat een verwijzing naar onderzoek zelf al als medische claim telt op een pagina die iets aanprijst.

**Besluit:** twee soorten content binnen Voeding & huid, herkenbaar in het schema:
- **(a) Bestaande, non-commerciële wetenschapsartikelen** — `affiliate: false`, mogen vrij naar onderzoek linken, blijven zoals nu.
- **(b) Nieuwe, commerciële "voeding & huid"-artikelen** — `affiliate: true` toegestaan, maar **geen** verwijzingen naar onderzoek/medische publicaties, uitsluitend EFSA-goedgekeurde claims uit `data/toegestane-claims.json`.

Werk `src/content.config.ts` hierop bij — dit vervangt de huidige harde `z.literal(false)` door een onderscheid tussen deze twee typen binnen dezelfde collectie (of twee subcollecties). Voeg aan `scripts/check-compliance.mjs` een regel toe die bij `affiliate: true` binnen deze pijler controleert dat er géén verwijzing naar onderzoek/medische bronnen in de tekst staat.

## 3. Menu-structuur — duidelijker labelen

- "Ingrediënten" wekt de indruk van een productcatalogus. Hernoem naar **"Wat zit erin?"** (sluit aan bij de bestaande hero-tekst op de homepage) of een vergelijkbaar, nieuwsgierig-makend label — niet "ingrediënten" of "producten".
- Overweeg "Voeding & huid" te hernoemen naar iets met meer sfeer, bijvoorbeeld **"Huid van binnenuit"**.

## 4. Nieuwe interactieve tool — apart naast de bestaande routinetest

Bouw een nieuwe, aparte quiz/tool specifiek over voeding en huid, náást de bestaande huidroutine-quiz (niet als vervanging). Denk aan iets dat niet elders bestaat — bijvoorbeeld gekoppeld aan seizoen, energie, of eetpatroon in plaats van het generieke "welk huidtype ben jij".

Dezelfde harde regels als de bestaande routinetest blijven gelden: geen diagnose, geen belofte van resultaat, en zodra er (via de nieuwe commerciële voedingscontent) een product in voorkomt, geldt de disclosureplicht ook hier — zie de bestaande invariant hierover in `CLAUDE.md`.

## 5. UI/UX — volledige visuele revisie richting magazine-gevoel

De site oogt nu te templated/kinderlijk voor een beauty-lifestylemerk. Herzie met name:

- De hero/slider onder de header: vervang een eventuele speelse/bouncy carrousel door een rustigere, zelfverzekerde editorial-hero (groot beeld, sterke typografie, minder "widget"-gevoel).
- Algeheel ritme: grotere, asymmetrische beeld-tekstcombinaties zoals in lifestyle-magazines, in plaats van gelijkmatige kaartjes-grids overal.
- Behoud de bestaande, goed werkende typografie (serif koppen/sans-serif body).
- De speelse laag (ronde vormen, warme accentkleur) blijft beperkt tot header, routinetest, badges en lopende band — die mag verfijnd worden, niet terug naar generiek.

## Status

**Uitgevoerd en afgerond op 2026-08-12.** Dit bestand is vanaf nu een verslag en geen opdracht; het is niet langer leidend boven `CLAUDE.md`, `PLAN.md` en `ARCHITECTUUR.md`, die zijn bijgewerkt naar de werkelijke staat. De onderbouwing van de gemaakte keuzes staat in `onderzoek/07-herziening-beeld-en-voedingspijler.md`.

### Wat er anders is gelopen dan hierboven staat

Vier dingen wijken bewust af van de oorspronkelijke opdracht. Ze staan hier zodat later navolgbaar is waaróm.

1. **"Hoge resolutie" is niet gehaald, en dat kan ook niet.** Par. 1 vroeg om een groot formaat bij de Pollinations-aanroep. Gemeten: de dienst levert ongeveer 0,6 megapixel (1024×576) ongeacht wat je vraagt, en ook een betaald token verandert daar niets aan — 84 verzoeken op 1920×1080 gaven 84 keer 1024×576 terug. Elk beeld wordt daarom lokaal 2× opgeschaald. Zie `onderzoek/07` par. 4.2.
2. **De nieuwe commerciële voedingsartikelen staan op `affiliate: false`.** Par. 2 stond `affiliate: true` toe. Ze hebben wél `productType: 'voeding-supplement'`, dus het strengere juridische regime geldt onverkort. Reden: er zijn nog geen affiliate-programma's (Fase 4 in `TAKEN.md` is niet begonnen), en `affiliate: true` zet automatisch een disclosure die belooft dat het artikel affiliate-links bevat. Die zou dan liegen. Zodra er links in gaan, is het één woord omzetten.
3. **De onderwerpkeuze is juridisch gestuurd, niet redactioneel.** De NVWA toetst het verbod op medische informatie bij een aangeprezen levensmiddel op siteniveau. Daardoor mag een commercieel voedingsartikel geen onderwerp delen met een artikel dat naar onderzoek linkt. Het commerciële spoor gaat daarom over vitamine E en niet over het voor de hand liggende vitamine C. `scripts/check-compliance.mjs` bewaakt dit op `tags`.
4. **Er is één ding gevonden dat niet in de opdracht stond en toch moest.** `data/toegestane-claims.json` bleek grotendeels geparafraseerd in plaats van geciteerd: twaalf van de zestien claims en vijf van de zes darmclaims weken af van de verordening. Dat is rechtgezet; zie `onderzoek/07` par. 4.4.
