import Link from "next/link";
import { getAllContent, formatDate } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Engineering projects beyond ML: web apps, databases, and tools.",
};

// "Other Projects" page — same layout as ML index, separate content folder.
// This separation is what makes navigation clear: ML/DS work has its own
// home, everything else (web apps, databases, tools) lives here.

export default function ProjectsIndexPage() {
  const projects = getAllContent("projects");

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8">
      <section className="py-14">
        <p className="text-xs text-muted mb-3 uppercase tracking-wider">
          Engineering Projects
        </p>
        <h1 className="text-3xl sm:text-4xl text-ink mb-4 max-w-xl">
          Web apps, databases, and tools.
        </h1>
        <p className="text-sm text-muted leading-relaxed max-w-lg">
          Projects outside of machine learning — full-stack work, course
          projects, and experiments.
        </p>
      </section>

      {projects.length === 0 ? (
        <div className="py-12 text-center text-muted text-sm">
          No projects published yet.
        </div>
      ) : (
        <section className="pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => {
              const isWIP =
                project.meta.status?.toLowerCase().includes("progress") ||
                project.meta.status?.toLowerCase() === "wip";

              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className={`block bg-bg border border-line rounded-lg p-6 hover:border-accent transition-colors group ${
                    isWIP ? "opacity-60 hover:opacity-100" : ""
                  }`}
                >
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {project.meta.tags?.[0] && (
                      <span className="text-[10px] text-muted bg-line px-2 py-0.5 rounded-full">
                        {project.meta.tags[0]}
                      </span>
                    )}
                    {project.meta.status && (
                      <span className="text-[10px] text-muted bg-line px-2 py-0.5 rounded-full">
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
