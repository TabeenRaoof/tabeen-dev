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
8. [LinkedIn previews](#linkedin-previews)
9. [Customization](#customization)
10. [Project structure](#project-structure)

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

Every project is a single MDX file in `content/ml/` (for ML/DS) or `content/projects/` (for everything else). Adding a project = creating a file and pushing to git.

### Steps

1. Create a new file: `content/ml/your-project-slug.mdx` (the slug becomes the URL: `/ml/your-project-slug`)
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

Same pattern, in `content/writing/`:

```bash
content/writing/2026-05-15-some-thoughts-on-something.mdx
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
3. If it should pull from MDX content, mirror the pattern in `src/app/ml/page.tsx`

---

## Project structure

```
tabeen-dev/
├── content/                    # All your MDX content
│   ├── ml/                     # ML/DS projects
│   ├── projects/               # Other projects
│   └── writing/                # Blog posts
├── public/                     # Static assets
│   ├── diagrams/               # Architecture diagrams referenced in projects
│   ├── og/                     # Custom OG images (optional overrides)
│   └── resume.pdf              # Your downloadable CV
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/og/             # Auto-generated OG image route
│   │   ├── ml/                 # ML pages (index + [slug])
│   │   ├── projects/           # Projects pages
│   │   ├── writing/            # Writing pages
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
│   │   └── Comments.tsx        # Giscus wrapper
│   └── lib/
│       └── content.ts          # MDX file loading + frontmatter parsing
├── .env.local.example          # Template for local env vars
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
| Add an ML project | Create `content/ml/slug.mdx` |
| Add a project | Create `content/projects/slug.mdx` |
| Add a blog post | Create `content/writing/slug.mdx` |
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
