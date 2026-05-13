import Link from "next/link";
import { NavLink } from "./NavLink";
import { Logo } from "./Logo";

// Header stays simple — logo mark + wordmark on left, nav on right.
// Active link state is handled inside NavLink (it reads pathname client-side).
//
// The patterned Logo mark is the site's primary visual identity —
// abstracted from the caterpillar's body spots. The orange dot in
// "tabeen.dev" wordmark gives a small color punctuation alongside it.
//
// Spacing strategy:
//   - Mobile: tight nav gap (gap-4 = 16px) so all 4 nav items fit, with a
//     minimum gap-4 between the logo group and the nav block so they
//     never touch. justify-between still pushes them apart when there's room.
//   - Desktop (sm+): larger gap-7 between nav items, with the natural
//     justify-between separation between logo and nav.

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between gap-4">
        {/* Logo block — shrink-0 prevents the logo from being squished by a
            crowded nav. The flex gap-2.5 keeps the mark close to the wordmark
            without touching. */}
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity shrink-0"
          aria-label="Tabeen Raoof — home"
        >
          <Logo size={22} />
          <span className="font-serif text-lg tracking-tight text-ink">
            tabeen<span className="text-accent">.</span>dev
          </span>
        </Link>

        {/* Nav links — tighter gap on mobile (gap-4), more breathing
            room on desktop (sm:gap-7). */}
        <nav className="flex items-center gap-4 sm:gap-7">
          <NavLink href="/ml">ML</NavLink>
          <NavLink href="/projects">Projects</NavLink>
          <NavLink href="/writing">Writing</NavLink>
          <NavLink href="/about">About</NavLink>
        </nav>
      </div>
    </header>
  );
}
