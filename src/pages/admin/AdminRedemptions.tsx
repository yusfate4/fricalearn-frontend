import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import { Package, CheckCircle, Clock, Search, Loader2, User, Tag } from "lucide-react";

export default function AdminRedemptions() {
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRedemptions();
  }, []);

  const fetchRedemptions = async () => {
    try {
      const response = await api.get("/admin/reward-redemptions");
      setRedemptions(response.data);
    } catch (error) {
      console.error("Failed to load redemptions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFulfill = async (id: number) => {
    setProcessingId(id);
    try {
      await api.put(`/admin/reward-redemptions/${id}/fulfill`);
      setRedemptions(redemptions.map(r => 
        r.id === id ? { ...r, status: 'fulfilled' } : r
      ));
    } catch (error) {
      console.error("Failed to fulfill reward", error);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRedemptions = redemptions.filter((order) => {
    const search = searchTerm.toLowerCase();
    return (
      order.student?.name?.toLowerCase().includes(search) ||
      order.reward?.title?.toLowerCase().includes(search) ||
      order.status?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 font-bold">
          <Loader2 size={40} className="animate-spin text-frica-green mb-4" />
          Loading Fulfillment Desk...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 md:p-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-frica-green p-3 md:p-4 rounded-2xl text-white shadow-lg">
              <Package size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight italic uppercase">Orders</h1>
              <p className="text-gray-500 font-bold text-sm md:text-base">Fulfill student rewards</p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-frica-green outline-none font-bold text-sm shadow-sm transition-all"
            />
          </div>
        </div>

        {/* --- DESKTOP TABLE VIEW (Visible on md and up) --- */}
        <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border-2 border-gray-50 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="p-6">Student</th>
                <th className="p-6">Reward</th>
                <th className="p-6">Cost</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRedemptions.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-6 font-bold text-gray-800">
                    {order.student?.name}
                    <div className="text-xs text-gray-400 font-medium">{order.student?.email}</div>
                  </td>
                  <td className="p-6 font-bold text-gray-600 italic">{order.reward?.title}</td>
                  <td className="p-6 font-black text-yellow-500">{order.coins_spent}</td>
                  <td className="p-6">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-6 text-right">
                    <ActionButton order={order} processingId={processingId} onFulfill={handleFulfill} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE CARD VIEW (Visible on small screens) --- */}
        <div className="md:hidden space-y-4">
          {filteredRedemptions.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-[2rem] border-2 border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-gray-800 font-black italic uppercase text-xs">
                  <User size={14} className="text-frica-green" /> {order.student?.name}
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="py-2 border-y border-gray-50">
                <p className="text-sm font-bold text-gray-500 flex items-center gap-2">
                   <Tag size={14} /> {order.reward?.title}
                </p>
                <p className="text-lg font-black text-yellow-500 mt-1">{order.coins_spent} Coins</p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
                <ActionButton order={order} processingId={processingId} onFulfill={handleFulfill} />
              </div>
            </div>
          ))}
        </div>

        {filteredRedemptions.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
             <p className="text-gray-400 font-black italic">No orders found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

// --- Internal Sub-Components for cleaner code ---

function StatusBadge({ status }: { status: string }) {
  const isPending = status === 'pending';
  return (
    <span className={`px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-max ${
      isPending ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-frica-green'
    }`}>
      {isPending ? <Clock size={12} /> : <CheckCircle size={12} />}
      {status}
    </span>
  );
}

function ActionButton({ order, processingId, onFulfill }: any) {
  if (order.status !== 'pending') {
    return <span className="text-gray-300 font-black text-[10px] uppercase tracking-widest">Completed</span>;
  }

  return (
    <button
      onClick={() => onFulfill(order.id)}
      disabled={processingId === order.id}
      className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-black text-xs hover:bg-frica-green transition-all shadow-md active:scale-95 disabled:opacity-50"
    >
      {processingId === order.id ? '...' : 'Fulfill'}
    </button>
  );
}