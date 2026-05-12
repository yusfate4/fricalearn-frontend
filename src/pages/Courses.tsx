import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import {
  BookOpen,
  ChevronRight,
  AlertCircle,
  Loader2,
  Layers,
  Sparkles,
  GraduationCap,
} from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  subject: string;
  level: string;
  thumbnail_url: string;
  modules_count?: number;
}

interface ExternalSubject {
  id: number;
  name: string;
  key_stage: string;
  year_group: string;
  pivot: {
    progress_percentage: number;
  };
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [externalSubjects, setExternalSubjects] = useState<ExternalSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCourses();
    fetchExternalSubjects();
  }, [user, location.pathname]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const activeStudentId = localStorage.getItem("active_student_id");
      const endpoint =
        user?.role === "parent" && activeStudentId
          ? `/parent/courses?student_id=${activeStudentId}`
          : "/courses";

      const res = await api.get(endpoint);
      const courseData = res.data.data || res.data;
      setCourses(Array.isArray(courseData) ? courseData : []);
    } catch (err) {
      console.error("❌ Failed to load courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

const fetchExternalSubjects = async () => {
  try {
    const activeStudentId = localStorage.getItem("active_student_id");
    const endpoint =
      user?.role === "parent" && activeStudentId
        ? `/external/subjects?student_id=${activeStudentId}`
        : "/external/subjects";

    console.log('🔍 Fetching external subjects for student:', activeStudentId);
    const res = await api.get(endpoint);
    console.log('✅ Response:', res.data);
    setExternalSubjects(res.data.subjects || []);
  } catch (err) {
    console.error("❌ Failed to load external subjects:", err);
    setExternalSubjects([]);
  }
};

  const handleCourseClick = (courseId: number) => {
    navigate(`/course-detail/${courseId}`);
  };

  const handleExternalSubjectClick = (subjectId: number) => {
    navigate(`/external-subjects/${subjectId}`);
  };

  const getSubjectImage = (name: string) => {
    if (name === "Maths") {
      return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80";
    }
    return "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80";
  };

  const getSubjectIcon = (name: string) => {
    if (name === "Maths") return "🔢";
    return "📚";
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 md:p-12 animate-in fade-in duration-700">
        {/* HEADER */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tighter italic uppercase leading-none">
              {user?.role === "parent" ? "Assigned" : "Explore"}{" "}
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
            {/* BONUS SUBJECTS SECTION */}
            {externalSubjects.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Sparkles size={24} className="text-[#F4B400]" />
                    <h3 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter">
                      Bonus Subjects
                    </h3>
                  </div>
                  <button
                    onClick={() => navigate("/external-subjects")}
                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#2D5A27] transition-all"
                  >
                    View All →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                  {externalSubjects.slice(0, 2).map((subject) => (
                    <div
                      key={subject.id}
                      onClick={() => handleExternalSubjectClick(subject.id)}
                      className="group relative bg-gradient-to-br from-[#2D5A27] to-[#1a3518] rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer p-8 md:p-10"
                    >
                      <div className="absolute top-0 right-0 text-[120px] opacity-10 pointer-events-none">
                        {getSubjectIcon(subject.name)}
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/30">
                            {subject.key_stage} • Year {subject.year_group}
                          </span>
                          <GraduationCap className="text-[#F4B400]" size={28} />
                        </div>

                        <h4 className="text-3xl md:text-4xl font-black text-white mb-4 italic uppercase tracking-tight">
                          {subject.name}
                        </h4>

                        <p className="text-white/80 font-bold text-sm mb-6">
                          UK National Curriculum
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">
                              Progress
                            </p>
                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#F4B400] transition-all duration-500"
                                style={{
                                  width: `${subject.pivot.progress_percentage}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="w-12 h-12 rounded-[1.2rem] bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300 border border-white/30">
                            <ChevronRight className="text-white" size={20} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gray-200 my-16"></div>
              </div>
            )}

            {/* MAIN COURSES SECTION */}
            <div className="mb-10">
              <h3 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter mb-8">
                African Language Courses
              </h3>
            </div>

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                    className="group relative bg-white rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-4 transition-all duration-700 border-2 border-gray-50 cursor-pointer flex flex-col"
                  >
                    {/* IMAGE SECTION */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={
                          course.thumbnail_url ||
                          "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&q=80"
                        }
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/600x400?text=Course+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

                      {/* Course Badge */}
                      <div className="absolute top-6 right-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">
                          {course.level || "All Levels"}
                        </p>
                      </div>

                      <div className="absolute bottom-8 left-8 right-8">
                        <h3 className="text-2xl font-black text-white leading-tight uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors">
                          {course.title}
                        </h3>
                      </div>
                    </div>

                    {/* CONTENT SECTION */}
                    <div className="p-10 flex flex-col flex-grow">
                      <p className="text-gray-500 text-[11px] font-bold mb-10 leading-relaxed opacity-80 line-clamp-3">
                        {course.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-8">
                        <div className="flex items-center gap-4 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                          <Layers size={14} className="text-[#2D5A27]" />
                          <span>{course.modules_count || 0} Modules</span>
                        </div>

                        <div className="w-12 h-12 rounded-[1.2rem] bg-gray-900 group-hover:bg-[#2D5A27] flex items-center justify-center transition-all duration-500 shadow-lg">
                          <ChevronRight className="text-white" size={20} />
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
                  Check if the enrollment for this student is still active or
                  contact support.
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
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