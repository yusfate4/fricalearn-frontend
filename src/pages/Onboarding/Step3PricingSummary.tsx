import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import { ArrowRight, ChevronLeft, Award, Loader2, CheckCircle2 } from "lucide-react";

interface PricingBreakdown {
  course: string;
  name: string;
  amount: number;
  is_free: boolean;
  currency: string;
}

export default function Step3PricingSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCourses, currency, curriculumRegion, mathsGrade, englishGrade } =
    location.state || {};

  const [breakdown, setBreakdown] = useState<PricingBreakdown[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const isNigerian = currency === "NGN" || curriculumRegion === "nigeria";

  useEffect(() => {
    calculatePricing();
  }, []);

  const calculatePricing = async () => {
    try {
      const res = await api.post("/onboarding/calculate-pricing", {
        selected_courses: selectedCourses,
        currency,
      });
      setBreakdown(res.data.breakdown);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Failed to calculate pricing", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/onboarding/step4", {
      state: {
        selectedCourses,
        currency,
        curriculumRegion,
        mathsGrade,
        englishGrade,
        total,
      },
    });
  };

  /** Full display name from course id */
  const getCourseFullName = (courseId: string): string => {
    const nigerianNames: Record<string, string> = {
      maths:   "Mathematics (Nigerian Curriculum)",
      english: "English Language (Nigerian Curriculum)",
      yoruba:  "Yoruba Language",
      hausa:   "Hausa Language",
      igbo:    "Igbo Language",
    };
    const ukNames: Record<string, string> = {
      maths:   "Mathematics (UK Curriculum)",
      english: "English (UK Curriculum)",
      yoruba:  "Yoruba Language",
      hausa:   "Hausa Language",
      igbo:    "Igbo Language",
    };
    return isNigerian
      ? (nigerianNames[courseId] ?? courseId)
      : (ukNames[courseId] ?? courseId);
  };

  /** Grade label per course, using the correct curriculum format */
  const getGradeForCourse = (courseId: string): string | null => {
    const gradeNum =
      courseId === "maths" ? mathsGrade : courseId === "english" ? englishGrade : null;
    if (!gradeNum) return null;

    if (!isNigerian) return `Year ${gradeNum}`;
    if (gradeNum <= 6) return `Primary ${gradeNum}`;
    return `JSS ${gradeNum - 6}`;
  };

  /** Original price fallback for scholarship display */
  const getOriginalPrice = (): string =>
    currency === "NGN" ? "₦20,000" : "£13.33";

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="animate-spin text-[#3F2171] mb-4" size={40} />
          <p className="font-black text-gray-300 uppercase italic text-[10px] tracking-widest">
            Calculating Pricing...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10 md:px-12 md:py-16 animate-in fade-in duration-700 pb-32">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#3F2171] transition-colors mb-8"
        >
          <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#3F2171]/10">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back</span>
        </button>

        <div className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">
            Step 3 of 4
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight mb-4">
            Pricing <span className="text-[#3F2171]">Summary</span>
          </h1>
          <p className="text-gray-500 font-bold text-sm md:text-base max-w-2xl">
            Review your selections and total investment
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 shadow-xl border-4 border-white mb-8">
          {/* Currency + Curriculum Badge */}
          <div className="flex items-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl">
              <span className="text-2xl">{currency === "NGN" ? "🇳🇬" : "🇬🇧"}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                {currency === "NGN" ? "Nigerian Naira" : "British Pounds"}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#3F2171]/10 px-4 py-2 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#3F2171]">
                {isNigerian ? "NERDC Curriculum" : "Oak National Academy"}
              </span>
            </div>
          </div>

          {/* Course List */}
          <div className="space-y-6 mb-8">
            {breakdown.map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between pb-6 border-b border-gray-100 last:border-b-0 animate-in slide-in-from-left duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 size={20} className="text-[#3F2171] flex-shrink-0" />
                    <h3 className="text-lg md:text-xl font-black text-gray-800 uppercase tracking-tight">
                      {getCourseFullName(item.course)}
                    </h3>
                  </div>

                  {getGradeForCourse(item.course) && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-8">
                      {getGradeForCourse(item.course)}
                    </p>
                  )}

                  {item.is_free && (
                    <div className="flex items-center gap-2 mt-2 ml-8">
                      <Award size={14} className="text-[#FFFF00]" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#FFFF00]">
                        Full Scholarship Applied
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-right ml-4">
                  {item.is_free ? (
                    <div>
                      <p className="text-gray-400 text-sm line-through mb-1">
                        {getOriginalPrice()}
                      </p>
                      <p className="text-2xl font-black text-[#3F2171] italic">FREE</p>
                    </div>
                  ) : (
                    <p className="text-2xl font-black text-gray-800 italic">
                      {currency === "NGN" ? "₦" : "£"}
                      {item.amount.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="pt-8 border-t-4 border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Total Monthly Investment
                </p>
                <p className="text-sm font-bold text-gray-500">
                  Billed monthly • Cancel anytime
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl md:text-5xl font-black text-[#3F2171] italic">
                  {currency === "NGN" ? "₦" : "£"}
                  {total.toLocaleString()}
                </p>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2">
                  Per Month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-br from-[#3F2171] to-[#2A1650] rounded-[2.5rem] p-8 md:p-10 text-white mb-32">
          <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tight mb-6">
            ✨ What's Included:
          </h3>
          <div className="space-y-3">
            {[
              "Unlimited access to all lessons & quizzes",
              "Weekly progress reports delivered to your email",
              "AI-powered tutor for 24/7 support",
              "Gamification with points, badges & rewards",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-[#FFFF00] flex-shrink-0" />
                <p className="text-sm font-bold">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-gray-100 p-6 md:p-8 z-[60] shadow-[0_-20px_50px_rgba(0,0,0,0.08)]">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleContinue}
              className="group flex items-center justify-center gap-4 bg-[#3F2171] text-white px-10 py-6 rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-black transition-all border-b-4 border-[#1E1038] active:translate-y-1 active:border-b-0 w-full"
            >
              Proceed to Start Your Free Trial
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
