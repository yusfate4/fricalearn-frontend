import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import { Loader2, History, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminPaymentHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/admin/payments/history");
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 md:p-12">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-gray-900 p-4 rounded-3xl text-white shadow-lg">
              <History size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-800 italic uppercase tracking-tighter">
                Enrollment <span className="text-[#2D5A27]">History</span>
              </h1>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                Audit log of all processed student payments
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#2D5A27] mb-4" size={40} />
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Fetching Audit Logs...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="bg-white rounded-[3rem] border-2 border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b-2 border-gray-100">
                  <tr>
                    <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-500">Student</th>
                    <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-500">Course</th>
                    <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-500">Amount</th>
                    <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-500">Status</th>
                    <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr
                      key={h.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="p-6">
                        <p className="font-black italic text-gray-800 uppercase tracking-tight">{h.child_name}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Parent ID: #{h.parent_id}</p>
                      </td>
                      <td className="p-6">
                        <span className="text-gray-500 font-bold text-xs uppercase tracking-tight">
                          {h.course?.title || "Course #" + h.course_id}
                        </span>
                      </td>
                      <td className="p-6 font-black text-[#2D5A27] text-lg italic">
                        {h.currency} {Number(h.amount).toLocaleString()}
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase italic ${
                            h.status === "approved" 
                              ? "bg-green-50 text-green-600 border border-green-100" 
                              : "bg-red-50 text-red-600 border border-red-100"
                          }`}
                        >
                          {h.status}
                        </span>
                      </td>
                      <td className="p-6 text-gray-400 font-bold text-[10px] uppercase">
                        {new Date(h.updated_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-gray-50">
            <AlertCircle className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-300 font-black italic uppercase tracking-widest text-xl">
              No Enrollment History Found
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}