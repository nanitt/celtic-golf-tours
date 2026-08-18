# Celtic Golf Tours

Marketing and enquiry site for Celtic Golf Tours — golf travel to Scotland and
Ireland, operated in partnership with Centre Holidays.

Built with **Astro 5** (server-rendered), **Tailwind v4**, and **Sanity** as the
content source. Deployed on **Vercel**.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values you need
npm run dev                  # http://localhost:4321
```

**Node 20 or newer.** (Astro 5 needs 18.20.8+, 20.3+, or 22+. There is no
`.nvmrc`; if you add one, pin 20 or 22.)

If `SITE_PASSWORD` is set in `.env.local`, the site is password-gated — you'll be
redirected to `/login`.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server on `localhost:4321` |
| `npm run build` | Production build. **Outputs `.vercel/output/`, not `dist/`** — this is a server-rendered app, not a static site |
| `npm run preview` | Serve the production build locally |
| `npm run seed` | One-off: push the sample trips into Sanity. Needs `SANITY_API_WRITE_TOKEN` |

## Environment variables

Copy `.env.example` to `.env.local`. Anything **not** prefixed `PUBLIC_` is
server-only and must be set separately in the Vercel dashboard for Production
and Preview.

### Launch gates

| Variable | Purpose |
|---|---|
| `COMING_SOON` | Exactly the string `true` serves the holding page for every route. Anything else is off. `/api/*` stays reachable so the contact form still works behind it. |
| `SITE_PASSWORD` | Any non-empty value password-gates the whole site. **Blank or delete it to go public.** ASCII only — multi-byte characters can throw a 500 in the comparison. |

### Contact form

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `NOTIFICATION_EMAIL` | Where enquiries are delivered |
| `ENQUIRY_FROM_EMAIL` | Sender. **Must be a Resend-verified domain** |

### Sanity (content)

| Variable | Purpose |
|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | **Master switch.** If unset, Sanity is skipped entirely, `/studio` 404s, and the site falls back to the hardcoded sample trips |
| `PUBLIC_SANITY_DATASET` | Defaults to `production` |
| `SANITY_API_WRITE_TOKEN` | Only used by `npm run seed`. Not needed to run the site |

### Site details

`PUBLIC_SITE_URL`, `PUBLIC_SITE_EMAIL`, `PUBLIC_SITE_OG_IMAGE`,
`PUBLIC_SITE_PHONE`, `PUBLIC_SITE_ADDRESS_*`, `PUBLIC_SOCIAL_*` — all have
fallbacks in `src/data/site.ts` and render as empty/hidden when blank.

### Public claims

`PUBLIC_STATS_VERIFIED` plus `PUBLIC_STAT_*`. **Nothing renders unless
`PUBLIC_STATS_VERIFIED=true`.** This is deliberate: these are public claims about
the business, and the placeholder values that shipped originally were invented.
Fill in real figures, then flip the flag. See `tasks/content-needed.md`.

---

## Photography

Every photograph is declared in **`src/data/images.ts`** — one slot per image,
each with a plain-English note describing what it needs.

```bash
npm run images:audit   # what's still stock, and what each slot needs
```

To replace one: drop the file in `public/images/`, point the slot's `src` at it
(`/images/st-andrews-18th.jpg`), and set `placeholder: false`. Every page using
that slot updates. `imageUrl()` passes local paths straight through and only
applies Unsplash sizing to `photo-…` ids.

The site currently runs entirely on stock imagery. Real photography is the
largest outstanding item — see `tasks/content-needed.md`.

## Content management

### Turning Sanity on

1. Create a free project at [sanity.io](https://www.sanity.io) and copy the project ID.
2. Set `PUBLIC_SANITY_PROJECT_ID` in `.env.local` and in Vercel.
3. In the Sanity dashboard, add your site's origin under **API → CORS origins**,
   with credentials allowed — otherwise Studio login fails.
4. Restart the dev server. `/studio` now loads.

Studio sits behind `SITE_PASSWORD` while that gate is on. The dataset is read
with `useCdn: true` and **no token**, so it must be public for the site to read it.

### Adding a trip (for non-developers)

Go to `/studio`, choose **Experience**, and click create. The fields that matter:

- **Departure date** — the real date the trip leaves. This drives everything: a
  trip **automatically disappears from the site once this date passes**, so stale
  departures can't be shown by accident. Required.
- **Dates (display text)** — how it reads to visitors, e.g. "May 15-22, 2027".
  Just a label; keep it consistent with the departure date.
- **Featured** — show it on the homepage.
- **Sort order** — lower numbers first.
- **Status** — `limited` plus a "spots remaining" number produces an
  "Only N Left" badge. Only set this if it's true.

When no upcoming trips exist, the homepage and `/experiences` show a
"next season is being finalised" message with an enquiry button, rather than an
empty section.

---

## Deployment

Push to the default branch; Vercel builds and deploys automatically. Preview
deployments are created for every other branch.

Server-only environment variables must be set in the Vercel dashboard — they are
**not** read from `.env.local` in production.

### Going live

1. Set `COMING_SOON=false` (or delete it) in Vercel Production.
2. Delete `SITE_PASSWORD` in Vercel Production.
3. **Change the domain in all four places** — a single env var is not enough:
   - `astro.config.mjs` → `site:` (drives the sitemap and every canonical URL)
   - `public/robots.txt` → the `Sitemap:` line (a static file; reads no env var)
   - `src/data/site.ts` → the `PUBLIC_SITE_URL` fallback
   - `PUBLIC_SITE_URL` in Vercel
4. Set `RESEND_API_KEY`, `NOTIFICATION_EMAIL`, `ENQUIRY_FROM_EMAIL` in Production,
   and verify the sending domain in Resend.
5. Replace the `PUBLIC_SITE_OG_IMAGE` fallback — it currently points at a stock photo.

See `tasks/handoff.md` for the full ownership and launch checklist.

---

## Architecture notes

- **`output: 'server'`** — every page is a serverless function. There is no static export.
- **`src/middleware.ts`** runs on every request and owns both launch gates.
- **`src/data/site.ts`** is the single source of truth for business details and
  the gated statistics.
- **`src/data/sanity-experiences.ts`** wraps Sanity with a fallback to the
  hardcoded trips in `src/data/hosted-experiences.ts`. Both paths filter out past
  departures via `isUpcoming()` — **keep them symmetrical**, or stale trips
  reappear when Sanity is connected.
- **Entrance animations are CSS, not JS.** `[data-reveal]` is driven by
  `src/scripts/scroll-reveal.ts` (imported as an ES module from the layout — do
  **not** switch it to `<script src="/src/...">`, which Astro will not bundle).
  Above-the-fold content uses `.animate-fade-in-up`, which needs no JS at all.
- **CSP is strict**, set in `vercel.json`, with a separate relaxed policy scoped
  to `/studio`. Adding analytics, a chat widget, or an embedded video will be
  **silently blocked** until you amend `script-src`/`connect-src`/`frame-src`.

## Known gaps

Tracked in `tasks/content-needed.md` (content owed by the client) and
`tasks/handoff.md` (ownership transfer). The two that gate launch are
**photography** — the site still runs on stock imagery — and **the legal pages**,
which are placeholder text that needs a lawyer.
