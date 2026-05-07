import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  getAllContent,
  getContentBySlug,
  formatDate,
} from "@/lib/content";
import { Comments } from "@/components/Comments";
import type { Metadata } from "next";

// Blog post detail page. Same MDX rendering as project pages,
// plus Giscus comments at the bottom.
//
// Reading width is narrower (max-w-2xl ≈ 672px) than index pages
// because long-form text needs ~70 character lines for comfortable reading.

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllContent("writing");
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getContentBySlug("writing", slug);

  if (!post) return {};

  const ogImage =
    post.meta.ogImage ??
    `/api/og?title=${encodeURIComponent(post.meta.title)}&category=Writing`;

  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
      images: [ogImage],
    },
  };
}

export default async function WritingPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getContentBySlug("writing", slug);

  if (!post) notFound();

  const { meta, body } = post;

  return (
    <article className="max-w-2xl mx-auto px-6 sm:px-8">
      <header className="pt-12 pb-8">
        <Link
          href="/writing"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink transition-colors mb-6"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Writing
        </Link>

        <h1 className="text-3xl sm:text-4xl text-ink mb-3">{meta.title}</h1>
        <p className="text-base text-muted leading-relaxed mb-3">
          {meta.description}
        </p>
        <p className="text-xs text-muted">{formatDate(meta.date)}</p>
      </header>

      <div className="prose pb-12">
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

      {/* Comments — Giscus loads asynchronously and only on writing pages */}
      <section className="pt-8 pb-16 border-t border-line">
        <h2 className="font-serif text-xl text-ink mb-6">Comments</h2>
        <Comments />
      </section>
    </article>
  );
}
