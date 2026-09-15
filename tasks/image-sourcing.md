# Temporary Image Sources

The stock images currently mapped in `src/data/images.ts` are intentionally
regional placeholders, not claims that a picture depicts a named course. They
remain `placeholder: true` and must be replaced with approved Celtic Golf Tours
photography when it arrives.

All were published as free photos under the Unsplash License when checked on
31 August 2026.

| Key | Location represented | Source |
| --- | --- | --- |
| `scottishLinks` | Scotland, coastal golf | [Toby Harvey](https://unsplash.com/photos/a-flag-on-a-golf-course-near-a-body-of-water-Qha_EQ_hnyI) |
| `scottishFife` | Dumbarnie Golf Links, Fife | [Ryan Caven](https://unsplash.com/photos/a-house-on-a-hill-with-a-bench-in-front-of-it-lFO9BvnfCWU) |
| `scottishArran` | Isle of Arran, Scotland | [Jacqueline Heron Wray](https://unsplash.com/photos/a-golf-course-next-to-a-lake-NOj0pQF8-kc) |
| `scottishTurnberry` | Turnberry, Scotland | [Samuel Regan-Asante](https://unsplash.com/photos/a-large-white-building-with-a-long-walkway-leading-to-it-t-j8FHkaEV4) |
| `irishLahinchGolfer` | Lahinch, County Clare | [Andrew Dovan](https://unsplash.com/photos/a-man-playing-golf-on-a-golf-course-b6PwZSPjqH0) |
| `irishLahinchLandscape` | Lahinch, County Clare | [Andrew Dovan](https://unsplash.com/photos/a-view-of-a-golf-course-with-a-lake-in-the-background-YGSjWPZF79g) |
| `irishDonegal` | Malin Head, County Donegal | [Brian Kelly](https://unsplash.com/photos/personas-en-un-campo-de-hierba-verde-cerca-del-cuerpo-de-agua-durante-el-dia-1gf2lhgVhqc) |
| `northernIreland` | Belfast, Northern Ireland | [Korng Sok](https://unsplash.com/photos/a-large-green-landscape-VthAUvA50Eg) |
| `irishKildare` | Kilkea, County Kildare | [Genet Schneider](https://unsplash.com/photos/a-view-of-a-golf-course-from-a-distance-uDIeb6wb6to) |

## Hero and CTA set (added 15 September 2026)

Nine photos were covering fifteen full-bleed hero and CTA slots, so `/experiences`
and `/contact` opened on the same picture, three CTA bands shared another, and
`/destinations` and `/scotland` shared a third. These eight were added so each of
those fifteen slots has its own image; `npm run images:audit` now reports any
collision between two of them if it ever happens again.

Same standing rule as the set above: regional placeholders, never a claim that a
picture shows a named CGT course. All were published under the Unsplash License
when checked on 15 September 2026.

| Key | Location represented | Source |
| --- | --- | --- |
| `scottishLinksFlag` | Scotland, coastal links | [Toby Harvey](https://unsplash.com/photos/AbOJ00eMm0Y) |
| `scottishHolyrood` | Holyrood Park, Edinburgh | [Sydney Turturro](https://unsplash.com/photos/a-person-walking-across-a-lush-green-field-PV4OFJN4Zy4) |
| `scottishSeaCliff` | Scotland, coastal cliffs | [Angelo Casto](https://unsplash.com/photos/an-aerial-view-of-a-grassy-island-in-the-middle-of-the-ocean-d-gDDh0yYHs) |
| `scottishCaddie` | Dumbarnie Golf Links, Fife | [Ryan Caven](https://unsplash.com/photos/a-man-walking-across-a-lush-green-field-P6o0s3qU3vE) |
| `irishMoher` | Cliffs of Moher, County Clare | [Kilian Vesshoff](https://unsplash.com/photos/dramatic-cliffs-meet-the-ocean-under-a-cloudy-sky-szFQvKhbnsA) |
| `irishDingle` | Dingle Peninsula, County Kerry | [Fabio Montello](https://unsplash.com/photos/a-large-body-of-water-surrounded-by-a-lush-green-hillside-Wx8xqX1P6XY) |
| `irishAntrim` | Carrick-a-Rede, County Antrim | [K. Mitch Hodge](https://unsplash.com/photos/a-body-of-water-surrounded-by-a-lush-green-hillside-aYVF7SAzOUM) |
| `irishDuneGrass` | Coastal dune grass, Ireland | [Mary Skrynnikova](https://unsplash.com/photos/green-grass-field-near-body-of-water-during-daytime-pzzFzk6oIKU) |

### Two things to know about this set

**`scottishCaddie` carries a visible club name.** The caddie's bib reads
DUMBARNIE. It is a real Scottish links and not a course CGT lists, so it makes no
access claim, but it is a logo on the contact page and worth a look if that ever
matters.

**St Andrews was deliberately avoided.** Ryan Caven's Unsplash portfolio is mostly
St Andrews, including a clean shot of the 18th green. Terry asked for St Andrews
to come off the site, so only the Dumbarnie frame was taken. Anyone shopping that
portfolio for more images should check what is recognisable in the frame first.

### Still outstanding

`contactHero` asks for a group or a clubhouse, and `aboutHero` / `aboutStory` /
`aboutCentre` / `testimonialsHero` all ask for real people — the CGT team, real
guests. No stock photo can honestly fill those; they need client photography.
`irishLahinchGolfer` still covers `aboutStory`, `testimonialsHero` and `tripBuddy`,
and `scottishTurnberry` still covers `aboutCentre`, `tripConcierge` and
`heritageClubhouse`. Those are lower-traffic than the heroes but are the next ones
worth splitting.
