import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import {
  PlusCircle,
  GraduationCap,
  Clock,
  ArrowRight,
  Loader2,
  User,
} from "lucide-react";
import EnrollmentModal from "../../components/Parent/EnrollmentModal";

export default function ParentDashboard() {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  const enterClassroom = (studentId: number, courseId: number) => {
    localStorage.setItem("is_impersonating", "true");
    localStorage.setItem("active_student_id", studentId.toString());
    localStorage.setItem("active_course_id", courseId.toString());
    window.dispatchEvent(new Event("storage"));
    navigate(`/course-detail/${courseId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="animate-spin text-[#2D5A27] mb-4" size={40} />
          <p className="font-black text-gray-300 uppercase italic text-[10px] tracking-widest">
            Opening the Vault...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Container: Added horizontal padding for mobile (px-6) and scaled for desktop (md:px-12) */}
      <div className="max-w-7xl mx-auto px-6 py-10 md:px-12 md:py-16 animate-in fade-in duration-700">
        {/* --- 🏠 DASHBOARD HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 md:mb-20">
          <div className="w-full md:w-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight">
              Ẹ n lẹ́, {data?.parent_name?.split(" ")[0] || "Parent"}!
            </h1>

            {/* Header Badges: Flex-wrap for small screens */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <div className="bg-white px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl border-2 border-gray-50 shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#2D5A27] animate-pulse"></div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">
                  {data?.stats?.active_courses || 0} Enrolled
                </span>
              </div>
              {data?.stats?.pending_count > 0 && (
                <div className="bg-orange-50 px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl border-2 border-orange-100 flex items-center gap-3">
                  <Clock size={12} className="text-orange-500" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-orange-600 whitespace-nowrap">
                    {data?.stats?.pending_count} Pending
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="w-full md:w-auto group flex items-center justify-center gap-4 bg-[#2D5A27] text-white px-8 py-5 md:px-10 md:py-7 rounded-2xl md:rounded-[2.5rem] font-black uppercase text-[10px] md:text-[11px] tracking-widest shadow-2xl hover:bg-black transition-all border-b-4 md:border-b-8 border-green-900 active:translate-y-1 active:border-b-0"
          >
            <PlusCircle
              size={20}
              className="text-[#F4B400] group-hover:rotate-90 transition-transform"
            />
            Add Family Member
          </button>
        </div>

        {/* --- 🏜️ EMPTY STATE --- */}
        {!data?.children?.length && !data?.pending_payments?.length ? (
          <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border-4 border-dashed border-gray-100 p-12 md:p-24 text-center">
            <GraduationCap size={60} className="text-gray-100 mx-auto mb-6" />
            <h3 className="text-2xl md:text-4xl font-black text-gray-800 uppercase italic mb-4 tracking-tighter">
              Start Your Journey
            </h3>
            <p className="text-gray-400 font-bold max-w-sm mx-auto mb-10 leading-relaxed text-xs md:text-sm italic">
              Empower your children with the gift of heritage.
            </p>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-24">
            {/* --- 🎓 FAMILY CLASSROOM CARDS --- */}
            {data?.children?.length > 0 && (
              <section>
                <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
                  <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 whitespace-nowrap">
                    Active Students
                  </h2>
                  <div className="h-[1px] w-full bg-gray-100"></div>
                </div>

                {/* Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                  {data.children.map((child: any) => {
                    const enrollment = data.active_enrollments?.find(
                      (e: any) => e.student_id === child.id,
                    );

                    return (
                      <div
                        key={child.id}
                        className="bg-white rounded-[2.5rem] md:rounded-[4rem] border-4 border-white p-8 md:p-12 shadow-xl hover:shadow-2xl md:hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden"
                      >
                        <div className="bg-green-50 text-green-600 p-5 md:p-6 rounded-2xl md:rounded-[2.2rem] w-fit mb-8 group-hover:bg-[#2D5A27] group-hover:text-white transition-all shadow-inner">
                          <User size={28} md:size={36} />
                        </div>

                        <h3 className="text-2xl md:text-4xl font-black text-gray-800 uppercase italic tracking-tighter truncate">
                          {child.name}
                        </h3>

                        <p className="text-gray-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest mt-4 flex items-center gap-2">
                          <span className="w-4 h-[3px] bg-[#2D5A27] rounded-full"></span>{" "}
                          {child.current_track || "General Track"}
                        </p>

                        <button
                          disabled={!enrollment}
                          onClick={() =>
                            enterClassroom(child.id, enrollment.course_id)
                          }
                          className={`mt-10 md:mt-14 w-full py-5 md:py-7 rounded-xl md:rounded-[2.2rem] font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl ${
                            enrollment
                              ? "bg-gray-900 text-white hover:bg-[#2D5A27]"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {enrollment ? (
                            <>
                              Enter Classroom <ArrowRight size={18} />
                            </>
                          ) : (
                            "No Active Courses"
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* --- ⏳ PENDING VERIFICATIONS --- */}
            {data?.pending_payments?.length > 0 && (
              <section className="bg-orange-50/20 rounded-[2.5rem] md:rounded-[5rem] p-8 md:p-16 border-4 border-dashed border-orange-100/50">
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-orange-500/60 whitespace-nowrap">
                    Awaiting Verification
                  </h2>
                  <div className="h-[1px] w-full bg-orange-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  {data.pending_payments.map((payment: any) => (
                    <div
                      key={payment.id}
                      className="bg-white rounded-3xl md:rounded-[3rem] p-6 md:p-10 flex items-center justify-between border-2 border-white shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-4 md:gap-8 overflow-hidden">
                        <div className="p-4 md:p-6 bg-orange-50 text-orange-500 rounded-2xl md:rounded-[2rem] border border-orange-100 flex-shrink-0">
                          <Clock
                            size={20}
                            md:size={28}
                            className="animate-spin-slow"
                          />
                        </div>
                        <div className="truncate">
                          <p className="text-gray-900 font-black uppercase text-lg md:text-2xl italic tracking-tighter truncate">
                            {payment.child_name}
                          </p>
                          <p className="text-gray-400 font-black text-[8px] md:text-[10px] uppercase tracking-widest mt-1 truncate">
                            {payment.course?.title || "Processing..."}
                          </p>
                        </div>
                      </div>

                      {/* Status indicator: Small on mobile, badge on desktop */}
                      <div className="flex-shrink-0 ml-2">
                        <div className="md:px-6 md:py-3 px-2 py-1 bg-orange-50 text-orange-600 rounded-lg md:rounded-2xl border border-orange-100">
                          <span className="text-[8px] md:text-[10px] font-black uppercase">
                            In Review
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <EnrollmentModal
          isOpen={isEnrollModalOpen}
          onClose={() => {
            setIsEnrollModalOpen(false);
            fetchDashboardData();
          }}
        />
      </div>
    </Layout>
  );
}
