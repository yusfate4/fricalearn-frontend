import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { X, Upload, Loader2, ShieldCheck, Landmark, CheckCircle2, Star, Gift } from "lucide-react";

interface Tier { ngn: number; gbp: number; days: number; label: string; savings_pct: number | null }

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}

// Paid tiers — 1 month = free trial, not shown here
const DEFAULT_TIERS: { [m: string]: Tier } = {
  "3":  { ngn: 30000, gbp: 15, days: 90,  label: "3 Months",  savings_pct: null },
  "6":  { ngn: 50000, gbp: 25, days: 180, label: "6 Months",  savings_pct: 17   },
  "12": { ngn: 80000, gbp: 40, days: 365, label: "12 Months", savings_pct: 33   },
};

export default function PaywallModal({ open, onClose, onUnlocked }: PaywallModalProps) {
  const [currency, setCurrency]     = useState<"NGN" | "GBP">("NGN");
  const [months, setMonths]         = useState<string>("12");
  const [banks, setBanks]           = useState<any>(null);
  const [receipt, setReceipt]       = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [tiers, setTiers]           = useState(DEFAULT_TIERS);

  useEffect(() => {
    if (!open) return;
    api.get("/onboarding/bank-details").then(r => setBanks(r.data.bank_accounts)).catch(() => {});
    api.get("/trial/tiers").then(r => { if (r.data.tiers) setTiers(r.data.tiers); }).catch(() => {});
  }, [open]);

  if (!open) return null;

  const tier   = tiers[months] || DEFAULT_TIERS[months];
  const price  = currency === "NGN" ? tier.ngn : tier.gbp;
  const fmt    = (n: number) => currency === "NGN" ? `₦${n.toLocaleString()}` : `£${n}`;
  const bank   = currency === "NGN" ? banks?.ngn : banks?.gbp;
  const perMo  = currency === "NGN"
    ? `₦${Math.round(tier.ngn / Number(months)).toLocaleString()}/mo`
    : `£${(tier.gbp / Number(months)).toFixed(2)}/mo`;

  const handleUpgrade = async () => {
    if (!receipt) { setError("Please upload your payment receipt"); return; }
    setSubmitting(true); setError(null);
    try {
      const sid  = localStorage.getItem("active_student_id");
      const form = new FormData();
      form.append("receipt", receipt);
      form.append("currency", currency);
      form.append("months", months);
      if (sid) form.append("student_id", sid);
      await api.post("/trial/upgrade", form, { headers: { "Content-Type": "multipart/form-data" } });
      setDone(true);
      setTimeout(() => onUnlocked(), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed — please try again");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] max-w-lg w-full shadow-2xl relative animate-in zoom-in duration-300 my-8">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-300 hover:text-gray-600 z-10">
          <X size={22}/>
        </button>

        {done ? (
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-green-500" size={48}/>
            </div>
            <h3 className="text-2xl font-black text-[#2A1650] uppercase italic tracking-tight mb-2">
              {tier.label} Activated! 🎉
            </h3>
            <p className="text-gray-500 font-medium text-sm">
              Full access for {tier.days} days. Loading your lesson...
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-br from-[#2A1650] to-[#3F2171] p-8 rounded-t-[2.5rem] text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift size={16} className="text-[#FFFF00]"/>
                <p className="text-[#FFFF00] font-black text-[10px] uppercase tracking-widest">
                  Free Trial Ended
                </p>
              </div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">
                Continue Learning
              </h2>
              <p className="text-white/60 font-medium text-xs">
                Choose a plan — both Maths &amp; English included. Longer plans save more.
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Currency toggle */}
              <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                {(["NGN", "GBP"] as const).map((c) => (
                  <button key={c} onClick={() => setCurrency(c)}
                    className={`flex-1 py-2.5 rounded-xl font-black text-[10px] tracking-widest transition-all ${
                      currency === c ? "bg-white text-[#3F2171] shadow" : "text-gray-400"
                    }`}>
                    {c === "NGN" ? "🇳🇬 NAIRA" : "🇬🇧 POUNDS"}
                  </button>
                ))}
              </div>

              {/* Tier cards — 12 months on top (best value) */}
              <div className="space-y-2">
                {Object.entries(tiers)
                  .sort((a, b) => Number(b[0]) - Number(a[0]))
                  .map(([m, t]) => {
                    const isSelected = months === m;
                    const p = currency === "NGN" ? t.ngn : t.gbp;
                    const pm = currency === "NGN"
                      ? `₦${Math.round(t.ngn / Number(m)).toLocaleString()}/mo`
                      : `£${(t.gbp / Number(m)).toFixed(2)}/mo`;

                    return (
                      <button key={m} onClick={() => setMonths(m)}
                        className={`w-full text-left rounded-2xl border-2 p-4 transition-all relative ${
                          isSelected ? "border-[#3F2171] bg-[#3F2171]/5" : "border-gray-100 hover:border-[#3F2171]/30"
                        }`}>

                        {m === "12" && (
                          <span className="absolute -top-3 left-4 bg-[#3F2171] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                            <Star size={8} fill="white"/> Best Value
                          </span>
                        )}

                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? "border-[#3F2171] bg-[#3F2171]" : "border-gray-300"
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                            </div>
                            <div>
                              <p className="font-black text-sm text-gray-800">{t.label}</p>
                              <p className="text-[10px] font-bold text-gray-400">{pm} · {t.days} days</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-black text-base text-gray-800">{fmt(p)}</p>
                            {t.savings_pct && (
                              <span className="text-[9px] font-black text-[#2A1650] bg-[#FFFF00] px-2 py-0.5 rounded-full">
                                Save {t.savings_pct}%
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>

              {/* Bank details */}
              {bank && (
                <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Landmark size={15} className="text-[#3F2171]"/>
                    <p className="font-black text-gray-800 text-sm">{bank.flag} {bank.bank_name}</p>
                  </div>
                  <p className="text-xl font-black text-[#3F2171] tracking-tight">{bank.account_number}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase">{bank.account_name}</p>
                  <p className="text-[10px] font-bold text-blue-700 bg-blue-50 rounded-xl p-2.5 mt-3">
                    💡 Transfer <strong>{fmt(price)}</strong> and use your child's name as payment reference
                  </p>
                </div>
              )}

              {/* Receipt upload */}
              <label className="block border-4 border-dashed border-gray-100 rounded-2xl p-5 text-center cursor-pointer hover:border-[#3F2171] transition-all">
                <input type="file" className="hidden" accept="image/*,application/pdf"
                  onChange={(e) => { setReceipt(e.target.files?.[0] || null); setError(null); }}/>
                <Upload size={20} className="text-[#3F2171] mx-auto mb-1"/>
                <p className="font-black text-gray-700 uppercase text-[10px] tracking-widest">
                  {receipt ? receipt.name : "Upload Payment Receipt"}
                </p>
                <p className="text-[9px] font-bold text-gray-400 mt-0.5">JPG, PNG or PDF · Max 5MB</p>
              </label>

              {error && (
                <p className="text-red-600 text-xs font-bold bg-red-50 rounded-xl p-3 border border-red-100">
                  {error}
                </p>
              )}

              <button onClick={handleUpgrade} disabled={submitting || !receipt}
                className="w-full bg-[#3F2171] text-white py-5 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-[#1E1038] active:translate-y-1 active:border-b-0">
                {submitting
                  ? <><Loader2 size={20} className="animate-spin"/> Unlocking...</>
                  : <><ShieldCheck size={20}/> Unlock {tier.label} — {fmt(price)}</>
                }
              </button>

              <p className="text-center text-[10px] font-bold text-gray-400">
                ⚡ Instant access on upload · Admin verifies within 24 hours · {perMo} equivalent
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
