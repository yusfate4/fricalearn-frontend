import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import {
  CheckCircle2,
  Tag,
  ArrowRight,
  Loader2,
  AlertCircle,
  XCircle,
} from "lucide-react";

export default function SelectCourses() {
  const location = useLocation();
  const navigate = useNavigate();

  // 📝 Get the child data passed from the Enrollment Modal
  const { childData } = location.state || {
    childData: { name: "Student", timezone: "WAT" },
  };

  const [currency, setCurrency] = useState<"NGN" | "GBP">("NGN");
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🚀 UI Error Handling
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    /** * 🚀 THE CRITICAL FIX:
     * We explicitly pass an empty string for 'X-Active-Student-Id'.
     * This tells the backend "I am a Parent shopping, not a Student learning,"
     * which bypasses the 'Paid Only' filter in CourseController@index.
     */
    api
      .get("/courses", {
        headers: {
          "X-Active-Student-Id": "",
        },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setCourses(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApplyCoupon = () => {
    if (!selectedCourse) return;
    setCouponError(null);

    // 🚀 Simple logic: 10% off with AFRICA10
    if (coupon.toUpperCase().trim() === "AFRICA10") {
      const basePrice =
        currency === "NGN"
          ? selectedCourse.price_ngn
          : selectedCourse.price_gbp;
      setDiscount(basePrice * 0.1);
    } else {
      setCouponError("Invalid Coupon Code");
      setDiscount(0);
      setTimeout(() => setCouponError(null), 3000);
    }
  };

  const calculateTotal = () => {
    if (!selectedCourse) return 0;
    const price =
      currency === "NGN" ? selectedCourse.price_ngn : selectedCourse.price_gbp;
    return Math.max(price - discount, 0);
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#2D5A27] mb-4" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          Loading Subjects...
        </p>
      </div>
    );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 pb-64">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div className="w-full md:w-auto">
            <h1 className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter mb-6 leading-none">
              Choose a <span className="text-[#2D5A27]">Subject</span>
            </h1>
            <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border-2 border-gray-50 shadow-sm">
              <div className="w-2 h-2 bg-[#F4B400] rounded-full animate-ping" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Enrolling:{" "}
                <span className="text-gray-800">{childData.name}</span> •{" "}
                {childData.timezone}
              </p>
            </div>
          </div>

          {/* CURRENCY TOGGLE */}
          <div className="flex bg-gray-100 p-1.5 rounded-[2.5rem] border-2 border-gray-200 w-full md:w-auto shadow-inner">
            <button
              onClick={() => {
                setCurrency("NGN");
                setDiscount(0);
                setCoupon("");
              }}
              className={`flex-1 md:px-10 py-4 rounded-[2rem] font-black text-[10px] tracking-widest transition-all ${currency === "NGN" ? "bg-white text-[#2D5A27] shadow-lg" : "text-gray-400"}`}
            >
              🇳🇬 NAIRA (₦)
            </button>
            <button
              onClick={() => {
                setCurrency("GBP");
                setDiscount(0);
                setCoupon("");
              }}
              className={`flex-1 md:px-10 py-4 rounded-[2rem] font-black text-[10px] tracking-widest transition-all ${currency === "GBP" ? "bg-white text-[#2D5A27] shadow-lg" : "text-gray-400"}`}
            >
              🇬🇧 POUNDS (£)
            </button>
          </div>
        </div>

        {/* --- COURSE GRID --- */}
        {courses.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-black text-gray-800 uppercase italic">
              Catalog is Empty
            </h3>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
              Check back later for new subjects!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => {
                  setSelectedCourse(course);
                  setDiscount(0);
                  setCoupon("");
                }}
                className={`bg-white rounded-[3rem] md:rounded-[3.5rem] overflow-hidden border-4 transition-all duration-500 cursor-pointer group relative flex flex-col h-full ${
                  selectedCourse?.id === course.id
                    ? "border-[#2D5A27] shadow-2xl -translate-y-2"
                    : "border-transparent shadow-sm hover:border-gray-100"
                }`}
              >
                <div className="h-56 md:h-64 overflow-hidden relative">
                  <img
                    src={
                      course.thumbnail_url?.startsWith("http")
                        ? course.thumbnail_url
                        : `http://127.0.0.1:8000/storage/${course.thumbnail_url}`
                    }
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-[9px] font-black uppercase text-[#2D5A27] shadow-xl">
                    {course.level || "Standard"}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="mb-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#F4B400] bg-orange-50 px-3 py-1.5 rounded-lg">
                      {course.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter mb-3 group-hover:text-[#2D5A27] transition-colors leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-[13px] font-medium leading-relaxed mb-8 line-clamp-2 italic">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">
                        Monthly Sub
                      </p>
                      <p className="text-3xl font-black text-[#2D5A27] italic tracking-tight">
                        {currency === "NGN"
                          ? `₦${Number(course.price_ngn).toLocaleString()}`
                          : `£${course.price_gbp}`}
                      </p>
                    </div>
                    {selectedCourse?.id === course.id && (
                      <div className="bg-[#2D5A27] p-3.5 rounded-2xl text-white shadow-xl animate-in zoom-in duration-300 ring-4 ring-green-50">
                        <CheckCircle2 size={24} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- STICKY FOOTER --- */}
        {selectedCourse && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-gray-100 p-6 md:p-8 z-[60] shadow-[0_-20px_50px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom duration-500">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Coupon Section */}
              <div className="relative flex items-center gap-3 w-full lg:w-auto">
                {couponError && (
                  <div className="absolute -top-12 left-0 bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
                    <XCircle size={14} /> {couponError}
                  </div>
                )}

                <div className="relative flex-1 md:w-80">
                  <Tag
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="ENTER COUPON"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] outline-none focus:border-[#2D5A27] font-black text-[11px] uppercase tracking-widest transition-all shadow-inner"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="bg-gray-900 text-white px-8 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-[#2D5A27] transition-all shadow-xl active:scale-95"
                >
                  Apply
                </button>
              </div>

              {/* Total & Checkout */}
              <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end">
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Grand Total
                  </p>
                  <p className="text-4xl md:text-5xl font-black text-[#2D5A27] italic tracking-tighter">
                    {currency === "NGN"
                      ? `₦${calculateTotal().toLocaleString()}`
                      : `£${calculateTotal()}`}
                  </p>
                </div>
                <button
                  onClick={() =>
                    navigate("/payment", {
                      state: {
                        selectedCourse,
                        childData,
                        currency,
                        finalAmount: calculateTotal(),
                      },
                    })
                  }
                  className="bg-[#2D5A27] text-white px-10 md:px-14 py-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl hover:bg-black hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4"
                >
                  Checkout <ArrowRight size={22} className="hidden sm:block" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
