import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import FileUpload from "../../components/FileUpload";
import {
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Save,
  Mic,
  Trash2,
} from "lucide-react";

export default function AdminEditLesson() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [practiceWord, setPracticeWord] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    api
      .get(`/lessons/${id}`)
      .then((res) => {
        const lesson = res.data;
        setTitle(lesson.title);
        setPracticeWord(lesson.practice_word || "");
        setContent(lesson.content);
        setVideoUrl(lesson.video_url || "");
        setCourseId(lesson.course_id);
        setFetching(false);
      })
      .catch((err) => {
        setErrorMessage("Could not load lesson data.");
        setFetching(false);
      });
  }, [id]);

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await api.put(`/admin/lessons/${id}`, {
        title,
        practice_word: practiceWord,
        content,
        video_url: videoUrl,
      });
      setSuccessMessage("Lesson details updated successfully!");
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to update lesson.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure? This will delete all videos and notes for this lesson forever!",
      )
    ) {
      try {
        await api.delete(`/admin/lessons/${id}`);
        navigate("/admin/courses");
      } catch (err) {
        setErrorMessage("Failed to delete lesson.");
      }
    }
  };

  if (fetching)
    return (
      <Layout>
        <div className="p-20 text-center font-black animate-pulse text-[#2D5A27] uppercase italic tracking-widest">
          Loading Lesson...
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-10 pb-32">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#2D5A27] mb-8 font-black uppercase text-[10px] tracking-[0.2em] transition-all"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Back
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 italic uppercase tracking-tighter">
            Edit Lesson
          </h1>
          <p className="text-gray-500 font-bold mt-1 text-sm">
            Modify details and manage media
          </p>
        </div>

        {/* Status Messages */}
        {errorMessage && (
          <div className="mb-6 p-5 bg-red-50 border-2 border-red-100 text-red-600 rounded-3xl flex items-center gap-3 font-bold animate-in zoom-in">
            <AlertCircle size={20} /> {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-5 bg-green-50 border-2 border-green-100 text-[#2D5A27] rounded-3xl flex items-center gap-3 font-bold animate-in zoom-in">
            <CheckCircle size={20} /> {successMessage}
          </div>
        )}

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: THE FORM (Details) - 8 columns on large screens */}
          <div className="lg:col-span-8 w-full">
            <form
              onSubmit={handleUpdateDetails}
              className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border-2 border-gray-50 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Lesson Name
                  </label>
                  <input
                    type="text"
                    value={title}
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#2D5A27] rounded-2xl font-bold outline-none transition-all"
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Mic size={14} /> AI Practice Word (Speak & Earn)
                  </label>
                  <input
                    type="text"
                    value={practiceWord}
                    className="w-full p-4 bg-orange-50 border-2 border-dashed border-orange-200 focus:border-orange-400 rounded-2xl font-black text-[#2D5A27] outline-none transition-all italic"
                    onChange={(e) => setPracticeWord(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Teaching Notes / Content
                </label>
                <textarea
                  required
                  value={content}
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#2D5A27] rounded-2xl h-48 font-medium outline-none transition-all resize-none"
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#2D5A27] rounded-2xl font-bold outline-none transition-all"
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-[#2D5A27] text-white py-5 rounded-[1.5rem] font-black text-lg shadow-lg hover:shadow-green-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                Save Details
              </button>
            </form>
          </div>

          {/* RIGHT: THE MEDIA & DANGER ZONE - 4 columns on large screens */}
          <div className="lg:col-span-4 w-full space-y-8">
            {/* Media Upload Box */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border-2 border-gray-50 flex flex-col">
              <h3 className="font-black text-gray-800 uppercase tracking-tighter mb-5 italic text-lg">
                Add More Media
              </h3>
              <div className="w-full">
                <FileUpload
                  lessonId={Number(id)}
                  onUploadSuccess={() => setSuccessMessage("New file added!")}
                />
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 p-6 md:p-8 rounded-[2.5rem] border-2 border-red-100">
              <h4 className="font-black text-red-800 uppercase tracking-tighter text-xs mb-2">
                Danger Zone
              </h4>
              <p className="text-[11px] text-red-600 font-bold mb-5 leading-relaxed">
                Deleting this lesson is permanent and cannot be undone.
              </p>
              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-red-100 text-red-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
              >
                <Trash2 size={16} /> Delete Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
