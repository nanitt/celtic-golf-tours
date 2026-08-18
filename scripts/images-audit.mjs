/**
 * Lists every image slot still using stock photography.
 * Run: npm run images:audit
 */
import { readFileSync } from 'fs';

const src = readFileSync(new URL('../src/data/images.ts', import.meta.url), 'utf-8');

const slots = [...src.matchAll(
  /(\w+):\s*stock\('([^']+)',\s*\n?\s*'([^']*(?:\\'[^']*)*)'\)/g
)].map(([, key, photo, needs]) => ({ key, photo, needs: needs.replace(/\s+/g, ' ') }));

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
