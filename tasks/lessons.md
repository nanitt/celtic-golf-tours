# Lessons Learned

This file captures failure modes, detection signals, and prevention rules discovered during development.

---

## Template

```markdown
### [Date] - [Brief Title]

**Failure mode:** What went wrong

**Detection signal:** How it was discovered

**Prevention rule:** How to avoid this in the future
```

---

## Entries

### 2026-09-15 - One photo doing five jobs read as "the images are wrong"

**Failure mode:** Nine stock photos were spread across fifteen full-bleed hero and
CTA slots. `irishLahinchGolfer` alone covered `experiencesHero`, `contactHero`,
`aboutStory`, `testimonialsHero` and `tripBuddy`, so /experiences and /contact
opened on the identical picture. The per-slot `needs` text was carefully written
and every slot was individually justified, so nothing looked wrong when reading
`images.ts` top to bottom — the defect only existed *between* slots.

**Detection signal:** The client noticed it by browsing the site, not by reading
the code: "the main image for the trip experience and contact page are all the
same." An audit that only counted `placeholder: true` reported 47 slots needing
work and said nothing about the duplication, so it gave no hint.

**Prevention rule:** When a lookup table fans out to many consumers, audit the
*mapping*, not just the entries. `npm run images:audit` now reports any two
hero/CTA slots sharing a photo. Also: the fix the user asks for is often narrower
than the one worth proposing — the opening ask here was "find better photography"
and the real problem was fifteen slots sharing seven images. Check what is
actually wrong before sourcing anything new.

<!-- Add new lessons above this line -->
