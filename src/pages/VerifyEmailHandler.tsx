import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  PartyPopper 
} from "lucide-react";

const VerifyEmailHandler: React.FC = () => {
  const { id, hash } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState("Verifying your academy access...");

  useEffect(() => {
    const verify = async () => {
      try {
        // Construct the signed URL parameters that Laravel sent
        const expires = searchParams.get('expires');
        const signature = searchParams.get('signature');

        // Call the backend verification endpoint
        await api.get(`/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`);
        
        setStatus('success');
        setMessage("Ọpẹ́! Your email has been successfully verified.");
        
        // Auto-redirect to login after 3 seconds of "Success" glory
        setTimeout(() => {
          navigate("/login", { 
            state: { message: "Account verified! You can now log in to the academy." } 
          });
        }, 3500);

      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || "This verification link has expired or is invalid.");
      }
    };

    if (id && hash) {
      verify();
    }
  }, [id, hash, searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#FDFCF6] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-white p-10 md:p-16 text-center relative overflow-hidden">
          
          {/* --- LOADING STATE --- */}
          {status === 'loading' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-center mb-8">
                <Loader2 className="text-[#2D5A27] animate-spin" size={60} />
              </div>
              <h2 className="text-2xl font-black text-[#1A1A40] uppercase italic tracking-tighter mb-4">
                Authenticating...
              </h2>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                Securing your diaspora connection
              </p>
            </div>
          )}

          {/* --- SUCCESS STATE --- */}
          {status === 'success' && (
            <div className="animate-in zoom-in duration-500">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-[#2D5A27]">
                  <PartyPopper size={48} className="animate-bounce" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-[#1A1A40] uppercase italic tracking-tighter mb-4">
                Ẹ ṣé!
              </h2>
              <p className="text-gray-600 font-medium mb-8 leading-relaxed">
                {message}
              </p>
              <div className="flex items-center justify-center gap-2 text-[#2D5A27] font-black text-[10px] uppercase tracking-widest">
                Redirecting to Login <Loader2 size={14} className="animate-spin" />
              </div>
            </div>
          )}

          {/* --- ERROR STATE --- */}
          {status === 'error' && (
            <div className="animate-in shake duration-500">
              <div className="flex justify-center mb-8 text-red-500">
                <AlertCircle size={64} />
              </div>
              <h2 className="text-2xl font-black text-red-600 uppercase italic tracking-tighter mb-4">
                Verification Failed
              </h2>
              <p className="text-gray-600 font-medium mb-10">
                {message}
              </p>
              <button 
                onClick={() => navigate("/login")}
                className="w-full py-4 bg-[#1A1A40] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
              >
                <ArrowRight size={18} /> Back to Login
              </button>
            </div>
          )}

        </div>

        {/* Brand Footnote */}
        <p className="text-center mt-8 font-bold text-[#1A1A40]/20 uppercase tracking-[0.4em] text-[8px]">
          FricaLearn Secure Verification
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailHandler;