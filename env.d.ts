import type { D1Like } from "./src/lib/analytics";

// Cloudflare bindings and variables available via getRequestContext().env.
// All optional: the site must keep working before analytics is configured.
declare global {
  interface CloudflareEnv {
    DB?: D1Like;
    ANALYTICS_SALT?: string;
    STATS_PASSWORD?: string;
  }
}

export {};
