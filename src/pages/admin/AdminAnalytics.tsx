import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import { BarChart3, Users, Target, ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This will hit a new endpoint we should create in Laravel
    api.get("/admin/analytics")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-gray-400 hover:text-frica-green mb-8 font-black uppercase text-xs tracking-widest transition-all"
        >
          <ArrowLeft size={16} /> Back to Control Room
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-800 italic uppercase tracking-tighter">
            Pilot Analytics
          </h1>
          <p className="text-gray-500 font-bold">Tracking engagement and learning outcomes</p>
        </div>

        {/* --- Quick Overview Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-gray-50">
            <Target className="text-frica-green mb-4" size={32} />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Quiz Score</p>
            <p className="text-4xl font-black text-gray-800">{data?.avg_score || "85"}%</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-gray-50">
            <Users className="text-blue-500 mb-4" size={32} />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Learners</p>
            <p className="text-4xl font-black text-gray-800">{data?.active_count || "1"}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-gray-50">
            <Calendar className="text-purple-500 mb-4" size={32} />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lessons Completed</p>
            <p className="text-4xl font-black text-gray-800">{data?.completed_count || "12"}</p>
          </div>
        </div>

        {/* --- Recent Student Activity Table --- */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-50">
          <div className="p-8 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-xl font-black text-gray-800 uppercase italic">Recent Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                  <th className="px-8 py-5">Student</th>
                  <th className="px-8 py-5">Last Activity</th>
                  <th className="px-8 py-5">Points</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {/* Mock data for now, will be replaced by data.recent_students */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-black text-gray-800">Ayo Test</div>
                    <div className="text-xs text-gray-400 font-bold">Yoruba Learner</div>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-500 font-medium">Today, 10:45 AM</td>
                  <td className="px-8 py-6 font-black text-frica-green">150 PTS</td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-[10px] font-black bg-gray-100 px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-frica-green hover:text-white transition-all">
                      Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}