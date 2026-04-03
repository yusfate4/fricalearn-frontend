import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 🚀 Added useLocation
import api from "../api/axios";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import {
  BookOpen,
  Clock,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  subject: string;
  level: string;
  full_thumbnail_url: string;
  total_lessons: number;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // 🚀 Used to trigger re-fetch on route change

  useEffect(() => {
    fetchCourses();
  }, [user, location.pathname]); // 🚀 Re-run when the path changes

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const activeStudentId = localStorage.getItem("active_student_id");

      // 🕵️ DEBUG LOG: Check your browser console for this!
      console.log("🔍 FETCHING COURSES FOR STUDENT ID:", activeStudentId);

      // Fallback: If we are a student but the ID isn't in storage, use user.id
      const finalId =
        activeStudentId || (user?.role === "student" ? user.id : null);

      const endpoint =
        user?.role === "parent"
          ? `/parent/courses?student_id=${finalId}`
          : "/courses";

      const res = await api.get(endpoint);

      // 🕵️ DEBUG LOG: What did the server say?
      console.log("📡 SERVER RESPONSE:", res.data);

      const courseData = res.data.data || res.data;
      setCourses(Array.isArray(courseData) ? courseData : []);
    } catch (err) {
      console.error("❌ Failed to load courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseId: number) => {
  
    navigate(`/course-detail/${courseId}`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 md:p-12 animate-in fade-in duration-700">
        {/* --- HEADER --- */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tighter italic uppercase leading-none">
              {user?.role === "parent" ? "My Children's" : "Explore"}{" "}
              <span className="text-[#2D5A27]">Courses</span>
            </h2>
            <div className="text-gray-400 font-bold mt-4 uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#2D5A27] animate-pulse"></div>
              <span>The Diaspora Academy Library</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#2D5A27] mb-4" size={40} />
            <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em]">
              Gathering Materials...
            </p>
          </div>
        ) : (
          <>
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                    className="group relative bg-white rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-4 transition-all duration-700 border-2 border-gray-50 cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={
                          course.full_thumbnail_url ||
                          (course.thumbnail_url?.startsWith("http")
                            ? course.thumbnail_url
                            : `http://127.0.0.1:8000/storage/${course.thumbnail_url}`)
                        }
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
                      <div className="absolute bottom-8 left-8 right-8">
                        <h3 className="text-2xl font-black text-white leading-none uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors">
                          {course.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-10 flex flex-col flex-grow">
                      <p className="text-gray-500 text-[11px] font-bold mb-10 leading-relaxed opacity-80 line-clamp-3">
                        {course.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-8">
                        <div className="w-14 h-14 rounded-[1.5rem] bg-gray-900 group-hover:bg-[#2D5A27] flex items-center justify-center transition-all duration-500 shadow-xl">
                          <ChevronRight className="text-white" size={24} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100 max-w-2xl mx-auto">
                <AlertCircle
                  size={40}
                  className="text-[#2D5A27] opacity-40 mx-auto mb-8"
                />
                <h3 className="text-3xl font-black text-gray-800 mb-4 italic uppercase tracking-tighter">
                  No courses found
                </h3>
                <p className="text-gray-400 font-bold text-sm max-w-xs mx-auto mb-8">
                  Check if the enrollment for this student is still active in
                  the admin panel.
                </p>
                <button
                  onClick={() => navigate("/parent/dashboard")}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2D5A27] transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Courses;
