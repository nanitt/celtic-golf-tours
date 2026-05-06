import { defineMiddleware } from 'astro:middleware';

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout', '/studio'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Coming Soon gate: serve holding page for all routes when enabled
  const comingSoon = import.meta.env.COMING_SOON === 'true';
  if (comingSoon) {
    // Allow static assets and Sanity Studio through
    if (
      pathname === '/coming-soon' ||
      pathname.startsWith('/_astro/') ||
      pathname.startsWith('/studio') ||
      pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)
    ) {
      return next();
    }
    return context.rewrite('/coming-soon');
  }

  // If SITE_PASSWORD is not set, skip auth entirely (public site)
  const sitePassword = import.meta.env.SITE_PASSWORD;
  if (!sitePassword) {
    return next();
  }

  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return next();
  }

  // Allow static assets
  if (pathname.startsWith('/_astro/') || pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    return next();
  }

  // Check for auth cookie
  const authCookie = context.cookies.get('auth');

  if (!authCookie || authCookie.value !== 'authenticated') {
    // Redirect to login
    return context.redirect('/login');
  }

  return next();
});
