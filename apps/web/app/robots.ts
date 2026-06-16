import type { MetadataRoute } from "next";
import { PUBLIC_SITE } from "@/lib/public-site-legacy";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/journey", "/releases", "/login", "/api/"],
    },
    sitemap: `${PUBLIC_SITE.url}/sitemap.xml`,
  };
}
