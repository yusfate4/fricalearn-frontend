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
  Star,
  Award,
  TrendingUp
} from "lucide-react";

export default function ParentPortal() {
  const { studentId } = useParams(); // 👈 Gets the ID from the WhatsApp link
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🌍 Hits the public route so parents don't need to login
    api.get(`/public/analytics/${studentId}`)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Link invalid or student not found", err);
        setLoading(false);
      });
  }, [studentId]);

  if (loading) return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col items-center justify-center p-10 text-center">
      <div className="w-16 h-16 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black text-[#2D5A27] uppercase italic tracking-tighter">Connecting to the Academy...</p>
    </div>
  );

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center p-10 text-center bg-white">
      <div className="max-w-md">
         <div className="text-6xl mb-6">🏜️</div>
         <h1 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">Access Link Expired</h1>
         <p className="text-gray-400 font-bold mt-2 leading-relaxed">Please ask Yusuf for a fresh progress link for your child.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-20 font-sans">
      
      {/* --- PREMIUM HEADER --- */}
      <div className="bg-white border-b-2 border-orange-100 p-8 md:p-12 mb-8 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
             <div className="w-20 h-20 bg-orange-100 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-inner border-4 border-white text-orange-600 font-black">
                {stats.student_name?.charAt(0)}
             </div>
             <div>
                <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                   <ShieldCheck size={16} className="text-[#2D5A27]" />
                   <p className="text-[10px] font-black text-[#2D5A27] uppercase tracking-[0.2em]">Verified Progress Report</p>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                   {stats.student_name}
                </h1>
                <p className="text-gray-400 font-bold mt-2 uppercase text-xs tracking-widest">FricaLearn Diaspora Excellence</p>
             </div>
          </div>
          
          <div className="bg-[#2D5A27] text-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-green-900/20 flex flex-col items-center md:items-end">
             <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mb-1">Rewards Balance</p>
             <div className="flex items-center gap-3">
                <Star className="text-yellow-400 fill-yellow-400" size={24} />
                <p className="text-4xl font-black italic">{stats.total_coins}</p>
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-2 py-1 rounded-lg">FricaCoins</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        
        {/* --- KPI CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <SummaryCard 
                label="Lessons Completed" 
                value={stats.total_lessons} 
                icon={<Award className="text-blue-500" size={28}/>} 
                color="bg-blue-50"
            />
            <SummaryCard 
                label="Average Accuracy" 
                value={`${Math.round(stats.avg_score)}%`} 
                icon={<Target className="text-red-500" size={28}/>} 
                color="bg-red-50"
            />
            <SummaryCard 
                label="Effort Points" 
                value={stats.total_points} 
                icon={<Zap className="text-yellow-500" size={28}/>} 
                color="bg-yellow-50"
            />
        </div>

        {/* --- RECENT ACTIVITY SECTION --- */}
        <div className="bg-white p-8 md:p-14 rounded-[4rem] shadow-sm border-2 border-orange-50 mb-12">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center gap-3">
                   <Calendar size={28} className="text-orange-400" /> Recent Milestones
                </h2>
                <div className="h-1 flex-1 mx-6 bg-orange-50/50 hidden sm:block rounded-full"></div>
            </div>
            
            <div className="space-y-4">
                {stats.recent_activity && stats.recent_activity.length > 0 ? (
                  stats.recent_activity.map((record: any) => (
                    <div key={record.id} className="flex items-center justify-between p-6 md:p-8 bg-[#FFFBF5] rounded-[2.5rem] border-2 border-transparent hover:border-orange-100 transition-all group">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#2D5A27] shadow-sm group-hover:rotate-12 transition-transform">
                                <CheckCircle2 size={30} />
                            </div>
                            <div>
                                <p className="font-black text-gray-800 uppercase text-lg tracking-tight italic leading-tight">
                                    {record.lesson?.title || 'Heritage Lesson'}
                                </p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                    Done: {new Date(record.completed_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-black text-[#2D5A27] italic">{Math.round(record.score)}%</p>
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Score</p>
                        </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-10 text-gray-400 font-bold italic">Building momentum! No lessons finished yet.</p>
                )}
            </div>
        </div>

        {/* --- PARENT ENCOURAGEMENT BOX --- */}
        <div className="p-10 bg-[#2D5A27] rounded-[3.5rem] shadow-2xl shadow-green-900/20 text-center relative overflow-hidden text-white">
            <TrendingUp className="absolute top-[-20px] right-[-20px] text-white/5" size={200} />
            <div className="relative z-10">
                <Heart className="mx-auto text-yellow-400 mb-4 fill-yellow-400 animate-pulse" size={32} />
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">A Message for the Family</h3>
                <p className="text-white/80 font-bold text-lg italic leading-relaxed max-w-2xl mx-auto">
                   "Your child is discovering their roots. Consistency is the key to fluency. Keep encouraging them to use what they learn today!"
                </p>
            </div>
        </div>

        <p className="text-center mt-12 text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">
            Official FricaLearn Diaspora Academy Report
        </p>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, color }: any) {
    return (
        <div className={`p-8 rounded-[3.5rem] shadow-sm border-2 border-white flex flex-col items-center text-center transition-all hover:scale-[1.02] ${color}`}>
            <div className="bg-white p-4 rounded-[1.5rem] shadow-sm mb-4 border-2 border-white/50">{icon}</div>
            <p className="text-4xl font-black text-gray-900 italic tracking-tighter">{value}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">{label}</p>
        </div>
    );
}