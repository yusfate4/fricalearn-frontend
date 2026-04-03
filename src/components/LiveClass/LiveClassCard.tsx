import React from 'react';
import { Clock, Video, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiveClassCard = ({ liveClass }: { liveClass: any }) => {
  const now = new Date();
  const startTime = new Date(liveClass.scheduled_at);
  
  // 🚀 IMPROVED LOGIC: 
  // 1. If the DB status says 'ongoing', it's LIVE (Manual Override).
  // 2. Otherwise, check if the current time is past the start time.
  const isOngoing = liveClass.status === 'ongoing' || (now >= startTime);

  return (
    <div className={`relative bg-white rounded-[2rem] p-6 border-2 transition-all ${isOngoing ? 'border-[#2D5A27] shadow-green-100 shadow-lg scale-[1.02]' : 'border-gray-100 opacity-90'}`}>
      {isOngoing && (
        <span className="absolute -top-3 left-6 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse uppercase tracking-widest z-10">
          Live Now
        </span>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl transition-colors ${isOngoing ? 'bg-green-50 text-[#2D5A27]' : 'bg-gray-50 text-gray-400'}`}>
          <Video size={24} />
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Starts At</p>
          <p className="font-bold text-gray-800 italic uppercase">
            {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-black text-gray-800 mb-2 italic uppercase tracking-tighter">
        {liveClass.title}
      </h3>
      
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-[#2D5A27] rounded-full flex items-center justify-center text-[10px] text-white font-bold italic">
          {liveClass.tutor?.name?.charAt(0) || 'T'}
        </div>
        <p className="text-xs font-bold text-gray-500">Host: {liveClass.tutor?.name || 'Frica Tutor'}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-2 border border-gray-100">
          <Clock size={14} className="text-[#2D5A27]" />
          <span className="text-[10px] font-black text-gray-600 uppercase">{liveClass.duration_minutes}m</span>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-2 border border-gray-100">
          <Users size={14} className="text-[#2D5A27]" />
          <span className="text-[10px] font-black text-gray-600 uppercase">{liveClass.max_attendees || 20} Max</span>
        </div>
      </div>

      {/* 🚀 FIXED LINK: If not live, it acts like a button that does nothing. If live, it teleports you to the room. */}
      {isOngoing ? (
        <Link
          to={`/live-room/${liveClass.id}`}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all bg-[#2D5A27] text-white hover:bg-black shadow-xl shadow-green-900/20 active:scale-95"
        >
          Enter Classroom <ExternalLink size={14} />
        </Link>
      ) : (
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-dashed border-gray-200"
        >
          Waiting for Tutor
        </button>
      )}
    </div>
  );
};