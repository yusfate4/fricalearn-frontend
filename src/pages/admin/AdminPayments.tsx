import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import { AdminShell } from "../../components/admin/AdminShell";
import {
  CreditCard, Clock, CircleCheckBig, CircleX, CircleAlert,
  ChevronDown, ChevronUp, Loader2, Eye, ExternalLink,
  RefreshCw, Crown,
} from "lucide-react";

type Tab = "pending" | "expiring" | "expired";

function CurrencyAmount({ amount, currency }: { amount: number; currency: string }) {
  const sym = currency === "GBP" ? "£" : "₦";
  return <span className="font-black text-gray-700">{sym}{Number(amount).toLocaleString()}</span>;
}

export default function AdminPayments() {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState<Tab>("pending");
  const [approving, setApproving] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState<number | null>(null);
  const [expanded, setExpanded]   = useState<number | null>(null);

  const fetch = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get("/admin/payments-overview");
      setData(res.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const approve = async (id: number) => {
    setApproving(id);
    try {
      await api.post(`/admin/payments/${id}/approve`);
      await fetch(true);
    } catch(e) { console.error(e); }
    finally { setApproving(null); }
  };

  const reject = async (id: number) => {
    if (!confirm("Reject this payment?")) return;
    setRejecting(id);
    try {
      await api.post(`/admin/payments/${id}/reject`);
      await fetch(true);
    } catch(e) { console.error(e); }
    finally { setRejecting(null); }
  };

  const s = data?.summary || {};

  const TABS: { id: Tab; label: string; count: number; color: string }[] = [
    { id: "pending",  label: "Pending",         count: s.pending_count  || 0, color: "text-orange-600" },
    { id: "expiring", label: "Trials Expiring",  count: s.expiring_count || 0, color: "text-red-500"    },
    { id: "expired",  label: "Trials Expired",   count: s.expired_count  || 0, color: "text-gray-500"   },
  ];

  return (
    <AdminShell title="Payments">
      <div className="space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">Payments</h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">
              ₦{Number(s.monthly_revenue || 0).toLocaleString()} approved this month · {s.pending_count || 0} pending
            </p>
          </div>
          <button onClick={() => fetch()} className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-100 rounded-xl font-bold text-sm text-gray-600 hover:border-[#3F2171]/30 transition-all">
            <RefreshCw size={14}/> Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 font-black text-sm uppercase tracking-tight border-b-2 transition-all -mb-px ${
                tab === t.id ? "border-[#3F2171] text-[#3F2171]" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}>
              {t.label}
              {t.count > 0 && (
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full bg-gray-100 ${t.color}`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-[#3F2171]" size={32}/></div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">

            {/* ── PENDING tab ── */}
            {tab === "pending" && (
              <>
                {(data?.pending_payments || []).length === 0 ? (
                  <div className="text-center py-20">
                    <CircleCheckBig size={40} className="text-green-300 mx-auto mb-4"/>
                    <p className="font-black text-gray-500 uppercase italic">No pending payments</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {(data?.pending_payments || []).map((p: any) => (
                      <div key={p.id}>
                        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-black text-gray-700">{p.child_name}</p>
                              <span className="bg-orange-50 text-orange-500 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Pending</span>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold">
                              Parent: {p.parent?.name} · {p.parent?.email}
                            </p>
                            <p className="text-[10px] text-gray-300 font-bold">
                              {new Date(p.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <CurrencyAmount amount={p.amount} currency={p.currency}/>
                            {p.receipt_path && (
                              <a href={p.receipt_path} target="_blank" rel="noreferrer"
                                className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-[#3F2171] hover:text-white transition-all">
                                <ExternalLink size={14}/>
                              </a>
                            )}
                            <button onClick={() => approve(p.id)} disabled={approving === p.id}
                              className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all disabled:opacity-50">
                              {approving === p.id ? <Loader2 size={12} className="animate-spin"/> : <CircleCheckBig size={12}/>}
                              Approve
                            </button>
                            <button onClick={() => reject(p.id)} disabled={rejecting === p.id}
                              className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">
                              {rejecting === p.id ? <Loader2 size={14} className="animate-spin"/> : <CircleX size={14}/>}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── EXPIRING tab ── */}
            {tab === "expiring" && (
              <>
                {(data?.expiring_soon || []).length === 0 ? (
                  <div className="text-center py-20">
                    <Clock size={40} className="text-gray-200 mx-auto mb-4"/>
                    <p className="font-black text-gray-500 uppercase italic">No trials expiring in the next 14 days</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {(data?.expiring_soon || []).map((s: any) => {
                      const days = Math.ceil((new Date(s.trial_ends_at).getTime() - Date.now()) / 86400000);
                      return (
                        <div key={s.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-black text-gray-700">{s.name}</p>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${days <= 3 ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"}`}>
                                {days}d left
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold">{s.email}</p>
                            <p className="text-[10px] text-gray-300 font-bold">
                              Expires: {new Date(s.trial_ends_at).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}
                            </p>
                          </div>
                          <div className="text-right">
                            {s.parents?.map((p: any) => (
                              <p key={p.id} className="text-[10px] text-gray-400 font-bold">{p.email}</p>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ── EXPIRED tab ── */}
            {tab === "expired" && (
              <>
                {(data?.expired_trials || []).length === 0 ? (
                  <div className="text-center py-20">
                    <p className="font-black text-gray-500 uppercase italic">No expired trials</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {(data?.expired_trials || []).map((s: any) => (
                      <div key={s.id} className="px-5 py-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-black text-gray-600">{s.name}</p>
                          <p className="text-[11px] text-gray-400 font-bold">{s.email}</p>
                        </div>
                        <span className="text-[9px] font-bold text-gray-400">
                          Expired {new Date(s.trial_ends_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
