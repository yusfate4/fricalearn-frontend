import React, { useState } from "react";
import api from "../../api/axios";
import {
  Sparkles,
  Target,
  Rocket,
  ChevronRight,
  Loader2,
  PartyPopper,
  Zap,
} from "lucide-react";

export default function OnboardingModal({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finishOnboarding = async (level: string) => {
    setIsSubmitting(true);
    try {
      // ✅ Fix: Assign the result to 'const response'
      const response = await api.post("/student/complete-onboarding", {
        goal,
        level,
      });

      console.log("Server Response:", response.data);
      setStep(3);
    } catch (err) {
      console.error("Onboarding Sync Error:", err);
      alert("Oops! The Tribe couldn't hear you. Check your internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#2D5A27] flex items-center justify-center p-6 text-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />

      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500 relative z-10">
        {/* STEP 1: GOAL SELECTION */}
        {step === 1 && (
          <>
            <div className="bg-yellow-400 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl rotate-3">
              <Sparkles size={48} className="text-[#2D5A27]" />
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">
              Ẹ káàbọ̀!
            </h1>
            <p className="text-white/80 font-bold uppercase tracking-widest text-xs px-10">
              Welcome to the Tribe. What is your goal?
            </p>
            <div className="grid grid-cols-1 gap-3">
              {[
                "Speak with Family",
                "Connect with Culture",
                "Travel to Nigeria",
              ].map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setGoal(g);
                    setStep(2);
                  }}
                  className="group flex items-center justify-between px-6 py-5 bg-white/10 border-2 border-white/5 rounded-2xl font-black hover:bg-white hover:text-[#2D5A27] transition-all uppercase italic"
                >
                  <span>{g}</span>
                  <ChevronRight
                    size={18}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP 2: LEVEL SELECTION */}
        {step === 2 && (
          <>
            <div className="bg-white w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl -rotate-3">
              <Rocket size={48} className="text-[#2D5A27]" />
            </div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">
              Your Level?
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <button
                disabled={isSubmitting}
                onClick={() => finishOnboarding("beginner")}
                className="p-6 bg-white/10 rounded-[2rem] border-2 border-white/5 hover:border-yellow-400 group transition-all text-left disabled:opacity-50"
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-black uppercase italic text-yellow-400 text-lg">
                    Beginner
                  </p>
                  {isSubmitting && (
                    <Loader2 size={16} className="animate-spin text-white/40" />
                  )}
                </div>
                <p className="text-xs text-white/60 font-medium">
                  I know zero or very few Yoruba words. Starting from the
                  basics!
                </p>
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => finishOnboarding("intermediate")}
                className="p-6 bg-white/10 rounded-[2rem] border-2 border-white/5 hover:border-yellow-400 group transition-all text-left disabled:opacity-50"
              >
                <p className="font-black uppercase italic text-yellow-400 text-lg mb-1">
                  Intermediate
                </p>
                <p className="text-xs text-white/60 font-medium">
                  I understand basics but can't converse yet. I want to build
                  fluency.
                </p>
              </button>
            </div>
          </>
        )}

        {/* STEP 3: SUCCESS CELEBRATION */}
        {step === 3 && (
          <div className="animate-in zoom-in fade-in duration-700">
            <div className="bg-white w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl mb-6">
              <PartyPopper size={48} className="text-[#2D5A27]" />
            </div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-2">
              You're Ready!
            </h2>
            <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] mb-8 italic">
              Welcome to the family
            </p>

            <div className="bg-yellow-400 rounded-3xl p-6 text-[#2D5A27] mb-10 transform rotate-2 shadow-xl">
              <div className="flex items-center justify-center gap-3">
                <Zap size={32} fill="currentColor" />
                <span className="text-4xl font-black italic tracking-tighter">
                  +50 XP
                </span>
              </div>
              <p className="font-black uppercase text-[10px] tracking-widest mt-1 opacity-70">
                Onboarding Bonus Awarded!
              </p>
            </div>

            <button
              onClick={() => {
                // 🚀 Force a clean slate. This is the ultimate fix for "State Loops"
                window.location.reload();
              }}
              className="w-full py-6 bg-white text-[#2D5A27] rounded-[2.5rem] font-black text-2xl hover:bg-black hover:text-white transition-all shadow-2xl uppercase italic tracking-tight"
            >
              Let's Start!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
