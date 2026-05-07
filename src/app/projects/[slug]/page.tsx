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

// Mirror of the ML project detail page, but pulls from /content/projects/.
// Kept as a separate file rather than parameterizing the category — it's
// cleaner for routing and lets us evolve the two templates independently
// later if needed (e.g. ML projects might add a "model card" section).

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getAllContent("projects");
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getContentBySlug("projects", slug);

  if (!project) return {};

  const ogImage =
    project.meta.ogImage ??
    `/api/og?title=${encodeURIComponent(project.meta.title)}&category=Project`;

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

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getContentBySlug("projects", slug);

  if (!project) notFound();

  const { meta, body } = project;

  return (
    <article className="max-w-2xl mx-auto px-6 sm:px-8">
      <header className="pt-12 pb-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink transition-colors mb-6"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Projects
        </Link>

        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {meta.tags?.map((tag) => (
            <span key={tag} className="text-[11px] text-muted bg-line px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {meta.status && (
            <span className="text-[11px] text-muted bg-line px-2.5 py-0.5 rounded-full">
              {meta.status}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl text-ink mb-3">{meta.title}</h1>
        <p className="text-base text-muted leading-relaxed mb-5">{meta.description}</p>
        <p className="text-xs text-muted mb-5">{formatDate(meta.date)}</p>

        <div className="flex flex-wrap gap-3 text-xs">
          {meta.github && (
            <a href={meta.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink px-3 py-1.5 border border-ink rounded-md hover:bg-surface transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
          {meta.demo && (
            <a href={meta.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink px-3 py-1.5 border border-ink rounded-md hover:bg-surface transition-colors">
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

      {meta.demo && (
        <section className="pb-8">
          <p className="text-[11px] text-muted mb-2.5 uppercase tracking-wider">Try it</p>
          <div className="bg-surface border border-line rounded-md overflow-hidden">
            <iframe src={meta.demo} title={`${meta.title} — live demo`} className="w-full h-[500px] border-0" loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
          </div>
        </section>
      )}

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

      {meta.diagram && (
        <section className="pb-8">
          <h2 className="font-serif text-2xl text-ink mb-4">Architecture</h2>
          <div className="bg-surface border border-line rounded-md p-4">
            <Image src={meta.diagram} alt={`${meta.title} architecture diagram`} width={800} height={500} className="w-full h-auto" />
          </div>
        </section>
      )}

      {meta.video && (
        <section className="pb-8">
          <h2 className="font-serif text-2xl text-ink mb-4">Demo video</h2>
          <div className="bg-surface border border-line rounded-md overflow-hidden aspect-video">
            <iframe src={meta.video} title={`${meta.title} — demo video`} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
          </div>
        </section>
      )}

      {meta.stack && meta.stack.length > 0 && (
        <section className="pb-16">
          <h2 className="font-serif text-2xl text-ink mb-3.5">Stack</h2>
          <div className="flex flex-wrap gap-1.5">
            {meta.stack.map((tech) => (
              <span key={tech} className="text-[11px] text-ink bg-surface border border-line px-2.5 py-1 rounded-md">
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
