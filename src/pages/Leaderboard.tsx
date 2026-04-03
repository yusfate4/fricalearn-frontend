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
      // 🚀 Hits GamificationController@getLeaderboard
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
      <div className="max-w-4xl mx-auto p-4 md:p-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="relative inline-block">
            <Trophy
              size={80}
              className="mx-auto text-yellow-500 mb-4 drop-shadow-lg"
            />
            <div className="absolute -top-2 -right-2 bg-[#2D5A27] text-white text-[10px] font-black px-3 py-1 rounded-full animate-bounce uppercase tracking-tighter">
              LIVE
            </div>
          </div>
          <h1 className="text-5xl font-black text-gray-800 italic uppercase tracking-tighter">
            FricaLearn Champions
          </h1>
          <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-sm">
            Top Diaspora Learners
          </p>
        </div>

        <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-4 border-white animate-in zoom-in duration-500">
          {loading ? (
            <div className="p-32 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#2D5A27] animate-spin mb-4" />
              <p className="font-black text-gray-300 italic uppercase tracking-widest text-xs">
                Syncing Global Scores...
              </p>
            </div>
          ) : players.length > 0 ? (
            players.map((profile: any, index: number) => {
              /**
               * 🚀 DATA MAPPING FIX:
               * Your Controller returns StudentProfile with 'user' relation.
               */
              const studentName = profile.user?.name || "Student";
              const totalPoints = profile.total_points || 0;
              const rankTitle = profile.rank || "Akeko";
              const track = profile.learning_language || "Yoruba";

              return (
                <div
                  key={profile.id}
                  className={`flex items-center justify-between p-6 md:p-10 border-b last:border-0 transition-all hover:bg-green-50/30 ${
                    index < 3 ? "bg-green-50/20" : ""
                  }`}
                >
                  <div className="flex items-center space-x-6 md:space-x-10">
                    <span
                      className={`text-4xl font-black w-12 text-center ${getMedalColor(index)} italic tracking-tighter`}
                    >
                      {index + 1}
                    </span>

                    <div className="relative">
                      <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] border-2 border-gray-100 flex items-center justify-center shadow-inner overflow-hidden">
                        {/* If you add avatars later, replace <User /> with <img> */}
                        <User size={32} className="text-gray-300" />
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-4 -left-4 rotate-[-15deg] drop-shadow-md">
                          <Star
                            size={28}
                            className="text-yellow-400 animate-pulse"
                            fill="currentColor"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-gray-800 leading-none mb-2 italic uppercase tracking-tighter">
                        {studentName}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-[#2D5A27]/10 text-[#2D5A27] text-[9px] font-black rounded-lg uppercase tracking-widest">
                          {track} track
                        </span>
                        <span className="text-[9px] text-orange-500 font-black uppercase italic tracking-widest">
                          {rankTitle}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <p className="text-3xl md:text-4xl font-black text-[#2D5A27] italic tracking-tighter">
                        {totalPoints.toLocaleString()}
                      </p>
                      <span className="text-[10px] font-black text-gray-300 uppercase italic">
                        xp
                      </span>
                    </div>
                    {index < 3 && (
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <Medal size={16} className={getMedalColor(index)} />
                        <p
                          className={`text-[10px] font-black uppercase tracking-[0.2em] ${getMedalColor(index)}`}
                        >
                          {index === 0
                            ? "Oga Ogo"
                            : index === 1
                              ? "Star Learner"
                              : "Rising Hero"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            /* --- EMPTY STATE --- */
            <div className="p-32 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Info size={48} className="text-gray-200" />
              </div>
              <h3 className="text-3xl font-black text-gray-800 mb-4 uppercase italic tracking-tighter">
                Arena is Empty
              </h3>
              <p className="text-gray-400 font-bold max-w-xs mx-auto text-sm leading-relaxed mb-8">
                No students have earned points yet. Be the first to claim the
                top spot!
              </p>
              <button
                onClick={() => (window.location.href = "/courses")}
                className="bg-[#2D5A27] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl"
              >
                Go Earn Some XP
              </button>
            </div>
          )}
        </div>

        <p className="text-center mt-12 text-gray-300 text-[10px] font-black uppercase tracking-[0.4em] italic opacity-60">
          Rankings are updated in real-time based on total XP
        </p>
      </div>
    </Layout>
  );
}
