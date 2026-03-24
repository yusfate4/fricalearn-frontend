import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import { Loader2, PlayCircle, ArrowRight, Award, AlertCircle, Volume2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

export default function StudentQuizView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Game States
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    // Fetch questions for this specific lesson
    api.get(`/lessons/${lessonId}/questions`)
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(() => navigate("/dashboard"));
  }, [lessonId]);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (letter: string) => {
    if (showExplanation) return; // Prevent clicking while watching video
    setSelectedOption(letter);
  };

  const checkAnswer = () => {
    if (!selectedOption) return;

    const correct = selectedOption === currentQuestion.correct_answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      // If correct, wait 1 second and move on
      setTimeout(() => {
        nextQuestion();
      }, 1200);
    } else {
      // 📽️ FAIL-SAFE TRIGGER: If wrong, show the tutor video!
      setShowExplanation(true);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuizComplete(true);
      submitResults();
    }
  };

  const submitResults = async () => {
    // Award points based on final score
    try {
      await api.post(`/lessons/${lessonId}/complete`, {
        score: (score / questions.length) * 100,
        points: score * 10 // e.g., 10 points per correct answer
      });
    } catch (err) {
      console.error("Failed to save progress");
    }
  };

  // Helper to convert YouTube Watch link to Embed link
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    return url.replace("watch?v=", "embed/").split("&")[0];
  };

  if (loading) return <Layout><div className="flex justify-center mt-20"><Loader2 className="animate-spin text-[#2D5A27]" size={48} /></div></Layout>;

  if (quizComplete) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto p-6 md:p-12 text-center animate-in zoom-in duration-500">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border-4 border-gray-50">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-200">
              <Award size={48} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-800 uppercase italic tracking-tighter">Lesson Complete!</h1>
            <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-sm">Great job practicing your Yoruba</p>
            
            <div className="grid grid-cols-2 gap-4 mt-10">
              <div className="bg-gray-50 p-6 rounded-3xl">
                <p className="text-[10px] font-black text-gray-400 uppercase">Correct</p>
                <p className="text-3xl font-black text-[#2D5A27]">{score} / {questions.length}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-3xl">
                <p className="text-[10px] font-black text-gray-400 uppercase">FricaCoins</p>
                <p className="text-3xl font-black text-yellow-500">+{score * 10}</p>
              </div>
            </div>

            <button 
              onClick={() => navigate("/dashboard")}
              className="w-full mt-10 bg-gray-900 text-white py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 md:p-10">
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-3 rounded-full mb-8 overflow-hidden flex">
            <div 
              className="bg-[#2D5A27] h-full transition-all duration-500" 
              style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
            ></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT: THE QUESTION CARD */}
          <div className={`space-y-6 transition-all duration-500 ${showExplanation ? 'opacity-30 pointer-events-none scale-95' : 'opacity-100'}`}>
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border-2 border-gray-50">
              <span className="text-[10px] font-black text-[#2D5A27] bg-[#2D5A27]/10 px-3 py-1 rounded-full uppercase tracking-widest">
                Question {currentIndex + 1}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-800 mt-4 leading-tight">
                {currentQuestion.question_text}
              </h2>

              <div className="mt-8 space-y-3">
                {["a", "b", "c"].map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleOptionClick(letter)}
                    className={`w-full p-5 rounded-2xl border-2 font-bold text-left transition-all flex items-center justify-between group ${
                      selectedOption === letter 
                        ? 'border-[#2D5A27] bg-[#2D5A27] text-white shadow-lg' 
                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-[#2D5A27]/30'
                    }`}
                  >
                    <span className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center uppercase text-xs font-black ${selectedOption === letter ? 'bg-white/20' : 'bg-white border border-gray-100'}`}>
                            {letter}
                        </span>
                        {currentQuestion[`option_${letter}`]}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={checkAnswer}
                disabled={!selectedOption || isCorrect !== null}
                className="w-full mt-8 bg-gray-900 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-[#2D5A27] disabled:opacity-20 transition-all"
              >
                Check Answer
              </button>
            </div>
          </div>

          {/* RIGHT: THE FAIL-SAFE TUTOR VIDEO (Revealed on error) */}
          <div className="relative">
            {showExplanation ? (
              <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl border-2 border-red-100 animate-in slide-in-from-right-10 duration-500 sticky top-10">
                <div className="flex items-center gap-3 text-red-500 mb-6">
                    <div className="bg-red-100 p-2 rounded-xl"><AlertCircle size={24}/></div>
                    <p className="font-black uppercase italic tracking-tighter text-lg">Not quite! Watch this...</p>
                </div>

                {currentQuestion.explanation_video_url ? (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner bg-black mb-6">
                    <iframe 
                      src={getEmbedUrl(currentQuestion.explanation_video_url)} 
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                    <div className="aspect-video w-full rounded-2xl bg-gray-100 flex flex-col items-center justify-center text-center p-6 mb-6">
                        <PlayCircle size={48} className="text-gray-300 mb-2"/>
                        <p className="text-gray-400 font-bold text-sm">No video for this one, but here's a hint!</p>
                    </div>
                )}

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                    <p className="text-sm text-gray-600 font-bold leading-relaxed italic">
                        "{currentQuestion.explanation_text || "Take another look at the lesson content and try again!"}"
                    </p>
                </div>

                <button 
                  onClick={nextQuestion}
                  className="w-full bg-[#2D5A27] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg"
                >
                  Got it, Next Question <ArrowRight size={20}/>
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex h-full flex-col items-center justify-center text-center opacity-10">
                <Volume2 size={80} className="mb-4 text-gray-400" />
                <p className="font-black uppercase italic text-2xl">Yusuf is listening...</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}