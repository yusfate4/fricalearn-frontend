import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaRobot } from "react-icons/fa";

const Courses: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      flag: "🇬🇧",
      title: "UK National Curriculum",
      subtitle: "Year 1 – Year 11 (Ages 5–16)",
      trial: "14-Day Free Trial",
      price: "£13.33",
      priceNote: "/mo per subject after trial",
      features: [
        "Mathematics & English",
        "3,000+ lessons with quizzes",
        "Key Stage 1–4 aligned",
        "Progress tracking & reports",
      ],
      cta: "Start Free Trial",
      dark: false,
      popular: false,
    },
    {
      flag: "🇳🇬",
      title: "Nigerian Curriculum",
      subtitle: "Primary 1–6 & JSS 1–3 (Ages 6–15)",
      trial: "14-Day Free Trial",
      price: "₦20,000",
      priceNote: "/mo per subject after trial",
      features: [
        "Mathematics & English",
        "Lessons with quizzes",
        "Primary & Junior Secondary",
        "Progress tracking & reports",
      ],
      cta: "Start Free Trial",
      dark: true,
      popular: true,
    },
    {
      flag: "🌍",
      title: "Heritage Languages",
      subtitle: "Yoruba · Igbo · Hausa",
      trial: "Free Forever",
      price: "FREE",
      priceNote: "full scholarship — no trial needed",
      features: [
        "One language per enrolment",
        "Native cultural context",
        "Pronunciation practice",
        "AI Tutor support included",
      ],
      cta: "Claim Free Access",
      dark: false,
      popular: false,
    },
  ];

  return (
    <section className="py-28 bg-gray-50" id="courses">
      <div className="container mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10 bg-[#3F2171]"/>
            <span className="text-[#3F2171] font-black text-[10px] uppercase tracking-[0.4em]">Our Courses</span>
            <span className="h-px w-10 bg-[#3F2171]"/>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-[#2A1650] leading-none mb-4">
            Try First. <span className="text-[#3F2171]">Pay Later.</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            Every family gets <strong className="text-[#2A1650]">14 days of Maths &amp; English completely free</strong> —
            no card, no payment, no commitment. Language courses are free forever.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card) => (
            <div key={card.title}
              className={`relative rounded-[3rem] p-10 flex flex-col transition-all duration-500 hover:-translate-y-3 ${
                card.dark
                  ? "bg-[#2A1650] text-white shadow-2xl"
                  : "bg-white text-[#2A1650] shadow-sm border-2 border-gray-100 hover:shadow-2xl"
              }`}>

              {card.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FFFF00] text-[#2A1650] text-[9px] font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-lg">
                  Most Popular
                </span>
              )}

              <span className="text-5xl mb-5 block">{card.flag}</span>
              <h3 className="text-xl font-black uppercase italic tracking-tight leading-tight mb-1">
                {card.title}
              </h3>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-6 ${card.dark ? "text-white/40" : "text-gray-400"}`}>
                {card.subtitle}
              </p>

              {/* 🎁 Trial ribbon */}
              <div className={`rounded-2xl px-5 py-3 mb-5 text-center ${
                card.dark ? "bg-[#FFFF00] text-[#2A1650]" : "bg-[#3F2171]/10 text-[#3F2171]"
              }`}>
                <p className="font-black text-sm uppercase italic tracking-tight">🎁 {card.trial}</p>
              </div>

              {/* Price after trial */}
              <div className="mb-8">
                <p className={`text-3xl font-black italic ${card.dark ? "text-white" : "text-[#2A1650]"}`}>
                  {card.price}
                  <span className={`text-xs font-bold not-italic ${card.dark ? "text-white/40" : "text-gray-400"}`}>
                    {" "}{card.priceNote}
                  </span>
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-10 flex-1">
                {card.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className={`mt-1 shrink-0 ${card.dark ? "text-[#FFFF00]" : "text-[#3F2171]"}`}>
                      <FaCheck size={12}/>
                    </span>
                    <span className={`text-sm font-bold ${card.dark ? "text-white/70" : "text-gray-600"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <button onClick={() => navigate("/register")}
                className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border-b-4 active:translate-y-1 active:border-b-0 ${
                  card.dark
                    ? "bg-[#FFFF00] text-[#2A1650] border-yellow-600 hover:bg-yellow-400"
                    : "bg-[#3F2171] text-white border-[#1E1038] hover:bg-black"
                }`}>
                {card.cta}
              </button>
            </div>
          ))}
        </div>

        {/* AI Tutor banner */}
        <div className="mt-16 max-w-6xl mx-auto bg-[#2A1650] rounded-[3rem] p-10 md:p-14 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle,#FFFF00,transparent)", transform: "translate(30%,-30%)" }}/>
          <div className="w-20 h-20 bg-[#3F2171] rounded-3xl flex items-center justify-center shrink-0 relative z-10">
            <FaRobot size={36} className="text-[#FFFF00]"/>
          </div>
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
              AI Tutor — Included In Your Free Trial
            </h3>
            <p className="text-white/60 font-medium text-sm md:text-base leading-relaxed max-w-2xl">
              Every student gets a personal AI study companion for Maths, English, Yoruba, Igbo, and Hausa —
              available 24/7 to explain, encourage, and keep learning on track. Yes, even during the free trial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
