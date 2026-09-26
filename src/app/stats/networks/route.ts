import {
  getAnalyticsEnv,
  invalidateExcludedCache,
  isAuthorized,
  networkForIp,
} from "@/lib/analytics";

// Form target for the "exclude this network" / "remove" buttons on /stats.
// Behind the same Basic auth as /stats (middleware matcher covers
// /stats/:path*), re-checked here, and restricted to same-origin form posts.
//
// "add" never takes an address from the form: it excludes the network the
// request itself came from, so nothing arbitrary can be inserted.

export const runtime = "edge";

export async function POST(request: Request) {
  const { db, statsPassword } = getAnalyticsEnv();
  if (!isAuthorized(request.headers.get("authorization"), statsPassword)) {
    return new Response("Authentication required.", { status: 401 });
  }
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host) {
    return new Response("Forbidden.", { status: 403 });
  }
  if (!db) return new Response("Analytics is not configured.", { status: 503 });

  const form = await request.formData();
  const action = form.get("action");

  if (action === "add") {
    const ip = request.headers.get("cf-connecting-ip");
    const cidr = ip ? networkForIp(ip) : null;
    if (cidr) {
      const label = String(form.get("label") ?? "").trim().slice(0, 60) || null;
      await db
        .prepare(
          "INSERT OR IGNORE INTO excluded_networks (cidr, label, created_at) VALUES (?, ?, ?)",
        )
        .bind(cidr, label, Date.now())
        .run();
    }
  } else if (action === "remove") {
    const cidr = String(form.get("cidr") ?? "");
    await db.prepare("DELETE FROM excluded_networks WHERE cidr = ?").bind(cidr).run();
  }

  invalidateExcludedCache();
  // Not Response.redirect(): its headers are immutable, and Next.js adds
  // headers to route-handler responses, which throws "TypeError: immutable".
  return new Response(null, {
    status: 303,
    headers: { Location: new URL("/stats", request.url).toString() },
  });
}
