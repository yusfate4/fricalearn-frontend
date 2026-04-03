import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Loader2, 
  MessageCircle, 
  ChevronRight,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function OluChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ẹ n lẹ́, Ayo! I am Olu, your Yoruba study buddy. Ki ni orúkọ rẹ? (What is your name?)" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await api.post("/ai/chat-olu", { 
        message: userMsg,
        history: messages 
      });

      setMessages(prev => [...prev, { role: "assistant", content: res.data.reply }]);
      
      // 💰 Logic: Earn 5 XP every 2 exchanges
      if (messages.length % 4 === 0) {
        setXpEarned(prev => prev + 5);
        // Optional: Call API to save XP to user profile here
      }
    } catch (err) {
      console.error("Olu is tired...", err);
    } finally {
      setLoading(false);
    }
  };

  const addChar = (char: string) => setInput(prev => prev + char);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col p-4 md:p-6">
        
        {/* --- OLU HEADER --- */}
        <div className="bg-white rounded-[2rem] p-4 mb-4 border-2 border-gray-100 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2D5A27] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="font-black text-gray-800 uppercase italic tracking-tighter">Olu AI Tutor</h2>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Now</span>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100 flex items-center gap-2">
            <Coins size={16} className="text-[#F4B400]" />
            <span className="font-black text-[#2D5A27] text-xs">+{xpEarned} XP</span>
          </div>
        </div>

        {/* --- CHAT AREA --- */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 no-scrollbar pb-10">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-[2rem] shadow-sm relative ${
                  msg.role === "user" 
                  ? "bg-gray-900 text-white rounded-tr-none" 
                  : "bg-white border-2 border-gray-50 text-gray-800 rounded-tl-none"
                }`}>
                  <p className="text-sm md:text-base font-bold leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start animate-pulse">
               <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin text-[#2D5A27]" />
                 <span className="text-[10px] font-black text-gray-400 uppercase">Olu is typing...</span>
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* --- INPUT AREA --- */}
        <div className="mt-auto pt-4">
          {/* Quick Yoruba Keys */}
          <div className="flex gap-2 mb-3 justify-center">
            {['ẹ', 'ọ', 'ṣ', 'á', 'è', 'ì', 'ó', 'ù'].map(char => (
              <button 
                key={char}
                onClick={() => addChar(char)}
                className="w-8 h-8 md:w-10 md:h-10 bg-white border-2 border-gray-100 rounded-xl font-black text-gray-500 hover:border-[#2D5A27] hover:text-[#2D5A27] transition-all flex items-center justify-center uppercase"
              >
                {char}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="relative group">
            <input 
              type="text" 
              placeholder="Reply to Olu in Yoruba..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-white border-2 border-gray-100 rounded-[2.5rem] py-5 px-8 pr-20 outline-none focus:border-[#2D5A27] shadow-xl font-bold transition-all text-gray-800"
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#2D5A27] text-white p-4 rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg disabled:opacity-30"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}