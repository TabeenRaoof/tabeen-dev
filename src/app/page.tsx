import Link from "next/link";
import { getFeaturedItem, getAllContent, formatDate } from "@/lib/content";

// The home page is a server component — content is read at build time
// from the filesystem, so the page is fully static.
//
// Three sections:
//   1. Hero — name, one-line intro, primary CTAs
//   2. Featured project — single highlighted ML project
//   3. Recent writing — last 3 blog posts (only shown if writing exists)

export default function HomePage() {
  const featured = getFeaturedItem("ml");
  const recentWriting = getAllContent("writing").slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8">
      {/* ----------------------------------------------------------------- */}
      {/* Hero section                                                      */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-20 sm:py-24">
        <p className="text-sm text-muted mb-4 tracking-wide">
          Tabeen Raoof — Bay Area
        </p>
        <h1 className="text-4xl sm:text-5xl text-ink mb-6 max-w-2xl leading-[1.15]">
          Engineer working at the intersection of{" "}
          <em className="text-accent italic font-serif">machine learning</em>{" "}
          and product.
        </h1>
        <p className="text-base text-muted leading-relaxed max-w-xl mb-8">
          MS Computer Science at SFBU. Currently building at FiPet. Previously
          TPM at Yardi, project management at the United Nations.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/ml"
            className="inline-flex items-center gap-1.5 text-sm text-ink px-4 py-2.5 border border-ink rounded-md hover:bg-surface transition-colors"
          >
            See ML work
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link
            href="/writing"
            className="inline-flex items-center gap-1.5 text-sm text-muted px-4 py-2.5 hover:text-ink transition-colors"
          >
            Read writing
          </Link>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Featured project — only renders if one exists                     */}
      {/* ----------------------------------------------------------------- */}
      {featured && (
        <section className="py-12 border-t border-line">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="font-serif text-xl text-ink">Featured</h2>
            <Link
              href="/ml"
              className="text-xs text-muted hover:text-ink transition-colors"
            >
              All ML projects →
            </Link>
          </div>

          <Link
            href={`/ml/${featured.slug}`}
            className="block bg-surface border border-line rounded-lg p-7 hover:border-accent transition-colors group"
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {featured.meta.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-accent bg-accent-soft px-2.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {featured.meta.demo && (
                <span className="text-[11px] text-muted bg-line px-2.5 py-0.5 rounded-full">
                  Live demo
                </span>
              )}
            </div>
            <h3 className="font-serif text-2xl text-ink mb-2 group-hover:text-accent transition-colors">
              {featured.meta.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {featured.meta.description}
            </p>
          </Link>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Recent writing — only renders if posts exist                      */}
      {/* ----------------------------------------------------------------- */}
      {recentWriting.length > 0 && (
        <section className="py-12 border-t border-line">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="font-serif text-xl text-ink">Recent writing</h2>
            <Link
              href="/writing"
              className="text-xs text-muted hover:text-ink transition-colors"
            >
              All writing →
            </Link>
          </div>

          <div className="flex flex-col">
            {recentWriting.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="py-4 border-b border-line last:border-b-0 group flex justify-between items-baseline gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg text-ink group-hover:text-accent transition-colors mb-1">
                    {post.meta.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-1">
                    {post.meta.description}
                  </p>
                </div>
                <span className="text-xs text-muted whitespace-nowrap">
                  {formatDate(post.meta.date)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom spacing before footer */}
      <div className="pb-16" />
    </div>
  );
}
