import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import {
  ArrowLeft,
  HelpCircle,
  FileText,
  Download,
  Presentation,
  Video,
  Image as ImageIcon,
  Volume2,
} from "lucide-react";
import confetti from "canvas-confetti";
import SuccessModal from "../components/SuccessModal";

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- States ---
  const [lesson, setLesson] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizFailed, setQuizFailed] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- Helpers ---
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
      .catch((err) => {
        console.error("Could not load lesson content", err);
        setLoading(false);
      });
  }, [id]);

  const playSuccessSound = () => {
    const audio = new Audio("/sounds/success.mp3");
    audio.volume = 0.4;
    audio.play().catch((e) => console.log("Audio play blocked", e));
  };

  const handleAnswer = (selectedOption: string) => {
    if (!lesson?.questions) return;

    const currentQuestion = lesson.questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correct_answer;
    const newScore = isCorrect ? score + 1 : score;

    if (currentQuestionIndex + 1 < lesson.questions.length) {
      setScore(newScore);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishLesson(newScore);
    }
  };

  const finishLesson = async (finalScore: number) => {
    const totalQuestions = lesson.questions.length;
    const passed = finalScore === totalQuestions;

    if (passed) {
      setQuizFailed(false);
      playSuccessSound();
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2D5A27", "#EAB308", "#FFFFFF"],
      });

      try {
        await api.post(`/lessons/${id}/complete`);
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error saving progress", error);
        setIsModalOpen(true);
      }
    } else {
      setQuizFailed(true);
      setScore(finalScore);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="p-20 text-center font-bold text-gray-400">
          Loading FricaLearn Content...
        </div>
      </Layout>
    );

  if (!lesson)
    return (
      <Layout>
        <div className="p-20 text-center text-red-500 font-bold">
          Lesson not found.
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 mb-8 hover:text-frica-green font-bold transition-colors uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Course
        </button>

        {!showQuiz ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl md:text-5xl font-black mb-8 text-gray-800 tracking-tighter italic">
              {lesson.title}
            </h1>

            {/* --- LEGACY: YOUTUBE PLAYER (Only shows if URL exists) --- */}
            {lesson.video_url && (
              <div className="aspect-video w-full bg-black rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl mb-10 border-4 border-white">
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(lesson.video_url)}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {/* --- LESSON TEXT NOTES --- */}
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border-2 border-gray-50 mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-frica-green rounded-full"></div>
                <h2 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter">
                  Lesson Notes
                </h2>
              </div>
              <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line font-medium">
                {lesson.content}
              </div>
            </div>

            {/* 🔥 NEW: RENDER UPLOADED MEDIA (MP4s, PDFs, Images, Audio) 🔥 */}
            {lesson.contents && lesson.contents.length > 0 && (
              <div className="mb-10 space-y-6">
                {lesson.contents.map((content: any) => (
                  <div
                    key={content.id}
                    className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-sm border-2 border-gray-50 overflow-hidden"
                  >
                    {/* Render Video */}
                    {content.content_type === "video" && (
                      <div className="w-full bg-black rounded-[1.5rem] overflow-hidden shadow-inner border-4 border-gray-900">
                        <video
                          src={`http://127.0.0.1:8000${content.file_url}`}
                          controls
                          className="w-full h-auto max-h-[500px]"
                          controlsList="nodownload"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}

                    {/* Render Image */}
                    {content.content_type === "image" && (
                      <img
                        src={`http://127.0.0.1:8000${content.file_url}`}
                        alt="Lesson Visual"
                        className="w-full h-auto rounded-[1.5rem] object-cover border-2 border-gray-50"
                      />
                    )}

                    {/* Render Document (PDF) */}
                    {content.content_type === "document" && (
                      <div className="flex flex-col sm:flex-row items-center justify-between bg-green-50 p-6 rounded-[1.5rem] border border-green-100 gap-4">
                        <div className="flex items-center gap-4 w-full">
                          <div className="bg-white p-3 md:p-4 rounded-2xl text-frica-green shadow-sm">
                            <FileText size={32} />
                          </div>
                          <div>
                            <h4 className="font-black text-gray-800 text-lg md:text-xl tracking-tight">
                              Lesson Worksheet
                            </h4>
                            <p className="text-sm text-gray-500 font-bold">
                              Download to complete the exercises
                            </p>
                          </div>
                        </div>
                        <a
                          href={`http://127.0.0.1:8000${content.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto bg-[#2D5A27] text-white px-8 py-4 rounded-xl font-black shadow-lg hover:shadow-green-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          <Download size={18} /> Download PDF
                        </a>
                      </div>
                    )}

                    {/* Render Audio */}
                    {content.content_type === "audio" && (
                      <div className="bg-blue-50 p-6 md:p-8 rounded-[1.5rem] border border-blue-100 w-full flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-blue-800 font-black uppercase tracking-widest text-xs">
                          <Volume2 size={16} /> Pronunciation Guide
                        </div>
                        <audio controls className="w-full rounded-full">
                          <source
                            src={`http://127.0.0.1:8000${content.file_url}`}
                          />
                        </audio>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* --- LEGACY: ATTACHMENTS (kept so old lessons don't break) --- */}
            {lesson.attachments && lesson.attachments.length > 0 && (
              <div className="bg-gray-50 p-8 md:p-10 rounded-[2.5rem] border-2 border-dashed border-gray-200 mb-10">
                <h3 className="text-xl font-black mb-6 text-gray-800 flex items-center gap-3 tracking-tighter uppercase italic">
                  <FileText size={24} className="text-gray-400" />
                  Additional Materials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.attachments.map((file: any) => (
                    <a
                      key={file.id}
                      href={`http://127.0.0.1:8000${file.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-transparent hover:border-gray-200 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center space-x-4">
                        {file.file_type === "pptx" ? (
                          <Presentation className="text-orange-500" size={24} />
                        ) : (
                          <FileText className="text-blue-500" size={24} />
                        )}
                        <span className="font-bold text-gray-600 truncate max-w-[150px] md:max-w-[180px]">
                          {file.file_name}
                        </span>
                      </div>
                      <Download
                        size={20}
                        className="text-gray-300 group-hover:text-frica-green"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center pb-20 pt-10">
              <button
                onClick={() => setShowQuiz(true)}
                className="flex items-center gap-3 bg-gray-900 text-white px-12 py-6 rounded-[2rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-gray-900/20"
              >
                <HelpCircle size={28} className="text-yellow-400" />
                Take the Quiz!
              </button>
            </div>
          </div>
        ) : (
          /* --- QUIZ SECTION --- */
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border-4 border-gray-50 animate-in zoom-in duration-300">
            {quizFailed ? (
              <div className="text-center py-10 animate-in fade-in zoom-in">
                <div className="text-7xl mb-6">🦒</div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">
                  Almost There!
                </h2>
                <p className="text-gray-500 font-bold mb-8 text-lg">
                  You got <span className="text-red-500">{score}</span> out of{" "}
                  {lesson.questions.length} correct. <br />
                  Keep practicing, you're doing great!
                </p>

                <div className="flex flex-col gap-4 items-center">
                  <button
                    onClick={() => {
                      setQuizFailed(false);
                      setCurrentQuestionIndex(0);
                      setScore(0);
                    }}
                    className="bg-[#2D5A27] text-white px-12 py-5 rounded-[2rem] font-black text-xl shadow-xl hover:scale-105 transition-all w-full max-w-xs"
                  >
                    Try Again
                  </button>

                  <button
                    onClick={() => {
                      setQuizFailed(false);
                      setShowQuiz(false);
                      setCurrentQuestionIndex(0);
                      setScore(0);
                    }}
                    className="text-gray-400 font-black hover:text-gray-600 transition-colors uppercase text-sm tracking-widest"
                  >
                    Review Lesson Notes
                  </button>
                </div>
              </div>
            ) : lesson.questions && lesson.questions.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-10">
                  <span className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-full font-black text-xs uppercase tracking-widest">
                    Question {currentQuestionIndex + 1} of{" "}
                    {lesson.questions.length}
                  </span>
                  <div className="h-3 w-32 md:w-48 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-frica-green transition-all duration-500"
                      style={{
                        width: `${((currentQuestionIndex + 1) / lesson.questions.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-black mb-12 text-gray-800 leading-tight tracking-tight">
                  {lesson.questions[currentQuestionIndex]?.question_text}
                </h2>

                <div className="grid gap-4">
                  {["a", "b", "c"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="w-full text-left p-6 md:p-8 rounded-[2rem] border-2 border-gray-100 hover:border-frica-green hover:bg-green-50 transition-all font-bold text-xl text-gray-700 flex justify-between items-center group active:scale-[0.98]"
                    >
                      <span>
                        {
                          lesson.questions[currentQuestionIndex]?.[
                            `option_${opt}`
                          ]
                        }
                      </span>
                      <div className="w-8 h-8 rounded-full border-2 border-gray-200 group-hover:border-frica-green group-hover:bg-white flex items-center justify-center transition-all">
                        <div className="w-3 h-3 bg-frica-green rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <HelpCircle size={80} className="mx-auto text-gray-100 mb-6" />
                <h2 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">
                  No Quiz Ready Yet!
                </h2>
                <p className="text-gray-500 font-medium mb-10">
                  Our teachers are still preparing the questions for this
                  lesson.
                </p>
                <button
                  onClick={() => setShowQuiz(false)}
                  className="bg-gray-50 text-gray-600 border-2 border-gray-100 px-10 py-4 rounded-2xl font-black text-lg hover:bg-gray-100 transition-colors"
                >
                  Go Back to Lesson
                </button>
              </div>
            )}
          </div>
        )}

        <SuccessModal
          isOpen={isModalOpen}
          title="Ẹ kú iṣẹ́!"
          message={`Perfect score on ${lesson.title}! You earned 50 points.`}
          points={50}
          onConfirm={() => navigate("/dashboard")}
        />
      </div>
    </Layout>
  );
}
