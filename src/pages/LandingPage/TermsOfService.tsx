import React from "react";
import LegalLayout, { LegalSection, LegalList } from "./LegalLayout";

export default function TermsOfService() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="The agreement between you and FricaLearn when you use our learning platform."
      lastUpdated="4 July 2026"
    >
      <LegalSection number="01" title="Who We Are & Acceptance">
        <p>
          FricaLearn ("FricaLearn", "we", "us", "our") is an online learning platform operated by{" "}
          <strong className="text-[#0E1C0E]">FRICA SOLUTION LIMITED</strong>, a company registered in England,
          based in Gillingham, England, United Kingdom.
        </p>
        <p>
          By creating an account, enrolling a child, or otherwise using fricalearn.com (the "Platform"),
          you agree to these Terms of Service ("Terms"). If you do not agree, please do not use the Platform.
        </p>
      </LegalSection>

      <LegalSection number="02" title="The Service">
        <p>FricaLearn provides a self-paced learning platform for children aged 3–18, which includes:</p>
        <LegalList items={[
          <>Curriculum-aligned <strong>Mathematics and English</strong> lessons and quizzes;</>,
          <>Free heritage <strong>language courses</strong> (Yoruba, Igbo, Hausa — one free language per enrolment);</>,
          <>An <strong>AI Tutor</strong> chat assistant, limited to 60 minutes per student per day;</>,
          <>Progress tracking, points, levels, leaderboards, and rewards;</>,
          <>Monthly progress reports for parents, and tutor support on identified weak areas.</>,
        ]} />
        <p>
          FricaLearn is a <strong>self-tutor platform</strong>: students learn independently at their own pace.
          Human tutor involvement is provided as described on the Platform and may change as the service develops.
        </p>
      </LegalSection>

      <LegalSection number="03" title="Accounts & Parental Responsibility">
        <LegalList items={[
          <>Accounts must be created by a <strong>parent or legal guardian aged 18 or over</strong>. Children may not register their own accounts.</>,
          <>When you enrol a child, we create a <strong>student sub-account</strong> for that child under your parent account. You are responsible for all activity on your account and your children's student accounts.</>,
          <>You must provide accurate information (including your child's correct age and class level) and keep your login credentials secure.</>,
          <>You must notify us immediately at hello@fricalearn.com if you suspect unauthorised use of your account.</>,
        ]} />
      </LegalSection>

      <LegalSection number="04" title="Subscriptions, Payment & Access">
        <LegalList items={[
          <>Paid subjects (Mathematics and English) are billed <strong>monthly per subject</strong>: ₦20,000/month when paying in Naira, or £13.33/month when paying in Pounds. Language courses are free (one per enrolment). Prices may change with notice.</>,
          <>Payment is made by <strong>bank transfer</strong> to the account details shown at checkout, using your child's name as the payment reference, followed by uploading your payment receipt.</>,
          <>Access is granted <strong>immediately upon receipt submission</strong>. Our team verifies payments within approximately 24 hours. If a payment cannot be verified, is fraudulent, or was not made, we may suspend or revoke access until resolved.</>,
          <>Subscriptions are <strong>not auto-renewing</strong>. Continued access requires a new monthly payment. We may send reminders before your access period ends.</>,
          <>Uploading a falsified or altered payment receipt is a material breach of these Terms and will result in immediate account termination.</>,
        ]} />
      </LegalSection>

      <LegalSection number="05" title="Refunds">
        <p>
          Because access to digital learning content is granted immediately, payments are{" "}
          <strong>non-refundable</strong> once a subscription month has begun, except where required by law
          (including your statutory rights under UK consumer law) or where we fail to provide the service as
          described. If you believe you are entitled to a refund, contact hello@fricalearn.com within 14 days
          of payment and we will review your case.
        </p>
      </LegalSection>

      <LegalSection number="06" title="Acceptable Use">
        <p>You and your child agree NOT to:</p>
        <LegalList items={[
          "Share account credentials or resell access to the Platform;",
          "Copy, scrape, redistribute, or commercially exploit lesson content, quizzes, or reports;",
          "Attempt to bypass usage limits (including the AI Tutor daily limit), access other users' data, or interfere with Platform security;",
          "Use the AI Tutor for anything other than learning support in the subjects offered;",
          "Upload unlawful, harmful, or offensive material anywhere on the Platform.",
        ]} />
        <p>We may suspend or terminate accounts that breach these rules.</p>
      </LegalSection>

      <LegalSection number="07" title="Content & Intellectual Property">
        <p>
          The Platform, its design, software, branding, original lessons, and quizzes are owned by FRICA
          SOLUTION LIMITED or its licensors. You receive a personal, non-transferable licence to use them for
          your child's education only.
        </p>
        <p>
          Portions of our Mathematics and English curriculum content are derived from{" "}
          <strong>Oak National Academy</strong> and contain public sector information licensed under the{" "}
          <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
             target="_blank" rel="noopener noreferrer"
             className="text-[#2D5A27] font-black underline">
            Open Government Licence v3.0
          </a>. Oak National Academy does not endorse FricaLearn.
        </p>
      </LegalSection>

      <LegalSection number="08" title="AI Tutor — Important Notice">
        <LegalList items={[
          <>The AI Tutor is an <strong>automated assistant</strong> powered by third-party AI technology. It is designed to help with Maths, English, Yoruba, Igbo, and Hausa only, and to redirect off-topic conversations.</>,
          "AI responses may occasionally be inaccurate or incomplete. The AI Tutor supplements — it does not replace — the curriculum content or human review.",
          "Usage is limited to 60 minutes per student per day.",
          "Do not enter personal information (full names, addresses, phone numbers, passwords) into AI Tutor conversations.",
        ]} />
      </LegalSection>

      <LegalSection number="09" title="Availability & Changes">
        <p>
          We aim to keep the Platform available at all times but do not guarantee uninterrupted access. We may
          update, add, or remove features, lessons, or courses (including where third-party content sources
          change). Where changes materially reduce a paid service, we will tell you in advance where reasonably possible.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Limitation of Liability">
        <p>
          Nothing in these Terms limits liability that cannot be limited by law (including for death or
          personal injury caused by negligence, or fraud). Subject to that, our total liability to you in any
          12-month period is limited to the amount you paid to us in that period, and we are not liable for
          indirect or consequential losses. FricaLearn is an educational aid — we do not guarantee specific
          academic outcomes, grades, or exam results.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Termination">
        <LegalList items={[
          "You may stop using the Platform at any time and may request account deletion by contacting us.",
          "We may suspend or terminate accounts for breach of these Terms, suspected fraud, or unlawful use.",
          "On termination, licences granted to you end, but sections that by their nature should survive (IP, liability, governing law) survive.",
        ]} />
      </LegalSection>

      <LegalSection number="12" title="Governing Law & Contact">
        <p>
          These Terms are governed by the laws of <strong>England and Wales</strong>, and the courts of England
          and Wales have exclusive jurisdiction, except that consumers resident elsewhere keep the protection of
          mandatory rules of their local law (including, for users in Nigeria, applicable Nigerian consumer law).
        </p>
        <p>
          Contact: FRICA SOLUTION LIMITED, Gillingham, England, United Kingdom ·{" "}
          <strong>hello@fricalearn.com</strong> · WhatsApp +234 817 448 5504.
        </p>
        <p>
          We may update these Terms from time to time. We will post the new version here with an updated date,
          and, for material changes, notify registered parents by email.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
