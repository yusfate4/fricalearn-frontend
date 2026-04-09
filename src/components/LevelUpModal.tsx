import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Award, Zap, X, Trophy, Star } from "lucide-react";

interface LevelUpProps {
  level: number;
  isOpen: boolean;
  onClose: () => void;
  studentName?: string; // 👈 Fixed: Personalized name
  language?: string;    // 👈 Fixed: Language-specific praise
}

/**
 * 🌍 PRAISE MAP (Item 5)
 */
const praiseMap: Record<string, string> = {
  Yoruba: "Ẹ kú iṣẹ́! Your Yoruba skills are reaching new heights!",
  Igbo: "Dalu olu! Your Igbo journey is looking amazing!",
  Hausa: "Barka da ƙoƙari! You are mastering Hausa fast!",
  English: "Incredible! Your heritage skills are growing!",
};

export default function LevelUpModal({ 
  level, 
  isOpen, 
  onClose, 
  studentName = "Explorer",
  language = "Yoruba" 
}: LevelUpProps) {
  
  if (!isOpen) return null;

  // 🏆 Updated Ranks with correct Olụkọ branding (Item 7)
  const getRank = (lvl: number) => {
    if (lvl < 5) return "Akẹ́kọ̀ọ́ (Student)";
    if (lvl < 10) return "Jagunjagun (Warrior)";
    if (lvl < 20) return "Agbà (Elder)";
    return "Olukọ (Master Teacher)";
  };

  const triggerConfetti = () => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 45,
      spread: 360,
      ticks: 100,
      zIndex: 200,
      gravity: 1,
    };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 70 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.1 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.1 },
      });
    }, 250);
  };

  useEffect(() => {
    if (isOpen) {
      triggerConfetti();
      // 🔊 Pre-loaded sound check
      const audio = new Audio("/sounds/level-up.mp3");
      audio.volume = 0.5;
      audio.play().catch((err) => console.log("Sound blocked by browser", err));
    }
  }, [isOpen]);

  const praiseText = praiseMap[language] || praiseMap.Yoruba;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2D5A27]/80 backdrop-blur-xl p-4 animate-in fade-in duration-500">
      
      {/* Sunburst Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-40 bg-yellow-400 rotate-45 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-40 bg-yellow-400 -rotate-45 blur-3xl"></div>
      </div>

      <div className="bg-white rounded-[4rem] p-10 md:p-14 max-w-md w-full text-center shadow-[0_0_100px_rgba(244,180,0,0.3)] border-8 border-white animate-in zoom-in-90 duration-500 relative">
        {/* Decorative corner stars */}
        <Star className="absolute top-10 left-10 text-yellow-400 animate-pulse" size={24} fill="currentColor" />
        <Star className="absolute bottom-40 right-10 text-yellow-400 animate-pulse" size={20} fill="currentColor" />

        <div className="w-24 h-24 bg-yellow-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-yellow-600 shadow-xl border-4 border-white rotate-12 animate-bounce">
          <Trophy size={48} />
        </div>

        <p className="text-[#2D5A27] font-black uppercase tracking-[0.4em] text-[10px] mb-3">
          Level Mastered!
        </p>

        <h2 className="text-6xl md:text-7xl font-black text-gray-800 italic uppercase tracking-tighter mb-4 leading-none">
          LVL <span className="text-[#F4B400]">{level}</span>
        </h2>

        {/* 📝 Personalized Text (Item 5) */}
        <p className="text-gray-400 font-bold text-sm mb-10 leading-relaxed px-6 italic">
          "{praiseText.replace("!", `, ${studentName}!`)}"
        </p>

        <div className="bg-gray-50 p-6 rounded-[2.5rem] mb-10 flex items-center gap-5 text-left border-2 border-gray-100 shadow-inner relative group">
          <div className="bg-[#2D5A27] p-4 rounded-2xl text-white shadow-lg group-hover:rotate-12 transition-transform">
            <Award size={32} />
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
              New Status Attained
            </p>
            <p className="font-black text-[#2D5A27] uppercase italic text-2xl tracking-tighter">
              {getRank(level)}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-900 text-white py-7 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-[#2D5A27] hover:scale-105 active:scale-95 transition-all uppercase italic tracking-tighter group flex items-center justify-center gap-3"
        >
          Keep Climbing, Champion!
        </button>
      </div>
    </div>
  );
}