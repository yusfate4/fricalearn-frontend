import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<"NGN" | "GBP">("NGN");

  const plans = [
    {
      months: 3,
      label: "3 Months",
      ngn: "₦30,000",
      gbp: "£15",
      perMonthNGN: "₦10,000/mo",
      perMonthGBP: "£5/mo",
      save: null,
      popular: false,
      dark: false,
    },
    {
      months: 6,
      label: "6 Months",
      ngn: "₦50,000",
      gbp: "£25",
      perMonthNGN: "₦8,333/mo",
      perMonthGBP: "£4.17/mo",
      save: "17%",
      popular: false,
      dark: true,
    },
    {
      months: 12,
      label: "12 Months",
      ngn: "₦80,000",
      gbp: "£40",
      perMonthNGN: "₦6,667/mo",
      perMonthGBP: "£3.33/mo",
      save: "33%",
      popular: true,
      dark: false,
    },
  ];

  const features = [
    "Maths — 4,000+ lessons, KS1 to KS4",
    "English — 700+ lessons, KS1 to KS4",
    "AI Tutor — all subjects, 24/7",
    "Quizzes with instant explanations",
    "Monthly progress report to parent",
    "Weekly activity email summary",
    "Leaderboard and gamification",
    "Heritage language — included free",
  ];

  return (
    <section className="py-28 bg-white" id="pricing">
      <div className="container mx-auto px-6">

        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-[#2A1650] leading-none mb-6">
            Start free.<br/>
            <span className="text-[#3F2171]">Pay when ready.</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Every family gets a full <strong className="text-[#2A1650]">1-month free trial</strong> — 
            complete access to every lesson, quiz, and the AI Tutor. 
            No card required. After the trial, choose any paid plan below.
          </p>
        </div>

        {/* Free trial callout */}
        <div className="bg-[#2A1650] rounded-[2.5rem] p-8 md:p-10 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFFF00] animate-pulse"/>
              <p className="text-[#FFFF00] font-black text-xs uppercase tracking-widest">First month — always free</p>
            </div>
            <h3 className="text-white font-black text-2xl mb-2">1-Month Free Trial</h3>
            <p className="text-white/50 text-sm max-w-lg">
              Full access to Maths and English — every lesson, every quiz, the AI Tutor, 
              and your parent dashboard. No card taken. You decide whether to continue after 30 days.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate("/register")}
              className="bg-[#FFFF00] text-[#2A1650] font-black text-sm px-8 py-5 rounded-2xl uppercase tracking-widest hover:bg-white transition-all whitespace-nowrap">
              Start Free Trial →
            </button>
          </div>
        </div>

        {/* Currency toggle */}
        <div className="flex items-center gap-3 mb-8">
          <p className="text-gray-500 text-sm font-bold">Pay in:</p>
          {(["NGN","GBP"] as const).map(c => (
            <button key={c} onClick={() => setCurrency(c)}
              className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all ${
                currency===c ? "bg-[#3F2171] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}>
              {c==="NGN" ? "🇳🇬 Naira" : "🇬🇧 Pounds"}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {plans.map(plan => {
            const price  = currency==="NGN" ? plan.ngn : plan.gbp;
            const perMo  = currency==="NGN" ? plan.perMonthNGN : plan.perMonthGBP;
            const bg     = plan.popular ? "bg-[#FFFF00]" : plan.dark ? "bg-[#2A1650]" : "bg-[#F3EFFA]";
            const head   = plan.popular ? "text-[#2A1650]" : plan.dark ? "text-white" : "text-[#2A1650]";
            const sub    = plan.popular ? "text-[#2A1650]/60" : plan.dark ? "text-white/50" : "text-gray-500";
            const feat   = plan.popular ? "text-[#2A1650]" : plan.dark ? "text-white/80" : "text-gray-600";
            const check  = plan.popular ? "bg-[#2A1650] text-[#FFFF00]" : "bg-[#3F2171] text-[#FFFF00]";
            const cta    = plan.popular
              ? "bg-[#2A1650] text-white hover:bg-[#3F2171]"
              : plan.dark
              ? "bg-[#FFFF00] text-[#2A1650] hover:bg-white"
              : "bg-[#3F2171] text-white hover:bg-[#2A1650]";

            return (
              <div key={plan.months} className={`${bg} rounded-[2.5rem] p-8 relative`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3F2171] text-white text-[9px] font-black uppercase tracking-widest px-5 py-2 rounded-full whitespace-nowrap">
                    Best value
                  </div>
                )}

                <p className={`text-[9px] font-black uppercase tracking-[0.3em] mb-4 ${sub}`}>{plan.label}</p>
                <p className={`text-4xl font-black mb-1 ${head}`}>{price}</p>
                <div className="flex items-center gap-3 mb-6">
                  <p className={`text-sm ${sub}`}>{perMo}</p>
                  {plan.save && (
                    <span className={`text-[9px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full ${plan.popular ? "bg-[#3F2171] text-white" : "bg-[#FFFF00] text-[#2A1650]"}`}>
                      Save {plan.save}
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 mb-8">
                  {features.map(f => (
                    <div key={f} className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[8px] font-black ${check}`}>✓</div>
                      <span className={`text-xs leading-relaxed ${feat}`}>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/register")}
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${cta}`}>
                  Start free trial
                </button>
              </div>
            );
          })}
        </div>

        {/* Heritage languages callout */}
        <div className="bg-gray-50 border-2 border-gray-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-green-600 font-black text-xs uppercase tracking-widest mb-2">Heritage languages — always free</p>
            <h3 className="text-[#2A1650] font-black text-xl mb-1">Yoruba · Igbo · Hausa</h3>
            <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
              Included with every account at no cost — funded by academic subscriptions. 
              Because preserving who you are should never depend on what you can afford.
            </p>
          </div>
          <div className="flex-shrink-0 bg-[#3F2171] text-[#FFFF00] px-8 py-5 rounded-2xl font-black text-2xl">
            ₦0 · £0
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
