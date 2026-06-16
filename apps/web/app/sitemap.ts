import type { MetadataRoute } from "next";
import { PUBLIC_SITE } from "@/lib/public-site-legacy";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: PUBLIC_SITE.url,
      lastModified: new Date("2025-01-07"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
