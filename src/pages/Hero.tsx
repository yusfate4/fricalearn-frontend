import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaGraduationCap, FaBookOpen, FaGlobe } from "react-icons/fa";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-[#2A1650] min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #3F2171, transparent 70%)", transform: "translate(30%,-30%)" }}/>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #FFFF00, transparent 70%)", transform: "translate(-30%,30%)" }}/>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Copy */}
          <div>
            {/* 🎁 Free trial badge — the headline offer */}
            <div className="inline-flex items-center gap-3 bg-[#FFFF00] rounded-full pl-2 pr-5 py-2 mb-8 animate-in fade-in slide-in-from-bottom duration-500">
              <span className="bg-[#2A1650] text-[#FFFF00] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                New
              </span>
              <span className="text-[#2A1650] text-[11px] font-black uppercase tracking-widest">
                14-Day Free Trial — No Payment Needed
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-[0.95] mb-6">
              World-Class<br/>
              Education For<br/>
              <span className="text-[#FFFF00]">African Children.</span>
            </h1>

            <p className="text-white/60 font-medium text-base md:text-lg leading-relaxed max-w-xl mb-4">
              Try <strong className="text-white">Mathematics and English</strong> — UK and Nigerian
              curriculum aligned — <strong className="text-[#FFFF00]">free for 14 days</strong>.
              And Yoruba, Igbo &amp; Hausa language courses? <strong className="text-white">Free forever.</strong>
            </p>

            {/* Curriculum badges */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { icon: <FaGraduationCap/>, label: "UK Curriculum" },
                { icon: <FaBookOpen/>, label: "Nigerian Curriculum" },
                { icon: <FaGlobe/>, label: "Heritage Languages" },
              ].map((b) => (
                <span key={b.label} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/70 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl">
                  <span className="text-[#FFFF00]">{b.icon}</span> {b.label}
                </span>
              ))}
            </div>

            {/* CTAs — trial-first */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button onClick={() => navigate("/register")}
                className="bg-[#FFFF00] text-[#2A1650] px-10 py-6 rounded-[2rem] font-black text-base uppercase italic tracking-tight flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl border-b-4 border-yellow-600 active:translate-y-1 active:border-b-0">
                <FaPlay size={14}/> Start Free Trial
              </button>
              <button onClick={() => navigate("/register")}
                className="bg-white/5 border-2 border-white/15 text-white px-10 py-6 rounded-[2rem] font-black text-base uppercase italic tracking-tight hover:bg-white/10 transition-all flex items-center justify-center">
                🇳🇬 ₦ &nbsp;·&nbsp; 🇬🇧 £ &nbsp;Pay Your Way
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 max-w-md">
              {[
                { value: "3", label: "Languages Free" },
                { value: "97%", label: "Parent Rating" },
                { value: "100%", label: "Native Tutors" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-black text-white italic">{s.value}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Visual card stack */}
          <div className="relative hidden lg:block">
            <div className="bg-gradient-to-br from-[#3F2171] to-[#2A1650] rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
                style={{ background: "radial-gradient(circle,#FFFF00,transparent)", transform: "translate(30%,-30%)" }}/>
              <div className="relative z-10 text-center py-16">
                <span className="text-8xl block mb-6">🎓</span>
                <p className="text-white font-black text-2xl uppercase italic tracking-tight leading-tight">
                  Every child learns.<br/>
                  <span className="text-[#FFFF00]">Every heritage lives.</span>
                </p>
              </div>
            </div>

            {/* Floating stat cards */}
            <div className="absolute -top-6 -left-8 bg-white rounded-3xl px-7 py-5 shadow-2xl animate-in slide-in-from-left duration-700">
              <p className="text-3xl font-black text-[#3F2171] italic">3,000+</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Lessons Available</p>
            </div>
            <div className="absolute -bottom-6 -right-4 bg-white rounded-3xl px-7 py-5 shadow-2xl animate-in slide-in-from-right duration-700">
              <p className="text-3xl font-black text-[#FFFF00] italic">14 Days</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Free Trial</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
