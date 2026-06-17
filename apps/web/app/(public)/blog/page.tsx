import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@music/ui";
import { SiteFooter } from "@/components/public/SiteFooter";
import { Reveal } from "@/components/public/Reveal";
import { getAllPosts, formatPostDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from the practice — what Rajon Dey is learning, recording, and thinking through on the way.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-32 sm:px-10">
        <SectionLabel className="mb-5">Blog</SectionLabel>
        <h1 className="font-display text-4xl tracking-[-0.02em] text-primary sm:text-5xl">
          Notes from the practice
        </h1>
        <p className="mt-6 max-w-prose text-[1.0625rem] leading-relaxed text-secondary">
          A few things I&apos;m thinking through as I learn — slow, honest, and
          written more for the doing than the reading.
        </p>

        {posts.length === 0 ? (
          <p className="mt-14 text-secondary">Nothing here yet — soon.</p>
        ) : (
          <ul className="mt-14">
            {posts.map((post, i) => (
              <Reveal
                as="li"
                key={post.slug}
                delay={i * 70}
                className="border-t border-border"
              >
                <Link href={`/blog/${post.slug}`} className="group block py-7">
                  <p className="text-xs uppercase tracking-widest text-secondary">
                    {formatPostDate(post.date)}
                  </p>
                  <h2 className="mt-2 font-display text-2xl tracking-[-0.01em] text-primary transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="mt-2 leading-relaxed text-secondary">
                    {post.summary}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent">
                    Read
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </div>

      <SiteFooter />
    </>
  );
}
