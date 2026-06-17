import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { Prose } from "@/components/public/Prose";
import { SiteFooter } from "@/components/public/SiteFooter";
import { BlogPostJsonLd } from "@/components/public/BlogPostJsonLd";
import { getAllPosts, getPost, formatPostDate } from "@/lib/blog";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `/blog/${slug}`;
  return {
    title: post.meta.title,
    description: post.meta.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.meta.title,
      description: post.meta.summary,
      url,
      publishedTime: post.meta.date || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.summary,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
  });

  return (
    <>
      <BlogPostJsonLd post={post.meta} />
      <article className="mx-auto max-w-3xl px-6 pb-16 pt-32 sm:px-10">
        <Link
          href="/blog"
          className="text-sm text-secondary transition-colors hover:text-primary"
        >
          <span aria-hidden>←</span> Blog
        </Link>

        <p className="mt-8 text-xs uppercase tracking-widest text-secondary">
          {formatPostDate(post.meta.date)}
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-[-0.02em] text-primary sm:text-5xl">
          {post.meta.title}
        </h1>

        <Prose className="mt-10">{content}</Prose>
      </article>

      <SiteFooter />
    </>
  );
}
