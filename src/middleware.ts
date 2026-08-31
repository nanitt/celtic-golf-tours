import { defineMiddleware } from 'astro:middleware';
import { isValidPreviewSession } from './lib/preview-session';

// /robots.txt and /sitemap-index.xml must stay reachable behind the password
// gate: robots.txt is now an SSR endpoint rather than a file in public/, so
// unlike a static asset it passes through this middleware and would otherwise
// redirect to /login.
const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/contact',
  '/robots.txt',
  '/sitemap-index.xml',
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  // Every Vercel deployment URL is a review/technical host; the configured
  // .com is the only indexable origin. This keeps public review links from
  // competing with the canonical site in search results.
  const isVercelDeployment = context.url.hostname.endsWith('.vercel.app');
  const respond = async (response: Response | Promise<Response>) => {
    const resolved = await response;
    if (isVercelDeployment) resolved.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return resolved;
  };

  // Coming Soon gate: serve holding page for all routes when enabled
  const comingSoon = import.meta.env.COMING_SOON === 'true';
  if (comingSoon) {
    // Allow static assets and Sanity Studio through
    if (
      pathname === '/coming-soon' ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_astro/') ||
      pathname.startsWith('/studio') ||
      pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)
    ) {
      return respond(next());
    }
    return respond(context.rewrite('/coming-soon'));
  }

  // If SITE_PASSWORD is not set, skip auth entirely (public site)
  const sitePassword = import.meta.env.SITE_PASSWORD;
  if (!sitePassword) {
    return respond(next());
  }

  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return respond(next());
  }

  // Allow static assets
  if (pathname.startsWith('/_astro/') || pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    return respond(next());
  }

  // Check for auth cookie
  const previewSession = context.cookies.get('preview_session');

  if (!await isValidPreviewSession(previewSession?.value, sitePassword)) {
    // Redirect to login
    return respond(context.redirect('/login'));
  }

  return respond(next());
});
