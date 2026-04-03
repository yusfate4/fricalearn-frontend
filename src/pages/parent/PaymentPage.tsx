import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import {
  Upload,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🛡️ Access Safety: Fallback if someone refreshes the page and loses state
  const { selectedCourse, childData, currency, finalAmount } =
    location.state || {};

  const [receipt, setReceipt] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleSubmitPayment = async () => {
    if (!receipt) {
      setStatus({
        type: "error",
        msg: "Please upload your payment receipt first.",
      });
      return;
    }

    if (!selectedCourse?.id) {
      setStatus({
        type: "error",
        msg: "Course data missing. Please go back and re-select.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    /**
     * 🚀 THE SWAP FIX:
     * We use FormData to ensure the exact ID from the 'selectedCourse'
     * state is sent to Laravel. No hardcoding!
     */
    const formData = new FormData();
    formData.append("receipt", receipt);
    formData.append("course_id", selectedCourse.id.toString()); // 👈 LOCKS THE ID
    formData.append("child_name", childData?.name || "Student");
    formData.append("amount", finalAmount?.toString());
    formData.append("currency", currency);

    try {
      /**
       * 🛰️ ENDPOINT CHECK:
       * Ensure this matches your 'api.php' route exactly.
       * Most common: '/parent/submit-payment'
       */
      await api.post("/parent/submit-payment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus({
        type: "success",
        msg: "Receipt submitted! Redirecting to dashboard...",
      });

      // Give the user time to read the success message
      setTimeout(() => {
        navigate("/parent/dashboard");
      }, 2500);
    } catch (err: any) {
      console.error("❌ Submission Error:", err.response?.data);
      setStatus({
        type: "error",
        msg:
          err.response?.data?.message || "Failed to submit. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // If page is refreshed and state is lost, show an error
  if (!selectedCourse) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-10">
          <AlertCircle size={64} className="text-red-400 mb-6" />
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">
            Session Expired
          </h2>
          <button
            onClick={() => navigate("/parent/dashboard")}
            className="mt-8 px-10 py-4 bg-black text-white rounded-2xl font-black uppercase text-[10px]"
          >
            Return to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 md:p-12 pb-32">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#2D5A27] transition-colors mb-8"
        >
          <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#2D5A27]/10">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Go Back
          </span>
        </button>

        <h1 className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter mb-10">
          Upload <span className="text-[#2D5A27]">Receipt</span>
        </h1>

        <div className="bg-white p-6 md:p-12 rounded-[3rem] shadow-xl border-2 border-gray-50">
          {/* Summary Card */}
          <div className="mb-10 bg-gray-50 p-8 rounded-[2.5rem] border-2 border-dashed border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Enrolling
                </p>
                <h2 className="text-2xl font-black text-gray-800 uppercase italic">
                  {childData?.name}
                </h2>
              </div>
              <div className="md:text-right">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Subject Track
                </p>
                <h2 className="text-2xl font-black text-[#2D5A27] uppercase italic">
                  {selectedCourse?.title}
                </h2>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Amount Due:
              </span>
              <span className="text-3xl font-black text-gray-800 italic">
                {currency === "NGN" ? "₦" : "£"}
                {finalAmount?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Upload Area */}
          <label className="block w-full border-4 border-dashed border-gray-100 rounded-[2.5rem] p-12 text-center cursor-pointer hover:border-[#2D5A27] transition-all bg-gray-50/30 group">
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
                {receipt ? receipt.name : "Select Proof of Payment"}
              </p>
            </div>
          </label>

          {status && (
            <div
              className={`mt-8 p-6 rounded-2xl flex items-center gap-4 animate-in zoom-in duration-300 ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
              <span className="font-black uppercase italic tracking-tight text-xs leading-relaxed">
                {status.msg}
              </span>
            </div>
          )}

          <button
            onClick={handleSubmitPayment}
            disabled={!receipt || loading}
            className="w-full mt-10 bg-[#2D5A27] text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl flex items-center justify-center gap-4 hover:bg-black transition-all active:scale-95 disabled:opacity-30"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <ShieldCheck size={24} /> Confirm & Submit
              </>
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
}
