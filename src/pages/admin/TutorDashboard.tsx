import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { TutorShell } from "../../components/admin/TutorShell";
import {
  BookOpen, Video, Users, Zap,
  Plus, ChevronRight, Loader2, Clock,
  BarChart3, HelpCircle, GraduationCap, Calendar,
} from "lucide-react";

export default function TutorDashboard() {
  const [stats, setStats]       = useState<any>(null);
  const [classes, setClasses]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, liveRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/live-classes"), // same endpoint student sidebar uses
        ]);
        setStats(statsRes.data);
        setClasses(Array.isArray(liveRes.data) ? liveRes.data : []);
      } catch (err) {
        console.error("Tutor dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <TutorShell title="Dashboard">
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#3F2171]" size={36} />
      </div>
    </TutorShell>
  );

  // Split into live-now vs upcoming
  const now = Date.now();
  const liveNow = classes.filter(c => {
    const start = new Date(c.scheduled_at).getTime();
    return start <= now && now <= start + 90 * 60 * 1000;
  });
  const upcoming = classes.filter(c => new Date(c.scheduled_at).getTime() > now);

  return (
    <TutorShell title="Dashboard">
      <div className="space-y-6 animate-in fade-in duration-500">

        {/* ── Greeting ─────────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 italic uppercase tracking-tighter">
            Ẹ n lẹ́, Olùkọ́! 👋
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Your classroom overview &amp; academic tools
          </p>
        </div>

        {/* ── Stats ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Curriculum Lessons", value: stats?.total_lessons     || 0, icon: BookOpen,      col: "bg-orange-50",  ic: "text-orange-500" },
            { label: "Active Sessions",    value: stats?.total_live_classes || 0, icon: Video,         col: "bg-red-50",     ic: "text-red-500"    },
            { label: "Academy Students",   value: stats?.total_students     || 0, icon: Users,         col: "bg-blue-50",    ic: "text-blue-500"   },
            { label: "Total Courses",      value: stats?.total_courses      || 0, icon: GraduationCap, col: "bg-[#f3effa]",  ic: "text-[#3F2171]"  },
          ].map(({ label, value, icon: Icon, col, ic }) => (
            <div key={label} className="bg-white rounded-2xl border-2 border-gray-100 p-4 sm:p-5">
              <div className={`w-9 h-9 ${col} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={18} className={ic} />
              </div>
              <p className="text-2xl font-black text-gray-800">{value.toLocaleString()}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* ── UPCOMING LIVE CLASSES ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[#3F2171]" />
              <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">
                Upcoming Live Classes
              </h3>
            </div>
            <Link to="/admin/live-classes"
              className="flex items-center gap-1.5 text-[10px] font-black text-[#3F2171] uppercase tracking-widest hover:underline">
              <Plus size={12} /> Schedule
            </Link>
          </div>

          {/* Live right now */}
          {liveNow.map((c: any) => (
            <a key={c.id}
              href={c.meeting_url || `/live-room/${c.id}`}
              target={c.meeting_url ? "_blank" : "_self"} rel="noreferrer"
              className="flex items-center justify-between px-5 py-4 bg-[#3F2171] hover:bg-black transition-all group">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 bg-[#FFFF00] rounded-xl flex items-center justify-center shrink-0">
                  <Video size={18} className="text-[#2A1650] animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-red-300">Live Now</span>
                  </div>
                  <p className="font-black text-white truncate">{c.title}</p>
                  <p className="text-[10px] text-white/50 font-bold">Tap to join your class</p>
                </div>
              </div>
              <span className="shrink-0 bg-[#FFFF00] text-[#2A1650] px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:scale-105 transition-transform">
                Join →
              </span>
            </a>
          ))}

          {/* Upcoming list */}
          {upcoming.length === 0 && liveNow.length === 0 ? (
            <div className="text-center py-12">
              <Video size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="font-black text-gray-400 uppercase italic text-sm">No classes scheduled yet</p>
              <Link to="/admin/live-classes"
                className="inline-flex items-center gap-2 mt-4 bg-[#3F2171] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                <Plus size={12} /> Schedule a Class
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcoming.map((c: any) => {
                const dt      = new Date(c.scheduled_at);
                const isToday = dt.toDateString() === new Date().toDateString();
                const diffMs  = dt.getTime() - now;
                const isSoon  = diffMs < 60 * 60 * 1000; // within 1 hour

                return (
                  <div key={c.id}
                    className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors ${isSoon ? "bg-yellow-50" : ""}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Date badge */}
                      <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 ${isToday ? "bg-[#3F2171] text-white" : "bg-gray-100 text-gray-600"}`}>
                        <span className="font-black text-sm leading-tight">
                          {dt.toLocaleDateString("en-GB", { day: "numeric" })}
                        </span>
                        <span className="font-bold text-[8px] uppercase leading-tight">
                          {dt.toLocaleDateString("en-GB", { month: "short" })}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="font-black text-gray-700 truncate">{c.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock size={10} className="text-gray-400 shrink-0" />
                          <span className="text-[10px] font-bold text-gray-400">
                            {dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} WAT
                          </span>
                          <span className="text-[10px] font-bold text-gray-300">·</span>
                          <span className="text-[10px] font-bold text-gray-400">
                            {c.duration_minutes || 60} mins
                          </span>
                          {isSoon && (
                            <span className="bg-orange-100 text-orange-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full">
                              Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Join / Open button */}
                    {c.meeting_url ? (
                      <a href={c.meeting_url} target="_blank" rel="noreferrer"
                        className={`shrink-0 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                          isSoon
                            ? "bg-[#3F2171] text-white hover:bg-black"
                            : "bg-gray-100 text-gray-600 hover:bg-[#3F2171] hover:text-white"
                        }`}>
                        {isSoon ? "Join →" : "Open Link"}
                      </a>
                    ) : (
                      <span className="text-[9px] text-gray-300 font-bold shrink-0">No link yet</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Bottom row: Rapid Launch + Quick Nav ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Rapid Launch */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-[#3F2171]" />
              <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">Rapid Launch</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { to: "/admin/live-classes", label: "Schedule Live Class",  desc: "Set up a Zoom or Google Meet",     color: "bg-red-50 text-red-700 hover:bg-red-100"          },
                { to: "/admin/lessons",      label: "Upload New Lesson",    desc: "Add videos, slides or worksheets", color: "bg-orange-50 text-orange-700 hover:bg-orange-100"  },
                { to: "/admin/questions",    label: "Build a Quiz",         desc: "Create student assessments",       color: "bg-[#f3effa] text-[#3F2171] hover:bg-[#ebe5f7]"   },
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
          <div className="grid grid-cols-2 gap-2.5 content-start">
            <p className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
              Quick Access
            </p>
            {[
              { label: "Courses",    path: "/admin/courses/list", icon: GraduationCap, color: "bg-white border-2 border-gray-100 text-[#3F2171] hover:border-[#3F2171]/30" },
              { label: "Lessons",    path: "/admin/lessons",      icon: BookOpen,      color: "bg-white border-2 border-gray-100 text-orange-600 hover:border-orange-200"  },
              { label: "Quizzes",    path: "/admin/questions",    icon: HelpCircle,    color: "bg-white border-2 border-gray-100 text-blue-600 hover:border-blue-200"      },
              { label: "Analytics",  path: "/admin/analytics",    icon: BarChart3,     color: "bg-white border-2 border-gray-100 text-green-600 hover:border-green-200"    },
            ].map(({ label, path, icon: Icon, color }) => (
              <Link key={path} to={path}
                className={`flex items-center gap-2.5 p-4 rounded-2xl font-bold text-sm transition-all ${color}`}>
                <Icon size={18} className="shrink-0" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </TutorShell>
  );
}
