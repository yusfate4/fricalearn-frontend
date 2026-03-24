import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import { Plus, Store, Trash2, Edit3, Loader2, X, Coins, Info } from "lucide-react";

export default function ManageRewards() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cost_coins: 100,
    type: "digital_voucher"
  });

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const res = await api.get("/rewards"); // Use existing public route to see all
      setRewards(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/rewards", formData);
      setRewards([...rewards, res.data.reward]);
      setShowModal(false);
      setFormData({ title: "", description: "", cost_coins: 100, type: "digital_voucher" });
    } catch (err) {
      alert("Error adding reward");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500 p-4 rounded-2xl text-white shadow-lg shadow-yellow-500/20">
              <Store size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-800 tracking-tight italic uppercase">Shop Inventory</h1>
              <p className="text-gray-500 font-bold">Manage what students can buy</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-frica-green transition-all shadow-xl active:scale-95"
          >
            <Plus size={20} /> Add New Reward
          </button>
        </div>

        {/* --- REWARDS LIST --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-100 flex items-center justify-between group hover:border-yellow-400 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl text-yellow-600 font-black">
                   <Coins size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-gray-800">{reward.title}</h4>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{reward.cost_coins} Coins • {reward.type.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-colors"><Edit3 size={18}/></button>
              </div>
            </div>
          ))}
        </div>

        {/* --- ADD REWARD MODAL --- */}
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 md:p-12 shadow-2xl relative animate-in zoom-in duration-300">
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
              
              <h2 className="text-3xl font-black text-gray-800 mb-8 italic uppercase tracking-tighter">New Item</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Item Title</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. 1-on-1 Session" 
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-yellow-400 outline-none font-bold"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Cost (Coins)</label>
                    <input 
                      required 
                      type="number" 
                      className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-yellow-400 outline-none font-bold"
                      value={formData.cost_coins}
                      onChange={(e) => setFormData({...formData, cost_coins: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Category</label>
                    <select 
                      className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-yellow-400 outline-none font-bold appearance-none"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="digital_voucher">Voucher</option>
                      <option value="educational_product">Product</option>
                      <option value="platform_credit">Credit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Description</label>
                  <textarea 
                    rows={3} 
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-yellow-400 outline-none font-bold"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <button type="submit" className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xl hover:bg-frica-green shadow-xl transition-all active:scale-95">
                  Publish to Store
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}