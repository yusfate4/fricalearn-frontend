import React, { useState } from "react";
import api from "../../api/axios";
import {
  UserPlus,
  Loader2,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  BookOpen,
  AlertCircle,
  Zap,
} from "lucide-react";

interface AddChildModalProps {
  onAdded: () => void;
  onClose: () => void;
}

export default function AddChildModal({
  onAdded,
  onClose,
}: AddChildModalProps) {
  // 📝 Updated State to match simplified requirements
  const [formData, setFormData] = useState({
    name: "",
    dob_day: "",
    dob_month: "",
    grade_level: "Beginners",
    learning_language: "Yoruba",
    relationship: "Parent",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    // Combine Day and Month for the backend
    const date_of_birth = `${formData.dob_day} ${formData.dob_month}`;

    try {
      await api.post("/parent/register-child", {
        ...formData,
        date_of_birth,
      });

      setStatus("success");
      setTimeout(() => {
        onAdded();
      }, 1500);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(
        err.response?.data?.message ||
          "Could not enroll student. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-lg mx-auto p-6 md:p-10 rounded-[2.5rem] shadow-2xl border-4 border-white relative max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in duration-300">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start mb-8 sticky top-0 bg-white z-10 pb-2">
        <div>
          <h3 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter mb-1">
            Enroll New Student
          </h3>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">
            Add a child to your family account
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400"
        >
          <XCircle size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- FULL NAME --- */}
        <InputGroup label="Student's Full Name" icon={<User size={18} />}>
          <input
            type="text"
            required
            placeholder="e.g. Ayo Learner"
            className="form-input-custom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </InputGroup>

        {/* --- BIRTHDAY (NO YEAR) --- */}
        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="Birth Day" icon={<Calendar size={18} />}>
            <select
              className="form-input-custom appearance-none"
              value={formData.dob_day}
              onChange={(e) =>
                setFormData({ ...formData, dob_day: e.target.value })
              }
              required
            >
              <option value="">Day</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </InputGroup>

          <InputGroup label="Birth Month" icon={<Calendar size={18} />}>
            <select
              className="form-input-custom appearance-none"
              value={formData.dob_month}
              onChange={(e) =>
                setFormData({ ...formData, dob_month: e.target.value })
              }
              required
            >
              <option value="">Month</option>
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </InputGroup>
        </div>

        {/* --- GRADE & TRACK --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Grade Level" icon={<BookOpen size={18} />}>
            <select
              className="form-input-custom appearance-none"
              value={formData.grade_level}
              onChange={(e) =>
                setFormData({ ...formData, grade_level: e.target.value })
              }
              required
            >
              <option value="Beginners">Beginners</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advance">Advance</option>
            </select>
          </InputGroup>

          <InputGroup
            label="Language Track"
            icon={<Zap size={18} className="text-yellow-500" />}
          >
            <select
              className="form-input-custom appearance-none"
              value={formData.learning_language}
              onChange={(e) =>
                setFormData({ ...formData, learning_language: e.target.value })
              }
              required
            >
              <option value="Yoruba">Yoruba</option>
              <option value="Hausa">Hausa</option>
              <option value="Igbo">Igbo</option>
              <option value="English">English</option>
              <option value="Maths">Maths</option>
            </select>
          </InputGroup>
        </div>

        {status === "error" && (
          <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 animate-in slide-in-from-top-2">
            <AlertCircle size={18} />
            <p>{errorMessage}</p>
          </div>
        )}

        <button
          disabled={loading || status === "success"}
          className={`w-full py-5 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-3 shadow-xl ${
            status === "success"
              ? "bg-green-500 shadow-green-200"
              : "bg-[#2D5A27] hover:bg-black active:scale-95 shadow-green-900/20"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : status === "success" ? (
            <>
              <CheckCircle size={24} />
              <span className="uppercase italic tracking-tight">
                Success! Enrolled
              </span>
            </>
          ) : (
            <>
              <UserPlus size={24} />
              <span className="uppercase italic tracking-tight">
                Complete Enrollment
              </span>
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-[9px] text-gray-300 font-bold uppercase tracking-widest leading-relaxed">
        A student profile will be created automatically. <br /> They can log in
        using the email generated upon success.
      </p>
    </div>
  );
}

function InputGroup({ label, icon, children }: any) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2D5A27] transition-colors z-10">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}
