import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import { AdminShell } from "../../components/admin/AdminShell";
import {
  Search, Filter, Users, Crown, Clock, CircleAlert,
  ChevronLeft, ChevronRight, Loader2, BookOpen, Star,
} from "lucide-react";

const FILTERS = [
  { id: "all",     label: "All Students" },
  { id: "trial",   label: "On Trial"     },
  { id: "premium", label: "Premium"      },
  { id: "expired", label: "Trial Ended"  },
];

function StatusBadge({ student }: { student: any }) {
  const now = new Date();
  const trial = student.trial_ends_at ? new Date(student.trial_ends_at) : null;
  if (student.is_premium) return <span className="bg-[#FFFF00] text-[#2A1650] text-[9px] font-black uppercase px-2 py-1 rounded-full">Premium</span>;
  if (trial && trial > now) {
    const days = Math.ceil((trial.getTime() - now.getTime()) / 86400000);
    return <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${days <= 3 ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-600"}`}>{days}d trial</span>;
  }
  return <span className="bg-gray-100 text-gray-400 text-[9px] font-black uppercase px-2 py-1 rounded-full">Expired</span>;
}

export default function AdminUsers() {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [page, setPage]       = useState(1);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/students", { params: { search, filter, page } });
      setData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, filter, page]);

  useEffect(() => { setPage(1); }, [search, filter]);
  useEffect(() => { fetch(); }, [fetch]);

  const students = data?.data || [];

  return (
    <AdminShell title="Student Registry">
      <div className="space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">Student Registry</h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">
              {data?.total || 0} students total
            </p>
          </div>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold text-sm focus:outline-none focus:border-[#3F2171] transition-colors"/>
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filter === f.id ? "bg-[#3F2171] text-white" : "bg-white border-2 border-gray-100 text-gray-500 hover:border-[#3F2171]/30"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-[#3F2171]" size={32}/></div>
          ) : students.length === 0 ? (
            <div className="text-center py-20">
              <Users size={40} className="text-gray-200 mx-auto mb-4"/>
              <p className="font-black text-gray-500 uppercase italic">No students found</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <table className="w-full hidden md:table">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Student","Email","Status","XP","Lessons","Enrolled",""].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map((s: any) => (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#3F2171]/10 rounded-xl flex items-center justify-center text-[#3F2171] font-black text-sm">
                            {s.name?.[0]?.toUpperCase()}
                          </div>
                          <p className="font-black text-gray-700 text-sm">{s.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-sm font-bold">{s.email}</td>
                      <td className="px-5 py-4"><StatusBadge student={s}/></td>
                      <td className="px-5 py-4 font-black text-gray-700">{(s.student_profile?.total_points || 0).toLocaleString()}</td>
                      <td className="px-5 py-4 font-bold text-gray-500">{s.lessons_completed || 0}</td>
                      <td className="px-5 py-4 text-gray-400 font-bold text-xs">{new Date(s.created_at).toLocaleDateString("en-GB", {day:"numeric",month:"short",year:"2-digit"})}</td>
                      <td className="px-5 py-4">
                        <span className="text-[10px] font-black text-[#3F2171] uppercase tracking-widest">{s.student_profile?.current_level || "Beginner"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-50">
                {students.map((s: any) => (
                  <div key={s.id} className="px-4 py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-black text-gray-700">{s.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{s.email}</p>
                      </div>
                      <StatusBadge student={s}/>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="font-black text-sm text-gray-700">{(s.student_profile?.total_points || 0).toLocaleString()}</p>
                        <p className="text-[8px] text-gray-400 uppercase font-bold">XP</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="font-black text-sm text-gray-700">{s.lessons_completed || 0}</p>
                        <p className="text-[8px] text-gray-400 uppercase font-bold">Lessons</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="font-black text-[10px] text-[#3F2171]">{s.student_profile?.current_level || "Beginner"}</p>
                        <p className="text-[8px] text-gray-400 uppercase font-bold">Rank</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {data && data.last_page > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Page {data.current_page} of {data.last_page} · {data.total} students
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="p-2 rounded-xl bg-white border-2 border-gray-100 disabled:opacity-40 hover:border-[#3F2171]/30 transition-all">
                <ChevronLeft size={16} className="text-gray-500"/>
              </button>
              <button onClick={() => setPage(p => Math.min(data.last_page, p+1))} disabled={page === data.last_page}
                className="p-2 rounded-xl bg-white border-2 border-gray-100 disabled:opacity-40 hover:border-[#3F2171]/30 transition-all">
                <ChevronRight size={16} className="text-gray-500"/>
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
