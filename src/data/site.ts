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
