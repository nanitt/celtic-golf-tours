/**
 * Every photograph on the site, in one place.
 *
 * Why this file exists: the site launched on Unsplash stock, and the real
 * photography from Celtic Golf Tours is still outstanding. Image URLs were
 * scattered across ~20 files, so replacing them meant a find-and-replace with no
 * way to confirm you'd got them all.
 *
 * ## Replacing a placeholder
 *
 * 1. Drop the real file into `public/images/` (2000px+ wide for heroes).
 * 2. Change `src` to the path, e.g. `/images/st-andrews-18th.jpg`.
 * 3. Set `placeholder: false`.
 *
 * That's it — every page using that slot updates. Run `npm run images:audit`
 * to see what's still stock.
 *
 * `src` accepts either an Unsplash photo id (`photo-…`) or a local path
 * beginning with `/`. `imageUrl()` handles both.
 */

export interface SiteImage {
  /** Unsplash photo id, or a local path under /public once real. */
  src: string;
  /** What this slot actually needs. Written for whoever sources the photo. */
  needs: string;
  /** True while this is still stock imagery. */
  placeholder: boolean;
}

const stock = (src: string, needs: string): SiteImage => ({ src, needs, placeholder: true });

export const images = {
  // --- Home -----------------------------------------------------------------
  homeHero: stock('photo-1672871583040-42826d4e9ca4',
    'Hero. A recognisable links course, landscape, 2400px+. The single most important image on the site.'),
  homeCta: stock('photo-1616939472071-a69e775e4d8a',
    'Closing CTA background. A real CGT trip or course, landscape.'),

  // --- About ----------------------------------------------------------------
  aboutHero: stock('photo-1743185836009-848e5035422b',
    'About hero. The CGT team, the Celtic Golf Centre, or a real tour group.'),
  aboutStory: stock('photo-1725835567442-7f39d9199f8c',
    'Our Story supporting image. Founders, team, or an early trip.'),
  aboutCentre: stock('photo-1674884070794-b61d85f9adf8',
    'Celtic Golf Centre relationship section. Approved imagery of the Centre.'),

  // --- Experiences ----------------------------------------------------------
  experiencesHero: stock('photo-1683169285928-eb93b0169793',
    'Experiences hero. A hosted group on course.'),

  // --- Destinations ---------------------------------------------------------
  destinationsHero: stock('photo-1535131749006-b7f58c99034b',
    'Destinations hero. Wide landscape spanning Scotland/Ireland.'),
  destinationsCta: stock('photo-1687291133565-767706032bed',
    'Destinations CTA background.'),

  scotlandHero: stock('photo-1687291133565-767706032bed',
    'Scotland hero. A recognisable Scottish links.'),
  scotlandCta: stock('photo-1581265064945-737852e55a53',
    'Scotland CTA background.'),

  irelandHero: stock('photo-1693113448288-015fb6eed7c9',
    'Ireland hero. A recognisable Irish links.'),
  irelandCta: stock('photo-1760294752180-50102c9334ac',
    'Ireland CTA background.'),

  // --- Contact / utility ----------------------------------------------------
  contactHero: stock('photo-1700667315345-e0c51587b2fd',
    'Contact hero. Something warm and human — a group, a clubhouse.'),
  thankYouHero: stock('photo-1693113448288-015fb6eed7c9',
    'Thank-you page hero.'),
  testimonialsHero: stock('photo-1693163537665-b7c5a5f01f75',
    'Testimonials hero. Real guests, once photos and permissions exist.'),
  notFoundHero: stock('photo-1587174486073-ae5e5cff23aa',
    '404 background. Low priority.'),

  /** Default background for the shared <Hero> component. */
  heroFallback: stock('photo-1587174486073-ae5e5cff23aa',
    'Fallback hero used when a page supplies no image of its own.'),

  /** Social share card. 1200x630. */
  ogImage: stock('photo-1587174486073-ae5e5cff23aa',
    'Open Graph share image, exactly 1200x630. Appears in every link preview.'),
  // --- Sub-regions ----------------------------------------------------------
  // The five regions Terry named. Each gets one wide, atmospheric image — these
  // carry the destination pages now that the copy has been cut back, so they
  // matter more than the individual course shots below.
  regionNorthernScotland: stock('photo-1535131749006-b7f58c99034b',
    'Northern Scotland. Dunes north of Inverness — wide, empty, weather in the sky.'),
  regionEastLothian: stock('photo-1672871583062-7613925d0734',
    'East Lothian. The Firth of Forth coastline, links running to the shore.'),
  regionNorthernIreland: stock('photo-1616939472071-a69e775e4d8a',
    'Northern Ireland. The Antrim or Down coast — cliffs and dunes.'),
  regionNorthwestIreland: stock('photo-1693113448333-0123750f17f6',
    'Northwest Ireland. Sligo/Mayo dunes, Atlantic light.'),
  regionDublin: stock('photo-1760294752180-50102c9334ac',
    'Dublin. Links on the peninsula north of the city.'),

  // --- Courses --------------------------------------------------------------
  // One slot per course named on the site. Course names are printed as regional
  // character, never as an access promise — see courseAccessVerified in
  // src/data/site.ts. If a course comes off the site, delete its slot here too.
  courseRoyalDornoch: stock('photo-1639156353290-4dda45b9281a', 'Royal Dornoch.'),
  courseCrudenBay: stock('photo-1642550918683-0196bda8be7f', 'Cruden Bay.'),
  courseMachrihanishDunes: stock('photo-1655658786619-b50dafb92701', 'Machrihanish Dunes.'),
  courseMuirfield: stock('photo-1672871583062-7613925d0734', 'Muirfield.'),
  courseNorthBerwick: stock('photo-1672871583040-42826d4e9ca4', 'North Berwick — the West Links.'),
  courseGullane: stock('photo-1687291133565-767706032bed', 'Gullane.'),
  courseRoyalPortrush: stock('photo-1616939472071-a69e775e4d8a', 'Royal Portrush.'),
  courseRoyalCountyDown: stock('photo-1593167963207-fbc91640c60f', 'Royal County Down.'),
  coursePortstewart: stock('photo-1505216128104-44f34619861f', 'Portstewart — the Strand.'),
  courseCountySligo: stock('photo-1693113448333-0123750f17f6', 'County Sligo — Rosses Point.'),
  courseEnniscrone: stock('photo-1594750197419-829e3bc11d1f', 'Enniscrone.'),
  courseCarne: stock('photo-1600011689032-8b628b8a8747', 'Carne — Belmullet.'),
  coursePortmarnock: stock('photo-1760294752180-50102c9334ac', 'Portmarnock.'),
  courseTheIsland: stock('photo-1693113448288-015fb6eed7c9', 'The Island.'),
  courseRoyalDublin: stock('photo-1683169285928-eb93b0169793', 'Royal Dublin — Bull Island.'),

  // --- Trip types -----------------------------------------------------------
  tripBuddy: stock('photo-1694636507260-8b2428e3b738',
    'Buddy Trips. A group of friends on course — candid, not posed.'),
  tripConcierge: stock('photo-1685880841774-d3cd18c3207a',
    'Concierge Trips. Something that reads as effortless: a car waiting, a clubhouse, a first tee.'),
  tripHighlands2028: stock('photo-1535131749006-b7f58c99034b',
    'Featured 2028 Highlands trip. The single image selling the flagship departure.'),
  // --- Heritage wall (About page) -------------------------------------------
  heritageOldCourseDawn: stock('photo-1687291133565-767706032bed', 'Heritage wall: "First Light on the Firth" — Northern Scotland at dawn.'),
  heritageWalkingLinks: stock('photo-1693113448288-015fb6eed7c9', 'Heritage wall: "Walking the Links" — Northern Ireland coast.'),
  heritageClubhouse: stock('photo-1600011689032-8b628b8a8747', 'Heritage wall: "The Clubhouse".'),
  heritageHighland: stock('photo-1535131749006-b7f58c99034b', 'Heritage wall: "Highland Glory".'),
  heritageWildAtlantic: stock('photo-1693113448333-0123750f17f6', 'Heritage wall: "The Atlantic Edge" — northwest Ireland.'),
  heritageTradition: stock('photo-1594750197419-829e3bc11d1f', 'Heritage wall: "Timeless Tradition".'),
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;

/**
 * Resolve an image to a URL.
 * Local paths are returned untouched; Unsplash ids get sizing params applied.
 */
export function imageUrl(image: SiteImage, width = 2000, quality = 85): string {
  if (image.src.startsWith('/') || image.src.startsWith('http')) return image.src;
  return `https://images.unsplash.com/${image.src}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&q=${quality}`;
}

/** Slots still using stock imagery. Drives `npm run images:audit`. */
export function placeholderImages(): Array<{ key: string } & SiteImage> {
  return Object.entries(images)
    .filter(([, img]) => img.placeholder)
    .map(([key, img]) => ({ key, ...img }));
}
