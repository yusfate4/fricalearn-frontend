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
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // 🚀 Modal State
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "parent", 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // 🚀 Updated to match the /auth prefix in api.php
      await api.post("/auth/register", formData);
      setShowModal(true); // Show success modal instead of alert
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModalAndRedirect = () => {
    setShowModal(false);
    navigate("/parent/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FDFCF6] flex flex-col md:flex-row relative">
      
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
              Registration successful! Olukọ has sent a <span className="text-[#2D5A27]">verification email</span> to your inbox. Please verify to unlock all features.
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
      <div className="hidden md:flex md:w-1/2 bg-[#2D5A27] p-20 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4B400] rounded-full -mr-32 -mt-32 opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-[#F4B400] mb-2">
            FricaLearn
          </h2>
          <p className="font-bold text-white/60 uppercase tracking-widest text-xs">
            Diaspora Academy
          </p>
        </div>
        <div className="relative z-10">
          <h1 className="text-6xl font-black leading-none mb-6 italic uppercase tracking-tighter">
            Enroll Your <br /> <span className="text-[#F4B400]">Child</span>{" "}
            Today.
          </h1>
          <p className="text-xl font-medium text-white/80 max-w-md italic leading-relaxed">
            Join a global community of parents preserving African heritage through language and culture.
          </p>
        </div>
        <div className="flex items-center gap-4 text-white/40 font-black uppercase tracking-widest text-[10px]">
          <ShieldCheck size={20} /> Secure Parent Enrollment
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-20">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-gray-800 italic uppercase tracking-tighter mb-2">
              Create Account
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
              For Parents & Guardians
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 text-red-600 rounded-2xl flex items-center gap-3 font-bold text-xs">
              <XCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                Parent's Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2D5A27] transition-colors"
                  size={20}
                />
                <input
                  required
                  type="text"
                  placeholder="e.g. Adebayo Smith"
                  className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-gray-100 outline-none focus:border-[#2D5A27] transition-all font-bold text-gray-700 bg-white"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2D5A27] transition-colors"
                  size={20}
                />
                <input
                  required
                  type="email"
                  placeholder="parent@example.com"
                  className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-gray-100 outline-none focus:border-[#2D5A27] transition-all font-bold text-gray-700 bg-white"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password with Eye Toggle */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2D5A27] transition-colors"
                  size={20}
                />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-5 rounded-[2rem] border-2 border-gray-100 outline-none focus:border-[#2D5A27] transition-all font-bold text-gray-700 bg-white"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#2D5A27] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#2D5A27] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Register Now <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="text-center text-gray-400 font-bold text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#2D5A27] underline decoration-2 underline-offset-4 font-black italic">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}