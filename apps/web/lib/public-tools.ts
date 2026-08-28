/**
 * Public musician utilities — the catalogue.
 *
 * To ship a tool:
 * 1. Add an object here with status: "live"
 * 2. Add components/public-tools/{slug}.tsx
 * 3. Register the component in components/public-tools/bodies.ts
 *
 * Gear / kit is not a tool. It lives on /about#kit.
 * Drafts never appear on /tools or in the sitemap.
 */

export type PublicTool = {
  slug: string;
  name: string;
  lede: string;
  status: "live" | "draft";
};

const tools: PublicTool[] = [
  {
    slug: "chords",
    name: "Chords",
    lede: "Look up a chord. See how it sits on the neck.",
    status: "live",
  },
];

export function getLiveTools(): PublicTool[] {
  return tools.filter((tool) => tool.status === "live");
}

export function getTool(slug: string): PublicTool | undefined {
  return getLiveTools().find((tool) => tool.slug === slug);
}
