import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { Medal, Trophy, User, Info } from "lucide-react";

export default function Leaderboard() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/gamification/leaderboard")
      .then((res) => {
        // Ensures we are always dealing with an array
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
    if (index === 0) return "text-yellow-500"; // Gold
    if (index === 1) return "text-gray-400"; // Silver
    if (index === 2) return "text-orange-500"; // Bronze
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
            <div className="absolute -top-2 -right-2 bg-frica-green text-white text-xs font-black px-2 py-1 rounded-full animate-bounce">
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
            <div className="p-20 text-center font-bold text-gray-400">
              Gathering scores...
            </div>
          ) : players.length > 0 ? (
            players.map((player: any, index: number) => {
              // Safety: Extract profile data once here
              const points = player.student_profile?.total_points ?? 0;
              const language = player.student_profile?.language ?? "New";

              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-6 md:p-8 border-b last:border-0 transition-all hover:bg-gray-50 ${
                    index < 3 ? "bg-green-50/50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-6">
                    <span
                      className={`text-3xl font-black w-10 text-center ${getMedalColor(index)}`}
                    >
                      {index + 1}
                    </span>

                    <div className="relative">
                      <div className="p-4 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <User size={28} className="text-gray-400" />
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-3 -left-3 rotate-[-20deg]">
                          <Trophy size={24} className="text-yellow-500" />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-2xl font-black text-gray-800 leading-none mb-1">
                        {player.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-frica-green/10 text-frica-green text-[10px] font-black rounded uppercase">
                          {language}
                        </span>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                          Learner
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <p className="text-3xl font-black text-[#2D5A27]">
                        {points.toLocaleString()}
                      </p>
                      <span className="text-[10px] font-black text-gray-300 uppercase">
                        pts
                      </span>
                    </div>
                    {index < 3 && (
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <Medal size={16} className={getMedalColor(index)} />
                        <span
                          className={`text-[10px] font-black uppercase ${getMedalColor(index)}`}
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
                <Info size={40} className="text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">
                No Champions Yet!
              </h3>
              <p className="text-gray-400 font-bold max-w-xs mx-auto">
                Be the first to complete a lesson and claim the #1 spot.
              </p>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
          Scores are updated instantly after every quiz
        </p>
      </div>
    </Layout>
  );
}
