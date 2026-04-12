import React, { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import {
  Upload,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  Landmark,
  Info
} from "lucide-react";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedCourse, childData, currency, finalAmount } = location.state || {};

  const [receipt, setReceipt] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleSubmitPayment = async () => {
    if (!receipt) {
      setStatus({ type: "error", msg: "Please upload your payment receipt first." });
      return;
    }

    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("receipt", receipt);
    formData.append("course_id", selectedCourse.id.toString());
    formData.append("child_name", childData?.name || "Student");
    formData.append("amount", finalAmount?.toString());
    formData.append("currency", currency);

    try {
      await api.post("/parent/submit-payment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus({ type: "success", msg: "Receipt submitted! Redirecting to dashboard..." });

      setTimeout(() => {
        navigate("/parent/dashboard");
      }, 2500);
    } catch (err: any) {
      console.error("❌ Submission Error:", err.response?.data);
      setStatus({ type: "error", msg: err.response?.data?.message || "Failed to submit. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCourse) return <Navigate to="/parent/dashboard" />;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 md:p-12 pb-32">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#2D5A27] transition-colors mb-8"
        >
          <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#2D5A27]/10">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Go Back</span>
        </button>

        <h1 className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter mb-10">
          Finalize <span className="text-[#2D5A27]">Payment</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* --- 🏦 LEFT COLUMN: BANK DETAILS & SUMMARY --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Payment Summary */}
            <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-xl">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Invoice Summary</p>
              <div className="space-y-2">
                <h3 className="text-2xl font-black italic uppercase leading-none">{selectedCourse.title}</h3>
                <p className="text-sm font-bold text-white/60 uppercase">Student: {childData.name}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-3xl font-black text-yellow-400 italic">
                  {currency === "NGN" ? "₦" : "£"}{finalAmount?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Bank Accounts Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-50 shadow-sm">
              <div className="flex items-center gap-3 mb-6 text-[#2D5A27]">
                <Landmark size={24} />
                <h3 className="font-black uppercase italic text-sm">Transfer Details</h3>
              </div>

              <div className="space-y-6">
                {/* 🇳🇬 NGN Account */}
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Naira (PROVIDUS BANK)</p>
                  <p className="text-lg font-black text-gray-800 tracking-tight">1309393680</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">FRICA SOLUTION LIMITED</p>
                </div>

                {/* 🇬🇧 GBP Account */}
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Pounds (Monzo/Revolut)</p>
                  <p className="text-lg font-black text-gray-800 tracking-tight">012345678</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">FRICA SOLUTION LIMITED</p>
                </div>
              </div>

              {/* Reference Note */}
              <div className="mt-8 p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-3">
                <Info size={20} className="text-yellow-600 shrink-0" />
                <p className="text-[10px] font-bold text-yellow-800 leading-relaxed italic">
                  Please use <strong>"{childData.name}"</strong> as your payment reference so we can verify your receipt instantly.
                </p>
              </div>
            </div>
          </div>

          {/* --- 📤 RIGHT COLUMN: UPLOAD BOX --- */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 md:p-12 rounded-[3rem] shadow-xl border-2 border-gray-50 h-full">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Step 2: Upload Proof</p>
              
              <label className="block w-full border-4 border-dashed border-gray-100 rounded-[2.5rem] p-12 text-center cursor-pointer hover:border-[#2D5A27] transition-all bg-gray-50/30 group relative">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <Upload size={32} className="text-[#2D5A27]" />
                  </div>
                  <p className="font-black text-gray-700 uppercase text-xs tracking-widest">
                    {receipt ? receipt.name : "Select Receipt Image"}
                  </p>
                </div>
              </label>

              {status && (
                <div className={`mt-8 p-6 rounded-2xl flex items-center gap-4 animate-in zoom-in duration-300 ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {status.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  <span className="font-black uppercase italic tracking-tight text-xs leading-relaxed">{status.msg}</span>
                </div>
              )}

              <button
                onClick={handleSubmitPayment}
                disabled={!receipt || loading}
                className="w-full mt-10 bg-[#2D5A27] text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl flex items-center justify-center gap-4 hover:bg-black transition-all active:scale-95 disabled:opacity-30"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                  <><ShieldCheck size={24} /> Confirm Submission</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}