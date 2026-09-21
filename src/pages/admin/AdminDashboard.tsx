import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { AdminShell } from "../../components/admin/AdminShell";
import {
  Users, UserCheck, CreditCard, AlertCircle, Clock,
  Crown, Zap, BookOpen, MessageSquare, TrendingUp,
  ChevronRight, CheckCircle2, XCircle, Loader2,
} from "lucide-react";

function StatCard({ label, value, icon: Icon, color, sub, link }: any) {
  const card = (
    <div className={`bg-white rounded-2xl border-2 border-gray-100 p-5 hover:shadow-md transition-all ${link ? "cursor-pointer" : ""}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white"/>
        </div>
        {link && <ChevronRight size={16} className="text-gray-300"/>}
      </div>
      <p className="text-2xl font-black text-gray-800">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{label}</p>
      {sub && <p className="text-[10px] font-bold text-gray-300 mt-0.5">{sub}</p>}
    </div>
  );
  return link ? <Link to={link}>{card}</Link> : card;
}

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/overview").then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminShell title="Dashboard">
      <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#3F2171]" size={36}/></div>
    </AdminShell>
  );

  const s = data?.stats || {};

  return (
    <AdminShell title="Dashboard">
      <div className="space-y-6">

        {/* Alert: pending payments */}
        {s.pending_payments > 0 && (
          <Link to="/admin/payments"
            className="flex items-center gap-3 bg-orange-50 border-2 border-orange-200 rounded-2xl px-5 py-4 hover:bg-orange-100 transition-all">
            <AlertCircle size={20} className="text-orange-500 shrink-0"/>
            <p className="font-black text-orange-700 text-sm">
              {s.pending_payments} payment{s.pending_payments !== 1 ? "s" : ""} waiting for approval
            </p>
            <ChevronRight size={16} className="text-orange-400 ml-auto"/>
          </Link>
        )}

        {s.unread_chats > 0 && (
          <Link to="/admin/chats"
            className="flex items-center gap-3 bg-purple-50 border-2 border-purple-200 rounded-2xl px-5 py-4 hover:bg-purple-100 transition-all">
            <MessageSquare size={20} className="text-[#3F2171] shrink-0"/>
            <p className="font-black text-[#3F2171] text-sm">
              {s.unread_chats} unread support message{s.unread_chats !== 1 ? "s" : ""}
            </p>
            <ChevronRight size={16} className="text-[#3F2171] ml-auto"/>
          </Link>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total Students"   value={s.total_students}    icon={Users}      color="bg-[#3F2171]" link="/admin/users"/>
          <StatCard label="Parents"          value={s.total_parents}     icon={UserCheck}  color="bg-blue-500"  link="/admin/parents"/>
          <StatCard label="Premium"          value={s.premium_students}  icon={Crown}      color="bg-[#FFFF00] !text-[#2A1650]" />
          <StatCard label="Pending Payments" value={s.pending_payments}  icon={CreditCard} color="bg-orange-500" link="/admin/payments"/>
          <StatCard label="Trials Expiring"  value={s.trials_expiring}   icon={Clock}      color="bg-red-400"   sub="in 7 days" link="/admin/payments"/>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Lessons Completed" value={(s.lessons_completed||0).toLocaleString()} icon={BookOpen}     color="bg-green-500"/>
          <StatCard label="Avg Quiz Score"    value={`${s.avg_quiz_score || 0}%`}               icon={TrendingUp}   color="bg-indigo-500"/>
          <StatCard label="Total XP Awarded"  value={(s.total_xp_awarded||0).toLocaleString()}  icon={Zap}          color="bg-[#2A1650]"/>
        </div>

        {/* Two columns: recent payments + expiring trials */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Recent payments */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">Recent Payments</h3>
              <Link to="/admin/payments" className="text-[10px] font-black text-[#3F2171] uppercase tracking-widest hover:underline">View all</Link>
            </div>
            {(data?.recent_payments || []).length === 0 ? (
              <p className="text-gray-400 text-center py-8 text-sm font-bold">No recent payments</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {(data?.recent_payments || []).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="font-black text-gray-700 text-sm">{p.child_name}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{p.parent?.name} · {new Date(p.created_at).toLocaleDateString("en-GB", {day:"numeric",month:"short"})}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-700">{p.currency === "GBP" ? "£" : "₦"}{Number(p.amount).toLocaleString()}</span>
                      {p.status === "pending"
                        ? <span className="bg-orange-50 text-orange-500 text-[9px] font-black uppercase px-2 py-1 rounded-full">Pending</span>
                        : p.status === "approved"
                        ? <CheckCircle2 size={14} className="text-green-500"/>
                        : <XCircle size={14} className="text-red-400"/>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trials expiring soon */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">Trials Expiring Soon</h3>
              <Link to="/admin/payments" className="text-[10px] font-black text-[#3F2171] uppercase tracking-widest hover:underline">View all</Link>
            </div>
            {(data?.expiring_trials || []).length === 0 ? (
              <p className="text-gray-400 text-center py-8 text-sm font-bold">No trials expiring this week</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {(data?.expiring_trials || []).map((s: any) => {
                  const daysLeft = Math.ceil((new Date(s.trial_ends_at).getTime() - Date.now()) / 86400000);
                  return (
                    <div key={s.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="font-black text-gray-700 text-sm">{s.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{s.email}</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${daysLeft <= 2 ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"}`}>
                        {daysLeft}d left
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
          <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Add Quiz",        path: "/admin/questions",      icon: MessageSquare,    color: "bg-[#3F2171]/10 text-[#3F2171]" },
              { label: "View Payments",   path: "/admin/payments",       icon: CreditCard,    color: "bg-orange-50 text-orange-600" },
              { label: "Support Chats",   path: "/admin/chats",          icon: MessageSquare, color: "bg-blue-50 text-blue-600" },
              { label: "Analytics",       path: "/admin/analytics",      icon: TrendingUp,    color: "bg-green-50 text-green-600" },
            ].map(({ label, path, icon: Icon, color }) => (
              <Link key={path} to={path}
                className={`flex items-center gap-3 p-4 rounded-xl ${color} hover:opacity-80 transition-all font-bold text-sm`}>
                <Icon size={16} className="shrink-0"/> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
