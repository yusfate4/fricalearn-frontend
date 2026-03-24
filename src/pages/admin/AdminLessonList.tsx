import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import { 
  Edit3, 
  Trash2, 
  Plus, 
  BookOpen, 
  Mic, 
  Search, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

export default function AdminLessonList() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null); // 👈 Track which lesson is being deleted
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = () => {
    setLoading(true);
    api.get("/admin/lessons")
      .then((res) => {
        setLessons(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Could not fetch lessons", err);
        setLoading(false);
      });
  };

  // 🚀 THE DELETE LOGIC
  const handleDelete = async (id: number, title: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"? This will permanently remove all video content and files associated with it.`
    );

    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      // Hits the route we fixed in api.php: DELETE api/admin/lessons/{id}
      await api.delete(`/admin/lessons/${id}`);
      
      // Update local state so it disappears instantly
      setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete lesson. Check if it has active quizzes attached.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLessons = lessons.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.module?.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <Layout>
      <div className="p-20 text-center font-black animate-pulse text-gray-300 italic uppercase tracking-widest">
        Loading Curriculum...
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-800 italic uppercase tracking-tighter">Lesson Manager</h1>
            <p className="text-gray-500 font-bold">Manage AI Practice Words & Content</p>
          </div>
          
          <button 
            onClick={() => navigate("/admin/add-lesson")}
            className="flex items-center gap-2 bg-[#2D5A27] text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all uppercase text-sm"
          >
            <Plus size={20} /> New Lesson
          </button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search by lesson name or subject..."
            className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-50 rounded-[2rem] shadow-sm outline-none focus:border-[#2D5A27] font-bold transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border-2 border-gray-50 overflow-hidden mb-20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Lesson Info</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Subject / Module</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">AI Practice</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLessons.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-300 font-bold italic uppercase">
                    No lessons found matching your search.
                  </td>
                </tr>
              ) : (
                filteredLessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-green-50/30 transition-colors group">
                    <td className="p-6">
                      <span className="font-black text-gray-800 block uppercase italic">{lesson.title}</span>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tight">Created {new Date(lesson.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-[#2D5A27]" />
                        <span className="text-sm font-bold text-gray-600">{lesson.module?.course?.title || "General"}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      {lesson.practice_word ? (
                        <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase italic border border-orange-100">
                          <Mic size={10} /> {lesson.practice_word}
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-gray-300 uppercase italic">Not Set</span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/edit-lesson/${lesson.id}`)}
                          className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-orange-500 hover:text-white transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        
                        {/* 🗑️ UPDATED DELETE BUTTON */}
                        <button 
                          disabled={deletingId === lesson.id}
                          onClick={() => handleDelete(lesson.id, lesson.title)}
                          className={`p-3 rounded-xl transition-all ${
                            deletingId === lesson.id 
                            ? "bg-gray-100 text-gray-300" 
                            : "bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white"
                          }`}
                        >
                          {deletingId === lesson.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}