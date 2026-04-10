import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import {
  HelpCircle,
  AlertCircle,
  ArrowRight,
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
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // --- 🔊 SECURE AUDIO LOGIC ---
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    // Define paths
    const sounds = {
      correct: "/sounds/correct-buzzle.mp3",
      wrong: "/sounds/wrong-buzz.mp3",
      complete: "/sounds/quiz-complete.mp3",
    };

    // Initialize and Load
    Object.entries(sounds).forEach(([key, path]) => {
      const audio = new Audio(window.location.origin + path);
      audio.load();
      audioRefs.current[key] = audio;
    });

    return () => {
      // Cleanup to prevent memory leaks or ghost sounds
      Object.values(audioRefs.current).forEach((a) => {
        a.pause();
        a.src = "";
      });
    };
  }, []);

  const playSound = (type: "correct" | "wrong" | "complete") => {
    const audio = audioRefs.current[type];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((err) => console.warn("Audio interaction deferred:", err));
    }
    if (type === "correct" && typeof navigator.vibrate === "function") {
      navigator.vibrate(50);
    }
  };

  const currentQuestion = questions[currentIndex];
  const hasAnswered = answers[currentIndex] !== undefined;

  const handleGetAIHint = async () => {
    if (loadingHint || hasAnswered) return;
    setLoadingHint(true);
    try {
      const res = await api.post("/ai/hint", {
        question_text: currentQuestion.question_text,
      });
      setHint(res.data.hint);
    } catch (err) {
      setHint("Look closely at the grammar rules we just covered!");
    } finally {
      setLoadingHint(false);
    }
  };

  /**
   * 🎯 THE ONE-ATTEMPT GATEKEEPER
   */
  const handleAnswer = (selectedOption: string) => {
    // 🛑 Lock: If currently processing or already answered, do nothing.
    if (isAnswering || hasAnswered) return;
    
    setIsAnswering(true);
    setHint(null);

    const isCorrect = selectedOption === currentQuestion.correct_answer;
    
    // Save the answer to state immediately to disable all buttons
    setAnswers((prev) => ({ ...prev, [currentIndex]: selectedOption }));

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      playSound("correct");

      // Auto-advance after a successful hit
      setTimeout(() => {
        setIsAnswering(false);
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          finishQuiz(newScore);
        }
      }, 1000);
    } else {
      // ❌ Failed attempt: Lock and show the lesson tip
      playSound("wrong");
      setShowExplanation(true);
      setIsAnswering(false);
    }
  };

  const finishQuiz = (finalCorrectCount: number) => {
    playSound("complete");
    const totalPoints = finalCorrectCount * 5;
    const passed = finalCorrectCount / questions.length >= 0.7;
    onQuizComplete(totalPoints, passed);
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
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : url;
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-[2rem] shadow-sm border-2 border-gray-50 px-6">
        <HelpCircle size={48} className="mx-auto text-gray-100 mb-6" />
        <h2 className="text-xl md:text-3xl font-black text-gray-800 mb-4 uppercase italic tracking-tighter">Quiz Not Ready</h2>
        <button onClick={onReviewLesson} className="bg-[#2D5A27] text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest">
          Back to Lesson
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-10 px-2">
      
      {/* 🧭 NAVIGATION HEADER */}
      <div className="flex justify-between items-center bg-white p-2 md:p-4 rounded-2xl md:rounded-3xl border-2 border-gray-100 shadow-sm sticky top-0 z-30 backdrop-blur-md bg-white/90">
        <button
          onClick={goPrevious}
          disabled={currentIndex === 0}
          className={`p-3 md:px-5 md:py-3 rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all ${
            currentIndex === 0 ? "text-gray-200" : "text-gray-700 bg-gray-50 hover:bg-[#2D5A27] hover:text-white"
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[8px] font-black uppercase text-gray-400 tracking-[0.3em] mb-1">Status</span>
          <div className="font-black text-[#2D5A27] italic text-sm md:text-xl leading-none">
            {currentIndex + 1} <span className="text-gray-200">/</span> {questions.length}
          </div>
        </div>

        <button
          onClick={goForward}
          disabled={!hasAnswered || currentIndex + 1 >= questions.length}
          className={`p-3 md:px-5 md:py-3 rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all ${
            !hasAnswered || currentIndex + 1 >= questions.length
              ? "text-gray-200"
              : "text-white bg-[#2D5A27] shadow-lg shadow-[#2D5A27]/30"
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start relative">
        
        {/* LEFT: QUESTION CARD */}
        <div className={`bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] shadow-xl border-2 md:border-4 border-white transition-all duration-500 ${
            showExplanation ? "opacity-40 blur-md pointer-events-none lg:opacity-100 lg:blur-0 lg:pointer-events-auto" : "opacity-100"
          }`}
        >
          {!hasAnswered && (
            <div className="mb-8">
              {!hint ? (
                <button
                  onClick={handleGetAIHint}
                  disabled={loadingHint}
                  className="flex items-center gap-2 text-purple-600 font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:scale-105 transition-all group"
                >
                  {loadingHint ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />}
                  {loadingHint ? "Consulting Oluko..." : "Get Hint from Oluko"}
                </button>
              ) : (
                <div className="bg-purple-50 border-2 border-purple-100 p-4 md:p-6 rounded-2xl animate-in slide-in-from-top-4">
                  <p className="text-xs md:text-sm font-bold text-purple-900 italic leading-relaxed">
                    <Sparkles size={14} className="inline mr-2 text-purple-400" />
                    {hint}
                  </p>
                </div>
              )}
            </div>
          )}

          <h2 className="text-xl md:text-3xl font-black text-gray-800 mb-8 md:mb-12 leading-tight tracking-tighter italic uppercase">
            {currentQuestion.question_text}
          </h2>

          <div className="grid gap-3 md:gap-5">
            {["a", "b", "c"].map((letter) => {
              const isSelected = answers[currentIndex] === letter;
              const isCorrect = currentQuestion.correct_answer === letter;
              const someoneAnswered = answers[currentIndex] !== undefined;

              return (
                <button
                  key={letter}
                  onClick={() => handleAnswer(letter)}
                  disabled={someoneAnswered}
                  className={`w-full p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 font-bold text-left flex justify-between items-center transition-all ${
                    isSelected
                      ? isCorrect
                        ? "border-green-500 bg-green-50 text-green-700 shadow-inner"
                        : "border-red-500 bg-red-50 text-red-700 shadow-inner"
                      : someoneAnswered && isCorrect
                        ? "border-green-200 bg-green-50/20 text-green-600" // Reveal correct answer after a fail
                        : "border-gray-50 bg-gray-50 text-gray-600 hover:border-[#2D5A27] hover:bg-white disabled:hover:border-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-4 md:gap-6">
                    <span className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center uppercase text-[10px] md:text-xs font-black ${
                        isSelected ? "bg-current text-white" : "bg-white border-2 border-gray-100 text-gray-300"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm md:text-lg">{currentQuestion[`option_${letter}`]}</span>
                  </span>
                  {isSelected && (isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />)}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: EXPLANATION BOX */}
        {showExplanation && (
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border-4 border-[#2D5A27]/10 animate-in slide-in-from-bottom-10 lg:sticky lg:top-24 z-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle size={24} />
                <span className="font-black uppercase italic text-lg tracking-tighter">Lesson Review</span>
              </div>
              <button onClick={() => setShowExplanation(false)} className="text-gray-300 hover:text-gray-900">
                <XCircle size={24} />
              </button>
            </div>

            {currentQuestion.explanation_video_url && (
              <div className="aspect-video rounded-3xl overflow-hidden bg-black mb-8 border-4 border-gray-100 shadow-inner">
                <iframe src={getEmbedUrl(currentQuestion.explanation_video_url)} className="w-full h-full" allowFullScreen></iframe>
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-3xl mb-8 border-2 border-gray-100 italic text-sm md:text-base text-gray-700 font-bold leading-relaxed">
              "{currentQuestion.explanation_text || "Mastery takes practice. Look at the correct answer highlighted in green!"}"
            </div>

            <button
              onClick={() => {
                if (currentIndex + 1 < questions.length) {
                  setCurrentIndex((prev) => prev + 1);
                  setShowExplanation(false);
                } else {
                  finishQuiz(score);
                }
              }}
              className="w-full bg-[#2D5A27] text-white py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl flex justify-center items-center gap-4 shadow-xl hover:bg-black active:scale-95 transition-all"
            >
              Move to Next <ArrowRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}