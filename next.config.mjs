// In `next dev`, expose Cloudflare bindings (the analytics D1 database and
// .dev.vars secrets) to getRequestContext(), backed by a local simulated D1.
// Production gets its bindings from the Cloudflare Pages dashboard instead.
if (process.env.NODE_ENV === "development") {
  const { setupDevPlatform } = await import("@cloudflare/next-on-pages/next-dev");
  await setupDevPlatform({ configPath: "./wrangler.dev.toml" });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages compatibility
  // We use next-on-pages for the build, which handles the edge runtime conversion
  experimental: {
    // Enable optimized package imports for smaller bundles
    optimizePackageImports: ['@giscus/react'],
  },
  // Image optimization config — Cloudflare Pages doesn't support Next's default image optimizer
  // so we use unoptimized images and rely on Cloudflare's CDN for delivery
  images: {
    unoptimized: true,
  },
  // 2026-09 IA restructure: /ml, /projects, /writing became /research, /work,
  // /notes. Specific old slugs are redirected to their new home individually
  // (categories were reshuffled, not renamed 1:1); wildcard fallbacks catch
  // anything not listed explicitly so old links never 404.
  async redirects() {
    return [
      // ---- /ml/* -----------------------------------------------------
      {
        source: "/ml/image-authenticity-classifier",
        destination: "/research/truphoto",
        permanent: true,
      },
      {
        source: "/ml/fake-job-detector",
        destination: "/work/fake-job-detector",
        permanent: true,
      },
      { source: "/ml", destination: "/research", permanent: true },
      { source: "/ml/:slug*", destination: "/research/:slug*", permanent: true },

      // ---- /projects/* -------------------------------------------------
      // No specific redirect for /projects/busybees: the BusyBees project
      // page was removed, so the wildcard rule below now correctly sends
      // that old URL to /work/busybees, which 404s.
      {
        source: "/projects/text-autocomplete-trie",
        destination: "/work/text-autocomplete-trie",
        permanent: true,
      },
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/projects/:slug*", destination: "/work/:slug*", permanent: true },

      // ---- /writing/* ----------------------------------------------------
      { source: "/writing", destination: "/notes", permanent: true },
      { source: "/writing/:slug*", destination: "/notes/:slug*", permanent: true },
    ];
  },
};

export default nextConfig;
