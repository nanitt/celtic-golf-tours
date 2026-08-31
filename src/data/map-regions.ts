/**
 * Course data behind the interactive discovery map.
 *
 * Rewritten August 2026 to Terry's region list. St Andrews, Turnberry,
 * Ballybunion, Lahinch and Waterville came off — the first two because the
 * regions changed, the last three because Southwest Ireland cannot be priced
 * competitively.
 *
 * ## Two rules for anyone editing this file
 *
 * 1. **These names are geography, not availability.** Listing a course here
 *    says it exists in that region. It does not say CGT can get you on it —
 *    that claim lives behind `courseAccessVerified` in src/data/site.ts.
 * 2. **`signatureHole` and `established` are factual assertions about real
 *    clubs.** They are optional for a reason: leave them out rather than
 *    guess. CGT should confirm every one before launch.
 *
 * `subRegionId` is typed against SUB_REGION_IDS in src/data/destinations.ts,
 * so a typo is a compile error. It cannot be a runtime check: `output` is
 * 'server', so module top-level code does not run until a request arrives —
 * a runtime assertion here would be a production 500, not a failed build.
 */

import { images, imageUrl, type ImageKey } from './images';
import type { SubRegionId } from './destinations';

export interface Course {
  id: string;
  name: string;
  location: string;
  /** Typed against destinations.ts — a typo here fails typecheck. */
  subRegionId: SubRegionId;
  /** Omit rather than guess. */
  signatureHole?: string;
  signatureHoleImage: string;
  description: string;
  /** Omit rather than guess. */
  established?: number;
}

export interface MapRegion {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  courses: Course[];
  /** Optional ambient sound for hover. */
  ambientSound?: string;
  hidden?: boolean;
}

/** Every course image resolves through the manifest, so a photo swap is one file. */
const courseImage = (key: ImageKey) => imageUrl(images[key], 800, 80);

const scotlandCourses: Course[] = [
  {
    id: 'royal-dornoch',
    name: 'Royal Dornoch',
    location: 'Dornoch, Sutherland',
    subRegionId: 'northern-scotland',
    signatureHole: '14th — Foxy',
    signatureHoleImage: courseImage('courseRoyalDornoch'),
    description: 'Links laid along the Dornoch Firth, far enough north to stay quiet.',
    established: 1877,
  },
  {
    id: 'cruden-bay',
    name: 'Cruden Bay',
    location: 'Cruden Bay, Aberdeenshire',
    subRegionId: 'northern-scotland',
    signatureHoleImage: courseImage('courseCrudenBay'),
    description: 'An Old Tom Morris layout folded into some of the biggest dunes on the east coast.',
    established: 1899,
  },
  {
    id: 'machrihanish-dunes',
    name: 'Machrihanish Dunes',
    location: 'Machrihanish, Kintyre',
    subRegionId: 'northern-scotland',
    signatureHoleImage: courseImage('courseMachrihanishDunes'),
    description: 'Built across protected dunesland on the Kintyre peninsula with barely any earth moved.',
    established: 2009,
  },
  {
    id: 'muirfield',
    name: 'Muirfield',
    location: 'Gullane, East Lothian',
    subRegionId: 'east-lothian',
    signatureHoleImage: courseImage('courseMuirfield'),
    description: 'Home of the Honourable Company of Edinburgh Golfers, and the fairest test on the coast.',
  },
  {
    id: 'north-berwick',
    name: 'North Berwick — West Links',
    location: 'North Berwick, East Lothian',
    subRegionId: 'east-lothian',
    signatureHole: '15th — Redan',
    signatureHoleImage: courseImage('courseNorthBerwick'),
    description: 'The original Redan, copied on courses all over the world, still played over the same wall.',
    established: 1832,
  },
  {
    id: 'gullane',
    name: 'Gullane',
    location: 'Gullane, East Lothian',
    subRegionId: 'east-lothian',
    signatureHoleImage: courseImage('courseGullane'),
    description: 'Three courses up and over Gullane Hill, with the Firth of Forth laid out below.',
    established: 1882,
  },
];

const irelandCourses: Course[] = [
  {
    id: 'royal-portrush',
    name: 'Royal Portrush — Dunluce',
    location: 'Portrush, Co. Antrim',
    subRegionId: 'northern-ireland',
    signatureHole: '16th — Calamity Corner',
    signatureHoleImage: courseImage('courseRoyalPortrush'),
    description: 'The Open venue on the Antrim coast, running along the cliffs above the White Rocks.',
    established: 1888,
  },
  {
    id: 'royal-county-down',
    name: 'Royal County Down',
    location: 'Newcastle, Co. Down',
    subRegionId: 'northern-ireland',
    signatureHoleImage: courseImage('courseRoyalCountyDown'),
    description: 'Blind drives through gorse-topped dunes with the Mourne Mountains behind every green.',
    established: 1889,
  },
  {
    id: 'portstewart',
    name: 'Portstewart — The Strand',
    location: 'Portstewart, Co. Londonderry',
    subRegionId: 'northern-ireland',
    signatureHole: '1st',
    signatureHoleImage: courseImage('coursePortstewart'),
    description: 'One of the great opening tee shots in golf, dropping into the dunes from high ground.',
    established: 1894,
  },
  {
    id: 'county-sligo',
    name: 'County Sligo — Rosses Point',
    location: 'Rosses Point, Co. Sligo',
    subRegionId: 'northwest-ireland',
    signatureHoleImage: courseImage('courseCountySligo'),
    description: 'Links on a headland under Benbulben, with the weather coming straight off the Atlantic.',
    established: 1894,
  },
  {
    id: 'enniscrone',
    name: 'Enniscrone',
    location: 'Enniscrone, Co. Sligo',
    subRegionId: 'northwest-ireland',
    signatureHoleImage: courseImage('courseEnniscrone'),
    description: 'Big, rolling dunes along Killala Bay — one of the least-played great links in Ireland.',
  },
  {
    id: 'carne',
    name: 'Carne',
    location: 'Belmullet, Co. Mayo',
    subRegionId: 'northwest-ireland',
    signatureHoleImage: courseImage('courseCarne'),
    description: "Eddie Hackett's last design, at the far western edge of Mayo. Pure dunesland.",
  },
  {
    id: 'portmarnock',
    name: 'Portmarnock',
    location: 'Portmarnock, Co. Dublin',
    subRegionId: 'dublin',
    signatureHoleImage: courseImage('coursePortmarnock'),
    description: 'A championship links on the peninsula north of the city, half an hour from dinner in Dublin.',
    established: 1894,
  },
  {
    id: 'the-island',
    name: 'The Island',
    location: 'Donabate, Co. Dublin',
    subRegionId: 'dublin',
    signatureHoleImage: courseImage('courseTheIsland'),
    description: 'Narrow fairways threaded between towering dunes across the estuary from Malahide.',
    established: 1890,
  },
  {
    id: 'royal-dublin',
    name: 'Royal Dublin',
    location: 'Dollymount, Co. Dublin',
    subRegionId: 'dublin',
    signatureHole: '18th — The Garden',
    signatureHoleImage: courseImage('courseRoyalDublin'),
    description: 'Links golf on Bull Island, inside the city limits and a short drive from the centre.',
    established: 1885,
  },
];

export const mapRegions: MapRegion[] = [
  {
    id: 'scotland',
    name: 'Scotland',
    slug: 'scotland',
    tagline: 'Where the game was made',
    courses: scotlandCourses,
    ambientSound: '/audio/wind-over-dunes.mp3',
  },
  {
    id: 'ireland',
    name: 'Ireland',
    slug: 'ireland',
    tagline: 'Dunes, weather and welcome',
    courses: irelandCourses,
    ambientSound: '/audio/ocean-waves.mp3',
  },
];

export const activeMapRegions = mapRegions.filter((r) => !r.hidden);
