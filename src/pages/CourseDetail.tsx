import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PlayCircle,
  ArrowLeft,
  ChevronRight,
  Edit3,
  Lock,
  CheckCircle2,
  Calendar,
  AlertCircle
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

    // 2. Fetch Course with Student Context for Locking
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
        {/* Back Navigation */}
        <button
          onClick={() => navigate("/courses")}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#2D5A27] mb-8 transition-all font-black uppercase text-[10px] tracking-widest"
        >
          <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-[#2D5A27]/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          Back to library
        </button>

        {/* --- COURSE HERO --- */}
        <div className="relative bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row"> {/* 🚀 FIXED: Changed md:row to md:flex-row */}
            <div className="w-full md:w-2/5 lg:w-1/3 aspect-square relative bg-gray-50">
              <img
                src={course?.thumbnail_url} 
                className="w-full h-full object-cover"
                alt={course?.title || 'Course Image'}
                onError={(e: any) => e.target.src = 'https://via.placeholder.com/400x400?text=FricaLearn'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="w-full md:w-3/5 lg:w-2/3 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                <span className="bg-[#2D5A27]/10 text-[#2D5A27] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {course.subject || 'Language & Culture'}
                </span>
                <span className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest border-l pl-3 border-gray-200">
                  {course.level || 'Beginner'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-800 mb-6 leading-tight tracking-tighter italic uppercase">
                {course.title}
              </h1>
              <p className="text-gray-500 font-medium leading-relaxed italic text-base md:text-lg max-w-2xl">
                {course.description}
              </p>
            </div>
          </div>
        </div>

        {/* --- SYLLABUS HEADER --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-2 italic uppercase tracking-tighter">
              Learning Path
            </h2>
            <div className="h-1.5 w-16 bg-[#2D5A27] rounded-full mx-auto md:mx-0"></div>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
             <div className="flex items-center gap-1.5"><Lock size={14}/> Weekly Tasks</div>
             <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500"/> Sequential</div>
          </div>
        </div>

        {/* --- MODULES & LESSONS --- */}
        <div className="space-y-10">
          {course.modules?.map((module: any, mIdx: number) => (
            <div key={module.id} className="relative">
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden">
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-3">
                    <span className="bg-[#2D5A27] text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] not-italic">{mIdx + 1}</span>
                    {module.title}
                  </h3>
                </div>

                <div className="divide-y divide-gray-50">
                  {module.lessons?.map((lesson: any) => {
                    const isLocked = lesson.is_locked && !isAdmin;
                    const isCompleted = lesson.is_completed;
                    
                    const displayTitle = lesson.title.toLowerCase().startsWith('week') 
                      ? lesson.title 
                      : `Week ${lesson.week_number}: ${lesson.title}`;

                    return (
                      <div
                        key={lesson.id}
                        className={`p-6 md:p-10 flex flex-col lg:flex-row items-center justify-between transition-all gap-8 ${isLocked ? 'bg-gray-50/50 grayscale opacity-70' : 'hover:bg-green-50/20'}`}
                      >
                        <div className="flex items-center gap-6 md:gap-10 w-full">
                          <div className={`w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-[1.5rem] flex items-center justify-center border-2 shadow-sm transition-all ${
                            isCompleted ? 'bg-green-50 border-green-200 text-green-500' : 
                            isLocked ? 'bg-gray-100 border-gray-200 text-gray-400' : 
                            'bg-white border-gray-100 text-[#2D5A27]'
                          }`}>
                            {isCompleted ? <CheckCircle2 size={32} /> : isLocked ? <Lock size={32} /> : <PlayCircle size={36} />}
                          </div>
                          
                          <div className="flex-1 text-left">
                            <h4 className="font-black text-gray-800 text-lg md:text-2xl uppercase italic leading-tight mb-2 tracking-tight">
                              {displayTitle}
                            </h4>
                            <div className="flex flex-wrap items-center gap-4">
                               {isLocked ? (
                                 <span className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-1.5">
                                   <AlertCircle size={14}/> Locked until previous week complete
                                 </span>
                               ) : (
                                 <span className={`text-[10px] font-black uppercase italic ${isCompleted ? 'text-gray-400' : 'text-green-600'}`}>
                                   {isCompleted ? "Completed" : "Available"}
                                 </span>
                               )}
                               {lesson.unlock_date && isLocked && (
                                 <span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5 border-l pl-4 border-gray-200">
                                   <Calendar size={14}/> Unlocks: {new Date(lesson.unlock_date).toLocaleDateString()}
                                 </span>
                               )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full lg:w-auto justify-end border-t lg:border-none pt-6 lg:pt-0">
                          {isAdmin && (
                            <button 
                              onClick={() => navigate(`/admin/edit-lesson/${lesson.id}`)} 
                              className="p-4 bg-white border-2 border-orange-100 text-orange-400 rounded-2xl hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                            >
                              <Edit3 size={20} />
                            </button>
                          )}
                          
                          <button
                            disabled={isLocked}
                            onClick={() => navigate(`/lessons/${lesson.id}`)}
                            className={`w-full lg:w-auto px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 ${
                              isLocked 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                                : 'bg-[#2D5A27] text-white hover:bg-black active:scale-95 hover:-translate-y-1'
                            }`}
                          >
                            {isLocked ? "Locked" : isCompleted ? "Review" : "Start Now"}
                            {!isLocked && <ChevronRight size={16} />}
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