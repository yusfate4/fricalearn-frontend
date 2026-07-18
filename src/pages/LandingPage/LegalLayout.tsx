import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}

/**
 * Shared layout for legal pages (Terms, Privacy, Cookies).
 * Place in the same folder as Header.tsx and Footer.tsx.
 */
const LegalLayout: React.FC<LegalLayoutProps> = ({ title, subtitle, lastUpdated, children }) => (
  <div className="bg-white antialiased">
    <Header />

    {/* Hero band */}
    <section className="bg-[#2A1650] pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-10 bg-[#FFFF00]" />
          <span className="text-[#FFFF00] font-black text-[10px] uppercase tracking-[0.4em]">Legal</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
          {title}
        </h1>
        <p className="text-white/60 font-medium text-base max-w-2xl">{subtitle}</p>
        <p className="text-white/40 font-bold text-xs uppercase tracking-widest mt-6">
          Last updated: {lastUpdated}
        </p>
      </div>
    </section>

    {/* Legal nav pills */}
    <div className="border-b border-gray-100 bg-gray-50">
      <div className="container mx-auto px-6 max-w-4xl py-4 flex flex-wrap gap-3">
        {[
          { label: "Terms of Service", to: "/terms" },
          { label: "Privacy Policy", to: "/privacy" },
          { label: "Cookie Policy", to: "/cookies" },
        ].map((l) => (
          <Link key={l.to} to={l.to}
            className="px-5 py-2.5 rounded-xl bg-white border-2 border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:border-[#3F2171] hover:text-[#3F2171] transition-all">
            {l.label}
          </Link>
        ))}
      </div>
    </div>

    {/* Content */}
    <main className="container mx-auto px-6 max-w-4xl py-16">
      <div className="legal-content space-y-10">{children}</div>

      {/* Contact strip */}
      <div className="mt-16 bg-[#3F2171] rounded-[2rem] p-8 text-white">
        <p className="font-black text-[10px] uppercase tracking-widest text-[#FFFF00] mb-2">Questions?</p>
        <p className="font-medium text-sm leading-relaxed">
          Contact us at <a href="mailto:hello@fricalearn.com" className="font-black underline hover:text-[#FFFF00]">hello@fricalearn.com</a>{" "}
          or via WhatsApp on <a href="https://wa.me/2348174485504" className="font-black underline hover:text-[#FFFF00]">+234 817 448 5504</a>.
        </p>
      </div>
    </main>

    <Footer />
  </div>
);

/** Section building blocks used by all legal pages */
export const LegalSection: React.FC<{ number: string; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
  <section>
    <div className="flex items-start gap-4 mb-4">
      <span className="bg-[#3F2171]/10 text-[#3F2171] w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0">
        {number}
      </span>
      <h2 className="text-xl md:text-2xl font-black text-[#2A1650] uppercase italic tracking-tight leading-tight pt-1.5">
        {title}
      </h2>
    </div>
    <div className="ml-14 space-y-4 text-gray-600 font-medium text-sm leading-relaxed">{children}</div>
  </section>
);

export const LegalList: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3F2171] mt-2 shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default LegalLayout;
