"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Sends one beacon per page view to /api/track. No cookies, no storage,
// no identifiers — the server derives a daily-rotating visitor hash itself.
//
// document.referrer never changes during client-side navigation, so it's
// only sent with the first (landing) page view; later views would otherwise
// all be credited to the original referrer.

// Set in the owner's own browsers by visiting /stats (see AnalyticsOptOut),
// so their visits aren't counted from any network. Only ever written on
// the owner's devices — visitors never get anything stored.
export const ANALYTICS_OPT_OUT_KEY = "tabeen:analytics-opt-out";

function isOptedOut(): boolean {
  try {
    return localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

export function Analytics() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);
  const isLanding = useRef(true);

  useEffect(() => {
    // Guard against re-renders and React strict-mode's double effect in dev.
    if (!pathname || lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.globalPrivacyControl || nav.doNotTrack === "1" || isOptedOut()) return;

    const body = JSON.stringify({
      path: pathname,
      referrer: isLanding.current ? document.referrer : "",
    });
    isLanding.current = false;

    if (!nav.sendBeacon?.("/api/track", body)) {
      fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
