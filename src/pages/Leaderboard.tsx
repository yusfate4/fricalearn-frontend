import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { Medal, Trophy, User, Info, Star, Loader2 } from "lucide-react";

export default function Leaderboard() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get("/gamification/leaderboard");
      const leaderboardData = Array.isArray(res.data) ? res.data : [];
      setPlayers(leaderboardData);
    } catch (err) {
      console.error("Leaderboard sync failed:", err);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (index: number) => {
    if (index === 0) return "text-yellow-500";
    if (index === 1) return "text-gray-400";
    if (index === 2) return "text-orange-500";
    return "text-green-600/10";
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 md:p-10">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-10 md:mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="relative inline-block">
            <Trophy
              size={64}
              className="md:w-20 md:h-20 mx-auto text-yellow-500 mb-4 drop-shadow-lg"
            />
            <div className="absolute -top-1 -right-1 bg-[#2D5A27] text-white text-[8px] md:text-[10px] font-black px-2 py-0.5 md:px-3 md:py-1 rounded-full animate-bounce uppercase tracking-tighter">
              LIVE
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">
            FricaLearn Champions
          </h1>
          <p className="text-gray-400 font-bold mt-3 uppercase tracking-widest text-[10px] md:text-sm">
            Top Diaspora Learners
          </p>
        </div>

        {/* --- LEADERBOARD LIST --- */}
        <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden border-2 md:border-4 border-white animate-in zoom-in duration-500">
          {loading ? (
            <div className="p-20 md:p-32 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#2D5A27] animate-spin mb-4" />
              <p className="font-black text-gray-300 italic uppercase tracking-widest text-[10px]">
                Syncing Global Scores...
              </p>
            </div>
          ) : players.length > 0 ? (
            players.map((profile: any, index: number) => {
              const studentName = profile.user?.name || "Student";
              const totalPoints = profile.total_points || 0;
              const rankTitle = profile.rank || "Akeko";
              const track = profile.learning_language || "Yoruba";

              return (
                <div
                  key={profile.id}
                  className={`flex items-center justify-between p-5 md:p-10 border-b last:border-0 transition-all hover:bg-green-50/30 ${
                    index < 3 ? "bg-green-50/20" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 md:gap-10 overflow-hidden">
                    {/* Rank Number */}
                    <span
                      className={`text-2xl md:text-4xl font-black w-6 md:w-12 text-center ${getMedalColor(index)} italic tracking-tighter flex-shrink-0`}
                    >
                      {index + 1}
                    </span>

                    {/* Avatar */}
                    <div className="relative flex-shrink-0 hidden sm:block">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-2xl md:rounded-[1.5rem] border-2 border-gray-100 flex items-center justify-center shadow-inner">
                        <User size={24} md:size={32} className="text-gray-300" />
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-3 -left-3 rotate-[-15deg] drop-shadow-md">
                          <Star size={20} md:size={28} className="text-yellow-400 animate-pulse" fill="currentColor" />
                        </div>
                      )}
                    </div>

                    {/* Name & Track */}
                    <div className="truncate">
                      <h3 className="text-lg md:text-3xl font-black text-gray-800 leading-tight mb-1 md:mb-2 italic uppercase tracking-tighter truncate">
                        {studentName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#2D5A27]/10 text-[#2D5A27] text-[8px] font-black rounded-md uppercase tracking-widest whitespace-nowrap">
                          {track}
                        </span>
                        <span className="text-[8px] text-orange-500 font-black uppercase italic tracking-widest whitespace-nowrap">
                          {rankTitle}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Points Section */}
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                      <p className="text-xl md:text-4xl font-black text-[#2D5A27] italic tracking-tighter">
                        {totalPoints.toLocaleString()}
                      </p>
                      <span className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase italic">
                        xp
                      </span>
                    </div>
                    {index < 3 && (
                      <div className="flex items-center justify-end gap-1 mt-1 md:mt-2">
                        <Medal size={12} md:size={16} className={getMedalColor(index)} />
                        <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${getMedalColor(index)}`}>
                          {index === 0 ? "Oga Ogo" : index === 1 ? "Star Learner" : "Rising Hero"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            /* --- EMPTY STATE --- */
            <div className="p-20 md:p-32 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Info size={40} className="text-gray-200" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-4 uppercase italic tracking-tighter">
                Arena is Empty
              </h3>
              <p className="text-gray-400 font-bold max-w-xs mx-auto text-xs md:text-sm leading-relaxed mb-8">
                No students have earned points yet.
              </p>
              <button
                onClick={() => (window.location.href = "/courses")}
                className="bg-[#2D5A27] text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl"
              >
                Go Earn Some XP
              </button>
            </div>
          )}
        </div>

        <p className="text-center mt-10 text-gray-300 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] italic opacity-60">
          Rankings updated in real-time based on total XP
        </p>
      </div>
    </Layout>
  );
}