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
      .then((res) => setIsAdmin(res.data.is_admin === 1))
      .catch(() => setIsAdmin(false));

    // 2. Fetch Course & Lessons with Locking Data
    const studentId = localStorage.getItem('active_student_id');
    api.get(`/courses/${id}${studentId ? `?student_id=${studentId}` : ''}`)
      .then((res) => {
        setCourse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <Layout>
      <div className="p-20 text-center font-black text-[#2D5A27] animate-pulse italic uppercase tracking-tighter text-2xl">
        Opening FricaLearn Syllabus...
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 md:p-10 pb-32">
        <button
          onClick={() => navigate("/courses")}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#2D5A27] mb-10 transition-all font-black uppercase text-[10px] tracking-widest"
        >
          <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-[#2D5A27]/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          Back to library
        </button>

        {/* --- HERO CARD --- */}
        <div className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white mb-16">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 aspect-square relative bg-gray-50">
              <img
                src={course.thumbnail_url}
                className="w-full h-full object-cover"
                alt={course.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center bg-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#2D5A27]/10 text-[#2D5A27] px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
                  {course.subject}
                </span>
                <span className="text-[9px] font-black text-gray-300 uppercase italic tracking-widest">
                  {course.level}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-6 leading-tight tracking-tighter italic uppercase">
                {course.title}
              </h1>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xl italic">
                {course.description}
              </p>
            </div>
          </div>
        </div>

        {/* --- SYLLABUS SECTION --- */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-800 mb-2 italic uppercase tracking-tighter">
              Learning Path
            </h2>
            <div className="h-1.5 w-16 bg-[#2D5A27] rounded-full"></div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
             <div className="flex items-center gap-1"><Lock size={12}/> 1 Lesson/Week</div>
             <div className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500"/> Sequence Enforced</div>
          </div>
        </div>

        <div className="space-y-10">
          {course.modules?.map((module: any, mIdx: number) => (
            <div key={module.id} className="relative">
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden">
                <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest italic">
                    Module {mIdx + 1}: <span className="text-gray-800 ml-2">{module.title}</span>
                  </h3>
                </div>

                <div className="divide-y divide-gray-50">
                  {module.lessons?.map((lesson: any) => {
                    const isLocked = lesson.is_locked && !isAdmin;
                    const isCompleted = lesson.is_completed;

                    return (
                      <div
                        key={lesson.id}
                        className={`p-6 md:px-10 flex flex-col md:row items-center justify-between transition-all gap-4 ${isLocked ? 'bg-gray-50/50 grayscale pointer-events-none' : 'hover:bg-green-50/20'}`}
                      >
                        <div className="flex items-center gap-6 w-full">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all shadow-sm ${
                            isCompleted ? 'bg-green-50 border-green-200 text-green-500' : 
                            isLocked ? 'bg-gray-100 border-gray-200 text-gray-400' : 
                            'bg-white border-gray-100 text-[#2D5A27]'
                          }`}>
                            {isCompleted ? <CheckCircle2 size={24} /> : isLocked ? <Lock size={24} /> : <PlayCircle size={24} />}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-black text-gray-800 text-lg uppercase italic leading-none mb-1">
                              Week {lesson.week_number}: {lesson.title}
                            </h4>
                            <div className="flex items-center gap-3">
                               {isLocked && lesson.unlock_date && (
                                 <span className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-1">
                                   <Calendar size={12}/> Unlocks: {new Date(lesson.unlock_date).toLocaleDateString()}
                                 </span>
                               )}
                               {!isLocked && !isCompleted && (
                                 <span className="text-[9px] font-black text-green-600 uppercase italic">Ready to Learn</span>
                               )}
                               {isCompleted && (
                                 <span className="text-[9px] font-black text-gray-400 uppercase italic">Review Lesson</span>
                               )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                          {isAdmin && (
                            <button onClick={() => navigate(`/admin/edit-lesson/${lesson.id}`)} className="p-3 bg-white border-2 border-orange-100 text-orange-400 rounded-xl hover:bg-orange-500 hover:text-white transition-all">
                              <Edit3 size={16} />
                            </button>
                          )}
                          
                          <button
                            disabled={isLocked}
                            onClick={() => navigate(`/lessons/${lesson.id}`)}
                            className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg flex items-center gap-2 ${
                              isLocked ? 'bg-gray-200 text-gray-400' : 'bg-[#2D5A27] text-white hover:bg-black active:scale-95'
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