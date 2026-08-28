import type { MetadataRoute } from "next";
import { PUBLIC_SITE } from "@/lib/public-site-legacy";
import { getAllPosts } from "@/lib/blog";
import { getLiveTools } from "@/lib/public-tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = PUBLIC_SITE.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
      { url: `${base}/about`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${base}/tools`, changeFrequency: "monthly", priority: 0.6 },
      { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.7 },
      { url: `${base}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
      { url: `${base}/terms-of-use`, changeFrequency: "yearly", priority: 0.2 },
      { url: `${base}/cookies-policy`, changeFrequency: "yearly", priority: 0.2 },
    ] satisfies MetadataRoute.Sitemap
  ).map((route) => ({ ...route, lastModified: now }));

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const toolRoutes: MetadataRoute.Sitemap = getLiveTools().map((tool) => ({
    url: `${base}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes, ...toolRoutes];
}
