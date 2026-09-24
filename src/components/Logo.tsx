// Logo mark — abstracted from the Spurge Hawk-Moth caterpillar's body pattern.
//
// Colors are applied via Tailwind's fill-* utilities (generated automatically
// from the --color-* tokens in globals.css), not hard-coded hex — so the mark
// stays in sync if the palette ever changes, instead of drifting the way the
// original inline fill="#F5F2E8" etc. did.
//
// Why inline SVG instead of an image file:
//   - Scales perfectly at any size (favicon to OG image to retina display)
//   - Recolors via CSS/Tailwind classes — no asset variants needed
//   - Zero network requests, embedded in HTML
//   - Tiny payload (~600 bytes)

interface LogoProps {
  /** Size in pixels — applies to both width and height (LogoAlt scales width from this). Default: 22. */
  size?: number;
  /** Optional className passed to the SVG (e.g. for layout) */
  className?: string;
}

// The default 3x3 scattered-dot grid reads, at a glance, as the universal
// "app launcher" / grid-menu icon — especially at favicon size, where the
// scatter pattern collapses visually into a uniform lattice. It's also not
// faithful to the source photo: the caterpillar's spots run in a single row
// along the body, with real variation in size and spacing, not a square grid.
//
// LogoAlt is the proposed alternative: one horizontal row of dots, sizes
// tapering from a peak near the leading edge, spacing deliberately uneven
// rather than a repeating grid unit. Monochrome (fill-ink) rather than the
// two-tone original — a second color read as "yellow" sitting close to the
// heading cream, weakening its use as an accent. Compare both at
// /_logo-preview. This does not replace the default mark; enable via
// NEXT_PUBLIC_LOGO_VARIANT=alt for a live preview in the header itself.
export function LogoAlt({ size = 22, className }: LogoProps) {
  const h = size;
  const w = size * 1.8;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 40 22"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="22" className="fill-line" rx="3" />
      {/* One row, uneven spacing, size peaking near the leading (left) edge
          and tapering toward the trailing edge — echoes the source photo's
          row of spots rather than a repeating grid unit. */}
      <circle cx="6" cy="11" r="2.6" className="fill-ink" />
      <circle cx="12.5" cy="11" r="1.9" className="fill-ink" />
      <circle cx="17.5" cy="11" r="1.3" className="fill-ink" />
      <circle cx="21.5" cy="11" r="1.6" className="fill-ink" />
      <circle cx="26.5" cy="11" r="1" className="fill-ink" />
      <circle cx="30" cy="11" r="1.4" className="fill-ink" />
      <circle cx="34.5" cy="11" r="0.8" className="fill-ink" />
    </svg>
  );
}

export function Logo({ size = 22, className }: LogoProps) {
  if (process.env.NEXT_PUBLIC_LOGO_VARIANT === "alt") {
    return <LogoAlt size={size} className={className} />;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background — slightly lighter than page bg so the mark
          stands out as an object on the surface */}
      <rect width="22" height="22" className="fill-line" rx="3" />

      {/* Top row — slightly staggered for organic feel */}
      <circle cx="5" cy="5" r="1.5" className="fill-ink" />
      <circle cx="11" cy="4" r="1.2" className="fill-accent-2" />
      <circle cx="17" cy="6" r="1.3" className="fill-ink" />

      {/* Middle row — center spot is largest, anchors the composition */}
      <circle cx="6" cy="10" r="1.2" className="fill-accent-2" />
      <circle cx="11" cy="11" r="1.6" className="fill-ink" />
      <circle cx="16" cy="11" r="1.2" className="fill-accent-2" />

      {/* Bottom row — mirrors top with slight variation */}
      <circle cx="5" cy="16" r="1.3" className="fill-ink" />
      <circle cx="11" cy="17" r="1.2" className="fill-accent-2" />
      <circle cx="17" cy="16" r="1.5" className="fill-ink" />
    </svg>
  );
}
