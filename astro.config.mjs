// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

// This file runs in Node before Astro loads .env files, so process.env does not
// see PUBLIC_SANITY_PROJECT_ID from .env.local. loadEnv reads them explicitly.
// Without this the Sanity integration silently never registers and /studio 404s
// even though the variable is set — which looks exactly like "the CMS is broken".
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

const sanityProjectId = env.PUBLIC_SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;

/** @type {import('astro').AstroIntegration[]} */
const integrations = [];

if (sanityProjectId) {
  const sanity = (await import('@sanity/astro')).default;
  integrations.push(
    sanity({
      projectId: sanityProjectId,
      dataset: env.PUBLIC_SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production',
      useCdn: true,
      studioBasePath: '/studio',
    })
  );
}

integrations.push(
  react(),
  sitemap({
    filter: (page) =>
      !page.includes('/login') &&
      !page.includes('/api/') &&
      !page.includes('/studio') &&
      !page.includes('/destinations/england') &&
      !page.includes('/destinations/wales') &&
      // Holding page, and it already carries a noindex meta tag.
      !page.includes('/coming-soon') &&
      // Post-submit confirmation; nothing to land on from search.
      !page.includes('/contact/thank-you') &&
      // Still a placeholder. Restore when Terry supplies real quotes.
      !page.includes('/testimonials'),
  })
);

// https://astro.build/config
export default defineConfig({
    // Single source of truth for the canonical origin. The site answers on both
  // celticgolftours.com and .ca; .com is primary and .ca redirects to it at the
  // Vercel domain level, so switching primary is this one variable plus the
  // dashboard setting. Must come from loadEnv — process.env is empty here,
  // because this file runs before Astro reads .env.
  site: env.PUBLIC_SITE_URL || 'https://www.celticgolftours.com',
  output: 'server',

  adapter: vercel(),

  image: {
    remotePatterns: [{ protocol: "https" }],
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations,
});