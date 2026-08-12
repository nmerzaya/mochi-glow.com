# ARCHITECTUUR.md

Elke keuze hieronder is direct gebaseerd op `onderzoek/01-bronnen.md` (wat kan) en `onderzoek/03-tegenspraak.md` (welke risico's/beperkingen dat kan meebrengen). Waar dat tot een aanpassing leidde ten opzichte van de eerste bronnen, staat dat expliciet vermeld.

## Onderdelen

| Onderdeel | Keuze | Licentie | Waarom |
|---|---|---|---|
| Static site generator | **Astro** | MIT (open source) | Beste fit voor een contentgedreven, beeldzware blog: content collections voor artikelbeheer, ingebouwde beeldoptimalisatie (`astro:assets`, belangrijk in een visuele niche als beauty), en standaard geen JavaScript tenzij nodig (snel, goed voor Core Web Vitals/AdSense-pagina-ervaring). Bron: `onderzoek/01-bronnen.md` DV2-01/02/03. |
| Hosting | **Cloudflare Pages** | Proprietair platform, maar gratis laag; de sitecode zelf blijft portable (gewoon git + standaardbestanden, geen vendor lock-in) | Onbeperkte bandbreedte op de gratis laag — belangrijk voor een beeldzware beautysite. Netlify's gratis laag is beperkt tot 100GB/maand met dure overschrijding. Bron: DV2-04/05. **Kanttekening (TS-DV2-04):** de gratis laag staat maar 1 gelijktijdige build toe en wachtrijen bij meerdere branches — geen probleem bij een solo-workflow, wel iets om te weten. |
| CMS | **Sveltia CMS** (niet Decap CMS) | MIT (open source) | Git-based headless CMS, werkt met dezelfde configuratie als Decap/Netlify CMS maar is de actief onderhouden opvolger. **Afwijking t.o.v. de eerste bronnen (DV2-07/08 noemden Decap CMS):** tegenspraak-onderzoek vond een reëel, officieel geregistreerd beveiligingslek in Decap CMS (CVE-2025-57520, opgeslagen XSS in het preview-paneel) én vertraagde ontwikkeling sinds Netlify het project in 2023 aan de community overdroeg (`onderzoek/03-tegenspraak.md`, TS-DV2-01/02/03). Sveltia CMS is drop-in compatibel qua configuratie, dus de omweg kost niets extra. |
| Cookie consent (CMP) | **Klaro** | BSD-3-Clause (open source) | Zelf te hosten, blokkeert scripts (bv. advertenties) standaard tot toestemming, compatibel met Google Consent Mode v2 — nodig zodra AdSense actief is. Zelfgehost, dus geen doorlopende kosten of vendor lock-in. Bron: DV4-13/14/15. |
| Versiebeheer / repo | **GitHub** (publieke repo) | Proprietair platform, maar gratis voor publieke repo's; onderliggende tool (git) is open source | Vereist voor zowel Cloudflare Pages (auto-deploy bij push) als Sveltia CMS (git-based opslag van content). |
| Domeinnaam | Eigen domein, registrar naar keuze | n.v.t. | De enige bewuste uitzondering op het nul-euro-budget (~€10-15/jaar). Een gratis subdomein (bv. `.pages.dev`) oogt onprofessioneel en kan affiliate-netwerken/AdSense minder vertrouwen geven. |
| Beeldgeneratie | **Pollinations.ai** | MIT (open source platform); over de gegenereerde beelden zelf zegt de documentatie niets | Gratis en zonder API-sleutel aan te roepen via een gewone URL (`https://image.pollinations.ai/prompt/…`), wat past bij het nul-euro-uitgangspunt. Beeld wordt **eenmalig opgehaald met `scripts/genereer-beeld.mjs` en in `src/assets/artikelen/` gezet**, nooit tijdens de build; de site zelf verbindt nooit met pollinations.ai, want dat zou de invariant "geen externe verzoeken" breken. **Beperkingen (gemeten 2026-08-11 en opnieuw 2026-08-12):** één verzoek per 15 seconden, één model (`sana`), en maximaal 1024 × 576 ongeacht welke `width`/`height` je meegeeft. Een gratis account met `POLLINATIONS_TOKEN` geeft een ruimer aanvraagtempo maar **géén hogere resolutie** — 84 verzoeken op 1920 × 1080 gaven 84 keer 1024 × 576 terug. Beelden worden daarom lokaal 2× opgeschaald. Herkomst per bestand staat in `src/assets/HERKOMST.md` |
| Lettertypen | **Zelfgehost**: Fraunces, Newsreader, IBM Plex Mono | SIL Open Font License 1.1 | Opgehaald met `scripts/haal-letters.mjs` en geserveerd vanuit `public/fonts/` (276 kB samen, latijnse subset, variabel waar dat kan). Géén Google Fonts of andere CDN: dat zou het IP-adres van elke bezoeker naar een derde partij sturen. Zelf hosten heeft dat bezwaar niet en houdt de invariant "geen externe verzoeken" volledig overeind. Waarom er überhaupt een eigen letter is: `onderzoek/09` par. 4.1 — vormgevingskwaliteit is het eerste en zwaarste vertrouwensoordeel van een bezoeker, nog vóór de inhoud, en systeemletters lezen als een onopgemaakt document. Licenties in `public/fonts/LICENTIE.md` |
| Analytics | **Nog niet besloten** — Cloudflare Web Analytics (gratis, cookievrij, standaard bij Cloudflare Pages) is een voor de hand liggende, niet-onderzochte suggestie | — | Niet onderdeel van het onderzoek in `onderzoek/`; expliciet als open beslissing laten staan in `PLAN.md`. Bevestig bewust voor het bouwen. |
| Beeldgeneratie | **Pollinations.ai** (primair); optioneel Hugging Face voor meer modelkeuze | Open source (platform-code op GitHub); onderliggende modellen zijn doorgaans open-weight (bv. FLUX) | Enige optie die aan alle eisen tegelijk voldoet: gratis, geen API-key of account, open source, en rechtstreeks aan te roepen via één simpele URL — dus direct bruikbaar door Claude Code zonder losse koppeling of MCP-server. Vervangt de eerdere "geen fotografie, alleen SVG"-aanpak (zie `CLAUDE.md`, Afbeeldingen), die in de praktijk te weinig voorstelde. |

## Contentstructuur (Astro content collections)

Voorstel voor mapstructuur, aan te passen tijdens het scaffolden:

```
src/
  content/
    ingredienten/           # pijler 1: commercieel, affiliate-links
                            #   (heette hier eerst kbeauty-ingredienten; de code is leidend)
                            #   voor de lezer: "Wat zit erin?"
    gut-skin/               # pijler 2: twee sporen — wetenschap én commercieel voedingsadvies,
                            #   strikt gescheiden; zie onderzoek/07 par. 4.3
                            #   voor de lezer: "Huid van binnenuit"
  components/
  layouts/
public/
  admin/                    # Sveltia CMS config + index.html
  images/
  ads.txt
onderzoek/                  # meegenomen onderzoek, blijft in de projectroot staan
```

Elke content-collectie krijgt een schema (via Astro Content Collections) dat in elk geval verplicht maakt: titel, publicatiedatum, of het artikel affiliate-links bevat (boolean), en of het gezondheidsclaims maakt die tegen de EFSA-lijst gecheckt moeten worden.

## Compliance-onderdelen in de architectuur

- **Affiliate-disclosure:** wordt geen los "onderdeel" maar een verplicht veld in het contentschema (zie hierboven) plus een component dat de disclosuretekst automatisch bovenaan een artikel plaatst zodra `affiliate: true` staat — voorkomt dat een auteur het vergeet.
- **Cookie consent:** Klaro laadt vóór alle andere scripts (advertenties, eventuele analytics) en blokkeert ze standaard.
- **`ads.txt`:** statisch bestand in `public/`, vereist door AdSense zodra dat wordt aangevraagd.
- **Verplichte pagina's** (privacy, cookiebeleid, disclaimer, voorwaarden, contact, over): losse statische pagina's, geen content-collectie — deze veranderen zelden en horen niet tussen de blogartikelen.

## Waarom geen andere opties

- **Hugo** (in plaats van Astro) is sneller in build-tijd maar minder geschikt voor iemand die primair via een CMS content beheert; Astro's content collections en Sveltia-integratie sluiten beter aan op de workflow. Zie DV2-01/02/03 voor de volledige vergelijking.
- **Netlify** (in plaats van Cloudflare Pages) heeft een prettigere developer experience en ingebouwde formulieren, maar de bandbreedtelimiet weegt zwaarder in een beeldzware niche. Zie DV2-04/05.
- **Decap CMS** (in plaats van Sveltia CMS) is beter gedocumenteerd en heeft meer voorbeeldmateriaal, maar het bekende beveiligingslek en de tragere doorontwikkeling wogen zwaarder. Zie TS-DV2-01/02/03. Mocht Sveltia CMS in de praktijk tegenvallen, is teruggaan naar (een gepatchte versie van) Decap CMS een kleine wijziging omdat de configuratie compatibel is.
- **Gratis stockfotografie** (Unsplash, Pexels) als beeldbron is overwogen en afgevallen op inhoudelijke gronden, niet op licentiegronden: eye-trackingonderzoek laat zien dat stockfoto's van generieke mensen door bezoekers worden genegeerd, terwijl foto's van échte mensen juist bestudeerd worden (`onderzoek/06`, DV11-01). Dat bezwaar geldt onverkort voor het huidige beeld: er staat daarom geen enkel gezicht op de site, alleen grondstoffen, bereiding en textuur (`onderzoek/07`, par. 4.1).
- **Eigen SVG-illustraties** waren tot augustus 2026 de enige beeldbron en zijn volledig vervangen door gegenereerde fotografie. Ze zijn niet als terugval bewaard: een terugval die er anders uitziet dan de rest levert een tweede beeldtaal op, en dat was juist de inconsistentie die de herziening moest oplossen. Gevolg: `afbeelding` is verplicht in het schema, zodat een vergeten beeld een bouwfout geeft in plaats van een gat op de pagina.
- **Zelfgehost ComfyUI + FLUX/Stable Diffusion** (in plaats van Pollinations.ai) is "zuiverder" open source — volledige controle, geen externe dienst — maar vereist een GPU op de eigen computer; zonder die hardware kost dit alsnog geld (cloud-compute), wat tegen het nul-euro-budget ingaat. Pollinations.ai bereikt hetzelfde (open-source model, gratis gebruik) zonder die drempel.
