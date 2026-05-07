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
};

export default nextConfig;
