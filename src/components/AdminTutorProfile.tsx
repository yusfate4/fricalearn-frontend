import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import api from "../api/axios";
import { 
  UserCircle, 
  BookOpen, 
  Award, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function AdminTutorProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [formData, setFormData] = useState({
    bio: "",
    specialization: "",
    qualification: "",
  });

  useEffect(() => {
    api.get("/admin/tutor-profile")
      .then((res) => {
        if (res.data) {
          // 🚀 Defensively mapping only what we need
          setFormData({
            bio: res.data.bio || "",
            specialization: res.data.specialization || "",
            qualification: res.data.qualification || "",
          });
        }
      })
      .catch(() => setStatus({ type: "error", msg: "Failed to load profile." }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await api.post("/admin/tutor-profile", formData);
      setStatus({ type: "success", msg: "Profile updated successfully! 🚀" });
      setTimeout(() => setStatus(null), 4000);
    } catch (err) {
      setStatus({ type: "error", msg: "Update failed. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <Layout>
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-[#2D5A27]" size={40} />
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-800 italic uppercase tracking-tighter">Tutor Credentials</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Manage your professional identity on FricaLearn
          </p>
        </div>

        <div className="space-y-6">
          {/* Bio Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-gray-50">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">
              <UserCircle size={14} className="text-[#2D5A27]" /> 1. Professional Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell parents and students about your passion for African culture..."
              className="w-full p-6 bg-gray-50 rounded-2xl min-h-[180px] outline-none focus:ring-4 ring-[#2D5A27]/5 border-none font-medium text-gray-700 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specialization */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-gray-50">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">
                <BookOpen size={14} className="text-[#2D5A27]" /> 2. Specialization
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g. Yoruba Language & History"
                className="w-full p-5 bg-gray-50 rounded-xl outline-none focus:ring-4 ring-[#2D5A27]/5 border-none font-bold text-gray-700"
              />
            </div>

            {/* Qualification */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-gray-50">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">
                <Award size={14} className="text-[#2D5A27]" /> 3. Qualification
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. MA in Linguistics"
                className="w-full p-5 bg-gray-50 rounded-xl outline-none focus:ring-4 ring-[#2D5A27]/5 border-none font-bold text-gray-700"
              />
            </div>
          </div>
        </div>

        {status && (
          <div className={`mt-8 p-6 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span className="font-black uppercase italic text-sm">{status.msg}</span>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-10 bg-gray-900 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-[#2D5A27] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              <Save size={20} /> 
              <span>Save Professional Profile</span>
            </>
          )}
        </button>
      </div>
    </Layout>
  );
}