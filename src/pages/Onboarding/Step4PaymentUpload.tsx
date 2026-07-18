import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import {
  Upload, CheckCircle2, Loader2, ShieldCheck, AlertCircle,
  ChevronLeft, ChevronDown, Landmark, Info, User, Gift, Sparkles,
} from "lucide-react";

interface BankAccount {
  currency: string; bank_name: string;
  account_number: string; account_name: string; flag: string;
}

/**
 * Step 4 — FREEMIUM: trial-first enrolment.
 * Default path: child name + age → Start Free 14-Day Trial (no payment).
 * Optional collapsible path: pay now by bank transfer + receipt.
 */
export default function Step4PaymentUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const { selectedCourses, currency, mathsGrade, englishGrade, total } =
    location.state || {};

  const [bankDetails, setBankDetails] = useState<{ ngn: BankAccount; gbp: BankAccount } | null>(null);
  const [childName, setChildName]     = useState("");
  const [childAge, setChildAge]       = useState<string>("");
  const [payNow, setPayNow]           = useState(false); // collapsible pay-now section
  const [receipt, setReceipt]         = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);
  const [status, setStatus]           = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const hasPaidCourses = selectedCourses?.some((c: string) => c === "maths" || c === "english");

  useEffect(() => {
    api.get("/onboarding/bank-details")
      .then(res => setBankDetails(res.data.bank_accounts))
      .catch(err => console.error("Failed to load bank details", err));
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceipt(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setReceiptPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else setReceiptPreview(null);
      setStatus(null);
    }
  };

  const submit = async (withPayment: boolean) => {
    // Validation
    if (!childName.trim()) { setStatus({ type: "error", msg: "Please enter your child's name" }); return; }
    const ageNum = parseInt(childAge, 10);
    if (!childAge || isNaN(ageNum) || ageNum < 3 || ageNum > 18) {
      setStatus({ type: "error", msg: "Please enter a valid age between 3 and 18" }); return;
    }
    if (withPayment && !receipt) {
      setStatus({ type: "error", msg: "Please upload your payment receipt" }); return;
    }

    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("parent_id", user?.id.toString() || "");
    formData.append("child_name", childName.trim());
    formData.append("age", ageNum.toString());
    formData.append("selected_courses", JSON.stringify(selectedCourses));
    formData.append("maths_grade", mathsGrade?.toString() || "");
    formData.append("english_grade", englishGrade?.toString() || "");
    formData.append("currency", currency);
    formData.append("total_amount", withPayment ? (total?.toString() || "0") : "0");
    if (withPayment && receipt) formData.append("receipt", receipt);

    try {
      await api.post("/onboarding/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus({
        type: "success",
        msg: withPayment
          ? "🎉 Payment received! Your child is enrolled with full access. Redirecting..."
          : "🎉 Free trial started! Your child has 14 days of full access. Redirecting...",
      });
      setTimeout(() => navigate("/parent/dashboard"), 2500);
    } catch (err: any) {
      console.error("Submission Error:", err.response?.data);
      setStatus({ type: "error", msg: err.response?.data?.message || "Failed to submit. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const currentBankAccount = currency === "NGN" ? bankDetails?.ngn : bankDetails?.gbp;
  const priceLabel = `${currency === "NGN" ? "₦" : "£"}${total?.toLocaleString()}`;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-12 py-10 md:py-16 pb-32">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#3F2171] transition-colors mb-8">
          <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#3F2171]/10"><ChevronLeft size={20}/></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back</span>
        </button>

        {/* Header — trial-first */}
        <div className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">
            Step 4 of 4 • Final Step
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight mb-4">
            Start Your <span className="text-[#3F2171]">Free Trial</span>
          </h1>
          <p className="text-gray-500 font-bold text-sm md:text-base max-w-2xl">
            {hasPaidCourses
              ? "14 days of Maths & English completely free — no payment needed today. Language courses are free forever."
              : "Your language course is completely free — no payment needed. Just add your child's details below."}
          </p>
        </div>

        <div className="space-y-6">

          {/* Trial benefits strip */}
          {hasPaidCourses && (
            <div className="bg-gradient-to-br from-[#3F2171] to-[#2A1650] rounded-[2rem] p-6 md:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-14 h-14 bg-[#FFFF00] rounded-2xl flex items-center justify-center shrink-0">
                <Gift size={26} className="text-[#2A1650]"/>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wide mb-1">🎁 14-Day Free Trial Included</p>
                <p className="text-xs font-bold opacity-80 leading-relaxed">
                  Full access to every lesson, quiz, and the AI Tutor. No card, no payment, no commitment —
                  you'll only be asked to pay after the trial if you want to continue.
                </p>
              </div>
            </div>
          )}

          {/* Child info */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border-2 border-gray-50">
            <h2 className="text-xl md:text-2xl font-black text-gray-800 italic uppercase tracking-tight mb-6">
              Child's Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  <User size={12} className="inline mr-2"/>Child's Full Name
                </label>
                <input type="text" value={childName} onChange={(e) => setChildName(e.target.value)}
                  placeholder="Ada Johnson"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#3F2171] font-bold text-sm transition-all" required/>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Child's Age
                </label>
                <div className="flex items-center gap-4">
                  <input type="number" min={3} max={18} value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    placeholder="e.g. 8"
                    className="w-32 px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#3F2171] font-bold text-sm transition-all text-center" required/>
                  <span className="text-sm font-bold text-gray-500">years old</span>
                </div>
                <p className="text-[9px] font-bold text-gray-400 mt-2">Enter a number between 3 and 18</p>
              </div>
            </div>
          </div>

          {/* Status */}
          {status && (
            <div className={`p-6 rounded-2xl flex items-center gap-4 animate-in zoom-in duration-300 ${
              status.type === "success"
                ? "bg-green-50 text-green-700 border-2 border-green-100"
                : "bg-red-50 text-red-700 border-2 border-red-100"}`}>
              {status.type === "success" ? <CheckCircle2 size={24}/> : <AlertCircle size={24}/>}
              <span className="font-black uppercase italic tracking-tight text-xs leading-relaxed">{status.msg}</span>
            </div>
          )}

          {/* ⭐ PRIMARY CTA — Start Free Trial */}
          <button onClick={() => submit(false)} disabled={!childName || !childAge || loading}
            className="w-full bg-[#3F2171] text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl flex items-center justify-center gap-4 hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-[#1E1038] active:border-b-0">
            {loading && !payNow ? (
              <><Loader2 className="animate-spin" size={24}/>Setting up trial...</>
            ) : (
              <><Sparkles size={24} className="text-[#FFFF00]"/>
                {hasPaidCourses ? "Start Free 14-Day Trial" : "Complete Free Enrolment"}</>
            )}
          </button>

          {/* Optional: Pay now (collapsible) — only when paid courses selected */}
          {hasPaidCourses && (
            <div className="bg-white rounded-[2.5rem] border-2 border-gray-100 overflow-hidden">
              <button onClick={() => setPayNow(!payNow)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-black text-gray-800 uppercase italic tracking-tight text-sm">
                    Prefer to pay now instead?
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1">
                    Skip the trial — {priceLabel}/month unlocks 30 days immediately
                  </p>
                </div>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${payNow ? "rotate-180" : ""}`}/>
              </button>

              {payNow && (
                <div className="border-t border-gray-100 p-6 md:p-8 space-y-6">
                  {/* Bank details */}
                  {currentBankAccount && (
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4 text-[#3F2171]">
                        <Landmark size={20}/>
                        <h3 className="font-black uppercase italic text-xs">
                          {currentBankAccount.flag} Transfer {priceLabel} to
                        </h3>
                      </div>
                      <p className="text-lg font-black text-gray-800">{currentBankAccount.bank_name}</p>
                      <p className="text-2xl font-black text-[#3F2171] tracking-tight my-1">{currentBankAccount.account_number}</p>
                      <p className="text-xs font-bold text-gray-500 uppercase">{currentBankAccount.account_name}</p>
                      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
                        <Info size={16} className="text-blue-600 shrink-0"/>
                        <p className="text-[10px] font-bold text-blue-800">
                          Use your child's name as the payment reference for instant verification!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Receipt upload */}
                  <label className="block w-full border-4 border-dashed border-gray-100 rounded-[2rem] p-10 text-center cursor-pointer hover:border-[#3F2171] transition-all bg-gray-50/30 group">
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,application/pdf"/>
                    {receiptPreview ? (
                      <div className="flex flex-col items-center gap-3">
                        <img src={receiptPreview} alt="Receipt preview" className="max-h-40 rounded-2xl shadow-lg"/>
                        <p className="text-xs font-black uppercase tracking-wide text-gray-700">{receipt?.name}</p>
                        <p className="text-[9px] font-bold text-gray-400">Click to change</p>
                      </div>
                    ) : receipt ? (
                      <div className="flex flex-col items-center gap-3">
                        <Upload size={28} className="text-[#3F2171]"/>
                        <p className="font-black text-gray-700 uppercase text-xs tracking-widest">{receipt.name}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-white p-5 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                          <Upload size={28} className="text-[#3F2171]"/>
                        </div>
                        <p className="font-black text-gray-700 uppercase text-xs tracking-widest">Click to Upload Receipt</p>
                        <p className="text-[9px] font-bold text-gray-400">JPG, PNG, or PDF • Max 5MB</p>
                      </div>
                    )}
                  </label>

                  <button onClick={() => submit(true)} disabled={!childName || !childAge || !receipt || loading}
                    className="w-full bg-[#FFFF00] text-[#2A1650] py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl flex items-center justify-center gap-3 hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-yellow-600 active:translate-y-1 active:border-b-0">
                    {loading && payNow ? (
                      <><Loader2 className="animate-spin" size={20}/>Enrolling...</>
                    ) : (
                      <><ShieldCheck size={20}/>Pay {priceLabel} & Enrol Now</>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
