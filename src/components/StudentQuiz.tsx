import React, { useState } from "react";
import api from "../api/axios";
import {
  HelpCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Loader2,
} from "lucide-react";

interface StudentQuizProps {
  lessonId: string | number;
  questions: any[];
  onQuizComplete: (score: number, passed: boolean) => void;
  onReviewLesson: () => void;
}

export default function StudentQuiz({
  questions,
  onQuizComplete,
  onReviewLesson,
}: StudentQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  
  // AI Hint States
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  const [answers, setAnswers] = useState<Record<number, string>>({});

  const currentQuestion = questions[currentIndex];
  const hasAnswered = answers[currentIndex] !== undefined;

  // AI Hint Logic
  const handleGetAIHint = async () => {
    if (loadingHint || hasAnswered) return;
    setLoadingHint(true);
    try {
      const res = await api.post('/ai/hint', { 
        question_text: currentQuestion.question_text 
      });
      setHint(res.data.hint);
    } catch (err) {
      setHint("Try your best! You've got this.");
    } finally {
      setLoadingHint(false);
    }
  };

  const handleAnswer = (selectedOption: string) => {
    if (isAnswering || hasAnswered) return;
    setIsAnswering(true);
    setHint(null);

    const isCorrect = selectedOption === currentQuestion.correct_answer;
    setAnswers((prev) => ({ ...prev, [currentIndex]: selectedOption }));

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setTimeout(() => {
        setIsAnswering(false);
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          finishQuiz(score + 1);
        }
      }, 1000);
    } else {
      setShowExplanation(true);
      setIsAnswering(false);
    }
  };

  const finishQuiz = (finalScore: number) => {
    const passed = finalScore / questions.length >= 0.7;
    onQuizComplete(finalScore, passed);
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowExplanation(false);
      setHint(null);
    }
  };

  const goForward = () => {
    if (currentIndex + 1 < questions.length && hasAnswered) {
      setCurrentIndex((prev) => prev + 1);
      setShowExplanation(false);
      setHint(null);
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12 md:py-20 bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border-2 border-gray-50 px-6">
        <HelpCircle size={60} className="mx-auto text-gray-100 mb-6" />
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-4 uppercase italic">Quiz Not Ready</h2>
        <button onClick={onReviewLesson} className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">Review Lesson</button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in zoom-in duration-300 max-w-6xl mx-auto">
      
      {/* 🧭 NAVIGATION HEADER - Mobile Optimized */}
      <div className="flex justify-between items-center bg-gray-50 p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border-2 border-gray-100 shadow-inner">
        <button 
          onClick={goPrevious} 
          disabled={currentIndex === 0} 
          className={`flex items-center gap-1 md:gap-2 px-3 md:px-5 py-2 md:py-3 rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all ${currentIndex === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 bg-white shadow-sm hover:bg-[#2D5A27] hover:text-white"}`}
        >
          <ChevronLeft size={16} /> <span className="hidden xs:block">Back</span>
        </button>

        <div className="bg-white px-4 py-1.5 md:py-2 rounded-2xl shadow-sm border-2 border-gray-100 font-black text-[#2D5A27] italic text-sm md:text-lg">
          {currentIndex + 1} <span className="text-gray-200 mx-1">/</span> {questions.length}
        </div>

        <button 
          onClick={goForward} 
          disabled={!hasAnswered || currentIndex + 1 >= questions.length} 
          className={`flex items-center gap-1 md:gap-2 px-3 md:px-5 py-2 md:py-3 rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all ${!hasAnswered || currentIndex + 1 >= questions.length ? "text-gray-300 cursor-not-allowed" : "text-white bg-[#2D5A27] shadow-lg shadow-[#2D5A27]/20"}`}
        >
          <span className="hidden xs:block">Next</span> <ChevronRight size={16} />
        </button>
      </div>

      {/* 📊 MAIN CONTENT GRID - Stacks on Tablet (lg:grid-cols-2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
        
        {/* LEFT: QUESTION CARD */}
        <div className={`bg-white p-6 md:p-10 lg:p-12 rounded-[2rem] md:rounded-[3rem] shadow-xl border-4 border-gray-50 transition-all duration-500 ${showExplanation ? "opacity-30 blur-sm scale-95 pointer-events-none" : "opacity-100"}`}>
          
          {/* ✨ AI HINT SECTION */}
          {!hasAnswered && (
            <div className="mb-6">
              {!hint ? (
                <button 
                  onClick={handleGetAIHint}
                  disabled={loadingHint}
                  className="flex items-center gap-2 text-purple-600 font-black text-[10px] uppercase tracking-widest hover:text-purple-800 transition-all group"
                >
                  {loadingHint ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />}
                  {loadingHint ? "Consulting Tutor..." : "Get AI Hint"}
                </button>
              ) : (
                <div className="bg-purple-50 border-2 border-purple-100 p-4 md:p-5 rounded-2xl animate-in slide-in-from-top-2">
                   <p className="text-[11px] md:text-xs font-bold text-purple-900 italic leading-relaxed">
                     <Sparkles size={12} className="inline mr-2 text-purple-400" />
                     {hint}
                   </p>
                </div>
              )}
            </div>
          )}

          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-800 mb-8 md:mb-10 leading-tight tracking-tight">
            {currentQuestion.question_text}
          </h2>

          <div className="grid gap-3 md:gap-4">
            {["a", "b", "c"].map((letter) => {
              const isSelected = answers[currentIndex] === letter;
              const isCorrect = currentQuestion.correct_answer === letter;
              return (
                <button
                  key={letter}
                  onClick={() => handleAnswer(letter)}
                  className={`w-full p-4 md:p-6 rounded-[1.25rem] md:rounded-[1.5rem] border-2 font-bold text-left flex justify-between items-center transition-all group ${isSelected ? (isCorrect ? "border-green-500 bg-green-50 text-green-700" : "border-red-500 bg-red-50 text-red-700") : "border-gray-100 bg-gray-50 text-gray-600 hover:border-[#2D5A27] hover:bg-white"}`}
                >
                  <span className="flex items-center gap-3 md:gap-4">
                    <span className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center uppercase text-[10px] md:text-xs font-black ${isSelected ? "bg-current text-white" : "bg-white border-2 border-gray-100 text-gray-400"}`}>{letter}</span>
                    <span className="text-sm md:text-base">{currentQuestion[`option_${letter}`]}</span>
                  </span>
                  {isSelected && (isCorrect ? <CheckCircle2 size={18} className="md:w-5 md:h-5" /> : <XCircle size={18} className="md:w-5 md:h-5" />)}
                </button>
              );
            })}
          </div>

          {hasAnswered && !showExplanation && (
            <button
              onClick={() => setShowExplanation(true)}
              className="mt-6 md:mt-8 flex items-center gap-2 text-[#2D5A27] font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] hover:opacity-70"
            >
              <RotateCcw size={14} /> Re-watch Explanation
            </button>
          )}
        </div>

        {/* RIGHT: TUTOR FAIL-SAFE BOX (Visible on desktop alongside, or stacks on mobile) */}
        {showExplanation && (
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border-2 border-red-100 animate-in slide-in-from-right-10 lg:sticky lg:top-10">
            <div className="flex items-center justify-between mb-6 text-red-500 font-black uppercase italic text-base md:text-lg tracking-tighter">
              Tutor's Tip
              <button onClick={() => setShowExplanation(false)} className="text-gray-300 hover:text-gray-900"><ArrowRight size={20}/></button>
            </div>
            {currentQuestion.explanation_video_url && (
              <div className="aspect-video rounded-2xl overflow-hidden bg-black mb-6 border-4 border-gray-900 shadow-lg">
                <iframe src={getEmbedUrl(currentQuestion.explanation_video_url)} className="w-full h-full" allowFullScreen></iframe>
              </div>
            )}
            <div className="bg-gray-50 p-5 md:p-6 rounded-2xl mb-8 border border-gray-100 italic text-xs md:text-sm text-gray-600 font-bold leading-relaxed">
               "{currentQuestion.explanation_text || "Take a moment to review the lesson notes!"}"
            </div>
            <button 
              onClick={() => { if (currentIndex + 1 < questions.length) { setCurrentIndex(prev => prev + 1); setShowExplanation(false); } else { finishQuiz(score); } }} 
              className="w-full bg-[#2D5A27] text-white py-4 md:py-5 rounded-2xl font-black text-base md:text-lg flex justify-center items-center gap-3 shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
            >
              Continue Quiz <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}