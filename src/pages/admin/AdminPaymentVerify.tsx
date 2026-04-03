import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import { Loader2, ShieldCheck, History, Check, X } from "lucide-react";

export default function AdminPaymentVerify() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/payments/history").then((res) => {
      setHistory(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-gray-800 p-4 rounded-3xl text-white">
            <History size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-800 italic uppercase">
              Audit <span className="text-[#2D5A27]">Log</span>
            </h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              History of all manual enrollments
            </p>
          </div>
        </div>

        {loading ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : (
          <div className="bg-white rounded-[3rem] border-2 border-gray-50 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b-2 border-gray-100">
                <tr>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest">
                    Student
                  </th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest">
                    Course
                  </th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest">
                    Amount
                  </th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr
                    key={h.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-6 font-black italic text-gray-700">
                      {h.child_name}
                    </td>
                    <td className="p-6 text-gray-400 font-bold text-xs uppercase">
                      {h.course?.title || "Course #" + h.course_id}
                    </td>
                    <td className="p-6 font-black text-[#2D5A27]">
                      {h.currency} {h.amount}
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-4 py-2 rounded-full font-black text-[8px] uppercase italic ${h.status === "approved" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                      >
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
