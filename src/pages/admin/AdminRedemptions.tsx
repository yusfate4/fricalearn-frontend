import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import { 
  Loader2, 
  PackageCheck, 
  Clock, 
  User, 
  Gift, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function AdminRedemptions() {
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  // Custom Modal State
  const [modal, setModal] = useState({ show: false, title: "", message: "", type: "success" as "success" | "error" });

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
      setModal({ show: true, title: "Order Fulfilled", message: "Student has been granted their reward!", type: "success" });
    } catch (err) {
      setModal({ show: true, title: "Error", message: "Failed to update order status.", type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Layout>
      {/* Custom Modal */}
      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
            <h2 className={`text-2xl font-black italic uppercase mb-2 ${modal.type === 'error' ? 'text-red-500' : 'text-gray-800'}`}>{modal.title}</h2>
            <p className="text-gray-500 font-bold text-sm mb-8">{modal.message}</p>
            <button onClick={() => setModal({ ...modal, show: false })} className="w-full py-4 bg-gray-800 text-white rounded-2xl font-black uppercase text-[10px]">Close</button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-[#2D5A27] p-4 rounded-3xl text-white shadow-xl">
            <PackageCheck size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-800 italic uppercase">Order <span className="text-[#2D5A27]">Fulfillment</span></h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Approve marketplace rewards & physical items</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-[#2D5A27]" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {redemptions.length > 0 ? (
              redemptions.map((r) => (
                <div key={r.id} className="bg-white rounded-[2.5rem] border-2 border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between group hover:border-[#2D5A27] transition-all shadow-sm">
                  <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-[#2D5A27]">
                      <Gift size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-800 uppercase italic leading-none mb-2">{r.reward?.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                        <span className="flex items-center gap-1"><User size={12} /> {r.student?.name}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-0 flex items-center gap-4">
                    {r.status === "pending" ? (
                      <button
                        onClick={() => handleFulfill(r.id)}
                        disabled={processingId === r.id}
                        className="px-10 py-5 bg-[#2D5A27] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                      >
                        {processingId === r.id ? <Loader2 className="animate-spin" size={16} /> : "Mark Fulfilled"}
                      </button>
                    ) : (
                      <div className="px-10 py-5 bg-green-50 text-green-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-green-100 flex items-center gap-2">
                        <CheckCircle2 size={16} /> Fulfilled
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100">
                <p className="text-gray-300 font-black uppercase italic text-xl">No orders to fulfill yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}