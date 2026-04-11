import React, { useState, useEffect } from "react";
import { 
  Video, 
  BookOpen, 
  Users, 
  Clock, 
  ChevronRight, 
  PlusCircle, 
  Calendar,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function TutorDashboard() {
  const [stats, setStats] = useState({ lessons: 0, liveClasses: 0, students: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tutor-specific stats (Lessons they created, etc.)
    api.get("/admin/stats") 
      .then(res => setStats(res.data))
      .catch(err => console.error("Error loading tutor stats", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 md:p-10 animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#1A1A40] italic uppercase tracking-tighter">Ẹ n lẹ́, Olùkọ́!</h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">
          Your Classroom Overview & Academic Tools
        </p>
      </div>

      {/* --- 📊 QUICK STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<BookOpen className="text-orange-500" />} label="My Lessons" value={stats.lessons} />
        <StatCard icon={<Video className="text-red-500" />} label="Live Classes" value={stats.liveClasses} />
        <StatCard icon={<Users className="text-blue-500" />} label="Total Students" value={stats.students} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- 🚀 QUICK ACTIONS --- */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-gray-50">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
            <PlusCircle size={16} className="text-[#2D5A27]" /> Rapid Launch
          </h3>
          <div className="space-y-4">
            <ActionLink to="/admin/add-lesson" label="Upload New Lesson" desc="Add videos or worksheets" color="bg-orange-50 text-orange-700" />
            <ActionLink to="/admin/live-classes" label="Schedule Live Class" desc="Set up a Zoom/Google Meet" color="bg-red-50 text-red-700" />
            <ActionLink to="/admin/questions" label="Build a Quiz" desc="Create AI-powered assessments" color="bg-blue-50 text-blue-700" />
          </div>
        </div>

        {/* --- 📅 CLASS SCHEDULE --- */}
        <div className="bg-[#1A1A40] p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 text-yellow-400 opacity-20" size={40} />
          <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
            <Calendar size={16} /> Global Master Schedule
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase text-yellow-400 tracking-widest">Next Academy Sync</p>
              <h4 className="text-3xl font-black italic uppercase tracking-tighter">Saturday @ 12:00 WAT</h4>
            </div>
            <Link to="/admin/schedule" className="inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors">
              Adjust Master Time <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-gray-50 flex items-center gap-6">
      <div className="p-4 bg-gray-50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</p>
        <p className="text-3xl font-black italic text-[#1A1A40]">{value}</p>
      </div>
    </div>
  );
}

function ActionLink({ to, label, desc, color }: any) {
  return (
    <Link to={to} className={`flex items-center justify-between p-6 rounded-2xl transition-all hover:scale-[1.02] ${color}`}>
      <div>
        <p className="font-black uppercase italic text-sm">{label}</p>
        <p className="text-[10px] opacity-70 font-bold uppercase tracking-wider">{desc}</p>
      </div>
      <ChevronRight size={20} />
    </Link>
  );
}