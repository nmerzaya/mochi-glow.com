# Herkomst van het beeld

Dit bestand wordt geschreven door `scripts/genereer-beeld.mjs` en is niet met
de hand bij te werken — draai het script opnieuw.

## Regels

1. Beeld wordt bij het bouwen één keer opgehaald en in de repo gezet. De site
   zelf verbindt nooit met een beeldgenerator; dat zou de invariant "geen
   externe verzoeken" breken.
2. Er staat geen enkel gezicht op de site. Geen AI-portret wordt gepresenteerd
   als foto van een bestaand persoon.
3. Geen AI-nabootsing van een specifiek, koopbaar product. Dat zou de lezer
   misleiden over wat hij daadwerkelijk koopt.
4. Beeld toont een concreet ding uit het artikel — de grondstof, de bereiding,
   de textuur — en nooit het beloofde effect. Dezelfde regel als voor de tekst.

## Werkwijze

- **Generator:** Pollinations.ai, model `sana` (het enige dat de dienst
  aanbiedt; `flux` en `turbo` vallen daar stilzwijgend op terug).
- **Stijlversie:** 3. Eén vaste stijlzin voor alle beelden, zodat de
  reeks samenhangt: `editorial still life photograph, soft diffused north-facing daylight from one side, warm neutral white balance around 5000K, shallow depth of field with the near edge crisp, muted dusty palette of bone white, warm grey and faded plum, matte finish, fine film grain, no gloss, generous negative space, quiet composition, subject slightly off-centre, photographed on medium format`
- **Uitgesloten:** `no text, no lettering, no logo, no watermark, no faces, no brand packaging, no labels`
- **Resolutie:** de dienst levert ongeveer 0,6 megapixel (1024×576), ongeacht wat
  er gevraagd wordt. Dat geldt ook mét `POLLINATIONS_TOKEN`: bij de meting van
  2026-08-12 is er op 1920×1080 gevraagd en kwam er op elk verzoek 1024×576
  terug. Een token verhoogt de resolutie dus niet — het geeft alleen een ruimer
  aanvraagtempo.
- **Nabewerking:** de beelden zijn na het ophalen met sharp 2× opgeschaald (Lanczos3 en een milde unsharp mask) en als JPEG kwaliteit 92 weggeschreven. Dat voegt geen detail toe, maar voorkomt dat de browser zelf moet interpoleren en geeft Astro genoeg pixels voor nette WebP-varianten.

## Beelden (84)

| Bestand | Rol | Onderwerp | Afmeting | Datum |
| --- | --- | --- | --- | --- |
| `centella-asiatica.jpg` | hero | a cluster of round pennywort leaves with scalloped edges, still wet with dew, on damp dark earth | 1024×576 → 2048×1152 | 2026-08-12 |
| `centella-asiatica-2.jpg` | in de tekst | dried centella leaves and thin stems loose in a shallow unglazed ceramic dish | 1024×576 → 2048×1152 | 2026-08-12 |
| `centella-asiatica-3.jpg` | in de tekst | one translucent green leaf held up against soft light, fine veins visible | 1024×576 → 2048×1152 | 2026-08-12 |
| `ceramiden.jpg` | hero | extreme macro of stacked translucent layers, like thin sheets of mica seen edge-on | 1024×576 → 2048×1152 | 2026-08-12 |
| `ceramiden-2.jpg` | in de tekst | close-up of dry flaking skin texture on the back of a hand in raking light | 1024×576 → 2048×1152 | 2026-08-12 |
| `ceramiden-3.jpg` | in de tekst | a thick smear of white balm across pale stone, catching the light along one edge | 1024×576 → 2048×1152 | 2026-08-12 |
| `galactomyces.jpg` | hero | a glass vessel of cloudy rice ferment with fine bubbles rising, on a worn wooden counter | 1024×576 → 2048×1152 | 2026-08-12 |
| `galactomyces-2.jpg` | in de tekst | macro of koji rice culture, pale fuzzy grains spread in a shallow wooden tray | 1024×576 → 2048×1152 | 2026-08-12 |
| `galactomyces-3.jpg` | in de tekst | milky filtrate being poured through fine cloth into a plain glass beaker | 1024×576 → 2048×1152 | 2026-08-12 |
| `hyaluronzuur.jpg` | hero | a single water droplet suspended on a taut translucent surface, refracting the light behind it | 1024×576 → 2048×1152 | 2026-08-12 |
| `hyaluronzuur-2.jpg` | in de tekst | macro of a clear viscous gel drawn upward into a thin thread between two fingertips | 1024×576 → 2048×1152 | 2026-08-12 |
| `hyaluronzuur-3.jpg` | in de tekst | beads of condensation running down cold glass, very shallow focus | 1024×576 → 2048×1152 | 2026-08-12 |
| `niacinamide.jpg` | hero | fine white crystalline powder heaped in a small glass dish on pale linen | 1024×576 → 2048×1152 | 2026-08-12 |
| `niacinamide-2.jpg` | in de tekst | close-up of shoulder skin texture in soft raking light | 1024×576 → 2048×1152 | 2026-08-12 |
| `niacinamide-3.jpg` | in de tekst | a glass dropper releasing one clear drop above a plain glass surface | 1024×576 → 2048×1152 | 2026-08-12 |
| `pdrn.jpg` | hero | macro of salmon skin, silvery iridescent scales, resting on crushed ice | 1024×576 → 2048×1152 | 2026-08-12 |
| `pdrn-2.jpg` | in de tekst | a slender empty glass ampoule lying on brushed cold steel | 1024×576 → 2048×1152 | 2026-08-12 |
| `pdrn-3.jpg` | in de tekst | a twisted translucent ribbon of gel coiled like a helix on dark wet stone | 1024×576 → 2048×1152 | 2026-08-12 |
| `propolis.jpg` | hero | a broken fragment of honeycomb with dark amber resin in the cells, backlit | 1024×576 → 2048×1152 | 2026-08-12 |
| `propolis-2.jpg` | in de tekst | raw propolis chunks, dark and waxy, in a small carved wooden bowl | 1024×576 → 2048×1152 | 2026-08-12 |
| `propolis-3.jpg` | in de tekst | thick amber liquid drawing out slowly from the back of a spoon | 1024×576 → 2048×1152 | 2026-08-12 |
| `rijstextract.jpg` | hero | raw white rice grains scattered across pale linen, macro, one grain in sharp focus | 1024×576 → 2048×1152 | 2026-08-12 |
| `rijstextract-2.jpg` | in de tekst | cloudy rice washing water standing in a wide ceramic bowl, seen from directly above | 1024×576 → 2048×1152 | 2026-08-12 |
| `rijstextract-3.jpg` | in de tekst | fermenting rice mash in an earthenware crock with the wooden lid pushed aside | 1024×576 → 2048×1152 | 2026-08-12 |
| `snail-mucin.jpg` | hero | a glossy spiral shell seen from directly above on wet dark slate | 1024×576 → 2048×1152 | 2026-08-12 |
| `snail-mucin-2.jpg` | in de tekst | macro of a clear viscous trail across dark glass, catching a thin line of light | 1024×576 → 2048×1152 | 2026-08-12 |
| `snail-mucin-3.jpg` | in de tekst | damp green leaves in low soft light with water beading on the surface | 1024×576 → 2048×1152 | 2026-08-12 |
| `vitamine-c.jpg` | hero | a citrus cross-section, macro, pulp segments translucent and backlit | 1024×576 → 2048×1152 | 2026-08-12 |
| `vitamine-c-2.jpg` | in de tekst | a small amber glass bottle on a windowsill casting a long shadow | 1024×576 → 2048×1152 | 2026-08-12 |
| `vitamine-c-3.jpg` | in de tekst | white crystalline powder spilling from a folded paper packet onto grey stone | 1024×576 → 2048×1152 | 2026-08-12 |
| `groene-thee.jpg` | hero | fresh green tea leaves, macro, still wet from rain, on dark slate | 1024×576 → 2048×1152 | 2026-08-12 |
| `groene-thee-2.jpg` | in de tekst | loose dried green tea heaped in a small ceramic scoop on linen | 1024×576 → 2048×1152 | 2026-08-12 |
| `groene-thee-3.jpg` | in de tekst | pale green tea steeping in a clear glass cup with steam rising | 1024×576 → 2048×1152 | 2026-08-12 |
| `ginseng.jpg` | hero | a whole ginseng root with fine pale tendrils lying on dark soil, macro | 1024×576 → 2048×1152 | 2026-08-12 |
| `ginseng-2.jpg` | in de tekst | thin slices of dried ginseng arranged in a row on a worn wooden board | 1024×576 → 2048×1152 | 2026-08-12 |
| `ginseng-3.jpg` | in de tekst | an amber infusion in a small earthenware cup, seen from just above the rim | 1024×576 → 2048×1152 | 2026-08-12 |
| `bijvoet.jpg` | hero | fresh mugwort leaves with the silvery underside showing, macro, soft daylight | 1024×576 → 2048×1152 | 2026-08-12 |
| `bijvoet-2.jpg` | in de tekst | a bundle of dried mugwort tied with rough twine hanging against a pale plaster wall | 1024×576 → 2048×1152 | 2026-08-12 |
| `bijvoet-3.jpg` | in de tekst | a dark herbal infusion in a shallow stone bowl with steam lifting off it | 1024×576 → 2048×1152 | 2026-08-12 |
| `houttuynia-cordata.jpg` | hero | heart-shaped houttuynia leaves wet with rain, macro, deep green against dark earth | 1024×576 → 2048×1152 | 2026-08-12 |
| `houttuynia-cordata-2.jpg` | in de tekst | houttuynia growing densely in shade, low soft light, shallow focus | 1024×576 → 2048×1152 | 2026-08-12 |
| `houttuynia-cordata-3.jpg` | in de tekst | crushed green leaves in a rough stone mortar with a pestle beside it | 1024×576 → 2048×1152 | 2026-08-12 |
| `gefermenteerde-soja.jpg` | hero | dried soybeans heaped in a wooden bowl, macro, warm side light | 1024×576 → 2048×1152 | 2026-08-12 |
| `gefermenteerde-soja-2.jpg` | in de tekst | traditional Korean earthenware fermentation jars on a stone terrace in morning light | 1024×576 → 2048×1152 | 2026-08-12 |
| `gefermenteerde-soja-3.jpg` | in de tekst | dark fermented soybean paste in a ceramic dish, thick textured surface | 1024×576 → 2048×1152 | 2026-08-12 |
| `acne-en-darmonderzoek.jpg` | hero | two empty glass petri dishes side by side on a pale grey surface | 1024×576 → 2048×1152 | 2026-08-12 |
| `acne-en-darmonderzoek-2.jpg` | in de tekst | a stack of printed pages with dense unreadable text, very shallow focus | 1024×576 → 2048×1152 | 2026-08-12 |
| `acne-en-darmonderzoek-3.jpg` | in de tekst | close-up of forearm skin texture with fine hair in soft raking light | 1024×576 → 2048×1152 | 2026-08-12 |
| `darm-huid-as.jpg` | hero | two smooth river stones on pale sand joined by a single taut strand of thread | 1024×576 → 2048×1152 | 2026-08-12 |
| `darm-huid-as-2.jpg` | in de tekst | a long coiled length of natural rope on a linen sheet, seen from above | 1024×576 → 2048×1152 | 2026-08-12 |
| `darm-huid-as-3.jpg` | in de tekst | macro of a fern frond unfurling, backlit | 1024×576 → 2048×1152 | 2026-08-12 |
| `darmbarriere-en-ontstekingsprocessen.jpg` | hero | a dense wall of small round pebbles fitted tightly together with one gap between them | 1024×576 → 2048×1152 | 2026-08-12 |
| `darmbarriere-en-ontstekingsprocessen-2.jpg` | in de tekst | macro of woven linen fabric with a single thread pulled loose | 1024×576 → 2048×1152 | 2026-08-12 |
| `darmbarriere-en-ontstekingsprocessen-3.jpg` | in de tekst | pomegranate seeds packed tightly in their pale membrane, close-up | 1024×576 → 2048×1152 | 2026-08-12 |
| `darmmicrobioom-en-huidmicrobioom.jpg` | hero | two circular fields of scattered poppy seeds on white paper, one dense and one sparse | 1024×576 → 2048×1152 | 2026-08-12 |
| `darmmicrobioom-en-huidmicrobioom-2.jpg` | in de tekst | macro of kefir grains in a clear glass jar, soft daylight | 1024×576 → 2048×1152 | 2026-08-12 |
| `darmmicrobioom-en-huidmicrobioom-3.jpg` | in de tekst | close-up of forearm skin texture in low raking light, fine detail | 1024×576 → 2048×1152 | 2026-08-12 |
| `probiotica-en-de-europese-regels.jpg` | hero | an empty glass petri dish on a pale grey desk beside a folded blank document | 1024×576 → 2048×1152 | 2026-08-12 |
| `probiotica-en-de-europese-regels-2.jpg` | in de tekst | rows of plain unlabelled glass jars on a wooden shelf | 1024×576 → 2048×1152 | 2026-08-12 |
| `probiotica-en-de-europese-regels-3.jpg` | in de tekst | a wooden rubber stamp and an ink pad resting on a blank paper form | 1024×576 → 2048×1152 | 2026-08-12 |
| `voeding-en-huid.jpg` | hero | a shallow ceramic bowl of mixed grains and seeds beside a handful of fresh greens | 1024×576 → 2048×1152 | 2026-08-12 |
| `voeding-en-huid-2.jpg` | in de tekst | a wooden board with sliced raw vegetables, seen from above in natural light | 1024×576 → 2048×1152 | 2026-08-12 |
| `voeding-en-huid-3.jpg` | in de tekst | olive oil being poured in a thin stream into a small white dish | 1024×576 → 2048×1152 | 2026-08-12 |
| `zuivel-en-acne.jpg` | hero | a plain glass of milk on a pale table, strong side light, shallow focus | 1024×576 → 2048×1152 | 2026-08-12 |
| `zuivel-en-acne-2.jpg` | in de tekst | a wedge of hard cheese and a small pot of yoghurt on rough linen | 1024×576 → 2048×1152 | 2026-08-12 |
| `zuivel-en-acne-3.jpg` | in de tekst | close-up of a spoon lifting thick set yoghurt out of a ceramic pot | 1024×576 → 2048×1152 | 2026-08-12 |
| `suiker-en-glycatie.jpg` | hero | white sugar crystals spilled across dark slate, extreme macro | 1024×576 → 2048×1152 | 2026-08-12 |
| `suiker-en-glycatie-2.jpg` | in de tekst | caramel darkening in a pan, close-up of the surface catching light | 1024×576 → 2048×1152 | 2026-08-12 |
| `suiker-en-glycatie-3.jpg` | in de tekst | a torn slice of toasted bread, crust texture in raking light | 1024×576 → 2048×1152 | 2026-08-12 |
| `slaap-en-huid.jpg` | hero | rumpled white linen bedding in early morning light, empty, no people | 1024×576 → 2048×1152 | 2026-08-12 |
| `slaap-en-huid-2.jpg` | in de tekst | a bedside table with a plain glass of water, dawn light through a thin curtain | 1024×576 → 2048×1152 | 2026-08-12 |
| `slaap-en-huid-3.jpg` | in de tekst | a hand resting open on a linen sheet, soft focus, no face | 1024×576 → 2048×1152 | 2026-08-12 |
| `zink-in-je-eten.jpg` | hero | pumpkin seeds and cashews spilled from a paper bag across pale linen, macro | 1024×576 → 2048×1152 | 2026-08-12 |
| `zink-in-je-eten-2.jpg` | in de tekst | fresh oysters on crushed ice seen from directly above | 1024×576 → 2048×1152 | 2026-08-12 |
| `zink-in-je-eten-3.jpg` | in de tekst | a loaf of wholegrain bread torn open, crumb texture in macro | 1024×576 → 2048×1152 | 2026-08-12 |
| `vitamine-e-op-je-bord.jpg` | hero | sunflower seeds spilling from a folded paper packet onto pale stone, macro | 1024×576 → 2048×1152 | 2026-08-12 |
| `vitamine-e-op-je-bord-2.jpg` | in de tekst | a halved avocado on a wooden board, flesh catching the light | 1024×576 → 2048×1152 | 2026-08-12 |
| `vitamine-e-op-je-bord-3.jpg` | in de tekst | golden oil being poured in a thin stream into a small glass bowl | 1024×576 → 2048×1152 | 2026-08-12 |
| `biotine.jpg` | hero | brown eggs in a wire basket with one cracked open into a small white bowl | 1024×576 → 2048×1152 | 2026-08-12 |
| `biotine-2.jpg` | in de tekst | walnuts and almonds scattered on a worn wooden board, macro | 1024×576 → 2048×1152 | 2026-08-12 |
| `biotine-3.jpg` | in de tekst | cooked lentils in a ceramic bowl with steam rising, close-up | 1024×576 → 2048×1152 | 2026-08-12 |
| `collageensupplementen.jpg` | hero | a plain unlabelled amber glass jar of white powder beside a small measuring spoon on pale stone | 1024×576 → 2048×1152 | 2026-08-12 |
| `collageensupplementen-2.jpg` | in de tekst | bone broth simmering gently in a pot, close-up of the surface | 1024×576 → 2048×1152 | 2026-08-12 |
| `collageensupplementen-3.jpg` | in de tekst | a scoop of fine white powder dissolving in a clear glass of water | 1024×576 → 2048×1152 | 2026-08-12 |
