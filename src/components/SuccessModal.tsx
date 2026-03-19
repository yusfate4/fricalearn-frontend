import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowRight, CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onConfirm?: () => void; // Standard name
  onClose?: () => void; // Added as a backup for Admin pages
  title?: string;
  message?: string;
  points?: number;
}

export default function SuccessModal({
  isOpen,
  onConfirm,
  onClose,
  title = "Ẹ kú iṣẹ́!",
  message,
  points,
}: SuccessModalProps) {
  // 👈 THE FIX: Use whichever function was passed (onConfirm or onClose)
  const handleContinue = onConfirm || onClose || (() => {});

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl border-4 border-frica-green"
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${points ? "bg-yellow-100 text-frica-gold" : "bg-green-100 text-frica-green"}`}
            >
              {points ? <Trophy size={40} /> : <CheckCircle size={40} />}
            </div>

            <h2 className="text-3xl font-black text-gray-800 mb-2">{title}</h2>

            <p className="text-gray-600 mb-8 text-lg font-medium">
              {message ||
                (points
                  ? `Perfect score! You just earned ${points} points.`
                  : "Action completed!")}
            </p>

            <button
              onClick={handleContinue} // 👈 This now works for both cases!
              className="w-full bg-[#2D5A27] text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center space-x-2 hover:bg-green-800 transition-all shadow-xl active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight size={24} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
