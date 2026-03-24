import React, { useEffect, useState } from "react";
import api from "../../api/axios"; // 👈 Go up two levels
import Layout from "../../components/Layout"; // 👈 Go up two levels
import { BarChart3, Clock, Target, Zap, ChevronRight, BookOpen, CheckCircle2 } from "lucide-react";



export default function StudentAnalytics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/analytics").then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Layout><div className="p-20 text-center font-bold">Loading your progress...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 md:p-10">
        <h1 className="text-4xl font-black text-gray-800 uppercase italic mb-10 tracking-tighter">My Learning Journey</h1>

        {/* 📊 STAT CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Lessons Done", val: stats.total_lessons, icon: <BookOpen />, col: "text-blue-500" },
            { label: "Avg. Quiz Score", val: `${Math.round(stats.avg_score)}%`, icon: <Target />, col: "text-frica-green" },
            { label: "Total Points", val: stats.total_points, icon: <Zap />, col: "text-yellow-500" },
            { label: "FricaCoins", val: stats.total_coins, icon: <Clock />, col: "text-orange-500" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-gray-50 flex flex-col items-center text-center">
              <div className={`${item.col} mb-3`}>{item.icon}</div>
              <p className="text-3xl font-black text-gray-800">{item.val}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* 🕒 RECENT ACTIVITY TIMELINE */}
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border-2 border-gray-50">
          <h2 className="text-2xl font-black text-gray-800 uppercase italic mb-8 flex items-center gap-3">
            <BarChart3 className="text-frica-green" /> Recent Activity
          </h2>
          
          <div className="space-y-6">
            {stats.recent_activity.map((record: any) => (
              <div key={record.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-frica-green shadow-sm">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="font-black text-gray-800 uppercase text-sm tracking-tight">{record.lesson?.title}</p>
                    <p className="text-[10px] font-bold text-gray-400">{new Date(record.completed_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-lg font-black text-frica-green">{record.score}%</p>
                        <p className="text-[9px] font-black text-gray-300 uppercase">Score</p>
                    </div>
                    <ChevronRight className="text-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}