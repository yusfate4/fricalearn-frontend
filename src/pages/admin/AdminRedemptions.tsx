import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import { 
  Loader2, 
  PackageCheck, 
  Clock, 
  User, 
  Gift, 
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Tag
} from "lucide-react";
import { formatDistanceToNow } from "date-fns"; // For showing account age

export default function AdminRedemptions() {
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  const [modal, setModal] = useState({ 
    show: false, 
    title: "", 
    message: "", 
    type: "success" as "success" | "error" 
  });

  useEffect(() => {
    fetchRedemptions();
  }, []);

  const fetchRedemptions = async () => {
    try {
      const res = await api.get("/admin/redemptions");
      setRedemptions(res.data);
    } catch (err) {
      console.error("Failed to load redemptions");
    } finally {
      setLoading(false);
    }
  };

  const handleFulfill = async (id: number) => {
    setProcessingId(id);
    try {
      await api.post(`/admin/redemptions/${id}/fulfill`);
      setRedemptions((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "fulfilled" } : r))
      );
      setModal({ 
        show: true, 
        title: "Order Dispatched", 
        message: "Student reward status updated to Fulfilled!", 
        type: "success" 
      });
    } catch (err) {
      setModal({ 
        show: true, 
        title: "Error", 
        message: "Failed to update order status.", 
        type: "error" 
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Layout>
      {/* 🔔 CUSTOM FEEDBACK MODAL */}
      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${modal.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
               {modal.type === 'success' ? <CheckCircle2 size={32} /> : <ShieldCheck size={32} />}
            </div>
            <h2 className="text-2xl font-black italic uppercase mb-2 text-gray-800">{modal.title}</h2>
            <p className="text-gray-500 font-bold text-sm mb-8 leading-relaxed">{modal.message}</p>
            <button 
              onClick={() => setModal({ ...modal, show: false })} 
              className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#2D5A27] transition-all"
            >
              Close Record
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-[#2D5A27] p-5 rounded-[2rem] text-white shadow-xl">
              <PackageCheck size={36} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-800 italic uppercase tracking-tighter">Order <span className="text-[#2D5A27]">Fulfillment</span></h1>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Review student maturity & reward eligibility</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-[#2D5A27]" size={48} />
            <p className="mt-4 font-black text-gray-300 uppercase italic text-[10px] tracking-widest">Loading Ledger...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {redemptions.length > 0 ? (
              redemptions.map((r) => (
                <div key={r.id} className="bg-white rounded-[3rem] border-2 border-gray-100 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between group hover:border-[#2D5A27] transition-all duration-300 shadow-sm">
                  
                  <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left flex-1">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-[#2D5A27] border-2 border-white shadow-inner">
                      <Gift size={40} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3 justify-center md:justify-start">
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                          <Tag size={10} /> {r.reward?.cost_coins || 300} XP
                        </span>
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                          <ShieldCheck size={10} /> Account: {formatDistanceToNow(new Date(r.student?.user?.created_at || Date.now()))} old
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-gray-800 uppercase italic leading-none mb-3">{r.reward?.title}</h3>
                      
                      <div className="flex flex-wrap items-center gap-6 text-gray-400 font-bold text-[10px] uppercase tracking-widest justify-center md:justify-start">
                        <span className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl text-gray-600">
                          <User size={14} className="text-[#2D5A27]" /> {r.student?.name}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar size={14} /> Requested: {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 md:mt-0 flex items-center gap-4">
                    {r.status === "pending" ? (
                      <button
                        onClick={() => handleFulfill(r.id)}
                        disabled={processingId === r.id}
                        className="px-12 py-6 bg-gray-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-[#2D5A27] transition-all shadow-xl active:scale-95 disabled:opacity-50"
                      >
                        {processingId === r.id ? <Loader2 className="animate-spin" size={16} /> : "Verify & Fulfill"}
                      </button>
                    ) : (
                      <div className="px-12 py-6 bg-green-50 text-green-600 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest border-2 border-green-100 flex items-center gap-3">
                        <CheckCircle2 size={18} /> Order Shipped
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-40 bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100">
                <PackageCheck size={64} className="mx-auto text-gray-200 mb-6" />
                <p className="text-gray-300 font-black uppercase italic text-xl tracking-tighter">No pending redemptions found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}