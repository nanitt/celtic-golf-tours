import { images, imageUrl } from './images';

export interface Host {
  name: string;
  title: string;
  photo: string;
}

export interface HostedExperience {
  id: string;
  name: string;
  host: Host;
  /** Display text, e.g. "May 15-22, 2025". Not machine-readable — see startDate. */
  dates: string;
  /** ISO date (YYYY-MM-DD) the trip departs. Drives all "upcoming" filtering. */
  startDate: string;
  destination: string;
  description: string;
  highlights: string[];
  image: string;
  status: 'open' | 'limited' | 'sold_out';
  price?: string;
  spotsRemaining?: number;
  /**
   * A trip we are promoting before the details exist. Teasers link to /contact
   * rather than a detail page, because there is nothing to detail yet.
   */
  teaser?: boolean;
  /**
   * True when `startDate` is a sort key rather than a real departure date.
   * Cards must not print a specific date for these — only the `dates` label.
   */
  datesTbc?: boolean;
}

/**
 * Fallback trips, used whenever Sanity is unconfigured — which it is in
 * production today.
 *
 * The four 2025 departures that used to live here were all in the past, and one
 * carried "Only 4 Left" against a $14,500 price. That combination is the
 * incident recorded in tasks/codex-handoff.md; do not recreate its shape.
 *
 * The Highlands entry is a teaser Terry asked to feature. It deliberately has
 * no price and no spotsRemaining, so no pricing or scarcity claim renders, and
 * `status: 'open'` produces no badge at all.
 */
export const hostedExperiences: HostedExperience[] = [
  {
    id: 'highlands-2028',
    name: 'The Highlands, 2028',
    // No host named until Terry confirms who is leading it.
    host: { name: '', title: '', photo: '' },
    dates: 'Scotland · 2028',
    // Sort/filter key only — never rendered. `datesTbc` says so out loud.
    // Dated to the start of the year so it sorts ahead of anything added later
    // in 2028 without implying a January departure.
    startDate: '2028-01-01',
    datesTbc: true,
    teaser: true,
    destination: 'Scotland',
    description:
      'A week in the Scottish Highlands, built for 2028 and planned from now. The route, the courses and the pace are still being set — which is exactly why this is the moment to tell us what you want out of it.',
    highlights: [],
    image: imageUrl(images.tripHighlands2028, 1200, 80),
    status: 'open',
  },
];

export function getExperienceById(id: string): HostedExperience | undefined {
  return hostedExperiences.find(exp => exp.id === id);
}

export function getExperiencesByStatus(status: HostedExperience['status']): HostedExperience[] {
  return hostedExperiences.filter(exp => exp.status === status);
}

export function getExperiencesByDestination(destination: string): HostedExperience[] {
  return hostedExperiences.filter(exp => exp.destination.toLowerCase() === destination.toLowerCase());
}

/** A departure is only "upcoming" if it hasn't already left. */
export function isUpcoming(exp: HostedExperience, now: Date = new Date()): boolean {
  return new Date(exp.startDate) > now;
}

export function getUpcomingExperiences(): HostedExperience[] {
  return hostedExperiences.filter(exp => isUpcoming(exp) && exp.status !== 'sold_out');
}

/**
 * Featured cards for the homepage. Past departures are never featured — showing a
 * date the visitor can verify has passed costs more trust than an empty section.
 */
export function getFeaturedExperiences(count: number = 3): HostedExperience[] {
  // Must wrap: a bare filter(isUpcoming) passes the array index as `now`.
  return hostedExperiences.filter(exp => isUpcoming(exp)).slice(0, count);
}
