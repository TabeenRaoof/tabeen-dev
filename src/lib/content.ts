// Content loading layer.
//
// Every project and blog post lives as an .mdx file under /content/{ml,projects,writing}/.
// This module reads those files, parses frontmatter, and returns typed data.
//
// Why this approach:
//   - Adding content = creating a file. No CMS, no DB, no build pipeline tweaks.
//   - Frontmatter holds structured metadata (date, tags, demo URLs).
//   - The MDX body holds prose + embedded React components.
//   - Everything is version-controlled in git alongside the code.
//
// Performance note: this runs at build time (in a Server Component or generateStaticParams),
// so reading the filesystem has zero runtime cost.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

/**
 * Shared frontmatter shape across all content types.
 * Optional fields keep individual files lightweight when extras aren't needed.
 */
export interface ContentMeta {
  /** Display title — required */
  title: string;
  /** One-sentence summary used on index pages and OG cards */
  description: string;
  /** ISO date string (YYYY-MM-DD) — used for sorting and display */
  date: string;
  /** Free-form tags shown as pills on project cards */
  tags?: string[];
  /** Tech stack used (Python, TypeScript, etc.) — shown on detail pages */
  stack?: string[];
  /** GitHub repo URL */
  github?: string;
  /** Live demo URL — embedded as iframe on the project detail page */
  demo?: string;
  /** YouTube/Vimeo URL or video file path */
  video?: string;
  /** Path to architecture diagram image, relative to /public */
  diagram?: string;
  /** Optional research section — paper PDF, results, etc. */
  research?: {
    summary?: string;
    paper?: string;
    results?: string;
  };
  /** Set true to feature on the home page (only the most recent featured item shows) */
  featured?: boolean;
  /** Status badge — "Active", "In progress", "Archived", etc. */
  status?: string;
  /** Optional custom OG image — if absent, one is auto-generated */
  ogImage?: string;
}

/**
 * A loaded content item — frontmatter plus the raw MDX body.
 */
export interface ContentItem {
  slug: string;
  meta: ContentMeta;
  body: string;
}

// ----------------------------------------------------------------------------
// Filesystem helpers
// ----------------------------------------------------------------------------

const CONTENT_ROOT = path.join(process.cwd(), "content");

/**
 * Get all content items from a category folder, sorted newest first.
 *
 * Categories map to folder names: "ml", "projects", "writing".
 * Returns empty array if the folder doesn't exist yet — useful during initial setup.
 */
export function getAllContent(category: string): ContentItem[] {
  const dir = path.join(CONTENT_ROOT, category);

  // Graceful handling for first-time setup or when a category is empty
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"));

  const items = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const fullPath = path.join(dir, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      meta: data as ContentMeta,
      body: content,
    };
  });

  // Sort by date descending — most recent work shows first
  return items.sort((a, b) => {
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });
}

/**
 * Get a single content item by category and slug.
 * Returns null if not found — caller should handle (typically with notFound()).
 */
export function getContentBySlug(
  category: string,
  slug: string
): ContentItem | null {
  const fullPath = path.join(CONTENT_ROOT, category, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    meta: data as ContentMeta,
    body: content,
  };
}

/**
 * Get the single most recently dated featured item across a category.
 * Used on the home page to surface one project prominently.
 */
export function getFeaturedItem(category: string): ContentItem | null {
  const all = getAllContent(category);
  return all.find((item) => item.meta.featured) ?? null;
}

/**
 * Format an ISO date as a human-readable month + year (e.g. "Apr 2026").
 * Centralized here so the format is consistent across all pages.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
