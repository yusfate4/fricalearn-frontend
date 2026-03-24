import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import {
  Store,
  Coins,
  Gift,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  Video,
  Award,
  Clock,
  Package,
} from "lucide-react";

export default function RewardsCatalog() {
  const [activeTab, setActiveTab] = useState<"shop" | "inventory">("shop");
  const [rewards, setRewards] = useState<any[]>([]);
  const [myItems, setMyItems] = useState<any[]>([]);
  const [coins, setCoins] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const rewardsRes = await api.get("/rewards");
      setRewards(rewardsRes.data);

      const userRes = await api.get("/me");
      const profile =
        userRes.data.student_profile || userRes.data.studentProfile;
      setCoins(profile?.total_coins || 0);

      const itemsRes = await api.get("/my-rewards");
      setMyItems(itemsRes.data);
    } catch (error) {
      console.error("Failed to load store data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward: any) => {
    if (coins < reward.cost_coins || purchasingId) return;
    setPurchasingId(reward.id);
    setMessage(null);

    try {
      const response = await api.post(`/rewards/${reward.id}/redeem`);
      setCoins(response.data.remaining_coins);
      setMessage({ type: "success", text: `🎉 ${response.data.message}` });

      // Refresh inventory to show the new item
      const itemsRes = await api.get("/my-rewards");
      setMyItems(itemsRes.data);

      setTimeout(() => setMessage(null), 4000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to redeem reward.",
      });
    } finally {
      setPurchasingId(null);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "educational_product":
        return <Video size={24} className="text-purple-500" />;
      case "digital_voucher":
        return <BookOpen size={24} className="text-blue-500" />;
      case "platform_credit":
        return <Award size={24} className="text-orange-500" />;
      default:
        return <Gift size={24} className="text-frica-green" />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 font-bold">
          <Loader2 size={40} className="animate-spin text-frica-green mb-4" />
          Loading the FricaLearn Store...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-10">
        {/* --- HEADER & COIN BALANCE --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 italic uppercase tracking-tighter flex items-center gap-3">
              <Store size={40} className="text-frica-green" />
              Reward Store
            </h1>

            {/* TABS */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setActiveTab("shop")}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === "shop" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                Shop Rewards
              </button>
              <button
                onClick={() => setActiveTab("inventory")}
                className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === "inventory" ? "bg-frica-green text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                <Package size={18} /> My Inventory ({myItems.length})
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 rounded-[2rem] shadow-lg shadow-yellow-500/20 text-white flex items-center gap-4 min-w-[250px]">
            <div className="bg-white/20 p-4 rounded-full">
              <Coins size={32} className="text-white" />
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-widest opacity-90">
                My Wallet
              </p>
              <p className="text-4xl font-black tracking-tighter">
                {coins.toLocaleString()} <span className="text-xl">Coins</span>
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`mb-8 p-6 rounded-[2rem] flex items-center gap-3 font-bold ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
          >
            {message.type === "success" ? (
              <CheckCircle size={24} />
            ) : (
              <AlertCircle size={24} />
            )}
            <span className="text-lg">{message.text}</span>
          </div>
        )}

        {/* --- TAB CONTENT: SHOP --- */}
        {activeTab === "shop" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
            {rewards.map((reward) => {
              const canAfford = coins >= reward.cost_coins;
              return (
                <div
                  key={reward.id}
                  className={`bg-white rounded-[2.5rem] p-8 border-4 transition-all duration-300 flex flex-col h-full ${canAfford ? "border-transparent hover:border-frica-green hover:shadow-xl" : "border-gray-50 opacity-70 grayscale-[30%]"}`}
                >
                  <div className="bg-gray-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6">
                    {getIconForType(reward.type)}
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 mb-3 leading-tight tracking-tight">
                    {reward.title}
                  </h3>
                  <p className="text-gray-500 font-medium mb-8 flex-grow">
                    {reward.description}
                  </p>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                        Price
                      </span>
                      <span
                        className={`font-black text-xl flex items-center gap-1 ${canAfford ? "text-yellow-500" : "text-gray-400"}`}
                      >
                        <Coins size={20} /> {reward.cost_coins.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford || purchasingId === reward.id}
                      className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center gap-2 ${canAfford ? "bg-gray-900 text-white hover:scale-[1.02]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                    >
                      {purchasingId === reward.id ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />{" "}
                          Processing...
                        </>
                      ) : canAfford ? (
                        "Redeem Reward"
                      ) : (
                        "Need More Coins"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- TAB CONTENT: INVENTORY --- */}
        {activeTab === "inventory" && (
          <div className="space-y-4 animate-in fade-in">
            {myItems.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-black text-gray-800">
                  Your inventory is empty!
                </h3>
                <p className="text-gray-500 font-bold mt-2">
                  Go to the shop to spend your coins.
                </p>
              </div>
            ) : (
              myItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-[2rem] border-2 border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      {getIconForType(item.reward?.type)}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-800">
                        {item.reward?.title}
                      </h4>
                      <p className="text-gray-500 font-medium text-sm">
                        Purchased on{" "}
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`px-5 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 uppercase tracking-widest ${
                      item.status === "pending"
                        ? "bg-orange-50 text-orange-600"
                        : item.status === "fulfilled"
                          ? "bg-green-50 text-frica-green"
                          : "bg-red-50 text-red-600"
                    }`}
                  >
                    {item.status === "pending" && <Clock size={16} />}
                    {item.status === "fulfilled" && <CheckCircle size={16} />}
                    {item.status}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
