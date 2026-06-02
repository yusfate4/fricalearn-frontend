import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import { ArrowRight, ChevronLeft, BookOpen, AlertCircle } from "lucide-react";

export default function Step2GradeSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCourses, currency, curriculumRegion } = location.state || {};

  const [mathsGrade, setMathsGrade] = useState<number | null>(null);
  const [englishGrade, setEnglishGrade] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const includesMaths = selectedCourses?.includes("maths");
  const includesEnglish = selectedCourses?.includes("english");
  const isNigerian = currency === "NGN" || curriculumRegion === "nigeria";

  // ── Grade systems ─────────────────────────────────────────
  // UK:      grades 1–11  → displayed as Year 1 … Year 11
  // Nigeria: grades 1–9   → displayed as Primary 1–6, JSS 1–3
  const ukGrades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const nigerianGrades = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const grades = isNigerian ? nigerianGrades : ukGrades;

  /** Short button label: Y3 | P3 | J1 */
  const getGradeButtonLabel = (grade: number): string => {
    if (!isNigerian) return `Y${grade}`;
    if (grade <= 6) return `P${grade}`;
    return `J${grade - 6}`;
  };

  /** Full grade label: Year 3 | Primary 3 | JSS 1 */
  const getGradeFullLabel = (grade: number): string => {
    if (!isNigerian) return `Year ${grade}`;
    if (grade <= 6) return `Primary ${grade}`;
    return `JSS ${grade - 6}`;
  };

  /** Framework sublabel: KS1 | PRIMARY | JSS */
  const getFrameworkLabel = (grade: number): string => {
    if (!isNigerian) {
      if (grade <= 2) return "KS1";
      if (grade <= 6) return "KS2";
      if (grade <= 9) return "KS3";
      return "KS4";
    }
    if (grade <= 6) return "PRIMARY";
    return "JSS";
  };

  /** Full framework name for the info box */
  const getFrameworkFullLabel = (grade: number): string => {
    if (!isNigerian) {
      if (grade <= 2) return "Key Stage 1";
      if (grade <= 6) return "Key Stage 2";
      if (grade <= 9) return "Key Stage 3";
      return "Key Stage 4";
    }
    if (grade <= 6) return "Primary School";
    return "Junior Secondary School";
  };

  const curriculumName = isNigerian
    ? "Nigerian Curriculum (NERDC)"
    : "UK National Curriculum";

  const gradePrompt = isNigerian
    ? "Select your child's current class:"
    : "Select your child's current year group:";

  // ── Validation ────────────────────────────────────────────
  const handleContinue = () => {
    if (includesMaths && !mathsGrade) {
      setError("Please select a grade for Mathematics");
      return;
    }
    if (includesEnglish && !englishGrade) {
      setError("Please select a grade for English");
      return;
    }

    navigate("/onboarding/step3", {
      state: {
        selectedCourses,
        currency,
        curriculumRegion,
        mathsGrade,
        englishGrade,
      },
    });
  };

  // Skip step if no academic subjects selected
  if (!includesMaths && !includesEnglish) {
    navigate("/onboarding/step3", {
      state: {
        selectedCourses,
        currency,
        curriculumRegion,
        mathsGrade: null,
        englishGrade: null,
      },
    });
    return null;
  }

  // ── Grade picker shared component ────────────────────────
  const GradePicker = ({
    subject,
    color,
    selectedGrade,
    onSelect,
  }: {
    subject: string;
    color: string;
    selectedGrade: number | null;
    onSelect: (g: number) => void;
  }) => {
    const colorMap: Record<string, { bg: string; active: string; info: string; border: string; text: string }> = {
      blue: {
        bg:     "bg-blue-50",
        active: "bg-blue-500 text-white shadow-2xl scale-110",
        info:   "bg-blue-50 border-blue-100",
        border: "border-blue-100",
        text:   "text-blue-500",
      },
      purple: {
        bg:     "bg-purple-50",
        active: "bg-purple-500 text-white shadow-2xl scale-110",
        info:   "bg-purple-50 border-purple-100",
        border: "border-purple-100",
        text:   "text-purple-500",
      },
    };
    const c = colorMap[color];

    return (
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border-4 border-white">
        <div className="flex items-center gap-4 mb-8">
          <div className={`p-4 ${c.bg} rounded-2xl`}>
            <BookOpen size={32} className={c.text} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 italic uppercase tracking-tighter">
              {subject}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
              {curriculumName}
            </p>
          </div>
        </div>

        <p className="text-sm font-bold text-gray-500 mb-6">{gradePrompt}</p>

        {/* Nigerian: two rows (Primary / JSS) */}
        {isNigerian ? (
          <div className="space-y-4">
            {/* Primary 1-6 */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">
                Primary School (Ages 6–11)
              </p>
              <div className="grid grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => { onSelect(grade); setError(null); }}
                    className={`p-4 rounded-2xl font-black transition-all duration-300 ${
                      selectedGrade === grade
                        ? c.active
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-105"
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-xl font-black italic">P{grade}</p>
                      <p className="text-[7px] font-black uppercase tracking-widest mt-1 opacity-60">
                        Pry {grade}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {/* JSS 1-3 */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">
                Junior Secondary School (Ages 12–14)
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[7, 8, 9].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => { onSelect(grade); setError(null); }}
                    className={`p-4 rounded-2xl font-black transition-all duration-300 ${
                      selectedGrade === grade
                        ? c.active
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-105"
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-xl font-black italic">J{grade - 6}</p>
                      <p className="text-[7px] font-black uppercase tracking-widest mt-1 opacity-60">
                        JSS {grade - 6}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* UK: single row Year 1-11 */
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
            {ukGrades.map((grade) => (
              <button
                key={grade}
                onClick={() => { onSelect(grade); setError(null); }}
                className={`p-5 rounded-2xl font-black transition-all duration-300 ${
                  selectedGrade === grade
                    ? c.active
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-105"
                }`}
              >
                <div className="text-center">
                  <p className="text-2xl font-black italic">Y{grade}</p>
                  <p className="text-[7px] font-black uppercase tracking-widest mt-1 opacity-60">
                    {getFrameworkLabel(grade)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Selection confirmation */}
        {selectedGrade && (
          <div className={`mt-6 p-4 ${c.info} rounded-2xl border-2 animate-in fade-in duration-300`}>
            <p className={`text-xs font-black uppercase tracking-wide text-gray-700`}>
              Selected:{" "}
              <span className={c.text}>
                {getGradeFullLabel(selectedGrade)}
              </span>{" "}
              • {getFrameworkFullLabel(selectedGrade)}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10 md:px-12 md:py-16 animate-in fade-in duration-700">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#2D5A27] transition-colors mb-8"
        >
          <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#2D5A27]/10">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back</span>
        </button>

        <div className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">
            Step 2 of 4
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight mb-4">
            Select <span className="text-[#2D5A27]">Grade</span>
          </h1>
          <p className="text-gray-500 font-bold text-sm md:text-base max-w-2xl">
            {isNigerian
              ? "Choose your child's current class in the Nigerian curriculum"
              : "Choose the appropriate year group in the UK National Curriculum"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-6 rounded-2xl bg-red-50 border-2 border-red-100 flex items-center gap-4 animate-in slide-in-from-top duration-300">
            <AlertCircle className="text-red-500" size={24} />
            <p className="text-sm font-black text-red-700 uppercase tracking-wide">{error}</p>
          </div>
        )}

        <div className="space-y-8 mb-32">
          {includesMaths && (
            <GradePicker
              subject="Mathematics"
              color="blue"
              selectedGrade={mathsGrade}
              onSelect={setMathsGrade}
            />
          )}
          {includesEnglish && (
            <GradePicker
              subject="English"
              color="purple"
              selectedGrade={englishGrade}
              onSelect={setEnglishGrade}
            />
          )}
        </div>

        {/* Continue Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-gray-100 p-6 md:p-8 z-[60] shadow-[0_-20px_50px_rgba(0,0,0,0.08)]">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleContinue}
              disabled={
                (includesMaths && !mathsGrade) ||
                (includesEnglish && !englishGrade)
              }
              className="group flex items-center justify-center gap-4 bg-[#2D5A27] text-white px-10 py-6 rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-black transition-all border-b-4 border-green-900 active:translate-y-1 active:border-b-0 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Pricing Summary
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
