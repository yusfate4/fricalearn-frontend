import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "parent",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", formData);
      setShowModal(true);
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModalAndRedirect = () => {
    setShowModal(false);
    navigate("/parent/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FDFCF6] flex flex-col md:flex-row relative font-sans">
      {/* 🏠 BACK TO HOME BUTTON */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-[#2D5A27] font-black uppercase tracking-widest text-[10px] bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm hover:bg-[#2D5A27] hover:text-white transition-all group"
      >
        <ArrowLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Home
      </Link>

      {/* --- SUCCESS MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl scale-in-center border-8 border-[#FDFCF6]">
            <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-gray-800 mb-2">
              Ẹ kú iṣẹ́!
            </h3>
            <p className="text-gray-500 font-bold text-sm leading-relaxed mb-8">
              Registration successful! Olukọ has sent a{" "}
              <span className="text-[#2D5A27]">verification email</span> to your
              inbox. Please verify to unlock all features.
            </p>
            <button
              onClick={closeModalAndRedirect}
              className="w-full bg-[#2D5A27] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* --- LEFT SIDE: BRANDING --- */}
      <div className="hidden md:flex md:w-1/2 bg-[#1A1A40] p-20 flex-col justify-between text-white relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-600 rounded-full -mr-32 -mt-32 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-600 rounded-full -ml-24 -mb-24 opacity-10"></div>

        <div className="relative z-10">
          <img src="/logo.png" alt="FricaLearn Logo" className="h-16 mb-4" />
          <p className="font-bold text-green-500 uppercase tracking-widest text-[10px]">
            The Diaspora Academy
          </p>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-black leading-none mb-6 italic uppercase tracking-tighter">
            Enroll Your <br /> <span className="text-green-500">Child</span>{" "}
            Today.
          </h1>
          <p className="text-xl font-medium text-white/80 max-w-md italic leading-relaxed">
            Join a global community of parents preserving African heritage
            through language and culture.
          </p>
        </div>

        <div className="flex items-center gap-4 text-white/40 font-black uppercase tracking-widest text-[10px]">
          <ShieldCheck size={20} className="text-green-500" /> Secure Parent
          Enrollment
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-20 mt-12 md:mt-0">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-[#1A1A40] italic uppercase tracking-tighter mb-2">
              Create Account
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              For Parents & Guardians
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 text-red-600 rounded-2xl flex items-center gap-3 font-bold text-xs">
              <XCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-5">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2D5A27] transition-colors"
                  size={18}
                />
                <input
                  required
                  type="text"
                  placeholder="Adebayo Smith"
                  className="w-full pl-14 pr-6 py-4 rounded-[2rem] border-2 border-gray-100 outline-none focus:border-[#2D5A27] transition-all font-bold text-gray-700 bg-white placeholder:text-gray-200"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-5">
                Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2D5A27] transition-colors"
                  size={18}
                />
                <input
                  required
                  type="email"
                  placeholder="parent@example.com"
                  className="w-full pl-14 pr-6 py-4 rounded-[2rem] border-2 border-gray-100 outline-none focus:border-[#2D5A27] transition-all font-bold text-gray-700 bg-white placeholder:text-gray-200"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-5">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2D5A27] transition-colors"
                  size={18}
                />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-4 rounded-[2rem] border-2 border-gray-100 outline-none focus:border-[#2D5A27] transition-all font-bold text-gray-700 bg-white"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#2D5A27] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-5">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2D5A27] transition-colors"
                  size={18}
                />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-4 rounded-[2rem] border-2 border-gray-100 outline-none focus:border-[#2D5A27] transition-all font-bold text-gray-700 bg-white"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password_confirmation: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#2D5A27] text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-[#1A1A40] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Register Now <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="text-center text-gray-400 font-bold text-xs mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#2D5A27] underline decoration-2 underline-offset-4 font-black italic ml-1"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
