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
    { url: `${SITE_URL}/ml`, lastModified: new Date(), priority: 0.9 },
    { url: `${SITE_URL}/projects`, lastModified: new Date(), priority: 0.8 },
    { url: `${SITE_URL}/writing`, lastModified: new Date(), priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), priority: 0.5 },
  ];

  // Dynamic pages from MDX content
  const mlProjects = getAllContent("ml").map((p) => ({
    url: `${SITE_URL}/ml/${p.slug}`,
    lastModified: new Date(p.meta.date),
    priority: 0.7,
  }));

  const otherProjects = getAllContent("projects").map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: new Date(p.meta.date),
    priority: 0.6,
  }));

  const writing = getAllContent("writing").map((p) => ({
    url: `${SITE_URL}/writing/${p.slug}`,
    lastModified: new Date(p.meta.date),
    priority: 0.6,
  }));

  return [...staticPages, ...mlProjects, ...otherProjects, ...writing];
}
