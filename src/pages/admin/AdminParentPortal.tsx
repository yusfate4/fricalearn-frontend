import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import { 
  UserPlus, 
  Copy, 
  CheckCircle, 
  Users, 
  ShieldCheck, 
  Search,
  ExternalLink,
  Loader2,
  MessageCircle // 👈 Added for WhatsApp
} from "lucide-react";

export default function AdminParentPortal() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/admin/users");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setStudents(data.filter((u: any) => !u.is_admin));
    } catch (err) {
      console.error("Failed to load students", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📲 WhatsApp Share Logic
   * Opens WhatsApp with a professional pre-filled message
   */
  const handleWhatsAppShare = (student: any) => {
    const accessLink = `${window.location.origin}/parent/view/${student.id}`;
    const message = `Hello! 🌟 This is Yusuf from FricaLearn. I wanted to share some great news—${student.name} has been making incredible progress! You can view their latest quiz scores and FricaCoins here: ${accessLink} %0A%0ANo login is required. Thank you for supporting their journey! 🇳🇬✨`;
    
    // Opens WhatsApp (works on Web and Mobile)
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleCopyLink = (studentId: number) => {
    const accessLink = `${window.location.origin}/parent/view/${studentId}`;
    navigator.clipboard.writeText(accessLink);
    setCopiedId(studentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 md:p-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center gap-3">
              <UserPlus size={36} className="text-blue-500" /> Parent Access
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              Generate secure progress links for Diaspora Families
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="text"
              placeholder="Search student name..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-[1.25rem] font-bold text-sm focus:border-blue-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border-2 border-blue-100 p-6 rounded-[2rem] mb-10 flex items-start gap-4">
            <div className="bg-white p-2 rounded-xl text-blue-500 shadow-sm"><ShieldCheck size={24}/></div>
            <div>
                <p className="text-blue-800 font-black uppercase text-xs tracking-tight">How it works</p>
                <p className="text-blue-600/80 text-sm font-medium mt-1">
                    Use the WhatsApp button to instantly notify parents, or copy the link manually.
                    Parents can view real-time scores and FricaCoins without needing a password.
                </p>
            </div>
        </div>

        {/* Responsive List/Table */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></div>
          ) : filteredStudents.map((student) => (
            <div 
              key={student.id} 
              className="bg-white p-5 md:p-8 rounded-[2rem] border-2 border-gray-50 shadow-sm flex flex-col xl:flex-row items-center justify-between gap-6 hover:border-blue-100 transition-all"
            >
              <div className="flex items-center gap-5 w-full xl:w-auto">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl font-black text-gray-300 shadow-inner">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter leading-none">{student.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-[9px] font-black rounded uppercase tracking-widest">ID: #{student.id}</span>
                    <span className="px-2 py-0.5 bg-green-50 text-[#2D5A27] text-[9px] font-black rounded uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Group */}
              <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                {/* 🟢 WhatsApp Share */}
                <button 
                  onClick={() => handleWhatsAppShare(student)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#128C7E] transition-all shadow-lg shadow-green-100"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp</span>
                </button>

                {/* 📋 Copy Link */}
                <button 
                  onClick={() => handleCopyLink(student.id)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    copiedId === student.id 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-900 text-white hover:bg-blue-600 shadow-lg"
                  }`}
                >
                  {copiedId === student.id ? <CheckCircle size={16}/> : <Copy size={16}/>}
                  <span>{copiedId === student.id ? "Copied!" : "Copy Link"}</span>
                </button>

                {/* 👁️ Preview */}
                <button 
                  onClick={() => window.open(`/parent/view/${student.id}`, "_blank")}
                  className="p-4 bg-gray-50 text-gray-400 rounded-xl hover:bg-white hover:text-blue-500 border border-transparent hover:border-blue-100 transition-all shadow-sm"
                  title="Preview as Parent"
                >
                  <ExternalLink size={20} />
                </button>
              </div>
            </div>
          ))}

          {filteredStudents.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <Users size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="font-black text-gray-400 uppercase text-sm tracking-widest">No students found.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}