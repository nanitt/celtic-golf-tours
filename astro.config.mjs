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
      !page.includes('/destinations/wales'),
  })
);

// https://astro.build/config
export default defineConfig({
  // TODO: Replace with production domain
  site: 'https://www.celticgolftours.com',
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