import React, { useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-20 px-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-white p-8 md:p-12 text-center">
          {!sent ? (
            <>
              <div className="bg-gray-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Mail className="text-[#2D5A27]" size={32} />
              </div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-800 mb-2">
                Forgot <span className="text-[#2D5A27]">Password?</span>
              </h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
                Enter your email and Oluko will send a link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Parent Email"
                    className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-[#2D5A27] transition-all"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest italic">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white p-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-[#2D5A27] transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="animate-in fade-in zoom-in">
              <div className="bg-green-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-green-500" size={40} />
              </div>
              <h2 className="text-2xl font-black italic uppercase text-gray-800 mb-4">
                Check Your <span className="text-green-600">Inbox!</span>
              </h2>
              <p className="text-sm font-bold text-gray-500 leading-relaxed mb-8">
                If an account exists for <b>{email}</b>, you will receive a reset link shortly.
              </p>
            </div>
          )}

          <Link
            to="/login"
            className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </Layout>
  );
}