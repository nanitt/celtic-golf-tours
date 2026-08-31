# Handoff — Celtic Golf Tours

**Written 31 Aug 2026.** Supersedes the 18 Aug handoff. Read this before
touching anything.

The site is public at `celtic-golf-tours.vercel.app` with no password gate, so
anything broken is broken for real visitors right now.

---

## 1. Where the work is

**Branch `terry-restructure`, 9 commits ahead of `main`, not pushed and not
merged.** `main` is 1 commit ahead of where it was (the security hardening and
Astro 7 upgrade that had been sitting uncommitted).

The branch implements the changes Terry asked for in his August review call.
Nothing on it is half-finished; each commit builds and typechecks. It has not
been deployed or seen by Terry.

To pick up: `git checkout terry-restructure && npm ci && npm run check && npm run build`.

---

## 2. What Terry asked for, and what was done

| Requirement | State |
|---|---|
| "Centre Holidays" on every page (licensed Ontario operator) | Done. `OperatorLine.astro`, imported by the footer and by `coming-soon.astro` / `login.astro`, which bypass the Layout. Verified on all 17 routes. |
| Buddy Trips and Concierge Trips as distinct offerings | Done. `/trips`, `/trips/buddy`, `/trips/concierge`, from `src/data/trip-types.ts`. |
| Feature five regions; drop St Andrews and Southwest Ireland | Done. `src/data/destinations.ts` + `map-regions.ts`. No live reference to the removed courses remains. |
| Featured 2028 Highlands trip | Done as a teaser — no price, no dates, links to `/contact`. |
| 18-month booking lead time | Done. Homepage, `/trips/*`, `/destinations`, `/experiences`, the FAQ, the contact sidebar and the chat widget. |
| Booking vs general enquiry routing | Done. `enquiryType` field; recipient chosen server-side. |
| .com and .ca, one primary | Code done — `PUBLIC_SITE_URL` drives everything. **The Vercel domain redirect is not set up; see §5.** |
| Photography over copy | Structure done, copy cut. **All 47 image slots are still stock.** |

---

## 3. Start here — the two things that will bite

### 3.1 Do NOT set `PUBLIC_SANITY_PROJECT_ID` in production

The featured 2028 Highlands trip lives in the fallback array in
`src/data/hosted-experiences.ts`. Setting the project id makes the site read
Sanity *instead of* the fallback, and the dataset is empty — so Terry's
featured trip silently disappears and the "next season is being finalised"
empty state comes back.

This is already happening on any local dev server, because `.env.local` sets
the project id. If the Highlands card is missing locally, that is why, not a
bug. To see production behaviour locally, blank the variable and restart.

If Sanity is switched on, recreate the teaser as a document first
(`teaser: true`, `datesTbc: true`, `startDate: 2028-01-01`, no price).

### 3.2 The preview cookie changed — the old curl recipe no longer works

The 18 Aug handoff says to use `curl -b "auth=authenticated"`. **That is now
wrong** and will just redirect you to `/login`. The security hardening replaced
the fixed cookie with an expiring HMAC-signed `preview_session`
(`src/lib/preview-session.ts`). Log in properly instead:

```bash
curl -s -c /tmp/jar -X POST http://localhost:4321/api/auth/login \
  -H "Origin: http://localhost:4321" -d "password=$SITE_PASSWORD" -o /dev/null
curl -s -b /tmp/jar http://localhost:4321/
```

---

## 4. Rules this codebase enforces

### Do not ship unverifiable claims

This is the constraint that shaped most of the work. A prior session removed
invented statistics, fake scarcity badges and a chatbot recommending a product
that never existed. Two gates exist, both in `src/data/site.ts`:

- `PUBLIC_STATS_VERIFIED` → `showStat()` / `hasStats()`. Headline figures.
- `PUBLIC_COURSE_ACCESS_VERIFIED` → `courseAccessVerified`. Anything that
  promises a tee time.

**The distinction that matters:** "Cruden Bay is in Northern Scotland" is
geography and always renders. "We can get you on Cruden Bay" is a commercial
claim and waits for Terry. So course names appear as lists under a region
heading, never in a sentence with *play*, *secure*, *access* or *guaranteed*.
This is written into the header of `src/data/destinations.ts`; read it before
writing destination copy.

`signatureHole` and `established` in `map-regions.ts` are optional for the same
reason — they are factual claims about real clubs, and were omitted wherever we
were not certain rather than guessed. CGT should confirm all of them.

### The two data paths must stay symmetrical

`src/data/sanity-experiences.ts` wraps `src/data/hosted-experiences.ts`. Any
field added to one must be added to **five** places or behaviour diverges the
moment the CMS is switched on:

1. the `HostedExperience` interface
2. the fallback array entry
3. `SanityExperienceDoc`
4. `mapToExperience()`
5. `src/sanity/schema/experience.ts`

Divergence here is what put stale 2025 departures on the homepage.

### Drift between the two destination data files is a type error, not a runtime check

`Course.subRegionId` in `map-regions.ts` is typed against `SUB_REGION_IDS` in
`destinations.ts`, so a mismatch fails `npm run check`.

**It deliberately is not a runtime assertion.** One was tried and does not work
here: `output: 'server'` means module top-level code does not execute until a
request arrives, so an import-time `throw` is a production 500 rather than a
failed build. Verified — a bad id passed `npm run build` cleanly. If you add
cross-file invariants, make them types.

---

## 5. Outstanding work

### Ours

- [ ] **Deploy the branch to a preview URL and show Terry** before merging.
- [ ] **Add the domains in Vercel.** Both `.com` and `.ca` are owned. Add both
      plus their `www` variants, and set `celticgolftours.ca` to redirect (308)
      to `www.celticgolftours.com`. Deliberately *not* in `vercel.json` — that
      file is strict JSON and one malformed key has already killed a deploy
      before the build with no logs — and deliberately not in middleware, which
      would spend a function invocation on every `.ca` request.
- [ ] **Set `PUBLIC_SITE_URL`** in Vercel Production. It is the single flip that
      moves canonical URLs, `robots.txt`, the sitemap and the enquiry email.
- [ ] **Set `BOOKING_EMAIL=celticgolftours@centreholidays.com`** in Vercel.
      Without it, enquiries fall back to `NOTIFICATION_EMAIL`.
- [ ] **Verify a sending domain in Resend** and set `ENQUIRY_FROM_EMAIL`.
      Currently sends from `onboarding@resend.dev`, which only delivers to the
      account owner. Blocked on DNS, which is now unblocked.
- [ ] **Rotate the borrowed Resend key.** The contact form authenticates with
      the API key from a different client project (`golf-ai-agency`). Rotating
      that key for the other client silently kills Celtic's contact form.
- [ ] Cloudflare Turnstile widget for the production domain, and a Vercel
      Firewall rate-limit rule on `POST /api/contact`.
- [ ] Rotate `SANITY_API_WRITE_TOKEN` — it was pasted into a chat transcript.

### Terry's

`tasks/content-needed.md` is current as of this session and is the agenda for
the next call. The short version:

- **Photography is the only thing genuinely gating launch.** 47 slots, all
  stock. Every image on the site now comes from `src/data/images.ts` and
  nowhere else, so `npm run images:audit` lists the complete set and a swap is
  a one-line change per photo.
- The TICO registration number. Centre Holidays renders on every page, but no
  registration number appears until `PUBLIC_TICO_REGISTRATION` is set.
- Whether Celtic Golf Tours is a *trading name* of Centre Holidays or a
  separate company — decides `legalName` vs `parentOrganization` in the JSON-LD.
  It currently says `parentOrganization`, which is true either way.
- What "Celtic Golf Centre" was meant to be. It was asserted twice on `/about`
  as the parent company; replaced with Centre Holidays.
- His direct email, for `GENERAL_EMAIL`.
- Which of the fifteen courses CGT can actually secure. He named only the three
  Northern Scotland ones.
- Real 2028 Highlands details, to turn the teaser into a listing.
- Testimonials. The page is noindexed and out of the nav until they exist.

---

## 6. Gotchas that will cost you an hour each

- **`vercel.json` is strict JSON.** No comment keys, not even `"//"`. A deploy
  with one fails schema verification *before building* — 0ms build, no logs.
  Use `npx vercel --prod` to see the real error.
- **`astro.config.mjs` needs `loadEnv`, not `process.env`.** The file runs
  before Astro reads `.env`; using `process.env` silently unregistered the
  Sanity integration and made `/studio` 404. `site:` now depends on this too.
- **Astro blocks cross-origin POSTs.** `curl -X POST /api/contact` returns 403
  unless you send `-H "Origin: <site>"`. Browsers always do.
- **`npm run build` writes both `dist/` and `.vercel/output/`.** There is no
  prerendered HTML for the SSR routes, so test against a running server rather
  than grepping the output.
- **`robots.txt` is now a route, not a static file** (`src/pages/robots.txt.ts`),
  so unlike a `public/` asset it passes through middleware. It and
  `/sitemap-index.xml` are in `PUBLIC_PATHS` for that reason — if you touch
  that list, check `/robots.txt` still returns 200 while `SITE_PASSWORD` is set.
- **`npm run dev` detaches.** Logs are not in your shell; use `npx astro dev logs`
  and `npx astro dev stop`. A second `astro dev` will refuse to start.
- **`npm run check` (`tsc --noEmit`) is the real gate.** `astro build` does not
  typecheck, so a type error — including the destination-drift one — passes the
  build. Run check before build.
- **Don't run `npm run seed`.** It pushes the four sample 2025 trips into Sanity
  — the exact stale data that was removed.

---

## 7. Known, unaddressed

Ten design-hook findings across `global.css`, `Header.astro`, `coming-soon.astro`
and `login.astro`: `transition: width` on the brass underline-reveal hovers, the
`--ease-spring` bounce token, and the custom cursor's width/height transition.
All pre-existing and deliberate parts of the design system, none introduced by
this branch, none fixed or suppressed. If they should be addressed, that is its
own pass — `/impeccable audit` lists them.

Also unaddressed and pre-existing: `/terms` and `/privacy` are placeholder text
with a circular governing-law clause and an uncapped injury disclaimer. Those
need a lawyer, not an edit.
