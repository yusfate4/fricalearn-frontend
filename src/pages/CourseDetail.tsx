import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PlayCircle,
  ArrowLeft,
  BookOpen,
  Clock,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        <div className="p-20 text-center font-black text-gray-300 animate-pulse">
          Loading Academy Content...
        </div>
      </Layout>
    );
  if (!course)
    return (
      <Layout>
        <div className="p-20 text-center text-red-500 font-bold">
          Course not found.
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 md:p-10">
        {/* --- 1. ENHANCED BACK BUTTON --- */}
        <button
          onClick={() => navigate("/courses")}
          className="group flex items-center gap-2 text-gray-400 hover:text-frica-green mb-10 transition-all font-black uppercase text-xs tracking-widest"
        >
          <div className="p-2 rounded-full bg-white shadow-sm group-hover:shadow-md group-hover:-translate-x-1 transition-all">
            <ArrowLeft size={16} />
          </div>
          Back to library
        </button>

        {/* --- 2. HERO COURSE CARD --- */}
        <div className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white mb-16 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col md:flex-row">
            {/* Visual Side */}
            <div className="md:w-1/3 aspect-video md:aspect-auto relative bg-gray-100">
              <img
                src={
                  course.thumbnail_url ||
                  "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&q=80"
                }
                className="w-full h-full object-cover"
                alt={course.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Content Side */}
            <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-green-50 text-frica-green px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  {course.subject}
                </span>
                <span className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">
                  {course.level}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-6 leading-tight tracking-tighter">
                {course.title}
              </h1>

              <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-xl">
                {course.description}
              </p>

              <div className="mt-8 flex items-center gap-6 border-t border-gray-50 pt-8">
                <div className="flex items-center gap-2 text-gray-400">
                  <BookOpen size={18} className="text-frica-green" />
                  <span className="text-xs font-black uppercase">
                    {course.modules?.length || 0} Modules
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={18} className="text-frica-green" />
                  <span className="text-xs font-black uppercase">
                    Self-Paced
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 3. TIMELINE SYLLABUS --- */}
        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-800 mb-2 italic uppercase tracking-tighter">
            Course Syllabus
          </h2>
          <div className="h-1.5 w-20 bg-frica-green rounded-full"></div>
        </div>

        <div className="space-y-12 relative">
          {/* Vertical Line for Timeline */}
          <div className="absolute left-6 top-4 bottom-4 w-1 bg-gray-100 rounded-full hidden md:block"></div>

          {course.modules?.length === 0 ? (
            <div className="p-12 bg-white rounded-[2.5rem] border-4 border-dashed border-gray-100 text-center">
              <p className="text-gray-300 font-black text-xl uppercase italic">
                No lessons launched yet!
              </p>
            </div>
          ) : (
            course.modules?.map((module: any, index: number) => (
              <div
                key={module.id}
                className="relative md:pl-20 animate-in slide-in-from-bottom-4 duration-700"
              >
                {/* Module Circle Marker */}
                <div className="absolute left-0 top-0 hidden md:flex w-12 h-12 rounded-2xl bg-white border-4 border-gray-50 shadow-sm items-center justify-center text-frica-green font-black z-10">
                  {index + 1}
                </div>

                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-50">
                  <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-50">
                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 uppercase tracking-tight">
                      <span className="text-frica-green opacity-30 text-xs italic">
                        MODULE {index + 1}
                      </span>
                      {module.title}
                    </h3>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {module.lessons?.map((lesson: any) => (
                      <div
                        key={lesson.id}
                        className="group p-6 md:px-8 flex items-center justify-between hover:bg-green-50/30 transition-all cursor-pointer"
                        onClick={() => navigate(`/lessons/${lesson.id}`)}
                      >
                        <div className="flex items-center space-x-6">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-frica-green group-hover:border-frica-green transition-all shadow-sm">
                            <PlayCircle size={24} />
                          </div>
                          <div>
                            <span className="font-black text-gray-700 block text-lg group-hover:text-gray-900 transition-colors">
                              {lesson.title}
                            </span>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                              Video Lesson • 1 Quiz
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <button className="bg-white border-2 border-gray-100 text-gray-400 group-hover:border-frica-green group-hover:bg-frica-green group-hover:text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-sm group-hover:shadow-lg shadow-green-100 flex items-center gap-2">
                            Start <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {module.lessons?.length === 0 && (
                      <div className="p-8 text-center bg-gray-50/30">
                        <p className="text-gray-300 font-bold italic text-sm italic">
                          New lessons are coming soon to this module!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
