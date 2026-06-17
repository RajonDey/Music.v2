import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/public/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms and conditions for accessing and using the Rajon Dey Music website.",
};

export default function TermsOfUsePage() {
  return (
    <LegalPage title="Terms of Use" updated="January 10, 2025">
      <p>
        Welcome to Rajon Dey Music. By accessing or using this website, you
        agree to comply with the following terms and conditions. If you do not
        agree with these terms, please refrain from using this site.
      </p>

      <h2>1. Acceptance of terms</h2>
      <p>
        By using this website, you agree to be bound by these Terms of Use and
        any other applicable laws or regulations. If you do not agree, please do
        not use this site.
      </p>

      <h2>2. Intellectual property</h2>
      <p>
        All content on this website — including text, images, videos, music,
        logos, and trademarks — is the property of Rajon Dey Music unless
        otherwise stated. You may not use, modify, reproduce, or distribute any
        content without express permission.
      </p>

      <h2>3. Use of content</h2>
      <p>
        You are granted a limited, non-exclusive license to access and use the
        content on this site for personal, non-commercial purposes. You may not
        copy, reproduce, or distribute the content for commercial purposes
        without prior written consent.
      </p>

      <h2>4. User-generated content</h2>
      <p>
        If you submit any content to the website (for example, comments or
        feedback), you grant Rajon Dey Music a non-exclusive, royalty-free,
        perpetual license to use, modify, and distribute that content.
      </p>

      <h2>5. Prohibited activities</h2>
      <p>You agree not to engage in any activities that may harm the website or other users, including:</p>
      <ul>
        <li>Using the site for unlawful purposes.</li>
        <li>Distributing harmful code or viruses.</li>
        <li>Violating any applicable laws.</li>
      </ul>

      <h2>6. Disclaimer of warranties</h2>
      <p>
        Rajon Dey Music provides this website &ldquo;as is&rdquo; without any
        warranties or representations, express or implied. We do not guarantee
        the accuracy, reliability, or availability of the website at all times.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        Rajon Dey Music is not responsible for any direct, indirect, incidental,
        or consequential damages resulting from the use or inability to use the
        website, or from any content, errors, or omissions on the site.
      </p>

      <h2>8. Privacy</h2>
      <p>
        Your use of this website is also governed by our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      <h2>9. Changes to terms</h2>
      <p>
        We reserve the right to modify or update these Terms of Use at any time.
        Any changes will be posted on this page with an updated date. Your
        continued use of the site after changes are made signifies your
        acceptance of the new terms.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These Terms of Use are governed by the applicable laws of the
        author&apos;s country of residence, without regard to conflict-of-law
        principles.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions or concerns about these Terms of Use? Reach us at{" "}
        <a href="mailto:hello@rajondey.com">hello@rajondey.com</a>.
      </p>
    </LegalPage>
  );
}
