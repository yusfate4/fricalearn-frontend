import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import { 
  Users, 
  BookOpen, 
  HelpCircle, 
  TrendingUp, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  Zap
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetching from /admin/stats defined in Laravel routes/api.php
    api.get("/admin/stats")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard Stats Error:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      label: "Total Students",
      value: stats?.total_students,
      icon: <Users size={24} />,
      color: "bg-blue-500",
      shadow: "shadow-blue-200"
    },
    {
      label: "Active Lessons",
      value: stats?.total_lessons,
      icon: <BookOpen size={24} />,
      color: "bg-frica-green",
      shadow: "shadow-green-200"
    },
    {
      label: "Total Subjects",
      value: stats?.total_courses,
      icon: <HelpCircle size={24} />,
      color: "bg-purple-500",
      shadow: "shadow-purple-200"
    },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div className="animate-in fade-in slide-in-from-left duration-500">
            <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic">
              Founder's Control Room
            </h1>
            <p className="text-gray-400 font-bold text-sm mt-1">
              Monitoring the FricaLearn Diaspora Pilot
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-50">
             <div className="w-2 h-2 bg-frica-green rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Live</span>
             {loading && <Loader2 className="animate-spin text-frica-green ml-2" size={16} />}
          </div>
        </div>

        {/* --- ERROR STATE --- */}
        {error ? (
          <div className="bg-red-50 border-4 border-white p-8 rounded-[2.5rem] flex items-center gap-6 text-red-600 mb-10 shadow-xl shadow-red-100/50 animate-in zoom-in">
            <div className="bg-red-100 p-4 rounded-2xl">
                <AlertCircle size={32} />
            </div>
            <div>
                <p className="font-black text-xl uppercase italic tracking-tight">Sync Failed</p>
                <p className="font-medium opacity-80 text-sm uppercase">Could not fetch academy stats. Check your Laravel API connection.</p>
            </div>
          </div>
        ) : (
          /* --- STATS GRID --- */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {statCards.map((card, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded-[2.5rem] shadow-sm border-4 border-white flex items-center space-x-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`${card.color} p-5 rounded-3xl text-white shadow-xl ${card.shadow} group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">
                    {card.label}
                  </p>
                  <p className="text-4xl font-black text-gray-800 tracking-tighter">
                    {loading ? "..." : (card.value ?? 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- ANALYTICS & ROADMAP SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            
            {/* Expansion Card */}
            <div className="bg-white border-4 border-white rounded-[3rem] p-12 shadow-xl shadow-gray-100/50 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-frica-green/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                        <TrendingUp className="text-frica-green" size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 mb-4 italic uppercase tracking-tighter leading-none">
                        Expansion <br/>Roadmap
                    </h2>
                    <p className="text-gray-500 font-medium leading-relaxed mb-8 max-w-xs">
                        Managing the **Yoruba Pilot**. Launch Hausa, Igbo, and Core Pillars soon.
                    </p>
                    <button 
                        onClick={() => navigate('/admin/analytics')}
                        className="bg-[#2D5A27] text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group/btn"
                    >
                        View Analytics
                        <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Quick Actions / Activity Feed */}
            <div className="bg-gray-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 p-8 opacity-10">
                    <Zap size={140} fill="white" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 text-yellow-400">
                        Quick Launch
                    </h2>
                    <div className="space-y-4">
                        <button 
                            onClick={() => navigate('/admin/courses')}
                            className="w-full p-4 bg-white/10 rounded-2xl flex items-center justify-between hover:bg-white/20 transition-all border border-white/5"
                        >
                            <span className="font-black uppercase text-xs tracking-widest">Update Curriculum</span>
                            <BookOpen size={18} className="text-frica-green" />
                        </button>
                        <button 
                            onClick={() => navigate('/admin/quiz-builder')}
                            className="w-full p-4 bg-white/10 rounded-2xl flex items-center justify-between hover:bg-white/20 transition-all border border-white/5"
                        >
                            <span className="font-black uppercase text-xs tracking-widest">Build New Quiz</span>
                            <HelpCircle size={18} className="text-yellow-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <p className="text-center text-gray-300 font-black uppercase text-[10px] tracking-[0.3em]">
            FricaLearn Alpha v1.0 • Proudly Made for the Diaspora
        </p>
      </div>
    </Layout>
  );
}