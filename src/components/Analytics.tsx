"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Sends one beacon per page view to /api/track. No cookies, no storage,
// no identifiers — the server derives a daily-rotating visitor hash itself.
//
// document.referrer never changes during client-side navigation, so it's
// only sent with the first (landing) page view; later views would otherwise
// all be credited to the original referrer.

export function Analytics() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);
  const isLanding = useRef(true);

  useEffect(() => {
    // Guard against re-renders and React strict-mode's double effect in dev.
    if (!pathname || lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.globalPrivacyControl || nav.doNotTrack === "1") return;

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
