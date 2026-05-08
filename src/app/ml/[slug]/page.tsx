import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  getAllContent,
  getContentBySlug,
  formatDate,
} from "@/lib/content";
import type { Metadata } from "next";

// Dynamic route for individual ML project pages.
// generateStaticParams pre-renders every project at build time —
// this is what makes the site fast and Cloudflare-Pages friendly
// (no server runtime needed, just static HTML files).

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate one static page per project at build time
export async function generateStaticParams() {
  const projects = getAllContent("ml");
  return projects.map((p) => ({ slug: p.slug }));
}

// Per-page metadata — feeds OG tags for LinkedIn previews etc.
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getContentBySlug("ml", slug);

  if (!project) return {};

  // OG image: use custom one from frontmatter if provided, else auto-generated
  const ogImage = project.meta.ogImage ?? `/api/og?title=${encodeURIComponent(project.meta.title)}&category=ML`;

  return {
    title: project.meta.title,
    description: project.meta.description,
    openGraph: {
      title: project.meta.title,
      description: project.meta.description,
      type: "article",
      publishedTime: project.meta.date,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.meta.title,
      description: project.meta.description,
      images: [ogImage],
    },
  };
}

export default async function MLProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getContentBySlug("ml", slug);

  if (!project) {
    notFound();
  }

  const { meta, body } = project;

  return (
    <article className="max-w-2xl mx-auto px-6 sm:px-8">
      {/* ----------------------------------------------------------------- */}
      {/* Header — back link, tags, title, links                            */}
      {/* ----------------------------------------------------------------- */}
      <header className="pt-12 pb-8">
        <Link
          href="/ml"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink transition-colors mb-6"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          ML
        </Link>

        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {meta.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[11px] text-accent bg-accent-soft px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
          {meta.status && (
            <span className="text-[11px] text-accent-2 bg-accent-2-soft px-2.5 py-0.5 rounded-full">
              {meta.status}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl text-ink mb-3">{meta.title}</h1>
        <p className="text-base text-muted leading-relaxed mb-5">
          {meta.description}
        </p>
        <p className="text-xs text-muted mb-5">{formatDate(meta.date)}</p>

        {/* Action buttons row — only renders buttons that have URLs */}
        <div className="flex flex-wrap gap-3 text-xs">
          {meta.github && (
            <a
              href={meta.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-ink px-3 py-1.5 border border-ink rounded-md hover:bg-surface transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
          {meta.demo && (
            <a
              href={meta.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-ink px-3 py-1.5 border border-ink rounded-md hover:bg-surface transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Live demo
            </a>
          )}
        </div>
      </header>

      {/* ----------------------------------------------------------------- */}
      {/* Live demo embed — shown if demo URL is provided                   */}
      {/* ----------------------------------------------------------------- */}
      {meta.demo && (
        <section className="pb-8">
          <p className="text-[11px] text-muted mb-2.5 uppercase tracking-wider">
            Try it
          </p>
          <div className="bg-surface border border-line rounded-md overflow-hidden">
            <iframe
              src={meta.demo}
              title={`${meta.title} — live demo`}
              className="w-full h-[500px] border-0"
              loading="lazy"
              // sandbox restricts what the embedded content can do —
              // important when embedding third-party (HF Spaces) content
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* MDX body — the writeup itself                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="prose pb-8">
        <MDXRemote
          source={body}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug],
            },
          }}
        />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Architecture diagram — only renders if path is provided           */}
      {/* ----------------------------------------------------------------- */}
      {meta.diagram && (
        <section className="pb-8">
          <h2 className="font-serif text-2xl text-ink mb-4">Architecture</h2>
          <div className="bg-surface border border-line rounded-md p-4">
            <Image
              src={meta.diagram}
              alt={`${meta.title} architecture diagram`}
              width={800}
              height={500}
              className="w-full h-auto"
            />
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Video — shown if video URL is provided                            */}
      {/* ----------------------------------------------------------------- */}
      {meta.video && (
        <section className="pb-8">
          <h2 className="font-serif text-2xl text-ink mb-4">Demo video</h2>
          <div className="bg-surface border border-line rounded-md overflow-hidden aspect-video">
            <iframe
              src={meta.video}
              title={`${meta.title} — demo video`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Research section — only renders if research is set in frontmatter */}
      {/* This is the section you specifically asked for — keeps academic   */}
      {/* work distinct from the general project writeup.                   */}
      {/* ----------------------------------------------------------------- */}
      {meta.research && (
        <section className="pb-8">
          <div className="flex items-center gap-2 mb-3.5">
            {/* Microscope icon — signals "this is the research bit" */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent"
            >
              <path d="M6 18h8" />
              <path d="M3 22h18" />
              <path d="M14 22a7 7 0 1 0 0-14h-1" />
              <path d="M9 14h2" />
              <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
              <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
            </svg>
            <h2 className="font-serif text-2xl text-ink">Research</h2>
          </div>

          {meta.research.summary && (
            <div className="border-l-2 border-accent pl-4 mb-3">
              <p className="text-sm text-muted leading-relaxed">
                {meta.research.summary}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-xs">
            {meta.research.paper && (
              <a
                href={meta.research.paper}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-accent hover:underline"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Read the paper
              </a>
            )}
            {meta.research.results && (
              <a
                href={meta.research.results}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted hover:text-ink transition-colors"
              >
                Results & benchmarks
              </a>
            )}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Tech stack pills                                                  */}
      {/* ----------------------------------------------------------------- */}
      {meta.stack && meta.stack.length > 0 && (
        <section className="pb-16">
          <h2 className="font-serif text-2xl text-ink mb-3.5">Stack</h2>
          <div className="flex flex-wrap gap-1.5">
            {meta.stack.map((tech) => (
              <span
                key={tech}
                className="text-[11px] text-ink bg-surface border border-line px-2.5 py-1 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
