"use client";

import { useEffect, useState } from "react";
import { ANALYTICS_OPT_OUT_KEY } from "./Analytics";

// Rendered only on the password-protected /stats page: opening /stats in a
// browser marks that browser as the owner's, so it's never counted again —
// from home, cellular, or anywhere else. Private/incognito windows start
// fresh and will be counted.

export function AnalyticsOptOut() {
  const [status, setStatus] = useState<"checking" | "excluded" | "unavailable">("checking");

  useEffect(() => {
    try {
      localStorage.setItem(ANALYTICS_OPT_OUT_KEY, "1");
      setStatus(localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === "1" ? "excluded" : "unavailable");
    } catch {
      setStatus("unavailable");
    }
  }, []);

  if (status === "checking") {
    return <p className="text-sm text-muted">Checking this browser…</p>;
  }
  if (status === "unavailable") {
    return (
      <p className="text-sm text-muted">
        <span className="text-ink">This browser can&apos;t be excluded</span> — it&apos;s
        blocking site storage (private browsing, or storage disabled). Its
        visits may be counted unless it&apos;s on an excluded network.
      </p>
    );
  }
  return (
    <p className="text-sm text-muted">
      <span className="text-ink">This browser is excluded</span> — its visits
      aren&apos;t counted on any network. Open this page once in each browser
      you use.
    </p>
  );
}
