import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import {
  Loader2,
  CheckCircle2,
  Eye,
  ShieldCheck,
  AlertCircle,
  XCircle,
} from "lucide-react";

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // 🚀 Updated modal state to handle different types of feedback
  const [modal, setModal] = useState({
    show: false,
    type: "success" as "success" | "error",
    message: "",
  });

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/payments/pending");
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const getReceiptUrl = (path: string) => {
    if (!path) return "";

    // 🚀 THE CRITICAL FIX: If the path is already a Cloudinary/External URL, return it as is
    if (path.startsWith("http")) return path;

    // 📂 FALLBACK: For old local files during development
    const backendBase = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    const cleanPath = path.replace("public/", "").replace("storage/", "");
    return `${backendBase}/storage/${cleanPath}`;
  };

  
  const handleAction = async (id: number, action: "approve" | "reject") => {
    setProcessingId(id);
    try {
      const res = await api.post(`/admin/payments/${id}/${action}`);

      // Remove from list on success
      setPayments((prev) => prev.filter((p) => p.id !== id));

      setModal({
        show: true,
        type: "success",
        message: res.data.message || `Payment successfully ${action}ed!`,
      });
    } catch (err: any) {
      // 🚀 THE FIX: Capture the exact error from PaymentController (e.g., Student Not Found)
      const errorMsg =
        err.response?.data?.message || "Action failed. Check server logs.";
      setModal({
        show: true,
        type: "error",
        message: errorMsg,
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Layout>
      {/* 🚀 Refined Feedback Modal */}
      {modal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-sm w-full border-4 border-white">
            {modal.type === "success" ? (
              <CheckCircle2 className="mx-auto text-[#2D5A27] mb-6" size={60} />
            ) : (
              <XCircle className="mx-auto text-red-500 mb-6" size={60} />
            )}

            <h3 className="text-2xl font-black uppercase italic text-gray-800 tracking-tighter mb-2">
              {modal.type === "success" ? "Confirmed" : "Action Halted"}
            </h3>
            <p className="font-bold text-gray-400 text-xs mb-8 leading-relaxed px-4 lowercase first-letter:uppercase">
              {modal.message}
            </p>

            <button
              onClick={() => setModal({ ...modal, show: false })}
              className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 ${
                modal.type === "success"
                  ? "bg-[#2D5A27] text-white shadow-green-100"
                  : "bg-red-500 text-white shadow-red-100"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 md:p-12 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="flex items-center gap-6">
            <div className="bg-[#2D5A27] p-6 rounded-[2.5rem] text-white shadow-2xl rotate-3">
              <ShieldCheck size={36} />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">
                Payment <span className="text-[#2D5A27]">Fulfillment</span>
              </h1>
              <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mt-3 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-gray-100"></span> Pending
                Verifications
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-32 text-center flex flex-col items-center">
            <Loader2 className="animate-spin text-[#2D5A27] mb-4" size={48} />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
              Syncing ledger...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {payments.length > 0 ? (
              payments.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-[3.5rem] border-2 border-gray-50 overflow-hidden hover:border-[#2D5A27] transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col group animate-in slide-in-from-bottom-4"
                >
                  <div className="h-64 bg-gray-100 relative overflow-hidden">
                    <img
                      src={getReceiptUrl(p.receipt_path)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      alt="Receipt"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x400?text=Receipt+Not+Found";
                      }}
                    />
                    <a
                      href={getReceiptUrl(p.receipt_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-all backdrop-blur-md cursor-pointer"
                    >
                      <Eye size={44} className="mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Open Full Receipt
                      </span>
                    </a>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-black text-gray-800 uppercase text-2xl italic leading-none tracking-tighter">
                          {p.child_name}
                        </h3>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                          {p.course?.title || "Unknown Subject"}
                        </p>
                      </div>
                      <div className="bg-gray-900 text-white p-3 rounded-2xl">
                        <span className="text-[10px] font-black tracking-tighter">
                          #{p.id}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-[2rem] mb-10 flex items-center justify-between border-2 border-white shadow-inner">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Amount Paid
                      </span>
                      <p className="text-[#2D5A27] font-black text-2xl italic tracking-tighter">
                        {p.currency} {Number(p.amount).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <button
                        disabled={processingId === p.id}
                        onClick={() => handleAction(p.id, "approve")}
                        className="flex-[2] py-5 bg-[#2D5A27] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                      >
                        {processingId === p.id ? (
                          <Loader2 className="animate-spin mx-auto" size={18} />
                        ) : (
                          "Activate Access"
                        )}
                      </button>
                      <button
                        disabled={processingId === p.id}
                        onClick={() => handleAction(p.id, "reject")}
                        className="flex-1 py-5 bg-red-50 text-red-500 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-40 bg-gray-50/50 rounded-[5rem] border-4 border-dashed border-gray-100 flex flex-col items-center">
                <CheckCircle2 size={80} className="text-gray-200 mb-6" />
                <h3 className="text-3xl font-black text-gray-300 uppercase italic tracking-tighter">
                  Ledger Balanced
                </h3>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2">
                  All student accounts are currently up to date.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
