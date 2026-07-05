import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import {
  ArrowLeft, Loader2, CheckCircle2, XCircle, Award,
  BookOpen, Target, Lightbulb, AlertTriangle,
  ChevronRight, ChevronLeft,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "../hooks/useAuth";

interface Question {
  question: string; options: string[];
  correct_answer?: string; correct?: string;
  correct_index?: number; explanation?: string | null;
}
interface Keyword     { keyword: string; description: string; }
interface Misconception { misconception: string; response: string; }
interface LessonMeta  {
  outcome?: string | null;
  key_points?: string[];
  keywords?: Keyword[];
  misconceptions?: Misconception[];
}

// ── Web Audio clapping sound ──────────────────────────────────
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
  const [loading, setLoading]             = useState(true);
  const [showQuiz, setShowQuiz]           = useState(false);
  const [currentQ, setCurrentQ]           = useState(0);
  const [userAnswers, setUserAnswers]     = useState<Record<string, string>>({});
  const [feedback, setFeedback]           = useState<{ shown: boolean; isCorrect: boolean } | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults]     = useState<any>(null);
  const [studentName, setStudentName]     = useState("Explorer");
  const [submitting, setSubmitting]       = useState(false);
  const [expanded, setExpanded]           = useState(false);

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
      if (res.data.progress?.status === "completed") { setShowQuiz(true); setQuizSubmitted(true); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // ── Parsers ───────────────────────────────────────────────
  const parseMeta = (raw: string | null): LessonMeta => {
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
  };

  const parseQuiz = (raw: any): Question[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.questions)) return raw.questions;
    return [];
  };

  const correctAnswer = (q: Question) => q.correct_answer ?? q.correct ?? "";

  // ── Format transcript into readable paragraphs ────────────
  const formatTranscript = (text: string): string[] => {
    return text
      .split(/\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 15); // skip very short lines
  };

  // ── Quiz handlers ─────────────────────────────────────────
  const handleSelect = (answer: string) => {
    if (feedback?.shown || quizSubmitted) return;
    const isRight = answer === correctAnswer(questions[currentQ]);
    setUserAnswers(prev => ({ ...prev, [`q${currentQ + 1}`]: answer }));
    setFeedback({ shown: true, isCorrect: isRight });
    if (isRight) {
      playClap();
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 }, colors: ["#2D5A27","#F4B400","#fff"] });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentQ < questions.length - 1) setCurrentQ(q => q + 1);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const sid = localStorage.getItem("active_student_id");
      const ep  = user?.role === "parent" && sid
        ? `/external/lessons/${id}/quiz?student_id=${sid}`
        : `/external/lessons/${id}/quiz`;
      const res = await api.post(ep, { answers: userAnswers });
      setQuizResults(res.data);
      setQuizSubmitted(true);
      if (res.data.passed) confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const resetQuiz = () => {
    setCurrentQ(0); setUserAnswers({}); setFeedback(null);
    setQuizSubmitted(false); setQuizResults(null); setShowQuiz(false);
  };

  // ── Loading ───────────────────────────────────────────────
  if (loading) return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center p-20 text-center">
        <Loader2 className="animate-spin text-[#2D5A27] mb-6" size={48} />
        <p className="font-black text-gray-400 italic uppercase tracking-widest text-sm">Loading lesson...</p>
        <p className="text-gray-300 text-xs mt-3 font-medium max-w-xs">
          First open fetches content from Oak National Academy — may take a few seconds
        </p>
      </div>
    </Layout>
  );

  if (!lesson) return (
    <Layout><div className="p-20 text-center text-red-500 font-black uppercase text-2xl">Lesson not found.</div></Layout>
  );

  const questions = parseQuiz(lesson.quiz_data);
  const meta      = parseMeta(lesson.worksheet_url);
  const transcript = lesson.description && lesson.description !== "fetched" && lesson.description.length > 50
    ? lesson.description
    : null;
  const paragraphs = transcript ? formatTranscript(transcript) : [];

  // ─────────────────────────────────────────────────────────
  // LESSON VIEW (no video, no external links)
  // ─────────────────────────────────────────────────────────
  if (!showQuiz) return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 md:p-10 pb-32 space-y-8">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="group flex items-center text-gray-400 hover:text-[#2D5A27] font-black uppercase tracking-widest text-[10px] transition-all">
          <div className="p-2 rounded-xl bg-white shadow-sm mr-3 group-hover:bg-[#2D5A27]/10"><ArrowLeft size={16}/></div>
          Back to subject
        </button>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tighter italic uppercase leading-none">
          {lesson.title}
        </h1>

        {/* Learning Outcome */}
        {meta.outcome && (
          <div className="bg-[#2D5A27] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle,#fff,transparent)", transform: "translate(30%,-30%)" }}/>
            <div className="flex items-center gap-3 mb-3">
              <Target size={22} className="text-[#F4B400]"/>
              <p className="font-black text-[10px] uppercase tracking-widest text-white/70">Learning Goal</p>
            </div>
            <p className="text-xl font-black text-white leading-relaxed">{meta.outcome}</p>
          </div>
        )}

        {/* Key Vocabulary */}
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

        {/* ── LESSON TRANSCRIPT ── Main content ─────────────── */}
        {paragraphs.length > 0 ? (
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border-2 border-gray-50">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-[#2D5A27]/10 rounded-2xl"><BookOpen size={22} className="text-[#2D5A27]"/></div>
              <div>
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight italic">Read the Lesson</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                  Oak National Academy · {paragraphs.length} sections
                </p>
              </div>
            </div>

            <div className={`space-y-5 text-gray-700 leading-relaxed font-medium text-base overflow-hidden transition-all duration-500 ${
              expanded ? "max-h-none" : "max-h-96"
            }`}>
              {paragraphs.map((para, i) => (
                <p key={i} className={i === 0 ? "font-bold text-gray-800" : ""}>{para}</p>
              ))}
            </div>

            {paragraphs.length > 6 && (
              <button onClick={() => setExpanded(!expanded)}
                className="mt-6 flex items-center gap-2 text-[#2D5A27] font-black uppercase text-xs tracking-widest hover:text-black transition-colors">
                {expanded ? "Show less ↑" : `Read more (${paragraphs.length - 6} more sections) ↓`}
              </button>
            )}
          </div>
        ) : (
          /* No transcript yet */
          <div className="bg-gray-50 rounded-[2.5rem] p-10 border-2 border-dashed border-gray-200 text-center">
            <BookOpen size={40} className="text-gray-300 mx-auto mb-4"/>
            <p className="text-gray-400 font-bold">Lesson content is being prepared — check back soon!</p>
          </div>
        )}

        {/* Key Learning Points */}
        {meta.key_points && meta.key_points.length > 0 && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border-2 border-gray-50">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 size={22} className="text-[#2D5A27]"/>
              <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight italic">Key Points to Remember</h2>
            </div>
            <ul className="space-y-4">
              {meta.key_points.map((point, i) => (
                <li key={i} className="flex items-start gap-4 p-4 bg-green-50 rounded-2xl">
                  <span className="w-7 h-7 bg-[#2D5A27] text-white rounded-xl flex items-center justify-center font-black text-xs shrink-0">{i + 1}</span>
                  <span className="text-gray-700 font-medium text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common Misconceptions */}
        {meta.misconceptions && meta.misconceptions.length > 0 && (
          <div className="bg-amber-50 rounded-[2.5rem] p-8 border-2 border-amber-100">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle size={22} className="text-amber-500"/>
              <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight italic">Common Mistakes to Avoid</h2>
            </div>
            <div className="space-y-5">
              {meta.misconceptions.map((m, i) => (
                <div key={i} className="bg-white rounded-2xl p-5">
                  <p className="font-black text-red-600 text-sm mb-2 flex items-start gap-2">
                    <span className="shrink-0">✗</span> {m.misconception}
                  </p>
                  <p className="text-green-700 font-medium text-sm flex items-start gap-2">
                    <span className="shrink-0">✓</span> {m.response}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz CTA */}
        {questions.length > 0 ? (
          <div className="text-center pt-4">
            <p className="text-gray-400 font-bold text-sm mb-6">Read the lesson above, then test your understanding:</p>
            <button onClick={() => { setCurrentQ(0); setFeedback(null); setShowQuiz(true); }}
              className="group inline-flex items-center gap-4 bg-[#2D5A27] text-white px-14 py-7 rounded-[2.5rem] font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-black transition-all border-b-4 border-green-900 active:translate-y-1 active:border-b-0">
              Take the Quiz ({questions.length} questions)
              <Award size={20} className="group-hover:rotate-12 transition-transform"/>
            </button>
          </div>
        ) : paragraphs.length > 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-sm">Quiz coming soon — move to the next lesson!</p>
          </div>
        ) : null}
      </div>
    </Layout>
  );

  // ─────────────────────────────────────────────────────────
  // RESULTS VIEW
  // ─────────────────────────────────────────────────────────
  if (quizSubmitted && quizResults) return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10 pb-32">
        <button onClick={() => navigate(-1)} className="group flex items-center text-gray-400 hover:text-[#2D5A27] font-black uppercase tracking-widest text-[10px] mb-8 transition-all">
          <div className="p-2 rounded-xl bg-white shadow-sm mr-3 group-hover:bg-[#2D5A27]/10"><ArrowLeft size={16}/></div>
          Back to subject
        </button>

        <div className="bg-white rounded-[3.5rem] shadow-2xl border-4 border-gray-50 overflow-hidden">
          <div className="bg-gradient-to-r from-[#2D5A27] to-[#1a3518] p-10 md:p-14 text-center">
            <h2 className="text-4xl font-black text-white mb-2 italic uppercase tracking-tighter">Quiz Complete!</h2>
            <p className="text-white/70 font-medium text-sm">{lesson.title}</p>
          </div>

          <div className="p-10 md:p-14">
            <div className={`inline-flex items-center gap-4 px-10 py-6 rounded-[2rem] mb-8 ${quizResults.passed ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
              {quizResults.passed ? <Award size={36}/> : <XCircle size={36}/>}
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Your Score</p>
                <p className="text-5xl font-black">{quizResults.score}%</p>
                <p className="text-sm font-bold">{quizResults.correct_answers}/{quizResults.total_questions} correct</p>
              </div>
            </div>

            {/* 🏆 Topic evaluation — shows when the whole topic is now complete */}
            {quizResults?.topic_evaluation && (
              <div className="bg-gradient-to-br from-[#F4B400] to-yellow-500 rounded-[2rem] p-8 mb-8 text-left shadow-lg animate-in zoom-in duration-500">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#0E1C0E]/60 mb-2">🏆 Topic Complete!</p>
                <h3 className="text-2xl font-black text-[#0E1C0E] italic uppercase tracking-tight mb-2">
                  {quizResults.topic_evaluation.topic_title}
                </h3>
                <p className="font-bold text-[#0E1C0E]">
                  Topic average: {quizResults.topic_evaluation.average_score}% — {quizResults.topic_evaluation.grade_label}
                </p>
                <p className="text-xs font-bold text-[#0E1C0E]/60 mt-1">
                  {quizResults.topic_evaluation.lessons_completed}/{quizResults.topic_evaluation.total_lessons} lessons completed
                </p>
                {quizResults.topic_evaluation.weak_lessons?.length > 0 && (
                  <p className="text-sm font-medium text-[#0E1C0E]/70 mt-3">
                    💡 Worth revisiting: {quizResults.topic_evaluation.weak_lessons.join(", ")}
                  </p>
                )}
              </div>
            )}

            {/* Answer review */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-black text-gray-700 uppercase tracking-tight">Review Your Answers</h3>
              {questions.map((q, i) => {
                const ans   = userAnswers[`q${i + 1}`];
                const right = correctAnswer(q);
                const ok    = ans === right;
                return (
                  <div key={i} className={`p-5 rounded-2xl border-2 ${ok ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <p className="font-black text-gray-800 mb-2 text-sm">{i + 1}. {q.question}</p>
                    <p className={`font-bold text-sm ${ok ? "text-green-700" : "text-red-600"}`}>
                      Your answer: {ans || "Not answered"} {ok ? "✓" : "✗"}
                    </p>
                    {!ok && <p className="font-bold text-sm text-green-700 mt-1">✓ Correct: {right}</p>}
                  </div>
                );
              })}
            </div>

            {quizResults.passed ? (
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter">Well done, {studentName}! 🎉</h3>
                <button onClick={() => navigate(-1)} className="w-full bg-[#2D5A27] text-white py-7 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                  Continue Learning
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter">Keep Practising! 💪</h3>
                <p className="text-gray-500 font-bold text-sm">Re-read the lesson then try again.</p>
                <button onClick={resetQuiz} className="w-full bg-gray-900 text-white py-7 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-[#2D5A27] transition-all shadow-xl">
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );

  // ─────────────────────────────────────────────────────────
  // ONE-QUESTION-AT-A-TIME QUIZ
  // ─────────────────────────────────────────────────────────
  const q           = questions[currentQ];
  const isLast      = currentQ === questions.length - 1;
  const progress    = ((currentQ + 1) / questions.length) * 100;
  const userAnswer  = userAnswers[`q${currentQ + 1}`];
  const correct     = correctAnswer(q);
  const feedbackOn  = feedback?.shown;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8 md:p-10 pb-32">
        <button onClick={() => setShowQuiz(false)} className="group flex items-center text-gray-400 hover:text-[#2D5A27] font-black uppercase tracking-widest text-[10px] mb-8 transition-all">
          <div className="p-2 rounded-xl bg-white shadow-sm mr-3 group-hover:bg-[#2D5A27]/10"><ArrowLeft size={16}/></div>
          Back to lesson
        </button>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Question {currentQ + 1} of {questions.length}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#2D5A27]">{Object.keys(userAnswers).length} answered</p>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2D5A27] rounded-full transition-all duration-500" style={{ width: `${progress}%` }}/>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-[3rem] shadow-xl border-4 border-gray-50 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#2D5A27] to-[#1a3518] p-8 md:p-10">
            <p className="text-white/60 font-black uppercase text-[10px] tracking-widest mb-3">{lesson.title}</p>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{q.question}</h2>
          </div>

          <div className="p-8 md:p-10 space-y-4">
            {q.options.map((option, i) => {
              const isSelected   = userAnswer === option;
              const isCorrectOpt = feedbackOn && option === correct;
              const isWrong      = feedbackOn && isSelected && !feedback?.isCorrect;
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

          {/* Feedback panel */}
          {feedbackOn && (
            <div className={`mx-8 mb-8 p-6 rounded-2xl animate-in slide-in-from-bottom duration-300 ${
              feedback.isCorrect ? "bg-green-50 border-2 border-green-200" : "bg-amber-50 border-2 border-amber-200"
            }`}>
              {feedback.isCorrect ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👏</span>
                  <div>
                    <p className="font-black text-green-700 uppercase tracking-wide text-sm">Correct! Good job!</p>
                    <p className="text-green-600 text-xs font-medium mt-1">Excellent — keep it up!</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">💡</span>
                    <p className="font-black text-amber-800 uppercase tracking-wide text-sm">Not quite — let's learn this!</p>
                  </div>
                  <p className="text-amber-700 font-bold text-sm mb-1">
                    The correct answer is: <span className="text-green-700 font-black">"{correct}"</span>
                  </p>
                  {q.explanation && (
                    <p className="text-amber-600 text-xs font-medium mt-2 leading-relaxed">{q.explanation}</p>
                  )}
                  <p className="text-amber-500 text-xs font-medium mt-2 italic">
                    Recorded as missed — re-read this section of the lesson and try again next time!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => { setFeedback(null); if (currentQ > 0) setCurrentQ(q => q - 1); }}
            disabled={currentQ === 0}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest bg-white border-2 border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-30 transition-all">
            <ChevronLeft size={18}/> Previous
          </button>

          {feedbackOn ? (
            isLast ? (
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 flex items-center justify-center gap-3 bg-[#2D5A27] text-white px-8 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-50">
                {submitting ? <Loader2 size={20} className="animate-spin"/> : <Award size={20}/>}
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            ) : (
              <button onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-3 bg-[#2D5A27] text-white px-8 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-black transition-all shadow-xl">
                {feedback.isCorrect ? "Next Question" : "Got it, Next"} <ChevronRight size={18}/>
              </button>
            )
          ) : (
            <div className="flex-1 px-8 py-5 rounded-2xl bg-gray-100 text-gray-400 font-black uppercase text-sm tracking-widest text-center">
              Select an answer to continue
            </div>
          )}
        </div>

        {/* Dot nav */}
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          {questions.map((_, i) => (
            <button key={i} onClick={() => { if (!feedbackOn) setCurrentQ(i); }}
              className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                i === currentQ ? "bg-[#2D5A27] text-white"
                : userAnswers[`q${i + 1}`]
                  ? userAnswers[`q${i + 1}`] === correctAnswer(questions[i])
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                  : "bg-gray-100 text-gray-400"
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
