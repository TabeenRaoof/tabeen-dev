import { getOptionalRequestContext } from "@cloudflare/next-on-pages";

// Server-side helpers for the self-hosted analytics. Edge runtime only —
// this module reads Cloudflare bindings, so never import it from a client
// component.

// Minimal D1 surface this project uses. Declared locally instead of pulling
// in @cloudflare/workers-types for three methods.
export interface D1Result<T> {
  results: T[];
}
export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  all<T>(): Promise<D1Result<T>>;
  run(): Promise<unknown>;
}
export interface D1Like {
  prepare(query: string): D1Statement;
}

export function getAnalyticsEnv() {
  const env = getOptionalRequestContext()?.env;
  return {
    db: env?.DB,
    salt: env?.ANALYTICS_SALT,
    statsPassword: env?.STATS_PASSWORD,
  };
}

// A deliberately minimal local type for the one Cloudflare request.cf field
// this needs, passed as the generic to getOptionalRequestContext() instead
// of relying on its default IncomingRequestCfProperties type — that type
// comes from @cloudflare/workers-types, which isn't a dependency of this
// project (next-on-pages only references it in its own .d.ts files, guarded
// by tsconfig's skipLibCheck). Declaring the one field used here avoids
// depending on a package that isn't actually installed.
interface CfHostingProps extends Record<string, unknown> {
  asOrganization?: string;
}

export function getRequestOrg(): string | undefined {
  return getOptionalRequestContext<CfHostingProps>()?.cf?.asOrganization;
}

// Substrings of `cf.asOrganization` (Cloudflare's free, no-binding-required
// ASN lookup) for major cloud/hosting providers. Matched case-insensitively.
// This is a coarse, maintained-by-hand signal, not a real IP-intelligence
// database: it exists to catch the common case (a scraper or headless
// browser running on rented cloud infrastructure with a spoofed, normal-
// looking User-Agent — see isBot() above, which only catches bots that
// identify themselves honestly). It does not attempt to catch every
// possible hosting provider, and it will misclassify a human on a
// cloud-hosted VPN or proxy as non-human; for a personal site's traffic
// counts, that tradeoff is fine.
const HOSTING_ORGS = [
  "amazon",
  "aws",
  "google cloud",
  "google llc",
  "microsoft",
  "azure",
  "digitalocean",
  "linode",
  "akamai",
  "ovh",
  "hetzner",
  "oracle",
  "ibm cloud",
  "softlayer",
  "vultr",
  "choopa",
  "alibaba",
  "tencent",
  "contabo",
  "scaleway",
  "upcloud",
  "hostinger",
  "leaseweb",
  "cloudflare, inc",
  "cloudflare workers",
];

export function isHostingProvider(asOrganization: string | undefined): boolean {
  if (!asOrganization) return false;
  const lower = asOrganization.toLowerCase();
  return HOSTING_ORGS.some((org) => lower.includes(org));
}

export function utcDay(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

// Paths that are never recorded: internal pages, API routes, framework assets.
export function isTrackablePath(path: string): boolean {
  if (!path.startsWith("/") || path.length > 200) return false;
  return !/^\/(api|stats|logo-preview-internal|_next)(\/|$)/.test(path);
}

const BOT_PATTERN =
  /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly|curl|wget|python-requests|httpclient/i;

export function isBot(userAgent: string): boolean {
  return userAgent === "" || BOT_PATTERN.test(userAgent);
}

// Truncated SHA-256 of (secret salt, day, IP, UA). The day in the input means
// the same visitor hashes to an unrelated value every day, and the secret
// salt means the hash can't be brute-forced back to an IP.
export async function visitorHash(
  salt: string,
  day: string,
  ip: string,
  userAgent: string,
): Promise<string> {
  const data = new TextEncoder().encode(`${salt}|${day}|${ip}|${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest).slice(0, 8), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

// Accepts any username; checks the password from an HTTP Basic auth header.
export function isAuthorized(authHeader: string | null, password: string | undefined): boolean {
  if (!password || !authHeader?.startsWith("Basic ")) return false;
  let decoded: string;
  try {
    decoded = atob(authHeader.slice("Basic ".length));
  } catch {
    return false;
  }
  const supplied = decoded.slice(decoded.indexOf(":") + 1);
  return constantTimeEqual(supplied, password);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
