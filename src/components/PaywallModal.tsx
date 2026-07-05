import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { X, Upload, Loader2, ShieldCheck, Landmark, CheckCircle2 } from "lucide-react";

interface BankAccount {
  currency: string; bank_name: string;
  account_number: string; account_name: string; flag: string;
}

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;       // dismiss (e.g. go back to dashboard)
  onUnlocked: () => void;    // premium activated — reload content
}

/**
 * Freemium paywall — appears when the 14-day trial has ended.
 * Payment = bank transfer + receipt (same flow as onboarding) until
 * a card gateway is integrated.
 */
export default function PaywallModal({ open, onClose, onUnlocked }: PaywallModalProps) {
  const [currency, setCurrency]   = useState<"NGN" | "GBP">("NGN");
  const [banks, setBanks]         = useState<{ ngn: BankAccount; gbp: BankAccount } | null>(null);
  const [receipt, setReceipt]     = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (open && !banks) {
      api.get("/onboarding/bank-details")
        .then(res => setBanks(res.data.bank_accounts))
        .catch(() => {});
    }
  }, [open]);

  if (!open) return null;

  const bank  = currency === "NGN" ? banks?.ngn : banks?.gbp;
  const price = currency === "NGN" ? "₦40,000" : "£26.66";

  const handleUpgrade = async () => {
    if (!receipt) { setError("Please upload your payment receipt"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const sid = localStorage.getItem("active_student_id");
      const form = new FormData();
      form.append("receipt", receipt);
      form.append("currency", currency);
      if (sid) form.append("student_id", sid);

      await api.post("/trial/upgrade", form, { headers: { "Content-Type": "multipart/form-data" } });
      setDone(true);
      setTimeout(() => { onUnlocked(); }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed — please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] max-w-lg w-full shadow-2xl relative animate-in zoom-in duration-300 my-8">

        <button onClick={onClose} className="absolute top-5 right-5 text-gray-300 hover:text-gray-600 transition-colors z-10">
          <X size={22}/>
        </button>

        {done ? (
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-green-500" size={48}/>
            </div>
            <h3 className="text-2xl font-black text-[#0E1C0E] uppercase italic tracking-tight mb-2">Premium Unlocked! 🎉</h3>
            <p className="text-gray-500 font-medium text-sm">30 days of full access activated. Loading your lesson...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0E1C0E] to-[#2D5A27] p-8 rounded-t-[2.5rem] text-center">
              <p className="text-[#F4B400] font-black text-[10px] uppercase tracking-widest mb-2">Free Trial Ended</p>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
                Keep the Learning Going!
              </h2>
              <p className="text-white/60 font-medium text-sm">
                Unlock Maths & English for 30 days — languages stay free forever.
              </p>
              <p className="text-4xl font-black text-[#F4B400] italic mt-4">{price}<span className="text-white/40 text-sm font-medium"> / month</span></p>
            </div>

            <div className="p-8 space-y-5">
              {/* Currency toggle */}
              <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                <button onClick={() => setCurrency("NGN")}
                  className={`flex-1 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all ${currency === "NGN" ? "bg-white text-[#2D5A27] shadow" : "text-gray-400"}`}>
                  🇳🇬 PAY IN NAIRA
                </button>
                <button onClick={() => setCurrency("GBP")}
                  className={`flex-1 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all ${currency === "GBP" ? "bg-white text-[#2D5A27] shadow" : "text-gray-400"}`}>
                  🇬🇧 PAY IN POUNDS
                </button>
              </div>

              {/* Bank details */}
              {bank && (
                <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Landmark size={18} className="text-[#2D5A27]"/>
                    <p className="font-black text-gray-800 text-sm">{bank.flag} {bank.bank_name}</p>
                  </div>
                  <p className="text-2xl font-black text-[#2D5A27] tracking-tight">{bank.account_number}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-1">{bank.account_name}</p>
                  <p className="text-[10px] font-bold text-blue-700 bg-blue-50 rounded-xl p-3 mt-3">
                    💡 Transfer {price}, use your child's name as reference, then upload the receipt below.
                  </p>
                </div>
              )}

              {/* Receipt upload */}
              <label className="block border-4 border-dashed border-gray-100 rounded-2xl p-6 text-center cursor-pointer hover:border-[#2D5A27] transition-all">
                <input type="file" className="hidden" accept="image/*,application/pdf"
                  onChange={(e) => { setReceipt(e.target.files?.[0] || null); setError(null); }}/>
                <Upload size={24} className="text-[#2D5A27] mx-auto mb-2"/>
                <p className="font-black text-gray-700 uppercase text-[10px] tracking-widest">
                  {receipt ? receipt.name : "Upload Payment Receipt"}
                </p>
                <p className="text-[9px] font-bold text-gray-400 mt-1">JPG, PNG or PDF · Max 5MB</p>
              </label>

              {error && (
                <p className="text-red-600 text-xs font-bold bg-red-50 rounded-xl p-3 border border-red-100">{error}</p>
              )}

              {/* Submit */}
              <button onClick={handleUpgrade} disabled={submitting || !receipt}
                className="w-full bg-[#2D5A27] text-white py-5 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-green-900 active:translate-y-1 active:border-b-0">
                {submitting ? <Loader2 size={20} className="animate-spin"/> : <ShieldCheck size={20}/>}
                {submitting ? "Unlocking..." : "Unlock 30 Days Access"}
              </button>

              <p className="text-center text-[10px] font-bold text-gray-400">
                ⚡ Instant access on upload · Admin verifies within 24 hours
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
