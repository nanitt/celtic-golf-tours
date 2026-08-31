import type { ImageKey } from './images';

/**
 * The two ways to travel with Celtic Golf Tours.
 *
 * Terry set this split in the August 2026 review, replacing a generic
 * Custom / Small Group / Corporate menu that described the company rather
 * than the customer.
 *
 * The distinction is who does the organising, not how many people are going:
 *
 * - **Buddy Trips** — a group of friends who already know they want to go.
 *   We take over the part that ruins these trips: the chasing, the deposits,
 *   the tee times nobody can get.
 * - **Concierge Trips** — fully managed, any group size. The pitch is the
 *   absence of work. "We plan everything, you don't have to do a thing."
 *
 * These pages exist to start a conversation, not to close a sale. Every CTA
 * goes to /contact. There is no booking engine and there should not be one.
 */
export interface TripType {
  slug: 'buddy' | 'concierge';
  name: string;
  /** Small label above the title. */
  kicker: string;
  /** The one-line sell. Shown on cards. */
  promise: string;
  /** Who this is for, in plain words. */
  forWho: string;
  /** Two or three sentences. Resist adding a fourth. */
  body: string;
  /** What we take off their plate. Kept concrete and non-committal on access. */
  weHandle: string[];
  image: ImageKey;
}

export const tripTypes: TripType[] = [
  {
    slug: 'buddy',
    name: 'Buddy Trips',
    kicker: 'For a group that already has a group chat',
    promise: 'The trip your foursome has been talking about for six years. Actually booked.',
    forWho: 'Friends travelling together — usually four to sixteen, usually overdue.',
    body:
      "Everyone agrees it's a great idea. Then someone has to pick the courses, find the hotel, work out the driving, collect the money, and re-book it all when two people change their dates. That is the part that kills these trips, and that is the part we take.\n\nYou keep the fun bit: deciding who's in, and settling the bets afterwards.",
    weHandle: [
      'The route, so you are not driving three hours after a round',
      'Tee times, held in your group’s name before anyone has paid',
      'Hotels within sensible reach of the next first tee',
      'One invoice, or one per player — your call',
      'The re-planning when someone’s dates move',
    ],
    image: 'tripBuddy',
  },
  {
    slug: 'concierge',
    name: 'Concierge Trips',
    kicker: 'For anyone who would rather just arrive',
    promise: 'We plan everything. You do not have to do a thing.',
    forWho: 'Any group size, from two people to twenty. Managed end to end.',
    body:
      'A concierge trip is the version where you hand it over. We build the itinerary around how you actually want to play — the pace, the rest days, where you eat, how far you are willing to drive — and then we run it.\n\nYou get one person who knows your trip, from the first phone call to the airport on the way home.',
    weHandle: [
      'An itinerary built around your pace, not a fixed departure',
      'Every booking made and held in one place',
      'Transfers, so nobody is nominated as the driver',
      'A single point of contact who knows your trip by name',
      'Someone on the end of a phone while you are over there',
    ],
    image: 'tripConcierge',
  },
];

export const tripTypeHref = (t: TripType) => `/trips/${t.slug}`;

export const findTripType = (slug: string) =>
  tripTypes.find((t) => t.slug === slug);

/**
 * How far ahead the popular weeks go. Terry's number, and the single most
 * useful thing the site can tell someone who is "thinking about it".
 */
export const PLANNING_MONTHS = 18;

export const PLANNING_NOTE =
  'The best tee times are held around 18 months ahead. If a season matters to you, the call needs to happen well before the year it falls in.';
