import React from "react";
import LegalLayout, { LegalSection, LegalList } from "./LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your family's data — written for parents, in plain language."
      lastUpdated="4 July 2026"
    >
      <LegalSection number="01" title="Who We Are">
        <p>
          FricaLearn is operated by <strong className="text-[#0E1C0E]">FRICA SOLUTION LIMITED</strong>,
          Gillingham, England, United Kingdom ("we", "us"). We are the data controller for personal data
          processed on fricalearn.com. Because our learners are children, we take our responsibilities under
          the <strong>UK GDPR</strong>, the ICO's <strong>Age Appropriate Design Code (Children's Code)</strong>,
          and — for users in Nigeria — the <strong>Nigeria Data Protection Act / NDPR</strong> seriously.
        </p>
        <p>Privacy questions: <strong>hello@fricalearn.com</strong>.</p>
      </LegalSection>

      <LegalSection number="02" title="What We Collect">
        <p><strong className="text-[#0E1C0E]">From parents (account holders):</strong></p>
        <LegalList items={[
          "Name, email address, and password (stored encrypted/hashed);",
          "Payment currency, amounts, and the payment receipt you upload (bank transfer proof);",
          "Messages you send us via the contact form, email, or WhatsApp.",
        ]} />
        <p className="pt-2"><strong className="text-[#0E1C0E]">About children (entered by the parent):</strong></p>
        <LegalList items={[
          "Child's name and age (we do not collect date of birth or gender);",
          "Selected subjects, class/year level, and curriculum region;",
          "Learning activity: lessons opened, quiz answers and scores, progress, points/levels, and AI Tutor chat messages and usage minutes.",
        ]} />
        <p className="pt-2"><strong className="text-[#0E1C0E]">Automatically:</strong></p>
        <LegalList items={[
          "Login session data and essential technical data needed to keep the Platform secure and working (see our Cookie Policy).",
        ]} />
        <p>
          We practise <strong>data minimisation</strong>: we deliberately collect only what the learning
          service needs. We never ask children for contact details, location, or photos.
        </p>
      </LegalSection>

      <LegalSection number="03" title="Children's Data & Parental Consent">
        <LegalList items={[
          <>Only a <strong>parent or guardian (18+)</strong> can create accounts and enrol children. By enrolling a child, the parent provides the information about the child and consents to its processing as described here.</>,
          "Child student accounts use system-generated login emails — children do not provide their own email addresses.",
          "Children cannot make payments, cannot be contacted by other users through the Platform, and there is no public chat between students.",
          "Leaderboards display the student's first name and points only.",
          "Parents can view their child's learning activity at any time through the parent portal, and can ask us to correct or delete their child's data.",
        ]} />
      </LegalSection>

      <LegalSection number="04" title="How We Use Data (and Legal Bases)">
        <LegalList items={[
          <><strong>To provide the service</strong> (accounts, lessons, quizzes, progress, AI Tutor, rewards) — legal basis: performance of our contract with the parent.</>,
          <><strong>To verify payments</strong> from uploaded receipts — legal basis: contract and legitimate interests (fraud prevention).</>,
          <><strong>To send monthly progress reports</strong> and service communications to parents — legal basis: contract / legitimate interests.</>,
          <><strong>To assign tutor support on weak areas</strong> identified from quiz performance — legal basis: contract.</>,
          <><strong>To keep the Platform safe and improve it</strong> (debugging, abuse prevention, aggregate usage statistics) — legal basis: legitimate interests.</>,
        ]} />
        <p>
          We do <strong>not</strong> sell personal data, we do not show third-party advertising, and we do not
          use children's data for marketing or profiling beyond tracking their own learning progress.
        </p>
      </LegalSection>

      <LegalSection number="05" title="Who We Share Data With">
        <LegalList items={[
          <><strong>AI provider (OpenAI):</strong> AI Tutor messages are processed by OpenAI to generate responses. We instruct students not to include personal details in chats, and chats are limited to educational topics. AI Tutor conversations are not used by us to train AI models.</>,
          <><strong>Hosting and infrastructure providers</strong> that store our database and files (including uploaded receipts) securely.</>,
          <><strong>Oak National Academy API:</strong> we retrieve curriculum content from Oak. No personal data about you or your child is sent to Oak.</>,
          <><strong>Email/communication providers</strong> used to send account and report emails.</>,
          "Authorities where required by law.",
        ]} />
        <p>
          Where data is transferred outside the UK (for example to AI or hosting providers), we rely on
          appropriate safeguards such as adequacy decisions or standard contractual clauses.
        </p>
      </LegalSection>

      <LegalSection number="06" title="How Long We Keep Data">
        <LegalList items={[
          "Account and learning data: kept while the account is active, and deleted or anonymised within 12 months of account closure unless law requires longer.",
          "Payment receipts and records: kept for up to 6 years to meet accounting and tax obligations.",
          "AI Tutor chat history: retained only as needed to provide the service and enforce daily limits, then deleted on account closure.",
          "Contact form enquiries: kept for up to 24 months.",
        ]} />
      </LegalSection>

      <LegalSection number="07" title="Security">
        <p>
          We protect data with encrypted connections (HTTPS), hashed passwords, access controls limiting who
          can view personal data, and secure hosting. Payment is by bank transfer — we never collect or store
          card numbers. No system is 100% secure, but if a breach affecting your data occurs we will notify you
          and the relevant regulator as required by law.
        </p>
      </LegalSection>

      <LegalSection number="08" title="Your Rights">
        <p>Parents (for themselves and on behalf of their children) have the right to:</p>
        <LegalList items={[
          "Access a copy of the personal data we hold;",
          "Correct inaccurate data (e.g. child's name or age);",
          "Delete data ('right to be forgotten');",
          "Restrict or object to certain processing;",
          "Data portability (receive data in a usable format);",
          "Withdraw consent where processing is based on consent.",
        ]} />
        <p>
          To exercise any right, email <strong>hello@fricalearn.com</strong>. We respond within one month.
          You may also complain to the UK regulator, the{" "}
          <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#2D5A27] font-black underline">
            Information Commissioner's Office (ICO)
          </a>, or in Nigeria to the{" "}
          <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer" className="text-[#2D5A27] font-black underline">
            Nigeria Data Protection Commission
          </a>.
        </p>
      </LegalSection>

      <LegalSection number="09" title="Changes to This Policy">
        <p>
          We will post any changes here with an updated date and, for material changes affecting children's
          data, we will email registered parents before the changes take effect.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
