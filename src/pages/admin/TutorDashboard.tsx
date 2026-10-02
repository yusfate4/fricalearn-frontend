import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { TutorShell } from "../../components/admin/TutorShell";
import {
  BookOpen, Video, Users, Zap, Calendar,
  Plus, ChevronRight, Loader2, Clock, BarChart3,
  HelpCircle, GraduationCap, PlayCircle,
} from "lucide-react";

export default function TutorDashboard() {
  const [stats, setStats]         = useState<any>(null);
  const [upcoming, setUpcoming]   = useState<any[]>([]);
  const [schedule, setSchedule]   = useState<any>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, liveRes, schedRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/live-classes/admin-data"),
          api.get("/admin/schedule"),
        ]);
        setStats(statsRes.data);
        setUpcoming(liveRes.data?.upcoming || []);
        setSchedule(schedRes.data);
      } catch (err) {
        console.error("Tutor dashboard load error:", err);
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

  return (
    <TutorShell title="Dashboard">
      <div className="space-y-6 animate-in fade-in duration-500">

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Curriculum Lessons", value: stats?.total_lessons   || 0, icon: BookOpen, color: "bg-orange-50", ic: "text-orange-500" },
            { label: "Active Sessions",    value: stats?.total_live_classes || 0, icon: Video,   color: "bg-red-50",    ic: "text-red-500"    },
            { label: "Academy Students",  value: stats?.total_students   || 0, icon: Users,   color: "bg-blue-50",   ic: "text-blue-500"   },
            { label: "Total Courses",     value: stats?.total_courses    || 0, icon: GraduationCap, color: "bg-[#f3effa]", ic: "text-[#3F2171]" },
          ].map(({ label, value, icon: Icon, color, ic }) => (
            <div key={label} className={`bg-white rounded-2xl border-2 border-gray-100 p-4 sm:p-5`}>
              <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={18} className={ic} />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-800">{value.toLocaleString()}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Two-column: Rapid Launch + Schedule ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">

          {/* Rapid Launch */}
          <div className="bg-white rounded-[2rem] border-2 border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Zap size={18} className="text-[#3F2171]" />
              <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">Rapid Launch</h3>
            </div>
            <div className="space-y-3">
              {[
                { to: "/admin/live-classes", label: "Schedule Live Class", desc: "Set up a Zoom or Google Meet session", color: "bg-red-50 text-red-700 hover:bg-red-100" },
                { to: "/admin/lessons",      label: "Upload New Lesson",   desc: "Add videos, slides or worksheets",    color: "bg-orange-50 text-orange-700 hover:bg-orange-100" },
                { to: "/admin/questions",    label: "Build a Quiz",        desc: "Create assessments for your students",color: "bg-[#f3effa] text-[#3F2171] hover:bg-[#ebe5f7]" },
              ].map(({ to, label, desc, color }) => (
                <Link key={to} to={to}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all ${color}`}>
                  <div>
                    <p className="font-black text-sm uppercase italic">{label}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider opacity-70 mt-0.5">{desc}</p>
                  </div>
                  <ChevronRight size={18} className="shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Master Schedule */}
          <div className="bg-[#2A1650] rounded-[2rem] p-6 text-white relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-5">
              <Calendar size={120} />
            </div>
            <div className="flex items-center gap-2 mb-5">
              <Calendar size={18} className="text-[#FFFF00]" />
              <h3 className="font-black text-sm uppercase tracking-tight text-white/60">Class Schedule</h3>
            </div>
            <div className="relative z-10">
              {schedule ? (
                <div className="mb-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#FFFF00] mb-1">
                    Next Academy Sync
                  </p>
                  <p className="text-3xl font-black italic uppercase tracking-tighter">
                    {schedule.day}s @ {schedule.start_time} WAT
                  </p>
                </div>
              ) : (
                <p className="text-white/40 font-bold text-sm mb-5">No schedule set</p>
              )}
              <Link to="/admin/live-classes"
                className="inline-flex items-center gap-2 bg-[#FFFF00] text-[#2A1650] px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">
                <Plus size={14} /> Schedule New Class
              </Link>
            </div>
          </div>
        </div>

        {/* ── Upcoming Live Classes ─────────────────────────────── */}
        <div className="bg-white rounded-[2rem] border-2 border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <PlayCircle size={18} className="text-[#3F2171]" />
              <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">
                Upcoming Live Classes
              </h3>
            </div>
            <Link to="/admin/live-classes"
              className="text-[10px] font-black text-[#3F2171] uppercase tracking-widest hover:underline">
              Manage all
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <div className="text-center py-12">
              <Video size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="font-black text-gray-400 uppercase italic text-sm">No upcoming classes</p>
              <Link to="/admin/live-classes"
                className="inline-flex items-center gap-2 mt-4 bg-[#3F2171] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                <Plus size={12} /> Schedule One Now
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcoming.slice(0, 5).map((c: any) => {
                const dt = new Date(c.scheduled_at);
                return (
                  <div key={c.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#3F2171]/10 rounded-2xl flex flex-col items-center justify-center shrink-0">
                        <span className="text-[#3F2171] font-black text-sm leading-none">
                          {dt.toLocaleDateString("en-GB", { day: "numeric" })}
                        </span>
                        <span className="text-[#3F2171] font-bold text-[9px] uppercase">
                          {dt.toLocaleDateString("en-GB", { month: "short" })}
                        </span>
                      </div>
                      <div>
                        <p className="font-black text-gray-700">{c.title}</p>
                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock size={10} />
                          {dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} WAT
                          · {c.duration_minutes || 60} mins
                        </p>
                      </div>
                    </div>
                    {c.meeting_url ? (
                      <a href={c.meeting_url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 bg-[#3F2171] text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all shrink-0">
                        <PlayCircle size={12} /> Join
                      </a>
                    ) : (
                      <span className="text-[9px] font-black uppercase text-gray-300 bg-gray-100 px-3 py-1.5 rounded-full">
                        No link yet
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Quick Nav Links ───────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Courses",   path: "/admin/courses/list",  icon: GraduationCap, color: "bg-[#3F2171]/10 text-[#3F2171]" },
            { label: "Lessons",   path: "/admin/lessons",       icon: BookOpen,       color: "bg-orange-50 text-orange-600"   },
            { label: "Quizzes",   path: "/admin/questions",     icon: HelpCircle,     color: "bg-blue-50 text-blue-600"       },
            { label: "Analytics", path: "/admin/analytics",     icon: BarChart3,      color: "bg-green-50 text-green-600"     },
          ].map(({ label, path, icon: Icon, color }) => (
            <Link key={path} to={path}
              className={`flex items-center gap-3 p-4 rounded-2xl ${color} hover:opacity-80 transition-all font-bold text-sm`}>
              <Icon size={18} className="shrink-0" /> {label}
            </Link>
          ))}
        </div>
      </div>
    </TutorShell>
  );
}
