# Content Needed From Terry

**Target:** site live **31 Aug 2026** (2027 Ireland trip posts 1 Sep)
**Prepared:** 15 Aug 2026 — use as the agenda for the review call

Everything below blocks launch and only Terry can answer it. The site is
built; these are the gaps. Ordered by how much they hold up.

---

## 1. Photography — the big one

85 stock (Unsplash) images across 21 files. Every hero, destination card, and
CTA background is a placeholder.

Originally asked for on **19 May 2026**: *"please send over all imagery you
have; the more the better! High res is great."* Still outstanding.

Minimum to launch:
- [ ] 1 hero image (landscape, 2000px+ wide)
- [ ] 1 photo per active destination (Scotland, Ireland, England, Wales)
- [ ] 1 About-page image (team, Celtic Golf Centre, or a trip)
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

## 3. Course access

The site currently claims CGT can get golfers onto: St Andrews, Royal Portrush,
Turnberry, Muirfield, Lahinch, Royal Dornoch, Ballybunion, Carnoustie.

- [ ] Confirm which of these you can actually secure tee times at
- [ ] Anything unconfirmed comes off — overpromising course access is the
      fastest way to a refund request

## 4. Testimonials

Currently a "coming soon" placeholder (the original samples were invented).

- [ ] 3–5 real quotes, each with a name and ideally trip + year
- [ ] Written permission to publish each one

## 5. Business details — all empty in config

- [ ] Phone → `PUBLIC_SITE_PHONE`
- [ ] Mailing address → `PUBLIC_SITE_ADDRESS_*`
- [ ] Facebook / Instagram / X / LinkedIn → `PUBLIC_SOCIAL_*`
- [ ] Final domain → `PUBLIC_SITE_URL`

## 6. Policy copy

FAQ and terms are generic placeholder text. Needs CGT's real language for:

- [ ] Booking and deposit terms
- [ ] Cancellation policy
- [ ] Handicap requirements (if any)
- [ ] What's included: accommodation tier, tee-time access, transfers, support

## 7. Company story

- [ ] Real CGT origin story for the About page
- [ ] The Centre Holidays relationship, in Terry's words
- [ ] Host bios + headshots, if hosted trips are real

## 8. Sanity CMS

`PUBLIC_SANITY_PROJECT_ID` is empty, so all trips render from fallback sample
data. Decide on the call:

- [ ] Connect Sanity and load real trips, **or**
- [ ] Drop the CMS for launch and hardcode the real trips

---

## Launch switches (ours, not Terry's)

- [ ] `COMING_SOON=true` → `false`
- [ ] Remove `SITE_PASSWORD` gate
- [ ] Set `PUBLIC_SITE_URL` for canonical URLs + sitemap
- [ ] Verify contact form delivers to a monitored inbox

## Blockers for Terry, restated for the call

The two that actually gate 31 Aug: **photography** (§1) and a **decision on
hosted trips** (§8) — every departure on the site had already happened, so those
sections now show "next season is being finalised" instead. Real 2027 dates and
photos turn both back on.

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
