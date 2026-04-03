import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus,
  Edit3,
  Trash2,
  Loader2,
  Search,
  CheckCircle2,
  X,
  BookOpen,
  AlertCircle,
} from "lucide-react";

export default function AdminCourseList() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // 🚀 THE FIX: Use the index route, but ensure the backend
      // recognizes us as Admin to bypass the "Paid Only" filter.
      const res = await api.get("/courses");
      const data = Array.isArray(res.data) ? res.data : [];
      setCourses(data);
    } catch (err) {
      setStatus({ type: "error", msg: "Failed to load inventory." });
    } finally {
      setLoading(false);
    }
  };

  const processDelete = async () => {
    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/courses/${confirmDelete.id}`);
      setCourses(courses.filter((c) => c.id !== confirmDelete.id));
      setStatus({
        type: "success",
        msg: `"${confirmDelete.title}" deleted.`,
      });
      setConfirmDelete(null);
      setTimeout(() => setStatus(null), 4000);
    } catch (err: any) {
      setStatus({
        type: "error",
        msg: "Delete failed. Course might have active students.",
      });
      setConfirmDelete(null);
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 md:p-12 relative min-h-screen">
        {/* --- DELETE MODAL --- */}
        {confirmDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-[3rem] max-w-sm w-full text-center shadow-2xl border-4 border-white">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 uppercase italic mb-2 tracking-tighter">
                Remove Subject?
              </h3>
              <p className="text-gray-400 text-sm font-bold mb-8 leading-relaxed">
                You are deleting{" "}
                <span className="text-red-500">"{confirmDelete.title}"</span>.
                This will remove access for all enrolled students.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-5 bg-gray-100 rounded-2xl font-black text-[10px] uppercase text-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={processDelete}
                  className="flex-1 py-5 bg-red-500 rounded-2xl font-black text-[10px] uppercase text-white shadow-xl shadow-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">
              Course <span className="text-[#2D5A27]">Inventory</span>
            </h1>
            {status && (
              <div
                className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-xl w-fit animate-in slide-in-from-left ${status.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {status.msg}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2D5A27] transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-14 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-[#2D5A27] font-bold text-sm shadow-sm transition-all"
              />
            </div>
            <Link
              to="/admin/courses"
              className="bg-[#2D5A27] text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95"
            >
              <Plus size={18} /> Add Course
            </Link>
          </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-20">
              <Loader2 className="animate-spin text-[#2D5A27] mb-4" size={48} />
              <p className="font-black uppercase tracking-widest text-xs">
                Accessing Database...
              </p>
            </div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 flex flex-col md:flex-row items-center gap-8 group hover:border-[#2D5A27]/20 hover:shadow-xl transition-all duration-500"
              >
                {/* THUMBNAIL */}
                <div className="w-full md:w-32 h-32 rounded-[2rem] overflow-hidden bg-gray-50 flex-shrink-0 shadow-inner">
                  <img
                    src={
                      course.thumbnail_url?.startsWith("http")
                        ? course.thumbnail_url
                        : `http://127.0.0.1:8000/storage/${course.thumbnail_url}`
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={course.title}
                  />
                </div>

                {/* DETAILS */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                    <span className="text-[8px] font-black uppercase text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg tracking-widest">
                      {course.category}
                    </span>
                    <span className="text-[8px] font-black uppercase text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg tracking-widest">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 uppercase italic leading-none tracking-tighter">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">
                    {course.modules_count || 0} Modules Created
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                  <button
                    onClick={() =>
                      navigate("/admin/courses", {
                        state: { editCourse: course },
                      })
                    }
                    className="flex-1 md:flex-none p-5 bg-gray-50 text-gray-400 rounded-2xl hover:bg-[#2D5A27] hover:text-white transition-all shadow-sm"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setConfirmDelete({ id: course.id, title: course.title })
                    }
                    className="flex-1 md:flex-none p-5 bg-gray-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100 flex flex-col items-center">
              <BookOpen size={64} className="text-gray-200 mb-6" />
              <h3 className="text-2xl font-black text-gray-400 uppercase italic tracking-tighter">
                Inventory Empty
              </h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">
                No subjects found matching your search
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
