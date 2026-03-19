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
} from "lucide-react";
import confetti from "canvas-confetti";
import SuccessModal from "../components/SuccessModal";

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- States ---
  const [lesson, setLesson] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizFailed, setQuizFailed] = useState(false); // 👈 Fixed: Moved inside component
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- Helpers ---
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
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
      setScore(finalScore); // Store final score to display to student
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
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 mb-8 hover:text-frica-green font-bold transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Course
        </button>

        {!showQuiz ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-black mb-8 text-gray-800 tracking-tight">
              {lesson.title}
            </h1>

            <div className="aspect-video w-full bg-black rounded-[2rem] overflow-hidden shadow-2xl mb-10 border-4 border-white">
              <iframe
                className="w-full h-full"
                src={getEmbedUrl(lesson.video_url)}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 mb-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-8 bg-frica-green rounded-full"></div>
                <h2 className="text-2xl font-black text-gray-800">
                  Lesson Notes
                </h2>
              </div>
              <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line font-medium">
                {lesson.content}
              </div>
            </div>

            {lesson.attachments && lesson.attachments.length > 0 && (
              <div className="bg-green-50/50 p-10 rounded-[2.5rem] border-2 border-dashed border-green-100 mb-10">
                <h3 className="text-xl font-black mb-6 text-[#2D5A27] flex items-center gap-3">
                  <FileText size={28} />
                  Lesson Materials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.attachments.map((file: any) => (
                    <a
                      key={file.id}
                      href={`http://127.0.0.1:8000${file.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-5 bg-white rounded-2xl border border-green-100 hover:shadow-xl hover:border-frica-green transition-all group"
                    >
                      <div className="flex items-center space-x-4">
                        {file.file_type === "pptx" ? (
                          <Presentation className="text-orange-500" size={24} />
                        ) : (
                          <FileText className="text-blue-500" size={24} />
                        )}
                        <span className="font-bold text-gray-700 truncate max-w-[180px]">
                          {file.file_name}
                        </span>
                      </div>
                      <Download size={20} className="text-gray-300 group-hover:text-frica-green" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center pb-20">
              <button
                onClick={() => setShowQuiz(true)}
                className="flex items-center gap-3 bg-[#2D5A27] text-white px-12 py-5 rounded-[2rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-green-200"
              >
                <HelpCircle size={28} />
                Take the Quiz!
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-frica-green animate-in zoom-in duration-300">
            {quizFailed ? (
              <div className="text-center py-10 animate-in fade-in zoom-in">
                <div className="text-7xl mb-6">🦒</div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">Almost There!</h2>
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
                  <span className="px-4 py-2 bg-green-50 text-frica-green rounded-full font-black text-sm uppercase tracking-widest">
                    Question {currentQuestionIndex + 1} of {lesson.questions.length}
                  </span>
                  <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-frica-green transition-all duration-500"
                      style={{ width: `${((currentQuestionIndex + 1) / lesson.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <h2 className="text-3xl font-black mb-10 text-gray-800 leading-tight">
                  {lesson.questions[currentQuestionIndex]?.question_text}
                </h2>

                <div className="grid gap-4">
                  {["a", "b", "c"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="w-full text-left p-6 rounded-3xl border-2 border-gray-100 hover:border-frica-green hover:bg-green-50 transition-all font-bold text-xl text-gray-700 flex justify-between items-center group active:scale-[0.98]"
                    >
                      <span>{lesson.questions[currentQuestionIndex]?.[`option_${opt}`]}</span>
                      <div className="w-8 h-8 rounded-full border-2 border-gray-200 group-hover:border-frica-green group-hover:bg-white flex items-center justify-center transition-all">
                        <div className="w-3 h-3 bg-frica-green rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <HelpCircle size={80} className="mx-auto text-gray-200 mb-6" />
                <h2 className="text-3xl font-black text-gray-800 mb-4">No Quiz Ready Yet!</h2>
                <p className="text-gray-500 font-bold mb-10">Our teachers are still preparing the questions for this lesson.</p>
                <button
                  onClick={() => setShowQuiz(false)}
                  className="bg-gray-100 text-gray-600 px-10 py-4 rounded-2xl font-black text-lg hover:bg-gray-200 transition-colors"
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