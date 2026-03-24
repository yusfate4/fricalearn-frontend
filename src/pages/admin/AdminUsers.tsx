import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import { 
  Users, 
  Search, 
  BarChart3, 
  Mail, 
  UserCheck, 
  ShieldCheck, 
  ChevronRight,
  Loader2,
  Trophy
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      // Safety check for array response
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic for searching Ayo or other students
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center gap-3">
              <Users size={36} className="text-[#2D5A27]" /> Student Registry
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">
              Manage and Monitor Diaspora Learners
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-sm outline-none focus:border-[#2D5A27] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table / List */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border-2 border-gray-50 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
              <Loader2 className="animate-spin mx-auto text-[#2D5A27] mb-4" size={40} />
              <p className="font-black text-gray-400 uppercase text-xs tracking-widest">Loading Registry...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b-2 border-gray-100">
                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance</th>
                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-[#2D5A27] font-black text-xl shadow-inner">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-gray-800 text-lg tracking-tight uppercase italic">{u.name}</p>
                            <p className="text-xs text-gray-400 font-bold flex items-center gap-1">
                              <Mail size={12} /> {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        {u.is_admin ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                            <ShieldCheck size={12} /> Founder
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-[#2D5A27] rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                            <UserCheck size={12} /> Active Student
                          </span>
                        )}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                           <div className="text-center bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                              <p className="text-xs font-black text-[#2D5A27] leading-none">{u.student_profile?.total_points || 0}</p>
                              <p className="text-[8px] font-black text-gray-400 uppercase mt-1">Pts</p>
                           </div>
                           <div className="text-center bg-yellow-50 px-3 py-2 rounded-xl border border-yellow-100">
                              <p className="text-xs font-black text-yellow-600 leading-none">{u.student_profile?.total_coins || 0}</p>
                              <p className="text-[8px] font-black text-gray-400 uppercase mt-1">Coins</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           {/* 📊 ANALYTICS BUTTON: Navigates to the shared analytics page */}
                           <button 
                             onClick={() => navigate(`/analytics/${u.id}`)}
                             className="p-3 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl hover:text-[#2D5A27] hover:border-[#2D5A27] hover:shadow-md transition-all flex items-center gap-2 group/btn"
                           >
                             <BarChart3 size={18} />
                             <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover/btn:block">View Progress</span>
                           </button>
                           
                           <button className="p-3 bg-white border-2 border-gray-100 text-gray-300 rounded-2xl hover:text-gray-600 transition-all">
                             <ChevronRight size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="p-20 text-center">
                  <p className="text-gray-400 font-black uppercase text-xs tracking-widest italic">No students found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Stat Summary */}
        <div className="mt-8 flex items-center gap-4 bg-[#2D5A27]/5 p-6 rounded-[2rem] border-2 border-[#2D5A27]/10">
           <Trophy className="text-[#2D5A27]" size={32} />
           <div>
              <p className="text-xl font-black text-gray-800 uppercase italic leading-none">{users.filter(u => !u.is_admin).length} Registered Learners</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Building the future of the Diaspora</p>
           </div>
        </div>
      </div>
    </Layout>
  );
}