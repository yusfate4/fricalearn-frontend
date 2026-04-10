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

  // 🛡️ LOCK REF: Prevents multiple clicks even if state hasn't updated yet
  const hasAttemptedRef = useRef<Record<number, boolean>>({});

  // 🔊 AUDIO REFS: For Blob strategy
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    const loadSounds = async () => {
      const sounds = {
        correct: "/sounds/correct-buzzle.mp3",
        wrong: "/sounds/wrong-buzz.mp3",
        complete: "/sounds/quiz-complete.mp3",
      };

      for (const [key, path] of Object.entries(sounds)) {
        try {
          const res = await fetch(window.location.origin + path);
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.load();
          audioRefs.current[key] = audio;
        } catch (e) {
          console.error(`Failed to load sound: ${key}`, e);
        }
      }
    };
    loadSounds();
  }, []);

  const playSound = (type: string) => {
    const audio = audioRefs.current[type];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const currentQuestion = questions[currentIndex];
  const hasAnswered = answers[currentIndex] !== undefined;

  /**
   * 🎯 STICKY ATTEMPT LOGIC
   */
  const handleAnswer = (selectedOption: string) => {
    // 1. HARD BLOCK: Check Ref and State immediately
    if (hasAttemptedRef.current[currentIndex] || isAnswering || hasAnswered) return;

    // 2. LOCK IMMEDIATELY
    hasAttemptedRef.current[currentIndex] = true;
    setIsAnswering(true);
    setHint(null);

    const isCorrect = selectedOption === currentQuestion.correct_answer;
    setAnswers((prev) => ({ ...prev, [currentIndex]: selectedOption }));

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      playSound("correct");

      setTimeout(() => {
        setIsAnswering(false);
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          finishQuiz(newScore);
        }
      }, 1000);
    } else {
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

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : url;
  };

  if (!questions || questions.length === 0) return null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 px-2">
      {/* 🧭 HEADER */}
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border-2 border-gray-100 shadow-sm sticky top-0 z-30">
        <button
          onClick={() => setCurrentIndex((p) => p - 1)}
          disabled={currentIndex === 0}
          className="p-3 disabled:opacity-20"
        >
          <ChevronLeft />
        </button>
        <div className="text-center">
          <span className="text-[10px] font-black uppercase text-gray-400">Progress</span>
          <div className="font-black text-[#2D5A27] text-xl">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>
        <button
          onClick={() => setCurrentIndex((p) => p + 1)}
          disabled={!hasAnswered || currentIndex + 1 >= questions.length}
          className="p-3 disabled:opacity-20"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT: QUESTION */}
        <div className={`bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border-4 border-white transition-all ${showExplanation ? "opacity-30 blur-sm pointer-events-none lg:opacity-100 lg:blur-0 lg:pointer-events-auto" : ""}`}>
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-10 uppercase italic tracking-tighter">
            {currentQuestion.question_text}
          </h2>

          <div className="space-y-4">
            {["a", "b", "c"].map((letter) => {
              const isSelected = answers[currentIndex] === letter;
              const isCorrect = currentQuestion.correct_answer === letter;
              const locked = hasAttemptedRef.current[currentIndex];

              return (
                <button
                  key={letter}
                  disabled={locked}
                  onClick={() => handleAnswer(letter)}
                  className={`w-full p-6 rounded-2xl border-2 font-bold text-left flex justify-between items-center transition-all ${
                    isSelected
                      ? isCorrect ? "border-green-500 bg-green-50 text-green-700" : "border-red-500 bg-red-50 text-red-700"
                      : locked && isCorrect ? "border-green-200 bg-green-50/20 text-green-600" : "border-gray-50 bg-gray-50 text-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black uppercase ${isSelected ? "bg-current text-white" : "bg-white border text-gray-300"}`}>{letter}</span>
                    <span>{currentQuestion[`option_${letter}`]}</span>
                  </div>
                  {isSelected && (isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />)}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: EXPLANATION */}
        {showExplanation && (
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-[#2D5A27]/10 animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-3 text-red-500 mb-6">
              <AlertCircle size={24} />
              <span className="font-black uppercase italic text-lg">Oluko's Review</span>
            </div>

            {currentQuestion.explanation_video_url && (
              <div className="aspect-video rounded-3xl overflow-hidden bg-black mb-6">
                <iframe src={getEmbedUrl(currentQuestion.explanation_video_url)} className="w-full h-full" allowFullScreen></iframe>
              </div>
            )}

            <p className="bg-gray-50 p-6 rounded-2xl mb-8 font-bold italic text-gray-700 leading-relaxed border border-gray-100">
              "{currentQuestion.explanation_text || "Every mistake is a lesson learned. Study the correct answer and keep going!"}"
            </p>

            <button
              onClick={() => {
                if (currentIndex + 1 < questions.length) {
                  setCurrentIndex((p) => p + 1);
                  setShowExplanation(false);
                } else {
                  finishQuiz(score);
                }
              }}
              className="w-full bg-[#2D5A27] text-white py-6 rounded-2xl font-black text-xl flex justify-center items-center gap-4 shadow-xl hover:bg-black transition-all"
            >
              Continue <ArrowRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}