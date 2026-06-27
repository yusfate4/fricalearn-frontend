import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlayCircle, ArrowLeft, CheckCircle2, Lock, ChevronDown, ChevronRight, BookOpen, Clock } from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

// Gradient palettes for topics (cycles through)
const TOPIC_GRADIENTS = [
  "from-blue-500 to-blue-700",
  "from-purple-500 to-purple-700",
  "from-emerald-500 to-emerald-700",
  "from-orange-500 to-orange-700",
  "from-rose-500 to-rose-700",
  "from-cyan-500 to-cyan-700",
  "from-indigo-500 to-indigo-700",
  "from-amber-500 to-amber-700",
];

export default function ExternalSubjectView() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const [subject, setSubject]           = useState<any>(null);
  const [loading, setLoading]           = useState(true);
  const [openTopics, setOpenTopics]     = useState<Set<number>>(new Set([0])); // first topic open by default

  useEffect(() => { fetchSubject(); }, [id]);

  const fetchSubject = async () => {
    setLoading(true);
    try {
      const sid = localStorage.getItem("active_student_id");
      const ep  = user?.role === "parent" && sid
        ? `/external/subjects/${id}?student_id=${sid}`
        : `/external/subjects/${id}`;
      const res = await api.get(ep);
      setSubject(res.data.subject);
    } catch (err) {
      console.error("Failed to load subject:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (idx: number) => {
    setOpenTopics(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin mx-auto mb-6"/>
          <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Loading Subject...</p>
        </div>
      </div>
    </Layout>
  );

  if (!subject) return (
    <Layout>
      <div className="p-20 text-center">
        <h2 className="text-red-500 font-black uppercase text-xl mb-4">Subject Not Found</h2>
        <button onClick={() => navigate("/external-subjects")} className="text-[#2D5A27] font-bold underline">
          Return to Subjects
        </button>
      </div>
    </Layout>
  );

  const displayName = subject.name
    .replace(/\s*\((KS\d)\)/i, "")
    .trim();
  const totalLessons  = subject.topics?.reduce((sum: number, t: any) => sum + (t.lessons?.length || 0), 0) || 0;
  const completedLessons = subject.topics?.reduce((sum: number, t: any) =>
    sum + (t.lessons?.filter((l: any) => l.userProgress?.[0]?.status === "completed").length || 0), 0) || 0;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const subjectIcon = displayName.toLowerCase().includes("math") ? "🔢" : "📚";
  const subjectColor = displayName.toLowerCase().includes("math")
    ? "from-blue-600 to-blue-800"
    : "from-purple-600 to-purple-800";

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 md:p-10 pb-20">

        {/* Back */}
        <button onClick={() => navigate("/external-subjects")}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#2D5A27] mb-8 transition-all font-black uppercase text-[10px] tracking-widest">
          <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-[#2D5A27]/10 transition-all">
            <ArrowLeft size={16}/>
          </div>
          Back to My Subjects
        </button>

        {/* Subject hero */}
        <div className={`bg-gradient-to-br ${subjectColor} rounded-[2.5rem] p-10 md:p-14 text-white mb-10 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle,#fff,transparent)", transform: "translate(30%,-30%)" }}/>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <span className="text-5xl block mb-4">{subjectIcon}</span>
              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-3">
                {displayName}
              </h1>
              <div className="flex items-center gap-4 text-white/70 text-sm font-bold">
                <span>{subject.source}</span>
                <span>·</span>
                <span>{subject.key_stage}</span>
                <span>·</span>
                <span>{subject.topics?.length || 0} Topics</span>
              </div>
            </div>

            {/* Progress circle */}
            <div className="shrink-0 text-center">
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-24 h-24 -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8"/>
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#F4B400" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallProgress / 100)}`}
                    strokeLinecap="round" className="transition-all duration-700"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-white">{overallProgress}%</span>
                </div>
              </div>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-2">
                {completedLessons}/{totalLessons} Done
              </p>
            </div>
          </div>
        </div>

        {/* Topics heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase italic tracking-tighter">
            Learning Topics
          </h2>
          <button onClick={() => {
            const allOpen = subject.topics?.every((_: any, i: number) => openTopics.has(i));
            if (allOpen) setOpenTopics(new Set());
            else setOpenTopics(new Set(subject.topics?.map((_: any, i: number) => i)));
          }} className="text-[10px] font-black uppercase tracking-widest text-[#2D5A27] hover:text-black transition-colors">
            {subject.topics?.every((_: any, i: number) => openTopics.has(i)) ? "Collapse all" : "Expand all"}
          </button>
        </div>

        {/* Topics accordion */}
        <div className="space-y-4">
          {subject.topics?.map((topic: any, topicIdx: number) => {
            const isOpen          = openTopics.has(topicIdx);
            const gradient        = TOPIC_GRADIENTS[topicIdx % TOPIC_GRADIENTS.length];
            const lessons         = topic.lessons || [];
            const completedCount  = lessons.filter((l: any) => l.userProgress?.[0]?.status === "completed").length;
            const topicProgress   = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

            return (
              <div key={topic.id}
                className={`bg-white rounded-[2rem] overflow-hidden border-2 transition-all duration-300 ${
                  isOpen ? "border-[#2D5A27]/30 shadow-xl" : "border-gray-100 shadow-sm hover:shadow-md"
                }`}>

                {/* Topic header — click to expand */}
                <button onClick={() => toggleTopic(topicIdx)}
                  className="w-full flex items-center gap-5 p-6 text-left">

                  {/* Coloured number badge */}
                  <div className={`bg-gradient-to-br ${gradient} w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg`}>
                    {topicIdx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-black text-gray-800 uppercase tracking-tight text-base leading-tight ${
                      isOpen ? "text-[#2D5A27]" : ""
                    }`}>
                      {topic.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {lessons.length} lessons
                      </span>
                      {completedCount > 0 && (
                        <>
                          <span className="text-gray-200">·</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#2D5A27]">
                            {completedCount}/{lessons.length} done
                          </span>
                        </>
                      )}
                    </div>

                    {/* Mini progress bar */}
                    {lessons.length > 0 && (
                      <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-[#2D5A27] rounded-full transition-all duration-500"
                          style={{ width: `${topicProgress}%` }}/>
                      </div>
                    )}
                  </div>

                  <ChevronDown size={20} className={`text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#2D5A27]" : ""}`}/>
                </button>

                {/* Lessons list */}
                {isOpen && (
                  <div className="border-t border-gray-50">
                    {lessons.length === 0 ? (
                      <div className="px-6 py-8 text-center">
                        <p className="text-gray-400 font-bold text-sm">No lessons available yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {lessons.map((lesson: any, lessonIdx: number) => {
                          const progress    = lesson.userProgress?.[0];
                          const isCompleted = progress?.status === "completed";
                          const isStarted   = progress?.status === "in_progress";

                          return (
                            <div key={lesson.id}
                              onClick={() => navigate(`/external-lessons/${lesson.id}`)}
                              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group">

                              {/* Lesson status icon */}
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                isCompleted ? "bg-[#2D5A27] text-white"
                                : isStarted  ? "bg-[#F4B400]/20 text-[#F4B400] border-2 border-[#F4B400]/30"
                                : "bg-gray-100 text-gray-400 group-hover:bg-[#2D5A27]/10 group-hover:text-[#2D5A27]"
                              }`}>
                                {isCompleted
                                  ? <CheckCircle2 size={20}/>
                                  : <PlayCircle size={20}/>
                                }
                              </div>

                              {/* Lesson info */}
                              <div className="flex-1 min-w-0">
                                <p className={`font-bold text-sm leading-tight ${
                                  isCompleted ? "text-gray-500 line-through" : "text-gray-800 group-hover:text-[#2D5A27]"
                                } transition-colors`}>
                                  {lesson.title}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  {lesson.duration_minutes && (
                                    <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                                      <Clock size={10}/> {lesson.duration_minutes} min
                                    </span>
                                  )}
                                  {lesson.has_quiz ? (
                                    <span className="text-[9px] font-black uppercase tracking-wide text-[#2D5A27] bg-[#2D5A27]/10 px-2 py-0.5 rounded-lg">
                                      Quiz ✓
                                    </span>
                                  ) : null}
                                  {isCompleted && progress?.quiz_score != null && (
                                    <span className="text-[9px] font-black uppercase tracking-wide text-[#F4B400] bg-[#F4B400]/10 px-2 py-0.5 rounded-lg">
                                      Score: {progress.quiz_score}%
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Status badge + arrow */}
                              <div className="flex items-center gap-3 shrink-0">
                                {isCompleted ? (
                                  <span className="text-[9px] font-black uppercase tracking-widest text-[#2D5A27] bg-[#2D5A27]/10 px-3 py-1.5 rounded-xl">
                                    Done
                                  </span>
                                ) : isStarted ? (
                                  <span className="text-[9px] font-black uppercase tracking-widest text-[#F4B400] bg-[#F4B400]/10 px-3 py-1.5 rounded-xl">
                                    Continue
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl group-hover:bg-[#2D5A27] group-hover:text-white transition-all">
                                    Start
                                  </span>
                                )}
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-[#2D5A27] transition-colors"/>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
