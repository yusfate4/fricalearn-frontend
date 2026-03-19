import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import {
  Upload,
  FileText,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function AdminAddLesson() {
  // 1. ADDED THIS MISSING STATE
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    api
      .get("/admin/courses")
      .then((res) => {
        const verifiedCourses = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setCourses(verifiedCourses);
      })
      .catch((err) => {
        console.error("Could not load courses", err);
        setCourses([]);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadSuccess(false);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("course_id", courseId);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("video_url", videoUrl);

    selectedFiles.forEach((file) => {
      formData.append("files[]", file);
    });

    try {
      await api.post("/admin/lessons", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadSuccess(true);
      setSelectedFiles([]);
      setTitle("");
      setContent("");
      setVideoUrl("");
      setCourseId("");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Upload failed. Check file sizes (Max 10MB) or server limits.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-10 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 mt-10">
        <h1 className="text-3xl font-black text-gray-800 mb-2">
          Upload Content
        </h1>
        <p className="text-gray-500 mb-8 font-medium text-lg">
          Add video lessons and worksheets for students.
        </p>

        {uploadSuccess && (
          <div className="mb-6 p-6 bg-green-50 border-2 border-green-100 text-[#2D5A27] rounded-[2rem] flex items-center gap-3 font-bold animate-in fade-in slide-in-from-top-2">
            <CheckCircle size={24} /> Lesson published! Check the Student
            Dashboard.
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-6 bg-red-50 border-2 border-red-100 text-red-600 rounded-[2rem] flex items-center gap-3 font-bold animate-in zoom-in">
            <AlertCircle size={24} /> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Assign to Subject
            </label>
            <select
              required
              value={courseId}
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-frica-green rounded-2xl font-bold outline-none appearance-none"
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
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Lesson Name
            </label>
            <input
              type="text"
              value={title}
              placeholder="e.g. Greetings in Yoruba"
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-frica-green rounded-2xl font-bold outline-none"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {/* 1. Add this block into your form */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Teaching Notes / Content
            </label>
            <textarea
              required
              value={content}
              placeholder="What will the children learn in this lesson?"
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-frica-green rounded-2xl h-32 font-medium outline-none transition-all"
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              YouTube Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-frica-green rounded-2xl font-bold outline-none"
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          <div className="border-4 border-dashed border-gray-100 p-12 rounded-[2.5rem] text-center hover:border-frica-green/30 hover:bg-green-50/30 transition-all group">
            <input
              type="file"
              multiple
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept="*"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload
                className="mx-auto text-gray-300 group-hover:text-frica-green mb-4"
                size={64}
              />
              <p className="font-black text-gray-700 text-xl">
                Drop Lesson Materials Here
              </p>
              <p className="text-sm text-gray-400 font-bold mt-1">
                Any file type • Max 10MB per file
              </p>
            </label>

            {selectedFiles.length > 0 && (
              <div className="mt-6 p-4 bg-white rounded-2xl shadow-sm space-y-2 border border-gray-100">
                {selectedFiles.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center text-sm text-frica-green font-bold justify-center"
                  >
                    <FileText size={16} className="mr-2" /> {f.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#2D5A27] text-white py-6 rounded-[1.8rem] font-black text-2xl shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Publishing...
              </>
            ) : (
              "Save & Publish Lesson"
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
}
