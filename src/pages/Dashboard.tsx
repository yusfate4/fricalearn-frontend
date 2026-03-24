import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import {
  BookOpen,
  Trophy,
  Star,
  PlayCircle,
  Zap,
  ChevronRight,
  Award,
} from "lucide-react";

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

  if (loading)
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-black text-gray-400 uppercase tracking-widest text-xs italic">
            Syncing your progress...
          </p>
        </div>
      </Layout>
    );

  const profile = data?.student_profile;
  const totalPoints = profile?.total_points || 0;

  // Dynamic Level Calculation for Progress Bar
  const currentLevelPoints = totalPoints % 500;
  const progressPercent = (currentLevelPoints / 500) * 100;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-10">
        <div className="mb-10 animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-4xl font-black text-gray-800 mb-2 italic uppercase tracking-tighter">
            Ẹ káàbọ̀, {data?.name}! 👋
          </h1>
          <p className="text-gray-500 font-bold text-lg">
            You are officially a{" "}
            <span className="text-[#2D5A27]">{profile?.rank}</span>. Ready for
            more?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* --- DYNAMIC LEVEL & PROGRESS CARD --- */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-white relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Trophy size={200} />
            </div>

            <div className="flex items-center gap-5 mb-8">
              <div className="bg-yellow-400 p-5 rounded-[2rem] text-white shadow-xl shadow-yellow-100 animate-pulse">
                <Star size={36} fill="white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Current Status
                </p>
                <h2 className="text-4xl font-black text-gray-800 italic uppercase tracking-tight">
                  Level {profile?.current_level || 1}
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                  Rank:{" "}
                  <span className="text-[#2D5A27] italic">{profile?.rank}</span>
                </p>
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  {profile?.xp_to_next_level} XP left to next level
                </p>
              </div>

              {/* Level Progress Bar */}
              <div className="h-8 w-full bg-gray-100 rounded-3xl p-1.5 border-2 border-gray-50 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2D5A27] via-green-500 to-yellow-400 rounded-2xl transition-all duration-1000 flex items-center justify-end px-3 shadow-inner"
                  style={{ width: `${progressPercent}%` }}
                >
                  <Zap
                    size={12}
                    className="text-white animate-bounce"
                    fill="white"
                  />
                </div>
              </div>

              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                Your total journey: {totalPoints} Points earned so far!
              </p>
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#2D5A27] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 opacity-10">
                <Zap size={100} />
              </div>
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">
                Total Points
              </p>
              <h3 className="text-6xl font-black mb-6 tracking-tighter italic">
                {totalPoints}
              </h3>
              <button
                onClick={() => navigate("/leaderboard")}
                className="w-full flex items-center justify-center gap-2 text-[10px] font-black bg-white/10 py-4 rounded-2xl hover:bg-white/20 transition-all uppercase tracking-widest border border-white/5"
              >
                View Global Ranks <ChevronRight size={14} />
              </button>
            </div>

            {/* Learning Language Badge */}
            <div className="bg-white p-6 rounded-[2rem] border-2 border-gray-50 flex items-center gap-4 shadow-sm">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 shadow-inner">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Learning
                </p>
                <p className="text-xl font-black text-gray-800 italic uppercase">
                  {profile?.learning_language || "Yoruba"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- BADGE SHOWCASE --- */}
        <div className="mb-10">
          <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter italic mb-6 flex items-center gap-2">
            <Award className="text-yellow-500" /> My Badges
          </h3>
          <div className="flex flex-wrap gap-4">
            {profile?.badges?.length > 0 ? (
              profile.badges.map((badge: any) => (
                <div
                  key={badge.id}
                  className="bg-white px-6 py-4 rounded-[1.5rem] border-2 border-gray-100 flex items-center gap-3 shadow-sm hover:scale-105 transition-transform cursor-help group relative"
                >
                  <div className="text-2xl">🏅</div>
                  <span className="font-black text-gray-700 uppercase italic text-xs">
                    {badge.name}
                  </span>

                  {/* Hover Tooltip for Badge Description */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-4 bg-gray-900 text-white text-[10px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                    <p className="font-bold mb-1 uppercase text-yellow-400">
                      {badge.name}
                    </p>
                    <p className="opacity-80">{badge.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full p-8 rounded-[2rem] border-2 border-dashed border-gray-100 text-center">
                <p className="text-gray-300 font-bold uppercase italic text-sm">
                  Finish 5 lessons to earn your first badge!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Hero Quick Action */}
        <div className="bg-gradient-to-br from-[#2D5A27] via-[#1a3a17] to-black rounded-[3rem] p-10 md:p-14 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group border-t-4 border-green-400/20">
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight italic tracking-tighter">
              Your next adventure <br />
              is waiting!
            </h2>
            <p className="text-green-100 font-bold text-lg max-w-md opacity-80 mb-8 italic">
              "A child who washes his hands clean will dine with elders." — Keep
              practicing Ayo!
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="bg-yellow-400 text-black px-12 py-6 rounded-[2.5rem] font-black text-2xl flex items-center gap-4 hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-yellow-900/40 uppercase italic tracking-tight mx-auto md:mx-0"
            >
              <PlayCircle size={32} />
              <span>Play Now</span>
            </button>
          </div>
          <div className="hidden md:block opacity-10 group-hover:opacity-20 transition-all duration-700 group-hover:rotate-12 scale-150">
            <PlayCircle size={250} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
