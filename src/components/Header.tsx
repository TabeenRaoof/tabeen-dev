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
// Layout:
//   - Phones (< sm / 640px): two rows — logo on top, the five nav links
//     spread edge to edge on a second row. One row doesn't fit: logo +
//     wordmark + five links need ~440px against ~335px of content width
//     on a 375px phone, which overflowed the viewport sideways.
//   - sm and up: the original single row, logo left, nav right.
//
// Row gap on phones is gap-5 (20px) because both rows carry invisible
// tap-target extensions (logo before:-inset-y-2 = 8px down, NavLink
// before:-inset-y-3 = 12px up): 8 + 12 = 20, so the hit areas meet
// without overlapping.

export function Header() {
  return (
    <>
      {/* Skip link — visually hidden until focused, lets keyboard users
          jump past the header/nav straight to page content. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-surface focus:text-ink focus:px-4 focus:py-2 focus:rounded-md focus:border focus:border-accent"
      >
        Skip to content
      </a>
      <header className="border-b border-line">
        <div className="max-w-page mx-auto px-5 sm:px-8 py-4 sm:py-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {/* Logo block — self-start keeps it content-width in the phone
              column layout (otherwise the whole row becomes the home link);
              shrink-0 stops the nav squeezing it on the desktop row. */}
          <Link
            href="/"
            // relative + before:-inset-y-* grows the tap target to ~44px
            // tall (WCAG 2.5.5) via an invisible pseudo-element, matching
            // the approach in NavLink — no visual change to the logo row.
            className="relative before:absolute before:-inset-y-2 sm:before:-inset-y-3 before:-inset-x-1 before:content-[''] self-start flex items-center gap-2.5 hover:opacity-80 transition-opacity shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded-sm"
            aria-label="Tabeen Raoof — home"
          >
            <Logo size={22} />
            <span className="font-serif text-lg tracking-tight text-ink">
              tabeen<span className="text-accent">.</span>dev
            </span>
          </Link>

          {/* Nav links — spread edge to edge on phones (justify-between,
              with gap-3 as the floor on very narrow screens), grouped
              right with gap-7 on sm and up. */}
          <nav className="flex items-center justify-between gap-3 sm:justify-start sm:gap-7">
            <NavLink href="/work">Work</NavLink>
            <NavLink href="/research">Research</NavLink>
            <NavLink href="/notes">Notes</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>
        </div>
      </header>
    </>
  );
}
