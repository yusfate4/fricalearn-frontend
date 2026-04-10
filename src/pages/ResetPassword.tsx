import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import { ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // 🚀 THE FIX: Use decodeURIComponent to clean the email and token
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
    
    // Quick frontend check before hitting the API
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Send the cleaned formData to your api.fricalearn.com
      const res = await api.post("/auth/reset-password", formData);
      alert(res.data.message);
      navigate("/login");
    } catch (err: any) {
      // Capture the clear error message from our Laravel try-catch block
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-20 px-4">
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
      </div>
    </Layout>
  );
}