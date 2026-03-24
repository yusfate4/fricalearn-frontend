import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import {
  HelpCircle,
  Save,
  Loader2,
  CheckCircle,
  Video,
  MessageCircle,
  ChevronLeft,
  Sparkles, // 👈 Added for AI
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminQuiz() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false); // 👈 New AI state
  const [success, setSuccess] = useState(false);

  const [questionData, setQuestionData] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    correct_answer: "a",
    explanation_video_url: "",
    explanation_text: "",
  });

  useEffect(() => {
    api.get("/admin/courses").then((res) => {
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setCourses(data);
    });
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      api
        .get(`/courses/${selectedCourse}`)
        .then((res) => {
          const courseData = res.data;
          const allLessons =
            courseData.modules?.flatMap((m: any) => m.lessons || []) || [];
          setLessons(allLessons);
        })
        .catch(() => setLessons([]));
    } else {
      setLessons([]);
    }
  }, [selectedCourse]);

  /**
   * 🤖 AI MAGIC: Generate Question from Lesson
   */
  const handleAIGenerate = async () => {
    if (!selectedLesson) return alert("Please select a lesson first!");

    setGeneratingAI(true);
    try {
      const res = await api.post("/admin/ai/generate-quiz", {
        lesson_id: selectedLesson,
        count: 1, // We'll generate one high-quality question at a time for this form
      });

      if (res.data.success && res.data.data.length > 0) {
        const aiQ = res.data.data[0];

        // Auto-fill the form with AI data
        setQuestionData({
          question_text: aiQ.question_text,
          option_a: aiQ.options[0]?.option_text || "",
          option_b: aiQ.options[1]?.option_text || "",
          option_c: aiQ.options[2]?.option_text || "",
          correct_answer: aiQ.options[0]?.is_correct
            ? "a"
            : aiQ.options[1]?.is_correct
              ? "b"
              : "c",
          explanation_video_url: "",
          explanation_text: aiQ.explanation,
        });
      }
    } catch (err) {
      console.error("AI Generation failed", err);
      alert("AI was unable to generate a question. Check your OpenAI key.");
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/admin/questions", {
        ...questionData,
        lesson_id: selectedLesson,
      });
      setSuccess(true);
      setQuestionData({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        correct_answer: "a",
        explanation_video_url: "",
        explanation_text: "",
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Error saving question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-[#2D5A27] font-black text-[10px] uppercase tracking-widest mb-2 hover:opacity-70 transition-all"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 uppercase italic tracking-tighter">
              Quiz Builder
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* ✨ AI GENERATE BUTTON */}
            <button
              onClick={handleAIGenerate}
              disabled={generatingAI || !selectedLesson}
              className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg disabled:opacity-50"
            >
              {generatingAI ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              {generatingAI ? "Thinking..." : "AI Magic"}
            </button>

            {success && (
              <div className="p-4 bg-green-50 border-2 border-green-100 text-[#2D5A27] rounded-2xl flex items-center gap-2 font-bold animate-in slide-in-from-top-4">
                <CheckCircle size={20} />{" "}
                <span className="text-sm">Saved!</span>
              </div>
            )}
          </div>
        </div>

        {/* Course/Lesson Selection dropdowns remain the same... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          {/* Dropdowns logic remains unchanged */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Subject
            </label>
            <select
              className="w-full p-4 bg-white border-2 border-gray-100 rounded-[1.25rem] font-bold outline-none focus:border-[#2D5A27] text-sm md:text-base transition-all appearance-none"
              onChange={(e) => setSelectedCourse(e.target.value)}
              value={selectedCourse}
            >
              <option value="">-- Select Subject --</option>
              {courses.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Lesson
            </label>
            <select
              disabled={!selectedCourse}
              className="w-full p-4 bg-white border-2 border-gray-100 rounded-[1.25rem] font-bold disabled:opacity-50 outline-none focus:border-[#2D5A27] text-sm md:text-base transition-all appearance-none"
              onChange={(e) => setSelectedLesson(e.target.value)}
              value={selectedLesson}
            >
              <option value="">-- Select Lesson --</option>
              {lessons.map((l: any) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm border-2 border-gray-50 space-y-6 md:space-y-8"
        >
          {/* Question fields remain the same, but now auto-filled by handleAIGenerate */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              The Question
            </label>
            <textarea
              required
              className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#2D5A27] outline-none font-medium h-28 md:h-32 resize-none transition-all text-sm md:text-base"
              placeholder="Use 'AI Magic' or type here..."
              value={questionData.question_text}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  question_text: e.target.value,
                })
              }
            />
          </div>

          {/* Rest of the form (Options, Explanation, Submit Button) remains unchanged */}
          <div className="space-y-3 md:space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Answer Options
            </label>
            {["a", "b", "c"].map((letter) => (
              <div key={letter} className="flex items-center gap-3 md:gap-4">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black uppercase text-sm transition-all shadow-sm flex-shrink-0 ${questionData.correct_answer === letter ? "bg-[#2D5A27] text-white" : "bg-gray-100 text-gray-400"}`}
                >
                  {letter}
                </div>
                <input
                  required
                  className="flex-1 p-4 md:p-5 bg-gray-50 rounded-xl md:rounded-2xl border-2 border-transparent focus:border-[#2D5A27] outline-none font-bold text-sm md:text-base transition-all"
                  placeholder={`Option ${letter.toUpperCase()}`}
                  value={(questionData as any)[`option_${letter}`]}
                  onChange={(e) =>
                    setQuestionData({
                      ...questionData,
                      [`option_${letter}`]: e.target.value,
                    })
                  }
                />
                <input
                  type="radio"
                  name="correct"
                  className="w-5 h-5 md:w-6 md:h-6 accent-[#2D5A27] cursor-pointer"
                  checked={questionData.correct_answer === letter}
                  onChange={() =>
                    setQuestionData({ ...questionData, correct_answer: letter })
                  }
                />
              </div>
            ))}
          </div>

          <hr className="border-gray-50" />

          <div className="space-y-4 md:space-y-6 bg-gray-50/50 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-dashed border-gray-100">
            <h3 className="font-black text-gray-800 uppercase italic tracking-tight flex items-center gap-2 text-sm md:text-base">
              <HelpCircle className="text-[#2D5A27]" size={18} /> Tutor
              Fail-Safe
            </h3>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Video size={12} /> YouTube Explanation URL
              </label>
              <input
                type="url"
                className="w-full p-4 bg-white rounded-xl border-2 border-transparent focus:border-[#2D5A27] outline-none font-bold text-xs md:text-sm shadow-sm"
                placeholder="https://www.youtube.com/watch?v=..."
                value={questionData.explanation_video_url}
                onChange={(e) =>
                  setQuestionData({
                    ...questionData,
                    explanation_video_url: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <MessageCircle size={12} /> Text Hint (Optional)
              </label>
              <textarea
                className="w-full p-4 bg-white rounded-xl border-2 border-transparent focus:border-[#2D5A27] outline-none font-medium text-xs md:text-sm shadow-sm h-20 md:h-24 resize-none"
                placeholder="Explain why the answer is correct..."
                value={questionData.explanation_text}
                onChange={(e) =>
                  setQuestionData({
                    ...questionData,
                    explanation_text: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <button
            disabled={loading || !selectedLesson}
            className="w-full bg-[#2D5A27] text-white py-5 md:py-6 rounded-[1.25rem] md:rounded-[1.5rem] font-black text-lg md:text-xl shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save size={20} /> Save Logic
              </>
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
}
