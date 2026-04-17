import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PlayCircle,
  ArrowLeft,
  ChevronRight,
  Edit3,
  Lock,
  CheckCircle2,
  Calendar
} from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Verify Admin Status
    api.get("/me")
      .then((res) => setIsAdmin(res.data.is_admin === 1 || res.data.role === 'admin'))
      .catch(() => setIsAdmin(false));

    // 2. Fetch Course & Lessons with student-specific locking data
    const studentId = localStorage.getItem('active_student_id');
    const endpoint = `/courses/${id}${studentId ? `?student_id=${studentId}` : ''}`;
    
    api.get(endpoint)
      .then((res) => {
        setCourse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load course details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-20 text-center font-black text-[#2D5A27] animate-pulse italic uppercase tracking-tighter text-xl md:text-2xl">
          Opening FricaLearn Syllabus...
        </div>
      </div>
    </Layout>
  );

  if (!course) return (
    <Layout>
      <div className="p-20 text-center">
        <h2 className="text-red-500 font-black uppercase text-xl mb-4">Course Not Found</h2>
        <button onClick={() => navigate('/courses')} className="text-[#2D5A27] font-bold underline">Return to Library</button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-10 pb-32">
        {/* Navigation */}
        <button
          onClick={() => navigate("/courses")}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#2D5A27] mb-8 transition-all font-black uppercase text-[10px] tracking-widest"
        >
          <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-[#2D5A27]/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          Back to library
        </button>

        {/* --- HERO CARD --- */}
        <div className="relative bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 aspect-square relative bg-gray-50">
              <img
                src={course?.thumbnail_url} 
                className="w-full h-full object-cover"
                alt={course?.title || 'FricaLearn Course'}
                onError={(e: any) => e.target.src = 'https://via.placeholder.com/400x400?text=FricaLearn'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="w-full md:w-2/3 p-6 md:p-12 flex flex-col justify-center bg-white text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <span className="bg-[#2D5A27]/10 text-[#2D5A27] px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
                  {course.subject}
                </span>
                <span className="text-[9px] font-black text-gray-300 uppercase italic tracking-widest border-l pl-3 border-gray-200">
                  {course.level}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-800 mb-4 md:mb-6 leading-tight tracking-tighter italic uppercase">
                {course.title}
              </h1>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xl italic text-sm md:text-base">
                {course.description}
              </p>
            </div>
          </div>
        </div>

        {/* --- SYLLABUS HEADER --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 text-center md:text-left">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2 italic uppercase tracking-tighter">
              Learning Path
            </h2>
            <div className="h-1.5 w-16 bg-[#2D5A27] rounded-full mx-auto md:mx-0"></div>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
             <div className="flex items-center gap-1"><Lock size={12}/> 1 Lesson/Week</div>
             <div className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500"/> Sequential</div>
          </div>
        </div>

        {/* --- MODULES & LESSONS --- */}
        <div className="space-y-8 md:space-y-12">
          {course.modules?.map((module: any, mIdx: number) => (
            <div key={module.id} className="relative">
              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden">
                {/* Module Header */}
                <div className="bg-gray-50 px-6 py-4 md:px-10 md:py-6 border-b border-gray-100">
                  <h3 className="text-xs md:text-sm font-black text-gray-400 uppercase tracking-widest italic flex flex-wrap items-center gap-2">
                    Module {mIdx + 1}: <span className="text-gray-800">{module.title}</span>
                  </h3>
                </div>

                {/* Lessons List */}
                <div className="divide-y divide-gray-50">
                  {module.lessons?.map((lesson: any) => {
                    const isLocked = lesson.is_locked && !isAdmin;
                    const isCompleted = lesson.is_completed;
                    
                    // Cleanup title to avoid "Week 1: Week 1"
                    const displayTitle = lesson.title.toLowerCase().startsWith('week') 
                      ? lesson.title 
                      : `Week ${lesson.week_number}: ${lesson.title}`;

                    return (
                      <div
                        key={lesson.id}
                        className={`p-6 md:px-10 flex flex-col lg:flex-row items-center justify-between transition-all gap-6 ${isLocked ? 'bg-gray-50/50 grayscale opacity-70' : 'hover:bg-green-50/20'}`}
                      >
                        <div className="flex items-center gap-4 md:gap-8 w-full">
                          {/* Status Icon */}
                          <div className={`w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-2xl flex items-center justify-center border-2 transition-all shadow-sm ${
                            isCompleted ? 'bg-green-50 border-green-200 text-green-500' : 
                            isLocked ? 'bg-gray-100 border-gray-200 text-gray-400' : 
                            'bg-white border-gray-100 text-[#2D5A27]'
                          }`}>
                            {isCompleted ? <CheckCircle2 size={24} /> : isLocked ? <Lock size={24} /> : <PlayCircle size={28} />}
                          </div>
                          
                          {/* Title & Progress Info */}
                          <div className="flex-1 text-left">
                            <h4 className="font-black text-gray-800 text-base md:text-xl uppercase italic leading-tight mb-2">
                              {displayTitle}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3">
                               {isLocked ? (
                                 <span className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-1">
                                   <AlertCircle size={12}/> Locked
                                 </span>
                               ) : (
                                 <span className={`text-[9px] font-black uppercase italic ${isCompleted ? 'text-gray-400' : 'text-green-600'}`}>
                                   {isCompleted ? "Lesson Completed" : "Available Now"}
                                 </span>
                               )}
                               {lesson.unlock_date && isLocked && (
                                 <span className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1 border-l pl-3">
                                   <Calendar size={12}/> Unlocks: {new Date(lesson.unlock_date).toLocaleDateString()}
                                 </span>
                               )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-none pt-4 lg:pt-0">
                          {isAdmin && (
                            <button 
                              onClick={() => navigate(`/admin/edit-lesson/${lesson.id}`)} 
                              className="p-3 bg-white border-2 border-orange-100 text-orange-400 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                              title="Edit Lesson"
                            >
                              <Edit3 size={18} />
                            </button>
                          )}
                          
                          <button
                            disabled={isLocked}
                            onClick={() => navigate(`/lessons/${lesson.id}`)}
                            className={`w-full lg:w-auto px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2 ${
                              isLocked 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'bg-[#2D5A27] text-white hover:bg-black hover:-translate-y-1 active:scale-95'
                            }`}
                          >
                            {isLocked ? "Locked" : isCompleted ? "Review" : "Start Now"}
                            {!isLocked && <ChevronRight size={14} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}