import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import {
  PlusCircle, GraduationCap, Clock, ArrowRight,
  Loader2, User, Headphones, BookOpen, Trophy,
  ChevronRight, Bell, ShieldCheck, AlertCircle, CalendarClock
} from "lucide-react";
import EnrollmentModal from "../../components/Parent/EnrollmentModal";
import PaywallModal from "../../components/PaywallModal";

function CourseLabel({ courses }: { courses: any }) {
  try {
    const list = typeof courses === "string" ? JSON.parse(courses) : (courses || []);
    return list.map((id: string) =>
      id === "maths"   ? "Mathematics" :
      id === "english" ? "English" :
      id.charAt(0).toUpperCase() + id.slice(1)
    ).join(" · ");
  } catch { return "Heritage Path"; }
}

/** Derive a child's current subscription state from the data already
 *  returned by GET /api/parent/dashboard  */
function getSubState(child: any) {
  const now = new Date();

  // ── Premium (paid subscription) ──────────────────────────────
  if (child.is_premium && child.premium_expires_at) {
    const exp      = new Date(child.premium_expires_at);
    const expired  = exp <= now;
    const daysLeft = expired ? 0 : Math.ceil((exp.getTime() - now.getTime()) / 86400000);
    return {
      kind:     expired ? "expired" : "premium",
      daysLeft,
      expiresAt: exp,
      label:    expired ? "Subscription Expired" : "Premium Active",
    };
  }

  // ── Free trial ────────────────────────────────────────────────
  if (child.trial_ends_at) {
    const exp      = new Date(child.trial_ends_at);
    const expired  = exp <= now;
    const daysLeft = expired ? 0 : Math.ceil((exp.getTime() - now.getTime()) / 86400000);
    return {
      kind:     expired ? "expired" : "trial",
      daysLeft,
      expiresAt: exp,
      label:    expired ? "Trial Ended" : "Free Trial",
    };
  }

  return { kind: "none", daysLeft: 0, expiresAt: null, label: "No Active Plan" };
}

function SubscriptionStatus({ child }: { child: any }) {
  const sub = getSubState(child);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  // ── Colour palette ────────────────────────────────────────────
  const expired  = sub.kind === "expired";
  const isPremium = sub.kind === "premium";
  const isTrial   = sub.kind === "trial";
  const urgent    = !expired && sub.daysLeft <= 14 && sub.daysLeft > 0;

  const bg = expired  ? "bg-red-50 border-red-100"
           : urgent   ? "bg-orange-50 border-orange-100"
           : isPremium ? "bg-[#3F2171]/8 border-[#3F2171]/15"
           :             "bg-gray-50 border-gray-100";

  const textAccent = expired  ? "text-red-500"
                   : urgent   ? "text-orange-600"
                   : isPremium ? "text-[#3F2171]"
                   :             "text-gray-500";

  const dotColor = expired  ? "bg-red-400"
                 : urgent   ? "bg-orange-400 animate-pulse"
                 : isPremium ? "bg-[#3F2171] animate-pulse"
                 :             "bg-gray-400";

  return (
    <div className={`rounded-2xl border-2 p-4 ${bg}`}>
      {/* Top row — badge + label */}
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${textAccent}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}/>
          {sub.label}
        </div>
        {isPremium && (
          <ShieldCheck size={14} className="text-[#3F2171]"/>
        )}
        {expired && (
          <AlertCircle size={14} className="text-red-400"/>
        )}
        {isTrial && !urgent && (
          <CalendarClock size={14} className="text-gray-400"/>
        )}
        {urgent && !expired && (
          <AlertCircle size={14} className="text-orange-500"/>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/70 rounded-xl p-2.5 text-center">
          <p className={`text-xl font-black italic ${expired ? "text-red-400" : textAccent}`}>
            {expired ? "0" : sub.daysLeft}
          </p>
          <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 leading-tight">
            Days Left
          </p>
        </div>
        <div className="bg-white/70 rounded-xl p-2.5 text-center">
          <p className={`text-[10px] font-black ${expired ? "text-red-400" : "text-gray-700"} leading-tight`}>
            {sub.expiresAt ? fmt(sub.expiresAt) : "—"}
          </p>
          <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 leading-tight mt-0.5">
            {expired ? "Expired On" : "Expires On"}
          </p>
        </div>
      </div>

      {/* Low-days warning bar */}
      {!expired && sub.daysLeft > 0 && (
        <div className="mt-2.5">
          <div className="w-full bg-white/60 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                sub.daysLeft <= 7  ? "bg-red-400" :
                sub.daysLeft <= 14 ? "bg-orange-400" :
                isPremium          ? "bg-[#3F2171]" : "bg-gray-400"
              }`}
              style={{ width: `${Math.min(100, (sub.daysLeft / (isPremium ? 90 : 30)) * 100)}%` }}
            />
          </div>
          {urgent && (
            <p className="text-[8px] font-black text-orange-600 uppercase tracking-widest mt-1.5">
              ⚠ Renew soon to keep access uninterrupted
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ParentDashboard() {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [data, setData]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("is_impersonating");
    localStorage.removeItem("active_student_id");
    localStorage.removeItem("active_course_id");
    window.dispatchEvent(new Event("storage"));
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/parent/dashboard", {
        headers: { "X-Active-Student-Id": "" },
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const enterClassroom = (studentId: number, courseId?: number) => {
    localStorage.setItem("is_impersonating", "true");
    localStorage.setItem("active_student_id", studentId.toString());
    if (courseId) localStorage.setItem("active_course_id", courseId.toString());
    window.dispatchEvent(new Event("storage"));
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 className="animate-spin text-[#3F2171]" size={36}/>
          <p className="font-black text-gray-300 uppercase italic text-[10px] tracking-widest">
            Loading your dashboard…
          </p>
        </div>
      </Layout>
    );
  }

  const children       = data?.children       || [];
  const pendingPayments = data?.pending_payments || [];
  const isEmpty        = !children.length && !pendingPayments.length;
  const firstName      = data?.parent_name?.split(" ")[0] || "Parent";

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 animate-in fade-in duration-700">

        <PaywallModal
          open={showPaywall}
          onClose={() => setShowPaywall(false)}
          onUnlocked={() => { setShowPaywall(false); window.location.reload(); }}
        />

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">
              Parent Portal
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight">
              Welcome, <span className="text-[#3F2171]">{firstName}!</span>
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <div className="flex items-center gap-2 bg-white border-2 border-gray-100 px-3 py-1.5 rounded-xl shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3F2171] animate-pulse"/>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                  {data?.stats?.active_courses || 0} Student{(data?.stats?.active_courses || 0) !== 1 ? "s" : ""} enrolled
                </span>
              </div>
              {data?.stats?.pending_count > 0 && (
                <div className="flex items-center gap-2 bg-orange-50 border-2 border-orange-100 px-3 py-1.5 rounded-xl">
                  <Bell size={10} className="text-orange-500"/>
                  <span className="text-[9px] font-black uppercase tracking-widest text-orange-600">
                    {data.stats.pending_count} Pending
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row sm:flex-col lg:flex-row gap-3 w-full sm:w-auto">
            <a href="mailto:hello@fricalearn.com"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-50 border-2 border-gray-100 text-gray-500 px-5 py-3.5 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-gray-100 transition-all">
              <Headphones size={15}/> Support
            </a>
            <button onClick={() => navigate("/onboarding/step1")}
              className="flex-1 sm:flex-none group flex items-center justify-center gap-2 bg-[#3F2171] text-white px-5 py-3.5 rounded-2xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest shadow-lg hover:bg-black transition-all border-b-4 border-[#1E1038] active:translate-y-0.5 active:border-b-0">
              <PlusCircle size={16} className="text-[#FFFF00] group-hover:rotate-90 transition-transform"/>
              Add a Child
            </button>
          </div>
        </div>

        {/* ── Empty state ──────────────────────────────────── */}
        {isEmpty ? (
          <div className="bg-white rounded-[2.5rem] border-4 border-dashed border-gray-100 p-10 sm:p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <GraduationCap size={40} className="text-gray-200"/>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-800 uppercase italic mb-3 tracking-tighter">
              Start Your Journey
            </h3>
            <p className="text-gray-400 font-bold max-w-sm mx-auto mb-8 text-sm leading-relaxed">
              No children enrolled yet. Add your child to begin their 1-month free trial.
            </p>
            <button onClick={() => navigate("/onboarding/step1")}
              className="inline-flex items-center gap-2 bg-[#3F2171] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-lg">
              <PlusCircle size={16} className="text-[#FFFF00]"/> Enrol a Child — Free
            </button>
          </div>
        ) : (
          <div className="space-y-12">

            {/* ── Children grid ───────────────────────────── */}
            {children.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-7">
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-400 whitespace-nowrap">
                    Your Children
                  </p>
                  <div className="h-px flex-1 bg-gray-100"/>
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    {children.length} enrolled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                  {children.map((child: any) => {
                    const enrollment   = data?.active_enrollments?.find(
                      (e: any) => Number(e.student_id) === Number(child.id)
                    );
                    const sub          = getSubState(child);
                    const trialExpired = sub.kind === "expired";
                    const isPremium    = sub.kind === "premium";

                    return (
                      <div key={child.id}
                        className="bg-white rounded-[2rem] border-2 border-gray-100 p-6 sm:p-7 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col">

                        {/* Decorative bg icon */}
                        <div className="absolute -bottom-4 -right-4 opacity-[0.04] group-hover:scale-110 transition-transform pointer-events-none">
                          <GraduationCap size={120}/>
                        </div>

                        {/* Child info */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#3F2171]/10 flex items-center justify-center shrink-0">
                            <User size={22} className="text-[#3F2171]"/>
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-black text-gray-800 uppercase italic tracking-tighter truncate">
                              {child.name}
                            </h3>
                            <p className="text-xs text-gray-400 font-bold truncate">
                              <CourseLabel courses={child.selected_courses}/>
                            </p>
                          </div>
                        </div>

                        {/* Subjects pill */}
                        <div className="flex items-center gap-2 mb-4">
                          <BookOpen size={13} className="text-[#3F2171] shrink-0"/>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                            {(() => {
                              try {
                                const list = typeof child.selected_courses === "string"
                                  ? JSON.parse(child.selected_courses)
                                  : (child.selected_courses || []);
                                const paid = list.filter((x: string) => ["maths","english"].includes(x));
                                if (paid.length === 2) return "Maths + English";
                                if (paid.length === 1) return paid[0] === "maths" ? "Maths" : "English";
                                return "Language Course";
                              } catch { return "Enrolled"; }
                            })()}
                          </p>
                        </div>

                        {/* Subscription status block */}
                        <div className="mb-5">
                          <SubscriptionStatus child={child}/>
                        </div>

                        {/* CTA */}
                        <div className="mt-auto space-y-2">
                          {trialExpired && !isPremium ? (
                            <button onClick={() => {
                                localStorage.setItem("active_student_id", child.id.toString());
                                setShowPaywall(true);
                              }}
                              className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600 transition-all shadow-md">
                              Renew Access <ChevronRight size={16}/>
                            </button>
                          ) : (
                            <button onClick={() => enterClassroom(child.id, enrollment?.course_id)}
                              className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 bg-[#3F2171] text-white hover:bg-black transition-all shadow-md group/btn">
                              Continue Learning
                              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
                            </button>
                          )}
                          <button onClick={() => navigate('/parent/progress/' + child.id)}
                            className="w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 bg-gray-50 border-2 border-gray-100 text-gray-500 hover:border-[#3F2171]/30 hover:text-[#3F2171] transition-all">
                            View Progress Report
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add child card */}
                  <button onClick={() => navigate("/onboarding/step1")}
                    className="bg-gray-50 border-4 border-dashed border-gray-200 rounded-[2rem] p-6 sm:p-7 flex flex-col items-center justify-center gap-3 hover:border-[#3F2171]/40 hover:bg-[#3F2171]/5 transition-all duration-300 min-h-[200px] group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-[#3F2171] transition-colors">
                      <PlusCircle size={24} className="text-gray-300 group-hover:text-[#FFFF00] transition-colors"/>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#3F2171] transition-colors">
                      Enrol another child
                    </p>
                  </button>
                </div>
              </section>
            )}

            {/* ── Pending payments ─────────────────────────── */}
            {pendingPayments.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-7">
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-400 whitespace-nowrap">
                    Pending Verification
                  </p>
                  <div className="h-px flex-1 bg-orange-100"/>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pendingPayments.map((payment: any) => (
                    <div key={payment.id}
                      className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-5 flex items-center gap-4">
                      <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <Clock size={20} className="text-orange-500"/>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-gray-800 text-base uppercase italic tracking-tighter truncate">
                          {payment.child_name}
                        </p>
                        <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mt-0.5">
                          Receipt submitted · Verifying within 24h
                        </p>
                      </div>
                      <div className="shrink-0 bg-orange-100 text-orange-600 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
                        Pending
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Quick links ───────────────────────────────── */}
            <section>
              <div className="flex items-center gap-4 mb-7">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-400 whitespace-nowrap">
                  Quick Links
                </p>
                <div className="h-px flex-1 bg-gray-100"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: BookOpen,      label: "Start Onboarding",   desc: "Enrol a new child",            action: () => navigate("/onboarding/step1") },
                  { icon: GraduationCap, label: "Curriculum",         desc: "UK National Curriculum info",  action: () => window.open("https://www.thenational.academy", "_blank") },
                  { icon: Headphones,    label: "Get Support",        desc: "hello@fricalearn.com",          action: () => window.open("mailto:hello@fricalearn.com", "_self") },
                ].map(({ icon: Icon, label, desc, action }) => (
                  <button key={label} onClick={action}
                    className="bg-white border-2 border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:border-[#3F2171]/30 hover:shadow-md transition-all text-left group">
                    <div className="w-10 h-10 bg-[#3F2171]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#3F2171] transition-colors">
                      <Icon size={18} className="text-[#3F2171] group-hover:text-white transition-colors"/>
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-gray-800 text-sm">{label}</p>
                      <p className="text-[10px] text-gray-400 font-bold truncate">{desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-200 ml-auto shrink-0 group-hover:text-[#3F2171] transition-colors"/>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        <EnrollmentModal
          isOpen={isEnrollModalOpen}
          onClose={() => { setIsEnrollModalOpen(false); fetchDashboardData(); }}
        />
      </div>
    </Layout>
  );
}
