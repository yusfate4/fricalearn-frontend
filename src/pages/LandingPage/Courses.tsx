import React from "react";
import { Link } from "react-router-dom";

const Courses: React.FC = () => {
  return (
    <section className="py-28 bg-white overflow-hidden" id="courses">
      <div className="container mx-auto px-6">

        {/* ── Header ── */}
        <div className="max-w-3xl mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[#2D5A27]" />
            <span className="text-[#2D5A27] font-black text-[10px] uppercase tracking-[0.4em]">
              What We Offer
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-[#0E1C0E] uppercase italic tracking-tighter leading-none mb-6">
            One Platform.<br />
            <span className="text-[#2D5A27]">Every Curriculum.</span>
          </h2>
          <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-2xl">
            Whether your child is in London or Lagos, FricaLearn delivers the exact curriculum they need —
            with quizzes, progress tracking, and an AI tutor that never sleeps.
          </p>
        </div>

        {/* ── 3 Curriculum Cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">

          {/* Card 1: UK Curriculum */}
          <div className="relative bg-[#0E1C0E] text-white rounded-[2.5rem] p-10 flex flex-col overflow-hidden group hover:-translate-y-2 transition-all duration-500 shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #2D5A27, transparent)", transform: "translate(30%, -30%)" }} />

            <div className="flex items-center justify-between mb-8">
              <span className="text-5xl">🇬🇧</span>
              <span className="bg-[#2D5A27] text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
                Oak Academy
              </span>
            </div>

            <h3 className="text-3xl font-black uppercase italic tracking-tight mb-3">
              UK National Curriculum
            </h3>
            <p className="text-white/60 font-medium text-sm leading-relaxed mb-8">
              Government-backed lessons from Oak National Academy. Key Stages 1–4, aligned to the English National Curriculum.
            </p>

            <div className="space-y-3 mb-8">
              {["Year 1 – Year 11 (Ages 5–16)", "Mathematics & English", "3,000+ lessons with quizzes", "Progress tracking & reports"].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-lg bg-[#2D5A27] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/70 text-sm font-medium">{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <p className="text-[#F4B400] font-black text-[10px] uppercase tracking-widest mb-2">Payment</p>
              <p className="text-2xl font-black text-white mb-6">£13.33 <span className="text-white/40 text-sm font-medium">/ month per subject</span></p>
              <Link to="/register"
                className="block text-center bg-[#2D5A27] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#F4B400] hover:text-black transition-all">
                Enrol in Pounds £
              </Link>
            </div>
          </div>

          {/* Card 2: Nigerian Curriculum — featured */}
          <div className="relative bg-[#2D5A27] text-white rounded-[2.5rem] p-10 flex flex-col overflow-hidden lg:-mt-4 lg:mb-[-16px] group hover:-translate-y-2 transition-all duration-500 shadow-2xl">
            <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-[#F4B400] text-[#0E1C0E] px-6 py-1.5 rounded-b-2xl">
              <span className="font-black text-[9px] uppercase tracking-widest">Most Popular</span>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #F4B400, transparent)", transform: "translate(30%, -30%)" }} />

            <div className="flex items-center justify-between mb-8 mt-4">
              <span className="text-5xl">🇳🇬</span>
              <span className="bg-white/20 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
                NERDC
              </span>
            </div>

            <h3 className="text-3xl font-black uppercase italic tracking-tight mb-3">
              Nigerian Curriculum
            </h3>
            <p className="text-white/70 font-medium text-sm leading-relaxed mb-8">
              Fully aligned to Nigeria's NERDC curriculum. From Primary 1 through JSS 3, covering all core subjects.
            </p>

            <div className="space-y-3 mb-8">
              {["Primary 1–6 & JSS 1–3 (Ages 6–15)", "Mathematics & English", "Custom lessons with quizzes", "Progress tracking & reports"].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-lg bg-[#F4B400] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#0E1C0E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm font-medium">{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <p className="text-[#F4B400] font-black text-[10px] uppercase tracking-widest mb-2">Payment</p>
              <p className="text-2xl font-black text-white mb-6">₦20,000 <span className="text-white/40 text-sm font-medium">/ month per subject</span></p>
              <Link to="/register"
                className="block text-center bg-[#F4B400] text-[#0E1C0E] py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all">
                Enrol in Naira ₦
              </Link>
            </div>
          </div>

          {/* Card 3: African Languages */}
          <div className="relative bg-gray-50 border-2 border-gray-100 text-[#0E1C0E] rounded-[2.5rem] p-10 flex flex-col overflow-hidden group hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <span className="text-5xl">🌍</span>
              <span className="bg-[#F4B400] text-[#0E1C0E] px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
                Free Scholarship
              </span>
            </div>

            <h3 className="text-3xl font-black uppercase italic tracking-tight mb-3 text-[#0E1C0E]">
              Heritage Languages
            </h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
              Yoruba, Igbo, and Hausa taught by native-speaking tutors. Culture, etiquette, and proverbs included.
            </p>

            <div className="space-y-3 mb-8">
              {["Yoruba — Beginner to Advanced", "Igbo — Heritage & Tones", "Hausa — Essentials", "Full scholarship available"].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-lg bg-[#0E1C0E] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-600 text-sm font-medium">{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <p className="text-[#2D5A27] font-black text-[10px] uppercase tracking-widest mb-2">Scholarship Price</p>
              <p className="text-2xl font-black text-[#0E1C0E] mb-1">FREE <span className="text-gray-400 text-sm font-medium line-through">₦20,000/mo</span></p>
              <p className="text-gray-400 text-xs font-medium mb-6">Included with any curriculum plan</p>
              <Link to="/register"
                className="block text-center bg-[#0E1C0E] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#2D5A27] transition-all">
                Claim Scholarship
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom banner ── */}
        <div className="bg-[#0E1C0E] rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[#F4B400] font-black text-[10px] uppercase tracking-widest mb-3">Included with every plan</p>
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tight mb-2">
              Olụkọ AI Tutor — 24/7
            </h3>
            <p className="text-white/50 font-medium text-sm max-w-lg">
              Every student gets access to Olụkọ, our AI companion that answers questions, explains concepts,
              and keeps students motivated between live lessons.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-4">
            <div className="w-16 h-16 bg-[#2D5A27] rounded-2xl flex items-center justify-center text-3xl shadow-lg">🤖</div>
            <div className="w-16 h-16 bg-[#F4B400] rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-[#0E1C0E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-3xl">🏆</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
