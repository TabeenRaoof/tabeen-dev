# tabeen.dev — visual and structural pass

Branch: `site/visual-pass`. Not merged, not deployed. `npm run build` passes clean as of this review.

Read before changing anything: `src/app/globals.css` (the only token layer — color tokens existed, no type-scale layer did), `src/app/work/page.tsx` / `src/app/research/page.tsx` (duplicated card markup, two different badge styles), `src/components/NavLink.tsx` and `src/components/Header.tsx` (nav), and every content file with a frontmatter `description` (to find role/date text embedded in prose).

---

## 1. Tokens added or changed

| Token | Before | After | Why |
|---|---|---|---|
| `--color-accent` | `#D8602A` | `#D9632E` | Failed AA as topic-badge text on `--color-accent-soft` (4.49:1) and as hover text on `--color-surface` (4.43:1). Same hue/saturation, one lightness step up — visually near-identical. Now clears both (4.61:1, 4.55:1) plus every other pairing it's used in. |
| `--text-2xs` (new) | *(didn't exist — two one-off values instead)* | `0.6875rem` (11px), line-height `1rem` | Badge/pill and caption text had drifted into two undocumented arbitrary values, `text-[10px]` (index cards) and `text-[11px]` (detail pages), for the same visual role. Collapsed to one named token, used everywhere a badge/pill/caption appears. |

No other color tokens changed. `--color-muted` was already fixed in an earlier pass (documented in its own comment in `globals.css`) — verified still passing, not re-touched.

**Type and spacing scale:** the codebase had a color token layer (`--color-*` in `@theme`) but no equivalent for type — font sizes came entirely from Tailwind's default scale (`text-xs`…`text-5xl`) plus the two one-off badge sizes above. Rather than reinvent Tailwind's scale, `--text-2xs` extends it with the one size the project actually needed but didn't have, following the same `@theme` mechanism as the color tokens (Tailwind v4 auto-generates the `text-2xs` utility from it). Spacing was audited separately (grep for `px-[`, `py-[`, `gap-[`, `w-[`, `h-[`, `mx-[` arbitrary values across every `.tsx` file) and found to already be 100% on Tailwind's default spacing scale — no one-off spacing values exist, so no spacing tokens were added.

**One-off values that remain, deliberately:**
- `h-[600px]` / `h-[700px]` (demo iframe heights) and `mx-[-7rem]` / `mx-[-12rem]` (breakout container width beyond the article's reading column) in `work/[slug]/page.tsx` and `research/[slug]/page.tsx`. These encode actual layout/content requirements (a specific embed's aspect needs, an intentional breakout width), not design drift — tokenizing them would just relocate the same one-off number, not eliminate it.
- `border-b-[1.5px]` in `NavLink.tsx` (active-state underline thickness). Border-width wasn't in scope of "colour and type" tokens; flagged here for visibility rather than silently left out of the audit.
- `src/app/api/og/route.tsx`'s hardcoded hex `COLORS` object. This is a **documented, necessary exception**: `next/og`'s `ImageResponse` renders through Satori, which has no CSS custom-property support, so `var(--color-accent)` cannot resolve there the way it does everywhere else. The file now carries a comment explaining this and instructing future edits to keep it in sync by hand — which is exactly what happened here (its `accent` value was updated from `#D8602A` to `#D9632E` in this pass; it had gone stale before this review caught it).

---

## 2. Contrast table — every text/background pair, before → after

Computed via the WCAG relative-luminance formula (not eyeballed), threshold 4.5:1 for normal text / 3:1 for large text or non-text UI. "Before" = state at the start of this pass (i.e. after the earlier accessibility round, before today's accent change).

| Pair | Before | After | AA (4.5:1) | Used for |
|---|---|---|---|---|
| ink on bg | 16.04:1 | 16.04:1 | PASS | body text |
| ink on surface | 14.77:1 | 14.77:1 | PASS | body text on cards |
| ink on line | 13.32:1 | 13.32:1 | PASS | body text on badge/chip backgrounds |
| muted on bg | 6.84:1 | 6.84:1 | PASS | secondary text |
| muted on surface | 6.29:1 | 6.29:1 | PASS | secondary text on cards |
| muted on line | 5.68:1 | 5.68:1 | PASS | secondary text on chips |
| **accent on bg** | 4.81:1 | **4.94:1** | PASS | links, hero emphasis, hover states |
| **accent on surface** | **4.43:1 (FAIL)** | **4.55:1** | **PASS** | hover text on `bg-surface` cards (e.g. homepage Featured card) |
| **accent on accent-soft** | **4.49:1 (FAIL)** | **4.61:1** | **PASS** | topic-badge text on its own pill background |
| accent-2 on bg | 12.07:1 | 12.07:1 | PASS | status-badge text directly on page background |
| accent-2 on accent-2-soft | 9.82:1 | 9.82:1 | PASS | status-badge text on its own pill background |

Two real, previously-shipped AA failures fixed by the single `--color-accent` change: **hover text on the homepage's Featured card** and **every topic badge sitewide** (both used `text-accent` on backgrounds the old accent value didn't clear). Everything else was already passing and is reported to confirm the change didn't regress it.

`accent on line` (4.10:1, still under 4.5) was checked and confirmed **not used anywhere** as a text/background pairing — `--color-line` is only ever a border or a chip background paired with `text-muted`, never with `text-accent`. Noted so it doesn't get introduced by accident later.

---

## 3. Greyscale verification of the badge system

Badges were already immune to "color is the only signal" in the strict sense — the word itself ("Active", "Complete", "Computer vision", etc.) carries the meaning, not just the pill's hue. This pass also checked whether topic and status badges remain visually distinct from each other under full desaturation (relevant for e.g. colorblind users, not just contrast):

| Badge element | Hex | Relative luminance (0=black, 1=white) |
|---|---|---|
| Topic badge text (`--color-accent`) | `#D9632E` | 0.2387 |
| Status badge text (`--color-accent-2`) | `#D4DC3F` | 0.6554 |
| Topic badge background (`--color-accent-soft`) | `#2A1A10` | 0.0127 |
| Status badge background (`--color-accent-2-soft`) | `#2A2A10` | 0.0219 |

Topic-badge text and status-badge text differ by ~0.42 in luminance — a large, clearly visible gap in pure greyscale (one renders as a dark-mid grey, the other as a light grey), independent of hue. Combined with the distinct text labels, the badge system does not rely on color alone by either the strict WCAG reading (word content) or the stronger one (luminance separation in greyscale).

---

## 4. Components refactored, one-off values removed

**New shared components:**
- `src/components/Badge.tsx` — replaces four separate inline `<span>` implementations (Work index cards, Research index cards, Work detail header, Research detail header) that had drifted into two different visual styles: Work used flat grey (`text-muted bg-line`) for every badge; Research used the accent/accent-2 colors. Both now render identically via one component. Also fixes badge *order* — the spec calls for `[status badge] [topic badge]`; the old markup put topic first, status second, on every card and every detail header. All four are now status-first.
- `src/components/ContentCard.tsx` — replaces the duplicated card markup in `work/page.tsx` and `research/page.tsx`, and the separately-hand-built Featured-project card on the homepage (`src/app/page.tsx`). One component now backs all three.

**Card structure fix (Task 4):** the shape is now, top to bottom: `[status badge] [topic badge]` → Title → Subtitle (optional) → Description (prose only) → Date (own slot, bottom). This required a schema change:
- Added an optional `subtitle` field to `ContentMeta` (`src/lib/content.ts`), documented as "role/byline, never folded into the description or repeated with the date."
- **`content/work/xylo.mdx`**: `description` was `"Forward Deployed / Backend Engineer Intern · June 2026 – Present. Own the ingestion..."` — role and date duplicated the card's own status/date rendering. Moved the role into `subtitle`, trimmed `description` to prose only.
- **`content/work/fipet.mdx`**: same pattern (`"Software Engineer Intern, Feb 2026 – June 2026. Built and deployed..."`) — same fix.
- **`content/research/truphoto.mdx`**: the byline (*"Tabeen Raoof and Joao Cozza · CS483..."*) lived as a hand-italicized line in the MDX body, not a structural field — moved into `subtitle` for consistency with Work, removed from the body.
- Checked every other content file's `description` for the same pattern (`aws-eks-cloud-security`, `proofshape`, `busybees`, `text-autocomplete-trie`, `fake-job-detector`, `vlm-relational-reasoning`, `stereon`) — none had role/date embedded; no changes needed there.

**Cards/lists that don't fit this shape, and why (as requested — reporting rather than forcing them into it):**
- **Notes index (`/notes`) and the homepage's Recent Notes list.** These are a title/description/date list, not a badge card — no status, no topic tag, by original design (list view "closer to Paul Graham's essay list," per the existing code comment). Forcing badges onto them would be inventing content that isn't there. Left as-is; only added a focus-visible ring for consistency with everything else.
- **`/_logo-preview`** isn't content-driven at all (no frontmatter), so it's outside this system entirely by nature.

**One-off text sizes eliminated:** every `text-[10px]` and `text-[11px]` in `work/page.tsx`, `research/page.tsx`, `work/[slug]/page.tsx`, `research/[slug]/page.tsx`, and `page.tsx` — replaced by `text-2xs` (via the `Badge`/`ContentCard` components, or directly for non-badge captions like "Try it" and the Stack pills, which used the same undocumented 11px value).

**Logo tokenized:** `src/components/Logo.tsx` used nine hardcoded hex fills (`fill="#F5F2E8"` etc.) instead of the existing color tokens. Replaced every one with Tailwind's `fill-ink` / `fill-line` / `fill-accent-2` utilities (confirmed these compile to real `fill:var(--color-*)` rules in the built CSS — see below). If the palette changes again, the logo now updates automatically instead of drifting.

**A leftover bug fixed in passing:** `work/[slug]/page.tsx`'s back-link read "Projects" (pointing to `/work`) — a leftover label from the pre-restructure IA that survived the earlier rename. Fixed to "Work."

---

## 5. The logo comparison

**Where to view it:** `/_logo-preview` (route folder is literally named `%5Flogo-preview` — Next.js's App Router treats a plain `_`-prefixed folder as a private, unrouted folder, so the `%5F`-escaped name was required to actually get a working `/_logo-preview` URL rather than a 404).

- Shows the current 3×3 dot-grid mark and the proposed alternative side by side, at 16px, 32px, 64px, and header size (22px, inline with the wordmark).
- Two backdrop panels: the site's actual dark background, and a light background as a context check (tabeen.dev has no light theme, so this is a background swap to sanity-check the mark against a light context like a browser tab bar — not a themed re-render; the page says so explicitly).
- `robots.ts` now disallows `/_logo-preview`; it was never in `sitemap.ts` to begin with.
- `metadata.robots = { index: false, follow: false }` on the page itself, as a second layer.

**The alternative (`LogoAlt` in `Logo.tsx`):** a single horizontal row of seven dots, radius tapering from largest near the leading (left) edge down to smallest at the trailing edge, spacing deliberately uneven (not a repeating unit) — closer to the source photograph's actual row of variously-sized, unevenly-spaced spots than the current square lattice. Rendered monochrome (`fill-ink`) rather than the current mark's two-tone cream/chartreuse, since the brief specifically flagged the chartreuse dots as reading too close to "yellow" to work as an accent, and it sits near the heading cream in hue besides.

**The current default logo is unchanged.** `Logo()` still renders the existing 3×3 mark by default; `LogoAlt` only appears via `NEXT_PUBLIC_LOGO_VARIANT=alt` (documented in `.env.local.example`) or on the preview page. **The choice is the owner's** — this pass makes no recommendation between them.

**Favicon note (found during this task, not fixed):** there is no favicon at all in the project — no `favicon.ico`, no `icon.tsx`/`icon.png` under `src/app/`. This predates this pass. Since a favicon should probably be generated from whichever mark gets chosen at `/_logo-preview`, it wasn't added now to avoid producing one from the mark that might get rejected. Flagged for a follow-up once the logo decision is made.

---

## 6. Everything else (Task 6)

**Rendering consistency — "left column cards look dimmer":** investigated and confirmed **real, but not a bug.** `ContentCard` (formerly inline in `work/page.tsx`) dims any card whose `status` contains "progress" via `opacity-60` — an intentional, pre-existing feature to visually de-emphasize in-progress work. Checked every Work item's date and status: `proofshape.mdx` (`status: "In progress"`) has the most recent date, so it sorts to position 0, which lands in the **left** column of the two-column grid. That's the dimmed card the screenshot caught. It is not a hover state stuck mid-transition, not a scroll-triggered animation that failed to fire (grepped the whole codebase for `IntersectionObserver`, `animate`, `nth-child` — none exist), and not a capture artifact — reloading/re-rendering would show the same thing every time, because it's driven by content data (date + status), not by scroll position or column index.

**Card hit area / accessible name:** `ContentCard`'s entire card is one `<Link>` (full hit area), but its accessible name is deliberately composed — `[title, subtitle, status, description, date].filter(Boolean).join(". ")` — rather than left to the browser's default DOM-order concatenation of badges, title, description, and date, which is what Work and Research cards were doing before. Visual badge/date elements inside the card are `aria-hidden`, since their content is already folded into the label. Applied the same explicit-`aria-label` treatment to the homepage's two "All work/All research/All notes →" corner links (previously just `text-xs` links with no touch-target consideration — see below) and confirmed the Notes list items were left alone deliberately (see §4) since their default title-then-description-then-date reading order is already coherent without badges to concatenate.

**Hover vs. focus:** every interactive element's hover state is a color/border/opacity change (`hover:text-ink`, `hover:border-accent`, `hover:bg-surface`, `opacity-60 hover:opacity-100`); focus is a 2px accent outline via the global `:focus-visible` rule in `globals.css` plus matching component-level classes. The two are visually distinct everywhere; nothing uses the same visual treatment for both.

**`prefers-reduced-motion`:** already handled globally (added in an earlier pass) — a blanket `@media (prefers-reduced-motion: reduce)` block collapses all `animation-duration`, `transition-duration`, and `scroll-behavior` to near-zero. Re-verified it still covers every transition introduced in this pass (all of them are plain Tailwind `transition-colors`/`transition-opacity`, which the blanket rule catches).

**Touch targets ≥44×44 CSS px (mobile, nav included):** audited every interactive element's rendered box size and fixed what was under target:
- **Nav items** (`NavLink.tsx`) and the **logo/home link** (`Header.tsx`): were ~20–28px tall with no padding. Fixed via a `relative` + `before:absolute before:-inset-*` invisible pseudo-element rather than real padding, specifically so the visible text size and the active-state underline's position stay exactly where they were. Horizontal expansion is capped below half the gap between items (6px each side on mobile where the gap is 16px, 12px on `sm:+` where the gap is 28px) so adjacent nav items' hit areas can't overlap into an ambiguous double-tap zone.
- **Footer social links** (`Footer.tsx`): same pattern, same overlap-safe math (16px gap).
- **Hero "See my work" button, hero "Research" link, About page's résumé-download button:** `py-2.5`/`py-2` → `py-3` (now 44px tall: 12px×2 padding + 20px line-height).
- **GitHub/demo buttons on Work and Research detail pages:** `py-1.5` → `py-3.5` (these use `text-xs`, 16px line-height, so needed more added padding than the `text-sm` buttons to clear 44px: 14px×2 + 16px = 44px exactly).
- **Homepage's "All work/research/notes →" corner links:** were bare `text-xs` links with zero padding — added the same invisible-pseudo-element expansion (12px on all sides; safe here since there's no adjacent interactive sibling to overlap).

**200% zoom, no horizontal scroll:** not independently verified in a real browser (none was available in this environment). Reasoned from the code instead: every container uses relative units (`max-w-3xl`/`max-w-2xl` + `px-*` gutters, no fixed pixel-width wrappers), the two iframe embeds are `w-full` (only their *height* is a fixed pixel value), and the card grid collapses to one column below `sm:`. Nothing in the codebase sets a fixed `width` that would force a horizontal scrollbar at 200% zoom, but this is a code-level inference, not a confirmed browser test — flagged as unverified below.

**Responsive at 375/768/1024/1440:** same limitation — no browser or screenshot tooling was available in this environment (checked for a local Chromium/Playwright/Puppeteer install; none exists). Reviewed the actual breakpoint usage instead: the card grid is `grid-cols-1 sm:grid-cols-2` (single column below 640px, where cramping would be most likely), the nav collapses its gap from `gap-7` to `gap-4` below `sm:` rather than wrapping or hiding items, and the hero heading/subheading use `text-4xl sm:text-5xl` with a `max-w-2xl` cap so long lines don't run edge-to-edge on wide viewports. No obvious overflow source was found in the markup, but this is not the same as having watched it render at each width — flagged as unverified below.

**Spacing and type scale — one-offs found:** covered in §1. Everything in the spacing dimension was already on Tailwind's default scale; the only type-scale gap was the badge/caption size, now closed by `--text-2xs`. `border-b-[1.5px]` (border-width, not spacing/type) and the two iframe-related pixel values are the only other one-offs left in the codebase, both left in place with reasoning given in §1.

**Favicon and OG image:** see §5 for the favicon (doesn't exist). The OG route (`/api/og`) was fetched directly at real dimensions (1200×630) and confirmed rendering correctly — logo mark, category label, title, and the bottom accent bar all render — but its color values are hand-maintained (Satori/`ImageResponse` can't read CSS custom properties), and its `accent` value was still the old `#D8602A` after this pass's token change until this review caught and fixed it. Now synced to `#D9632E`, with a comment explaining why this file is the one place hex values are hand-copied rather than tokenized, and instructing future edits to update it in the same commit as any `globals.css` color change.

---

## 7. Anything unverified

- **200% zoom** and **375/768/1024/1440 responsive rendering** — reasoned from code, not confirmed in an actual browser (none available in this environment). This is the most important gap in this report: everything above in those two categories is inference, not observation.
- **Actual keyboard-only tap/click testing of the new touch-target and focus changes** — the CSS was verified to compile and the box-model math was computed by hand, but nothing was physically tapped on a touch device.
- ~~Whether the `/_logo-preview` route's `%5F`-folder-name approach survives the Cloudflare Pages / `next-on-pages` build step~~ — checked: ran `npx @cloudflare/next-on-pages` directly, and `/_logo-preview` (plus `/_logo-preview.rsc`) appears correctly in its prerendered-routes output alongside everything else. Not a gap after all.
