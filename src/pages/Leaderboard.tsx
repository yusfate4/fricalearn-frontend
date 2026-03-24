import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { Medal, Trophy, User, Info, Star } from "lucide-react";

export default function Leaderboard() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 🚀 Hits the route we fixed in api.php
    api
      .get("/gamification/leaderboard")
      .then((res) => {
        const leaderboardData = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setPlayers(leaderboardData);
      })
      .catch((err) => {
        console.error("Leaderboard error:", err);
        setPlayers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getMedalColor = (index: number) => {
    if (index === 0) return "text-yellow-500";
    if (index === 1) return "text-gray-400";
    if (index === 2) return "text-orange-500";
    return "text-green-600/20";
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
            Top Diaspora Learners this Week
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white animate-in zoom-in duration-500">
          {loading ? (
            <div className="p-20 text-center font-black text-gray-300 italic uppercase animate-pulse">
              Gathering scores...
            </div>
          ) : players.length > 0 ? (
            players.map((entry: any, index: number) => {
              /**
               * 🚀 THE FIX: Data Mapping
               * The API returns LeaderboardEntry objects.
               * User info is in entry.student, Profile info is in entry.student.student_profile
               */
              const user = entry.student;
              const profile = user?.student_profile;
              const weeklyPoints = entry.points ?? 0; // Current week points
              const rank = profile?.rank ?? "Omode"; // Cultural title
              const language = profile?.learning_language ?? "Yoruba";

              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-6 md:p-8 border-b last:border-0 transition-all hover:bg-green-50/20 ${
                    index < 3 ? "bg-green-50/40" : ""
                  }`}
                >
                  <div className="flex items-center space-x-6">
                    <span
                      className={`text-3xl font-black w-10 text-center ${getMedalColor(index)} italic`}
                    >
                      {index + 1}
                    </span>

                    <div className="relative">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border-2 border-gray-50 flex items-center justify-center">
                        <User size={28} className="text-gray-300" />
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-3 -left-3 rotate-[-20deg] animate-bounce">
                          <Star
                            size={24}
                            className="text-yellow-400"
                            fill="currentColor"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-2xl font-black text-gray-800 leading-none mb-2 italic uppercase tracking-tighter">
                        {user?.name || "Anonymous Learner"}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#2D5A27]/10 text-[#2D5A27] text-[10px] font-black rounded uppercase tracking-tighter">
                          {language}
                        </span>
                        <span className="text-[10px] text-orange-500 font-black uppercase italic">
                          {rank}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <p className="text-3xl font-black text-[#2D5A27] italic tracking-tighter">
                        {weeklyPoints.toLocaleString()}
                      </p>
                      <span className="text-[10px] font-black text-gray-300 uppercase italic">
                        pts
                      </span>
                    </div>
                    {index < 3 && (
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <Medal size={16} className={getMedalColor(index)} />
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest ${getMedalColor(index)}`}
                        >
                          {index === 0
                            ? "Gold Legend"
                            : index === 1
                              ? "Silver Star"
                              : "Bronze Brave"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            /* --- EMPTY STATE --- */
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Info size={40} className="text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2 uppercase italic tracking-tighter">
                No Champions Yet!
              </h3>
              <p className="text-gray-400 font-bold max-w-xs mx-auto text-sm leading-relaxed">
                The week has just started! Be the first to complete a lesson and
                claim the #1 spot.
              </p>
            </div>
          )}
        </div>

        <p className="text-center mt-10 text-gray-300 text-[10px] font-black uppercase tracking-[0.3em] italic">
          Weekly scores reset every Monday at 12:00 AM
        </p>
      </div>
    </Layout>
  );
}
