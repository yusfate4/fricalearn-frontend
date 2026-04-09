import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowRight, CheckCircle, Star } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  studentName?: string; // 👈 Added: To fix the "Ayo" issue
  language?: string; // 👈 Added: For cultural greetings
  message?: string;
  points?: number;
}

/**
 * 🌍 GREETINGS MAP (Item 5)
 * Dynamic greetings based on the language being learned.
 */
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
  studentName = "Student", // Fallback if name is missing
  language = "Yoruba", // Default language
  message,
  points,
}: SuccessModalProps) {
  const handleContinue = onConfirm || onClose || (() => {});

  // Determine the cultural title
  const culturalTitle = greetingMap[language] || greetingMap["Yoruba"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-md">
          {/* ✨ BACKGROUND CELEBRATION */}
          {points && points > 0 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: [0, 800], opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute text-yellow-400/30"
                  style={{ left: `${i * 20}%` }}
                >
                  <Star size={Math.random() * 20 + 10} fill="currentColor" />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 max-w-sm w-full text-center shadow-[0_20px_50px_rgba(45,90,39,0.3)] border-4 border-white relative"
          >
            {/* 🏆 ICON SECTION */}
            <motion.div
              initial={{ rotate: -15, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ${
                points
                  ? "bg-yellow-50 text-yellow-500"
                  : "bg-green-50 text-[#2D5A27]"
              }`}
            >
              {points ? (
                <Trophy size={48} className="md:size-14" />
              ) : (
                <CheckCircle size={48} className="md:size-14" />
              )}
            </motion.div>

            {/* 📝 TEXT SECTION (Personalized) */}
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-3 italic uppercase tracking-tighter leading-tight">
              {culturalTitle}, <br />
              <span className="text-[#2D5A27]">{studentName}!</span>
            </h2>

            <p className="text-gray-500 mb-10 text-sm md:text-base font-bold leading-relaxed px-2">
              {message ||
                (points
                  ? `Incredible! You've mastered this lesson and earned ${points} points.`
                  : "Great job! Your update has been saved successfully.")}
            </p>

            {/* 🏁 ACTION BUTTON */}
            <button
              onClick={handleContinue}
              className="group w-full bg-[#2D5A27] text-white py-5 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-xl flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95"
            >
              <span className="uppercase tracking-widest text-[10px] md:text-xs">
                Continue Journey
              </span>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-2 transition-transform"
              />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
