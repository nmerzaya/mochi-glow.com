# Tegenspraak

Bijlage bij `00-vraagstelling.md` en `01-bronnen.md`. Voor elke deelvraag is expliciet gezocht naar bronnen die de tot dusver opgebouwde lijn (op basis van de bronnen in `01-bronnen.md`) onderuithalen. Waar niets bruikbaars is gevonden, staat dat met zoekterm en reden vermeld. Geen synthese van de hoofdvraag als geheel — puur tegenbewijs per deelvraag, met dezelfde velden als in `01-bronnen.md` (code, zoekterm, link, type, raadpleegdatum, status) plus een korte omschrijving van wát het tegenspreekt.

Type-classificatie en statuslegenda: zie `01-bronnen.md`. Raadpleegdatum voor alle onderstaande bronnen: **2026-08-10**, tenzij anders vermeld.

---

## Deelvraag 1 — Content & niche-afbakening

### 1a. Getest: "K-beauty is een groeiende, levensvatbare niche"

**Zoekterm:** "K-beauty market oversaturated declining trend backlash 2026"

**Resultaat: geen tegenspraak gevonden.** De gevonden bronnen (Future Market Insights, Grand View Research, Straits Research — marktrapporten) wijzen allemaal op voortgezette marktgroei (10% CAGR, markt van $129 mrd in 2026 naar $252 mrd in 2033) in plaats van krimp. Wel wordt "verzadiging" en "maturatie" genoemd (het label "K-beauty" alleen is minder onderscheidend dan voorheen, meer concurrentie om vroeg goede merken te herkennen), maar dat is een nuance op groei, geen krimp of backlash. Ik heb geen artikelen gevonden die stellen dat de markt daadwerkelijk daalt of dat consumenten zich actief afkeren van K-beauty. Reden om te stoppen met zoeken: meerdere onafhankelijke marktonderzoeksbureaus (drie verschillende bronnen, geen onderlinge overlap qua uitgever) komen tot dezelfde richting (groei), wat de kans klein maakt dat een tegengestelde, goed onderbouwde bron over het hoofd is gezien.

### 1b. Getest: "gut-skin axis is een geschikte, gezaghebbende contentpijler"

| Code | Zoekterm | Link | Type | Status | Wat het tegenspreekt |
|---|---|---|---|---|---|
| TS-DV1-02 | gut skin axis pseudoscience criticism lack of evidence dermatologist skeptical | https://www.mdpi.com/2079-9284/12/4/167 | A | opgehaald | Peer-reviewed review stelt dat bewijs voor de gut-skin axis grotendeels preliminair is, gebaseerd op kleine steekproeven en preklinische modellen — ondermijnt het idee dat hier stellige, autoritaire claims over te schrijven zijn. |
| TS-DV1-03 | gut skin axis pseudoscience criticism lack of evidence dermatologist skeptical | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12654813/ | A | opgehaald | Systematische review/meta-analyse concludeert dat heterogeniteit tussen studies, beperkte follow-up en inconsistente rapportage vaste klinische aanbevelingen in de weg staan. |

**Duiding:** dit weerlegt niet dat de gut-skin axis bestaat (dat wordt breed erkend), maar wél dat de wetenschap "af" genoeg is om er zelfverzekerde, specifieke gezondheidsclaims op te baseren. Dit versterkt het risico dat al in deelvraag 4 was geïdentificeerd (EFSA/gezondheidsclaims) en is dus geen nieuw risico, maar bevestigt vanuit een andere hoek dat contentmatig voorzichtigheid geboden is.

## Deelvraag 2 — Techniek & stack

### Getest: "een volledig gratis open source stack (Decap CMS + Cloudflare Pages/Netlify/GitHub Pages) is voldoende voor dit project"

| Code | Zoekterm | Link | Type | Status | Wat het tegenspreekt |
|---|---|---|---|---|---|
| TS-DV2-01 | Decap CMS problems limitations issues complaints 2026 | https://advisories.gitlab.com/pkg/npm/decap-cms | A | opgehaald | Officieel beveiligingsadvies (CVE-2025-57520): Decap CMS ≤3.8.3 kent een opgeslagen XSS-kwetsbaarheid in het preview-paneel, waarmee een laagbevoegde auteur schadelijke JavaScript kan laten uitvoeren bij een reviewer — reëel beveiligingsrisico bij een open, gratis CMS zonder professionele support. |
| TS-DV2-02 | Decap CMS problems limitations issues complaints 2026 | https://github.com/decaporg/decap-cms/issues | A | opgehaald | Open issues-tracker bevestigt lopende, onopgeloste problemen; ontwikkeling is vertraagd sinds Netlify het project in 2023 aan de community overdroeg. |
| TS-DV2-03 | Decap CMS problems limitations issues complaints 2026 | https://www.luckymedia.dev/insights/decap-cms | C | opgehaald | Review noemt concrete functionele beperkingen: geen geplande publicatie ("scheduling"), geen mobiele/responsieve interface, YAML-configuratie wordt onhandelbaar bij complexere datamodellen. |
| TS-DV2-04 | Cloudflare Pages Netlify free tier limits build minutes bandwidth problems complaints | https://rubabsdigital.com/blog/cloudflare-pages-free-tier-limits | C | opgehaald | Beschrijft harde limieten op de gratis lagen: Netlify 300 build-minuten/maand en 100GB bandbreedte per maand met dure overschrijdingskosten; Cloudflare Pages slechts 1 gelijktijdige build, met wachtrijen bij meerdere branches. |

**Duiding:** dit weerlegt niet dat een gratis stack werkt om te starten, maar wel dat die stack zonder haken en ogen is — er is een reëel (zij het laagdrempelig te patchen/updaten) beveiligingsrisico, en de gratis lagen hebben harde technische plafonds die relevant worden zodra de site groeit of vaker gepubliceerd wordt.

## Deelvraag 3 — Monetisatie

### Getest: "affiliate-programma's zijn toegankelijk voor een nieuwe site zonder trackrecord, en AdSense-goedkeuring/inkomsten zijn realistisch haalbaar"

| Code | Zoekterm | Link | Type | Status | Wat het tegenspreekt |
|---|---|---|---|---|---|
| TS-DV3-01 | Awin Amazon Associates affiliate application rejected new website denied experience | https://medium.com/@guohuang/how-we-got-rejected-from-amazon-affiliate-program-e0cc067f12b8 | C | opgehaald — let op: artikel dateert uit 2017, niet 2026, maar de aangehaalde afwijzingsredenen komen woordelijk overeen met de huidige officiële Amazon-voorwaarden (zie DV3-10) en zijn dus nog steeds relevant | Concreet praktijkvoorbeeld: site met 16 succesvolle orders werd ondanks omzet alsnog afgewezen wegens onvoldoende originele content, én Amazon beoordeelt een afgewezen aanvraag nooit opnieuw — je moet volledig opnieuw solliciteren. Dit weerspreekt het beeld dat toetreding tot Amazon Associates voor een nieuwe site een formaliteit is. |
| TS-DV3-02 | Awin Amazon Associates affiliate application rejected new website denied experience | https://www.warriorforum.com/main-internet-marketing-discussion-forum/913294-amazon-associate-application-denied-any-advice.html | C | opgehaald | Forumdiscussie met meerdere gebruikers die vergelijkbare afwijzingen melden, wat erop wijst dat dit geen incident is maar een terugkerend patroon. |
| TS-DV3-03 | AdSense rejected new blog denied low quality reasons experience forum | https://support.google.com/adsense/community-guide/241032356/how-can-you-solve-the-low-value-content-adsense-disapproval-challenge?hl=en | A | opgehaald | Officiële Google AdSense-communitygids erkent dat "low value content" een vage catch-all-afwijzing is voor nieuwe sites, vaak los van daadwerkelijke inhoudskwaliteit, en dat Google circa 3–6 maanden sitegeschiedenis wil zien voordat het vertrouwen opbouwt — dit relativeert de eerdere bevinding dat traffic geen vereiste is voor AdSense: site-leeftijd/trackrecord blijkt in de praktijk wél een drempel. |
| TS-DV3-04 | AdSense rejected new blog denied low quality reasons experience forum | https://toolpod.dev/blog/adsense-rejection-low-value-content | C | opgehaald | Persoonlijk verslag van afwijzing wegens "low value content" ondanks eigen inschatting van voldoende kwaliteit — illustreert de onvoorspelbaarheid van de beoordeling. |

**Duiding:** dit weerlegt niet dat affiliate-programma's en AdSense uiteindelijk toegankelijk zijn, maar wel het impliciete beeld dat toetreding grotendeels een kwestie van aanmelden is. In de praktijk is er een reëel afwijzingsrisico bij onvoldoende trackrecord/content, met (bij Amazon) geen mogelijkheid tot beroep — wat betekent dat de eerste aanvraag pas gedaan moet worden als de site al een stevige basis heeft, niet meteen bij launch.

## Deelvraag 4 — Legal & compliance

### Getest: "handhaving van reclame-disclosureregels is vooral publieke afkeuring/reputatieschade; de RCC zelf kan geen boetes opleggen"

| Code | Zoekterm | Link | Type | Status | Wat het tegenspreekt |
|---|---|---|---|---|---|
| TS-DV4-01 | Reclame Code Commissie boete overtreding affiliate influencer handhaving 2026 | https://www.npo3fm.nl/nieuws/3fm-nieuws/cf7a19fb-6724-4ad5-ae1b-77d10f8ae1bd/eerste-boete-voor-influencer-wegens-overtreding-van-de-reclame-code | B | opgehaald — let op: artikel dateert van 23 juli **2024**, niet 2026, dus van vóór de aangescherpte regels per 1 juli 2026 | Meldt een daadwerkelijke geldboete van €6.000 voor een influencer wegens sluikreclame (niet-vermelde betaalde samenwerking), met de verwachting dat dit vaker gaat gebeuren. Dit nuanceert de eerdere bevinding (uit `01-bronnen.md`, DV4-01/02) dat handhaving vooral bestaat uit publieke afkeuring door de RCC: er blijkt al vóór 2026 een precedent van een reële boete te zijn, wat het risico groter maakt dan "alleen reputatieschade". |
| TS-DV4-02 | Reclame Code Commissie boete overtreding affiliate influencer handhaving 2026 | https://bureaubrandeis.com/update-recente-uitspraken-reclame-code-commissie-juni-2026/ | B | opgehaald | Bevestigt dat naast de RCC ook de ACM (boetebevoegd) en het Commissariaat voor de Media (boetebevoegd bij grotere influencers) toezicht houden, en dat adverteerders actief verantwoordelijk gehouden worden voor het gedrag van influencers/affiliates die zij inschakelen — breder handhavingslandschap dan alleen de RCC. |

**Duiding:** de eerdere bronnen suggereerden dat de RCC zelf geen boetes oplegt (correct — dat doen ACM/CvdM), maar de framing dat het risico daardoor vooral reputationeel is, wordt genuanceerd: er zijn reële geldboetes uitgedeeld door andere toezichthouders, en de verwachting is dat dit toeneemt.

## Deelvraag 5 — Vindbaarheid onder AI Overviews

### Getest: "Pinterest is een betrouwbare alternatieve verkeersbron om minder afhankelijk te zijn van Google/AI Overviews"

| Code | Zoekterm | Link | Type | Status | Wat het tegenspreekt |
|---|---|---|---|---|---|
| TS-DV5-01 | Pinterest traffic declining affiliate marketers algorithm change 2026 complaints | https://community.pinterest.biz/t/massive-pinterest-traffic-drop-still-continuing-we-need-urgent-help/45853 | B | opgehaald | Officieel Pinterest-communityforum: tientallen makers melden vanaf mei 2026 plotselinge, aanhoudende dalingen van 70–90% in impressies/kliks, bevestigd door een Pinterest-medewerker als "ongewoon", zonder dat er weken later herstel is. Een officiële reactie van Pinterest wijst het toe aan "normale schommelingen", wat door meerdere gebruikers als onbevredigend wordt ervaren. |
| TS-DV5-02 | Pinterest traffic declining affiliate marketers algorithm change 2026 complaints | https://medium.com/@thevinayakramesh/pinterest-traffic-dropped-70-9d866e877e6c | C | opgehaald | Individueel verslag van 70% trafficverlies binnen enkele weken na platformwijzigingen in 2026. |

**Duiding:** dit weerspreekt niet dat Pinterest in theorie een aanvullend kanaal kan zijn, maar wel het idee dat het een stabiele, betrouwbare uitwijkmogelijkheid is nu Google-verkeer onder druk staat door AI Overviews. Pinterest blijkt zelf onderhevig aan grote, onvoorspelbare algoritmewijzigingen — het risico wordt dus deels verplaatst, niet weggenomen.

---

## Samenvatting

Voor 4 van de 5 deelvragen is bruikbare tegenspraak gevonden die een nuance of risico toevoegt aan de tot dusver verzamelde bronnen (gut-skin-wetenschap is prilder dan gesuggereerd, de gratis techstack heeft reële technische/beveiligingsbeperkingen, affiliate-/AdSense-toetreding kent een reëel afwijzingsrisico zonder beroepsmogelijkheid, handhaving van reclameregels omvat inmiddels ook echte boetes, en Pinterest als uitwijkkanaal is zelf volatiel). Voor het onderdeel "is K-beauty een groeiende niche" is expliciet gezocht maar geen tegenspraak gevonden — meerdere onafhankelijke marktrapporten wijzen consistent op groei, niet op krimp of backlash.
