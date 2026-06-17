import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/public/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Rajon Dey Music collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="June 17, 2026">
      <p>
        This is a personal music website. We keep things simple and collect as
        little as possible. This Privacy Policy explains what information is
        gathered when you visit, and how it&apos;s used.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li>
          <strong>Newsletter email</strong> — if you subscribe, your email
          address is collected and stored by our newsletter provider (Beehiiv)
          so we can send you updates.
        </li>
        <li>
          <strong>Usage data</strong> — anonymous, aggregated data about how the
          site is used (pages visited, general location, device type) may be
          collected to help improve the site.
        </li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To send newsletter updates you&apos;ve subscribed to.</li>
        <li>To understand how the site is used and improve it.</li>
        <li>To keep the site secure and working as intended.</li>
      </ul>
      <p>
        We do not sell your personal information, and we don&apos;t share it
        except with the service providers described below.
      </p>

      <h2>3. Third-party services</h2>
      <p>
        We rely on a few trusted services that may process limited data on our
        behalf:
      </p>
      <ul>
        <li>
          <strong>Beehiiv</strong> — newsletter delivery and subscriber
          management.
        </li>
        <li>
          <strong>Analytics</strong> — anonymous usage measurement, where
          enabled.
        </li>
      </ul>
      <p>
        Each service handles data under its own privacy policy.
      </p>

      <h2>4. Cookies</h2>
      <p>
        We use cookies to keep the site working and to understand usage. For
        details, see our <Link href="/cookies-policy">Cookies Policy</Link>.
      </p>

      <h2>5. Your choices</h2>
      <p>
        You can unsubscribe from the newsletter at any time using the link in
        any email. You can also manage or block cookies through your browser
        settings.
      </p>

      <h2>6. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with an updated date.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about your privacy? Reach us at{" "}
        <a href="mailto:hello@rajondey.com">hello@rajondey.com</a>.
      </p>
    </LegalPage>
  );
}
