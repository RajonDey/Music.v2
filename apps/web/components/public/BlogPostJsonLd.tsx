import { PUBLIC_SITE } from "@/lib/public-site-legacy";
import type { PostMeta } from "@/lib/blog";

export function BlogPostJsonLd({ post }: { post: PostMeta }) {
  const url = `${PUBLIC_SITE.url}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.summary,
        url,
        datePublished: post.date || undefined,
        dateModified: post.date || undefined,
        inLanguage: "en-US",
        author: { "@id": `${PUBLIC_SITE.url}/#person` },
        publisher: { "@id": `${PUBLIC_SITE.url}/#person` },
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${PUBLIC_SITE.url}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${PUBLIC_SITE.url}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
