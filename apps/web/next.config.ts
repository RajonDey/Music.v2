import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@music/ui", "@music/types", "@music/tokens"],
};

export default nextConfig;
