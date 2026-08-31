import type { ImageKey } from './images';

/**
 * Where Celtic Golf Tours operates.
 *
 * Two countries, five regions. Terry set this list in the August 2026 review:
 * St Andrews and Southwest Ireland came off because they cannot be priced
 * competitively, and the regions below replaced them.
 *
 * ## The rule about course names
 *
 * `courses` is a list of courses that *exist in that region*. That is
 * geography, and it is always safe to print. It is not a statement that CGT
 * can secure a tee time at any of them — that is a commercial claim, and it
 * stays behind `courseAccessVerified` in src/data/site.ts until Terry confirms
 * it. So: never put these names in a sentence with "play", "secure", "access"
 * or "guaranteed". List them under the region; let `character` describe the
 * place, not the booking.
 *
 * Terry named the three Northern Scotland courses himself. The rest are the
 * courses that define each region; he still owes us a confirmed list — see
 * tasks/content-needed.md.
 */
/**
 * The canonical region ids.
 *
 * map-regions.ts tags every course with one of these. Declaring them as a
 * union means a typo there is a compile error, not a page that silently
 * renders a course under no region. `output: 'server'` means a runtime check
 * would not run until a request came in, so it has to be caught by the type.
 */
export const SUB_REGION_IDS = [
  'northern-scotland',
  'east-lothian',
  'northern-ireland',
  'northwest-ireland',
  'dublin',
] as const;

export type SubRegionId = (typeof SUB_REGION_IDS)[number];

export interface SubRegion {
  /** Anchor id — the destination page links to `#${id}`. */
  id: SubRegionId;
  name: string;
  /** One line about the place. About the landscape, never about access. */
  character: string;
  /** Courses in this region. Geography, not a promise. */
  courses: string[];
  image: ImageKey;
}

export interface Destination {
  name: string;
  slug: string;
  tagline: string;
  /** Max ~30 words. The photography carries the rest. */
  standfirst: string;
  image: ImageKey;
  subRegions: SubRegion[];
  comingSoon?: boolean;
}

export const destinations: Destination[] = [
  {
    name: 'Scotland',
    slug: 'scotland',
    tagline: 'Where the game was made',
    standfirst:
      'North of the tour buses, the links get older, emptier and better. This is the Scotland that rewards golfers who came for the golf.',
    image: 'scotlandHero',
    subRegions: [
      {
        id: 'northern-scotland',
        name: 'Northern Scotland',
        character:
          'Links laid into the dunes north of Inverness and out along the Moray Firth — three hours and a world away from the crowds.',
        courses: ['Royal Dornoch', 'Cruden Bay', 'Machrihanish Dunes'],
        image: 'regionNorthernScotland',
      },
      {
        id: 'east-lothian',
        name: 'East Lothian',
        character:
          'A single stretch of coast east of Edinburgh with more championship links per mile than anywhere on earth, and a city to come home to.',
        courses: ['Muirfield', 'North Berwick', 'Gullane'],
        image: 'regionEastLothian',
      },
    ],
  },
  {
    name: 'Ireland',
    slug: 'ireland',
    tagline: 'Dunes, weather and welcome',
    standfirst:
      'Ireland gives you the biggest dunes in the game, the shortest drives between them, and a clubhouse welcome that turns a golf trip into a story.',
    image: 'irelandHero',
    subRegions: [
      {
        id: 'northern-ireland',
        name: 'Northern Ireland',
        character:
          'The Antrim and Down coasts, where the dunes stand tallest and an Open Championship venue sits an hour from a mountain range.',
        courses: ['Royal Portrush', 'Royal County Down', 'Portstewart'],
        image: 'regionNorthernIreland',
      },
      {
        id: 'northwest-ireland',
        name: 'Northwest Ireland',
        character:
          'Sligo, Mayo and the Atlantic edge — vast dunescapes, hard weather, and courses you will have largely to yourselves.',
        courses: ['County Sligo', 'Enniscrone', 'Carne'],
        image: 'regionNorthwestIreland',
      },
      {
        id: 'dublin',
        name: 'Dublin',
        character:
          'Championship links on the peninsulas either side of the city, so the golf is twenty minutes out and the evening is in Dublin.',
        courses: ['Portmarnock', 'The Island', 'Royal Dublin'],
        image: 'regionDublin',
      },
    ],
  },
];

export const activeDestinations = destinations.filter((d) => !d.comingSoon);

/** Every region across every country, for nav and the homepage band. */
export const allSubRegions = destinations.flatMap((d) => d.subRegions);

export const destinationHref = (d: Destination) => `/destinations/${d.slug}`;

export const subRegionHref = (d: Destination, s: SubRegion) =>
  `/destinations/${d.slug}#${s.id}`;
