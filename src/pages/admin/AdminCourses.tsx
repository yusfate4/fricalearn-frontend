import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import { Plus, BookOpen, GraduationCap, Edit3, Image as ImageIcon } from "lucide-react";
import CourseModal from "./CourseModal";

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null); // 👈 New state for Editing

  const fetchCourses = async () => {
    try {
      const res = await api.get("/admin/courses");
      const verifiedData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setCourses(verifiedData);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // --- Handlers ---
  const handleAddNew = () => {
    setSelectedCourse(null); // Clear selection for a fresh form
    setIsModalOpen(true);
  };

  const handleEdit = (course: any) => {
    setSelectedCourse(course); // Set the specific course to edit
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">
              Manage Subjects
            </h1>
            <p className="text-gray-500 font-medium">
              Curate the FricaLearn curriculum
            </p>
          </div>
          <button
            onClick={handleAddNew} // 👈 Updated
            className="bg-frica-green text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all shadow-green-100"
          >
            <Plus size={20} /> Add New Subject
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <div
              key={course.id}
              className="group bg-white border-2 border-gray-100 p-2 rounded-[2.5rem] hover:border-frica-green transition-all shadow-sm flex flex-col"
            >
              {/* --- Mini Thumbnail --- */}
              <div className="h-32 w-full bg-gray-50 rounded-[2rem] overflow-hidden mb-4 relative">
                <img 
                   src={course.thumbnail_url || 'https://via.placeholder.com/300'} 
                   className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                   alt={course.title}
                />
                <div className="absolute top-3 right-3">
                   <button 
                     onClick={() => handleEdit(course)} // 👈 Open Edit Mode
                     className="bg-white/90 backdrop-blur-sm p-3 rounded-xl text-frica-green shadow-sm hover:bg-frica-green hover:text-white transition-all active:scale-95"
                   >
                     <Edit3 size={18} />
                   </button>
                </div>
              </div>

              <div className="px-4 pb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-50 text-frica-green text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                        {course.subject}
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 uppercase italic">
                        {course.level}
                    </span>
                </div>
                
                <h3 className="text-xl font-black text-gray-800 mb-4 line-clamp-1">
                  {course.title}
                </h3>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-tighter">
                    <GraduationCap size={16} className="text-frica-green" />
                    <span>0 Students</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-gray-300">
                    <BookOpen size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 animate-in fade-in zoom-in">
            <p className="text-gray-400 font-bold">
              No subjects created yet. Start by adding Yoruba!
            </p>
          </div>
        )}

        {/* --- MODAL (Now handles both Create and Edit) --- */}
        <CourseModal
          isOpen={isModalOpen}
          course={selectedCourse} // 👈 Pass the selected course
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCourse(null); // Reset when closing
          }}
          onRefresh={fetchCourses}
        />
      </div>
    </Layout>
  );
}