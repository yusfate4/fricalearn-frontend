import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { Trophy, Star, Zap, BookOpen, Loader2, RefreshCw, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RANK_CONFIG: Record<string, { bg: string; text: string; bar: string }> = {
  Master:   { bg: "bg-[#FFFF00]",      text: "text-[#2A1650]", bar: "bg-[#2A1650]" },
  Expert:   { bg: "bg-[#3F2171]",      text: "text-white",     bar: "bg-[#FFFF00]" },
  Scholar:  { bg: "bg-[#2A1650]",      text: "text-white",     bar: "bg-[#FFFF00]" },
  Explorer: { bg: "bg-[#3F2171]/10",   text: "text-[#3F2171]", bar: "bg-[#3F2171]" },
  Beginner: { bg: "bg-gray-100",       text: "text-gray-500",  bar: "bg-gray-300"  },
};

const MEDAL_CONFIG = [
  { emoji: "🥇", label: "Champion",     glow: "shadow-yellow-200" },
  { emoji: "🥈", label: "Star Learner", glow: "shadow-gray-200"   },
  { emoji: "🥉", label: "Rising Hero",  glow: "shadow-orange-200"  },
];

function getRankConfig(level: string) {
  return RANK_CONFIG[level] || RANK_CONFIG.Beginner;
}

export default function Leaderboard() {
  const [players, setPlayers]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Find the current student's profile id from active_student_id or auth
  const activeStudentId = localStorage.getItem("active_student_id");

  const fetchLeaderboard = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await api.get("/gamification/leaderboard");
      setPlayers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Leaderboard sync failed:", err);
      setPlayers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchLeaderboard(); }, []);

  // Find the current student's entry
  const myEntry = players.find(p =>
    String(p.user_id) === String(activeStudentId) ||
    String(p.user?.id) === String(user?.id)
  );
  const myRank = myEntry ? players.indexOf(myEntry) + 1 : null;

  // Top 3 podium
  const podium = players.slice(0, 3);
  const rest   = players.slice(3);
  const maxPoints = players[0]?.total_points || 1;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Global Rankings</p>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">
              Leaderboard
            </h1>
            <p className="text-gray-400 font-bold text-xs mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
              Live · updated in real-time
            </p>
          </div>
          <button onClick={() => fetchLeaderboard(true)}
            className={`p-3 rounded-2xl bg-gray-100 hover:bg-[#3F2171]/10 transition-all ${refreshing ? "opacity-50" : ""}`}>
            <RefreshCw size={18} className={`text-[#3F2171] ${refreshing ? "animate-spin" : ""}`}/>
          </button>
        </div>

        {/* ── My rank banner (if not in top 10) ─────────────────── */}
        {myEntry && myRank && myRank > 3 && (
          <div className="bg-[#2A1650] rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FFFF00] rounded-xl flex items-center justify-center">
                <Star size={16} fill="#2A1650" color="#2A1650"/>
              </div>
              <div>
                <p className="text-white font-black text-sm">Your ranking</p>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                  #{myRank} · {myEntry.total_points?.toLocaleString()} XP
                </p>
              </div>
            </div>
            <div className="text-3xl font-black text-[#FFFF00] italic">#{myRank}</div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-[#3F2171]" size={40}/>
            <p className="font-black text-gray-300 uppercase tracking-widest text-[10px]">Syncing scores…</p>
          </div>
        ) : players.length === 0 ? (
          /* ── Empty state ────────────────────────────────────── */
          <div className="bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 py-24 px-8 text-center">
            <Trophy size={48} className="text-gray-200 mx-auto mb-6"/>
            <h3 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter mb-3">
              Arena is Empty
            </h3>
            <p className="text-gray-400 font-bold text-sm mb-8">
              No XP earned yet — be the first champion!
            </p>
            <button onClick={() => navigate("/courses")}
              className="bg-[#3F2171] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 mx-auto hover:bg-black transition-all">
              Go Earn XP <ArrowRight size={16}/>
            </button>
          </div>
        ) : (
          <>
            {/* ── Podium: top 3 ──────────────────────────────── */}
            {podium.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                {/* Rearrange to: 2nd, 1st, 3rd */}
                {[1, 0, 2].map(idx => {
                  const p = podium[idx];
                  if (!p) return <div key={idx}/>;
                  const medal = MEDAL_CONFIG[idx];
                  const cfg   = getRankConfig(p.current_level);
                  const isFirst = idx === 0;
                  const isMe  = String(p.user_id) === String(activeStudentId) ||
                                String(p.user?.id) === String(user?.id);

                  return (
                    <div key={p.id} className={`flex flex-col items-center ${isFirst ? "order-2" : idx === 1 ? "order-1 pt-6" : "order-3 pt-10"}`}>
                      {/* Crown for 1st */}
                      {isFirst && (
                        <div className="text-2xl mb-1 animate-bounce">👑</div>
                      )}

                      {/* Avatar */}
                      <div className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] ${cfg.bg} flex items-center justify-center mb-3 shadow-xl ${isMe ? "ring-4 ring-[#FFFF00]" : ""} ${medal.glow}`}>
                        <span className="text-xl sm:text-3xl font-black">{medal.emoji}</span>
                        {isMe && (
                          <div className="absolute -top-2 -right-2 bg-[#FFFF00] text-[#2A1650] text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide">You</div>
                        )}
                      </div>

                      {/* Name */}
                      <p className={`font-black text-[10px] sm:text-xs uppercase italic tracking-tighter text-center truncate w-full px-1 ${isFirst ? "text-gray-800" : "text-gray-500"}`}>
                        {p.user?.name?.split(" ")[0] || "Student"}
                      </p>

                      {/* XP */}
                      <div className={`mt-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] sm:text-xs ${isFirst ? "bg-[#FFFF00] text-[#2A1650]" : "bg-gray-100 text-gray-500"}`}>
                        {(p.total_points || 0).toLocaleString()} XP
                      </div>

                      {/* Rank label */}
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-300 mt-1">{p.current_level || "Beginner"}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Rest of the leaderboard ────────────────────── */}
            {rest.length > 0 && (
              <div className="bg-white border-2 border-gray-100 rounded-[2rem] overflow-hidden">
                {rest.map((p: any, i: number) => {
                  const rank   = i + 4;
                  const cfg    = getRankConfig(p.current_level);
                  const pct    = Math.round((p.total_points / maxPoints) * 100);
                  const isMe   = String(p.user_id) === String(activeStudentId) ||
                                 String(p.user?.id) === String(user?.id);

                  return (
                    <div key={p.id}
                      className={`flex items-center gap-4 px-5 sm:px-7 py-4 border-b last:border-0 transition-all ${isMe ? "bg-[#3F2171]/5 border-l-4 border-l-[#3F2171]" : "hover:bg-gray-50"}`}>

                      {/* Rank */}
                      <span className="w-7 text-center font-black text-sm text-gray-300 flex-shrink-0">
                        {rank}
                      </span>

                      {/* Avatar initial */}
                      <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                        <span className={`font-black text-sm ${cfg.text}`}>
                          {(p.user?.name || "?")[0].toUpperCase()}
                        </span>
                      </div>

                      {/* Name + level + bar */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-sm text-gray-700 uppercase italic tracking-tight truncate">
                            {p.user?.name || "Student"}
                            {isMe && <span className="ml-1 text-[#3F2171] text-[9px]">(you)</span>}
                          </p>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.text}`}>
                            {p.current_level || "Beginner"}
                          </span>
                        </div>
                        {/* XP bar */}
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${cfg.bar} rounded-full transition-all duration-700`}
                            style={{ width: `${pct}%` }}/>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-base text-gray-700 italic">
                          {(p.total_points || 0).toLocaleString()}
                        </p>
                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">XP</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── Your XP CTA ────────────────────────────────────── */}
        {!loading && players.length > 0 && !myEntry && (
          <div className="mt-6 bg-[#3F2171]/5 border-2 border-[#3F2171]/10 rounded-2xl px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-[#3F2171]"/>
              <div>
                <p className="font-black text-[#3F2171] text-sm">You're not on the board yet</p>
                <p className="text-gray-400 text-[10px] font-bold">Complete lessons to earn XP and appear here</p>
              </div>
            </div>
            <button onClick={() => navigate("/courses")}
              className="bg-[#3F2171] text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all flex-shrink-0">
              <BookOpen size={14}/> Learn
            </button>
          </div>
        )}

        <p className="text-center mt-8 text-gray-300 text-[9px] font-black uppercase tracking-[0.4em]">
          Top 10 learners · XP from quizzes and lessons
        </p>
      </div>
    </Layout>
  );
}
