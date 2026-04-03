import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PlayCircle,
  ArrowLeft,
  BookOpen,
  Clock,
  ChevronRight,
  Edit3,
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
    api
      .get("/me")
      .then((res) => {
        setIsAdmin(res.data.is_admin === 1 || res.data.is_admin === true);
      })
      .catch(() => setIsAdmin(false));

    // 2. Fetch Course & Lessons
    api
      .get(`/courses/${id}`)
      .then((res) => {
        setCourse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <Layout>
        <div className="p-20 text-center font-black text-gray-300 animate-pulse italic">
          Opening FricaLearn Syllabus...
        </div>
      </Layout>
    );

  if (!course)
    return (
      <Layout>
        <div className="p-20 text-center text-red-500 font-bold uppercase tracking-widest">
          Course not found.
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 md:p-10">
        <button
          onClick={() => navigate("/courses")}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#2D5A27] mb-10 transition-all font-black uppercase text-xs tracking-widest"
        >
          <div className="p-2 rounded-full bg-white shadow-sm group-hover:shadow-md group-hover:-translate-x-1 transition-all">
            <ArrowLeft size={16} />
          </div>
          Back to library
        </button>

        {/* --- HERO CARD --- */}
        <div className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white mb-16 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 aspect-video md:aspect-auto relative bg-gray-100">
              <img
                src={
                  course.thumbnail_url?.startsWith("http")
                    ? course.thumbnail_url
                    : `http://127.0.0.1:8000/storage/${course.thumbnail_url}` // 🚀 Add the storage prefix
                }
                className="w-full h-full object-cover"
                alt={course.title}
                onError={(e: any) => {
                  // Fallback if the image is actually missing from the server
                  e.target.src =
                    "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&q=80";
                }}
              />
            </div>

            <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-green-50 text-[#2D5A27] px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  {course.subject}
                </span>
                <span className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">
                  {course.level}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-6 leading-tight tracking-tighter italic">
                {course.title}
              </h1>

              <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-xl">
                {course.description}
              </p>
            </div>
          </div>
        </div>

        {/* --- SYLLABUS SECTION --- */}
        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-800 mb-2 italic uppercase tracking-tighter">
            Course Syllabus
          </h2>
          <div className="h-1.5 w-20 bg-[#2D5A27] rounded-full"></div>
        </div>

        <div className="space-y-12 relative">
          <div className="absolute left-6 top-4 bottom-4 w-1 bg-gray-100 rounded-full hidden md:block"></div>

          {course.modules?.map((module: any, index: number) => (
            <div
              key={module.id}
              className="relative md:pl-20 animate-in slide-in-from-bottom-4"
            >
              <div className="absolute left-0 top-0 hidden md:flex w-12 h-12 rounded-2xl bg-white border-4 border-gray-50 shadow-sm items-center justify-center text-[#2D5A27] font-black z-10 shadow-green-100">
                {index + 1}
              </div>

              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-50">
                <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100">
                  <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 uppercase tracking-tight italic">
                    <span className="text-[#2D5A27] opacity-30 text-xs">
                      MODULE {index + 1}
                    </span>
                    {module.title}
                  </h3>
                </div>

                <div className="divide-y divide-gray-50">
                  {module.lessons?.map((lesson: any) => (
                    <div
                      key={lesson.id}
                      className="group p-6 md:px-8 flex flex-col sm:flex-row items-center justify-between hover:bg-green-50/30 transition-all gap-4"
                    >
                      <div
                        className="flex items-center space-x-6 cursor-pointer w-full"
                        onClick={() => navigate(`/lessons/${lesson.id}`)}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-[#2D5A27] group-hover:border-[#2D5A27] transition-all shadow-sm">
                          <PlayCircle size={24} />
                        </div>
                        <div>
                          <span className="font-black text-gray-700 block text-lg group-hover:text-gray-900 transition-colors">
                            {lesson.title}
                          </span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            {lesson.practice_word ? (
                              <span className="text-orange-500 italic">
                                🎯 Target: {lesson.practice_word}
                              </span>
                            ) : (
                              "Video Lesson • 1 Quiz"
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        {/* 🚀 QUICK EDIT BUTTON */}
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/edit-lesson/${lesson.id}`);
                            }}
                            className="p-3 bg-white border-2 border-orange-100 text-orange-400 hover:bg-orange-500 hover:text-white rounded-xl transition-all shadow-sm flex items-center gap-2 font-black text-[10px] uppercase"
                            title="Edit AI Practice Word"
                          >
                            <Edit3 size={16} />{" "}
                            <span className="hidden lg:inline">Edit</span>
                          </button>
                        )}

                        <button
                          onClick={() => navigate(`/lessons/${lesson.id}`)}
                          className="bg-white border-2 border-gray-100 text-gray-400 group-hover:border-[#2D5A27] group-hover:bg-[#2D5A27] group-hover:text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                        >
                          Start <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
