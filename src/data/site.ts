export const site = {
  name: 'Celtic Golf Tours',
  url: import.meta.env.PUBLIC_SITE_URL || 'https://www.celticgolftours.com',
  email: import.meta.env.PUBLIC_SITE_EMAIL || 'info@celticgolftours.com',
  ogImage: import.meta.env.PUBLIC_SITE_OG_IMAGE || 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=70',
  phone: import.meta.env.PUBLIC_SITE_PHONE || '',
  address: {
    line1: import.meta.env.PUBLIC_SITE_ADDRESS_LINE1 || '',
    line2: import.meta.env.PUBLIC_SITE_ADDRESS_LINE2 || '',
    city: import.meta.env.PUBLIC_SITE_CITY || '',
    region: import.meta.env.PUBLIC_SITE_REGION || '',
    postalCode: import.meta.env.PUBLIC_SITE_POSTAL || '',
    country: import.meta.env.PUBLIC_SITE_COUNTRY || ''
  },
  socials: {
    facebook: import.meta.env.PUBLIC_SOCIAL_FACEBOOK || '',
    instagram: import.meta.env.PUBLIC_SOCIAL_INSTAGRAM || '',
    x: import.meta.env.PUBLIC_SOCIAL_X || '',
    linkedin: import.meta.env.PUBLIC_SOCIAL_LINKEDIN || ''
  }
};

/**
 * Headline figures shown on the home and about pages.
 *
 * Every one of these is a public claim about the business, so none of them
 * render until Terry has confirmed the real number. Set PUBLIC_STATS_VERIFIED
 * to 'true' once the values below are his, not ours — see tasks/content-needed.md.
 *
 * The placeholder values that used to be hardcoded here (500+ golfers, 4.9
 * rating, 150+ tours, 20+ years) were never verified and must not ship as-is.
 */
export const stats = {
  verified: import.meta.env.PUBLIC_STATS_VERIFIED === 'true',
  toursDelivered: import.meta.env.PUBLIC_STAT_TOURS_DELIVERED || '',
  yearsExperience: import.meta.env.PUBLIC_STAT_YEARS_EXPERIENCE || '',
  happyGolfers: import.meta.env.PUBLIC_STAT_HAPPY_GOLFERS || '',
  averageRating: import.meta.env.PUBLIC_STAT_AVERAGE_RATING || '',
  countries: import.meta.env.PUBLIC_STAT_COUNTRIES || ''
};

/** A single stat is safe to show only once the set has been signed off. */
export const showStat = (value: string) => stats.verified && Boolean(value);

/** True when at least one stat is confirmed, so empty containers can be skipped. */
export const hasStats = () =>
  stats.verified &&
  Object.entries(stats).some(([key, value]) => key !== 'verified' && Boolean(value));

export const hasAddress = () => {
  const { line1, line2, city, region, postalCode, country } = site.address;
  return Boolean(line1 || line2 || city || region || postalCode || country);
};

export const formatAddressLines = () => {
  const { line1, line2, city, region, postalCode, country } = site.address;
  const lines = [line1, line2].filter(Boolean) as string[];
  const cityLine = [city, region, postalCode].filter(Boolean).join(', ').trim();
  if (cityLine) lines.push(cityLine);
  if (country) lines.push(country);
  return lines;
};
