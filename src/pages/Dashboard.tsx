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
      // Fetch Live Classes first
      const liveRes = await api.get("/live-classes");

      if (isImpersonating && activeStudentId) {
        /**
         * 👨‍👩‍👧‍👦 PARENT VIEW:
         * Fetches data for the specific child being viewed.
         */
        const childRes = await api.get(
          `/parent/active-student/${activeStudentId}`,
        );
        studentInfo = childRes.data;

        // 🕵️ DEBUG: Log to see if 'current_track' is coming from the backend
        console.log("Student Data Received:", studentInfo);
      } else {
        /**
         * 🎓 STUDENT VIEW:
         * Standard dashboard for logged-in students.
         */
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
    // Safety check: If a parent lands here without impersonating, send them back
    if (user && user.role === "parent" && !isImpersonating) {
      navigate("/parent/dashboard");
      return;
    }
    fetchDashboardData();
  }, [user, navigate, isImpersonating, activeStudentId]);

  const handleExitView = () => {
    localStorage.removeItem("is_impersonating");
    localStorage.removeItem("active_student_id");
    localStorage.removeItem("active_course_id"); // Clean up the course ID too
    window.location.href = "/parent/dashboard";
  };

  if (loading)
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 text-[#2D5A27] animate-spin mb-4" />
          <p className="font-black text-gray-400 uppercase tracking-widest text-xs italic">
            Syncing Student Progress...
          </p>
        </div>
      </Layout>
    );

  const profile = data?.student_profile;
  const totalPoints = profile?.total_points || 0;

  // Logic for the XP Bar (assuming 500 XP per level)
  const currentLevelPoints = totalPoints % 500;
  const progressPercent = Math.min((currentLevelPoints / 500) * 100, 100);

  /**
   * 🚀 DYNAMIC TRACK LOGIC:
   * 1. Priority 1: 'current_track' (Passed from ParentController)
   * 2. Priority 2: 'learning_language' (From the static profile)
   * 3. Fallback: "Discovering..."
   */
  const displayTrack =
    data?.current_track || profile?.learning_language || "Discovering...";

  return (
    <Layout>
      {/* 🚀 IMPERSONATION BANNER */}
      {isImpersonating && (
        <div className="bg-yellow-400 p-3 mb-6 rounded-2xl flex items-center justify-between px-6 shadow-lg mx-4 md:mx-10 mt-6 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-yellow-900" />
            <p className="text-[10px] font-black text-yellow-900 uppercase tracking-widest">
              Viewing as Student: <span className="italic">{data?.name}</span>
            </p>
          </div>
          <button
            onClick={handleExitView}
            className="flex items-center gap-2 bg-yellow-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter hover:bg-black transition-all active:scale-95"
          >
            <ArrowLeftCircle size={14} /> Exit to Parent Portal
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4 md:p-10">
        <div className="mb-10 animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-2 italic uppercase tracking-tighter leading-none">
            Ẹ káàbọ̀, {data?.name}! 👋
          </h1>
          <p className="text-gray-500 font-bold text-lg mt-3">
            You are officially a{" "}
            <span className="text-[#2D5A27] font-black underline decoration-yellow-400 decoration-4">
              {profile?.rank || "Akeko"}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* XP Progress Card */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-white relative overflow-hidden group">
            <div className="flex items-center gap-5 mb-8">
              <div className="bg-yellow-400 p-5 rounded-[2rem] text-white shadow-xl shadow-yellow-100">
                <Star size={36} fill="white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Current Status
                </p>
                <h2 className="text-4xl font-black text-gray-800 italic uppercase tracking-tight leading-none">
                  Level{" "}
                  {profile?.current_level || Math.floor(totalPoints / 500) + 1}
                </h2>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end px-1">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                  Rank:{" "}
                  <span className="text-[#2D5A27] italic">
                    {profile?.rank || "Akeko"}
                  </span>
                </p>
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  {Math.max(500 - currentLevelPoints, 0)} XP to Next Level
                </p>
              </div>
              <div className="h-8 w-full bg-gray-100 rounded-3xl p-1.5 border-2 border-gray-50 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2D5A27] to-green-500 rounded-2xl transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Points Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#2D5A27] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 opacity-10">
                <Zap size={100} />
              </div>
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">
                Total XP Earned
              </p>
              <h3 className="text-6xl font-black mb-6 tracking-tighter italic">
                {totalPoints}
              </h3>
              <button
                onClick={() => navigate("/leaderboard")}
                className="w-full py-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/5"
              >
                View Global Ranks{" "}
                <ChevronRight size={14} className="inline ml-1" />
              </button>
            </div>

            {/* 🎯 THE TRACK BADGE: Now uses 'displayTrack' */}
            <div className="bg-white p-6 rounded-[2rem] border-2 border-gray-50 flex items-center gap-4 shadow-sm">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 shadow-inner">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Active Track
                </p>
                <p className="text-xl font-black text-gray-800 italic uppercase">
                  {displayTrack}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action CTA */}
        <div className="bg-gradient-to-br from-[#2D5A27] to-black rounded-[3.5rem] p-10 md:p-14 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight italic tracking-tighter">
              Your next adventure <br /> is waiting!
            </h2>
            <button
              onClick={() => navigate("/courses")}
              className="bg-yellow-400 text-black px-12 py-6 rounded-[2.5rem] font-black text-2xl flex items-center gap-4 hover:scale-105 transition-all shadow-xl uppercase italic tracking-tight"
            >
              <PlayCircle size={32} /> Start Lesson
            </button>
          </div>
        </div>

        {/* Live Classes Section */}
        {liveClasses.length > 0 && (
          <section className="mt-16 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-3xl font-black text-gray-800 uppercase italic tracking-tighter mb-8 px-2">
              Active Tribe Meetings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

// Simple Icon Component for the Banner
function ShieldCheck({ size, className }: any) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
