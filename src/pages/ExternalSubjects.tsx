import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import {
  BookOpen,
  ChevronRight,
  AlertCircle,
  Loader2,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface ExternalSubject {
  id: number;
  name: string;
  key_stage: string;
  year_group: string;
  source: string;
  pivot: {
    enrolled_at: string;
    progress_percentage: number;
  };
  topics?: any[];
}

const ExternalSubjects = () => {
  const [subjects, setSubjects] = useState<ExternalSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/external/subjects");
      setSubjects(res.data.subjects || []);
    } catch (err) {
      console.error("❌ Failed to load external subjects:", err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = (subjectId: number) => {
    navigate(`/external-subjects/${subjectId}`);
  };

  const getSubjectImage = (name: string) => {
    if (name === "Maths") {
      return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80";
    }
    return "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80";
  };

  const getSubjectIcon = (name: string) => {
    if (name === "Maths") {
      return "🔢";
    }
    return "📚";
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 md:p-12 animate-in fade-in duration-700">
        {/* HEADER */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tighter italic uppercase leading-none">
              Bonus{" "}
              <span className="text-[#2D5A27]">Subjects</span>
            </h2>
            <div className="text-gray-400 font-bold mt-4 uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
              <Sparkles size={14} className="text-[#F4B400]" />
              <span>UK National Curriculum</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border-2 border-gray-50">
            <GraduationCap size={20} className="text-[#2D5A27]" />
            <div className="text-left">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Your Level
              </p>
              <p className="text-sm font-black text-gray-800 uppercase italic">
                Year {subjects[0]?.year_group || "7"} ({subjects[0]?.key_stage || "KS3"})
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#2D5A27] mb-4" size={40} />
            <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em]">
              Loading Subjects...
            </p>
          </div>
        ) : (
          <>
            {subjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    onClick={() => handleSubjectClick(subject.id)}
                    className="group relative bg-white rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-4 transition-all duration-700 border-2 border-gray-50 cursor-pointer flex flex-col"
                  >
                    {/* IMAGE SECTION */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={getSubjectImage(subject.name)}
                        alt={subject.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

                      {/* Subject Badge */}
                      <div className="absolute top-6 right-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">
                          {subject.key_stage}
                        </p>
                      </div>

                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="text-5xl mb-4">{getSubjectIcon(subject.name)}</div>
                        <h3 className="text-2xl font-black text-white leading-tight uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors">
                          {subject.name} Year {subject.year_group}
                        </h3>
                      </div>
                    </div>

                    {/* CONTENT SECTION */}
                    <div className="p-10 flex flex-col flex-grow">
                      <p className="text-gray-500 text-[11px] font-bold mb-10 leading-relaxed opacity-80">
                        UK National Curriculum • {subject.source}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-8">
                        <div className="flex items-center gap-4 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                          <BookOpen size={14} className="text-[#2D5A27]" />
                          <span>{subject.topics?.length || 0} Topics</span>
                        </div>

                        {/* Progress Badge */}
                        <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Progress
                          </p>
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2D5A27] transition-all duration-500"
                              style={{ width: `${subject.pivot.progress_percentage}%` }}
                            ></div>
                          </div>
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
                  No bonus subjects yet
                </h3>
                <p className="text-gray-400 font-bold text-sm max-w-xs mx-auto mb-8">
                  Complete your African language enrollment to unlock Maths and English!
                </p>
                <button
                  onClick={() => navigate("/courses")}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2D5A27] transition-all"
                >
                  Browse Courses
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ExternalSubjects;