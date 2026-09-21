import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Clock, Zap } from "lucide-react";

interface TrialStatus {
  on_trial: boolean;
  is_premium: boolean;
  trial_days_left: number;
  trial_ends_at: string | null;
  has_maths: boolean;
  has_english: boolean;
  selected_courses: string[];
  access_expired: boolean;
}

export default function TrialBanner({ onUpgradeClick }: { onUpgradeClick?: () => void }) {
  const [status, setStatus] = useState<TrialStatus | null>(null);

  useEffect(() => {
    const sid = localStorage.getItem("active_student_id");
    const ep  = sid ? `/trial/status?student_id=${sid}` : `/trial/status`;
    api.get(ep).then(res => setStatus(res.data)).catch(() => {});
  }, []);

  if (!status || status.is_premium || !status.on_trial) return null;

  const days   = status.trial_days_left;
  const urgent = days <= 5;

  // Build subject label from actual enrolled courses
  const hasMaths   = status.has_maths;
  const hasEnglish = status.has_english;
  const langs      = (status.selected_courses || [])
    .filter(c => ["yoruba","igbo","hausa"].includes(c))
    .map(c => c.charAt(0).toUpperCase() + c.slice(1));

  const subjectLine = (() => {
    const parts: string[] = [];
    if (hasMaths && hasEnglish) parts.push("Maths & English");
    else if (hasMaths)   parts.push("Maths");
    else if (hasEnglish) parts.push("English");
    if (langs.length) parts.push(`${langs.join(", ")} free`);
    return parts.join(" · ") || "All subjects included";
  })();

  return (
    <div className={`rounded-[1.5rem] p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-2 ${
      urgent
        ? "bg-orange-50 border-orange-200"
        : "bg-[#3F2171]/8 border-[#3F2171]/20"
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
          urgent ? "bg-orange-100" : "bg-[#3F2171]/10"
        }`}>
          <Clock size={16} className={urgent ? "text-orange-500" : "text-[#3F2171]"}/>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-gray-700">
            🎁 Free trial —{" "}
            <span className={urgent ? "text-orange-600" : "text-[#3F2171]"}>
              {days} day{days !== 1 ? "s" : ""} left
            </span>
          </p>
          <p className="text-[10px] font-bold text-gray-400 mt-0.5">{subjectLine}</p>
        </div>
      </div>
      {onUpgradeClick && (
        <button onClick={onUpgradeClick}
          className={`shrink-0 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${
            urgent ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-[#3F2171] text-white hover:bg-black"
          }`}>
          <Zap size={12}/> Upgrade Now
        </button>
      )}
    </div>
  );
}
