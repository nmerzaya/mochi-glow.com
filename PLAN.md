# PLAN.md

## Eindbeeld (v1)

Een gepubliceerde, werkende site op een eigen domein, gebouwd met de stack uit `ARCHITECTUUR.md`, die bestaat uit:

- Een licht, clean, warm-vrouwelijk maar duidelijk design (geen drukte, focus op leesbaarheid en beeld).
- Twee contentpijlers, elk met een eerste batch artikelen:
  - **K-beauty-ingrediënten** (commercieel): uitleg- en vergelijkingsartikelen over ingrediënten (bv. niacinamide, snail mucin, PDRN, centella), met affiliate-links naar K-beauty-retailers.
  - **Gut-skin-wetenschap** (autoriteit): uitleg van de darm-huid-connectie op basis van gepubliceerd onderzoek, met duidelijke bronvermelding en zonder overclaims. Sinds de herziening van augustus 2026 draagt deze pijler ook een tweede, commercieel spoor over voeding en huid, strikt gescheiden van het wetenschapsspoor, zie `onderzoek/07`, par. 4.3.
- Minimaal 15-20 gepubliceerde artikelen (800+ woorden, origineel), verdeeld over beide pijlers, dit is de praktische ondergrens voor een kansrijke AdSense-aanvraag. **Gehaald: er staan er 28.**
- Twee interactieve vragenlijsten (`/routine` en `/eetritme`) die geen diagnose stellen, niets verkopen en niets opslaan.
- Een pseudoniem persona: een naam en een korte, geloofwaardige "waarom dit onderwerp"-tekst op een Over-pagina, zonder foto's of privédetails.
- Alle verplichte pagina's: privacybeleid, cookiebeleid, affiliate-disclaimer, algemene voorwaarden, contact.
- Werkende cookie consent (Klaro) vóór er advertenties of trackingscripts actief zijn.
- Een site die technisch klaar is om AdSense en de gekozen affiliate-programma's aan te vragen (snelle laadtijd, HTTPS, duidelijke navigatie, `ads.txt`).

Monetisatie zelf (daadwerkelijk aanvragen en live zetten van AdSense/affiliate-links) is onderdeel van v1, maar volgt pas ná de contentbasis, zie de fasering in `TAKEN.md`.

## Realistische tijdlijn (op basis van onderzoek)

Geen harde deadline, maar reken op meerdere maanden vanaf start tot eerste inkomsten: contentbasis opbouwen kost tijd, en zowel affiliate-netwerken (Daisycon wijst nieuwe sites met te weinig content expliciet af) als AdSense (Google wil doorgaans 3-6 maanden sitegeschiedenis zien) beoordelen een site pas serieus als er een aantoonbare basis staat. Een vroegtijdige, afgewezen aanvraag bij Amazon Associates kan bovendien niet opnieuw beoordeeld worden. Zie `onderzoek/03-tegenspraak.md` voor de bronnen achter deze verwachting.

## Wat er niét in zit (v1 non-goals)

Expliciet buiten scope voor de eerste versie, niet vergeten, niet per ongeluk toch bouwen:

- **Geen productreviews op basis van eigen aankoop.** Content is research-based; geen "ik heb dit getest"-content.
- **Geen brede/algemene skincare-pijler.** Bewust smal gehouden tot K-beauty-ingrediënten + gut-skin. Uitbreiding is een bewuste latere beslissing, geen v1-onderdeel.
- **Geen advertenties of affiliate-links vóór de contentbasis er staat.** Volgorde ligt vast in `TAKEN.md`.
- **Geen persoonlijke branding van de maker.** Geen foto's, geen social-mediaprofielen die naar een echte persoon herleidbaar zijn, geen privéinformatie.
- **Geen actieve social-mediastrategie in v1**, met uitzondering van eventueel Pinterest, en dan bewust als één van meerdere kanalen, niet als hoofdstrategie. Onderzoek laat zien dat Pinterest in 2026 zelf sterk volatiel is (zie `onderzoek/03-tegenspraak.md`, TS-DV5-01/02): grote, onvoorspelbare trafficdalingen bij individuele makers. Niet blind op vertrouwen.
- **Geen gebruikersaccounts, comments of community-features.**
- **Geen betaalde advertising/marketing.** Budget is nul euro (met de ene uitzondering: het domein).
- **Geen meertaligheid.** Alleen Nederlands in v1.
- **Geen eigen fotografie.** Er worden geen producten aangeschaft om te fotograferen.
- **Geen visuele identiteit (logo, exact kleurenpalet, typografie) is al vastgelegd**, de richting ("licht, clean, warm-vrouwelijk maar duidelijk") staat, de concrete uitwerking is werk binnen `TAKEN.md`.

## Nog open (bewust niet ingevuld, moet als eerste besloten worden)

- **Sitenaam / domeinnaam.** Nog niet gekozen in dit onderzoek, eerste stap in `TAKEN.md`.
- **Persona-naam.** Nog niet gekozen.
- **Analytics.** Niet onderzocht in `onderzoek/`. Cloudflare Pages heeft gratis, cookievrije Web Analytics ingebouwd (geen aparte tool nodig, geen extra kosten), een voor de hand liggende optie omdat de hostingkeuze het al meelevert, maar dit is een suggestie, geen onderzochte beslissing. Bevestig dit bewust voordat je het bouwt.
