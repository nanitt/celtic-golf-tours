import type { APIRoute } from 'astro';
import { site } from '../data/site';

/**
 * robots.txt as an endpoint rather than a file in public/.
 *
 * The static version hardcoded the .com sitemap URL. The site now answers on
 * both .com and .ca, so the origin has to follow PUBLIC_SITE_URL like every
 * other canonical URL does.
 *
 * Note: because this is a route and not a static asset, it passes through
 * src/middleware.ts — it is listed in PUBLIC_PATHS so the preview password
 * gate does not redirect crawlers to /login.
 */
export const GET: APIRoute = ({ request, site: astroSite }) => {
  // Review deployments are public for feedback but should never be crawled.
  if (new URL(request.url).hostname.endsWith('.vercel.app')) {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const origin = (astroSite?.href ?? site.url).replace(/\/$/, '');

  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /login',
    'Disallow: /api/',
    'Disallow: /studio',
    `Sitemap: ${origin}/sitemap-index.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
