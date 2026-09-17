import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ShieldCheck, Clock, AlertCircle, ChevronRight, Calendar, Zap } from "lucide-react";

interface SubStatus {
  is_premium: boolean;
  on_trial: boolean;
  trial_days_left: number;
  trial_ends_at: string | null;
  premium_expires_at: string | null;
  access_expired: boolean;
}

/**
 * Subscription status card — shown on the parent dashboard.
 * Shows trial countdown, premium expiry, or expired state.
 */
export default function SubscriptionStatus({ onUpgradeClick }: { onUpgradeClick?: () => void }) {
  const [status, setStatus]   = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const sid = localStorage.getItem("active_student_id");
    const ep  = sid ? `/trial/status?student_id=${sid}` : `/trial/status`;
    api.get(ep)
      .then(r => setStatus(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !status) return null;

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });

  // ── PREMIUM ───────────────────────────────────────────────
  if (status.is_premium && status.premium_expires_at) {
    const daysLeft = Math.ceil(
      (new Date(status.premium_expires_at).getTime() - Date.now()) / 86400000
    );
    const urgent = daysLeft <= 7;
    return (
      <div className={`rounded-[2rem] p-6 border-2 ${urgent ? "bg-orange-50 border-orange-200" : "bg-green-50 border-green-200"}`}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${urgent ? "bg-orange-100" : "bg-green-100"}`}>
              <ShieldCheck size={22} className={urgent ? "text-orange-600" : "text-green-600"}/>
            </div>
            <div>
              <p className={`font-black text-sm uppercase tracking-wide ${urgent ? "text-orange-700" : "text-green-700"}`}>
                {urgent ? "⚠️ Premium expiring soon" : "✅ Premium Active"}
              </p>
              <p className="text-gray-500 font-bold text-xs mt-0.5 flex items-center gap-1.5">
                <Calendar size={11}/> Expires {fmt(status.premium_expires_at)} · {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
              </p>
            </div>
          </div>
          {urgent && onUpgradeClick && (
            <button onClick={onUpgradeClick}
              className="shrink-0 bg-[#3F2171] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
              Renew Now
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── FREE TRIAL ────────────────────────────────────────────
  if (status.on_trial && status.trial_ends_at) {
    const days   = status.trial_days_left;
    const urgent = days <= 5;
    return (
      <div className={`rounded-[2rem] p-6 border-2 ${urgent ? "bg-orange-50 border-orange-200" : "bg-[#3F2171]/5 border-[#3F2171]/20"}`}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${urgent ? "bg-orange-100" : "bg-[#3F2171]/10"}`}>
              <Clock size={22} className={urgent ? "text-orange-600" : "text-[#3F2171]"}/>
            </div>
            <div>
              <p className={`font-black text-sm uppercase tracking-wide ${urgent ? "text-orange-700" : "text-[#3F2171]"}`}>
                🎁 Free Trial — {days} day{days !== 1 ? "s" : ""} remaining
              </p>
              <p className="text-gray-500 font-bold text-xs mt-0.5 flex items-center gap-1.5">
                <Calendar size={11}/> Ends {fmt(status.trial_ends_at)} · Full access included
              </p>
            </div>
          </div>
          {onUpgradeClick && (
            <button onClick={onUpgradeClick}
              className="shrink-0 bg-[#3F2171] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2">
              <Zap size={12}/> Upgrade Early
            </button>
          )}
        </div>

        {/* Trial progress bar */}
        <div className="mt-4">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${urgent ? "bg-orange-400" : "bg-[#3F2171]"}`}
              style={{ width: `${Math.min((days / 30) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[9px] font-bold text-gray-400 mt-1 text-right">{days}/30 days remaining</p>
        </div>
      </div>
    );
  }

  // ── EXPIRED ───────────────────────────────────────────────
  if (status.access_expired) {
    return (
      <div className="rounded-[2rem] p-6 border-2 bg-red-50 border-red-200">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <AlertCircle size={22} className="text-red-600"/>
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-wide text-red-700">
                ⛔ Access Expired
              </p>
              <p className="text-gray-500 font-bold text-xs mt-0.5">
                Your free trial has ended. Upgrade to continue learning.
              </p>
            </div>
          </div>
          {onUpgradeClick && (
            <button onClick={onUpgradeClick}
              className="shrink-0 bg-red-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2">
              Upgrade Now <ChevronRight size={12}/>
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
