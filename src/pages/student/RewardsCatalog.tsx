import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import {
  Store,
  Coins,
  Download,
  Package,
  CheckCircle2,
  Loader2,
  ShoppingBag,
  FileText,
  X,
  AlertCircle,
  Trophy,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function RewardsCatalog() {
  const { user, setUser } = useAuth(); 
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🚀 Child specific profile state
  const [childProfile, setChildProfile] = useState<any>(null);

  // --- Modal States ---
  const [purchasing, setPurchasing] = useState<any>(null); 
  const [successItem, setSuccessItem] = useState<any>(null); 
  const [errorModal, setErrorModal] = useState<{show: boolean, message: string}>({
    show: false,
    message: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState("all");

  // 🚀 Logic: Determine if we are viewing as a parent impersonating a child
  const isImpersonating = localStorage.getItem("is_impersonating") === "true";
  const activeStudentId = localStorage.getItem("active_student_id");

  useEffect(() => {
    fetchMarketplace();
    refreshData();
  }, [activeStudentId]);

  const refreshData = async () => {
    try {
      if (isImpersonating && activeStudentId) {
        // 🚀 THE FIX: Use the new accessible parent route instead of admin route
        const res = await api.get(`/parent/active-student/${activeStudentId}`);
        // Ensure we handle the structure correctly (res.data.student_profile)
        setChildProfile(res.data.student_profile);
      } else {
        const res = await api.get("/auth/me");
        setUser(res.data);
      }
    } catch (err) {
      console.error("Failed to refresh data", err);
    }
  };

  const fetchMarketplace = async () => {
    try {
      const res = await api.get("/gamification/rewards");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load marketplace", err);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Current XP Logic
  const currentXP = isImpersonating 
    ? (childProfile?.total_coins || 0) 
    : (user?.student_profile?.total_coins || 0);

  const handlePurchase = async () => {
    if (!purchasing) return;

    setIsProcessing(true);
    try {
      const res = await api.post(
        `/gamification/rewards/${purchasing.id}/redeem`
      );

      // Update balance in state immediately
      if (isImpersonating) {
        setChildProfile({ ...childProfile, total_coins: res.data.remaining_coins });
      } else {
        setUser({
          ...user,
          student_profile: { ...user?.student_profile, total_coins: res.data.remaining_coins }
        });
      }

      const downloadUrl = res.data.download_url;
      setSuccessItem({ ...purchasing, download_url: downloadUrl });
      setPurchasing(null); 

      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      }
    } catch (err: any) {
      setPurchasing(null);
      setErrorModal({
        show: true,
        message: err.response?.data?.message || "Purchase failed. Insufficient XP."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredItems = items.filter((i) =>
    filter === "all" ? true : i.type === filter
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 md:p-10">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">
              Marketplace
            </h1>
            <p className="text-[#2D5A27] font-black text-[10px] uppercase tracking-[0.3em] mt-3">
              {isImpersonating ? "Rewarding your child's progress" : "Spend your XP on Yoruba Excellence"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-100 shadow-xl flex items-center gap-6 group hover:scale-105 transition-transform duration-500">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {isImpersonating ? "Child's Balance" : "Available XP"}
              </p>
              <p className="text-3xl font-black text-[#2D5A27] italic">
                {currentXP}
              </p>
            </div>
            <div className="h-14 w-14 bg-[#F4B400] rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-yellow-500/30">
              <Coins size={32} className="animate-pulse" />
            </div>
          </div>
        </div>

        {/* --- MARKET GRID --- */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 opacity-20">
             <Loader2 size={48} className="animate-spin mb-4" />
             <p className="font-black uppercase tracking-widest text-xs">Opening Vault...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item) => {
              const cost = item.cost_coins || item.price;
              const canAfford = currentXP >= cost;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-[3rem] border-2 border-gray-100 flex flex-col group hover:shadow-2xl transition-all overflow-hidden relative"
                >
                  <div className="h-52 bg-gray-50 relative overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[0.2] group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <Package size={48} />
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="font-black text-xl uppercase italic text-gray-800 mb-2 truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 line-clamp-2 mb-8 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <button
                      onClick={() => setPurchasing(item)}
                      disabled={!canAfford}
                      className={`mt-auto w-full py-5 rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest transition-all shadow-lg active:scale-95 ${
                        canAfford 
                        ? "bg-gray-900 text-white hover:bg-[#2D5A27]" 
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {canAfford ? `Buy for ${cost} XP` : `Need ${cost} XP`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- 🛒 MODAL 1: CONFIRM PURCHASE --- */}
        {purchasing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in-95">
              <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
                Unlock Reward?
              </h2>
              <p className="text-gray-500 font-bold text-sm mb-8">
                Spending <span className="text-[#2D5A27]">{purchasing.cost_coins} XP</span> on <br/>
                <span className="text-gray-800 italic underline">"{purchasing.title}"</span>
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="w-full py-5 bg-[#2D5A27] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : "Oya, Confirm!"}
                </button>
                <button
                  onClick={() => setPurchasing(null)}
                  className="w-full py-4 text-gray-400 font-black uppercase text-[10px] tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 🎉 MODAL 2: SUCCESS --- */}
        {successItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#2D5A27]/95 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[4rem] p-12 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-3 bg-[#F4B400]" />
              <div className="w-24 h-24 bg-green-100 text-[#2D5A27] rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <Trophy size={48} />
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-gray-800">
                Gba bẹ́ẹ̀!
              </h2>
              <p className="text-gray-500 font-bold mb-8 italic">"{successItem.title}" redeemed successfully!</p>
              <button
                onClick={() => setSuccessItem(null)}
                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest"
              >
                Continue Learning
              </button>
            </div>
          </div>
        )}

        {/* --- ⚠️ MODAL 3: ERROR --- */}
        {errorModal.show && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in-95">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter mb-2">Wait a Minute</h2>
              <p className="text-gray-500 font-bold text-xs mb-8 leading-relaxed">{errorModal.message}</p>
              <button
                onClick={() => setErrorModal({ show: false, message: "" })}
                className="w-full py-4 bg-gray-100 text-gray-800 rounded-2xl font-black uppercase text-[10px] tracking-widest"
              >
                Understood
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}