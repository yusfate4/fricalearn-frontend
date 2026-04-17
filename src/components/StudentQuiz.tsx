import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

interface StudentQuizProps {
  lessonId: string | number;
  questions: any[];
  // 🚀 Updated: onQuizComplete now expects result from backend
  onQuizComplete: (score: number, passed: boolean, wasPractice: boolean) => void;
  onReviewLesson: () => void;
  alreadyPassed?: boolean; 
}

export default function StudentQuiz({
  questions,
  onQuizComplete,
  onReviewLesson,
  alreadyPassed = false,
}: StudentQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const hasAttemptedRef = useRef<Record<number, boolean>>({});
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

  const handleAnswer = (selectedOption: string) => {
    if (hasAttemptedRef.current[currentIndex] || isAnswering || hasAnswered) return;

    hasAttemptedRef.current[currentIndex] = true;
    setIsAnswering(true);

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
      
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  const finishQuiz = (finalCorrectCount: number) => {
    playSound("complete");
    // 💡 Logic: Calculate the percentage score (0-100)
    const percentageScore = Math.round((finalCorrectCount / questions.length) * 100);
    const passed = percentageScore >= 70;
    
    // 🚀 We pass the percentage score to the parent (LessonPage) 
    // which will then call the backend's submitAttempt method.
    onQuizComplete(percentageScore, passed, alreadyPassed);
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : url;
  };

  if (!questions || questions.length === 0) return null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 px-2 animate-in fade-in duration-700">
      {/* 🧭 HEADER & PRACTICE BADGE */}
      <div className="flex flex-col gap-4 sticky top-0 z-30">
        {alreadyPassed && (
          <div className="bg-orange-50 text-orange-600 px-6 py-2.5 rounded-2xl text-center font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-orange-100 shadow-sm animate-bounce">
            <Sparkles size={14} /> Mastery Practice Mode (No New Coins)
          </div>
        )}
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl border-2 border-gray-100 shadow-sm">
          <button
            onClick={() => {
              setCurrentIndex((p) => p - 1);
              setShowExplanation(false);
            }}
            disabled={currentIndex === 0}
            className="p-3 disabled:opacity-20 text-[#2D5A27]"
          >
            <ChevronLeft />
          </button>
          <div className="text-center">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Syllabus Progress</span>
            <div className="font-black text-[#2D5A27] text-xl">
              {currentIndex + 1} <span className="text-gray-300">/</span> {questions.length}
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentIndex((p) => p + 1);
              setShowExplanation(false);
            }}
            disabled={!hasAnswered || currentIndex + 1 >= questions.length}
            className="p-3 disabled:opacity-20 text-[#2D5A27]"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT: QUESTION */}
        <div className={`bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-xl border-4 border-white transition-all duration-500 ${showExplanation ? "opacity-30 blur-sm pointer-events-none lg:opacity-100 lg:blur-0 lg:pointer-events-auto" : ""}`}>
          <div className="mb-6 flex items-center gap-2">
             <div className="h-1.5 w-10 bg-[#2D5A27] rounded-full"></div>
             <span className="text-[10px] font-black text-gray-300 uppercase italic">Weekly Quiz</span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-black text-gray-800 mb-8 md:mb-12 uppercase italic tracking-tighter leading-tight">
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
                  className={`w-full p-6 md:p-8 rounded-3xl border-2 font-black text-left flex justify-between items-center transition-all duration-300 transform active:scale-95 ${
                    isSelected
                      ? isCorrect ? "border-green-500 bg-green-50 text-green-700 shadow-lg shadow-green-100" : "border-red-500 bg-red-50 text-red-700 shadow-lg shadow-red-100"
                      : locked && isCorrect ? "border-green-200 bg-green-50/20 text-green-600" : "border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black uppercase text-sm ${isSelected ? "bg-current text-white" : "bg-white border-2 text-gray-300"}`}>{letter}</span>
                    <span className="text-base md:text-lg tracking-tight">{currentQuestion[`option_${letter}`]}</span>
                  </div>
                  {isSelected && (isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />)}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: EXPLANATION (OLUKO'S REVIEW) */}
        {showExplanation && (
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border-4 border-[#2D5A27]/10 animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex items-center gap-3 text-red-500 mb-8">
              <AlertCircle size={28} />
              <span className="font-black uppercase italic text-xl tracking-tighter">Olukọ's Feedback</span>
            </div>

            {currentQuestion.explanation_video_url && (
              <div className="aspect-video rounded-[2rem] overflow-hidden bg-black mb-8 border-4 border-gray-50 shadow-inner">
                <iframe src={getEmbedUrl(currentQuestion.explanation_video_url)} className="w-full h-full" allowFullScreen></iframe>
              </div>
            )}

            <div className="bg-gray-50 p-6 md:p-8 rounded-3xl mb-10 border-2 border-dashed border-gray-200">
              <p className="font-bold italic text-gray-700 leading-relaxed text-base md:text-lg">
                "{currentQuestion.explanation_text || "Ẹ kú iṣẹ́! Study the correct path and try the next one."}"
              </p>
            </div>

            <button
              onClick={() => {
                if (currentIndex + 1 < questions.length) {
                  setCurrentIndex((p) => p + 1);
                  setShowExplanation(false);
                } else {
                  finishQuiz(score);
                }
              }}
              className="w-full bg-[#2D5A27] text-white py-6 md:py-8 rounded-[2rem] font-black text-xl md:text-2xl flex justify-center items-center gap-4 shadow-xl shadow-green-900/20 hover:bg-black hover:-translate-y-1 transition-all duration-300"
            >
              CONTINUE JOURNEY <ArrowRight size={28} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}