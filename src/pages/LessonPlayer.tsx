import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import { ArrowLeft, HelpCircle, FileText, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import SuccessModal from "../components/SuccessModal";
import StudentQuiz from "../components/StudentQuiz";
import LevelUpModal from "../components/LevelUpModal";

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizFailed, setQuizFailed] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [newLevel, setNewLevel] = useState<number | null>(null);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  useEffect(() => {
    setLoading(true);
    api
      .get(`/lessons/${id}`)
      .then((res) => {
        setLesson(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  /**
   * Enhanced Quiz Completion Handler
   */
  const handleQuizCompletion = async (score: number, passed: boolean) => {
    setFinalScore(score);
    if (passed) {
      setQuizFailed(false);

      try {
        const percentageScore = Math.round(
          (score / lesson.questions.length) * 100,
        );
        const response = await api.post(`/lessons/${id}/complete`, {
          score: percentageScore,
          points: score * 10,
        });

        if (response.data.leveled_up) {
          const levelUpAudio = new Audio("/sounds/level-up-epic.mp3");
          levelUpAudio.volume = 0.6;
          levelUpAudio.play().catch(() => {});

          setNewLevel(response.data.new_level);
          setIsLevelModalOpen(true);

          confetti({
            particleCount: 250,
            spread: 100,
            origin: { y: 0.5 },
            colors: ["#F4B400", "#2D5A27", "#ffffff"],
          });
        } else {
          const audio = new Audio("/sounds/success.mp3");
          audio.volume = 0.4;
          audio.play().catch(() => {});

          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          setIsModalOpen(true);
        }
      } catch (e) {
        setIsModalOpen(true);
      }
    } else {
      setQuizFailed(true);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="p-20 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-[#2D5A27] mb-4" size={40} />
          <p className="font-bold text-gray-400 italic">
            Gathering your lesson...
          </p>
        </div>
      </Layout>
    );

  if (!lesson)
    return (
      <Layout>
        <div className="p-20 text-center text-red-500 font-bold uppercase">
          Lesson not found.
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 md:p-6 pb-24">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 mb-6 sm:mb-8 hover:text-[#2D5A27] font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px]"
        >
          <ArrowLeft size={14} className="mr-2" /> Back to Course
        </button>

        {!showQuiz ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8 text-gray-800 tracking-tighter italic leading-tight">
              {lesson.title}
            </h1>

            {lesson.video_url && (
              <div className="aspect-video w-full bg-black rounded-[1.5rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl mb-8 sm:mb-12 border-4 sm:border-8 border-white group">
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(lesson.video_url)}
                  title={lesson.title}
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <div className="bg-white p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[3rem] shadow-sm border-2 border-gray-50 mb-8 sm:mb-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#2D5A27]"></div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-800 italic uppercase tracking-tighter mb-6 flex items-center gap-3">
                Tutor's Notes
              </h2>
              <div className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed whitespace-pre-line font-medium italic">
                {lesson.content}
              </div>
            </div>

            {/* Media Contents */}
            {lesson.contents && lesson.contents.length > 0 && (
              <div className="mb-8 sm:mb-12 space-y-6 sm:space-y-8">
                {lesson.contents.map((content: any) => (
                  <div
                    key={content.id}
                    className="bg-white p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] shadow-sm border-2 border-gray-50 overflow-hidden"
                  >
                    {content.content_type === "video" && (
                      <video
                        src={`http://127.0.0.1:8000${content.file_url}`}
                        controls
                        className="w-full h-auto rounded-[1rem] border-4 border-gray-900"
                      ></video>
                    )}
                    {content.content_type === "image" && (
                      <img
                        src={`http://127.0.0.1:8000${content.file_url}`}
                        alt="Lesson"
                        className="w-full rounded-[1rem] border-2 sm:border-4 border-white shadow-lg"
                      />
                    )}
                    {content.content_type === "document" && (
                      <div className="flex flex-col sm:flex-row items-center justify-between bg-green-50 p-6 sm:p-8 rounded-[1.5rem] border-2 border-green-100 gap-4 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                          <div className="bg-white p-3 rounded-xl text-[#2D5A27] shadow-sm">
                            <FileText size={28} />
                          </div>
                          <div>
                            <h4 className="font-black text-gray-800 text-lg uppercase italic leading-tight">
                              Worksheet
                            </h4>
                          </div>
                        </div>
                        <a
                          href={`http://127.0.0.1:8000${content.file_url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full sm:w-auto bg-[#2D5A27] text-white px-8 py-4 rounded-xl font-black shadow-xl text-sm uppercase"
                        >
                          GET PDF
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center py-6 sm:py-10">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setShowQuiz(true);
                }}
                className="flex items-center gap-3 sm:gap-4 bg-gray-900 text-white px-8 py-5 sm:px-14 sm:py-7 rounded-[1.5rem] font-black text-xl sm:text-2xl hover:bg-[#2D5A27] hover:scale-105 transition-all shadow-2xl w-full sm:w-auto justify-center"
              >
                <HelpCircle size={24} className="text-yellow-400" /> Start Quiz
                Challenge!
              </button>
            </div>
          </div>
        ) : quizFailed ? (
          <div className="bg-white p-10 sm:p-20 rounded-[2.5rem] shadow-2xl border-4 border-gray-50 text-center py-16">
            <div className="text-6xl sm:text-8xl mb-8 animate-bounce">🦒</div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mb-4 italic uppercase tracking-tighter">
              Ayo, Keep Going!
            </h2>
            <p className="text-gray-400 font-bold mb-8 text-lg px-4 leading-relaxed">
              You got{" "}
              <span className="text-red-500 font-black">{finalScore}</span>{" "}
              correct. Let's try again!
            </p>
            <button
              onClick={() => setQuizFailed(false)}
              className="bg-[#2D5A27] text-white px-10 py-5 rounded-[1.5rem] font-black text-lg shadow-2xl uppercase italic w-full max-w-sm"
            >
              Retry Quiz
            </button>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-10 duration-500">
            <StudentQuiz
              lessonId={id as string}
              questions={lesson.questions}
              onQuizComplete={handleQuizCompletion}
              onReviewLesson={() => setShowQuiz(false)}
            />
          </div>
        )}

        {/* 🏆 Success Modals */}
        <SuccessModal
          isOpen={isModalOpen}
          title="Ẹ kú iṣẹ́!"
          message={`Amazing Ayo! You earned ${finalScore * 10} FricaCoins!`}
          points={finalScore * 10}
          onConfirm={() => navigate("/dashboard")}
        />

        <LevelUpModal
          level={newLevel || 1}
          isOpen={isLevelModalOpen}
          onClose={() => {
            setIsLevelModalOpen(false);
            navigate("/dashboard");
          }}
        />
      </div>
    </Layout>
  );
}
