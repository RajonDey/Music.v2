import { PUBLIC_SITE } from "@/lib/public-site-legacy";

export function GET() {
  const body = `# ${PUBLIC_SITE.siteName} — Rajon Dey Music

> ${PUBLIC_SITE.brandLine}

${PUBLIC_SITE.description}

## About Rajon Dey
Software engineer and daily guitar + vocal practitioner. Music for joy and creativity — not metrics or pressure.
Public home at ${PUBLIC_SITE.url}. Private practice journal (Music OS) is password-protected.

## Tagline
${PUBLIC_SITE.tagline}

## Listen & follow
- SoundCloud: ${PUBLIC_SITE.social.soundcloud}
- YouTube: ${PUBLIC_SITE.social.youtube}
- Instagram: ${PUBLIC_SITE.social.instagram}

## Canonical URLs
- Home: ${PUBLIC_SITE.url}/
- LLMs file: ${PUBLIC_SITE.url}/llms.txt
- Sitemap: ${PUBLIC_SITE.url}/sitemap.xml

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
