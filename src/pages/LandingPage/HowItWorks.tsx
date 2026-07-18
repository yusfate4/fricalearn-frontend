import React from "react";
import { Link } from "react-router-dom";

const steps = [
  {
    num: "01",
    flag: "₦ / £",
    title: "Choose your currency",
    desc: "Paying in Naira? You get the Nigerian (NERDC) curriculum. Paying in Pounds? You get the UK National Curriculum. Both include free three major Nigerian Languages.",
    color: "bg-[#FFFF00]",
    textColor: "text-[#2A1650]",
  },
  {
    num: "02",
    flag: "📚",
    title: "Select subjects & grade",
    desc: "Pick Maths, English, or both. Then select your child's class — Year 1–11 for UK or Primary 1 to JSS 3 for Nigeria. We match them instantly.",
    color: "bg-[#3F2171]",
    textColor: "text-white",
  },
  {
    num: "03",
    flag: "🚀",
    title: "Start learning today",
    desc: "Access lessons immediately after payment. Watch videos on Oak Academy, take quizzes, earn points, and chat with AI Tutor — all in one place.",
    color: "bg-[#2A1650]",
    textColor: "text-white",
  },
];

const HowItWorks: React.FC = () => (
  <section className="py-28 bg-gray-50 overflow-hidden">
    <div className="container mx-auto px-6">

      {/* Header */}
      <div className="text-center mb-20">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-10 bg-[#3F2171]" />
          <span className="text-[#3F2171] font-black text-[10px] uppercase tracking-[0.4em]">Simple Process</span>
          <span className="h-px w-10 bg-[#3F2171]" />
        </div>
        <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-[#2A1650] leading-none">
          Get Started in<br />
          <span className="text-[#3F2171]">3 Steps.</span>
        </h2>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {steps.map((step) => (
          <div key={step.num}
            className={`${step.color} rounded-[2.5rem] p-10 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500`}>
            <div className="absolute top-6 right-8 text-7xl font-black opacity-10 leading-none select-none">{step.num}</div>
            <div className="text-4xl mb-6">{step.flag}</div>
            <h3 className={`text-2xl font-black uppercase italic tracking-tight mb-4 ${step.textColor}`}>
              {step.title}
            </h3>
            <p className={`text-sm font-medium leading-relaxed ${step.textColor} opacity-70`}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link to="/register"
          className="inline-flex items-center gap-4 bg-[#2A1650] text-white px-12 py-6 rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-[#3F2171] transition-all shadow-2xl border-b-4 border-black/30 active:translate-y-1 active:border-b-0">
          Enrol Your Child Now
          <span className="text-[#FFFF00]">→</span>
        </Link>
        <p className="text-gray-400 text-sm font-medium mt-4">Immediate access · No contract · Cancel anytime</p>
      </div>
    </div>
  </section>
);

export default HowItWorks;
