import type { NextConfig } from "next";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.join(__dirname, "..", "..");

/** Monorepo: Next only reads apps/web/.env* by default; also load repo root. */
function loadRootEnv() {
  for (const name of [".env.local", ".env"]) {
    const file = path.join(repoRoot, name);
    if (!existsSync(file)) continue;

    for (const line of readFileSync(file, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

loadRootEnv();

const nextConfig: NextConfig = {
  transpilePackages: ["@music/ui", "@music/types", "@music/tokens"],
  outputFileTracingRoot: repoRoot,
};

export default nextConfig;
