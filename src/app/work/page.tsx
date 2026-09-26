import { getAllContent } from "@/lib/content";
import { ContentCard } from "@/components/ContentCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Engineering work: production systems, cloud infrastructure, and applied projects.",
  alternates: { canonical: "https://tabeen.dev/work" },
};

// Work index — engineering delivery: internships, cloud/infra projects,
// and applied full-stack work. Research-track projects (no shipped product,
// preprint or research-direction framing) live under /research instead.

export default function WorkIndexPage() {
  const items = getAllContent("work");

  return (
    <div className="max-w-page mx-auto px-6 sm:px-8">
      <section className="py-14">
        <p className="text-xs text-muted mb-3 uppercase tracking-wider">
          Work
        </p>
        <h1 className="text-3xl sm:text-4xl text-ink mb-4 max-w-xl">
          Production systems and applied engineering.
        </h1>
        <p className="text-sm text-muted leading-relaxed max-w-lg">
          Internships, cloud infrastructure, and full-stack projects — code
          that shipped or is shipping.
        </p>
      </section>

      {items.length === 0 ? (
        <div className="py-12 text-center text-muted text-sm">
          No work published yet.
        </div>
      ) : (
        <section className="pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <ContentCard key={item.slug} href={`/work/${item.slug}`} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
