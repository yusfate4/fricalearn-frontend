import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import {
  Clock,
  Calendar,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function AdminMasterSchedule() {
  const [startTime, setStartTime] = useState("12:00");
  const [dayOfWeek, setDayOfWeek] = useState("Saturday");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    setLoading(true);
    api
      .get("/ai/active-schedule")
      .then((res) => {
        setStartTime(res.data.start_time);
        setDayOfWeek(res.data.day || "Saturday");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await api.post("/admin/update-schedule", {
        start_time_wat: startTime,
        day_of_week: dayOfWeek,
      });
      setStatus({ type: "success", msg: "Schedule synced successfully!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (err) {
      setStatus({
        type: "error",
        msg: "Update failed. Please check connection.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-800 italic uppercase tracking-tighter">
              Master Schedule
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Set the Global Weekly Class Time
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Day Selection */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border-2 border-gray-50">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-6 tracking-widest">
              <Calendar size={14} className="text-[#2D5A27]" /> 1. Select Day
            </label>
            <div className="grid grid-cols-2 gap-2">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setDayOfWeek(day)}
                  className={`py-4 rounded-2xl font-black text-[10px] uppercase transition-all ${
                    dayOfWeek === day
                      ? "bg-[#2D5A27] text-white shadow-lg scale-105"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border-2 border-gray-50 flex flex-col">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-6 tracking-widest">
              <Clock size={14} className="text-[#2D5A27]" /> 2. Select WAT Time
            </label>
            <div className="flex-1 flex items-center justify-center">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-8 bg-gray-50 rounded-[2rem] text-5xl font-black italic text-center outline-none focus:ring-8 ring-[#2D5A27]/5 transition-all text-[#2D5A27]"
              />
            </div>
          </div>
        </div>

        {/* --- STATUS NOTIFICATION (No more localhost alerts) --- */}
        {status && (
          <div
            className={`mt-8 p-6 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-4 duration-300 ${
              status.type === "success"
                ? "bg-green-50 text-green-700 border-2 border-green-100"
                : "bg-red-50 text-red-700 border-2 border-red-100"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={24} />
            ) : (
              <AlertCircle size={24} />
            )}
            <span className="font-black uppercase italic tracking-tight">
              {status.msg}
            </span>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="w-full mt-10 bg-gray-900 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-[#2D5A27] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              Save Schedule: {dayOfWeek}s @ {startTime} WAT
            </>
          )}
        </button>
      </div>
    </Layout>
  );
}
