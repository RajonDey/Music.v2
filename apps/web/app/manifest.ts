import type { MetadataRoute } from "next";
import { PUBLIC_SITE } from "@/lib/public-site-legacy";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: PUBLIC_SITE.siteName,
    short_name: "RD Music",
    description: PUBLIC_SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0f0d0b",
    theme_color: "#0f0d0b",
    icons: [
      {
        src: PUBLIC_SITE.assets.favicon32,
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: PUBLIC_SITE.assets.icon192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: PUBLIC_SITE.assets.appleTouchIcon,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
