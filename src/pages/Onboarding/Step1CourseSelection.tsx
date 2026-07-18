import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import { CheckCircle2, Loader2, ArrowRight, Award, BookOpen, GraduationCap, ChevronLeft } from "lucide-react";

interface Course {
  id: string; name: string; description: string;
  price_ngn: number; price_gbp: number; type: "paid" | "free";
  grades?: number[]; grade_labels?: string[];
  scholarship?: boolean; original_price_ngn?: number; original_price_gbp?: number;
  curriculum?: string; source?: string; icon: string;
}

const LANGUAGE_COURSES = ["yoruba", "igbo", "hausa"];

export default function Step1CourseSelection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [currency, setCurrency] = useState<"NGN" | "GBP">("NGN");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCourses(currency); setSelectedCourses([]); }, [currency]);

  const fetchCourses = async (cur: "NGN" | "GBP") => {
    setLoading(true);
    try {
      const res = await api.get(`/onboarding/courses?currency=${cur}`);
      setCourses(res.data.courses);
    } catch (err) { console.error("Failed to load courses", err); }
    finally { setLoading(false); }
  };

  const curriculumRegion = currency === "NGN" ? "nigeria" : "uk";

  const toggleCourse = (courseId: string) => {
    const isLanguage = LANGUAGE_COURSES.includes(courseId);

    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        // Deselect
        return prev.filter(id => id !== courseId);
      } else {
        if (isLanguage) {
          // ✅ Only 1 language at a time — replace any existing language
          const withoutLanguages = prev.filter(id => !LANGUAGE_COURSES.includes(id));
          return [...withoutLanguages, courseId];
        }
        return [...prev, courseId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedCourses.length === 0) return;
    navigate("/onboarding/step2", { state: { selectedCourses, currency, curriculumRegion } });
  };

  const getDisplayName = (name: string) =>
    name.replace(/\s*\((UK|Nigerian)\s*Curriculum\)/i, "").trim();

  const curriculumLabel = currency === "NGN" ? "🇳🇬 Nigerian Curriculum (NERDC)" : "🇬🇧 UK National Curriculum (Oak)";
  const gradeRangeLabel = currency === "NGN" ? "Primary 1–6 & JSS 1–3" : "Year 1–11";

  if (loading) return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-[#3F2171] mb-4" size={40} />
        <p className="font-black text-gray-300 uppercase italic text-[10px] tracking-widest">Loading Courses...</p>
      </div>
    </Layout>
  );

  const selectedLanguage = selectedCourses.find(id => LANGUAGE_COURSES.includes(id));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-10 md:px-12 md:py-16 animate-in fade-in duration-700">
        <div className="mb-12">
          <button onClick={() => navigate("/parent/dashboard")}
            className="group flex items-center gap-2 text-gray-400 hover:text-[#3F2171] transition-colors mb-8">
            <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#3F2171]/10"><ChevronLeft size={20}/></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Dashboard</span>
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Step 1 of 4</p>
              <h1 className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight mb-4">
                Choose <span className="text-[#3F2171]">Courses</span>
              </h1>
              <p className="text-gray-500 font-bold text-sm max-w-2xl">
                Select subjects and <span className="text-[#3F2171] font-black">one</span> free language course.
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex bg-gray-100 p-1.5 rounded-[2.5rem] border-2 border-gray-200 shadow-inner">
                <button onClick={() => setCurrency("NGN")}
                  className={`px-8 py-4 rounded-[2rem] font-black text-[10px] tracking-widest transition-all ${currency === "NGN" ? "bg-white text-[#3F2171] shadow-lg" : "text-gray-400"}`}>
                  🇳🇬 NAIRA (₦)
                </button>
                <button onClick={() => setCurrency("GBP")}
                  className={`px-8 py-4 rounded-[2rem] font-black text-[10px] tracking-widest transition-all ${currency === "GBP" ? "bg-white text-[#3F2171] shadow-lg" : "text-gray-400"}`}>
                  🇬🇧 POUNDS (£)
                </button>
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{curriculumLabel}</p>
            </div>
          </div>
        </div>

        {/* Language notice */}
        {selectedLanguage && (
          <div className="mb-6 px-6 py-4 bg-[#FFFF00]/10 border-2 border-[#FFFF00]/30 rounded-2xl flex items-center gap-3">
            <Award size={18} className="text-[#FFFF00]" />
            <p className="text-sm font-black text-gray-700 uppercase tracking-wide">
              1 free language selected: <span className="text-[#3F2171]">{selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}</span>
              <span className="text-gray-400 font-normal text-xs ml-2">(Select another to switch)</span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {courses.map((course) => {
            const isSelected = selectedCourses.includes(course.id);
            const isLanguage = LANGUAGE_COURSES.includes(course.id);
            const price = currency === "NGN" ? course.price_ngn : course.price_gbp;
            const originalPrice = currency === "NGN" ? course.original_price_ngn : course.original_price_gbp;

            return (
              <div key={course.id} onClick={() => toggleCourse(course.id)}
                className={`relative bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border-4 cursor-pointer transition-all duration-500 group ${
                  isSelected ? "border-[#3F2171] shadow-2xl -translate-y-2" : "border-gray-100 hover:border-gray-200 shadow-sm"
                }`}>

                {/* Language — radio indicator */}
                {isLanguage && (
                  <div className="absolute top-6 right-6 bg-[#FFFF00] text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
                    <Award size={14}/>
                    <span className="text-[8px] font-black uppercase tracking-widest">Free · Pick 1</span>
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-6 left-6 bg-[#3F2171] p-3 rounded-2xl text-white shadow-xl animate-in zoom-in duration-300">
                    <CheckCircle2 size={20}/>
                  </div>
                )}

                <div className="mb-6 flex justify-center">
                  <div className={`p-6 rounded-3xl ${isSelected ? "bg-[#3F2171]/10" : "bg-gray-50"} transition-colors`}>
                    {course.id === "maths" ? <BookOpen size={40} className="text-blue-500"/>
                      : course.id === "english" ? <BookOpen size={40} className="text-purple-500"/>
                      : <GraduationCap size={40} className="text-[#3F2171]"/>}
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-gray-800 italic uppercase tracking-tighter mb-3 text-center">
                  {getDisplayName(course.name)}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed mb-6 text-center min-h-[3rem]">
                  {course.description}
                </p>

                <div className="text-center pt-6 border-t border-gray-100">
                  {course.scholarship ? (
                    <div>
                      <p className="text-gray-400 text-sm line-through mb-1">
                        {currency === "NGN" ? "₦" : "£"}{originalPrice?.toLocaleString()}
                      </p>
                      <p className="text-3xl font-black text-[#3F2171] italic">FREE</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#FFFF00] mt-2">Full Scholarship Applied</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Monthly</p>
                      <p className="text-3xl font-black text-[#3F2171] italic">
                        {currency === "NGN" ? "₦" : "£"}{price?.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {(course.grades || course.grade_labels) && (
                  <div className="mt-4 text-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
                      {curriculumLabel.split("(")[0].trim()} • {gradeRangeLabel}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedCourses.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-gray-100 p-6 md:p-8 z-[60] shadow-[0_-20px_50px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom duration-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  {selectedCourses.length} Course{selectedCourses.length !== 1 ? "s" : ""} Selected
                </p>
                <p className="text-sm font-bold text-gray-600">
                  {selectedCourses.map(id => courses.find(c => c.id === id)?.name.split(" ")[0]).join(", ")}
                </p>
              </div>
              <button onClick={handleContinue}
                className="group flex items-center justify-center gap-4 bg-[#3F2171] text-white px-10 py-6 rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-black transition-all border-b-4 border-[#1E1038] active:translate-y-1 active:border-b-0 w-full md:w-auto">
                Continue to Grade Selection
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
