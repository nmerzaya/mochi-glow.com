# Bronnen voor de eerste contentbatch — onderzoek

Aanvullend op `01-bronnen.md`. Dit bestand logt de bronnen die zijn gebruikt voor de artikelen
in `src/content/`, volgens dezelfde methode: eerst loggen, dan openen en verifiëren, en pas
daarna gebruiken. Bestaande onderzoeksbestanden zijn hiervoor niet aangepast.

**Raadpleegdatum voor alle bronnen hieronder: 10 augustus 2026.**

Type: **A** = primair/officieel · **B** = secundair/vakmedia of peer-reviewed onderzoek · **C** = tertiair.

## 1. Darm-huid (pijler 2)

| Code | Bron | Type | Status |
|---|---|---|---|
| GS-01 | O'Neill CA, Monteleone G, McLaughlin JT, Paus R. *The gut-skin axis in health and disease: A paradigm with therapeutic implications.* BioEssays 2016;38(11). <https://pubmed.ncbi.nlm.nih.gov/27554239/> | B | bruikbaar |
| GS-02 | Widhiati S, Purnomosari D, Wibawa T, Soebono H. *The role of gut microbiome in inflammatory skin disorders: A systematic review.* Dermatology Reports 2022. <https://pmc.ncbi.nlm.nih.gov/articles/PMC8969879/> | B | bruikbaar |
| GS-03 | Sánchez-Pellicer P, Navarro-Moratalla L, Núñez-Delegido E, Ruzafa-Costas B, Agüera-Santos J, Navarro-López V. *Acne, Microbiome, and Probiotics: The Gut-Skin Axis.* Microorganisms 2022. <https://pubmed.ncbi.nlm.nih.gov/35889022/> | B | bruikbaar |
| GS-04 | EFSA. *EFSA finalises the assessment of 'general function' health claims* (persbericht, 28 juli 2011). <https://www.efsa.europa.eu/en/press/news/110728> | A | bruikbaar |

**Zoektermen:** "gut-skin axis review PubMed microbiome dermatology"; "EFSA probiotic health claim not authorised gut microbiota opinion".

**Verificatienotities**

- GS-01 geopend: titel, auteurs, tijdschrift en jaar komen overeen. Behandelt darm en huid als
  interface-organen; noemt expliciet dat metabolieten uit voeding of microbiota de huid kunnen
  bereiken. Geschikt als algemene onderbouwing van het begrip darm-huid-as.
- GS-02 geopend: systematische review over acne, psoriasis, atopische dermatitis en urticaria.
  Belangrijk voor de eerlijkheid van onze artikelen zijn de door de auteurs zelf genoemde
  beperkingen: weinig studies per aandoening (4 over acne, 3 over psoriasis), heterogene populaties
  en methodes, en tegenstrijdige bevindingen bij atopische dermatitis. Die beperkingen moeten in de
  artikelen terugkomen, niet alleen de uitkomsten.
- GS-03 geopend: review over acne en microbiota. De auteurs noemen orale probiotica veelbelovend,
  maar stellen zelf vast dat het klinische onderzoek beperkt is. Alleen bruikbaar mét die nuance.
- GS-04 geopend: bevestigt dat claims over "probiotica" zijn afgewezen, onder meer omdat de
  claims niet aangaven om welk specifiek micro-organisme het ging. Dit is de directe onderbouwing
  van de regel in `check-compliance.mjs` dat er geen toegestane probioticaclaim bestaat.

## 2. Ingrediënten (pijler 1)

| Code | Bron | Type | Status |
|---|---|---|---|
| IN-01 | Anjum SI et al. *Composition and functional properties of propolis (bee glue): A review.* Saudi Journal of Biological Sciences 2019;26(7):1695-1703. <https://pubmed.ncbi.nlm.nih.gov/31762646/> | B | bruikbaar |
| IN-02 | Zamil DH, Khan RM, Braun TL, Nawas ZY. *Dermatological uses of rice products: Trend or true?* Journal of Cosmetic Dermatology 2022;21(11). <https://pubmed.ncbi.nlm.nih.gov/35587098/> | B | bruikbaar, mét kanttekening |
| IN-03 | Wartewig S, Neubert RHH. *Properties of ceramides and their impact on the stratum corneum structure: a review. Part 1: ceramides.* Skin Pharmacology and Physiology 2007. <https://pubmed.ncbi.nlm.nih.gov/17587886/> | B | bruikbaar |
| IN-04 | Galeano M, Pallio G, Irrera N et al. *Polydeoxyribonucleotide: A Promising Biological Platform to Accelerate Impaired Skin Wound Healing.* Pharmaceuticals (Basel) 2021;14(11):1103. <https://pmc.ncbi.nlm.nih.gov/articles/PMC8618295/> | B | bruikbaar, mét kanttekening |
| IN-05 | Miyamoto K, Inoue Y, Yan X, Yagi S, Suda S, Furue M. *Significant Reversal of Facial Wrinkle, Pigmented Spot and Roughness by Daily Application of Galactomyces Ferment Filtrate-Containing Skin Products for 12 Months.* Journal of Clinical Medicine 2023. <https://pmc.ncbi.nlm.nih.gov/articles/PMC9917576/> | B | bruikbaar, alléén mét vermelding van belangenverstrengeling |
| IN-06 | Vasques LI, Vendruscolo CW, Leonardi GR. *Topical Application of Ascorbic Acid and its Derivatives: A Review Considering Clinical Trials.* Current Medicinal Chemistry 2023. <https://pubmed.ncbi.nlm.nih.gov/36200216/> | B | bruikbaar |
| IN-07 | PubChem — *Ascorbic acid*, stofinformatie. <https://pubchem.ncbi.nlm.nih.gov/compound/Ascorbic-acid> | A | bruikbaar |

**Zoektermen:** "polydeoxyribonucleotide PDRN skin review"; "ceramides stratum corneum skin barrier review";
"propolis composition biological properties review"; "rice bran extract ferment cosmetic skin";
"Galactomyces ferment filtrate skin study"; "topical vitamin C ascorbic acid skin stability review".

**Verificatienotities**

- IN-01 geopend: bevestigt meer dan 300 verbindingen in propolis en — belangrijker voor ons — dat de
  samenstelling sterk varieert per plantenbron, streek en seizoen. Dat is precies het punt dat een
  eerlijk artikel over propolis moet maken.
- IN-02 geopend: literatuuroverzicht, geen origineel onderzoek. De auteurs presenteren de bevindingen
  overwegend positief en geven geen kritische weging van de bewijskwaliteit. Bruikbaar, maar het
  artikel moet dat expliciet benoemen in plaats van de conclusies over te nemen.
- IN-03 geopend: bevestigt dat ceramiden negen subklassen kennen en de belangrijkste lipideklasse in
  de hoornlaag vormen. Solide, technisch, niet-commercieel.
- IN-04 geopend: **cruciale kanttekening.** PDRN wordt in deze publicatie beschreven als een van
  zalmsperma afgeleid geneesmiddel, en het klinische bewijs komt vooral uit injecties, niet uit
  cosmetische toepassing op de huid. Een artikel mag dat bewijs dus niet presenteren alsof het over
  een serum gaat.
- IN-05 geopend: **belangenverstrengeling.** Vijf van de zes auteurs zijn werknemers van Procter &
  Gamble, de vijfde is consultant; het onderzoek betreft producten van hun eigen merk. De studie mag
  alleen genoemd worden mét die vermelding.
- IN-06 geopend: bevestigt de instabiliteit van ascorbinezuur en, belangrijk, dat het onderzoek naar
  derivaten grotendeels in vitro is en dat in-vivostudies sterk uiteenlopen in opzet.
- IN-07 geopend: stofpagina voor ascorbinezuur, formule C6H8O6. Alleen gebruikt voor de
  stofidentiteit, niet voor werkingsclaims. Het CID-nummer is bewust niet overgenomen, omdat de
  automatische uitlezing daarvan niet betrouwbaar te bevestigen was.

## 3. Gelogd maar niet als inhoudelijke bron gebruikt

| Code | Bron | Reden |
|---|---|---|
| ON-01 | CosIng — EU-databank cosmetische ingrediënten. <https://ec.europa.eu/growth/tools-databases/cosing/> | Pagina bestaat, maar is een JavaScript-portaal waarvan de inhoud niet uit te lezen viel. Alleen bruikbaar als verwijzing naar de databank als geheel, niet als bron voor een specifieke bewering. |
| ON-02 | EU-register van voedings- en gezondheidsclaims. <https://ec.europa.eu/food/food-feed-portal/screen/health-claims/eu-register> | Idem: bestaat, inhoud niet verifieerbaar via ophalen. Voor het verifiëren van `data/toegestane-claims.json` moet dit register handmatig in een browser worden nagelopen. |
| ON-03 | EUR-Lex, Verordening 655/2013, NL-versie via `legal-content/NL/TXT`. | Leverde bij ophalen een lege pagina op. Voor verwijzingen naar EU-wetgeving wordt daarom de `ALL`-variant van de EUR-Lex-URL gebruikt, zoals in de bestaande artikelen. |

Deze drie zijn bewust gelogd in plaats van weggelaten: dat een officiële databank niet
machinaal te controleren is, is zelf een bevinding, en voorkomt dat een latere sessie denkt
dat ze over het hoofd zijn gezien.

## 4. Wat dit betekent voor de artikelen

1. Geen enkel ingrediëntartikel mag de werkingsclaims uit deze bronnen overnemen: het zijn
   publicaties over farmacologisch of medisch onderzoek, terwijl de artikelen over cosmetica gaan.
   De bronnen onderbouwen wát een stof is en wat er onderzocht is — niet wat een product doet.
2. Waar een bron een belang heeft (IN-05) of een andere toedieningsvorm betreft dan waar het
   artikel over gaat (IN-04), moet dat in de lopende tekst staan, niet alleen in de bronnenlijst.
3. GS-04 is de onderbouwing voor het volledig ontbreken van toegestane probioticaclaims. Dat is
   geen voorzichtigheid van deze site maar geldend recht.
