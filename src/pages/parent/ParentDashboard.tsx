import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import {
  PlusCircle,
  GraduationCap,
  Clock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";
import EnrollmentModal from "../../components/Parent/EnrollmentModal";

export default function ParentDashboard() {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * 🔐 SESSION SAFETY:
     * When landing on the Parent Dashboard, we must ensure we aren't
     * still "impersonating" a student.
     */
    localStorage.removeItem("is_impersonating");
    localStorage.removeItem("active_student_id");
    localStorage.removeItem("active_course_id");
    window.dispatchEvent(new Event("storage"));

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      /**
       * 🚀 THE FIX: Explicitly clear the student header for this request
       * to ensure we get the Parent's overview data.
       */
      const res = await api.get("/parent/dashboard", {
        headers: { "X-Active-Student-Id": "" },
      });
      console.log("Parent Dashboard Sync:", res.data);
      setData(res.data);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🎓 CLASSROOM ENTRY:
   * Sets the "Triple Stamp" of IDs needed for the Sidebar and App routing.
   */
  /**
   * 🎓 CLASSROOM ENTRY:
   * Sets the "Triple Stamp" of IDs and routes to the Syllabus (Course Detail).
   */
  const enterClassroom = (studentId: number, courseId: number) => {
    localStorage.setItem("is_impersonating", "true");
    localStorage.setItem("active_student_id", studentId.toString());
    localStorage.setItem("active_course_id", courseId.toString());

    window.dispatchEvent(new Event("storage"));

    // ✅ REDIRECT TO THE SYLLABUS, NOT THE PLAYER
    navigate(`/course-detail/${courseId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="animate-spin text-[#2D5A27] mb-4" size={40} />
          <p className="font-black text-gray-300 uppercase italic text-xs tracking-widest">
            Opening the Vault...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 md:p-12 animate-in fade-in duration-700">
        {/* --- 🏠 DASHBOARD HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">
              Ẹ n lẹ́, {data?.parent_name?.split(" ")[0] || "Parent"}!
            </h1>
            <div className="flex items-center gap-4 mt-6">
              <div className="bg-white px-5 py-3 rounded-2xl border-2 border-gray-50 shadow-sm flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2D5A27] animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  {data?.stats?.active_courses || 0} Enrolled Subjects
                </span>
              </div>
              {data?.stats?.pending_count > 0 && (
                <div className="bg-orange-50 px-5 py-3 rounded-2xl border-2 border-orange-100 flex items-center gap-3">
                  <Clock size={14} className="text-orange-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
                    {data?.stats?.pending_count} Awaiting Approval
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="group flex items-center gap-4 bg-[#2D5A27] text-white px-10 py-7 rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95 border-b-8 border-green-900"
          >
            <PlusCircle
              size={22}
              className="text-[#F4B400] group-hover:rotate-90 transition-transform"
            />
            Add Family Member
          </button>
        </div>

        {/* --- 🏜️ EMPTY STATE --- */}
        {!data?.children?.length && !data?.pending_payments?.length ? (
          <div className="bg-white rounded-[4rem] border-4 border-dashed border-gray-100 p-24 text-center shadow-inner">
            <GraduationCap size={72} className="text-gray-100 mx-auto mb-8" />
            <h3 className="text-4xl font-black text-gray-800 uppercase italic mb-4 tracking-tighter">
              Start Your Journey
            </h3>
            <p className="text-gray-400 font-bold max-w-sm mx-auto mb-10 leading-relaxed text-sm italic">
              Empower your children with the gift of heritage. Enroll them in
              their first subject to begin.
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {/* --- 🎓 FAMILY CLASSROOM CARDS --- */}
            {data?.children?.length > 0 && (
              <section>
                <div className="flex items-center gap-6 mb-10">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-400 whitespace-nowrap">
                    Active Students
                  </h2>
                  <div className="h-[1px] w-full bg-gray-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {data.children.map((child: any) => {
                    // Find the enrollment for this child to get the course_id
                    const enrollment = data.active_enrollments?.find(
                      (e: any) => e.student_id === child.id,
                    );

                    return (
                      <div
                        key={child.id}
                        className="bg-white rounded-[4rem] border-4 border-white p-12 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full -mr-20 -mt-20 group-hover:bg-[#2D5A27] transition-all duration-700 opacity-20"></div>

                        <div className="bg-green-50 text-green-600 p-6 rounded-[2.2rem] w-fit mb-10 group-hover:bg-[#2D5A27] group-hover:text-white transition-all shadow-inner">
                          <User size={36} />
                        </div>

                        <h3 className="text-4xl font-black text-gray-800 uppercase italic leading-none tracking-tighter">
                          {child.name}
                        </h3>

                        {/* 🎯 DYNAMIC TRACK BADGE: Uses current_track from ParentController */}
                        <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] mt-5 flex items-center gap-3">
                          <span className="w-5 h-[3px] bg-[#2D5A27] rounded-full"></span>{" "}
                          {child.current_track || "General Track"}
                        </p>

                        <button
                          disabled={!enrollment}
                          onClick={() =>
                            enterClassroom(child.id, enrollment.course_id)
                          }
                          className={`mt-14 w-full py-7 rounded-[2.2rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95 ${
                            enrollment
                              ? "bg-gray-900 text-white hover:bg-[#2D5A27]"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {enrollment ? (
                            <>
                              Enter Classroom <ArrowRight size={20} />
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
              <section className="bg-orange-50/20 rounded-[5rem] p-10 md:p-16 border-4 border-dashed border-orange-100/50 animate-pulse-slow">
                <div className="flex items-center gap-6 mb-12">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-orange-500/60 whitespace-nowrap">
                    Awaiting Verification
                  </h2>
                  <div className="h-[1px] w-full bg-orange-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {data.pending_payments.map((payment: any) => (
                    <div
                      key={payment.id}
                      className="bg-white rounded-[3rem] p-10 flex items-center justify-between border-2 border-white shadow-sm hover:shadow-xl transition-all duration-500"
                    >
                      <div className="flex items-center gap-8">
                        <div className="p-6 bg-orange-50 text-orange-500 rounded-[2rem] border border-orange-100 shadow-inner">
                          <Clock size={28} className="animate-spin-slow" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-black uppercase text-2xl italic tracking-tighter">
                            {payment.child_name}
                          </p>
                          <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mt-2">
                            {payment.course?.title || "Course Processing..."}
                          </p>
                        </div>
                      </div>
                      <div className="hidden lg:flex flex-col items-end">
                        <div className="px-6 py-3 bg-orange-50/50 text-orange-600 rounded-2xl border border-orange-100">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
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
            fetchDashboardData(); // Refresh data after adding a child
          }}
        />
      </div>
    </Layout>
  );
}
