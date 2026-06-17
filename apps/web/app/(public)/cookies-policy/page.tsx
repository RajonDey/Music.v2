import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/public/LegalPage";

export const metadata: Metadata = {
  title: "Cookies Policy",
  description:
    "How Rajon Dey Music uses cookies to enhance your experience on this website.",
};

export default function CookiesPolicyPage() {
  return (
    <LegalPage title="Cookies Policy" updated="January 10, 2025">
      <p>
        At Rajon Dey Music, we use cookies to enhance your experience on our
        website. This Cookies Policy explains what cookies are, how we use them,
        and your options regarding cookie settings.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files placed on your device (computer, tablet,
        smartphone, etc.) when you visit a website. They help the website
        remember your preferences and actions over time, making your experience
        more efficient.
      </p>

      <h2>2. How we use cookies</h2>
      <ul>
        <li>
          <strong>Enhance user experience</strong> — remembering your settings
          and preferences for a more personalized visit.
        </li>
        <li>
          <strong>Analyze website usage</strong> — understanding traffic and
          usage patterns so we can improve the site&apos;s content and
          performance.
        </li>
        <li>
          <strong>Functional purposes</strong> — enabling essential features
          such as keeping the site working as intended.
        </li>
      </ul>

      <h2>3. Types of cookies we use</h2>
      <ul>
        <li>
          <strong>Necessary cookies</strong> — essential for the operation of
          the website, such as security and core functionality.
        </li>
        <li>
          <strong>Performance cookies</strong> — collect anonymous data on how
          visitors use the site, helping us improve it.
        </li>
        <li>
          <strong>Functionality cookies</strong> — remember choices you make,
          such as preferences, to provide personalized features.
        </li>
        <li>
          <strong>Targeting cookies</strong> — where used, these help deliver
          content relevant to your interests.
        </li>
      </ul>

      <h2>4. Third-party cookies</h2>
      <p>
        We may use third-party cookies from services such as analytics providers
        or social platforms to collect anonymous data or let you share content.
        These cookies are subject to the respective privacy and cookie policies
        of those services.
      </p>

      <h2>5. Managing cookies</h2>
      <p>
        You can control and manage cookies in your browser settings. You can set
        your browser to block cookies or notify you when one is being placed.
        Please note that blocking certain cookies may affect the functionality
        of the website. Most browsers let you manage cookies under their privacy
        or security settings — Chrome, Firefox, Safari, and Edge all provide
        these controls.
      </p>

      <h2>6. Changes to this policy</h2>
      <p>
        We may update this Cookies Policy from time to time. Any changes will be
        posted on this page with an updated date. Please review it periodically
        to stay informed.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions or concerns about this Cookies Policy? Reach us at{" "}
        <a href="mailto:hello@rajondey.com">hello@rajondey.com</a>. See also our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  );
}
