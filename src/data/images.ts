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

// Regional stock set, all published as free Unsplash photos. These are still
// placeholders — none should be presented as a photograph of a named CGT
// course — but each is actually from Scotland or Ireland rather than a generic
// warm-climate course. Source pages are recorded in the image-sourcing notes.
const scottishLinks = 'photo-1672871582992-1b30b19878f5';
const scottishFife = 'photo-1697846461124-9b64ff16662a';
const scottishArran = 'photo-1655658786619-b50dafb92701';
const scottishTurnberry = 'photo-1642550918683-0196bda8be7f';
const irishLahinchGolfer = 'photo-1693113448333-0123750f17f6';
const irishLahinchLandscape = 'photo-1693113448288-015fb6eed7c9';
const irishDonegal = 'photo-1586051972887-be25a12a8177';
const northernIreland = 'photo-1667018580007-bf2ae2e0692a';
const irishKildare = 'photo-1731957235491-c190bbf9fc8d';

export const images = {
  // --- Home -----------------------------------------------------------------
  homeHero: stock(scottishLinks,
    'Hero. A recognisable links course, landscape, 2400px+. The single most important image on the site.'),
  homeCta: stock(irishDonegal,
    'Closing CTA background. A real CGT trip or course, landscape.'),

  // --- About ----------------------------------------------------------------
  aboutHero: stock(scottishFife,
    'About hero. The CGT team, the Centre Holidays office, or a real tour group.'),
  aboutStory: stock(irishLahinchGolfer,
    'Our Story supporting image. Founders, team, or an early trip.'),
  aboutCentre: stock(scottishTurnberry,
    'Operator section on /about. Approved Centre Holidays imagery, or the CGT team.'),

  // --- Experiences ----------------------------------------------------------
  experiencesHero: stock(irishLahinchGolfer,
    'Experiences hero. A hosted group on course.'),

  // --- Destinations ---------------------------------------------------------
  destinationsHero: stock(scottishLinks,
    'Destinations hero. Wide landscape spanning Scotland/Ireland.'),
  destinationsCta: stock(irishDonegal,
    'Destinations CTA background.'),

  scotlandHero: stock(scottishLinks,
    'Scotland hero. A recognisable Scottish links.'),
  scotlandCta: stock(scottishFife,
    'Scotland CTA background.'),

  irelandHero: stock(irishLahinchLandscape,
    'Ireland hero. A recognisable Irish links.'),
  irelandCta: stock(irishDonegal,
    'Ireland CTA background.'),

  // --- Contact / utility ----------------------------------------------------
  contactHero: stock(irishLahinchGolfer,
    'Contact hero. Something warm and human — a group, a clubhouse.'),
  thankYouHero: stock(irishLahinchLandscape,
    'Thank-you page hero.'),
  testimonialsHero: stock(irishLahinchGolfer,
    'Testimonials hero. Real guests, once photos and permissions exist.'),
  notFoundHero: stock(scottishArran,
    '404 background. Low priority.'),

  /** Default background for the shared <Hero> component. */
  heroFallback: stock(scottishArran,
    'Fallback hero used when a page supplies no image of its own.'),

  /** Social share card. 1200x630. */
  ogImage: stock(scottishLinks,
    'Open Graph share image, exactly 1200x630. Appears in every link preview.'),
  // --- Sub-regions ----------------------------------------------------------
  // The five regions Terry named. Each gets one wide, atmospheric image — these
  // carry the destination pages now that the copy has been cut back, so they
  // matter more than the individual course shots below.
  regionNorthernScotland: stock(scottishLinks,
    'Northern Scotland. Dunes north of Inverness — wide, empty, weather in the sky.'),
  regionEastLothian: stock(scottishFife,
    'East Lothian. The Firth of Forth coastline, links running to the shore.'),
  regionNorthernIreland: stock(northernIreland,
    'Northern Ireland. The Antrim or Down coast — cliffs and dunes.'),
  regionNorthwestIreland: stock(irishDonegal,
    'Northwest Ireland. Sligo/Mayo dunes, Atlantic light.'),
  regionDublin: stock(irishKildare,
    'Dublin. Links on the peninsula north of the city.'),

  // --- Courses --------------------------------------------------------------
  // One slot per course named on the site. Course names are printed as regional
  // character, never as an access promise — see courseAccessVerified in
  // src/data/site.ts. If a course comes off the site, delete its slot here too.
  courseRoyalDornoch: stock(scottishLinks, 'Royal Dornoch.'),
  courseCrudenBay: stock(scottishLinks, 'Cruden Bay.'),
  courseMachrihanishDunes: stock(scottishArran, 'Machrihanish Dunes.'),
  courseMuirfield: stock(scottishFife, 'Muirfield.'),
  courseNorthBerwick: stock(scottishFife, 'North Berwick — the West Links.'),
  courseGullane: stock(scottishFife, 'Gullane.'),
  courseRoyalPortrush: stock(northernIreland, 'Royal Portrush.'),
  courseRoyalCountyDown: stock(northernIreland, 'Royal County Down.'),
  coursePortstewart: stock(northernIreland, 'Portstewart — the Strand.'),
  courseCountySligo: stock(irishDonegal, 'County Sligo — Rosses Point.'),
  courseEnniscrone: stock(irishDonegal, 'Enniscrone.'),
  courseCarne: stock(irishDonegal, 'Carne — Belmullet.'),
  coursePortmarnock: stock(irishKildare, 'Portmarnock.'),
  courseTheIsland: stock(irishKildare, 'The Island.'),
  courseRoyalDublin: stock(irishKildare, 'Royal Dublin — Bull Island.'),

  // --- Trip types -----------------------------------------------------------
  tripBuddy: stock(irishLahinchGolfer,
    'Buddy Trips. A group of friends on course — candid, not posed.'),
  tripConcierge: stock(scottishTurnberry,
    'Concierge Trips. Something that reads as effortless: a car waiting, a clubhouse, a first tee.'),
  tripHighlands2028: stock(scottishLinks,
    'Featured 2028 Highlands trip. The single image selling the flagship departure.'),
  // --- Heritage wall (About page) -------------------------------------------
  heritageOldCourseDawn: stock(scottishLinks, 'Heritage wall: "First Light on the Firth" — Northern Scotland at dawn.'),
  heritageWalkingLinks: stock(northernIreland, 'Heritage wall: "Walking the Links" — Northern Ireland coast.'),
  heritageClubhouse: stock(scottishTurnberry, 'Heritage wall: "The Clubhouse".'),
  heritageHighland: stock(scottishArran, 'Heritage wall: "Highland Glory".'),
  heritageWildAtlantic: stock(irishDonegal, 'Heritage wall: "The Atlantic Edge" — northwest Ireland.'),
  heritageTradition: stock(irishLahinchLandscape, 'Heritage wall: "Timeless Tradition".'),
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
