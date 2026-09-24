import type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content";

// Sitemap is auto-generated from content folders.
// Adding a new project/post → it appears in the sitemap automatically.
// This helps search engines discover and index new pages.

const SITE_URL = "https://tabeen.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages — these never change in URL structure
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${SITE_URL}/work`, lastModified: new Date(), priority: 0.9 },
    { url: `${SITE_URL}/research`, lastModified: new Date(), priority: 0.8 },
    { url: `${SITE_URL}/notes`, lastModified: new Date(), priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), priority: 0.5 },
  ];

  // Dynamic pages from MDX content
  const work = getAllContent("work").map((p) => ({
    url: `${SITE_URL}/work/${p.slug}`,
    lastModified: new Date(p.meta.date),
    priority: 0.7,
  }));

  const research = getAllContent("research").map((p) => ({
    url: `${SITE_URL}/research/${p.slug}`,
    lastModified: new Date(p.meta.date),
    priority: 0.7,
  }));

  const notes = getAllContent("notes").map((p) => ({
    url: `${SITE_URL}/notes/${p.slug}`,
    lastModified: new Date(p.meta.date),
    priority: 0.6,
  }));

  return [...staticPages, ...work, ...research, ...notes];
}
