import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Upload,
  PlusCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

export default function AdminCourses() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🚀 Check if we were sent here from the "Edit" button
  const editData = location.state?.editCourse;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // 🚀 Initialize form with editData if it exists
  const [formData, setFormData] = useState({
    id: editData?.id || null,
    title: editData?.title || "",
    description: editData?.description || "",
    category: editData?.category || "Yoruba",
    subject: editData?.subject || "Language & Culture",
    level: editData?.level || "Beginner",
    price_ngn: editData?.price_ngn || "30000",
    price_gbp: editData?.price_gbp || "20",
    image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("subject", formData.subject);
    data.append("level", formData.level);
    data.append("price_ngn", formData.price_ngn);
    data.append("price_gbp", formData.price_gbp);

    // Only append image if a new one was selected
    if (formData.image) data.append("image", formData.image);

    try {
      if (formData.id) {
        // 📝 EDIT MODE: Use POST but spoof PUT for Laravel file support
        data.append("_method", "PUT");
        await api.post(`/admin/courses/${formData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setStatus({ type: "success", msg: "Course Updated! Redirecting..." });
      } else {
        // ✨ CREATE MODE
        await api.post("/admin/courses", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setStatus({ type: "success", msg: "Course Launched! Redirecting..." });
      }

      setTimeout(() => {
        navigate("/admin/courses/list");
      }, 2000);
    } catch (err: any) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Save failed. Check details.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 md:p-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-800 italic uppercase tracking-tighter">
            {formData.id ? "Update Subject" : "Add New Subject"}
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            {formData.id
              ? `Editing: ${formData.title}`
              : "Fill in the details to publish a new course"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl border-2 border-gray-50"
        >
          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
              Course Cover Image{" "}
              {formData.id && "(Leave blank to keep current)"}
            </label>
            <label className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-gray-100 rounded-[2rem] cursor-pointer hover:border-[#2D5A27] transition-all bg-gray-50/50">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files![0] })
                }
              />
              <Upload className="text-gray-300 mb-2" size={32} />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight px-4 text-center">
                {formData.image
                  ? formData.image.name
                  : "Select JPG/PNG (Max 5MB)"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4">
                Course Title
              </label>
              <input
                required
                type="text"
                value={formData.title}
                placeholder="e.g. Yoruba for Kids"
                className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-4 ring-[#2D5A27]/5 font-bold text-gray-700"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4">
                Level
              </label>
              <select
                value={formData.level}
                className="w-full p-5 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#2D5A27]"
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
              >
                <option value="Beginner">Beginner (Ages 5-10)</option>
                <option value="Intermediate">Intermediate (Ages 11-15)</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4">
                Language Category
              </label>
              <select
                value={formData.category}
                className="w-full p-5 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#2D5A27]"
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="Yoruba">Yoruba</option>
                <option value="Hausa">Hausa</option>
                <option value="Igbo">Igbo</option>
                <option value="English">English</option>
                <option value="Maths">Maths</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4">
                Subject Type
              </label>
              <select
                value={formData.subject}
                className="w-full p-5 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#2D5A27]"
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              >
                <option value="Language & Culture">Language & Culture</option>
                <option value="History & Heritage">History & Heritage</option>
                <option value="Folklore & Stories">Folklore & Stories</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-medium text-gray-700"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4">
                Price (Naira ₦)
              </label>
              <input
                type="number"
                value={formData.price_ngn}
                className="w-full p-5 bg-gray-50 rounded-2xl font-black text-gray-800"
                onChange={(e) =>
                  setFormData({ ...formData, price_ngn: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4">
                Price (Pounds £)
              </label>
              <input
                type="number"
                value={formData.price_gbp}
                className="w-full p-5 bg-gray-50 rounded-2xl font-black text-gray-800"
                onChange={(e) =>
                  setFormData({ ...formData, price_gbp: e.target.value })
                }
              />
            </div>
          </div>

          {status && (
            <div
              className={`p-5 rounded-[1.5rem] flex items-center gap-4 animate-in zoom-in duration-300 ${
                status.type === "success"
                  ? "bg-green-50 text-green-700 border-2 border-green-100"
                  : "bg-red-50 text-red-700 border-2 border-red-100"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
              <span className="font-black uppercase italic tracking-tight text-xs">
                {status.msg}
              </span>
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#2D5A27] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                {formData.id ? <Save size={20} /> : <PlusCircle size={20} />}
                {formData.id ? "Update Changes" : "Launch Course"}
              </>
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
}
