import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import { ShieldCheck, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // 🚀 Decode the email and token from URL params
  const rawEmail = searchParams.get("email") || "";
  const decodedEmail = decodeURIComponent(rawEmail);
  const token = searchParams.get("token") || "";

  const [formData, setFormData] = useState({
    token: token,
    email: decodedEmail,
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Modal trigger
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Sync state if URL params change
  useEffect(() => {
    if (!token || !decodedEmail) {
      setError("Invalid or expired reset link. Please request a new one.");
    }
  }, [token, decodedEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password", formData);
      // ✅ Trigger the success modal instead of alert
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-20 px-4 relative">
        <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-white p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-800">
              New <span className="text-blue-600">Password</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
              Set a strong password for your FricaLearn account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="New Password"
                className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500"
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-5 top-5 text-gray-400"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <input
              type={showPass ? "text" : "password"}
              required
              value={formData.password_confirmation}
              onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
              placeholder="Confirm New Password"
              className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500"
            />

            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest italic text-center leading-tight">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !formData.token || !formData.email}
              className="w-full bg-gray-900 text-white p-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
            </button>
          </form>
        </div>

        {/* 🏆 SUCCESS MODAL OVERLAY */}
        {isSuccess && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl border-4 border-blue-500 transform animate-in zoom-in duration-300">
              <div className="bg-green-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-green-600">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-gray-800 mb-2">
                All Set!
              </h2>
              <p className="text-sm font-bold text-gray-500 mb-8 leading-relaxed">
                Your password has been updated successfully. You can now log in to the FricaLearn portal.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-gray-900 transition-all shadow-lg shadow-blue-200"
              >
                Proceed to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}