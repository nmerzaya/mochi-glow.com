# Beeld en de voedingspijler — onderzoek ten behoeve van de herziening

Zevende onderzoeksbestand, volgens de methode uit `CLAUDE.md`. Aanleiding: de opdracht in `HERZIENING.md` (2026-08-10) om het beeld op de site volledig te vervangen, de tweede pijler uit te breiden met commerciële voedingscontent, en de site inhoudelijk te laten groeien.

`onderzoek/06-kleur-beeld-en-interactie.md` ging over wát er te onderbouwen valt aan kleur, beeld en interactie. Dit bestand gaat over de uitvoering daarvan en over één juridische vraag die `06` niet raakte: of een commercieel voedingsartikel überhaupt náást de bestaande wetenschapsartikelen kan bestaan. Bestaande bestanden zijn niet gewijzigd. Codes lopen door vanaf `DV15`.

---

## 1. Vraagstelling

### Hoofdvraag

Onder welke voorwaarden kan Mochi Glow overstappen op fotografie als enige beeldbron, en kan de tweede pijler commerciële voedingscontent dragen zonder de bestaande wetenschapsartikelen in overtreding te brengen?

### Deelvragen

15. **Beeldpijplijn.** Welke resolutie levert Pollinations werkelijk, wat verandert een account-token daaraan, en wat betekent dat voor het vervangen van de SVG-illustraties door foto's?
16. **Voedingspijler.** Toetst de NVWA het verbod op medische informatie bij een aangeprezen levensmiddel per pagina of per site, en wat volgt daaruit voor een site die beide sporen wil combineren?
17. **Claims.** Kloppen de bewoordingen in `data/toegestane-claims.json` letterlijk met de vastgestelde Europese lijst?

### Buiten scope

- De keuze vóór fotografie als zodanig — die is in `HERZIENING.md` door de eigenaar gemaakt en is hier het uitgangspunt, niet de vraag.
- Het palet en de typografie; die blijven zoals vastgelegd in `04` en `06`.
- Affiliate-programma's en de keuze van producten. Fase 4 in `TAKEN.md` is nog niet begonnen.

### Wanneer is dit onderzoek af

Zodra vaststaat welke resolutie de beeldgenerator feitelijk levert, of het twee-sporenmodel voor de voedingspijler juridisch houdbaar is en hoe dat afdwingbaar in code te maken is, en of elke claim in `toegestane-claims.json` letterlijk klopt met de verordening.

---

## 2. Bronnenlog

Type-classificatie en statuslegenda: zie `01-bronnen.md`. **Raadpleegdatum voor alle onderstaande bronnen: 2026-08-12.** Elke bron is geopend en gecontroleerd op bestaan én inhoudelijke overeenkomst.

### Deelvraag 15 — Beeldpijplijn

Deze deelvraag is niet met literatuur beantwoord maar met een eigen meting; dat is hier de enige manier, want de dienst documenteert dit gedrag niet.

| Code | Methode | Uitkomst | Status |
|---|---|---|---|
| DV15-01 | Anoniem 2048×1152, 1440×900 en 1024×1024 opgevraagd bij `image.pollinations.ai` (meting 2026-08-11) | respectievelijk 1024×576, 971×607 en 768×768 terug | gemeten |
| DV15-02 | 84 verzoeken op 1920×1080 mét geldige `POLLINATIONS_TOKEN` (meting 2026-08-12) | 84 van de 84 keer 1024×576 terug | gemeten |
| DV15-03 | `/models` opgevraagd | alleen `sana`; `flux` en `turbo` vallen daar stilzwijgend op terug | gemeten |

### Deelvraag 16 — Voedingspijler

| Code | Zoekterm | Link | Type | Status |
|---|---|---|---|---|
| DV16-01 | NVWA voedingsclaims en gezondheidsclaims levensmiddelen | https://www.nvwa.nl/onderwerpen/voedselveiligheid/voedingsclaims-en-gezondheidsclaims | A | opgehaald |
| DV16-02 | NVWA regels over claims bij levensmiddelen | https://www.nvwa.nl/onderwerpen/voedselveiligheid/voedingsclaims-en-gezondheidsclaims/regels-over-claims-bij-levensmiddelen | A | opgehaald |

DV8-03 uit `04-vormgeving-en-eisen.md` blijft de dragende bron voor de siteniveau-toets; die is daar al geopend en gecontroleerd en wordt hier niet opnieuw gelogd.

### Deelvraag 17 — Claims

| Code | Zoekterm | Link | Type | Status |
|---|---|---|---|---|
| DV17-01 | geconsolideerde tekst Verordening 432/2012 Nederlands, via het Publicatiebureau | https://publications.europa.eu/resource/celex/02012R0432-20210517 | A | opgehaald — volledige bijlage in het Nederlands, 217 claimregels |
| DV17-02 | EU-register van voedings- en gezondheidsclaims | https://ec.europa.eu/food/food-feed-portal/screen/health-claims/eu-register | A | bereikbaar (200), maar het is een JavaScript-toepassing waarvan de inhoud niet als tekst uit te lezen is; als controlemiddel hier niet bruikbaar |
| DV17-03 | EUR-Lex CELEX 32012R0432 en 02012R0432-20210517 | https://eur-lex.europa.eu/legal-content/NL/TXT/HTML/?uri=CELEX:02012R0432-20210517 | A | **onbruikbaar voor geautomatiseerd ophalen** — geeft herhaald HTTP 202 met een lege pagina. Het document bestaat; alleen deze toegangsweg werkt niet. Vandaar DV17-01 als vindplaats |

---

## 3. Tegenspraak

### 3a. Getest: "een betaald account levert hogere resolutie"

Dit stond als aanname in `scripts/genereer-beeld.mjs` en was de reden om de hele reeks opnieuw te genereren. De tegenproef is de meting zelf: DV15-02 weerlegt hem. Met token is er 84 keer om 1920×1080 gevraagd en 84 keer 1024×576 teruggekomen — geen enkele uitzondering. Een token geeft wel een ruimer aanvraagtempo, maar dat is iets anders dan resolutie.

De aanname is dus onjuist gebleken en de code en documentatie zijn erop aangepast. Dit is precies waarom het opschrijven van een meting bruikbaarder is dan het opschrijven van een verwachting.

### 3b. Getest: "de twee sporen kunnen zonder meer naast elkaar bestaan"

Actief gezocht naar de tegenwerping dat een commercieel voedingsartikel de rest van de site besmet. Die tegenwerping houdt stand, en dat is de belangrijkste uitkomst van dit bestand.

DV8-03 formuleert het verbod op siteniveau, niet op paginaniveau: een website waarop een levensmiddel wordt aangeprezen, mag niet ergens ánders op die site medische informatie over diezelfde waar bevatten. Twee pagina's die elk op zichzelf kloppen, kunnen de site als geheel dus alsnog in overtreding brengen.

Het model is daarmee niet verworpen maar begrensd: het werkt alleen als de onderwerpen van beide sporen elkaar niet overlappen. Zie 4.3.

### 3c. Getest: "de bewoordingen in toegestane-claims.json zijn overgenomen uit de verordening en kloppen dus"

Weerlegd, en niet marginaal. Van de zestien claims bleken er twaalf niet letterlijk te kloppen, en van de zes darmclaims vijf. Zie 4.4.

Dit is een geval waarin de tegenspraak-stap zijn nut bewijst: het bestand droeg zelf de waarschuwing dat het nog niet nageslagen was, en die waarschuwing bleek terecht.

### 3d. Getest: "geen enkel gezicht" kost te veel aan herkenbaarheid

`06` par. 4.2 stelde vast dat een gezicht in beeld geen aantoonbaar voordeel oplevert en dat een pseudo-realistisch AI-portret van de persona bovendien botst met de eerlijkheidsregel uit `CLAUDE.md`. `HERZIENING.md` par. 1 scherpt dat aan tot een volledig verbod op gezichten.

Gezocht naar tegenspraak: is er reden om aan te nemen dat een site zonder enig gezicht als kouder of minder betrouwbaar wordt ervaren? De bronnen uit `06` (DV11-01 t/m DV11-03) gaan over de aandacht die een gezicht trékt, niet over vertrouwen dat het opbouwt, en DV12 in `06` wees vertrouwen juist toe aan redactionele signalen: bronvermelding, transparantie over werkwijze, afwezigheid van verkoopdruk. Er is dus geen bron gevonden die het verbod ondergraaft, en de bestaande bronnen wijzen de andere kant op.

---

## 4. Conclusies en bouwbeslissingen

### 4.1 Beeld: fotografie vervangt de illustraties volledig (uit deelvraag 15)

Dit is de paragraaf waarnaar `src/components/Beeld.astro` en `src/content.config.ts` verwijzen.

- De zelf gegenereerde SVG-illustraties zijn verwijderd, niet behouden als terugval. Een terugval die er nooit hetzelfde uitziet als de rest, levert een tweede beeldtaal op — precies de inconsistentie die in `HERZIENING.md` par. 1 als aanleiding werd genoemd.
- Omdat er geen terugval meer is, is `afbeelding` in het schema **verplicht** geworden. Zonder terugval moet een vergeten beeld een bouwfout opleveren en geen gat op de pagina.
- Eén vaste stijlzin voor alle beelden, vastgelegd in `genereer-beeld.mjs` en niet per artikel gevarieerd. Een eerdere opzet liet de prompt meebewegen met het `accent`-veld, waardoor de reeks in vier kleurfamilies uiteenviel. Het accent is een teken in de opmaak; het beeld blijft neutraal.
- Elk artikel krijgt drie beelden: één boven het artikel en op de kaart, twee in de lopende tekst. Dat aantal wordt afgedwongen door `check-compliance.mjs` (regel 8b) en is daarmee een eigenschap van de site in plaats van iets wat de schrijver moet onthouden.
- Beeld toont altijd een concreet ding uit het artikel — de grondstof, de bereiding, de textuur — en nooit het beloofde effect. Dezelfde regel als voor de tekst: niets afbeelden wat niet geclaimd mag worden.
- Geen gezichten, conform `HERZIENING.md` par. 1 en par. 3d hierboven.

### 4.2 Resolutie: een token verhoogt hem niet (uit deelvraag 15)

Pollinations levert ongeveer 0,6 megapixel, ongeacht wat er gevraagd wordt en ongeacht of er een token meegestuurd wordt (DV15-01, DV15-02). Elk beeld wordt daarom na het ophalen lokaal 2× opgeschaald met Lanczos3 en een milde unsharp mask. Dat voegt geen detail toe, maar voorkomt dat de browser zelf moet interpoleren en geeft Astro genoeg pixels voor nette WebP-varianten.

`src/assets/HERKOMST.md` legt per beeld vast wat er gevraagd is en wat eruit kwam, zodat deze beperking navolgbaar blijft en niet als "hoge resolutie" de documentatie in sluipt.

### 4.3 De voedingspijler in twee sporen (uit deelvraag 16)

Dit is de paragraaf waarnaar `src/content.config.ts` verwijst.

De pijler kent precies twee toegestane sporen en niets ertussenin:

| | `productType` | `affiliate` | mag naar onderzoek verwijzen |
|---|---|---|---|
| wetenschap | `geen` | `false` | ja |
| commercieel | `voeding-supplement` | mag `true` | **nee** |

De grond is DV8-03: op een pagina die een levensmiddel aanprijst, geldt een verwijzing naar wetenschappelijke of medische publicaties zélf als ontoelaatbare medische claim. Door in het wetenschapsspoor niets te verkopen, mogen die artikelen wél vrij naar onderzoek linken.

Drie beslissingen die daaruit volgen:

1. **Het gevaarlijke pad faalt hard.** Zet iemand `voeding-supplement` op een bestaand wetenschapsartikel, dan worden al zijn onderzoeksverwijzingen onmiddellijk bouwfouten. Dat is bedoeld gedrag.
2. **De onderzoeksverwijzingsregel is niet met `taalUitzonderingen` te overrulen.** De overige taalregels gaan over het beschríjven van verboden taal; deze gaat over een structureel verbod. De ontsnappingsklep is het juiste spoor kiezen, niet een uitzondering aanvragen.
3. **Er is een siteniveau-toets nodig, want par. 3b liet zien dat losse pagina's niet volstaan.** `check-compliance.mjs` houdt daarom per tag bij welke artikelen een levensmiddel aanprijzen en welke naar medische bronnen verwijzen, en weigert de build bij overlap. Tags zijn het enige onderwerp dat elk artikel zelf declareert en daarmee de bruikbaarste sleutel.

Praktisch gevolg voor de contentplanning: een commercieel voedingsartikel mag geen onderwerp krijgen waarover elders op de site met onderzoeksverwijzingen geschreven wordt. Daarom is voor het commerciële spoor bewust vitamine E gekozen en niet vitamine C — over vitamine C staat er al een artikel met onderzoekslinks.

### 4.4 De claimverificatie (uit deelvraag 17)

`data/toegestane-claims.json` stond op `geverifieerd: false` met de aantekening dat de bewoordingen nog niet in het register zelf waren nageslagen. Dat is nu gedaan tegen DV17-01. Uitkomst: **twaalf van de zestien claims en vijf van de zes darmclaims klopten niet letterlijk.**

Het patroon is systematisch en niet toevallig:

| Stond er | Verordening |
|---|---|
| "draagt bij tot het behoud van…" | "draagt bij tot de instandhouding van…" |
| "Selenium…" | "Seleen…" |
| "Gerstekorrelvezels…" | "Gerstkorrelvezels…" |
| "Havervezels…" | "Haverkorrelvezels…" |
| "…een toename van de fecale massa" | "…een vergroting van de fecale bulk" |
| "…een versnelling van de darmpassage" | "…een snellere darmpassage" |

Omdat artikel 13 van Verordening 1924/2006 uitsluitend de vastgestelde bewoording toestaat, is elke parafrase een niet-toegestane claim. Alle bewoordingen zijn gecorrigeerd, `geverifieerd` staat op `true`, en de vier claims die in `src/data/eetritme.ts` in de oude formulering stonden zijn meegecorrigeerd.

Eén detail is met opzet overgenomen zoals het er staat: bij biotine en huid schrijft de verordening "de instandhouding van normale huid" zonder lidwoord, terwijl bij niacine, riboflavine, vitamine A, zink en jodium wel "een normale huid" staat. Dat oogt als een zetfout in de verordening, maar de bewoording is wat hij is.

---

## 5. Samenvatting

- Een Pollinations-token verhoogt de resolutie niet; dat is gemeten en niet aangenomen. Alle beelden worden lokaal opgeschaald en `HERKOMST.md` legt dat per beeld vast.
- De SVG-illustraties zijn volledig vervangen door fotografie in één vaste stijl, zonder terugval, waardoor `afbeelding` verplicht kon worden.
- De tweede pijler kan commerciële content dragen, maar alleen in twee strikt gescheiden sporen én met een toets op siteniveau — losse correcte pagina's zijn niet genoeg.
- De lijst met toegestane claims bleek grotendeels geparafraseerd in plaats van geciteerd; dat is rechtgezet tegen de geconsolideerde verordening.
