import { PUBLIC_SITE } from "@/lib/public-site-legacy";

export function PublicSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Person", "Organization"],
        "@id": `${PUBLIC_SITE.url}/#person`,
        name: PUBLIC_SITE.siteName,
        alternateName: PUBLIC_SITE.alternateName,
        url: PUBLIC_SITE.url,
        description: PUBLIC_SITE.description,
        sameAs: Object.values(PUBLIC_SITE.social),
        logo: {
          "@type": "ImageObject",
          url: `${PUBLIC_SITE.url}${PUBLIC_SITE.assets.ogImage}`,
          width: 500,
          height: 500,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${PUBLIC_SITE.url}/#website`,
        url: PUBLIC_SITE.url,
        name: PUBLIC_SITE.siteName,
        alternateName: PUBLIC_SITE.alternateName,
        description: PUBLIC_SITE.description,
        publisher: { "@id": `${PUBLIC_SITE.url}/#person` },
        inLanguage: "en-US",
      },
      {
        "@type": "WebPage",
        "@id": `${PUBLIC_SITE.url}/#webpage`,
        url: PUBLIC_SITE.url,
        name: PUBLIC_SITE.title,
        description: PUBLIC_SITE.description,
        isPartOf: { "@id": `${PUBLIC_SITE.url}/#website` },
        about: { "@id": `${PUBLIC_SITE.url}/#person` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
