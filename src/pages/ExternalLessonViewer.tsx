import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Award,
  ExternalLink,
  BookOpen,
  Target,
  Lightbulb,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "../hooks/useAuth";

interface Question {
  question: string;
  options: string[];
  correct_answer?: string;
  correct?: string;
  correct_index?: number;
  explanation?: string | null;
}

interface Keyword {
  keyword: string;
  description: string;
}

export default function ExternalLessonViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [quizResults, setQuizResults] = useState<any>(null);
  const [studentName, setStudentName] = useState("Explorer");

  useEffect(() => { fetchLesson(); }, [id]);

  useEffect(() => {
    const getStudentName = async () => {
      try {
        if (user?.role === "parent") {
          const sid = localStorage.getItem("active_student_id");
          if (sid) {
            const res = await api.get(`/students/${sid}/info`);
            setStudentName(res.data.name || "Student");
          }
        } else {
          setStudentName(user?.name || "Explorer");
        }
      } catch {
        setStudentName(user?.name || "Explorer");
      }
    };
    if (user) getStudentName();
  }, [user]);

  const fetchLesson = async () => {
    setLoading(true);
    try {
      const sid = localStorage.getItem("active_student_id");
      const endpoint =
        user?.role === "parent" && sid
          ? `/external/lessons/${id}?student_id=${sid}`
          : `/external/lessons/${id}`;

      const res = await api.get(endpoint);
      setLesson(res.data.lesson);

      if (res.data.progress?.status === "completed") {
        setShowQuiz(true);
        setQuizSubmitted(true);
      }
    } catch (err) {
      console.error("Failed to load lesson:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Parse quiz data (flat array or legacy wrapper) ────────
  const parseQuizData = (quizData: any): Question[] => {
    if (!quizData) return [];
    if (Array.isArray(quizData)) return quizData;
    if (Array.isArray(quizData?.questions)) return quizData.questions;
    return [];
  };

  // ── Parse keywords stored as JSON in worksheet_url ────────
  const parseKeywords = (worksheetUrl: string | null): Keyword[] => {
    if (!worksheetUrl) return [];
    try {
      const parsed = JSON.parse(worksheetUrl);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // ── Parse description into outcome + key points ───────────
  const parseDescription = (desc: string | null) => {
    if (!desc || desc === 'fetched') return { outcome: null, points: [] };
    const lines = desc.split('\n').filter(Boolean);
    const points = lines.filter(l => l.startsWith('•')).map(l => l.slice(2).trim());
    const outcome = lines.find(l => !l.startsWith('•')) || null;
    return { outcome, points };
  };

  const getCorrectAnswer = (q: Question): string =>
    q.correct_answer ?? q.correct ?? "";

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [`q${questionIndex + 1}`]: answer }));
  };

  const handleQuizSubmit = async () => {
    try {
      const sid = localStorage.getItem("active_student_id");
      const endpoint =
        user?.role === "parent" && sid
          ? `/external/lessons/${id}/quiz?student_id=${sid}`
          : `/external/lessons/${id}/quiz`;

      const res = await api.post(endpoint, { answers: userAnswers });
      setQuizResults(res.data);
      setQuizSubmitted(true);

      if (res.data.passed) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error("Quiz submission failed:", err);
    }
  };

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center p-20">
          <Loader2 className="animate-spin text-[#2D5A27] mb-6" size={48} />
          <p className="font-black text-gray-400 italic uppercase tracking-widest text-sm">
            Loading lesson...
          </p>
          <p className="text-gray-300 text-xs mt-3 font-medium text-center max-w-xs">
            First open fetches content from Oak National Academy — may take a few seconds
          </p>
        </div>
      </Layout>
    );
  }

  if (!lesson) {
    return (
      <Layout>
        <div className="p-20 text-center text-red-500 font-black uppercase tracking-tighter text-2xl">
          Lesson not found.
        </div>
      </Layout>
    );
  }

  const questions  = parseQuizData(lesson.quiz_data);
  const keywords   = parseKeywords(lesson.worksheet_url);
  const { outcome, points } = parseDescription(lesson.description);
  const hasQuiz    = questions.length > 0;
  const oakUrl     = lesson.slide_url; // Oak canonical URL stored here
  const isOakLesson = lesson.topic?.subject?.source === 'Oak National Academy';

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8 md:p-10 pb-32">

        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-gray-400 mb-8 hover:text-[#2D5A27] font-black uppercase tracking-widest text-[10px] transition-all"
        >
          <div className="p-2 rounded-xl bg-white shadow-sm mr-3 group-hover:bg-[#2D5A27]/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          Back to subject
        </button>

        {!showQuiz ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black text-gray-800 tracking-tighter italic uppercase leading-none">
              {lesson.title}
            </h1>

            {/* ── OAK VIDEO LINK CARD ──────────────────────────────────
                Oak does not stream video via API — we link to their site.
            */}
            {isOakLesson && (
              <div className="bg-gradient-to-br from-[#2D5A27] to-[#1a3518] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">
                      🎬 Video Lesson
                    </p>
                    <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight mb-3">
                      Watch on Oak Academy
                    </h2>
                    <p className="text-white/70 font-medium text-sm">
                      This lesson has a full video, slides and worksheet available on Oak National Academy — free, no account needed.
                    </p>
                  </div>
                  <a
                    href={oakUrl || `https://www.thenational.academy/teachers/lessons/${lesson.external_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={async () => {
                      // Mark as started when they click watch
                      try {
                        const sid = localStorage.getItem("active_student_id");
                        const endpoint = user?.role === "parent" && sid
                          ? `/external/lessons/${id}/progress?student_id=${sid}`
                          : `/external/lessons/${id}/progress`;
                        await api.post(endpoint, { video_watched: true, status: "in_progress" });
                      } catch {}
                    }}
                    className="shrink-0 flex items-center gap-3 bg-white text-[#2D5A27] px-8 py-5 rounded-[1.5rem] font-black uppercase text-sm tracking-widest hover:bg-[#F4B400] hover:text-white transition-all shadow-xl"
                  >
                    Watch Lesson
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            )}

            {/* ── LEARNING OUTCOME ──────────────────────────────────── */}
            {outcome && (
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border-2 border-gray-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#2D5A27] rounded-l-[2.5rem]" />
                <div className="flex items-center gap-3 mb-4">
                  <Target size={22} className="text-[#2D5A27]" />
                  <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight italic">
                    Learning Outcome
                  </h2>
                </div>
                <p className="text-gray-700 font-medium leading-relaxed text-base">
                  {outcome}
                </p>
              </div>
            )}

            {/* ── KEY LEARNING POINTS ───────────────────────────────── */}
            {points.length > 0 && (
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border-2 border-gray-50">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen size={22} className="text-[#2D5A27]" />
                  <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight italic">
                    Key Learning Points
                  </h2>
                </div>
                <ul className="space-y-3">
                  {points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-[#2D5A27] shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── KEYWORDS ─────────────────────────────────────────── */}
            {keywords.length > 0 && (
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border-2 border-gray-50">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb size={22} className="text-[#F4B400]" />
                  <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight italic">
                    Key Vocabulary
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {keywords.map((kw, i) => (
                    <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="font-black text-[#2D5A27] uppercase tracking-wide text-sm mb-1">
                        {kw.keyword}
                      </p>
                      <p className="text-gray-500 text-sm font-medium leading-relaxed">
                        {kw.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fallback if nothing loaded yet */}
            {!outcome && points.length === 0 && keywords.length === 0 && !isOakLesson && (
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border-2 border-gray-50">
                <p className="text-gray-500 font-medium">
                  Lesson content for <strong>{lesson.title}</strong>. Complete the activity and then take the quiz below.
                </p>
              </div>
            )}

            {/* ── QUIZ CTA ──────────────────────────────────────────── */}
            <div className="text-center pt-4">
              {hasQuiz ? (
                <>
                  <p className="text-gray-400 font-bold text-sm mb-6">
                    {isOakLesson
                      ? "After watching the video, test your understanding:"
                      : "Ready to test what you've learnt?"}
                  </p>
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="group inline-flex items-center gap-4 bg-[#2D5A27] text-white px-14 py-7 rounded-[2.5rem] font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-black transition-all border-b-4 border-green-900 active:translate-y-1 active:border-b-0"
                  >
                    Take the Quiz
                    <Award size={20} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </>
              ) : (
                <div className="p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold text-sm">
                    {isOakLesson
                      ? "This is an activity lesson — watch it on Oak Academy above, then move to the next lesson."
                      : "No quiz available for this lesson yet."}
                  </p>
                </div>
              )}
            </div>

          </div>

        ) : (
          /* ── QUIZ SECTION ─────────────────────────────────────── */
          <div className="animate-in slide-in-from-right-10 duration-700">
            <div className="bg-white rounded-[3.5rem] shadow-2xl border-4 border-gray-50 overflow-hidden">

              <div className="bg-gradient-to-r from-[#2D5A27] to-[#1a3518] p-10 md:p-16 text-center">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 italic uppercase tracking-tighter">
                  Knowledge Check
                </h2>
                <p className="text-white/80 font-bold text-lg">{lesson.title}</p>
              </div>

              <div className="p-10 md:p-16 space-y-12">
                {questions.map((question, qIdx) => {
                  const userAnswer   = userAnswers[`q${qIdx + 1}`];
                  const correctAns   = getCorrectAnswer(question);
                  const isIncorrect  = quizSubmitted && !!userAnswer && userAnswer !== correctAns;

                  return (
                    <div key={qIdx} className="border-b border-gray-100 pb-12 last:border-none">
                      <div className="flex items-start gap-4 mb-6">
                        <span className="bg-[#2D5A27] text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg shrink-0">
                          {qIdx + 1}
                        </span>
                        <h3 className="text-xl md:text-2xl font-black text-gray-800 leading-tight">
                          {question.question}
                        </h3>
                      </div>

                      <div className="space-y-4 ml-14">
                        {question.options.map((option, optIdx) => {
                          const isSelected      = userAnswer === option;
                          const isCorrectOption = quizSubmitted && option === correctAns;

                          return (
                            <button
                              key={optIdx}
                              onClick={() => !quizSubmitted && handleAnswerSelect(qIdx, option)}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-6 rounded-2xl border-2 transition-all font-bold text-lg ${
                                quizSubmitted
                                  ? isCorrectOption
                                    ? "bg-green-50 border-green-300 text-green-700"
                                    : isSelected && isIncorrect
                                    ? "bg-red-50 border-red-300 text-red-700"
                                    : "bg-gray-50 border-gray-200 text-gray-400"
                                  : isSelected
                                  ? "bg-[#2D5A27] border-[#2D5A27] text-white"
                                  : "bg-white border-gray-200 hover:border-[#2D5A27] hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 ${
                                  quizSubmitted
                                    ? isCorrectOption ? "border-green-500 bg-green-500"
                                      : isSelected && isIncorrect ? "border-red-500 bg-red-500"
                                      : "border-gray-300"
                                    : isSelected ? "border-white bg-white" : "border-gray-300"
                                }`}>
                                  {quizSubmitted && isCorrectOption && <CheckCircle2 size={16} className="text-white" />}
                                  {quizSubmitted && isSelected && isIncorrect && <XCircle size={16} className="text-white" />}
                                </div>
                                {option}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Show correct answer if got it wrong */}
                      {quizSubmitted && isIncorrect && (
                        <div className="ml-14 mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <p className="text-xs font-black text-green-700 uppercase tracking-wide">
                            ✓ Correct answer: {correctAns}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-10 md:p-16 bg-gray-50 border-t border-gray-100">
                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(userAnswers).length !== questions.length}
                    className="w-full bg-[#2D5A27] text-white py-7 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Answers ({Object.keys(userAnswers).length}/{questions.length})
                  </button>
                ) : (
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-4 px-10 py-6 rounded-[2rem] mb-10 ${
                      quizResults?.passed ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {quizResults?.passed ? <Award size={32} /> : <XCircle size={32} />}
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Your Score</p>
                        <p className="text-4xl font-black">{quizResults?.score}%</p>
                        <p className="text-sm font-bold">
                          {quizResults?.correct_answers} / {quizResults?.total_questions} correct
                        </p>
                      </div>
                    </div>

                    {quizResults?.passed ? (
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter mb-4">
                          Excellent Work, {studentName}! 🎉
                        </h3>
                        <button
                          onClick={() => navigate(-1)}
                          className="w-full bg-[#2D5A27] text-white py-7 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                        >
                          Continue Learning
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter mb-4">
                          Keep Practicing!
                        </h3>
                        <button
                          onClick={() => { setShowQuiz(false); setQuizSubmitted(false); setUserAnswers({}); setQuizResults(null); }}
                          className="w-full bg-gray-900 text-white py-7 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-[#2D5A27] transition-all shadow-xl"
                        >
                          Review Lesson
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
