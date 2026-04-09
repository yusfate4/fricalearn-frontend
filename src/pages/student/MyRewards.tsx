import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import {
  Package,
  Download,
  CheckCircle2,
  Clock,
  FileText,
  ShoppingBag,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MyRewards() {
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyStuff();
  }, []);

  const fetchMyStuff = async () => {
    try {
      const res = await api.get("/gamification/my-rewards");
      setRedemptions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching your collection", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🚀 FIX: SMART DOWNLOAD LOGIC
   * This handles both local paths and Cloudinary URLs.
   */
  const handleDownload = (filePath: string) => {
    if (!filePath) {
      alert("File not found. Please contact the Admin.");
      return;
    }

    // 1. Check if it's already a full URL (Cloudinary)
    if (filePath.startsWith("http")) {
      // Force download by adding the attachment flag for Cloudinary if it's a PDF
      const downloadUrl =
        filePath.includes(".pdf") && !filePath.includes("fl_attachment")
          ? `${filePath}?fl_attachment`
          : filePath;

      window.open(downloadUrl, "_blank");
      return;
    }

    // 2. Fallback for old local storage (HP EliteBook Localhost)
    const STORAGE_URL = "http://127.0.0.1:8000/storage/";
    const cleanPath = filePath.replace(/^storage\//, "");
    window.open(`${STORAGE_URL}${cleanPath}`, "_blank");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 md:p-12 animate-in fade-in duration-700">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">
              My <span className="text-[#2D5A27]">Collection</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              Your redeemed Yoruba treasures
            </p>
          </div>
          <Link
            to="/store"
            className="flex items-center gap-3 bg-[#F4B400] text-black px-8 py-4 rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95"
          >
            Visit Shop <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20">
            <Loader2 className="animate-spin text-[#2D5A27] mb-4" size={48} />
            <p className="font-black uppercase text-[10px] tracking-widest">
              Opening your chest...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {redemptions.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-[3rem] border-2 border-gray-100 p-8 flex flex-col sm:flex-row items-center gap-8 hover:shadow-2xl hover:border-[#2D5A27]/10 transition-all duration-500 relative overflow-hidden"
              >
                {/* ICON / THUMBNAIL */}
                <div
                  className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner ${
                    item.status === "fulfilled"
                      ? "bg-green-50 text-[#2D5A27]"
                      : "bg-orange-50 text-orange-500"
                  }`}
                >
                  {item.reward?.type === "digital_asset" ? (
                    <FileText size={40} strokeWidth={2.5} />
                  ) : (
                    <Package size={40} strokeWidth={2.5} />
                  )}
                </div>

                {/* DETAILS */}
                <div className="flex-1 text-center sm:text-left z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <h3 className="font-black text-2xl text-gray-800 uppercase italic leading-none tracking-tighter">
                      {item.reward?.title}
                    </h3>
                    <StatusTag status={item.status} />
                  </div>

                  <p className="text-[10px] font-black text-gray-400 mb-6 italic uppercase tracking-widest">
                    Claimed {new Date(item.created_at).toLocaleDateString()}
                  </p>

                  {/* ACTION LOGIC */}
                  {item.status === "fulfilled" ? (
                    item.reward?.type === "digital_asset" ? (
                      <button
                        onClick={() => handleDownload(item.reward?.file_path)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#2D5A27] transition-all shadow-lg active:scale-95"
                      >
                        <Download size={14} /> Download PDF
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-[#2D5A27] font-black text-[10px] uppercase tracking-widest bg-green-50 w-fit px-4 py-2 rounded-xl">
                        <CheckCircle2 size={14} /> Item Delivered
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-orange-400 font-black text-[10px] uppercase tracking-widest bg-orange-50 w-fit px-5 py-3 rounded-xl border border-orange-100">
                      <Clock
                        size={14}
                        className="animate-spin"
                        style={{ animationDuration: "3s" }}
                      />
                      <span>Verifying Reward...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {redemptions.length === 0 && (
              <div className="col-span-full py-32 bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100 text-center flex flex-col items-center">
                <ShoppingBag size={40} className="text-gray-200 mb-6" />
                <h3 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter mb-2">
                  Chest is Empty
                </h3>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-8">
                  Go earn some XP in your lessons!
                </p>
                <Link
                  to="/courses"
                  className="bg-[#2D5A27] text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                >
                  Start Learning
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function StatusTag({ status }: { status: string }) {
  const isFulfilled = status === "fulfilled";
  return (
    <span
      className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg tracking-widest shadow-sm border ${
        isFulfilled
          ? "bg-green-500 border-green-600 text-white"
          : "bg-orange-400 border-orange-500 text-white"
      }`}
    >
      {isFulfilled ? "Fulfilled" : "Pending"}
    </span>
  );
}
