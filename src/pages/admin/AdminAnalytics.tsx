import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { AdminShell } from "../../components/admin/AdminShell";
import {
  TrendingUp, Users, BookOpen, Trophy, Star, Zap,
  BarChart3, PieChart, Loader2, Crown,
} from "lucide-react";

function MiniBar({ value, max, color = "bg-[#3F2171]" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }}/>
      </div>
      <span className="text-[10px] font-black text-gray-500 w-8 text-right">{pct}%</span>
    </div>
  );
}

function Stat({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon size={18} className="text-white"/>
      </div>
      <p className="text-2xl font-black text-gray-800">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{label}</p>
    </div>
  );
}

export default function AdminAnalytics() {
  const [data, setData]     = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/full-analytics")
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminShell title="Analytics">
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#3F2171]" size={36}/>
      </div>
    </AdminShell>
  );

  const d     = data || {};
  const subs  = d.subscriptions || {};
  const dist  = d.score_distribution || {};
  const total = Math.max(dist.total || 1, 1);

  // Monthly growth chart data
  const monthly = d.new_students_monthly || [];
  const maxMonth = Math.max(...monthly.map((m: any) => m.count), 1);

  // Weekly completions
  const weekly    = d.weekly_completions || [];
  const maxWeekly = Math.max(...weekly.map((w: any) => w.count), 1);

  return (
    <AdminShell title="Analytics">
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">Platform Analytics</h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Real-time data from the database</p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Total Students"      value={(d.total_students || 0).toLocaleString()} icon={Users}    color="bg-[#3F2171]"/>
          <Stat label="Total Parents"       value={(d.total_parents  || 0).toLocaleString()} icon={Users}    color="bg-blue-500"/>
          <Stat label="Active (30 days)"    value={(d.active_students_30d || 0).toLocaleString()} icon={Zap}  color="bg-green-500"/>
          <Stat label="Total XP Awarded"    value={(d.total_xp || 0).toLocaleString()}       icon={Star}    color="bg-[#2A1650]"/>
        </div>

        {/* 2-col: subscription breakdown + score distribution */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Subscription breakdown */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
            <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight mb-5 flex items-center gap-2">
              <PieChart size={16} className="text-[#3F2171]"/> Subscription Breakdown
            </h3>
            <div className="space-y-4">
              {[
                { label: "Premium",  value: subs.premium  || 0, color: "bg-[#FFFF00]", textColor: "text-[#2A1650]" },
                { label: "On Trial", value: subs.on_trial || 0, color: "bg-green-500", textColor: "text-white" },
                { label: "Expired",  value: subs.expired  || 0, color: "bg-orange-400", textColor: "text-white" },
                { label: "No Trial", value: subs.no_trial || 0, color: "bg-gray-300",  textColor: "text-white" },
              ].map(({ label, value, color, textColor }) => {
                const pct = d.total_students > 0 ? Math.round((value / d.total_students) * 100) : 0;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                      <span className={`font-black text-[10px] ${textColor}`}>{pct}%</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-black text-gray-700">{label}</span>
                        <span className="text-sm font-black text-gray-500">{value.toLocaleString()}</span>
                      </div>
                      <MiniBar value={value} max={d.total_students || 1}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quiz score distribution */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
            <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight mb-5 flex items-center gap-2">
              <BarChart3 size={16} className="text-[#3F2171]"/> Quiz Score Distribution
            </h3>
            {dist.total === 0 || !dist.total ? (
              <div className="text-center py-8">
                <p className="text-gray-400 font-bold text-sm">No quiz data yet</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5 bg-[#3F2171]/5 rounded-xl p-3">
                  <div className="text-3xl font-black text-[#3F2171]">{dist.avg_score || 0}%</div>
                  <div>
                    <p className="font-black text-gray-700 text-sm">Platform Average</p>
                    <p className="text-[10px] text-gray-400 font-bold">{(dist.total || 0).toLocaleString()} total attempts</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Excellent (80-100%)", val: dist.excellent || 0, color: "bg-green-500" },
                    { label: "Good (60-79%)",       val: dist.good      || 0, color: "bg-blue-500" },
                    { label: "Fair (40-59%)",       val: dist.fair      || 0, color: "bg-orange-400" },
                    { label: "Poor (<40%)",          val: dist.poor     || 0, color: "bg-red-400" },
                  ].map(({ label, val, color }) => (
                    <div key={label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[11px] font-black text-gray-600">{label}</span>
                        <span className="text-[11px] font-bold text-gray-500">{val.toLocaleString()}</span>
                      </div>
                      <MiniBar value={val} max={total} color={color}/>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Monthly new students chart */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
          <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight mb-5 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#3F2171]"/> New Students — Last 6 Months
          </h3>
          {monthly.length === 0 ? (
            <p className="text-gray-400 font-bold text-sm text-center py-8">No data yet</p>
          ) : (
            <div className="flex items-end gap-3 h-36">
              {monthly.map((m: any) => {
                const pct = Math.max((m.count / maxMonth) * 100, 4);
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black text-gray-600">{m.count}</span>
                    <div className="w-full bg-[#3F2171] rounded-t-xl transition-all"
                      style={{ height: `${pct}%`, minHeight: "8px" }}/>
                    <span className="text-[9px] font-bold text-gray-400 text-center leading-tight">
                      {new Date(m.month + "-01").toLocaleDateString("en-GB",{month:"short"})}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weekly lesson completions + top students side by side */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Weekly completions */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
            <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight mb-5 flex items-center gap-2">
              <BookOpen size={16} className="text-[#3F2171]"/> Lesson Completions — Last 8 Weeks
            </h3>
            {weekly.length === 0 ? (
              <p className="text-gray-400 font-bold text-sm text-center py-8">No completions yet</p>
            ) : (
              <div className="space-y-2">
                {weekly.map((w: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-gray-400 w-12 shrink-0">Wk {i+1}</span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#3F2171] to-[#FFFF00] rounded-full transition-all"
                        style={{ width: `${Math.max((w.count / maxWeekly) * 100, 2)}%` }}/>
                    </div>
                    <span className="text-[10px] font-black text-gray-600 w-8 text-right">{w.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top students */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
            <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight mb-5 flex items-center gap-2">
              <Trophy size={16} className="text-[#3F2171]"/> Top Students by XP
            </h3>
            {(d.top_students || []).length === 0 ? (
              <p className="text-gray-400 font-bold text-sm text-center py-8">No students yet</p>
            ) : (
              <div className="space-y-3">
                {(d.top_students || []).map((s: any, i: number) => (
                  <div key={s.user_id} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      i === 0 ? "bg-[#FFFF00] text-[#2A1650]" : i === 1 ? "bg-gray-200 text-gray-600" : "bg-gray-100 text-gray-500"
                    }`}>{i+1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-700 text-sm truncate">{s.user?.name || "Student"}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{s.current_level}</p>
                    </div>
                    <span className="font-black text-[#3F2171] text-sm">{(s.total_points || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Revenue this month */}
        <div className="bg-[#2A1650] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Revenue This Month</p>
            <p className="text-4xl font-black text-[#FFFF00]">
              ₦{Number(d.revenue_this_month || 0).toLocaleString()}
            </p>
            <p className="text-white/40 text-[10px] font-bold mt-1">From approved payments only</p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Platform Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
              <span className="text-white font-black text-sm">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
