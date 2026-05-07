import Link from "next/link";
import { getAllContent, formatDate } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes and essays on engineering, ML, and adjacent topics.",
};

// Writing index — list view rather than grid. Posts are typically read
// one at a time, so a clean stack with title + date + description works
// better than card layout. Closest visual reference: Paul Graham's essay list.

export default function WritingIndexPage() {
  const posts = getAllContent("writing");

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8">
      <section className="py-14">
        <p className="text-xs text-muted mb-3 uppercase tracking-wider">Writing</p>
        <h1 className="text-3xl sm:text-4xl text-ink mb-4 max-w-xl">
          Notes and essays.
        </h1>
        <p className="text-sm text-muted leading-relaxed max-w-lg">
          Things I&apos;m thinking about — engineering, ML, and adjacent topics.
        </p>
      </section>

      {posts.length === 0 ? (
        <div className="py-12 text-center text-muted text-sm">
          No posts published yet.
        </div>
      ) : (
        <section className="pb-16">
          <div className="flex flex-col">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="py-5 border-b border-line last:border-b-0 group flex justify-between items-baseline gap-6"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-xl text-ink group-hover:text-accent transition-colors mb-1.5">
                    {post.meta.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed">
                    {post.meta.description}
                  </p>
                </div>
                <span className="text-xs text-muted whitespace-nowrap pt-1">
                  {formatDate(post.meta.date)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
