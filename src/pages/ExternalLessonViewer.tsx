import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Award, ExternalLink, BookOpen, Target, Lightbulb, ChevronRight, ChevronLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "../hooks/useAuth";

interface Question {
  question: string; options: string[];
  correct_answer?: string; correct?: string;
  correct_index?: number; explanation?: string | null;
}
interface Keyword { keyword: string; description: string; }

// ── Success chime (Web Audio API — no external file needed) ─────────
const playSuccessChime = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [[523.25, 0], [659.25, 0.12], [783.99, 0.24]].forEach(([freq, delay]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine"; osc.frequency.value = freq;
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.start(t); osc.stop(t + 0.5);
    });
  } catch {}
};

type QuestionState = "unanswered" | "correct" | "wrong";

export default function ExternalLessonViewer() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const [lesson, setLesson]           = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [showQuiz, setShowQuiz]       = useState(false);
  const [currentQ, setCurrentQ]       = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [questionState, setQuestionState]   = useState<QuestionState>("unanswered");
  const [answers, setAnswers]               = useState<Record<number, { answer: string; correct: boolean }>>({});
  const [quizComplete, setQuizComplete]     = useState(false);
  const [quizResults, setQuizResults]       = useState<any>(null);
  const [submitting, setSubmitting]         = useState(false);
  const [studentName, setStudentName]       = useState("Explorer");

  useEffect(() => { fetchLesson(); }, [id]);
  useEffect(() => {
    (async () => {
      try {
        if (user?.role === "parent") {
          const sid = localStorage.getItem("active_student_id");
          if (sid) { const r = await api.get(`/students/${sid}/info`); setStudentName(r.data.name || "Student"); return; }
        }
        setStudentName(user?.name || "Explorer");
      } catch { setStudentName(user?.name || "Explorer"); }
    })();
  }, [user]);

  const fetchLesson = async () => {
    setLoading(true);
    try {
      const sid = localStorage.getItem("active_student_id");
      const ep  = user?.role === "parent" && sid ? `/external/lessons/${id}?student_id=${sid}` : `/external/lessons/${id}`;
      const res = await api.get(ep);
      setLesson(res.data.lesson);
      if (res.data.progress?.status === "completed") { setShowQuiz(true); setQuizComplete(true); }
    } catch (err) { console.error("Failed to load lesson:", err); }
    finally { setLoading(false); }
  };

  // ── Helpers ───────────────────────────────────────────────
  const parseQuiz = (raw: any): Question[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.questions)) return raw.questions;
    return [];
  };
  const parseKeywords = (val: string | null): Keyword[] => {
    if (!val) return [];
    try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; }
  };
  const parseDescription = (desc: string | null) => {
    if (!desc || desc === "fetched") return { outcome: null, points: [] };
    const lines = desc.split("\n").filter(Boolean);
    return { outcome: lines.find(l => !l.startsWith("•")) || null, points: lines.filter(l => l.startsWith("•")).map(l => l.slice(2).trim()) };
  };
  const correctAnswer = (q: Question) => q.correct_answer ?? q.correct ?? "";

  // ── Quiz interactions ─────────────────────────────────────
  const handleSelectAnswer = (option: string) => {
    if (questionState !== "unanswered") return;  // locked after answering
    const q       = questions[currentQ];
    const isRight = option === correctAnswer(q);

    setSelectedAnswer(option);
    setQuestionState(isRight ? "correct" : "wrong");
    setAnswers(prev => ({ ...prev, [currentQ]: { answer: option, correct: isRight } }));

    if (isRight) {
      playSuccessChime();
    }
  };

  const handleNext = async () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedAnswer(null);
      setQuestionState("unanswered");
    } else {
      // Last question answered — submit
      await submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    const total   = questions.length;
    const correct = Object.values(answers).filter(a => a.correct).length + (questionState === "correct" ? 0 : 0);
    // answers already includes current via handleSelectAnswer
    const correctCount = Object.values({ ...answers }).filter(a => a.correct).length;
    const score   = Math.round((correctCount / total) * 100);
    const passed  = score >= 70;

    try {
      const sid = localStorage.getItem("active_student_id");
      const ep  = user?.role === "parent" && sid ? `/external/lessons/${id}/quiz?student_id=${sid}` : `/external/lessons/${id}/quiz`;
      // Build answers in q1/q2 format
      const answerPayload: Record<string, string> = {};
      questions.forEach((_, i) => { if (answers[i]) answerPayload[`q${i+1}`] = answers[i].answer; });
      const res = await api.post(ep, { answers: answerPayload });
      setQuizResults(res.data);
    } catch {
      setQuizResults({ score, correct_answers: correctCount, total_questions: total, passed, message: passed ? "🎉 Great job!" : "📚 Keep practicing!" });
    }

    if (Object.values(answers).filter(a => a.correct).length / questions.length >= 0.7) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }

    setQuizComplete(true);
    setSubmitting(false);
  };

  const markStarted = async () => {
    try {
      const sid = localStorage.getItem("active_student_id");
      const ep  = user?.role === "parent" && sid ? `/external/lessons/${id}/progress?student_id=${sid}` : `/external/lessons/${id}/progress`;
      await api.post(ep, { video_watched: true, status: "in_progress" });
    } catch {}
  };

  const resetQuiz = () => { setCurrentQ(0); setSelectedAnswer(null); setQuestionState("unanswered"); setAnswers({}); setQuizComplete(false); setQuizResults(null); setShowQuiz(false); };

  // ── Loading ───────────────────────────────────────────────
  if (loading) return (
    <Layout><div className="min-h-screen flex flex-col items-center justify-center p-20 text-center">
      <Loader2 className="animate-spin text-[#2D5A27] mb-6" size={48}/>
      <p className="font-black text-gray-400 italic uppercase tracking-widest text-sm">Loading lesson...</p>
      <p className="text-gray-300 text-xs mt-3 font-medium max-w-xs">First open fetches content from Oak — may take a few seconds</p>
    </div></Layout>
  );
  if (!lesson) return <Layout><div className="p-20 text-center text-red-500 font-black uppercase text-2xl">Lesson not found.</div></Layout>;

  const questions          = parseQuiz(lesson.quiz_data);
  const keywords           = parseKeywords(lesson.worksheet_url);
  const { outcome, points} = parseDescription(lesson.description);
  const hasContent         = outcome || points.length > 0 || keywords.length > 0;
  const oakUrl             = lesson.slide_url || (lesson.external_id ? `https://www.thenational.academy/teachers/lessons/${lesson.external_id}` : null);
  const isOak              = lesson.topic?.subject?.source === "Oak National Academy";

  // ─────────────────────────────────────────────────────────
  // LESSON VIEW
  // ─────────────────────────────────────────────────────────
  if (!showQuiz) return (
    <Layout><div className="max-w-5xl mx-auto px-4 py-8 md:p-10 pb-32 space-y-8">
      <button onClick={() => navigate(-1)} className="group flex items-center text-gray-400 hover:text-[#2D5A27] font-black uppercase tracking-widest text-[10px] transition-all">
        <div className="p-2 rounded-xl bg-white shadow-sm mr-3 group-hover:bg-[#2D5A27]/10"><ArrowLeft size={16}/></div>
        Back to subject
      </button>
      <h1 className="text-4xl md:text-6xl font-black text-gray-800 tracking-tighter italic uppercase leading-none">{lesson.title}</h1>

      {isOak && oakUrl && (
        <div className="bg-gradient-to-br from-[#2D5A27] to-[#1a3518] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">🎬 Video Lesson</p>
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight mb-3">Watch on Oak Academy</h2>
              <p className="text-white/70 font-medium text-sm">Free video, slides and worksheet — no account needed.</p>
            </div>
            <a href={oakUrl} target="_blank" rel="noopener noreferrer" onClick={markStarted}
              className="shrink-0 flex items-center gap-3 bg-white text-[#2D5A27] px-8 py-5 rounded-[1.5rem] font-black uppercase text-sm tracking-widest hover:bg-[#F4B400] hover:text-white transition-all shadow-xl">
              Watch Lesson <ExternalLink size={18}/>
            </a>
          </div>
        </div>
      )}

      {outcome && (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border-2 border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#2D5A27] rounded-l-[2.5rem]"/>
          <div className="flex items-center gap-3 mb-4"><Target size={22} className="text-[#2D5A27]"/><h2 className="text-lg font-black text-gray-800 uppercase tracking-tight italic">Learning Outcome</h2></div>
          <p className="text-gray-700 font-medium leading-relaxed">{outcome}</p>
        </div>
      )}
      {points.length > 0 && (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border-2 border-gray-50">
          <div className="flex items-center gap-3 mb-6"><BookOpen size={22} className="text-[#2D5A27]"/><h2 className="text-lg font-black text-gray-800 uppercase tracking-tight italic">Key Learning Points</h2></div>
          <ul className="space-y-3">{points.map((p,i) => (<li key={i} className="flex items-start gap-3"><CheckCircle2 size={18} className="text-[#2D5A27] shrink-0 mt-0.5"/><span className="text-gray-700 font-medium">{p}</span></li>))}</ul>
        </div>
      )}
      {keywords.length > 0 && (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border-2 border-gray-50">
          <div className="flex items-center gap-3 mb-6"><Lightbulb size={22} className="text-[#F4B400]"/><h2 className="text-lg font-black text-gray-800 uppercase tracking-tight italic">Key Vocabulary</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keywords.map((kw,i) => (<div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100"><p className="font-black text-[#2D5A27] uppercase tracking-wide text-sm mb-1">{kw.keyword}</p><p className="text-gray-500 text-sm font-medium leading-relaxed">{kw.description}</p></div>))}
          </div>
        </div>
      )}

      {!hasContent && isOak && (<div className="bg-gray-50 rounded-3xl p-6 border-2 border-dashed border-gray-200 text-center"><p className="text-gray-500 font-bold text-sm">Activity-based lesson — complete the activity on Oak Academy, then move to the next lesson.</p></div>)}
      {!hasContent && !isOak && (<div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-dashed border-gray-200 text-center"><p className="text-gray-400 font-bold">Content for this lesson is being prepared. Try another lesson!</p></div>)}

      <div className="text-center pt-4">
        {questions.length > 0 ? (
          <>
            <p className="text-gray-400 font-bold text-sm mb-6">{isOak ? "After watching, test your knowledge:" : "Ready to test what you've learnt?"}</p>
            <button onClick={() => { setCurrentQ(0); setSelectedAnswer(null); setQuestionState("unanswered"); setShowQuiz(true); }}
              className="group inline-flex items-center gap-4 bg-[#2D5A27] text-white px-14 py-7 rounded-[2.5rem] font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-black transition-all border-b-4 border-green-900 active:translate-y-1 active:border-b-0">
              Take the Quiz ({questions.length} questions) <Award size={20} className="group-hover:rotate-12 transition-transform"/>
            </button>
          </>
        ) : hasContent ? (
          <div className="p-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-sm">{isOak ? "This lesson has activities only — watch on Oak Academy above." : "Quiz coming soon."}</p>
          </div>
        ) : null}
      </div>
    </div></Layout>
  );

  // ─────────────────────────────────────────────────────────
  // QUIZ COMPLETE — Results
  // ─────────────────────────────────────────────────────────
  if (quizComplete) {
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const score        = quizResults?.score ?? Math.round(correctCount / questions.length * 100);
    const passed       = quizResults?.passed ?? score >= 70;

    return (
      <Layout><div className="max-w-3xl mx-auto px-4 py-10 pb-32">
        <button onClick={() => navigate(-1)} className="group flex items-center text-gray-400 hover:text-[#2D5A27] font-black uppercase tracking-widest text-[10px] mb-8 transition-all">
          <div className="p-2 rounded-xl bg-white shadow-sm mr-3 group-hover:bg-[#2D5A27]/10"><ArrowLeft size={16}/></div>Back to subject
        </button>

        <div className="bg-white rounded-[3.5rem] shadow-2xl border-4 border-gray-50 overflow-hidden">
          <div className="bg-gradient-to-r from-[#2D5A27] to-[#1a3518] p-10 md:p-16 text-center">
            <h2 className="text-4xl font-black text-white mb-2 italic uppercase tracking-tighter">Quiz Complete!</h2>
            <p className="text-white/70 font-medium">{lesson.title}</p>
          </div>
          <div className="p-10 md:p-16 text-center">
            <div className={`inline-flex items-center gap-4 px-10 py-6 rounded-[2rem] mb-8 ${passed ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
              {passed ? <Award size={36}/> : <XCircle size={36}/>}
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Your Score</p>
                <p className="text-5xl font-black">{score}%</p>
                <p className="text-sm font-bold">{correctCount} / {questions.length} correct</p>
              </div>
            </div>

            {/* Review */}
            <div className="text-left space-y-4 mb-10">
              <h3 className="text-lg font-black text-gray-700 uppercase tracking-tight">Review</h3>
              {questions.map((q, i) => {
                const a = answers[i];
                const isRight = a?.correct;
                return (
                  <div key={i} className={`p-5 rounded-2xl border-2 ${isRight ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <p className="font-black text-gray-800 text-sm mb-2">{i+1}. {q.question}</p>
                    <p className={`font-bold text-sm ${isRight ? "text-green-700" : "text-red-600"}`}>
                      Your answer: {a?.answer || "Not answered"} {isRight ? "✓" : "✗"}
                    </p>
                    {!isRight && <p className="font-bold text-sm text-green-700">Correct: {correctAnswer(q)}</p>}
                  </div>
                );
              })}
            </div>

            {passed ? (
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter mb-4">Excellent, {studentName}! 🎉</h3>
                <button onClick={() => navigate(-1)} className="w-full bg-[#2D5A27] text-white py-7 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-black transition-all shadow-xl">Continue Learning</button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter mb-2">Keep Going!</h3>
                <p className="text-gray-500 font-bold">Review the lesson and try again.</p>
                <button onClick={resetQuiz} className="w-full bg-gray-900 text-white py-7 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-[#2D5A27] transition-all shadow-xl">Try Again</button>
              </div>
            )}
          </div>
        </div>
      </div></Layout>
    );
  }

  // ─────────────────────────────────────────────────────────
  // QUIZ — One question at a time
  // ─────────────────────────────────────────────────────────
  const q        = questions[currentQ];
  const correct  = correctAnswer(q);
  const progress = ((currentQ + 1) / questions.length) * 100;
  const isLast   = currentQ === questions.length - 1;

  return (
    <Layout><div className="max-w-3xl mx-auto px-4 py-8 md:p-10 pb-32">
      <button onClick={() => setShowQuiz(false)} className="group flex items-center text-gray-400 hover:text-[#2D5A27] font-black uppercase tracking-widest text-[10px] mb-8 transition-all">
        <div className="p-2 rounded-xl bg-white shadow-sm mr-3 group-hover:bg-[#2D5A27]/10"><ArrowLeft size={16}/></div>Back to lesson
      </button>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Question {currentQ+1} of {questions.length}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#2D5A27]">{Object.values(answers).filter(a=>a.correct).length} correct so far</p>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#2D5A27] rounded-full transition-all duration-500" style={{ width: `${progress}%` }}/>
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-[3rem] shadow-xl border-4 border-gray-50 overflow-hidden mb-6 animate-in fade-in slide-in-from-right-4 duration-400" key={currentQ}>
        <div className="bg-gradient-to-r from-[#2D5A27] to-[#1a3518] p-8 md:p-10">
          <p className="text-white/60 font-black uppercase text-[10px] tracking-widest mb-3">{lesson.title}</p>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{q.question}</h2>
        </div>

        <div className="p-8 md:p-10 space-y-4">
          {q.options.map((option, i) => {
            const isSelected   = selectedAnswer === option;
            const isCorrectOpt = option === correct;
            let cls = "bg-white border-gray-200 text-gray-700 hover:border-[#2D5A27] hover:bg-[#2D5A27]/5 cursor-pointer";
            if (questionState !== "unanswered") {
              if (isCorrectOpt)           cls = "bg-green-50 border-green-400 text-green-800 cursor-default";
              else if (isSelected)        cls = "bg-red-50 border-red-400 text-red-800 cursor-default";
              else                        cls = "bg-gray-50 border-gray-100 text-gray-400 cursor-default opacity-60";
            } else if (isSelected) {
              cls = "bg-[#2D5A27] border-[#2D5A27] text-white shadow-lg scale-[1.01] cursor-pointer";
            }

            return (
              <button key={i} onClick={() => handleSelectAnswer(option)} disabled={questionState !== "unanswered"}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 font-bold text-base flex items-center gap-4 ${cls}`}>
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                  questionState !== "unanswered"
                    ? isCorrectOpt ? "bg-green-500 text-white" : isSelected ? "bg-red-500 text-white" : "bg-gray-200 text-gray-400"
                    : isSelected ? "bg-white text-[#2D5A27]" : "bg-gray-100 text-gray-500"
                }`}>
                  {questionState !== "unanswered" && isCorrectOpt ? "✓" : questionState !== "unanswered" && isSelected ? "✗" : String.fromCharCode(65+i)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback panel — shown after answering */}
        {questionState === "correct" && (
          <div className="mx-8 mb-8 p-5 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-3xl">👏</div>
            <div>
              <p className="font-black text-green-700 uppercase tracking-wide text-sm">Good Job!</p>
              <p className="text-green-600 font-medium text-sm">That's correct! Keep it up!</p>
            </div>
          </div>
        )}
        {questionState === "wrong" && (
          <div className="mx-8 mb-8 p-5 bg-amber-50 border-2 border-amber-200 rounded-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">💡</div>
              <p className="font-black text-amber-800 uppercase tracking-wide text-sm">Not quite — here's the explanation:</p>
            </div>
            <p className="text-amber-700 font-bold text-sm mb-2">
              ✓ The correct answer is: <span className="text-green-700 font-black">{correct}</span>
            </p>
            {q.explanation && (
              <p className="text-amber-700 font-medium text-sm leading-relaxed mt-2 pt-2 border-t border-amber-200">
                {q.explanation}
              </p>
            )}
            <p className="text-amber-600 text-xs font-medium mt-2 italic">
              This question has been recorded as missed — keep going, you'll get the next one!
            </p>
          </div>
        )}
      </div>

      {/* Navigation — only shown after answering */}
      {questionState !== "unanswered" && (
        <div className="animate-in slide-in-from-bottom-4 duration-300">
          {submitting ? (
            <div className="flex items-center justify-center gap-3 py-5 text-gray-400 font-black uppercase tracking-widest text-sm">
              <Loader2 size={20} className="animate-spin"/> Submitting results...
            </div>
          ) : (
            <button onClick={handleNext}
              className="w-full flex items-center justify-center gap-3 bg-[#2D5A27] text-white px-8 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-black transition-all shadow-xl">
              {isLast ? <><Award size={20}/> Finish & See Results</> : <>Next Question <ChevronRight size={18}/></>}
            </button>
          )}
        </div>
      )}

      {/* Dot nav */}
      <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
        {questions.map((_, i) => {
          const a = answers[i];
          return (
            <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${
              i === currentQ ? "bg-[#2D5A27] text-white"
              : a ? (a.correct ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300")
              : "bg-gray-100 text-gray-400"
            }`}>{i+1}</div>
          );
        })}
      </div>
    </div></Layout>
  );
}
