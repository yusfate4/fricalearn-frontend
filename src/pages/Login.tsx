import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  Loader2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🚀 Updated endpoint to /auth/login to match our new AuthController
      const response = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", response.data.token);

      // Go to dashboard
      window.location.href = "/dashboard";
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF6] flex flex-col md:flex-row">
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
            Welcome <br /> <span className="text-[#F4B400]">Back</span> Parent.
          </h1>
          <p className="text-xl font-medium text-white/80 max-w-md italic leading-relaxed">
            Log in to manage your child's lessons, track their progress, and
            explore the marketplace.
          </p>
        </div>

        <div className="flex items-center gap-4 text-white/40 font-black uppercase tracking-widest text-[10px]">
          <ShieldCheck size={20} /> Secure Academy Access
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-20">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-gray-800 italic uppercase tracking-tighter mb-2">
              Academy Login
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
              Access your family portal
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 text-red-600 rounded-[1.5rem] flex items-center gap-2 font-black text-[11px] uppercase tracking-tight">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
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
                  className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-gray-100 outline-none focus:border-[#2D5A27] transition-all font-bold text-gray-700 bg-white shadow-sm"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input with Toggle */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-4 mr-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Password
                </label>
                {/* 🚀 ADDED: Forgot Password Link */}
                <Link 
                  to="/forgot-password" 
                  className="text-[10px] font-black text-[#2D5A27] uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2D5A27] transition-colors"
                  size={20}
                />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-5 rounded-[2rem] border-2 border-gray-100 outline-none focus:border-[#2D5A27] transition-all font-bold text-gray-700 bg-white shadow-sm"
                  onChange={(e) => setPassword(e.target.value)}
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
              className="group w-full bg-[#2D5A27] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Enter Academy</span>
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                New to the family?{" "}
                <Link
                  to="/register"
                  className="text-[#2D5A27] hover:underline decoration-2 underline-offset-4 ml-1"
                >
                  Enroll Here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;