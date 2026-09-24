# tabeen.dev — refresh review

Branch: `site/refresh-2026-09`. Not merged, not deployed. `npm run build` passes clean as of this review.

## Scope note

This review covers a genuinely large restructure (stale facts, repositioning copy, full IA change, one project rewrite, five new pages, three new notes posts, an accessibility pass, and metadata/SEO cleanup). Everything below was done directly against the repo — no visual browser testing tools or Lighthouse were available in this environment, which is called out explicitly wherever it matters rather than estimated.

---

## 1. Files changed

**Core / layout**
- `src/app/layout.tsx` — removed the "FiPet" default description and "TPM" site title; added canonical + unique OG/Twitter defaults; added `id="main-content"` on `<main>` for the skip link.
- `src/app/page.tsx` — new hero heading/subheading/CTAs, added a homepage "Now" section (TODO, see below), added JSON-LD `Person`, repointed featured/recent-content links at the new IA.
- `src/app/about/page.tsx` — rewrote opening paragraphs, replaced the experience list with full dates, fixed UN role description, replaced the family sentence, added a "Now" section, added canonical metadata.
- `src/app/contact/page.tsx` — added canonical metadata; decorative icons marked `aria-hidden`.
- `src/components/Header.tsx` — new nav (Work · Research · Notes · About · Contact), added a skip-to-content link.
- `src/components/NavLink.tsx` — added `aria-current="page"` and a visible focus ring.
- `src/components/Logo.tsx` — added `LogoAlt` (horizontal row of varying-size paired ovals) behind `NEXT_PUBLIC_LOGO_VARIANT=alt`; default logo unchanged.
- `src/app/globals.css` — lightened `--color-muted` for contrast, added a global `:focus-visible` ring, added `prefers-reduced-motion` handling.
- `src/app/sitemap.ts`, `src/app/api/og/route.tsx` — updated to new categories/colors.
- `next.config.mjs` — added `redirects()` for the whole old IA.
- `README.md` — updated folder/route references from `ml/projects/writing` to `work/research/notes` (dev docs, not a site page, but was left inconsistent otherwise).

**Routes moved** (via `git mv`, so history is preserved)
- `src/app/ml/*` → `src/app/research/*`
- `src/app/projects/*` → `src/app/work/*`
- `src/app/writing/*` → `src/app/notes/*`
- Each updated internally: category strings passed to `getAllContent`/`getContentBySlug`, back-links, OG `category=` params, per-page canonical URLs, and card `aria-label`s (see Accessibility, "Link text").

**Content moved**
- `content/ml/fake-job-detector.mdx` → `content/work/fake-job-detector.mdx`
- `content/projects/busybees.mdx` → `content/work/busybees.mdx`
- `content/projects/text-autocomplete-trie.mdx` → `content/work/text-autocomplete-trie.mdx`
- `content/writing/self-sufficient-ml-pipelines.mdx` → `content/notes/self-sufficient-ml-pipelines.mdx`
- `content/ml/image-authenticity-classifier.mdx` deleted, replaced by `content/research/truphoto.mdx` (rewrite, see Task 4)

**Content added**
- `content/research/truphoto.mdx` (rewrite)
- `content/research/vlm-relational-reasoning.mdx`
- `content/research/stereon.mdx`
- `content/work/aws-eks-cloud-security.mdx`
- `content/work/proofshape.mdx`
- `content/work/fipet.mdx`
- `content/notes/accuracy-went-down-four-times.mdx`
- `content/notes/evidence-based-decision-not-to-fine-tune.mdx`
- `content/notes/why-our-uncertainty-measure-was-wrong.mdx`
- Update section added to `content/notes/self-sufficient-ml-pipelines.mdx`

**Deliberately untouched:** no page or mention of Xylo AI Studios exists anywhere in the repo (confirmed via search) — nothing to leave alone, and nothing was added.

---

## 2. TODO(tabeen) — every instance, with location

| # | File | What's needed |
|---|---|---|
| 1 | `src/app/page.tsx` (Now section) | One-sentence current-work line — the Facts explicitly withheld this pending approval of the current role. |
| 2 | `src/app/about/page.tsx` (Experience) | Current role entry, pending approval. |
| 3 | `src/app/about/page.tsx` (SFBU row) | MS program start date. |
| 4 | `src/app/about/page.tsx` (Now section) | Same one-sentence current-work line as #1. |
| 5 | `content/research/truphoto.mdx` (frontmatter `research.summary`, and Links section) | arXiv link once the preprint posts. |
| 6 | `content/research/truphoto.mdx` (frontmatter comment) | Confirm whether a live public HF Space exists; the old URL 401s (see §4). `demo` field is currently omitted entirely. |
| 7 | `content/research/truphoto.mdx` (frontmatter comment) | Produce and add a current architecture diagram; `diagram` field omitted (file doesn't exist — see §4). |
| 8 | `content/research/vlm-relational-reasoning.mdx` (frontmatter, `research.summary`) | arXiv link once posted. |
| 9 | `content/research/vlm-relational-reasoning.mdx` (`stack` comment) | Confirm exact stack (Python/PyTorch/Jetson/Ollama?). |
| 10 | `content/work/aws-eks-cloud-security.mdx` | Your specific contribution vs. two teammates'. |
| 11 | `content/work/proofshape.mdx` (Status) | Real milestones, added only as they're actually reached. |
| 12 | `content/work/fipet.mdx` (whole page) | Actual project description and stack — the old site's "gamified financial education app" line wasn't in the supplied Facts, so it was dropped rather than carried forward unverified. |
| 13 | `content/work/busybees.mdx` (frontmatter comment) | Correct GitHub URL — old and both guessed alternates 404 (see §4). |
| 14 | `content/work/fake-job-detector.mdx` (frontmatter comment) | Correct GitHub URL — same 404 situation (see §4). |
| 15 | `content/notes/self-sufficient-ml-pipelines.mdx` (Update section) | 2–4 sentence dated update on AI-assisted coding, now that you work with AI agents professionally. |

---

## 3. An editorial call flagged for your review

`content/work/fake-job-detector.mdx` isn't named in the Work/Research list you gave me (FiPet, AWS EKS, ProofShape, BusyBees, Trie autocomplete / TruPhoto, VLM, Stereon). Rather than delete existing, real content or invent a category for it, I kept it under Work and left a comment in the file flagging the gap. Confirm whether it should stay, move, or come down.

---

## 4. Broken links and resolution

Checked live via `curl` where the environment had network access; all four returned real HTTP status codes at the time of this review.

| Link | Status | Resolution |
|---|---|---|
| `github.com/tabeen/image-authenticity-classifier` (old TruPhoto repo link) | wrong owner | Replaced with the correct `github.com/TabeenRaoof/xception-photo-verification` (200) in the rewrite. |
| `huggingface.co/spaces/tabeen/image-authenticity-demo` (old TruPhoto demo) | 401 (private/gated) | **Removed** the "Live demo" button rather than leave it dead — no correct public URL was available. TODO #6 above. |
| `github.com/tabeen/busybees` | 404 | **Removed** the GitHub button. Tried `tabeenraoof/busybees` and `TabeenRaoof/busybees` as likely corrections — both also 404. TODO #13. |
| `github.com/tabeen/fake-job-detector` | 404 | Same situation and same resolution. TODO #14. |
| `/diagrams/architecture.png` | 404 (file does not exist in `/public` at all, not just stale) | **Removed** from TruPhoto's frontmatter rather than reference a non-existent file; also would have shown the wrong (XceptionNet→RF) architecture even if it existed. TODO #7. |
| `/resume.pdf` | 404 (file does not exist in `/public`) | **Kept** the download link/button on the About page as-is, per your instruction to just flag this one for manual replacement rather than remove it. Needs the actual PDF dropped into `/public/resume.pdf`. |
| `linkedin.com/in/tabeenraoof` | returned HTTP 999 from automated `curl` | This is LinkedIn's anti-bot response to automated requests, not evidence the link is broken — treat as unverified by this tool, not confirmed broken. Recommend a manual click-check. |
| `github.com/TabeenRaoof/autocomplete-with-trie`, `github.com/tabeenraoof`, `tabeenraoof-trie-autocomplete.hf.space`, `github.com/proofshape/proofshape` | 200 | No action needed. |

No internal 404s found — every route in the new nav (`/work`, `/research`, `/notes`, `/about`, `/contact`, and every `[slug]` page) returned 200 against a local dev server, and every old URL (`/ml/*`, `/projects/*`, `/writing/*`) correctly 308-redirects to its new location.

**Side effect worth knowing about:** Giscus comments are keyed by URL pathname (`mapping="pathname"`). Moving `/writing/self-sufficient-ml-pipelines` to `/notes/self-sufficient-ml-pipelines` means any existing comment thread on the old URL will not automatically appear on the new one — it'll start a fresh (empty) discussion. Worth a decision on whether to preserve the old discussion manually via Giscus/GitHub if it has existing comments.

---

## 5. Accessibility — by severity

**Fixed**
- **Serious — no visible keyboard focus indicator.** Added a global `:focus-visible` outline (accent color) in `globals.css`, plus explicit focus rings on nav links and index-page cards.
- **Serious — no skip-to-content link.** Added one in `Header.tsx`, targeting a new `id="main-content"` on `<main>`.
- **Moderate — decorative SVG icons exposed to assistive tech.** ~15 inline icons (back-arrows, GitHub/LinkedIn/mail glyphs, external-link icons) lacked `aria-hidden="true"`. Batch-fixed across `page.tsx`, `about`, `contact`, `work/[slug]`, `research/[slug]`, `notes/[slug]`.
- **Moderate — project-card accessible names were an unstructured concatenation.** Tag pill + status + title + description + date were all inside one `<Link>` with no explicit accessible name, so a screen reader would read the raw visual order (e.g. "Full-stack, Complete, BusyBees, Family activity...Aug 2025") — technically descriptive but redundant and clunky. Restructured `work/page.tsx` and `research/page.tsx` cards to set a deliberate `aria-label` (title, then status, then description) and marked the visual tag/status pills `aria-hidden` since they're now redundant with the label.
- **Moderate — contrast.** `--color-muted` (#8A8378) measured ≈4.0:1 against `--color-line` (the background tag chips and status badges sit on) — fails WCAG AA for text under 18px. Lightened to `#A69F91`, which measures ≈5.7:1 against `--color-line` and ≈6.8:1 against the page background — passes AA comfortably in both places, including the contact page called out specifically. Math shown as a comment in `globals.css`.
- **Minor — no `aria-current` on active nav item.** Added.
- **Minor — motion not gated on `prefers-reduced-motion`.** Added a global reduced-motion override in `globals.css`. (The site's own animation is limited to color/opacity transitions, so this is a low-impact fix, but it's now correctly handled if any are added later.)

**Already correct — verified, no change needed**
- `<html lang="en">` — present.
- Landmarks — `<header>`, `<nav>`, `<main>`, `<footer>` all present and correctly used.
- Heading hierarchy — checked `/`, `/work`, `/research/truphoto`, `/about`: exactly one `<h1>` per page, no skipped levels (h1 → h2 → h3 in article bodies).
- Status badges ("Active", "Complete", etc.) render as **text**, not color-only indicators — the word itself carries the meaning, so this already satisfies the "not by hue alone" requirement even before the accent-color work in Task 7. No change made.
- Images — the two `<Image>` usages (architecture diagrams) already had descriptive `alt` text; no decorative `<img>`s found anywhere in the codebase.

**Deferred / could not verify in this environment**
- **Touch targets ≥44×44px on mobile** — not verified. No mobile device or browser automation was available; would need manual measurement or a Lighthouse/axe run.
- **200% zoom without horizontal scroll** — not verified, same reason.
- **Full keyboard-only navigation walkthrough on every page** — spot-checked via markup review (focus-visible rules, tab order implied by DOM order) but not walked page-by-page with a real keyboard in a browser.
- **375/768/1024/1440px responsive check (Task 9)** — not verified visually. The layout uses fluid Tailwind classes (`max-w-3xl`, `sm:` breakpoints) consistently across all templates, which is a good sign, but I did not render and inspect each breakpoint.

---

## 6. Design

- **Contrast/accent:** see §5. The codebase already had a warm-orange `--color-accent` (#D8602A) doing real work (links, italic emphasis, active nav underline, logo dot) before this refresh — the brief describing the palette as "omitting the orange entirely" doesn't match what's actually in `globals.css`. I verified `--color-accent` against the background at ≈4.8:1 (passes AA for body text, comfortably clears the 3:1 non-text threshold) and left it as-is rather than reinvent something already working. The change that *was* needed — and made — was the muted-text contrast fix above.
- **Logo:** proposed the alternate "row of paired ovals" mark as `LogoAlt` in `Logo.tsx`, gated behind `NEXT_PUBLIC_LOGO_VARIANT=alt` (unset in `.env.local.example`, so it's off by default). The current default 3×3 dot-grid mark is untouched, per your instruction not to swap it without approval. Set the env var locally to preview it.
- **Palette origin comment:** already lived only as a code comment in `globals.css` and `Logo.tsx` before this refresh — confirmed nothing about the caterpillar/photograph origin appears in visible copy anywhere on the site.
- **Green:** none introduced. `--color-accent-2` (chartreuse, #D4DC3F) was already in the palette pre-refresh for status pills — that's a yellow-green from the caterpillar's segment markings per the existing code comments, not foliage-green, and I left it as the codebase already had it.
- **Design consistency (Task 9):** `/work`, `/research`, and `/notes` all reuse the same card/list templates that `/ml`, `/projects`, and `/writing` used before — spacing scale, card padding, and badge styling are structurally identical because I mirrored the existing components rather than redesigning them. I did not find one-off spacing/type-scale deviations while writing the new templates, but this was a code-level read, not a rendered visual diff across breakpoints (see deferred items in §5).
- **`/api/og` for new pages:** the route is generic (reads `title`/`category` from query params), and every new/moved detail page passes through the same `generateMetadata` pattern that builds that query string, so OG images should render correctly for all of them. Not visually confirmed (would need to fetch and view the generated PNGs).

---

## 7. Metadata / SEO

- Root default title/description no longer reference FiPet or "TPM" (`layout.tsx`).
- Added `alternates.canonical` set to the real per-page URL on every static page (`/`, `/about`, `/contact`, `/work`, `/research`, `/notes`) and every dynamic detail page (`/work/[slug]`, `/research/[slug]`, `/notes/[slug]`), replacing the previous behavior where `openGraph.url` defaulted to the site root everywhere.
- Added JSON-LD `Person` schema to the homepage: name, job title, `alumniOf` (SFBU), `sameAs` → GitHub + LinkedIn.
- `sitemap.ts` rewritten for the new categories; verified it now lists `/work`, `/research`, `/notes` and every content slug under them (no `/ml`, `/projects`, `/writing` entries remain).
- `robots.ts` was already correct (allows all, points at `/sitemap.xml`) — no change needed.
- Titles/descriptions were already unique per static page before this refresh (About, Contact, ML, Projects, Writing each had their own); the actual FiPet-description collision was in the **root layout default**, which is what non-overriding pages would have inherited — fixed there.

---

## 8. Performance

- `npm run build` (production) succeeds with no errors or warnings beyond a pre-existing duplicate-lockfile notice.
- Per-route First Load JS from the build output:

| Route | Size | First Load JS |
|---|---|---|
| `/` | 173 B | 103 kB |
| `/about` | 173 B | 103 kB |
| `/contact` | 132 B | 100 kB |
| `/work` | 173 B | 103 kB |
| `/work/[slug]` (×6) | 176 B | 109 kB |
| `/research` | 173 B | 103 kB |
| `/research/[slug]` (×3) | 176 B | 109 kB |
| `/notes` | 173 B | 103 kB |
| `/notes/[slug]` (×4) | 745 B | 104 kB |
| `/api/og` | 132 B | 100 kB (edge, dynamic) |
| Shared by all | — | 99.9 kB |

All content routes are statically prerendered (`●`/`○`) except `/api/og`, which is edge-rendered by design (it needs to read query params per request).

- `next/image` is already used correctly for the one image type on the site (architecture diagrams) — has explicit `width`/`height`, and nothing is marked `priority` (nothing here is meaningfully "above the fold" hero art; the hero is text).
- Fonts already go through `next/font/google` (`Inter`, `Instrument Serif`, `JetBrains Mono`) with `display: "swap"` — no change needed, no manual fallback stack was added since `next/font` handles fallback-metric matching automatically.
- **Lighthouse before/after:** not available in this environment — no browser/Lighthouse tooling was accessible. Stating that explicitly rather than estimating scores.

---

## 9. Anything else unverifiable in this environment

- Visual rendering at any breakpoint, in an actual browser, was not possible here — everything above that says "not verified" or "deferred" is a real gap, not a formality, and should get a manual pass (or a Lighthouse/axe-core run) before this ships.
- LinkedIn/Twitter card rendering was not checked against the actual LinkedIn Post Inspector.
- I did not check whether `.env.local` / Cloudflare Pages env vars are configured for Giscus in the current deployment target — only that the code path degrades gracefully (shows a "not configured" placeholder) if they aren't.

---

## 10. Update — Xylo AI Studios work entry (post-approval)

This round adds the Xylo AI Studios current-role content that the earlier rev deliberately left out pending approval. Approval was informal and scoped narrowly: describe *what kind of work* was done and *what technologies were used*, not *how* any AI agent, prompt, or internal methodology works.

**What was added:**
- `src/app/about/page.tsx` — updated the existing "Xylo AI Studios" experience-list entry's title from "Forward Deployed / Backend AI Engineer" to **"Forward Deployed Engineer Intern"** (the title given for this task), dates unchanged (Jun 2026 — present).
- `src/app/page.tsx` — filled in the homepage's "Now" line (previously a `TODO(tabeen)` placeholder), naming Xylo AI Studios directly now that doing so is approved. Mirrors the sentence already present in the About page's "Now" section from the prior round.
- `content/work/xylo.mdx` (new) — a Work detail page at `/work/xylo`, using the existing project-page template (no route code changes needed; it renders through the existing `/work/[slug]` dynamic route). Sections: Overview, What I build, Working style, Stack — following the structure and wording supplied for this task.

**Boundary check — confirmed nothing was introduced beyond what was supplied:**
- **No client name** anywhere in the diff. `content/work/xylo.mdx` describes the client base only generically ("boutique financial advisors and other small businesses"), matching the supplied Overview text verbatim.
- **No agent-methodology internals.** The "Working style" section names the *shape* of the process (discovery → spec → story decomposition → build → review → delivery) — the same level of description already used in the résumé-derived language from the prior round — and explicitly states internals aren't shared: *"the specifics of how it's structured internally aren't something I can share."* No sentence describes how an agent or prompt makes decisions, how it's structured, or how it reasons.
- **No metrics** beyond what was supplied (there were none given for this entry, and none were added).
- **No architecture diagram or system diagram** was added for this page — only the one Overview sentence, as instructed.
- `npm run build` passes clean with the new page included (`/work/xylo` appears in the static build output alongside the other Work items).

**Still open from prior rounds, unaffected by this change:** the 14 remaining `TODO(tabeen)` markers, the missing `/resume.pdf` and architecture-diagram assets, and the deferred visual/responsive/Lighthouse checks — see §2, §4, §5, §9 above.

---

## 11. Update — Xylo AI Studios expanded (transcript-monitoring project detail, hero repositioning, fourth Notes post)

This round replaces the §10 Xylo content with a more detailed version (title changed again — see below) and expands the site's positioning around it. Same hard boundary as §10, restated more strictly this time: describe what kind of work was done and what problem it solved, not how any AI agent, prompt, or internal methodology works; no customer names; no internal ticket numbers, PR numbers, or repository paths.

**What was added/changed:**
- `src/app/about/page.tsx` — the Xylo experience-list title changed again, from "Forward Deployed Engineer Intern" (§10) to **"Forward Deployed / Backend Engineer Intern"** (the title specified for this round). Dates unchanged.
- `content/work/xylo.mdx` — rewritten with a longer Overview (the transcript-ingestion pipeline: email/calendar/CRM/meeting transcripts from Zoom, Teams, Google Meet, linked back to calendar events), a new "Telling 'quiet' from 'broken'" section describing the event-driven-monitoring problem and the expected-count-plus-connected-platform-gate solution, the "Also" bullets, and the "Working style" paragraph. Stack expanded to include BigQuery, Google Cloud Run, Cloud Scheduler, and Cloud Logging & Monitoring.
- `src/app/page.tsx` and `src/app/layout.tsx` — hero subheading and both the homepage and site-wide default meta descriptions updated to reflect the GCP data-pipelines-and-monitoring work alongside the existing computer-vision/enterprise-delivery framing. Hero heading itself left unchanged, per instruction, since it still reads correctly against the new subheading.
- `content/notes/how-do-you-alert-on-something-thats-supposed-to-be-quiet.mdx` (new, ~890 words) — the fourth Notes post, dated 2026-09-18 (most recent of the four, so it sorts first on `/notes` and is the one shown on the homepage's "Recent notes" list — "most prominent" achieved via the existing date-sort behavior rather than a template change). Carries its own `TODO(tabeen)`, per instruction, flagging that it needs your review before publishing since it's the most detailed public description of current work.

**Boundary check — reviewed the full diff line by line:**
- **No customer name.** The Notes post and the Work page both refer to "three customers," "one customer," "a customer" — never an identifier. The Overview names only the categories of data handled (email, calendar, CRM, meeting transcripts) and the platforms (Zoom, Teams, Google Meet), not who uses the platform.
- **No internal ticket numbers, PR numbers, or repository paths.** None appear anywhere in the new content — checked `content/work/xylo.mdx` and the new Notes post specifically for anything that looked like an identifier (e.g. `#1234`, a Jira-style key, a `github.com/<employer-org>/...` path) and found none.
- **No agent-methodology internals.** "Working style" again describes only the *shape* of the process (discovery → spec → story decomposition → build → review → delivery) and explicitly states internals aren't shared. The Notes post is entirely about the monitoring/alerting engineering problem (event-driven signal absence, expected-count baselines, platform gating) — it does not touch how any AI agent or prompt is structured or makes decisions.
- `npm run build` passes clean with all changes included; the new Notes post appears first in both `/notes` and the homepage's recent-notes list, and `/work/xylo` reflects the updated content.

**Still open:** all TODOs from §2 remain (including FiPet's description), plus the new one in the fourth Notes post (owner review before publishing).
