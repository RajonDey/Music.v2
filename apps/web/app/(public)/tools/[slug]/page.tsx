import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolFrame } from "@/components/public-tools/ToolFrame";
import { toolBodies } from "@/components/public-tools/bodies";
import { getLiveTools, getTool } from "@/lib/public-tools";

type Params = { params: Promise<{ slug: string }> };
type Search = { searchParams: Promise<{ q?: string }> };

export function generateStaticParams() {
  return getLiveTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  const url = `/tools/${slug}`;
  return {
    title: tool.name,
    description: tool.lede,
    alternates: { canonical: url },
    openGraph: {
      title: tool.name,
      description: tool.lede,
      url,
    },
  };
}

export default async function ToolPage({ params, searchParams }: Params & Search) {
  const { slug } = await params;
  const { q } = await searchParams;
  const tool = getTool(slug);
  if (!tool) notFound();

  const Body = toolBodies[tool.slug];
  const initialQuery = q?.trim() ? q : "C";

  return (
    <ToolFrame tool={tool} quiet={slug === "chords"}>
      {Body ? <Body initialQuery={initialQuery} /> : null}
    </ToolFrame>
  );
}
