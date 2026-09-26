# tabeen.dev

Personal site — a minimalist portfolio for ML/DS work, other engineering projects, and writing.

Built with Next.js 15, TypeScript, Tailwind CSS v4, and MDX. Single forest dark theme with cream typography and orange accent. Deploys to Cloudflare Pages.

---

## Table of contents

1. [First-time setup](#first-time-setup)
2. [Daily workflow](#daily-workflow)
3. [Adding a project](#adding-a-project)
4. [Adding a blog post](#adding-a-blog-post)
5. [Setting up comments (Giscus)](#setting-up-comments-giscus)
6. [Deploying to Cloudflare Pages](#deploying-to-cloudflare-pages)
7. [Connecting your domain](#connecting-your-domain)
8. [Analytics](#analytics)
9. [LinkedIn previews](#linkedin-previews)
10. [Customization](#customization)
11. [Project structure](#project-structure)

---

## First-time setup

### Prerequisites

- Node.js 18.17+ ([install](https://nodejs.org))
- A GitHub account
- A Cloudflare account (free tier is fine)

### Local setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Start dev server
npm run dev
```

Open <http://localhost:3000>. You should see the home page with the sample featured project and blog post.

> **Comments will not work locally until you complete the Giscus setup below.** The site will show a placeholder where comments would appear, which is fine for development.

---

## Daily workflow

```bash
# Start the dev server
npm run dev

# Build for production (verify no errors)
npm run build

# Preview the Cloudflare Pages build locally
npm run preview
```

When you're happy with changes, commit and push to GitHub. Cloudflare Pages will auto-deploy in about 60 seconds.

---

## Adding a project

Every project is a single MDX file in `content/work/` (for ML/DS) or `content/work/` (for everything else). Adding a project = creating a file and pushing to git.

### Steps

1. Create a new file: `content/work/your-project-slug.mdx` (the slug becomes the URL: `/work/your-project-slug` (or `/research/your-project-slug`))
2. Fill in the frontmatter and write the body in Markdown
3. Commit and push

### Frontmatter reference

```yaml
---
# Required
title: "Project Title"
description: "One-sentence summary that appears on cards and in OG previews."
date: "2026-04-15"   # ISO date — controls sort order

# Optional — all of these can be omitted
tags: ["Computer vision", "CNN"]      # Pills shown on the card and detail page
stack: ["Python", "PyTorch"]          # Tech stack pills at bottom of detail page
github: "https://github.com/..."      # Adds a GitHub button
demo: "https://huggingface.co/..."    # Embeds the URL as a live demo iframe
diagram: "/diagrams/arch.png"         # Path to architecture image (under /public)
video: "https://youtube.com/embed/..."  # Embeds video (use YouTube embed URL)
status: "Active"                      # "Active", "In progress", "Complete", etc.
featured: true                        # Show on home page (only one project should be featured)
ogImage: "/og/custom-image.png"       # Override auto-generated OG image

# Optional research section — only renders if present
research:
  summary: "Short paragraph describing methodology, ablations, and results."
  paper: "https://arxiv.org/..."      # Link to PDF or arXiv
  results: "https://..."              # Link to detailed results / benchmarks
---

## Overview

Your writeup goes here in standard Markdown. You can use:

- **Bold** and *italic*
- Headings (`##`, `###`)
- Lists, ordered and unordered
- `inline code` and code blocks
- [Links](https://example.com)
- > Blockquotes
- Tables (GitHub-flavored Markdown)
```

### What auto-renders on the project page

The detail page builds itself based on what's in your frontmatter:

| Frontmatter field | What renders |
|---|---|
| `demo` | "Try it" iframe at the top |
| `diagram` | "Architecture" section with the image |
| `video` | "Demo video" section |
| `research.*` | "Research" section with microscope icon |
| `stack` | "Stack" pills at the bottom |
| `github` / `demo` | Buttons in the header |

If you don't include a field, that section simply doesn't appear. This is what keeps every project page minimal — only sections with actual content are visible.

---

## Adding a blog post

Same pattern, in `content/notes/`:

```bash
content/notes/2026-05-15-some-thoughts-on-something.mdx
```

Frontmatter is simpler:

```yaml
---
title: "Post title"
description: "Subtitle that appears on the index and OG preview."
date: "2026-05-15"
ogImage: "/og/custom.png"   # Optional — uses auto-generated otherwise
---
```

Comments appear automatically at the bottom of every post (once Giscus is configured).

---

## Setting up comments (Giscus)

This is a one-time setup that takes about 5 minutes.

1. **Push your code to a public GitHub repo** (e.g. `tabeen/tabeen.dev`)
2. **Enable Discussions** on the repo: Settings → General → Features → check "Discussions"
3. **Install the Giscus app**: <https://github.com/apps/giscus> → Install on your repo
4. **Configure**: visit <https://giscus.app>
   - Repository: enter your repo name (e.g. `tabeen/tabeen.dev`)
   - Page-discussion mapping: choose **"Discussion title contains page pathname"**
   - Discussion category: create a new "Comments" category in your repo (Discussions → Categories → New) and select it here
5. **Copy the values** giscus.app generates — you'll see four `data-*` attributes
6. **Add to `.env.local`**:

```bash
NEXT_PUBLIC_GISCUS_REPO=tabeen/tabeen.dev
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxx              # from data-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxx        # from data-category-id
```

7. **Add the same vars to Cloudflare Pages**: Pages dashboard → your project → Settings → Environment variables → add each one

### Moderating comments

Comments live as GitHub Discussions on your repo. To moderate:

- Open your repo on GitHub → Discussions
- Click any discussion to see comments
- Hover a comment → click the "..." menu → Hide / Edit / Delete
- You can lock a discussion to prevent further comments
- You'll get GitHub notifications for new comments by default

---

## Deploying to Cloudflare Pages

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create tabeen.dev --public --source=. --push
# Or use the GitHub web UI to create the repo and push manually
```

### Step 2: Connect to Cloudflare Pages

1. Sign in to <https://dash.cloudflare.com>
2. Workers & Pages → Create → Pages → Connect to Git
3. Select your `tabeen.dev` repo
4. Configure build:
   - **Framework preset**: Next.js
   - **Build command**: `npx @cloudflare/next-on-pages`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/`
5. Add environment variables (same Giscus vars as `.env.local`)
6. Compatibility flags: under Settings → Functions → Compatibility flags, add `nodejs_compat` for both Production and Preview
7. Click "Save and Deploy"

The first build takes about 2 minutes. After that, every push to your main branch auto-deploys.

You'll get a `*.pages.dev` URL — the site is live there even before you connect your custom domain.

---

## Connecting your domain

Since you bought tabeen.dev through Cloudflare, this is trivial:

1. In your Pages project → Custom domains → Set up a custom domain
2. Enter `tabeen.dev`
3. Click Continue — Cloudflare detects the domain in your account and configures DNS automatically
4. Repeat for `www.tabeen.dev` if you want it
5. Wait ~1 minute for SSL provisioning

That's it. tabeen.dev is now live.

---

## Analytics

Self-hosted page-view tracking — no third-party service, no cookies, no
raw IPs or user agents stored. Storage is [Cloudflare D1](https://developers.cloudflare.com/d1/),
a SQLite database included with Cloudflare Pages.

**How it works:**
- `src/components/Analytics.tsx` sends one `navigator.sendBeacon` per page
  view to `/api/track` (`src/app/api/track/route.ts`), which writes a row
  to D1: the path, the external referrer's hostname (if any), the visitor's
  country (from Cloudflare's `CF-IPCountry` header), and a *visitor hash*.
- The visitor hash is `SHA-256(salt, today's date, IP, user agent)`,
  truncated to 16 hex characters. Because the date is part of the input,
  the same person hashes to a completely different value tomorrow — so
  "unique visitors" can be counted per day without a cookie, and nobody
  can be tracked across days from this data. The salt is a secret you set
  once (below); without it, nothing is recorded.
- Bots, `/api/`, `/stats`, and this site's own internal pages are never
  tracked. Browsers sending `Do Not Track` or the Global Privacy Control
  signal are skipped client-side.
- `/stats` (`src/app/stats/page.tsx`) is the dashboard: total views/visitors,
  a daily chart with a table-view fallback, and top pages/referrers/countries.
  It's gated by HTTP Basic auth (any username, one shared password) in
  `src/middleware.ts`, and fails closed — if the password isn't configured,
  the page 503s instead of being public.

### One-time setup (Cloudflare dashboard — can't be done from the CLI/repo)

1. **Create the D1 database:**
   ```bash
   npx wrangler d1 create tabeen-analytics
   ```
   This prints a `database_id` — you don't need to put it anywhere in this
   repo (production reads the binding from the dashboard, not a committed
   config file); just keep the terminal output for step 2.

2. **Apply the schema to the real database** (each file once, in order):
   ```bash
   npx wrangler d1 execute tabeen-analytics --remote --file=migrations/0001_init.sql
   npx wrangler d1 execute tabeen-analytics --remote --file=migrations/0002_excluded_networks.sql
   ```

3. **Bind it to the Pages project:** Cloudflare Pages dashboard → your
   project → Settings → Functions → D1 database bindings → add binding,
   variable name `DB`, select `tabeen-analytics`. Do this for both
   Production and Preview.

4. **Set two encrypted environment variables** (Settings → Environment
   variables, as *secret*, for both Production and Preview):
   - `ANALYTICS_SALT` — a long random string, e.g. `openssl rand -hex 32`
   - `STATS_PASSWORD` — whatever password you want to view `/stats` with

5. **Redeploy** (Settings changes don't apply to already-running
   deployments — trigger a new one, e.g. an empty commit or "Retry
   deployment").

6. Visit `https://tabeen.dev/stats` and sign in with any username and the
   `STATS_PASSWORD` you set.

### Excluding your own visits

Two independent mechanisms, both managed from `/stats`:

- **Your browsers, on any network.** Opening `/stats` in a browser stores a
  flag in that browser's local storage (`tabeen:analytics-opt-out`), and the
  tracker never sends a beacon from it again. Open `/stats` once in each
  browser on each device. Private/incognito windows start without the flag
  and are counted.
- **Your home network, any device.** `/stats` shows whether the network
  you're on is counted, with an "Exclude this network" button. It stores the
  network in the `excluded_networks` table — the exact address for IPv4, or
  the `/64` for IPv6 (every device on a home LAN shares it, so this covers
  phones, laptops, and guests). The tracker skips any visit from an excluded
  network. The button only ever excludes the network the request came from;
  nothing can be typed in.

Home internet addresses change occasionally. When `/stats` shows your home
network as counted again, exclude it again and remove the stale entry. If
your home has both IPv4 and IPv6, a device may use either; if a second
device's `/stats` shows a different address, exclude that one too.
Changes reach the tracker within about a minute (it caches the list).

Visits recorded before a browser or network was excluded stay in the data —
visitor hashes can't be traced back to a person, by design.

### Local development

```bash
cp .dev.vars.example .dev.vars     # fill in a salt and a password
npm run analytics:migrate:local    # creates and seeds a local D1 (gitignored)
npm run dev
```

`next.config.mjs` calls `setupDevPlatform()` in development, which reads
`wrangler.dev.toml` and `.dev.vars` to simulate the D1 binding locally —
`npm run build` / `next build` don't need any of this and are unaffected.

`wrangler.dev.toml` (not `wrangler.toml`) is deliberate: Cloudflare Pages
treats a committed `wrangler.toml` as the source of truth for production
bindings, which would fight with what's configured in the dashboard above.

---

## LinkedIn previews

When you paste a tabeen.dev URL on LinkedIn, it should show a preview with the page title, description, and an auto-generated image.

### How to verify

1. Publish a post or project
2. Go to <https://www.linkedin.com/post-inspector/>
3. Paste your URL
4. Click "Inspect"

You should see the title, description, and OG image render correctly.

### If LinkedIn shows an old preview

LinkedIn caches previews aggressively. If you update an OG image and it's still showing the old one:

- Use the Post Inspector and click "Re-fetch" — that forces LinkedIn to re-fetch the meta tags
- It can sometimes take up to a few hours for the cache to fully clear

### Custom OG image per post

By default, every page gets an auto-generated OG image with the title on a deep forest green background with a cream serif title and an orange accent. If you want a custom image for a specific post:

1. Drop the image at `public/og/your-image.png` (1200x630px recommended)
2. Reference it in the post frontmatter: `ogImage: "/og/your-image.png"`

---

## Customization

### Colors

All design tokens live in `src/app/globals.css` under `@theme`. Edit there to change the palette. The site uses a single committed theme (forest dark with orange accent) — no light/dark toggle, no theme switching logic to maintain.

### Fonts

Defined in `src/app/layout.tsx`. Currently using:

- Instrument Serif (headings)
- Inter (body)
- JetBrains Mono (code)

Swap the imports from `next/font/google` to change.

### Site metadata

Edit `src/app/layout.tsx` for the site-wide title, description, and OG defaults.

### Social links

Hardcoded in:
- `src/components/Footer.tsx` (footer links)
- `src/app/contact/page.tsx` (contact page)
- `src/app/about/page.tsx` (about/experience section)

Update these to your actual handles.

### About page

Edit `src/app/about/page.tsx` directly. It's not MDX-driven because there's only one of it and it benefits from custom layout.

### Adding a new section/page

1. Create `src/app/your-section/page.tsx`
2. Add a `<NavLink href="/your-section">Your Section</NavLink>` to `src/components/Header.tsx`
3. If it should pull from MDX content, mirror the pattern in `src/app/work/page.tsx`

---

## Project structure

```
tabeen-dev/
├── content/                    # All your MDX content
│   ├── work/                    # Production & applied engineering
│   ├── research/                # Papers-in-progress, research directions
│   └── notes/                   # Short technical notes
├── public/                     # Static assets
│   ├── diagrams/               # Architecture diagrams referenced in projects
│   ├── og/                     # Custom OG images (optional overrides)
│   └── resume.pdf              # Your downloadable CV
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/og/             # Auto-generated OG image route
│   │   ├── api/track/          # Analytics beacon endpoint
│   │   ├── stats/               # Analytics dashboard (password-gated)
│   │   ├── work/               # Work pages (index + [slug])
│   │   ├── research/           # Research pages (index + [slug])
│   │   ├── notes/              # Notes pages (index + [slug])
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   ├── globals.css         # Design tokens + base styles
│   │   ├── layout.tsx          # Root layout (fonts, theme, header/footer)
│   │   ├── page.tsx            # Home page
│   │   ├── sitemap.ts          # Auto-generated sitemap
│   │   └── robots.ts           # robots.txt
│   ├── components/             # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── NavLink.tsx
│   │   ├── Analytics.tsx       # Page-view beacon (client)
│   │   └── Comments.tsx        # Giscus wrapper
│   ├── lib/
│   │   ├── content.ts          # MDX file loading + frontmatter parsing
│   │   └── analytics.ts        # Visitor hashing, bot filter, auth check
│   └── middleware.ts           # Basic-auth gate for /stats
├── migrations/                 # D1 schema (analytics)
├── .env.local.example          # Template for local env vars
├── .dev.vars.example           # Template for local Cloudflare secrets
├── wrangler.dev.toml           # Local-only D1 config (see Analytics)
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## Common tasks

| Task | What to do |
|---|---|
| Add a Work item | Create `content/work/slug.mdx` |
| Add a Research item | Create `content/research/slug.mdx` |
| Add a Note | Create `content/notes/slug.mdx` |
| Change which project is featured on home | Set `featured: true` in one project's frontmatter (and false on others) |
| Update your bio | Edit `src/app/about/page.tsx` |
| Change colors | Edit `@theme` block in `src/app/globals.css` |
| Hide a project temporarily | Move the file out of `content/` (e.g. to `_drafts/`) and rebuild |
| Update social links | Edit `src/components/Footer.tsx` and `src/app/contact/page.tsx` |
| Replace resume PDF | Drop new file at `public/resume.pdf` |

---

## Troubleshooting

**Build fails with "Module not found"** — run `npm install` again. If that doesn't fix it, delete `node_modules` and `.next` and reinstall.

**Giscus comments show "configuration not found"** — the env vars probably aren't set in Cloudflare Pages. Add them under Settings → Environment variables and trigger a redeploy.

**Auto-generated OG image is blank** — make sure the `nodejs_compat` compatibility flag is enabled in Cloudflare Pages. The OG image route uses Edge runtime which needs it.

**iframe demo doesn't load** — many sites block iframe embedding via `X-Frame-Options`. Hugging Face Spaces and CodeSandbox both allow it. For other demos, you may need to host them yourself or link out instead of embedding.

---

## License

Personal project. Code is yours to modify; if you want to credit the original scaffold, a link to tabeen.dev is appreciated but not required.
