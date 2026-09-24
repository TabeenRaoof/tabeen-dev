// Logo mark — abstracted from the Spurge Hawk-Moth caterpillar's body pattern.
//
// The composition: nine spots in three rough rows, alternating cream and
// chartreuse, on a slightly-lighter charcoal square. Asymmetric placement
// keeps it feeling organic rather than gridded.
//
// Why inline SVG instead of an image file:
//   - Scales perfectly at any size (favicon to OG image to retina display)
//   - Recolors via currentColor or hard-coded fills — no asset variants needed
//   - Zero network requests, embedded in HTML
//   - Tiny payload (~600 bytes)
//
// Sizing: default 22px square, but accepts a size prop for re-use in
// favicons (16-32px), OG images (40-60px), or larger contexts.

interface LogoProps {
  /** Size in pixels — applies to both width and height. Default: 22. */
  size?: number;
  /** Optional className passed to the SVG (e.g. for layout) */
  className?: string;
}

// The 3x3 scattered-dot grid (below) is legible as the site's mark, but it
// also happens to be the standard icon shorthand for an "app launcher" /
// grid-menu control, which can misread as a clickable toggle rather than
// a logo. LogoAlt is a proposed alternative closer to the source photo's
// actual pattern — a single horizontal row of paired ovals, varying in
// size and spacing — offered as an opt-in variant rather than a swap of
// the default mark. Enable for testing via NEXT_PUBLIC_LOGO_VARIANT=alt.
export function LogoAlt({ size = 22, className }: LogoProps) {
  const h = size;
  const w = size * 1.7;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 38 22"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="38" height="22" fill="#2C2622" rx="3" />
      {/* A single row of paired ovals, varying size/spacing — closer to the
          source photo's row of spots than a uniform grid. */}
      <ellipse cx="6" cy="11" rx="2.4" ry="1.6" fill="#F5F2E8" />
      <ellipse cx="11.5" cy="11" rx="1.5" ry="1.1" fill="#D4DC3F" />
      <ellipse cx="16" cy="11" rx="2.8" ry="1.9" fill="#F5F2E8" />
      <ellipse cx="21.5" cy="11" rx="1.3" ry="0.9" fill="#D4DC3F" />
      <ellipse cx="26" cy="11" rx="2.2" ry="1.5" fill="#F5F2E8" />
      <ellipse cx="31.5" cy="11" rx="1.7" ry="1.2" fill="#D4DC3F" />
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
      <rect width="22" height="22" fill="#2C2622" rx="3" />

      {/* Top row — slightly staggered for organic feel */}
      <circle cx="5" cy="5" r="1.5" fill="#F5F2E8" />
      <circle cx="11" cy="4" r="1.2" fill="#D4DC3F" />
      <circle cx="17" cy="6" r="1.3" fill="#F5F2E8" />

      {/* Middle row — center spot is largest, anchors the composition */}
      <circle cx="6" cy="10" r="1.2" fill="#D4DC3F" />
      <circle cx="11" cy="11" r="1.6" fill="#F5F2E8" />
      <circle cx="16" cy="11" r="1.2" fill="#D4DC3F" />

      {/* Bottom row — mirrors top with slight variation */}
      <circle cx="5" cy="16" r="1.3" fill="#F5F2E8" />
      <circle cx="11" cy="17" r="1.2" fill="#D4DC3F" />
      <circle cx="17" cy="16" r="1.5" fill="#F5F2E8" />
    </svg>
  );
}
