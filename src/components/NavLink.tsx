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
      className={`text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded-sm ${
        isActive
          ? "text-ink border-b-[1.5px] border-accent pb-0.5"
          : "text-muted hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
