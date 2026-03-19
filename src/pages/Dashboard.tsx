import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import { BookOpen, Trophy, Star, PlayCircle, Zap, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/me")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // --- PROGRESS LOGIC (GAM-02) ---
  const calculateProgress = () => {
    const points = data?.student_profile?.total_points || 0;
    if (points < 100) return { percent: (points / 100) * 100, next: 100, label: "Akẹ́kọ̀ọ́" };
    if (points < 300) return { percent: ((points - 100) / 200) * 100, next: 300, label: "Ojagun" };
    if (points < 600) return { percent: ((points - 300) / 300) * 100, next: 600, label: "Akoni" };
    return { percent: 100, next: "Max", label: "Master" };
  };

  const progress = calculateProgress();

  if (loading)
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-12 h-12 border-4 border-frica-green border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Loading your journey...</p>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-10">
        <div className="mb-10 animate-in fade-in slide-in-from-left duration-500">
            <h1 className="text-4xl font-black text-gray-800 mb-2">
              Ẹ káàbọ̀, {data?.name}! 👋
            </h1>
            <p className="text-gray-500 font-bold text-lg">
              You're doing amazing! Your {data?.student_profile?.language} skills are growing.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Rank & Progress Card */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Trophy size={120} />
             </div>
             
             <div className="flex items-center gap-4 mb-6">
                <div className="bg-yellow-400 p-4 rounded-3xl text-white shadow-lg shadow-yellow-100">
                    <Star size={32} fill="white" />
                </div>
                <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Current Rank</p>
                    <h2 className="text-3xl font-black text-gray-800">{data?.student_profile?.rank || "Omode"}</h2>
                </div>
             </div>

             {/* THE PROGRESS BAR */}
             <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <p className="text-sm font-black text-gray-500 uppercase tracking-tighter">
                        Next Level: <span className="text-frica-green">{progress.label}</span>
                    </p>
                    <p className="text-xs font-bold text-gray-400">
                        {data?.student_profile?.total_points || 0} / {progress.next} PTS
                    </p>
                </div>
                <div className="h-6 w-full bg-gray-100 rounded-full p-1 border border-gray-50">
                    <div 
                        className="h-full bg-gradient-to-r from-frica-green to-yellow-400 rounded-full transition-all duration-1000 flex items-center justify-end px-2"
                        style={{ width: `${progress.percent}%` }}
                    >
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                </div>
                <p className="text-xs text-gray-400 italic">
                    Earn {progress.next - (data?.student_profile?.total_points || 0)} more points to level up!
                </p>
             </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
              <div className="bg-[#2D5A27] p-8 rounded-[2.5rem] text-white shadow-xl relative group">
                  <Zap className="absolute top-4 right-4 text-yellow-400 animate-pulse" size={24} />
                  <p className="text-xs font-black opacity-60 uppercase tracking-widest mb-1">Total Points</p>
                  <h3 className="text-5xl font-black mb-4">{data?.student_profile?.total_points || 0}</h3>
                  <button 
                    onClick={() => navigate('/leaderboard')}
                    className="flex items-center gap-2 text-xs font-black bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all"
                  >
                    VIEW LEADERBOARD <ChevronRight size={14} />
                  </button>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border-2 border-gray-50 flex items-center gap-4">
                  <div className="bg-blue-50 p-4 rounded-2xl text-blue-500">
                      <BookOpen size={24} />
                  </div>
                  <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Learning Language</p>
                      <p className="text-xl font-black text-gray-800">{data?.student_profile?.language}</p>
                  </div>
              </div>
          </div>
        </div>

        {/* Hero Quick Action */}
        <div className="bg-gradient-to-br from-frica-green via-[#2D5A27] to-black rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4 leading-tight">Your next adventure <br/>is waiting!</h2>
            <p className="text-green-100 font-bold text-lg max-w-md opacity-80 mb-6">
              "A child who washes his hands clean will dine with elders." — Start your next lesson now!
            </p>
            <button
                onClick={() => navigate("/courses")}
                className="bg-yellow-400 text-black px-10 py-5 rounded-[2rem] font-black text-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow-900/20"
            >
                <PlayCircle size={28} />
                <span>Continue Learning</span>
            </button>
          </div>
          <div className="hidden md:block opacity-20 group-hover:opacity-30 transition-opacity">
              <PlayCircle size={200} />
          </div>
        </div>
      </div>
    </Layout>
  );
}