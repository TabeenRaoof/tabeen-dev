import { NextResponse, type NextRequest } from "next/server";
import { getAnalyticsEnv, isAuthorized } from "@/lib/analytics";

// HTTP Basic auth in front of /stats. Fails closed: if STATS_PASSWORD isn't
// configured, the page is unavailable rather than public.

export const config = { matcher: ["/stats", "/stats/:path*"] };

export function middleware(request: NextRequest) {
  const { statsPassword } = getAnalyticsEnv();
  if (!statsPassword) {
    return new NextResponse("Stats are not configured.", { status: 503 });
  }
  if (isAuthorized(request.headers.get("authorization"), statsPassword)) {
    return NextResponse.next();
  }
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="tabeen.dev stats", charset="UTF-8"' },
  });
}
