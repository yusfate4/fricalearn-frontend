import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import {
  ChevronLeft, Loader2, Trophy, BookOpen, Star,
  TrendingUp, TrendingDown, Target, Zap, Calendar,
  CheckCircle2, AlertCircle, Lightbulb, Award,
  BarChart3, ChevronRight,
} from "lucide-react";

function StatCard({ label, value, sub, icon: Icon, iconColor = "text-[#3F2171]", bg = "bg-[#f3effa]" }: any) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-3 sm:p-5">
      <div className={`w-8 h-8 sm:w-9 sm:h-9 ${bg} rounded-xl flex items-center justify-center mb-2 sm:mb-3`}>
        <Icon size={16} className={iconColor} />
      </div>
      <p className="text-xl sm:text-2xl font-black text-gray-800 leading-tight">{value}</p>
      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1 leading-tight">{label}</p>
      {sub && <p className="text-[9px] font-bold text-gray-300 mt-0.5">{sub}</p>}
    </div>
  );
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs text-gray-300 font-bold">—</span>;
  const color = score >= 75 ? "text-green-600 bg-green-50" : score >= 60 ? "text-blue-600 bg-blue-50" : "text-red-600 bg-red-50";
  return <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black ${color}`}>{score}%</span>;
}

// Short tab labels for mobile
const TABS = [
  { id: "overview",        label: "Overview",    short: "Overview" },
  { id: "topics",          label: "Topics",      short: "Topics"   },
  { id: "lessons",         label: "Lessons",     short: "Lessons"  },
  { id: "recommendations", label: "Tips",        short: "Tips"     },
] as const;

export default function ChildProgressView() {
  const { childId } = useParams();
  const navigate    = useNavigate();
  const [data, setData]   = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "topics" | "lessons" | "recommendations">("overview");

  useEffect(() => {
    api.get(`/parent/child/${childId}/progress`)
      .then(res => setData(res.data))
      .catch(err => console.error("Failed to load progress", err))
      .finally(() => setLoading(false));
  }, [childId]);

  if (loading) return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-[#3F2171]" size={36} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Loading progress…</p>
      </div>
    </Layout>
  );

  if (!data) return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-6">
        <AlertCircle size={40} className="text-red-400" />
        <p className="font-black text-gray-600 text-lg">Could not load progress data.</p>
        <button onClick={() => navigate(-1)} className="text-[#3F2171] font-bold text-sm underline">Go back</button>
      </div>
    </Layout>
  );

  const { child, grade, overview, this_month, this_week, weekly_breakdown,
          strong_topics, weak_topics, recent_lessons, enrolled_subjects, recommendations } = data;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-5 sm:py-10">

        {/* ── Back ─── */}
        <button onClick={() => navigate("/parent/dashboard")}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#3F2171] transition-colors mb-5">
          <div className="p-1.5 bg-gray-50 rounded-xl group-hover:bg-[#3F2171]/10"><ChevronLeft size={16} /></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back</span>
        </button>

        {/* ── Child header ─── */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-[#3F2171]/10 flex items-center justify-center shrink-0">
              <Star size={18} className="text-[#3F2171]" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Progress Report</p>
              <h1 className="text-lg sm:text-2xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight truncate">
                {child.name}
              </h1>
              <p className="text-[10px] font-bold text-gray-400">{child.level} · {child.total_xp} XP</p>
            </div>
          </div>
          {/* Grade badge */}
          <div className="rounded-2xl px-4 py-3 text-white text-center shadow-lg shrink-0"
            style={{ background: grade.color }}>
            <p className="text-2xl sm:text-3xl font-black leading-none">{grade.label}</p>
            <p className="text-[8px] font-black uppercase tracking-wider opacity-80 mt-0.5">{grade.message}</p>
          </div>
        </div>

        {/* ── Tabs ─── */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-5 gap-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2 sm:py-2.5 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${
                tab === t.id ? "bg-white text-[#3F2171] shadow" : "text-gray-400 hover:text-gray-600"
              }`}>
              {/* Short label on mobile, full on sm+ */}
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Overview ─── */}
        {tab === "overview" && (
          <div className="space-y-4 animate-in fade-in duration-300">

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <StatCard label="Lessons" value={overview.total_lessons} icon={BookOpen} />
              <StatCard label="Avg Score" value={overview.avg_score_alltime + "%"} icon={Target} iconColor="text-blue-600" bg="bg-blue-50" />
              <StatCard label="Pass Rate" value={overview.pass_rate_alltime + "%"} icon={Trophy} iconColor="text-green-600" bg="bg-green-50" />
              <StatCard label="Total XP" value={overview.total_xp} icon={Zap} iconColor="text-[#FFFF00]" bg="bg-[#2A1650]" />
            </div>

            {/* Month + Week panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#2A1650] rounded-[1.5rem] p-4 sm:p-6 text-white">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-3">This Month</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Lessons",   value: this_month.lessons },
                    { label: "Avg Score", value: this_month.avg_score ? this_month.avg_score + "%" : "—" },
                    { label: "Pass Rate", value: this_month.pass_rate ? this_month.pass_rate + "%" : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-xl sm:text-2xl font-black text-white">{value}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#FFFF00] rounded-[1.5rem] p-4 sm:p-6">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#2A1650]/50 mb-3">This Week</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Lessons",   value: this_week.lessons },
                    { label: "Avg Score", value: this_week.avg_score ? this_week.avg_score + "%" : "—" },
                    { label: "Quizzes",   value: this_week.quizzes },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-xl sm:text-2xl font-black text-[#2A1650]">{value}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#2A1650]/50 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly chart */}
            <div className="bg-white border-2 border-gray-100 rounded-[1.5rem] p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="text-[#3F2171]" />
                <h3 className="font-black text-gray-800 uppercase tracking-tight text-sm">Last 4 Weeks</h3>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {(weekly_breakdown || []).map((w: any, i: number) => {
                  const maxL = Math.max(...(weekly_breakdown || []).map((x: any) => x.lessons), 1);
                  const pct  = Math.max((w.lessons / maxL) * 100, 4);
                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className="w-full flex items-end justify-center" style={{ height: "60px" }}>
                        <div className="w-full max-w-[32px] rounded-lg transition-all"
                          style={{ height: `${pct}%`, background: w.lessons > 0 ? "#3F2171" : "#f3f4f6" }} />
                      </div>
                      <p className="text-[8px] font-black uppercase tracking-wider text-gray-400 text-center leading-tight">{w.label}</p>
                      <p className="text-[10px] font-black text-gray-600">{w.lessons}</p>
                      {w.avg_score !== null && <ScoreBadge score={w.avg_score} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enrolled subjects */}
            {enrolled_subjects?.length > 0 && (
              <div className="bg-white border-2 border-gray-100 rounded-[1.5rem] p-4 sm:p-6">
                <h3 className="font-black text-gray-800 uppercase tracking-tight text-sm mb-3">Enrolled Subjects</h3>
                <div className="space-y-3">
                  {enrolled_subjects.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-black text-gray-700 text-sm truncate">{s.name}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{s.key_stage}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-16 sm:w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#3F2171] rounded-full" style={{ width: `${s.progress_percentage || 0}%` }} />
                        </div>
                        <span className="text-[10px] font-black text-gray-500 w-7 text-right">{s.progress_percentage || 0}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Topics ─── */}
        {tab === "topics" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-green-50 border-2 border-green-100 rounded-[1.5rem] p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-green-600" />
                <h3 className="font-black text-green-700 uppercase tracking-tight text-sm">
                  Strengths ({strong_topics?.length || 0})
                </h3>
              </div>
              {strong_topics?.length > 0 ? (
                <div className="space-y-2">
                  {strong_topics.map((t: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded-xl p-3">
                      <div className="min-w-0 flex-1 mr-2">
                        <p className="font-black text-gray-700 text-sm truncate">{t.title}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase truncate">{t.subject}</p>
                      </div>
                      <ScoreBadge score={t.avg_score} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-green-600 font-bold text-sm text-center py-4">Keep going — strengths will show here!</p>
              )}
            </div>

            <div className="bg-orange-50 border-2 border-orange-100 rounded-[1.5rem] p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown size={18} className="text-orange-600" />
                <h3 className="font-black text-orange-700 uppercase tracking-tight text-sm">
                  To Improve ({weak_topics?.length || 0})
                </h3>
              </div>
              {weak_topics?.length > 0 ? (
                <div className="space-y-2">
                  {weak_topics.map((t: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded-xl p-3">
                      <div className="min-w-0 flex-1 mr-2">
                        <p className="font-black text-gray-700 text-sm truncate">{t.title}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase truncate">{t.subject}</p>
                      </div>
                      <ScoreBadge score={t.avg_score} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-orange-600 font-bold text-sm text-center py-4">No weak areas yet — great work!</p>
              )}
            </div>
          </div>
        )}

        {/* ── Lessons ─── */}
        {tab === "lessons" && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-white border-2 border-gray-100 rounded-[1.5rem] p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-[#3F2171]" />
                <h3 className="font-black text-gray-800 uppercase tracking-tight text-sm">Last 15 Lessons</h3>
              </div>
              {recent_lessons?.length > 0 ? (
                <div className="space-y-1">
                  {recent_lessons.map((l: any, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-2 py-2.5 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 bg-[#3F2171]/10 rounded-xl flex items-center justify-center shrink-0">
                          <CheckCircle2 size={12} className="text-[#3F2171]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-gray-700 text-sm truncate">{l.lesson_title}</p>
                          <p className="text-[9px] font-bold text-gray-400 truncate">
                            {l.subject} · {new Date(l.completed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                      </div>
                      <ScoreBadge score={l.quiz_score} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 font-bold text-sm text-center py-8">No lessons completed yet.</p>
              )}
            </div>
          </div>
        )}

        {/* ── Recommendations ─── */}
        {tab === "recommendations" && (
          <div className="space-y-3 animate-in fade-in duration-300">
            {recommendations?.length > 0 ? (
              recommendations.map((r: any, i: number) => {
                const icons: Record<string, any> = { habit: Calendar, focus: Target, score: BookOpen, strength: Award, volume: Zap };
                const colors: Record<string, string> = {
                  habit: "bg-blue-50 text-blue-600", focus: "bg-orange-50 text-orange-600",
                  score: "bg-purple-50 text-purple-600", strength: "bg-green-50 text-green-600",
                  volume: "bg-yellow-50 text-yellow-600",
                };
                const Icon  = icons[r.type] || Lightbulb;
                const color = colors[r.type] || "bg-[#3F2171]/10 text-[#3F2171]";
                return (
                  <div key={i} className="bg-white border-2 border-gray-100 rounded-2xl p-4 sm:p-5 flex gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-gray-800 text-sm mb-1">{r.title}</p>
                      <p className="text-gray-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: r.body }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16">
                <CheckCircle2 size={36} className="text-green-400 mx-auto mb-4" />
                <p className="font-black text-gray-600">All good — no tips right now!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
