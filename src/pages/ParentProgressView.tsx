import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { 
  Trophy, 
  Target, 
  Zap, 
  Calendar, 
  CheckCircle2, 
  Heart,
  ShieldCheck,
  Globe
} from "lucide-react";

export default function ParentProgressView() {
  const { studentId } = useParams();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Note: This route must be made public in your Laravel 'api.php'
    api.get(`/public/analytics/${studentId}`)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [studentId]);

  if (loading) return (
    <div className="min-h-screen bg-orange-50/30 flex items-center justify-center p-10 text-center">
      <div className="animate-bounce text-orange-400 font-black text-2xl italic">Loading Ayo's Success...</div>
    </div>
  );

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center p-10 text-center bg-white">
      <div className="max-w-md">
         <p className="text-4xl mb-4">🏠</p>
         <h1 className="text-2xl font-black text-gray-800 uppercase italic">Link Expired</h1>
         <p className="text-gray-400 font-bold mt-2">Please ask Yusuf for a fresh progress link.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-20">
      {/* 🌟 FAMILY HEADER */}
      <div className="bg-white border-b-2 border-orange-100 p-6 md:p-10 mb-8 md:mb-12 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-orange-100 rounded-[2rem] flex items-center justify-center text-3xl shadow-inner">
                {stats.student_name?.charAt(0) || "S"}
             </div>
             <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-800 uppercase italic tracking-tighter">
                   {stats.student_name}'s Progress
                </h1>
                <div className="flex items-center gap-2 justify-center md:justify-start mt-1">
                   <ShieldCheck size={14} className="text-[#2D5A27]" />
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure Family View</p>
                </div>
             </div>
          </div>
          
          <div className="bg-[#2D5A27] text-white px-8 py-4 rounded-[1.5rem] shadow-xl shadow-green-900/10">
             <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Current Balance</p>
             <div className="flex items-center gap-2">
                <p className="text-3xl font-black italic">{stats.total_coins}</p>
                <span className="text-xs font-bold uppercase text-yellow-400">FricaCoins</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        
        {/* 🏆 STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <StatCard label="Lessons Completed" val={stats.total_lessons} icon={<Globe className="text-blue-500"/>} />
            <StatCard label="Average Accuracy" val={`${Math.round(stats.avg_score)}%`} icon={<Target className="text-red-500"/>} />
            <StatCard label="Total Effort Points" val={stats.total_points} icon={<Zap className="text-yellow-500"/>} />
        </div>

        {/* 🕒 RECENT ACTIVITY TIMELINE */}
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border-2 border-orange-50">
            <h2 className="text-2xl font-black text-gray-800 uppercase italic mb-8 flex items-center gap-3">
               <Calendar size={24} className="text-orange-400" /> Latest Achievements
            </h2>
            
            <div className="space-y-6">
                {stats.recent_activity?.map((record: any) => (
                    <div key={record.id} className="flex items-center justify-between p-6 bg-orange-50/30 rounded-3xl border border-transparent hover:border-orange-100 transition-all group">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2D5A27] shadow-sm">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="font-black text-gray-800 uppercase text-sm tracking-tight">{record.lesson?.title}</p>
                                <p className="text-[10px] font-bold text-gray-400">{new Date(record.completed_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-black text-[#2D5A27] italic">{record.score}%</p>
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Score</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Support Message */}
            <div className="mt-12 p-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 text-center">
                <Heart className="mx-auto text-red-400 mb-3" fill="currentColor" size={28} />
                <p className="text-gray-500 font-bold italic">
                   "Great job supporting your child's journey back to their roots!"
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}

// 🎴 Small Stat Card Component
function StatCard({ label, val, icon }: any) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-orange-50 flex flex-col items-center text-center group hover:scale-[1.02] transition-all">
            <div className="mb-4 transform group-hover:rotate-12 transition-transform">{icon}</div>
            <p className="text-4xl font-black text-gray-800 italic">{val}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{label}</p>
        </div>
    );
}