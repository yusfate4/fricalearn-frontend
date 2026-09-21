import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Layout from "../../components/Layout";
import { CheckCircle2, ArrowRight, Award, BookOpen, GraduationCap, ChevronLeft } from "lucide-react";

const LANGUAGE_COURSES = ["yoruba", "igbo", "hausa"];

// ── Pricing (always UK curriculum, currency = payment preference only) ──
const PRICES = {
  maths:   { ngn: 20000, gbp: 10 },
  english: { ngn: 20000, gbp: 10 },
  both:    { ngn: 30000, gbp: 15 }, // bundle — save ₦10k / £5
};

const COURSES = [
  {
    id: "maths", name: "Mathematics", type: "paid" as const,
    description: "4,000+ lessons from Year 1 to Year 11 · KS1–KS4 aligned · Quizzes included",
    icon: "🔢",
  },
  {
    id: "english", name: "English", type: "paid" as const,
    description: "Reading, writing, comprehension and literary analysis · Year 1 to Year 11",
    icon: "📖",
  },
  {
    id: "yoruba",  name: "Yoruba",  type: "free" as const, description: "Connect with Yoruba heritage through language and culture", icon: "🌍",
  },
  {
    id: "igbo",   name: "Igbo",    type: "free" as const, description: "Explore Igbo language and heritage", icon: "🌍",
  },
  {
    id: "hausa",  name: "Hausa",   type: "free" as const, description: "Learn Hausa language and cultural traditions", icon: "🌍",
  },
];

export default function Step1CourseSelection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [currency, setCurrency] = useState<"NGN" | "GBP">("NGN");

  const toggleCourse = (id: string) => {
    const isLang = LANGUAGE_COURSES.includes(id);
    setSelectedCourses(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (isLang) return [...prev.filter(x => !LANGUAGE_COURSES.includes(x)), id];
      return [...prev, id];
    });
  };

  const hasMaths   = selectedCourses.includes("maths");
  const hasEnglish = selectedCourses.includes("english");
  const hasBoth    = hasMaths && hasEnglish;
  const selectedLang = selectedCourses.find(id => LANGUAGE_COURSES.includes(id));
  const sym = currency === "NGN" ? "₦" : "£";

  // Price summary for bottom bar
  const paidCount = [hasMaths, hasEnglish].filter(Boolean).length;
  const subtotal = hasBoth
    ? PRICES.both[currency === "NGN" ? "ngn" : "gbp"]
    : paidCount === 1
    ? PRICES.maths[currency === "NGN" ? "ngn" : "gbp"]
    : 0;
  const afterTrial = subtotal > 0 ? `${sym}${subtotal.toLocaleString()} after free trial` : "";
  const saving = hasBoth
    ? (currency === "NGN" ? "Save ₦10,000" : "Save £5")
    : "";

  const handleContinue = () => {
    if (selectedCourses.length === 0) return;
    navigate("/onboarding/step2", {
      state: {
        selectedCourses, currency,
        curriculumRegion: "uk", // always UK (Oak) regardless of payment currency
      },
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-14 pb-36 animate-in fade-in duration-700">

        {/* Back */}
        <button onClick={() => navigate("/parent/dashboard")}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#3F2171] transition-colors mb-6">
          <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#3F2171]/10"><ChevronLeft size={18}/></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Step 1 of 4</p>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight">
              Choose <span className="text-[#3F2171]">Courses</span>
            </h1>
            <p className="text-gray-500 font-bold text-sm mt-2">
              Pick subjects — one language is always free. 1-month trial included.
            </p>
          </div>

          {/* Currency toggle — payment only, not curriculum */}
          <div className="flex flex-col items-start sm:items-end gap-1 w-full sm:w-auto">
            <div className="flex bg-gray-100 p-1 rounded-2xl w-full sm:w-auto">
              <button onClick={() => setCurrency("NGN")}
                className={`flex-1 sm:flex-none px-5 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all ${currency === "NGN" ? "bg-white text-[#3F2171] shadow" : "text-gray-400"}`}>
                🇳🇬 Pay in ₦
              </button>
              <button onClick={() => setCurrency("GBP")}
                className={`flex-1 sm:flex-none px-5 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all ${currency === "GBP" ? "bg-white text-[#3F2171] shadow" : "text-gray-400"}`}>
                🇬🇧 Pay in £
              </button>
            </div>
            <p className="text-[9px] text-gray-400 font-bold pl-1">
              🇬🇧 UK National Curriculum (Oak Academy) · All payment currencies
            </p>
          </div>
        </div>

        {/* Bundle savings notice */}
        {hasBoth && (
          <div className="mb-5 px-5 py-3.5 bg-[#FFFF00]/20 border-2 border-[#FFFF00] rounded-2xl flex items-center gap-3">
            <span className="text-lg">🎉</span>
            <p className="text-sm font-black text-[#2A1650]">
              Bundle discount applied! Both subjects = {sym}{PRICES.both[currency === "NGN" ? "ngn" : "gbp"].toLocaleString()} · {saving}
            </p>
          </div>
        )}

        {selectedLang && (
          <div className="mb-5 px-5 py-3.5 bg-[#3F2171]/10 border-2 border-[#3F2171]/30 rounded-2xl flex items-center gap-3">
            <Award size={16} className="text-[#3F2171] shrink-0"/>
            <p className="text-sm font-black text-gray-700">
              Free language: <span className="text-[#3F2171]">{selectedLang.charAt(0).toUpperCase() + selectedLang.slice(1)}</span>
              <span className="text-gray-400 font-normal text-xs ml-2">— select another to switch</span>
            </p>
          </div>
        )}

        {/* Course cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
          {COURSES.map(course => {
            const isSelected = selectedCourses.includes(course.id);
            const isLang     = LANGUAGE_COURSES.includes(course.id);
            const isPaid     = course.type === "paid";
            const isInBundle = hasBoth && isPaid;

            // Per-card price logic
            let priceDisplay: React.ReactNode;
            if (!isPaid) {
              priceDisplay = (
                <div className="text-center pt-5 border-t border-gray-100">
                  <p className="text-3xl font-black text-[#1A7A4A] italic">FREE</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-1">Full scholarship — always</p>
                </div>
              );
            } else if (isInBundle) {
              priceDisplay = (
                <div className="text-center pt-5 border-t border-gray-100">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">First Month</p>
                  <p className="text-3xl font-black text-[#1A7A4A] italic">FREE</p>
                  <p className="text-[9px] font-black text-[#3F2171] mt-1">Bundled — {sym}{PRICES.both[currency === "NGN" ? "ngn" : "gbp"].toLocaleString()} for both</p>
                </div>
              );
            } else {
              const p = PRICES[course.id as "maths" | "english"][currency === "NGN" ? "ngn" : "gbp"];
              priceDisplay = (
                <div className="text-center pt-5 border-t border-gray-100">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">First Month</p>
                  <p className="text-3xl font-black text-[#1A7A4A] italic">FREE</p>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">
                    Then {sym}{p.toLocaleString()} / 3 months
                  </p>
                </div>
              );
            }

            return (
              <div key={course.id} onClick={() => toggleCourse(course.id)}
                className={`relative bg-white rounded-[2rem] p-6 sm:p-8 border-4 cursor-pointer transition-all duration-300 ${
                  isSelected ? "border-[#3F2171] shadow-xl -translate-y-1" : "border-gray-100 hover:border-gray-200 shadow-sm"
                }`}>

                {isLang && (
                  <div className="absolute top-5 right-5 bg-[#3F2171] text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow">
                    <Award size={12} className="text-[#FFFF00]"/>
                    <span className="text-[8px] font-black uppercase tracking-widest">Free · Pick 1</span>
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-5 left-5 bg-[#3F2171] p-2 rounded-xl text-white shadow-lg">
                    <CheckCircle2 size={18}/>
                  </div>
                )}

                <div className="mb-5 flex justify-center">
                  <div className={`p-5 rounded-2xl ${isSelected ? "bg-[#3F2171]/10" : "bg-gray-50"} transition-colors`}>
                    {course.id === "maths"   ? <BookOpen size={36} className="text-blue-500"/>
                     : course.id === "english" ? <BookOpen size={36} className="text-purple-500"/>
                     : <GraduationCap size={36} className="text-[#3F2171]"/>}
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-gray-800 italic uppercase tracking-tighter mb-2 text-center">
                  {course.name}
                </h3>
                <p className="text-gray-400 text-xs font-medium leading-relaxed mb-5 text-center min-h-[2.5rem]">
                  {course.description}
                </p>

                {priceDisplay}
              </div>
            );
          })}
        </div>

        {/* Maths + English bundle hint */}
        {(hasMaths || hasEnglish) && !hasBoth && (
          <p className="text-center text-xs font-bold text-gray-400 mt-2">
            💡 Add both Maths & English to unlock the bundle price ({sym}{PRICES.both[currency === "NGN" ? "ngn" : "gbp"].toLocaleString()} instead of {sym}{(PRICES.maths[currency === "NGN" ? "ngn" : "gbp"] * 2).toLocaleString()})
          </p>
        )}

        {/* Fixed CTA */}
        {selectedCourses.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-gray-100 p-4 sm:p-6 z-[60] shadow-[0_-10px_30px_rgba(0,0,0,0.06)]">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {selectedCourses.length} course{selectedCourses.length !== 1 ? "s" : ""} selected
                </p>
                <p className="text-sm font-bold text-gray-700">
                  {selectedCourses.map(id => COURSES.find(c => c.id === id)?.name).join(", ")}
                </p>
                <p className="text-[9px] font-bold text-[#1A7A4A] mt-0.5">
                  🎁 First month free · No payment today{afterTrial ? ` · ${afterTrial}` : ""}
                  {saving ? ` · ${saving}` : ""}
                </p>
              </div>
              <button onClick={handleContinue}
                className="group flex items-center justify-center gap-3 bg-[#3F2171] text-white px-8 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-xl hover:bg-black transition-all border-b-4 border-[#1E1038] active:translate-y-1 active:border-b-0 w-full sm:w-auto">
                Continue to Grade Selection
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
