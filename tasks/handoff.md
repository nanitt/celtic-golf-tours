# Handoff Checklist — Celtic Golf Tours

**Goal:** Celtic Golf Tours owns and operates this site without the original
developer. Nothing below is code; it is all account ownership and sign-off.

**Status:** not started. Prepared 18 Aug 2026.

---

## 0. Blocker — the domain is not owned

`celticgolftours.com` is **parked on Dan.com** and appears to be for sale:
nameservers are `ns1.dan.com` / `ns2.dan.com`, the site redirects to a `/lander`
sales page, and there are **no MX records** (which is why Terry's email is
`@centreholidays.com`).

Nothing else can finish until this is resolved. It blocks:

- the launch itself — there is no address to go live at
- canonical URLs and the sitemap (hardcoded to this domain in three files)
- Resend sender verification, so enquiries currently send from
  `onboarding@resend.dev`
- any branded email on the domain

**Decide:** buy `celticgolftours.com`, or pick a different domain. Then allow
time for DNS propagation before 31 Aug.

---

## 1. Accounts to transfer

| Asset | Currently | Move to | Done |
|---|---|---|---|
| **Domain** | Unowned (Dan.com) | CGT registrar account | ☐ |
| **GitHub repo** | `github.com/nanitt/celtic-golf-tours` (personal) | CGT / Centre Holidays org | ☐ |
| **Vercel project** | Nate's personal account | CGT Vercel team | ☐ |
| **Resend** | ⚠️ Borrowed key — see below | CGT's own Resend account | ☐ |
| **Sanity** | Not created | CGT-owned project | ☐ |

### ⚠️ The Resend credential needs attention regardless of handoff

The contact form currently authenticates with the API key from a **different
client project** (`golf-ai-agency`). Two consequences:

1. Rotating that key for the other client **silently kills Celtic's contact form**.
2. It is another client's billing and another client's account.

Fix: CGT creates their own Resend account, verifies the new domain, and
`RESEND_API_KEY` / `ENQUIRY_FROM_EMAIL` are set from that account in Vercel.

---

## 2. Sign-off needed before launch

- [ ] **Legal review of `/terms` and `/privacy`.** Both are placeholder text
      carrying a developer TODO saying a lawyer must review them. Specific
      problems a lawyer must resolve:
  - The **governing-law clause is circular** — it says disputes go to "the
    relevant courts" under "the applicable jurisdiction" without naming either.
    It has no legal content as written.
  - The **liability clause** positions CGT as an intermediary and disclaims
    liability for injury, with no cap and no carve-out for negligence. It also
    sits badly against the marketing, which promises a CGT host for the duration
    and 24/7 support — that reads as principal, not intermediary.
  - The **administrative fee** deducted from a "full refund" is never quantified.
  - The **privacy policy does not name Resend** (a US processor) as a recipient
    of enquiry data, and mentions no cross-border transfer.
  - It also asserts a **marketing-consent basis the form never captures** —
    there is no consent checkbox and no double opt-in.
- [ ] **Verified figures** for the gated statistics, or a decision to drop them
      permanently. An average rating in particular needs a real review source.
- [ ] **Course access confirmed** — the homepage names eight courses. Confirm
      which CGT can actually secure tee times at; the rest come off.
- [ ] **Photography** — 85 stock images across 21 files, first requested 19 May.
      This is the largest single blocker.

See `tasks/content-needed.md` for the full content list.

---

## 2b. Current production state (as of 18 Aug)

The site is **already public** at `celtic-golf-tours.vercel.app` — there are no
environment variables set for `COMING_SOON` or `SITE_PASSWORD`, so neither gate
is active. It was serving the pre-fix code until today's deploy, which means
**enquiries were silently lost for months**, not just pending launch.

Now deployed and verified live: contact form delivers (tested end-to-end, email
received), hero renders, no stale dates.

**Enquiries currently go to `nate.maclennan@gmail.com`, not Terry.** The Resend
sending domain is unverified, so the shared `onboarding@resend.dev` sender only
delivers to the Resend account owner. Pointing `NOTIFICATION_EMAIL` at Terry
would make enquiries fail outright. Forward manually until a domain is verified,
then switch it.

Two notes for whoever maintains this:
- `vercel.json` is validated against a strict schema. **No comment keys**, not
  even `"//"` — the deploy fails verification before it builds, with a 0ms build
  and no logs.
- Astro 5 blocks cross-origin POSTs by default, so `/api/contact` rejects
  submissions without a matching `Origin` header. Browsers always send one; a
  bare `curl` test will get a 403 and that is correct behaviour, not a fault.

## 3. Launch switches

- [ ] `COMING_SOON` → `false` (or delete) in Vercel Production
- [ ] Delete `SITE_PASSWORD` in Vercel Production
- [ ] Domain updated in **all four** places — `astro.config.mjs` (`site:`),
      `public/robots.txt` (`Sitemap:` line), `src/data/site.ts` (fallback), and
      `PUBLIC_SITE_URL` in Vercel. **Setting the env var alone is not enough:**
      `Astro.site` always wins for canonical URLs, and `robots.txt` is a static
      file that reads no variables.
- [ ] `RESEND_API_KEY`, `NOTIFICATION_EMAIL`, `ENQUIRY_FROM_EMAIL` set in
      Production, with a verified sending domain
- [ ] `PUBLIC_SITE_OG_IMAGE` replaced (currently a stock photo)
- [ ] Contact form submitted on the live site and the email confirmed received

---

## 4. Enabling the client

- [ ] Sanity project created and `PUBLIC_SANITY_PROJECT_ID` set, so `/studio` loads
- [ ] Site origin added to Sanity's CORS allowlist (with credentials)
- [ ] Terry walked through adding a trip — 20 minutes, see the README
- [ ] Terry has logins for: Vercel, Sanity, Resend, the registrar

**This section is what separates a handoff from an open-ended commitment.**
Until `/studio` works and Terry has used it once, every date change, price
update, and new departure comes back to the developer.

---

## 5. Commercial closure

- [ ] Written confirmation that scope is met
- [ ] Final invoice issued and settled
- [ ] Support expectations agreed in writing — either a defined warranty window,
      a paid retainer, or an explicit "no ongoing support"

*(Separate ledger: the outstanding $3,000 balance for the Scotland trip. Same
relationship, different transaction — worth keeping the two apart.)*

---

## Known issues being handed over

Not blocking, but the next maintainer should know:

- Tap targets below 44×44 in the header and footer navigation
- `h2 → h4` heading skip on the Scotland and Ireland pages
- `/coming-soon` has no `<h1>` and bypasses the global reduced-motion reset
- ~55 decorative SVGs missing `aria-hidden="true"`
- `DigitalCaddie` panel is a fixed `360px` with no media query — narrow-viewport
  overflow risk
- Dead code: two parallax systems matching zero elements while a global
  `mousemove` listener runs on every page; `AmbientSoundToggle` (never enabled);
  `--font-celtic` tokens pointing at fonts that are never loaded
- Homepage ships ~4.3 MB of imagery; most is CSS `background-image`, which cannot
  use `loading="lazy"` or `srcset`. Should improve when real photography lands.
