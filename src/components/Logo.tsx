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

export function Logo({ size = 22, className }: LogoProps) {
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
