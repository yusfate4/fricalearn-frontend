import React, { useState } from "react";
import api from "../api/axios";
import { Loader2, AlertCircle } from "lucide-react"; // Added icons for a better look

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 👈 New Loading State
  const [error, setError] = useState(""); // 👈 New Error State

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      const response = await api.post("/login", { email, password });
      localStorage.setItem("auth_token", response.data.token);

      // REMOVED: alert() - We just go straight to the dashboard now
      window.location.href = "/dashboard";
    } catch (error: any) {
      // REMOVED: alert() - We set the error state instead
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100 w-full max-w-md animate-in fade-in zoom-in duration-300"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#2D5A27] mb-2">
            FricaLearn
          </h2>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Student Portal
          </p>
        </div>

        {/* --- Error Message Display --- */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 text-red-600 rounded-2xl flex items-center gap-2 font-bold text-sm animate-in shake duration-300">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@email.com"
              className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-frica-green rounded-2xl font-bold outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-frica-green rounded-2xl font-bold outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-[#2D5A27] text-white py-5 rounded-[1.5rem] font-black text-xl shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              <span>Checking...</span>
            </>
          ) : (
            "Log In to Academy"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
