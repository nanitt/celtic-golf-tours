# Handoff — Celtic Golf Tours

**Written 18 Aug 2026.** Picking up mid-task. Read this before touching anything.

Deadline: **site live 31 Aug 2026**. It is already public at
`celtic-golf-tours.vercel.app` with no password gate, so anything broken is
broken for real visitors right now.

---

## 1. START HERE — the open bug

**The date filter does not work through the Sanity CMS path.**

`src/data/hosted-experiences.ts` exports `isUpcoming(exp, now?)`, and
`src/data/sanity-experiences.ts` calls `.filter(exp => isUpcoming(exp))` in
`getAllExperiences`, `getUpcomingExperiences` and `getFeaturedExperiences`.
The hardcoded fallback path filters correctly. **The Sanity path does not.**

Reproduced today: created an experience with `startDate: "2027-05-14"` — it
rendered on `/` and `/experiences` and correctly displaced the empty state.
Patched it to `"2025-05-14"` — **it kept rendering.** Confirmed via both
`api.sanity.io` and `apicdn.sanity.io` that the stored value really was
`2025-05-14`, so this is not CDN staleness.

### Why it matters more than it looks
This is the exact failure that put **2025 departures badged "Only 4 Left"
against a $14,500 price** on the homepage. That was fixed today for the
hardcoded path. Ship the CMS with this bug and it returns the moment the client
adds a trip.

### Things already ruled out
- Not CDN caching — raw API returns the correct past date.
- Not a missing field — `startDate` is in the Sanity schema
  (`src/sanity/schema/experience.ts`), in `SanityExperienceDoc`, and mapped in
  `mapToExperience` as `startDate: doc.startDate ?? ''`.
- Not the filter's edge cases — `isUpcoming` was unit-checked:
  `''`, `'garbage'` and past dates all return false; only future dates pass.

### Prime suspect
A **`.filter(isUpcoming)` arity bug** was already found and fixed once today in
`hosted-experiences.ts`: `Array.filter` passes the **index** as the second
argument, so a bare `filter(isUpcoming)` called `isUpcoming(exp, 0)` and
compared a Date against a number — always true. Check every call site for the
unwrapped form. Also verify the dev server actually restarted; Astro caches
config and integration state aggressively.

### How to reproduce
```bash
TOK=$(grep '^SANITY_API_WRITE_TOKEN=' .env.local | cut -d= -f2-)
# create a future trip
curl -s -X POST "https://7s3avwuo.api.sanity.io/v2021-06-07/data/mutate/production" \
  -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
  -d '{"mutations":[{"createOrReplace":{"_id":"tmp-test","_type":"experience",
       "name":"TMP","slug":{"_type":"slug","current":"tmp"},
       "startDate":"2027-05-14","dates":"May 2027","destination":"Scotland",
       "status":"open","featured":true,"sortOrder":0}}]}'
# restart dev, confirm it renders, then patch to 2025 and confirm it disappears
# ALWAYS delete afterwards:
curl -s -X POST "https://7s3avwuo.api.sanity.io/v2021-06-07/data/mutate/production" \
  -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
  -d '{"mutations":[{"delete":{"id":"tmp-test"}}]}'
```
The dataset is currently **empty (0 experiences)** — leave it that way.

---

## 2. Uncommitted work

`astro.config.mjs` is modified and **not committed**. It is a real fix, keep it.

The config read `process.env.PUBLIC_SANITY_PROJECT_ID`, but that file runs in
Node *before* Astro loads `.env` files — so the Sanity integration silently
never registered and `/studio` returned 404 even with the variable set. It now
uses Vite's `loadEnv`. With that in place **`/studio` returns 200 locally.**

Commit it regardless of the filter bug.

---

## 3. Then, in order

1. **Fix the filter**, re-run the reproduction above, delete the test doc.
2. **Enable Sanity on production:** set `PUBLIC_SANITY_PROJECT_ID=7s3avwuo` and
   `PUBLIC_SANITY_DATASET=production` in Vercel Production. Do **not** do this
   before the filter is fixed — production currently uses the hardcoded
   fallback and correctly shows an empty state.
3. **Add the production origin to Sanity → API → CORS origins**, credentials
   allowed, or Studio login fails on the live domain.
4. **Ask the owner to rotate `SANITY_API_WRITE_TOKEN`** — it was pasted into a
   chat transcript. Only `scripts/seed-sanity.mjs` uses it; the site and Studio
   do not.

---

## 4. Gotchas that will cost you an hour each

- **`vercel.json` is strict JSON.** No comment keys, not even `"//"`. A deploy
  with one fails schema verification *before building* — 0ms build, no logs,
  and `vercel inspect --logs` returns nothing useful. Use `npx vercel --prod`
  to see the real error.
- **`astro.config.mjs` needs `loadEnv`**, not `process.env`. See §2.
- **Astro 5 blocks cross-origin POSTs.** `curl -X POST /api/contact` returns
  403 "Cross-site POST form submissions are forbidden". That is correct — send
  `-H "Origin: <site>"` to test. Browsers always do.
- **`npm run build` outputs `.vercel/output/`, not `dist/`** (SSR + Vercel
  adapter). There is no prerendered HTML to grep; test against a running server.
- **The site is behind `SITE_PASSWORD` locally only.** Use
  `curl -b "auth=authenticated"`. Production has **no** env vars for
  `SITE_PASSWORD` or `COMING_SOON`, so it is fully public.
- **Two data paths must stay symmetrical.** `sanity-experiences.ts` wraps
  `hosted-experiences.ts`. Any filtering added to one must exist in the other,
  or behaviour diverges the moment the CMS is switched on. That divergence is
  the bug in §1.
- **Don't seed.** `npm run seed` pushes the four sample 2025 trips into Sanity
  — the exact stale data removed today.

---

## 5. Context you need before changing content

Most of today was removing things the site asserted that were not true:
invented statistics, 2025 departures with fake scarcity badges, a testimonials
page that claimed "hundreds of golfers" directly below "our first tours", a
chatbot recommending a product that never existed, and an FAQ contradicting the
Terms page on refunds.

**Do not add claims.** If a number, date, credential or service promise is not
verifiable, gate it or leave it out. The established pattern is
`PUBLIC_STATS_VERIFIED` in `src/data/site.ts`: values render only when
explicitly confirmed.

Two related open items, both needing the client, not code:
- **Photography** — 39 of 39 slots still stock. `npm run images:audit` lists
  them. `src/data/images.ts` is the single manifest; swapping is one file.
- **Positioning** — the homepage says "decades of showing up" while
  `/testimonials` says "our first tours". Needs real numbers from the owner.
  "Boutique" was already replaced with Centre Holidays / IAGTO backing.

---

## 6. Blocked on humans, not on you

- **The domain is not owned.** `celticgolftours.com` is parked on Dan.com,
  no MX records. Nothing launches, and no email domain can be verified.
- **Enquiries currently go to the developer, not the client.** The Resend
  sender is unverified (`onboarding@resend.dev`), which only delivers to the
  account owner. Do not point `NOTIFICATION_EMAIL` at the client until a domain
  is verified — the mail will simply fail.
- **Legal pages are placeholder text** with a circular governing-law clause and
  an uncapped injury disclaimer. Needs a lawyer, not an edit.

See `tasks/handoff.md` for the full ownership/launch checklist and
`tasks/content-needed.md` for everything owed by the client.
