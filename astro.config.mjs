// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const sanityProjectId = process.env.PUBLIC_SANITY_PROJECT_ID;

/** @type {import('astro').AstroIntegration[]} */
const integrations = [];

if (sanityProjectId) {
  const sanity = (await import('@sanity/astro')).default;
  integrations.push(
    sanity({
      projectId: sanityProjectId,
      dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
      useCdn: true,
      studioBasePath: '/studio',
    })
  );
}

integrations.push(
  react(),
  sitemap({
    filter: (page) =>
      !page.includes('/login') && !page.includes('/api/') && !page.includes('/studio'),
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