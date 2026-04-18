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
  ArrowLeftCircle,
  Loader2,
  Clock,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { LiveClassCard } from "../components/LiveClass/LiveClassCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);

  const isImpersonating = localStorage.getItem("is_impersonating") === "true";
  const activeStudentId = localStorage.getItem("active_student_id");

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      let studentInfo;
      const liveRes = await api.get("/live-classes");

      if (isImpersonating && activeStudentId) {
        const childRes = await api.get(
          `/parent/active-student/${activeStudentId}`,
        );
        studentInfo = childRes.data;
      } else {
        const meRes = await api.get("/me");
        studentInfo = meRes.data;
      }

      setData(studentInfo);
      setLiveClasses(Array.isArray(liveRes.data) ? liveRes.data : []);
    } catch (err) {
      console.error("Dashboard Sync failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "parent" && !isImpersonating) {
      navigate("/parent/dashboard");
      return;
    }
    fetchDashboardData();
  }, [user, navigate, isImpersonating, activeStudentId]);

  const handleExitView = () => {
    localStorage.removeItem("is_impersonating");
    localStorage.removeItem("active_student_id");
    localStorage.removeItem("active_course_id");
    window.location.href = "/parent/dashboard";
  };

  if (loading)
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] px-6 text-center">
          <Loader2 className="w-12 h-12 text-[#2D5A27] animate-spin mb-4" />
          <p className="font-black text-gray-400 uppercase tracking-widest text-[10px] italic">
            Syncing Student Progress...
          </p>
        </div>
      </Layout>
    );

  const profile = data?.student_profile;
  const totalPoints = profile?.total_points || 0;
  
  // 🕒 AI Time Management Logic (Item 10)
  const aiMinutesUsed = profile?.daily_ai_minutes || 0;
  const aiMinutesLeft = Math.max(120 - aiMinutesUsed, 0);

  // 🌍 Dynamic Greeting Map (Item 5)
  const greetingMap: Record<string, string> = {
    Yoruba: "Ẹ káàbọ̀",
    Igbo: "Nnoo",
    Hausa: "Barka da zuwa",
    English: "Welcome",
  };

  const currentLevelPoints = totalPoints % 500;
  const progressPercent = Math.min((currentLevelPoints / 500) * 100, 100);
  const languageTrack = profile?.learning_language || "Yoruba";
  const welcomeText = greetingMap[languageTrack] || greetingMap.Yoruba;

  return (
    <Layout>
      {isImpersonating && (
        <div className="bg-yellow-400 p-3 mb-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 shadow-lg mx-4 md:mx-10 mt-6 animate-in slide-in-from-top duration-500 gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-yellow-900 flex-shrink-0" />
            <p className="text-[9px] md:text-[10px] font-black text-yellow-900 uppercase tracking-widest">
              Viewing as Student: <span className="italic">{data?.name}</span>
            </p>
          </div>
          <button
            onClick={handleExitView}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter hover:bg-black transition-all"
          >
            <ArrowLeftCircle size={14} /> Exit Portal
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6 md:p-10">
        {/* 👋 Personalized Greeting Section */}
        <div className="mb-8 md:mb-10 animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-800 mb-2 italic uppercase tracking-tighter leading-none">
            {welcomeText}, <br className="md:hidden" /> {data?.name || "Explorer"}! 👋
          </h1>
          <p className="text-gray-500 font-bold text-base md:text-lg mt-2">
            You are officially a{" "}
            <span className="text-[#2D5A27] font-black underline decoration-yellow-400 decoration-4">
              {profile?.rank || "Akeko"}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
          {/* XP Progress Card */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border-4 border-white relative overflow-hidden group">
            <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
              <div className="bg-yellow-400 p-4 md:p-5 rounded-2xl md:rounded-[2rem] text-white shadow-xl shadow-yellow-100">
                <Star size={28} md:size={36} fill="white" />
              </div>
              <div>
                <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Current Status
                </p>
                <h2 className="text-2xl md:text-4xl font-black text-gray-800 italic uppercase tracking-tight leading-none">
                  Level {Math.floor(totalPoints / 500) + 1}
                </h2>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end px-1">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Rank: <span className="text-[#2D5A27] italic">{profile?.rank || "Akeko"}</span>
                </p>
                <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase">
                  {Math.max(500 - currentLevelPoints, 0)} XP to Next
                </p>
              </div>
              <div className="h-6 md:h-8 w-full bg-gray-100 rounded-3xl p-1 md:p-1.5 border-2 border-gray-50 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2D5A27] to-green-500 rounded-2xl transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Points & Oluko Time Sidebar */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-[#2D5A27] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
              <p className="text-[9px] md:text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Total Points</p>
              <h3 className="text-5xl md:text-6xl font-black mb-4 md:mb-6 tracking-tighter italic">{totalPoints}</h3>
              <button
                onClick={() => navigate("/leaderboard")}
                className="w-full py-4 bg-white/10 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/5"
              >
                View Global Ranks <ChevronRight size={14} className="inline ml-1" />
              </button>
            </div>

            {/* 🕒 Oluko AI Timer Card (Item 10) */}
            <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-[2rem] border-2 border-gray-50 shadow-sm">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Oluko (AI) Time</p>
                  <p className="text-sm font-black text-gray-800">{aiMinutesLeft} mins left today</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${aiMinutesLeft < 20 ? 'bg-red-500' : 'bg-purple-500'}`}
                  style={{ width: `${(aiMinutesLeft / 120) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action CTA */}
        <div className="bg-gradient-to-br from-[#2D5A27] to-black rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-8 leading-tight italic tracking-tighter">
              Ready to learn <br className="hidden md:block" /> with Oluko?
            </h2>
            <button
              onClick={() => navigate("/courses")}
              className="w-full md:w-auto bg-yellow-400 text-black px-8 py-5 md:px-12 md:py-6 rounded-2xl md:rounded-[2.5rem] font-black text-xl md:text-2xl flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl uppercase italic"
            >
              <PlayCircle size={24} md:size={32} /> Go to Lessons
            </button>
          </div>
          <div className="hidden lg:block opacity-20 group-hover:opacity-40 transition-opacity">
            <Trophy size={180} />
          </div>
        </div>

        {/* Live Classes Section */}
     {/* Live Classes Section */}
{liveClasses.length > 0 && (
  <section className="mt-12 md:mt-16">
    <div className="flex justify-between items-end px-2 mb-8">
      <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase italic tracking-tighter">
        Upcoming Live Class
      </h2>
      {/* This button directs them to the live room */}
      <button 
        onClick={() => navigate(`/live-room/${liveClasses[0].id}`)}
        className="hidden md:flex items-center gap-2 bg-[#2D5A27] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black"
      >
        <Video size={14} /> Join Now
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {liveClasses.map((lc) => (
        <LiveClassCard key={lc.id} liveClass={lc} />
      ))}
    </div>
  </section>
)}
      </div>
    </Layout>
  );
}

function ShieldCheck({ size, className }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}