# Aandacht, vertrouwen en klikgedrag — onderzoek ten behoeve van de merkherziening

Negende onderzoeksbestand, volgens de methode uit `CLAUDE.md`. Aanleiding: de opdracht om uit te zoeken wat het gedrag van de doelgroep stuurt — waar ze kijken, wat ze vertrouwen, en waardoor ze klikken — en dat om te zetten in bouwbeslissingen.

`onderzoek/08` beschrijft de markt en de koper. Dit bestand beschrijft het gedrag. Codes lopen door vanaf `DV22`.

---

## 1. Vraagstelling

### Hoofdvraag

Welke ontwerpbeslissingen sturen aantoonbaar de aandacht, het vertrouwen en het klikgedrag van de lezer, en welke gangbare "conversietechnieken" moeten hier juist vermeden worden?

### Deelvragen

22. **Vertrouwen.** Waarop baseert een bezoeker zijn oordeel over de betrouwbaarheid van een site, en in welke volgorde?
23. **Aandacht.** Hoe wordt een pagina daadwerkelijk gelezen, en wat volgt daaruit voor opmaak?
24. **Klikgedrag.** Wat bepaalt of iemand een link volgt?
25. **Grenzen.** Welke beïnvloedingstechnieken zijn juridisch verboden of in deze context contraproductief?

### Buiten scope

- A/B-testen op de eigen site: er is geen verkeer en geen analytics.
- Kleurpsychologie als grondslag voor een paletkeuze — in `onderzoek/06` par. 4.1 al onderzocht en als onbruikbaar afgevoerd. Dat resultaat wordt hier niet opnieuw ter discussie gesteld.

### Wanneer is dit onderzoek af

Zodra per deelvraag vaststaat welke uitspraak door een geopende bron gedragen wordt, en daaruit een concrete lijst bouwbeslissingen volgt.

---

## 2. Bronnenlog

**Raadpleegdatum voor alle onderstaande bronnen: 2026-08-12.**

| Code | Bron | Link | Type | Status |
|---|---|---|---|---|
| DV22-01 | NN/g — Trustworthiness in Web Design: 4 Credibility Factors | https://www.nngroup.com/articles/trustworthy-design/ | B | opgehaald |
| DV22-02 | NN/g — Trust or Bust: Communicating Trustworthiness in Web Design | https://www.nngroup.com/articles/communicating-trustworthiness/ | B | opgehaald |
| DV22-03 | NN/g — Trust and Credibility: Ecommerce UX (rapport) | https://www.nngroup.com/reports/ecommerce-ux-trust-and-credibility/ | B | opgehaald |
| DV23-01 | NN/g — F-Shaped Pattern For Reading Web Content (origineel eyetracking-onderzoek, 232 deelnemers) | https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/ | B | opgehaald — eigen empirisch onderzoek, daarom zwaarder wegend dan vakcommentaar |
| DV23-02 | NN/g — Website Reading: It (Sometimes) Does Happen | https://www.nngroup.com/articles/website-reading/ | B | opgehaald — de nuancering op DV23-01 |
| DV24-01 | UX Tigers (Jakob Nielsen) — Information Scent: How Users Decide Where to Click | https://www.uxtigers.com/post/information-scent | B | opgehaald |
| DV25-01 | Europees Parlement — Regulating dark patterns in the EU: Towards digital fairness | https://www.europarl.europa.eu/RegData/etudes/ATAG/2025/767191/EPRS_ATA(2025)767191_EN.pdf | A | opgehaald |
| DV25-02 | Verordening (EU) 2022/2065 (Digital Services Act), artikel 25 — via toelichting Schoenherr | https://www.schoenherr.eu/content/dark-patterns-are-everywhere-and-the-authorities-know-about-it | A/B | opgehaald — de verordening is A, de toelichting B |

---

## 3. Tegenspraak

### 3a. Getest: "het F-patroon is een wet en je moet ernaar ontwerpen"

Genuanceerd, en de nuancering komt van de onderzoekers zelf. NN/g publiceerde het F-patroon (DV23-01) en publiceerde later expliciet dat lezen wél degelijk gebeurt (DV23-02). Het F-patroon is wat mensen doen bij **slecht opgemaakte tekst zonder houvast** — het is een symptoom van een pagina die niet helpt, geen natuurwet.

Dat draait de conclusie om: het doel is niet ontwerpen *voor* het F-patroon, maar de pagina zo opmaken dat scannen niet nodig is. Tussenkoppen, korte alinea's en een duidelijke hiërarchie geven de lezer ankers, waardoor hij daadwerkelijk leest. Dit is precies wat een lange onderzoekstekst nodig heeft.

### 3b. Getest: "mooi ontwerp is subjectief en dus geen serieuze commerciële factor"

Weerlegd. In onderzoek waarin respondenten factoren moesten wegen die een site betrouwbaar doen lijken, kwam **visuele vormgeving op de eerste plaats — boven de inhoud zelf en boven aanbevelingen** (DV22-02).

Dat is contra-intuïtief en ongemakkelijk voor een site die op inhoud drijft, maar het is het mechanisme: de bezoeker beoordeelt de vormgeving in een oogopslag en beslist op basis daarvan of hij de inhoud überhaupt serieus neemt. Vormgeving is de toegangspoort tot de geloofwaardigheid van de tekst, niet een laagje eroverheen.

### 3c. Getest: "urgentie en schaarste verhogen de conversie"

In algemene zin is er commerciële literatuur die dit ondersteunt. In deze context is het om twee onafhankelijke redenen onbruikbaar, en beide zijn hard.

**Juridisch.** Artikel 25 van de Digital Services Act verbiedt sinds 17 februari 2024 expliciet ontwerppatronen die "het vermogen van afnemers om autonome en geïnformeerde keuzes te maken wezenlijk verstoren of belemmeren" (DV25-01, DV25-02). Nagemaakte afteltimers en onware voorraadmeldingen worden daarbij met zoveel woorden genoemd. Hetzelfde geldt onder Richtlijn 2005/29/EG over oneerlijke handelspraktijken. Boetes lopen tot 6% van de wereldwijde jaaromzet. De Digital Fairness Act, verwacht in het vierde kwartaal van 2026, scherpt dit verder aan.

**Strategisch.** Uit `onderzoek/08` par. 4.2: deze doelgroep vertrouwt influencers voor 2%. Ze is getraind in het herkennen van verkooptrucs. Een afteller op een site die zegt "bijna alles wat je leest over skincare is verkoop — dit niet" bevestigt precies het vermoeden waarmee ze binnenkomt. De techniek werkt hier niet neutraal maar negatief.

**Conclusie:** manipulatieve urgentie is uitgesloten. Niet als smaakoordeel, maar omdat het verboden is en omdat het bij deze lezer averechts werkt. Wat overblijft — hieronder — is krachtiger én legaal.

---

## 4. Conclusies en bouwbeslissingen

### 4.1 Vertrouwen ontstaat in een vaste volgorde (uit deelvraag 22)

NN/g onderscheidt vier factoren waarmee een site betrouwbaarheid overbrengt (DV22-01):

1. **Ontwerpkwaliteit** — het eerste en zwaarste oordeel, in enkele seconden geveld.
2. **Openheid vooraf** — wat verdien je eraan, wie ben je, hoe werk je. Vóór de vraag opkomt, niet erna.
3. **Volledige en actuele inhoud.**
4. **Verbinding met de rest van het web** — uitgaande links naar bronnen zijn een vertrouwenssignaal, geen lek.

Vertrouwen is bovendien **cumulatief**: het bouwt op over een bezoek en over meerdere bezoeken (DV22-03). Dat sluit direct aan op `onderzoek/08` par. 4.3, waar terugkerend bezoek het enige onbemiddelde kanaal bleek.

**Bouwbeslissingen:**
- De ontwerpkwaliteit moet omhoog, en dat is de commercieel best onderbouwde ingreep die er is. Zie 4.4.
- De werkwijze hoort zichtbaar te zijn op de plek waar de lezer binnenkomt, niet weggestopt op `/redactionele-richtlijnen`.
- De bronnenmeter is een sterker bezit dan het project ervan maakt: hij is de zichtbare vorm van factor 4. Hij verdient een prominentere plaats.
- De A/B/C-classificatie is uniek en wordt nergens uitgelegd waar de lezer hem tegenkomt.

### 4.2 Mensen lezen wél, als je ze ankers geeft (uit deelvraag 23)

Zie 3a. Het F-patroon (DV23-01) treedt op bij tekst zonder houvast; met goede opmaak wordt er gelezen (DV23-02).

**Bouwbeslissingen:**
- Tussenkoppen die iets zeggen. Een kop als "Wat er in de korrel zit" draagt informatie; "Achtergrond" niet.
- De eerste twee woorden van elke kop en link dragen het gewicht (zie 4.3).
- Een leesbare regellengte en royale regelafstand zijn geen esthetiek maar leesondersteuning. `--breedte-lees: 62ch` is goed.
- De linkerrand is waar het oog terugvalt; daar hoort structuur te staan, geen decoratie.

### 4.3 De klik wordt bepaald door de eerste twee woorden (uit deelvraag 24)

Het bruikbaarste enkele gegeven uit dit hele onderzoek. Lezers beoordelen een link op ongeveer **de eerste twee woorden, zo'n 11 tekens**. Zijn die goed gekozen, dan voorspelt **85%** van de gebruikers correct waar de link heen gaat (DV24-01).

Dat begrip heet *informatiegeur*: elk klikbaar element moet ruiken naar wat erachter zit. "Meer info" heeft geen geur; "Vergelijk garantietermijnen" wel.

**Bouwbeslissingen:**
- Elke link en knop begint met het zelfstandig naamwoord dat ertoe doet. "Lees verder" wordt vervangen.
- Artikeltitels frontloaden het onderwerp. `Rijstextract: van sakebrouwers tot ampul` doet dit al goed — het onderwerp staat vooraan.
- Navigatielabels moeten voorspelbaar zijn. Hier zit een spanning: "Wat zit erin?" is nieuwsgierig-makend maar draagt minder geur dan "Ingrediënten". Zie 4.5.

### 4.4 Wat "premium" concreet betekent (uit deelvraag 22, toegepast)

Omdat ontwerpkwaliteit het eerste vertrouwensoordeel draagt (4.1), is het de moeite waard te benoemen waar dat oordeel feitelijk op rust. Niet op "mooi", maar op signalen van vakmanschap:

- **Een eigen letter.** Systeemletters lezen als een onopgemaakt document. Dit is het sterkste enkele signaal en het ontbrak.
- **Ruimte.** Krappe marges lezen als goedkoop; royale witruimte leest als zelfvertrouwen.
- **Weinig, maar precies.** Één accentkleur consequent toegepast leest duurder dan vijf kleuren.
- **Detaillering.** Letterspatiëring op kapitalen, optische uitlijning, consistente verticale maatvoering.
- **Rust in beweging.** Eén trage, zachte overgang leest duurder dan vijf snelle effecten.

**Belangrijke randvoorwaarde.** De invariant "geen externe verzoeken" verbiedt *externe* lettertypen — het meesturen van het IP-adres van de lezer naar een derde partij. Een **zelfgehost** lettertype is geen extern verzoek en is dus toegestaan: zelfde herkomst, geen derde partij, geen AVG-bezwaar. Dit is de enige manier om dit signaal te halen binnen de bestaande regels.

### 4.5 Waar de spanning zit, en hoe die is opgelost

Twee bevindingen wijzen tegengesteld:

- **Informatiegeur** (4.3) wil voorspelbare, letterlijke labels: "Ingrediënten".
- **Merkonderscheid** (`onderzoek/08` par. 4.4) wil een eigen stem: "Wat zit erin?".

Opgelost door beide te geven in plaats van te kiezen: het merklabel als hoofdvorm, met een letterlijke ondertitel eronder in de kleine kapitalen. Zo krijgt het oog eerst de geur en daarna de stem, zonder dat er iets ingeleverd wordt. Dit is toegepast in de navigatie en op de rubriekpagina's.

### 4.6 Wat er nadrukkelijk níét gebouwd wordt

Vastgelegd zodat het later niet alsnog binnensluipt:

- Geen afteltimers, voorraadmeldingen of andere kunstmatige urgentie (verboden, zie 3c).
- Geen pop-up die het lezen onderbreekt.
- Geen "confirmshaming" — een afwijsknop mag nooit vernederend geformuleerd zijn.
- Geen nepsociaal bewijs: geen verzonnen bezoekersaantallen, geen beoordelingen die er niet zijn.
- Geen advertentie die zich voordoet als redactie.
- Geen automatisch startende beweging (zie de invariant in `CLAUDE.md` en WCAG 2.2 SC 2.2.2).

---

## 5. Samenvatting

- Vormgevingskwaliteit is het **eerste en zwaarste** vertrouwensoordeel — boven inhoud. Voor een site die van geloofwaardigheid leeft, is ontwerp daarmee een commerciële hefboom en geen afwerking.
- Het F-patroon is een symptoom van slechte opmaak, geen wet: met goede ankers wordt er wél gelezen.
- Een klik wordt beslist op de **eerste twee woorden** van een link; goed gekozen voorspelt 85% van de lezers correct waar hij uitkomt.
- Manipulatieve urgentie is sinds de DSA **verboden** (boetes tot 6% van de wereldomzet) én werkt bij deze specifieke, sceptische doelgroep averechts.
- Een zelfgehost lettertype is geen extern verzoek en is de enige weg naar het sterkste premium-signaal binnen de bestaande privacyregels.
