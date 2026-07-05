import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Clock, Sparkles } from "lucide-react";

/**
 * Shows remaining trial days at the top of the dashboard / subjects pages.
 * Renders nothing for premium users or if status can't be fetched.
 */
export default function TrialBanner({ onUpgradeClick }: { onUpgradeClick?: () => void }) {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const sid = localStorage.getItem("active_student_id");
    const ep  = sid ? `/trial/status?student_id=${sid}` : `/trial/status`;
    api.get(ep).then(res => setStatus(res.data)).catch(() => {});
  }, []);

  if (!status || status.is_premium) return null;

  if (status.on_trial) {
    const days = status.trial_days_left;
    const urgent = days <= 3;
    return (
      <div className={`rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-2 ${
        urgent ? "bg-orange-50 border-orange-200" : "bg-[#F4B400]/10 border-[#F4B400]/30"
      }`}>
        <div className="flex items-center gap-3">
          <Clock size={18} className={urgent ? "text-orange-500" : "text-[#F4B400]"}/>
          <p className="text-xs font-black uppercase tracking-wide text-gray-700">
            Free trial: <span className={urgent ? "text-orange-600" : "text-[#2D5A27]"}>{days} day{days !== 1 ? "s" : ""} left</span>
            <span className="font-bold text-gray-400 normal-case tracking-normal"> — Maths & English included</span>
          </p>
        </div>
        {onUpgradeClick && (
          <button onClick={onUpgradeClick}
            className="shrink-0 bg-[#2D5A27] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2">
            <Sparkles size={12}/> Upgrade Now
          </button>
        )}
      </div>
    );
  }

  return null; // expired state is handled by the PaywallModal when they open a lesson
}
