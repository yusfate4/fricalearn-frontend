import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { 
  UserCircle, 
  BookOpen, 
  Award, 
  Link as LinkIcon, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
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
    // Fetch existing profile data
    api.get("/admin/tutor-profile")
      .then((res) => {
        if (res.data) {
          setFormData({
            bio: res.data.bio || "",
            specialization: res.data.specialization || "",
            qualification: res.data.qualification || "",
          });
        }
      })
      .catch(() => setStatus({ type: "error", msg: "Could not load profile details." }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await api.post("/admin/tutor-profile", formData);
      setStatus({ type: "success", msg: "Credentials updated successfully! 🚀" });
      setTimeout(() => setStatus(null), 5000);
    } catch (err) {
      setStatus({ type: "error", msg: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#2D5A27]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#1A1A40] italic uppercase tracking-tighter">Tutor Credentials</h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
          Define your professional presence in the academy
        </p>
      </div>

      <div className="space-y-6">
        {/* Specialization & Qualification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border-2 border-gray-50 shadow-sm">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">
              <BookOpen size={14} className="text-[#2D5A27]" /> Specialization
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g. Yoruba Linguistics"
              className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-4 ring-[#2D5A27]/5 border-none font-bold text-gray-700"
            />
          </div>

          <div className="bg-white p-6 rounded-[2rem] border-2 border-gray-50 shadow-sm">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">
              <Award size={14} className="text-[#2D5A27]" /> Qualification
            </label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              placeholder="e.g. MA African Studies"
              className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-4 ring-[#2D5A27]/5 border-none font-bold text-gray-700"
            />
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-50 shadow-sm">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">
            <UserCircle size={14} className="text-[#2D5A27]" /> Professional Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell our community about your experience and teaching style..."
            className="w-full p-6 bg-gray-50 rounded-2xl min-h-[180px] outline-none focus:ring-4 ring-[#2D5A27]/5 border-none font-medium text-gray-700 leading-relaxed"
          />
        </div>
      </div>

      {status && (
        <div className={`mt-8 p-6 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-bottom-4 ${
          status.type === 'success' ? 'bg-green-50 text-[#2D5A27] border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <span className="font-black uppercase italic text-sm">{status.msg}</span>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full mt-10 bg-[#1A1A40] text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-[#2D5A27] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
      >
        {saving ? <Loader2 className="animate-spin" size={24} /> : (
          <><Save size={20} /> Update My Credentials</>
        )}
      </button>

      <div className="mt-8 flex items-center justify-center gap-2 text-gray-300 font-black text-[9px] uppercase tracking-[0.3em]">
        <ShieldCheck size={12} /> Verified Staff Member
      </div>
    </div>
  );
}