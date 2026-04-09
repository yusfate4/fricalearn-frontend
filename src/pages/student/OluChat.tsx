import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import {
  Send,
  Sparkles,
  Bot,
  Loader2,
  Coins,
  Clock,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function OluChat() {
  const { user } = useAuth();
  const studentName = user?.name || "Explorer";
  const learningLanguage = user?.student_profile?.learning_language || "Yoruba";

  // 🕒 State for AI session management (Item 10)
  const [minutesUsed, setMinutesUsed] = useState(
    user?.student_profile?.daily_ai_minutes || 0,
  );
  const [isLimitReached, setIsLimitReached] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Ẹ n lẹ́, ${studentName}! I am Olukọ, your ${learningLanguage} study buddy. How are you feeling today?`,
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || isLimitReached) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await api.post("/ai/chat-olu", {
        message: userMsg,
        history: messages,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);

      // 🕒 Update local time tracker (assuming 1 exchange ≈ 1 min of focus)
      setMinutesUsed((prev) => prev + 1);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setIsLimitReached(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Olukọ is resting now to prepare for tomorrow's lesson! You've reached your daily limit. 🌙",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const addChar = (char: string) => setInput((prev) => prev + char);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col p-4 md:p-6 pb-20">
        {/* --- OLỤKỌ HEADER --- */}
        <div className="bg-white rounded-[2rem] p-4 mb-4 border-2 border-gray-100 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2D5A27] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="font-black text-gray-800 uppercase italic tracking-tighter">
                Olukọ (AI Tutor)
              </h2>
              <div className="flex items-center gap-2">
                <Clock
                  size={12}
                  className={
                    isLimitReached ? "text-red-500" : "text-purple-500"
                  }
                />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {Math.max(120 - minutesUsed, 0)} mins left today
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100">
            <Sparkles size={16} className="text-[#F4B400]" />
            <span className="font-black text-[#2D5A27] text-[10px] uppercase">
              Learning {learningLanguage}
            </span>
          </div>
        </div>

        {/* --- CHAT AREA --- */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 no-scrollbar pb-10">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[70%] p-5 rounded-[2rem] shadow-sm relative ${
                    msg.role === "user"
                      ? "bg-gray-900 text-white rounded-tr-none"
                      : "bg-white border-2 border-gray-50 text-gray-800 rounded-tl-none font-medium italic"
                  }`}
                >
                  <p className="text-sm md:text-base leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-[#2D5A27]" />
                <span className="text-[10px] font-black text-gray-400 uppercase">
                  Olukọ is thinking...
                </span>
              </div>
            </div>
          )}
          {isLimitReached && (
            <div className="flex justify-center my-4">
              <div className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl flex items-center gap-2 border border-red-100 font-bold text-xs uppercase italic">
                <AlertCircle size={16} /> Daily AI Time exhausted
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* --- INPUT AREA --- */}
        <div className="mt-auto pt-4">
          {!isLimitReached && (
            <>
              {/* Specialized Heritage Keys */}
              <div className="flex gap-2 mb-3 justify-center flex-wrap">
                {(learningLanguage === "Yoruba"
                  ? ["ẹ", "ọ", "ṣ", "á", "è", "ì", "ó", "ù"]
                  : ["ị", "ọ", "ụ", "ñ", "á", "è"]
                ).map((char) => (
                  <button
                    key={char}
                    onClick={() => addChar(char)}
                    className="w-8 h-8 bg-white border-2 border-gray-100 rounded-xl font-black text-gray-500 hover:border-[#2D5A27] hover:text-[#2D5A27] transition-all flex items-center justify-center uppercase text-xs"
                  >
                    {char}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSend} className="relative group">
                <input
                  type="text"
                  // 🌍 Added "or English" to help diaspora students feel comfortable
                  placeholder={`Reply to Olukọ in ${learningLanguage} or English...`}
                  value={input}
                  disabled={loading || isLimitReached}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-white border-2 border-gray-100 rounded-[2.5rem] py-5 px-8 pr-20 outline-none focus:border-[#2D5A27] shadow-xl font-bold transition-all text-gray-800 placeholder:text-gray-300"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading || isLimitReached}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#2D5A27] text-white p-4 rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg disabled:opacity-30 disabled:hover:scale-100"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
