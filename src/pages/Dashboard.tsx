import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import {
  BookOpen, Trophy, Star, PlayCircle, Zap,
  ChevronRight, ArrowLeftCircle, Loader2,
  Clock, MessageCircle, Video,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { LiveClassCard } from "../components/LiveClass/LiveClassCard";
import TrialBanner from "../components/TrialBanner";
import PaywallModal from "../components/PaywallModal";

function ShieldCheck({ size, className }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

const AI_LIMIT = 60; // Daily AI Tutor minutes

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData]           = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [showPaywall, setShowPaywall] = useState(false);

  const isImpersonating = localStorage.getItem("is_impersonating") === "true";
  const activeStudentId = localStorage.getItem("active_student_id");

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const liveRes = await api.get("/live-classes");
      let studentInfo;
      if (isImpersonating && activeStudentId) {
        const childRes = await api.get(`/parent/active-student/${activeStudentId}`);
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

  if (loading) return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[60vh] px-6 text-center">
        <Loader2 className="w-12 h-12 text-[#3F2171] animate-spin mb-4"/>
        <p className="font-black text-gray-400 uppercase tracking-widest text-[10px] italic">
          Syncing Student Progress...
        </p>
      </div>
    </Layout>
  );

  const profile            = data?.student_profile;
  const totalPoints        = profile?.total_points || 0;
  const aiMinutesUsed      = profile?.daily_ai_minutes || 0;
  const aiMinutesLeft      = Math.max(AI_LIMIT - aiMinutesUsed, 0);
  const currentLevelPoints = totalPoints % 500;
  const progressPercent    = Math.min((currentLevelPoints / 500) * 100, 100);

  return (
    <Layout>
      {/* Impersonation banner */}
      {isImpersonating && (
        <div className="bg-yellow-400 p-3 mb-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 shadow-lg mx-4 md:mx-10 mt-6 animate-in slide-in-from-top duration-500 gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-yellow-900 flex-shrink-0"/>
            <p className="text-[9px] md:text-[10px] font-black text-yellow-900 uppercase tracking-widest">
              Viewing as Student: <span className="italic">{data?.name}</span>
            </p>
          </div>
          <button onClick={handleExitView}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter hover:bg-black transition-all">
            <ArrowLeftCircle size={14}/> Exit Portal
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6 md:p-10 space-y-6 md:space-y-8">

        {/* 🆓 Trial status banner (hidden for premium users) */}
        <TrialBanner onUpgradeClick={() => setShowPaywall(true)} />

        {/* 💳 Upgrade paywall (opened from banner) */}
        <PaywallModal
          open={showPaywall}
          onClose={() => setShowPaywall(false)}
          onUnlocked={() => { setShowPaywall(false); window.location.reload(); }}
        />

        {/* ── 1. GREETING (compact) ─────────────────────────── */}
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-3xl md:text-5xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">
            Welcome, {data?.name || "Explorer"}! 👋
          </h1>
          <p className="text-gray-500 font-bold text-base mt-2">
            You are a{" "}
            <span className="text-[#3F2171] font-black underline decoration-yellow-400 decoration-4">
              {profile?.current_level || "Beginner"}
            </span>
          </p>
        </div>

        {/* ── 2. START LEARNING CTA — VISIBLE FIRST ────────── */}
        <div className="bg-gradient-to-br from-[#3F2171] to-[#1E1038] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 text-white flex flex-col sm:flex-row items-center justify-between shadow-2xl relative overflow-hidden group animate-in fade-in duration-700">
          {/* Background trophy */}
          <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity hidden lg:block">
            <Trophy size={160}/>
          </div>

          <div className="relative z-10 mb-6 sm:mb-0 text-center sm:text-left">
            <p className="text-white/60 font-black text-[10px] uppercase tracking-widest mb-2">
              Your Curriculum is Ready
            </p>
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-tight">
              Ready to start your lesson?
            </h2>
          </div>

          <button onClick={() => navigate("/courses")}
            className="relative z-10 shrink-0 bg-[#FFFF00] text-black px-8 py-5 md:px-10 md:py-6 rounded-[2rem] font-black text-lg md:text-xl flex items-center gap-3 hover:scale-105 transition-all shadow-xl uppercase italic border-b-4 border-yellow-600 active:translate-y-1 active:border-b-0 w-full sm:w-auto justify-center">
            <PlayCircle size={28}/> Start Learning
          </button>
        </div>

        {/* ── 3. STATS ROW ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">

          {/* XP Progress */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border-4 border-white relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#FFFF00] p-4 rounded-2xl text-white shadow-xl shadow-yellow-100">
                <Star size={28} fill="white"/>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Current Status</p>
                <h2 className="text-3xl md:text-4xl font-black text-gray-800 italic uppercase tracking-tight leading-none">
                  Level {Math.floor(totalPoints / 500) + 1}
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end px-1">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Rank: <span className="text-[#3F2171] italic">{profile?.current_level || "Beginner"}</span>
                </p>
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  {Math.max(500 - currentLevelPoints, 0)} XP to Next Level
                </p>
              </div>
              <div className="h-6 md:h-8 w-full bg-gray-100 rounded-3xl p-1 md:p-1.5 border-2 border-gray-50 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#3F2171] to-green-500 rounded-2xl transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}/>
              </div>
            </div>
          </div>

          {/* Right column: Points + AI Tutor timer */}
          <div className="space-y-4 md:space-y-5">
            {/* Points */}
            <div className="bg-[#3F2171] p-6 md:p-7 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Total Points</p>
              <h3 className="text-5xl font-black tracking-tighter italic mb-4">{totalPoints}</h3>
              <button onClick={() => navigate("/leaderboard")}
                className="w-full py-3.5 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10">
                View Global Ranks <ChevronRight size={14} className="inline ml-1"/>
              </button>
            </div>

            {/* AI Tutor Timer */}
            <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-[2rem] border-2 border-gray-50 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                  <MessageCircle size={20}/>
                </div>
                <div>
                  {/* ✅ Renamed to "AI Tutor Time" */}
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">AI Tutor Time</p>
                  <p className="text-sm font-black text-gray-800">
                    {aiMinutesLeft} mins left today
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${aiMinutesLeft < 15 ? "bg-red-500" : "bg-purple-500"}`}
                  style={{ width: `${(aiMinutesLeft / AI_LIMIT) * 100}%` }}/>
              </div>
              <p className="text-[9px] font-bold text-gray-400 mt-1.5 text-right">
                {aiMinutesLeft}/{AI_LIMIT} mins
              </p>
            </div>
          </div>
        </div>

        {/* ── 4. LIVE CLASSES ───────────────────────────────── */}
        {liveClasses.length > 0 && (
          <section>
            <div className="flex justify-between items-end px-2 mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase italic tracking-tighter">
                Upcoming Live Class
              </h2>
              <button onClick={() => navigate(`/live-room/${liveClasses[0].id}`)}
                className="hidden md:flex items-center gap-2 bg-[#3F2171] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black">
                <Video size={14}/> Join Now
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveClasses.map((lc) => <LiveClassCard key={lc.id} liveClass={lc}/>)}
            </div>
          </section>
        )}

      </div>
    </Layout>
  );
}
