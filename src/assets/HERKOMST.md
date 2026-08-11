# Herkomst van het beeldmateriaal

Deze map bevat beeld dat niet uit fotografie komt. Wat er per bestand is gebeurd, staat hieronder — inclusief de prompt, zodat een beeld reproduceerbaar en controleerbaar blijft.

De reden dat dit bestand bestaat: Mochi Glow bouwt zijn positie op het benoemen van wat je wél en niet weet. Een site die dat van ingrediënten vraagt, kan de herkomst van zijn eigen beeld niet stilzwijgend laten. Wat hier staat, staat in samengevatte vorm ook op `/redactionele-richtlijnen`, waar de lezer het kan zien.

## Regels

1. Beeld wordt **tijdens het bouwen opgehaald en in de repo gezet**. De site doet zelf nooit een verzoek naar een beeldgenerator; dat zou de invariant "geen externe verzoeken" uit `CLAUDE.md` breken en het IP-adres van elke bezoeker naar een derde partij sturen.
2. Een AI-gegenereerd gezicht mag nooit gepresenteerd worden alsof het een foto van een bestaand persoon is. Duidelijk gestileerd beeld mag; een pseudo-realistisch portret niet (`CLAUDE.md`).
3. Geen AI-nabootsing van een specifiek, aanklikbaar product. Voor productbeeld geldt: pers- of marketingbeeld van het merk zelf.

## Bestanden

### `hero-homepage.jpg`

| | |
|---|---|
| Gebruikt op | de homepage, als groot headerbeeld |
| Bron | Pollinations.ai, `https://image.pollinations.ai/prompt/…` |
| Model | `sana` — het enige model dat op het anonieme niveau beschikbaar is (`GET /models` gaf `["sana"]`) |
| Prompt | `side profile of a woman looking away to the left, calm, soft peach and cream light, plain pastel background, editorial beauty, large empty space on the left, soft focus` |
| Parameters | `width=1280&height=720&seed=77&nologo=true` |
| Datum | 2026-08-11 |
| Nabewerking | horizontaal gespiegeld met `sharp` (`.flop()`), opnieuw opgeslagen op kwaliteit 92 |
| Werkelijke afmeting | 1024 × 576 |

**Waarom gespiegeld.** In het oorspronkelijke beeld keek het gezicht naar rechts, weg van de plek waar de kop en de knoppen staan. `onderzoek/06`, par. 4.2 legt op grond van twee eye-trackingstudies (DV11-02, DV11-03) vast dat een blik richting de inhoud de aandacht meeneemt naar die inhoud, terwijl een blik in de lens de aandacht op het gezicht houdt. Spiegelen was goedkoper dan blijven genereren tot het model links en rechts uit elkaar houdt — daar bleek het niet betrouwbaar in.

**Twee beperkingen om te kennen.**

- Het anonieme niveau levert maximaal 1024 × 576, ongeacht wat je in `width` en `height` vraagt; er is ook maar één model. Het beeld wordt in de header dus licht opgeschaald. Dat is te verdragen omdat er een donkere sluier en een korrellaag overheen liggen, maar het is de reden dat er geen scherp beeld op de site staat. Wie hier ooit meer uit wil halen: een gratis account bij Pollinations geeft toegang tot meer modellen en hogere limieten.
- Het beeld is gestileerd en schilderachtig, niet fotorealistisch. Dat is hier een voordeel: het voldoet aan regel 2 hierboven zonder dat er een waarschuwing bij hoeft.

**Wat er niet in zit.** Er is bewust geen watermerk in het beeld terechtgekomen; `nologo=true` werkte op het anonieme niveau. Mocht een volgende generatie wél een watermerk opleveren, dan is bijsnijden of een ander model de oplossing — niet het watermerk laten staan.

## Beeld dat géén AI is

De illustraties bij artikelen en bij de routines komen uit `src/components/ArtikelBeeld.astro`: eigen, inline SVG in de accentkleur van het artikel. Die zijn niet gegenereerd en staan hier dus niet in. Ze blijven de standaard; AI-beeld is de uitzondering, niet andersom.
