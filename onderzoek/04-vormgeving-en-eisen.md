# Vormgeving en eisen — onderzoek ten behoeve van de bouw

Vierde onderzoeksbestand, volgens de methode uit `CLAUDE.md`. Aanleiding: de opdracht om de site daadwerkelijk te bouwen. `onderzoek/00-vraagstelling.md` sloot vormgeving expliciet uit ("Visuele identiteit en designwerk (kleuren, logo, typografie) — losstaand van deze onderzoeksvraag"), en drie van de bronnen over gezondheidsclaims (DV4-10, DV4-11, DV4-12) waren onbruikbaar. Beide gaten worden hier gedicht.

Bestaande bestanden zijn niet gewijzigd. Codes lopen door vanaf `DV6` om botsing met `01-bronnen.md` (DV1 t/m DV5) te vermijden.

---

## 1. Vraagstelling

### Hoofdvraag

Hoe moet een Nederlandstalige contentsite over K-beauty-ingrediënten en de darm-huid-connectie er visueel en structureel uitzien om (a) te passen bij de conventies van deze niche, (b) vertrouwen te wekken bij een lezer én bij Google's beoordeling van gezondheidsgerelateerde content, en (c) te voldoen aan de regels die gelden zodra er affiliate-links naar cosmetica én naar voeding/supplementen op staan?

### Deelvragen

6. **Vormgevingsconventies.** Welke concrete visuele patronen (typografie, kleur, beeld, indeling, witruimte) delen goed presterende sites in de beauty-/skincare-niche, en welke daarvan zijn overneembaar voor een contentsite zonder eigen productfotografie?
7. **E-E-A-T en YMYL.** Wat verwacht Google aantoonbaar van gezondheids- en beautycontent op het punt van auteurschap en herkomst, en wat betekent dat voor een site met een pseudonieme auteur zonder medische kwalificaties?
8. **Claims op voeding en supplementen.** Welke uitspraken over darmgezondheid, probiotica, vitamines en mineralen zijn toegestaan in commerciële communicatie in Nederland, en gelden die regels ook voor een affiliate die zelf niets verkoopt?
9. **Toegankelijkheid.** Is de European Accessibility Act van toepassing op een solo-contentsite, en welke toegankelijkheidsnorm is verstandig om aan te houden?

### Buiten scope

- Logo-ontwerp en illustratiestijl in detail — alleen de richting wordt vastgelegd.
- Keuze van concrete affiliate-producten (Fase 4 uit `TAKEN.md`).
- Volledige juridische toetsing; dit blijft informatief, geen advies van een jurist.
- Herbeoordeling van de stackkeuzes uit `ARCHITECTUUR.md`.

### Wanneer is dit onderzoek af

Zodra er per deelvraag een onderbouwd antwoord ligt dat direct vertaalbaar is naar een bouwbeslissing: een concreet palet en typografische richting, een lijst vertrouwenssignalen die in de site gebouwd moeten worden, een handhaafbare lijst van toegestane en verboden formuleringen, en een uitspraak over de toegankelijkheidsnorm.

---

## 2. Bronnenlog

Type-classificatie en statuslegenda: zie `01-bronnen.md`. **Raadpleegdatum voor alle onderstaande bronnen: 2026-08-10.** Elke bron is geopend en gecontroleerd op bestaan én inhoudelijke overeenkomst.

### Deelvraag 6 — Vormgevingsconventies

| Code | Zoekterm | Link | Type | Status |
|---|---|---|---|---|
| DV6-01 | skincare beauty blog web design trends 2026 layout typography whitespace editorial | https://colorlib.com/wp/skincare-brand-website-examples/ | C | opgehaald |
| DV6-02 | skincare beauty blog web design trends 2026 layout typography whitespace editorial | https://www.designrush.com/best-designs/websites/trends/best-beauty-websites | C | opgehaald |
| DV6-03 | skincare beauty blog web design trends 2026 layout typography whitespace editorial | https://www.nwsdigital.com/Blog/Website-Design-Trends-for-2026 | C | opgehaald |

Alle drie zijn tertiair (agency-/verzamelblogs). Er bestaat voor smaak- en vormgevingsconventies geen primaire bron; dit is inherent aan de deelvraag en wordt hieronder bij de conclusie meegewogen.

### Deelvraag 7 — E-E-A-T en YMYL

| Code | Zoekterm | Link | Type | Status |
|---|---|---|---|---|
| DV7-01 | Google E-E-A-T YMYL requirements health beauty content site author bio sources 2026 | https://developers.google.com/search/docs/fundamentals/creating-helpful-content | A | opgehaald |

### Deelvraag 8 — Claims op voeding en supplementen

| Code | Zoekterm | Link | Type | Status |
|---|---|---|---|---|
| DV8-01 | EFSA authorised health claims register gut health probiotics 2026 | https://food.ec.europa.eu/food-safety/labelling-and-nutrition/nutrition-and-health-claims/eu-register-health-claims_en | A | opgehaald — **beperking:** dit is de toegangspagina tot het register, met de bevestiging dat zowel toegestane als geweigerde claims worden bijgehouden. De pagina zelf noemt geen individuele claims; specifieke claims moeten in de doorzoekbare database zelf opgezocht worden |
| DV8-02 | EFSA authorised health claims register gut health probiotics 2026 | https://www.fsai.ie/business-advice/nutrition/probiotic-health-claims | A | opgehaald |
| DV8-03 | NVWA gezondheidsclaims probiotica website verboden claim Nederland regels | https://www.nvwa.nl/onderwerpen/voedselveiligheid/voedingsclaims-en-gezondheidsclaims/verbod-op-medische-claims | A | opgehaald |
| DV8-04 | NVWA gezondheidsclaims probiotica website verboden claim Nederland regels | https://www.nvwa.nl/onderwerpen/voedselveiligheid/voedingsclaims-en-gezondheidsclaims/regels-voor-online-promoten-van-levensmiddelen | A | opgehaald |
| DV8-05 | EFSA authorised health claims register gut health probiotics 2026 | https://www.foodnavigator.com/Article/2025/01/15/probiotics-claims-remain-restricted-by-eu/ | B | opgehaald |

### Deelvraag 9 — Toegankelijkheid

| Code | Zoekterm | Link | Type | Status |
|---|---|---|---|---|
| DV9-01 | European Accessibility Act 2025 websites WCAG requirements blog Netherlands applies | https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en | A | opgehaald |
| DV9-02 | European Accessibility Act 2025 websites WCAG requirements blog Netherlands applies | https://ec.europa.eu/social/main.jsp?catId=1202 | A | **onbruikbaar** — de veelgebruikte oude EU-URL leidt via twee doorverwijzingen (302 naar `employment-social-affairs.ec.europa.eu/node/168_en`, daarna 301) naar DV9-01. Als bron op zichzelf dus dood; opgenomen omdat deze URL nog breed wordt geciteerd |

### Kerncitaten uit de geverifieerde bronnen

**DV7-01 (Google, primair):**
> "Is it self-evident to your visitors who authored your content?"
> "We strongly encourage adding accurate authorship information, such as bylines to content where readers might expect it."
> "Does your content clearly demonstrate first-hand expertise and a depth of knowledge (for example, expertise that comes from having actually used a product or service, or visiting a place)?"

**DV8-02 (Food Safety Authority of Ireland, primair):**
> "the term 'probiotic', when used on a food label, is considered to be a health claim."
> "There are no approved health claims for probiotics" — "no claims on probiotics are listed on the EU register as authorised for use."
> Enige uitzondering: "Live cultures in yogurt improve lactose digestion of the product in individuals who have difficulty digesting lactose", uitsluitend bij ten minste 10⁸ KVE/g van de culturen *Lactobacillus delbrueckii* subsp. *bulgaricus* en *Streptococcus thermophilus*.

**DV8-03 (NVWA, primair):**
> "Levensmiddelen met een medische claim vallen onder de definitie van een geneesmiddel."
> "een website waarop een levensmiddel wordt verhandeld of aangeprezen, mag niet ergens anders op die site medische informatie bevatten over deze waar."
> Websites mogen "niet met een link verwijzen naar pagina's buiten de website met medische informatie" — de NVWA rekent zelfs links naar medische vakbladen tot "een ontoelaatbare medische claim".

**DV8-04 (NVWA, primair):**
> "Promoot u producten voor een ander bedrijf? Schrijft u bijvoorbeeld blogs waarin u deze producten aanprijst […] En wordt u hiervoor beloond door dat merk of bedrijf […] Dit noemen we gesponsorde content."
> "Zorg dat de gesponsorde content alleen toegestane claims bevat."

**DV9-01 (Europese Commissie, primair):** de richtlijn geldt voor tien categorieën producten en diensten: computers en besturingssystemen, betaal- en ticketautomaten, smartphones, tv-apparatuur, telefoniediensten, audiovisuele mediadiensten, personenvervoer, bankdiensten, e-books en e-commerce.

---

## 3. Tegenspraak

Per deelvraag is expliciet gezocht naar bronnen of feiten die de opgebouwde lijn onderuithalen.

### 3a. Getest: "een licht, clean palet is de juiste keuze voor deze niche"

| Code | Zoekterm | Link | Type | Status | Wat het tegenspreekt |
|---|---|---|---|---|---|
| TS-DV6-01 | website design trends 2026 dark design | https://www.nwsdigital.com/Blog/Website-Design-Trends-for-2026 | C | opgehaald | Noemt "Dark Design" — "deep tones, shadows, and strong contrast to create focused, immersive interfaces" — als uitgesproken trend voor 2026. Dat staat haaks op de projectrichting "licht kleurenpalet" uit `CLAUDE.md`. |

**Duiding:** de bron nuanceert zichzelf ("this isn't universal — lighter designs remain appropriate for many audiences"), en de twee beauty-specifieke bronnen (DV6-01, DV6-02) wijzen juist consistent op licht, luchtig en veel witruimte, met Glossier expliciet als voorbeeld van "airy web design". De lichte richting blijft dus staan, maar het is een keuze tegen een bredere designtrend in, niet een keuze die door alle bronnen wordt gedragen.

### 3b. Getest: "research-based content zonder eigen tests kan volwaardig meekomen in Google's beoordeling"

**Zoekterm:** "Google E-E-A-T first-hand experience requirement product reviews without testing"

**Resultaat: reële tegenspraak gevonden, en wel in de primaire bron zelf.** DV7-01 vraagt letterlijk of content "first-hand expertise" toont, "for example, expertise that comes from having actually used a product or service". De eerste E van E-E-A-T staat voor Experience, en dat is precies de as waarop dit project structureel niet kan scoren: er worden geen producten aangeschaft, dus er is geen eigen ervaring om te tonen — en die suggereren mag niet van `CLAUDE.md`.

**Duiding:** dit weerlegt niet dat de site kan werken, maar wel het impliciete idee dat "research-based" een gelijkwaardig alternatief is voor "getest". Het is aantoonbaar een handicap op één van de vier E-E-A-T-assen. Consequentie voor de bouw: maximaal inzetten op de drie assen waar wél op geleverd kan worden (Expertise, Authoritativeness, Trust) door herkomst, methode en bronnen zichtbaarder te maken dan concurrenten dat doen, en het ontbreken van eigen tests expliciet te benoemen in plaats van te verhullen. Dit is geen nieuw risico maar een scherpere formulering van wat `PLAN.md` al als non-goal had vastgelegd.

### 3c. Getest: "over probiotica en darmgezondheid mag niets geclaimd worden"

| Code | Zoekterm | Link | Type | Status | Wat het tegenspreekt |
|---|---|---|---|---|---|
| TS-DV8-01 | probiotics claims member states allow term national guidelines | https://www.foodnavigator.com/Article/2025/01/15/probiotics-claims-remain-restricted-by-eu/ | B | opgehaald | Meldt dat "10 EU member states have already adopted their own guidelines which allow the use of the term on products" — het verbod is dus niet overal in de EU absoluut. |

**Duiding:** de tegenspraak is echt maar niet van toepassing op dit project. Dezelfde bron vermeldt dat de Europese Ombudsman aangaf dat die lidstaten "may not be compliant with EU regulation", en noemt Nederland niet als een van de landen met zo'n versoepeling. De Nederlandse toezichthouder (DV8-03, DV8-04) hanteert juist de strikte lijn en handhaaft die actief richting websites en gesponsorde content. Voor een Nederlandstalige site die zich op Nederland richt, blijft de strenge uitleg dus de juiste; de nuance is wel relevant zodra er ooit vertaald wordt.

### 3d. Getest: "de European Accessibility Act geldt niet voor deze site"

**Zoekterm:** "European Accessibility Act microenterprise exemption services Directive 2019/882 article 4"

**Resultaat: geen tegenspraak gevonden, maar wél een verificatiegat.** De primaire bron (DV9-01) somt tien categorieën op waar de richtlijn voor geldt; een contentsite met affiliate-links valt onder geen daarvan — e-commerce betreft het zelf sluiten van consumentenovereenkomsten, wat hier niet gebeurt. Secundaire bronnen noemen daarnaast een uitzondering voor micro-ondernemingen (drempel: 10 werknemers én €2 mln omzet), maar **dat heb ik niet op de primaire bron kunnen bevestigen** — de officiële pagina zwijgt erover en verwijst impliciet naar de volledige tekst van Richtlijn 2019/882.

**Reden om te stoppen met zoeken:** de conclusie steunt op het toepassingsbereik (de site is geen van de tien genoemde diensten), niet op de micro-ondernemingsuitzondering. De conclusie is dus niet afhankelijk van het onbevestigde punt. Wordt de site ooit een webshop, dan moet dit opnieuw uitgezocht worden aan de hand van de richtlijntekst zelf.

---

## 4. Conclusies en bouwbeslissingen

Pas hier, na stap 1 t/m 3.

### 4.1 Vormgeving (uit deelvraag 6)

Gedeelde patronen in alle drie de bronnen: veel witruimte, beeld dat leidt en tekst die volgt, rustige navigatie, en een consistent beperkt palet. DV6-03 voegt typografie als dragend identiteitselement toe (serif = redactioneel/autoriteit, sans = toegankelijk/eigentijds) en pleit voor "bite-sized content" in kaarten en modules.

Vertaald naar Mochi Skin, dat een speels-Koreaanse in plaats van klinische uitstraling krijgt:

- **Palet:** oudroze als accent, crème als achtergrond, zacht paars als tweede accent, met een diepe inktkleur voor tekst. Licht en warm, tegen de "dark design"-trend in (zie 3a), omdat de beauty-specifieke bronnen consistent de andere kant op wijzen.
- **Typografie:** één zachte, ronde sans voor koppen in lowercase (past bij de wordmark "mochi skin") en een goed leesbare tekstletter voor de broodtekst. Geen serif-koppen: die zouden de gekozen speelse richting tegenwerken.
- **Beeld:** omdat er geen eigen productfotografie is (`CLAUDE.md`), wordt beeld bewust ondergeschikt gemaakt. In plaats van de full-bleed productfoto's die merken gebruiken, draagt de site op kleur, vorm en typografie. Dit is een bewuste afwijking van de niche-conventie, ingegeven door een projectbeperking.
- **Structuur:** kaartgebaseerde overzichten per pijler, korte alinea's, duidelijke tussenkoppen.

### 4.2 Vertrouwenssignalen (uit deelvraag 7)

Google vraagt om zichtbaar auteurschap met doorklik naar achtergrond (DV7-01). De site kan geen medische kwalificaties tonen. Te bouwen:

1. Zichtbare byline "Noor" bij elk artikel, met link naar `/over`.
2. Een pagina `/redactionele-richtlijnen` die uitlegt hoe artikelen tot stand komen, welke bronsoorten wel en niet gebruikt worden, en expliciet vermeldt dat Noor geen arts of huidtherapeut is en geen producten test.
3. Een zichtbare bronnenlijst onder elk artikel, niet als voetnoot maar als volwaardig onderdeel.
4. Publicatie- én bijwerkdatum bij elk artikel.
5. Geen enkele formulering die eigen gebruik of testervaring suggereert (zie 3b — dit is een bewuste keuze mét kosten, geen gratis keuze).

### 4.3 Handhaafbare taalregels (uit deelvraag 8)

Dit is de kern van wat het controlescript moet afdwingen.

**Altijd verboden, overal op de site:**
- Medische/therapeutische werkwoorden bij cosmetica én levensmiddelen: geneest, behandelt, bestrijdt, voorkomt (een aandoening), vermindert ontsteking, herstelt schade.
- Elke variant van "probiotisch", "probiotica" of "goed voor je darmflora" als eigenschap van een product. Het woord is zelf een gezondheidsclaim (DV8-02) en er is geen enkele toegestane variant.
- Elke suggestie van eigen testervaring.

**Toegestaan, mits letterlijk in de goedgekeurde bewoording:** claims over vitamines en mineralen die in het EU-register staan, bijvoorbeeld dat zink bijdraagt tot het behoud van een normale huid, of dat vitamine C bijdraagt tot de normale collageenvorming voor de normale werking van de huid. Deze gaan in een afzonderlijke lijst (`data/toegestane-claims.json`) zodat het script erop kan controleren.

**Structurele scheiding, volgend uit DV8-03:** een pagina die een levensmiddel aanprijst mag elders op de site geen medische informatie over dat product bevatten en er niet naar linken — zelfs niet naar wetenschappelijke vakbladen. Omdat de opdrachtgever affiliate-links op voeding en supplementen wil behouden, wordt dit opgelost door het artikeltype vast te leggen in het schema:

- `productType: 'voeding-supplement'` → affiliate-links toegestaan, links naar studies en medische bronnen geblokkeerd, alleen claims uit de goedgekeurde lijst.
- `productType: 'cosmetica'` → affiliate-links toegestaan; hier geldt Verordening 1223/2009, niet het levensmiddelenregime.
- De tien gut-skin-artikelen krijgen `affiliate: false` en mogen daardoor vrij naar peer-reviewed onderzoek verwijzen.

Dat de claimregels ook gelden voor een affiliate die zelf niets verkoopt, is expliciet bevestigd in DV8-04 en is dus geen voorzichtigheidsmarge maar een harde eis.

### 4.4 Toegankelijkheid (uit deelvraag 9)

De European Accessibility Act is niet van toepassing: de site is geen van de tien in DV9-01 genoemde categorieën. WCAG 2.2 AA wordt desondanks vrijwillig aangehouden voor contrast, focusindicatie, koppenhiërarchie en alt-teksten — het kost bij een nieuwe site vrijwel niets en ondersteunt zowel leesbaarheid als de gebruikerservaring die meeweegt in de AdSense-beoordeling.

---

## 5. Samenvatting

Voor deelvraag 6 zijn alleen tertiaire bronnen beschikbaar, wat inherent is aan een vraag over vormgevingsconventies; de drie bronnen wijzen wel dezelfde kant op. Voor deelvraag 7 is de primaire bron tegelijk de sterkste tegenspraak: Google beloont aantoonbaar eigen ervaring, die dit project bewust niet heeft. Deelvraag 8 is met vier primaire bronnen het stevigst onderbouwd en dicht het gat dat DV4-10 t/m DV4-12 openlieten: er is geen enkele toegestane claim rond probiotica of darmgezondheid, de regels gelden ook voor affiliates, en er is een structurele scheiding nodig tussen commerciële levensmiddelenpagina's en wetenschappelijke content. Deelvraag 9 leidt tot de conclusie dat de EAA niet geldt, met de kanttekening dat de veelgenoemde micro-ondernemingsuitzondering niet bij de primaire bron te bevestigen was — de conclusie steunt daar ook niet op.
