import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // 🚀 Added for the dynamic room link
import api from "../../api/axios";
import Layout from "../../components/Layout";
import {
  Plus,
  Video,
  Calendar,
  Clock,
  X,
  Loader2,
  Trash2,
  MonitorPlay,
  Users,
} from "lucide-react";

export default function ManageLiveClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [lessons, setLessons] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    lesson_id: "",
    scheduled_at: "",
    duration_minutes: 45,
    meeting_url: "https://meet.jit.si/FricaLearn",
    max_attendees: 20,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classRes, lessonRes] = await Promise.all([
        api.get("/live-classes"),
        api.get("/admin/lessons"),
      ]);
      setClasses(classRes.data);
      setLessons(lessonRes.data);
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/live-classes", formData);
      setClasses([res.data, ...classes]);
      setShowModal(false);
      setFormData({
        title: "",
        lesson_id: "",
        scheduled_at: "",
        duration_minutes: 45,
        meeting_url: "https://meet.jit.si/FricaLearn",
        max_attendees: 20,
      });
    } catch (err) {
      alert("Error scheduling class.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this session?")) return;
    try {
      await api.delete(`/admin/live-classes/${id}`);
      setClasses(classes.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-10">
        {/* --- HEADER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-[#2D5A27] p-4 rounded-2xl text-white shadow-lg">
              <Video size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-800 italic uppercase tracking-tighter">
                Live Sessions
              </h1>
              <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
                Schedule your next Yoruba Tribe meeting
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-[#2D5A27] transition-all shadow-xl uppercase italic tracking-tight"
          >
            <Plus size={24} /> New Session
          </button>
        </div>

        {/* --- LIST --- */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-gray-300" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {classes.length > 0 ? (
              classes.map((lc) => (
                <div
                  key={lc.id}
                  className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#2D5A27] transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`p-4 rounded-2xl ${lc.status === "ongoing" ? "bg-red-50 text-red-500 animate-pulse" : "bg-gray-50 text-gray-400"}`}
                    >
                      <Video size={28} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">
                        {lc.title}
                      </h4>
                      <div className="flex flex-wrap gap-4 mt-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />{" "}
                          {new Date(lc.scheduled_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />{" "}
                          {new Date(lc.scheduled_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* 🚀 DYNAMIC ROOM LINK FOR ADMIN */}
                    <Link
                      to={`/live-room/${lc.id}`}
                      className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2D5A27] transition-all"
                    >
                      <MonitorPlay size={14} /> Enter as Tutor
                    </Link>
                    <button
                      onClick={() => handleDelete(lc.id)}
                      className="p-4 text-red-200 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border-4 border-dashed border-gray-100 rounded-[3rem]">
                <p className="text-gray-300 font-black italic uppercase tracking-widest text-xl">
                  No Sessions Scheduled
                </p>
              </div>
            )}
          </div>
        )}

        {/* --- MODAL --- */}
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 md:p-14 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-600"
              >
                <X size={28} />
              </button>

              <h2 className="text-4xl font-black text-gray-800 mb-10 italic uppercase tracking-tighter">
                New Live Session
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">
                    Class Title
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#2D5A27] outline-none font-bold"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">
                      Date & Time
                    </label>
                    <input
                      required
                      type="datetime-local"
                      className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#2D5A27] outline-none font-bold"
                      value={formData.scheduled_at}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduled_at: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">
                      Linked Lesson
                    </label>
                    <select
                      required
                      className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#2D5A27] outline-none font-bold appearance-none"
                      value={formData.lesson_id}
                      onChange={(e) =>
                        setFormData({ ...formData, lesson_id: e.target.value })
                      }
                    >
                      <option value="">Select Topic...</option>
                      {lessons.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">
                    Meeting Identifier
                  </label>
                  <input
                    required
                    type="url"
                    className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#2D5A27] outline-none font-bold"
                    value={formData.meeting_url}
                    onChange={(e) =>
                      setFormData({ ...formData, meeting_url: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-6 bg-gray-900 text-white rounded-[2.5rem] font-black text-2xl hover:bg-[#2D5A27] shadow-2xl transition-all uppercase italic"
                >
                  Launch Live Class
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
