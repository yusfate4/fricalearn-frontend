import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { X, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import SuccessModal from "../../components/SuccessModal";

// Add "course" to the props
export default function CourseModal({
  isOpen,
  onClose,
  onRefresh,
  course = null,
}: any) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "Language",
    subject: "Yoruba",
    level: "Age 5-7",
    description: "",
    is_published: true,
    thumbnail_url: "https://via.placeholder.com/300",
  });

  // --- EFFECT: If 'course' is passed, fill the form (Edit Mode) ---
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        category: course.category || "Language",
        subject: course.subject || "Yoruba",
        level: course.level || "Age 5-7",
        description: course.description || "",
        is_published: course.is_published ?? true,
        thumbnail_url:
          course.thumbnail_url || "https://via.placeholder.com/300",
      });
    } else {
      // Reset for "New Subject" mode
      setFormData({
        title: "",
        category: "Language",
        subject: "Yoruba",
        level: "Age 5-7",
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
        // EDIT MODE: Use PUT request
        await api.put(`/admin/courses/${course.id}`, formData);
      } else {
        // CREATE MODE: Use POST request
        await api.post("/admin/courses", formData);
      }
      onRefresh();
      setShowSuccess(true);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Check your inputs.",
      );
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
      {/* THE UI FIX: max-h and overflow-y-auto ensures you can scroll! */}
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
            <div className="p-4 bg-red-50 border-2 border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
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
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Language
              </label>
              <select
                value={formData.subject}
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-700 outline-none focus:border-frica-green"
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              >
                <option value="Yoruba">Yoruba</option>
                <option value="Hausa">Hausa</option>
                <option value="Igbo">Igbo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Target Age
              </label>
              <input
                required
                value={formData.level}
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-700 focus:border-frica-green outline-none"
                placeholder="e.g. 5-7 Years"
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
              />
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
            {/* MINI PREVIEW: Small enough not to break the layout */}
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
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-lg">
                  <ImageIcon size={14} className="text-frica-green" />
                </div>
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
            ) : course ? (
              "Save Changes"
            ) : (
              "Launch Subject"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
