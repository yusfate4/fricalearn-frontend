import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import {
  PlusCircle,
  GraduationCap,
  Clock,
  ArrowRight,
  Loader2,
  User,
  Headphones,
  ShieldCheck
} from "lucide-react";
import EnrollmentModal from "../../components/Parent/EnrollmentModal";

export default function ParentDashboard() {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 🧹 Clear any existing student sessions to avoid ID bleeding
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
    // 🚀 Session Handshake: Impersonate the student to access their lessons
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
      <div className="max-w-7xl mx-auto px-6 py-10 md:px-12 md:py-16 animate-in fade-in duration-700">
        
        {/* --- 🏠 DASHBOARD HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 md:mb-20">
          <div className="w-full md:w-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight">
              Ẹ n lẹ́, {data?.parent_name?.split(" ")[0] || "Parent"}!
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <div className="bg-white px-4 py-2 rounded-xl border-2 border-gray-50 shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#2D5A27] animate-pulse"></div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {data?.stats?.active_courses || 0} Students Active
                </span>
              </div>
              {data?.stats?.pending_count > 0 && (
                <div className="bg-orange-50 px-4 py-2 rounded-xl border-2 border-orange-100 flex items-center gap-3">
                  <Clock size={12} className="text-orange-500" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-orange-600">
                    {data?.stats?.pending_count} Pending Review
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <Link 
              to="/parent/messages"
              className="flex items-center justify-center gap-3 bg-gray-100 text-gray-600 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all shadow-sm"
            >
              <Headphones size={18} /> Support
            </Link>
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="group flex items-center justify-center gap-4 bg-[#2D5A27] text-white px-10 py-5 rounded-2xl md:rounded-[2.5rem] font-black uppercase text-[10px] md:text-[11px] tracking-widest shadow-2xl hover:bg-black transition-all border-b-4 border-green-900 active:translate-y-1 active:border-b-0"
            >
              <PlusCircle size={20} className="text-[#F4B400] group-hover:rotate-90 transition-transform" />
              Add Your Kids
            </button>
          </div>
        </div>

        {/* --- 🏜️ EMPTY STATE --- */}
        {!data?.children?.length && !data?.pending_payments?.length ? (
          <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border-4 border-dashed border-gray-100 p-12 md:p-24 text-center">
            <GraduationCap size={60} className="text-gray-100 mx-auto mb-6" />
            <h3 className="text-2xl md:text-4xl font-black text-gray-800 uppercase italic mb-4 tracking-tighter">
              Start Your Journey
            </h3>
            <p className="text-gray-400 font-bold max-w-sm mx-auto mb-10 leading-relaxed text-xs md:text-sm italic">
              No students found. Add a family member to begin their heritage learning path.
            </p>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-24">
            
            {/* --- 🎓 ACTIVE STUDENTS --- */}
            {data?.children?.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 whitespace-nowrap">
                    Family Classrooms
                  </h2>
                  <div className="h-[1px] w-full bg-gray-100"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                  {data.children.map((child: any) => {
                    const enrollment = data.active_enrollments?.find(
                      (e: any) => Number(e.student_id) === Number(child.id)
                    );

                    return (
                      <div
                        key={child.id}
                        className="bg-white rounded-[2.5rem] md:rounded-[4rem] border-4 border-white p-8 md:p-12 shadow-xl hover:shadow-2xl md:hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform">
                          <GraduationCap size={100} />
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#2D5A27] shadow-inner">
                                <User size={24} />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-gray-800 uppercase italic tracking-tighter truncate">
                              {child.name}
                            </h3>
                        </div>

                        <div className="space-y-3">
                            <p className="text-gray-400 font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
                              <span className="w-4 h-[3px] bg-[#2D5A27] rounded-full"></span>{" "}
                              {child.current_track || "General Heritage Path"}
                            </p>
                        </div>

                        <button
                          onClick={() => enrollment && enterClassroom(child.id, enrollment.course_id)}
                          className={`mt-10 w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl ${
                            enrollment
                              ? "bg-gray-900 text-white hover:bg-[#2D5A27]"
                              : "bg-red-50 text-red-400 border-2 border-red-100 cursor-not-allowed"
                          }`}
                        >
                          {enrollment ? (
                            <>Monitor Progress <ArrowRight size={18} /></>
                          ) : (
                            "Activation Pending"
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
              <section className="bg-orange-50/20 rounded-[3rem] md:rounded-[5rem] p-8 md:p-16 border-4 border-dashed border-orange-100/50">
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-orange-500/60 whitespace-nowrap">
                    Verification Ledger
                  </h2>
                  <div className="h-[1px] w-full bg-orange-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  {data.pending_payments.map((payment: any) => (
                    <div
                      key={payment.id}
                      className="bg-white rounded-[2.5rem] p-8 flex items-center justify-between border-2 border-white shadow-sm"
                    >
                      <div className="flex items-center gap-6 overflow-hidden">
                        <div className="p-5 bg-orange-50 text-orange-500 rounded-2xl flex-shrink-0 animate-pulse">
                          <Clock size={24} />
                        </div>
                        <div className="truncate">
                          <p className="text-gray-900 font-black uppercase text-xl italic tracking-tighter truncate">
                            {payment.child_name}
                          </p>
                          <p className="text-gray-400 font-black text-[9px] uppercase tracking-widest mt-1 truncate">
                            {payment.course?.title || "Enrolling..." }
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-4 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-100 font-black text-[8px] uppercase">
                        Pending
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