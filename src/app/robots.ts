import type { MetadataRoute } from "next";

// robots.txt — tells search engines what to crawl.
// We allow everything and point them at the sitemap.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://tabeen.dev/sitemap.xml",
  };
}
