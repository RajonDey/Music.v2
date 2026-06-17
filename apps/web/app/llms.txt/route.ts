import { PUBLIC_SITE } from "@/lib/public-site-legacy";
import { getAllPosts } from "@/lib/blog";

export function GET() {
  const base = PUBLIC_SITE.url;
  const posts = getAllPosts();

  const postLines = posts.length
    ? posts
        .map((p) => `- [${p.title}](${base}/blog/${p.slug}) — ${p.summary}`)
        .join("\n")
    : "- (No posts published yet)";

  const body = `# ${PUBLIC_SITE.siteName} — Rajon Dey Music

> ${PUBLIC_SITE.brandLine}

${PUBLIC_SITE.description}

## About Rajon Dey
Software engineer and daily guitar + vocal practitioner. Music for joy and creativity — not metrics or pressure.
Public home at ${base}. Private practice journal (Music OS) is password-protected and excluded from indexing.

## Tagline
${PUBLIC_SITE.tagline}

## Pages
- [Home](${base}/) — ${PUBLIC_SITE.brandLine}
- [About](${base}/about) — Rajon's story and why this music exists
- [Tools](${base}/tools) — the gear and software behind the sound
- [Blog](${base}/blog) — notes from the practice

## Blog posts
${postLines}

## Listen & follow
- SoundCloud: ${PUBLIC_SITE.social.soundcloud}
- YouTube: ${PUBLIC_SITE.social.youtube}
- Instagram: ${PUBLIC_SITE.social.instagram}

## Canonical URLs
- Home: ${base}/
- LLMs file: ${base}/llms.txt
- Sitemap: ${base}/sitemap.xml

## Keywords
${PUBLIC_SITE.keywords.join(", ")}

## Legacy source
WordPress theme and assets preserved from ${PUBLIC_SITE.legacyRepo}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
