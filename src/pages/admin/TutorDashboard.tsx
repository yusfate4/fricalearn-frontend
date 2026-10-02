import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { TutorShell } from "../../components/admin/TutorShell";
import {
  BookOpen, Video, Users, Zap, Calendar,
  Plus, ChevronRight, Loader2, Clock, BarChart3,
  HelpCircle, GraduationCap, Radio,
} from "lucide-react";

export default function TutorDashboard() {
  const [stats, setStats]       = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [live, setLive]         = useState<any | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, liveRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/live-classes/admin-data"),
        ]);
        setStats(statsRes.data);
        const all: any[] = liveRes.data?.upcoming || [];

        // A class is "live now" if it started within the last 30 min
        const now = Date.now();
        const liveNow = all.find((c: any) => {
          const start = new Date(c.scheduled_at).getTime();
          return start <= now && now <= start + 30 * 60 * 1000;
        });
        setLive(liveNow || null);
        setUpcoming(all.filter((c: any) => c !== liveNow));
      } catch (err) {
        console.error("Tutor dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
    // Re-check every 60 seconds so the Join button appears automatically
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <TutorShell title="Dashboard" liveClass={null}>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#3F2171]" size={36} />
      </div>
    </TutorShell>
  );

  return (
    <TutorShell title="Dashboard" liveClass={live}>
      <div className="space-y-5 animate-in fade-in duration-500">

        {/* ── LIVE NOW banner — most prominent element on the page ── */}
        {live && (
          <a href={live.meeting_url || "#"} target="_blank" rel="noreferrer"
            className="flex items-center justify-between gap-4 bg-[#3F2171] rounded-2xl px-6 py-5 shadow-xl hover:bg-black transition-all group">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-[#FFFF00] rounded-xl flex items-center justify-center shrink-0">
                <Radio size={24} className="text-[#2A1650]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0"/>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-300">
                    Live Now
                  </span>
                </div>
                <p className="font-black text-white text-lg leading-tight truncate">{live.title}</p>
                <p className="text-white/50 text-[10px] font-bold">Your class is running — tap to join</p>
              </div>
            </div>
            <div className="shrink-0 bg-[#FFFF00] text-[#2A1650] px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest group-hover:scale-105 transition-transform">
              Join Now →
            </div>
          </a>
        )}

        {/* ── Greeting ─────────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 italic uppercase tracking-tighter">
            Ẹ n lẹ́, Olùkọ́! 👋
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Your classroom overview
          </p>
        </div>

        {/* ── Summary Stats ────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Curriculum Lessons", value: stats?.total_lessons    || 0, icon: BookOpen,      color: "bg-orange-50", ic: "text-orange-500" },
            { label: "Active Sessions",    value: stats?.total_live_classes || 0, icon: Video,        color: "bg-red-50",    ic: "text-red-500"    },
            { label: "Academy Students",  value: stats?.total_students    || 0, icon: Users,         color: "bg-blue-50",   ic: "text-blue-500"   },
            { label: "Total Courses",     value: stats?.total_courses     || 0, icon: GraduationCap, color: "bg-[#f3effa]", ic: "text-[#3F2171]"  },
          ].map(({ label, value, icon: Icon, color, ic }) => (
            <div key={label} className="bg-white rounded-2xl border-2 border-gray-100 p-4 sm:p-5">
              <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={18} className={ic} />
              </div>
              <p className="text-2xl font-black text-gray-800">{value.toLocaleString()}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Upcoming classes + Rapid Launch ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Upcoming classes */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Video size={16} className="text-[#3F2171]" />
                <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">
                  Upcoming Classes
                </h3>
              </div>
              <Link to="/admin/live-classes"
                className="text-[10px] font-black text-[#3F2171] uppercase tracking-widest hover:underline">
                Manage
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <div className="text-center py-10">
                <Video size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="font-black text-gray-400 uppercase italic text-sm">No upcoming classes</p>
                <Link to="/admin/live-classes"
                  className="inline-flex items-center gap-2 mt-4 bg-[#3F2171] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                  <Plus size={12} /> Schedule One
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {upcoming.slice(0, 4).map((c: any) => {
                  const dt       = new Date(c.scheduled_at);
                  const isToday  = dt.toDateString() === new Date().toDateString();
                  const isSoon   = dt.getTime() - Date.now() < 60 * 60 * 1000; // within 1 hour
                  return (
                    <div key={c.id}
                      className={`flex items-center justify-between px-5 py-3.5 ${isSoon ? "bg-yellow-50" : ""}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${isToday ? "bg-[#3F2171] text-white" : "bg-gray-100 text-gray-500"}`}>
                          <span className="font-black text-sm leading-none">
                            {dt.toLocaleDateString("en-GB", { day: "numeric" })}
                          </span>
                          <span className="font-bold text-[8px] uppercase leading-none mt-0.5">
                            {dt.toLocaleDateString("en-GB", { month: "short" })}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-gray-700 text-sm truncate">{c.title}</p>
                          <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                            <Clock size={9} />
                            {dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} WAT
                          </p>
                        </div>
                      </div>
                      {c.meeting_url ? (
                        <a href={c.meeting_url} target="_blank" rel="noreferrer"
                          className={`shrink-0 px-3 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                            isSoon
                              ? "bg-[#3F2171] text-white hover:bg-black"
                              : "bg-gray-100 text-gray-600 hover:bg-[#3F2171] hover:text-white"
                          }`}>
                          {isSoon ? "Join →" : "Open"}
                        </a>
                      ) : (
                        <span className="text-[9px] font-bold text-gray-300 shrink-0">No link</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Rapid Launch */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={16} className="text-[#3F2171]" />
                <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">Rapid Launch</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { to: "/admin/live-classes", label: "Schedule Live Class",  desc: "Set up a Zoom or Meet",          color: "bg-red-50 text-red-700 hover:bg-red-100"      },
                  { to: "/admin/lessons",      label: "Upload New Lesson",    desc: "Add videos or worksheets",       color: "bg-orange-50 text-orange-700 hover:bg-orange-100" },
                  { to: "/admin/questions",    label: "Build a Quiz",         desc: "Create student assessments",     color: "bg-[#f3effa] text-[#3F2171] hover:bg-[#ebe5f7]"  },
                ].map(({ to, label, desc, color }) => (
                  <Link key={to} to={to}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${color}`}>
                    <div>
                      <p className="font-black text-sm">{label}</p>
                      <p className="text-[9px] font-bold opacity-60 mt-0.5">{desc}</p>
                    </div>
                    <ChevronRight size={16} className="shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick nav */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Courses",   path: "/admin/courses/list",  icon: GraduationCap, color: "bg-[#3F2171]/10 text-[#3F2171]" },
                { label: "Lessons",   path: "/admin/lessons",       icon: BookOpen,      color: "bg-orange-50 text-orange-600"    },
                { label: "Quizzes",   path: "/admin/questions",     icon: HelpCircle,    color: "bg-blue-50 text-blue-600"        },
                { label: "Analytics", path: "/admin/analytics",     icon: BarChart3,     color: "bg-green-50 text-green-600"      },
              ].map(({ label, path, icon: Icon, color }) => (
                <Link key={path} to={path}
                  className={`flex items-center gap-2.5 p-3.5 rounded-xl ${color} hover:opacity-80 transition-all font-bold text-sm`}>
                  <Icon size={16} className="shrink-0" /> {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TutorShell>
  );
}
