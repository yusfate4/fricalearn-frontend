import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import { ArrowRight, ChevronLeft, BookOpen, AlertCircle } from "lucide-react";

export default function Step2GradeSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCourses, currency, curriculumRegion } = location.state || {};

  const [sharedGrade, setSharedGrade] = useState<number | null>(null);
  const [mathsGrade, setMathsGrade] = useState<number | null>(null);
  const [englishGrade, setEnglishGrade] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const includesMaths   = selectedCourses?.includes("maths");
  const includesEnglish = selectedCourses?.includes("english");
  const bothSelected    = includesMaths && includesEnglish;
  const isNigerian      = currency === "NGN" || curriculumRegion === "nigeria";

  // Skip step if no academic subjects
  if (!includesMaths && !includesEnglish) {
    navigate("/onboarding/step3", {
      state: { selectedCourses, currency, curriculumRegion, mathsGrade: null, englishGrade: null },
    });
    return null;
  }

  const ukGrades       = [1,2,3,4,5,6,7,8,9,10,11];
  const nigerianGrades = [1,2,3,4,5,6,7,8,9];
  const grades         = isNigerian ? nigerianGrades : ukGrades;

  const getGradeButtonLabel = (g: number) => isNigerian ? (g <= 6 ? `P${g}` : `J${g-6}`) : `Y${g}`;
  const getGradeFullLabel   = (g: number) => isNigerian ? (g <= 6 ? `Primary ${g}` : `JSS ${g-6}`) : `Year ${g}`;
  const getFrameworkLabel   = (g: number) => isNigerian ? (g <= 6 ? "PRIMARY" : "JSS") : (g<=2?"KS1":g<=6?"KS2":g<=9?"KS3":"KS4");
  const getFrameworkFull    = (g: number) => isNigerian ? (g <= 6 ? "Primary School" : "Junior Secondary") : (g<=2?"Key Stage 1":g<=6?"Key Stage 2":g<=9?"Key Stage 3":"Key Stage 4");

  const curriculumName = isNigerian ? "Nigerian Curriculum (NERDC)" : "UK National Curriculum";
  const gradePrompt    = bothSelected
    ? (isNigerian ? "What class is your child currently in?" : "What year group is your child currently in?")
    : (includesMaths
        ? (isNigerian ? "What class is your child in for Maths?" : "What year is your child in for Maths?")
        : (isNigerian ? "What class is your child in for English?" : "What year is your child in for English?"));

  const handleContinue = () => {
    if (bothSelected && !sharedGrade) {
      setError("Please select your child's grade"); return;
    }
    if (!bothSelected && includesMaths && !mathsGrade) {
      setError("Please select a grade for Mathematics"); return;
    }
    if (!bothSelected && includesEnglish && !englishGrade) {
      setError("Please select a grade for English"); return;
    }

    const finalMathsGrade   = bothSelected ? sharedGrade : mathsGrade;
    const finalEnglishGrade = bothSelected ? sharedGrade : englishGrade;

    navigate("/onboarding/step3", {
      state: { selectedCourses, currency, curriculumRegion, mathsGrade: finalMathsGrade, englishGrade: finalEnglishGrade },
    });
  };

  // ── Reusable grade grid ──────────────────────────────────
  const GradeGrid = ({ selected, onSelect, color }: {
    selected: number | null; onSelect: (g: number) => void; color: "blue" | "purple" | "green";
  }) => {
    const colors = {
      blue:   { active: "bg-blue-500 text-white shadow-2xl scale-110", info: "bg-blue-50 border-blue-100", infoText: "text-blue-600" },
      purple: { active: "bg-purple-500 text-white shadow-2xl scale-110", info: "bg-purple-50 border-purple-100", infoText: "text-purple-600" },
      green:  { active: "bg-[#3F2171] text-white shadow-2xl scale-110", info: "bg-green-50 border-green-100", infoText: "text-[#3F2171]" },
    }[color];

    return (
      <>
        {isNigerian ? (
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Primary School (Ages 6–11)</p>
              <div className="grid grid-cols-6 gap-3">
                {[1,2,3,4,5,6].map(g => (
                  <button key={g} onClick={() => { onSelect(g); setError(null); }}
                    className={`p-4 rounded-2xl font-black transition-all duration-300 ${selected === g ? colors.active : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-105"}`}>
                    <p className="text-xl font-black italic">P{g}</p>
                    <p className="text-[7px] font-black uppercase tracking-widest mt-1 opacity-60">Pry {g}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Junior Secondary (Ages 12–14)</p>
              <div className="grid grid-cols-3 gap-3">
                {[7,8,9].map(g => (
                  <button key={g} onClick={() => { onSelect(g); setError(null); }}
                    className={`p-4 rounded-2xl font-black transition-all duration-300 ${selected === g ? colors.active : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-105"}`}>
                    <p className="text-xl font-black italic">J{g-6}</p>
                    <p className="text-[7px] font-black uppercase tracking-widest mt-1 opacity-60">JSS {g-6}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {ukGrades.map(g => (
              <button key={g} onClick={() => { onSelect(g); setError(null); }}
                className={`p-5 rounded-2xl font-black transition-all duration-300 ${selected === g ? colors.active : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-105"}`}>
                <p className="text-xl font-black italic">Y{g}</p>
                <p className="text-[7px] font-black uppercase tracking-widest mt-1 opacity-60">{getFrameworkLabel(g)}</p>
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div className={`mt-6 p-4 ${colors.info} rounded-2xl border-2 animate-in fade-in duration-300`}>
            <p className={`text-xs font-black uppercase tracking-wide text-gray-700`}>
              Selected: <span className={colors.infoText}>{getGradeFullLabel(selected)}</span> • {getFrameworkFull(selected)}
            </p>
          </div>
        )}
      </>
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10 md:px-12 md:py-16 animate-in fade-in duration-700">
        <button onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#3F2171] transition-colors mb-8">
          <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#3F2171]/10"><ChevronLeft size={20}/></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back</span>
        </button>

        <div className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Step 2 of 4</p>
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight mb-4">
            Select <span className="text-[#3F2171]">Grade</span>
          </h1>
          <p className="text-gray-500 font-bold text-sm max-w-2xl">
            {isNigerian ? "Choose your child's current class" : "Choose your child's year group"} in the {curriculumName}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-6 rounded-2xl bg-red-50 border-2 border-red-100 flex items-center gap-4 animate-in slide-in-from-top duration-300">
            <AlertCircle className="text-red-500" size={24}/>
            <p className="text-sm font-black text-red-700 uppercase tracking-wide">{error}</p>
          </div>
        )}

        <div className="space-y-8 mb-32">
          {/* ── BOTH SELECTED: one shared grade card ── */}
          {bothSelected && (
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border-4 border-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-[#3F2171]/10 rounded-2xl">
                  <BookOpen size={32} className="text-[#3F2171]"/>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-800 italic uppercase tracking-tighter">
                    Maths & English
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                    {curriculumName} — Both subjects, same grade
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-500 mb-6">{gradePrompt}</p>
              <GradeGrid selected={sharedGrade} onSelect={setSharedGrade} color="green"/>
            </div>
          )}

          {/* ── ONLY MATHS ── */}
          {!bothSelected && includesMaths && (
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border-4 border-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <BookOpen size={32} className="text-blue-500"/>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-800 italic uppercase tracking-tighter">Mathematics</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{curriculumName}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-500 mb-6">{gradePrompt}</p>
              <GradeGrid selected={mathsGrade} onSelect={setMathsGrade} color="blue"/>
            </div>
          )}

          {/* ── ONLY ENGLISH ── */}
          {!bothSelected && includesEnglish && (
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border-4 border-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-purple-50 rounded-2xl">
                  <BookOpen size={32} className="text-purple-500"/>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-800 italic uppercase tracking-tighter">English</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{curriculumName}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-500 mb-6">{gradePrompt}</p>
              <GradeGrid selected={englishGrade} onSelect={setEnglishGrade} color="purple"/>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-gray-100 p-6 md:p-8 z-[60] shadow-[0_-20px_50px_rgba(0,0,0,0.08)]">
          <div className="max-w-4xl mx-auto">
            <button onClick={handleContinue}
              disabled={bothSelected ? !sharedGrade : (includesMaths && !mathsGrade) || (includesEnglish && !englishGrade)}
              className="group flex items-center justify-center gap-4 bg-[#3F2171] text-white px-10 py-6 rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-black transition-all border-b-4 border-[#1E1038] active:translate-y-1 active:border-b-0 w-full disabled:opacity-50 disabled:cursor-not-allowed">
              Continue to Pricing Summary
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
