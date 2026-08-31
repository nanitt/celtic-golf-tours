# Content Needed From Terry

**Target:** site live **31 Aug 2026**
**Prepared:** 15 Aug 2026 · **Updated:** 31 Aug 2026 after Terry's review call

The site has been restructured to the region list, trip types, branding and
enquiry routing agreed on the call. What remains below is what only Terry can
supply.

Everything below blocks launch and only Terry can answer it. The site is
built; these are the gaps. Ordered by how much they hold up.

---

## 1. Photography — the big one

47 slots, all still stock. Every hero, region band, trip-type card and CTA
background is a placeholder.

Every image on the site now comes from `src/data/images.ts` — there are no
image URLs anywhere else — so `npm run images:audit` lists the complete set and
dropping in a real photo is a one-line change.

Originally asked for on **19 May 2026**: *"please send over all imagery you
have; the more the better! High res is great."* Still outstanding.

Minimum to launch:
- [ ] 1 hero image (landscape, 2000px+ wide)
- [ ] 1 photo per region: Northern Scotland, East Lothian, Northern Ireland,
      Northwest Ireland, Dublin
- [ ] 1 photo each for Buddy Trips and Concierge Trips
- [ ] 1 photo for the featured 2028 Highlands trip
- [ ] 1 About-page image (the team, the Centre Holidays office, or a trip)
- [ ] 1 OG/social share image (1200×630) → `PUBLIC_SITE_OG_IMAGE`

If real photos aren't available for every slot, say so on the call — better to
cut a section than ship stock.

## 2. The numbers

These were placeholders invented during the build. **They no longer render** —
nothing appears until confirmed, so the site is safe to publish as-is.

| Claim | Placeholder was | Real number? | Env var |
|---|---|---|---|
| Happy golfers | 500+ | | `PUBLIC_STAT_HAPPY_GOLFERS` |
| Average rating | 4.9 | | `PUBLIC_STAT_AVERAGE_RATING` |
| Tours delivered | 150+ | | `PUBLIC_STAT_TOURS_DELIVERED` |
| Years' experience | 20+ | | `PUBLIC_STAT_YEARS_EXPERIENCE` |
| Countries | 2 | | `PUBLIC_STAT_COUNTRIES` |

Then set `PUBLIC_STATS_VERIFIED=true` to switch them back on.

**An average rating needs a real review source.** If there's no review platform
behind it, drop that one permanently.

## 3. Course access — now gated, but still needed

Course names render as *geography* ("these are the courses in Northern
Scotland"). Nothing on the site promises a tee time at any of them, because
that is a commercial claim we cannot verify. Every version of "we can get you
on it" has been removed.

- [ ] Confirm which of these CGT can actually secure tee times at, by region:
  - **Northern Scotland** — Royal Dornoch, Cruden Bay, Machrihanish Dunes
  - **East Lothian** — Muirfield, North Berwick, Gullane
  - **Northern Ireland** — Royal Portrush, Royal County Down, Portstewart
  - **Northwest Ireland** — County Sligo, Enniscrone, Carne
  - **Dublin** — Portmarnock, The Island, Royal Dublin
- [ ] Terry named only the three Northern Scotland courses on the call. The
      other twelve are the courses that define each region — confirm or replace
      them.
- [ ] Once confirmed, set `PUBLIC_COURSE_ACCESS_VERIFIED=true` to allow access
      wording back on.
- [ ] Confirm the signature holes and founding years in
      `src/data/map-regions.ts`. They are factual claims about real clubs and
      were left out wherever we were not certain.

## 3a. New since the review call

- [ ] **TICO registration number** → `PUBLIC_TICO_REGISTRATION`. Centre
      Holidays now appears on every page as the licensed Ontario operator, but
      no registration number renders until this is set. Ontario advertising
      rules expect the number, so this is compliance, not decoration.
- [ ] **Is Celtic Golf Tours a registered trading name of Centre Holidays, or a
      separate company operating under them?** This decides whether the
      structured data says `legalName` or `parentOrganization`. It currently
      says `parentOrganization`, which is true either way.
- [ ] **"Celtic Golf Centre"** appeared twice on /about as the parent company.
      That is not the licensed operator, so it was replaced with Centre
      Holidays. If Celtic Golf Centre is a real, separate thing Terry wants
      credited, we need his wording for it.
- [ ] **Terry's direct email** → `GENERAL_EMAIL`. Booking enquiries already go
      to `celticgolftours@centreholidays.com`. General enquiries currently fall
      back to that same inbox — they are delivered, not dropped, and the
      subject line says "General enquiry" so they can be forwarded.
- [ ] **The 2028 Highlands trip.** It is live as a teaser with no dates and no
      price, linking to the contact form. To turn it into a real listing we need
      the season, the group size, whether it is a Buddy or Concierge trip, and
      eventually the price.
- [ ] **Confirm 18 months** is the right planning window, and that it applies to
      both trip types. It now appears on the homepage, /trips, both trip pages,
      /destinations, /experiences, the FAQ, the contact form and the chat widget.

## 4. Testimonials

Currently a "coming soon" placeholder (the original samples were invented).

- [ ] 3–5 real quotes, each with a name and ideally trip + year
- [ ] Written permission to publish each one

## 5. Business details — all empty in config

- [ ] Phone → `PUBLIC_SITE_PHONE`
- [ ] Mailing address → `PUBLIC_SITE_ADDRESS_*`
- [ ] Facebook / Instagram / X / LinkedIn → `PUBLIC_SOCIAL_*`
- [x] Final domain — both .com and .ca owned; .com is primary and .ca redirects
      to it. Set `PUBLIC_SITE_URL` in Vercel and add the .ca redirect at the
      domain level.

## 6. Policy copy

FAQ and terms are generic placeholder text. Needs CGT's real language for:

- [ ] Booking and deposit terms
- [ ] Cancellation policy
- [ ] Handicap requirements (if any)
- [ ] What's included: accommodation tier, tee-time access, transfers, support
      (the current inclusions list was rewritten to drop "guaranteed tee times"
      and "4 and 5-star properties we've personally stayed in")

## 7. Company story

- [ ] Real CGT origin story for the About page
- [ ] The Centre Holidays relationship, in Terry's words
- [ ] Host bios + headshots, if hosted trips are real

## 8. Sanity CMS

`PUBLIC_SANITY_PROJECT_ID` is empty in production, so trips render from the
fallback data in `src/data/hosted-experiences.ts` — which is where the featured
2028 Highlands teaser lives.

> **Do not set `PUBLIC_SANITY_PROJECT_ID` in production until a trip exists in
> the dataset.** The moment it is set, the site reads Sanity *instead of* the
> fallback, and the dataset is currently empty — so Terry's featured 2028 trip
> would silently disappear and the "next season is being finalised" empty state
> would come back. This is exactly what happens on a local dev server today,
> where the project id is set in `.env.local`.

Decide:

- [ ] Connect Sanity, recreate the Highlands teaser as a document, **then** set
      the project id, or
- [ ] Drop the CMS for launch and keep the trips in `hosted-experiences.ts`

---

## Launch switches (ours, not Terry's)

- [ ] `COMING_SOON=true` → `false`
- [ ] Remove `SITE_PASSWORD` gate
- [x] Set `PUBLIC_SITE_URL` for canonical URLs + sitemap in Vercel Production
      (takes effect with the next production deployment)
- [ ] Verify contact form delivers to a monitored inbox

## Blockers for Terry, restated

**Photography (§1) is the one that actually gates launch.** Everything else on
this list either renders safely without an answer or is a single env var.

The trip sections no longer show an empty state — the 2028 Highlands teaser
fills them — so the "decision on hosted trips" is no longer urgent. Real dates
and a price turn it from a teaser into a listing whenever Terry has them.

## Done

- [x] IAGTO membership logo on every page (footer) — 15 Aug
- [x] Unverified stats no longer render — 15 Aug
- [x] `prefers-reduced-motion` handled across components
- [x] **Contact form actually delivers** — was a Netlify form on Vercel, silently
      discarding every enquiry while telling senders it had arrived. Now
      `src/pages/api/contact.ts` via Resend, verified end-to-end — 18 Aug
- [x] **Scroll reveals fixed for production** — the activator was loaded by an
      unbundled root-absolute path, so it 404'd in prod and left most content at
      `opacity: 0` — 18 Aug
- [x] **Hero headline no longer invisible** — was server-rendered at `opacity:0`
      by a Framer Motion island; rebuilt server-side with CSS animation. Dropped
      the last React island (~300 KB of JS) — 18 Aug
- [x] **Stale departures removed** — all four trips were 2025, one badged
      "Only 4 Left" against $14,500. Added ISO `startDate` + date filtering — 18 Aug
- [x] **Testimonials contradiction resolved** — "hundreds of golfers" removed — 18 Aug
- [x] **Contrast fixed to WCAG AA** — section labels were 2.26:1, now 4.78:1 — 18 Aug

## Follow-ups (not blocking the demo)

- [ ] **Verify a sending domain in Resend.** Enquiries currently send from
      `onboarding@resend.dev` because `golfagency.ca` is unverified. Works, but
      must not ship. Verify `celticgolftours.com` (needs DNS — likely Terry or
      Centre Holidays), then set `ENQUIRY_FROM_EMAIL`.
- [ ] **Set production env on Vercel:** `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL`,
      and `NOTIFICATION_EMAIL=celticgolftours@centreholidays.com`. Local dev
      points at Nate so testing never emails the client.
- [ ] Tap targets below 44×44 in header/footer nav
- [ ] `h2 → h4` heading skip on the Scotland/Ireland pages; `/coming-soon` has no `h1`
- [ ] 55 decorative SVGs need `aria-hidden="true"`
- [ ] Dead code: two unused parallax systems, `AmbientSoundToggle`, unused Celtic font tokens
