import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import { HelpCircle, Save, Loader2, CheckCircle } from "lucide-react";

export default function AdminQuiz() {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [questionData, setQuestionData] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    correct_answer: "a",
  });

  // Load Courses
  useEffect(() => {
    api.get("/admin/courses").then((res) => {
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setCourses(data);
    });
  }, []);

  // Load Lessons when Course changes
  useEffect(() => {
    if (selectedCourse) {
      // Try the standard course route if /admin/courses/:id isn't defined
      api
        .get(`/courses/${selectedCourse}`)
        .then((res) => {
          // Log this! Open your browser console (F12) to see what is coming back
          console.log("Full Course Data:", res.data);

          // Dig into the modules to find lessons
          const courseData = res.data;
          const allLessons =
            courseData.modules?.flatMap((m: any) => m.lessons || []) || [];

          setLessons(allLessons);

          if (allLessons.length === 0) {
            console.warn(
              "No lessons found for this course. Did you create modules?",
            );
          }
        })
        .catch((err) => {
          console.error("Error loading course details:", err);
          setLessons([]);
        });
    } else {
      setLessons([]);
    }
  }, [selectedCourse]);

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
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to save question. Check if all fields are filled.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-10">
        <h1 className="text-4xl font-black text-gray-800 mb-8">Quiz Builder</h1>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-100 text-green-700 rounded-2xl flex items-center gap-2 font-bold">
            <CheckCircle /> Question added to lesson!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Select Subject
            </label>
            <select
              className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl font-bold"
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">-- Choose Subject --</option>
              {courses.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Select Lesson
            </label>
            <select
              disabled={!selectedCourse}
              className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl font-bold disabled:opacity-50"
              onChange={(e) => setSelectedLesson(e.target.value)}
            >
              <option value="">-- Choose Lesson --</option>
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
          className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6"
        >
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              The Question
            </label>
            <textarea
              required
              className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-frica-green outline-none font-medium"
              placeholder="e.g. How do you say 'Good Morning' in Yoruba?"
              value={questionData.question_text}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  question_text: e.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {["a", "b", "c"].map((letter) => (
              <div key={letter} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black uppercase ${questionData.correct_answer === letter ? "bg-frica-green text-white" : "bg-gray-100 text-gray-400"}`}
                >
                  {letter}
                </div>
                <input
                  required
                  className="flex-1 p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-frica-green outline-none font-bold"
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
                  checked={questionData.correct_answer === letter}
                  onChange={() =>
                    setQuestionData({ ...questionData, correct_answer: letter })
                  }
                />
              </div>
            ))}
          </div>

          <button
            disabled={loading || !selectedLesson}
            className="w-full bg-[#2D5A27] text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save /> Save Question
              </>
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
}
