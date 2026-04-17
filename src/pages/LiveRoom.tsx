import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JitsiMeeting } from "@jitsi/react-sdk";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth"; 
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";

export default function LiveRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [liveClass, setLiveClass] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get(`/live-classes/${id}`)
      .then((res) => {
        setLiveClass(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Room Load Error:", err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleExit = () => {
    if (user?.role === "admin") {
      navigate("/admin/live-classes");
    } else {
      navigate("/dashboard");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <Loader2 className="animate-spin mb-4 text-[#2D5A27]" size={48} />
        <p className="font-black uppercase tracking-widest text-xs italic">
          Syncing FricaLive...
        </p>
      </div>
    );

  if (error || !liveClass)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-black uppercase italic mb-4 text-white">
          Classroom Not Found
        </h2>
        <button
          onClick={handleExit}
          className="bg-[#2D5A27] px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest text-white"
        >
          Return to Safety
        </button>
      </div>
    );

  const cleanRoomName = `FricaLearn_Room_${id}_${liveClass.title.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* --- PREMIUM HEADER --- */}
      <div className="p-4 bg-black border-b border-white/10 text-white flex justify-between items-center z-10">
        <button
          onClick={handleExit}
          className="flex items-center gap-2 hover:text-[#2D5A27] transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase text-[10px] tracking-widest">Leave Session</span>
        </button>

        <div className="text-center">
          <h2 className="font-black italic uppercase tracking-tighter text-sm text-[#F4B400] leading-none">
            {liveClass.title}
          </h2>
          <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mt-1">
            Tutor: {liveClass.tutor?.name || "Frica Expert"}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">Live Session</span>
        </div>
      </div>

      {/* --- JITSI INTEGRATION --- */}
 /* --- JITSI INTEGRATION --- */
<div className="flex-1 w-full bg-gray-950 relative">
  <iframe
    /* 🚀 THE MAGIC URL: We point directly to the meeting with config overrides in the URL hash */
   src={`https://meet.element.io/${cleanRoomName}#config.prejoinPageEnabled=false`}
    allow="camera; microphone; fullscreen; display-capture; autoplay"
    className="w-full h-full border-none"
    title={liveClass.title}
  ></iframe>
  
  {/* 💡 EMERGENCY FALLBACK: Only shows if the iframe is blocked */}
  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 bg-black/80 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
     <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Meeting acting up?</p>
     <a 
       href={`https://8x8.vc/vpaas-magic-cookie-950989f66439466da7788/${cleanRoomName}`}
       target="_blank"
       rel="noreferrer"
       className="bg-[#2D5A27] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#F4B400] transition-all"
     >
       Open in New Tab
     </a>
  </div>
</div>
    </div>
  );
}