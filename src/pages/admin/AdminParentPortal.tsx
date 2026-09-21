import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import { AdminShell } from "../../components/admin/AdminShell";
import { Search, UserCheck, ChevronLeft, ChevronRight, Loader2, Users, Crown, Clock } from "lucide-react";

function ChildPill({ child }: { child: any }) {
  const now = new Date();
  const trial = child.trial_ends_at ? new Date(child.trial_ends_at) : null;
  const isPremium = child.is_premium;
  const active = trial && trial > now && !isPremium;
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-1 rounded-full ${
      isPremium ? "bg-[#FFFF00] text-[#2A1650]" : active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
    }`}>
      {isPremium ? <Crown size={8}/> : active ? <Clock size={8}/> : null}
      {child.name.split(" ")[0]}
    </span>
  );
}

export default function AdminParentPortal() {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/parents-list", { params: { search, page } });
      setData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, page]);

  useEffect(() => { setPage(1); }, [search]);
  useEffect(() => { fetch(); }, [fetch]);

  const parents = data?.data || [];

  return (
    <AdminShell title="Parent Access">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">Parent Registry</h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">{data?.total || 0} parents registered</p>
          </div>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold text-sm focus:outline-none focus:border-[#3F2171] transition-colors"/>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-[#3F2171]" size={32}/></div>
          ) : parents.length === 0 ? (
            <div className="text-center py-20">
              <UserCheck size={40} className="text-gray-200 mx-auto mb-4"/>
              <p className="font-black text-gray-500 uppercase italic">No parents found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {parents.map((p: any) => (
                <div key={p.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#3F2171]/10 rounded-2xl flex items-center justify-center text-[#3F2171] font-black">
                        {p.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-gray-700">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{p.email}</p>
                        <p className="text-[9px] text-gray-300 font-bold">Joined {new Date(p.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"2-digit"})}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {(p.children || []).length === 0 ? (
                        <span className="text-[9px] text-gray-300 font-bold uppercase">No children linked</span>
                      ) : (
                        <>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mr-1">Children:</span>
                          {p.children.map((c: any) => <ChildPill key={c.id} child={c}/>)}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {data && data.last_page > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-gray-400">{data.total} parents · Page {data.current_page} of {data.last_page}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="p-2 rounded-xl bg-white border-2 border-gray-100 disabled:opacity-40">
                <ChevronLeft size={16} className="text-gray-500"/>
              </button>
              <button onClick={() => setPage(p => Math.min(data.last_page, p+1))} disabled={page === data.last_page} className="p-2 rounded-xl bg-white border-2 border-gray-100 disabled:opacity-40">
                <ChevronRight size={16} className="text-gray-500"/>
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
