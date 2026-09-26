import Link from "next/link";
import { headers } from "next/headers";
import type { Metadata } from "next";
import {
  getAnalyticsEnv,
  ipInCidr,
  isAuthorized,
  networkForIp,
  utcDay,
  type D1Like,
} from "@/lib/analytics";
import { AnalyticsOptOut } from "@/components/AnalyticsOptOut";

// Private analytics dashboard. Gated by HTTP Basic auth in src/middleware.ts;
// re-checked here so the data never renders if the middleware is bypassed.

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stats",
  robots: { index: false, follow: false },
};

const RANGES = [7, 30, 90] as const;
const DAY_MS = 86_400_000;

type DailyRow = { day: string; views: number; visitors: number };
type CountRow = { name: string; views: number };

interface PageProps {
  searchParams: Promise<{ days?: string }>;
}

export default async function StatsPage({ searchParams }: PageProps) {
  const { db, salt, statsPassword } = getAnalyticsEnv();
  const requestHeaders = await headers();
  if (!isAuthorized(requestHeaders.get("authorization"), statsPassword)) {
    return <Shell>Not authorized.</Shell>;
  }

  const { days: daysParam } = await searchParams;
  const days = RANGES.find((r) => String(r) === daysParam) ?? 30;

  if (!db || !salt) {
    return (
      <Shell>
        Analytics isn&apos;t fully configured yet — missing{" "}
        {[!db && "the DB (D1) binding", !salt && "ANALYTICS_SALT"].filter(Boolean).join(" and ")}.
        See README → Analytics.
      </Shell>
    );
  }

  const since = utcDay(new Date(Date.now() - (days - 1) * DAY_MS));
  const [daily, pages, referrers, countries] = await Promise.all([
    db
      .prepare(
        "SELECT day, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors FROM pageviews WHERE day >= ? GROUP BY day",
      )
      .bind(since)
      .all<DailyRow>(),
    topCounts(db, "path", since),
    topCounts(db, "referrer", since),
    topCounts(db, "country", since),
  ]);
  const excluded = await loadExcludedNetworks(db);
  const currentIp = requestHeaders.get("cf-connecting-ip");

  const rows = fillDays(daily.results, since, days);
  const totalViews = rows.reduce((sum, r) => sum + r.views, 0);
  const totalVisitors = rows.reduce((sum, r) => sum + r.visitors, 0);

  return (
    <div className="max-w-page mx-auto px-6 sm:px-8">
      <section className="pt-14 pb-8">
        <p className="text-xs text-muted mb-3 uppercase tracking-wider">Stats</p>
        <h1 className="text-3xl sm:text-4xl text-ink mb-4">Site analytics</h1>
        <p className="text-sm text-muted leading-relaxed max-w-lg">
          Self-hosted on Cloudflare D1. No cookies, no third parties, no raw IPs stored.
        </p>
      </section>

      <nav aria-label="Date range" className="flex flex-wrap gap-2 pb-8">
        {RANGES.map((r) => (
          <Link
            key={r}
            href={`/stats?days=${r}`}
            aria-current={r === days ? "page" : undefined}
            className={`text-sm px-3 py-3 rounded-md border transition-colors ${
              r === days
                ? "text-ink border-accent"
                : "text-muted border-line hover:text-ink hover:border-muted"
            }`}
          >
            Last {r} days
          </Link>
        ))}
      </nav>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-12">
        <StatTile label="Page views" value={formatCount(totalViews)} />
        <StatTile
          label="Visitors"
          value={formatCount(totalVisitors)}
          caption="Unique per day, summed"
        />
        <StatTile label="Views per day" value={(totalViews / days).toFixed(1)} caption="Average" />
      </section>

      <DailyChart rows={rows} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12 py-12 border-t border-line">
        <RankedList title="Top pages" column="Page" rows={pages} empty="No page views yet." />
        <RankedList
          title="Referrers"
          column="Referrer"
          rows={referrers}
          empty="No external referrers yet."
        />
        <RankedList
          title="Countries"
          column="Country"
          rows={countries.map((r) => ({ ...r, name: countryName(r.name) }))}
          empty="No country data yet."
        />
      </div>

      <OwnVisits currentIp={currentIp} excluded={excluded} />

      <p className="text-2xs text-muted pb-16 max-w-lg leading-relaxed">
        Visitors are counted with a hash that changes every day, so the same person is
        counted once per day they visit and can&apos;t be followed across days. Bots,
        cloud-hosted traffic, Do Not Track / Global Privacy Control browsers, your
        excluded browsers and networks, and this page are not counted.
      </p>
    </div>
  );
}

async function topCounts(
  db: NonNullable<ReturnType<typeof getAnalyticsEnv>["db"]>,
  column: "path" | "referrer" | "country",
  since: string,
): Promise<CountRow[]> {
  // `column` comes only from the literal union above, never from user input.
  const { results } = await db
    .prepare(
      `SELECT ${column} AS name, COUNT(*) AS views FROM pageviews
       WHERE day >= ? AND ${column} IS NOT NULL
       GROUP BY ${column} ORDER BY views DESC LIMIT 10`,
    )
    .bind(since)
    .all<CountRow>();
  return results;
}

// D1 only returns days that had views; the chart needs every day in range.
function fillDays(results: DailyRow[], since: string, days: number): DailyRow[] {
  const byDay = new Map(results.map((r) => [r.day, r]));
  const start = new Date(`${since}T00:00:00Z`).getTime();
  return Array.from({ length: days }, (_, i) => {
    const day = utcDay(new Date(start + i * DAY_MS));
    return byDay.get(day) ?? { day, views: 0, visitors: 0 };
  });
}

const plain = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

function formatCount(n: number): string {
  return n >= 10_000 ? compact.format(n) : plain.format(n);
}

function formatDay(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-page mx-auto px-6 sm:px-8 py-14">
      <h1 className="text-3xl sm:text-4xl text-ink mb-4">Site analytics</h1>
      <p className="text-sm text-muted leading-relaxed max-w-lg">{children}</p>
    </div>
  );
}

function StatTile({ label, value, caption }: { label: string; value: string; caption?: string }) {
  return (
    <div className="border border-line rounded-lg p-5">
      <p className="text-xs text-muted mb-2">{label}</p>
      <p className="text-3xl font-semibold text-ink">{value}</p>
      {caption && <p className="text-2xs text-muted mt-1">{caption}</p>}
    </div>
  );
}

function DailyChart({ rows }: { rows: DailyRow[] }) {
  const max = Math.max(...rows.map((r) => r.views));
  const peak = rows.reduce((best, r) => (r.views > best.views ? r : best), rows[0]);

  return (
    <section className="pb-4">
      <div className="flex flex-wrap justify-between items-baseline gap-2 mb-4">
        <h2 className="font-serif text-xl text-ink">Page views per day</h2>
        {max > 0 && (
          <p className="text-xs text-muted">
            Peak {plain.format(peak.views)} on {formatDay(peak.day)}
          </p>
        )}
      </div>

      {/* The table below carries every value; hover readouts only enhance. */}
      <div
        role="img"
        aria-label={`Column chart of daily page views, ${formatDay(rows[0].day)} to ${formatDay(rows[rows.length - 1].day)}. Values are in the table below.`}
        className="flex items-end gap-0.5 h-40 border-b border-line"
      >
        {rows.map((r, i) => {
          const align =
            i < rows.length * 0.2
              ? "left-0"
              : i > rows.length * 0.8
                ? "right-0"
                : "left-1/2 -translate-x-1/2";
          return (
            // tabIndex + group-focus-visible mirror the hover tooltip on
            // keyboard focus, so sighted keyboard users get the same
            // per-day readout as a mouse user (every value is also in the
            // table below, for screen-reader / non-visual access).
            <div
              key={r.day}
              tabIndex={0}
              className="group relative flex-1 h-full flex items-end justify-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              {r.views > 0 && (
                <div
                  className="w-full max-w-6 rounded-t bg-accent group-hover:brightness-125 group-focus-visible:brightness-125"
                  // Nonzero days get at least 2px so they're visible; exact values are in the table.
                  style={{ height: `max(${(r.views / max) * 100}%, 2px)` }}
                />
              )}
              <div
                className={`pointer-events-none absolute bottom-full mb-2 ${align} z-10 hidden group-hover:block group-focus-visible:block whitespace-nowrap rounded-md border border-line bg-surface px-2.5 py-1.5`}
              >
                <p className="text-sm font-semibold text-ink">{plain.format(r.views)} views</p>
                <p className="text-2xs text-muted">
                  {formatDay(r.day)} · {plain.format(r.visitors)} visitors
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-2xs text-muted tabular-nums">
        <span>{formatDay(rows[0].day)}</span>
        <span>{formatDay(rows[rows.length - 1].day)}</span>
      </div>

      <details className="mt-6">
        <summary className="text-xs text-muted cursor-pointer hover:text-ink py-2">
          Show as table
        </summary>
        <table className="w-full text-sm mt-3">
          <thead>
            <tr className="text-left text-xs text-muted border-b border-line">
              <th className="py-2 font-normal">Date</th>
              <th className="py-2 font-normal text-right">Views</th>
              <th className="py-2 font-normal text-right">Visitors</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {[...rows].reverse().map((r) => (
              <tr key={r.day} className="border-b border-line last:border-b-0">
                <td className="py-1.5 text-ink">{formatDay(r.day)}</td>
                <td className="py-1.5 text-right text-muted">{plain.format(r.views)}</td>
                <td className="py-1.5 text-right text-muted">{plain.format(r.visitors)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}

function RankedList({
  title,
  column,
  rows,
  empty,
}: {
  title: string;
  column: string;
  rows: CountRow[];
  empty: string;
}) {
  const max = rows[0]?.views ?? 0;
  return (
    <section>
      <h2 className="font-serif text-xl text-ink mb-3">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col />
            <col className="w-16" />
          </colgroup>
          <thead className="sr-only">
            <tr>
              <th>{column}</th>
              <th>Views</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td className="py-1.5 pr-4">
                  <span className="block truncate text-ink" title={r.name}>
                    {r.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 block h-1.5 rounded-r bg-accent"
                    style={{ width: `${(r.views / max) * 100}%` }}
                  />
                </td>
                <td className="py-1.5 text-right align-top text-muted tabular-nums">
                  {plain.format(r.views)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

type ExcludedNetwork = { cidr: string; label: string | null; created_at: number };

// Null when the table doesn't exist yet (migration 0002 not applied).
async function loadExcludedNetworks(db: D1Like): Promise<ExcludedNetwork[] | null> {
  try {
    const { results } = await db
      .prepare("SELECT cidr, label, created_at FROM excluded_networks ORDER BY created_at DESC")
      .all<ExcludedNetwork>();
    return results;
  } catch {
    return null;
  }
}

function OwnVisits({
  currentIp,
  excluded,
}: {
  currentIp: string | null;
  excluded: ExcludedNetwork[] | null;
}) {
  const currentNetwork = currentIp ? networkForIp(currentIp) : null;
  const match =
    currentIp && excluded ? excluded.find((n) => ipInCidr(currentIp, n.cidr)) : undefined;

  return (
    <section className="py-12 border-t border-line">
      <h2 className="font-serif text-xl text-ink mb-4">Your own visits</h2>
      <div className="flex flex-col gap-6 max-w-lg">
        <AnalyticsOptOut />

        {excluded === null ? (
          <p className="text-sm text-muted">
            Network exclusion isn&apos;t set up yet — apply{" "}
            <code className="text-xs">migrations/0002_excluded_networks.sql</code> (see README →
            Analytics).
          </p>
        ) : !currentNetwork ? (
          <p className="text-sm text-muted">
            Couldn&apos;t detect this network&apos;s address (expected in local development).
          </p>
        ) : match ? (
          <p className="text-sm text-muted">
            <span className="text-ink">This network is excluded</span>
            {match.label ? ` (${match.label})` : ""} — no device on it is counted.
          </p>
        ) : (
          <form method="post" action="/stats/networks" className="flex flex-col gap-3">
            <p className="text-sm text-muted">
              <span className="text-ink">This network is being counted.</span> If it&apos;s your
              home Wi-Fi, exclude it and no device on it will be counted.
            </p>
            <input type="hidden" name="action" value="add" />
            <div className="flex flex-wrap gap-2">
              <label htmlFor="network-label" className="sr-only">
                Label for this network
              </label>
              <input
                id="network-label"
                name="label"
                maxLength={60}
                placeholder="Label, e.g. Home Wi-Fi"
                className="flex-1 min-w-0 text-sm bg-bg text-ink placeholder:text-muted border border-line rounded-md px-3 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              />
              <button
                type="submit"
                className="text-sm text-ink px-4 py-3 border border-ink rounded-md hover:bg-surface transition-colors"
              >
                Exclude this network
              </button>
            </div>
            <p className="text-2xs text-muted">Excludes {currentNetwork}</p>
          </form>
        )}

        {excluded && excluded.length > 0 && (
          <div>
            <p className="text-xs text-muted mb-1">Excluded networks</p>
            <ul>
              {excluded.map((n) => (
                <li
                  key={n.cidr}
                  className="flex justify-between items-center gap-4 border-b border-line last:border-b-0"
                >
                  <div className="min-w-0 py-2">
                    <p className="text-sm text-ink truncate">{n.label ?? "Unlabelled"}</p>
                    <p className="text-2xs text-muted truncate">{n.cidr}</p>
                  </div>
                  <form method="post" action="/stats/networks">
                    <input type="hidden" name="action" value="remove" />
                    <input type="hidden" name="cidr" value={n.cidr} />
                    <button
                      type="submit"
                      className="text-xs text-muted hover:text-ink px-3 py-3 transition-colors"
                    >
                      Remove
                    </button>
                  </form>
                </li>
              ))}
            </ul>
            <p className="text-2xs text-muted mt-2 leading-relaxed">
              Home internet addresses change occasionally. If this page says your home network
              is being counted again, exclude it again and remove the old entry.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
