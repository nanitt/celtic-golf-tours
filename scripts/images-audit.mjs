/**
 * Lists every image slot still using stock photography, and flags any two
 * full-bleed hero or CTA slots that have ended up sharing one photograph.
 * Run: npm run images:audit
 */
import { readFileSync } from 'fs';

const src = readFileSync(new URL('../src/data/images.ts', import.meta.url), 'utf-8');

const imageConstants = Object.fromEntries(
  [...src.matchAll(/const\s+(\w+)\s*=\s*'([^']+)';/g)].map(([, key, value]) => [key, value])
);

const slots = [...src.matchAll(
  /(\w+):\s*stock\(([^,]+),\s*\n?\s*'([^']*(?:\\'[^']*)*)'\)/g
)].map(([, key, ref, needs]) => {
  const value = ref.trim();
  const photo = value.startsWith("'") ? value.slice(1, -1) : imageConstants[value];
  return { key, photo, needs: needs.replace(/\s+/g, ' ') };
});

const real = [...src.matchAll(/(\w+):\s*\{\s*src:\s*'([^']+)'[^}]*placeholder:\s*false/g)];

console.log(`\n  Celtic Golf Tours — image audit\n`);
console.log(`  ${slots.length} slot${slots.length === 1 ? '' : 's'} still on stock photography`);
console.log(`  ${real.length} replaced with real photography\n`);

if (slots.length) {
  const width = Math.max(...slots.map(s => s.key.length));
  for (const s of slots) {
    console.log(`  ${s.key.padEnd(width)}  ${s.needs}`);
  }
  console.log(`\n  To replace: drop the file in public/images/, set src to its path,`);
  console.log(`  and change placeholder: true -> false in src/data/images.ts\n`);
} else {
  console.log(`  🎉 No stock imagery left.\n`);
}

/*
 * Heroes and CTA bands render full-bleed, so a photo reused across two of them
 * is obvious to a visitor in a way a repeated course thumbnail is not. These
 * slots are expected to stay one-photo-each; the course and region slots below
 * them are still deliberately shared while the real photography is outstanding.
 */
const heroSlots = [
  'homeHero', 'homeCta', 'aboutHero', 'experiencesHero', 'destinationsHero',
  'destinationsCta', 'scotlandHero', 'scotlandCta', 'irelandHero', 'irelandCta',
  'contactHero', 'thankYouHero', 'testimonialsHero', 'notFoundHero', 'heroFallback',
];

const byPhoto = new Map();
for (const key of heroSlots) {
  const slot = slots.find(s => s.key === key);
  if (!slot) continue;
  if (!byPhoto.has(slot.photo)) byPhoto.set(slot.photo, []);
  byPhoto.get(slot.photo).push(key);
}

const collisions = [...byPhoto].filter(([, keys]) => keys.length > 1);

if (collisions.length) {
  console.log(`  ⚠ ${collisions.length} hero/CTA photo${collisions.length === 1 ? '' : 's'} used more than once:\n`);
  for (const [photo, keys] of collisions) {
    console.log(`  ${photo}`);
    console.log(`    ${keys.join(', ')}`);
  }
  console.log(`\n  Give each of these its own image in src/data/images.ts.\n`);
} else {
  console.log(`  ✓ All ${heroSlots.length} hero/CTA slots use a distinct photograph.\n`);
}
