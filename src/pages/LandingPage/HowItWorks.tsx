import React from "react";
import { Link } from "react-router-dom";

const steps = [
  {
    num: "01",
    icon: "👤",
    title: "Parent registers free",
    desc: "Create an account in two minutes. No card, no payment, no commitment. The 1-month free trial starts immediately after you enrol your child.",
    color: "bg-[#FFFF00]",
    textColor: "text-[#2A1650]",
    subColor: "text-[#2A1650]/60",
  },
  {
    num: "02",
    icon: "📚",
    title: "Choose subjects and year group",
    desc: "Select Maths, English, or both. Choose your child's year group — Year 1 to Year 11. Heritage languages (Yoruba, Igbo, Hausa) are added free, one per enrolment.",
    color: "bg-[#3F2171]",
    textColor: "text-white",
    subColor: "text-white/60",
  },
  {
    num: "03",
    icon: "🚀",
    title: "Child starts learning today",
    desc: "4,788 curriculum-aligned lessons, instant quizzes, the Olukọ AI Tutor, and a leaderboard — all accessible from day one. Progress tracked automatically.",
    color: "bg-[#2A1650]",
    textColor: "text-white",
    subColor: "text-white/60",
  },
];

const HowItWorks: React.FC = () => (
  <section id="how-it-works" className="py-28 bg-gray-50 overflow-hidden">
    <div className="container mx-auto px-6">

      {/* Header */}
      <div className="max-w-2xl mb-20">
        <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-[#2A1650] leading-none mb-6">
          From sign-up<br/>
          <span className="text-[#3F2171]">to lesson in 5 minutes.</span>
        </h2>
        <p className="text-gray-500 text-lg leading-relaxed">
          No school login. No teacher to contact. A parent creates an account, 
          picks the child's subjects and year group, and the full curriculum 
          loads immediately.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {steps.map(step => (
          <div key={step.num}
            className={`${step.color} rounded-[2.5rem] p-10 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500`}>
            <div className="absolute top-6 right-8 text-7xl font-black opacity-10 leading-none select-none">{step.num}</div>
            <div className="text-4xl mb-6">{step.icon}</div>
            <h3 className={`text-2xl font-black uppercase italic tracking-tight mb-4 ${step.textColor}`}>
              {step.title}
            </h3>
            <p className={`text-sm font-medium leading-relaxed ${step.subColor}`}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Features strip */}
      <div className="bg-[#3F2171] rounded-[2.5rem] p-8 md:p-10 mb-16">
        <p className="text-[#FFFF00] font-black text-[10px] uppercase tracking-[0.3em] mb-6 text-center">What's included from day one</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon:"📖", label:"4,788 Lessons" },
            { icon:"🧠", label:"Instant quizzes" },
            { icon:"🤖", label:"AI Tutor 24/7" },
            { icon:"🏆", label:"Leaderboard" },
            { icon:"📊", label:"Monthly reports" },
            { icon:"🌍", label:"Free languages" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">{icon}</div>
              <p className="text-white/70 font-bold text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link to="/register"
          className="inline-flex items-center gap-4 bg-[#2A1650] text-white px-12 py-6 rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-[#3F2171] transition-all shadow-2xl border-b-4 border-black/30 active:translate-y-1 active:border-b-0">
          Enrol Your Child — Free
          <span className="text-[#FFFF00]">→</span>
        </Link>
        <p className="text-gray-400 text-sm font-medium mt-4">1 month free · No card required · Cancel anytime</p>
      </div>
    </div>
  </section>
);

export default HowItWorks;
