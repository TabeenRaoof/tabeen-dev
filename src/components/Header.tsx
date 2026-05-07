import Link from "next/link";
import { NavLink } from "./NavLink";

// Header stays simple — logo on left, nav on right.
// Active link state is handled inside NavLink (it reads pathname client-side).
// The orange dot in "tabeen.dev" is the only color emphasis here —
// keeps the brand presence subtle but consistent.

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
        {/* Logo — serif font for warmth, orange dot as the only branded element */}
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-ink hover:opacity-80"
          aria-label="Tabeen Raoof — home"
        >
          tabeen<span className="text-accent">.</span>dev
        </Link>

        {/* Nav links — sentence case, muted by default, ink when active */}
        <nav className="flex items-center gap-7">
          <NavLink href="/ml">ML</NavLink>
          <NavLink href="/projects">Projects</NavLink>
          <NavLink href="/writing">Writing</NavLink>
          <NavLink href="/about">About</NavLink>
        </nav>
      </div>
    </header>
  );
}
