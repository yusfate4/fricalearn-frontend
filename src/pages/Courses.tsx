import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import { BookOpen, Clock, ChevronRight } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  subject: string;
  level: string;
  thumbnail_url?: string; // 👈 Added this for the UI
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get("/courses")
      .then((res) => {
        const courseData = res.data.data || res.data;
        setCourses(Array.isArray(courseData) ? courseData : []);
      })
      .catch((err) => {
        console.error("Failed to load courses:", err);
        setCourses([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-10 flex items-center justify-between">
            <div>
                <h2 className="text-4xl font-black text-gray-800 tracking-tight">Explore Courses</h2>
                <p className="text-gray-400 font-bold mt-1 uppercase text-xs tracking-[0.2em]">The Diaspora Academy Library</p>
            </div>
            <div className="hidden md:flex gap-2">
                <span className="px-4 py-2 bg-white rounded-full border border-gray-100 text-xs font-black text-frica-green shadow-sm">YORUBA</span>
                <span className="px-4 py-2 bg-white rounded-full border border-gray-100 text-xs font-black text-yellow-600 shadow-sm">HAUSA</span>
            </div>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-[2.5rem]"></div>)}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-gray-50 cursor-pointer flex flex-col"
                    >
                        {/* --- Course Image Container --- */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <img 
                                src={course.thumbnail_url || 'https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&q=80'} 
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="absolute top-5 left-5">
                                <span className="bg-white/95 backdrop-blur-md text-frica-green px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-xl">
                                    {course.subject}
                                </span>
                            </div>
                        </div>

                        {/* --- Course Body --- */}
                        <div className="p-8 flex flex-col flex-grow">
                            <div className="mb-4">
                                <h3 className="text-2xl font-black text-gray-800 leading-tight group-hover:text-frica-green transition-colors">
                                    {course.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <Clock size={14} className="text-gray-300" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{course.level}</span>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">
                                {course.description}
                            </p>

                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-frica-green">
                                        <BookOpen size={16} />
                                    </div>
                                    <span className="text-xs font-black text-gray-400 uppercase">Self-Paced</span>
                                </div>
                                
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 group-hover:bg-frica-green flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-100">
                                    <ChevronRight className="text-gray-300 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {!loading && courses.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-50 animate-in fade-in duration-700">
             <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={40} className="text-frica-green opacity-20" />
             </div>
             <h3 className="text-2xl font-black text-gray-800 mb-2">The library is being stocked!</h3>
             <p className="text-gray-400 font-bold max-w-xs mx-auto">
                Our tutors are currently uploading new Yoruba and Hausa content. Check back in a few hours!
             </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Courses;