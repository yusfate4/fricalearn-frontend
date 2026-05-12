import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import {
  ArrowLeft,
  HelpCircle,
  Loader2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "../hooks/useAuth";

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
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

useEffect(() => {
  // Get student name - either from active student or logged-in user
  const getStudentName = async () => {
    try {
      if (user?.role === "parent") {
        const activeStudentId = localStorage.getItem("active_student_id");
        if (activeStudentId) {
          const res = await api.get(`/users/${activeStudentId}`);
          setStudentName(res.data.name || "Explorer");
        }
      } else {
        setStudentName(user?.name || "Explorer");
      }
    } catch (err) {
      setStudentName(user?.name || "Explorer");
    }
  };
  
  getStudentName();
}, [user]);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : url;
  };

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/external/lessons/${id}`);
      setLesson(res.data.lesson);
      
      // If already completed, show results
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

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [`q${questionIndex + 1}`]: answer,
    }));
  };

  const handleQuizSubmit = async () => {
    try {
      const res = await api.post(`/external/lessons/${id}/quiz`, {
        answers: userAnswers,
      });

      setQuizResults(res.data);
      setQuizSubmitted(true);

      if (res.data.passed) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error("Quiz submission failed:", err);
    }
  };

  const handleMarkVideoWatched = async () => {
    try {
      await api.post(`/external/lessons/${id}/progress`, {
        video_watched: true,
        status: "in_progress",
      });
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center p-20">
          <Loader2 className="animate-spin text-[#2D5A27] mb-6" size={48} />
          <p className="font-black text-gray-400 italic uppercase tracking-widest text-sm">
            Loading lesson...
          </p>
        </div>
      </Layout>
    );

  if (!lesson)
    return (
      <Layout>
        <div className="p-20 text-center text-red-500 font-black uppercase tracking-tighter text-2xl">
          Lesson not found.
        </div>
      </Layout>
    );

  const questions: Question[] = lesson.quiz_data?.questions || [];
  const hasQuiz = questions.length > 0;

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
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <h1 className="text-4xl md:text-7xl font-black mb-8 text-gray-800 tracking-tighter italic uppercase leading-none">
              {lesson.title}
            </h1>

            {/* Main Video Content */}
            {lesson.video_url && (
              <div className="aspect-video w-full bg-black rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl mb-12 border-4 border-white ring-1 ring-gray-100">
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(lesson.video_url)}
                  title={lesson.title}
                  allowFullScreen
                  onLoad={handleMarkVideoWatched}
                ></iframe>
              </div>
            )}

            {/* Lesson Description */}
            <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-sm border-2 border-gray-50 mb-12 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2.5 h-full bg-[#2D5A27] group-hover:w-4 transition-all duration-500"></div>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles size={20} className="text-[#F4B400]" />
                <h2 className="text-2xl font-black text-gray-800 italic uppercase tracking-tight">
                  Lesson Overview
                </h2>
              </div>
              <div className="text-gray-600 text-lg md:text-xl leading-relaxed whitespace-pre-line font-medium italic">
                {lesson.description}
              </div>
            </div>

            {/* Quiz Trigger */}
            {hasQuiz && (
              <div className="flex justify-center py-6">
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setShowQuiz(true);
                  }}
                  className="flex items-center gap-5 bg-[#2D5A27] text-white px-12 py-7 rounded-[2.5rem] font-black text-2xl hover:bg-black transition-all shadow-2xl hover:-translate-y-2 active:scale-95 group"
                >
                  <HelpCircle
                    size={28}
                    className="text-[#F4B400] group-hover:rotate-12 transition-transform"
                  />
                  Take the Quiz
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-10 duration-700">
            <div className="bg-white rounded-[3.5rem] shadow-2xl border-4 border-gray-50 overflow-hidden">
              {/* Quiz Header */}
              <div className="bg-gradient-to-r from-[#2D5A27] to-[#1a3518] p-10 md:p-16 text-center">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 italic uppercase tracking-tighter">
                  Knowledge Check
                </h2>
                <p className="text-white/80 font-bold text-lg">
                  {lesson.title}
                </p>
              </div>

              {/* Quiz Questions */}
              <div className="p-10 md:p-16 space-y-12">
                {questions.map((question, qIdx) => {
                  const userAnswer = userAnswers[`q${qIdx + 1}`];
                  const isCorrect =
                    quizSubmitted && userAnswer === question.correct_answer;
                  const isIncorrect =
                    quizSubmitted &&
                    userAnswer &&
                    userAnswer !== question.correct_answer;

                  return (
                    <div
                      key={qIdx}
                      className="border-b border-gray-100 pb-12 last:border-none"
                    >
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
                          const isSelected = userAnswer === option;
                          const isCorrectOption =
                            quizSubmitted && option === question.correct_answer;

                          return (
                            <button
                              key={optIdx}
                              onClick={() =>
                                !quizSubmitted &&
                                handleAnswerSelect(qIdx, option)
                              }
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
                                <div
                                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                                    quizSubmitted
                                      ? isCorrectOption
                                        ? "border-green-500 bg-green-500"
                                        : isSelected && isIncorrect
                                        ? "border-red-500 bg-red-500"
                                        : "border-gray-300"
                                      : isSelected
                                      ? "border-white bg-white"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {quizSubmitted && isCorrectOption && (
                                    <CheckCircle2 size={16} className="text-white" />
                                  )}
                                  {quizSubmitted && isSelected && isIncorrect && (
                                    <XCircle size={16} className="text-white" />
                                  )}
                                </div>
                                {option}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation (after submission) */}
                      {quizSubmitted && (
                        <div className="ml-14 mt-6 p-6 bg-blue-50 border-2 border-blue-100 rounded-2xl">
                          <p className="text-sm font-bold text-blue-900">
                            <span className="uppercase tracking-widest text-[10px] text-blue-500 block mb-2">
                              Explanation
                            </span>
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz Actions */}
              <div className="p-10 md:p-16 bg-gray-50 border-t border-gray-100">
                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={
                      Object.keys(userAnswers).length !== questions.length
                    }
                    className="w-full bg-[#2D5A27] text-white py-7 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Answers
                  </button>
                ) : (
                  <div className="text-center">
                    {/* Results Summary */}
                    <div className="mb-10">
                      <div
                        className={`inline-flex items-center gap-4 px-10 py-6 rounded-[2rem] ${
                          quizResults?.passed
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {quizResults?.passed ? (
                          <Award size={32} />
                        ) : (
                          <XCircle size={32} />
                        )}
                        <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                            Your Score
                          </p>
                          <p className="text-4xl font-black">
                            {quizResults?.score}%
                          </p>
                          <p className="text-sm font-bold">
                            {quizResults?.correct_answers} / {quizResults?.total_questions} correct
                          </p>
                        </div>
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
                        <p className="text-gray-500 font-bold mb-6">
                          Review the lesson and try again to unlock this topic.
                        </p>
                        <button
                          onClick={() => {
                            setShowQuiz(false);
                            setQuizSubmitted(false);
                            setUserAnswers({});
                            setQuizResults(null);
                          }}
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