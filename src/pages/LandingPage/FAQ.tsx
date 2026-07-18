import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface FAQItem { question: string; answer: string; }

const faqs: FAQItem[] = [
  {
    question: "What's the difference between paying in Naira vs Pounds?",
    answer: "Your payment currency determines your child's curriculum. Paying in Naira (₦) via Paystack gives access to the Nigerian NERDC curriculum (Primary 1–6 and JSS 1–3). Paying in Pounds (£) via Stripe gives access to the UK National Curriculum (Year 1–11) powered by Oak National Academy. Both include free African language scholarships."
  },
  {
    question: "Which UK subjects are available?",
    answer: "We currently offer Mathematics and English for all Key Stages (KS1–KS4, Year 1–11). Each subject has over 350 lessons with quizzes, learning outcomes, and key vocabulary — all sourced from Oak National Academy, the UK government's official curriculum provider."
  },
  {
    question: "What does the Nigerian curriculum cover?",
    answer: "Our Nigerian curriculum covers Mathematics and English from Primary 1 through JSS 3, fully aligned with NERDC. Each grade has multiple topics and lessons with interactive quizzes. Content is created by qualified Nigerian educators following the official NERDC framework."
  },
  {
    question: "Is FricaLearn only for children in the diaspora?",
    answer: "Not at all! While we specialise in helping diaspora children stay connected to their roots, our platform serves families everywhere. Nigerian students get the NERDC curriculum, UK students get the national curriculum, and any child worldwide can learn Yoruba, Igbo, or Hausa."
  },
  {
    question: "What role does AI Tutor play?",
    answer: "Olụkọ is your child's 24/7 AI study companion. Between lessons, students can ask questions, get explanations, and practise concepts. It's a safe, monitored environment focused strictly on education and language learning."
  },
  {
    question: "How do I enrol my child?",
    answer: "Click 'Register', choose your payment currency (₦ or £), select your child's grade, pick their subjects, upload a payment receipt, and your child gets immediate access. The whole process takes under 5 minutes."
  },
  {
    question: "Can my child earn rewards for learning?",
    answer: "Yes! FricaLearn is fully gamified. Students earn points for completing lessons and quizzes, which they can use to unlock items in our Rewards Marketplace. This keeps learning fun and motivating."
  },
  {
    question: "How do you ensure tutor quality and safety?",
    answer: "Our Gold Standard vetting includes identity and background verification, native proficiency assessment, cultural depth evaluation, pedagogical training, and a monitored probation period. We accept only the top 5% of applicants. All live sessions are recorded and reviewed."
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-28 bg-white" id="faq">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: sticky header */}
          <div className="lg:sticky lg:top-32">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-[#3F2171]" />
              <span className="text-[#3F2171] font-black text-[10px] uppercase tracking-[0.4em]">Got Questions?</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-[#2A1650] leading-none mb-8">
              Frequently<br />
              <span className="text-[#3F2171]">Asked.</span>
            </h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10">
              Everything you need to know about FricaLearn's dual curriculum, pricing, and how to get started.
            </p>
            <a href="#contact"
              className="inline-flex items-center gap-3 bg-[#2A1650] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#3F2171] transition-all">
              Still have questions?
              <span className="text-[#FFFF00]">→</span>
            </a>
          </div>

          {/* Right: accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i}
                className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  openIndex === i ? "border-[#3F2171] shadow-lg" : "border-gray-100 shadow-sm"
                }`}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left gap-4">
                  <span className={`text-base font-black uppercase tracking-tight transition-colors ${
                    openIndex === i ? "text-[#3F2171]" : "text-[#2A1650]"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    openIndex === i ? "bg-[#3F2171] text-white rotate-180" : "bg-gray-100 text-gray-400"
                  }`}>
                    <FaChevronDown size={14} />
                  </div>
                </button>

                {openIndex === i && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed font-medium text-sm">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
