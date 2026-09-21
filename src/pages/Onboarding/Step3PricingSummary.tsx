import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import { ArrowRight, ChevronLeft, CheckCircle2, Star, Gift } from "lucide-react";

interface Tier {
  months: number;
  label: string;
  priceNGN: number;
  priceGBP: number;
  savingsPct: number | null;
  popular: boolean;
  days: number;
  perMonthNGN: number;
  perMonthGBP: number;
}

// Pricing matrix — drives everything dynamically
const PRICING = {
  // Single subject (maths only OR english only)
  single: {
    base3:  { ngn: 20000, gbp: 10 },
    base6:  { ngn: 35000, gbp: 17 },
    base12: { ngn: 55000, gbp: 27 },
  },
  // Both subjects (bundle — save ₦10k vs paying single twice)
  bundle: {
    base3:  { ngn: 30000, gbp: 15 },
    base6:  { ngn: 50000, gbp: 25 },
    base12: { ngn: 80000, gbp: 40 },
  },
};

// Build tier array dynamically based on whether it's single or bundle
function buildTiers(isBoth: boolean): Tier[] {
  const p = isBoth ? PRICING.bundle : PRICING.single;
  const base3NGN = p.base3.ngn;

  return [
    {
      months: 3,  label: "3 Months",  days: 90,
      priceNGN: p.base3.ngn,  priceGBP: p.base3.gbp,
      perMonthNGN: Math.round(p.base3.ngn / 3),
      perMonthGBP: Math.round((p.base3.gbp / 3) * 100) / 100,
      savingsPct: null, popular: false,
    },
    {
      months: 6,  label: "6 Months",  days: 180,
      priceNGN: p.base6.ngn,  priceGBP: p.base6.gbp,
      perMonthNGN: Math.round(p.base6.ngn / 6),
      perMonthGBP: Math.round((p.base6.gbp / 6) * 100) / 100,
      savingsPct: Math.round((1 - p.base6.ngn / (base3NGN * 2)) * 100),
      popular: false,
    },
    {
      months: 12, label: "12 Months", days: 365,
      priceNGN: p.base12.ngn, priceGBP: p.base12.gbp,
      perMonthNGN: Math.round(p.base12.ngn / 12),
      perMonthGBP: Math.round((p.base12.gbp / 12) * 100) / 100,
      savingsPct: Math.round((1 - p.base12.ngn / (base3NGN * 4)) * 100),
      popular: true,
    },
  ];
}

export default function Step3PricingSummary() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const {
    selectedCourses = [],
    currency = "NGN",
    curriculumRegion,
    mathsGrade,
    englishGrade,
  } = location.state || {};

  const isNGN     = currency === "NGN";
  const hasMaths  = selectedCourses.includes("maths");
  const hasEng    = selectedCourses.includes("english");
  const hasBoth   = hasMaths && hasEng;
  const hasPaid   = hasMaths || hasEng;
  const freeOnly  = !hasPaid;

  // What subjects are paid — shown in labels
  const subjectLabel = hasBoth
    ? "Maths + English"
    : hasMaths
    ? "Maths only"
    : hasEng
    ? "English only"
    : "";

  const tiers = useMemo(() => buildTiers(hasBoth), [hasBoth]);
  const [selected, setSelected] = useState<Tier>(tiers[2]);

  const sym      = isNGN ? "₦" : "£";
  const fmt      = (n: number) => `${sym}${isNGN ? n.toLocaleString() : n}`;
  const price    = (t: Tier) => isNGN ? t.priceNGN : t.priceGBP;
  const perMonth = (t: Tier) => isNGN
    ? `${sym}${t.perMonthNGN.toLocaleString()}/mo`
    : `${sym}${t.perMonthGBP}/mo`;

  // Savings note at the bottom
  const savingsNote = hasBoth
    ? `Savings vs paying 3-month rate twice · ${subjectLabel} included`
    : `Savings vs paying 3-month rate repeatedly · ${subjectLabel}`;

  const handleContinue = () => {
    navigate("/onboarding/step4", {
      state: {
        selectedCourses, currency, curriculumRegion,
        mathsGrade, englishGrade,
        total: price(selected),
        subscriptionMonths: selected.months,
        subscriptionDays: selected.days,
        tierLabel: selected.label,
      },
    });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-14 pb-40">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#3F2171] transition-colors mb-8">
          <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#3F2171]/10">
            <ChevronLeft size={20}/>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Step 3 of 4</p>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight mb-3">
            Choose Your <span className="text-[#3F2171]">Plan</span>
          </h1>
          <p className="text-gray-500 font-bold text-sm max-w-xl">
            After your free 1-month trial, continue with any plan below.
            Longer plans cost less per month.
          </p>

          {/* Subject summary pill */}
          {hasPaid && (
            <div className="mt-4 inline-flex items-center gap-2 bg-[#3F2171]/10 rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-[#3F2171]"/>
              <span className="text-[#3F2171] font-black text-xs uppercase tracking-wide">
                {subjectLabel}
                {hasBoth && <span className="text-[#3F2171]/60 font-bold"> · Bundle price applied</span>}
              </span>
            </div>
          )}
        </div>

        {/* Free trial banner */}
        {hasPaid && (
          <div className="bg-[#3F2171]/10 border-2 border-[#3F2171]/20 rounded-[1.5rem] p-5 mb-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#3F2171] rounded-2xl flex items-center justify-center shrink-0">
              <Gift size={22} className="text-[#FFFF00]"/>
            </div>
            <div>
              <p className="font-black text-[#3F2171] uppercase tracking-tight text-sm">🎁 First Month is Free</p>
              <p className="text-gray-500 font-bold text-xs mt-0.5">
                No payment today. Your chosen plan starts after the 1-month free trial ends.
              </p>
            </div>
          </div>
        )}

        {/* Free-only path */}
        {freeOnly ? (
          <div className="bg-[#3F2171]/10 rounded-[2rem] p-8 text-center mb-8">
            <p className="text-3xl font-black text-[#3F2171] italic mb-2">FREE</p>
            <p className="text-gray-600 font-bold text-sm">
              Your language course is completely free — no plan needed.
            </p>
          </div>
        ) : (
          <>
            {/* Tier cards */}
            <div className="space-y-4 mb-6">
              {tiers.map(tier => {
                const isSelected = selected.months === tier.months;
                return (
                  <button key={tier.months} onClick={() => setSelected(tier)}
                    className={`w-full text-left rounded-[2rem] border-2 p-5 sm:p-6 transition-all duration-200 relative ${
                      isSelected
                        ? "border-[#3F2171] bg-[#3F2171]/5 shadow-lg"
                        : "border-gray-100 bg-white hover:border-[#3F2171]/40"
                    }`}>

                    {tier.popular && (
                      <span className="absolute -top-4 left-6 bg-[#3F2171] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1">
                        <Star size={10} fill="white"/> Best Value
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-[#3F2171] bg-[#3F2171]" : "border-gray-300"
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white"/>}
                        </div>
                        <div>
                          <p className="font-black text-base sm:text-lg text-gray-800 uppercase italic tracking-tight">
                            {tier.label}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                            {perMonth(tier)} · {tier.days} days · {subjectLabel}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xl sm:text-2xl font-black text-gray-800 italic">
                          {fmt(price(tier))}
                        </p>
                        {tier.savingsPct && tier.savingsPct > 0 && (
                          <span className="inline-block bg-[#FFFF00] text-[#2A1650] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mt-1">
                            Save {tier.savingsPct}%
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bundle upsell — only when single subject selected */}
            {!hasBoth && hasPaid && (
              <div className="bg-[#FFFF00]/20 border-2 border-[#FFFF00] rounded-2xl p-4 mb-6 flex items-center gap-3">
                <span className="text-xl shrink-0">💡</span>
                <p className="text-sm font-bold text-[#2A1650]">
                  Add <strong>{hasMaths ? "English" : "Maths"}</strong> to get both subjects for{" "}
                  <strong>
                    {sym}{isNGN
                      ? PRICING.bundle.base3.ngn.toLocaleString()
                      : PRICING.bundle.base3.gbp} / 3 months
                  </strong>{" "}
                  instead of{" "}
                  <strong>
                    {sym}{isNGN
                      ? (PRICING.single.base3.ngn * 2).toLocaleString()
                      : PRICING.single.base3.gbp * 2}
                  </strong>.{" "}
                  <button
                    onClick={() => navigate(-1)}
                    className="underline text-[#3F2171] font-black">
                    Go back to add it
                  </button>
                </p>
              </div>
            )}

            {/* Savings note */}
            <p className="text-center text-[11px] font-bold text-gray-400 mb-6">
              {savingsNote}
            </p>
          </>
        )}

        {/* What's included */}
        <div className="bg-gradient-to-br from-[#3F2171] to-[#2A1650] rounded-[2.5rem] p-6 sm:p-8 mb-6">
          <h3 className="text-sm font-black italic uppercase tracking-tight text-white mb-4">
            ✨ Every plan includes:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              hasBoth
                ? "Maths & English — all lessons and quizzes"
                : `${subjectLabel || "Your subject"} — all lessons and quizzes`,
              "AI Tutor available 24/7 (60 min/day)",
              "Monthly progress report to parent",
              "Weekly feedback emails",
              "Gamification — points, levels, rewards",
              "African heritage languages free forever",
            ].map(b => (
              <div key={b} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#FFFF00] shrink-0 mt-0.5"/>
                <p className="text-white/80 font-bold text-xs">{b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed footer CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-gray-100 p-4 sm:p-5 z-[60]">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            {!freeOnly && (
              <div className="min-w-0 text-center sm:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Selected Plan</p>
                <p className="font-black text-gray-800 text-sm truncate">
                  {selected.label} · {subjectLabel} — {fmt(price(selected))}
                  {selected.savingsPct && selected.savingsPct > 0
                    ? ` (Save ${selected.savingsPct}%)`
                    : ""}
                </p>
              </div>
            )}
            <button onClick={handleContinue}
              className="shrink-0 group flex items-center justify-center gap-3 bg-[#3F2171] text-white px-6 sm:px-8 py-4 sm:py-5 rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-black transition-all border-b-4 border-[#1E1038] active:translate-y-1 active:border-b-0 w-full sm:w-auto">
              Continue — Start Free Trial
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
