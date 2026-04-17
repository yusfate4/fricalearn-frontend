import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import {
  ArrowLeft,
  HelpCircle,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import SuccessModal from "../components/SuccessModal";
import StudentQuiz from "../components/StudentQuiz";
import LevelUpModal from "../components/LevelUpModal";
import { useAuth } from "../hooks/useAuth";

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizFailed, setQuizFailed] = useState(false);
  const [finalPoints, setFinalPoints] = useState(0);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [newLevel, setNewLevel] = useState<number | null>(null);

  const studentName = user?.name || "Explorer";
  const learningLanguage = user?.student_profile?.learning_language || "Yoruba";

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : url;
  };

  useEffect(() => {
    setLoading(true);
    api.get(`/lessons/${id}`)
      .then((res) => {
        setLesson(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  /**
   * 🏆 Handle Quiz Completion
   * Receives percentageScore (0-100) from StudentQuiz.tsx
   */
  const handleQuizCompletion = async (percentageScore: number, passed: boolean) => {
    // Calculate display points: (Total Possible Points) * (Score Percentage)
    const possiblePoints = (lesson.questions?.length || 0) * 5;
    const pointsEarned = Math.round(possiblePoints * (percentageScore / 100));
    setFinalPoints(pointsEarned);

    if (passed) {
      setQuizFailed(false);
      try {
        // 🚀 THE FIX: Send score (numeric 0-100) to stop the 422 error
        const response = await api.post(`/lessons/${id}/complete`, {
          score: percentageScore,
          points: pointsEarned,
        });

        if (response.data.leveled_up) {
          setNewLevel(response.data.new_level);
          setIsLevelModalOpen(true);
          confetti({ particleCount: 250, spread: 100, origin: { y: 0.5 } });
        } else {
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
          setIsModalOpen(true);
        }
      } catch (e) {
        // Fallback for network issues
        setIsModalOpen(true);
      }
    } else {
      setQuizFailed(true);
    }
  };

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center p-20">
        <Loader2 className="animate-spin text-[#2D5A27] mb-6" size={48} />
        <p className="font-black text-gray-400 italic uppercase tracking-widest text-sm">
          Olukọ is preparing your lesson...
        </p>
      </div>
    </Layout>
  );

  if (!lesson) return (
    <Layout>
      <div className="p-20 text-center text-red-500 font-black uppercase tracking-tighter text-2xl">
        Lesson not found.
      </div>
    </Layout>
  );

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
          Back to library
        </button>

        {!showQuiz ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <h1 className="text-4xl md:text-7xl font-black mb-8 text-gray-800 tracking-tighter italic uppercase leading-none">
              {lesson.title}
            </h1>

            {/* 📺 Main Video Content */}
            {lesson.video_url && (
              <div className="aspect-video w-full bg-black rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl mb-12 border-4 border-white ring-1 ring-gray-100">
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(lesson.video_url)}
                  title={lesson.title}
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {/* 📝 Olukọ's Notes Section */}
            <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-sm border-2 border-gray-50 mb-12 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2.5 h-full bg-[#2D5A27] group-hover:w-4 transition-all duration-500"></div>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles size={20} className="text-[#F4B400]" />
                <h2 className="text-2xl font-black text-gray-800 italic uppercase tracking-tight">
                  Olukọ's Notes
                </h2>
              </div>
              <div className="text-gray-600 text-lg md:text-xl leading-relaxed whitespace-pre-line font-medium italic">
                {lesson.content}
              </div>
            </div>

            {/* 📁 Lesson Materials / Attachments */}
            {lesson.contents && lesson.contents.length > 0 && (
              <div className="mb-16 space-y-8">
                <div className="flex items-center gap-4 ml-4">
                   <div className="h-px flex-1 bg-gray-100"></div>
                   <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
                     Learning Resources
                   </h3>
                   <div className="h-px flex-1 bg-gray-100"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lesson.contents.map((content: any) => (
                    <div key={content.id} className="animate-in zoom-in-95 duration-500">
                      {content.content_type === "image" && (
                        <img
                          src={content.file_url}
                          alt="Visual Context"
                          className="w-full rounded-[2.5rem] border-4 border-white shadow-xl hover:scale-[1.02] transition-transform duration-500"
                        />
                      )}
                      {content.content_type === "document" && (
                        <div className="h-full flex flex-col justify-between bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 hover:border-[#2D5A27] transition-all shadow-sm group">
                          <div className="flex items-center gap-5 mb-6">
                            <div className="bg-red-50 p-5 rounded-2xl text-red-500 group-hover:scale-110 transition-transform">
                              <FileText size={36} />
                            </div>
                            <div>
                              <h4 className="font-black text-gray-800 text-lg uppercase italic leading-none mb-1">
                                Study Guide
                              </h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                Practice Worksheet (PDF)
                              </p>
                            </div>
                          </div>
                          <a
                            href={content.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-center bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-[#2D5A27] transition-all"
                          >
                            Download PDF
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Trigger */}
            <div className="flex justify-center py-6">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setShowQuiz(true);
                }}
                className="flex items-center gap-5 bg-[#2D5A27] text-white px-12 py-7 rounded-[2.5rem] font-black text-2xl hover:bg-black transition-all shadow-2xl hover:-translate-y-2 active:scale-95 group"
              >
                <HelpCircle size={28} className="text-[#F4B400] group-hover:rotate-12 transition-transform" />
                Unlock Your Knowledge
              </button>
            </div>
          </div>
        ) : quizFailed ? (
          <div className="bg-white p-12 md:p-24 rounded-[3.5rem] shadow-2xl border-4 border-gray-50 text-center animate-in zoom-in-95 duration-500">
            <div className="text-9xl mb-10 animate-bounce">🦒</div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-6 italic uppercase tracking-tighter">
              Ó tọ́ díẹ̀, {studentName}!
            </h2>
            <p className="text-gray-400 font-bold mb-10 text-xl leading-relaxed">
              Every master was once a student. <br/> Review Olukọ's notes and try one more time!
            </p>
            <button
              onClick={() => {
                setQuizFailed(false);
                setShowQuiz(false); // 💡 Return to notes for review
              }}
              className="bg-gray-900 text-white px-14 py-7 rounded-[2rem] font-black text-xl shadow-xl uppercase italic tracking-widest hover:bg-[#2D5A27] transition-all"
            >
              Review Lesson
            </button>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-10 duration-700">
            <StudentQuiz
              lessonId={id as string}
              questions={lesson.questions}
              onQuizComplete={handleQuizCompletion}
              onReviewLesson={() => setShowQuiz(false)}
              alreadyPassed={lesson.is_completed} 
            />
          </div>
        )}

        {/* --- REWARD MODALS --- */}
        <SuccessModal
          isOpen={isModalOpen}
          studentName={studentName}
          language={learningLanguage}
          points={finalPoints}
          onConfirm={() => navigate("/courses")}
        />

        <LevelUpModal
          level={newLevel || 1}
          isOpen={isLevelModalOpen}
          studentName={studentName}
          language={learningLanguage}
          onClose={() => {
            setIsLevelModalOpen(false);
            navigate("/courses");
          }}
        />
      </div>
    </Layout>
  );
}