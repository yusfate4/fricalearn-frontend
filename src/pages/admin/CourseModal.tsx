import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  X,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import SuccessModal from "../../components/SuccessModal";

export default function CourseModal({
  isOpen,
  onClose,
  onRefresh,
  course = null,
}: any) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 🚀 KEY FIX: Ensure keys match Laravel (category and level)
  const [formData, setFormData] = useState({
    title: "",
    category: "Yoruba", // Sent as 'category' to the backend
    subject: "Culture", // Static internal tag
    level: "Beginners", // Must match 'Beginners', 'Intermediate', or 'Advance'
    description: "",
    is_published: true,
    thumbnail_url: "https://via.placeholder.com/300",
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        category: course.category || "Yoruba",
        subject: course.subject || "Culture",
        level: course.level || "Beginners",
        description: course.description || "",
        is_published: course.is_published ?? true,
        thumbnail_url:
          course.thumbnail_url || "https://via.placeholder.com/300",
      });
    } else {
      setFormData({
        title: "",
        category: "Yoruba",
        subject: "Culture",
        level: "Beginners",
        description: "",
        is_published: true,
        thumbnail_url: "https://via.placeholder.com/300",
      });
    }
  }, [course, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (course) {
        await api.put(`/admin/courses/${course.id}`, formData);
      } else {
        await api.post("/admin/courses", formData);
      }
      onRefresh();
      setShowSuccess(true);
    } catch (error: any) {
      // 🚀 Helps you see the specific validation errors in the UI
      const backendErrors = error.response?.data?.errors;
      if (backendErrors) {
        const firstError = Object.values(backendErrors)[0] as string[];
        setErrorMessage(firstError[0]);
      } else {
        setErrorMessage(error.response?.data?.message || "Check your inputs.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <SuccessModal
        isOpen={true}
        title={course ? "Subject Updated!" : "Subject Launched!"}
        message={`${formData.title} has been saved successfully.`}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-white pb-2 z-10">
          <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">
              {course ? "Edit Subject" : "New Subject"}
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Curate the FricaLearn curriculum
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="p-4 bg-red-50 border-2 border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-in shake duration-300">
              <AlertCircle size={18} /> {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Subject Title
            </label>
            <input
              required
              value={formData.title}
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-frica-green outline-none font-bold text-gray-700"
              placeholder="e.g. Yoruba for Beginners"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 🚀 Category select matches Backend validation 'in:Yoruba,Hausa,Igbo' */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Language
              </label>
              <select
                value={formData.category}
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-700 outline-none focus:border-frica-green"
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

            {/* 🚀 Level select matches Backend validation 'in:Beginners,Intermediate,Advance' */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Level
              </label>
              <select
                value={formData.level}
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-700 outline-none focus:border-frica-green"
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
              >
                <option value="Beginners">Beginners</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advance">Advance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Course Image (URL)
            </label>
            <input
              type="url"
              value={formData.thumbnail_url}
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-frica-green outline-none font-bold text-gray-700 transition-all"
              placeholder="https://images.unsplash.com/..."
              onChange={(e) =>
                setFormData({ ...formData, thumbnail_url: e.target.value })
              }
            />
            {formData.thumbnail_url && (
              <div className="mt-3 relative h-24 w-full rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner">
                <img
                  src={formData.thumbnail_url}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/300?text=Invalid+Image")
                  }
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-frica-green outline-none font-medium text-gray-700"
              placeholder="What will they learn?"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#2D5A27] text-white py-5 rounded-[1.5rem] font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 sticky bottom-0"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Sparkles size={20} />{" "}
                <span>{course ? "Save Changes" : "Launch Subject"}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
