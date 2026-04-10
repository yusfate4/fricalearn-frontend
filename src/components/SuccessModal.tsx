import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowRight, CheckCircle, Star, X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  studentName?: string;
  language?: string;
  message?: string;
  points?: number;
}

const greetingMap: Record<string, string> = {
  Yoruba: "Ẹ kú iṣẹ́",
  Igbo: "Dalu olu",
  Hausa: "Barka da ƙoƙari",
  English: "Well Done",
};

export default function SuccessModal({
  isOpen,
  onConfirm,
  onClose,
  studentName = "Student",
  language = "Yoruba",
  message,
  points,
}: SuccessModalProps) {
  const handleContinue = onConfirm || onClose || (() => {});
  
  // --- 🔊 Sound Logic ---
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Initialize sound (you can use your notification sound or a specific success chime)
      const soundPath = points && points > 0 ? "/sounds/success.mp3" : "/sounds/notification.mp3";
      audioRef.current = new Audio(soundPath);
      
      // Play the sound
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay blocked: Sound will play after first interaction.", err);
      });
    }

    // Cleanup when modal closes
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isOpen, points]);

  const culturalTitle = greetingMap[language] || greetingMap["Yoruba"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl">
          
          {/* ✨ BACKGROUND CELEBRATION (Bubbles/Stars) */}
          {points && points > 0 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -50, x: Math.random() * 100 + "%", opacity: 0 }}
                  animate={{ 
                    y: [0, 1000], 
                    opacity: [0, 1, 0],
                    rotate: [0, 360] 
                  }}
                  transition={{ 
                    duration: Math.random() * 2 + 2, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                  className="absolute text-yellow-400/40"
                >
                  <Star size={Math.random() * 24 + 12} fill="currentColor" />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ scale: 0.8, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-14 max-w-md w-full text-center shadow-[0_30px_100px_rgba(45,90,39,0.4)] border-8 border-white relative overflow-hidden"
          >
            <button 
              onClick={handleContinue}
              className="absolute top-6 right-6 text-gray-300 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* 🏆 ICON SECTION */}
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", bounce: 0.6 }}
              className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner relative ${
                points
                  ? "bg-yellow-50 text-yellow-500"
                  : "bg-green-50 text-[#2D5A27]"
              }`}
            >
              {points ? (
                <Trophy size={56} className="md:size-16 animate-bounce" />
              ) : (
                <CheckCircle size={56} className="md:size-16" />
              )}
              
              <div className={`absolute inset-0 rounded-full border-2 border-dashed animate-spin-slow ${
                points ? "border-yellow-200" : "border-green-200"
              }`} style={{ animationDuration: '8s' }}></div>
            </motion.div>

            <div className="space-y-2 mb-8">
                <p className="text-[#2D5A27] font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
                    {culturalTitle}
                </p>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">
                    {studentName}!
                </h2>
            </div>

            <p className="text-gray-500 mb-12 text-sm md:text-base font-bold leading-relaxed px-4">
              {message ||
                (points
                  ? `Incredible! You've successfully mastered this lesson and added ${points} points to your legacy.`
                  : "Excellent progress! Your updates have been successfully synced with the academy.")}
            </p>

            <button
              onClick={handleContinue}
              className="group w-full bg-[#1A1A40] text-white py-6 md:py-8 rounded-[2rem] font-black text-lg md:text-xl flex items-center justify-center gap-4 hover:bg-[#2D5A27] transition-all shadow-2xl active:scale-95 relative z-10"
            >
              <span className="uppercase tracking-widest text-xs">
                Continue Journey
              </span>
              <ArrowRight
                size={24}
                className="group-hover:translate-x-2 transition-transform"
              />
            </button>

            <p className="mt-8 text-[8px] font-black uppercase tracking-[0.5em] text-gray-200">
                FricaLearn Diaspora Academy
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}