import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * File-based MDX blog. Posts live in `apps/web/content/blog/*.mdx` with
 * frontmatter: title, date (ISO), summary, optional draft. Drafts are hidden
 * in production and shown in development so you can preview them.
 */
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  draft: boolean;
};

function toMeta(slug: string, data: Record<string, unknown>): PostMeta {
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    date: typeof data.date === "string" ? data.date : "",
    summary: typeof data.summary === "string" ? data.summary : "",
    draft: data.draft === true,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const isDev = process.env.NODE_ENV === "development";

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      return toMeta(slug, matter(raw).data);
    })
    .filter((post) => isDev || !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(
  slug: string,
): { meta: PostMeta; content: string } | null {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { meta: toMeta(slug, data), content };
}

export function formatPostDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
