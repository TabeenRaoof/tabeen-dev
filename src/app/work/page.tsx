import Link from "next/link";
import { getAllContent, formatDate } from "@/lib/content";
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
    <div className="max-w-3xl mx-auto px-6 sm:px-8">
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
            {items.map((item) => {
              const isWIP =
                item.meta.status?.toLowerCase().includes("progress") ||
                item.meta.status?.toLowerCase() === "wip";

              const accessibleName = [
                item.meta.title,
                item.meta.status,
                item.meta.description,
              ]
                .filter(Boolean)
                .join(". ");

              return (
                <Link
                  key={item.slug}
                  href={`/work/${item.slug}`}
                  aria-label={accessibleName}
                  className={`block bg-bg border border-line rounded-lg p-6 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 transition-colors group ${
                    isWIP ? "opacity-60 hover:opacity-100" : ""
                  }`}
                >
                  <div className="flex flex-wrap gap-1.5 mb-2.5" aria-hidden="true">
                    {item.meta.tags?.[0] && (
                      <span className="text-[10px] text-muted bg-line px-2 py-0.5 rounded-full">
                        {item.meta.tags[0]}
                      </span>
                    )}
                    {item.meta.status && (
                      <span className="text-[10px] text-muted bg-line px-2 py-0.5 rounded-full">
                        {item.meta.status}
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-lg text-ink mb-1.5 group-hover:text-accent transition-colors">
                    {item.meta.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed mb-3">
                    {item.meta.description}
                  </p>
                  <p className="text-[11px] text-muted opacity-70">
                    {formatDate(item.meta.date)}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
