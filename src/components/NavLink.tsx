"use client";

// Client component because we need usePathname to detect the active route.
// Active links get a terracotta underline — matches the design mockup.

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();

  // A nav item counts as active if we're on its top-level page or any sub-route.
  // E.g. /ml/some-project should still highlight the "ML" nav link.
  // We compare with startsWith but exclude "/" to avoid every page matching the home link.
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      // relative + before:inset gives a ~44px-tall invisible hit area
      // (WCAG 2.5.5 / mobile touch target guidance) via a generated
      // pseudo-element, rather than real padding — so the visible text
      // size and the active-state underline position are untouched.
      // Text is 14px below 380px wide, 17px above: five links at 17px need
      // ~323px, more than a 320px phone's 280px content width.
      // Horizontal expansion is capped at half the minimum gap between
      // items (gap-3=12px on phones, gap-7=28px on sm+) so adjacent nav
      // items' hit areas never overlap into ambiguous double-tap zones.
      className={`relative before:absolute before:-inset-y-3 before:-inset-x-1.5 sm:before:-inset-x-3 before:content-[''] text-2xs min-[380px]:text-sm transition-colors pb-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded-sm ${
        isActive
          ? "text-ink border-b-[1.5px] border-accent"
          : "text-muted hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
