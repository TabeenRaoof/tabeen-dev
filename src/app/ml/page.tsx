import Link from "next/link";
import { getAllContent, formatDate } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Machine Learning",
  description:
    "ML and data science projects: classifiers, applied research, and working demos.",
};

// ML projects index — grid layout, two columns on desktop, one on mobile.
// In-progress projects render with reduced opacity to subtly de-emphasize
// them without hiding them. This shows ongoing work without making it
// look like the main attraction.

export default function MLIndexPage() {
  const projects = getAllContent("ml");

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8">
      {/* Page header */}
      <section className="py-14">
        <p className="text-xs text-muted mb-3 uppercase tracking-wider">
          Machine Learning & Data Science
        </p>
        <h1 className="text-3xl sm:text-4xl text-ink mb-4 max-w-xl">
          Models, classifiers, and applied research.
        </h1>
        <p className="text-sm text-muted leading-relaxed max-w-lg">
          Each project includes a working demo where possible, source code, and
          notes on the approach.
        </p>
      </section>

      {/* Empty state — shown if no projects exist yet */}
      {projects.length === 0 ? (
        <div className="py-12 text-center text-muted text-sm">
          No projects published yet.
        </div>
      ) : (
        <section className="pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => {
              // In-progress and archived projects render at reduced opacity
              const isWIP =
                project.meta.status?.toLowerCase().includes("progress") ||
                project.meta.status?.toLowerCase() === "wip";

              return (
                <Link
                  key={project.slug}
                  href={`/ml/${project.slug}`}
                  className={`block bg-bg border border-line rounded-lg p-6 hover:border-accent transition-colors group ${
                    isWIP ? "opacity-60 hover:opacity-100" : ""
                  }`}
                >
                  {/* Tag row — primary tag in orange, status in chartreuse.
                      The chartreuse signals "this is ML work" — derived from
                      the caterpillar's segment markings. */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {project.meta.tags?.[0] && (
                      <span className="text-[10px] text-accent bg-accent-soft px-2 py-0.5 rounded-full">
                        {project.meta.tags[0]}
                      </span>
                    )}
                    {project.meta.status && (
                      <span className="text-[10px] text-accent-2 bg-accent-2-soft px-2 py-0.5 rounded-full">
                        {project.meta.status}
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-lg text-ink mb-1.5 group-hover:text-accent transition-colors">
                    {project.meta.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed mb-3">
                    {project.meta.description}
                  </p>
                  <p className="text-[11px] text-muted opacity-70">
                    {formatDate(project.meta.date)}
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
