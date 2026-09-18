import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PlayCircle,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function ExternalSubjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State to track which topic is currently open
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);

  useEffect(() => {
    fetchSubject();
  }, [id]);

  const fetchSubject = async () => {
    setLoading(true);
    try {
      const sid = localStorage.getItem("active_student_id");
      const endpoint = sid
        ? `/external/subjects/${id}?student_id=${sid}`
        : `/external/subjects/${id}`;
      const res = await api.get(endpoint);
      setSubject(res.data.subject);
    } catch (err) {
      console.error("Failed to load subject:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="p-20 text-center font-black text-[#3F2171] animate-pulse italic uppercase tracking-tighter text-xl md:text-2xl">
            Loading Subject...
          </div>
        </div>
      </Layout>
    );

  if (!subject)
    return (
      <Layout>
        <div className="p-20 text-center">
          <h2 className="text-red-500 font-black uppercase text-xl mb-4">
            Subject Not Found
          </h2>
          <button
            onClick={() => navigate("/courses")}
            className="text-[#3F2171] font-bold underline"
          >
            Return to Subjects
          </button>
        </div>
      </Layout>
    );

  const getSubjectImage = (name: string) => {
    if (name === "Maths") {
      return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80";
    }
    return "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80";
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-10 pb-32">
        {/* Back Navigation */}
        <button
          onClick={() => navigate("/courses")}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#3F2171] mb-8 transition-all font-black uppercase text-[10px] tracking-widest"
        >
          <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-[#3F2171]/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          Back to Library
        </button>

        {/* SUBJECT HERO */}
        <div className="relative bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/5 lg:w-1/3 aspect-square relative bg-gray-50">
              <img
                src={getSubjectImage(subject.name)}
                className="w-full h-full object-cover"
                alt={subject.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="w-full md:w-3/5 lg:w-2/3 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                <span className="bg-[#3F2171]/10 text-[#3F2171] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {subject.key_stage}
                </span>
                <span className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest border-l pl-3 border-gray-200">
                  Year {subject.year_group}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-800 mb-6 leading-tight tracking-tighter italic uppercase">
                {subject.name}
              </h1>
              <p className="text-gray-500 font-medium leading-relaxed italic text-base md:text-lg max-w-2xl">
                {subject.source} • UK National Curriculum
              </p>
            </div>
          </div>
        </div>

        {/* TOPICS HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-2 italic uppercase tracking-tighter">
              Learning Topics
            </h2>
            <div className="h-1.5 w-16 bg-[#3F2171] rounded-full mx-auto md:mx-0"></div>
          </div>
        </div>

        {/* TOPICS & LESSONS ACCORDION */}
        <div className="space-y-6">
          {subject.topics?.map((topic: any, topicIdx: number) => {
            const isExpanded = expandedTopic === topic.id;

            return (
              <div key={topic.id} className="relative">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden transition-all duration-300">
                  
                  {/* TOPIC HEADER BUTTON */}
                  <button
                    onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                    className="w-full text-left px-8 py-8 md:px-10 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 pr-6">
                      <h3 className="text-base md:text-xl font-black text-gray-700 uppercase tracking-tight italic flex items-center gap-4">
                        <span className="bg-[#3F2171] text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs not-italic shadow-md shrink-0">
                          {topicIdx + 1}
                        </span>
                        {topic.title}
                      </h3>
                      {topic.description && (
                        <p className="text-gray-400 text-sm mt-3 ml-12">
                          {topic.description}
                        </p>
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-full transition-all duration-300 shrink-0 ${
                        isExpanded
                          ? "bg-[#3F2171] text-white rotate-180 shadow-md"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <ChevronDown size={24} />
                    </div>
                  </button>

                  {/* LESSONS LIST (Only shows when clicked) */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-100 border-t-2 border-gray-50 bg-gray-50/30 animate-in slide-in-from-top-4 duration-300">
                      {topic.lessons?.map((lesson: any) => {
                        const userProgress = lesson.user_progress?.[0];
                        const isCompleted = userProgress?.status === "completed";

                        return (
                          <div
                            key={lesson.id}
                            className="p-6 md:p-10 flex flex-col lg:flex-row items-center justify-between transition-all gap-8 hover:bg-white"
                          >
                            <div className="flex items-center gap-6 md:gap-10 w-full">
                              <div
                                className={`w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-[1.5rem] flex items-center justify-center border-2 shadow-sm transition-all ${
                                  isCompleted
                                    ? "bg-[#3F2171]/10 border-[#3F2171]/20 text-[#3F2171]"
                                    : "bg-white border-gray-100 text-[#3F2171]"
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 size={32} />
                                ) : (
                                  <PlayCircle size={36} />
                                )}
                              </div>

                              <div className="flex-1 text-left">
                                <h4 className="font-black text-gray-800 text-lg md:text-2xl uppercase italic leading-tight mb-2 tracking-tight">
                                  {lesson.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-4 mt-3">
                                  <span
                                    className={`text-[10px] font-black uppercase italic ${
                                      isCompleted ? "text-gray-400" : "text-[#3F2171]"
                                    }`}
                                  >
                                    {isCompleted
                                      ? `Completed • Score: ${userProgress.quiz_score}%`
                                      : "Available"}
                                  </span>
                                  {lesson.duration_minutes && (
                                    <span className="text-[10px] font-black text-gray-400 uppercase border-l pl-4 border-gray-200">
                                      {lesson.duration_minutes} min
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                navigate(`/external-lessons/${lesson.id}`)
                              }
                              className="w-full lg:w-auto px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 bg-[#3F2171] text-white hover:bg-black active:scale-95 hover:-translate-y-1"
                            >
                              {isCompleted ? "Review" : "Start Now"}
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        );
                      })}
                      
                      {(!topic.lessons || topic.lessons.length === 0) && (
                         <div className="p-10 text-center text-gray-400 font-bold text-sm uppercase tracking-widest">
                           Lessons coming soon
                         </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}