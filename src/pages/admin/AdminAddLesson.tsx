import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import FileUpload from "../../components/FileUpload"; // 👈 IMPORTING OUR NEW COMPONENT
import {
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  BookOpen
} from "lucide-react";

export default function AdminAddLesson() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 1. The new state to track if we are on Step 1 or Step 2
  const [createdLessonId, setCreatedLessonId] = useState<number | null>(null);

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState(""); // For YouTube links

  useEffect(() => {
    api
      .get("/admin/courses")
      .then((res) => {
        const verifiedCourses = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setCourses(verifiedCourses);
        // Auto-select the first course if available
        if (verifiedCourses.length > 0) {
          setCourseId(verifiedCourses[0].id.toString());
        }
      })
      .catch((err) => {
        console.error("Could not load courses", err);
        setCourses([]);
      });
  }, []);

  // STEP 1: Submit Basic Info
  const handleCreateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // Notice we are NOT sending files here, just text data!
      const response = await api.post("/admin/lessons", {
        course_id: courseId,
        title: title,
        content: content,
        video_url: videoUrl,
      });
      
      // We grab the ID of the new lesson and move to Step 2
      setCreatedLessonId(response.data.id);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to create lesson details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 md:p-10">
        <button
          onClick={() => navigate("/admin/courses")}
          className="flex items-center gap-2 text-gray-400 hover:text-frica-green mb-8 font-black uppercase text-xs tracking-widest transition-all"
        >
          <ArrowLeft size={16} /> Back to Curriculum
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-800 italic uppercase tracking-tighter">
            Add New Lesson
          </h1>
          <p className="text-gray-500 font-bold mt-1">
            {createdLessonId ? "Step 2: Attach Media" : "Step 1: Lesson Details"}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-6 bg-red-50 border-2 border-red-100 text-red-600 rounded-[2rem] flex items-center gap-3 font-bold animate-in zoom-in">
            <AlertCircle size={24} /> {errorMessage}
          </div>
        )}

        {/* --- STEP 1: LESSON DETAILS FORM --- */}
        {!createdLessonId ? (
          <form onSubmit={handleCreateDetails} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border-2 border-gray-50 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Assign to Subject</label>
                <select
                  required
                  value={courseId}
                  className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-frica-green rounded-2xl font-bold outline-none appearance-none transition-all"
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="">-- Select Yoruba, Hausa, or Igbo --</option>
                  {courses.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Lesson Name</label>
                <input
                  type="text"
                  value={title}
                  placeholder="e.g. Greetings in Yoruba"
                  className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-frica-green rounded-2xl font-bold outline-none transition-all"
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Teaching Notes / Content</label>
                <textarea
                  required
                  value={content}
                  placeholder="What will the children learn in this lesson?"
                  className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-frica-green rounded-2xl h-32 font-medium outline-none transition-all resize-none"
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">YouTube Video URL (Optional)</label>
                <input
                  type="url"
                  value={videoUrl}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-frica-green rounded-2xl font-bold outline-none transition-all"
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>

              <button
                disabled={loading || !courseId}
                type="submit"
                className="w-full bg-[#2D5A27] text-white py-5 rounded-[1.5rem] font-black text-xl shadow-lg hover:shadow-green-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Save Details & Proceed to Media"}
                {!loading && <ChevronRight size={20} />}
              </button>
            </div>
          </form>
        ) : (
          /* --- STEP 2: MEDIA UPLOAD --- */
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="bg-green-50 border border-green-100 p-6 rounded-[2rem] flex items-center gap-4 mb-8">
              <div className="bg-white p-2 rounded-full text-frica-green shadow-sm">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="font-black text-green-800 text-lg">Lesson Details Saved!</h3>
                <p className="text-green-600 text-sm font-bold">Now, you can directly upload MP4s, PDFs, or Images.</p>
              </div>
            </div>

            {/* 🔥 THE FILE UPLOAD WIDGET 🔥 */}
            <FileUpload 
              lessonId={createdLessonId} 
              onUploadSuccess={() => {
                console.log("File uploaded successfully.");
              }} 
            />

            <button
              onClick={() => navigate("/admin/courses")}
              className="w-full mt-6 bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-xl hover:scale-[1.02] transition-all"
            >
              Finish & Return to Curriculum
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}