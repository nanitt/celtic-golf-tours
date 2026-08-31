# Security hardening — 2026-08-18

## Acceptance criteria

- [x] A forged `auth=authenticated` cookie cannot pass the preview gate.
- [x] Contact-form failures do not place visitor data in URLs, and inputs are bounded server-side.
- [x] Contact abuse protection can be enabled with a provider-backed challenge; required production setup is documented.
- [x] Production dependencies are upgraded only to a verified compatible release.
- [x] Build and focused security checks pass.

## Checklist

- [x] Replace the fixed preview cookie with an expiring HMAC-signed session.
- [x] Add request and field bounds; remove form-value redirects.
- [x] Add optional Turnstile verification and document the required Vercel variables.
- [x] Assess and apply a compatible Astro/Vercel security update.
- [x] Verify and record results.

## Working notes

- In-memory serverless rate limiting is not a reliable control; use Vercel Firewall rate limiting or a durable external store for production enforcement.
- The owner must rotate the previously exposed Sanity write token outside this repository.

## Production follow-up

- [ ] Create a Cloudflare Turnstile widget for the production domain and add both `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` to Vercel Production.
- [ ] Add a Vercel Firewall rate-limit rule for `POST /api/contact` (start with five requests per minute per IP, then tune from legitimate traffic).
- [ ] Rotate `SANITY_API_WRITE_TOKEN` and replace it in local/CI environments only where required.

## Results

- Preview access now requires an expiring HMAC-signed `preview_session` cookie; a forged `auth=authenticated` cookie is rejected.
- Contact submissions are bounded to 16 KiB and validated by field length. Failed submissions redirect only with an error code, never visitor data.
- Turnstile is fail-closed when its server secret is configured. The public script and CSP allowance render only when its site key is configured.
- Upgraded Astro 5 → 7.2.2, the Vercel adapter 8 → 11.0.5, and Sanity 5 → 6.9.2. Astro 7 required replacing HTML comments inside conditional template branches with Astro-safe fragments.
- `npm run build` and fresh-server signed-session, contact-privacy, and configured-Turnstile fail-closed checks passed. `npm audit --omit=dev` dropped from 56 findings (3 critical) to 19 (0 critical); remaining advisories need separate upstream review rather than an unsafe downgrade.

---

# CMS experience date filtering — 2026-08-18

## Acceptance criteria

- [x] A future-dated Sanity experience is returned by the site data functions.
- [x] Changing that experience to a past date removes it from all and featured/upcoming results.
- [x] The temporary Sanity document is deleted after verification.
- [x] `npm run build` succeeds.

## Checklist

- [x] Inspect every CMS and fallback use of `isUpcoming` for the `Array.filter` callback arity trap.
- [x] Run a live Sanity create → date change → query reproduction.
- [x] Verify the production build configuration retains the Studio environment loading fix.
- [x] Record results.

## Working notes

- The handoff says the dataset must remain empty; only a `tmp-test` document may be used and it must be deleted.
- `astro.config.mjs` already contains the `loadEnv` Studio registration fix in the current HEAD, despite no outstanding diff.

## Results

- All current `isUpcoming` call sites use wrapper callbacks, avoiding `Array.filter` passing its index as the `now` argument.
- A temporary Sanity entry was created with a 2027 departure, changed to 2025, and the Sanity client returned it as non-upcoming. The document was deleted; raw and CDN datasets both report zero experiences.
- The local authenticated `/studio` route returned 200.
- `npm run build` passed. A first attempt encountered an `ENOSPC` condition; removing the untracked, partial `dist/` output recovered enough space for the successful retry.

---

# Content Audit - Placeholder Copy and Imagery

Audit date: 2026-05-21

Scope checked: 43 source files under `src/pages/` and `src/components/`.

## Owner Content Tasks

### `src/pages/index.astro`
- Hero: replace Unsplash background with licensed CGT trip/course photography, ideally a recognizable links course from an actual offering.
- Course showcase: verify the claim that CGT can get golfers onto St Andrews, Royal Portrush, Turnberry, Muirfield, Lahinch, Royal Dornoch, Ballybunion, and Carnoustie; replace with actual bookable course list/access language.
- About intro: replace generic boutique/access copy with accurate CGT story, Canadian-market positioning, and real relationship/service details.
- About stats: verify or replace `150+ Tours Delivered`, `20+ Years' Experience`, and `2 Countries`.
- Destination grid: replace Unsplash-generated images from `src/data/destinations.ts` with real Scotland/Ireland/England/Wales destination photos once those offerings are active.
- Stats bar: verify or replace `500+ Happy Golfers`, `4.9 Average Rating`, `150+ Tours Completed`, and `2 Countries`.
- Hosted experiences: confirm Sanity is populated; otherwise replace fallback sample trips, hosts, dates, pricing, availability, and images from `src/data/hosted-experiences.ts`.
- Final CTA: replace Unsplash background with a real CGT course/trip photo.

### `src/pages/about.astro`
- Hero: replace Unsplash background with real CGT team, Celtic Golf Centre, or tour photography.
- Our Story: replace generic origin story and first-hand course claims with accurate company history and founder/team details.
- Our Story image: replace Unsplash supporting image with a real CGT/team/course image.
- Values: verify claims that every recommended course has been played, that CGT knows course staff, and that every group is capped at twelve.
- By the Numbers: verify or replace `500+`, `4.9`, `150+`, and `20+`.
- Heritage Wall embed: replace stock images/captions with licensed historical/course/CGT assets.
- Celtic Golf Centre connection: provide real relationship details and approved imagery.

### `src/pages/experiences.astro`
- Hero: replace Unsplash hero and broad "extraordinary experiences" copy with accurate CGT offering copy.
- Hosted experiences: confirm real hosted trip inventory, dates, status, spots remaining, hosts, highlights, and prices.
- Ways to Travel: replace generic Custom Tours, Small Group Tours, and Corporate Events descriptions/features with actual CGT services.
- Ways to Travel images: replace Unsplash images with real package/destination photography.
- What's Included: verify accommodation level, tee-time access, transfer inclusion, and support terms.
- FAQ: replace operational, booking, accommodation, handicap, customization, and cancellation answers with approved CGT policy language.

### `src/pages/experiences/[id].astro`
- Experience detail pages: real content depends on Sanity or fallback data; verify every displayed experience name, description, date, destination, image, status, price, spots remaining, host, and highlight before publishing.
- Host block: replace initials-only placeholder with real host bio/headshot if host-led experiences are real.

### `src/pages/destinations/index.astro`
- Hero: replace Unsplash image with real destination/course photography.
- Interactive map: verify all course callouts and popup assets against actual CGT destination inventory.
- Destination cards: replace Unsplash-generated images with real destination photography.
- Why Travel With Us: verify priority access, local knowledge, and logistics claims.
- CTA: replace Unsplash background and generic recommendation copy with real planning guidance for Canadian golfers.

### `src/pages/destinations/scotland.astro`
- Course list: verify each course is part of real CGT Scotland offerings and update blurbs to actual itinerary/course notes.
- Images: replace all Unsplash course/hero URLs with real Scotland course photos.
- Highlights and overview: replace generic luxury/cultural bullets with confirmed Scotland itinerary inclusions and Canadian traveler details.

### `src/pages/destinations/ireland.astro`
- Course list: verify each course is part of real CGT Ireland offerings and update blurbs to actual itinerary/course notes.
- Images: replace all Unsplash course/hero URLs with real Ireland/Northern Ireland course photos.
- Highlights and overview: replace generic hospitality/scenery copy with confirmed Ireland itinerary inclusions and Canadian traveler details.

### `src/pages/destinations/england.astro`
- Redirected page still contains placeholder content; if England is reactivated, replace all sample course blurbs, highlights, overview copy, and Unsplash images with real England offering content.

### `src/pages/destinations/wales.astro`
- Redirected page still contains placeholder content; if Wales is reactivated, replace all sample course blurbs, highlights, overview copy, and Unsplash images with real Wales offering content.

### `src/pages/testimonials.astro`
- Hero: replace Unsplash background with real guest/tour photography.
- Testimonials body: add real testimonials, names/permissions, locations, and trip context when available, or keep the page hidden.
- CTA: remove or verify "hundreds of golfers" because it conflicts with the "first tours" placeholder message.

### `src/pages/contact.astro`
- Hero: replace Unsplash background with real CGT trip-planning/destination image.
- Form options: add England and Wales if CGT wants all four countries represented; update sample date/name/phone placeholders for Canadian golfers.

### `src/pages/contact/thank-you.astro`
- Hero: replace Unsplash background with approved CGT/destination photography.
- Response copy: verify the 24-hour response-time promise.

### `src/pages/404.astro`, `src/pages/privacy.astro`, `src/pages/terms.astro`
- Hero images: replace repeated Unsplash fallback backgrounds with approved CGT imagery.
- Legal pages: existing legal TODO remains; get privacy/terms reviewed before launch without changing pricing/contact/legal terms ad hoc.

### `src/pages/coming-soon.astro`
- Value propositions: verify priority access, played-course/local-expertise claims, and white-glove service language.
- Background image: verify `/images/turnberry.jpg` is licensed and accurately depicts an intended CGT course/region.

### `src/components/Hero.astro`
- Default background: replace Unsplash fallback with an approved local CGT image or require all callers to pass a real image.

### `src/components/DestinationPage.astro`
- Generic itinerary: replace the seven-day sample timeline with destination-specific real sample itineraries or clearly label it as illustrative.

### `src/components/HorizontalTimeline.astro`
- Timeline: replace invented "day in the life" stops, Lahinch/Doonbeg details, meal descriptions, Redbreast/Michelin copy, and Unsplash images with a real sample day.

### `src/components/HeritageWall.astro`
- Gallery: replace Unsplash images, captions, and location labels with licensed historical/course/CGT assets.
- Quote: verify brand fit and permission/context for the Arnold Palmer quote.

### `src/components/DigitalCaddie.astro`
- Chat persona: approve or replace the fictional "Seamus" digital caddie identity with real CGT support branding.

### Data Dependencies Surfacing Through Audited Pages
- `src/data/hosted-experiences.ts`: fallback contains likely invented hosts (`Colin MacLeod`, `Sean O'Connor`, `James Whitfield`, `David Evans`), 2025 dates, prices, availability, trip names, highlights, and Unsplash images. Replace with real data or remove fallback before launch.
- `src/data/destinations.ts`: active destinations currently filter to Scotland/Ireland only, while the business context includes Scotland, Ireland, England, and Wales. Decide whether England/Wales are coming soon or active, then update copy/images accordingly.
- `public/textures/pressed-paper.webp`, `public/textures/linen-subtle.webp`, `public/audio/wind-over-dunes.mp3`, and `public/audio/ocean-waves.mp3` were previously documented as placeholders; prepare real approved assets or remove unused sensory features.

## Recommended Asset Prep
- Real hero photos for home, about, experiences, destinations, contact, testimonials, legal/utility pages, and CTA sections.
- Destination/course photo sets for Scotland, Ireland, England, and Wales, with licensing and course/location captions.
- Real CGT service proof: courses offered, tee-time/access wording, group-size policy, inclusions, support hours, and cancellation/payment terms.
- Real testimonials with permission, customer location, trip destination, and date.
- Real hosted-experience inventory: names, dates, hosts, prices, availability, inclusions, itinerary highlights, and photos.
- Canadian golfer specifics: CAD pricing policy, flight guidance, travel insurance notes, departure planning window, and Canadian contact/phone examples.

---

# Superdesign Exploration - COMPLETED

## Summary

Successfully set up and explored Superdesign for the Celtic Golf Tours project.

### What Was Done

1. **Installed CLI**: `npm install -g @superdesign/cli@latest`
2. **Authenticated**: `superdesign login` (team: Personal)
3. **Initialized Skills**: `superdesign init --force`
4. **Created Project**: "Celtic Golf Tours"
5. **Created Design Draft**: Home Hero reproduction
6. **Iterated with Variations**: Dark moody + Light airy versions

### Assets Created

| Item | ID | URL |
|------|-----|-----|
| Project | `999af02d-4a67-46d9-a2ee-8055bd8ceeee` | [View Project](https://app.superdesign.dev/teams/f4e7610b-e5f9-472c-9e42-70d82de4c480/projects/999af02d-4a67-46d9-a2ee-8055bd8ceeee) |
| Original Hero | `296e4236-66e8-46b0-b19d-1a7eec5e4f0a` | [Preview](https://p.superdesign.dev/draft/296e4236-66e8-46b0-b19d-1a7eec5e4f0a) |
| Evening Atmosphere | `8ebf07b6-dcc3-426f-8f94-1ba1180dc899` | [Preview](https://p.superdesign.dev/draft/8ebf07b6-dcc3-426f-8f94-1ba1180dc899) |
| Airy Morning Mist | `eae31dd3-f9f1-49d6-a02b-05377a4e5566` | [Preview](https://p.superdesign.dev/draft/eae31dd3-f9f1-49d6-a02b-05377a4e5566) |

### Key Commands

```bash
# Create project
superdesign create-project --title "Project Name" --json

# Create initial draft (ONE -p flag)
superdesign create-design-draft --project-id <id> --title "Title" \
  -p "Detailed description" \
  --context-file src/Component.tsx \
  --json

# Iterate with variations (multiple -p flags in branch mode)
superdesign iterate-design-draft --draft-id <id> \
  -p "Variation 1 direction" \
  -p "Variation 2 direction" \
  --mode branch \
  --context-file src/styles/global.css \
  --json
```

### Credits Used
- Initial draft: 4 credits
- Iteration (2 variants): 5 credits

---

# Task Tracking - Immersive Luxury Redesign

All phases completed successfully.

---

## Verification Summary

**Build Status:** ✅ Passes (`npm run build`)
**Console Errors:** None
**All Components:** Render correctly

---

## Completed Tasks

### Phase 1: Cinematic Hero with Scrub-on-Scroll ✅
- [x] Created `src/scripts/video-scrub.ts` - scroll-linked video controller
- [x] Created `src/components/CinematicHero.astro` - new hero with scrub support
- [x] Updated `src/styles/global.css` - cinematic keyframes, Ken Burns animation
- [x] Updated `src/pages/index.astro` - replaced Hero with CinematicHero
- [x] New headline: "Walk the hallowed fairways of the Old World"
- [x] Scroll progress indicator
- [x] Ken Burns fallback when no video provided

### Phase 2: Interactive Course Discovery Map ✅
- [x] Created `src/data/map-regions.ts` - region + course data (15 courses)
- [x] Created `src/components/MapRegion.astro` - individual clickable region
- [x] Created `src/components/CoursePopup.astro` - Polaroid-style popup
- [x] Created `src/scripts/map-interactions.ts` - hover/click/audio handlers
- [x] Created `src/components/InteractiveMap.astro` - main map container with SVG
- [x] Updated `src/pages/index.astro` - added map section
- [x] Updated `src/pages/destinations/index.astro` - featured map prominently
- [x] Keyboard navigation (Tab/Enter)
- [x] Audio support (optional, off by default)
- [x] **Map Accuracy Improvement**: Replaced hand-drawn SVG with geographically accurate SimpleMaps data
  - Source: SimpleMaps.com (Free for Commercial Use)
  - Created `public/maps/british-isles.svg` - 166KB detailed map
  - 232 county-level paths grouped into 4 clickable regions
  - Scotland: 32 counties, Wales: 22 counties, Northern Ireland: 26 counties, England: 152 counties
  - Ireland (Republic) path from separate ie.svg, positioned with transform

### Phase 3: Celtic Luxury Textures & Typography ✅
- [x] Created `src/components/TexturedSection.astro` - wrapper with texture options
- [x] Created `src/components/CelticDivider.astro` - ornamental divider (4 variants)
- [x] Created placeholder textures in `public/textures/`
- [x] Updated `src/layouts/Layout.astro` - added Cormorant Garamond font
- [x] Updated `src/styles/global.css` - texture classes, new typography tokens
- [x] Updated `src/components/SectionHeading.astro` - new heading styles with kicker/divider

### Phase 4: Sensory Storytelling ✅
- [x] Created `src/scripts/ambient-audio.ts` - audio manager with crossfade
- [x] Created `src/components/AmbientSoundToggle.astro` - floating audio toggle
- [x] Created `src/scripts/horizontal-scroll.ts` - scroll controller
- [x] Created `src/components/TimelineStop.astro` - individual timeline card
- [x] Created `src/components/HorizontalTimeline.astro` - day-in-the-life section
- [x] Updated `src/layouts/Layout.astro` - ambient toggle support
- [x] Updated `src/pages/index.astro` - added horizontal timeline
- [x] Audio OFF by default (opt-in)
- [x] Keyboard controls for timeline navigation
- [x] Mobile: swipe carousel fallback

### Phase 5: Heritage Wall & Digital Caddie ✅
- [x] Created `src/components/HeritagePhoto.astro` - B&W to color effect
- [x] Created `src/components/HeritageWall.astro` - photo gallery
- [x] Created `src/scripts/caddie-widget.ts` - chat UI logic
- [x] Created `src/components/DigitalCaddie.astro` - chat widget shell
- [x] Updated `src/layouts/Layout.astro` - added caddie widget globally
- [x] Updated `src/pages/about.astro` - featured heritage wall
- [x] Opening line: "What's your handicap, and how do you like your whiskey?"

---

## Assets Needed (Placeholders in place)

| Asset | Location | Status |
|-------|----------|--------|
| Hero video (10-20s drone) | - | Placeholder: Ken Burns on static image |
| Course photos (16-20) | Unsplash URLs | Using Unsplash |
| Texture: pressed-paper.webp | `public/textures/` | Placeholder file |
| Texture: linen-subtle.webp | `public/textures/` | Placeholder file |
| Texture: topo-lines.svg | `public/textures/` | ✅ Created |
| Audio: wind-over-dunes.mp3 | `public/audio/` | Placeholder file |
| Audio: ocean-waves.mp3 | `public/audio/` | Placeholder file |

---

## Files Created

### Scripts (4)
- `src/scripts/video-scrub.ts`
- `src/scripts/map-interactions.ts`
- `src/scripts/ambient-audio.ts`
- `src/scripts/horizontal-scroll.ts`
- `src/scripts/caddie-widget.ts`

### Components (11)
- `src/components/CinematicHero.astro`
- `src/components/TexturedSection.astro`
- `src/components/CelticDivider.astro`
- `src/components/InteractiveMap.astro`
- `src/components/MapRegion.astro`
- `src/components/CoursePopup.astro`
- `src/components/AmbientSoundToggle.astro`
- `src/components/HorizontalTimeline.astro`
- `src/components/TimelineStop.astro`
- `src/components/HeritagePhoto.astro`
- `src/components/HeritageWall.astro`
- `src/components/DigitalCaddie.astro`

### Data (1)
- `src/data/map-regions.ts`

### Assets (5)
- `public/textures/topo-lines.svg`
- `public/textures/pressed-paper.webp` (placeholder)
- `public/textures/linen-subtle.webp` (placeholder)
- `public/audio/wind-over-dunes.mp3` (placeholder)
- `public/audio/ocean-waves.mp3` (placeholder)
- `public/maps/british-isles.svg` ✅ (SimpleMaps source - geographically accurate)

---

## Files Modified

- `src/layouts/Layout.astro` - Cormorant font, ambient toggle, caddie widget
- `src/styles/global.css` - typography, textures, cinematic animations
- `src/components/SectionHeading.astro` - new styles, divider support
- `src/pages/index.astro` - CinematicHero, map, timeline
- `src/pages/destinations/index.astro` - interactive map section
- `src/pages/about.astro` - heritage wall section

---

## Accessibility Features

- [x] `prefers-reduced-motion` respected everywhere
- [x] Keyboard navigation for map (Tab, Enter)
- [x] Keyboard navigation for timeline (Arrow keys)
- [x] Audio OFF by default (explicit opt-in)
- [x] Screen reader labels on interactive elements
- [x] Focus visible indicators
- [x] Graceful degradation (no-JS)
