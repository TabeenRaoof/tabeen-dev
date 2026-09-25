import {
  getAnalyticsEnv,
  getRequestOrg,
  isBot,
  isHostingProvider,
  isTrackablePath,
  utcDay,
  visitorHash,
} from "@/lib/analytics";

// Records one page view. Always answers 204 — even when nothing is stored —
// so a missing binding, a bot, or a bad payload never surfaces as an error
// in a visitor's browser.

export const runtime = "edge";

const NO_CONTENT = () => new Response(null, { status: 204 });

export async function POST(request: Request) {
  const { db, salt } = getAnalyticsEnv();
  // Without a salt the visitor hash could be brute-forced back to an IP,
  // so nothing is recorded until both the database and salt are configured.
  if (!db || !salt) return NO_CONTENT();

  // Only accept beacons sent by this site's own pages.
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host) {
    return new Response(null, { status: 403 });
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  if (isBot(userAgent)) return NO_CONTENT();
  // Catches automated traffic running on rented cloud infrastructure with a
  // browser-like User-Agent that isBot() wouldn't flag — see isHostingProvider().
  if (isHostingProvider(getRequestOrg())) return NO_CONTENT();

  let payload: { path?: unknown; referrer?: unknown };
  try {
    const text = await request.text();
    if (text.length > 1000) return NO_CONTENT();
    payload = JSON.parse(text);
  } catch {
    return NO_CONTENT();
  }

  const path = typeof payload.path === "string" ? payload.path : "";
  if (!isTrackablePath(path)) return NO_CONTENT();

  const referrer = externalReferrerHost(payload.referrer, request.url);
  const countryHeader = request.headers.get("cf-ipcountry");
  const country = countryHeader && /^[A-Z0-9]{2}$/.test(countryHeader) ? countryHeader : null;
  const ip = request.headers.get("cf-connecting-ip") ?? "local";

  const now = new Date();
  const day = utcDay(now);
  const visitor = await visitorHash(salt, day, ip, userAgent);

  await db
    .prepare(
      "INSERT INTO pageviews (day, ts, path, referrer, country, visitor) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind(day, now.getTime(), path, referrer, country, visitor)
    .run();

  return NO_CONTENT();
}

function externalReferrerHost(raw: unknown, requestUrl: string): string | null {
  if (typeof raw !== "string" || raw === "") return null;
  try {
    const host = new URL(raw).hostname.replace(/^www\./, "");
    if (host === new URL(requestUrl).hostname.replace(/^www\./, "")) return null;
    return host.slice(0, 100);
  } catch {
    return null;
  }
}
