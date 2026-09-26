import { getAllContent } from "@/lib/content";
import { ContentCard } from "@/components/ContentCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Computer-vision and vision-language model research: classifiers, evaluation harnesses, and research directions.",
  alternates: { canonical: "https://tabeen.dev/research" },
};

// Research index — work that's framed as inquiry rather than shipped
// product: papers in preparation, evaluation studies, research directions.

export default function ResearchIndexPage() {
  const items = getAllContent("research");

  return (
    <div className="max-w-page mx-auto px-6 sm:px-8">
      <section className="py-14">
        <p className="text-xs text-muted mb-3 uppercase tracking-wider">
          Research
        </p>
        <h1 className="text-3xl sm:text-4xl text-ink mb-4 max-w-xl">
          Computer vision, VLMs, and applied research.
        </h1>
        <p className="text-sm text-muted leading-relaxed max-w-lg">
          Each entry includes the approach, what the evidence showed, and
          links where available.
        </p>
      </section>

      {items.length === 0 ? (
        <div className="py-12 text-center text-muted text-sm">
          No research published yet.
        </div>
      ) : (
        <section className="pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <ContentCard key={item.slug} href={`/research/${item.slug}`} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
