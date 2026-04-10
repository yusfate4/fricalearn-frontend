import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Mail,
  ArrowLeft,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";

const VerifyNotice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "your email";
  
  const [resending, setResending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleResend = async () => {
    setResending(true);
    setStatus(null);
    try {
      await api.post("/auth/resend-verification", { email });
      setStatus({ 
        type: 'success', 
        msg: "Oluko has sent a fresh link! Please check your inbox or spam folder." 
      });
    } catch (err: any) {
      setStatus({ 
        type: 'error', 
        msg: "Failed to resend. Please try again in a few minutes." 
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF6] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2D5A27] rounded-full opacity-[0.03] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1A1A40] rounded-full opacity-[0.03] -ml-48 -mb-48"></div>

      <div className="w-full max-w-xl relative">
        
        {/* Back Link */}
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-gray-400 font-black uppercase tracking-widest text-[10px] mb-8 hover:text-[#1A1A40] transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-white p-8 md:p-16 text-center relative overflow-hidden">
          
          {/* Header Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-[#2D5A27] animate-pulse">
                <Mail size={40} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-lg">
                <CheckCircle2 size={24} className="text-blue-500" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-black text-[#1A1A40] italic uppercase tracking-tighter mb-4 leading-tight">
            Verify Your <br /> <span className="text-[#2D5A27]">Academy Access</span>
          </h1>
          
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            We’ve sent a verification link to <span className="text-[#1A1A40] font-bold italic underline decoration-green-300 underline-offset-4">{email}</span>. 
            Please click the link to confirm your account and start your family's journey.
          </p>

          {/* Feedback Messages */}
          {status && (
            <div className={`mb-8 p-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-wider animate-in fade-in slide-in-from-top-2 ${
              status.type === 'success' ? 'bg-green-50 text-[#2D5A27] border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {status.msg}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* Primary Action */}
            <button
              onClick={() => window.location.href = "https://mail.google.com"}
              className="w-full py-5 bg-[#1A1A40] text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl hover:bg-[#2D5A27] transition-all flex items-center justify-center gap-3 group"
            >
              Open Mailbox
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Resend Action */}
            <button
              disabled={resending}
              onClick={handleResend}
              className="w-full py-5 bg-gray-50 text-gray-400 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {resending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <RefreshCcw size={16} />
              )}
              {resending ? "Resending..." : "Resend Verification Link"}
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-50">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300">
              Need help? <a href="mailto:hello@fricalearn.com" className="text-[#2D5A27] hover:underline">Contact Support</a>
            </p>
          </div>
        </div>

        {/* Brand Footnote */}
        <div className="text-center mt-10">
          <p className="font-bold text-[#1A1A40]/20 uppercase tracking-[0.4em] text-[8px]">
            FricaLearn Diaspora Academy
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyNotice;