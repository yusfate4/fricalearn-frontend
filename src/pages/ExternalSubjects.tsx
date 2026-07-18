import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { BookOpen, ChevronRight, AlertCircle, Loader2, GraduationCap, Sparkles } from "lucide-react";

interface ExternalSubject {
  id: number; name: string; key_stage: string;
  year_group: string; source: string;
  curriculum_region: string; topics_count: number;
  pivot: { enrolled_at: string; progress_percentage: number };
}

// Subject-specific colours
const SUBJECT_THEME = (name: string, region: string) => {
  const n = name.toLowerCase();
  if (n.includes("math") || n.includes("maths")) return { bg: "from-blue-600 to-blue-800", badge: "bg-blue-500", icon: "🔢" };
  if (n.includes("english"))                      return { bg: "from-purple-600 to-purple-800", badge: "bg-purple-500", icon: "📚" };
  if (region === "nigeria")                       return { bg: "from-[#3F2171] to-[#2A1650]", badge: "bg-green-500", icon: "🇳🇬" };
  return { bg: "from-gray-700 to-gray-900", badge: "bg-gray-500", icon: "📖" };
};

const ExternalSubjects = () => {
  const [subjects, setSubjects] = useState<ExternalSubject[]>([]);
  const [loading, setLoading]   = useState(true);
  const { user }  = useAuth();
  const navigate  = useNavigate();

  useEffect(() => { fetchSubjects(); }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const sid = localStorage.getItem("active_student_id");
      const ep  = user?.role === "parent" && sid
        ? `/external/subjects?student_id=${sid}`
        : `/external/subjects`;
      const res = await api.get(ep);
      setSubjects(res.data.subjects || []);
    } catch (err) {
      console.error("Failed to load subjects:", err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 md:p-12 animate-in fade-in duration-700">

        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tighter italic uppercase leading-none">
              My <span className="text-[#3F2171]">Subjects</span>
            </h2>
            <div className="text-gray-400 font-bold mt-3 uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
              <Sparkles size={14} className="text-[#FFFF00]"/>
              <span>Your enrolled curriculum</span>
            </div>
          </div>

          {!loading && subjects.length > 0 && (
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border-2 border-gray-50">
              <GraduationCap size={20} className="text-[#3F2171]"/>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Curriculum</p>
                <p className="text-sm font-black text-gray-800 uppercase italic">
                  {subjects[0]?.curriculum_region === "nigeria" ? "🇳🇬 Nigerian (NERDC)" : "🇬🇧 UK National (Oak)"}
                </p>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#3F2171] mb-4" size={40}/>
            <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em]">Loading Subjects...</p>
          </div>
        ) : subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjects.map((subject) => {
              const theme    = SUBJECT_THEME(subject.name, subject.curriculum_region);
              const progress = subject.pivot.progress_percentage || 0;
              const displayName = subject.name
                .replace(/\s*\((KS\d|KS\d-\d)\)/i, "")
                .replace(/\s*\(KS\d\)/i, "")
                .trim();

              return (
                <div key={subject.id} onClick={() => navigate(`/external-subjects/${subject.id}`)}
                  className="group bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border-2 border-gray-50 cursor-pointer">

                  {/* Gradient header */}
                  <div className={`bg-gradient-to-br ${theme.bg} p-10 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
                      style={{ background: "radial-gradient(circle,#fff,transparent)", transform: "translate(30%,-30%)" }}/>
                    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-5"
                      style={{ background: "radial-gradient(circle,#fff,transparent)", transform: "translate(-30%,30%)" }}/>

                    <div className="flex items-start justify-between relative z-10">
                      <div>
                        <span className="text-5xl mb-4 block">{theme.icon}</span>
                        <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tight leading-tight">
                          {displayName}
                        </h3>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-2">
                          {subject.source} · {subject.key_stage}
                        </p>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all shrink-0">
                        <ChevronRight className="text-white" size={22}/>
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-black text-gray-800">{subject.topics_count}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Topics</p>
                      </div>
                      <div className="w-px h-10 bg-gray-100"/>
                      <div className="flex items-center gap-2 text-gray-400">
                        <BookOpen size={16} className="text-[#3F2171]"/>
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {subject.curriculum_region === "nigeria" ? "NERDC Aligned" : "Oak Academy"}
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Progress</p>
                      <div className="w-28 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#3F2171] rounded-full transition-all duration-700"
                          style={{ width: `${progress}%` }}/>
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 mt-1">{progress}% complete</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100 max-w-2xl mx-auto">
            <AlertCircle size={40} className="text-[#3F2171] opacity-40 mx-auto mb-8"/>
            <h3 className="text-3xl font-black text-gray-800 mb-4 italic uppercase tracking-tighter">No subjects yet</h3>
            <p className="text-gray-400 font-bold text-sm max-w-xs mx-auto mb-8">
              Complete enrolment to unlock your curriculum subjects!
            </p>
            <button onClick={() => navigate("/onboarding/step1")}
              className="px-8 py-4 bg-[#3F2171] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
              Enrol Now
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExternalSubjects;
