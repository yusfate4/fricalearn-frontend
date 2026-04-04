import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import {
  ArrowLeft,
  HelpCircle,
  FileText,
  Loader2,
  PlayCircle,
  Image as ImageIcon,
  Download,
} from "lucide-react";
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

  const handleQuizCompletion = async (score: number, passed: boolean) => {
    setFinalScore(score);
    if (passed) {
      setQuizFailed(false);
      try {
        const percentageScore = Math.round(
          (score / (lesson.questions?.length || 1)) * 100,
        );
        const response = await api.post(`/lessons/${id}/complete`, {
          score: percentageScore,
          points: score * 10,
        });

        if (response.data.leveled_up) {
          setNewLevel(response.data.new_level);
          setIsLevelModalOpen(true);
          confetti({ particleCount: 250, spread: 100, origin: { y: 0.5 } });
        } else {
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
          className="flex items-center text-gray-400 mb-6 hover:text-[#2D5A27] font-black uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft size={14} className="mr-2" /> Back to Course
        </button>

        {!showQuiz ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-6 text-gray-800 tracking-tighter italic">
              {lesson.title}
            </h1>

            {/* 📺 Main YouTube Video */}
            {lesson.video_url && (
              <div className="aspect-video w-full bg-black rounded-[2rem] overflow-hidden shadow-2xl mb-8 border-4 border-white">
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(lesson.video_url)}
                  title={lesson.title}
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {/* 📝 Tutor Notes */}
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border-2 border-gray-50 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#2D5A27]"></div>
              <h2 className="text-xl font-black text-gray-800 italic uppercase mb-4">
                Tutor's Notes
              </h2>
              <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line font-medium italic">
                {lesson.content}
              </div>
            </div>

            {/* 📁 Uploaded Media Contents (Images, Cloudinary Videos, PDFs) */}
            {lesson.contents && lesson.contents.length > 0 && (
              <div className="mb-12 space-y-8">
                <h3 className="text-sm font-black text-[#2D5A27] uppercase tracking-widest ml-4">
                  Lesson Materials
                </h3>
                {lesson.contents.map((content: any) => (
                  <div
                    key={content.id}
                    className="group animate-in zoom-in-95 duration-300"
                  >
                    {/* 🎥 Cloudinary Video */}
                    {content.content_type === "video" && (
                      <div className="rounded-[2rem] overflow-hidden border-4 border-gray-900 shadow-xl bg-black">
                        <video
                          src={content.file_url}
                          controls
                          className="w-full h-auto"
                        ></video>
                      </div>
                    )}

                    {/* 🖼️ Lesson Image */}
                    {content.content_type === "image" && (
                      <div className="relative">
                        <img
                          src={content.file_url}
                          alt="Lesson Visual"
                          className="w-full rounded-[2rem] border-4 border-white shadow-xl"
                        />
                      </div>
                    )}

                    {/* 📄 PDF / Documents */}
                    {content.content_type === "document" && (
                      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 sm:p-8 rounded-[2.5rem] border-2 border-gray-100 gap-4 hover:border-[#2D5A27] transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="bg-red-50 p-4 rounded-2xl text-red-500">
                            <FileText size={32} />
                          </div>
                          <div>
                            <h4 className="font-black text-gray-800 text-lg uppercase italic leading-tight">
                              Worksheet / PDF
                            </h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              Download for practice
                            </p>
                          </div>
                        </div>
                        <a
                          href={`${content.file_url}?fl_attachment`} // Forces the browser to download the PDF
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 bg-[#2D5A27] text-white px-8 py-4 rounded-2xl font-black shadow-lg text-sm uppercase hover:scale-105 transition-transform"
                        >
                          <Download size={18} /> View PDF
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 🏁 Start Quiz Button */}
            <div className="flex justify-center py-10">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setShowQuiz(true);
                }}
                className="flex items-center gap-4 bg-gray-900 text-white px-10 py-6 rounded-[2rem] font-black text-xl hover:bg-[#2D5A27] hover:scale-105 transition-all shadow-2xl w-full sm:w-auto justify-center"
              >
                <HelpCircle size={24} className="text-yellow-400" /> Start Quiz
                Challenge!
              </button>
            </div>
          </div>
        ) : quizFailed ? (
          <div className="bg-white p-12 md:p-20 rounded-[3rem] shadow-2xl border-4 border-gray-50 text-center">
            <div className="text-8xl mb-8 animate-bounce">🦒</div>
            <h2 className="text-4xl font-black text-gray-800 mb-4 italic uppercase">
              Ayo, Keep Going!
            </h2>
            <p className="text-gray-400 font-bold mb-8 text-lg">
              You got{" "}
              <span className="text-red-500 font-black">{finalScore}</span>{" "}
              correct. Let's try again!
            </p>
            <button
              onClick={() => setQuizFailed(false)}
              className="bg-[#2D5A27] text-white px-12 py-6 rounded-2xl font-black text-lg shadow-xl uppercase italic"
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
