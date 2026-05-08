import Link from "next/link";
import { NavLink } from "./NavLink";
import { Logo } from "./Logo";

// Header stays simple — logo mark + wordmark on left, nav on right.
// Active link state is handled inside NavLink (it reads pathname client-side).
//
// The patterned Logo mark is the site's primary visual identity —
// abstracted from the caterpillar's body spots. The orange dot in
// "tabeen.dev" wordmark gives a small color punctuation alongside it.

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
        {/* Logo — patterned mark + wordmark, treated as a single link.
            The flex gap-2.5 sits the mark and text close enough to read as
            a unit but not so close they touch. */}
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          aria-label="Tabeen Raoof — home"
        >
          <Logo size={22} />
          <span className="font-serif text-lg tracking-tight text-ink">
            tabeen<span className="text-accent">.</span>dev
          </span>
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
