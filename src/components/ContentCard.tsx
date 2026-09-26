import Link from "next/link";
import { Badge } from "./Badge";
import { formatDate } from "@/lib/content";
import type { ContentItem } from "@/lib/content";

// Shared card for the Work and Research index grids.
//
// Fixed shape, top to bottom:
//   [status badge] [topic badge]
//   Title
//   Subtitle   (optional, own slot — role/byline, never folded into the
//               description or repeated with the date)
//   Description (prose only)
//   Date        (own slot, bottom)
//
// The whole card is one <Link> for a single large hit target, but its
// accessible name is deliberately composed (title, then subtitle, then
// status, then description) rather than left to the browser's default of
// concatenating every visible string in DOM order — which reads as one
// run-on sentence to a screen reader. Visual badge/date text is marked
// aria-hidden since it's already folded into that label.

interface ContentCardProps {
  href: string;
  item: ContentItem;
}

export function ContentCard({ href, item }: ContentCardProps) {
  const { meta } = item;

  // Strip each part's own trailing period before joining, or descriptions
  // that end in "." produce "firms.. Jun 2026".
  const accessibleName = [
    meta.title,
    meta.subtitle,
    meta.status,
    meta.description,
    formatDate(meta.date),
  ]
    .filter(Boolean)
    .map((part) => part!.replace(/\.$/, ""))
    .join(". ");

  // In-progress cards used to render at 60% opacity; as the first card on
  // /work that read as disabled. The "In progress" badge carries the status.
  return (
    <Link
      href={href}
      aria-label={accessibleName}
      className="block bg-bg border border-line rounded-lg p-6 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 transition-colors group"
    >
      <div className="flex flex-wrap gap-1.5 mb-2.5" aria-hidden="true">
        {meta.status && <Badge variant="status">{meta.status}</Badge>}
        {meta.tags?.[0] && <Badge variant="topic">{meta.tags[0]}</Badge>}
      </div>

      <h2 className="font-serif text-lg sm:text-xl text-ink mb-1 group-hover:text-accent transition-colors">
        {meta.title}
      </h2>

      {meta.subtitle && (
        <p className="text-xs text-muted mb-1.5">{meta.subtitle}</p>
      )}

      <p className="text-sm text-muted leading-relaxed mb-3">
        {meta.description}
      </p>

      <p className="text-2xs text-muted opacity-70" aria-hidden="true">
        {formatDate(meta.date)}
      </p>
    </Link>
  );
}
