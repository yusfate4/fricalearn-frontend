import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  ArrowLeft,
  Info,
} from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Check if we arrived here from registration (to show a friendly reminder)
  const successMsg = location.state?.message;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 🚀 LEAD CONSULTANT TIP: Explicitly clean the payload
    const payload = { 
      email: email.trim().toLowerCase(), 
      password: password.trim() 
    };

    try {
      const response = await api.post("/auth/login", payload);
      
      const { token, user } = response.data;
      
      // Store session data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      /**
       * 🚀 ROLE-BASED REDIRECT
       * Staff (Admins & Tutors) go to /admin
       * Students and Parents go to /dashboard
       */
      if (user.role === 'admin' || user.role === 'tutor' || Number(user.is_admin) === 1) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
      
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.status === 'unverified') {
        navigate("/verify-notice", { 
          state: { 
            email: error.response.data.email,
            message: error.response.data.message 
          } 
        });
      } else {
        // Handle 422 or 401 errors
        const message = error.response?.data?.message || "Login failed. Please check your credentials.";
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF6] flex flex-col md:flex-row relative font-sans">
      
      {/* 🏠 BACK TO HOME BUTTON */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-[#2D5A27] font-black uppercase tracking-widest text-[10px] bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm hover:bg-[#2D5A27] hover:text-white transition-all group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* --- LEFT SIDE: BRANDING --- */}
      <div className="hidden md:flex md:w-1/2 bg-[#1A1A40] p-20 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-600 rounded-full -mr-32 -mt-32 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-600 rounded-full -ml-24 -mb-24 opacity-10"></div>

        <div className="relative z-10">
          <img src="/logo.png" alt="FricaLearn Logo" className="h-16 mb-4" />
          <p className="font-bold text-green-500 uppercase tracking-widest text-[10px]">
            The Diaspora Academy
          </p>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-black leading-none mb-6 italic uppercase tracking-tighter text-white">
            Welcome Back to the <span className="text-green-500">Academy</span>.
          </h1>
          <p className="text-xl font-medium text-white/80 max-w-md italic leading-relaxed">
            Manage lessons, track student progress, and explore the cultural marketplace of the future.
          </p>
        </div>

        <div className="flex items-center gap-4 text-white/40 font-black uppercase tracking-widest text-[10px]">
          <ShieldCheck size={20} className="text-green-500" /> Secure Academy Access
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-20 mt-12 md:mt-0">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-[#1A1A40] italic uppercase tracking-tighter mb-2">
              Academy Login
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              Access the command center
            </p>
          </div>

          {/* Success/Error Alerts */}
          {successMsg && !error && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-100 text-[#2D5A27] rounded-2xl flex items-center gap-3 font-black text-[11px] uppercase tracking-tight">
              <Info size={18} /> {successMsg}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 text-red-600 rounded-2xl flex items-center gap-2 font-black text-[11px] uppercase tracking-tight">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-5">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2D5A27] transition-colors"
                  size={18}
                />
                <input
                  required
                  type="email"
                  placeholder="name@fricalearn.com"
                  className="w-full pl-14 pr-6 py-4 rounded-[2rem] border-2 border-gray-100 outline-none focus:border-[#2D5A27] transition-all font-bold text-gray-700 bg-white placeholder:text-gray-200"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-5 mr-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Password
                </label>
                <Link to="/forgot-password" title="Recover account" className="text-[9px] font-black text-[#2D5A27] uppercase tracking-widest hover:text-[#1A1A40]">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2D5A27] transition-colors"
                  size={18}
                />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-4 rounded-[2rem] border-2 border-gray-100 outline-none focus:border-[#2D5A27] transition-all font-bold text-gray-700 bg-white placeholder:text-gray-200"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#2D5A27]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="group w-full bg-[#2D5A27] text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-[#1A1A40] transition-all flex items-center justify-center gap-3 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <span>Enter Academy</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">
              New to the family? <Link to="/register" className="text-[#2D5A27] font-black italic underline underline-offset-4 ml-1">Enroll Here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;