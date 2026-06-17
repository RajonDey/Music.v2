import Script from "next/script";
import { PUBLIC_SITE } from "@/lib/public-site-legacy";

/**
 * Google Tag Manager. Only loads in production when an ID is available
 * (env override first, then the known container). In development it renders
 * nothing, so local work never pollutes analytics.
 *
 * On Vercel, set NEXT_PUBLIC_GTM_ID to control/override the container.
 */
const GTM_ID =
  process.env.NEXT_PUBLIC_GTM_ID || PUBLIC_SITE.analytics.googleTagManager;

const enabled = process.env.NODE_ENV === "production" && Boolean(GTM_ID);

export function GoogleTagManagerHead() {
  if (!enabled) return null;
  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

export function GoogleTagManagerNoscript() {
  if (!enabled) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
