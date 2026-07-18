import React from "react";
import LegalLayout, { LegalSection, LegalList } from "./LegalLayout";

export default function CookiePolicy() {
  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="What we store on your device, why, and how you can control it."
      lastUpdated="4 July 2026"
    >
      <LegalSection number="01" title="What Are Cookies & Local Storage?">
        <p>
          Cookies are small files placed on your device by websites. We also use{" "}
          <strong>browser local storage</strong> — a similar technology that lets the Platform remember
          information between visits. This policy covers both.
        </p>
        <p>
          FricaLearn keeps this to a minimum: we use <strong>essential storage only</strong> — the items
          strictly needed to log you in and run the Platform. We do <strong>not</strong> use advertising
          cookies, and we do not allow third-party ad trackers on the Platform. This matters especially
          because our users include children.
        </p>
      </LegalSection>

      <LegalSection number="02" title="What We Store">
        <p><strong className="text-[#2A1650]">Strictly necessary (always on):</strong></p>
        <LegalList items={[
          <><strong>Authentication token</strong> — keeps you securely logged in to your account. Removed when you log out.</>,
          <><strong>active_student_id</strong> — when a parent uses "view as student", this remembers which child's learning is being viewed. Cleared when you exit the student view.</>,
          <><strong>is_impersonating</strong> — flags that a parent is currently viewing the platform as their child, so the yellow banner and Exit Portal button display. Cleared on exit.</>,
          <><strong>Session preferences</strong> — small items that keep forms and navigation working smoothly during your visit.</>,
        ]} />
        <p>
          These items contain account identifiers only — no card details (we take payment by bank transfer)
          and no tracking of your activity on other websites.
        </p>
      </LegalSection>

      <LegalSection number="03" title="Analytics">
        <p>
          We currently rely on privacy-respecting, aggregate server statistics rather than third-party
          analytics cookies. If we introduce analytics cookies in the future, we will update this policy and,
          where required, ask for your consent first via a cookie banner.
        </p>
      </LegalSection>

      <LegalSection number="04" title="Third-Party Services">
        <LegalList items={[
          <><strong>WhatsApp links:</strong> clicking our WhatsApp button opens WhatsApp, which has its own privacy and cookie practices.</>,
          <><strong>AI Tutor:</strong> chat requests are processed by our AI provider server-side; the provider does not set cookies on your device through our Platform.</>,
          <><strong>Social media links</strong> in our footer open external sites governed by their own policies.</>,
        ]} />
      </LegalSection>

      <LegalSection number="05" title="Managing Cookies & Storage">
        <LegalList items={[
          "You can clear cookies and local storage at any time through your browser settings (usually under Privacy or Site Data).",
          "You can block cookies entirely in your browser — but note that login and the parent portal will not work without the essential items above.",
          "Logging out removes your authentication session from the browser.",
        ]} />
        <p>
          Guides: look for "Clear browsing data" in Chrome, "Privacy &amp; Security" in Firefox, or
          "Settings → Safari → Advanced → Website Data" on iPhone.
        </p>
      </LegalSection>

      <LegalSection number="06" title="Changes & Contact">
        <p>
          If our use of cookies changes (for example, adding analytics), we will update this page and the
          "Last updated" date, and introduce a consent banner where legally required. Questions:{" "}
          <strong>hello@fricalearn.com</strong>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
