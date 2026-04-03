import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Globe,
  MessageCircle,
  ArrowRight,
  Loader2,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function EnrollmentModal({ isOpen, onClose }: any) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [adminTime, setAdminTime] = useState("12:00");
  const [dayOfWeek, setDayOfWeek] = useState("Saturday"); // 🚀 New State for Day
  const [childData, setChildData] = useState({
    name: "",
    age: "",
    timezone: "",
  });

  // 🕒 Fetch Admin Set Schedule on Open
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api
        .get("/ai/active-schedule")
        .then((res) => {
          setAdminTime(res.data.start_time);
          setDayOfWeek(res.data.day || "Saturday"); // 🚀 Sync with Backend Day
        })
        .catch(() => {
          setAdminTime("12:00");
          setDayOfWeek("Saturday");
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 🧮 Dynamic Timezone Calculator
  const getOffsetTime = (baseTime: string, offset: number) => {
    const [hours, minutes] = baseTime.split(":").map(Number);
    let newHour = (hours + offset + 24) % 24;
    const ampm = newHour >= 12 ? "PM" : "AM";
    const displayHour = newHour % 12 || 12;
    return `${displayHour}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const timezones = [
    { zone: "Nigeria", offset: 0, label: "WAT (Local)" },
    { zone: "UK / London", offset: -1, label: "GMT/BST" },
    { zone: "Europe", offset: 0, label: "CET" },
    { zone: "Australia (Syd)", offset: 9, label: "AEST" },
  ];

  const nextStep = () => setStep(step + 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] sm:rounded-[4rem] p-6 sm:p-10 md:p-14 relative shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 sm:top-10 sm:right-10 text-gray-300 hover:text-gray-600 transition-colors z-20"
        >
          <X size={28} />
        </button>

        {/* --- STEP 1: CHILD DETAILS --- */}
        {step === 1 && (
          <div className="animate-in slide-in-from-right duration-500">
            <h2 className="text-2xl sm:text-4xl font-black text-gray-800 italic uppercase tracking-tighter mb-2">
              Child's Details
            </h2>
            <p className="text-[#F4B400] font-black uppercase text-[9px] sm:text-[10px] tracking-widest mb-8 sm:mb-12">
              Step 01 / 02
            </p>

            <div className="space-y-5 sm:space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
                  Child's Full Name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2D5A27] transition-colors"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="e.g. Ayo Smith"
                    className="w-full pl-14 pr-6 py-4 sm:py-6 bg-gray-50 border-2 border-transparent focus:border-[#2D5A27] rounded-[1.5rem] sm:rounded-[2rem] outline-none font-bold text-gray-700 transition-all shadow-inner"
                    onChange={(e) =>
                      setChildData({ ...childData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
                  Child's Age
                </label>
                <input
                  type="number"
                  placeholder="e.g. 8"
                  className="w-full px-8 py-4 sm:py-6 bg-gray-50 border-2 border-transparent focus:border-[#2D5A27] rounded-[1.5rem] sm:rounded-[2rem] outline-none font-bold text-gray-700 transition-all shadow-inner"
                  onChange={(e) =>
                    setChildData({ ...childData, age: e.target.value })
                  }
                />
              </div>

              <button
                onClick={nextStep}
                disabled={!childData.name || !childData.age}
                className="w-full mt-4 bg-[#2D5A27] text-white py-5 sm:py-7 rounded-[1.5rem] sm:rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs shadow-xl flex items-center justify-center gap-3 disabled:opacity-30 transition-all active:scale-95"
              >
                Set Availability <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: DYNAMIC TIMEZONE SELECTION --- */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right duration-500">
            <h2 className="text-2xl sm:text-4xl font-black text-gray-800 italic uppercase tracking-tighter mb-2">
              Select Your Time
            </h2>
            <p className="text-[#F4B400] font-black uppercase text-[9px] sm:text-[10px] tracking-widest mb-6 sm:mb-10 flex items-center gap-2">
              Step 02 / 02 <span className="text-gray-300">•</span>{" "}
              <Calendar size={12} /> Every {dayOfWeek}
            </p>

            {loading ? (
              <div className="flex flex-col items-center py-20">
                <Loader2
                  className="text-[#2D5A27] animate-spin mb-4"
                  size={40}
                />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Calculating Times...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12">
                {timezones.map((slot) => {
                  const localTime = getOffsetTime(adminTime, slot.offset);
                  return (
                    <button
                      key={slot.zone}
                      onClick={() =>
                        setChildData({
                          ...childData,
                          timezone: `${dayOfWeek}s at ${localTime} (${slot.zone})`,
                        })
                      }
                      className={`p-5 sm:p-7 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 flex flex-col items-center justify-center transition-all shadow-sm relative overflow-hidden ${
                        childData.timezone.includes(slot.zone)
                          ? "border-[#2D5A27] bg-[#2D5A27]/5 ring-4 ring-[#2D5A27]/5"
                          : "border-gray-50 bg-white hover:border-gray-100"
                      }`}
                    >
                      <span
                        className={`text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${
                          childData.timezone.includes(slot.zone)
                            ? "text-[#2D5A27]"
                            : "text-gray-300"
                        }`}
                      >
                        {slot.zone}
                      </span>
                      <span
                        className={`text-xl sm:text-2xl font-black italic tracking-tighter ${
                          childData.timezone.includes(slot.zone)
                            ? "text-[#2D5A27]"
                            : "text-gray-800"
                        }`}
                      >
                        {localTime}
                      </span>
                      <span className="text-[7px] sm:text-[8px] font-bold text-[#F4B400] mt-1 uppercase tracking-widest">
                        Every {dayOfWeek}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* --- RESPONSIVE FALLBACK --- */}
            <div className="text-center p-5 sm:p-8 bg-orange-50/50 rounded-[2rem] sm:rounded-[3rem] border-2 border-dashed border-orange-100 mb-8 sm:mb-10">
              <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                No suitable time for your region?
              </p>
              <a
                href="https://wa.me/2348174485504?text=Hi! I am interested in FricaLearn for my child but the WAT slot doesn't work for us. Do you have other options?"
                target="_blank"
                className="inline-flex items-center gap-3 bg-[#25D366] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-2xl font-black uppercase text-[9px] sm:text-[10px] shadow-lg hover:scale-105 transition-all"
              >
                <MessageCircle size={16} /> Chat with Admin
              </a>
            </div>

            <button
              onClick={() =>
                navigate("/select-courses", { state: { childData } })
              }
              disabled={!childData.timezone || loading}
              className="w-full bg-gray-900 text-white py-5 sm:py-7 rounded-[1.5rem] sm:rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs shadow-2xl flex items-center justify-center gap-3 disabled:opacity-30 transition-all active:scale-95"
            >
              Continue to Courses <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
