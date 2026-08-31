import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { HostedExperience } from './hosted-experiences';
import {
  hostedExperiences as fallbackExperiences,
  getExperienceById as fallbackGetById,
  getUpcomingExperiences as fallbackGetUpcoming,
  getFeaturedExperiences as fallbackGetFeatured,
  getExperiencesByDestination as fallbackGetByDest,
  isUpcoming,
} from './hosted-experiences';

export type { HostedExperience, Host } from './hosted-experiences';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const sanityConfigured = !!projectId;

const sanityClient = sanityConfigured
  ? createClient({ projectId, dataset, useCdn: true, apiVersion: '2024-01-01' })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

function urlFor(source: any): string {
  if (!source || !builder) return '';
  return builder.image(source).auto('format').url();
}

interface SanityExperienceDoc {
  _id: string;
  name: string;
  slug: { current: string };
  host?: {
    name?: string;
    title?: string;
    photo?: any;
  };
  startDate?: string;
  dates?: string;
  destination?: string;
  description?: string;
  highlights?: string[];
  image: any;
  status?: 'open' | 'limited' | 'sold_out';
  price?: string;
  spotsRemaining?: number;
  featured?: boolean;
  sortOrder?: number;
  teaser?: boolean;
  datesTbc?: boolean;
}

function mapToExperience(doc: SanityExperienceDoc): HostedExperience {
  return {
    id: doc.slug.current,
    name: doc.name,
    host: {
      name: doc.host?.name ?? '',
      title: doc.host?.title ?? '',
      photo: urlFor(doc.host?.photo),
    },
    // Empty startDate sorts as invalid and is treated as not-upcoming, so a
    // CMS trip missing a departure date fails closed rather than showing forever.
    startDate: doc.startDate ?? '',
    dates: doc.dates ?? '',
    destination: doc.destination ?? '',
    description: doc.description ?? '',
    highlights: doc.highlights ?? [],
    image: urlFor(doc.image),
    status: doc.status ?? 'open',
    price: doc.price,
    spotsRemaining: doc.spotsRemaining,
    teaser: doc.teaser ?? false,
    datesTbc: doc.datesTbc ?? false,
  };
}

export async function getAllExperiences(): Promise<HostedExperience[]> {
  // Past departures are filtered out even in fallback mode — a date the visitor can
  // check and find stale costs more trust than an empty section.
  if (!sanityClient) return fallbackExperiences.filter(exp => isUpcoming(exp));
  const docs = await sanityClient.fetch<SanityExperienceDoc[]>(
    `*[_type == "experience"] | order(sortOrder asc)`
  );
  return docs.map(mapToExperience).filter(exp => isUpcoming(exp));
}

export async function getExperienceBySlug(slug: string): Promise<HostedExperience | undefined> {
  if (!sanityClient) return fallbackGetById(slug);
  const doc = await sanityClient.fetch<SanityExperienceDoc | null>(
    `*[_type == "experience" && slug.current == $slug][0]`,
    { slug }
  );
  return doc ? mapToExperience(doc) : undefined;
}

export async function getUpcomingExperiences(): Promise<HostedExperience[]> {
  if (!sanityClient) return fallbackGetUpcoming();
  const docs = await sanityClient.fetch<SanityExperienceDoc[]>(
    `*[_type == "experience" && status != "sold_out"] | order(sortOrder asc)`
  );
  return docs.map(mapToExperience).filter(exp => isUpcoming(exp));
}

export async function getFeaturedExperiences(count: number = 3): Promise<HostedExperience[]> {
  if (!sanityClient) return fallbackGetFeatured(count);
  const docs = await sanityClient.fetch<SanityExperienceDoc[]>(
    `*[_type == "experience" && featured == true] | order(sortOrder asc)`
  );
  // Slice after fetching: GROQ slice bounds must be literals, so [0...$count] errors.
  return docs.map(mapToExperience).filter(exp => isUpcoming(exp)).slice(0, count);
}

export async function getExperiencesByDestination(destination: string): Promise<HostedExperience[]> {
  if (!sanityClient) return fallbackGetByDest(destination);
  const docs = await sanityClient.fetch<SanityExperienceDoc[]>(
    `*[_type == "experience" && lower(destination) == lower($destination)]`,
    { destination }
  );
  return docs.map(mapToExperience);
}
