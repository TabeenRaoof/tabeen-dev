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
