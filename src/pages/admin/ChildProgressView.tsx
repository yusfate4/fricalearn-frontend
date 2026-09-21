import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import {
  ChevronLeft, Loader2, Trophy, BookOpen, Star,
  TrendingUp, TrendingDown, Target, Zap, Calendar,
  CircleCheckBig, CircleAlert, Lightbulb, Award,
  BarChart3, ChevronRight,
} from "lucide-react";

// ── Small helpers ─────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, iconColor = "text-[#3F2171]", bg = "bg-[#f3effa]" }: any) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 sm:p-5">
      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon size={18} className={iconColor} />
      </div>
      <p className="text-2xl sm:text-3xl font-black text-gray-800">{value}</p>
      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">{label}</p>
      {sub && <p className="text-[10px] font-bold text-gray-300 mt-0.5">{sub}</p>}
    </div>
  );
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs text-gray-300 font-bold">—</span>;
  const color = score >= 75 ? "text-green-600 bg-green-50" : score >= 60 ? "text-blue-600 bg-blue-50" : "text-red-600 bg-red-50";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black ${color}`}>
      {score}%
    </span>
  );
}

export default function ChildProgressView() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
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
        <CircleAlert size={40} className="text-red-400" />
        <p className="font-black text-gray-600 text-lg">Could not load progress data.</p>
        <button onClick={() => navigate(-1)} className="text-[#3F2171] font-bold text-sm underline">Go back</button>
      </div>
    </Layout>
  );

  const { child, grade, overview, this_month, this_week, weekly_breakdown,
          strong_topics, weak_topics, recent_lessons, enrolled_subjects, recommendations } = data;

  const tabs = [
    { id: "overview",         label: "Overview" },
    { id: "topics",           label: "Topics" },
    { id: "lessons",          label: "Recent Lessons" },
    { id: "recommendations",  label: "Recommendations" },
  ] as const;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ── Back + Header ─────────────────────────────────── */}
        <button onClick={() => navigate("/parent/dashboard")}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#3F2171] transition-colors mb-7">
          <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#3F2171]/10"><ChevronLeft size={18} /></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Dashboard</span>
        </button>

        {/* Child header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#3F2171]/10 flex items-center justify-center shrink-0">
              <Star size={24} className="text-[#3F2171]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Progress Report</p>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight">
                {child.name}
              </h1>
              <p className="text-xs font-bold text-gray-400 mt-0.5">
                {child.level} · {child.total_xp} XP total
              </p>
            </div>
          </div>

          {/* Grade badge */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="rounded-2xl px-6 py-4 text-white text-center shadow-lg"
              style={{ background: grade.color }}>
              <p className="text-4xl font-black leading-none">{grade.label}</p>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mt-1">{grade.message}</p>
            </div>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────── */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-7 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${
                tab === t.id ? "bg-white text-[#3F2171] shadow" : "text-gray-400 hover:text-gray-600"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Overview ────────────────────────────────── */}
        {tab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-300">

            {/* Period stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard label="Lessons (all time)"  value={overview.total_lessons}      icon={BookOpen}   />
              <StatCard label="Avg score"            value={overview.avg_score_alltime + "%"} icon={Target} iconColor="text-blue-600" bg="bg-blue-50" />
              <StatCard label="Pass rate"            value={overview.pass_rate_alltime + "%"} icon={Trophy} iconColor="text-green-600" bg="bg-green-50" />
              <StatCard label="Total XP"             value={overview.total_xp}          icon={Zap}        iconColor="text-[#FFFF00]" bg="bg-[#2A1650]" />
            </div>

            {/* This month vs this week */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#2A1650] rounded-[2rem] p-6 text-white">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-4">This Month</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Lessons", value: this_month.lessons },
                    { label: "Avg Score", value: this_month.avg_score ? this_month.avg_score + "%" : "—" },
                    { label: "Pass Rate", value: this_month.pass_rate ? this_month.pass_rate + "%" : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-2xl font-black text-white">{value}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#FFFF00] rounded-[2rem] p-6">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#2A1650]/50 mb-4">This Week</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Lessons", value: this_week.lessons },
                    { label: "Avg Score", value: this_week.avg_score ? this_week.avg_score + "%" : "—" },
                    { label: "Quizzes", value: this_week.quizzes },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-2xl font-black text-[#2A1650]">{value}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#2A1650]/50 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly activity chart */}
            <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 size={20} className="text-[#3F2171]" />
                <h3 className="font-black text-gray-800 uppercase tracking-tight text-sm">Last 4 Weeks</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {weekly_breakdown.map((w: any, i: number) => {
                  const maxLessons = Math.max(...weekly_breakdown.map((x: any) => x.lessons), 1);
                  const heightPct  = Math.max((w.lessons / maxLessons) * 100, 4);
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-full flex items-end justify-center" style={{ height: "80px" }}>
                        <div
                          className="w-full max-w-[40px] rounded-xl transition-all"
                          style={{
                            height: `${heightPct}%`,
                            background: w.lessons > 0 ? "#3F2171" : "#f3f4f6",
                          }}
                        />
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{w.label}</p>
                      <p className="text-xs font-black text-gray-600">{w.lessons} lessons</p>
                      {w.avg_score !== null && (
                        <ScoreBadge score={w.avg_score} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enrolled subjects */}
            {enrolled_subjects?.length > 0 && (
              <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-6">
                <h3 className="font-black text-gray-800 uppercase tracking-tight text-sm mb-4">Enrolled Subjects</h3>
                <div className="space-y-3">
                  {enrolled_subjects.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-black text-gray-700 text-sm">{s.name}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{s.key_stage}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#3F2171] rounded-full" style={{ width: `${s.progress_percentage || 0}%` }} />
                        </div>
                        <span className="text-xs font-black text-gray-500 w-8 text-right">{s.progress_percentage || 0}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Topics ──────────────────────────────────── */}
        {tab === "topics" && (
          <div className="space-y-5 animate-in fade-in duration-300">

            {/* Strengths */}
            <div className="bg-green-50 border-2 border-green-100 rounded-[2rem] p-6">
              <div className="flex items-center gap-3 mb-5">
                <TrendingUp size={20} className="text-green-600" />
                <h3 className="font-black text-green-700 uppercase tracking-tight text-sm">
                  Areas of Strength ({strong_topics?.length || 0} topics)
                </h3>
              </div>
              {strong_topics?.length > 0 ? (
                <div className="space-y-3">
                  {strong_topics.map((t: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded-xl p-3 sm:p-4">
                      <div className="min-w-0 flex-1 mr-3">
                        <p className="font-black text-gray-700 text-sm truncate">{t.title}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t.subject} · {t.attempts} quiz{t.attempts !== 1 ? "zes" : ""}</p>
                      </div>
                      <ScoreBadge score={t.avg_score} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-green-600 font-bold text-sm text-center py-4">No strong topics yet — keep going! 💪</p>
              )}
            </div>

            {/* Weak areas */}
            <div className="bg-orange-50 border-2 border-orange-100 rounded-[2rem] p-6">
              <div className="flex items-center gap-3 mb-5">
                <TrendingDown size={20} className="text-orange-600" />
                <h3 className="font-black text-orange-700 uppercase tracking-tight text-sm">
                  Areas to Improve ({weak_topics?.length || 0} topics)
                </h3>
              </div>
              {weak_topics?.length > 0 ? (
                <div className="space-y-3">
                  {weak_topics.map((t: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded-xl p-3 sm:p-4">
                      <div className="min-w-0 flex-1 mr-3">
                        <p className="font-black text-gray-700 text-sm truncate">{t.title}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t.subject} · {t.fails} fail{t.fails !== 1 ? "s" : ""} of {t.attempts}</p>
                      </div>
                      <ScoreBadge score={t.avg_score} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-orange-600 font-bold text-sm text-center py-4">No weak areas identified yet — great work! 🌟</p>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Recent Lessons ───────────────────────────── */}
        {tab === "lessons" && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-6">
              <div className="flex items-center gap-3 mb-5">
                <BookOpen size={20} className="text-[#3F2171]" />
                <h3 className="font-black text-gray-800 uppercase tracking-tight text-sm">Last 15 Completed Lessons</h3>
              </div>
              {recent_lessons?.length > 0 ? (
                <div className="space-y-3">
                  {recent_lessons.map((l: any, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-3 py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 bg-[#3F2171]/10 rounded-xl flex items-center justify-center shrink-0">
                          <CircleCheckBig size={14} className="text-[#3F2171]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-gray-700 text-sm truncate">{l.lesson_title}</p>
                          <p className="text-[9px] font-bold text-gray-400 truncate">
                            {l.subject} · {l.topic_title} · {new Date(l.completed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
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

        {/* ── Tab: Recommendations ─────────────────────────── */}
        {tab === "recommendations" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {recommendations?.length > 0 ? (
              recommendations.map((r: any, i: number) => {
                const icons: Record<string, any> = { habit: Calendar, focus: Target, score: BookOpen, strength: Award, volume: Zap };
                const colors: Record<string, string> = { habit: "bg-blue-50 text-blue-600", focus: "bg-orange-50 text-orange-600", score: "bg-purple-50 text-purple-600", strength: "bg-green-50 text-green-600", volume: "bg-yellow-50 text-yellow-600" };
                const Icon = icons[r.type] || Lightbulb;
                const color = colors[r.type] || "bg-[#3F2171]/10 text-[#3F2171]";
                return (
                  <div key={i} className="bg-white border-2 border-gray-100 rounded-2xl p-5 flex gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-sm mb-1">{r.title}</p>
                      <p className="text-gray-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: r.body }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16">
                <CircleCheckBig size={40} className="text-green-400 mx-auto mb-4" />
                <p className="font-black text-gray-600 text-lg">All good! No recommendations right now.</p>
                <p className="text-gray-400 text-sm mt-2">Keep up the great work!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
