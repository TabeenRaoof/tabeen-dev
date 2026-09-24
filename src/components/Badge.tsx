import type { ReactNode } from "react";

// Shared badge/pill component — replaces the inline <span> markup that had
// drifted into two different styles (Work used muted grey for everything;
// Research used accent colors) and two different one-off text sizes
// (text-[10px] on index cards, text-[11px] on detail pages). Both are now
// a single `text-2xs` token (see globals.css) and one consistent style per
// variant, used identically across Work and Research.
//
// Status badges are never the only signal for status — the word itself
// ("Active", "Complete", "In progress") carries the meaning, so color is
// decorative reinforcement, not the sole channel (verified in greyscale —
// see VISUAL-PASS.md).

interface BadgeProps {
  variant: "topic" | "status";
  children: ReactNode;
}

const VARIANT_STYLES: Record<BadgeProps["variant"], string> = {
  topic: "text-accent bg-accent-soft",
  status: "text-accent-2 bg-accent-2-soft",
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`text-2xs px-2.5 py-0.5 rounded-full ${VARIANT_STYLES[variant]}`}
    >
      {children}
    </span>
  );
}
