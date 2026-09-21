import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { AdminShell } from "../../components/admin/AdminShell";
import { History, CircleCheckBig, CircleX, Loader2, ExternalLink, Search } from "lucide-react";

export default function AdminPaymentVerify() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    api.get("/admin/payments/history")
      .then(res => setPayments(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter(p =>
    !search || p.child_name?.toLowerCase().includes(search.toLowerCase()) ||
               p.parent?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalApproved = payments.filter(p => p.status === "approved").reduce((s, p) => s + Number(p.amount), 0);
  const totalRejected = payments.filter(p => p.status === "rejected").length;

  return (
    <AdminShell title="Payment History">
      <div className="space-y-5">

        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">Payment History</h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">
            {payments.length} records · ₦{totalApproved.toLocaleString()} approved · {totalRejected} rejected
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 text-center">
            <p className="text-2xl font-black text-gray-800">{payments.length}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Total Records</p>
          </div>
          <div className="bg-green-50 rounded-2xl border-2 border-green-100 p-4 text-center">
            <p className="text-2xl font-black text-green-600">{payments.filter(p => p.status === "approved").length}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-green-500 mt-1">Approved</p>
          </div>
          <div className="bg-red-50 rounded-2xl border-2 border-red-100 p-4 text-center">
            <p className="text-2xl font-black text-red-500">{totalRejected}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-red-400 mt-1">Rejected</p>
          </div>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by student or parent name…"
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold text-sm focus:outline-none focus:border-[#3F2171] transition-colors"/>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-[#3F2171]" size={32}/></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <History size={40} className="text-gray-200 mx-auto mb-4"/>
              <p className="font-black text-gray-500 uppercase italic">No payment records yet</p>
            </div>
          ) : (
            <>
              <table className="w-full hidden md:table">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Student","Parent","Amount","Course","Status","Date","Receipt"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p: any) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-black text-gray-700 text-sm">{p.child_name}</td>
                      <td className="px-5 py-4 text-gray-500 text-sm font-bold">{p.parent?.name || "—"}</td>
                      <td className="px-5 py-4 font-black text-gray-700">
                        {p.currency === "GBP" ? "£" : "₦"}{Number(p.amount).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-sm font-bold">{p.course?.title || "—"}</td>
                      <td className="px-5 py-4">
                        {p.status === "approved"
                          ? <span className="flex items-center gap-1 text-green-600 font-black text-[10px] uppercase"><CircleCheckBig size={12}/> Approved</span>
                          : <span className="flex items-center gap-1 text-red-400 font-black text-[10px] uppercase"><CircleX size={12}/> Rejected</span>}
                      </td>
                      <td className="px-5 py-4 text-gray-400 font-bold text-xs">
                        {new Date(p.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"2-digit"})}
                      </td>
                      <td className="px-5 py-4">
                        {p.receipt_path && (
                          <a href={p.receipt_path} target="_blank" rel="noreferrer"
                            className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-[#3F2171] hover:text-white transition-all inline-flex">
                            <ExternalLink size={13}/>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile */}
              <div className="md:hidden divide-y divide-gray-50">
                {filtered.map((p: any) => (
                  <div key={p.id} className="px-4 py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-black text-gray-700">{p.child_name}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{p.parent?.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-700 text-sm">
                          {p.currency === "GBP" ? "£" : "₦"}{Number(p.amount).toLocaleString()}
                        </span>
                        {p.status === "approved"
                          ? <CircleCheckBig size={16} className="text-green-500"/>
                          : <CircleX size={16} className="text-red-400"/>}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-300 font-bold">
                      {new Date(p.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
