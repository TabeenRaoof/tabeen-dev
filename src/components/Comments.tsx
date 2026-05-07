"use client";

// Giscus comments component.
//
// How it works:
//   - Visitors sign in with their GitHub account
//   - Their comment is stored as a reply on a GitHub Discussion in your repo
//   - You moderate via GitHub's Discussions interface (hide, delete, lock)
//
// Setup steps (do once):
//   1. Enable Discussions on your tabeen.dev repo on GitHub
//   2. Install the Giscus app: https://github.com/apps/giscus
//   3. Visit https://giscus.app, fill in your repo, and copy the values
//      it generates into the .env.local file:
//        NEXT_PUBLIC_GISCUS_REPO=tabeen/tabeen.dev
//        NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxx
//        NEXT_PUBLIC_GISCUS_CATEGORY=Comments
//        NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxx
//
// Theme is fixed to dark since the site is single-theme — Giscus's "dark"
// preset is close enough to our forest palette without needing a custom theme.

import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

export function Comments() {
  const [mounted, setMounted] = useState(false);

  // Wait for client-side mount before rendering Giscus.
  // This prevents a hydration mismatch since Giscus injects an iframe.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="text-sm text-muted py-8 text-center">
        Loading comments…
      </div>
    );
  }

  // Read Giscus config from environment variables —
  // these need to be set in .env.local and in Cloudflare Pages env settings
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  // If env vars aren't set yet (e.g. before initial Giscus setup),
  // show a placeholder rather than a broken widget
  if (!repo || !repoId || !category || !categoryId) {
    return (
      <div className="text-sm text-muted py-8 text-center border border-dashed border-line rounded-md">
        Comments not configured yet. See README for Giscus setup steps.
      </div>
    );
  }

  return (
    <Giscus
      id="comments"
      repo={repo as `${string}/${string}`}
      repoId={repoId}
      category={category}
      categoryId={categoryId}
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      // Fixed dark theme — site is single-theme, so no need to react to changes
      theme="dark"
      lang="en"
      loading="lazy"
    />
  );
}
