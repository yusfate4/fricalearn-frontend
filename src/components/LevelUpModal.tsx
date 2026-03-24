import React from "react";
import confetti from "canvas-confetti";
import { Award, Zap, X } from "lucide-react";

interface LevelUpProps {
  level: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function LevelUpModal({ level, isOpen, onClose }: LevelUpProps) {
  if (!isOpen) return null;

  // 🎊 Trigger massive celebration confetti
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // Run once when opened
  React.useEffect(() => {
    if (isOpen) triggerConfetti();
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] md:rounded-[4rem] p-8 md:p-12 max-w-sm w-full text-center shadow-2xl border-8 border-yellow-400 animate-in zoom-in duration-500 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="w-20 h-20 md:w-24 md:h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 shadow-inner animate-bounce">
          <Zap size={48} fill="currentColor" />
        </div>
        
        <p className="text-[#2D5A27] font-black uppercase tracking-[0.3em] text-[10px] mb-2">
          New Milestone Reached!
        </p>
        
        <h2 className="text-5xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter mb-4">
          LEVEL {level}
        </h2>
        
        <p className="text-gray-500 font-bold text-sm mb-10 leading-relaxed px-4">
          Amazing work, Ayo! You are officially a rising star in the FricaLearn Academy.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-[2rem] mb-10 flex items-center gap-4 text-left border-2 border-gray-100">
            <div className="bg-[#2D5A27] p-3 rounded-2xl text-white shadow-lg">
                <Award size={28} />
            </div>
            <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Rank Upgraded</p>
                <p className="font-black text-[#2D5A27] uppercase italic text-lg tracking-tight">Jagunjagun</p>
            </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-[#2D5A27] text-white py-6 rounded-[2rem] font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase italic tracking-tight"
        >
          Keep Learning!
        </button>
      </div>
    </div>
  );
}