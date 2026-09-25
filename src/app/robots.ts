import type { MetadataRoute } from "next";

// robots.txt — tells search engines what to crawl.
// We allow everything and point them at the sitemap.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal pages and endpoints — not part of the site, not for
      // search engines or crawlers to index.
      disallow: ["/logo-preview-internal", "/stats", "/api/"],
    },
    sitemap: "https://tabeen.dev/sitemap.xml",
  };
}
