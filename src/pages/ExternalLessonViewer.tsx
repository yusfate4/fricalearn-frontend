import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import {
  ArrowLeft, Loader2, CheckCircle2, XCircle, Award,
  Target, Lightbulb, AlertTriangle, ChevronRight, 
  ChevronLeft, Presentation, FileText, Download, HelpCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "../hooks/useAuth";

interface Question {
  question: string; options: string[];
  correct_answer?: string; correct?: string;
  correct_index?: number; explanation?: string | null;
}
interface Keyword { keyword: string; description: string; }
interface Misconception { misconception: string; response: string; }
interface LessonMeta {
  outcome?: string | null;
  key_points?: string[];
  keywords?: Keyword[];
  misconceptions?: Misconception[];
  worksheet_pdf?: string | null;
  worksheet_answers_pdf?: string | null;
}

const playClap = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const makeClap = (when: number) => {
      const len  = Math.floor(ctx.sampleRate * 0.12);
      const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4) * 0.9;
      const src  = ctx.createBufferSource(); src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.9, when);
      gain.gain.exponentialRampToValueAtTime(0.001, when + 0.12);
      src.connect(gain); gain.connect(ctx.destination); src.start(when);
    };
    makeClap(ctx.currentTime);
    makeClap(ctx.currentTime + 0.18);
    makeClap(ctx.currentTime + 0.36);
  } catch { /* not supported */ }
};

export default function ExternalLessonViewer() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lesson, setLesson]               = useState<any>(null);
  const [fetchError, setFetchError]       = useState<string | null>(null);
  const [loading, setLoading]             = useState(true);

  // Quiz states ('none' | 'starter' | 'exit')
  const [activeQuizType, setActiveQuizType] = useState<"none" | "starter" | "exit">("none");
  const [currentQ, setCurrentQ]           = useState(0);
  const [userAnswers, setUserAnswers]     = useState<Record<string, string>>({});
  const [feedback, setFeedback]           = useState<{ shown: boolean; isCorrect: boolean } | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults]     = useState<any>(null);
  const [studentName, setStudentName]     = useState("Explorer");
  const [submitting, setSubmitting]       = useState(false);

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
      const ep  = user?.role === "parent" && sid
        ? `/external/lessons/${id}?student_id=${sid}`
        : `/external/lessons/${id}`;
      const res = await api.get(ep);
      setLesson(res.data.lesson);
      if (res.data.progress?.status === "completed") { setQuizSubmitted(true); }
    } catch (err: any) {
      console.error('Lesson fetch error:', err);
      const status = err?.response?.status;
      const msg    = err?.response?.data?.message || err?.message || 'Unknown error';
      setFetchError(`Error ${status || ''}: ${msg}`);
    }
    finally { setLoading(false); }
  };

  const parseMeta = (raw: string | null): LessonMeta => {
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
  };

  const parseQuiz = (raw: any) => {
    if (!raw) return { starter: [], exit: [] };
    let parsed = raw;
    if (typeof raw === "string") {
      try { parsed = JSON.parse(raw); } catch { return { starter: [], exit: [] }; }
    }
    // Handle legacy flat arrays or new structured object
    if (Array.isArray(parsed)) {
      return { starter: [], exit: parsed };
    }
    return {
      starter: Array.isArray(parsed.starter) ? parsed.starter : [],
      exit: Array.isArray(parsed.exit) ? parsed.exit : (Array.isArray(parsed.questions) ? parsed.questions : []),
    };
  };

  const quizzes = parseQuiz(lesson?.quiz_data);
  const activeQuestions = activeQuizType === "starter" ? quizzes.starter : quizzes.exit;
  const meta = parseMeta(lesson?.worksheet_url);

  const correctAnswer = (q: Question) => q.correct_answer ?? q.correct ?? "";

  const handleSelect = (answer: string) => {
    if (feedback?.shown || quizSubmitted) return;
    const isRight = answer === correctAnswer(activeQuestions[currentQ]);
    setUserAnswers(prev => ({ ...prev, [`q${currentQ + 1}`]: answer }));
    setFeedback({ shown: true, isCorrect: isRight });
    if (isRight) {
      playClap();
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 }, colors: ["#2D5A27","#F4B400","#fff"] });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentQ < activeQuestions.length - 1) setCurrentQ(q => q + 1);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (activeQuizType === "exit") {
        const sid = localStorage.getItem("active_student_id");
        const ep  = user?.role === "parent" && sid
          ? `/external/lessons/${id}/quiz?student_id=${sid}`
          : `/external/lessons/${id}/quiz`;
        const res = await api.post(ep, { answers: userAnswers });
        setQuizResults(res.data);
        setQuizSubmitted(true);
        if (res.data.passed) confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
      } else {
        // Starter quiz submitted locally for instant feedback
        setQuizSubmitted(true);
      }
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const resetQuiz = () => {
    setCurrentQ(0); setUserAnswers({}); setFeedback(null);
    setQuizSubmitted(false); setQuizResults(null); setActiveQuizType("none");
  };

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center p-20 text-center">
        <Loader2 className="animate-spin text-[#2D5A27] mb-6" size={48} />
        <p className="font-black text-gray-400 italic uppercase tracking-widest text-sm">Loading lesson...</p>
      </div>
    </Layout>
  );

  if (!lesson) return (
    <Layout>
      <div className="p-20 text-center">
        <p className="text-red-500 font-black uppercase text-2xl mb-4">Lesson not found.</p>
        <button onClick={() => window.history.back()} className="mt-6 bg-[#3F2171] text-white px-6 py-3 rounded-xl font-black text-sm">Go Back</button>
      </div>
    </Layout>
  );

  let finalVideoUrl = null;
  if (lesson.video_url) {
    if (lesson.video_url.startsWith('http')) {
      finalVideoUrl = lesson.video_url;
    } else if (lesson.video_url.startsWith('{')) {
      try {
        const videoAssets = JSON.parse(lesson.video_url);
        finalVideoUrl = videoAssets.videoUrl || videoAssets?.videoObject?.contentUrl;
      } catch (e) {}
    }
  }

  // ─────────────────────────────────────────────────────────
  // ACTIVE QUIZ VIEW
  // ─────────────────────────────────────────────────────────
  if (activeQuizType !== "none") {
    const q = activeQuestions[currentQ];
    const isLast = currentQ === activeQuestions.length - 1;
    const progress = ((currentQ + 1) / activeQuestions.length) * 100;
    const userAnswer = userAnswers[`q${currentQ + 1}`];
    const correct = correctAnswer(q);
    const feedbackOn = feedback?.shown;

    if (quizSubmitted && (activeQuizType === "starter" || quizResults)) {
      const passed = activeQuizType === "starter" ? true : quizResults?.passed;
      const score = activeQuizType === "starter" ? 100 : quizResults?.score;

      return (
        <Layout>
          <div className="max-w-3xl mx-auto px-4 py-10 pb-32">
            <div className="bg-white rounded-[3.5rem] shadow-2xl border-4 border-gray-50 overflow-hidden text-center p-10">
              <h2 className="text-4xl font-black text-gray-800 mb-4 italic uppercase tracking-tighter">
                {activeQuizType === "starter" ? "Starter Quiz Complete! 🚀" : "Lesson Quiz Complete!"}
              </h2>
              {activeQuizType === "exit" && (
                <div className={`inline-flex items-center gap-4 px-10 py-6 rounded-[2rem] mb-8 ${passed ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                  <Award size={36}/>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Your Score</p>
                    <p className="text-5xl font-black">{score}%</p>
                  </div>
                </div>
              )}
              <p className="text-gray-500 font-bold mb-8">
                {activeQuizType === "starter" ? "Great job warming up your brain! Now dive into the video lesson." : "Awesome work completing this lesson module!"}
              </p>
              <button onClick={resetQuiz} className="bg-[#2D5A27] text-white px-10 py-5 rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-black transition-all shadow-xl">
                Return to Lesson
              </button>
            </div>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-8 md:p-10 pb-32">
          <button onClick={() => setActiveQuizType("none")} className="group flex items-center text-gray-400 hover:text-[#2D5A27] font-black uppercase tracking-widest text-[10px] mb-8 transition-all">
            <div className="p-2 rounded-xl bg-white shadow-sm mr-3 group-hover:bg-[#2D5A27]/10"><ArrowLeft size={16}/></div>
            Back to lesson
          </button>

          <div className="mb-8">
            <div className="flex justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {activeQuizType === "starter" ? "Starter Quiz" : "Exit Quiz"} • Question {currentQ + 1} of {activeQuestions.length}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#2D5A27]">{Object.keys(userAnswers).length} answered</p>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2D5A27] rounded-full transition-all duration-500" style={{ width: `${progress}%` }}/>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] shadow-xl border-4 border-gray-50 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#2D5A27] to-[#1a3518] p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{q?.question}</h2>
            </div>

            <div className="p-8 md:p-10 space-y-4">
              {q?.options?.map((option, i) => {
                const isSelected = userAnswer === option;
                const isCorrectOpt = feedbackOn && option === correct;
                const isWrong = feedbackOn && isSelected && !feedback?.isCorrect;
                return (
                  <button key={i} onClick={() => handleSelect(option)} disabled={!!feedbackOn}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 font-bold text-lg flex items-center gap-4 ${
                      feedbackOn
                        ? isCorrectOpt ? "bg-green-50 border-green-400 text-green-800 scale-[1.01]"
                          : isWrong ? "bg-red-50 border-red-300 text-red-700"
                          : "bg-gray-50 border-gray-200 text-gray-400 opacity-50"
                        : isSelected ? "bg-[#2D5A27] border-[#2D5A27] text-white shadow-lg scale-[1.01]"
                        : "bg-white border-gray-200 text-gray-700 hover:border-[#2D5A27] hover:bg-[#2D5A27]/5"
                    }`}>
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      feedbackOn ? isCorrectOpt ? "bg-green-500 text-white" : isWrong ? "bg-red-500 text-white" : "bg-gray-200 text-gray-400"
                      : isSelected ? "bg-white text-[#2D5A27]" : "bg-gray-100 text-gray-500"
                    }`}>
                      {feedbackOn && isCorrectOpt ? "✓" : feedbackOn && isWrong ? "✗" : String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            {feedbackOn && (
              <div className={`mx-8 mb-8 p-6 rounded-2xl ${feedback.isCorrect ? "bg-green-50 border-2 border-green-200" : "bg-amber-50 border-2 border-amber-200"}`}>
                {feedback.isCorrect ? (
                  <p className="font-black text-green-700 uppercase tracking-wide text-sm">Correct! Excellent job!</p>
                ) : (
                  <p className="font-black text-amber-800 uppercase tracking-wide text-sm">Not quite! Correct answer: <span className="text-green-700 font-black">"{correct}"</span></p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <button onClick={() => { setFeedback(null); if (currentQ > 0) setCurrentQ(q => q - 1); }}
              disabled={currentQ === 0}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest bg-white border-2 border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-30 transition-all">
              <ChevronLeft size={18}/> Previous
            </button>

            {feedbackOn ? (
              isLast ? (
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-3 bg-[#2D5A27] text-white px-8 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-black transition-all shadow-xl">
                  {submitting ? <Loader2 size={20} className="animate-spin"/> : <Award size={20}/>}
                  Submit Quiz
                </button>
              ) : (
                <button onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-3 bg-[#2D5A27] text-white px-8 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-black transition-all shadow-xl">
                  Next Question <ChevronRight size={18}/>
                </button>
              )
            ) : (
              <div className="flex-1 px-8 py-5 rounded-2xl bg-gray-100 text-gray-400 font-black uppercase text-sm tracking-widest text-center">
                Select an answer to continue
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // ─────────────────────────────────────────────────────────
  // MAIN LESSON VIEW
  // ─────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 md:p-10 pb-32 space-y-8">
        <button onClick={() => navigate(-1)}
          className="group flex items-center text-gray-400 hover:text-[#2D5A27] font-black uppercase tracking-widest text-[10px] transition-all">
          <div className="p-2 rounded-xl bg-white shadow-sm mr-3 group-hover:bg-[#2D5A27]/10"><ArrowLeft size={16}/></div>
          Back to subject
        </button>

        <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tighter italic uppercase leading-none">
          {lesson.title}
        </h1>

        {/* ── STARTER QUIZ BANNER (GAMIFICATION) ── */}
        {quizzes.starter.length > 0 && (
          <div className="bg-gradient-to-r from-[#3F2171] to-[#5b329c] rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-left">
              <div className="p-4 bg-white/10 rounded-2xl"><HelpCircle size={28} className="text-[#F4B400]" /></div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight italic">Step 1: Warm-Up Challenge</h2>
                <p className="text-xs text-white/70 mt-1">Test what you already know before watching the video!</p>
              </div>
            </div>
            <button onClick={() => { setActiveQuizType("starter"); setCurrentQ(0); setUserAnswers({}); setFeedback(null); setQuizSubmitted(false); }}
              className="px-8 py-4 bg-[#F4B400] text-gray-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-lg hover:bg-white transition-all shrink-0">
              Take Starter Quiz ({quizzes.starter.length})
            </button>
          </div>
        )}

        {/* VIDEO PLAYER */}
        {finalVideoUrl && (
          <div className="bg-black rounded-[2.5rem] overflow-hidden shadow-2xl relative group w-full border-4 border-gray-100">
            <video controls className="w-full min-h-[300px] md:min-h-[500px] object-cover" preload="metadata" controlsList="nodownload">
              <source src={finalVideoUrl} />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {meta.outcome && (
          <div className="bg-[#3F2171] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Target size={22} className="text-[#F4B400]"/>
              <p className="font-black text-[10px] uppercase tracking-widest text-white/70">Learning Goal</p>
            </div>
            <p className="text-xl font-black text-white leading-relaxed">{meta.outcome}</p>
          </div>
        )}

        {/* KEY WORDS */}
        {meta.keywords && meta.keywords.length > 0 && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border-2 border-gray-50">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb size={22} className="text-[#F4B400]"/>
              <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight italic">Key Words</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {meta.keywords.map((kw, i) => (
                <div key={i} className="p-5 bg-[#F4B400]/10 rounded-2xl border border-[#F4B400]/20">
                  <p className="font-black text-[#2D5A27] uppercase tracking-wide text-sm mb-1">{kw.keyword}</p>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">{kw.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WORKSHEETS */}
        {(meta.worksheet_pdf || meta.worksheet_answers_pdf) && (
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border-2 border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><FileText size={28} /></div>
              <div>
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight italic">Printable Worksheets</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Download physical copies for offline practice</p>
              </div>
            </div>
            <div className="flex gap-3">
              {meta.worksheet_pdf && (
                <a href={meta.worksheet_pdf} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md">
                  <Download size={16} /> Worksheet
                </a>
              )}
              {meta.worksheet_answers_pdf && (
                <a href={meta.worksheet_answers_pdf} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest">
                  <Download size={16} /> Answers
                </a>
              )}
            </div>
          </div>
        )}

        {/* SLIDE DECK */}
        {lesson.slide_url && (
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border-2 border-gray-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#3F2171]/10 rounded-2xl"><Presentation size={22} className="text-[#3F2171]"/></div>
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight italic">Lesson Slides</h2>
            </div>
            <div className="w-full bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200">
              <iframe src={lesson.slide_url} className="w-full h-[400px]" frameBorder="0" allowFullScreen title="Lesson Presentation"></iframe>
            </div>
          </div>
        )}

        {/* ── EXIT QUIZ CTA ── */}
        {quizzes.exit.length > 0 ? (
          <div className="text-center pt-4">
            <p className="text-gray-400 font-bold text-sm mb-6">Finished the video and slides? Prove your mastery:</p>
            <button onClick={() => { setActiveQuizType("exit"); setCurrentQ(0); setUserAnswers({}); setFeedback(null); setQuizSubmitted(false); }}
              className="group inline-flex items-center gap-4 bg-[#3F2171] text-white px-14 py-7 rounded-[2.5rem] font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-black transition-all border-b-4 border-green-900 active:translate-y-1 active:border-b-0">
              Take Exit Quiz ({quizzes.exit.length} questions)
              <Award size={20} className="group-hover:rotate-12 transition-transform"/>
            </button>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}