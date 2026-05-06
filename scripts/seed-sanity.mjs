#!/usr/bin/env node

/**
 * Seed script: creates the 4 existing experiences in Sanity.
 *
 * Usage:
 *   1. Set PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local
 *   2. npm run seed
 *
 * Images are NOT uploaded — upload hero images manually in Studio after seeding.
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

// Load .env.local
const envPath = new URL('../.env.local', import.meta.url);
try {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex);
    const value = trimmed.slice(eqIndex + 1);
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  console.error('Could not read .env.local — make sure it exists');
  process.exit(1);
}

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const experiences = [
  {
    _id: 'experience-st-andrews-pilgrimage-2025',
    _type: 'experience',
    name: 'The St Andrews Pilgrimage',
    slug: { _type: 'slug', current: 'st-andrews-pilgrimage-2025' },
    host: {
      name: 'Colin MacLeod',
      title: 'Head Golf Professional',
    },
    dates: 'May 15-22, 2025',
    destination: 'Scotland',
    description:
      'Walk in the footsteps of legends on this bucket-list journey through Scottish golf history. Play the Old Course at St Andrews, Carnoustie, and Kingsbarns while enjoying luxury accommodations and exclusive access.',
    highlights: [
      'Old Course at St Andrews',
      'Carnoustie Championship Course',
      'Kingsbarns Golf Links',
      'Fairmont St Andrews stay',
      'Whisky tasting experience',
    ],
    status: 'limited',
    price: 'From $14,500 CAD',
    spotsRemaining: 4,
    featured: true,
    sortOrder: 1,
  },
  {
    _id: 'experience-irish-links-adventure-2025',
    _type: 'experience',
    name: 'The Wild Atlantic Links',
    slug: { _type: 'slug', current: 'irish-links-adventure-2025' },
    host: {
      name: "Sean O'Connor",
      title: 'Ireland Golf Director',
    },
    dates: 'June 8-15, 2025',
    destination: 'Ireland',
    description:
      "Experience the raw beauty of Ireland's western coast with rounds at the world's most spectacular links courses. From the towering dunes of Ballybunion to the dramatic cliffs of Lahinch, this is links golf at its finest.",
    highlights: [
      'Ballybunion Old Course',
      'Lahinch Golf Club',
      'Waterville Golf Links',
      'Trump International Doonbeg',
      'Traditional Irish pub evening',
    ],
    status: 'open',
    price: 'From $12,300 CAD',
    featured: true,
    sortOrder: 2,
  },
  {
    _id: 'experience-royal-championship-2025',
    _type: 'experience',
    name: 'The Royal Championship Tour',
    slug: { _type: 'slug', current: 'royal-championship-2025' },
    host: {
      name: 'James Whitfield',
      title: 'Senior Tour Director',
    },
    dates: 'September 3-10, 2025',
    destination: 'England',
    description:
      "Play the courses where Open Championship history was made. This prestigious tour takes you through England's finest royal venues, complete with exclusive clubhouse access and championship-quality conditions.",
    highlights: [
      'Royal Birkdale Golf Club',
      'Royal Lytham & St Annes',
      'Royal Liverpool (Hoylake)',
      'Formby Golf Club',
      'Championship dinner experience',
    ],
    status: 'open',
    price: 'From $16,700 CAD',
    featured: true,
    sortOrder: 3,
  },
  {
    _id: 'experience-celtic-manor-retreat-2025',
    _type: 'experience',
    name: 'The Ryder Cup Heritage',
    slug: { _type: 'slug', current: 'celtic-manor-retreat-2025' },
    host: {
      name: 'David Evans',
      title: 'Wales Golf Specialist',
    },
    dates: 'July 20-25, 2025',
    destination: 'Wales',
    description:
      'Relive Ryder Cup glory at Celtic Manor and discover the hidden gems of Welsh golf. This intimate tour combines world-class courses with the stunning natural beauty of the Welsh countryside.',
    highlights: [
      'Celtic Manor Twenty Ten Course',
      'Royal Porthcawl Golf Club',
      'Pennard Golf Club',
      'Luxury spa experience',
      'Welsh castle dinner',
    ],
    status: 'sold_out',
    price: 'From $11,100 CAD',
    featured: false,
    sortOrder: 4,
  },
];

async function seed() {
  console.log(`Seeding ${experiences.length} experiences to project ${projectId} / ${dataset}...`);

  for (const exp of experiences) {
    try {
      await client.createOrReplace(exp);
      console.log(`  ✓ ${exp.name}`);
    } catch (err) {
      console.error(`  ✗ ${exp.name}:`, err.message);
    }
  }

  console.log('\nDone! Open /studio to upload hero images for each experience.');
}

seed();
