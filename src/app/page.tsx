import Link from "next/link";
import type { Metadata } from "next";
import { getFeaturedItem, getAllContent, formatDate } from "@/lib/content";
import { ContentCard } from "@/components/ContentCard";

// The home page is a server component — content is read at build time
// from the filesystem, so the page is fully static.
//
// Sections:
//   1. Hero — name, one-line intro, primary CTAs
//   2. Now — one sentence on current work, dated
//   3. Featured project — single highlighted item from Work
//   4. Recent notes — last 3 posts (only shown if any exist)

const DESCRIPTION =
  "Applied AI/ML engineer in the Bay Area. Production data pipelines and monitoring on GCP, computer-vision research, and enterprise delivery experience.";

export const metadata: Metadata = {
  title: "Tabeen Raoof — Applied AI/ML Engineer",
  description: DESCRIPTION,
  alternates: {
    canonical: "https://tabeen.dev",
  },
  openGraph: {
    title: "Tabeen Raoof — Applied AI/ML Engineer",
    description: DESCRIPTION,
    url: "https://tabeen.dev",
  },
  twitter: {
    title: "Tabeen Raoof — Applied AI/ML Engineer",
    description: DESCRIPTION,
  },
};

// JSON-LD Person schema — helps search engines and AI assistants
// resolve who this site belongs to.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tabeen Raoof",
  jobTitle: "Applied AI/ML Engineer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "San Francisco Bay University",
  },
  url: "https://tabeen.dev",
  sameAs: [
    "https://github.com/tabeenraoof",
    "https://www.linkedin.com/in/tabeenraoof",
  ],
};

export default function HomePage() {
  // Featured item can live in either Work or Research — check both,
  // preferring Work since production delivery is the primary pitch here.
  const featuredWork = getFeaturedItem("work");
  const featuredResearch = getFeaturedItem("research");
  const featured = featuredWork ?? featuredResearch;
  const featuredCategory = featuredWork ? "work" : "research";
  const recentNotes = getAllContent("notes").slice(0, 3);

  return (
    <div className="max-w-page mx-auto px-6 sm:px-8">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* ----------------------------------------------------------------- */}
      {/* Hero section                                                      */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-20 sm:py-24">
        <p className="text-sm text-muted mb-4 tracking-wide">
          Tabeen Raoof — Bay Area · Available from January 2027
        </p>
        <h1 className="text-4xl sm:text-5xl text-ink mb-6">
          Engineer building{" "}
          <em className="text-accent italic font-serif">applied AI systems</em>{" "}
          — and making them work in production.
        </h1>
        <p className="text-base text-muted leading-relaxed mb-8">
          At Xylo AI Studios, I own the services that bring financial-advisory
          firms&apos; email, calendar, CRM and meeting data into one pipeline —
          and built the monitoring that caught a live outage nobody had
          noticed. Before that: computer-vision research, and three years
          delivering enterprise software to customers. MS Computer Science
          (AI/ML) at SFBU, graduating December 2026.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm text-ink px-4 py-3 border border-ink rounded-md hover:bg-surface transition-colors"
          >
            See my work
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
             aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <a
            href="/resume.pdf"
            download="Tabeen_Raoof_Resume.pdf"
            className="inline-flex items-center gap-1.5 text-sm text-muted px-4 py-3 hover:text-ink transition-colors"
          >
            Resume (PDF)
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-sm text-muted px-4 py-3 hover:text-ink transition-colors"
          >
            Research
          </Link>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Now — one sentence on current focus, with a visible last-updated  */}
      {/* date so it doesn't quietly go stale.                              */}
      {/* ----------------------------------------------------------------- */}
      <section className="pb-12 border-t border-line pt-8">
        <p className="text-sm text-muted leading-relaxed">
          <span className="text-ink font-medium">Now — </span>
          Backend engineering at Xylo AI Studios, the ProofShape capstone, and
          two preprints in preparation (TruPhoto and a VLM evaluation study).{" "}
          <span className="text-xs text-muted">(Last updated Sep 2026)</span>
        </p>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Featured project — only renders if one exists                     */}
      {/* ----------------------------------------------------------------- */}
      {featured && (
        <section className="py-12 border-t border-line">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="font-serif text-xl text-ink">Featured</h2>
            <Link
              href={`/${featuredCategory}`}
              className="relative before:absolute before:-inset-3 before:content-[''] text-xs text-muted hover:text-ink transition-colors"
            >
              {featuredCategory === "work" ? "All work" : "All research"} →
            </Link>
          </div>

          <ContentCard
            href={`/${featuredCategory}/${featured.slug}`}
            item={featured}
          />
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Recent writing — only renders if posts exist                      */}
      {/* ----------------------------------------------------------------- */}
      {recentNotes.length > 0 && (
        <section className="py-12 border-t border-line">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="font-serif text-xl text-ink">Recent notes</h2>
            <Link
              href="/notes"
              className="relative before:absolute before:-inset-3 before:content-[''] text-xs text-muted hover:text-ink transition-colors"
            >
              All notes →
            </Link>
          </div>

          <div className="flex flex-col">
            {recentNotes.map((post) => (
              <Link
                key={post.slug}
                href={`/notes/${post.slug}`}
                className="py-4 border-b border-line last:border-b-0 group flex justify-between items-baseline gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded-sm"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-xl text-ink group-hover:text-accent transition-colors mb-1">
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
