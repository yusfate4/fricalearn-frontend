import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import {
  BookOpen, Trophy, Star, PlayCircle, Zap,
  ChevronRight, ArrowLeftCircle, Loader2,
  Clock, MessageCircle, Video, Bot, ArrowRight,
  Sparkles,
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

const AI_LIMIT = 60;

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
        <Loader2 className="w-10 h-10 text-[#3F2171] animate-spin mb-4"/>
        <p className="font-black text-gray-300 uppercase tracking-widest text-[10px] italic">
          Syncing your progress…
        </p>
      </div>
    </Layout>
  );

  const profile            = data?.student_profile;
  const totalPoints        = profile?.total_points    || 0;
  const aiMinutesUsed      = profile?.daily_ai_minutes || 0;
  const aiMinutesLeft      = Math.max(AI_LIMIT - aiMinutesUsed, 0);
  const currentLevelPoints = totalPoints % 500;
  const progressPercent    = Math.min((currentLevelPoints / 500) * 100, 100);
  const level              = Math.floor(totalPoints / 500) + 1;
  const aiUrgent           = aiMinutesLeft < 15;

  return (
    <Layout>
      {/* ── Impersonation banner ─────────────────────────── */}
      {isImpersonating && (
        <div className="bg-yellow-400 mx-4 sm:mx-6 mt-4 sm:mt-6 rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-yellow-900 shrink-0"/>
            <p className="text-[9px] font-black text-yellow-900 uppercase tracking-widest text-center sm:text-left">
              Viewing as: <span className="italic">{data?.name}</span>
            </p>
          </div>
          <button onClick={handleExitView}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter hover:bg-black transition-all">
            <ArrowLeftCircle size={13}/> Exit Portal
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-7">

        {/* Trial banner */}
        <TrialBanner onUpgradeClick={() => setShowPaywall(true)}/>

        <PaywallModal
          open={showPaywall}
          onClose={() => setShowPaywall(false)}
          onUnlocked={() => { setShowPaywall(false); window.location.reload(); }}
        />

        {/* ── 1. Greeting ──────────────────────────────────── */}
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">
            Welcome, {data?.name?.split(" ")[0] || "Explorer"}! 👋
          </h1>
          <p className="text-gray-400 font-bold text-sm mt-1.5">
            You are a{" "}
            <span className="text-[#3F2171] font-black underline decoration-yellow-400 decoration-4">
              {profile?.current_level || "Beginner"}
            </span>
            {" "}· Level {level}
          </p>
        </div>

        {/* ── 2. TWO-COLUMN hero actions ───────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

          {/* Start Learning */}
          <div className="bg-gradient-to-br from-[#3F2171] to-[#1E1038] rounded-[2rem] p-6 sm:p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group min-h-[160px]">
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <BookOpen size={120}/>
            </div>
            <div className="relative z-10 mb-5">
              <p className="text-white/50 font-black text-[9px] uppercase tracking-widest mb-1.5">
                Your curriculum is ready
              </p>
              <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter leading-tight">
                Ready for<br/>your next lesson?
              </h2>
            </div>
            <button onClick={() => navigate("/courses")}
              className="relative z-10 bg-[#FFFF00] text-[#2A1650] px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-white transition-all shadow-lg uppercase border-b-4 border-yellow-500 active:translate-y-0.5 active:border-b-0 self-start">
              <PlayCircle size={18}/> Start Learning
            </button>
          </div>

          {/* ── AI Tutor — PROMINENT ── */}
          <div className="bg-[#FFFF00] rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group min-h-[160px]"
            onClick={() => navigate("/olu-chat")}
            style={{ cursor: "pointer" }}>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Bot size={130}/>
            </div>
            <div className="relative z-10 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[#2A1650] rounded-xl flex items-center justify-center">
                  <Bot size={16} className="text-[#FFFF00]"/>
                </div>
                <p className="text-[#2A1650]/60 font-black text-[9px] uppercase tracking-widest">
                  AI Tutor · 24 / 7
                </p>
              </div>
              <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter text-[#2A1650] leading-tight">
                Got a question?<br/>Ask the AI Tutor
              </h2>
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <button onClick={(e) => { e.stopPropagation(); navigate("/olu-chat"); }}
                className="bg-[#2A1650] text-[#FFFF00] px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-black transition-all shadow-lg uppercase border-b-4 border-[#1A1040] active:translate-y-0.5 active:border-b-0">
                <Sparkles size={16}/> Talk Now
              </button>
              <div className="text-right">
                <p className="text-[#2A1650] font-black text-lg leading-none">{aiMinutesLeft}</p>
                <p className="text-[#2A1650]/50 text-[8px] font-black uppercase tracking-widest">mins left</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Stats row ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

          {/* XP Progress — spans 2 cols on sm+ */}
          <div className="sm:col-span-2 bg-white p-5 sm:p-7 rounded-[2rem] shadow-lg border-2 border-gray-50 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-[#FFFF00] p-3 rounded-2xl shadow">
                <Star size={22} fill="#2A1650" color="#2A1650"/>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">XP Progress</p>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-800 italic uppercase tracking-tight leading-none">
                  Level {level}
                </h2>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl sm:text-3xl font-black text-[#3F2171]">{totalPoints}</p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total XP</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  Rank: <span className="text-[#3F2171] italic">{profile?.current_level || "Beginner"}</span>
                </p>
                <p className="text-[9px] font-black text-gray-400 uppercase">
                  {Math.max(500 - currentLevelPoints, 0)} XP to next
                </p>
              </div>
              <div className="h-5 sm:h-6 w-full bg-gray-100 rounded-3xl p-1 border-2 border-gray-50 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#3F2171] to-[#FFFF00] rounded-2xl transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}/>
              </div>
            </div>
          </div>

          {/* Leaderboard shortcut */}
          <div className="bg-[#3F2171] p-5 sm:p-6 rounded-[2rem] text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center mb-3">
                <Trophy size={20} className="text-[#FFFF00]"/>
              </div>
              <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">Points</p>
              <p className="text-4xl font-black tracking-tighter italic">{totalPoints}</p>
            </div>
            <button onClick={() => navigate("/leaderboard")}
              className="mt-4 w-full py-3 bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center gap-1.5">
              Leaderboard <ChevronRight size={12}/>
            </button>
          </div>
        </div>

        {/* ── 4. Quick links ───────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: BookOpen,     label: "My Lessons",   path: "/courses",      bg: "bg-blue-50",   ic: "text-blue-600" },
            { icon: Bot,          label: "AI Tutor",     path: "/olu-chat",     bg: "bg-[#FFFF00]", ic: "text-[#2A1650]" },
            { icon: Trophy,       label: "Leaderboard",  path: "/leaderboard",  bg: "bg-purple-50", ic: "text-purple-600" },
            { icon: Star,         label: "My Rewards",   path: "/my-rewards", bg: "bg-orange-50", ic: "text-orange-500" },
          ].map(({ icon: Icon, label, path, bg, ic }) => (
            <button key={label} onClick={() => navigate(path)}
              className="flex flex-col items-center gap-2 bg-white border-2 border-gray-100 rounded-2xl p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon size={18} className={ic}/>
              </div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-600 text-center leading-tight">
                {label}
              </p>
            </button>
          ))}
        </div>

        {/* ── 5. Live Classes ──────────────────────────────── */}
        {liveClasses.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-black text-gray-800 uppercase italic tracking-tighter">
                Upcoming Live Class
              </h2>
              <button onClick={() => navigate(`/live-room/${liveClasses[0].id}`)}
                className="hidden sm:flex items-center gap-2 bg-[#3F2171] text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all">
                <Video size={13}/> Join Now
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {liveClasses.map(lc => <LiveClassCard key={lc.id} liveClass={lc}/>)}
            </div>
          </section>
        )}

      </div>
    </Layout>
  );
}
